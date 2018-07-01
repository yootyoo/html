twaver.network.ShapeNodeUI = function (network, element) {
    twaver.network.ShapeNodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.ShapeNodeUI', twaver.network.NodeUI, {
    drawDefaultBody: function () {
        if (this._element._points.size() < 2) {
            this.addBodyBounds({x: this._element.getX(), y: this._element.getY(), width: 0, height: 0});
            return;
        }
        if (!this._nodeCanvas) {
            this._nodeCanvas = $html.createCanvas();
        }

        var bounds = $g.drawPath(this, this._nodeCanvas, 'vector', true, this._element.getStyle('vector.outline.pattern'),
            this._element._points, this._element._segments, this._element.getStyle('shapenode.closed'));
        this.addBodyBounds(bounds);
        this.addComponent(this._nodeCanvas);

        $arrow.drawLinkArrow(this, this._nodeCanvas.getContext('2d'), $math.getPointObject(this._element._points, this._element._segments));
    },
    drawSelectBorder: function () {
        var node = this._element;
        var lineWidth = node.getStyle('select.width');
        if (lineWidth > 0) {
            var rect = this.getBodyRect();
            $math.addPadding(rect, node, 'select.padding', 1);
            var outlineWidth = node.getStyle('vector.outline.width');
            if (outlineWidth > 0) {
                $math.grow(rect, outlineWidth / 2, outlineWidth / 2);
            }
            if (!this._selectCanvas) {
                this._selectCanvas = $html.createCanvas();
            }
            var bounds = _twaver.clone(rect);
            $math.grow(bounds, lineWidth / 2, lineWidth / 2);
            var g = $html.setCanvas(this._selectCanvas, bounds);

            g.lineWidth = lineWidth;
            g.lineCap = node.getStyle('select.cap');
            g.lineJoin = node.getStyle('select.join');
            g.strokeStyle = node.getStyle('select.color');
            $g.drawVector(g, node.getStyle('select.shape'), null, rect);
            g.stroke();
            this.addComponent(this._selectCanvas);
            this.addBodyBounds(bounds);
        }
    }
});
