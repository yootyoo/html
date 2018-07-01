var $arrow = {
    shapeMap: {},
    init: function () {
        $arrow.register('arrow.standard', $arrow.createStandardArrow());
        $arrow.register('arrow.delta', $arrow.createDeltaArrow());
        $arrow.register('arrow.diamond', $arrow.createDiamondArrow());
        $arrow.register('arrow.short', $arrow.createShortArrow());
        $arrow.register('arrow.slant', $arrow.createSlantArrow());
        $arrow.register('arrow.doubledelta', $arrow.createDoubleDeltaArrow());
        $arrow.register('arrow.tee', $arrow.createTeeArrow());
        $arrow.register('arrow.box', $arrow.createBoxArrow());
        $arrow.register('arrow.dot', $arrow.createDotArrow());
        $arrow.register('arrow.tail', $arrow.createTailArrow());
    },
    createStandardArrow: function () {
        var pointArray = new $List();
        pointArray.add({
            x: -1,
            y: -5 / 9
        });
        pointArray.add({
            x: -9 / 12,
            y: 0
        });
        pointArray.add({
            x: -1,
            y: 5 / 9
        });
        pointArray.add({
            x: 0,
            y: 0
        });
        pointArray.add({
            x: -1,
            y: -5 / 9
        });
        return {points:pointArray};
    },
    createDeltaArrow: function () {
        var pointArray = new $List();
        pointArray.add({ x: -1, y: -5 / 9 });
        pointArray.add({ x: -1, y: 5 / 9 });
        pointArray.add({ x: 0, y: 0 });
        pointArray.add({ x: -1, y: -5 / 9 });
        return {points:pointArray};
    },
    createDoubleDeltaArrow: function () {
        var pointArray = new $List();
        pointArray.add({ x: -1, y: -5 / 9 });
        pointArray.add({ x: -1, y: 5 / 9 });
        pointArray.add({ x: -1/2, y: 0 });
        pointArray.add({ x: -1/2, y: -5/9 });
        pointArray.add({ x: 0, y: 0 });
        pointArray.add({ x: -1/2, y: 5/9 });
        pointArray.add({ x: -1/2, y: 0 });
        pointArray.add({ x: -1, y: -5 / 9 });
        return {points:pointArray};
    },
    createTeeArrow: function() {
       var pointArray = new $List();
       pointArray.add({ x: -1/9, y: -5 / 9 });
       pointArray.add({ x: -1/9, y: 5 / 9 });
       pointArray.add({ x: 0, y: 5 / 9 });
       pointArray.add({ x: 0, y: -5 / 9 });
       pointArray.add({ x: -1/9, y: -5 / 9 });
       return {points:pointArray};  
    },
    createBoxArrow: function() {
        var pointArray = new $List();
        pointArray.add({ x: -10/9, y: -5 / 9 });
        pointArray.add({ x: -10/9, y: 5 / 9 });
        pointArray.add({ x: 0, y: 5 / 9 });
        pointArray.add({ x: 0, y: -5 / 9 });
        pointArray.add({ x: -10/9, y: -5 / 9 });
        return {points:pointArray};  
    },
    createDotArrow: function() {
        var arrow = {};
        var pointArray = new twaver.List();
        pointArray.add({x:-1/2,y:0});
        arrow.points = pointArray;
        arrow.draw = function(ctx,arrow) {
            if(!ctx || !arrow || !arrow.points || arrow.points.size() <= 0) {
                return;
            }
            var points = arrow.points._as;
            var center = points[0];
            var radius = Math.min(arrow.width,arrow.height)/2;
            ctx.save();
            ctx.beginPath();
            ctx.arc(center.x,center.y,radius,0,Math.PI * 2,false);
            ctx.closePath();
            ctx.restore();
        }
        return arrow;
    },
    createTailArrow: function() {
        var arrow = {};
        var pointArray = new twaver.List();
        var tail = 30;
        for(var i =-tail/2;i<tail/2;i++){
            pointArray.add({x:-i/9,y:0});
        }
        arrow.points = pointArray;
       
        arrow.draw = function(ctx,arrow) {
            if(!ctx || !arrow || !arrow.points || arrow.points.size() <= 0) {
                return;
            }
            var points = arrow.points._as;
            var shadow = arrow.shadow;
            var shadowColor = arrow.shadowColor;
            var shadowOffsetX = arrow.shadowXOffset;
            var shadowOffsetY = arrow.shadowYOffset;
            var shadowBlur = arrow.shadowBlur;  
            var shadowColor = arrow.shadowColor;
            var count = points.length - 4;
            var maxRadius = Math.min(arrow.width,arrow.height)/2;
            for(var i = 0; i <count; i++) {
                var v = i / count;
                var center = points[i];
                var radius = maxRadius *0.4;
                ctx.save();
                ctx.restore();
                ctx.beginPath();
                ctx.globalAlpha = v * v;
                if(shadow){
                    ctx.shadowOffsetX = shadowOffsetX;
                    ctx.shadowOffsetY = shadowOffsetY;
                    ctx.shadowBlur = shadowBlur;  
                    ctx.shadowColor = shadowColor;
                }
                ctx.arc(center.x,center.y,radius,0,Math.PI * 2,false);
                ctx.closePath();
                ctx.fill();
            }
            return;
        }
        return arrow;
    },
    createDiamondArrow: function () {
        var pointArray = new $List();
        pointArray.add({ x: -7 / 12, y: 5 / 9 });
        pointArray.add({ x: -14 / 12, y: 0 });
        pointArray.add({ x: -7 / 12, y: -5 / 9 });
        pointArray.add({ x: 0, y: 0 });
        pointArray.add({ x: -7 / 12, y: 5 / 9 });
        return {points:pointArray};
    },
    createShortArrow: function () {
        var pointArray = new $List();
        pointArray.add({ x: -8 / 12, y: 6 / 9 });
        pointArray.add({ x: -5 / 12, y: 0 });
        pointArray.add({ x: -8 / 12, y: -6 / 9 });
        pointArray.add({ x: 0, y: 0 });
        pointArray.add({ x: -8 / 12, y: 6 / 9 });
        return {points:pointArray};
    },
    createSlantArrow: function () {
        var pointArray = new $List();
        pointArray.add({ x: -1, y: -5 / 9 });
        pointArray.add({ x: -6.5 / 12, y: 0 });
        pointArray.add({ x: -9 / 12, y: 4 / 9 });
        pointArray.add({ x: 0, y: 0 });
        pointArray.add({ x: -1, y: -5 / 9 });
        return {points:pointArray};
    },
    register: function (shapeType, arrow) {
        $arrow.shapeMap[shapeType] = arrow;
    },
    getShape: function (shapeType) {
        if (shapeType) {
            return $arrow.shapeMap[shapeType];
        }
        throw "shape type can't be null";
    },
    getArrowRect: function (ui, linePaths, isSrouce, arrowStyle, arrowWidth, arrowHeight, arrowXOffset, arrowYOffset, zoomManager) {
        var arrow = $arrow.getShape(arrowStyle);
        if (!arrow || !arrow.points || (arrow.points && arrow.points.size() <= 0)) {
            return;
        }
        if (arrowXOffset > 0 && arrowXOffset < 1) {
            var lineLength;
            if (ui.getLineLength) {
                lineLength = ui.getLineLength();
            } else {
                lineLength = ui._element.getLineLength();
            }
            arrowXOffset *= lineLength;
        } else if (ui.getLineLength) {
            arrowXOffset += $arrow.calculateArrowXOffsetAtEdge(linePaths, ui, isSrouce, zoomManager);
        }

        if(zoomManager){
            arrowXOffset *= zoomManager.getLocationZoom();
            arrowYOffset *= zoomManager.getLocationZoom();
        }
        var pointInfo = $math.calculatePointInfoAlongLine(linePaths, isSrouce, arrowXOffset, arrowYOffset);
        var translatePoint = pointInfo.point;
        var rotateAngle = pointInfo.angle;
        var points = arrow.points._as;
        var i, c = points.length, newPoints = new $List(), value, matrix;
        matrix = new $Matrix(arrowWidth, 0, 0, arrowHeight, translatePoint.x, translatePoint.y);
        for (i = 0; i < c; i++) {
            newPoints.add(matrix.transform(points[i]));
        }
        matrix = $math.createMatrix(rotateAngle + Math.PI, translatePoint.x, translatePoint.y);
        for (i = 0; i < c; i++) {
            value = newPoints.get(i);
            if (value instanceof $List) {
                value = value._as;
            }
            if (value instanceof Array) {
                value[0] = matrix.transform(value[0]);
                value[1] = matrix.transform(value[1]);
            } else {
                newPoints.set(i, matrix.transform(value));
            }
        }
        return $math.getLineRect(newPoints);
    },
    drawArrow: function (g, arrowWidth, arrowHeight, linePaths, isSrouce, arrowStyle, drawBody, arrowColor, arrowXOffset, arrowYOffset, lineWidth, arrowOutlineColor,ui) {
        arrowXOffset = arrowXOffset || 0;
        arrowYOffset = arrowYOffset || 0;
        lineWidth = lineWidth || 0;

        var shadow = ui._element.getStyle('arrow.from.shadow');
        var shadowColor = ui._element.getStyle('arrow.from.shadow.color');
        var shadowXOffset = ui._element.getStyle('arrow.from.shadow.xoffset');
        var shadowYOffset = ui._element.getStyle('arrow.from.shadow.yoffset');
        var shadowBlur = ui._element.getStyle('arrow.from.shadow.blur');

        var drawOutline = lineWidth >= 0 && arrowOutlineColor;
        if (!drawBody && !drawOutline) {
            return;
        }
        var arrow = $arrow.getShape(arrowStyle);
        if (!arrow ||!arrow.points || (arrow.points && arrow.points.size() <= 0)) {
            return;
        }
        var pointInfo = $math.calculatePointInfoAlongLine(linePaths, isSrouce, arrowXOffset, arrowYOffset);
        var point = pointInfo.point;
        var angle = pointInfo.angle;
        // if(ui && ui._network._debug && ui._element instanceof twaver.Link){
        //     if(isSrouce){
        //         var rect = {x: ui._arrowFromRect.x, y:ui._arrowFromRect.y, width: ui._arrowFromRect.width, height:ui._arrowFromRect.height}
        //     }else{
        //         var rect = {x: ui._arrowToRect.x, y:ui._arrowToRect.y, width: ui._arrowToRect.width, height:ui._arrowToRect.height}
        //     }
        //     $g.strokeRect(g, rect, '#CD5B45');
        // }
        if (drawBody) {
            g.fillStyle = arrowColor;
        }
        g.beginPath();
        if (drawOutline) {
            g.lineWidth = lineWidth;
            g.strokeStyle = arrowOutlineColor;
        }
        $arrow._drawArrow(g, arrow, angle, point, arrowWidth, arrowHeight, arrowOutlineColor,shadowColor,shadow,shadowXOffset,shadowYOffset,shadowBlur);
        if(shadow) {
            g.shadowOffsetX = shadowXOffset;
            g.shadowOffsetY = shadowYOffset;
            g.shadowBlur = shadowBlur;  
            g.shadowColor = shadowColor;
        }
        if (drawBody) {
            g.fill();
        }
        if (drawOutline) {
            g.stroke();
        }
    },
    _drawArrow: function (g, arrow, rotateAngle, translatePoint, sx, sy, arrowOutlineColor,shadowColor,shadow,shadowXOffset,shadowYOffset,shadowBlur) {
        if(!arrow.draw) {
            var points = arrow.points._as;
            var i, c = points.length, newPoints = new $List(), value, matrix;
            matrix = new $Matrix(sx, 0, 0, sy, translatePoint.x, translatePoint.y);
            for (i = 0; i < c; i++) {
                newPoints.add(matrix.transform(points[i]));
            }
            newPoints = newPoints._as;
            matrix = $math.createMatrix(rotateAngle + Math.PI, translatePoint.x, translatePoint.y);
            var point = newPoints[0];
            point = matrix.transform(point);
            g.moveTo(point.x, point.y);
            for (i = 1; i < c; i++) {
                value = newPoints[i];
                if (value instanceof $List) {
                    value = value._as;
                }
                if (value instanceof Array) {
                    value[0] = matrix.transform(value[0]);
                    value[1] = matrix.transform(value[1]);
                    g.quadraticCurveTo(value[0].x, value[0].y, value[1].x, value[1].y);
                } else {
                    value = matrix.transform(value);
                    g.lineTo(value.x, value.y);
                }
            }
        }else{
            var points = new twaver.List();
            for(var i = 0; i < arrow.points._as.length; i++){
                points.add(arrow.points.get(i));
            }
            points.add({x:-1,y:-1/2});
            points.add({x:-1,y:1/2});
            points.add({x:0,y:1/2});
            points.add({x:0,y:-1/2});
            points = points._as;

            var i, c = points.length, newPoints = new $List(), value, matrix;
            matrix = new $Matrix(sx, 0, 0, sy, translatePoint.x, translatePoint.y);
            for (var i = 0; i < c; i++) {
                newPoints.add(matrix.transform(points[i]));
            }
            newPoints = newPoints._as;
            matrix = $math.createMatrix(rotateAngle + Math.PI, translatePoint.x, translatePoint.y);
            var nps = new $List();
            for (var i = 0; i < c; i++) {
                nps.add(matrix.transform(newPoints[i]));
            }
            arrow.draw && arrow.draw(g,{points:nps,width:sx,height:sy, shadowColor:shadowColor,shadow:shadow,shadowXOffset:shadowXOffset,shadowYOffset:shadowYOffset,shadowBlur:shadowBlur});
        }
    },
    drawLinkArrow: function (ui, g, points, zoomManager) {
        if (points.size() < 2) {
            return;
        }
        if (ui._element.getStyle('arrow.from')) {
            $arrow._drawFromArrow(ui, g, points, zoomManager);
        }
        if (ui._element.getStyle('arrow.to')) {
            $arrow._drawToArrow(ui, g, points, zoomManager);
        }
    },
    _drawFromArrow: function (ui, g, points, zoomManager) {
        var link = ui._element;

        var arrowBodyFill = link.getStyle('arrow.from.fill');
        var arrowOutlineWidth = link.getStyle('arrow.from.outline.width');
        var arrowShadowColor = link.getStyle('arrow.from.shadow.color');
        if (arrowBodyFill || arrowOutlineWidth >= 0) {
            var arrowWidth = link.getStyle('arrow.from.width');
            var arrowHeight = link.getStyle('arrow.from.height');
            var arrowXOffset = link.getStyle('arrow.from.xoffset');

            if (arrowXOffset > 0 && arrowXOffset < 1) {
                var lineLength;
                if (ui.getLineLength) {
                    lineLength = ui.getLineLength();
                } else {
                    lineLength = ui._element.getLineLength();
                }
                arrowXOffset *= lineLength;
            } else if (ui.getLineLength) {
                arrowXOffset += $arrow.calculateArrowXOffsetAtEdge(points, ui, true, zoomManager);
            }

            var arrowYOffset = link.getStyle('arrow.from.yoffset');
            var arrowStyle = link.getStyle('arrow.from.shape');

            arrowXOffset = ui._network._edgeDetect? 0:arrowXOffset;
            arrowYOffset = ui._network._edgeDetect? 0:arrowYOffset;
            if(zoomManager){
                arrowXOffset *= zoomManager.getLocationZoom();
                arrowYOffset *= zoomManager.getLocationZoom();
            }
            $arrow.drawArrow(g, arrowWidth, arrowHeight, points, true, arrowStyle, arrowBodyFill,
                link.getStyle('arrow.from.color'), arrowXOffset, arrowYOffset, arrowOutlineWidth, link.getStyle('arrow.from.outline.color'), ui);
        }
    },
    _drawToArrow: function (ui, g, points, zoomManager) {
        var link = ui._element;

        var arrowBodyFill = link.getStyle('arrow.to.fill');
        var arrowOutlineWidth = link.getStyle('arrow.to.outline.width');
        if (arrowBodyFill || arrowOutlineWidth >= 0) {
            var arrowWidth = link.getStyle('arrow.to.width');
            var arrowHeight = link.getStyle('arrow.to.height');
            var arrowXOffset = link.getStyle('arrow.to.xoffset');

            if (arrowXOffset > 0 && arrowXOffset < 1) {
                var lineLength;
                if (ui.getLineLength) {
                    lineLength = ui.getLineLength();
                } else {
                    lineLength = ui._element.getLineLength();
                }
                arrowXOffset *= lineLength;
            } else if (ui.getLineLength) {
                arrowXOffset += $arrow.calculateArrowXOffsetAtEdge(points, ui, false);
            }
            var arrowYOffset = link.getStyle('arrow.to.yoffset');
            var arrowStyle = link.getStyle('arrow.to.shape');
            if(zoomManager){
                arrowXOffset *= zoomManager.getLocationZoom();
                arrowYOffset *= zoomManager.getLocationZoom();
            }
            arrowXOffset = ui._network._edgeDetect? 0:arrowXOffset;
            arrowYOffset = ui._network._edgeDetect? 0:arrowYOffset;

            $arrow.drawArrow(g, arrowWidth, arrowHeight, points, false, arrowStyle, arrowBodyFill,
                link.getStyle('arrow.to.color'), arrowXOffset, arrowYOffset, arrowOutlineWidth, link.getStyle('arrow.to.outline.color'), ui);
        }
    },
    calculateArrowXOffsetAtEdge: function (result, linkUI, isSource, zoomManager) {
        if (result == null || result.size() < 2) {
            return 0;
        }
        var link = linkUI._element;
        var arrowAtEdge = (isSource ? link.getStyle('arrow.from.at.edge') : link.getStyle('arrow.to.at.edge'));
        if (!arrowAtEdge) {
            return 0;
        }
        var agentNodeUI = isSource ? linkUI._network.getElementUI(link.getFromAgent()) : linkUI._network.getElementUI(link.getToAgent());
        if (!agentNodeUI) {
            return 0;
        }
        if(zoomManager){
            var sourceBounds = agentNodeUI.getZoomBodyRect();
        }else{
            var sourceBounds = agentNodeUI._bodyRect;
        }
        
        if (sourceBounds == null) {
            return 0;
        }
        var temp = $math._getPoint(result.get(isSource ? 0 : result.size() - 1));
        var xOffset = 0, lineLength = linkUI.getLineLength();
        while ($arrow._containsByInt(sourceBounds, Math.floor(temp.x), Math.floor(temp.y), false) && xOffset < lineLength) {
            temp = $math.calculatePointInfoAlongLine(result, isSource, xOffset++).point;
        }
        return xOffset;
    },
    _containsByInt: function (rect, x, y, includeOutline) {
        includeOutline = includeOutline === undefined ? true : includeOutline;
        if (includeOutline) {
            return (x >= Math.floor(rect.x) && x <= Math.floor(rect.x + rect.width) && y >= Math.floor(rect.y) && y <= Math.floor(rect.y + rect.height));
        }
        return (x > Math.floor(rect.x) && x < Math.floor(rect.x + rect.width) && y > Math.floor(rect.y) && y < Math.floor(rect.y + rect.height));
    }
};
$arrow.init();
_twaver.arrow = $arrow;
