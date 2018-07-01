twaver.controls.TableHeaderInteraction = function (tableHeader) {
    this.header = tableHeader;
    this.table = tableHeader._table;
    this.view = tableHeader._view;

    var self = this;
    this.view.addEventListener('mousedown', function (e) {
        self.handleMouseDown(e);
    }, false);
    this.view.addEventListener('mousemove', function (e) {
        self.handleMouseMove(e);
    }, false);
};
_twaver.ext('twaver.controls.TableHeaderInteraction', Object, {
    handleMouseDown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (this.movableDiv) {
            this.handleMouseUp(e);
            return;
        }
        this.resizeColumn = e.target._resizeColumn;
        if (!this.resizeColumn) {
            this.movableDiv = this.getMovableDivAt(e);
        }
        this.changeCursor(e);
        this._startClient = $html.getClientPoint(e);
        this.lastX = this.getX(e);
        this._startLogicalX = this.lastX;
        $html.handle_mousedown(this, e);
    },
    changeCursor: function (e) {
        var cursor = ''
        if (e.target._resizeColumn) {
            cursor = 'ew-resize';
        } else {
            var column = this.getColumnAt(e);
            if (column && (column.isMovable() || column.isSortable())) {
                cursor = 'pointer';
            }
        }
        this.view.style.cursor = cursor;
    },
    handleMouseMove: function (e) {
        if (this.lastX == null) {
            this.changeCursor(e);
            return;
        }
        if ($html.target !== this) {
            return;
        }
        var x = this._startLogicalX + e.clientX - this._startClient.x;
        // resize column
        if (this.resizeColumn) {
            if (this.stopX != null) {
                if (x < this.stopX) {
                    return;
                } else {
                    delete this.stopX;
                }
            }
            var w = this.resizeColumn.getWidth() + (x - this.lastX) / this.table.getZoom();
            if (w < 10) {
                w = 10;
                this.stopX = x;
            }

            this.resizeColumn.setWidth(w);
            this.lastX = x;
        }
        // move column
        else if (this.movableDiv) {
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
    handleMouseUp: function (e) {
        if (e.button !== 0) {
            return;
        }
        var column;
        if (this.resizeColumn) {
            // do nothing
        } else if (this.movableDiv && this.columnInfo) {
            column = this.movableDiv._column;
            var index = this.columnInfo.index;
            this.table.getColumnBox().moveTo(column, index);
        } else {
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
                this.table.onColumnSorted(this.table.getSortColumn());
            }
        }
        this.clear();
    },
    clear: function () {
        this.view.style.cursor = '';
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
        delete this._startClient;
        delete this._startLogicalX;
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
        var x = this._startLogicalX + e.clientX - this._startClient.x + this.table.getView().scrollLeft;
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
