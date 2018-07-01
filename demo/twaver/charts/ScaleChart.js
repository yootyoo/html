twaver.charts.ScaleChart = function (dataBox) {
    twaver.charts.ScaleChart.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.charts.ScaleChart', twaver.charts.ChartBase, {
    __accessor: [
            'upperLimit', 'lowerLimit',
            'xAxisText', 'xAxisLineColor', 'xAxisLineWidth', 'xAxisTextColor', 'xAxisTextFont',
            'yAxisText', 'yAxisLineColor', 'yAxisLineWidth', 'yAxisTextColor', 'yAxisTextFont',
            'xScaleTexts', 'xScaleTextFont', 'xScaleTextColor', 'xScaleTextOrientation',
            'yScaleTextVisible', 'yScaleTextColor', 'yScaleTextFont', 'yScaleLineColor',
            'yScaleLineWidth', 'yScaleValueGap', 'yScalePixelGap', 'yScaleMinTextVisible',
            'valueSpanCount',
        ],

    _reset: function () {
        this._map = {};
        this._max = 0;
        this._min = 0;
        this._columnCount = this._xScaleTexts ? this._xScaleTexts.size() : 0;

        if (this._upperLimit != null) {
            this._max = this._upperLimit;
        }
        if (this._lowerLimit != null) {
            this._min = this._lowerLimit;
        }
    },
    getMin: function () {
        return this._min;
    },
    getMax: function () {
        return this._max;
    },
    getRange: function () {
        return this._range;
    },
    getColumnCount: function () {
        return this._columnCount;
    },
    getColumnWidth: function () {
        return this._columnWidth;
    },
    getValues: function (data) {
        return data.getStyle ? data.getStyle('chart.values') : null;
    },
    formatYScaleText: function (value) {
        return value.toFixed(2);
    },

    _initRange: function () {
        if (this._lowerLimit == null) {
            if (this._min >= this._max) {
                this._min = this._max - Math.abs(this._max) * 0.1;
            }
            this._min = this._min - (this._max - this._min) * 0.1;
        }
        this._range = this._max - this._min;
    },
    _initValuesProportion: function () {
        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            info.values.forEach(function (value) {
                if (value == null) {
                    info.proportions.add(null);
                } else {
                    info.proportions.add(this._range == 0 ? 0 : value / this._range);
                }
            }, this);
        }, this);
    },
    _commonValidateModel: function () {
        this._publishedDatas.forEach(function (data) {
            var values = new $List(this.getValues(data));
            if (values.size() > this._columnCount) {
                this._columnCount = values.size();
            }
            var info = {
                data: data,
                values: values,
                proportions: new $List(),
                color: this.getUniqueColor(this.getColor(data), data)
            };
            if (this._initInfo) {
                this._initInfo(data, info);
            }
            this._map[data.getId()] = info;

            if (this._upperLimit == null || this._lowerLimit == null) {
                values.forEach(function (value) {
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
        }, this);

        this._initRange();
        this._initValuesProportion();
    },
    //  
    //  ---------------------------------------------------------------------------|
    //  |                                             yGap                         |
    //  |      ---------------------------------------------------------------|    |
    //  |      |            |             | yAxisHeight                       |    |
    //  |      |            |             | validHeight                       |    |
    //  |      |            |             |                                   |    |
    //  |      |            |             |           backgroundRect          |    |
    //  |      |            |             |                                   |    |
    //  |      |            |             |                                   |    |
    //  | xGap |yAxisTextGap|yScaleTextGap|              baseline             |xGap|
    //  |      |            |             |-----------------------------------|    |
    //  |      |            |                    xScaleTextGap                |    |
    //  |      |            |-------------------------------------------------|    |
    //  |      |                                  xAxisTextGap                |    |
    //  |      |--------------------------------------------------------------|    |
    //  |                                              yGap                   |    |
    //  ---------------------------------------------------------------------------|
    //
    validateDisplay: function (g, width, height) {
        // get xAxisTextGap value
        var xAxisTextGap = 0;
        if (this._xAxisText) {
            xAxisTextGap = this.getTextSize(this._xAxisTextFont, this._xAxisText).height;
        }

        // get xScaleTextGap value
        var xScaleTextGap = 0;
        if (this._xScaleTexts) {
            this._xScaleTexts.forEach(function (text) {
                var size = this.getTextSize(this._xScaleTextFont, text);
                var v = this._xScaleTextOrientation === 'vertical' ? size.width : size.height;
                if (v > xScaleTextGap) xScaleTextGap = v;
            }, this);
        }

        // get baseline value
        var baseline = height - this._yGap - xAxisTextGap - xScaleTextGap;

        // get yAxisHeight value
        var yAxisHeight = baseline - this._yGap;

        // get validHeight value
        var validHeight = this._upperLimit == null ? yAxisHeight * 0.9 : yAxisHeight;

        // get yAxisTextGap value
        var yAxisTextGap = 0;
        if (this._yAxisText) {
            yAxisTextGap = this.getTextSize(this._yAxisTextFont, this._yAxisText).height;
        }

        // get pixelGap and valueGap
        var pixelGap, valueGap;
        if (this._yScaleValueGap > 0) {
            pixelGap = Math.max(this._yScaleValueGap / this._range * validHeight, 1);
            valueGap = this._yScaleValueGap
        } else {
            pixelGap = Math.max(this._yScalePixelGap, 1);
            valueGap = this._range * (pixelGap / validHeight);
        }

        // get yScaleTextGap value
        var yScaleTextGap = 0, yScaleTextInfos = new $List(), cursor, text;
        if (this._yScaleTextVisible) {
            cursor = this._yScaleMinTextVisible ? 0 : pixelGap;
            var value = this._min + (this._yScaleMinTextVisible ? 0 : valueGap);
            while (cursor <= yAxisHeight + 1) {
                text = this.formatYScaleText(value);
                if (text) {
                    var size = this.getTextSize(this._yScaleTextFont, text);
                    if (size.width > yScaleTextGap) {
                        yScaleTextGap = size.width;
                    }
                    yScaleTextInfos.add({
                        text: text,
                        size: size,
                        cursor: cursor
                    });
                }
                cursor += pixelGap;
                value += valueGap;
            }
        }

        // get background rect
        var rect = {
            x: this._xGap + yAxisTextGap + yScaleTextGap,
            y: this._yGap,
            width: width - this._xGap - yAxisTextGap - yScaleTextGap - this._xGap,
            height: height - this._yGap - xScaleTextGap - xAxisTextGap - this._yGap
        };
        this.drawBackground(g, rect);

        // get column width
        if (this._columnCount > 0) {
            this._columnWidth = rect.width / (this._columnCount * 3 + 1) * 2;
        } else {
            this._columnWidth = rect.width / 2;
        }
        if (this._columnWidth === 0) {
            this._columnWidth = 1;
        }

        // draw yScaleLine
        if (this._yScaleLineWidth > 0) {
            cursor = 0;
            while (cursor <= yAxisHeight + 1) {
                this.drawLine(g, this._yScaleLineColor, this._yScaleLineWidth,
                        rect.x, baseline - cursor,
                        rect.x + rect.width, baseline - cursor);
                cursor += pixelGap;
            }
        }

        // draw x axis text
        if (this._xAxisText) {
            $g.drawText(g, this._xAxisText, {
                x: rect.x + rect.width / 2,
                y: baseline + xScaleTextGap + xAxisTextGap / 2
            },
            this._xAxisTextFont, this.getUniqueColor(this._xAxisTextColor));
        }

        // draw y axis text
        if (this._yAxisText) {
            this.drawVerticalText(g, this._yAxisText, {
                x: this._xGap + yAxisTextGap / 2,
                y: yAxisHeight / 2 + this._yGap
            }, this._yAxisTextFont, this.getUniqueColor(this._yAxisTextColor));
        }

        // draw y axis line
        this.drawLine(g, this._yAxisLineColor, this._yAxisLineWidth,
                        rect.x, rect.y + rect.height,
                        rect.x, rect.y);

        // draw yScaleText
        var color = this.getUniqueColor(this._yScaleTextColor);
        yScaleTextInfos.forEach(function (info) {
            var point = {
                x: this._xGap + yAxisTextGap + yScaleTextGap - info.size.width / 2,
                y: baseline - info.cursor
            }
            $g.drawText(g, info.text, point, this._yScaleTextFont, color);
        }, this);

        // draw xScale
        var y = rect.y + rect.height + xScaleTextGap / 2;
        color = this.getUniqueColor(this._xScaleTextColor);
        var lineColor = this._xScaleLineWidth > 0 ? this.getUniqueColor(this._xScaleLineColor) : null;
        for (var i = 0; i < this._columnCount; i++) {
            var x = rect.x + this._columnWidth * (1 + i * 1.5);
            if (this._xScaleTexts && i < this._xScaleTexts.size()) {
                text = this._xScaleTexts.get(i);
                if (text) {
                    var p = {
                        x: x,
                        y: y
                    };
                    if (this._xScaleTextOrientation === 'vertical') {
                       this.drawVerticalText(g, text, p, this._yScaleTextFont, color);
                    } else {
                        if(this._valueSpanCount){
                            if(i%this._valueSpanCount == 0){
                               $g.drawText(g, text, p, this._xScaleTextFont, color);
                            }
                        }else{
                           $g.drawText(g, text, p, this._xScaleTextFont, color);
                        }
                    }
                }
            }
            if (this._type !== 'default' && lineColor) {
                if(this._valueSpanCount){
                    if(i%this._valueSpanCount == 0){
                        this.drawLine(g, lineColor, this._xScaleLineWidth, x, rect.y + rect.height, x, rect.y);
                    }
                }else{
                    this.drawLine(g, lineColor, this._xScaleLineWidth, x, rect.y + rect.height, x, rect.y);
                }
            }
        }

        // get skyline
        var skyline = baseline + this._min / valueGap * pixelGap;

        // draw content
        if (this._publishedDatas.size() > 0 && this._columnCount > 0) {
            this.drawContent(g, rect, validHeight, skyline);
        }

        // draw x axis line
        this.drawLine(g, this._xAxisLineColor, this._xAxisLineWidth,
                        rect.x, rect.y + rect.height,
                        rect.x + rect.width, rect.y + rect.height);

    }
});
