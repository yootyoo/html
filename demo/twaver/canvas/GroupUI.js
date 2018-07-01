twaver.canvas.GroupUI = function (network, element) {
    twaver.canvas.GroupUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.canvas.GroupUI', twaver.canvas.NodeUI, {
    isEditable: function () {
        return !this._element.isExpanded();
    },
    paintBody: function (ctx) {
        if (this._shapeRect) {
            this.drawExpandedGroup(ctx);
        } else {
            twaver.canvas.GroupUI.superClass.paintBody.apply(this, arguments);
        }
    },
    validateBodyBounds: function () {
        this.getBodyRect();
        if (this._shapeRect) {
            this.addBodyBounds(this.getPathRect("group", false));
        } else {
            twaver.canvas.GroupUI.superClass.validateBodyBounds.call(this);
        }
    },
    drawExpandedGroup: function (ctx) {
        this.drawPath(ctx, 'group', false, this._element.getStyle('vector.outline.pattern'));
        var deep = this.getStyle('group.deep');
        var fillColor = this.getStyle('group.fill.color');
        if (deep !== 0 && fillColor) {
            if (this.getStyle('group.shape') === 'rectangle') {
                $g.draw3DRect(ctx, fillColor, deep, this._bodyRect);
            }
        }
    },
    getChildrenRects: function () {
        return this._network.getGroupChildrenRects(this._element);
    },
    createBodyRect: function () {
        this._shapeRect = null;
        var group = this._element;
        var network = this._network;
        if (group.isExpanded()) {
            group.getChildren().forEach(function (child) {
                var ui = network.getElementUI(child);
                ui && ui.validate();
            });
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
            return twaver.canvas.GroupUI.superClass.createBodyRect.call(this);
        }
    }
});
