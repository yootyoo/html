twaver.network.interaction.MoveInteraction = function(network, lazyMode) {
	this.lazyMode = lazyMode;
	this.xoffset = 0;
	this.yoffset = 0;
	twaver.network.interaction.MoveInteraction.superClass.constructor.call( this, network);
	this.currentKeyEvent = null;
};
_twaver.ext('twaver.network.interaction.MoveInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'keydown');
    },
    tearDown: function () {
        this.removeListener('mousedown', 'keydown');
        this.end();
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
        return this._startLogical && this.currentKeyEvent != null
				&& this.currentKeyEvent.keyCode === 80;
    },

    parentProcess: function (e, released) {
        var rect = null;
        if (this.parent != null) {
            rect = this.network.getElementUI(this.parent).getViewRect();
            this.parent = null;
        }
        var self = this;
        e = this.network.getLogicalPoint(e);

        if (!released && this.isParenting()) {
            var hitRect = {};
            hitRect.x = e.x - 1;
            hitRect.y = e.y - 1;
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

        }
        if (this.parent != null) {
            rect = this.network.getElementUI(this.parent).getViewRect();
        }
        if (rect != null && !released) {
            if (!this.parentMark) {
                this.parentMark = _twaver.html.createDiv();
                this.network.getTopDiv().appendChild(this.parentMark);
            }
            _twaver.html.setDiv(this.parentMark, rect, this.network
							.isLazyMoveFill() ? this.network
							.getLazyMoveFillColor() : null,
					this.network.getLazyMoveOutlineWidth(),
					this.network.getLazyMoveOutlineColor());
        } else {
            if (this.parentMark) {
                this.network.getTopDiv().removeChild(this.parentMark);
                this.parentMark = null;
            }
        }
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (this.network.isSelectingElement()
				|| this.network.isEditingElement()) {
            return;
        }
        var element = this.network.getElementAt(e);
        if (!this.network.isMovable(element)) {
            return;
        }
        this.end(e);
        this._handle_mousedown(e);
    },
    handle_mouseup: function (e) {
        this.end(e);
    },
    handle_mousemove: function (e) {
        if (this.network.isSelectingElement()
				|| this.network.isEditingElement()
				|| !this.network.hasMovableSelectedElements()
				|| !this._startLogical) {
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
                    event: e
                });
            } else {
                this.mark = $html.createDiv();

                var rect;
                this.network.getMovableSelectedElements().forEach(
						function (element) {
						    var ui = this.getElementUI(element);
						    if (ui) {
						        rect = $math.unionRect(rect, ui
												.getViewRect());
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
                    event: e
                });
            }
            this.mark.style.left = this.xoffset + this.mark._viewRect.x
					+ "px";
            this.mark.style.top = this.yoffset + this.mark._viewRect.y
					+ "px";
        } else {
            this._startLogical = this._endLogical;
            this._startClient = $html.getClientPoint(e);
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
    },
    end: function (e) {
        if (this._startLogical) {
            if (this.lazyMode) {
                if (this.mark) {
                    var self = this;
                    var f = function () {
                        self.network.fireInteractionEvent({
                            kind: 'lazyMoveEnd',
                            event: e
                        });
                        if (self.mark) {
                            self.network.getTopDiv()
									.removeChild(self.mark);
                            self.mark = null;
                            self.network.setMovingElement(false);
                        }
                    };
                    this.network.moveSelectedElements(this.xoffset,
							this.yoffset, this.network
									.isLazyMoveAnimate(), f);
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
            this.parentProcess(e, true)
            this._handle_mouseup(e);
        }
    }
});
