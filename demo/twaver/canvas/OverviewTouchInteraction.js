twaver.canvas.OverviewTouchInteraction = function (overview) {
    this.overview = overview;
    this.network = overview.getNetwork();
    this.view = overview._view;
    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.canvas.OverviewTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        this.clear();
        this.endPoint = this.overview.getLogicalPoint(e);
        if ($touch.isMultiTouch(e)) {
            this.distance = $touch.getDistance(e);
            this.zoom = this.network.getZoom();
        }
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
    },
    handleTouchmove: function (e) {
        if (!this.moved) {
            this.moved = true;
        }
        this.endPoint = this.overview.getLogicalPoint(e);
        if ($touch.isSingleTouch(e)) {
            this.overview.centerNetwork(this.endPoint, false);
        } else {
            if (this.distance) {
                var scale = $touch.getDistance(e) / this.distance;
                this.network.setZoom(this.zoom * scale, false);
            }
        }
    },
    handleTouchend: function (e) {
        if (!this.moved) {
            this.endPoint = this.overview.getLogicalPoint(e);
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
            if (isDoubleTouch) {
                _twaver.callLater(this.network.zoomReset, this.network, [this.overview._animate]);
            } else {
                this.overview.centerNetwork(this.endPoint, this.overview._animate);
            }
        }
        this.clear();
        
    },
    clear: function () {
        if (this.endPoint) {
            this.endPoint = null;
            $html.removeEventListener('touchmove', this.view, this);
            $html.removeEventListener('touchend', this.view, this);
        }
        this.moved = false;
    }
});
