twaver.charts.LegendPane = function (chart) {
    twaver.charts.LegendPane.superClass.constructor.apply(this, arguments);
    this._divPool = new twaver.Pool('div');
    this._iconPool = new twaver.Pool('div');
    this._textPool = new twaver.Pool('span');

    this._pools.add(this._divPool);
    this._pools.add(this._iconPool);
    this._pools.add(this._textPool);

    this._chart = chart;
    this._chart.addViewListener(this.handleViewChange, this);

    this._view = $html.createView('hidden');
    this._view.style.verticalAlign = 'middle';

    this._legendDiv = $html.createDiv();
    this._legendDiv.style.whiteSpace = 'nowrap';
    this._legendDiv.style.verticalAlign = 'middle';
    this._legendDiv.style.position = '';

    this._view.appendChild(this._legendDiv);

    this._hiddenMap = {};
    var self = this;
    this._chart._internalVisibleFunction = function (data) {
        return !self.isHidden(data);
    };

    var Interaction;
    if ($ua.isTouchable&&!$ua.isMSToucheable) {
        Interaction = twaver.charts.LegendPaneTouchInteraction;
    } else {
        Interaction = twaver.charts.LegendPaneInteraction;
    }
    if (Interaction) {
        new Interaction(this);
    }
};
_twaver.ext('twaver.charts.LegendPane', twaver.controls.ControlBase, {
    __accessor: ['iconWidth', 'iconHeight', 'iconRadius', 'rowHeight', 'orientation', 'hiddenColor',
                        'selectBackgroundColor', 'selectForegroundColor'],

    _iconWidth: $Defaults.LEGENDPANE_ICON_WIDTH,
    _iconHeight: $Defaults.LEGENDPANE_ICON_HEIGHT,
    _iconRadius: $Defaults.LEGENDPANE_ICON_RADIUS,
    _rowHeight: $Defaults.LEGENDPANE_ROW_HEIGHT,
    _orientation: $Defaults.LEGENDPANE_ORIENTATION,
    _hiddenColor: $Defaults.LEGENDPANE_HIDDEN_COLOR,
    _selectBackgroundColor: $Defaults.LEGENDPANE_SELECT_BACKGROUND_COLOR,
    _selectForegroundColor: $Defaults.LEGENDPANE_SELECT_FOREGROUND_COLOR,

    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getChart: function () {
        return this._chart;
    },
    isHidden: function (data) {
        return this._hiddenMap[data.getId()] != null;
    },
    handleViewChange: function (e) {
        if (e.kind === 'validateEnd') {
            this._invalidate = true;
            this.validate();
        }
    },
    validate: function () {
        if (!this._invalidate) {
            return;
        }
        this._invalidate = false;
        $html.release(this._legendDiv);

        _twaver.keys(this._hiddenMap).forEach(function (id) {
            if (!this._chart.getDataBox().containsById(id)) {
                delete this._hiddenMap[id];
            }
        }, this);

        var datas = new $List(this._chart.getUnfilteredDatas());
        for (var i = 0; i < datas.size(); i++) {
            var data = datas.get(i);
            if (!this._chart.isVisible(data) && !this.isHidden(data)) {
                datas.removeAt(i);
                i--;
            }
        }
        var count = datas.size();

        var style = this._view.style;
        var horizontal = this._orientation === 'horizontal';
        if (horizontal) {
            style.textAlign = 'center';
            style.height = this._rowHeight + 'px';
        } else {
            style.textAlign = '';
            style.height = this._rowHeight * count + 'px';
        }
        style.lineHeight = this._rowHeight - 2 + 'px';

        for (i = 0; i < count; i++) {
            var data = datas.get(i);
            var div = this._divPool.get();
            div._data = data;
            div.style.cursor = 'pointer';
            div.style.height = this._rowHeight + 'px';
            if (horizontal) {
                div.style.display = 'inline-block';
            } else {
                div.style.display = 'block';
            }

            this._legendDiv.appendChild(div);
            // render legend
            this.renderLegend(div, data);
            this.onLegendRendered(div, data);
        }
        this._pools.forEach(function (pool) {
            pool.clear();
        });
    },
    renderLegend: function (div, data) {
        var visible = !this.isHidden(data);
        var selected = this._chart.isSelected(data);

        var icon = this._iconPool.get();
        var style = icon.style;
        style.display = 'inline-block';
        style.verticalAlign = 'middle';
        style.marginLeft = '4px';
        style.width = this.getIconWidth() + 'px';
        style.height = this.getIconHeight() + 'px';
        if (visible) {
            style.backgroundColor = this._chart.getColor(data);
        } else {
            style.backgroundColor = this.getHiddenColor();
        }
        div.appendChild(icon);

        var text = this._textPool.get();
        style = text.style;
        style.paddingLeft = '2px';
        style.paddingRight = '4px';
        style.display = 'inline-block';
        style.verticalAlign = 'middle';
        if (visible) {
            style.color = selected ? this._selectForegroundColor : '';
        } else {
            style.color = this.getHiddenColor();
        }
        text.innerHTML = this._chart.getName(data);
        div.appendChild(text);
        if (visible && selected) {
            div.style.backgroundColor = this._selectBackgroundColor;
        } else {
            div.style.backgroundColor = '';
        }
    },
    onLegendRendered: function (div, data) {

    }
});
