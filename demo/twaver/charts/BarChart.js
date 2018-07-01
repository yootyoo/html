twaver.charts.BarChart = function (dataBox) {
    twaver.charts.BarChart.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.charts.BarChart', twaver.charts.ScaleChart, {
    __accessor: ['type'],

    _upperLimit: $Defaults.BARCHART_UPPER_LIMIT,
    _lowerLimit: $Defaults.BARCHART_LOWER_LIMIT,
    _type: $Defaults.BARCHART_TYPE,

    _xAxisText: null,
    _xAxisTextColor: $Defaults.BARCHART_XAXIS_TEXT_COLOR,
    _xAxisTextFont: $Defaults.BARCHART_XAXIS_TEXT_FONT,
    _xAxisLineColor: $Defaults.BARCHART_XAXIS_LINE_COLOR,
    _xAxisLineWidth: $Defaults.BARCHART_XAXIS_LINE_WIDTH,

    _yAxisText: null,
    _yAxisTextColor: $Defaults.BARCHART_YAXIS_TEXT_COLOR,
    _yAxisTextFont: $Defaults.BARCHART_YAXIS_TEXT_FONT,
    _yAxisLineColor: $Defaults.BARCHART_YAXIS_LINE_COLOR,
    _yAxisLineWidth: $Defaults.BARCHART_YAXIS_LINE_WIDTH,

    _xScaleTexts: null,
    _xScaleTextFont: $Defaults.BARCHART_XSCALE_TEXT_FONT,
    _xScaleTextColor: $Defaults.BARCHART_XSCALE_TEXT_COLOR,
    _xScaleTextOrientation: $Defaults.BARCHART_XSCALE_TEXT_ORIENTATION,

    _yScaleTextVisible: $Defaults.BARCHART_YSCALE_TEXT_VISIBLE,
    _yScaleTextColor: $Defaults.BARCHART_YSCALE_TEXT_COLOR,
    _yScaleTextFont: $Defaults.BARCHART_YSCALE_TEXT_FONT,
    _yScaleLineColor: $Defaults.BARCHART_YSCALE_LINE_COLOR,
    _yScaleLineWidth: $Defaults.BARCHART_YSCALE_LINE_WIDTH,
    _yScaleValueGap: $Defaults.BARCHART_YSCALE_VALUE_GAP,
    _yScalePixelGap: $Defaults.BARCHART_YSCALE_PIXEL_GAP,
    _yScaleMinTextVisible: $Defaults.BARCHART_YSCALE_MIN_TEXT_VISIBLE,

    validateModel: function () {
        var funcName = this._type + 'ValidateModel';
        if (this[funcName]) {
            this._reset();
            this[funcName]();
        }
    },

    defaultValidateModel: function () {
        this._columnCount = this._publishedDatas.size();
        this._publishedDatas.forEach(function (data) {
            var value = this.getValue(data);
            if (this._upperLimit == null && value > this._max) {
                this._max = value;
            }
            if (this._lowerLimit == null && value < this._min) {
                this._min = value;
            }
            this._map[data.getId()] = {
                data: data,
                value: value,
                color: this.getUniqueColor(this.getColor(data), data)
            };
        }, this);

        this._initRange();

        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            info.proportion = this._range == 0 ? 0 : info.value / this._range;
        }, this);
    },

    layerValidateModel: function () {
        this._commonValidateModel();
    },

    groupValidateModel: function () {
        this._commonValidateModel()
    },

    stackValidateModel: function () {
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
            this._map[data.getId()] = info;
        }, this);

        if (this._upperLimit == null || this._lowerLimit == null) {
            for (var i = 0; i < this._columnCount; i++) {
                var upSum = 0;
                var lowSum = 0;
                this._publishedDatas.forEach(function (data) {
                    var info = this._map[data.getId()];
                    if (info.values.size() > i) {
                        var value = info.values.get(i);
                        if (value != null) {
                            if (value >= 0) {
                                upSum += value;
                            } else {
                                lowSum += value;
                            }
                        }
                    }
                }, this);
                if (this._upperLimit == null && upSum > this._max) {
                    this._max = upSum;
                }
                if (this._lowerLimit == null && lowSum < this._min) {
                    this._min = lowSum;
                }
            }
        }

        this._initRange();
        this._initValuesProportion();
    },

    percentValidateModel: function () {
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
            this._map[data.getId()] = info;
        }, this);

        var sums = new $List();
        for (var i = 0; i < this._columnCount; i++) {
            var sum = 0;
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (info.values.size() > i) {
                    var value = info.values.get(i);
                    if (value != null) {
                        sum += value;
                    }
                }
            }, this);
            sums.add(sum);
        }
        for (var i = 0; i < this._columnCount; i++) {
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                var sum = sums.get(i);
                if (sum !== 0 && info.values.size() > i) {
                    var value = info.values.get(i);
                    if (value != null) {
                        info.proportions.add(value / sum);
                        return;
                    }
                }
                info.proportions.add(null);
            }, this);
        }
        this._min = 0;
        this._max = 1;
        this._range = 1;
    },
    drawRect: function (g, color, selected, x, y, w, h) {
        g.fillStyle = color;
        if (selected) {
            this._selectInfos.add({
                x: x,
                y: y,
                w: w,
                h: h,
                color: this.getUniqueColor($g.darker(color))
            });
        }
        g.beginPath();
        g.rect(x, y, w, h);
        g.closePath();
        g.fill();
    },
    drawContent: function (g, rect, validHeight, skyline) {
        this._selectInfos = new $List();
        this._toolTipInfos = this.isToolTipEnabled() ? new $List() : null;

        // default type
        if (this._type === 'default') {
            this.drawDefaultContent(g, rect, validHeight, skyline);
        }
        // group type
        else if (this._type === 'group') {
            this.drawGroupContent(g, rect, validHeight, skyline);
        }
        // percent type
        else if (this._type === 'percent') {
            this.drawPercentContent(g, rect, validHeight, skyline);
        }
        // stack type
        else if (this._type === 'stack') {
            this.drawStackContent(g, rect, validHeight, skyline);
        }
        // layer type
        else if (this._type === 'layer') {
            this.drawLayerContent(g, rect, validHeight, skyline);
        }

        // draw value text
        this.drawValueTexts(g);

        // draw select rects
        this._selectInfos.forEach(function (info) {
            g.lineWidth = 2;
            g.strokeStyle = info.color;
            g.beginPath();
            g.rect(info.x, info.y, info.w, info.h);
            g.closePath();
            g.stroke();
        }, this);

        delete this._selectInfos;
    },

    drawDefaultContent: function (g, rect, validHeight, skyline) {
        var count = this._publishedDatas.size();
        var w = this._columnWidth;
        for (var i = 0; i < count; i++) {
            var data = this._publishedDatas.get(i);
            var info = this._map[data.getId()];
            var x = rect.x + w * (0.5 + i * 1.5);
            var h = Math.abs(validHeight * info.proportion);
            var y = info.proportion > 0 ? skyline - h : skyline;
            this.drawRect(g, info.color, this.isSelected(data), x, y, w, h);
            this.addToolTipInfo(x, y, w, h, info.value, data);
            var valueText = this._getValueTextInfo(data, info.value);
            if (valueText) {
                var size = this.getTextSize(valueText.font, valueText.text);
                valueText.x = x + w / 2;
                valueText.y = y - size.height / 2 + 1;
            }
        }
    },
    drawPercentContent: function (g, rect, validHeight, skyline) {
        this.drawStackContent(g, rect, validHeight, skyline);
    },
    drawStackContent: function (g, rect, validHeight, skyline) {
        var count = this._columnCount;
        var w = this._columnWidth;
        for (var i = 0; i < count; i++) {
            var y = skyline;
            var x = rect.x + w * (0.5 + i * 1.5);
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (i < info.proportions.size()) {
                    var proportion = info.proportions.get(i);
                    if (proportion != null) {
                        var h = validHeight * proportion;
                        y -= h;
                        this.drawRect(g, info.color, this.isSelected(data), x, y, w, h);
                        this.addToolTipInfo(x, y, w, h, info.values.get(i), data);
                        var valueText = this._getValueTextInfo(data, info.values.get(i));
                        if (valueText) {
                            valueText.x = x + w / 2;
                            valueText.y = y + h / 2;
                        }
                    }
                }
            }, this);
        }
    },
    drawLayerContent: function (g, rect, validHeight, skyline) {
        var eCount = this._publishedDatas.size();
        var count = this._columnCount;
        var w = this._columnWidth;
        var gap = w * 3 / 8 / eCount;
        for (var i = 0; i < count; i++) {
            var x = rect.x + w * (0.5 + i * 1.5);
            var j = 0;
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (i < info.proportions.size()) {
                    var proportion = info.proportions.get(i);
                    if (proportion != null) {
                        var h = validHeight * proportion;
                        var y = skyline - h;
                        var xxx = x + w / 2 - w / 8 - gap * (eCount - j);
                        var www = (w / 8 + gap * (eCount - j)) * 2;
                        this.drawRect(g, info.color, this.isSelected(data), xxx, y, www, h);
                        this.addToolTipInfo(xxx, y, www, h, info.values.get(i), data);
                        var valueText = this._getValueTextInfo(data, info.values.get(i));
                        if (valueText) {
                            var size = this.getTextSize(valueText.font, valueText.text);
                            valueText.x = xxx + www / 2;
                            valueText.y = y - size.height / 2 + 1;
                        }
                    }
                }
                j++;
            }, this);
        }
    },
    drawGroupContent: function (g, rect, validHeight, skyline) {
        var eCount = this._publishedDatas.size();
        var count = this._columnCount;
        var w = this._columnWidth;
        var ww = w / eCount;
        for (var i = 0; i < count; i++) {
            var x = rect.x + w * (0.5 + i * 1.5);
            var j = 0;
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (i < info.proportions.size()) {
                    var proportion = info.proportions.get(i);
                    if (proportion != null) {
                        var h = validHeight * proportion;
                        var y = skyline - h;
                        this.drawRect(g, info.color, this.isSelected(data), x + ww * j, y, ww, h);
                        this.addToolTipInfo(x + ww * j, y, ww, h, info.values.get(i), data);
                        var valueText = this._getValueTextInfo(data, info.values.get(i));
                        if (valueText) {
                            var size = this.getTextSize(valueText.font, valueText.text);
                            valueText.x = x + ww * j + ww / 2;
                            valueText.y = y - size.height / 2 + 1;
                        }
                    }
                }
                j++;
            }, this);
        }
    }


});
