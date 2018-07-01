twaver.vector.interaction.MSTouchInteraction = function (network) {
    twaver.vector.interaction.MSTouchInteraction.superClass.constructor.call(this, network);
    this._pointerMap = {};
    this._pointerIdArray = [];
};
_twaver.ext('twaver.vector.interaction.MSTouchInteraction', twaver.vector.interaction.BaseInteraction, {
    setUp: function () {
        var view = this.network.getView();
        $html.addEventListener("MSPointerDown", "handleTouchstart", view, this);
        $html.addEventListener("MSPointerMove", "handleTouchmove", view, this);
        $html.addEventListener("MSPointerUp", "handleTouchend", view, this);
        $html.addEventListener("MSPointerCancel", "handleTouchend", view, this);
        this.network.addMarker(this);
    },
    tearDown: function () {
        var view = this.network.getView();
        $html.removeEventListener("MSPointerDown", view, this);
        $html.removeEventListener("MSPointerMove", view, this);
        $html.removeEventListener("MSPointerUp", view, this);
        $html.removeEventListener("MSPointerCancel", view, this);
        this.network.removeMarker(this);
    },
    handleTouchstart: function (e) {
        if (this.network.isFocusOnClick()) {
            twaver.Util.setFocus(this.network._view);
        }

        if (this.network.isSelectingElement() && e.pointerType == e.MSPOINTER_TYPE_MOUSE) {
            return;
        }

        var currentTouchPoint = this.network.getLogicalPoint2(e);
        var currentTouchTime = new Date();


        if (e.isPrimary && this._pointerIdArray.length > 0) {
            this.handle_mouseup(e);
        }

        if (!this._pointerMap[e.pointerId]) {
            this._pointerIdArray.push(e.pointerId);
            this._pointerMap[e.pointerId] = e;
        }
        if (this._pointerIdArray.length == 1) {
            var element = this.network.getElementAt(currentTouchPoint);
            this._startTouchElement = element;
            this._startClientPoint = { x: e.clientX, y: e.clientY };

            var sm = this.network.getSelectionModel();
            if (element) {
                if (_twaver.isCtrlDown(e)) {
                    if (sm.contains(element)) {
                        sm.removeSelection(element);
                    } else {
                        sm.appendSelection(element);
                    }
                } else {
                    if (!sm.contains(element)) {
                        sm.setSelection(element);
                    }
                }
            } else {
                if (!_twaver.isCtrlDown(e)) {
                    sm.clearSelection();
                }
            }

            //this._startClientPoint = this.getMarkerPoint(e);
            $network_interaction.handleClicked(this.network, e, element); //click
            if (this._startTouchTime
                && this._startTouchPoint
                && currentTouchTime.getTime() - this._startTouchTime.getTime() <= 500
                && $math.getDistance(this._startTouchPoint, currentTouchPoint) <= 20) {
                $network_interaction.handleDoubleClicked(this.network, e, element); //double click
                this._doubleClick = true;
            } else {
                $html.handle_mousedown(this, e);
                this._startTouchPoint = currentTouchPoint;
                this._startTouchTime = currentTouchTime;
            }
        } else if (this._pointerIdArray.length == 2) {
            this._distance = this._getDistance();
            this._zoom = this.network.getZoom();
        }

    },
    handleTouchmove: function (e) {
        if (this._startTouchPoint == null || this._pointerIdArray.length == 0 || !this._pointerMap[e.pointerId] || $math.getDistance({ x: this._pointerMap[e.pointerId].pageX, y: this._pointerMap[e.pointerId].pageY }, { x: e.pageX, y: e.pageY }) <= 10) {
            return;
        }
        this._pointerMap[e.pointerId] = e;
        if (this._pointerIdArray.length == 2) {
            var scale = this._getDistance() / this._distance;
            this.network.setZoom(this._zoom * scale, false);
        }
    },
    handleTouchend: function (e) {
        if (this.network.isMovingElement()) {
            this.network.setMovingElement(false);
            this.network.fireInteractionEvent({ kind: 'liveMoveEnd', event: e });
        }
        if (this.network.isSelectingElement()) {
            var rect = $math.getRect([this._startTouchPoint, this._moveTouchPoint]);
            var elements = this.network.getElementsAtRect(rect, this.getIntersectMode(), this.network.getRectSelectFilter());
            if (elements && elements.size() > 0) {
                var sm = this.network.getSelectionModel();
                var selections = sm.toSelection();
                elements.forEach(function (element) {
                    if (sm.contains(element)) {
                        selections.remove(element);
                    } else {
                        selections.add(element);
                    }
                }, this);
                sm.setSelection(selections);
            }
            this.network.fireInteractionEvent({ kind: 'selectEnd', event: e });
            this._moveTouchPoint = null;
            this.network.setSelectingElement(false);
            this.repaint();
        }
        if (this._doubleClick) {
            delete this._doubleClick;
            delete this._startTouchPoint;
            delete this._startTouchTime;
        }
        var index = -1;
        for (var i = 0; i < this._pointerIdArray.length; i++) {
            if (this._pointerIdArray[i] == e.pointerId) {
                index = i;
                break;
            }
        }
        if (index >= 0) this._pointerIdArray.splice(index, 1);
        delete this._pointerMap[e.pointerId];
        this._moveTouchPoint = null;
    },
    _getDistance: function () {
        return $math.getDistance({ x: this._pointerMap[this._pointerIdArray[0]].pageX, y: this._pointerMap[this._pointerIdArray[0]].pageY }, { x: this._pointerMap[this._pointerIdArray[1]].pageX, y: this._pointerMap[this._pointerIdArray[1]].pageY });
    },
    getIntersectMode: function () {
        if (this.network.getSelectMode() === 'intersect') {
            return true;
        }
        if (this.network.getSelectMode() === 'contain') {
            return false;
        }
        return this._startTouchPoint.x > this._moveTouchPoint.x && this._startTouchPoint.y > this._moveTouchPoint.y;
    },
    handle_mousemove: function (e) {

        //e.buttons >= 1 &&
        var newClientPoint = { x: e.clientX, y: e.clientY };
        if ($math.getDistance(this._startClientPoint, newClientPoint) < 3) return;
        if (this._startTouchPoint && this._pointerIdArray.length == 1) {
            this._moveTouchPoint = {
                x: this._startTouchPoint.x + (newClientPoint.x - this._startClientPoint.x) / this.network.getZoom(),
                y: this._startTouchPoint.y + (newClientPoint.y - this._startClientPoint.y) / this.network.getZoom()
            };
            if (this._startTouchElement == null && this.network.isRectSelectEnabled()) {
                var point = this.network.getLogicalPoint2(e);
                if (!point) {
                    return;
                }
                //rect select
                this.network.setSelectingElement(true);
                if (this._moveTouchPoint) {
                    this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
                } else {
                    this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
                }
                //this._moveTouchPoint = point;
                this.repaint();
            } else {
                var element = this.network.getElementAt(this._moveTouchPoint);

                if (this._startTouchElement == null && !this.network.isRectSelectEnabled()) {
                    var xoffset = this._startClientPoint.x - newClientPoint.x;
                    var yoffset = this._startClientPoint.y - newClientPoint.y;
                    this.network.panByOffset(xoffset, yoffset);
                } else if (this.network.isMovingElement() || (this._startTouchElement != null && element == this._startTouchElement && this.network.getMovableSelectedElements().contains(element))) {
                    var xoffset = this._moveTouchPoint.x - this._startTouchPoint.x;
                    var yoffset = this._moveTouchPoint.y - this._startTouchPoint.y;
                    this.network.moveSelectedElements(xoffset, yoffset);
                    if (this.network.isMovingElement()) {
                        this.network.fireInteractionEvent({ kind: 'liveMoveBetween', event: e });
                    } else {
                        this.network.setMovingElement(true);
                        this.network.fireInteractionEvent({ kind: 'liveMoveStart', event: e });
                    }
                }
                this._startClientPoint = newClientPoint;
            }
        }
    },
    handle_mouseup: function (e) {
        this.handleTouchend(e);
        this._pointerIdArray = [];
        this._pointerMap = {};
    },
    paint: function (ctx) {
        if (!this._startTouchPoint || !this._moveTouchPoint || this._startTouchElement || !this.network.isRectSelectEnabled()) {
            return;
        }
        var sp = this.convertPointFromView(this._startTouchPoint);
        var ep = this.convertPointFromView(this._moveTouchPoint);
        var sx = sp.x;
        var sy = sp.y;
        var ex = ep.x;
        var ey = ep.y;
        var rect = $math.getRect([{ x: sx, y: sy }, { x: ex, y: ey}]);
        if (rect != null) {
            ctx.beginPath();
            var lineWidth = this.network.getSelectOutlineWidth();
            var fillStyle = this.getIntersectMode() ? this.network.getSelectFillColor() : null;
            ctx.strokeStyle = this.network.getSelectOutlineColor();
            ctx.lineWidth = lineWidth;
            $CanvasUtil.rect(ctx, rect.x, rect.y, rect.width, rect.height, fillStyle, this.network.getSelectOutlineColor());
            ctx.closePath();
        }
    }
});