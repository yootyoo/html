twaver.network.GridUI = function (network, element) {
    twaver.network.GridUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.GridUI', twaver.network.NodeUI, {
    drawDefaultBody: function () {
        if (this._element.getImage()) {
            twaver.network.GridUI.superClass.drawDefaultBody.call(this);
        } else {
            this.drawGridBody();
        }
    },
    drawGridBody: function () {
        var fill = this.getStyle('grid.fill');
        var gridDeep = this.getStyle('grid.deep');
        var cellDeep = this.getStyle('grid.cell.deep');

        if (!fill && gridDeep === 0 && cellDeep === 0) {
            return;
        }
        var bodyRect = this.getBodyRect();
        var fillColor = this.getDyeColor('grid.fill.color');
        if (!this._nodeCanvas) {
            this._nodeCanvas = $html.createCanvas();
        }
        var bounds = _twaver.clone(bodyRect);
        var g = this.setShadow(this, this._nodeCanvas, bounds);
        g.rect(bodyRect.x, bodyRect.y, bodyRect.width, bodyRect.height);
        this.addComponent(this._nodeCanvas);
        // draw body
        if (fill) {
            g.fillStyle = fillColor;
            g.fill();
        }
        // draw border deep
        if (gridDeep != 0) {
            $g.draw3DRect(g, fillColor, gridDeep, bodyRect.x, bodyRect.y, bodyRect.width, bodyRect.height);
        }
        // draw cell deep
        if (cellDeep != 0) {
            var row = this.getStyle('grid.row.count');
            var col = this.getStyle('grid.column.count');
            for (var r = 0; r < row; r++) {
                for (var c = 0; c < col; c++) {
                    var rect = this._element.getCellRect(r, c);
                    if (rect != null) {
                        $g.draw3DRect(g, fillColor, cellDeep, rect.x, rect.y, rect.width, rect.height);
                    }
                }
            }
        }
        this.addBodyBounds(bounds);
    }
});
