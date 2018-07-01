twaver.vector.ShapeLinkUI = function (network, element) {
    twaver.vector.ShapeLinkUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.ShapeLinkUI', twaver.vector.LinkUI, {
    isEditable: function () {
        return true;
    },
    
    createLinkPoints: function () {
        var fromPoint = this.getFromPoint();
        var toPoint = this.getToPoint();
        var points = new twaver.List();
        var type = this.getStyle('shapelink.type');
        points.add(fromPoint);
        if (this._element._points != null) {
            points.addAll(this._network.zoomManager._getShapeLinkZoomPoints(this._element._points));
        }
        points.add(toPoint);
        
        // var pointCount = points.size();
        // var half = Math.ceil(pointCount / 2);
        // if (pointCount % 2 === 0) {
        //     var p1 = points.get(half);
        //     var p2 = points.get(half - 1);
        //     this._hotSpot = {
        //         x: (p1.x + p2.x) / 2,
        //         y: (p1.y + p2.y) / 2
        //     };
        // } else {
        //     this._hotSpot = _twaver.clone(points.get(half));
        // }

        var result, i, lastPoint;
        if (type === 'lineto') {
            //Do Nonthing
        }
        else if (type === 'quadto') {
            result = new twaver.List(points.get(0));
            for (i = 1, pointCount = points.size(); i < pointCount; i++) {
                if (i < pointCount - 1) {
                    result.add(new twaver.List([points.get(i++), points.get(i)]));
                } else {
                    result.add(points.get(i));
                }
            }
            points = result;
        } else if (type === 'cubicto') {
            result = new twaver.List(points.get(0));
            for (i = 1, pointCount = points.size(); i < pointCount; i++) {
                if (i < pointCount - 2) {
                    result.add(new twaver.List([points.get(i++), points.get(i++), points.get(i)]));
                } else if (i < pointCount - 1) {
                    result.add(new twaver.List([points.get(i++), points.get(i)]));
                } else {
                    result.add(points.get(i));
                }
            }
            points = result;
        } else if (type === 'orthogonalto') {
            lastPoint = points.get(0);
            result = new twaver.List(lastPoint);
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

        var halfDistance = $math.calculateLineLength(points)/2;
        
        var index, count = points.size(), first, next, point, perDistance, dx, dy, prevSumDistance = 0,sumDistance = 0;
        for (index = 0; index < count; index++) {
            point = points.get(index);
            if (index == 0) {
                first = point;
                continue;
            }
            next = point;
            if (next instanceof $List) {
                next = next._as;
            }
            if (next instanceof Array) {
                perDistance = $math.calculateCurveLength(first, next, 1);
                first = next[next.length - 1];
            } else {
                dy = point.y - first.y;
                dx = point.x - first.x;
                perDistance = Math.sqrt(dx * dx + dy * dy);
                first = next;
            }
            sumDistance += perDistance;
            if(prevSumDistance <= halfDistance && sumDistance >= halfDistance){
                var ds = halfDistance - prevSumDistance;
                var f = points.get(index-1);
                if(f instanceof $List){
                    f = f._as;
                    if(f instanceof Array){
                        f = f[f.length - 1];
                    }
                }
                var t = points.get(index);
                var p = $math.getPathInfo(t,f,ds,0,-1).point;
                this._hotSpot = _twaver.clone(p);
            }
            prevSumDistance = sumDistance;
        }
        return points;
    },
    _growLinkJoinBounds : function(bounds,grow){
    	 $math.grow(bounds, grow * 3, grow * 3);
    },
});
