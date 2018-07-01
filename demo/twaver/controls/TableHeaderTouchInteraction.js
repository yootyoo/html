twaver.controls.TableHeaderTouchInteraction = function (tableHeader) {
    this.header = tableHeader;
    this.table = tableHeader._table;
    this.view = tableHeader._view;

    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.controls.TableHeaderTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (this.movableDiv) {
            this.handleTouchend(e);
            return;
        }
        this.resizeColumn = e.target._resizeColumn;
        if (!this.resizeColumn) {
            this.movableDiv = this.getMovableDivAt(e);
        }
        this.lastX = this.getX(e);
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (this.lastX == null) {
            return;
        }
        var x;
        // resize column
        if (this.resizeColumn) {
            x = this.getX(e);
            if (this.stopX != null) {
                if (x < this.stopX) {
                    return;
                } else {
                    delete this.stopX;
                }
            }
            var w = this.resizeColumn.getWidth() + (x - this.lastX) / this.table.getZoom();
            if (w < 0) {
                w = 0;
                this.stopX = x;
            }

            this.resizeColumn.setWidth(w);
            this.lastX = x;
        }
        // move column
        else if (this.movableDiv) {
            x = this.getX(e);
            var offset = x - this.lastX;

            if (!this.cloneDiv) {
                if (Math.abs(offset) < 3) {
                    return;
                }
                this.cloneDiv = this.movableDiv.cloneNode(true);
                this.cloneDiv._x = this.movableDiv._x;
                this.cloneDiv.style.background = this.header.getMoveBackground();

                this.insertDiv = $html.createDiv();
                this.insertDiv.style.width = '1px';
                this.insertDiv.style.height = this.cloneDiv.style.height;
                this.insertDiv.style.background = this.header.getInsertBackground();

                this.movableDiv.parentNode.appendChild(this.cloneDiv);
                this.movableDiv.parentNode.appendChild(this.insertDiv);
            }


            var left = this.cloneDiv._x + offset;
            this.cloneDiv.style.left = left + 'px';
            this.cloneDiv._x = left;
            this.lastX = x;

            this.columnInfo = this.getColumnInfoAt(e);
            if (this.columnInfo) {
                this.insertDiv.style.left = this.columnInfo.position;
            }
        }
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        var column;
        if (this.resizeColumn) {
            // do nothing
        }
        else if (this.movableDiv && this.columnInfo) {
            column = this.movableDiv._column;
            var index = this.columnInfo.index;
            this.table.getColumnBox().moveTo(column, index);
        }
        else {
            column = this.getColumnAt(e);
            if (column && column.isSortable()) {
                var direction = column.getSortDirection();
                if (this.table.getSortColumn() === column) {
                    if (direction === 'desc') {
                        this.table.setSortColumn(null);
                    }
                    column.setSortDirection(direction === 'asc' ? 'desc' : 'asc');
                } else {
                    this.table.setSortColumn(column);
                }
            }
        }
        this.clear();
        $html.removeEventListener('touchmove', this.view, this);
        $html.removeEventListener('touchend', this.view, this);
    },
    clear: function () {
        if (this.cloneDiv && this.movableDiv) {
            this.movableDiv.parentNode.removeChild(this.cloneDiv);
        }
        if (this.insertDiv && this.movableDiv) {
            this.movableDiv.parentNode.removeChild(this.insertDiv);
        }
        delete this.movableDiv;
        delete this.columnInfo;
        delete this.insertDiv;
        delete this.cloneDiv;
        delete this.resizeColumn;
        delete this.stopX;
        delete this.lastX;
    },
    getColumnAt: function (e) {
        e = e.target;
        var column;
        while (e && e !== this.view && !(column = e._column)) {
            e = e.parentNode;
        }
        return column;
    },
    getMovableDivAt: function (e) {
        e = e.target;
        var column;
        while (e && e !== this.view && !(column = e._column)) {
            e = e.parentNode;
        }
        if (column && column.isMovable()) {
            return e;
        }
        return null;
    },
    getX: function (e) {
        var p = $html.getLogicalPoint(this.view, e);
        return p ? p.x : null;
    },
    getColumnInfoAt: function (e) {
        var x = this.getX(e) + this.table.getView().scrollLeft;
        var columns = this.table.getColumnBox().getRoots();
        var count = columns.size();
        var zoom = this.table.getZoom();
        var sumWidth = 0;
        var meetMovingColumn = false;
        for (var i = 0; i < count; i++) {
            var column = columns.get(i);
            if (column === this.movableDiv._column) {
                meetMovingColumn = true;
            }
            if (column.isVisible()) {
                var width = column.getWidth() * zoom;
                if (width <= 0) {
                    continue;
                }
                if (x >= sumWidth && x <= sumWidth + width) {
                    var isFront = x < sumWidth + width / 2;
                    if (meetMovingColumn &&
                        !(column === this.movableDiv._column && isFront)) {
                        i--;
                    }
                    var index = isFront ? Math.max(0, i) : Math.min(i + 1, count);
                    var position = isFront ? sumWidth : sumWidth + width;
                    position = Math.max(0, position - 1);
                    return {
                        index: index,
                        column: column,
                        position: position + 'px'
                    };
                }
                sumWidth += width;
            }
        }
        return this.columnInfo;
    }
});
