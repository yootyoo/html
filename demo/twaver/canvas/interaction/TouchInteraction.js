twaver.canvas.interaction.TouchInteraction = function (network) {
    twaver.canvas.interaction.TouchInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.TouchInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        var view = this.network.getView();
        $html.addEventListener('touchstart', 'handleTouchstart', view, this);
        $html.addEventListener('touchmove', 'handleTouchmove', view, this);
        $html.addEventListener('touchend', 'handleTouchend', view, this);
        $html.addEventListener('touchcancel', 'handleTouchend', view, this);
        this.network.addMarker(this);
    },
    tearDown: function () {
        var view = this.network.getView();
        $html.removeEventListener('touchstart', this.network.getView(), this);
        $html.removeEventListener('touchmove', view, this);
        $html.removeEventListener('touchend', view, this);
        $html.removeEventListener('touchcancel', view, this);
        this.network.removeMarker(this);
    },
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (e.touches && e.touches.length == 1) {
            var point = this.network.getLogicalPoint(e);
            var element = this.network.getElementAt(point);
            this._startTouchTime = new Date();
            this._startTouchPoint = point;
            this._startTouchClient = this.getMarkerPoint(e);
            if (element) {
                this._haveElementUnderTouch = true;
                this._startTouchElement = element;
            } else {
                this._haveElementUnderTouch = false;
                this._startTouchElement = null;
            }
            this.timer = setTimeout(function(){
                $network_interaction.handleLongClicked(self.network,e,element);
            },1000);

        } else if (e.touches && e.touches.length == 2) {
            this._distance = $touch.getDistance(e);
            this._zoom = this.network.getZoom();
        }
        this._touchCount = e.touches.length;
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (this._touchCount == 2 && e.touches && e.touches.length == 2) {
            if(this.timer) {
                clearTimeout(this.timer);
            }
            if(Math.abs(this._distance - $touch.getDistance(e)) >= $Defaults.TOUCH_ZOOM_THRESHOLD || this._zoomFlag) {
                this._zoomFlag = true;
                var scale = $touch.getDistance(e) / this._distance;
                this.network.setTouchZoom(this._zoom*scale,false);
            }else{
                //pan
                var newClientPoint = this.getMarkerPoint(e);
                var xoffset = this._startTouchClient.x - newClientPoint.x;
                var yoffset = this._startTouchClient.y - newClientPoint.y;
                this.network.panByOffset(xoffset, yoffset);
                this._startTouchClient = newClientPoint;
            }
        } else if (this._touchCount == 1 && e.touches && e.touches.length == 1) {
            if (this._haveElementUnderTouch || !this.network.isRectSelectEnabled()) {
                var newPoint = this.network.getLogicalPoint(e);
                var element = this.network.getElementAt(newPoint);
                if (this.network.isMovingElement() || (this._startTouchElement != null && this._startTouchElement == element && this.network.getMovableSelectedElements().contains(element))) {
                    //drag element
                    var xoffset = newPoint.x - this._startTouchPoint.x;
                    var yoffset = newPoint.y - this._startTouchPoint.y;
                    if(Math.abs(xoffset) >= $Defaults.TOUCH_MOVE_THRESHOLD || Math.abs(yoffset) >= $Defaults.TOUCH_MOVE_THRESHOLD) {
                        this._startTouchPoint = newPoint;
                        this.network.moveSelectedElements(xoffset, yoffset);
                        if (this.network.isMovingElement()) {
                            this.network.fireInteractionEvent({ kind: 'liveMoveBetween', event: e });
                        } else {
                            this.network.setMovingElement(true);
                            this.network.fireInteractionEvent({ kind: 'liveMoveStart', event: e });
                            if(this.timer) {
                                clearTimeout(this.timer);
                            }
                        }
                    }
                } else {
                    var xoffset = newPoint.x - this._startTouchPoint.x;
                    var yoffset = newPoint.y - this._startTouchPoint.y;
                    if(Math.abs(xoffset) >= $Defaults.TOUCH_MOVE_THRESHOLD || Math.abs(yoffset) >= $Defaults.TOUCH_MOVE_THRESHOLD) {
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                    }
//                    pan
                    var newClientPoint = this.getMarkerPoint(e);
                    var xoffset = this._startTouchClient.x - newClientPoint.x;
                    var yoffset = this._startTouchClient.y - newClientPoint.y;
                    this.network.panByOffset(xoffset, yoffset);
                    this._startTouchClient = newClientPoint;
                }
            } else {
                var point = this.network.getLogicalPoint(e);
                if (!point) {
                    return;
                }
                //rect select

                var xoffset =  point.x - this._startTouchPoint.x;
                var yoffset =  point.y - this._startTouchPoint.y;
                if(Math.abs(xoffset) >= $Defaults.TOUCH_RECT_SELECT_THRESHOLD  && Math.abs(yoffset) >= $Defaults.TOUCH_RECT_SELECT_THRESHOLD) {
                    this.network.setSelectingElement(true);
                    if (this._moveTouchPoint) {
                        this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
                    } else {
                        this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    }
                    this._moveTouchPoint = point;
                    this.repaint();
                }
            }
        }
    },
    handleTouchend: function (e) {
        $html.preventDefault(e);
        if (this.network.isMovingElement()) {
            this.network.setMovingElement(false);
            this.network.fireInteractionEvent({ kind: 'liveMoveEnd', event: e });
        } else if (this.network.isSelectingElement()) {
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
//            if(this.timer) {
//                clearTimeout(this.timer);
//            }
            this.repaint();
        } else if (this._startTouchPoint) {
            //set this.zoomFlag = false;
            this._zoomFlag = false;

            //handle click&double click
            var endTouchTime = new Date();
            var endTouchPoint = this.network.getLogicalPoint(e);
            var element = this.network.getElementAt(this._startTouchPoint);
            if (endTouchPoint && (endTouchTime.getTime() - this._startTouchTime.getTime()) <= 500
        		&& $math.getDistance(this._startTouchPoint, endTouchPoint) <= 20) {
                if (element) {
                    if (!this.network.getSelectionModel().contains(element)) {
                        this.network.getSelectionModel().setSelection(element);
                    }
                } else {
                    this.network.getSelectionModel().clearSelection();
                }

                $network_interaction.handleClicked(this.network, e, element);
                if(this.timer) {
                    clearTimeout(this.timer);
                }
                if (this._endTouchTime
        		&& (endTouchTime.getTime() - this._endTouchTime.getTime()) <= 500
                && $math.getDistance(this._endTouchPoint, endTouchPoint) <= 20) {
                    delete this._endTouchTime;
                    delete this._endTouchPoint;
                    $network_interaction.handleDoubleClicked(this.network, e, element);
                } else {
                    this._endTouchTime = endTouchTime;
                    this._endTouchPoint = endTouchPoint;
                }
            }
        }

    },
    paint: function (ctx) {
        if (!this._startTouchPoint || !this._moveTouchPoint) {
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
    },
    getIntersectMode: function () {
        if (this.network.getSelectMode() === 'intersect') {
            return true;
        }
        if (this.network.getSelectMode() === 'contain') {
            return false;
        }
        return this._startTouchPoint.x > this._moveTouchPoint.x && this._startTouchPoint.y > this._moveTouchPoint.y;
    }

});