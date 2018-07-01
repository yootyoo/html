twaver.charts.IS_INVALIDATE_PROPERTY = {
    "xZoom": 1,
    "xTranslate": 1,
    "yZoom": 1,
    "yTranslate": 1
};
twaver.charts.ChartBase = function (dataBox) {
    twaver.charts.ChartBase.superClass.constructor.apply(this, arguments);
    this._uniqueColors = {};
    this._nonDataColors = {};
    this._publishedDatas = new $List();

    this._view = $html.createView('hidden');
    this._canvas = $html.createCanvas();
    this._view.appendChild(this._canvas);

    this.setDataBox(dataBox ? dataBox : new twaver.ElementBox());
    this.invalidate();

    var Interaction;
    if ($ua.isMSToucheable) {
        Interaction = twaver.charts.ChartMSTouchInteraction;
    }
    else if ($ua.isTouchable) {
        Interaction = twaver.charts.ChartTouchInteraction;
    } else {
        Interaction = twaver.charts.ChartInteraction;
    }
    if (Interaction) {
        new Interaction(this);
    }

    this.setToolTipEnabled($Defaults.CHART_TOOLTIP_ENABLED);
};
_twaver.ext('twaver.charts.ChartBase', twaver.controls.ViewBase, {
    __accessor: [
        'xGap', 'yGap', 'xTranslate', 'yTranslate', 'valueVisible', 'sortFunction', 'visibleFunction',
        'xTranslateEnabled', 'yTranslateEnabled', 'xZoomEnabled', 'yZoomEnabled', 'selectTolerance',
        'backgroundVisible', 'backgroundFill', 'backgroundFillColor', 'backgroundOutlineWidth',
        'backgroundOutlineColor', 'backgroundGradient', 'backgroundGradientColor','outerZoom'
        ],

    __bool: ['doubleClickToReset', 'focusOnClick'],

    _backgroundVisible: $Defaults.CHART_BACKGROUND_VISIBLE,
    _backgroundFill: $Defaults.CHART_BACKGROUND_FILL,
    _backgroundFillColor: $Defaults.CHART_BACKGROUND_FILL_COLOR,
    _backgroundOutlineWidth: $Defaults.CHART_BACKGROUND_OUTLINE_WIDTH,
    _backgroundOutlineColor: $Defaults.CHART_BACKGROUND_OUTLINE_COLOR,
    _backgroundGradient: $Defaults.CHART_BACKGROUND_GRADIENT,
    _backgroundGradientColor: $Defaults.CHART_BACKGROUND_GRADIENT_COLOR,

    _selectTolerance: $Defaults.CHART_SELECT_TOLERANCE,
    _doubleClickToReset: $Defaults.CHART_DOUBLE_CLICK_TO_RESET,
    _focusOnClick: $Defaults.FOCUS_ON_CLICK,
    _sortFunction: null,
    _visibleFunction: null,

    _canvasWidth: 0,
    _canvasHeight: 0,
    _outerZoomL: 1,

    _xGap: $Defaults.CHART_XGAP,
    _yGap: $Defaults.CHART_YGAP,

    _xTranslate: 0,
    _yTranslate: 0,
    _xTranslateEnabled: $Defaults.CHART_XTRANSLATE_ENABLED,
    _yTranslateEnabled: $Defaults.CHART_YTRANSLATE_ENABLED,

    _xZoom: 1,
    _yZoom: 1,
    _maxZoom: $Defaults.ZOOM_MAX,
    _minZoom: $Defaults.ZOOM_MIN,
    _xZoomEnabled: $Defaults.CHART_XZOOM_ENABLED,
    _yZoomEnabled: $Defaults.CHART_YZOOM_ENABLED,

    _valueVisible: $Defaults.CHART_VALUE_VISIBLE,
    _valueFont: $Defaults.CHART_VALUE_FONT,

    isToolTipEnabled: function () {
        return this._toolTipListener ? true : false;
    },
    setToolTipEnabled: function (value) {
        if (value) {
            if (!this._toolTipListener) {
                var self = this;
                this._toolTipListener = function (e) {
                    $popup.showToolTip(e, self.getToolTip(e));
                };
                this._canvas.addEventListener('mousemove', this._toolTipListener, true);
                this.firePropertyChange('toolTipEnabled', false, true);
            }
        } else {
            if (this._toolTipListener) {
                $popup.hideToolTip();
                this._canvas.removeEventListener('mousemove', this._toolTipListener, true);
                delete this._toolTipListener;
                this.firePropertyChange('toolTipEnabled', true, false);
            }
        }
    },
    getToolTip: function (evt) {
        if (this._toolTipInfos) {
            var p = this.getLogicalPoint(evt);
            p.x -= this._xTranslate;
            p.y -= this._yTranslate;
            var count = this._toolTipInfos.size();
            for (var i = count - 1; i >= 0; i--) {
                var info = this._toolTipInfos.get(i);
                if (info.rect && $math.containsPoint(info.rect, p)) {
                    return this.getToolTipByData(info.data, info);
                }
            }
        }
        else {
            var data = this.tryGetDataAt(evt);
            if (data) {
                return this.getToolTipByData(data, { value: this.getValue(data) });
            }
        }
        return null;
    },
    getToolTipByData: function (data, info) {
        if (info.value !== undefined) {
            return this.formatValueText(info.value, data);
        }
        return null;
    },
    addToolTipInfo: function (x, y, w, h, value, data, index) {
        if (this._toolTipInfos) {
            this._toolTipInfos.add({
                data: data,
                rect: { x: x, y: y, width: w, height: h },
                value: value,
                index: index
            });
        }
    },
    getLogicalPoint: function (e) {
        return $html.getLogicalPoint(this._canvas, e, this._outerZoom);
    },
    getTextSize: function (font, text) {
        var size = $g.getTextSize(font, text);
        if (size.width) {
            size.width += 4;
        }
        return size;
    },
    getUniqueColor: function (color, data) {
        if (color == null) {
            return null;
        }
        var c;
        if (!data) {
            c = this._nonDataColors[color];
            if (c) {
                return c;
            }
        }
        var d = $g.getColorArray(color);
        if (!data) {
            if (d[3] != 255) {
                c = color;
            } else {
                c = 'rgba(' + d[0] + ',' + d[1] + ',' + d[2] + ',0.99)';
            }
            this._nonDataColors[color] = c;
            return c;
        }
        var rgb = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
        if (this._uniqueColors[rgb] === undefined || this._uniqueColors[rgb] === data) {
            // do nothing
        }
        else {
            var kr = 1;
            var kg = -1;
            var kb = 1;
            // in opera d is a kind of byte array
            if ($ua.isOpera) {
                d = [d[0], d[1], d[2]];
            }
            while (true) {
                // adjust r
                d[0] += kr;
                if (d[0] >= 255) {
                    d[0] = 255;
                    kr = -1;
                } else if (d[0] <= 0) {
                    d[0] = 0;
                    kr = 1;
                }
                rgb = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
                if (this._uniqueColors[rgb] === undefined || this._uniqueColors[rgb] === data) {
                    break;
                }

                // adjust g
                d[1] += kg;
                if (d[1] >= 255) {
                    d[1] = 255;
                    kg = -1;
                } else if (d[1] <= 0) {
                    d[1] = 0;
                    kg = 1;
                }
                rgb = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
                if (this._uniqueColors[rgb] === undefined || this._uniqueColors[rgb] === data) {
                    break;
                }

                // adjust b
                d[2] += kb;
                if (d[2] >= 255) {
                    d[2] = 255;
                    kb = -1;
                } else if (d[2] <= 0) {
                    d[2] = 0;
                    kb = 1;
                }
                rgb = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
                if (this._uniqueColors[rgb] === undefined || this._uniqueColors[rgb] === data) {
                    break;
                }
            }
        }
        this._uniqueColors[rgb] = data;
        return rgb;
    },
    tryGetDataAt: function (point, tolerance) {
        if (tolerance == null || tolerance < 0) {
            tolerance = this._selectTolerance;
        }
        if (point.target) {
            point = $html.getLogicalPoint(this._canvas, arguments[0], this._outerZoom);
        }
        if (!point) {
            return null;
        }
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
    },
    _getPoint: function () {
        var x, y;
        if (arguments.length === 2) {
            x = arguments[0];
            y = arguments[1];
        }
        else if (arguments[0].target) {
            var p = $html.getLogicalPoint(this._canvas, arguments[0], this._outerZoom);
            if (p) {
                x = p.x;
                y = p.y;
            } else {
                return null;
            }
        }
        else {
            x = arguments[0].x;
            y = arguments[0].y;
        }
        return { x: x, y: y };
    },
    getDataAt: function () {
        var point = this._getPoint.apply(this, arguments),
        	x = point.x,
        	y = point.y;
        if (x < 0 || y < 0 || x > this._canvasWidth || y > this._canvasHeight) {
            return null;
        }
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
    },
    getBackgroundRect: function () {
        return this._backgroundRect;
    },
    drawBackground: function (g, rect) {
        this._backgroundRect = _twaver.clone(rect);
        if (rect != null && rect.width > 0 && rect.height > 0 && this._backgroundVisible) {
            if (this._backgroundFill) {
                $g.fill(g,
                    this.getUniqueColor(this._backgroundFillColor),
                    this._backgroundGradient,
                    this.getUniqueColor(this._backgroundGradientColor),
                    rect);
            }
            if (this._backgroundOutlineWidth > 0) {
                g.lineWidth = this._backgroundOutlineWidth;
                g.strokeStyle = this._backgroundOutlineColor;
            }
            g.beginPath();
            g.rect(rect.x, rect.y, rect.width, rect.height);
            g.closePath();
            if (this._backgroundFill) {
                g.fill();
            }
            if (this._backgroundOutlineWidth > 0) {
                g.stroke();
            }
        }
    },
    getName: function (data) {
        return data.getName();
    },
    getColor: function (data) {
        return data.getStyle ? data.getStyle('chart.color') : data.getClient('chart.color');
    },
    getValue: function (data) {
        return data.getStyle ? data.getStyle('chart.value') : 0;
    },
    getValueColor: function (data) {
        return data.getStyle ? data.getStyle('chart.value.color') : twaver.Styles.getStyle('chart.value.color');
    },
    setValueFont: function (value) {
        if (value === this._valueFont) {
            return;
        }
        var oldValue = value;
        this._valueFont = value;
        this.firePropertyChange('valueFont', oldValue, value);
    },
    getValueFont: function (data) {
        if (data) {
            var font = data.getStyle ? data.getStyle('chart.value.font') : twaver.Styles.getStyle('chart.value.font');
            if (font) {
                return font;
            }
        }
        return this._valueFont;
    },
    formatValueText: function (value, data) {
        return value;
    },
    getCanvasWidth: function () {
        return this._canvasWidth;
    },
    getCanvasHeight: function () {
        return this.canvasHeight;
    },
    getCanvas: function () {
        return this._canvas;
    },
    isVisible: function (data) {
        if (this._internalVisibleFunction && !this._internalVisibleFunction(data)) {
            return false;
        }
        return this._visibleFunction ? this._visibleFunction(data) : true;
    },
    onPropertyChanged: function (e) {
        if (twaver.charts.IS_INVALIDATE_PROPERTY[e.property]) {
            this.invalidate();
        } else {
            this.invalidateModel();
        }
    },
    getDataBox: function () {
        return this._box;
    },
    setDataBox: function (dataBox) {
        if (!dataBox) {
            throw "DataBox can not be null";
        }
        if (this._box === dataBox) {
            return;
        }

        var oldValue = this._box;
        if (oldValue) {
            oldValue.removeDataBoxChangeListener(this.handleDataBoxChange, this);
            oldValue.removeDataPropertyChangeListener(this.handlePropertyChange, this);
            oldValue.removeHierarchyChangeListener(this.handleHierarchyChange, this);
            if (!this._selectionModel) {
                oldValue.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
            }
        }
        this._box = dataBox;

        this._box.addDataBoxChangeListener(this.handleDataBoxChange, this);
        this._box.addDataPropertyChangeListener(this.handlePropertyChange, this);
        this._box.addHierarchyChangeListener(this.handleHierarchyChange, this);
        if (this._selectionModel) {
            this._selectionModel._setDataBox(dataBox);
        } else {
            this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
        }

        this.invalidateModel();

        this.firePropertyChange("dataBox", oldValue, this._box);
    },
    handleDataBoxChange: function (e) {
        this.invalidateModel();
    },
    handlePropertyChange: function (e) {
        this.invalidateModel();
    },
    handleHierarchyChange: function (e) {
        this.invalidateModel();
    },
    handleSelectionChange: function (e) {
        this.invalidateModel();
    },
    getUnfilteredDatas: function () {
        return this._unfilteredDatas ? this._unfilteredDatas : this._publishedDatas;
    },
    getPublishedDatas: function () {
        return this._publishedDatas;
    },
    createPublishedDatas: function () {
        this._unfilteredDatas = new $List();
        this._buildChildren(this._box.getRoots(), this._unfilteredDatas);
        if (this._sortFunction) {
            this._unfilteredDatas.sort(this._sortFunction);
        }
        return this._unfilteredDatas.toList(this.isVisible, this);
    },
    _buildChildren: function (children, list) {
        children.forEach(function (data) {
            list.add(data);
            this._buildChildren(data.getChildren(), list);
        }, this);
    },
    invalidateModel: function () {
        if (this._invalidateModel) {
            return;
        }
        this._invalidateModel = true;
        this.invalidate();
    },
    validateImpl: function () {
        // validate model
        if (this._invalidateModel) {
            this._invalidateModel = false;
            this._uniqueColors = {};
            this._nonDataColors = {};
            this._publishedDatas = this.createPublishedDatas();
            this._publishedDatas.forEach(function (data) {
                if (data.IStyle) {
                    if (!data.getStyle('chart.color')) {
                        data.setStyle('chart.color', _twaver.nextColor());
                    }
                } else {
                    if (!data.getClient('chart.color')) {
                        data.setClient('chart.color', _twaver.nextColor());
                    }
                }
            });
            this.validateModel();
        }
        // reset canvas
        var g = this._canvas.getContext('2d');
        this._canvasWidth = this._view.clientWidth;
        this._canvasHeight = this._view.clientHeight;
        this._canvas.setAttribute('width', this._canvasWidth);
        this._canvas.setAttribute('height', this._canvasHeight);
        g.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        // validate display
        if (this._canvasWidth > 0 && this._canvasHeight > 0) {
            g.translate(this._xTranslate, this._yTranslate);
            this._valueTexts = this._valueVisible ? new $List() : null;
            this.validateDisplay(g, this._canvasWidth * this._xZoom, this._canvasHeight * this._yZoom);
            delete this._valueTexts;
            g.translate(-this._xTranslate, -this._yTranslate);
        }
    },
    validateModel: function () {

    },
    validateDisplay: function (g, width, height) {

    },
    drawLine: function (g, color, width, x1, y1, x2, y2) {
        if (width > 0) {
            g.lineWidth = width;
            g.strokeStyle = this.getUniqueColor(color);
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
            g.stroke();
        }
    },
    // list: [{text:t, font:f, color:color, x:x, y:y} ... ]
    drawValueTexts: function (g) {
        if (this._valueTexts) {
            this._valueTexts.forEach(function (v) {
                $g.drawText(g, v.text, v, v.font, v.color);
            });
        }
    },
    drawVerticalText: function (g, text, cx, font, color) {
        color = this.getUniqueColor(color);
        g.translate(cx.x, cx.y);
        g.rotate(-Math.PI / 2);
        $g.drawText(g, text, null, font, color);
        g.rotate(Math.PI / 2);
        g.translate(-cx.x, -cx.y);
    },
    _getValueTextInfo: function (data, value) {
        if (this._valueTexts) {
            var text = this.formatValueText(value, data);
            if (text && text !== '') {
                var color = this.getValueColor(data);
                var info = {
                    text: text,
                    font: this.getValueFont(data),
                    color: this.getUniqueColor(color, data)
                };
                this._valueTexts.add(info);
                return info;
            }
        }
        return null;
    },
    // max zoom
    getMaxZoom: function () {
        return this._maxZoom;
    },
    setMaxZoom: function (value) {
        if (value < 0) {
            return;
        }
        var oldValue = this._maxZoom;
        this._maxZoom = value;
        this.firePropertyChange('maxZoom', oldValue, value);
        if (this.getXZoom() > value) {
            this.setXZoom(value, false);
        }
        if (this.getYZoom() > value) {
            this.setYZoom(value, false);
        }
    },
    // min zoom
    getMinZoom: function () {
        return this._minZoom;
    },
    setMinZoom: function (value) {
        if (value < 0) {
            return;
        }
        var oldValue = this._minZoom;
        this._minZoom = value;
        this.firePropertyChange('minZoom', oldValue, value);
        if (this.getXZoom() < value) {
            this.setXZoom(value);
        }
        if (this.getYZoom() < value) {
            this.setYZoom(value);
        }
    },
    // xy zoom
    zoomIn: function (animate) {
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateXYZoom(
                this,
                this._xZoom * $Defaults.ZOOM_INCREMENT,
                this._yZoom * $Defaults.ZOOM_INCREMENT));
        } else {
            this.xZoomIn(false);
            this.yZoomIn(false);
        }
    },
    zoomOut: function (animate) {
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateXYZoom(
                this,
                this._xZoom / $Defaults.ZOOM_INCREMENT,
                this._yZoom / $Defaults.ZOOM_INCREMENT));
        } else {
            this.xZoomOut(false);
            this.yZoomOut(false);
        }
    },
    zoomReset: function (animate) {
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateXYZoom(this, 1, 1));
        } else {
            this.xZoomReset(false);
            this.yZoomReset(false);
        }
    },
    // x zoom
    getXZoom: function () {
        return this._xZoom;
    },
    onXZoomChanged: function (oldZoom, newZoom) {
    },
    xZoomIn: function (animate) {
        this.setXZoom(this._xZoom * $Defaults.ZOOM_INCREMENT, animate);
    },
    xZoomOut: function (animate) {
        this.setXZoom(this._xZoom / $Defaults.ZOOM_INCREMENT, animate);
    },
    xZoomReset: function (animate) {
        this.setXZoom(1, animate);
    },
    setXZoom: function (value, animate) {
        if (!_twaver.num(value) || value <= 0) {
            return;
        }
        if (value < this._minZoom) {
            value = this._minZoom;
        }
        if (value > this._maxZoom) {
            value = this._maxZoom;
        }
        if (value === this.xZoom) {
            return;
        }
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateXZoom(this, value));
        } else {
            var oldZoom = this._xZoom;
            var newXTranslate = this._xTranslate - (this._canvasWidth / 2 - this._xTranslate) / oldZoom * (value - oldZoom);
            this._xZoom = value;
            this.firePropertyChange('xZoom', oldZoom, value);
            this.onXZoomChanged(oldZoom, value);
            this.setXTranslate(newXTranslate);
        }
    },
    // y zoom
    getYZoom: function () {
        return this._yZoom;
    },
    onYZoomChanged: function (oldZoom, newZoom) {
    },
    yZoomIn: function (animate) {
        this.setYZoom(this._yZoom * $Defaults.ZOOM_INCREMENT, animate);
    },
    yZoomOut: function (animate) {
        this.setYZoom(this._yZoom / $Defaults.ZOOM_INCREMENT, animate);
    },
    yZoomReset: function (animate) {
        this.setYZoom(1, animate);
    },
    setYZoom: function (value, animate) {
        if (!_twaver.num(value) || value <= 0) {
            return;
        }
        if (value < this._minZoom) {
            value = this._minZoom;
        }
        if (value > this._maxZoom) {
            value = this._maxZoom;
        }
        if (value === this.YZoom) {
            return;
        }
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateYZoom(this, value));
        } else {
            var oldZoom = this._yZoom;
            var newYTranslate = this._yTranslate - (this._canvasHeight / 2 - this._yTranslate) / oldZoom * (value - oldZoom);
            this._yZoom = value;
            this.firePropertyChange('yZoom', oldZoom, value);
            this.onYZoomChanged(oldZoom, value);
            this.setYTranslate(newYTranslate);
        }
    }
});
