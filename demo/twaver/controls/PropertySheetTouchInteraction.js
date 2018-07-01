twaver.controls.PropertySheetTouchInteraction = function (propertySheet) {
    this.sheet = propertySheet;
    this.view = propertySheet._view;
    this.resizeDiv = propertySheet._resizeDiv;

    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.controls.PropertySheetTouchInteraction', Object, {
    minGap: 10,
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (e.target === this.sheet._currentEditor || e.target.parentNode === this.sheet._currentEditor) {
            return;
        }
        if (this.sheet.isFocusOnClick()) {
            twaver.Util.setFocus(this.view);
        }
        if (this.sheet._isValidating) {
            return;
        }
        if (e.target === this.resizeDiv) {
            this.lastX = this.getX(e);
        }
        this.lastPoint = this.sheet.getLogicalPoint(e);
        if ($touch.isMultiTouch(e)) {
            this.distance = $touch.getDistance(e);
            this.zoom = this.sheet.getZoom();
        }
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (!this.moved) {
            this.moved = true;
        }
        if (this.lastX == null) {
            if ($touch.isSingleTouch(e)) {
                if (this.lastPoint) {
                    var newPoint = this.sheet.getLogicalPoint(e);
                    var xoffset = this.lastPoint.x - newPoint.x;
                    var yoffset = this.lastPoint.y - newPoint.y;
                    var result = this.sheet.panByOffset(xoffset, yoffset);
                    this.lastPoint.x -= (xoffset - result.x);
                    this.lastPoint.y -= (yoffset - result.y);
                }
            } else {
                if (this.distance) {
                    var scale = $touch.getDistance(e) / this.distance;
                    this.sheet.setZoom(this.zoom * scale, false);
                }
            }
            return;
        }
        var x = this.getX(e);
        if (this.stopLeft != null) {
            if (x < this.stopLeft) {
                return;
            } else {
                delete this.stopLeft;
            }
        }
        if (this.stopRight != null) {
            if (x > this.stopRight) {
                return;
            } else {
                delete this.stopRight;
            }
        }
        var w = this.sheet.getPropertyNameWidth() + (x - this.lastX);
        if (w < this.minGap) {
            w = this.minGap;
            this.stopLeft = x;
        }
        else if (w > this.sheet.getSumWidth() - this.minGap) {
            w = this.sheet.getSumWidth() - this.minGap;
            this.stopRight = x;
        }
        this.sheet.setPropertyNameWidth(w);
        this.lastX = x;
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        if (!this.moved) {
            if (e.target._expandData) {
                var name = e.target._expandData;
                if (this.sheet.isExpanded(name)) {
                    this.sheet.collapse(name);
                } else {
                    this.sheet.expand(name);
                }
            }
            else if (e.target === this.resizeDiv) {
            }
            else {
                var newIndex = this.sheet.getRowIndexAt(e);
                this.sheet.updateCurrentRowIndex(newIndex);
            }
        }
        delete this.stopLeft;
        delete this.stopRight;
        delete this.lastX;
        delete this.lastPoint;
        delete this.distance;
        delete this.zoom;
        delete this.moved;
        $html.removeEventListener('touchmove', this.view, this);
        $html.removeEventListener('touchend', this.view, this);
    },
    getX: function (e) {
        var touch = e.changedTouches[0];
        return touch.clientX;
    }
});
