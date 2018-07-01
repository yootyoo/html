twaver.network.interaction.CreateShapeNodeInteraction = function (network, typeOrShapeNodeFunction) {
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
    twaver.network.interaction.CreateShapeNodeInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.CreateShapeNodeInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove');
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove');
        this.clear();
    },
    clear: function () {
        this.network.setEditingElement(false);
        this.points = null;
        this.currentPoint = null;
        this.lastPoint = null;
        this.horizontal = false;
        this.vertical = false;
        if (this.mark) {
            this.network.getTopDiv().removeChild(this.mark);
            this.mark = null;
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
                setTimeout(function () { self.network.setEditingElement(false); }, 0);
            }
        } else {
            if (!this.network.isEditingElement()) {
                this.network.setEditingElement(true);
            }
            if (!this.points) {
                this.points = new $List();
            }
            if (this.points.size() > 0) {
                var lastPoint = this.points.get(this.points.size() - 1);
                if (lastPoint.x === point.x && lastPoint.y === point.y) {
                    return;
                }
            }
            this._handle_mousedown(e);
            if (this.points.size() > 0 && _twaver.isCtrlDown(e)) {
                if (this.horizontal) {
                    point.y = lastPoint.y;
                }
                if (this.vertical) {
                    point.x = lastPoint.x;
                }
                this.horizontal = false;
                this.vertical = false;
            }
            this.lastPoint = point;
            this.points.add(point);
            this.updateMark();
        }
    },
    handle_mousemove: function (e) {
        if (this.points) {
            this.currentPoint = this.network.getLogicalPoint(e);
            if (_twaver.isCtrlDown(e)) {
                var offsetX = this.currentPoint.x - this.lastPoint.x,
                    offsetY = this.currentPoint.y - this.lastPoint.y;
                this.horizontal = Math.abs(offsetX) >= Math.abs(offsetY);
                this.vertical = !this.horizontal;
            } else {
                this.horizontal = false;
                this.vertical = false;
            }
            if (this.horizontal) {
                this.currentPoint.y = this.lastPoint.y;
            }
            if (this.vertical) {
                this.currentPoint.x = this.lastPoint.x;
            }
            this.updateMark();
        }
    },
    updateMark: function (e) {
        if (this.points && this.points.size() > 0) {
            if (this.currentPoint) {
                if (!this.mark) {
                    this.mark = $html.createCanvas();
                    this.network.getTopDiv().appendChild(this.mark);
                }
                var newPoints = new $List(this.points);
                newPoints.add(this.currentPoint);
                var rect = $math.getRect(newPoints);
                var lineWidth = this.network.getEditLineWidth();
                _twaver.math.grow(rect, lineWidth, lineWidth);
                var g = $html.setCanvas(this.mark, rect);
                g.lineWidth = lineWidth;
                g.strokeStyle = this.network.getEditLineColor();
                g.beginPath();
                $g.drawLinePoints(g, newPoints);
                g.stroke();
            }
        }
    }
});
