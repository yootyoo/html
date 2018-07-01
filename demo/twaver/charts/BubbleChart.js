twaver.charts.BubbleChart = function (dataBox) {
    twaver.charts.BubbleChart.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.charts.BubbleChart', twaver.charts.ScaleChart, {
    __accessor: ['xAxisUpperLimit', 'xAxisLowerLimit', 'xScaleLineColor', 'xScaleLineWidth', 'selectShadowColor', 'selectShadowOffset'],

    _upperLimit: $Defaults.BUBBLECHART_UPPER_LIMIT,
    _lowerLimit: $Defaults.BUBBLECHART_LOWER_LIMIT,
    _xAxisUpperLimit: $Defaults.BUBBLECHART_XAXIS_UPPER_LIMIT,
    _xAxisLowerLimit: $Defaults.BUBBLECHART_XAXIS_LOWER_LIMIT,

    _xAxisText: null,
    _xAxisTextColor: $Defaults.BUBBLECHART_XAXIS_TEXT_COLOR,
    _xAxisTextFont: $Defaults.BUBBLECHART_XAXIS_TEXT_FONT,
    _xAxisLineColor: $Defaults.BUBBLECHART_XAXIS_LINE_COLOR,
    _xAxisLineWidth: $Defaults.BUBBLECHART_XAXIS_LINE_WIDTH,

    _yAxisText: null,
    _yAxisTextColor: $Defaults.BUBBLECHART_YAXIS_TEXT_COLOR,
    _yAxisTextFont: $Defaults.BUBBLECHART_YAXIS_TEXT_FONT,
    _yAxisLineColor: $Defaults.BUBBLECHART_YAXIS_LINE_COLOR,
    _yAxisLineWidth: $Defaults.BUBBLECHART_YAXIS_LINE_WIDTH,

    _xScaleTexts: null,
    _xScaleTextFont: $Defaults.BUBBLECHART_XSCALE_TEXT_FONT,
    _xScaleTextColor: $Defaults.BUBBLECHART_XSCALE_TEXT_COLOR,
    _xScaleTextOrientation: $Defaults.BUBBLECHART_XSCALE_TEXT_ORIENTATION,
    _xScaleLineColor: $Defaults.BUBBLECHART_XSCALE_LINE_COLOR,
    _xScaleLineWidth: $Defaults.BUBBLECHART_XSCALE_LINE_WIDTH,

    _yScaleTextVisible: $Defaults.BUBBLECHART_YSCALE_TEXT_VISIBLE,
    _yScaleTextColor: $Defaults.BUBBLECHART_YSCALE_TEXT_COLOR,
    _yScaleTextFont: $Defaults.BUBBLECHART_YSCALE_TEXT_FONT,
    _yScaleLineColor: $Defaults.BUBBLECHART_YSCALE_LINE_COLOR,
    _yScaleLineWidth: $Defaults.BUBBLECHART_YSCALE_LINE_WIDTH,
    _yScaleValueGap: $Defaults.BUBBLECHART_YSCALE_VALUE_GAP,
    _yScalePixelGap: $Defaults.BUBBLECHART_YSCALE_PIXEL_GAP,
    _yScaleMinTextVisible: $Defaults.BUBBLECHART_YSCALE_MIN_TEXT_VISIBLE,

    _selectShadowColor: $Defaults.BUBBLECHART_SELECT_SHADOW_COLOR,
    _selectShadowOffset: $Defaults.BUBBLECHART_SELECT_SHADOW_OFFSET,

    _resetX: function () {
        this._xMax = 0;
        this._xMin = 0;

        if (this._xAxisUpperLimit != null) {
            this._xMax = this._xAxisUpperLimit;
        }
        if (this._xAxisLowerLimit != null) {
            this._xMin = this._xAxisLowerLimit;
        }
    },
    getXMin: function () {
        return this._xMin;
    },
    getXMax: function () {
        return this._xMax;
    },
    getXRange: function () {
        return this._xRange;
    },

    getShape: function (data) {
        return data.getStyle ? data.getStyle('chart.bubble.shape') : twaver.Styles.getStyle('chart.bubble.shape');
    },
    getSize: function (data, value) {
        return value;
    },
    getNames: function (data) {
        return data.getStyle ? data.getStyle('chart.names') : twaver.Styles.getStyle('chart.names');
    },
    getXAxisValues: function (data) {
        return data.getStyle ? data.getStyle('chart.xaxis.values') : twaver.Styles.getStyle('chart.xaxis.values');
    },
    getYAxisValues: function (data) {
        return data.getStyle ? data.getStyle('chart.yaxis.values') : twaver.Styles.getStyle('chart.yaxis.values');
    },

    _initXRange: function () {
        if (this._xAxisLowerLimit == null) {
            if (this._xMin >= this._xMax) {
                this._xMin = this._xMax - Math.abs(this._xMax) * 0.1;
            }
            this._xMin = this._xMin - (this._xMax - this._xMin) * 0.1;
        }
        this._xRange = this._xMax - this._xMin;
    },
    _initXYValuesProportion: function () {
        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            info.xAxisValues.forEach(function (value) {
                if (value == null) {
                    info.xAxisProportions.add(null);
                } else {
                    info.xAxisProportions.add(this._xRange == 0 ? 0 : value / this._xRange);
                }
            }, this);
            info.yAxisValues.forEach(function (value) {
                if (value == null) {
                    info.yAxisProportions.add(null);
                } else {
                    info.yAxisProportions.add(this._range == 0 ? 0 : value / this._range);
                }
            }, this);
        }, this);
    },

    validateModel: function () {
        this._reset();
        this._resetX();
        this._columnCount = this._xScaleTexts == null ? 0 : this._xScaleTexts.size();
        this._publishedDatas.forEach(function (data) {
            var yAxisValues = new $List(this.getYAxisValues(data));
            var xAxisValues = new $List(this.getXAxisValues(data));
            var values = new $List(this.getValues(data));
            if (values.size() > this._columnCount) {
                this._columnCount = values.size();
            }
            var info = {
                data: data,
                values: values,
                yAxisValues: yAxisValues,
                xAxisValues: xAxisValues,
                yAxisProportions: new $List(),
                xAxisProportions: new $List(),
                color: this.getUniqueColor(this.getColor(data), data),
                anchorShape: this.getShape(data)
            };
            this._map[data.getId()] = info;

            if (this._upperLimit == null || this._lowerLimit == null) {
                yAxisValues.forEach(function (value) {
                    if (value != null) {
                        if (this._upperLimit == null && value > this._max) {
                            this._max = value;
                        }
                        if (this._lowerLimit == null && value < this._min) {
                            this._min = value;
                        }
                    }
                }, this);
            }
            if (this._upperLimit == null || this._lowerLimit == null) {
                xAxisValues.forEach(function (value) {
                    if (value != null) {
                        if (this._xAxisUpperLimit == null && value > this._xMax) {
                            this._xMax = value;
                        }
                        if (this._xAxisLowerLimit == null && value < this._xMin) {
                            this._xMin = value;
                        }
                    }
                }, this);
            }
        }, this);

        this._initRange();
        this._initXRange();
        this._initXYValuesProportion();
    },

    drawContent: function (g, rect, validHeight, skyline) {

        this._toolTipInfos = this.isToolTipEnabled() ? new $List() : null;

        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            var yAxisProportions = info.yAxisProportions;
            var xAxisProportions = info.xAxisProportions;
            var values = info.values;
            var c = info.yAxisProportions.size();

            var offset = this._selectShadowOffset;
            if (this.isSelected(data) && offset > 0) {
                g.shadowOffsetX = offset;
                g.shadowOffsetY = offset;
                g.shadowBlur = offset * 2;
                g.shadowColor = this._selectShadowColor;
            } else {
                g.shadowOffsetX = 0;
                g.shadowOffsetY = 0;
                g.shadowBlur = 0;
                g.shadowColor = info.color;
            }
            g.fillStyle = info.color;

            for (var i = 0; i < c; i++) {
                var yAxisProportion = yAxisProportions.get(i);
                var xAxisProportion = xAxisProportions.get(i);
                if (yAxisProportion != null) {
                    var point = {
                        x: rect.x + rect.width * xAxisProportion,
                        y: skyline - validHeight * yAxisProportion
                    };

                    // draw marker
                    var value = values.get(i);
                    var size = this.getSize(data, value);
                    var offset = size / 2;

                    var x = point.x - offset;
                    var y = point.y - offset;
                    var w = size;
                    var h = size;
                    $g.drawVector(g, info.anchorShape, null, x, y, w, h);
                    g.fill();
                    this.addToolTipInfo(x, y, w, h, value, data, i);

                    // draw text
                    var valueText = this._getValueTextInfo(data, value);
                    if (valueText) {
                        var size = this.getTextSize(valueText.font, valueText.text);
                        valueText.x = point.x;
                        valueText.y = point.y;
                    }
                }
            }
        }, this);

        // draw value text
        this.drawValueTexts(g);
    }
});
