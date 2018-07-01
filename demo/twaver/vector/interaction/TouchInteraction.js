twaver.vector.interaction.TouchInteraction = function (network) {
    twaver.vector.interaction.TouchInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.vector.interaction.TouchInteraction', twaver.vector.interaction.BaseInteraction, {
    setUp: function () {
        var view = this.network.getView();
        $html.addEventListener('touchstart', 'handleTouchstart', view, this);
        $html.addEventListener('touchmove', 'handleTouchmove', view, this);
        $html.addEventListener('touchend', 'handleTouchend', view, this);
        $html.addEventListener('touchcancel', 'handleTouchend', view, this);
    },
    tearDown: function () {
        var view = this.network.getView();
        $html.removeEventListener('touchstart', view, this);
        $html.removeEventListener('touchmove', view, this);
        $html.removeEventListener('touchend', view, this);
        $html.removeEventListener('touchcancel', view, this);
    },
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (e.touches.length == 1) {
            var point = this.network.getLogicalPoint2(e);
            var element = this._element = this.network.getElementAt(point);
            this._startTouchTime = new Date();
            this._currentTouchPoint = point;
            this._startTouchClient = this._currentTouchClient = this.getMarkerPoint(e);

            if (element) {
                if (!this.network.getSelectionModel().contains(element)) {
                    this.network.getSelectionModel().setSelection(element);
                }
            } else {
                this.network.getSelectionModel().clearSelection();
            }

            $network_interaction.handleClicked(this.network, e, element);

            if (this._endTouchTime
                    && (this._startTouchTime.getTime() - this._endTouchTime.getTime()) <= 500
                    && $math.getDistance(this._endTouchClient, this._startTouchClient) <= 20) {
                delete this._endTouchTime;
                delete this._endTouchClient;
                $network_interaction.handleDoubleClicked(this.network, e, element);
            } else {
                this._endTouchTime = this._startTouchTime;
                this._endTouchClient = this._startTouchClient;
            }
        } else {
            this._distance = $touch.getDistance(e);
            this._zoom = this.network.getZoom();
        }
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (e.touches.length > 1) {
            var newDistance = $touch.getDistance(e);
            if (Math.abs(newDistance - this._distance) < 20) {
                return;
            }
            var scale = newDistance / this._distance;
            this.network.setZoom(this._zoom * scale, false);
        } else if (this._zoom == null) {
            var newClientPoint = this.getMarkerPoint(e);
            if ($math.getDistance(this._startTouchClient, newClientPoint) < 20) {
                return;
            }
            if (this._element) {
                var newPoint = this.network.getLogicalPoint2(e);
                //drag element
                var xoffset = newPoint.x - this._currentTouchPoint.x;
                var yoffset = newPoint.y - this._currentTouchPoint.y;
                this._currentTouchPoint = newPoint;
                this.network.moveSelectedElements(xoffset, yoffset);
                if (this.network.isMovingElement()) {
                    this.network.fireInteractionEvent({ kind: 'liveMoveBetween', event: e });
                } else {
                    this.network.setMovingElement(true);
                    this.network.fireInteractionEvent({ kind: 'liveMoveStart', event: e });
                }
            } else {
                //pan
                var xoffset = this._currentTouchClient.x - newClientPoint.x;
                var yoffset = this._currentTouchClient.y - newClientPoint.y;
                this.network.panByOffset(xoffset, yoffset);
                this._currentTouchClient = newClientPoint;
            }
        }
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        if (this.network.isMovingElement()) {
            this.network.setMovingElement(false);
            this.network.fireInteractionEvent({ kind: 'liveMoveEnd', event: e });
        }
        if (e.touches.length === 0) {
            this._distance = null;
            this._zoom = null;
            this._element = null;
            this._startTouchTime = null;
            this._currentTouchPoint = null;
            this._startTouchClient = this._currentTouchClient = null;
        }
    }
});