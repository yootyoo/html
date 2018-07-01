twaver.vector.GridUI = function (network, element) {
    twaver.vector.GridUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.GridUI', twaver.vector.NodeUI, {
    drawDefaultBody: function (ctx) {
        if (this._element.getImage()) {
            twaver.vector.GridUI.superClass.drawDefaultBody.apply(this, arguments);
        } else {
            this.drawGridBody(ctx);
        }
    },
    validateBodyBounds: function () {
        if (this._element.getImage()) {
            twaver.vector.GridUI.superClass.validateBodyBounds.call(this);
        } else {
            var bodyRect = this.getBodyRect();
            var bounds = _twaver.clone(bodyRect);
            var lineWidth = this._element.getStyle('outer.width');
            $math.grow(bounds,lineWidth,lineWidth);
            this.appendShadowBound(this, bounds);
            this.addBodyBounds(bounds);
        }
    },
    
    _getZoomCellRect : function(r,c){
    	 var rect = this._element.getCellRect(r, c);
    	 var b = this._element.getRect();
    	 var cx = b.x + b.width/2;
    	 var cy = b.y + b.height/2;
    	 var zb = this.getZoomBodyRect();
    	 var sizeZoom = zb.width/b.width;
    	 var czx = zb.x + zb.width/2;
    	 var dZoom = cx == 0 ? 1 : czx / cx;
    	 return {
    	 	x : cx * dZoom + (rect.x - cx) * sizeZoom,
    	 	y : cy * dZoom + (rect.y - cy) * sizeZoom,
    	 	width : rect.width * sizeZoom,
    	 	height : rect.height * sizeZoom
    	 };
    },
    
    drawGridBody: function (ctx) {
        var fill = this.getStyle('grid.fill');
        var gridDeep = this.getStyle('grid.deep');
        var cellDeep = this.getStyle('grid.cell.deep');

        if (!fill && gridDeep === 0 && cellDeep === 0) {
            return;
        }
        ctx.beginPath();
        var bodyRect = this.getZoomBodyRect();
        var fillColor = this.getDyeColor('grid.fill.color');
        this.setGlow(this, ctx);
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
                    var rect = this._getZoomCellRect(r,c);//this._element.getCellRect(r, c);
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
