var $math = {
    getDistance: function (p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    getCenterPoint: function (p1, p2) {
    	if(p1 && p2){
           return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    	}else if(p2 == null && p1.width){
    		return {
    			x : p1.x + p1.width/2,
    			y : p1.y + p1.height/2
    		};
    	}
    },
    isPointInPolygon: function (points, point) {
        points = points._as ? points._as : points;
        var i = 0, j = 0, c = false, size = points.length;
        for (i = 0, j = size - 1; i < size; j = i++) {
            var p1 = points[i];
            var p2 = points[j];
            if (((p1.y > point.y) != (p2.y > point.y)) && (point.x < (p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x)) {
                c = !c;
            }
        }
        return c;
    },
    unionRect: function (rect1, rect2) {
        if (rect1 && !rect2) {
            return _twaver.cloneRect(rect1);
        }
        if (!rect1 && rect2) {
            return _twaver.cloneRect(rect2);
        }
        if (rect1 && rect2) {
            var rect = {};
            rect.x = Math.min(rect1.x, rect2.x);
            rect.y = Math.min(rect1.y, rect2.y);
            rect.width = Math.max(rect1.x + rect1.width, rect2.x + rect2.width) - rect.x;
            rect.height = Math.max(rect1.y + rect1.height, rect2.y + rect2.height) - rect.y;
            return rect;
        }
        return null;
    },
    intersects: function (r, r2) {
        if (!r || !r2) {
            return false;
        }
        var tw = r2.width;
        var th = r2.height;
        var rw = r.width;
        var rh = r.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = r2.x;
        var ty = r2.y;
        var rx = r.x;
        var ry = r.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        //      overflow || intersect
        return ((rw < rx || rw > tx) &&
		    (rh < ry || rh > ty) &&
		    (tw < tx || tw > rx) &&
		    (th < ty || th > ry));
    },
    intersection: function (r, r2) {
        if (!r || !r2) {
            return false;
        }
        var tx1 = r2.x;
        var ty1 = r2.y;
        var rx1 = r.x;
        var ry1 = r.y;
        var tx2 = tx1; tx2 += r2.width;
        var ty2 = ty1; ty2 += r2.height;
        var rx2 = rx1; rx2 += r.width;
        var ry2 = ry1; ry2 += r.height;
        if (tx1 < rx1) tx1 = rx1;
        if (ty1 < ry1) ty1 = ry1;
        if (tx2 > rx2) tx2 = rx2;
        if (ty2 > ry2) ty2 = ry2;
        tx2 -= tx1;
        ty2 -= ty1;
        if (tx2 === 0 || ty2 === 0) {
            return null;
        }
        return { x: tx1, y: ty1, width: tx2, height: ty2 };
    },
    contains: function (rect, r2) {
        var X = r2.x, Y = r2.y, W = r2.width, H = r2.height;
        var w = rect.width;
        var h = rect.height;
        if ((w | h | W | H) < 0) {
            // At least one of the dimensions is negative...
            return false;
        }
        // Note: if any dimension is zero, tests below must return false...
        var x = rect.x;
        var y = rect.y;
        if (X < x || Y < y) {
            return false;
        }
        w += x;
        W += X;
        if (W <= X) {
            // X+W overflowed or W was zero, return false if...
            // either original w or W was zero or
            // x+w did not overflow or
            // the overflowed x+w is smaller than the overflowed X+W
            if (w >= x || W > w) return false;
        } else {
            // X+W did not overflow and W was not zero, return false if...
            // original w was zero or
            // x+w did not overflow and x+w is smaller than X+W
            if (w >= x && W > w) return false;
        }
        h += y;
        H += Y;
        if (H <= Y) {
            if (h >= y || H > h) return false;
        } else {
            if (h >= y && H > h) return false;
        }
        return true;
    },
    getLinePoints: function (points) {
        if (!points) {
            return null;
        }
        var list = new $List();
        points.forEach(function (point) {
            list.addAll(point);
        });
        return list;
    },
    getLineRect: function (points) {
        var ps = $math.getLinePoints(points);
        return $math.getRect(ps);
    },

	getRect: function (points,rect) {
		if (!points) {
			return null;
		}
		if (points._as) {
			points = points._as;
		}
		var count = points.length;
		if (count <= 0) {
			return null;
		}
		var point = points[0];
		rect = rect || {
			x : null,
			y : null,
			width : 0,
			height : 0
		};

		for (var i = 0; i < count; i++) {
			point = points[i];
			if ( point instanceof $List) {
				$math.getRect(point, rect);
			} else {
				if(rect.x == null){
					rect.x = point.x;
					rect.y = point.y;
				}
				var x1 = Math.min(rect.x, point.x);
				var y1 = Math.min(rect.y, point.y);
				var x2 = Math.max(rect.x + rect.width, point.x);
				var y2 = Math.max(rect.y + rect.height, point.y);
				rect.x = x1;
				rect.y = y1;
				rect.width = x2 - x1;
				rect.height = y2 - y1;
			}

		}
		return rect;
	},

    addPadding: function (rect, element, styleProp, plus) {
        plus = plus || -1;
        var padding = element.getStyle(styleProp) * plus;
        if (padding != 0) {
            $math.grow(rect, padding, padding);
        }
        padding = element.getStyle(styleProp + ".left") * plus;
        if (padding != 0) {
            rect.x -= padding;
            rect.width += padding;
        }
        padding = element.getStyle(styleProp + ".right") * plus;
        if (padding != 0) {
            rect.width += padding;
        }
        padding = element.getStyle(styleProp + ".top") * plus;
        if (padding != 0) {
            rect.y -= padding;
            rect.height += padding;
        }
        padding = element.getStyle(styleProp + ".bottom") * plus;
        if (padding != 0) {
            rect.height += padding;
        }
        if (rect.width < 0) {
            rect.width = -rect.width;
            rect.x -= rect.width;
        }
        if (rect.height < 0) {
            rect.height = -rect.height;
            rect.y -= rect.height;
        }
    },
    grow: function (rect, width, height) {
    	if(rect == null){
    		return null;
    	}
    	if(height == null){
    	    height = width;
    	}
        var w = rect.width + width + width;
        if (w < 0) {
            return;
        }
        var h = rect.height + height + height;
        if (h < 0) {
            return;
        }
        rect.x -= width;
        rect.y -= height;
        rect.width = w;
        rect.height = h;
        return rect;
    },
    containsPoint: function (rect, x, y) {
        if (arguments.length < 3) {
            y = x.y;
            x = x.x;
        }
        if (!rect || x < rect.x || y < rect.y ||
    				x > rect.x + rect.width || y > rect.y + rect.height) {
            return false;
        }
        return true;
    },
    getHotSpot: function (x, y, w, h, shape) {
        if (shape === 'oval') {
            var rate = 0.35;
            return { x: x + w * 0.5 + w * rate, y: y + h / 2 - Math.sqrt(0.25 - rate * rate) * h };
        }
        if (shape === 'circle') {
            var cx = x + w / 2;
            var cy = y + h / 2;
            var r = Math.min(w, h) / 2;
            x = cx - r;
            y = cy - r;
            w = r * 2;
            h = r * 2;
            var a = w / 2;
            var b = h / 2;
            var value = a * b / Math.sqrt(a * a + b * b);
            return { x: x + w / 2 + value, y: y + h / 2 - value };
        }
        var point = { x: x + w, y: y };
        if (w > 3) {
            point.x -= 3;
        }
        if (h > 3) {
            point.y += 3;
        }
        return point;
    },
    getCircleRect: function (rect) {
        var r = Math.min(rect.width, rect.height) / 2;
        return { x: rect.x + rect.width / 2 - r, y: rect.y + rect.height / 2 - r, width: r * 2, height: r * 2 };
    },
    getEllipsePoint: function (rect, point) {
        if (!rect || !point) {
            return null;
        }
        var cx = rect.x + rect.width / 2;
        var cy = rect.y + rect.height / 2;
        var x1 = point.x - cx;
        var y1 = point.y - cy;
        var w = rect.width / 2;
        var h = rect.height / 2;
        var x = Math.sqrt(1 / (1 / w / w + y1 * y1 / x1 / x1 / h / h));
        if (x1 < 0) {
            x = -x;
        }
        var y;
        if (x1 == 0) {
            if (y1 > 0) {
                y = h;
            } else {
                y = -h;
            }
        } else {
            y = x * y1 / x1;
        }
        return { x: cx + x, y: cy + y };
    },
    createMatrix: function (angle, centerX, centerY) {
        var num = Math.sin(angle);
        var num2 = Math.cos(angle);
        var offsetX = (centerX * (1 - num2)) + (centerY * num);
        var offsetY = (centerY * (1 - num2)) - (centerX * num);
        return new $Matrix(num2, num, -num, num2, offsetX, offsetY);
    },
    calculatePointInfoAlongLineBySegments: function (points, segments, isSource, xOffset, yOffset) {
        return $math.calculatePointInfoAlongLine($math.getPointObject(points, segments), isSource, xOffset, yOffset);
    },
    calculatePointInfoAlongLine: function (paths, isSource, xOffset, yOffset) {
        isSource = isSource === undefined ? true : isSource;
        xOffset = xOffset || 0;
        yOffset = yOffset || 0;
        if (!paths || paths.size() < 2) {
            throw "must more than two points";
        }
        // reverse collection
        if (!isSource) {
            var pointsReverse = $math.reversePath(paths);
            return $math.calculatePointInfoAlongLine(pointsReverse, true, xOffset, yOffset);
        }

        if (paths._as) {
            paths = paths._as;
        }
        var pointAngle, prev, sumDistance = 0, perDistance = 0, temp, index, c = paths.length, path;
        for (index = 0; index < c; index++) {
            path = paths[index];
            if (index == 0) {
                prev = path;
                continue;
            }
            if (xOffset <= 0) {
                temp = $math.calculatePointInfoOnStraightLine($math._getPoint(prev), $math._getControlPoint(path), xOffset, yOffset);
                pointAngle = temp;
                break;
            }
            perDistance = $math._getLength(path, prev);
            if (sumDistance + perDistance > xOffset) {
                temp = $math.getPathInfo(path, prev, xOffset - sumDistance, yOffset, perDistance);
                pointAngle = temp;
                break;
            }
            sumDistance += perDistance;
            prev = path;
        }
        if (pointAngle == null) {
            var first, next;
            prev = paths[c - 1];
            next = $math._getPoint(prev);
            if (prev instanceof $List) {
                prev = prev._as;
            }
            first = prev instanceof Array ? $math._getControlPoint(prev) : $math._getPoint(paths[c - 2]);
            var angle = Math.atan2(next.y - first.y, next.x - first.x);
            temp = $math.transformPoint(next, angle, xOffset - sumDistance, yOffset);
            temp.angle = angle;
            pointAngle = temp;
        }
        return pointAngle;
    },
    reversePath: function (paths) {
        var result = new $List();
        var prev = null, point;
        if (paths._as) {
            paths = paths._as;
        }
        for (var i = paths.length - 1; i >= 0; i--) {
            point = paths[i];
            result.add($math._getReversePath(point, prev));
            prev = point;
        }
        return result;
    },
    _getPoint: function (point) {
        if (point._as) {
            point = point._as;
        }
        if (point instanceof Array) {
            return point[point.length - 1];
        } else {
            return point;
        }
    },
    _getControlPoint: function (point) {
        if (point._as) {
            point = point._as;
        }
        if (point instanceof Array) {
            return point[point.length - 2];
        } else {
            return point;
        }
    },
    _getReversePath: function (point, prev) {
        var thisPoint = $math._getPoint(point);
        if (prev && prev._as) {
            prev = prev._as;
        }
        if (prev == null || !(prev instanceof Array)) {
            return thisPoint;
        }
        if (prev.length == 2) {
            return new $List([prev[0], thisPoint]);
        } else {
            return new $List([prev[1], prev[0], thisPoint]);
        }
    },
    _getLength: function (current, prev) {
        var first = $math._getPoint(prev);
        var point = $math._getPoint(current);
        if (current instanceof $List) {
            current = current._as;
        }
        if (current instanceof Array) {
            return $math.calculateCurveLength(first, current, 1);
        } else {
            var dy = point.y - first.y;
            var dx = point.x - first.x;
            return Math.sqrt(dx * dx + dy * dy);
        }
    },
    getPathInfo: function (current, prev, xOffset, yOffset, length) {
        var first = $math._getPoint(prev);
        var next = $math._getPoint(current);
        var angle;
        if (current instanceof $List) {
            current = current._as;
        }
        if (current instanceof Array) {
            if (length < 0) {
                length = $math._getLength(current, prev);
            }
            var t = xOffset / length;
            var curverInfo = $math.calculatePointInfoOnCurveLine(first, current, t);
            first = curverInfo.point;
            angle = curverInfo.angle;
            xOffset = 0;
        } else {
            angle = Math.atan2(next.y - first.y, next.x - first.x);
        }
        return $math.transformPoint(first, angle, xOffset, yOffset);
    },
    transformPoint: function (point, angle, xOffset, yOffset) {
        var result = { x: xOffset, y: yOffset };
        var m = $math.createMatrix(angle, 0, 0);
        result = m.transform(result);
        result.x += point.x;
        result.y += point.y;
        return {
            point: result,
            angle: angle
        };
    },
    calculatePointInfoOnStraightLine: function (from, next, xOffset, yOffset) {
        var angle = Math.atan2(next.y - from.y, next.x - from.x);
        return $math.transformPoint(from, angle, xOffset, yOffset);
    },
    calculatePointInfoOnCurveLine: function (prev, current, t) {
        if (t < 0 || t > 1) {
            throw "Illegal arguments";
        }
        if (current._as) {
            current = current._as;
        }
        if (current.length == 2) {
            return $math._calculatePointInfoOnCurveLine2(prev, current[0], current[1], t);
        } else {
            return $math._calculatePointInfoOnCurveLine3(prev, current[0], current[1], current[2], t);
        }
    },
    _calculatePointInfoOnCurveLine2: function (p1, p2, p3, t) {
        var dx = 2 * (p1.x + p3.x - 2 * p2.x) * t + 2 * p2.x - 2 * p1.x;
        var dy = 2 * (p1.y + p3.y - 2 * p2.y) * t + 2 * p2.y - 2 * p1.y;
        var angle = Math.atan2(dy, dx);
        var x = (p1.x + p3.x - 2 * p2.x) * t * t + (2 * p2.x - 2 * p1.x) * t + p1.x;
        var y = (p1.y + p3.y - 2 * p2.y) * t * t + (2 * p2.y - 2 * p1.y) * t + p1.y;
        return {
            point: {
                x: x,
                y: y
            },
            angle: angle
        };
    },
    _calculatePointInfoOnCurveLine3: function (p1, p2, p3, p4, mu) {
        var mum1, mum13, mu3;
        mum1 = 1 - mu;
        mum13 = mum1 * mum1 * mum1;
        mu3 = mu * mu * mu;
        var x = mum13 * p1.x + 3 * mu * mum1 * mum1 * p2.x + 3 * mu * mu * mum1 * p3.x + mu3 * p4.x;
        var y = mum13 * p1.y + 3 * mu * mum1 * mum1 * p2.y + 3 * mu * mu * mum1 * p3.y + mu3 * p4.y;
        return {
            point: {
                x: x,
                y: y
            },
            angle: Math.atan2($math._bezeSpeedY(p1, p2, p3, p4, mu), $math._bezeSpeedX(p1, p2, p3, p4, mu))
        };
    },
    calculateCurveLength: function (prev, current, t) {
        if (current._as) {
            current = current._as;
        }
        if (current.length == 2) {
            return $math._calculateCurveLength(prev, current[0], current[1], t);
        } else {
            return $math._calculateBezierCurveLength(prev, current[0], current[1], current[2], t);
        }
    },
    _calculateCurveLength: function (p1, p2, p3, t) {
        if (t <= 0 || t > 1) {
            return 0;
        }
        var pathNumber = Math.floor(t * (Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) + Math.sqrt((p3.x - p2.x) * (p3.x - p2.x) + (p3.y - p2.y) * (p3.y - p2.y))) / 2);
        var subX = 0;
        if (pathNumber <= 0) {
            pathNumber = 1;
        }
        var dt = t / pathNumber;
        var dx, dy;
        var currentT = 0;
        for (var i = 0; i < pathNumber; i++) {
            currentT = dt * i;
            dx = 2 * (p1.x + p3.x - 2 * p2.x) * currentT + 2 * p2.x - 2 * p1.x;
            dy = 2 * (p1.y + p3.y - 2 * p2.y) * currentT + 2 * p2.y - 2 * p1.y;
            dx *= dt;
            dy *= dt;
            subX += Math.sqrt(dx * dx + dy * dy);
        }
        return subX;
    },
    _calculateBezierCurveLength: function (p1, p2, p3, p4, t) {
        if (t <= 0 || t > 1) {
            return 0;
        }
        var TOTAL_SIMPSON_STEP = 10000;
        var stepCounts = Math.floor(TOTAL_SIMPSON_STEP * t);
        if ((stepCounts & 1) == 1) stepCounts++;
        if (stepCounts == 0) return 0.0;

        var halfCounts = Math.floor(stepCounts / 2);
        var sum1 = 0.0, sum2 = 0.0;
        var dStep = t / stepCounts;

        var i;
        for (i = 0; i < halfCounts; i++) {
            sum1 += $math._bezeSpeed(p1, p2, p3, p4, (2 * i + 1) * dStep);
        }
        for (i = 1; i < halfCounts; i++) {
            sum2 += $math._bezeSpeed(p1, p2, p3, p4, (2 * i) * dStep);
        }
        return ($math._bezeSpeed(p1, p2, p3, p4, 0.0) + $math._bezeSpeed(p1, p2, p3, p4, 1.0) + 2 * sum2 + 4 * sum1) * dStep / 3.0;
    },
    _bezeSpeedX: function (p1, p2, p3, p4, t) {
        var it = 1 - t;
        return -3 * p1.x * it * it + 3 * p2.x * it * it - 6 * p2.x * it * t + 6 * p3.x * it * t - 3 * p3.x * t * t + 3 * p4.x * t * t;
    },
    _bezeSpeedY: function (p1, p2, p3, p4, t) {
        var it = 1 - t;
        return -3 * p1.y * it * it + 3 * p2.y * it * it - 6 * p2.y * it * t + 6 * p3.y * it * t - 3 * p3.y * t * t + 3 * p4.y * t * t;
    },
    _bezeSpeed: function (p1, p2, p3, p4, t) {
        var sx = $math._bezeSpeedX(p1, p2, p3, p4, t);
        var sy = $math._bezeSpeedY(p1, p2, p3, p4, t);

        return Math.sqrt(sx * sx + sy * sy);
    },
    getPointObject: function (points, segments) {
        if (!segments || segments.size() == 0) {
            return points;
        } else {
            var result = new $List();
            segments = segments._as;
            points = points._as;
            var pointIndex = 0, i, segment, segmentCount = segments.length, pointCount = points.length;
            for (i = 0; i < segmentCount; i++) {
                segment = segments[i];
                if (pointIndex == pointCount) {
                    break;
                }
                if ('cubicto' === segment) {
                    if (pointIndex < pointCount - 2) {
                        result.add([points[pointIndex++], points[pointIndex++], points[pointIndex++]]);
                    }
                } else if ('quadto' === segment) {
                    if (pointIndex < pointCount - 1) {
                        result.add([points[pointIndex++], points[pointIndex++]]);
                    }
                } else {
                    if (pointIndex < pointCount) {
                        result.add(points[pointIndex++]);
                    }
                }
            }
            for (; pointIndex < pointCount; pointIndex++) {
                result.add(points[pointIndex]);
            }
            return result;
        }
    },
    calculateLineLength: function (points, segments) {
        if (!points || points.size() < 2) {
            return 0;
        }
        if (segments) {
            return $math.calculateLineLength($math.getPointObject(points, segments));
        }
        points = points._as;
        var index, count = points.length, first, next, point, perDistance, dx, dy, sumDistance = 0;
        for (index = 0; index < count; index++) {
            point = points[index];
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
        }
        return sumDistance;
    },
    toDegrees: function (radian) {
        return radian * 180.0 / Math.PI
    },
    toRadians: function (degree) {
        return degree / 180.0 * Math.PI
    },
    getRadiansBetweenLines: function (from, to) {
        return Math.atan2(to.y-from.y,to.x-from.x);
    },
    getAngle: function (p1, p2) {
        if (p1.x === p2.x) {
            if (p2.y === p1.y) {
                return 0;
            } else if (p2.y > p1.y) {
                return Math.PI/2;
            } else {
                return -Math.PI/2;
            }
        }
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    }
};
_twaver.math = $math;
