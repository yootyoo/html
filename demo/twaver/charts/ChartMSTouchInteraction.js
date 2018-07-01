twaver.charts.ChartMSTouchInteraction = function (chart) {
    this.chart = chart;
    this.canvas = chart._canvas;

    this._pointerMap = {};
    this._pointerIdArray = [];
    var self = this;
    this.canvas.addEventListener('MSPointerDown', function (e) {
        self.handleTouchstart(e);
    }, false);
    this.canvas.addEventListener('MSPointerMove', function (e) {
        self.handleTouchmove(e);
    }, false);
    this.canvas.addEventListener('MSPointerUp', function (e) {
        self.handleTouchend(e);
    }, false);
    this.canvas.addEventListener('MSPointerCancel', function (e) {
        self.handleTouchend(e);
    }, false);

    var wheel = $ua.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
    this.canvas.addEventListener(wheel, function (e) {
        self.handleMouseWheel(e);
    }, false);
};
_twaver.ext('twaver.charts.ChartMSTouchInteraction', Object, {
    handleTouchstart: function (e) {
        if (this.chart.isFocusOnClick()) {
            twaver.Util.setFocus(this.canvas);
        }

        var newPoint = this.chart.getLogicalPoint(e);
        if (e.isPrimary && this._pointerIdArray.length > 0) {
            this._pointerMap = {};
            this._pointerIdArray = [];
        }
        if (!this._pointerMap[e.pointerId] && newPoint) {
            this._pointerIdArray.push(e.pointerId);
            this._pointerMap[e.pointerId] = e;
        }

        var data = this.chart.tryGetDataAt(e);
        if (this._pointerIdArray.length == 1 && newPoint) {
            var isDoubleTouch = this._startTouchPoint && this._startTouchTime
                && (new Date().getTime() - this._startTouchTime.getTime() <= 500)
                && $math.getDistance(this._startTouchPoint, newPoint) <= 10;

            if (isDoubleTouch && data == null) {
                if (this.chart.isDoubleClickToReset()) {
                    this.chart.zoomReset(false);
                    this.chart.setXTranslate(0);
                    this.chart.setYTranslate(0);
                    this._startTouchPoint = null;
                    this._startTouchTime = null;
                    this._startClientPoint = null;
                }
            } else {
                this._startTouchPoint = newPoint;
                this._startTouchTime = new Date();
                this._startClientPoint = { x: e.clientX, y: e.clientY }
                $html.handle_mousedown(this, e);
            }
        } else if (this._pointerIdArray.length == 2) {
            this.xZoom = this.chart.getXZoom();
            this.yZoom = this.chart.getYZoom();
            this._distance = this._getDistance();
        }
    },
    handleTouchmove: function (e) {
        if (this._pointerIdArray.length == 0 || !this._pointerMap[e.pointerId] || $math.getDistance({ x: this._pointerMap[e.pointerId].pageX, y: this._pointerMap[e.pointerId].pageY }, { x: e.pageX, y: e.pageY }) <= 3) {
            return;
        }
        this._pointerMap[e.pointerId] = e;
        if (this._pointerIdArray.length == 2) {
            var scale = this._getDistance() / this._distance;
            var newXZoom = this.xZoom * scale;
            var newYZoom = this.yZoom * scale;
            if (this.chart.isXZoomEnabled()) {
                this.chart.setXZoom(newXZoom, false);
            }
            if (this.chart.isYZoomEnabled()) {
                this.chart.setYZoom(newYZoom, false);
            }
        }
    },
    handleTouchend: function (e) {
        var newEndTouchPoint = this.chart.getLogicalPoint(e);
        if (this._pointerIdArray.length == 1 && newEndTouchPoint && !this.moved) {
            var data = this.chart.tryGetDataAt(e);
            var isSingleTouch = this._startTouchPoint && this._startTouchTime
                && (new Date().getTime() - this._startTouchTime.getTime() <= 500)
                && $math.getDistance(this._startTouchPoint, newEndTouchPoint) <= 10;

            var sm = this.chart.getSelectionModel();
            if (data && isSingleTouch) {
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
        this.moved = false;
        this._pointerMap = {};
        this._pointerIdArray = [];
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
    },
    handle_mousemove: function (e) {
        if (this._pointerIdArray.length == 1 && this._startTouchPoint && this._startClientPoint) {
            var newPoint = {
                x: this._startTouchPoint.x + (e.clientX - this._startClientPoint.x) / this.chart.getXZoom(),
                y: this._startTouchPoint.y + (e.clientY - this._startClientPoint.y) / this.chart.getYZoom()
            }
            if ($math.getDistance(this._startTouchPoint, newPoint) > 3) {
                this.moved = true;
                if (this.chart.isXTranslateEnabled()) {
                    this.chart.setXTranslate(this.chart.getXTranslate() + newPoint.x - this._startTouchPoint.x);
                }
                if (this.chart.isYTranslateEnabled()) {
                    this.chart.setYTranslate(this.chart.getYTranslate() + newPoint.y - this._startTouchPoint.y);
                }
                this._startClientPoint.x = e.clientX;
                this._startClientPoint.y = e.clientY;
            }
        }
    },
    handle_mouseup: function (e) {
        this.handleTouchend(e);
    },
    _getDistance: function () {
        return $math.getDistance({ x: this._pointerMap[this._pointerIdArray[0]].pageX, y: this._pointerMap[this._pointerIdArray[0]].pageY }, { x: this._pointerMap[this._pointerIdArray[1]].pageX, y: this._pointerMap[this._pointerIdArray[1]].pageY });
    }
});
