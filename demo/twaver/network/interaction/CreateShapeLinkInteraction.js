twaver.network.interaction.CreateShapeLinkInteraction = function (network, typeOrLinkFunction) {
    twaver.network.interaction.CreateShapeLinkInteraction.superClass.constructor.call(this, network);
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
                    link.setPoints(points);
                }
            }
            return link;
        };
    } else {
        this.linkFunction = typeOrLinkFunction;
    }
};
_twaver.ext('twaver.network.interaction.CreateShapeLinkInteraction', twaver.network.interaction.CreateLinkInteraction, {
    clear: function () {
        this.network.setEditingElement(false);
        this.points = null;
        if (this.polyline) {
            this.network.getTopDiv().removeChild(this.polyline);
            this.polyline = null;
        }
        twaver.network.interaction.CreateShapeLinkInteraction.superClass.clear.call(this);
    },
    createLink: function () {
        return this.linkFunction(this.fromNode, this.toNode, this.points);
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        var point = this.network.getLogicalPoint(e);
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
                    this.points = new $List();
                }
                if (this.points.size() > 0) {
                    var lastPoint = this.points.get(this.points.size() - 1);
                    if (lastPoint.x === point.x && lastPoint.y === point.y) {
                        return;
                    }
                }
                this.points.add(point);
                this.updateMark();
            }
        } else {
            this.fromNode = this.currentNode;
            if (this.fromNode) {
                if (!this.polyline) {
                    this.polyline = $html.createCanvas();
                    this.network.getTopDiv().appendChild(this.polyline);
                }
            }
            this.points = null;
            this.currentNode = null;
            this.currentPoint = null;
            this.updateMark();
        }
    },
    updateLine: function () {
        if (this.currentPoint) {
            if (this.polyline) {
                var newPoints = new $List(this.points);
                newPoints.add(this.fromNode.getCenterLocation(), 0);
                newPoints.add(this.currentPoint);
                var rect = $math.getRect(newPoints);
                var g = $html.setCanvas(this.polyline, rect);
                g.lineWidth = this.network.getEditLineWidth();
                g.strokeStyle = this.network.getEditLineColor();
                g.beginPath();
                $g.drawLinePoints(g, newPoints);
                g.stroke();
            }
        }
    }
});
