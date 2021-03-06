twaver.canvas.interaction.EditInteraction = function (network, lazyMode) {
    this.lazyMode = lazyMode;
    this.pointIndex = -1;
    this.editPointSize = network.getEditPointSize();
    this.resizePointSize = network.getResizePointSize();
    this.rotatePointSize = network.getRotatePointSize();

    twaver.canvas.interaction.EditInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.EditInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mouseup', 'mousemove');
        this.oldCursor = this.network.getView().style.cursor;
        this.network.setHasEditInteraction(true);
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mouseup', 'mousemove');
        this.network.getView().style.cursor = this.oldCursor;
        this.network.setHasEditInteraction(false);
        this.clear();
        this.network.removeMarker(this);
    },
    paint: function (ctx) {
        if (this.lazyMode == true && this.resizingRect != null) {
            ctx.lineWidth = this.network.getResizeLineWidth();
            var rect = this.convertFromUIToMarkerRect(this.resizingRect, 0, 0);
            ctx.save();
            twaver.Util.rotateCanvas(ctx, rect, this.node.getAngle());
            ctx.beginPath();
            $CanvasUtil.rect(ctx, rect.x, rect.y, rect.width, rect.height, null, this.network.getResizeLineColor());
            ctx.restore();
        }
        if(this.isStartRotate) {
            this.showRotateScale(ctx);
        }
    },
    clear: function () {
        this.network.setEditingElement(false);
        this.network.setRotatingElement(false);
        this.isStart = false;
        this.isStartRotate = false;
        this.node = null;
        this.shapeNode = null;
        this.shapeLink = null;
        this.linkUI = null;
        this.resizingRect = null;
        this.resizeDirection = null;
        this.pointIndex = -1;
        this._removeCursor();
        this.oldCursor = null;
        this.network.repaintTopCanvas();
    },
    _removeCursor: function () {
        if (this.cursorID) {
            this.network.getView().style.cursor = this.oldCursor || 'default';
            this.cursorID = null;
        }
        this.resizeDirection = null;
        this.isCrossCursor = false;
    },
    _setCrossCursor: function () {
        if (!this.isCrossCursor) {
            this._removeCursor();
            this._setCursor("crosshair");
            this.isCrossCursor = true;
        }
    },
    _setCursor: function (cursorID) {
        this.cursorID = cursorID;
        if (this.network.getView().style.cursor !== this.cursorID) {
            this.network.getView().style.cursor = this.cursorID;
        }
    },
    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        if (_twaver.isAltDown(e) && !this.network.isEditingElement()) {
            var element = this.network.getElementAt(e);
            var point = this.network.getLogicalPoint(e);
            if (element instanceof twaver.ShapeNode) {
                var pointIndex = this.getPointIndex(element.getPoints(), point, true);
                if (pointIndex > 0) {
                    this._handle_mousedown(e);
                    this.pointIndex = pointIndex;
                    this.shapeNode = element;
                    element.addPoint(point, pointIndex);
                    this._setCrossCursor();
                    this.network.setEditingElement(true);
                    this.isStart = true;
                    this.network.fireInteractionEvent({ kind: 'addPoint', event: e, element: element, pointIndex: pointIndex });
                    this.network.fireInteractionEvent({ kind: 'liveMovePointStart', event: e, element: element, pointIndex: pointIndex });
                }
            }
            if (element instanceof twaver.ShapeLink) {
                var points = new twaver.List(element.getPoints());
                var shapeLinkUI = this.network.getElementUI(element);
                points.add(shapeLinkUI.getFromPoint(), 0);
                points.add(shapeLinkUI.getToPoint());
                var pointIndex = this.getPointIndex(points, point) - 1;
                if (pointIndex > 0) {
                    this._handle_mousedown(e);
                    this.pointIndex = pointIndex;
                    this.shapeLink = element;
                    element.addPoint(point, pointIndex);
                    this._setCrossCursor();
                    this.network.setEditingElement(true);
                    this.isStart = true;
                    this.network.fireInteractionEvent({ kind: 'addPoint', event: e, element: element, pointIndex: pointIndex });
                    this.network.fireInteractionEvent({ kind: 'liveMovePointStart', event: e, element: element, pointIndex: pointIndex });
                }
            }
            return;
        }
        if (!this.network.isEditingElement() || this.isStart || this.isStartRotate) {
            return;
        }
        if (this.node && this.resizeDirection) {
            this.isStart = true;
            this._handle_mousedown(e);
            this.network.fireInteractionEvent({ kind: this.lazyMode ? 'lazyResizeStart' : 'liveResizeStart', event: e, element: this.node, resizeDirection: this.resizeDirection });
        } else if (this.shapeNode && this.pointIndex >= 0) {
            if (_twaver.isAltDown(e)) {
                this.shapeNode.removeAt(this.pointIndex);
                this.network.fireInteractionEvent({ kind: 'removePoint', event: e, element: this.shapeNode });
            } else {
                this.isStart = true;
                this._handle_mousedown(e);
                this.network.fireInteractionEvent({ kind: 'liveMovePointStart', event: e, element: this.shapeNode, pointIndex: this.pointIndex });
            }
        } else if (this.shapeLink && this.pointIndex >= 0) {
            if (_twaver.isAltDown(e)) {
                this.shapeLink.removeAt(this.pointIndex);
                this.network.fireInteractionEvent({ kind: 'removePoint', event: e, element: this.shapeLink });
            } else {
                this.isStart = true;
                this._handle_mousedown(e);
                this.network.fireInteractionEvent({ kind: 'liveMovePointStart', event: e, element: this.shapeLink, pointIndex: this.pointIndex });
            }
        } else if (this.linkUI) {
            this.isStart = true;
            this.network.fireInteractionEvent({ kind: 'liveMovePointStart', event: e, element: this.linkUI._element });
        } else if (this.node) {
            this.isStartRotate = true;
            this._handle_mousedown(e);
        }
    },
    handle_mouseup: function (e) {
        if (this.isStart) {
            var point = this.network.getLogicalPoint(e);
            if (this.resizingRect) {
                if (this.lazyMode) {
                    if (this.network.isResizeAnimate()) {
                        var self = this;
                        var animate = new twaver.animate.AnimateBounds(this.node, this.resizingRect, function () {
                            self.network.fireInteractionEvent({ kind: 'lazyResizeEnd', event: e, element: self.node, resizeDirection: self.resizeDirection });
                            self.clear();
                        });
                        twaver.animate.AnimateManager.start(animate);
                    } else {
                        this.node.setLocation(this.resizingRect.x, this.resizingRect.y);
                        this.node.setSize(this.resizingRect.width, this.resizingRect.height);
                        this.network.fireInteractionEvent({ kind: 'lazyResizeEnd', event: e, element: this.node, resizeDirection: this.resizeDirection });
                    }
                } else {
                    this.node.setLocation(this.resizingRect.x, this.resizingRect.y);
                    this.node.setSize(this.resizingRect.width, this.resizingRect.height);
                    this.network.fireInteractionEvent({ kind: 'liveResizeEnd', event: e, element: this.node, resizeDirection: this.resizeDirection });
                }
            } else if (this.shapeNode && this.pointIndex >= 0 && point) {
                this.shapeNode.setPoint(this.pointIndex, point);
                this.network.fireInteractionEvent({ kind: 'liveMovePointEnd', event: e, element: this.shapeNode, pointIndex: this.pointIndex });
            } else if (this.shapeLink && this.pointIndex >= 0 && point) {
                this.shapeLink.setPoint(this.pointIndex, point);
                this.network.fireInteractionEvent({ kind: 'liveMovePointEnd', event: e, element: this.shapeLink, pointIndex: this.pointIndex });
            } else if (this.linkUI && point) {
                this.linkUI.setControlPoint(point);
                this.network.fireInteractionEvent({ kind: 'liveMovePointEnd', event: e, element: this.linkUI._element });
            }
        }
        this._handle_mouseup(e);
        if (!this.lazyMode) {
            this.clear();
        }
    },
    handle_mousemove: function (e) {
        if (!this.network.isValidEvent(e)) {
            return;
        }
        if(this.isStartRotate) {
            if(this.node) {
                this._handleRotateElement(e,this.node);
                if(this.network.isShowRotateScale()) {
                    this.repaint();
                }
                return;
            }
        }
        if (this.isStart) {
            if (this.shapeNode && this.pointIndex >= 0) {
                this._handleMovingShapeNodePoint(e);
                return;
            }
            if (this.shapeLink && this.pointIndex >= 0) {
                this._handleMovingShapeLinkPoint(e);
                return;
            }
            if (this.node && this.resizeDirection) {
                this._handleResizing(e);
                return;
            }
            if (this.linkUI) {
                this._handleMovingLinkControlPoint(e);
                return;
            }
        }
        if (this.network.isSelectingElement() || this.network.isMovingElement() || this.network.getSelectionModel().size() === 0) {
            this.clear();
            return;
        }

        var element = this.network.getElementAt(e);
        var elementUI = this.network.getElementUI(element);
        if (!elementUI || !elementUI.getEditAttachment()) {
            this.clear();
            return;
        }

        var point = this.network.getLogicalPoint(e);
        if (element instanceof twaver.Node) {
            this.node = element;
            if (this._isEditingShapeNode(point) || this._isResizingNode(point)) {
                this.network.setEditingElement(true);
                return;
            }
            if(this._isRotatingElement(point)) {
                this.network.setRotatingElement(true);
                this.network.setEditingElement(true)
                return;
            }
        } else if (element instanceof twaver.ShapeLink) {
            this.shapeLink = element;
            if (this._isEditingShapeLink(point)) {
                this.network.setEditingElement(true);
                return;
            }
        } else if (elementUI instanceof twaver.canvas.LinkUI) {
            if ($link.isOrthogonalLink(elementUI._element)) {
                this.linkUI = elementUI;
                var controlPoint = this.linkUI.getControlPoint();
                if (controlPoint && this._contains(point, controlPoint,this.editPointSize)) {
                    this._setCrossCursor();
                    this.network.setEditingElement(true);
                }
                return;
            }
        }
        this.clear();
    },
    _isRotatingElement: function(point) {
        var size = this.network.getRotatePointSize();
        if (size <= 0) {
            return false;
        }
        var rect = this.node.getOriginalRect();
        var angle = this.node.getAngle();
        return this._isRotating(point, "crosshair", rect, angle);
    },
    _isRotating: function(point,cursor,rect,angle) {
        var size = this.network.getRotatePointSize();
        var p = {x: rect.x + rect.width/2 , y: rect.y - this.network.getRotatePointOffset() - size};
        var rotatep = this._rotatePoint(p, angle, rect);
        var newrect = { x: rotatep.x - size, y: rotatep.y - size , width: size * 2, height: size * 2};
        if($math.containsPoint(newrect, point)) {
            this._removeCursor();
            this._setCursor(cursor);
            return true;
        }
        return false;
    },
    _handleRotateElement: function(e,node) {
        this._handle_mousemove(e);
        var angle = this._calculateAngle(this.network.getLogicalPoint(e),node);
        node.setAngle(angle);
    },
    _calculateAngle: function(p,node) {
        var c = node.getCenterLocation();
        return Math.round(Math.atan2(c.x-p.x,p.y - c.y) * 180 / Math.PI + 180);
    },
    _handleMovingShapeNodePoint: function (e) {
        var point = this.network.getLogicalPoint(e);
        this.shapeNode.setPoint(this.pointIndex, point);
        this.network.fireInteractionEvent({ kind: 'liveMovePointBetween', e: e, element: this.shapeNode, pointIndex: this.pointIndex });
    },
    _handleMovingShapeLinkPoint: function (e) {
        var point = this.network.getLogicalPoint(e);
        this.shapeLink.setPoint(this.pointIndex, point);
        this.network.fireInteractionEvent({ kind: 'liveMovePointBetween', e: e, element: this.shapeLink, pointIndex: this.pointIndex });
    },
    _handleMovingLinkControlPoint: function (e) {
        this.linkUI.setControlPoint(this.network.getLogicalPoint(e));
        this.network.fireInteractionEvent({ kind: 'liveMovePointBetween', e: e, element: this.linkUI._element });
    },
    _handleResizing: function (e) {
        this._handle_mousemove(e);
        var angle = this.node.getAngle();
        var oldLocation = this.node.getLocation();
        var w = this.node.getWidth()/2,h = this.node.getHeight()/2;
        var center = {x : oldLocation.x + w, y : oldLocation.y + h};

        var p1 = {x: (-w),y : (-h)}; // northwest
        var p2 = {x : (-w),y : h}; //southwest
        var p3 = {x : w, y : h};//southeast
        var p4 = {x : w,y :(-h)};//northeast
        var p5 = {x:0,y:-h};//north
        var p6 = {x:w,y:0};//east
        var p7 = {x:0,y:h};//south
        var p8 ={x:-w,y:0};//west


        if (this.resizeDirection === 'northwest') {
            this._transformPoint(p3,center,angle);
            p1.x = this._endLogical.x;
            p1.y = this._endLogical.y;

            center.x = (p1.x + p3.x) / 2;
            center.y = (p1.y + p3.y) / 2;

            this._reversPoint(p1,center,angle);
            this._reversPoint(p3,center,angle);

            this.resizingRect = {x:p1.x,y:p1.y,width:p3.x-p1.x,height:p3.y - p1.y};
        }
        if (this.resizeDirection === 'north') {
            var p= {x:this._endLogical.x, y:this._endLogical.y};

            this._reversPoint(p,center,angle);
            p5.y = p.y - center.y;
            this._transformPoint(p5,center,angle);
            this._transformPoint(p7,center,angle);


            center.x = (p5.x + p7.x) / 2;
            center.y = (p5.y + p7.y) / 2;

            this._reversPoint(p5,center,angle);
            this._reversPoint(p7,center,angle);

            this.resizingRect = {x:center.x - this.node.getWidth()/2,y:center.y - (p7.y - p5.y)/ 2,width:this.node.getWidth(),height:p7.y - p5.y};
        }
        if (this.resizeDirection === 'northeast') {
            this._transformPoint(p2,center,angle);
            p4.x = this._endLogical.x;
            p4.y = this._endLogical.y;

            center.x = (p2.x + p4.x) / 2;
            center.y = (p2.y + p4.y) / 2;

            this._reversPoint(p2,center,angle);
            this._reversPoint(p4,center,angle);

            this.resizingRect = {x:p2.x,y:p4.y,width:p4.x - p2.x,height:p2.y - p4.y};
        }
        if (this.resizeDirection === 'west') {
            var p= {x:this._endLogical.x, y:this._endLogical.y};

            this._reversPoint(p,center,angle);
            p8.x = p.x - center.x;
            this._transformPoint(p6,center,angle);
            this._transformPoint(p8,center,angle);


            center.x = (p6.x + p8.x) / 2;
            center.y = (p6.y + p8.y) / 2;

            this._reversPoint(p6,center,angle);
            this._reversPoint(p8,center,angle);


            this.resizingRect = {x:center.x - (p6.x - p8.x) / 2,y:center.y - this.node.getHeight()/ 2,width:p6.x - p8.x,height:this.node.getHeight()};
        }
        if (this.resizeDirection === 'east') {
            var p= {x:this._endLogical.x, y:this._endLogical.y};

            this._reversPoint(p,center,angle);
            p6.x = p.x - center.x;
            this._transformPoint(p6,center,angle);
            this._transformPoint(p8,center,angle);


            center.x = (p6.x + p8.x) / 2;
            center.y = (p6.y + p8.y) / 2;

            this._reversPoint(p6,center,angle);
            this._reversPoint(p8,center,angle);


            this.resizingRect = {x:center.x - (p6.x - p8.x) / 2,y:center.y - this.node.getHeight()/ 2,width:p6.x - p8.x,height:this.node.getHeight()};
        }
        if (this.resizeDirection === 'southwest') {
            this._transformPoint(p4,center,angle);
            p2.x = this._endLogical.x;
            p2.y = this._endLogical.y;

            center.x = (p2.x + p4.x) / 2;
            center.y = (p2.y + p4.y) / 2;

            this._reversPoint(p2,center,angle);
            this._reversPoint(p4,center,angle);

            this.resizingRect = {x:p2.x,y:p4.y,width:p4.x - p2.x,height:p2.y - p4.y};
        }
        if (this.resizeDirection === 'south') {
            var p= {x:this._endLogical.x, y:this._endLogical.y};

            this._reversPoint(p,center,angle);
            p7.y = p.y - center.y;
            this._transformPoint(p5,center,angle);
            this._transformPoint(p7,center,angle);


            center.x = (p5.x + p7.x) / 2;
            center.y = (p5.y + p7.y) / 2;

            this._reversPoint(p5,center,angle);
            this._reversPoint(p7,center,angle);


            this.resizingRect = {x:center.x - this.node.getWidth() / 2,y:center.y - (p7.y - p5.y)/ 2,width:this.node.getWidth(),height:p7.y - p5.y};
        }
        if (this.resizeDirection === 'southeast') {
            this._transformPoint(p1,center,angle);
            p3.x = this._endLogical.x;
            p3.y = this._endLogical.y;

            center.x = (p1.x + p3.x) / 2;
            center.y = (p1.y + p3.y) / 2;

            this._reversPoint(p1,center,angle);
            this._reversPoint(p3,center,angle);

            this.resizingRect = {x:p1.x,y:p1.y,width:p3.x - p1.x,height:p3.y - p1.y};
        }

        if (this.lazyMode) {
            this.repaint();
            this.network.fireInteractionEvent({ kind: 'lazyResizeBetween', event: e, element: this.node, resizeDirection: this.resizeDirection });
        } else {
            this.node.setLocation(this.resizingRect.x, this.resizingRect.y);
            this.node.setSize(this.resizingRect.width, this.resizingRect.height);
            this.network.fireInteractionEvent({ kind: 'liveResizeBetween', event: e, element: this.node, resizeDirection: this.resizeDirection });
        }
    },
    _isEditingShapeNode: function (point) {
        if (this.node instanceof twaver.ShapeNode) {
            this.shapeNode = this.node;
            var points = this.shapeNode.getPoints();
            for (var i = 0, n = points.size(); i < n; i++) {
                var p = points.get(i);
                if (this._contains(point, p, this.editPointSize)) {
                    this._setCrossCursor();
                    this.pointIndex = i;
                    return true;
                }
            }
        }
        this.pointIndex = -1;
        return false;
    },
    _isEditingShapeLink: function (point) {
        var points = this.shapeLink.getPoints();
        for (var i = 0, n = points.size(); i < n; i++) {
            var p = points.get(i);
            if (this._contains(point, p, this.editPointSize)) {
                this._setCrossCursor();
                this.pointIndex = i;
                return true;
            }
        }
        this.pointIndex = -1;
        return false;
    },
    _isResizingNode: function (point) {
        var size = this.network.getResizePointSize();
        if (size <= 0) {
            return false;
        }
        var rect = this.node.getOriginalRect();
        var angle = this.node.getAngle();
        var p = {x: rect.x, y:rect.y};
        var rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point, rotatep.x, rotatep.y, 'northwest', 'nwse-resize')) {
            return true;
        }
        p = {x: rect.x + rect.width / 2, y: rect.y};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point, rotatep.x ,rotatep.y, 'north', 'ns-resize')) {
            return true;
        }
        p = {x: rect.x + rect.width, y:rect.y};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point,rotatep.x ,rotatep.y, 'northeast', 'nesw-resize')) {
            return true;
        }
        p = {x: rect.x, y:rect.y + rect.height / 2};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point, rotatep.x ,rotatep.y, 'west', 'ew-resize')) {
            return true;
        }
        p = {x: rect.x + rect.width, y: rect.y + rect.height / 2};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point,  rotatep.x ,rotatep.y, 'east', 'ew-resize')) {
            return true;
        }
        p = {x: rect.x, y: rect.y + rect.height};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point,rotatep.x ,rotatep.y, 'southwest', 'nesw-resize')) {
            return true;
        }
        p = {x: rect.x + rect.width / 2, y: rect.y + rect.height};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point, rotatep.x ,rotatep.y, 'south', 'ns-resize')) {
            return true;
        }
        p = {x: rect.x + rect.width, y:rect.y + rect.height};
        rotatep = this._rotatePoint(p,angle,rect);
        if (this._isResizing(point, rotatep.x ,rotatep.y, 'southeast', 'nwse-resize')) {
            return true;
        }
        return false;
    },
    _rotatePoint: function(point,angle,rect) {
        var matrix = $math.createMatrix(angle * Math.PI / 180, rect.x + rect.width / 2, rect.y + rect.height / 2);
        var newPoint = matrix.transform(point);
        return newPoint;
    },
    _isResizing: function (point, x, y, direction, cursor) {
        if (this._contains(point, { x: x, y: y },this.resizePointSize)) {
            if (this.resizeDirection !== direction) {
                this._removeCursor();
                cursor = this._changeCursorWithAngle(direction, this.node.getAngle());
                this._setCursor(cursor);
                this.resizeDirection = direction;
            }
            return true;
        }
        return false;
    },
    _getRect: function (x1, y1, x2, y2) {
        var x = x1 < x2 ? x1 : x2;
        var y = y1 < y2 ? y1 : y2;
        var w = Math.abs(x1 - x2);
        var h = Math.abs(y1 - y2);
        return { x: x, y: y, width: w, height: h };
    },
    _contains: function (point, center, size) {
        var rect = { x: center.x - size, y: center.y - size, width: size * 2, height: size * 2 };
        return $math.containsPoint(rect, point);
    },
    getPointIndex: function (points, point, closed) {
        if(points.size() < 2){
            return 0;
        }
        var p1 = points.get(0), p2;
        for(var i=1; i<points.size(); i++){
            p2 = points.get(i);
            if(this.isPointOnLine(point, p1, p2, 6)){
                return i;
            }
            p1 = p2;
        }
        p1 = points.get(0);
        if(closed && this.isPointOnLine(point, p1, p2, 6)){
            return points.size();
        }
        return 0;
    },
    showRotateScale: function(ctx) {
        var rmpList = new twaver.List(),
            width = this.network.getRotateScaleWidth(),
            height = this.network.getRotateScaleHeight(),
            size = this.network.getRotatePointSize(),
            angle = this.node.getAngle(),
            rect = this.node.getOriginalRect(),
            point = {x: rect.x + rect.width / 2, y: rect.y - this.network.getRotatePointOffset() - size},
            rotatePoint = this._rotatePoint(point, angle, rect),
            rscaleRect,
            font = "13px Arial",
            text = angle + '\u00B0',
            p1,p2,p3,p4;
        if(this.node.getAngle() >= 0 && this.node.getAngle() <= 180) {
            p1 = {x: rotatePoint.x + size, y: rotatePoint.y};
            p2 = {x: p1.x + width, y: p1.y};
            p3 = {x: p2.x, y: p2.y -  height};
            p4 = {x: p1.x, y: p3.y};
        } else if (this.node.getAngle() > 180 && this.node.getAngle() <= 360) {
            p1 = {x: rotatePoint.x - size, y: rotatePoint.y};
            p2 = {x: p1.x - width, y: p1.y};
            p3 = {x: p2.x, y: p2.y - height};
            p4 = {x: p1.x, y: p3.y};
        }
        var rscalePointsList = new twaver.List([p1,p2,p3,p4]),
            rscaleRect = _twaver.math.getRect(rscalePointsList);
        ctx.fillStyle = this.network.getRotateScaleFillColor();
        ctx.fillRect(rscaleRect.x, rscaleRect.y, rscaleRect.width, rscaleRect.height);
        ctx.fillStyle = this.network.getRotateScaleFontColor();
        ctx.textBaseline="middle";
        ctx.textAlign = "center";
        ctx.font = font;
        ctx.fillText(text, rscaleRect.x + rscaleRect.width / 2, rscaleRect.y + rscaleRect.height/2);

    },
    isPointOnLine: function (point, point1, point2, width) {
        if(width < 0){
            width = 0;
        }
        var distance = this.getDistanceFromPointToLine(point, point1, point2);
        return distance <= width &&
            (point.x >= Math.min(point1.x, point2.x) - width) &&
            (point.x <= Math.max(point1.x, point2.x) + width) &&
            (point.y >= Math.min(point1.y, point2.y) - width) &&
            (point.y <= Math.max(point1.y, point2.y) + width);
    },
    getDistanceFromPointToLine: function (point, point1, point2) {
        if (point1.x === point2.x) {
            return Math.abs(point.x - point1.x);
        }
        var lineK = (point2.y - point1.y) / (point2.x - point1.x);
        var lineC = (point2.x * point1.y - point1.x * point2.y) / (point2.x - point1.x);
        return Math.abs(lineK * point.x - point.y + lineC) / (Math.sqrt(lineK * lineK + 1));
    },
    _transformPoint : function(p,center,angle){
        var cos = Math.cos(angle * Math.PI / 180);
        var sin = Math.sin(angle * Math.PI / 180);
        var x = p.x;
        var y = p.y;

        var newX = x * cos - y *sin;
        var newY = x * sin + y *cos;

        p.x = newX + center.x;
        p.y = newY + center.y;
    },

    _reversPoint : function(p,center,angle){
        angle *= -1;
        var cos = Math.cos(angle * Math.PI / 180);
        var sin = Math.sin(angle * Math.PI / 180);
        var x = p.x - center.x;
        var y = p.y - center.y;

        var newX = x * cos - y *sin;
        var newY = x * sin + y *cos;

        p.x = newX + center.x;
        p.y = newY + center.y;
    },
    _changeCursorWithAngle: function(direction, angle) {
        var flag,cursorArray = ['auto','nwse-resize','ns-resize','nesw-resize','ew-resize','nwse-resize','ns-resize','nesw-resize','ew-resize'];
        switch(direction)
        {
            case 'northwest':
                flag = 1;
                break;
            case 'north':
                flag = 2
                break;
            case 'northeast':
                flag = 3
                break;
            case 'east':
                flag = 4;
                break;
            case 'southeast':
                flag = 5;
                break;
            case 'south':
                flag = 6;
                break;
            case 'southwest':
                flag = 7;
                break;
            case 'west':
                flag = 8;
                break;
            default:
                flag = 0;
        }
        if(angle >= 360 || angle <= -360) {
            angle = angle % 360;
        }
        if(angle > 45 / 2 && angle <= 135 / 2) {
            flag = flag + 1;
        }
        if(angle < -45/2 && angle >= -135/2) {
            flag = flag - 1;
        }
        if(angle > 135 / 2 && angle <= 225 / 2) {
            flag = flag + 2;
        }
        if(angle < -135 / 2 && angle >= -225 / 2) {
            flag = flag - 2;
        }
        if(angle > 225 / 2 && angle <= 315 / 2) {
            flag = flag + 3;
        }
        if(angle < -225 / 2 && angle >= -315 / 2) {
            flag = flag - 3;
        }
        if(angle > 315 / 2 && angle <= 405 / 2) {
            flag = flag + 4;
        }
        if(angle < -315 / 2 && angle >= -405 / 2) {
            flag = flag - 4;
        }
        if(angle > 405 / 2 && angle <= 495 / 2) {
            flag = flag + 5;
        }
        if(angle < -405 / 2 && angle >= -495 / 2) {
            flag = flag - 5;
        }
        if(angle > 495 / 2 && angle <= 585 / 2) {
            flag = flag + 6;
        }
        if(angle < -495 / 2 && angle >= -585 / 2) {
            flag = flag - 6;
        }
        if(angle > 585 / 2 && angle <= 675 / 2) {
            flag = flag + 7;
        }
        if(angle < -585 / 2 && angle >= -675 / 2) {
            flag = flag - 7;
        }
        if(flag > 8) {
            flag = flag - 8;
        }
        if(flag <= 0) {
            flag = flag + 8;
        }
        return cursorArray[flag];
    }
});
