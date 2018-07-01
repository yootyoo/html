twaver.network.interaction.TouchInteraction = function (network) {
    twaver.network.interaction.TouchInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.TouchInteraction', twaver.network.interaction.BaseInteraction, {
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
        if (e.touches && e.touches.length == 1) {
            var point = this.network.getLogicalPoint(e);
            var element = this.network.getElementAt(point);
            this._startTouchTime = new Date();
            this._startTouchPoint = point;
            var self = this;
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
            this._startTouchPoint = {x:e.touches[0].clientX,y: e.touches[0].clientY};
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
                var t0 = e.touches[0];
                //pan
                var xoffset = this._startTouchPoint.x - t0.clientX;
                var yoffset = this._startTouchPoint.y - t0.clientY;
                var result = this.network.panByOffset(xoffset, yoffset);
                this._startTouchPoint.x -= (xoffset - result.x);
                this._startTouchPoint.y -= (yoffset - result.y);
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
//                    //pan
//                    var xoffset = this._startTouchPoint.x - newPoint.x;
//                    var yoffset = this._startTouchPoint.y - newPoint.y;
//                    var result = this.network.panByOffset(xoffset, yoffset);
//                    this._startTouchPoint.x -= (xoffset - result.x);
//                    this._startTouchPoint.y -= (yoffset - result.y);
                }
            } else {
                //rect select
                this._moveTouchPoint = this.network.getLogicalPoint(e);
                var xoffset =  this._moveTouchPoint.x - this._startTouchPoint.x;
                var yoffset =  this._moveTouchPoint.y - this._startTouchPoint.y;
                if(Math.abs(xoffset) >= $Defaults.TOUCH_RECT_SELECT_THRESHOLD  && Math.abs(yoffset) >= $Defaults.TOUCH_RECT_SELECT_THRESHOLD) {
                    if (this.mark) {
                        this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
                    } else {
                        this.mark = $html.createDiv();
                        this.network.getTopDiv().appendChild(this.mark);
                        this.network.setSelectingElement(true);
                        this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                    }

                    var rect = $math.getRect([this._startTouchPoint, this._moveTouchPoint]);
                    $html.setDiv(this.mark, rect,
                        this.getIntersectMode() ? this.network.getSelectFillColor() : null,
                        this.network.getSelectOutlineWidth(), this.network.getSelectOutlineColor());
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
            var elements = this.network.getElementsAtRect(this.mark._viewRect, this.getIntersectMode(), this.network.getRectSelectFilter());
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
            this.network.getTopDiv().removeChild(this.mark);
            this.mark = null;
            this.network.setSelectingElement(false);
            if(this.timer) {
                clearTimeout(this.timer);
            }
        } else if (this._startTouchPoint) {
            //set this.zoomFlag = false;
            this._zoomFlag = false;
            //handle click&double click
            var endTouchTime = new Date();
            var endTouchPoint = this.network.getLogicalPoint(e);
            var element = this.network.getElementAt(this._startTouchPoint);
            if (this._startTouchPoint && endTouchPoint && (endTouchTime.getTime() - this._startTouchTime.getTime()) <= 500
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
                    if(this.timer) {
                        clearTimeout(this.timer);
                    }
                } else {
                    this._endTouchTime = endTouchTime;
                    this._endTouchPoint = endTouchPoint;
                }

            }
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