twaver.Grid = function (id) {
    twaver.Grid.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Grid', twaver.Follower, {
    _icon: $Defaults.ICON_GRID,
    _image: null,
    getCellObject: function (x, y) {
        if (arguments.length === 1) {
            y = x.y;
            x = x.x;
        }
        var rowCount = this.getStyle('grid.row.count');
        var columnCount = this.getStyle('grid.column.count');
        for (var r = 0; r < rowCount; r++) {
            for (var c = 0; c < columnCount; c++) {
                var rect = this.getCellRect(r, c);
                if ($math.containsPoint(rect, x, y)) {
                    return {
                        "rowIndex": r,
                        "columnIndex": c,
                        "rect": rect
                    };
                }
            }
        }
        return null;
    },
    getCellRect: function (rowIndex, columnIndex) {
        var rowCount = this.getStyle('grid.row.count');
        var columnCount = this.getStyle('grid.column.count');
        if (rowCount <= 0 || columnCount <= 0) {
            return null;
        }
        if (rowIndex < 0 || rowIndex >= rowCount) {
            return null;
        }
        if (columnIndex < 0 || columnIndex >= columnCount) {
            return null;
        }
        var rect = this.getRect();
        $math.addPadding(rect, this, 'grid.border');

        var index = 0;
        var rows = this.getStyle('grid.row.percents');
        var columns = this.getStyle('grid.column.percents');
        if (rows && rows.length === rowCount) {
            var h = 0;
            for (index = 0; index < rowIndex; index++) {
                h += rect.height * rows[index];
            }
            rect.y += h;
            rect.height = rect.height * rows[rowIndex];
        } else {
            rect.height = rect.height / rowCount;
            rect.y += rect.height * rowIndex;
        }
        if (columns && columns.length === columnCount) {
            var w = 0;
            for (index = 0; index < columnIndex; index++) {
                w += rect.width * columns[index];
            }
            rect.x += w;
            rect.width = rect.width * columns[columnIndex];
        } else {
            rect.width = rect.width / columnCount;
            rect.x += rect.width * columnIndex;
        }
        $math.addPadding(rect, this, 'grid.padding');
        return rect;
    },
    getElementUIClass: function () {
        return twaver.network.GridUI;
    },
    getCanvasUIClass: function () {
        return twaver.canvas.GridUI;
    },
    getVectorUIClass : function(){
    	return twaver.vector.GridUI;
    },
});
