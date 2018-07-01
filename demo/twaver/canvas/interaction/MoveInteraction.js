twaver.canvas.interaction.MoveInteraction = function (network, lazyMode) {
    this.lazyMode = lazyMode;
    twaver.canvas.interaction.MoveInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.MoveInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mouseup', 'keydown', 'mouseout');
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mouseup', 'keydown', 'mouseout');
        this.end();
        this.network.removeMarker(this);
    },
    handle_keydown: function (e) {
        this.currentKeyEvent = e;
        this.addListener('keyup');
    },

    handle_keyup: function (e) {
        this.currentKeyEvent = null;
        this.removeListener('keyup');
    },
    isParenting: function () {
        return this.pressPoint && this.currentKeyEvent != null
						&& this.currentKeyEvent.keyCode === 80;
    },
    parentProcess: function (e, released) {
        var rect = null;
        this.parent = null;
        var self = this;
        if (!released && this.isParenting()) {
            var hitRect = {};
            var p = this.network.getLogicalPoint(e);
            hitRect.x = p.x - 1;
            hitRect.y = p.y - 1;
            hitRect.width = 2;
            hitRect.height = 2;

            var elements = this.network
							.getElementsAtRect(hitRect, true);
            if (elements && elements.size() > 0) {
                var size = elements.size();
                for (var i = 0; i < size; i++) {
                    var element = elements.get(i);
                    if (!self.network.getElementBox()
										.getSelectionModel().contains(element)) {
                        self.parent = element;
                        break;
                    }
                }
            }

        } else {
            this.parent = null;
        }
        if (this.parent != null) {
            rect = this.network.getElementUI(this.parent).getViewRect();
        }
        if (rect != null && !released) {
            this.parentRect = rect;
        } else {
            this.parentRect = null;
        }
    },
    paint: function (ctx) {
        if (this.lazyMode) {
            if (this.pressPoint == null || this.dragPoint == null) {
                return;
            }
            ctx.beginPath();
            var xoff = this.dragPoint.x - this.pressPoint.x
            var yoff = this.dragPoint.y - this.pressPoint.y
            var list = this.network.getMovableSelectedElements();
            var size = list.size();

            var fillColor = this.network.isLazyMoveFill() ? this.network.getLazyMoveFillColor() : null;
            var lineWidth = this.network.getLazyMoveOutlineWidth();
            var strokeColor = this.network.getLazyMoveOutlineColor();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.fillStyle = fillColor;
            for (var i = 0; i < size; i++) {
                var n = list.get(i);
                var ui = this.network.getElementUI(n);
                if (ui) {
                    var vr = this.convertFromUIToMarkerRect(ui.getViewRect(), xoff, yoff);
                    $CanvasUtil.rect(ctx, vr.x, vr.y, vr.width, vr.height);
                }
            }
            ctx.fill();
            ctx.stroke();
        }
        if (this.parentRect) {
            ctx.beginPath();
            var fillColor = this.network.isLazyMoveFill() ? this.network.getLazyMoveFillColor() : null;
            var lineWidth = this.network.getLazyMoveOutlineWidth();
            var strokeColor = this.network.getLazyMoveOutlineColor();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.fillStyle = fillColor;
            var vr = this.parentRect;
            $CanvasUtil.rect(ctx, vr.x, vr.y, vr.width, vr.height);
            ctx.fill();
            ctx.stroke();
        }
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (!this.network.isValidEvent(e) || this.network.isSelectingElement() || this.network.isEditingElement()) {
            return;
        }
        var element = this.network.getElementAt(e);
        if (!this.network.isMovable(element)) {
            return;
        }
        this.end(e);
        this.lastPoint = this.network.getLogicalPoint(e);
        if (this.lazyMode) {
            this.pressPoint = this.lastPoint;
        }
        if (this.lastPoint) {
            this.addListener('mousemove');
        }
    },
    handle_mouseup: function (e) {
        this.end(e);
    },
    handle_mouseout: function (e) {
        this.end(e);
    },
    handle_mousemove: function (e) {
        if (this.network.isSelectingElement() || this.network.isEditingElement() || !this.network.hasMovableSelectedElements()) {
            this.end(e);
            return;
        }
        var newPoint = this.network.getLogicalPoint(e);
        if (!newPoint) {
            return;
        }
        if(!this.lastPoint) {
            return;
        }
        this.xoffset = newPoint.x - this.lastPoint.x;
        this.yoffset = newPoint.y - this.lastPoint.y;
        if (Math.abs(this.xoffset) < 1 && Math.abs(this.yoffset) < 1) {
            return;
        }

        if (this.lazyMode) {
            if (this.dragPoint == null) {
                this.network.fireInteractionEvent({
                    kind: 'lazyMoveStart',
                    event: e
                });
                this.network.setMovingElement(true);
            } else {
                this.network.fireInteractionEvent({
                    kind: 'lazyMoveBetween',
                    event: e
                });
            }
        } else {
            this.lastPoint = newPoint;
            if (this.network.isMovingElement()) {
                this.network.fireInteractionEvent({
                    kind: 'liveMoveBetween',
                    event: e
                });
            } else {
                this.network.setMovingElement(true);
                this.network.fireInteractionEvent({
                    kind: 'liveMoveStart',
                    event: e
                });
            }
            this.network.moveSelectedElements(this.xoffset, this.yoffset);
        }
        this.parentProcess(e, false);
        if (this.lazyMode) {
            this.dragPoint = newPoint;
        }
        if (this.lazyMode || this.isParenting()) {
            this.repaint();
        }
    },
    end: function (e) {
        if (this.lazyMode) {
            if (this.dragPoint != null && this.pressPoint != null) {
                var self = this;
                var f = function () {
                    self.network.fireInteractionEvent({
                        kind: 'lazyMoveEnd',
                        event: e
                    });
                    self.network.setMovingElement(false);
                };
                var xoff = this.dragPoint.x - this.pressPoint.x;
                var yoff = this.dragPoint.y - this.pressPoint.y;
                this.network.moveSelectedElements(xoff, yoff, this.network.isLazyMoveAnimate(), f);
            }
        } else {
            if (this.network.isMovingElement()) {
                this.network.setMovingElement(false);
                this.network.fireInteractionEvent({
                    kind: 'liveMoveEnd',
                    event: e
                });
            }
        }
        if (this.isParenting()) {
            if (this.parent == null) {
                this.parent = this.network.getCurrentSubNetwork();
            }
            var self = this;
            this.network.getMovableSelectedElements().forEach(
			    function (element) {
			        element.setParent(self.parent);
			    }, this.network);
        }
        this.parentProcess(e, true);
        if (this.isParenting()) {
            this.repaint();
        }
        this.network.invalidateCanvasSize();
        this.removeListener('mousemove');
        this.lastPoint = null;
        this.dragPoint = null;
        this.pressPoint = null;
    }
});
