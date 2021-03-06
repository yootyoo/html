twaver.network.LinkUI = function (network, element) {
    twaver.network.LinkUI.superClass.constructor.call(this, network, element);
    this._linkCanvas = $html.createCanvas();
};
_twaver.ext('twaver.network.LinkUI', twaver.network.ElementUI, {
    isEditable: function () {
        if ($link.isOrthogonalLink(this._element) && this.getControlPoint()) {
            return true;
        }
        return false;
    },
    createBodyRect: function () {
        var h = this.getHotSpot();
        if (h) {
            return { x: h.x - 1, y: h.y - 1, width: 2, height: 2 };
        }
        return null;
    },
    hit: function (x, y) {
        return this.hitCanvas(x, y, ['_linkCanvas']);
    },
    intersects: function (rect) {
        return this.intersectsCanvas(rect, ['_linkCanvas']);
    },
    checkAttachments: function () {
        twaver.network.LinkUI.superClass.checkAttachments.call(this);
        this.checkLinkHandlerAttachment();
    },
    checkLinkHandlerAttachment: function () {
        var label = this._network.getLinkHandlerLabel(this._element);
        if (label != null && label !== '') {
            if (!this._linkHandlerAttachment) {
                this._linkHandlerAttachment = new twaver.network.LinkHandlerAttachment(this);
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
    getLinkPoints: function () {
        if (!this._linkPoints) {
            this._linkPoints = this.createLinkPoints();
            this._lineLength = $math.calculateLineLength(this._linkPoints);
        }
        return this._linkPoints;
    },
    invalidate: function (checkAttachments) {
        this._linkPoints = null;
        this._fromPoint = null;
        this._toPoint = null;
        twaver.network.LinkUI.superClass.invalidate.call(this, checkAttachments);
    },
    getFromPosition: function (xoffset, yoffset) {
        var point = this.getFromPoint();
        if (point) {
            return { x: point.x + xoffset, y: point.y + yoffset };
        }
        return null;
    },
    getToPosition: function (xoffset, yoffset) {
        var point = this.getToPoint();
        if (point) {
            return { x: point.x + xoffset, y: point.y + yoffset };
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
    updateMeasure: function () {
        twaver.network.LinkUI.superClass.updateMeasure.call(this);
        this.drawBody();
    },
    createLinkPoints: function () {
        var fromPoint = this.getFromPoint();
        var toPoint = this.getToPoint();
        var type = this.getStyle('link.type');
        var points = new $List();

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
    drawLinePoints: function (g, points, width, color, pattern) {
        g.lineWidth = width;
        g.strokeStyle = color;
        if (this._element.getStyle("link.flow") === true && pattern && pattern.length > 1) {
            var dashedLine = new $DashedLine(g, pattern[0], pattern[1]);
            var offset = this._element.getStyle("link.flow.offset");
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
    drawBody: function () {
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
            bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(points, true,
                    link.getStyle('arrow.from.shape'),
                    link.getStyle('arrow.from.width'),
                    link.getStyle('arrow.from.height'),
                    link.getStyle('arrow.from.xoffset'),
                    link.getStyle('arrow.from.yoffset')
                ));
        }
        if (link.getStyle('arrow.to')) {
            bounds = $math.unionRect(bounds,
                $arrow.getArrowRect(points, false,
                    link.getStyle('arrow.to.shape'),
                    link.getStyle('arrow.to.width'),
                    link.getStyle('arrow.to.height'),
                    link.getStyle('arrow.to.xoffset'),
                    link.getStyle('arrow.to.yoffset')
                ));
        }

        var g = this.setShadow(this, this._linkCanvas, bounds);
        g.lineCap = link.getStyle('link.cap');
        g.lineJoin = link.getStyle('link.join');
        var pattern = link.getStyle('link.pattern');
        if (selectBorder) {
            this.drawLinePoints(g, points, grow, link.getStyle('select.color'), pattern);
        }
        if (this._outerColor) {
            this.drawLinePoints(g, points, width + outerWidth * 2, this._outerColor, pattern);
        }
        this.drawLinePoints(g, points, width, this._innerColor || link.getStyle('link.color'), pattern);

        this.addBodyBounds(bounds);
        this.addComponent(this._linkCanvas);

        $arrow.drawLinkArrow(this, g, points);
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
    }
});
