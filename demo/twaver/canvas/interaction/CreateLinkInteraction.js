twaver.canvas.interaction.CreateLinkInteraction = function (network, typeOrLinkFunction) {
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
    twaver.canvas.interaction.CreateLinkInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.CreateLinkInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove');
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove');
        this.clear();
        this.network.removeMarker(this);
    },
    paint: function (ctx) {
        ctx.beginPath();
        var rect;
        var r;
        ctx.lineWidth = this.network.getEditLineWidth();
        var lineColor = this.network.getEditLineColor();
        if (this.currentNode && this.currentNode !== this.fromNode) {
            rect = this.network.getElementUI(this.currentNode).getViewRect();
            r = this.convertFromUIToMarkerRect(rect, 0, 0);
            $CanvasUtil.rect(ctx, r.x, r.y, r.width, r.height, null, lineColor);
        }
        if (this.fromNode) {
            rect = this.network.getElementUI(this.fromNode).getViewRect();
            r = this.convertFromUIToMarkerRect(rect, 0, 0);
            $CanvasUtil.rect(ctx, r.x, r.y, r.width, r.height, null, lineColor);
        }
        if (this.currentPoint) {
            this.paintLine(ctx);
        }
        ctx.closePath();
    },
    paintLine: function (ctx) {
        var lineColor = this.network.getEditLineColor();
        var center = this.convertPointFromView(this.fromNode.getCenterLocation());
        var x1 = center.x, y1 = center.y;
        var x2 = this.currentPoint.x, y2 = this.currentPoint.y;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    clear: function () {
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
            this.repaint();
        }
    },
    handle_mousemove: function (e) {
        var point = this.getMarkerPoint(e);
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
            this.repaint();
        } else {
            node = this.getFromNode(e);
            if (this.currentNode !== node) {
                this.currentNode = node;
                this.repaint();
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
    }
});
