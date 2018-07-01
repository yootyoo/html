twaver.network.interaction.CreateOrthogonalLinkInteraction = function (network, typeOrLinkFunction, linkType, isByControlPoint, splitPercent, isSplitByPercent) {
    twaver.network.interaction.CreateOrthogonalLinkInteraction.superClass.constructor.call(this, network, typeOrLinkFunction);
    this.linkType = linkType || 'orthogonal';
    this.isByControlPoint = isByControlPoint;
    this.splitPercent = splitPercent;
    this.isSplitByPercent = isSplitByPercent;

    this.link = new twaver.Link();
    this.link.setStyle('link.type', this.linkType);
    this.link.setStyle('link.split.by.percent', this.isSplitByPercent);
    if ($link.isFlexionalTypeLink(this.linkType) || $link.isExtendTypeLink(this.linkType)) {
        if (this.splitPercent < 0) {
            this.splitPercent = twaver.Styles.getStyle('link.extend');
        }
        this.link.setStyle('link.extend', this.splitPercent);
    } else if ($link.isSplitTypeLink(this.linkType)) {
        if (this.splitPercent < 0) {
            this.splitPercent = twaver.Styles.getStyle(this.isSplitByPercent ? 'link.split.percent' : 'link.split.value');
        }
        if (this.isSplitByPercent) {
            this.link.setStyle('link.split.percent', this.splitPercent);
        } else {
            this.link.setStyle('link.split.value', this.splitPercent);
        }
    }
};
_twaver.ext('twaver.network.interaction.CreateOrthogonalLinkInteraction', twaver.network.interaction.CreateLinkInteraction, {
    clear: function () {
        if (this.path) {
            this.network.getTopDiv().removeChild(this.path);
            this.path = null;
        }
        twaver.network.interaction.CreateOrthogonalLinkInteraction.superClass.clear.call(this);
    },
    createLink: function () {
        var link = twaver.network.interaction.CreateOrthogonalLinkInteraction.superClass.createLink.call(this);
        link.setStyle('link.type', this.linkType);
        link.setStyle('link.split.by.percent', this.isSplitByPercent);
        if (this.isByControlPoint) {
            var controlPoint = $link.getControlPoint(link);
            if (controlPoint) {
                link.SetStyle('link.control.point', controlPoint);
                return link;
            }
        } else {
            if ($link.isFlexionalTypeLink(this.linkType) || $link.isExtendTypeLink(this.linkType)) {
                if (this.splitPercent < 0) {
                    this.splitPercent = twaver.Styles.getStyle('link.extend');
                }
                link.setStyle('link.extend', this.splitPercent);
            } else if ($link.isSplitTypeLink(this.linkType)) {
                if (this.splitPercent < 0) {
                    this.splitPercent = twaver.Styles.getStyle(this.isSplitByPercent ? 'link.split.percent' : 'link.split.value');
                }
                if (this.isSplitByPercent) {
                    link.setStyle('link.split.percent', this.splitPercent);
                } else {
                    link.setStyle('link.split.value', this.splitPercent);
                }
            }
        }
        return link;
    },
    updateLine: function () {
        if (this.currentPoint) {
            if (!this.fromNode || this.currentNode === this.fromNode) {
                return;
            }

            var sourceBounds;
            var fromNodeUI = this.network.getElementUI(this.fromNode);
            if (!fromNodeUI) {
                return;
            }
            sourceBounds = fromNodeUI.getBodyRect();
            if (sourceBounds == null) {
                return;
            }

            var targetBounds;
            if (this.currentNode && this.currentNode !== this.fromNode) {
                var currentNodeUI = this.network.getElementUI(this.currentNode);
                if (!currentNodeUI) {
                    return;
                }
                targetBounds = currentNodeUI.getBodyRect();
            } else {
                targetBounds = { x: this.currentPoint.x, y: this.currentPoint.y, width: 1, height: 1 };
            }
            if (!targetBounds) {
                return;
            }
            var points = $link.calculateOrthogonalAndFlexionalLinkPoints(this.linkType, sourceBounds, targetBounds, this.link);
            $link.drawCorner(points, this.link);

            if (points.size() < 2) {
                return;
            }

            if (!this.line) {
                this.line = $html.createCanvas();
                this.network.getTopDiv().appendChild(this.line);
            }
            var g = $html.setCanvas(this.line, $math.getLineRect(points));
            g.lineWidth = this.network.getEditLineWidth();
            g.strokeStyle = this.network.getEditLineColor();
            g.beginPath();
            $g.drawLinePoints(g, points);
            g.stroke();
        } else {
            if (this.line) {
                this.network.getTopDiv().removeChild(this.line);
                this.line = null;
            }
        }
    }
});
