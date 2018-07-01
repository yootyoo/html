var $bus = {
    between: function (v1, v2, v) {
        if (v >= v1 && v <= v2) {
            return true;
        }
        if (v >= v2 && v <= v1) {
            return true;
        }
        return false;
    },
    considerEast: function (toPoint, result, point1) {
        if (!result) {
            return true;
        }
        if ($bus.between(result.x, point1.x, toPoint.x)) {
            return point1.x > result.x;
        } else {
            return Math.abs(result.x - toPoint.x) > Math.abs(point1.x - toPoint.x);
        }
    },
    considerWest: function (toPoint, result, point1) {
        if (!result) {
            return true;
        }
        if ($bus.between(result.x, point1.x, toPoint.x)) {
            return point1.x < result.x;
        } else {
            return Math.abs(result.x - toPoint.x) > Math.abs(point1.x - toPoint.x);
        }
    },
    considerNorth: function (toPoint, result, point1) {
        if (!result) {
            return true;
        }
        if ($bus.between(result.y, point1.y, toPoint.y)) {
            return point1.y < result.y;
        } else {
            return Math.abs(result.y - toPoint.y) > Math.abs(point1.y - toPoint.y);
        }
    },
    considerSouth: function (toPoint, result, point1) {
        if (!result) {
            return true;
        }
        if ($bus.between(result.y, point1.y, toPoint.y)) {
            return point1.y > result.y;
        } else {
            return Math.abs(result.y - toPoint.y) > Math.abs(point1.y - toPoint.y);
        }
    },
    getHorizontalPoint: function (toPoint, point1, point2) {
        if ($bus.between(point1.x, point2.x, toPoint.x)) {
            return { x: toPoint.x, y: point1.y };
        } else {
            if (Math.abs(toPoint.x - point1.x) < Math.abs(toPoint.x - point2.x)) {
                return { x: point1.x, y: point1.y };
            } else {
                return { x: point2.x, y: point2.y };
            }
        }
    },
    getVerticalPoint: function (toPoint, point1, point2) {
        if ($bus.between(point1.y, point2.y, toPoint.y)) {
            return { x: point1.x, y: toPoint.y };
        } else {
            if (Math.abs(toPoint.y - point1.y) < Math.abs(toPoint.y - point2.y)) {
                return { x: point1.x, y: point1.y };
            } else {
                return { x: point2.x, y: point2.y };
            }
        }
    },
    getPoint: function (result, toPoint, point1, point2, style) {
        var isHorizontal = Math.abs(point2.x - point1.x) > Math.abs(point2.y - point1.y);

        if ('south' === style) {
            if (isHorizontal && $bus.considerSouth(toPoint, result, point1)) {
                return $bus.getHorizontalPoint(toPoint, point1, point2);
            }
            return null;
        }
        else if ('north' === style) {
            if (isHorizontal && $bus.considerNorth(toPoint, result, point1)) {
                return $bus.getHorizontalPoint(toPoint, point1, point2);
            }
            return null;
        }
        else if ('west' === style) {
            if (!isHorizontal && $bus.considerWest(toPoint, result, point1)) {
                return $bus.getVerticalPoint(toPoint, point1, point2);
            }
            return null;
        }
        else if ('east' === style) {
            if (!isHorizontal && $bus.considerEast(toPoint, result, point1)) {
                return $bus.getVerticalPoint(toPoint, point1, point2);
            }
            return null;
        }
        else if ('nearby' === style) {
            var point;
            if (isHorizontal) {
                point = $bus.getHorizontalPoint(toPoint, point1, point2);
            } else {
                point = $bus.getVerticalPoint(toPoint, point1, point2);
            }
            if (!result || $math.getDistance(result, toPoint) > $math.getDistance(point, toPoint)) {
                return point;
            }
            return null;
        }
        return null;
    },
    getBusPoint: function (points, toPoint, style) {
        var result;
        var count = points.size();
        if (count > 0) {
            var point1 = points.get(0);
            for (var i = 1; i < count; i++) {
                var point2 = points.get(i);
                var point = $bus.getPoint(result, toPoint, point1, point2, style);
                if (point) {
                    result = point;
                }
                point1 = point2;
            }
            if (!result) {
                result = { x: point1.x, y: point1.y };
            }
        }
        return result;
    }
};
_twaver.bus = $bus;
