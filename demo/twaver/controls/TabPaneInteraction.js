twaver.controls.TabPaneInteraction = function (tabPane) {
    this.tabPane = tabPane;
    this.view = tabPane.getTabDiv();

    var self = this;
    this.view.addEventListener('mousedown', function (e) {
        self.handleMouseDown(e);
    }, false);
    this.view.addEventListener('mousemove', function (e) {
        self.handleMouseMove(e);
    }, false);
};
_twaver.ext('twaver.controls.TabPaneInteraction', Object, {
    handleMouseDown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (this.movableDiv) {
            this.handleMouseUp(e);
            return;
        }
        this.resizeTab = e.target._resizeTab;
        if (!this.resizeTab) {
            this.movableDiv = this.getMovableDivAt(e);
        }
        this.changeCursor(e);
        this.lastX = this.getX(e);
        this._startClient = $html.getClientPoint(e);
        this._startLogicalX = this.lastX;
        $html.handle_mousedown(this, e);
    },
    changeCursor: function (e) {
        var cursor = ''
        if (e.target._resizeTab) {
            cursor = 'ew-resize';
        }
        else {
            var tab = this.getTabAt(e);
            if (tab && (!tab.isDisabled() || tab.isMovable())) {
                cursor = 'pointer';
            }
        }
        this.view.style.cursor = cursor;
    },
    handleMouseMove: function (e) {
        if (this.lastX == null) {
            this.changeCursor(e);
            return;
        }
        if ($html.target !== this) {
            return;
        }
        var x = this._startLogicalX + e.clientX - this._startClient.x;
        // resize tab
        if (this.resizeTab) {
            if (this.stopX != null) {
                if (x < this.stopX) {
                    return;
                } else {
                    delete this.stopX;
                }
            }
            var w = this.resizeTab.getWidth() + (x - this.lastX);
            if (w < 10) {
                w = 10;
                this.stopX = x;
            }

            this.resizeTab.setWidth(w);
            this.lastX = x;
        }
        // move tab
        else if (this.movableDiv) {
            var offset = x - this.lastX;

            if (!this.cloneDiv) {
                if (Math.abs(offset) < 3) {
                    return;
                }
                this.cloneDiv = this.movableDiv.cloneNode(true);
                this.cloneDiv._x = this.movableDiv._x;
                this.cloneDiv.style.background = this.tabPane.getMoveBackground();

                this.insertDiv = $html.createDiv();
                this.insertDiv.style.width = '1px';
                this.insertDiv.style.height = this.cloneDiv.style.height;
                this.insertDiv.style.background = this.tabPane.getInsertBackground();

                this.movableDiv.parentNode.appendChild(this.cloneDiv);
                this.movableDiv.parentNode.appendChild(this.insertDiv);
            }


            var left = this.cloneDiv._x + offset;
            this.cloneDiv.style.left = left + 'px';
            this.cloneDiv._x = left;
            this.lastX = x;

            this.tabInfo = this.getTabInfoAt(e);
            if (this.tabInfo) {
                this.insertDiv.style.left = this.tabInfo.position;
            }
        }
    },
    handleMouseUp: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (this.resizeTab) {
            // do nothing
        }
        else if (this.movableDiv && this.tabInfo) {
            var tab = this.movableDiv._tab;
            var index = this.tabInfo.index;
            this.tabPane.getTabBox().moveTo(tab, index);
        }
        else {
            // close tab
            var box = this.tabPane.getTabBox();
            var tab = e.target._closeTab;
            if (tab) {
                // select next tab on close
                if (this.tabPane.isSelectNextOnClose() && this.tabPane.getCurrentTab() === tab) {
                    var roots = box.getRoots();
                    var index = roots.indexOf(tab);
                    box.remove(tab);
                    if (roots.size() > 0) {
                        if (index >= roots.size()) {
                            index = roots.size() - 1;
                        }
                        box.getSelectionModel().setSelection(roots.get(index));
                    }
                } else {
                    box.remove(tab);
                }
            } else {
                // select tab
                var tab = this.getTabAt(e);
                if (tab && !tab.isDisabled()) {
                    box.getSelectionModel().setSelection(tab);
                }
            }
        }
        this.clear();
    },
    clear: function () {
        this.view.style.cursor = '';
        if (this.cloneDiv && this.movableDiv) {
            this.movableDiv.parentNode.removeChild(this.cloneDiv);
        }
        if (this.insertDiv && this.movableDiv) {
            this.movableDiv.parentNode.removeChild(this.insertDiv);
        }
        delete this.movableDiv;
        delete this.tabInfo;
        delete this.insertDiv;
        delete this.cloneDiv;
        delete this.resizeTab;
        delete this.stopX;
        delete this.lastX;
        delete this._startLogicalX;
        delete this._startClient;
    },
    getTabAt: function (e) {
        e = e.target;
        var tab;
        while (e && e !== this.view && !(tab = e._tab)) {
            e = e.parentNode;
        }
        return tab;
    },
    getMovableDivAt: function (e) {
        e = e.target;
        var tab;
        while (e && e !== this.view && !(tab = e._tab)) {
            e = e.parentNode;
        }
        if (tab && tab.isMovable()) {
            return e;
        }
        return null;
    },
    getX: function (e) {
        var p = $html.getLogicalPoint(this.view, e);
        return p ? p.x : null;
    },
    getTabInfoAt: function (e) {
        var x = this._startLogicalX + e.clientX - this._startClient.x;
        var tabs = this.tabPane.getTabBox().getRoots();
        var count = tabs.size();
        var sumWidth = 0;
        var meetMovingTab = false;
        for (var i = 0; i < count; i++) {
            var tab = tabs.get(i);
            if (tab === this.movableDiv._tab) {
                meetMovingTab = true;
            }
            if (tab.isVisible()) {
                var width = tab.getWidth();
                if (width <= 0) {
                    continue;
                }
                if (x >= sumWidth && x <= sumWidth + width) {
                    var isFront = x < sumWidth + width / 2;
                    if (meetMovingTab &&
                        !(tab === this.movableDiv._tab && isFront)) {
                        i--;
                    }
                    var index = isFront ? Math.max(0, i) : Math.min(i + 1, count);
                    var position = isFront ? sumWidth : sumWidth + width;
                    position = Math.max(0, position - 1);
                    return {
                        index: index,
                        tab: tab,
                        position: position + 'px'
                    };
                }
                sumWidth += width;
            }
        }
        return this.tabInfo;
    }
});
