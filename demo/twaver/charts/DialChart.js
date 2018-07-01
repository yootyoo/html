twaver.charts.DialChart = function (dataBox) {
    twaver.charts.DialChart.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.charts.DialChart', twaver.charts.ChartBase, {
    __accessor: ['upperLimit', 'lowerLimit', 'startAngle', 'endAngle', 'innerRadius', 'colorRangeFillColor', 'outlineWidth', 'outlineColor',
                    'majorScaleCount', 'majorScaleLineWidth', 'majorScaleLineLength', 'majorScaleLineColor',
                    'minorScaleCount', 'minorScaleLineWidth', 'minorScaleLineLength', 'minorScaleLineColor',
                    'scaleTextVisible', 'scaleUpperLimitTextVisible', 'scaleLowerLimitTextVisible', 'scaleTextFont', 'scaleTextColor',
                    'pivotRadius', 'pivotFillColor', 'pivotOutlineWidth', 'pivotOutlineColor', 'pivotGradient', 'pivotGradientColor',
                    'valuePosition', 'colorRangeList', 'innerDarkerRadius', 'outerBrighterRadius', 'selectShadowColor', 'selectShadowOffset'],

    __bool: ['scaleInside', 'pivotFill'],

    _upperLimit: $Defaults.DIALCHART_UPPER_LIMIT,
    _lowerLimit: $Defaults.DIALCHART_LOWER_LIMIT,
    _startAngle: $Defaults.DIALCHART_START_ANGLE,
    _endAngle: $Defaults.DIALCHART_END_ANGLE,
    _innerRadius: $Defaults.DIALCHART_INNER_RADIUS,
    _colorRangeFillColor: $Defaults.DIALCHART_COLOR_RANGE_FILL_COLOR,
    _outlineWidth: $Defaults.DIALCHART_OUTLINE_WIDTH,
    _outlineColor: $Defaults.DIALCHART_OUTLINE_COLOR,

    _scaleInside: $Defaults.DIALCHART_SCALE_INSIDE,
    _majorScaleCount: $Defaults.DIALCHART_MAJOR_SCALE_COUNT,
    _majorScaleLineWidth: $Defaults.DIALCHART_MAJOR_SCALE_LINE_WIDTH,
    _majorScaleLineLength: $Defaults.DIALCHART_MAJOR_SCALE_LINE_LENGTH,
    _majorScaleLineColor: $Defaults.DIALCHART_MAJOR_SCALE_LINE_COLOR,

    _minorScaleCount: $Defaults.DIALCHART_MINOR_SCALE_COUNT,
    _minorScaleLineWidth: $Defaults.DIALCHART_MINOR_SCALE_LINE_WIDTH,
    _minorScaleLineLength: $Defaults.DIALCHART_MINOR_SCALE_LINE_LENGTH,
    _minorScaleLineColor: $Defaults.DIALCHART_MINOR_SCALE_LINE_COLOR,

    _scaleTextVisible: $Defaults.DIALCHART_SCALE_TEXT_VISIBLE,
    _scaleUpperLimitTextVisible: $Defaults.DIALCHART_SCALE_UPPER_LIMIT_TEXT_VISIBLE,
    _scaleLowerLimitTextVisible: $Defaults.DIALCHART_SCALE_LOWER_LIMIT_TEXT_VISIBLE,
    _scaleTextFont: $Defaults.DIALCHART_SCALE_TEXT_FONT,
    _scaleTextColor: $Defaults.DIALCHART_SCALE_TEXT_COLOR,

    _pivotRadius: $Defaults.DIALCHART_PIVOT_RADIUS,
    _pivotFill: $Defaults.DIALCHART_PIVOT_FILL,
    _pivotFillColor: $Defaults.DIALCHART_PIVOT_FILL_COLOR,
    _pivotOutlineWidth: $Defaults.DIALCHART_PIVOT_OUTLINE_WIDTH,
    _pivotOutlineColor: $Defaults.DIALCHART_PIVOT_OUTLINE_COLOR,
    _pivotGradient: $Defaults.DIALCHART_PIVOT_GRADIENT,
    _pivotGradientColor: $Defaults.DIALCHART_PIVOT_GRADIENT_COLOR,

    _valuePosition: $Defaults.DIALCHART_VALUE_POSITION,
    _innerDarkerRadius: $Defaults.DIALCHART_INNER_DARKER_RADIUS,
    _outerBrighterRadius: $Defaults.DIALCHART_OUTER_BRIGHTER_RADIUS,

    _selectShadowColor: $Defaults.DIALCHART_SELECT_SHADOW_COLOR,
    _selectShadowOffset: $Defaults.DIALCHART_SELECT_SHADOW_OFFSET,

    formatScaleText: function (value) {
        return value.toFixed(2);
    },
    validateModel: function () {
        this._map = {};
        this._valueRange = this._upperLimit - this._lowerLimit;
        var startAngle = this._startAngle;
        if (startAngle != 0) {
            startAngle = (startAngle % 360 + 360) % 360;
            if (startAngle == 0) {
                startAngle = 360;
            }
        }
        this._positiveStartAngle = startAngle;
        var endAngle = this._endAngle;
        if (endAngle != 0) {
            endAngle = (endAngle % 360 + 360) % 360;
            if (endAngle == 0) {
                endAngle = 360;
            }
        }
        this._positiveEndAngle = endAngle;
        this._whole = Math.abs(startAngle - endAngle) == 360;
        this._startAngleByRadian = startAngle * Math.PI / 180;
        this._endAngleByRadian = endAngle * Math.PI / 180;
        this._clockwise = this._startAngleByRadian > this._endAngleByRadian;
        this._angleRange = Math.abs(this._startAngleByRadian - this._endAngleByRadian);

        this._publishedDatas.forEach(function (data) {
            var value = this.getValue(data);
            this._map[data.getId()] = {
                data: data,
                value: value,
                color: this.getUniqueColor(this.getColor(data), data),
                angle: this._startAngleByRadian + (this._clockwise ? -1 : 1) * value / this._valueRange * this._angleRange
            };
        }, this);
    },
    validateDisplay: function (g, width, height) {
        var rect = {
            x: this._xGap,
            y: this._yGap,
            width: width - this._xGap * 2,
            height: height - this._yGap * 2
        };
        this.drawBackground(g, rect);

        if (this._startAngleByRadian == this._endAngleByRadian) {
            return;
        }

        var i;
        var value = this._lowerLimit;
        var avgValue = this._majorScaleCount > 1 ? this._valueRange / (this._majorScaleCount - 1) : 0;
        var maxWidth = 0, maxHeight = 0, size;
        var scaleTextInfos = null;
        var text = null;
        if (this._scaleTextVisible) {
            scaleTextInfos = new $List();
            for (i = 0; i < this._majorScaleCount; i++) {
                if ((i == 0 && !this._scaleLowerLimitTextVisible) || (i == this._majorScaleCount - 1 && !this._scaleUpperLimitTextVisible)) {
                    size = null;
                    scaleTextInfos.add({ text: '', size: { width: 0, height: 0} });
                } else {
                    text = this.formatScaleText(value);
                    size = this.getTextSize(this._scaleTextFont, text);
                    scaleTextInfos.add({ text: text, size: size });
                }
                if (!this._scaleInside && size != null) {
                    if (size.width > maxWidth) {
                        maxWidth = size.width;
                    }
                    if (size.height > maxHeight) {
                        maxHeight = size.height;
                    }
                }
                value += avgValue;
            }
        }
        if (this._angleRange <= Math.PI) {
            maxWidth = Math.max(maxWidth, this._pivotRadius);
            maxHeight = Math.max(maxHeight, this._pivotRadius);
        }
        $math.grow(rect, -maxWidth, -maxHeight);
        this._calcluateCenterAndRadius(rect);

        //draw color range
        g.lineWidth = 0;
        if (this._colorRangeList == null || this._colorRangeList.size() == 0) {
            this._drawArcGroup(g, this._startAngleByRadian, this._endAngleByRadian, this.getUniqueColor(this._colorRangeFillColor));
            this._drawArcOutLine(g, this._startAngleByRadian, this._endAngleByRadian, true, true);
        } else {
            var avgRangeDegree = this._angleRange / this._colorRangeList.size();
            var currentAngle = this._startAngleByRadian;
            for (i = 0; i < this._colorRangeList.size(); i++) {
                var color = this.getUniqueColor(this._colorRangeList.get(i));
                var end = currentAngle + ((this._clockwise ? -1 : 1) * avgRangeDegree);
                this._drawArcGroup(g, currentAngle, end, color);
                this._drawArcOutLine(g, currentAngle, currentAngle + ((this._clockwise ? -1 : 1) * avgRangeDegree), i == 0, i == this._colorRangeList.size() - 1);
                currentAngle += ((this._clockwise ? -1 : 1) * avgRangeDegree);
            }
        }

        //draw scale
        var angle = this._startAngleByRadian;
        var avgAngle = this._majorScaleCount > 1 ? this._angleRange / (this._majorScaleCount - 1) : 0;
        var j, startX, startY, endX, endY, startRadius, endMajorRadius, endMinorRadius;
        startRadius = this._scaleInside ? this._innerRadiusByPixel : this._outerRadius;
        endMajorRadius = startRadius + this._majorScaleLineLength * (this._scaleInside ? 1 : -1);
        endMinorRadius = startRadius + this._minorScaleLineLength * (this._scaleInside ? 1 : -1);
        for (i = 0; i < this._majorScaleCount; i++) {
            //draw major scale
            startX = this._center.x + Math.cos(angle) * startRadius;
            startY = this._center.y + Math.sin(-angle) * startRadius;
            endX = this._center.x + Math.cos(angle) * endMajorRadius;
            endY = this._center.y + Math.sin(-angle) * endMajorRadius;
            g.lineWidth = this._majorScaleLineWidth;
            g.strokeStyle = this.getUniqueColor(this._majorScaleLineColor);
            g.beginPath();
            g.moveTo(startX, startY);
            g.lineTo(endX, endY);
            g.closePath();
            g.stroke();

            //draw scale text
            if (this._scaleTextVisible) {
                if ((i == 0 && !this._scaleLowerLimitTextVisible) || (i == this._majorScaleCount - 1 && !this._scaleUpperLimitTextVisible)) {
                } else {
                    var scaleTextInfo = scaleTextInfos.get(i);
                    if (scaleTextInfo) {
                        var position = this.getScaleTextPosition(angle / Math.PI * 180, startX, startY, scaleTextInfo.size.width, scaleTextInfo.size.height);
                        scaleTextInfo.x = position.x;
                        scaleTextInfo.y = position.y;
                    }
                }
            }

            if (this._whole || (!this._whole && i < this._majorScaleCount - 1)) {
                //draw minor scale
                var minorAngle = angle;
                var avgMinorAngle = this._minorScaleCount > 0 ? avgAngle / (this._minorScaleCount + 1) : 0;
                for (j = 0; j < this._minorScaleCount; j++) {
                    minorAngle += ((this._clockwise ? -1 : 1) * avgMinorAngle);
                    startX = this._center.x + Math.cos(minorAngle) * startRadius;
                    startY = this._center.y + Math.sin(-minorAngle) * startRadius;
                    endX = this._center.x + Math.cos(minorAngle) * endMinorRadius;
                    endY = this._center.y + Math.sin(-minorAngle) * endMinorRadius;
                    g.lineWidth = this._minorScaleLineWidth;
                    g.strokeStyle = this.getUniqueColor(this._minorScaleLineColor);
                    g.beginPath();
                    g.moveTo(startX, startY);
                    g.lineTo(endX, endY);
                    g.closePath();
                    g.stroke();
                }
            }

            angle += ((this._clockwise ? -1 : 1) * avgAngle);
        }

        //draw pivot
        if (this._pivotFill) {
            $g.fill(g, this.getUniqueColor(this._pivotFillColor), this._pivotGradient, this._pivotGradientColor, this._center.x - this._pivotRadius, this._center.y - this._pivotRadius, this._pivotRadius * 2, this._pivotRadius * 2);
        }

        g.lineWidth = this._pivotOutlineWidth;
        g.strokeStyle = this.getUniqueColor(this._pivotOutlineColor);
        g.beginPath();
        g.arc(this._center.x, this._center.y, this._pivotRadius, 0, Math.PI * 2, true);
        g.closePath();

        if (this._pivotFill) {
            g.fill();
        }

        // draw scale texts
        if (scaleTextInfos) {
            scaleTextInfos.forEach(function (v) {
                if (v) {
                    $g.drawText(g, v.text, v, this._scaleTextFont, this._scaleTextColor);
                }
            }, this);
        }

        // draw hand
        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            var rearExtension = this._getDataStyle('dialchart.rear.extension', data);
            var baseWidth = this._getDataStyle('dialchart.base.width', data);
            var topWidth = this._getDataStyle('dialchart.top.width', data);
            var radius = this._getDataStyle('dialchart.radius', data);

            if (radius >= -1 && radius <= 1) {
                radius = radius * this._innerRadiusByPixel;
            }

            g.fillStyle = info.color;
            g.lineWidth = 0;

            var matrix = $math.createMatrix(-info.angle, this._center.x, this._center.y);
            var p1 = matrix.transform(this._center.x + radius, this._center.y + topWidth / 2);
            var p2 = matrix.transform(this._center.x + radius, this._center.y - topWidth / 2);
            var p3 = matrix.transform(this._center.x - rearExtension, this._center.y - baseWidth / 2);
            var p4 = matrix.transform(this._center.x - rearExtension, this._center.y + baseWidth / 2);

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
            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(p2.x, p2.y);
            g.lineTo(p3.x, p3.y);
            g.lineTo(p4.x, p4.y);
            g.lineTo(p1.x, p1.y);
            g.closePath();

            g.fill();

            var valueText = this._getValueTextInfo(data, info.value);
            if (valueText) {
                var p5 = matrix.transform(this._center.x + radius * this._valuePosition, this._center.y);
                valueText.x = p5.x;
                valueText.y = p5.y;
            }
        }, this);

        // draw value text
        this.drawValueTexts(g);
    },
    _getDataStyle: function (style, data) {
        if (data.getStyle) {
            return data.getStyle(style);
        }
        return data.getClient(style);
    },
    _calcluateCenterAndRadius: function (rect) {
        var start = this._clockwise ? this._positiveEndAngle : this._positiveStartAngle;
        var end = this._clockwise ? this._positiveStartAngle : this._positiveEndAngle;
        var range = Math.abs(this._positiveEndAngle - this._positiveStartAngle);

        if (0 <= start && start < 90) {
            if (0 <= end && end <= 90) {
                this._outerRadius = Math.min(rect.width, rect.height);
                this._center = { x: rect.x + (rect.width - this._outerRadius) / 2, y: rect.y + (rect.height + this._outerRadius) / 2 };
            } else if (90 < end && end <= 180) {
                this._outerRadius = Math.min(rect.width / 2, rect.height);
                this._center = { x: rect.x + rect.width / 2, y: rect.y + (rect.height + this._outerRadius) / 2 };
            } else {
                this._center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
                this._outerRadius = Math.min(rect.width, rect.height) / 2;
            }
        } else if (90 <= start && start < 180) {
            if (90 <= end && end <= 180) {
                this._outerRadius = Math.min(rect.width, rect.height);
                this._center = { x: rect.x + (rect.width + this._outerRadius) / 2, y: rect.y + (rect.height + this._outerRadius) / 2 };
            } else if (180 < end && end <= 270) {
                this._outerRadius = Math.min(rect.width, rect.height / 2);
                this._center = { x: rect.x + (rect.width + this._outerRadius) / 2, y: rect.y + rect.height / 2 };
            } else {
                this._center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
                this._outerRadius = Math.min(rect.width, rect.height) / 2;
            }
        } else if (180 <= start && start < 270) {
            if (180 <= end && end <= 270) {
                this._outerRadius = Math.min(rect.width, rect.height);
                this._center = { x: rect.x + (rect.width + this._outerRadius) / 2, y: rect.y + (rect.height - this._outerRadius) / 2 };
            } else {
                this._outerRadius = Math.min(rect.width / 2, rect.height);
                this._center = { x: rect.x + rect.width / 2, y: rect.y + (rect.height - this._outerRadius) / 2 };
            }
        } else {
            this._outerRadius = Math.min(rect.width, rect.height);
            this._center = { x: rect.x + (rect.width - this._outerRadius) / 2, y: rect.y + (rect.height - this._outerRadius) / 2 };
        }

        this._innerRadiusByPixel = this._innerRadius > 1 ? this._innerRadius : this._outerRadius * this._innerRadius;
        this._innerDarkerRadiusByPixel = this._innerDarkerRadius > 1 ? this._innerDarkerRadius : this._outerRadius * this._innerDarkerRadius;
        this._outerBrighterRadiusByPixel = this._outerBrighterRadius > 1 ? this._outerBrighterRadius : this._outerRadius * this._outerBrighterRadius;
    },
    _drawArcOutLine: function (g, start, end, startLine, endLine) {
        if (this._outlineWidth <= 0) {
            return;
        }
        var range = Math.abs(start - end);

        var x1 = this._center.x + Math.cos(start) * this._innerRadiusByPixel;
        var y1 = this._center.y + Math.sin(-start) * this._innerRadiusByPixel;
        var x2 = this._center.x + Math.cos(start) * this._outerRadius;
        var y2 = this._center.y + Math.sin(-start) * this._outerRadius;
        var x3 = this._center.x + Math.cos(end) * this._innerRadiusByPixel;
        var y3 = this._center.y + Math.sin(-end) * this._innerRadiusByPixel;
        var x4 = this._center.x + Math.cos(end) * this._outerRadius;
        var y4 = this._center.y + Math.sin(-end) * this._outerRadius;

        if (this._clockwise) {
            g.lineWidth = this._outlineWidth;
            g.strokeStyle = this.getUniqueColor(this._outlineColor);
            g.beginPath();
            g.moveTo(this._center.x, this._center.y);
            $g.drawArc(g, this._center.x, this._center.y, end, range, this._outerRadius, this._outerRadius, false);
            g.stroke();

            if (!this._whole && startLine) {
                g.lineWidth = this._outlineWidth;
                g.strokeStyle = this.getUniqueColor(this._outlineColor);
            } else {
                g.lineWidth = 0;
            }
            g.lineTo(x1, y1);
            g.stroke();

            g.beginPath();
            g.lineWidth = this._outlineWidth;
            g.strokeStyle = this.getUniqueColor(this._outlineColor);
            g.moveTo(this._center.x, this._center.y);
            $g.drawArc(g, this._center.x, this._center.y, start, -range, this._innerRadiusByPixel, this._innerRadiusByPixel, false);
            g.stroke();

            if (!this._whole && endLine) {
                g.lineWidth = this._outlineWidth;
                g.strokeStyle = this.getUniqueColor(this._outlineColor);
            } else {
                g.lineWidth = 0;
            }
            g.lineTo(x4, y4);
            g.stroke();
        } else {
            g.lineWidth = this._outlineWidth;
            g.strokeStyle = this.getUniqueColor(this._outlineColor);
            g.beginPath();
            g.moveTo(this._center.x, this._center.y);
            $g.drawArc(g, this._center.x, this._center.y, start, range, this._outerRadius, this._outerRadius, false);
            g.stroke();

            if (!this._whole && endLine) {
                g.lineWidth = this._outlineWidth;
                g.strokeStyle = this.getUniqueColor(this._outlineColor);
            } else {
                g.lineWidth = 0;
            }
            g.lineTo(x3, y3);
            g.stroke();

            g.lineWidth = this._outlineWidth;
            g.strokeStyle = this.getUniqueColor(this._outlineColor);
            g.beginPath();
            g.moveTo(this._center.x, this._center.y);
            $g.drawArc(g, this._center.x, this._center.y, end, -range, this._innerRadiusByPixel, this._innerRadiusByPixel, false);
            g.stroke();

            if (!this._whole && startLine) {
                g.lineWidth = this._outlineWidth;
                g.strokeStyle = this.getUniqueColor(this._outlineColor);
            } else {
                g.lineWidth = 0;
            }
            g.lineTo(x2, y2);
            g.stroke();
        }
    },
    _drawArcGroup: function (g, start, end, fillColor) {
        if (this._outerBrighterRadiusByPixel != 0) {
            this._drawArc(g, start, end, this._outerRadius - this._outerBrighterRadiusByPixel, this._outerRadius, $g.brighter(fillColor));
        }
        this._drawArc(g, start, end, this._innerRadiusByPixel + this._innerDarkerRadiusByPixel, this._outerRadius - this._outerBrighterRadiusByPixel, fillColor);
        if (this._innerDarkerRadiusByPixel != 0) {
            this._drawArc(g, start, end, this._innerRadiusByPixel, this._innerRadiusByPixel + this._innerDarkerRadiusByPixel, $g.darker(fillColor, 20));
        }
    },
    _drawArc: function (g, start, end, innerRadius, outerRadius, fillColor) {
        var range = Math.abs(start - end);
        g.lineWidth = 0;
        g.fillStyle = fillColor;

        var x1 = this._center.x + Math.cos(start) * innerRadius;
        var y1 = this._center.y + Math.sin(-start) * innerRadius;
        var x2 = this._center.x + Math.cos(start) * outerRadius;
        var y2 = this._center.y + Math.sin(-start) * outerRadius;
        var x3 = this._center.x + Math.cos(end) * innerRadius;
        var y3 = this._center.y + Math.sin(-end) * innerRadius;
        var x4 = this._center.x + Math.cos(end) * outerRadius;
        var y4 = this._center.y + Math.sin(-end) * outerRadius;

        g.beginPath();
        if (this._clockwise) {
            g.moveTo(x3, y3);
            $g.drawArc(g, this._center.x, this._center.y, end, range, outerRadius, outerRadius, true);
            g.lineTo(x1, y1);
            $g.drawArc(g, this._center.x, this._center.y, start, -range, innerRadius, innerRadius, true);
            g.closePath();
        } else {
            g.moveTo(x1, y1);
            $g.drawArc(g, this._center.x, this._center.y, start, range, outerRadius, outerRadius, true);
            g.lineTo(x3, y3);
            $g.drawArc(g, this._center.x, this._center.y, end, -range, innerRadius, innerRadius, true);
            g.closePath();
        }

        g.fill();
    },
    getScaleTextPosition: function (angle, cx, cy, width, height) {
        angle = (angle % 360 + 360) % 360;
        var position = { x: cx, y: cy };
        if (angle == 0) {
            position = this._scaleInside ? { x: cx - width / 2, y: cy} : { x: cx + width / 2, y: cy };
        }
        if (angle == 180) {
            position = this._scaleInside ? { x: cx + width / 2, y: cy} : { x: cx - width / 2, y: cy };
        }
        if (angle == 90) {
            position = this._scaleInside ? { x: cx, y: cy + height / 2} : { x: cx, y: cy - height / 2 };
        }
        if (angle == 270) {
            position = this._scaleInside ? { x: cx, y: cy - height / 2} : { x: cx, y: cy + height / 2 };
        }
        if (angle > 270 && angle < 360) {
            position = this._scaleInside ? { x: cx - width / 2, y: cy - height / 2} : { x: cx + width / 2, y: cy + height / 2 };
        }
        if (angle > 180 && angle < 270) {
            position = this._scaleInside ? { x: cx + width / 2, y: cy - height / 2} : { x: cx - width / 2, y: cy + height / 2 };
        }
        if (angle > 90 && angle < 180) {
            position = this._scaleInside ? { x: cx + width / 2, y: cy + height / 2} : { x: cx - width / 2, y: cy - height / 2 };
        }
        if (angle > 0 && angle < 90) {
            position = this._scaleInside ? { x: cx - width / 2, y: cy + height / 2} : { x: cx + width / 2, y: cy - height / 2 };
        }
        return position;
    }
});
