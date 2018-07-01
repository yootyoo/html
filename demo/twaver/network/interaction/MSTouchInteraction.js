twaver.network.interaction.MSTouchInteraction = function (network) {
    twaver.network.interaction.MSTouchInteraction.superClass.constructor.call(this, network);
    this._pointerMap = {};
    this._pointerIdArray = [];
};
_twaver.ext('twaver.network.interaction.MSTouchInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        var view = this.network.getView();
        $html.addEventListener("MSPointerDown", "handleTouchstart", view, this)
        $html.addEventListener("MSPointerMove", "handleTouchmove", view, this)
        $html.addEventListener("MSPointerUp", "handleTouchend", view, this)
        $html.addEventListener("MSPointerCancel", "handleTouchend", view, this)
    },
    tearDown: function () {
        var view = this.network.getView();
        $html.removeEventListener("MSPointerDown", view, this)
        $html.removeEventListener("MSPointerMove", view, this)
        $html.removeEventListener("MSPointerUp", view, this)
        $html.removeEventListener("MSPointerCancel", view, this)
    },
    handleTouchstart: function (e) {
        if (this.network.isFocusOnClick()) {
            twaver.Util.setFocus(this.network._view);
        }

        if (this.network.isSelectingElement() && e.pointerType == e.MSPOINTER_TYPE_MOUSE) {
            //忽略鼠标按下移出view松开鼠标再移回然后按下的情况
            return;
        }

        var currentTouchPoint = this.network.getLogicalPoint(e);
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
            this._startClientPoint = { x: e.clientX, y: e.clientY }

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
        if (this._startTouchPoint && this._pointerIdArray.length == 1) {
            this._moveTouchPoint = {
                x: this._startTouchPoint.x + (e.clientX - this._startClientPoint.x) / this.network.getZoom(),
                y: this._startTouchPoint.y + (e.clientY - this._startClientPoint.y) / this.network.getZoom()
            };
            if ($math.getDistance(this._startTouchPoint, this._moveTouchPoint) < 3) return;
            if (this._startTouchElement == null && this.network.isRectSelectEnabled()) {
                if (this.mark) {
                    this.network.fireInteractionEvent({ kind: 'selectBetween', event: e });
                } else {
                    this.mark = $html.createDiv();
                    this.network.getTopDiv().appendChild(this.mark);
                    this.network.setSelectingElement(true);
                    this.network.fireInteractionEvent({ kind: 'selectStart', event: e });
                }
                var rect = $math.getRect([this._startTouchPoint, this._moveTouchPoint]);
                $html.setDiv(this.mark, rect,
                this.getIntersectMode() ? this.network.getSelectFillColor() : null,
                this.network.getSelectOutlineWidth(), this.network.getSelectOutlineColor());
            } else {
                var element = this.network.getElementAt(this._moveTouchPoint);
                var xoffset = this._moveTouchPoint.x - this._startTouchPoint.x;
                var yoffset = this._moveTouchPoint.y - this._startTouchPoint.y;
                if (this._startTouchElement == null && !this.network.isRectSelectEnabled()) {
                    var result = this.network.panByOffset(-xoffset, -yoffset);
                } else if (this.network.isMovingElement() || (this._startTouchElement != null && element == this._startTouchElement && this.network.getMovableSelectedElements().contains(element))) {
                    this.network.moveSelectedElements(xoffset, yoffset);
                    if (this.network.isMovingElement()) {
                        this.network.fireInteractionEvent({ kind: 'liveMoveBetween', event: e });
                    } else {
                        this.network.setMovingElement(true);
                        this.network.fireInteractionEvent({ kind: 'liveMoveStart', event: e });
                    }
                }
                this._startClientPoint.x = e.clientX;
                this._startClientPoint.y = e.clientY;
            }
        }
    },
    handle_mouseup: function (e) {
        this.handleTouchend(e);
        this._pointerIdArray = [];
        this._pointerMap = {};
    }
});