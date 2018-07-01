twaver.network.GroupUI = function (network, element) {
    twaver.network.GroupUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.GroupUI', twaver.network.NodeUI, {
    isEditable: function () {
        return !this._element.isExpanded();
    },
    drawBody: function () {
        var bodyRect = this.getBodyRect();
        if (this._shapeRect) {
            this.drawExpandedGroup();
        } else {
            twaver.network.GroupUI.superClass.drawBody.call(this);
        }
    },
    drawExpandedGroup: function () {
        if (!this._nodeCanvas) {
            this._nodeCanvas = $html.createCanvas();
        }
        var bounds = $g.drawPath(this, this._nodeCanvas, 'group', false, this._element.getStyle('vector.outline.pattern'));
        var deep = this.getStyle('group.deep');
        var fillColor = this.getStyle('group.fill.color');
        if (deep !== 0 && fillColor) {
            if (this.getStyle('group.shape') === 'rectangle') {
                $g.draw3DRect(this._nodeCanvas.getContext('2d'), fillColor, deep, this._bodyRect);
            }
        }
        this.addBodyBounds(bounds);
        this.addComponent(this._nodeCanvas);
    },
    getChildrenRects: function () {
        return this._network.getGroupChildrenRects(this._element);
    },
    createBodyRect: function () {
        this._shapeRect = null;
        var group = this._element;
        if (group.isExpanded()) {
            var rects = this.getChildrenRects();
            if (!rects.isEmpty()) {
                var shape = group.getStyle('group.shape');
                var func = $group[shape];
                if (!func) {
                    throw "Can not resolve group shape '" + shape + "'";
                }
                this._shapeRect = func(rects);
            }
        }
        if (this._shapeRect) {
            $math.addPadding(this._shapeRect, group, 'group.padding', 1);
            return this._shapeRect;
        } else {
            return twaver.network.GroupUI.superClass.createBodyRect.call(this);
        }
    }
});
