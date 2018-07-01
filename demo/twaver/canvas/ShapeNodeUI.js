twaver.canvas.ShapeNodeUI = function (network, element) {
    twaver.canvas.ShapeNodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.canvas.ShapeNodeUI', twaver.canvas.NodeUI, {
    getDefaultBodyRect: function () {
        if (this._element._points.size() < 2) {
            return null;
        }
        return this.getPathRect("vector", true);
    },
    drawDefaultBody: function (ctx) {
        if (this._element._points.size() < 2) {
            return;
        }
        this.drawPath(ctx, "vector", true, this._element.getStyle('vector.outline.pattern'),
        	this._element._points, this._element._segments, this._element.getStyle('shapenode.closed'));
        $arrow.drawLinkArrow(this, ctx, $math.getPointObject(this._element._points, this._element._segments));
    },
    drawSelectBorder: function (ctx) {
        var node = this._element;
        var lineWidth = node.getStyle('select.width');
        if (lineWidth > 0) {
            var rect = this.getBodyRect();
            $math.addPadding(rect, node, 'select.padding', 1);

            $math.grow(rect, lineWidth / 2, lineWidth / 2);
            var outlineWidth = node.getStyle('vector.outline.width');
            if (outlineWidth > 0) {
                $math.grow(rect, outlineWidth / 2, outlineWidth / 2);
            }

            ctx.lineWidth = lineWidth;
            ctx.lineCap = node.getStyle('select.cap');
            ctx.lineJoin = node.getStyle('select.join');
            ctx.strokeStyle = node.getStyle('select.color');
            $g.drawVector(ctx, node.getStyle('select.shape'), null, rect);
            ctx.stroke();
        }
    }
});
