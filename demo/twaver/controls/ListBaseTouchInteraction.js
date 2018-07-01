twaver.controls.ListBaseTouchInteraction = function (listBase) {
    this.listBase = listBase;
    this.view = listBase._view;

    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.controls.ListBaseTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        this.startPoint = this.lastPoint = this.listBase.getLogicalPoint(e);
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
        if ($touch.isMultiTouch(e)) {
            this.distance = $touch.getDistance(e);
            this.zoom = this.listBase._zoom;
        }
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        var newPoint = this.listBase.getLogicalPoint(e);
        if ($math.getDistance(this.startPoint, newPoint) < 20) {
            return;
        }
        if (!this.moved) {
            this.moved = true;
        }
        if ($touch.isSingleTouch(e)) {
            if (this.lastPoint) {
                var xoffset = this.lastPoint.x - newPoint.x;
                var yoffset = this.lastPoint.y - newPoint.y;
                var result = this.listBase.panByOffset(xoffset, yoffset);
                this.listBase.invalidate();
                this.lastPoint.x -= (xoffset - result.x);
                this.lastPoint.y -= (yoffset - result.y);
            }
        } else {
            if (this.distance) {
                var scale = $touch.getDistance(e) / this.distance;
                this.listBase.setZoom(this.zoom * scale, false);
            }
        }
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        if (!this.moved && e.target !== this.listBase._currentEditor && e.target.parentNode !== this.listBase._currentEditor) {
            this.listBase._handleClick(e);
        }
        delete this.startPoint;
        delete this.lastPoint;
        delete this.moved;
        delete this.distance;
        delete this.zoom;
        $html.removeEventListener('touchmove', this.view, this);
        $html.removeEventListener('touchend', this.view, this);
    }
});
