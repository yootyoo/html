twaver.charts.RadarChart = function (dataBox) {
    twaver.charts.RadarChart.superClass.constructor.apply(this, arguments);
    this._selectTolerance = 2;
};
_twaver.ext('twaver.charts.RadarChart', twaver.charts.ChartBase, {
    __accessor: ['axisTextVisible', 'axisTextFont', 'axisTextColor',
                    'scaleTextVisible', 'scaleTextFont', 'scaleTextColor',
                    'axisVisible', 'axisLineColor', 'axisLineWidth', 'axisStartAngle',
                    'ringVisible', 'ringType', 'ringLineColor', 'ringLineWidth',
                    'scaleCount', 'scaleMaxValue', 'scaleMinValue',
                    'anchorVisible', 'areaFillAlpha', 'areaSelectFillAlpha', 'axisList'],

    __bool: ['areaFill'],

    _axisTextVisible: $Defaults.RADARCHART_AXIS_TEXT_VISIBLE,
    _axisTextFont: $Defaults.RADARCHART_AXIS_TEXT_FONT,
    _axisTextColor: $Defaults.RADARCHART_AXIS_TEXT_COLOR,

    _scaleTextVisible: $Defaults.RADARCHART_SCALE_TEXT_VISIBLE,
    _scaleTextFont: $Defaults.RADARCHART_SCALE_TEXT_FONT,
    _scaleTextColor: $Defaults.RADARCHART_SCALE_TEXT_COLOR,

    _axisVisible: $Defaults.RADARCHART_AXIS_VISIBLE,
    _axisLineColor: $Defaults.RADARCHART_AXIS_LINE_COLOR,
    _axisLineWidth: $Defaults.RADARCHART_AXIS_LINE_WIDTH,
    _axisStartAngle: $Defaults.RADARCHART_AXIS_START_ANGLE,

    _ringVisible: $Defaults.RADARCHART_RING_VISIBLE,
    _ringType: $Defaults.RADARCHART_RING_TYPE,
    _ringLineColor: $Defaults.RADARCHART_RING_LINE_COLOR,
    _ringLineWidth: $Defaults.RADARCHART_RING_LINE_WIDTH,

    _scaleCount: $Defaults.RADARCHART_SCALE_COUNT,
    _scaleMaxValue: $Defaults.RADARCHART_SCALE_MAXVALUE,
    _scaleMinValue: $Defaults.RADARCHART_SCALE_MINVALUE,

    _anchorVisible: $Defaults.RADARCHART_ANCHOR_VISIBLE,
    _areaFill: $Defaults.RADARCHART_AREA_FILL,
    _areaFillAlpha: $Defaults.RADARCHART_AREA_FILL_ALPHA,
    _areaSelectFillAlpha: $Defaults.RADARCHART_AREA_SELECT_FILL_ALPHA,

    getAxisCount: function () {
        return this._axisCount;
    },
    formatScaleText: function (value, axisIndex) {
        return value.toFixed(2);
    },
    getAnchorSize: function (data) {
        return data.getStyle ? data.getStyle('chart.marker.size') : twaver.Styles.getStyle('chart.marker.size');
    },
    getAnchorShape: function (data) {
        return data.getStyle ? data.getStyle('chart.marker.shape') : twaver.Styles.getStyle('chart.marker.shape');
    },
    getLineWidth: function (data) {
        return data.getStyle ? data.getStyle('chart.line.width') : twaver.Styles.getStyle('chart.line.width');
    },
    getValues: function (data) {
        return data.getStyle ? data.getStyle('chart.values') : null;
    },
    tryGetDataAt: function (point, tolerance) {
        if (tolerance == null || tolerance < 0) {
            tolerance = this._selectTolerance;
        }
        if (point.target) {
            point = $html.getLogicalPoint(this._canvas, arguments[0], 1);
        }
        if (!point) {
            return null;
        }

        if (!this._areaFill) {
            var x = point.x - tolerance;
            var y = point.y - tolerance;
            var w = tolerance * 2 + 1;
            var h = tolerance * 2 + 1;
            try {
                var d = this._canvas.getContext('2d').getImageData(x, y, w, h).data;
                for (var i = 0, n = d.length; i < n; i += 4) {
                    if (d[i + 3] === 255) {
                        var rgb = 'rgb(' + d[i] + ',' + d[i + 1] + ',' + d[i + 2] + ')';
                        var data = this._uniqueColors[rgb];
                        if (data) {
                            return data;
                        }
                    }
                }
            } catch (e) {
            }
            return null;
        }

        if (!this._center) {
            return null;
        }
        point = { x: point.x - this._xTranslate, y: point.y - this._yTranslate };
        for (var i = this._publishedDatas.size() - 1; i >= 0; i--) {
            var data = this._publishedDatas.get(i);
            var info = this._map[data.getId()];
            var result = $math.isPointInPolygon(info.points, point);
            if (result) {
                return data;
            }
        }
        return null;
    },
    getDataAt: function () {
        var x, y;
        if (arguments.length === 2) {
            x = arguments[0];
            y = arguments[1];
        }
        else if (arguments[0].target) {
            var p = $html.getLogicalPoint(this._canvas, arguments[0], 1);
            if (p) {
                x = p.x;
                y = p.y;
            } else {
                return;
            }
        }
        else {
            x = arguments[0].x;
            y = arguments[0].y;
        }
        if (x < 0 || y < 0 || x > this._canvasWidth || y > this._canvasHeight) {
            return null;
        }

        if (!this._areaFill) {
            try {
                var d = this._canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                if (d[3] === 255) {
                    var rgb = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
                    var data = this._uniqueColors[rgb];
                    if (data) {
                        return data;
                    }
                }
            } catch (e) {
            }
            return null;
        }

        for (var i = this._publishedDatas.size() - 1; i >= 0; i--) {
            var data = this._publishedDatas.get(i);
            var info = this._map[data.getId()];
            var result = $math.isPointInPolygon(info.points, { x: x - this._xTranslate, y: y - this._yTranslate });
            if (result) {
                return data;
            }
        }
        return null;
    },
    validateModel: function () {
        this._map = {};
        this._axisTexts = new $List();
        this._axisMaxValues = new $List();
        this._axisMinValues = new $List();
        this._axisRangeValues = new $List();
        this._axisCount = this._axisList == null ? 0 : this._axisList.size();

        if (this._axisCount == 0) {
            return;
        }
        this._averageAngleByRadian = Math.PI * 2 / this._axisCount;
        this._averageAngle = 360 / this._axisCount;

        this._axisList.forEach(function (axis) {
            if (typeof axis == 'string') {
                this._axisTexts.add(axis);
                this._axisMaxValues.add(this._scaleMaxValue);
                this._axisMinValues.add(this._scaleMinValue);
                this._axisRangeValues.add(this._scaleMaxValue - this._scaleMinValue);
            } else {
                this._axisTexts.add(axis.text);
                var max = isNaN(axis.max) ? this._scaleMaxValue : axis.max;
                var min = isNaN(axis.min) ? this._scaleMinValue : axis.min;
                this._axisMaxValues.add(max);
                this._axisMinValues.add(min);
                this._axisRangeValues.add(max - min);
            }
        }, this);

        this._publishedDatas.forEach(function (data) {
            var values = new $List(this.getValues(data));
            var info = {
                data: data,
                values: values,
                proportions: new $List(),
                color: this.getUniqueColor(this.getColor(data), data),
                anchorShape: this.getAnchorShape(data),
                anchorSize: this.getAnchorSize(data),
                lineWidth: this.getLineWidth(data),
                points: new $List()
            };
            if (this.isSelected(data)) {
                info.lineWidth += 2;
            }
            this._map[data.getId()] = info;
        }, this);

        for (var i = 0; i < this._axisCount; i++) {
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                var proportion = 0;
                if (info.values.size() > i) {
                    var value = info.values.get(i);
                    var min = this._axisMinValues.get(i);
                    var range = this._axisRangeValues.get(i);
                    if (range > 0) {
                        proportion = (value - min) / range;
                    }
                }
                info.proportions.add(proportion);
            }, this);
        }
    },
    validateDisplay: function (g, width, height) {
        var rect = {
            x: this._xGap,
            y: this._yGap,
            width: width - this._xGap * 2,
            height: height - this._yGap * 2
        };
        this.drawBackground(g, rect);

        if (rect.width <= 0 || rect.height <= 0 || this._axisCount < 3) {
            return;
        }

        var maxWidth = 0, maxHeight = 0, i = 0, size = null, position = null, text = null;
        var axisTextInfos = null;
        if (this._axisTextVisible) {
            axisTextInfos = new $List();
            for (i = 0; i < this._axisCount; i++) {
                text = this._axisTexts.get(i);
                size = this.getTextSize(this._axisTextFont, text);
                axisTextInfos.add({ text: text, size: size });
                if (size.width > maxWidth) {
                    maxWidth = size.width;
                }
                if (size.height > maxHeight) {
                    maxHeight = size.height;
                }
            }
        }
        var radius = rect.width / 2 - maxWidth > rect.height / 2 - maxHeight ? rect.height / 2 - maxHeight * 2 : rect.width / 2 - maxWidth;
        var center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        this._center = { x: center.x + this._xTranslate, y: center.y + this._yTranslate };

        var scaleTextInfos = null;
        if (this._scaleTextVisible) {
            scaleTextInfos = new $List();
        }

        var angleByRadian = this._axisStartAngle / 180 * Math.PI;
        for (i = 0; i < this._axisCount; i++) {
            var angle = angleByRadian * 180 / Math.PI;
            var x1 = center.x + Math.cos(angleByRadian) * radius;
            var y1 = center.y + Math.sin(-angleByRadian) * radius;

            var scaleTextInfo = null;
            if (scaleTextInfos) {
                scaleTextInfo = new $List();
                scaleTextInfos.add(scaleTextInfo);
            }

            if (this._ringVisible && this._ringLineWidth > 0) {
                g.lineWidth = this._ringLineWidth;
                g.strokeStyle = this._ringLineColor;
            }
            for (var j = 1; j <= this._scaleCount; j++) {
                var percent = j / this._scaleCount;
                var radiusScale = radius * percent;
                var x2 = center.x + Math.cos(angleByRadian) * radiusScale;
                var y2 = center.y + Math.sin(-angleByRadian) * radiusScale;

                // draw ring
                if (this._ringVisible && this._ringLineWidth > 0) {
                    var x3 = center.x + Math.cos(angleByRadian + this._averageAngleByRadian) * radiusScale;
                    var y3 = center.y + Math.sin(-angleByRadian - this._averageAngleByRadian) * radiusScale;

                    if (this._ringType == 'line') {
                        this.drawLine(g, this._ringLineColor, this._ringLineWidth, x2, y2, x3, y3);
                    } else if (this._ringType == 'arc') {
                        g.beginPath();
                        g.moveTo(center.x, center.y);
                        $g.drawArc(g, center.x, center.y, angleByRadian, this._averageAngleByRadian, radiusScale, radiusScale, true);
                        g.closePath();
                        g.stroke();
                    }
                }

                // int scale text
                if (scaleTextInfo) {
                    text = this.formatScaleText(this._axisMinValues.get(i) + this._axisRangeValues.get(i) * percent, i);
                    size = this.getTextSize(this._scaleTextFont, text);
                    position = this.getScaleTextPosition(angle, x2, y2, size.width, size.height);
                    scaleTextInfo.add({
                        text: text,
                        x: position.x,
                        y: position.y
                    });
                }
            }
            // draw scale
            if (this._axisVisible) {
                this.drawLine(g, this._axisLineColor, this._axisLineWidth, center.x, center.y, x1, y1);
            }

            // int axis text
            if (axisTextInfos) {
                var axisTextInfo = axisTextInfos.get(i);
                position = this.getAxisTextPosition(angle, x1, y1, axisTextInfo.size.width, axisTextInfo.size.height);
                axisTextInfo.x = position.x;
                axisTextInfo.y = position.y;
            }
            angleByRadian += this._averageAngleByRadian;
        }

        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            info.points.clear();
            var anchors = info.anchorSize > 0 ? new $List() : null;
            var proportions = info.proportions;

            g.lineWidth = 0;
            g.globalAlpha = this.isSelected(data) ? this._areaSelectFillAlpha : this._areaFillAlpha;
            if (this._areaFill) {
                g.fillStyle = info.color;
            }
            this._drawItem(g, proportions, center, radius, anchors, info);
            if (this._areaFill) {
                g.fill();
            }

            g.lineWidth = info.lineWidth;
            g.strokeStyle = info.color;
            g.globalAlpha = 1;
            this._drawItem(g, proportions, center, radius);

            // draw anchor
            g.lineWidth = 0;
            if (anchors != null && anchors.size() > 0) {
                var offset = info.anchorSize / 2;
                anchors.forEach(function (p) {
                    g.fillStyle = info.color;
                    $g.drawVector(g, info.anchorShape, null, p.x - offset, p.y - offset, info.anchorSize, info.anchorSize);
                    g.fill();
                });
            }
        }, this);

        // draw scale texts
        if (scaleTextInfos) {
            scaleTextInfos.forEach(function (t) {
                t.forEach(function (v) {
                    $g.drawText(g, v.text, v, this._scaleTextFont, this._scaleTextColor);
                }, this);
            }, this);
        }
        // draw axis texts
        if (axisTextInfos) {
            axisTextInfos.forEach(function (v) {
                $g.drawText(g, v.text, v, this._axisTextFont, this._axisTextColor);
            }, this);
        }
    },
    _drawItem: function (g, proportions, center, radius, anchors, info) {
        var angleByRadian = this._axisStartAngle / 180 * Math.PI;
        var firstPoint = null;
        g.beginPath();
        for (var i = 0; i < this._axisCount; i++) {
            var proportion = proportions.get(i);
            var point = {
                x: center.x + Math.cos(angleByRadian) * radius * proportion,
                y: center.y + Math.sin(-angleByRadian) * radius * proportion
            };

            // draw line
            if (firstPoint == null) {
                g.moveTo(point.x, point.y);
            } else {
                g.lineTo(point.x, point.y);
            }

            // draw anchor
            if (anchors != null && this._anchorVisible) {
                anchors.add(point);
            }
            if (info) {
                info.points.add(point);
            }

            if (i == 0) {
                firstPoint = point;
            }
            angleByRadian += this._averageAngleByRadian;
        }
        if (firstPoint != null) {
            g.lineTo(firstPoint.x, firstPoint.y);
        }
        g.closePath();
        g.stroke();
    },
    getAxisTextPosition: function (angle, cx, cy, width, height) {
        angle = (angle % 360 + 360) % 360;
        var position = { x: cx, y: cy };
        if (angle == 0) {
            position = { x: cx + width / 2, y: cy };
        }
        if (angle == 180) {
            position = { x: cx - width / 2, y: cy };
        }
        if (angle == 90) {
            position = { x: cx, y: cy - height / 2 };
        }
        if (angle == 270) {
            position = { x: cx, y: cy + height / 2 };
        }
        if (angle > 270 && angle < 360) {
            position = { x: cx + width / 2, y: cy + height / 2 };
        }
        if (angle > 180 && angle < 270) {
            position = { x: cx - width / 2, y: cy + height / 2 };
        }
        if (angle > 90 && angle < 180) {
            position = { x: cx - width / 2, y: cy - height / 2 };
        }
        if (angle > 0 && angle < 90) {
            position = { x: cx + width / 2, y: cy - height / 2 };
        }
        return position;
    },
    getScaleTextPosition: function (angle, cx, cy, width, height) {
        angle = (angle % 360 + 360) % 360;
        var position = { x: cx, y: cy };
        if (angle == 0) {
            position = { x: cx, y: cy + height / 2 };
        }
        if (angle == 180) {
            position = { x: cx - width / 2, y: cy + height / 2 };
        }
        if (angle == 90) {
            position = { x: cx + width / 2, y: cy };
        }
        if (angle == 270) {
            position = { x: cx + width / 2, y: cy };
        }
        if (angle > 270 && angle < 360) {
            position = { x: cx + width / 2, y: cy - height / 2 };
        }
        if (angle > 180 && angle < 270) {
            position = { x: cx - width / 2, y: cy - height / 2 };
        }
        if (angle > 90 && angle < 180) {
            position = { x: cx - width / 2, y: cy + height / 2 };
        }
        if (angle > 0 && angle < 90) {
            position = { x: cx + width / 2, y: cy + height / 2 };
        }
        return position;
    }
});
