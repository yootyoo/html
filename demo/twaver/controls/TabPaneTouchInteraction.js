twaver.controls.TabPaneTouchInteraction = function (tabPane) {
    this.tabPane = tabPane;
    this.view = tabPane.getTabDiv();

    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.controls.TabPaneTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (this.movableDiv) {
            this.handleTouchend(e);
            return;
        }
        this.resizeTab = e.target._resizeTab;
        if (!this.resizeTab) {
            this.movableDiv = this.getMovableDivAt(e);
        }
        this.lastX = this.getX(e);
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
    },
    handleTouchmove: function (e) {
        if (this.lastX == null) {
            return;
        }
        // resize tab
        if (this.resizeTab) {
            var x = this.getX(e);
            if (this.stopX != null) {
                if (x < this.stopX) {
                    return;
                } else {
                    delete this.stopX;
                }
            }
            var w = this.resizeTab.getWidth() + (x - this.lastX);
            if (w < 0) {
                w = 0;
                this.stopX = x;
            }

            this.resizeTab.setWidth(w);
            this.lastX = x;
        }
        // move tab
        else if (this.movableDiv) {
            var x = this.getX(e);
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
    handleTouchend: function (e) {
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
            var tab = e.target._closeTab
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
        $html.removeEventListener('touchmove', this.view, this);
        $html.removeEventListener('touchend', this.view, this);
    },
    clear: function () {
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
        var x = this.getX(e);
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
