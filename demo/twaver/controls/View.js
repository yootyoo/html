twaver.controls.View = function () {
    twaver.controls.View.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.controls.View', twaver.controls.ViewBase, {
    _zoom: 1,
    _maxZoom: $Defaults.ZOOM_MAX,
    _minZoom: $Defaults.ZOOM_MIN,
    getRootDiv: function () {
        return this._rootDiv;
    },
    isValidEvent: function (e) {
        return $html.isValidEvent(this._view, e);
    },
    getAlarmFillColor: function (data) {
        if (data.IElement) {
            var severity = data.getAlarmState().getHighestNewAlarmSeverity();
            if (severity) {
                return severity.color;
            }
        }
        return null;
    },
    getInnerColor: function (data) {
        if (data.IElement) {
            var severity = data.getAlarmState().getHighestNativeAlarmSeverity();
            if (severity) {
                return severity.color;
            }
            return data.getStyle('inner.color');
        }
        return null;
    },
    getOuterColor: function (data) {
        if (data.IElement) {
            var severity = data.getAlarmState().getPropagateSeverity();
            if (severity) {
                return severity.color;
            }
            return data.getStyle('outer.color');
        }
        return null;
    },
    zoomOverview: function (animate) {
        var value = Math.min(this._view.clientWidth / this._viewRect.width, this._view.clientHeight / this._viewRect.height);
        this.setZoom(value, animate);
    },
    getLogicalPoint: function (e) {
        return $html.getLogicalPoint(this._view, e, this.getZoom(), this._rootDiv);
    },
    centerByLogicalPoint: function (x, y, animate) {
        if (animate) {
            twaver.animate.AnimateManager.endAnimate();
        }
        var scrollableWidth = this._view.scrollWidth - this._view.clientWidth;
        var scrollableHeight = this._view.scrollHeight - this._view.clientHeight;
        var horizontalOffset = (x - this._view.clientWidth / this._zoom / 2) * this._zoom;
        var verticalOffset = (y - this._view.clientHeight / this._zoom / 2) * this._zoom;
        if (horizontalOffset < 0) {
            horizontalOffset = 0;
        }
        if (verticalOffset < 0) {
            verticalOffset = 0;
        }
        if (horizontalOffset > scrollableWidth) {
            horizontalOffset = scrollableWidth;
        }
        if (verticalOffset > scrollableHeight) {
            verticalOffset = scrollableHeight;
        }

        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateScrollPosition(this._view, horizontalOffset, verticalOffset));
        }
        else {
            this._view.scrollLeft = horizontalOffset;
            this._view.scrollTop = verticalOffset;
        }
    },
    panByOffset: function (xoffset, yoffset) {
        xoffset *= this.getZoom();
        yoffset *= this.getZoom();
        var newHorizontalOffset = this._view.scrollLeft + xoffset;
        var newVerticalOffset = this._view.scrollTop + yoffset;
        var scrollableWidth = this._view.scrollWidth - this._view.clientWidth;
        var scrollableHeight = this._view.scrollHeight - this._view.clientHeight;
        if (newHorizontalOffset < 0) {
            newHorizontalOffset = 0;
        }
        if (newHorizontalOffset > scrollableWidth) {
            newHorizontalOffset = scrollableWidth;
        }
        if (newVerticalOffset < 0) {
            newVerticalOffset = 0;
        }
        if (newVerticalOffset > scrollableHeight) {
            newVerticalOffset = scrollableHeight;
        }

        var result = {
            x: (newHorizontalOffset - this._view.scrollLeft) / this.getZoom(),
            y: (newVerticalOffset - this._view.scrollTop) / this.getZoom()
        };
        this._view.scrollLeft = newHorizontalOffset;
        this._view.scrollTop = newVerticalOffset;

        return result;
    },
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
        if (this.getZoom() > value) {
            this.setZoom(value);
        }
    },
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
        if (this.getZoom() < value) {
            this.setZoom(value, false);
        }
    },
    getZoom: function () {
        return this._zoom;
    },
    onZoomChanged: function (oldZoom, newZoom) {
    },
    zoomIn: function (animate) {
        this.setZoom(this._zoom * $Defaults.ZOOM_INCREMENT, animate);
    },
    zoomOut: function (animate) {
        this.setZoom(this._zoom / $Defaults.ZOOM_INCREMENT, animate);
    },
    zoomReset: function (animate) {
        this.setZoom(1, animate);
    },
    
    checkZoom : function(value){
    	if (value < this._minZoom) {
            value = this._minZoom;
        }
        if (value > this._maxZoom) {
            value = this._maxZoom;
        }
        return value;
    },
    
    setZoom: function (value, animate) {
        if (!_twaver.num(value) || value <= 0) {
            return;
        }
        value = this.checkZoom(value);
        if (value === this._zoom) {
            return;
        }
        if (animate == null) {
            animate = $Defaults.ZOOM_ANIMATE;
        }
        if (animate) {
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateZoom(this, value));
        } else {
            var oldCenterX = (this._view.scrollLeft + this._view.clientWidth / 2) / this._zoom;
            var oldCenterY = (this._view.scrollTop + this._view.clientHeight / 2) / this._zoom;
            var oldZoom = this._zoom;
            this._zoom = value;
            $html.setZoom(this._rootDiv, value);
            this.firePropertyChange('zoom', oldZoom, value);
            this.onZoomChanged(oldZoom, value);
            this.centerByLogicalPoint(oldCenterX, oldCenterY, false);
        }
    },
    //setTouchZoom
    setTouchZoom: function(z){
        this.setZoom(z, false);
    }
});
