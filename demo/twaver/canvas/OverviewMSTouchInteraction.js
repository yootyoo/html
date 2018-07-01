twaver.canvas.OverviewMSTouchInteraction = function (overview) {
    this.overview = overview;
    this.network = overview.getNetwork();
    this.view = overview._view;

    this._pointerMap = {};
    this._pointerIdArray = [];
    var self = this;
    this.view.addEventListener('MSPointerDown', function (e) {
        self.handleTouchstart(e);
    }, false);
    this.view.addEventListener('MSPointerMove', function (e) {
        self.handleTouchmove(e);
    }, false);
    this.view.addEventListener('MSPointerUp', function (e) {
        self.handleTouchend(e);
    }, false);
    this.view.addEventListener('MSPointerCancel', function (e) {
        self.handleTouchend(e);
    }, false);
};
_twaver.ext('twaver.canvas.OverviewMSTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);

        if (e.isPrimary && this._pointerIdArray.length > 0) {
            this._pointerMap = {};
            this._pointerIdArray = [];
        }
        if (!this._pointerMap[e.pointerId] && this.overview.getLogicalPoint(e)) {
            this._pointerIdArray.push(e.pointerId);
            this._pointerMap[e.pointerId] = e;
        }

        if (this._pointerIdArray.length == 1) {
            this._startTouchPoint = this.overview.getLogicalPoint(e);
            this._startTouchTime = new Date();
        }
        else if (this._pointerIdArray.length == 2) {
            this._distance = this._getDistance();
            this._zoom = this.network.getZoom();
        }
    },
    handleTouchmove: function (e) {
        if (this._pointerIdArray.length == 0 || !this._pointerMap[e.pointerId] || $math.getDistance({ x: this._pointerMap[e.pointerId].pageX, y: this._pointerMap[e.pointerId].pageY }, { x: e.pageX, y: e.pageY }) <= 10) {
            return;
        }
        this._pointerMap[e.pointerId] = e;

        if (this._pointerIdArray.length == 2) {
            var scale = this._getDistance() / this._distance;
            this.network.setZoom(this._zoom * scale, false);
        } else if (this._pointerIdArray.length == 1) {
            if (this._startTouchPoint) {
                var newPoint = this.overview.getLogicalPoint(e);
                if (newPoint == null) {
                    return
                };
                this._startTouchPoint = newPoint;
                this.overview.centerNetwork(this._startTouchPoint, false);
            }
        }
    },
    handleTouchend: function (e) {
        var newEndTouchPoint = this.overview.getLogicalPoint(e);
        if (this._pointerIdArray.length == 1 && newEndTouchPoint) {
            var isDoubleTouch = this._endTouchPoint && this._endTouchTime
                && (new Date().getTime() - this._endTouchTime.getTime() <= 500)
                && $math.getDistance(this._endTouchPoint , newEndTouchPoint) <= 10;
            if (isDoubleTouch) {
                this._endTouchPoint = null;
                this._endTouchTime = null;
            } else {
                this._endTouchPoint = newEndTouchPoint;
                this._endTouchTime = new Date();
            }
            if (isDoubleTouch) {
                _twaver.callLater(this.network.zoomReset, this.network, [this.overview._animate]);
            } else {
                this.overview.centerNetwork(this._endTouchPoint, this.overview._animate);
            }
        }

        this._pointerMap = {};
        this._pointerIdArray = [];
    },
    _getDistance: function () {
        return $math.getDistance({ x: this._pointerMap[this._pointerIdArray[0]].pageX, y: this._pointerMap[this._pointerIdArray[0]].pageY }, { x: this._pointerMap[this._pointerIdArray[1]].pageX, y: this._pointerMap[this._pointerIdArray[1]].pageY });
    }
});
