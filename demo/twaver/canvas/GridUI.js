twaver.canvas.GridUI = function (network, element) {
    twaver.canvas.GridUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.canvas.GridUI', twaver.canvas.NodeUI, {
    drawDefaultBody: function (ctx) {
        if (this._element.getImage()) {
            twaver.canvas.GridUI.superClass.drawDefaultBody.apply(this, arguments);
        } else {
            this.drawGridBody(ctx);
        }
    },
    validateBodyBounds: function () {
        if (this._element.getImage()) {
            twaver.canvas.GridUI.superClass.validateBodyBounds.call(this);
        } else {
            var bodyRect = this.getBodyRect();
            var bounds = _twaver.clone(bodyRect);
            this.appendShadowBound(this, bounds);
            this.addBodyBounds(bounds);
        }
    },
    drawGridBody: function (ctx) {
        var fill = this.getStyle('grid.fill');
        var gridDeep = this.getStyle('grid.deep');
        var cellDeep = this.getStyle('grid.cell.deep');

        if (!fill && gridDeep === 0 && cellDeep === 0) {
            return;
        }
        ctx.beginPath();
        var bodyRect = this._element.getRect();
        var fillColor = this.getDyeColor('grid.fill.color');
        this.setShadow(this, ctx);
        // draw body
        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.rect(bodyRect.x, bodyRect.y, bodyRect.width, bodyRect.height);
            ctx.fill();
        }
        ctx.closePath();
        this.clearShadow(ctx);
        ctx.beginPath();
        // draw border deep
        if (gridDeep != 0) {
            $g.draw3DRect(ctx, fillColor, gridDeep, bodyRect.x, bodyRect.y, bodyRect.width, bodyRect.height);
        }
        ctx.closePath();
        // draw cell deep
        if (cellDeep != 0) {
            var row = this.getStyle('grid.row.count');
            var col = this.getStyle('grid.column.count');
            for (var r = 0; r < row; r++) {
                for (var c = 0; c < col; c++) {
                    var rect = this._element.getCellRect(r, c);
                    if (rect != null) {
                        ctx.beginPath();
                        $g.draw3DRect(ctx, fillColor, cellDeep, rect.x, rect.y, rect.width, rect.height);
                        ctx.closePath();
                    }
                }
            }
        }
    }
});
