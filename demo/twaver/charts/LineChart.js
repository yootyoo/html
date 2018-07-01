twaver.charts.LineChart = function (dataBox) {
    twaver.charts.LineChart.superClass.constructor.apply(this, arguments);
    this._selectTolerance = 2;
};
_twaver.ext('twaver.charts.LineChart', twaver.charts.ScaleChart, {
    __accessor: ['xScaleLineColor', 'xScaleLineWidth', 'interruptable'],

    _interruptable: $Defaults.LINECHART_INTERRUPTABLE,
    _upperLimit: $Defaults.LINECHART_UPPER_LIMIT,
    _lowerLimit: $Defaults.LINECHART_LOWER_LIMIT,

    _xAxisText: null,
    _xAxisTextColor: $Defaults.LINECHART_XAXIS_TEXT_COLOR,
    _xAxisTextFont: $Defaults.LINECHART_XAXIS_TEXT_FONT,
    _xAxisLineColor: $Defaults.LINECHART_XAXIS_LINE_COLOR,
    _xAxisLineWidth: $Defaults.LINECHART_XAXIS_LINE_WIDTH,

    _yAxisText: null,
    _yAxisTextColor: $Defaults.LINECHART_YAXIS_TEXT_COLOR,
    _yAxisTextFont: $Defaults.LINECHART_YAXIS_TEXT_FONT,
    _yAxisLineColor: $Defaults.LINECHART_YAXIS_LINE_COLOR,
    _yAxisLineWidth: $Defaults.LINECHART_YAXIS_LINE_WIDTH,

    _xScaleTexts: null,
    _xScaleTextFont: $Defaults.LINECHART_XSCALE_TEXT_FONT,
    _xScaleTextColor: $Defaults.LINECHART_XSCALE_TEXT_COLOR,
    _xScaleTextOrientation: $Defaults.LINECHART_XSCALE_TEXT_ORIENTATION,
    _xScaleLineColor: $Defaults.LINECHART_XSCALE_LINE_COLOR,
    _xScaleLineWidth: $Defaults.LINECHART_XSCALE_LINE_WIDTH,
    _valueSpanCount: $Defaults.LINECHART_VALUESPANCOUNT,

    _yScaleTextVisible: $Defaults.LINECHART_YSCALE_TEXT_VISIBLE,
    _yScaleTextColor: $Defaults.LINECHART_YSCALE_TEXT_COLOR,
    _yScaleTextFont: $Defaults.LINECHART_YSCALE_TEXT_FONT,
    _yScaleLineColor: $Defaults.LINECHART_YSCALE_LINE_COLOR,
    _yScaleLineWidth: $Defaults.LINECHART_YSCALE_LINE_WIDTH,
    _yScaleValueGap: $Defaults.LINECHART_YSCALE_VALUE_GAP,
    _yScalePixelGap: $Defaults.LINECHART_YSCALE_PIXEL_GAP,
    _yScaleMinTextVisible: $Defaults.LINECHART_YSCALE_MIN_TEXT_VISIBLE,

    getLineWidth: function (data) {
        return data.getStyle ? data.getStyle('chart.line.width') : twaver.Styles.getStyle('chart.line.width');
    },
    getMarkerShape: function (data) {
        return data.getStyle ? data.getStyle('chart.marker.shape') : twaver.Styles.getStyle('chart.marker.shape');
    },
    getMarkerSize: function (data) {
        return data.getStyle ? data.getStyle('chart.marker.size') : twaver.Styles.getStyle('chart.marker.size');
    },

    _initInfo: function (data, info) {
        info.markerShape = this.getMarkerShape(data);
        info.markerSize = this.getMarkerSize(data);
        info.lineWidth = this.getLineWidth(data);
        if (this.isSelected(data)) {
            info.lineWidth += 2;
        }
    },

    validateModel: function () {
        this._reset();
        this._commonValidateModel();
    },
    getPointIndexAt: function () {
        var point = this._getPoint.apply(this, arguments),
        	data = this.tryGetDataAt(point);
        if (!data) {
            return -1;
        }
        var info = this._map[data.getId()],
        	points = info.points,
        	size = info.markerSize;
        for (var i = 0, c = points.size(), p; i < c; i++) {
            p = points.get(i);
            if (p) {
                if ($math.getDistance(point, p) <= size) {
                    return i;
                }
            }
        }
        return -1;
    },
    drawContent: function (g, rect, validHeight, skyline) {

        this._toolTipInfos = this.isToolTipEnabled() ? new $List() : null;

        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            var markers = info.markerSize > 0 ? new $List() : null;

            g.strokeStyle = info.color;
            g.lineWidth = info.lineWidth;
            g.beginPath();

            var proportions = info.proportions;
            var lastPoint = null;
            var c = proportions.size();
            var points = new $List();
            info.points = points;

            for (var i = 0; i < c; i++) {
                var proportion = proportions.get(i);
                if (proportion != null) {
                    var point = {
                        x: rect.x + this._columnWidth * (1 + i * 1.5),
                        y: skyline - validHeight * proportion
                    };
                    points.add(point);

                    // draw line
                    if (lastPoint == null) {
                        g.moveTo(point.x, point.y);
                    } else {
                        g.lineTo(point.x, point.y);
                    }

                    // draw text
                    var value = info.values.get(i);
                    var valueText = this._getValueTextInfo(data, value);
                    if (valueText) {
                        var size = this.getTextSize(valueText.font, valueText.text);
                        valueText.x = point.x;
                        valueText.y = point.y - size.height / 2 + 2;
                    }

                    // draw marker
                    if (markers) {
                        markers.add({
                            point: point,
                            value: value,
                            data: data,
                            index: i
                        });
                    }

                    lastPoint = point;
                } else if (this._interruptable) {
                    lastPoint = null;
                    points.add(null);
                }
            }
            g.stroke();

            // draw marker
            if (markers) {
                var offset = info.markerSize / 2;
                markers.forEach(function (markInfo) {
                    g.fillStyle = info.color;
                    var x = markInfo.point.x - offset;
                    var y = markInfo.point.y - offset;
                    var w = info.markerSize;
                    var h = info.markerSize;
                    $g.drawVector(g, info.markerShape, null, x, y, w, h);
                    g.fill();
                    this.addToolTipInfo(x, y, w, h, markInfo.value, markInfo.data, markInfo.index);
                }, this);
            }

        }, this);

        // draw value text
        this.drawValueTexts(g);
    }


});
