twaver.vector.LinkUI = function (network, element) {
    twaver.vector.LinkUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.LinkUI', twaver.vector.ElementUI, {
    isEditable: function () {
        return true;
    },
    invalidate: function (checkAttachments) {
        this._linkPoints = null;
        this._fromPoint = null;
        this._toPoint = null;
        this._angle = null;
        twaver.vector.LinkUI.superClass.invalidate.call(this, checkAttachments);
    },
    invalidateZoom : function(){
    	this._fromPoint = null;
    	this._toPoint = null;
    	this._linkPoints = null;
    	twaver.vector.LinkUI.superClass.invalidateZoom.call(this);
    },
    validateImpl: function () {
        this.validateBodyBounds();
        twaver.vector.LinkUI.superClass.validateImpl.call(this);
    },
    validateBodyBounds: function () {
        var points = this.getLinkPoints();
        if (!points || points.size() < 2) {
            return;
        }
        var link = this._element;
        var bounds = $math.getLineRect(points);

        var width = link.getStyle('link.width');
        var grow = width;
        if (this._outerColor) {
            var outerWidth = link.getStyle('outer.width');
            grow += outerWidth * 2;
        }
        var selectBorder = !this._editAttachment && link.getStyle('select.style') === 'border' && this._network.isSelected(this._element);
        if (selectBorder) {
            var selectWidth = link.getStyle('select.width');
            grow += selectWidth * 2;
        }
        $math.grow(bounds, grow / 2, grow / 2);

        if (link.getStyle('arrow.from')) {
           if(this._network._edgeDetect) {
                if(this._network._debug){
                    this._arrowFromRect = $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    0,
                    0,
                    this._network.zoomManager);
                }

             bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    0,
                    0,
                    this._network.zoomManager
                    ));
           }else{
                if(this._network._debug){
                    this._arrowFromRect = $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    link.getStyle('arrow.from.xoffset'),
                    link.getStyle('arrow.from.yoffset'),
                    this._network.zoomManager
                    );
                }
            bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    link.getStyle('arrow.from.xoffset'),
                    link.getStyle('arrow.from.yoffset'),
                    this._network.zoomManager
                    ));
            }
        }
        if (link.getStyle('arrow.to')) {
             if(this._network._edgeDetect) {
                if(this._network._debug){
                    this._arrowToRect =  $arrow.getArrowRect(this, points, false,
                        link.getStyle('arrow.to.shape'),
                        link.getStyle('arrow.to.width'),
                        link.getStyle('arrow.to.height'),
                        0,
                        0,
                        this._network.zoomManager
                        );
                }

                bounds = $math.unionRect(bounds,
                    $arrow.getArrowRect(this, points, false,
                    link.getStyle('arrow.to.shape'),
                    link.getStyle('arrow.to.width'),
                    link.getStyle('arrow.to.height'),
                    0,
                    0,
                    this._network.zoomManager
                    ));
                }else{
                    if(this._network._debug){
                        this._arrowToRect =  $arrow.getArrowRect(this, points, false,
                            link.getStyle('arrow.to.shape'),
                            link.getStyle('arrow.to.width'),
                            link.getStyle('arrow.to.height'),
                            link.getStyle('arrow.to.xoffset'),
                            link.getStyle('arrow.to.yoffset'),
                            this._network.zoomManager
                            );
                    }

                bounds = $math.unionRect(bounds,
                    $arrow.getArrowRect(this, points, false,
                    link.getStyle('arrow.to.shape'),
                    link.getStyle('arrow.to.width'),
                    link.getStyle('arrow.to.height'),
                    link.getStyle('arrow.to.xoffset'),
                    link.getStyle('arrow.to.yoffset'),
                    this._network.zoomManager
                    ));
                }
        }
        this.appendShadowBound(this, bounds);
        this.addBodyBounds(bounds);
        
        this._growLinkJoinBounds(bounds,grow);
    },
    
    _growLinkJoinBounds : function(bounds,grow){
    	
    },
    
    createBodyRect: function () {
        var h = this.getHotSpot();
        if (h) {
            return {
                x: h.x - 1,
                y: h.y - 1,
                width: 2,
                height: 2
            };
        }
        return null;
    },
    paintBody: function (ctx) {
        if(this._network.hasEditInteraction() && this._network.isEditable(this._element) && this.isEditable()){
            if(this._network.isSelected(this._element)){
                var box = this._network.getElementBox();
                var newIndex;
                var i;
                var dataList = box.getDatas();
                for(i=0;i<dataList.size();i++){
                    if(dataList.get(i) instanceof twaver.Link){
                        var toNode = dataList.get(i).getToNode();
                        var fromNode = dataList.get(i).getFromNode();
                        box.adjustElementIndex(fromNode);
                        box.adjustElementIndex(toNode);              
                    }
                }
                newIndex = box.getDatas().indexOf(this._element)       
                box.getDatas().removeAt(newIndex);
                box.getDatas().add(this._element);
            }
        }else{
            if(this._network.isSelected(this._element)){
                var box = this._network.getElementBox();
                var toNode = this._element.getToNode();
                var fromNode = this._element.getFromNode();
                box.adjustElementIndex(fromNode);
                box.adjustElementIndex(toNode);
            }
        }
        var points = this.getLinkPoints();
        if (!points || points.size() < 2) {
            return;
        }
        var link = this._element;

        var width = link.getStyle('link.width');
        var grow = width;
        if (this._outerColor && this.getStyle('outer.style') === 'border') {
            var outerWidth = link.getStyle('outer.width');
            grow += outerWidth * 2;
        }
        var selectBorder = !this._editAttachment && link.getStyle('select.style') === 'border' && this._network.isSelected(this._element);
        if (selectBorder) {
            var selectWidth = link.getStyle('select.width');
            grow += selectWidth * 2;
        }
        this.setGlow(this, ctx);
        this.setShadow(this, ctx);
        ctx.lineCap = link.getStyle('link.cap');
        ctx.lineJoin = link.getStyle('link.join');
        var pattern = link.getStyle('link.pattern');
        if (selectBorder) {
            this.drawLinePoints(ctx, points, grow, link.getStyle('select.color'), pattern);
        }
        if (this._outerColor && this.getStyle('outer.style') === 'border') {
            this.drawLinePoints(ctx, points, width + outerWidth * 2, this._outerColor, pattern);
        }
        this.drawLinePoints(ctx, points, width, this._innerColor || link.getStyle('link.color'), pattern);
        $arrow.drawLinkArrow(this, ctx, points, this._network.zoomManager);
    },
    drawLinePoints: function (g, points, width, color, pattern) {
        g.lineWidth = width;
        g.strokeStyle = color;

        /*
        g.beginPath();
        $g.drawLinePoints(g, points, pattern);
        g.stroke();
        */
        if (this._element.getStyle("link.flow") === true && pattern && pattern.length > 1) {
            var dashedLine = new $DashedLine(g, pattern[0], pattern[1]);
            var offset = this._element.getStyle("link.flow.offset");
            var mod = Math.floor(offset /(pattern[0] + pattern[1]));
            if (mod > 2) {
                offset = offset - (pattern[0] + pattern[1]) * mod;
            }
            
            if (this._element.getStyle("link.flow.converse")) {
                if (offset < pattern[0]) {
                    dashedLine.overflow = pattern[0] - offset;
                } else if (offset >= pattern[0] && offset <= pattern[0] + pattern[1]) {
                    dashedLine.overflow = pattern[1] - (offset - pattern[0]);
                    if (dashedLine.overflow) { dashedLine.isLine = false };
                } else {
                    offset -= (pattern[0] + pattern[1]);
                    dashedLine.overflow = pattern[0] - offset;
                }
            } else {
                if (offset <= pattern[1]) {
                    dashedLine.overflow = offset;
                    if (offset) dashedLine.isLine = false;
                } else if (offset > pattern[1] && offset <= pattern[0] + pattern[1]) {
                    dashedLine.overflow = offset - pattern[1];
                } else {
                    offset -= (pattern[0] + pattern[1]);
                    if (offset) { dashedLine.isLine = false };
                    dashedLine.overflow = offset;
                }
            }

            this._element._styleMap["link.flow.offset"] = offset;
            g.beginPath();
            $g._drawLine(points, g);
            g.stroke();

            g.shadowColor = 'transparent';
            g.beginPath();
            var linkFlowColor = this._element.getStyle("link.flow.color");
            linkFlowColor = linkFlowColor ? linkFlowColor : $Defaults.NETWORK_LINK_FLOW_COLOR;
            g.strokeStyle = linkFlowColor;
            $g._drawLine(points, dashedLine);
            g.stroke();
            g.shadowColor = this._shadowColor;
        } else {
            g.beginPath();
            $g.drawLinePoints(g, points, pattern);
            g.stroke();
        }
    },
    
    getLinkPoints: function () {
        if (!this._linkPoints) {
            this._linkPoints = this.createLinkPoints();
            this._lineLength = $math.calculateLineLength(this._linkPoints);
        }
        return this._linkPoints;
    },
    getFromPosition: function (xoffset, yoffset) {
        var point = this.getFromPoint();
        if (point) {
            return {
                x: point.x + xoffset,
                y: point.y + yoffset
            };
        }
        return null;
    },
    getToPosition: function (xoffset, yoffset) {
        var point = this.getToPoint();
        if (point) {
            return {
                x: point.x + xoffset,
                y: point.y + yoffset
            };
        }
        return null;
    },
    getFromPoint: function () {
        if (!this._fromPoint) {
            this._fromPoint = $link.createFromPoint(this,this._network.zoomManager);
        }
        return this._fromPoint;
    },
    getToPoint: function () {
        if (!this._toPoint) {
            this._toPoint = $link.createToPoint(this,this._network.zoomManager);
        }
        return this._toPoint;
    },
    getZoomBodyRect : function(){
    	return this.getBodyRect();
    },
    
    getZoomViewRect : function(){
    	// var viewRect = this.getViewRect();
    	// return viewRect;
    	return this._viewRect;
    },
    createLinkPoints: function () {
        var zoomManager = this._network.zoomManager;
        var type = this.getStyle('link.type');
        var points = new twaver.List();

        if ($link.isOrthogonalOrFlexionalLink(this._element)) {
            points = $link.orthogonalAndFlexional(this, type,zoomManager);
        } else {
            if (this._element.isLooped()) {
                var nodeUI = this._network.getElementUI(this._element.getFromAgent());
                if (nodeUI != null) {
                    this._hotSpot = $link.fillLoopedPoints(this, nodeUI.getZoomBodyRect(), points);
                }
            } else if (type === 'arc' || type === 'triangle' || type === 'parallel') {
                var fromPoint = this.getFromPoint();
                var toPoint = this.getToPoint();
                this._hotSpot = $link.fillBundlePoints(this, type, fromPoint, toPoint, points ,zoomManager);
            } else {
                throw "Can not resolve link type '" + type + "'";
            }
        }
        if (this._network._linkPathFunction) {
            var result = this._network._linkPathFunction(this, points);
            result && (points = result);
        }
        return points;
    },
    checkAttachments: function () {
        twaver.vector.LinkUI.superClass.checkAttachments.call(this);
        this.checkLinkHandlerAttachment();
    },
    checkLinkHandlerAttachment: function () {
        var label = this._network.getLinkHandlerLabel(this._element);
        if (label != null && label !== '') {
            if (!this._linkHandlerAttachment) {
                this._linkHandlerAttachment = new twaver.vector.LinkHandlerAttachment(this);
                this.addAttachment(this._linkHandlerAttachment);
            }
        } else {
            if (this._linkHandlerAttachment) {
                this.removeAttachment(this._linkHandlerAttachment);
                this._linkHandlerAttachment = null;
            }
        }
    },
    getLinkHandlerAttachment: function () {
        return this._linkHandlerAttachment;
    },
    getControlPoint: function () {
        return $link.getControlPoint(this._element, this,this._network.zoomManager);
    },
    setControlPoint: function (point) {
        if (!point) {
            return;
        }
        var linkType = this.getStyle('link.type');
        if (!$link.hasControlPoint(linkType)) {
            return;
        }
        // var sourceBounds = $link.getLinkSourceBounds(this);
        // var targetBounds = $link.getLinkTargetBounds(this);
        var sourceBounds = $link.getLinkSourceBounds(this, this._network.zoomManager);
        var targetBounds = $link.getLinkTargetBounds(this, this._network.zoomManager);
        $link.setParamsByControlPoint(point, sourceBounds, targetBounds, linkType, this._element);
    },
    getLineLength: function () {
        return this._lineLength;
    },
    hit: function (x, y) {
        var targetRect = { x: x, y: y, width: 0, height: 0 };
        var tolerance = this._network.getSelectionTolerance();
        if (tolerance && tolerance > 0) {        
          $math.grow(targetRect, tolerance, tolerance);
        }
        if ($math.intersects(this._viewRect, targetRect)) {
            return this.hitCanvasPoint(x, y);
        }
        return false;
    },
    intersects: function (r) {
        var it = twaver.vector.NodeUI.superClass.intersects.apply(this, arguments);
        if (it == true) {
            return true;
        }

        if ($math.intersects(r, this._viewRect) == false) {
            return false;
        }

        var points = this.getLinkPoints();
        var size = points.size();
        if (size == 2) {
            for (var i = 0; i < size; i += 2) {
                var p1 = points.get(i);
                if (i + 1 < size) {
                    var p2 = points.get(i + 1);
                    if ($CanvasUtil.intersectsLine(p1.x, p1.y, p2.x, p2.y, r.x, r.y, r.width, r.height)) {
                        return true;
                    }
                }
            }
        }

        return this.hitCanvasRect(r);
    },
    getAngle: function () {
        if (!this._angle && this._fromPoint && this._toPoint) {
            this._angle = $math.getAngle(this._fromPoint, this._toPoint);
        }
        return this._angle || 0;
    },
    //append shadow bound
    appendShadowBound : function(part, rect) {
        var shadowable = part.isShadowable() && this._shadowColor && !this._editAttachment;
        if (shadowable) {
            if (this._shadowXOffset > 0) {
                rect.width += this._shadowXOffset;
            } else {
                rect.x += this._shadowXOffset;
                rect.width += -this._shadowXOffset;
            }
            if (this._shadowYOffset > 0) {
                rect.height += this._shadowYOffset;
            } else {
                rect.y += this._shadowYOffset;
                rect.height += -this._shadowYOffset;
            }
            var blur = this._shadowBlur;
            $math.grow(rect, blur + 1,blur + 1);
        }
        return rect;
    },
});

