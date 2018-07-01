twaver.network.ShapeLinkUI = function (network, element) {
    twaver.network.ShapeLinkUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.ShapeLinkUI', twaver.network.LinkUI, {
    isEditable: function () {
        return true;
    },
    createLinkPoints: function () {
        var fromPoint = this.getFromPoint();
        var toPoint = this.getToPoint();
        var points = new $List();
        var type = this.getStyle('shapelink.type');

        points.add(fromPoint);
        if (this._element._points != null) {
            points.addAll(this._element._points);
        }
        points.add(toPoint);
        var pointCount = points.size();
        var half = Math.floor(pointCount / 2);
        if (pointCount % 2 === 0) {
            var p1 = points.get(half);
            var p2 = points.get(half - 1);
            this._hotSpot = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        } else {
            this._hotSpot = _twaver.clone(points.get(half));
        }

        var result, i, lastPoint;
        if (type === 'lineto') {
            //Do Nonthing
        } else if (type === 'quadto') {
            result = new $List(points.get(0));
            for (i = 1, pointCount = points.size(); i < pointCount; i++) {
                if (i < pointCount - 1) {
                    result.add(new $List([points.get(i++), points.get(i)]));
                } else {
                    result.add(points.get(i));
                }
            }
            points = result;
        } else if (type === 'cubicto') {
            result = new $List(points.get(0));
            for (i = 1, pointCount = points.size(); i < pointCount; i++) {
                if (i < pointCount - 2) {
                    result.add(new $List([points.get(i++), points.get(i++), points.get(i)]));
                } else if (i < pointCount - 1) {
                    result.add(new $List([points.get(i++), points.get(i)]));
                } else {
                    result.add(points.get(i));
                }
            }
            points = result;
        } else if (type === 'orthogonalto') {
            lastPoint = points.get(0);
            result = new $List(lastPoint);
            for (i = 1, pointCount = points.size(); i < pointCount; i++) {
                if (i < pointCount - 1) {
                    var point = _twaver.clone(points.get(i));
                    var x = point.x;
                    var y = point.y;
                    var dx = x - lastPoint.x;
                    var dy = y - lastPoint.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        point.x = x;
                        point.y = lastPoint.y;
                    } else {
                        point.x = lastPoint.x;
                        point.y = y;
                    }
                    lastPoint = point;
                    result.add(lastPoint);
                } else {
                    result.add(points.get(i));
                }
            }
            points = result;
        } else {
            throw "Can not resolve shapelink type '" + type + "'";
        }
        return points;
    }
});
