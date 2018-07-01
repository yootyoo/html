var $g = {
    cache: {},
    g: $html.createCanvas().getContext('2d'),
    getTextSize: function (font, text) {
        $g.g.font = font ? font : $Defaults.FONT;
        var h = $g.cache[$g.g.font];
        if (!h) {
            h = $g.g.measureText('e').width * 2 + 4;
            $g.cache[$g.g.font] = h;
        }
        text = text || '';
        text = String(text);
        var lines = text.split('\n'),
            lineCount = lines.length,
            maxWidth = 0,
            width;
        for (var i = lineCount - 1; i >= 0; i--) {
            width = $g.g.measureText(lines[i]).width;
            width > maxWidth && (maxWidth = width);
        }
        return { width: maxWidth + 4, height: h * lineCount };
    },
    drawText: function (g, text, rect, font, color, align) {
        text = text || '';
        text = String(text);
        if (!font) {
            font = $Defaults.FONT;
        }
        var textAlign = "center";
        if(align) {
            textAlign = align;
        }
        g.font = font;
        g.fillStyle = color;
        g.textAlign = textAlign;
        g.textBaseline = 'middle';
        var lines = text.split('\n'),
            lineCount = lines.length,
            height = 0,
            x, y;
        if (!rect) {
            x = 0;
            y = 0;
        } else if (rect.width === undefined) {
            x = rect.x;
            y = rect.y;
        } else {
            height = rect.height / lineCount;
            if(textAlign == "left") {
                x = rect.x;
            } else if(textAlign == "center") {
                x = rect.x + rect.width / 2;
            }
            y = rect.y + height / 2;
        }
        if ($ua.isOpera) {
            y -= 2;
        }
        for (var i = 0; i < lineCount; i++) {
            if(textAlign == "right") {
                g.textAlign = "left";
                x = rect.x + rect.width - $g.getTextSize(font,lines[i]).width;
            }
            g.fillText(lines[i], x, y);
            y += height;
        }
    },
    drawArc: function (g, x, y, startAngle, arc, radius, yRadius, continueFlag) {
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

            if (continueFlag) {
                g.lineTo(ax, ay);
            } else {
                g.moveTo(ax, ay);
            }

            for (var i = 0; i < segs; i++) {
                angle += theta;
                angleMid = angle - theta / 2;

                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                g.quadraticCurveTo(cx, cy, bx, by);
            }
        }
    },
    dashedLine: function (g, pattern, drawingState, x0, y0, x1, y1) {
        var dX = x1 - x0;
        var dY = y1 - y0;
        var len = Math.sqrt(dX * dX + dY * dY);
        if (len == 0) {
            return;
        }
        dX /= len;
        dY /= len;
        var tMax = len;

        var t = -drawingState.offset;
        var bDrawing = drawingState.drawing;
        var patternIndex = drawingState.patternIndex;
        while (t < tMax) {
            t += pattern[patternIndex];
            if (t >= tMax) {
                drawingState.offset = pattern[patternIndex] - (t - tMax);
                drawingState.patternIndex = patternIndex;
                drawingState.drawing = bDrawing;
                t = tMax;
            }

            if (bDrawing) {
                g.lineTo(x0 + t * dX, y0 + t * dY);
            } else {
                g.moveTo(x0 + t * dX, y0 + t * dY);
            }

            bDrawing = !bDrawing;
            patternIndex = (patternIndex + 1) % pattern.length;
        }
    },
    drawLinePoints: function (g, points, pattern, segments, close) {
        var pointIndex = 0, segment, p0, p1, p2, segmentCount, segmentIndex = 0, dashedLine, pointCount = points.size();
        if (pattern && pattern.length > 0) {
            dashedLine = new $DashedLine(g, pattern[0], pattern.length > 1 ? pattern[1] : pattern[0]);
        } else {
            dashedLine = g;
        }
        if (segments) {
            for (segmentIndex = 0, segmentCount = segments.size(); segmentIndex < segmentCount; segmentIndex++) {
                segment = segments.get(segmentIndex);
                if ('moveto' === segment && pointIndex < pointCount) {
                    p0 = points.get(pointIndex++);
                    dashedLine.moveTo(p0.x, p0.y);
                } else if ('lineto' === segment && pointIndex < pointCount) {
                    p0 = points.get(pointIndex++);
                    dashedLine.lineTo(p0.x, p0.y);
                } else if ('cubicto' === segment && pointIndex < pointCount - 2) {
                    p0 = points.get(pointIndex++);
                    p1 = points.get(pointIndex++);
                    p2 = points.get(pointIndex++);
                    dashedLine.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
                } else if ('quadto' === segment && pointIndex < pointCount - 1) {
                    p0 = points.get(pointIndex++);
                    p1 = points.get(pointIndex++);
                    dashedLine.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
                } else {
                    throw "Can not resolve segment '" + segment + "'";
                }
            }
        } else {
            this._drawLine(points, dashedLine);
        }
        if (close) {
            dashedLine.closePath();
        }
    },
    _drawLine: function (points, g) {
        var pointIndex = 0, p0, p1, p2, s, value, pointCount = points.size();
        p0 = points.get(0);
        g.moveTo(p0.x, p0.y);
        for (pointIndex = 1; pointIndex < pointCount; pointIndex++) {
            value = points.get(pointIndex);
            if (value.size) {
                s = value.size();
                if (s === 2) {
                    p0 = value.get(0);
                    p1 = value.get(1);
                    g.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
                } else if (s === 3) {
                    p0 = value.get(0);
                    p1 = value.get(1);
                    p2 = value.get(2);
                    g.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
                }
            } else {
                g.lineTo(value.x, value.y);
            }
        }
    },
    drawRoundRect: function (g, x, y, width, height,
											topLeftRadius, topRightRadius,
											bottomLeftRadius, bottomRightRadius) {
        if (arguments.length === 6) {
            topRightRadius = topLeftRadius;
            bottomLeftRadius = topLeftRadius;
            bottomRightRadius = topLeftRadius;
        }

        var xw = x + width;
        var yh = y + height;

        // Make sure none of the radius values are greater than w/h.
        // These are all inlined to avoid function calling overhead
        var minSize = width < height ? width * 2 : height * 2;
        topLeftRadius = topLeftRadius < minSize ? topLeftRadius : minSize;
        topRightRadius = topRightRadius < minSize ? topRightRadius : minSize;
        bottomLeftRadius = bottomLeftRadius < minSize ? bottomLeftRadius : minSize;
        bottomRightRadius = bottomRightRadius < minSize ? bottomRightRadius : minSize;

        // bottom-right corner
        var a = bottomRightRadius * 0.292893218813453;
        var s = bottomRightRadius * 0.585786437626905;
        g.moveTo(xw, yh - bottomRightRadius);
        g.quadraticCurveTo(xw, yh - s, xw - a, yh - a);
        g.quadraticCurveTo(xw - s, yh, xw - bottomRightRadius, yh);

        // bottom-left corner
        a = bottomLeftRadius * 0.292893218813453;
        s = bottomLeftRadius * 0.585786437626905;
        g.lineTo(x + bottomLeftRadius, yh);
        g.quadraticCurveTo(x + s, yh, x + a, yh - a);
        g.quadraticCurveTo(x, yh - s, x, yh - bottomLeftRadius);

        // top-left corner
        a = topLeftRadius * 0.292893218813453;
        s = topLeftRadius * 0.585786437626905;
        g.lineTo(x, y + topLeftRadius);
        g.quadraticCurveTo(x, y + s, x + a, y + a);
        g.quadraticCurveTo(x + s, y, x + topLeftRadius, y);

        // top-right corner
        a = topRightRadius * 0.292893218813453;
        s = topRightRadius * 0.585786437626905;
        g.lineTo(xw - topRightRadius, y);
        g.quadraticCurveTo(xw - s, y, xw - a, y + a);
        g.quadraticCurveTo(xw, y + s, xw, y + topRightRadius);
        g.lineTo(xw, yh - bottomRightRadius);
    },
    drawVector: function (g, shape, pattern, x, y, w, h) {
        var roundRectRadius;
        if (arguments.length === 4) {
            y = x.y;
            w = x.width;
            h = x.height;
            x = x.x;
        }else if(arguments.length === 5){
            if(shape === "roundrect"){
                roundRectRadius = {};
                roundRectRadius.topLeft = y;
                roundRectRadius.topRight = y;
                roundRectRadius.bottomLeft = y;
                roundRectRadius.bottomRight = y;
                y = x.y;
                w = x.width;
                h = x.height;
                x = x.x;
            }
        }
        var func = $g['_' + shape];
        if (func) {
            g.beginPath();
            if (pattern && pattern.length > 0) {
                g = new $DashedLine(g, pattern[0], pattern.length > 1 ? pattern[1] : pattern[0]);
            }
            if(arguments.length === 5 && shape === "roundrect"){
                func(g, {x:x, y:y, width:w, height:h},roundRectRadius);
            }else{
                func(g, x, y, w, h);
            }
        }
    },
    _rectangle: function (g, x, y, w, h) {
        g.rect(x, y, w, h);
    },
    _circle: function (g, x, y, w, h) {
        var cx = x + w / 2, cy = y + h / 2, radius = Math.min(w, h) / 2;
        if (g instanceof $DashedLine) {
            $g.drawArc(g, cx, cy, 0, Math.PI * 2, radius, radius, false);
        } else {
            g.arc(cx, cy, radius, 0, Math.PI * 2, true);
        }
    },
    _oval: function (g, x, y, w, h) {
        if (g instanceof $DashedLine) {
            $g.drawArc(g, x + w / 2, y + h / 2, 0, Math.PI * 2, w / 2, h / 2, false);
        } else {
            var kappa = .5522848,
	        	ox = (w / 2) * kappa,
	            oy = (h / 2) * kappa,
	            xe = x + w,
	            ye = y + h,
	            xm = x + w / 2,
	            ym = y + h / 2;

            g.moveTo(x, ym);
            g.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            g.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            g.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            g.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        }
    },
    _roundrect: function (g, x, y, w, h) {
        if(arguments.length === 3){
            var roundRectRadius = y;
            y = x.y;
            w = x.width;
            h = x.height;
            x = x.x;
            if(roundRectRadius.topLeft){
                $g.drawRoundRect(g, x, y, w, h, roundRectRadius.topLeft);
            }else{
                $g.drawRoundRect(g, x, y, w, h, Math.min(Math.min(w, h) / 4, 10));
            }
        }else{
            $g.drawRoundRect(g, x, y, w, h, Math.min(Math.min(w, h) / 4, 10));
        }
    },
    _star: function (g, x, y, width, height) {
        var w = width * 2;
        var h = height * 2;
        var ox = x + width / 2;
        var oy = y + height / 2;

        g.moveTo(ox - w / 4.0, oy - h / 12.0);
        g.lineTo(x + width * 0.306, y + height * 0.579);
        g.lineTo(ox - w / 6.0, oy + h / 4.0);
        g.lineTo(x + width / 2, y + height * 0.733);
        g.lineTo(ox + w / 6.0, oy + h / 4.0);
        g.lineTo(x + width * 0.693, y + height * 0.579);
        g.lineTo(ox + w / 4.0, oy - h / 12.0);
        g.lineTo(x + width * 0.611, y + height * 0.332);
        g.lineTo(ox + 0.0, oy - h / 4.0);
        g.lineTo(x + width * 0.388, y + height * 0.332);
        g.closePath();
    },
    _triangle: function (g, x, y, w, h) {
        g.moveTo(x + w / 2, y);
        g.lineTo(x + w, y + h);
        g.lineTo(x, y + h);
        g.closePath();
    },
    _hexagon: function (g, x, y, w, h) {
        g.moveTo(x, y + h / 2);
        g.lineTo(x + w / 4, y + h);
        g.lineTo(x + w * 3 / 4, +y + h);
        g.lineTo(x + w, y + h / 2);
        g.lineTo(x + w * 3 / 4, y);
        g.lineTo(x + w / 4, y);
        g.closePath();
    },
    _pentagon: function (g, x, y, width, height) {
        var w = width * 2;
        var h = height * 2;
        var ox = x + width / 2;
        var oy = y + height / 2;
        g.moveTo(ox - w / 4.0, oy - h / 12.0);
        g.lineTo(ox - w / 6.0, oy + h / 4.0);
        g.lineTo(ox + w / 6.0, oy + h / 4.0);
        g.lineTo(ox + w / 4.0, oy - h / 12.0);
        g.lineTo(ox + 0.0, oy - h / 4.0);
        g.closePath();
    },
    _diamond: function (g, x, y, w, h) {
        g.moveTo(x + w / 2, y);
        g.lineTo(x, y + h / 2);
        g.lineTo(x + w / 2, y + h);
        g.lineTo(x + w, y + h / 2);
        g.closePath();
    },
    fill: function (g, fillColor, gradient, gradientColor, x, y, w, h) {
        var func = gradient_types[gradient];
        if (func) {
            if (arguments.length === 5) {
                g.fillStyle = func(g, fillColor, gradientColor, x.x, x.y, x.width, x.height);
            } else {
                g.fillStyle = func(g, fillColor, gradientColor, x, y, w, h);
            }
        } else {
            g.fillStyle = fillColor;
        }
    },
    createRadialGradient: function (g, fillColor, gradientColor, x, y, w, h, px, py) {
        var t = g.createRadialGradient(x + w * px, y + h * py, Math.min(w, h) / 24, x + w / 2, y + h / 2, Math.max(w, h) / 2);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    drawPath: function (ui, canvas, prefix, padding, pattern, points, segments, close) {
        var node = ui._element;
        var rect = ui.getBodyRect();
        if (padding) {
            $math.addPadding(rect, node, prefix + '.padding', 1);
        }
        var bounds = _twaver.clone(rect);
        var lineWidth = node.getStyle(prefix + '.outline.width');
        if (lineWidth > 0) {
            $math.grow(bounds, lineWidth / 2, lineWidth / 2);
        }
        var g = ui.setShadow(ui, canvas, bounds);
        if(node.getAngle() != 0) {
            if(!(node instanceof $Group)) {
                rect = node.getOriginalRect();
            }
            twaver.Util.rotateCanvas(g, rect, node.getAngle());
        }
        var fill = node.getStyle(prefix + '.fill');
        var fillColor;
        if (fill) {
            if (ui._innerColor && !$element.hasDefault(ui._element)) {
                fillColor = ui._innerColor;
            } else {
                fillColor = node.getStyle(prefix + '.fill.color');
            }
            var gradient = node.getStyle(prefix + '.gradient');
            if (gradient) {
                $g.fill(g, fillColor, gradient, node.getStyle(prefix + '.gradient.color'), rect);
            } else {
                g.fillStyle = fillColor;
            }
        }
        var shape = node.getStyle(prefix + '.shape');
        var roundRectRadiusValue = node.getStyle("group.shape.roundrect.radius");
        if (fill) {
            g.beginPath();
            if (points) {
                $g.drawLinePoints(g, points, null, segments, close);
            } else {
                if(shape === "roundrect" && prefix ==="group"){
                    $g.drawVector(g, shape, null, rect, roundRectRadiusValue);
                }else{
                    $g.drawVector(g, shape, null, rect);
                }
            }
            g.fill();
        }
        if (lineWidth > 0) {
            g.lineWidth = lineWidth;
            g.lineCap = node.getStyle(prefix + '.cap');
            g.lineJoin = node.getStyle(prefix + '.join');
            g.strokeStyle = node.getStyle(prefix + '.outline.color');
            g.beginPath();
            if (points) {
                $g.drawLinePoints(g, points, pattern, segments, close);
            } else {
                if(shape === "roundrect" && prefix ==="group"){
                    $g.drawVector(g, shape, pattern, rect, roundRectRadiusValue);
                }else{
                    $g.drawVector(g, shape, pattern, rect);
                };
            }
            g.stroke();
        }
        return bounds;
    },
    draw3DRect: function (g, color, deep, x, y, width, height) {
        if (deep === 0) {
            return;
        }
        if (arguments.length <= 4) {
            height = x.height;
            width = x.width;
            y = x.y;
            x = x.x;
        }
        var raised = deep > 0;
        deep = Math.abs(deep);

        var brighterColor;
        var darkerColor;
        g.lineWidth = 1;
        g.lineCap = 'square';
        if (deep === 1) {
            brighterColor = $g.brighter(color);
            darkerColor = $g.darker(color);

            g.strokeStyle = raised ? brighterColor : darkerColor;
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x, y + height);
            g.moveTo(x, y);
            g.lineTo(x + width, y);
            g.closePath();
            g.stroke();

            g.strokeStyle = raised ? darkerColor : brighterColor;
            g.beginPath();
            g.moveTo(x, y + height);
            g.lineTo(x + width, y + height);
            g.moveTo(x + width, y);
            g.lineTo(x + width, y + height);
            g.closePath();
            g.stroke();
        } else {
            var count = deep * 2;
            var step = 50.0 / count;
            for (var i = 0; i < count; i++) {
                brighterColor = $g.brighter(color, 50 - i * step);
                darkerColor = $g.darker(color, 50 - i * step);

                x += 0.5;
                y += 0.5;
                width -= 1;
                height -= 1;

                g.strokeStyle = raised ? brighterColor : darkerColor;
                g.beginPath();
                g.moveTo(x, y);
                g.lineTo(x, y + height);
                g.moveTo(x, y);
                g.lineTo(x + width, y);
                g.closePath();
                g.stroke();

                g.strokeStyle = raised ? darkerColor : brighterColor;
                g.beginPath();
                g.moveTo(x, y + height);
                g.lineTo(x + width, y + height);
                g.moveTo(x + width, y);
                g.lineTo(x + width, y + height);
                g.closePath();
                g.stroke();
            }
        }
    },
    brighter: function (color, degree) {
        if (!degree) {
            degree = 50;
        }
        return $g.adjustBrightness2(color, degree);
    },
    darker: function (color, degree) {
        if (!degree) {
            degree = 50;
        }
        return $g.adjustBrightness2(color, -degree);
    },
    adjustBrightness2: function (color, brite) {
        var r, g, b;

        if (brite === 0)
            return color;

        var rgb = getColorValue(color);
        if (brite < 0) {
            brite = (100 + brite) / 100;
            r = Math.ceil(rgb.r * brite);
            g = Math.ceil(rgb.g * brite);
            b = Math.ceil(rgb.b * brite);
        }
        else // bright > 0
        {
            brite /= 100;
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;

            r += ((0xFF - r) * brite);
            g += ((0xFF - g) * brite);
            b += ((0xFF - b) * brite);

            r = Math.min(Math.ceil(r), 255);
            g = Math.min(Math.ceil(g), 255);
            b = Math.min(Math.ceil(b), 255);
        }

        return 'rgba(' + r + ',' + g + ',' + b + ',1)';
    },
    getColorArray: function (color) {
        color_g.clearRect(0, 0, 1, 1);
        color_g.fillStyle = color;
        color_g.fillRect(0, 0, 1, 1);
        return color_g.getImageData(0, 0, 1, 1).data;
    },
    hit: function (c, x, y, grow) {
        if (!c) {
            return false;
        }
        var rect = c._viewRect;
        if (!rect) {
            return false;
        }
        //var targetRect = {x:x-grow,y:y-grow,width:2*grow,height:2*grow};
        x -= rect.x;
        y -= rect.y;
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
            return false;
        }
        try {
            var imageData = c.getContext('2d').getImageData(x, y, 1, 1);
            var pix = imageData.data;
            for (var i = 0, n = pix.length; i < n; i += 4) {
                if (pix[i + 3] !== 0) {
                    return true;
                }
            }
        } catch (e) {
            return true;
        }
        return false;
    },
    intersects: function (c, rect) {
        if (!c) {
            return false;
        }
        rect = $math.intersection(rect, c._viewRect);
        if (!rect) {
            return false;
        }
        rect.x -= c._viewRect.x;
        rect.y -= c._viewRect.y;
        try {
            var imageData = c.getContext('2d').getImageData(rect.x, rect.y, rect.width, rect.height);
            var pix = imageData.data;
            for (var i = 0, n = pix.length; i < n; i += 4) {
                if (pix[i + 3] !== 0) {
                    return true;
                }
            }
        } catch (e) {
        }
        return false;
    },
    strokeRect: function(ctx, rect, strokeStyle,lineWidth) {
        if(!rect) {
            return;
        }
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle ? strokeStyle : twaver.Util.randomColor();
        ctx.lineWidth = lineWidth ? lineWidth : 2;
        ctx.strokeRect(rect.x, rect.y ,rect.width, rect.height);
        ctx.stroke();
    },
};
_twaver.g = $g;

var gradient_types = {
    'linear.southwest': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y + h, x + w, y);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'linear.southeast': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x + w, y + h, x, y);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'linear.northwest': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x + w, y + h, x, y);
        t.addColorStop(0, fillColor);
        t.addColorStop(1, gradientColor);
        return t;
    },
    'linear.northeast': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x + w, y, x, y + h);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'linear.north': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x, y + h);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'linear.south': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x, y + h);
        t.addColorStop(0, fillColor);
        t.addColorStop(1, gradientColor);
        return t;
    },
    'linear.west': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x + w, y);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'linear.east': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x + w, y);
        t.addColorStop(0, fillColor);
        t.addColorStop(1, gradientColor);
        return t;
    },
    'radial.center': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.5, 0.5);
    },
    'radial.southwest': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.25, 0.75);
    },
    'radial.southeast': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.75, 0.75);
    },
    'radial.northwest': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.25, 0.25);
    },
    'radial.northeast': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.75, 0.25);
    },
    'radial.north': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.5, 0.25);
    },
    'radial.south': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.5, 0.75);
    },
    'radial.west': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.25, 0.5);
    },
    'radial.east': function (g, fillColor, gradientColor, x, y, w, h) {
        return $g.createRadialGradient(g, fillColor, gradientColor, x, y, w, h, 0.75, 0.5);
    },
    'spread.horizontal': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x + w, y);
        t.addColorStop(0, fillColor);
        t.addColorStop(0.5, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'spread.vertical': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x, y + h);
        t.addColorStop(0, fillColor);
        t.addColorStop(0.5, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'spread.diagonal': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x + w, y, x, y + h);
        t.addColorStop(0, fillColor);
        t.addColorStop(0.5, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'spread.antidiagonal': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y, x + w, y + h);
        t.addColorStop(0, fillColor);
        t.addColorStop(0.5, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'spread.north': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y - h / 4, x, y + h + h / 4);
        t.addColorStop(0, fillColor);
        t.addColorStop(1 / 3, gradientColor);
        t.addColorStop(2 / 3, fillColor);
        t.addColorStop(1, gradientColor);
        return t;
    },
    'spread.south': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x, y - h / 4, x, y + h + h / 4);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1 / 3, fillColor);
        t.addColorStop(2 / 3, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    },
    'spread.west': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x - w / 4, y, x + w + w / 4, y);
        t.addColorStop(0, fillColor);
        t.addColorStop(1 / 3, gradientColor);
        t.addColorStop(2 / 3, fillColor);
        t.addColorStop(1, gradientColor);
        return t;
    },
    'spread.east': function (g, fillColor, gradientColor, x, y, w, h) {
        var t = g.createLinearGradient(x - w / 4, y, x + w + w / 4, y);
        t.addColorStop(0, gradientColor);
        t.addColorStop(1 / 3, fillColor);
        t.addColorStop(2 / 3, gradientColor);
        t.addColorStop(1, fillColor);
        return t;
    }
};