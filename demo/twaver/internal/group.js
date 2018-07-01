var $group = {
    getPoints: function (rects) {
        var points = new $List();
        rects.forEach(function (rect) {
            points.add({ x: rect.x, y: rect.y });
            points.add({ x: rect.x + rect.width, y: rect.y + rect.height });
            points.add({ x: rect.x + rect.width, y: rect.y });
            points.add({ x: rect.x, y: rect.y + rect.height });
        });
        return points;
    },
    rectangle: function (rects) {
        var rect;
        rects.forEach(function (r) {
            rect = $math.unionRect(rect, r);
        });
        return rect;
    },
    oval: function (rects) {
        var unionRect = $group.rectangle(rects);
        var maxWidth = 0;
        var a = unionRect.height / unionRect.width;
        var a2 = a * a;
        var cx = unionRect.x + unionRect.width / 2;
        var cy = unionRect.y + unionRect.height / 2;
        var points = $group.getPoints(rects);
        points.forEach(function (point) {
            var x = point.x - cx;
            var y = point.y - cy;
            var width = x * x + y * y / a2;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        maxWidth = Math.sqrt(maxWidth);
        var maxHeight = a * maxWidth;
        return { x: cx - maxWidth, y: cy - maxHeight, width: maxWidth * 2, height: maxHeight * 2 };
    },
    circle: function (rects) {
        var unionRect = $group.rectangle(rects);
        var maxRadius = 0;
        var cx = unionRect.x + unionRect.width / 2;
        var cy = unionRect.y + unionRect.height / 2;
        var points = $group.getPoints(rects);
        points.forEach(function (point) {
            var x = point.x - cx;
            var y = point.y - cy;
            var radius = x * x + y * y;
            if (radius > maxRadius) {
                maxRadius = radius;
            }
        });
        maxRadius = Math.sqrt(maxRadius);
        return { x: cx - maxRadius, y: cy - maxRadius, width: maxRadius * 2, height: maxRadius * 2 };
    },
    roundrect: function (rects) {
        var rect = $group.rectangle(rects);
        var r = Math.min(rect.width, rect.height) / 16;
        $math.grow(rect, r, r);
        return rect;
    },
    star: function (rects) {
        var rect = $group.rectangle(rects);
        $math.grow(rect, rect.width, rect.height);
        return rect;
    },
    triangle: function (rects) {
        var rect = $group.rectangle(rects);
        rect.x -= rect.width / 2;
        rect.width *= 2;
        rect.y -= rect.height;
        rect.height *= 2;
        return rect;
    },
    hexagon: function (rects) {
        var rect = $group.rectangle(rects);
        rect.x -= rect.width / 2;
        rect.width *= 2;
        return rect;
    },
    pentagon: function (rects) {
        var rect = $group.rectangle(rects);
        rect.x -= rect.width / 6;
        rect.width += rect.width / 3;
        rect.y -= rect.height / 4;
        rect.height += rect.height / 4;
        return rect;
    },
    diamond: function (rects) {
        var rect = $group.rectangle(rects);
        rect.x -= rect.width / 2;
        rect.width += rect.width;
        rect.y -= rect.height / 2;
        rect.height += rect.height;
        return rect;
    }

};
_twaver.group = $group;
