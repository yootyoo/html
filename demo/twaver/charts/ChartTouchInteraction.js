twaver.charts.ChartTouchInteraction = function (chart) {
    this.chart = chart;
    this.canvas = chart._canvas;

    $html.addEventListener('touchstart', 'handleTouchstart', this.canvas, this);
};
_twaver.ext('twaver.charts.ChartTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (this.chart.isFocusOnClick()) {
            twaver.Util.setFocus(this.canvas);
        }
        this.endPoint = this.chart.getLogicalPoint(e);
        if ($touch.isMultiTouch(e)) {
            this.distance = $touch.getDistance(e);
            this.xZoom = this.chart.getXZoom();
            this.yZoom = this.chart.getYZoom();
        }
        $html.addEventListener('touchmove', 'handleTouchmove', this.canvas, this);
        $html.addEventListener('touchend', 'handleTouchend', this.canvas, this);
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (!this.endPoint) {
            return;
        }
        var point = this.chart.getLogicalPoint(e);
        if (!this.moved && $math.getDistance(this.endPoint, point) > 10) {
            this.moved = true;
            this.lastPoint = point;
        }
        if (!this.moved) {
            return;
        }
        if ($touch.isSingleTouch(e)) {
            if (this.endPoint) {
                if (this.chart.isXTranslateEnabled()) {
                    this.chart.setXTranslate(this.chart.getXTranslate() + point.x - this.endPoint.x);
                }
                if (this.chart.isYTranslateEnabled()) {
                    this.chart.setYTranslate(this.chart.getYTranslate() + point.y - this.endPoint.y);
                }
                this.endPoint = point;
            }
        } else {
            if (this.distance) {
                var scale = $touch.getDistance(e) / this.distance;
                var newXZoom = this.xZoom * scale;
                var newYZoom = this.yZoom * scale;
                if (this.chart.isXZoomEnabled()) {
                    this.chart.setXZoom(newXZoom, false);
                }
                if (this.chart.isYZoomEnabled()) {
                    this.chart.setYZoom(newYZoom, false);
                }
            }
        }
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        if (!this.moved) {
            this.endPoint = this.chart.getLogicalPoint(e);
            var isDoubleTouch = this.lastPoint && this.lastTouchStartTime
                && (new Date().getTime() - this.lastTouchStartTime.getTime() <= 300)
                && (Math.abs(this.endPoint.x - this.lastPoint.x) <= 10)
                && (Math.abs(this.endPoint.y - this.lastPoint.y) <= 10);
            if (isDoubleTouch) {
                this.lastPoint = null;
                this.lastTouchStartTime = null;
            } else {
                this.lastPoint = this.endPoint;
                this.lastTouchStartTime = new Date();
            }
            var data = this.chart.tryGetDataAt(e);
            if (isDoubleTouch && data == null) {
                if (this.chart.isDoubleClickToReset()) {
                    this.chart.zoomReset(false);
                    this.chart.setXTranslate(0);
                    this.chart.setYTranslate(0);
                }
            } else {
                var sm = this.chart.getSelectionModel();
                if (data) {
                    if (!sm.contains(data)) {
                        sm.setSelection(data);
                    }
                } else {
                    sm.clearSelection();
                }
            }
        }
        delete this.endPoint;
        delete this.distance;
        delete this.xZoom;
        delete this.yZoom;
        delete this.moved;
        $html.removeEventListener('touchmove', this.canvas, this);
        $html.removeEventListener('touchend', this.canvas, this);
    }
});
