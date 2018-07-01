twaver.network.interaction.SelectInteraction = function (network) {
    twaver.network.interaction.SelectInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.SelectInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown');
    },
    tearDown: function () {
        this.removeListener('mousedown');
        this.end();
    },
    handle_mousedown: function (e) {
        this._button = e.button;
        if (!this.network.isValidEvent(e) || this.network.isMovingElement() || this.network.isEditingElement()) {
            return;
        }
        if (e.shiftKey) {
            return;
        }
        var element = this.network.getElementAt(e);
        var sm = this.network.getSelectionModel();
        if (element) {
            if (_twaver.isCtrlDown(e)) {
                if (sm.contains(element)) {
                    sm.removeSelection(element);
                } else {
                    sm.appendSelection(element);
                }
            } else {
                if (!sm.contains(element)) {
                    sm.setSelection(element);
                }
            }
        } else {
            if (!_twaver.isCtrlDown(e)) {
                sm.clearSelection();
            }
            this.end(e);
            if (this.network.getLogicalPoint(e) && this.network.isRectSelectEnabled()) {
                this._handle_mousedown(e);
            }
        }
    },
    handle_mouseup: function (e) {
        this.end(e);
    },
    handle_mousemove: function (e) {
        if (this._button !== 0 || this.network.isMovingElement() || this.network.isEditingElement()) {
            this.end(e);
            return;
        }
        this._handle_mousemove(e);
        if (this.mark) {
            this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
        } else {
            this.mark = $html.createDiv();
            this.network.getTopDiv().appendChild(this.mark);
            this.network.setSelectingElement(true);
            this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
        }
        var rect = $math.getRect([this._startLogical, this._endLogical]);
        $html.setDiv(this.mark, rect,
            this.getIntersectMode() ? this.network.getSelectFillColor() : null,
            this.network.getSelectOutlineWidth(), this.network.getSelectOutlineColor());

    },
    end: function (e) {
        if (this._startLogical) {
            if (this.mark) {
                if (this._endLogical && this._startLogical.x !== this._endLogical.x && this._startLogical.y !== this._endLogical.y) {
                    var elements = this.network.getElementsAtRect(this.mark._viewRect, this.getIntersectMode(), this.network.getRectSelectFilter());
                    if (elements && elements.size() > 0) {
                        var sm = this.network.getSelectionModel();
                        var selections = sm.toSelection();
                        elements.forEach(function (element) {
                            if (sm.contains(element)) {
                                selections.remove(element);
                            } else {
                                selections.add(element);
                            }
                        }, this);
                        sm.setSelection(selections);
                    }
                    this.network.fireInteractionEvent({ kind: 'selectEnd', event: e });
                }
                var self = this;
                setTimeout(function () {
                    if (self.mark) {
                        self.network.getTopDiv().removeChild(self.mark);
                        self.mark = null;
                    }
                }, 0);
                this.network.setSelectingElement(false);
            }
            this._handle_mouseup(e);
        }
    },
    getIntersectMode: function () {
        if (this.network.getSelectMode() === 'intersect') {
            return true;
        }
        if (this.network.getSelectMode() === 'contain') {
            return false;
        }
        return this._startLogical.x > this._endLogical.x && this._startLogical.y > this._endLogical.y;
    }
});
