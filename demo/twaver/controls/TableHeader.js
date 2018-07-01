twaver.controls.TableHeader = function (table) {
    twaver.controls.TableHeader.superClass.constructor.apply(this, arguments);
    this._invalidateScroll = false;
    this._invalidateDisplay = false;

    this._divPool = new twaver.Pool('div');
    this._imagePool = new twaver.Pool('img');
    this._textPool = new twaver.Pool('span');
    this._resizePool = new twaver.Pool('div');

    this._pools.add(this._divPool);
    this._pools.add(this._imagePool);
    this._pools.add(this._textPool);
    this._pools.add(this._resizePool);

    this._table = table;
    this._tableView = table.getView();
    this._columnBox = table.getColumnBox();
    this._columnBox.addDataBoxChangeListener(this.handleColumnBoxChange, this);
    this._columnBox.addDataPropertyChangeListener(this.handleColumnPropertyChange, this);
    this._columnBox.addHierarchyChangeListener(this.handleColumnHierarchyChange, this);

    var self = this;

    table.getView().addEventListener('scroll', function (e) {
        self.invalidateScroll();
    }, false);
    table.addPropertyChangeListener(function (e) {
        self.invalidateDisplay();
    }, this);

    this._view = $html.createView('hidden');
    this._view.tabIndex = -1;
    this._view.style.background = $Defaults.TABLEHEADER_BACKGROUND;
    this._rootDiv = $html.createDiv();
    this._view.appendChild(this._rootDiv);

    this.invalidateDisplay();

    if ($ua.isTouchable && !$ua.isMSToucheable) {
        new twaver.controls.TableHeaderTouchInteraction(this);
    }
    new twaver.controls.TableHeaderInteraction(this);
};
_twaver.ext('twaver.controls.TableHeader', twaver.controls.ControlBase, {
    __accessor: ['height', 'moveBackground', 'insertBackground', 'columnLineColor',
        'resizeTolerance', 'sortDescIcon', 'sortAscIcon', 'sortIconPosition'],

    _height: $Defaults.TABLEHEADER_HEIGHT,
    _moveBackground: $Defaults.TABLEHEADER_MOVE_BACKGROUND,
    _insertBackground: $Defaults.TABLEHEADER_INSERT_BACKGROUND,
    _columnLineColor: $Defaults.TABLEHEADER_COLUMN_LINE_COLOR,
    _resizeTolerance: $Defaults.TABLEHEADER_RESIZE_TOLERANCE,

    _sortDescIcon: $Defaults.TABLEHEADER_SORT_DESC_ICON,
    _sortAscIcon: $Defaults.TABLEHEADER_SORT_ASC_ICON,
    _sortIconPosition: $Defaults.TABLEHEADER_SORT_ICON_POSITION,

    getRootDiv: function () {
        return this._rootDiv;
    },

    handleColumnBoxChange: function (e) {
        this.invalidateDisplay();
    },
    handleColumnPropertyChange: function (e) {
        this.invalidateDisplay();
    },
    handleColumnHierarchyChange: function (e) {
        this.invalidateDisplay();
    },
    onPropertyChanged: function (e) {
        this.invalidateDisplay();
    },
    invalidateScroll: function () {
        if (this._invalidateScroll) {
            return;
        }
        this._invalidateScroll = true;
        this.invalidate();
    },
    invalidateDisplay: function () {
        if (this._invalidateDisplay) {
            return;
        }
        this._invalidateDisplay = true;
        this._invalidateScroll = true;
        this.invalidate();
    },
    validate: function () {
        if (!this._invalidate) {
            return;
        }
        this._invalidate = false;
        if (this._invalidateDisplay) {
            this._invalidateDisplay = false;
            this.validateDisplay();
        }
        if (this._invalidateScroll) {
            this._invalidateScroll = false;
            this._rootDiv.style.left = -this._tableView.scrollLeft + 'px';
        }
    },
    validateDisplay: function () {
        $html.release(this._rootDiv);

        var zoom = this._table.getZoom();
        var hpx = this.getHeight() + 'px';
        var lhpx = this.getHeight() - 2 + 'px';
        var columns = this._table.getColumnBox().getRoots();
        var count = columns.size();
        var sumWidth = 0;
        var normalLineWidth = this._table._columnLineWidth * zoom;

        for (var i = 0; i < count; i++) {
            var column = columns.get(i);

            if (column.isVisible()) {
                var width = column.getWidth() * zoom;
                if (width < 0) width = 0;
                var lineWidth = Math.min(normalLineWidth, width);

                var div = this._divPool.get();
                div._column = column;

                var style = div.style;
                style.position = 'absolute';
                style.whiteSpace = 'nowrap';
                style.lineHeight = lhpx;
                style.overflow = 'hidden';
                style.textOverflow = 'ellipsis';
                style.backgroundPosition = this._sortIconPosition ? this._sortIconPosition : '';
                style.backgroundRepeat = 'no-repeat';
                style.backgroundImage = '';
                style.textAlign = column.getHorizontalAlign();

                style.borderStyle = 'solid';
                style.borderWidth = '0px';
                style.borderRightWidth = lineWidth + 'px';
                style.borderRightColor = this._columnLineColor;
                
                if (i === 0) {
                    style.borderLeftWidth = lineWidth + 'px';
                    style.borderLeftColor = this._columnLineColor;
                } else {
                    style.borderLeftWidth = '0px';
                }

                style.left = sumWidth + 'px';
                style.width = width - lineWidth + 'px';
                style.height = hpx;
                div._x = sumWidth;
                div._width = width - lineWidth;

                this._rootDiv.insertBefore(div, this._rootDiv.firstChild);
                this.renderColumn(div, column);
                this.onColumnRendered(div, column);

                sumWidth += width;

                if (column.isResizable()) {
                    div = this._resizePool.get();
                    div._resizeColumn = column;
                    style = div.style;
                    style.position = 'absolute';
                    style.backgroundColor = 'white';
                    style.opacity = 0;
                    style.left = sumWidth - lineWidth - this._resizeTolerance + 'px';
                    style.width = lineWidth + this._resizeTolerance * 2 + 'px';
                    style.height = hpx;
                    this._rootDiv.appendChild(div);
                }
            }
        }

        this._pools.forEach(function (pool) {
            pool.clear();
        });

        this._rootDiv.style.width = sumWidth + 'px';
        this._rootDiv.style.height = hpx;
    },
    renderColumn: function (div, column) {
        if (column.renderHeader) {
            column.renderHeader(div);
        } else {
            var span = this._textPool.get();
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = column.getName() ? column.getName() : column.getPropertyName();
            span.setAttribute('title', span.innerHTML);
            div.appendChild(span);

            if ($ua.isOpera) {
                var maskDiv = div.cloneNode(false);
                maskDiv.style.left = '0px';
                maskDiv.style.top = '0px';
                maskDiv.style.opacity = 0;
                div.appendChild(maskDiv);
            }
        }

        if (this._table.getSortColumn() === column && column.isSortable()) {
            var name = column.getSortDirection() === 'asc' ? this._sortAscIcon : this._sortDescIcon;
            var src = _twaver.getImageSrc(name);

            if (!this._sortIconPosition || this._sortIconPosition === '') {
                var image = this._imagePool.get();
                image.setAttribute('src', src);
                image.style.verticalAlign = 'middle';
                div.appendChild(image);
            } else {
                div.style.backgroundImage = 'url(' + src + ')';
            }
        }
    },
    onColumnRendered: function (div, column) {

    }

});
