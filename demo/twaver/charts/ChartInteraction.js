twaver.charts.ChartInteraction = function (chart) {
    this.chart = chart;
    this.canvas = chart._canvas;

    var self = this;
    this.canvas.addEventListener('mousedown', function (e) {
        if (e.button === 0) {
            self.handleMouseDown(e);
        }
        e.preventDefault();
    }, false);
    var wheel = $ua.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
    this.canvas.addEventListener(wheel, function (e) {
        self.handleMouseWheel(e);
    }, false);
};
_twaver.ext('twaver.charts.ChartInteraction', Object, {
    handleMouseDown: function (e) {
        if (this.chart.isFocusOnClick()) {
            twaver.Util.setFocus(this.canvas);
        }
        this.lastPoint = this.chart.getLogicalPoint(e);
        var data = this.chart.tryGetDataAt(e);
        if (e.detail === 2 && data == null) {
            if (this.chart.isDoubleClickToReset()) {
                this.chart.zoomReset(false);
                this.chart.setXTranslate(0);
                this.chart.setYTranslate(0);
            }
        } else {
            this._startLogical = this.lastPoint;
            this._startClient = $html.getClientPoint(e);
            $html.handle_mousedown(this, e);
        }
    },
    handleMouseMove: function (e) {
        if (this.lastPoint) {
            var point = {
                x: this._startLogical.x + e.clientX - this._startClient.x,
                y: this._startLogical.y + e.clientY - this._startClient.y
            };
            if (!this.startPan && $math.getDistance(this.lastPoint, point) > 3) {
                this.startPan = true;
                this.lastPoint = point;
            }
            if (this.startPan) {
                if (this.chart.isXTranslateEnabled()) {
                    this.chart.setXTranslate(this.chart.getXTranslate() + point.x - this.lastPoint.x);
                }
                if (this.chart.isYTranslateEnabled()) {
                    this.chart.setYTranslate(this.chart.getYTranslate() + point.y - this.lastPoint.y);
                }
                this.lastPoint = point;
            }
        }
    },
    handleMouseUp: function (e) {
        if (!this.startPan && e.detail === 1) {
            var data = this.chart.tryGetDataAt(e);
            var sm = this.chart.getSelectionModel();
            if (data) {
                if (_twaver.isCtrlDown(e)) {
                    if (sm.contains(data)) {
                        sm.removeSelection(data);
                    } else {
                        sm.appendSelection(data);
                    }
                } else {
                    if (!sm.contains(data)) {
                        sm.setSelection(data);
                    }
                }
            } else {
                if (!_twaver.isCtrlDown(e)) {
                    sm.clearSelection();
                }
            }
        }
        delete this.lastPoint;
        delete this.startPan;
        delete this._startClient;
        delete this._startLogical;
    },
    handleMouseWheel: function (e) {
        $html.preventDefault(e);
        var delta = $ua.isFirefox ? -e.detail : e.wheelDelta;
        if (delta > 0) {
            if (this.chart.isXZoomEnabled()) {
                this.chart.setXZoom(this.chart.getXZoom() * 1.1, false);
            }
            if (this.chart.isYZoomEnabled()) {
                this.chart.setYZoom(this.chart.getYZoom() * 1.1, false);
            }
        } else if (delta < 0) {
            if (this.chart.isXZoomEnabled()) {
                this.chart.setXZoom(this.chart.getXZoom() / 1.1, false);
            }
            if (this.chart.isYZoomEnabled()) {
                this.chart.setYZoom(this.chart.getYZoom() / 1.1, false);
            }
        }
    }
});
