twaver.vector.interaction.CreateShapeLinkInteraction = function (network, typeOrLinkFunction) {
    twaver.vector.interaction.CreateShapeLinkInteraction.superClass.constructor.call(this, network);
    if (!typeOrLinkFunction) {
        typeOrLinkFunction = twaver.ShapeLink;
    }
    if (twaver.Util.isTypeOf(typeOrLinkFunction, twaver.ShapeLink)) {
        this.linkFunction = function (fromNode, toNode, points) {
            var link = new typeOrLinkFunction();
            if (link instanceof twaver.ShapeLink) {
                link.setFromNode(fromNode);
                link.setToNode(toNode);
                if (points) {
                	var zm = this.network.zoomManager;
                    link.setPoints(zm._getShapeLinkZoomPoints(points,true));
                }
            }
            return link;
        };
    } else {
        this.linkFunction = typeOrLinkFunction;
    }
};
_twaver.ext('twaver.vector.interaction.CreateShapeLinkInteraction', twaver.vector.interaction.CreateLinkInteraction, {
    clear: function () {
        this.points = null;
        twaver.vector.interaction.CreateShapeLinkInteraction.superClass.clear.call(this);
    },
    createLink: function () {
        return this.linkFunction(this.fromNode, this.toNode, this.points);
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        var point = this.network.getLogicalPoint2(e);
        if (!point) {
            return;
        }
        if (this.fromNode) {
            this.toNode = this.currentNode;
            if (this.toNode) {
                var shapeLink = this.createLink();
                if (shapeLink) {
                    this.network.addElementByInteraction(shapeLink);
                }
                this.clear();
            } else {
                if (!this.points) {
                    this.points = new twaver.List();
                }
                if (this.points.size() > 0) {
                    var lastPoint = this.points.get(this.points.size() - 1);
                    if (lastPoint.x === point.x && lastPoint.y === point.y) {
                        return;
                    }
                }
                this.points.add(point);
            }
        } else {
            this.fromNode = this.currentNode;
            this.points = null;
            this.currentNode = null;
            this.currentPoint = null;
        }
        this.repaint();
    },
    paintLine: function (ctx) {
        if (this.currentPoint) {
            var newPoints = new twaver.List();
            var np;
            np = this.convertPointFromView(this.getZoomNodeRectOrPoint(this.fromNode,true));
            newPoints.add(np, 0);
            if (this.points && this.points.size() > 0) {
                var size = this.points.size();
                for (var i = 0; i < size; i++) {
                    np = this.convertPointFromView(this.points.get(i));
                    newPoints.add(np);
                }
            }
            // np = this.convertPointFromView(this.currentPoint);
            np = this.currentPoint;
            newPoints.add(np);
            ctx.lineWidth = this.network.getEditLineWidth();
            ctx.strokeStyle = this.network.getEditLineColor();
            ctx.beginPath();
            $g.drawLinePoints(ctx, newPoints);
            ctx.stroke();
        }
    }
});
