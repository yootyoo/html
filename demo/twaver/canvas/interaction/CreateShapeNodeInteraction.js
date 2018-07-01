twaver.canvas.interaction.CreateShapeNodeInteraction = function (network, typeOrShapeNodeFunction) {
    if (!typeOrShapeNodeFunction) {
        typeOrShapeNodeFunction = twaver.ShapeNode;
    }
    if (twaver.Util.isTypeOf(typeOrShapeNodeFunction, twaver.ShapeNode)) {
        this.shapeNodeFunction = function (points) {
            var shapeNode = new typeOrShapeNodeFunction();
            if (shapeNode instanceof twaver.ShapeNode) {
                if (points) {
                    shapeNode.setPoints(points);
                }
            }
            return shapeNode;
        };
    } else {
        this.shapeNodeFunction = typeOrShapeNodeFunction;
    }
    twaver.canvas.interaction.CreateShapeNodeInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.CreateShapeNodeInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove');
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove');
        this.clear();
        this.network.removeMarker(this);
        this.network.setEditingElement(false);
    },
    clear: function () {
        this.points = null;
        this.currentPoint = null;
    },
    paint: function (ctx) {
        if (this.points && this.points.size() > 0) {
            if (this.currentPoint) {
                var newPoints = new twaver.List();
                var size = this.points.size();
                var np;
                for (var i = 0; i < size; i++) {
                    np = this.convertPointFromView(this.points.get(i));
                    newPoints.add(np);
                }
                np = this.convertPointFromView(this.currentPoint);
                newPoints.add(np);
                ctx.lineWidth = this.network.getEditLineWidth();
                ctx.strokeStyle = this.network.getEditLineColor();
                ctx.beginPath();
                $g.drawLinePoints(ctx, newPoints);
                ctx.stroke();
            }
        }
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        var point = this.network.getLogicalPoint(e);
        if (!point) {
            return;
        }
        if (e.detail === 2) {
            if (this.points) {
                var shapeNode = this.shapeNodeFunction(this.points);
                this.network.addElementByInteraction(shapeNode);
                this.clear();
                var self = this;
                setTimeout(function () {
                    self.network.setEditingElement(false);
                }, 0);
            }
        } else {
            if (!this.network.isEditingElement()) {
                this.network.setEditingElement(true);
            }
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
        this.repaint();
    },
    handle_mousemove: function (e) {
        if (this.points) {
            this.currentPoint = this.network.getLogicalPoint(e);
            this.repaint();
        }
    }
});
