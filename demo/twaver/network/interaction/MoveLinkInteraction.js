twaver.network.interaction.MoveLinkInteraction = function(network, lazyMode) {
	twaver.network.interaction.MoveLinkInteraction.superClass.constructor.call(this, network);
	//this.lazyMode = lazyMode;
	this.xoffset = 0;
	this.yoffset = 0;
};
_twaver.ext('twaver.network.interaction.MoveLinkInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown');
        this.oldCursor = this.network.getView().style.cursor;
    },
    tearDown: function () {
        this.removeListener('mousedown'/*, 'mousemove'*/);
        this.network.getView().style.cursor = this.oldCursor;
        this.end();
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (this.network.isSelectingElement() || this.network.isEditingElement()) {
            return;
        }
        var element = this.network.getElementAt(e);
        if (!(element instanceof twaver.Link)) {
            return;
        }
        this.element = element;
        this.end(e);
        this._handle_mousedown(e);
    },
    handle_mouseup: function (e) {
        this.end(e);
    },
    handle_mousemove: function (e) {
        if (!this._startLogical
                || this.network.isSelectingElement()
				|| this.network.isEditingElement()) {
            this.end(e);
            return;
        }
        this._handle_mousemove(e);

        this.xoffset = this._endLogical.x - this._startLogical.x;
        this.yoffset = this._endLogical.y - this._startLogical.y;

        if (this.lazyMode) {
            if (this.mark) {
                this.network.fireInteractionEvent({
                    kind: 'lazyMoveBetween',
                    event: e,
                    element: this.element
                });
            } else {
                this.mark = $html.createCanvas();

                var rect;
                this.network.getMovableSelectedElements().forEach(
						function (element) {
						    var ui = this.getElementUI(element);
						    if (ui) {
						        rect = $math.unionRect(rect, ui.getViewRect());
						    }
						}, this.network);

                this.network.getTopDiv().appendChild(this.mark);
                this.network.setMovingElement(true);

                $html.setDiv(this.mark, rect, this.network
								.isLazyMoveFill() ? this.network
								.getLazyMoveFillColor() : null,
						this.network.getLazyMoveOutlineWidth(),
						this.network.getLazyMoveOutlineColor());

                this.network.fireInteractionEvent({
                    kind: 'lazyMoveStart',
                    event: e,
                    element: this.element
                });
            }
            this.mark.style.left = this.xoffset + this.mark._viewRect.x + "px";
            this.mark.style.top = this.yoffset + this.mark._viewRect.y + "px";
        } else {
            var elements = new twaver.List([this.element.getFromNode(), this.element.getToNode()]);
            twaver.Util.moveElements(elements, this.xoffset, this.yoffset);
            this._startLogical = this._endLogical;
            this._startClient = $html.getClientPoint(e);
            if (this.network.isMovingElement()) {
                this.network.fireInteractionEvent({
                    kind: 'liveMoveBetween',
                    event: e,
                    element: this.element
                });
            } else {
                this.network.setMovingElement(true);
                this.network.fireInteractionEvent({
                    kind: 'liveMoveStart',
                    event: e,
                    element: this.element
                });
            }
        }
    },
    end: function (e) {
        if (this._startLogical) {
            if (this.lazyMode) {
                if (this.mark) {
                    var self = this;
                    var f = function () {
                        self.network.fireInteractionEvent({
                            kind: 'lazyMoveEnd',
                            event: e,
                            element: this.element
                        });
                        if (self.mark) {
                            self.network.getTopDiv().removeChild(self.mark);
                            self.mark = null;
                            self.network.setMovingElement(false);
                        }
                    };
                    var elements = new twaver.List([this.element.getFromNode(), this.element.getToNode()]);
                    twaver.Util.moveElements(elements, this.xoffset, this.yoffset, this.network.isLazyMoveAnimate(), f);
                }
            } else {
                if (this.network.isMovingElement()) {
                    this.network.setMovingElement(false);
                    this.network.fireInteractionEvent({
                        kind: 'liveMoveEnd',
                        event: e,
                        element: this.element
                    });

                }
            }
            this._handle_mouseup(e);
        delete this.element;
        }
    }
});
