twaver.charts.ChartPane = function (chart, title, legendOrientation, legendWidth) {
    twaver.charts.ChartPane.superClass.constructor.apply(this, arguments);
    this.invalidate();

    this._chart = chart;
    this._legendPane = new twaver.charts.LegendPane(chart);

    this._titleDiv = $html.createDiv();
    this._titleDiv.style.verticalAlign = 'middle';
    this._titleDiv.style.whiteSpace = 'nowrap';

    this._view = $html.createView('hidden');
    this._view.appendChild(this._titleDiv);
    this._view.appendChild(this._legendPane.getView());
    this._view.appendChild(this._chart.getView());

    var self = this;
    this._legendPane.addPropertyChangeListener(function (e) {
        if (e.property === 'rowHeight' || e.porperty === 'orientation') {
            self.invalidate();
        }
    });

    if (arguments.length > 1) this.setTitle(title);
    if (arguments.length > 2) this.setLegendOrientation(legendOrientation);
    if (arguments.length > 3) this.setLegendWidth(legendWidth);
};
_twaver.ext('twaver.charts.ChartPane', twaver.controls.ControlBase, {
    __accessor: ['title', 'titleHorizontalAlign', 'titleHeight', 'legendWidth'],

    _title: null,
    _titleHeight: $Defaults.CHARTPANE_TITLE_HEIGHT,
    _titleHorizontalAlign: $Defaults.CHARTPANE_TITLE_HORIZONTAL_ALIGN,
    _legendOrientation: $Defaults.CHARTPANE_LEGEND_ORIENTATION,
    _legendWidth: $Defaults.CHARTPANE_LEGEND_WIDTH,

    getLegendOrientation: function () {
        return this._legendOrientation;
    },
    setLegendOrientation: function (value) {
        if (this._legendOrientation === value) {
            return;
        }
        var oldValue = this._legendOrientation;
        this._legendOrientation = value;
        this.firePropertyChange('orientation', oldValue, value);
        this._adjustLegendOrientation();
    },
    _adjustLegendOrientation: function () {
        if (this._legendOrientation === 'left' || this._legendOrientation === 'right') {
            this._legendPane.setOrientation('vertical');
        } else {
            this._legendPane.setOrientation('horizontal');
        }
    },
    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getTitleDiv: function () {
        return this._titleDiv;
    },
    getChart: function () {
        return this._chart;
    },
    getLegendPane: function () {
        return this._legendPane;
    },
    validateImpl: function () {
        this._adjustLegendOrientation();

        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;
        var legendHeight = this._legendPane.getRowHeight();

        var titleHeight;
        if (this._title && this._title !== '') {
            titleHeight = this._titleHeight;
            this._titleDiv.innerHTML = this._title;
        } else {
            titleHeight = 0;
            this._titleDiv.innerHTML = '';
        }
        this._titleDiv.innerHTML = this._title ? this._title : '';
        this._titleDiv.style.textAlign = this._titleHorizontalAlign;
        this._titleDiv.style.lineHeight = this._titleHeight - 2 + 'px';

        var style = this._titleDiv.style;
        style.left = '0px';
        style.top = '0px';
        style.width = w + 'px';
        style.height = titleHeight + 'px';

        var chartRect;
        var legendRect;
        if (this._legendOrientation === 'bottom') {
            chartRect = {
                x: 0,
                y: titleHeight,
                width: w,
                height: Math.max(h - titleHeight - legendHeight, 0)
            };
            legendRect = {
                x: 0,
                y: Math.max(h - legendHeight, 0),
                width: w,
                height: legendHeight
            };
        }
        else if (this._legendOrientation === 'right') {
            chartRect = {
                x: 0,
                y: titleHeight,
                width: Math.max(w - this._legendWidth, 0),
                height: Math.max(h - titleHeight, 0)
            };
            legendRect = {
                x: Math.max(w - this._legendWidth, 0),
                y: titleHeight,
                width: this._legendWidth,
                height: Math.max(h - titleHeight, 0)
            };
        }
        else if (this._legendOrientation === 'top') {
            chartRect = {
                x: 0,
                y: titleHeight + legendHeight,
                width: w,
                height: Math.max(h - titleHeight - legendHeight, 0)
            };
            legendRect = {
                x: 0,
                y: titleHeight,
                width: w,
                height: legendHeight
            };
        }
        else if (this._legendOrientation === 'left') {
            chartRect = {
                x: this._legendWidth,
                y: titleHeight,
                width: Math.max(w - this._legendWidth, 0),
                height: Math.max(h - titleHeight, 0)
            };
            legendRect = {
                x: 0,
                y: titleHeight,
                width: this._legendWidth,
                height: Math.max(h - titleHeight, 0)
            };
        }

        if (chartRect) {
            this._chart.adjustBounds(chartRect);
        }
        if (legendRect) {
            this._legendPane.adjustBounds(legendRect);
        }
    }
});
