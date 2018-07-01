twaver.network.interaction.CreateLinkInteraction = function (network, typeOrLinkFunction) {
    if (!typeOrLinkFunction) {
        typeOrLinkFunction = twaver.Link;
    }
    if (twaver.Util.isTypeOf(typeOrLinkFunction, twaver.Link)) {
        this.linkFunction = function (fromNode, toNode) {
            var link = new typeOrLinkFunction();
            if (link instanceof twaver.Link) {
                link.setFromNode(fromNode);
                link.setToNode(toNode);
            }
            return link;
        };
    } else {
        this.linkFunction = typeOrLinkFunction;
    }
    twaver.network.interaction.CreateLinkInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.CreateLinkInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove');
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove');
        this.clear();
    },
    clear: function () {
        var self = this;
        setTimeout(function () {
            if (self._fromRectangle) {
                self.network.getTopDiv().removeChild(self._fromRectangle);
                self._fromRectangle = null;
            }
            if (self._currentRectangle) {
                self.network.getTopDiv().removeChild(self._currentRectangle);
                self._currentRectangle = null;
            }
            if (self._line) {
                self.network.getTopDiv().removeChild(self._line);
                self._line = null;
            }
        });
        this.currentPoint = null;
        this.currentNode = null;
        this.fromNode = null;
        this.toNode = null;
    },
    createLink: function () {
        return this.linkFunction(this.fromNode, this.toNode);
    },
    handle_mousedown: function (e) {
        if (!this.network.isValidEvent(e)) {
            return;
        }
        if (this.fromNode) {
            this.toNode = this.currentNode;
            if (this.toNode) {
                var link = this.createLink();
                if (link) {
                    this.network.addElementByInteraction(link);
                }
            }
            this.clear();
        } else {
            this.fromNode = this.currentNode;
            this.currentNode = null;
            this.currentPoint = null;
            this.updateMark();
        }
    },
    handle_mousemove: function (e) {
        var point = this.network.getLogicalPoint(e);
        if (!point) {
            return;
        }
        if (this.network.isMovingElement() || this.network.isEditingElement()) {
            this.clear();
            return;
        }
        var node = null;
        if (this.fromNode) {
            this.currentNode = this.getToNode(e);
            this.currentPoint = point;
            this.updateMark();
        } else {
            node = this.getFromNode(e);
            if (this.currentNode !== node) {
                this.currentNode = node;
                this.updateMark();
            }
        }
    },
    getFromNode: function (e) {
        return this.getNode(e);
    },
    getToNode: function (e) {
        return this.getNode(e);
    },
    getNode: function (e) {
        var node = this.network.getElementAt(e);
        if (node instanceof $Node && this.network.isLinkable(node)) {
            return node;
        }
        return null;
    },
    updateMark: function () {
        var ui;
        if (this.fromNode && !this._fromRectangle && this._currentRectangle) {
            this._fromRectangle = this._currentRectangle;
            this._currentRectangle = null;
        }
        if (!this.fromNode && this._fromRectangle) {
            this.network.getTopDiv().removeChild(this._fromRectangle);
            this._fromRectangle = null;
        }

        if (this.currentNode && !this._currentRectangle) {
            ui = this.network.getElementUI(this.currentNode);
            this._currentRectangle = $html.createDiv();
            this.network.getTopDiv().appendChild(this._currentRectangle);
            $html.setDiv(this._currentRectangle, ui._viewRect, null,
                this.network.getEditLineWidth(), this.network.getEditLineColor());
        }
        if (!this.currentNode && this._currentRectangle) {
            this.network.getTopDiv().removeChild(this._currentRectangle);
            this._currentRectangle = null;
        }

        this.updateLine();
    },
    updateLine: function () {
        if (this.currentPoint) {
            var center = this.fromNode.getCenterLocation();
            var x1 = center.x, y1 = center.y;
            var x2 = this.currentPoint.x, y2 = this.currentPoint.y;
            if (!this._line) {
                this._line = $html.createCanvas();
                this.network.getTopDiv().appendChild(this._line);
            }
            var g = $html.setCanvas(this._line, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2));
            g.lineWidth = this.network.getEditLineWidth();
            g.strokeStyle = this.network.getEditLineColor();
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
            g.stroke();
        } else {
            if (this._line) {
                this.network.getTopDiv().removeChild(this._line);
                this._line = null;
            }
        }
    }
});
