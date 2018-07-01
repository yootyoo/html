twaver.charts.PieChart = function (dataBox) {
    this._sum = 0;
    this._map = {};
    twaver.charts.PieChart.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.charts.PieChart', twaver.charts.ChartBase, {
    __accessor: ['type', 'selectOffset', 'startAngle', 'shadowColor', 'shadowOffset', 'lineRate', 'donutRate', 'valuePosition'],

    _type: $Defaults.PIECHART_TYPE,
    _lineRate: $Defaults.PIECHART_LINE_RATE,
    _donutRate: $Defaults.PIECHART_DONUT_RATE,
    _startAngle: $Defaults.PIECHART_START_ANGLE,
    _shadowColor: $Defaults.PIECHART_SHADOW_COLOR,
    _shadowOffset: $Defaults.PIECHART_SHADOW_OFFSET,
    _selectOffset: $Defaults.PIECHART_SELECT_OFFSET,
    _valuePosition: $Defaults.PIECHART_VALUE_POSITION,

    getSum: function () {
        return this._sum;
    },
    validateModel: function () {
        this._sum = 0;
        this._map = {};

        this._publishedDatas.forEach(function (data) {
            var value = this.getValue(data);
            this._map[data.getId()] = {
                data: data,
                value: value,
                color: this.getUniqueColor(this.getColor(data), data)
            };
            this._sum += value;
        }, this);

        var angle = this._startAngle;
        this._publishedDatas.forEach(function (data) {
            var info = this._map[data.getId()];
            info.proportion = this._sum === 0 ? 0 : info.value / this._sum;
            if (this._type !== 'line') {
                info.startAngle = angle;
                info.arc = info.proportion * Math.PI * 2;
                angle += info.arc;
            }
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

        $math.grow(rect, -4, -4);
        if (rect.width <= 0 || rect.height <= 0) {
            return;
        }
        var offset = this._shadowOffset;
        if (offset > 0) {
            g.shadowOffsetX = offset;
            g.shadowOffsetY = offset;
            g.shadowBlur = offset * 1.5;
            g.shadowColor = this._shadowColor;
        }
        if (this._type === 'oval' || this._type === 'circle') {
            var cx = rect.x + rect.width / 2;
            var cy = rect.y + rect.height / 2;
            var rx = rect.width / 2;
            var ry = rect.height / 2;
            if (this._type === 'circle') {
                rx = ry = Math.min(rx, ry);
            }
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (info.arc === 0) {
                    return;
                }
                var sx = 0;
                var sy = 0;
                if (this.isSelected(data)) {
                    var angle = info.startAngle + info.arc / 2;
                    sx = Math.cos(angle) * this._selectOffset;
                    sy = Math.sin(angle) * this._selectOffset * ry / rx;
                }
                g.fillStyle = info.color;
                g.beginPath();
                g.moveTo(cx + sx, cy - sy);
                $g.drawArc(g, cx + sx, cy - sy, info.startAngle, info.arc, rx, ry, true);
                g.closePath();
                g.fill();

                var valueText = this._getValueTextInfo(data, info.value);
                if (valueText) {
                    var angle = info.startAngle + info.arc / 2;
                    valueText.x = cx + sx + Math.cos(angle) * rx * this._valuePosition;
                    valueText.y = cy - sy - Math.sin(angle) * ry * this._valuePosition;
                }
            }, this);
        }
        else if (this._type === 'donut' || this._type === 'ovalDonut') {
            var cx = rect.x + rect.width / 2;
            var cy = rect.y + rect.height / 2;
            var rx = rect.width / 2;
            var ry = rect.height / 2;
            if (this._type === 'donut') {
                rx = ry = Math.min(rx, ry);
            }
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                if (info.arc === 0) {
                    return;
                }
                var sx = 0;
                var sy = 0;
                if (this.isSelected(data)) {
                    var angle = info.startAngle + info.arc / 2;
                    sx = Math.cos(angle) * this._selectOffset;
                    sy = Math.sin(angle) * this._selectOffset * ry / rx;
                }
                var p1x = cx + Math.cos(info.startAngle) * rx * this._donutRate;
                var p1y = cy - Math.sin(info.startAngle) * ry * this._donutRate;

                var p2x = cx + Math.cos(info.startAngle + info.arc) * rx * this._donutRate;
                var p2y = cy - Math.sin(info.startAngle + info.arc) * ry * this._donutRate;

                g.fillStyle = info.color;
                g.beginPath();
                g.moveTo(p1x + sx, p1y - sy);
                $g.drawArc(g, cx + sx, cy - sy, info.startAngle, info.arc, rx, ry, true);
                g.lineTo(p2x + sx, p2y - sy);
                $g.drawArc(g, cx + sx, cy - sy, info.startAngle + info.arc, -info.arc, rx * this._donutRate, ry * this._donutRate, true);
                g.closePath();
                g.fill();

                var valueText = this._getValueTextInfo(data, info.value);
                if (valueText) {
                    var angle = info.startAngle + info.arc / 2;
                    var rate = this._donutRate + (1 - this._donutRate) * this._valuePosition;
                    valueText.x = cx + sx + Math.cos(angle) * rx * rate;
                    valueText.y = cy - sy - Math.sin(angle) * ry * rate;
                }
            }, this);
        }
        else if (this._type === 'line') {
            var h = rect.height * this._lineRate;
            rect.y = rect.y + rect.height / 2 - h / 2;
            rect.height = h;
            var startx = rect.x;
            this._publishedDatas.forEach(function (data) {
                var info = this._map[data.getId()];
                var w = rect.width * info.proportion;
                if (w === 0) {
                    return;
                }
                g.beginPath();
                g.fillStyle = info.color;
                var sf = this.isSelected(data) ? -this._selectOffset : 0;
                g.rect(startx, rect.y + sf, w, rect.height);
                g.closePath();
                g.fill();

                var valueText = this._getValueTextInfo(data, info.value);
                if (valueText) {
                    valueText.x = startx + w / 2;
                    valueText.y = rect.y + rect.height + sf - rect.height * this._valuePosition;
                }

                startx += w;
            }, this);
        }
        if (this._shadowOffset > 0) {
            g.shadowOffsetX = 0;
            g.shadowOffsetY = 0;
            g.shadowBlur = 0;
        }
        // draw value text
        this.drawValueTexts(g);
    }
});
