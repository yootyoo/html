twaver.Util = {
    getVersion: function () {
        return '5.3.3';
    },
    registerImage: function (name, source, width, height, svg) {
        _twaver.registerImage(name, source, width, height, svg);
    },
    getRegisteredImageNames: function () {
        return _twaver.getRegisteredImageNames();
    },
    unregisterImage: function (name) {
        _twaver.unregisterImage(name);
    },
    getImageAsset: function (name) {
        return _twaver.getImageAsset(name);
    },
    validateLicense: function (license) {
        _twaver.validateLicense(license);
    },
    
    getLicense : function(){
        return $license;
    },
    
    isPermissionGIS : function(){
        return __isPermissionGIS();
    },
    
    moveElements: function (elements, xoffset, yoffset, animate, finishFunction) {
        if (xoffset === 0 && yoffset === 0) {
            return;
        }
        if (!elements || elements.isEmpty()) {
            return;
        }
        var a = twaver.animate.AnimateManager, nodes, locations;
        a.endAnimate();
        elements = $element.filterMovingElements(elements);
        if (animate) {
            nodes = new $List();
            locations = new $List();
        }
        elements.forEach(function (element) {
            if (element instanceof $Node) {
                if (animate) {
                    nodes.add(element);
                    locations.add({ x: element.getX() + xoffset, y: element.getY() + yoffset });
                } else {
                    element.translate(xoffset, yoffset);
                }
            }
        });
        if (animate) {
            a.start(new twaver.animate.AnimateLocation(nodes, locations, finishFunction));
        } else {
            if (finishFunction) {
                finishFunction();
            }
        }
    },
    isTypeOf: function (type, base) {
        if (type === base) {
            return true;
        }
        var superClass = type.superClass;
        while (superClass) {
            if (superClass === base.prototype) {
                return true;
            }
            superClass = superClass.constructor.superClass;
        }
        return false;
    },
    setFocus: function (e) {
        if (document.activeElement === e) {
            return;
        }
        var left, top;
        var doc = document.documentElement;
        var body = document.body;
        var target;
        if (doc && ($ua.isIE || $ua.isOpera || doc.scrollLeft || doc.scrollTop)) {
            left = doc.scrollLeft;
            top = doc.scrollTop;
            target = doc;
        }
        else if (body) {
            left = body.scrollLeft;
            top = body.scrollTop;
            target = body;
        }
        e.focus();
        if (target) {
            target.scrollLeft = left;
            target.scrollTop = top;
        }
    },
    isOpera: $ua.isOpera,
    isIE: $ua.isIE,
    isFirefox: $ua.isFirefox,
    isChrome: $ua.isChrome,
    isSafari: $ua.isSafari,
    isIPhone: $ua.isIPhone,
    isIPod: $ua.isIPod,
    isIPad: $ua.isIPad,
    isAndroid: $ua.isAndroid,
    isWebOS: $ua.isWebOS,
    isTouchable: $ua.isTouchable,
    ext: function (subClass, superClass, o) {
        _twaver.ext(subClass, superClass, o);
    },
    getValue: function (instance, property, type) {
        return _twaver.getValue(instance, property, type);
    },
    setValue: function (instance, property, value) {
        _twaver.setValue(instance, property, value);
    },
    grow: function (rect, width, height) {
        $math.grow(rect, width, height);
    },
    containsPoint: function (rect, x, y) {
        return $math.containsPoint.apply(null, arguments);
    },
    intersects: function (srcRect, dstRect) {
        return $math.intersects(srcRect, dstRect);
    },
    getRect: function (points) {
        return $math.getRect(points);
    },
    unionRect: function (srcRect, dstRect) {
        return $math.unionRect(srcRect, dstRect);
    },
    createDiv: function () {
        return $html.createDiv();
    },
    createCanvas: function () {
        return $html.createCanvas();
    },
    setCanvas: function (c, x, y, w, h) {
        return $html.setCanvas.apply(null, arguments);
    },
    drawVector: function (g, shape, pattern, x, y, w, h) {
        $g.drawVector.apply(null, arguments);
    },
    fill: function (g, fillColor, gradient, gradientColor, x, y, w, h) {
        $g.fill.apply(null, arguments);
    },
    getClass: function (className) {
        return _twaver.getClass(className);
    },
    getAllClassNames: function () {
        var result = [], key;
        for (key in _twaver.classCache) {
            result.push(key);
        }
        return result;
    },
    newInstance: function (className) {
        return _twaver.newInstance.apply(null, arguments);
    },
    isDeserializing: function () {
        return _twaver.isDeserializing;
    },
    addEventListener: function (type, handler, view, scope) {
        $html.addEventListener(type, handler, view, scope);
    },
    removeEventListener: function (type, view, scope) {
        $html.removeEventListener(type, view, scope);
    },
    drawArrow: function (g, arrowWidth, arrowHeight, linePaths, isSrouce,
            arrowStyle, drawBody, arrowColor, arrowXOffset, arrowYOffset, lineWidth, arrowOutlineColor) {
        $arrow.drawArrow.apply(null, arguments);
    },
    calculatePointAngleAlongLine: function (points, segments, isSource, xOffset, yOffset) {
        return $math.calculatePointInfoAlongLineBySegments(points, segments, isSource, xOffset, yOffset);
    },
    getSubNetwork: function (element) {
        return $element.getSubNetwork(element);
    },
    transformPoint: function (point, angle, xOffset, yOffset) {
        return $math.transformPoint(point, angle, xOffset, yOffset);
    },
    getToolTipDiv: function () {
        return $popup.getToolTipDiv();
    },
    showToolTip: function (eorp, innerHTML) {
        $popup.showToolTip(eorp, innerHTML);
    },
    hideToolTip: function () {
        $popup.hideToolTip();
    },
    resetToolTip: function () {
        $popup.resetToolTip();
    },
    setCSSStyle: function (domObject, styleName, styleValue) {
        $html.setCSSStyle(domObject, styleName, styleValue);
    },
    removeCSSStyle: function (domObject, styleName) {
        $html.removeCSSStyle(domObject, styleName);
    },
    getCSSStyle: function (domObject, styleName) {
        return $html.getCSSStyle(domObject, styleName);
    },
    toDegrees: function (radian) {
        return $math.toDegrees(radian);
    },
    toRadians: function (degree) {
        return $math.toDegrees(degree);
    },
    getRadiansBetweenLines: function (from, to) {
        return $math.getRadiansBetweenLines(from, to);
    },
    getElementsBounds: function (elements, network) {
    	var bounds = null;
    	elements.forEach(function (element) {
    	    if (element.getRect) {
    	        var rect, ui;
    	        if (network) {
    	            ui = network.getElementUI(element);
    	            if (ui) {
    	                rect = ui.getViewRect();
    	            }
    	        }
    	        if (!rect) {
    	            rect = element.getRect();
    	        }
	    	    if (bounds) {
	    	        bounds  = twaver.Util.unionRect(bounds, rect);
	    	    } else {
	    	        bounds = rect;
    	        }
    	    }
    	})
    	return bounds;
    },
    getPointIndex: function (points, point, tolerance) {
        tolerance || (tolerance = 10);
        if (points) {
            for (var i = points.size(); i--; i >= 0) {
                if ($math.getDistance(points.get(i), point) <= tolerance) {
                    return i;
                }
            }
        }
        return -1;
    },
    registerVectorShape: function (name, func) {
        _twaver.g['_' + name] = func;
    },
    rotateCanvas: function(g, rect, angle) {
        g.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
        g.rotate(angle * Math.PI /180);
        g.translate(-(rect.x + rect.width / 2), -(rect.y + rect.height / 2));
    },
    registerShape: function (name, shapeFunc) {
        registerShape(name, shapeFunc);
    },
    registerDraw: function (name, draw) {
        registerDraw(name, draw);
    },
    getFilterColor: function (sourceColor, filterColor) {
        return getFilterColor(sourceColor, filterColor);
    },
    registerGifImage: function(name, url) {
        var views = arguments;
        var http = new XMLHttpRequest();
        http.overrideMimeType('text/plain; charset=x-user-defined');
        http.onload = function(e) {
            var stream = new _stream(http.response);
            var gif = new _gif(stream);
            gif.doParse();
            var myInterval = setInterval(function () {
                if(gif.loaded) {
                    clearInterval(myInterval);
                    twaver.Util.registerImage(name, gif);
                    for (var i = 2; i < views.length; i++) {
                        var view = views[i];
                        if (view.invalidateElementUIs) {
                            view.invalidateElementUIs();
                        }
                        if (view.invalidateDisplay) {
                            view.invalidateDisplay();
                        }
                    }
                }
            }, 10);
        };
        http.open('POST', url, true);
        http.send();
    },
    parseVectorData: function (data) {
        return parsePathOrPoints(data);
    },
    getSharedLinks: function(node1,node2){
       var links1 = node1.getLinks(),links2 = node2.getLinks();
       if(links1 && links1.size() != 0 && links2 && links2.size() != 0){
           var links = links1.size() > links2.size() ? links1 : links2;
           return links.toList(function(link){
               return (link.getFromNode() == node1 && link.getToNode() == node2) || (link.getFromNode() == node2 && link.getToNode() == node1);
           });
       }
       return null;
    },
    isSharedLinks: function(node1,node2){
        var result = false,links1 = node1.getLinks(),links2 = node2.getLinks();
        if(links1 && links1.size() != 0 && links2 && links2.size() != 0){
            var links = links1.size() > links2.size() ? links1 : links2;
            links.forEach(function(link){
                if((link.getFromNode() == node1 && link.getToNode() == node2) || (link.getFromNode() == node2 && link.getToNode() == node1)){
                    result = true;
                    return false;
                }
                return true;
            });
        }
        return result;
    },
    playAnimate: function (animate) {
        return playAnimate(animate);
    },
    pauseAnimate: function (animate) {
        animate.pause();
    },
    resumeAnimate: function (animate) {
        animate.resume();
    },
    stopAnimate: function (animate, end) {
        stopAnimate(animate, end);
    },
    pauseAllAnimates: function () {
        pauseAllAnimates();
    },
    resumeAllAnimates: function () {
        resumeAllAnimates();
    },
    stopAllAnimates: function (end) {
        stopAllAnimates(end);
    },
    randomColor: function (){
        return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).substr(-6);
    },
    getHSVColor: function(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (h && s === undefined && v === undefined) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        var rgb='#'+toHex(r * 255)+toHex(g * 255)+toHex(b * 255);
        return rgb;
    },
    toHex: function(value){
        var result=parseInt(value).toString(16);
        if(result.length==1){
            result='0'+result;
        }
        return result;
    },
    makeHighRes: function (c) {
        var ctx = c.getContext('2d');
        // finally query the various pixel ratios
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;
        // upscale canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = c.width;
            var oldHeight = c.height;
            c.width = Math.round(oldWidth * ratio);
            c.height = Math.round(oldHeight * ratio);
            c.style.width = oldWidth + 'px';
            c.style.height = oldHeight + 'px';
            ctx.scale(ratio, ratio);
        }
    },  
};
_twaver.ext('twaver.Util', Object, {});
