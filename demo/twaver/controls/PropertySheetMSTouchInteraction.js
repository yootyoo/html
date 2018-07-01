twaver.controls.PropertySheetMSTouchInteraction = function (propertySheet) {
    this.sheet = propertySheet;
    this.view = propertySheet._view;
    this.resizeDiv = propertySheet._resizeDiv;

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
    this.superHandleMouseDown = twaver.controls.PropertySheetMSTouchInteraction.superClass.handleMouseDown;
};
_twaver.ext('twaver.controls.PropertySheetMSTouchInteraction', twaver.controls.PropertySheetInteraction, {
    handleMouseDown: function (e) {},
    handleTouchstart: function (e) {
        if (e.isPrimary && this._pointerIdArray.length > 0) {
            this._pointerMap = {};
            this._pointerIdArray = [];
        }

        if (!this._pointerMap[e.pointerId] && this.sheet.getLogicalPoint(e) != null) {
            this._pointerIdArray.push(e.pointerId);
            this._pointerMap[e.pointerId] = e;
        }

        if (this._pointerIdArray.length == 1 && e.pointerType == e.MSPOINTER_TYPE_MOUSE) {
            this.superHandleMouseDown(e);
        }

        if (this._pointerIdArray.length == 1) {
            this._startTouchPoint = this.sheet.getLogicalPoint(e);
            this._startTouchTime = new Date();
        }
        else if (this._pointerIdArray.length == 2) {
            this._distance = this._getDistance();
            this._zoom = this.sheet.getZoom();
        }
    },
    handleTouchmove: function (e) {
        if (this._pointerIdArray.length == 0 || !this._pointerMap[e.pointerId] || $math.getDistance({ x: this._pointerMap[e.pointerId].pageX, y: this._pointerMap[e.pointerId].pageY }, { x: e.pageX, y: e.pageY }) <= 10) {
            return;
        }
        this._pointerMap[e.pointerId] = e;
        if (this._pointerIdArray.length == 2) {
            var scale = this._getDistance() / this._distance;
            this.sheet.setZoom(this._zoom * scale, false);
        } else if (this._pointerIdArray.length == 1 && e.pointerType != e.MSPOINTER_TYPE_MOUSE) {
            if (this._startTouchPoint) {
                var newPoint = this.sheet.getLogicalPoint(e);
                if (newPoint == null) {
                    return
                };
                var xoffset = this._startTouchPoint.x - newPoint.x;
                var yoffset = this._startTouchPoint.y - newPoint.y;
                var result = this.sheet.panByOffset(xoffset, yoffset);
                this._startTouchPoint.x -= (xoffset - result.x);
                this._startTouchPoint.y -= (yoffset - result.y);
            }
        }
    },
    handleTouchend: function (e) {
        if (this._pointerIdArray.length == 1 && e.pointerType != e.MSPOINTER_TYPE_MOUSE) {
            var currentTouchPoint = this.sheet.getLogicalPoint(e);
            var currentTouchTime = new Date();
            if (currentTouchTime.getTime() - this._startTouchTime.getTime() <= 500
                && $math.getDistance(this._startTouchPoint, currentTouchPoint) <= 20) {
                this.superHandleMouseDown(e);
            }
        }
        this._pointerMap = {};
        this._pointerIdArray = [];
    },
    _getDistance: function () {
        return $math.getDistance({ x: this._pointerMap[this._pointerIdArray[0]].pageX, y: this._pointerMap[this._pointerIdArray[0]].pageY }, { x: this._pointerMap[this._pointerIdArray[1]].pageX, y: this._pointerMap[this._pointerIdArray[1]].pageY });
    }
});
