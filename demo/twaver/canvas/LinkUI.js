twaver.canvas.LinkUI = function (network, element) {
    twaver.canvas.LinkUI.superClass.constructor.call(this, network, element);
}
_twaver.ext('twaver.canvas.LinkUI', twaver.canvas.ElementUI, {
    isEditable: function () {
        if ($link.isOrthogonalLink(this._element) && this.getControlPoint()) {
            return true;
        }
        return false;
    },
    invalidate: function (checkAttachments) {
        this._linkPoints = null;
        this._fromPoint = null;
        this._toPoint = null;
        this._angle = null;
        twaver.canvas.LinkUI.superClass.invalidate.call(this, checkAttachments);
    },
    validateImpl: function () {
        this.validateBodyBounds();
        twaver.canvas.LinkUI.superClass.validateImpl.call(this);
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
            if(this._network._debug){
                this._arrowFromRect = $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    link.getStyle('arrow.from.xoffset'),
                    link.getStyle('arrow.from.yoffset')
                    );
            }

            bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(this, points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    link.getStyle('arrow.from.xoffset'),
                    link.getStyle('arrow.from.yoffset')
                    ));
        }
        if (link.getStyle('arrow.to')) {
           if(this._network._debug){
            this._arrowToRect =  $arrow.getArrowRect(this, points, false,
                link.getStyle('arrow.to.shape'),
                link.getStyle('arrow.to.width'),
                link.getStyle('arrow.to.height'),
                link.getStyle('arrow.to.xoffset'),
                link.getStyle('arrow.to.yoffset')
                );
            }

            bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(this, points, false,
                    link.getStyle('arrow.to.shape'),
                    link.getStyle('arrow.to.width'),
                    link.getStyle('arrow.to.height'),
                    link.getStyle('arrow.to.xoffset'),
                    link.getStyle('arrow.to.yoffset')
                    ));
        }
        this.appendShadowBound(this, bounds);
        this.addBodyBounds(bounds);
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
        var points = this._linkPoints;
        if (!points || points.size() < 2) {
            return;
        }
        var link = this._element;

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
        this.setShadow(this, ctx);
        ctx.lineCap = link.getStyle('link.cap');
        ctx.lineJoin = link.getStyle('link.join');
        var pattern = link.getStyle('link.pattern');
        if (selectBorder) {
            this.drawLinePoints(ctx, points, grow, link.getStyle('select.color'), pattern);
        }
        if (this._outerColor) {
            this.drawLinePoints(ctx, points, width + outerWidth * 2, this._outerColor, pattern);
        }
        this.drawLinePoints(ctx, points, width, this._innerColor || link.getStyle('link.color'), pattern);
        $arrow.drawLinkArrow(this, ctx, points);
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
            this._fromPoint = $link.createFromPoint(this);
        }
        return this._fromPoint;
    },
    getToPoint: function () {
        if (!this._toPoint) {
            this._toPoint = $link.createToPoint(this);
        }
        return this._toPoint;
    },
    createLinkPoints: function () {
        var fromPoint = this.getFromPoint();
        var toPoint = this.getToPoint();
        var type = this.getStyle('link.type');
        var points = new twaver.List();

        if ($link.isOrthogonalOrFlexionalLink(this._element)) {
            points = $link.orthogonalAndFlexional(this, type);
        } else {
            if (this._element.isLooped()) {
                var nodeUI = this._network.getElementUI(this._element.getFromAgent());
                if (nodeUI != null) {
                    this._hotSpot = $link.fillLoopedPoints(this, nodeUI.getBodyRect(), points);
                }
            } else if (type === 'arc' || type === 'triangle' || type === 'parallel') {
                this._hotSpot = $link.fillBundlePoints(this, type, fromPoint, toPoint, points);
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
        twaver.canvas.LinkUI.superClass.checkAttachments.call(this);
        this.checkLinkHandlerAttachment();
    },
    checkLinkHandlerAttachment: function () {
        var label = this._network.getLinkHandlerLabel(this._element);
        if (label != null && label !== '') {
            if (!this._linkHandlerAttachment) {
                this._linkHandlerAttachment = new twaver.canvas.LinkHandlerAttachment(this);
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
        return $link.getControlPoint(this._element, this);
    },
    setControlPoint: function (point) {
        if (!point) {
            return;
        }
        var linkType = this.getStyle('link.type');
        if (!$link.hasControlPoint(linkType)) {
            return;
        }
        var sourceBounds = $link.getLinkSourceBounds(this);
        var targetBounds = $link.getLinkTargetBounds(this);
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
        if ($math.intersects(this.getViewRect(), targetRect)) {
            return this.hitCanvasPoint(x, y);
        }
        return false;
    },
    intersects: function (r) {
        var it = twaver.canvas.LinkUI.superClass.intersects.apply(this, arguments);
        if (it == true) {
            return true;
        }

        if ($math.intersects(r, this.getViewRect()) == false) {
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
    }
});

