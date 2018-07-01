var $link = {
    createFromPoint: function (ui,zoomManager) {
        var link = ui._element;
        if (!link.getFromAgent()) {
            return { x: 0, y: 0 };
        }
        var fromPosition = link.getStyle('link.from.position');
        var fromXoffset = link.getStyle('link.from.xoffset');
        var fromYoffset = link.getStyle('link.from.yoffset');
        var fromPoint;

        if(ui._network._edgeDetect) {
            var fromAgent = link.getFromAgent();
            var toAgent = link.getToAgent();
            var imageName = fromAgent.getImage();
            var imageAsset = _twaver.images[imageName];
            var fCLocation = fromAgent.getCenterLocation();
            var tCLocation = toAgent.getCenterLocation();
            var angle = this._getPointAngleDegree(tCLocation.x, tCLocation.y, fCLocation.x, fCLocation.y);
            var newPoint = {x: 0, y: 0};
            if (imageAsset) {
                var image = imageAsset._image;
                if(image && isImage(image) || image && twaver.Util.getImageAsset(imageName)._cache){
                    if (isImage(image)) {
                       if (!imageAsset._edgeData) {
                            imageAsset._edgeData = imageAsset._createEdgeData(image);
                        }
                    }else if(typeof image === 'object'){
                        if (!imageAsset._edgeData) {
                          imageAsset._edgeData = imageAsset._createEdgeData(twaver.Util.getImageAsset(imageName)._cache);
                        }
                    }
                    newPoint.x = imageAsset._edgeData[angle].x + fromAgent.getRect().x;
                    newPoint.y = imageAsset._edgeData[angle].y + fromAgent.getRect().y;
                    return newPoint;
                }
            }
        }

        if (!_twaver.isCalculatingBus) {
            _twaver.isCalculatingBus = true;
            if (link.getFromAgent() instanceof twaver.Bus) {
                var bus = link.getFromAgent();
                if ($element.hasVector(bus)) {
                    var rect = zoomManager ? zoomManager._getElementZoomRect(ui,bus.getRect()) : bus.getRect();
                    var shape = bus.getStyle('vector.shape');
                    if (shape === 'oval') {
                        fromPoint = $math.getEllipsePoint(rect, $link.createToPoint(ui));
                    }
                    else if (shape === 'circle') {
                        fromPoint = $math.getEllipsePoint($math.getCircleRect(rect), $link.createToPoint(ui));
                    }
                    else if (shape === 'rectangle' || shape === 'roundrect') {
                        var points = new $List();
                        points.add({ x: bus.x, y: bus.y });
                        points.add({ x: bus.x + bus.width, y: bus.y });
                        points.add({ x: bus.x + bus.width, y: bus.y + bus.height });
                        points.add({ x: bus.x, y: bus.y + bus.height });
                        points.add({ x: bus.x, y: bus.y });
                        points = zoomManager ? zoomManager._getShapeNodeZoomPoints(ui,points) : points;
                        fromPoint = $bus.getBusPoint(points, $link.createToPoint(ui), bus.getStyle('bus.style'));
                    }
                }
                else {
                	var points = zoomManager ? zoomManager._getShapeNodeZoomPoints(ui,bus.getPoints()) : bus.getPoints();
                    fromPoint = $bus.getBusPoint(points, $link.createToPoint(ui), bus.getStyle('bus.style'));
                }
            }
            _twaver.isCalculatingBus = false;
        }

        if (!fromPoint) {
            fromPoint = ui._network.getPosition(fromPosition, link.getFromAgent(), null, fromXoffset, fromYoffset,true);
        } else {
            fromPoint.x += fromXoffset;
            fromPoint.y += fromYoffset;
        }
        return fromPoint;
    },
    createToPoint: function (ui,zoomManager) {
        var link = ui._element;
        if (!link.getToAgent()) {
            return { x: 0, y: 0 };
        }
        var toPosition = link.getStyle('link.to.position');
        var toXoffset = link.getStyle('link.to.xoffset');
        var toYoffset = link.getStyle('link.to.yoffset');

        var toPoint;

        if(ui._network._edgeDetect) {
            var fromAgent = link.getFromAgent();
            var toAgent = link.getToAgent();
            var imageName = toAgent.getImage();
            var imageAsset = _twaver.images[imageName];
            var fCLocation = fromAgent.getLocation();
            var tCLocation = toAgent.getCenterLocation();
            var angle = this._getPointAngleDegree(fCLocation.x, fCLocation.y, tCLocation.x, tCLocation.y);
            var newPoint = {x: 0, y: 0};

            if (imageAsset) {
                var image = imageAsset._image;
                if(image && isImage(image) || image && twaver.Util.getImageAsset(imageName)._cache){
                    if (isImage(image)) {
                        if (!imageAsset._edgeData) {
                            imageAsset._edgeData = imageAsset._createEdgeData(image);
                        }
                    }else if(typeof image === 'object'){
                        if (!imageAsset._edgeData) {
                            imageAsset._edgeData = imageAsset._createEdgeData(twaver.Util.getImageAsset(imageName)._cache);
                        }
                    }
                    newPoint.x = imageAsset._edgeData[angle].x + toAgent.getRect().x;
                    newPoint.y = imageAsset._edgeData[angle].y + toAgent.getRect().y;
                    return newPoint;
                }
            }
        }


        if (!_twaver.isCalculatingBus) {
            _twaver.isCalculatingBus = true;

            if (link.getToAgent() instanceof twaver.Bus) {
                var bus = link.getToAgent();
                if ($element.hasVector(bus)) {
                	var rect = zoomManager ? zoomManager._getElementZoomRect(ui,bus.getRect()) : bus.getRect();
                    var shape = bus.getStyle('vector.shape');
                    if (shape === 'oval') {
                        toPoint = $math.getEllipsePoint(rect, $link.createFromPoint(ui));
                    }
                    else if (shape === 'circle') {
                        toPoint = $math.getEllipsePoint($math.getCircleRect(rect), $link.createFromPoint(ui));
                    }
                    else if (shape === 'rectangle' || shape === 'roundrect') {
                        var points = new $List();
                        points.add({ x: bus.x, y: bus.y });
                        points.add({ x: bus.x + bus.width, y: bus.y });
                        points.add({ x: bus.x + bus.width, y: bus.y + bus.height });
                        points.add({ x: bus.x, y: bus.y + bus.height });
                        points.add({ x: bus.x, y: bus.y });
                        points = zoomManager ? zoomManager._getShapeNodeZoomPoints(ui,points) : points;
                        toPoint = $bus.getBusPoint(points, $link.createFromPoint(ui), bus.getStyle('bus.style'));
                    }
                }
                else {
                	var points = zoomManager ? zoomManager._getShapeNodeZoomPoints(ui,bus.getPoints()) : bus.getPoints();
                    toPoint = $bus.getBusPoint(points, $link.createFromPoint(ui), bus.getStyle('bus.style'));
                }
            }

            _twaver.isCalculatingBus = false;
        }

        if (!toPoint) {
            toPoint = ui._network.getPosition(toPosition, link.getToAgent(), null, toXoffset, toYoffset,true);
        } else {
            toPoint.x += toXoffset;
            toPoint.y += toYoffset;
        }
        return toPoint;
    },
    fillLoopedPoints: function (ui, rect, points) {
        var cPoint;
        var radius = $link.getBundleGap(ui, true);
        var percentRadius = radius;
        var type = ui.getStyle('link.looped.type');
        var direction = ui.getStyle('link.looped.direction');

        if (direction === 'north') {
            if (type === 'arc') {
                $link.drawArc(rect.x + rect.width / 2, rect.y, 0, Math.PI, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x + rect.width / 2, y: rect.y };
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y });
            }

            return { x: rect.x + rect.width / 2, y: rect.y - radius };
        }
        else if (direction === 'northeast') {
            if (type === 'arc') {
                $link.drawArc(rect.x + rect.width, rect.y, Math.PI * 1.5, Math.PI * 1.5, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x + rect.width, y: rect.y };
                points.add({ x: cPoint.x, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y });
            }
            return { x: rect.x + rect.width + radius * 0.707, y: rect.y - radius * 0.707 };
        }
        else if (direction === 'east') {
            if (type === 'arc') {
                $link.drawArc(rect.x + rect.width, rect.y + rect.height / 2, Math.PI * 1.5, Math.PI, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
                points.add({ x: cPoint.x, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x + radius, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x + radius, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x, y: cPoint.y + percentRadius });
            }
            return { x: rect.x + rect.width + radius, y: rect.y + rect.height / 2 };
        }
        else if (direction === 'southeast') {
            if (type === 'arc') {
                $link.drawArc(rect.x + rect.width, rect.y + rect.height, Math.PI, Math.PI * 1.5, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x + rect.width, y: rect.y + rect.height };
                points.add({ x: cPoint.x, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y });
            }
            return { x: rect.x + rect.width + radius * 0.707, y: rect.y + rect.height + radius * 0.707 };
        }
        else if (direction === 'south') {
            if (type === 'arc') {
                $link.drawArc(rect.x + rect.width / 2, rect.y + rect.height, Math.PI, Math.PI, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x + rect.width / 2, y: rect.y + rect.height };
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y });
            }
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height + radius };
        }
        else if (direction === 'southwest') {
            if (type === 'arc') {
                $link.drawArc(rect.x, rect.y + rect.height, Math.PI * 0.5, Math.PI * 1.5, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x, y: rect.y + rect.height };
                points.add({ x: cPoint.x, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y + radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y });
            }
            return { x: rect.x - radius * 0.707, y: rect.y + rect.height + radius * 0.707 };
        }
        else if (direction === 'west') {
            if (type === 'arc') {
                $link.drawArc(rect.x, rect.y + rect.height / 2, Math.PI * 0.5, Math.PI, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x, y: rect.y + rect.height / 2 };
                points.add({ x: cPoint.x, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x - radius, y: cPoint.y - percentRadius });
                points.add({ x: cPoint.x - radius, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x, y: cPoint.y + percentRadius });
            }
            return { x: rect.x - radius, y: rect.y + rect.height / 2 };
        }
        else if (direction === 'northwest') {
            if (type === 'arc') {
                $link.drawArc(rect.x, rect.y, 0, Math.PI * 1.5, radius, radius, false, points);
            }
            else {
                cPoint = { x: rect.x, y: rect.y };
                points.add({ x: cPoint.x, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y + percentRadius });
                points.add({ x: cPoint.x - percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y - radius });
                points.add({ x: cPoint.x + percentRadius, y: cPoint.y });
            }
            return { x: rect.x - radius * 0.707, y: rect.y - radius * 0.707 };
        }
        throw "Can not resolve link looped direction '" + direction + "'";
    },
    drawArc: function (x, y, startAngle, arc, radius, yRadius, continueFlag, points) {
        var segAngle;
        var theta;
        var angle;
        var angleMid;
        var segs;
        var ax;
        var ay;
        var bx;
        var by;
        var cx;
        var cy;

        if (Math.abs(arc) > 2 * Math.PI) {
            arc = 2 * Math.PI;
        }

        segs = Math.ceil(Math.abs(arc) / (Math.PI / 4));
        segAngle = arc / segs;
        theta = -segAngle;
        angle = -startAngle;

        if (segs > 0) {
            ax = x + Math.cos(startAngle) * radius;
            ay = y + Math.sin(-startAngle) * yRadius;

            points.add({ x: ax, y: ay });

            for (var i = 0; i < segs; i++) {
                angle += theta;
                angleMid = angle - theta / 2;

                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                var tempPoint = new $List();
                tempPoint.add({ x: cx, y: cy });
                tempPoint.add({ x: bx, y: by });
                points.add(tempPoint);
            }
        }
    },
    fillBundlePoints: function (ui, type, fromPoint, toPoint, points ,zoomManager) {
        var bundleCount = ui._element.getBundleCount();
        var bundleIndex = ui._element.getBundleIndex();
        var bundleExpanded = ui.getStyle('link.bundle.expanded');

        var yoffset;
//        if (!bundleExpanded || (type !== 'parallel' && (yoffset = $link.getBundleGap(ui, false)) === 0)) {
        if ((type !== 'parallel' && (yoffset = $link.getBundleGap(ui, false)) === 0)) {
            points.add(fromPoint);
            points.add(toPoint);
            return $math.getCenterPoint(fromPoint, toPoint);
        }
        else {
            yoffset === undefined && (yoffset = $link.getBundleGap(ui, false));
            var xoffset = $link.getBundleOffset(ui);
            var dist = $math.getDistance(fromPoint, toPoint);

            if(zoomManager){
                var sizeZoom = zoomManager.getSizeZoom();
                xoffset *= sizeZoom;
                yoffset *= sizeZoom;
            }

            if (type === 'arc' || type === 'triangle') {
                points.add({ x: 0, y: 0 });
            }
            if (type === 'arc') {
                points.add({ x: 0, y: yoffset });
            }
            points.add({ x: xoffset, y: yoffset });
            points.add({ x: dist - xoffset, y: yoffset });
            if (type === 'arc') {
                points.add({ x: dist, y: yoffset });
            }
            if (type === 'arc' || type === 'triangle') {
                points.add({ x: dist, y: 0 });
            }

            var angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
            var matrix = $math.createMatrix(angle, 0, 0);
            for (var i = 0, s = points.size(); i < s; i++) {
                var point = points.get(i);
                point = matrix.transform(point);
                point.x += fromPoint.x;
                point.y += fromPoint.y;
                points.set(i, point);
            }
            if (type === 'arc') {
                var hotSpot = $math.getCenterPoint(points.get(2), points.get(3));
                var ps = new $List();
                ps.add(points.get(1));
                ps.add(points.get(2));
                points.set(1, ps);

                ps = new $List();
                ps.add(points.get(4));
                ps.add(points.get(5));
                points.set(4, ps);

                points.removeAt(5);
                points.removeAt(2);
                return hotSpot;
            }
            else {
                return $link.calculateCenterPoint(points);
            }
        }
    },
    calculateCenterPoint: function (points) {
        var s = points.size();
        if (points == null || s < 1) {
            return { x: 0, y: 0 };
        }
        if (s % 2 === 0) {
            var h = s / 2;
            var p1 = points.get(h - 1);
            var p2 = points.get(h);
            return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        }
        else {
            return points.get((s - 1) / 2);
        }
    },
    getBundleOffset: function (ui) {
        var dest = $math.getDistance(ui.getFromPoint(), ui.getToPoint());
        var offset = ui.getStyle('link.bundle.offset');
        return dest > offset * 2 ? offset : dest / 2;
    },
    getBundleGap: function (ui, isLooped) {
        var link = ui._element;
        if (!link.getBundleLinks()) {
            if (isLooped) {
                return link.getStyle('link.looped.gap');
            }
            else {
                return 0;
            }
        }
        var gapStyle = isLooped ? 'link.looped.gap' : 'link.bundle.gap';
        var firstLink = null;
        var thisLinkPosition = 0;
        var sumGap = 0;
        var siblings = link.getBundleLinks().getSiblings();
        var lastGap = 0;
        var isIndependent = link.getStyle('link.bundle.independent');
        var bundleGroupGap = link.getStyle('link.bundle.group.gap');
        for (var i = 0, s = siblings.size(); i < s; i++) {
            var siblingBundleLinks = siblings.get(i);
            if (isIndependent && siblingBundleLinks !== link.getBundleLinks()) {
                continue;
            }
            for (var j = 0, ss = siblingBundleLinks.getLinks().size(); j < ss; j++) {
                var siblingLink = siblingBundleLinks.getLinks().get(j);
                if (isIndependent !== siblingLink.getStyle('link.bundle.independent')) {
                    continue;
                }
                if (ui._network.isVisible(siblingLink)) {
                    if (firstLink == null) {
                        firstLink = siblingLink;
                        lastGap = siblingLink.getStyle(gapStyle);
                    }
                    else {
                        var currentGap = siblingLink.getStyle(gapStyle);
                        sumGap += lastGap / 2 + currentGap / 2;
                        lastGap = currentGap;
                    }
                    if (siblingLink === link) {
                        thisLinkPosition = sumGap+bundleGroupGap/2;
                    }
                }
            }
            sumGap += bundleGroupGap;
        }
        if (isLooped) {
            return sumGap - thisLinkPosition + lastGap;
        }
        var value = thisLinkPosition - sumGap / 2;
        if (firstLink != null && link.getFromAgent() !== firstLink.getFromAgent()) {
            value = -value;
        }
        return value;
    },
    isTargetPriority: function (isHorizontal, sourceBounds, targetBounds) {
        if (isHorizontal) {
            if (sourceBounds.height < targetBounds.height) {
                return sourceBounds.height + targetBounds.height < Math.max(sourceBounds.y + sourceBounds.height, targetBounds.y + targetBounds.height) - Math.min(sourceBounds.y, targetBounds.y) + sourceBounds.height / 2;
            }
        } else {
            if (sourceBounds.width < targetBounds.width) {
                return sourceBounds.width + targetBounds.width < Math.max(sourceBounds.x + sourceBounds.width, targetBounds.x + targetBounds.width) - Math.min(sourceBounds.x, targetBounds.x) + sourceBounds.width / 2;
            }
        }
        return true;
    },
    calculateOrthogonalAndFlexionalLinkPoints: function (linkType, sourceBounds, targetBounds, link) {
        var horizontal = $link.isHorizontal(linkType, sourceBounds, targetBounds, link);
        //layout
        var result = new $List();
        if ($link.isFlexionalTypeLink(linkType)) {
            $link.flexional(horizontal, sourceBounds, targetBounds, result, link.getStyle('link.extend'));
        } else {
            $link.orthogonal(linkType, sourceBounds, targetBounds, result, horizontal, link);
            var splitByPercent = $link.isSplitByPercent(linkType, link);
            var splitLocation = splitByPercent ? $link.calculateSplitValueByPercent(linkType, horizontal, sourceBounds, targetBounds, link.getStyle('link.split.percent')) :
					link.getStyle('link.split.value');
            if (splitLocation === 0) {
                horizontal = !horizontal;
            }
        }

        ///start and end point
        var next;
        if (result.size() === 0) {
            if ($link.isTargetPriority(horizontal, sourceBounds, targetBounds)) {
                next = { x: targetBounds.x + targetBounds.width / 2, y: targetBounds.y + targetBounds.height / 2 };
                result.add($link.rectanglePerimeter(sourceBounds, true, next));
                result.add($link.rectanglePerimeter(targetBounds, false, result.get(result.size() - 1)));
            } else {
                next = { x: sourceBounds.x + sourceBounds.width / 2, y: sourceBounds.y + sourceBounds.height / 2 };
                next = $link.rectanglePerimeter(targetBounds, false, next);
                result.add($link.rectanglePerimeter(sourceBounds, true, next));
                result.add(next);
            }
        } else {
            next = result.get(0);
            result.add($link.rectanglePerimeter(sourceBounds, true, next), 0);
            result.add($link.rectanglePerimeter(targetBounds, false, result.get(result.size() - 1)));
        }

        ///delete duplicate points
        var pointCount = result.size();
        if (pointCount < 2) {
            return result;
        }
        var previousPoint = result.get(0);
        for (var index = 1; index < pointCount - 1; index++) {
            var point = result.get(index);
            if (point.x === previousPoint.x && point.y === previousPoint.y) {
                result.remove(point);
                pointCount--;
                index--;
            }
            previousPoint = point;
        }
        return result;
    },
    isHorizontal: function (linkType, sourceBounds, targetBounds, link) {
        if (linkType) {
            if (linkType === 'flexional.horizontal' ||
					linkType === 'orthogonal.horizontal' ||
					linkType === 'orthogonal.H.V' ||
					linkType === 'extend.left' ||
					linkType === 'extend.right') {
                return true;
            } else if (linkType === 'flexional.vertical' ||
					linkType === 'orthogonal.vertical' ||
					linkType === 'orthogonal.V.H' ||
					linkType === 'extend.top' ||
					linkType === 'extend.bottom') {
                return false;
            }
        }
        var xGap = $link.calculateXGap(sourceBounds, targetBounds);
        var yGap = $link.calculateYGap(sourceBounds, targetBounds);
        return xGap >= yGap;
    },
    flexional: function (isHorizontal, sourceBounds, targetBounds, result, extend) {
        isHorizontal ? $link.flexionalHorizontal(sourceBounds, targetBounds, result, extend) : $link.flexionalVertical(sourceBounds, targetBounds, result, extend);
    },
    isSplitByPercent: function (linkType, link) {
        return link.getStyle('link.split.by.percent');
    },
    isExtendTypeLink: function (linkType) {
        return linkType && (linkType === 'extend.top' ||
				linkType === 'extend.left' ||
				linkType === 'extend.bottom' ||
				linkType === 'extend.right');
    },
    isFlexionalTypeLink: function (linkType) {
        return linkType && (linkType === 'flexional' ||
				linkType === 'flexional.horizontal' ||
			linkType === 'flexional.vertical');
    },
    calculateControlPoint: function (linkType, isHorizontal, sourceBounds, targetBounds, link) {
        if (linkType === 'orthogonal.H.V' || linkType === 'orthogonal.V.H') {
            return { x: targetBounds.x + targetBounds.width / 2, y: targetBounds.y + targetBounds.height / 2 };
        }
        var splitLocation;
        if ($link.isExtendTypeLink(linkType)) {
            var top = Math.min(sourceBounds.y, targetBounds.y);
            var left = Math.min(sourceBounds.x, targetBounds.x);
            var bottom = Math.max(sourceBounds.y + sourceBounds.height, targetBounds.y + targetBounds.height);
            var right = Math.max(sourceBounds.x + sourceBounds.width, targetBounds.x + targetBounds.width);
            splitLocation = link.getStyle('link.extend');
            if (linkType === 'extend.top') {
                return { x: (left + right) / 2, y: top - splitLocation };
            }
            if (linkType === 'extend.left') {
                return { x: left - splitLocation, y: (top + bottom) / 2 };
            }
            if (linkType === 'extend.bottom') {
                return { x: (left + right) / 2, y: bottom + splitLocation };
            }
            if (linkType === 'extend.right') {
                return { x: right + splitLocation, y: (top + bottom) / 2 };
            }
        }
        var splitByPercent = $link.isSplitByPercent(linkType, link);

        splitLocation = splitByPercent ? $link.calculateSplitValueByPercent(linkType, isHorizontal, sourceBounds, targetBounds, link.getStyle('link.split.percent')) :
				(link.getStyle('link.split.value'));
        if (splitLocation === Number.NEGATIVE_INFINITY || splitLocation === Number.POSITIVE_INFINITY) {
            return { x: targetBounds.x + targetBounds.width / 2, y: targetBounds.y + targetBounds.height / 2 };
        }
        if (splitLocation === 0) {
            return { x: sourceBounds.x + sourceBounds.width / 2, y: sourceBounds.y + sourceBounds.height / 2 };
        }
        if (isHorizontal) {
            var isLeft = (sourceBounds.x + sourceBounds.x + sourceBounds.width) < (targetBounds.x + targetBounds.x + targetBounds.width);
            return { x: $link.calculateSplitLocation(isLeft, splitLocation, sourceBounds.x, sourceBounds.width), y: sourceBounds.y + sourceBounds.height / 2 };
        }
        var isTop = (sourceBounds.y + sourceBounds.y + sourceBounds.height) < (targetBounds.y + targetBounds.y + targetBounds.height);
        return { x: sourceBounds.x + sourceBounds.width / 2, y: $link.calculateSplitLocation(isTop, splitLocation, sourceBounds.y, sourceBounds.height) };
    },
    calculateGap: function (sourceLeft, sourceRight, targetLeft, targetRight) {
        var sumWidth = Math.max(sourceRight, targetRight) - Math.min(sourceLeft, targetLeft);
        return sumWidth - (sourceRight - sourceLeft + targetRight - targetLeft);
    },
    calculateXGap: function (sourceBounds, targetBounds) {
        var sumWidth = Math.max(sourceBounds.x + sourceBounds.width, targetBounds.x + targetBounds.width) - Math.min(sourceBounds.x, targetBounds.x);
        return sumWidth - sourceBounds.width - targetBounds.width;
    },
    calculateYGap: function (sourceBounds, targetBounds) {
        var sumHeight = Math.max(sourceBounds.y + sourceBounds.height, targetBounds.y + targetBounds.height) - Math.min(sourceBounds.y, targetBounds.y);
        return sumHeight - sourceBounds.height - targetBounds.height;
    },
    calculateSplitValueByPercent: function (linkType, isHorizontal, sourceBounds, targetBounds, splitPercent) {
        var gap = $link.calculateSplitGapByPercent(splitPercent, isHorizontal, sourceBounds, targetBounds);
        return gap * splitPercent;
    },
    calculateSplitGapByPercent: function (splitPercent, isHorizontal, sourceBounds, targetBounds, point) {
        if (isHorizontal) {
            return $link._calculateSplitGapByPercent(splitPercent, sourceBounds.x, sourceBounds.x + sourceBounds.width, targetBounds.x, targetBounds.x + targetBounds.width);
        } else {
            return $link._calculateSplitGapByPercent(splitPercent, sourceBounds.y, sourceBounds.y + sourceBounds.height, targetBounds.y, targetBounds.y + targetBounds.height);
        }
    },
    _calculateSplitGapByPercent: function (splitPercent, sourceLeft, sourceRight, targetLeft, targetRight) {
        var xGap = $link.calculateGap(sourceLeft, sourceRight, targetLeft, targetRight);
        var isLeft = (sourceLeft + sourceRight) < (targetLeft + targetRight);
        if (xGap > 0) {
            if (splitPercent === 1) {
                return xGap + (targetRight - targetLeft) / 2;
            }
            if (splitPercent >= 0 && splitPercent < 1) {
                return xGap;
            }
            if (splitPercent < 0) {
                if (isLeft) {
                    return targetLeft - sourceLeft;
                }
                return sourceRight - targetRight;
            }
        }
        if ((isLeft && splitPercent > 0) || (!isLeft && splitPercent < 0)) {
            return Math.abs(sourceRight - targetRight);
        }
        return Math.abs(sourceLeft - targetLeft);
    },
    calculateSplitPercentByControlPoint: function (point, isHorizontal, sourceBounds, targetBounds) {
        if (isHorizontal) {
            return $link.calculateSplitPercent(point.x, sourceBounds.x, sourceBounds.x + sourceBounds.width, targetBounds.x, targetBounds.x + targetBounds.width);
        } else {
            return $link.calculateSplitPercent(point.y, sourceBounds.y, sourceBounds.y + sourceBounds.height, targetBounds.y, targetBounds.y + targetBounds.height);
        }
    },
    calculateSplitPercent: function (x, sourceLeft, sourceRight, targetLeft, targetRight) {
        if (x >= sourceLeft && x <= sourceRight) {
            return 0;
        }
        var xGap = $link.calculateGap(sourceLeft, sourceRight, targetLeft, targetRight);
        if (xGap > 0 && x >= targetLeft && x <= targetRight) {
            return 1;
        }
        var isLeft = (sourceLeft + sourceRight) < (targetLeft + targetRight);
        if (xGap > 0) {
            if (x > Math.min(sourceRight, targetRight) && x < Math.max(sourceLeft, targetLeft)) {
                return Math.abs(x - (isLeft ? sourceRight : sourceLeft)) / xGap;
            }
            if (isLeft) {
                if (x < sourceLeft) {
                    return (x - sourceLeft) / (targetLeft - sourceLeft);
                }
            } else {
                if (x > sourceRight) {
                    return (sourceRight - x) / (sourceRight - targetRight);
                }
            }
        }
        if (x > sourceRight) {
            return (isLeft ? x - sourceRight : sourceRight - x) / Math.abs(sourceRight - targetRight);
        }
        return (isLeft ? x - sourceLeft : sourceLeft - x) / (Math.abs(sourceLeft - targetLeft));
    },
    calculateSplitLocation: function (sourceAtLeftOrTop, splitDistance, x, width) {
        if (sourceAtLeftOrTop === (splitDistance > 0)) {
            return x + width + Math.abs(splitDistance);
        } else {
            return x - Math.abs(splitDistance);
        }
    },
    calculateAngle: function (dx, dy) {
        if (dx !== 0 && dy !== 0) {
            return Math.atan2(dx, dy);
        }
        if (dx === 0) {
            if (dy > 0) {
                return 0;
            }
            if (dy < 0) {
                return Math.PI;
            }
        }
        if (dx > 0) {
            return Math.PI / 2;
        }
        return -Math.PI / 2;
    },
    drawCorner: function (points, link) {
        var pointCount = points.size();
        if (pointCount < 3) {
            return;
        }
        var cornerType = link.getStyle('link.corner');
        if (cornerType === 'none') {
            return;
        }
        var cornerRadiusX = link.getStyle('link.xradius');
        var cornerRadiusY = link.getStyle('link.yradius');

        var _cornerX, _cornerY;
        var previousPoint = points.get(0);
        var currentPoint = points.get(1);
        var fromPoint, toPoint;

        for (var index = 2; index < pointCount; index++) {
            var nextPoint = points.get(index);
            var dx1 = currentPoint.x - previousPoint.x;
            var dy1 = currentPoint.y - previousPoint.y;
            var dx2 = nextPoint.x - currentPoint.x;
            var dy2 = nextPoint.y - currentPoint.y;

            var isH1 = dy1 === 0;
            if ((dx1 === 0 && dy2 === 0) || (dy1 === 0 && dx2 === 0)) {
                if (isH1) {
                    _cornerX = Math.min(index === 2 ? Math.abs(dx1) : Math.abs(dx1) / 2, cornerRadiusX);
                    _cornerY = Math.min(index === pointCount - 1 ? Math.abs(dy2) : Math.abs(dy2) / 2, cornerRadiusY);
                    fromPoint = { x: currentPoint.x - (dx1 > 0 ? _cornerX : -_cornerX), y: currentPoint.y };
                    toPoint = { x: currentPoint.x, y: currentPoint.y + (dy2 > 0 ? _cornerY : -_cornerY) };
                } else {
                    _cornerX = Math.min(index === pointCount - 1 ? Math.abs(dx2) : Math.abs(dx2) / 2, cornerRadiusX);
                    _cornerY = Math.min(index === 2 ? Math.abs(dy1) : Math.abs(dy1) / 2, cornerRadiusY);
                    fromPoint = { x: currentPoint.x, y: currentPoint.y - (dy1 > 0 ? _cornerY : -_cornerY) };
                    toPoint = { x: currentPoint.x + (dx2 > 0 ? _cornerX : -_cornerX), y: currentPoint.y }
                }
                points.remove(currentPoint);
                index--;
                pointCount--;
                if (fromPoint.x !== previousPoint.x || fromPoint.y !== previousPoint.y) {
                    points.add(fromPoint, index);
                    index++;
                    pointCount++;
                }
                if (cornerType === 'bevel') {
                    points.add(toPoint, index);
                    index++;
                    pointCount++;
                } else if (cornerType === 'round') {
                    var newPoints = new $List();
                    newPoints.add(currentPoint);
                    newPoints.add(toPoint);
                    points.add(newPoints, index);
                    index++;
                    pointCount++;
                }
            }
            previousPoint = currentPoint;
            currentPoint = nextPoint;
        }
        if (toPoint && toPoint.x === currentPoint.x && toPoint.y === currentPoint.y) {
            points.remove(currentPoint);
        }
    },
    orthogonal: function (linkType, source, target, result, isHorizontal, link) {
        ///control point
        var controlPoint = link.getStyle('link.control.point');
        var centerPriority = controlPoint == null;

        if (controlPoint) {
            var linkBounds = $math.unionRect(source, target);
            if (!$math.containsPoint(linkBounds, controlPoint)) {
                isHorizontal = $link.calculateIsHorizontalByControlPoint(controlPoint.x, controlPoint.y, linkBounds.y, linkBounds.x, linkBounds.y + linkBounds.height, linkBounds.x + linkBounds.width);
            }
        } else {
            controlPoint = $link.calculateControlPoint(linkType, isHorizontal, source, target, link);
        }

        if (isHorizontal) {
            $link.sideToSide(source, target, controlPoint, result, centerPriority);
        } else {
            $link.topToBottom(source, target, controlPoint, result, centerPriority);
        }
    },
    calculateIsHorizontalByControlPoint: function (x, y, top, left, bottom, right) {
        if ((y < top && top - y > left - x && top - y > x - right) || (y > bottom && y - bottom > left - x && y - bottom > x - right)) {
            return false;
        }
        return true;
    },
    contains: function (rect, x, y) {
        return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
    },
    topToBottom: function (source, target, controlPoint, result, centerPriority) {
        var t = Math.max(source.y, target.y);
        var b = Math.min(source.y + source.height, target.y + target.height);
        var y = controlPoint ? controlPoint.y : b + (t - b) / 2;
        var x1 = source.x + source.width / 2;
        var x2 = target.x + target.width / 2;
        if (!centerPriority && controlPoint) {
            if (controlPoint.x >= source.x && controlPoint.x <= source.x + source.width) {
                x1 = controlPoint.x;
            }
            if (controlPoint.x >= target.x && controlPoint.x <= target.x + target.width) {
                x2 = controlPoint.x;
            }
        }
        if (!$link.contains(target, x1, y) && !$link.contains(source, x1, y)) {
            result.add({ x: x1, y: y });
        }
        if (!$link.contains(target, x2, y) && !$link.contains(source, x2, y)) {
            result.add({ x: x2, y: y });
        }
        if (result.size() === 0) {
            if (controlPoint) {
                if (!$link.contains(target, controlPoint.x, y) && !$link.contains(source, controlPoint.x, y)) {
                    result.add({ x: controlPoint.x, y: y });
                }
            } else {
                var l = Math.max(source.x, target.x);
                var r = Math.min(source.x + source.width, target.x + target.width);
                result.add({ x: l + (r - l) / 2, y: y });
            }
        }
    },
    sideToSide: function (source, target, controlPoint, result, centerPriority) {
        var l = Math.max(source.x, target.x);
        var r = Math.min(source.x + source.width, target.x + target.width);
        var x = controlPoint ? controlPoint.x : r + (l - r) / 2;
        var y1 = source.y + source.height / 2;
        var y2 = target.y + target.height / 2;
        if (!centerPriority && controlPoint) {
            if (controlPoint.y >= source.y && controlPoint.y <= source.y + source.height) {
                y1 = controlPoint.y;
            }
            if (controlPoint.y >= target.y && controlPoint.y <= target.y + target.height) {
                y2 = controlPoint.y;
            }
        }
        if (!$link.contains(target, x, y1) && !$link.contains(source, x, y1)) {
            result.add({ x: x, y: y1 });
        }
        if (!$link.contains(target, x, y2) && !$link.contains(source, x, y2)) {
            result.add({ x: x, y: y2 });
        }
        if (result.size() === 0) {
            if (controlPoint) {
                if (!$link.contains(target, x, controlPoint.y) && !$link.contains(source, x, controlPoint.y)) {
                    result.add({ x: x, y: controlPoint.y });
                }
            } else {
                var t = Math.max(source.y, target.y);
                var b = Math.min(source.y + source.height, target.y + target.height);
                result.add({ x: x, y: t + (b - t) / 2 });
            }
        }
    },
    flexionalHorizontal: function (source, target, result, segment) {
        var isSourceLeft = target.x + target.width < source.x;
        var isTargetLeft = source.x + source.width < target.x;

        var x0 = (isSourceLeft) ? source.x : source.x + source.width;
        var y0 = source.y + source.height / 2;
        var xe = (isTargetLeft) ? target.x : target.x + target.width;
        var ye = target.y + target.height / 2;
        var seg = segment;

        var dx = (isSourceLeft) ? -seg : seg;
        var dep = { x: x0 + dx, y: y0 };
        dx = (isTargetLeft) ? -seg : seg;
        var arr = { x: xe + dx, y: ye };
        if (isSourceLeft === isTargetLeft) {
            var x = (isSourceLeft) ? Math.min(x0, xe) - segment : Math.max(x0, xe) + segment;
            result.add({ x: x, y: y0 });
            result.add({ x: x, y: ye });
        } else if ((dep.x < arr.x) === isSourceLeft) {
            var midY = y0 + (ye - y0) / 2;
            result.add(dep);
            result.add({ x: dep.x, y: midY });
            result.add({ x: arr.x, y: midY });
            result.add(arr);
        } else {
            result.add(dep);
            result.add(arr);
        }
    },
    flexionalVertical: function (source, target, result, segment) {
        var isSourceTop = target.y + target.height < source.y;
        var isTargetTop = source.y + source.height < target.y;

        var x0 = source.x + source.width / 2;
        var y0 = (isSourceTop) ? source.y : source.y + source.height;
        var xe = target.x + target.width / 2;
        var ye = (isTargetTop) ? target.y : target.y + target.height;
        var seg = segment;

        var dy = (isSourceTop) ? -seg : seg;
        var dep = { x: x0, y: y0 + dy };
        dy = (isTargetTop) ? -seg : seg;
        var arr = { x: xe, y: ye + dy };
        if (isSourceTop === isTargetTop) {
            var y = (isSourceTop) ? Math.min(y0, ye) - segment : Math.max(y0, ye) + segment;
            result.add({ x: x0, y: y });
            result.add({ x: xe, y: y });
        } else if ((dep.y < arr.y) === isSourceTop) {
            var midX = x0 + (xe - x0) / 2;
            result.add(dep);
            result.add({ x: midX, y: dep.y });
            result.add({ x: midX, y: arr.y });
            result.add(arr);
        } else {
            result.add(dep);
            result.add(arr);
        }
    },
    rectanglePerimeter: function (bounds, isSource, next) {
        var cx = bounds.x + bounds.width / 2;
        var cy = bounds.y + bounds.height / 2;
        var dx = next.x - cx;
        var dy = next.y - cy;
        var alpha = Math.atan2(dy, dx);
        var p = { x: 0, y: 0 };
        var pi = Math.PI;
        var pi2 = Math.PI / 2;
        var beta = pi2 - alpha;
        var t = Math.atan2(bounds.height, bounds.width);
        if (alpha < -pi + t || alpha > pi - t) {
            p.x = bounds.x;
            p.y = cy - bounds.width * Math.tan(alpha) / 2;
        } else if (alpha < -t) {
            p.y = bounds.y;
            p.x = cx - bounds.height * Math.tan(beta) / 2;
        } else if (alpha < t) {
            p.x = bounds.x + bounds.width;
            p.y = cy + bounds.width * Math.tan(alpha) / 2;
        } else {
            p.y = bounds.y + bounds.height;
            p.x = cx + bounds.height * Math.tan(beta) / 2;
        }
        if (next.x >= bounds.x && next.x <= bounds.x + bounds.width) {
            p.x = next.x;
        } else if (next.y >= bounds.y && next.y <= bounds.y + bounds.height) {
            p.y = next.y;
        }
        if (next.x < bounds.x) {
            p.x = bounds.x;
        } else if (next.x > bounds.x + bounds.width) {
            p.x = bounds.x + bounds.width;
        }
        if (next.y < bounds.y) {
            p.y = bounds.y;
        } else if (next.y > bounds.y + bounds.height) {
            p.y = bounds.y + bounds.height;
        }
        return p;
    },
    isSplitTypeLink: function (type) {
        return type && (type === 'orthogonal' ||
				type === 'orthogonal.horizontal' ||
				type === 'orthogonal.vertical');
    },
    isOrthogonalOrFlexionalLink: function (link) {
        if (link instanceof twaver.ShapeLink) {
            return false;
        }
        if (link.isLooped()) {
            return false;
        }
        var type = link.getStyle('link.type');
        return $link.isOrthogonalOrFlexionalType(type);
    },
    isOrthogonalLink: function (link) {
        if (link instanceof twaver.ShapeLink) {
            return false;
        }
        if (link.isLooped()) {
            return false;
        }
        var type = link.getStyle('link.type');
        return $link.isOrthogonalType(type);
    },
    isOrthogonalOrFlexionalType: function (type) {
        return type === 'orthogonal' ||
				type === 'orthogonal.horizontal' ||
				type === 'orthogonal.H.V' ||
				type === 'orthogonal.vertical' ||
				type === 'orthogonal.V.H' ||
				type === 'extend.top' ||
				type === 'extend.left' ||
				type === 'extend.bottom' ||
				type === 'extend.right' ||
				type === 'flexional' ||
				type === 'flexional.horizontal' ||
				type === 'flexional.vertical';
    },
    isOrthogonalType: function (type) {
        return type === 'orthogonal' ||
				type === 'orthogonal.horizontal' ||
				type === 'orthogonal.H.V' ||
				type === 'orthogonal.vertical' ||
				type === 'orthogonal.V.H' ||
				type === 'extend.top' ||
				type === 'extend.left' ||
				type === 'extend.bottom' ||
				type === 'extend.right';
    },
    hasControlPoint: function (linkType) {
        return linkType === 'orthogonal' ||
				linkType === 'orthogonal.horizontal' ||
				linkType === 'orthogonal.vertical' ||
				linkType === 'extend.bottom' ||
				linkType === 'extend.left' ||
				linkType === 'extend.right' ||
				linkType === 'extend.top';
    },
    getControlPoint: function (link, linkUI,zoomManager) {
        if (!link) {
            throw "link can't be null";
        }
        var linkType = link.getStyle('link.type');
        if (!$link.hasControlPoint(linkType)) {
            return null;
        }
        var controlPoint = link.getStyle('link.control.point');
        if (controlPoint) {
            return controlPoint;
        } else {
            var sourceBounds, targetBounds;
            if (linkUI == null) {
                sourceBounds = link.getFromAgent().getRect();
                targetBounds = link.getToAgent().getRect();
            } else {
                sourceBounds = $link.getLinkSourceBounds(linkUI,zoomManager);
                targetBounds = $link.getLinkTargetBounds(linkUI,zoomManager);
            }
            if (sourceBounds == null || targetBounds == null) {
                return null;
            }
            var horizontal = $link.isHorizontal(linkType, sourceBounds, targetBounds, link);
            return $link.calculateControlPoint(link.getStyle('link.type'), horizontal, sourceBounds, targetBounds, link);
        }
    },
    getSplitValueByControlPoint: function (point, linkType, sourceBounds, targetBounds, isHorizontal) {
        if (linkType === 'extend.top') {
            return Math.min(sourceBounds.y, targetBounds.y) - point.y;
        }
        if (linkType === 'extend.left') {
            return Math.min(sourceBounds.x, targetBounds.x) - point.x;
        }
        if (linkType === 'extend.bottom') {
            return point.y - Math.max(sourceBounds.y + sourceBounds.height, targetBounds.y + targetBounds.height);
        }
        if (linkType === 'extend.right') {
            return point.x - Math.max(sourceBounds.x + sourceBounds.width, targetBounds.x + targetBounds.width);
        }
        var splitValue;
        if (isHorizontal) {
            var isLeft = (sourceBounds.x + sourceBounds.x + sourceBounds.width) < (targetBounds.x + targetBounds.x + targetBounds.width);
            splitValue = isLeft ? point.x - sourceBounds.x + sourceBounds.width : sourceBounds.x - point.x;
            if (splitValue > 0) {
                return splitValue;
            }
            if (splitValue > -sourceBounds.width) {
                return 0;
            }
            return splitValue + sourceBounds.width;
        }
        var isTop = (sourceBounds.y + sourceBounds.y + sourceBounds.height) < (targetBounds.y + targetBounds.y + targetBounds.height);
        splitValue = isTop ? point.y - sourceBounds.y - sourceBounds.height : sourceBounds.y - point.y;
        if (splitValue > 0) {
            return splitValue;
        }
        if (splitValue > -sourceBounds.height) {
            return 0;
        }
        return splitValue + sourceBounds.height;
    },
    isHorizontalByControlPoint: function (controlPoint, linkType, sourceBounds, targetBounds, link) {
        var linkBounds = $math.unionRect(sourceBounds, targetBounds);
        if (!$math.containsPoint(linkBounds, controlPoint)) {
            return $link.calculateIsHorizontalByControlPoint(controlPoint.x, controlPoint.y, linkBounds.y, linkBounds.x, linkBounds.y + linkBounds.height, linkBounds.x + linkBounds.width);
        }
        return $link.isHorizontal(linkType, sourceBounds, targetBounds, link);
    },
    setParamsByControlPoint: function (point, sourceBounds, targetBounds, linkType, link) {
        var isHorizontal = $link.isHorizontalByControlPoint(point, linkType, sourceBounds, targetBounds, link);
        var controlPoint = link.getStyle('link.control.point');
        if (controlPoint || linkType === 'orthogonal' ||
				linkType === 'orthogonal.horizontal' ||
				linkType === 'orthogonal.vertical') {
            link.setStyle('link.type', isHorizontal ? 'orthogonal.horizontal' : 'orthogonal.vertical');
        }
        if (controlPoint) {
            link.setStyle('link.control.point', point);
            return;
        }

        var splitValue = $link.getSplitValueByControlPoint(point, linkType, sourceBounds, targetBounds, isHorizontal);
        if ($link.isExtendTypeLink(linkType)) {
            link.setStyle('link.extend', splitValue);
            return;
        }
        var splitByPercent = $link.isSplitByPercent(linkType, link);
        if (!splitByPercent) {
            link.setStyle('link.split.value', splitValue);
            return;
        }
        if (splitValue === 0) {
            link.setStyle('link.split.percent', 0);
            return;
        }
        link.setStyle('link.split.percent', $link.calculateSplitPercentByControlPoint(point, isHorizontal, sourceBounds, targetBounds));
    },
    getLinkNodeBounds: function (elementUI, xOffset, yOffset, atEdge, positionType ,zoomManager) {
        if(zoomManager){
            var locationZoom = zoomManager.getLocationZoom();
            var sizeZoom = zoomManager.getSizeZoom(elementUI);
        }
        if (elementUI == null) {
            return null;
        }
        var bounds;
        if (!atEdge) {
            var position = elementUI.getNetwork().getPosition(positionType, elementUI, null, xOffset, yOffset);
            if(zoomManager){
                bounds = { x: position.x * locationZoom, y: position.y * locationZoom, width: 1, height: 1 };
            }else{
                bounds = { x: position.x, y: position.y, width: 1, height: 1 };
            }
        } else {
            if(zoomManager){
                bounds = elementUI.getZoomBodyRect();
                bounds.x += xOffset;
                bounds.y += yOffset;
            }else {
                bounds = elementUI.getBodyRect();
                bounds.x += xOffset;
                bounds.y += yOffset;
            }
        }
        return bounds;
    },
    getLinkSourceBounds: function (ui ,zoomManager) {
        var link = ui._element;
        var source = ui.getNetwork().getElementUI(link.getFromAgent());
        if (source == null) {
            return null;
        }
        var fromPosition = link.getStyle('link.from.position');
        var fromXoffset = link.getStyle('link.from.xoffset');
        var fromYoffset = link.getStyle('link.from.yoffset');
        var isFromLinkAtEdge = link.getStyle('link.from.at.edge');
        return $link.getLinkNodeBounds(source, fromXoffset, fromYoffset, isFromLinkAtEdge, fromPosition ,zoomManager);
    },
    getLinkTargetBounds: function (ui ,zoomManager) {
        var link = ui._element;
        var target = ui.getNetwork().getElementUI(link.getToAgent());
        if (target == null) {
            return null;
        }
        var toPosition = link.getStyle('link.to.position');
        var toXoffset = link.getStyle('link.to.xoffset');
        var toYoffset = link.getStyle('link.to.yoffset');
        var isToLinkAtEdge = link.getStyle('link.to.at.edge');
        return $link.getLinkNodeBounds(target, toXoffset, toYoffset, isToLinkAtEdge, toPosition ,zoomManager);
    },
    orthogonalAndFlexional: function (ui, linkType,zoomManager) {
        ///offset
        var sourceBounds = $link.getLinkSourceBounds(ui,zoomManager);
        if (sourceBounds == null) {
            return null;
        }
        var targetBounds = $link.getLinkTargetBounds(ui,zoomManager);
        if (targetBounds == null) {
            return null;
        }
        var points = $link.calculateOrthogonalAndFlexionalLinkPoints(linkType, sourceBounds, targetBounds, ui._element);

        ///link offset
        $link.offsetLink(ui, points);

        ///hot point
        ui.setHotSpot($link.calculateCenterPoint(points));

        ///draw corner
        if (linkType !== 'flexional') {
            $link.drawCorner(points, ui._element);
        }
        return points;
    },
    offsetLink: function (ui, points) {
        //when more than one links,need  bundle up or expand
        var link = ui._element;
        var isAgent = link.isBundleAgent();
        if (isAgent) {
            return;
        }
        var bundleOffset = $link.getBundleGap(ui, false);
        if (bundleOffset === 0) {
            return;
        }

        //my gad
        var oldAngle, currentAngle;
        var xAgainstDirection = false, yAgainstDirection = false;
        var previousPoint = points.get(0);
        var originalityPreviousPoint = _twaver.clone(previousPoint);

        for (var index = 1, count = points.size(); index < count; index++) {
            var point = points.get(index);
            var dx = point.x - originalityPreviousPoint.x;
            var dy = point.y - originalityPreviousPoint.y;
            originalityPreviousPoint = _twaver.clone(point);
            currentAngle = $link.calculateAngle(dx, dy);

            if (dx === 0) {
                if ((currentAngle - oldAngle) % Math.PI === 0 && (currentAngle - oldAngle) % (2 * Math.PI) !== 0) {
                    xAgainstDirection = !xAgainstDirection;
                    if (xAgainstDirection) {
                        dy = -dy;
                    }
                }
                if ((currentAngle - oldAngle) % Math.PI !== 0) {
                    previousPoint.x += dy < 0 ? bundleOffset : -bundleOffset;
                }
                point.x += dy < 0 ? bundleOffset : -bundleOffset;
            } else if (dy === 0) {
                if ((currentAngle - oldAngle) % Math.PI === 0 && (currentAngle - oldAngle) % (2 * Math.PI) !== 0) {
                    yAgainstDirection = !yAgainstDirection;
                    if (yAgainstDirection) {
                        dx = -dx;
                    }
                }
                if (!oldAngle || (currentAngle - oldAngle) % Math.PI !== 0) {
                    previousPoint.y -= dx < 0 ? bundleOffset : -bundleOffset;
                }
                point.y -= dx < 0 ? bundleOffset : -bundleOffset;
            }
            oldAngle = currentAngle;
            previousPoint = point;
        }
    },
    _getPointAngleDegree: function (x1, y1, x2, y2) {
        var xOffset = x2 - x1;
        var yOffset = y2 - y1;
        var angle = Math.atan2(yOffset, xOffset);
        angle = angle / Math.PI * 180;
        angle = parseInt(angle) + 180;
        angle = angle % 360;

        return angle;
    }
};
_twaver.link = $link;
