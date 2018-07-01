twaver.canvas.interaction.SelectInteraction = function (network) {
    twaver.canvas.interaction.SelectInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.SelectInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mouseup');
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mouseup');
        this.end();
        this.network.removeMarker(this);
    },
    paint: function (ctx) {
        if (this.startPoint == null || this.endPoint == null) {
            return;
        }
        var sp = this.convertPointFromView(this.startPoint);
        var ep = this.convertPointFromView(this.endPoint);
        var sx = sp.x;
        var sy = sp.y;
        var ex = ep.x;
        var ey = ep.y;
        var rect = $math.getRect([{ x: sx, y: sy }, { x: ex, y: ey}]);
        if (rect != null) {
            ctx.beginPath();
            var lineWidth = this.network.getSelectOutlineWidth();
            var fillStyle = this.getIntersectMode() ? this.network.getSelectFillColor() : null;
            ctx.strokeStyle = this.network.getSelectOutlineColor();
            ctx.lineWidth = lineWidth;
            $CanvasUtil.rect(ctx, rect.x, rect.y, rect.width, rect.height, fillStyle, this.network.getSelectOutlineColor());
            ctx.closePath();
        }
    },
    handle_mousedown: function (e) {
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
            this.startPoint = this.network.getLogicalPoint(e);
            if (this.startPoint && this.network.isRectSelectEnabled()) {
                this.addListener('mousemove');
            }
        }
    },
    handle_mouseup: function (e) {
        this.end(e);
    },
    handle_mousemove: function (e) {
        if (this.network.isMovingElement() || this.network.isEditingElement()) {
            this.end(e);
            return;
        }
        var point = this.network.getLogicalPoint(e);
        if (!point) {
            return;
        }
        this.network.setSelectingElement(true);
        if (this.endPoint == null) {
            this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
        } else {
            this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
        }
        this.endPoint = point;
        this.repaint();
    },
    end: function (e) {
        if (this.startPoint) {
            if (this.endPoint && this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
                var rect = $math.getRect([this.startPoint, this.endPoint]);
                var elements = this.network.getElementsAtRect(rect, this.getIntersectMode(), this.network.getRectSelectFilter());
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
            this.network.setSelectingElement(false);
            this.removeListener('mousemove');
            this.startPoint = null;
            this.endPoint = null;
            this.repaint();
        }
    },
    getIntersectMode: function () {
        if (this.network.getSelectMode() === 'intersect') {
            return true;
        }
        if (this.network.getSelectMode() === 'contain') {
            return false;
        }
        return this.startPoint.x > this.endPoint.x && this.startPoint.y > this.endPoint.y;
    }
});
