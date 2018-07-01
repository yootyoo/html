twaver.network.EditAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.EditAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._attachmentDiv = $html.createDiv();
    this._view.appendChild(this._attachmentDiv);
};
_twaver.ext('twaver.network.EditAttachment', twaver.network.Attachment, {
    updateMeasure: function () {
        twaver.network.EditAttachment.superClass.updateMeasure.call(this);
        this._viewRect = null;
        if (this._element instanceof $Node) {
            this._addResizingPoint(this._element);
        }
        if(this._network.isRotatable(this._element) && this._element instanceof $Node && !(this._element instanceof twaver.ShapeNode) && !(this._element instanceof twaver.Grid) && !(this._element instanceof twaver.Group)) {
            this._addRotatePoint(this._element);
        }
        if (this._element instanceof twaver.ShapeNode) {
            this._addResizingPoint(this._element);
            this._addShapeNodePoint(this._element);
        }
        if (this._ui instanceof twaver.network.ShapeLinkUI) {
            this._addShapeLinkPoints(this._ui);
        }
        if (this._ui instanceof twaver.network.LinkUI) {
            this._addLinkControlPoint(this._ui);
        }
    },
    _addRotatePoint: function(node) {
        var size = this._network.getRotatePointSize();
        if (size <= 0) {
            return;
        }
        var rect = node.getOriginalRect();
        if(!this._rotateDiv) {
            var div = $html.createDiv();
            this._attachmentDiv.appendChild(div);
            this._rotateDiv = div;
        }
        var outlineWidth = this._network.getRotatePointOutlineWidth();
        var outlineColor = this._network.getRotatePointOutlineColor();
        var fillColor = this._network.getRotatePointFillColor();
        var size = this._network.getRotatePointSize();
        var offset = size + outlineWidth;
        var width = size * 2;
        var divRect = { x: rect.x + rect.width / 2 - size, y: rect.y - this._network.getRotatePointOffset() - width, width:width, height:width};
        var rotateDivRect;
        if(node.angle == 0) {
            rotateDivRect = divRect;
        } else {
            rotateDivRect = this._getRotateRect(divRect,node.getAngle(),{x:rect.x + rect.width / 2, y:rect.y + rect.height / 2});
        }
        var unionRect = $math.unionRect(node.getRect(),rotateDivRect);
        this._viewRect = $math.unionRect(unionRect, this._viewRect);
        $html.setDiv(this._rotateDiv, divRect, fillColor, outlineWidth, outlineColor);
        this._rotateDiv._viewRect = rotateDivRect;
        $html.setBorderRaidus(this._rotateDiv, width + 'px');
        this._rotateAttachments(this._rotateDiv,width / 2, outlineWidth);
    },
    _addResizingPoint: function (node) {
        var size = this._network.getResizePointSize();
        if(size <= 0) {
            return;
        }
        var rect = node.getOriginalRect();
        var points = new $List([
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width / 2, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },

            { x: rect.x, y: rect.y + rect.height / 2 },
            { x: rect.x + rect.width, y: rect.y + rect.height / 2 },

            { x: rect.x, y: rect.y + rect.height },
            { x: rect.x + rect.width / 2, y: rect.y + rect.height },
            { x: rect.x + rect.width, y: rect.y + rect.height }
        ]);
        if (!this._resizeDivs) {
            this._resizeDivs = new Array();
            for (var i = 0; i < 8; i++) {
                var div = $html.createDiv();
                this._attachmentDiv.appendChild(div);
                this._resizeDivs[i] = div;
            }
        }
        if(this._resizeDivs) {
            this._resizeRects = new Array();
            for (var i = 0; i < 8; i++) {
                var point = points.get(i);
                var divRect = {x:point.x - size, y:point.y - size, width:size * 2, height:size * 2};
                var rotatedRect;
                if(node.getAngle() == 0) {
                    rotatedRect = divRect;
                } else {
                    rotatedRect = this._getRotateRect(divRect,node.getAngle(),{x:rect.x + rect.width / 2, y:rect.y + rect.height / 2});
                }
                this._resizeRects[i] = rotatedRect;
            }
        }
        var outlineWidth = this._network.getResizePointOutlineWidth();
        var outlineColor = this._network.getResizePointOutlineColor();
        var fillColor = this._network.getResizePointFillColor();

        this._addPoints(node.getRect(), points, outlineWidth, outlineColor, fillColor, true);

    },
    _addPoints: function (rect, points, outlineWidth, outlineColor, fillColor, isResizePoints) {
        var size = isResizePoints ? this._network.getResizePointSize() : this._network.getEditPointSize();
        if (size <= 0) {
            return;
        }
        var offset = size + outlineWidth;
        $math.grow(rect, offset, offset);
        this._viewRect = $math.unionRect(rect, this._viewRect);
        var width = size * 2;
        var rects = new $List();
        var i, n, point, rectangleRect;
        for (i = 0, n = points.size(); i < n; i++) {
            point = points.get(i);
            rectangleRect = { x: point.x - size, y: point.y - size, width: width, height: width};
            rects.add(rectangleRect);
        }
        var divs;
        if (isResizePoints) {
            divs = this._resizeDivs;
        } else {
            if (!this._controlDivs) {
                this._controlDivs = new Array();
            }
            if (this._controlDivs.length < n) {
                for (i = this._controlDivs.length; i < n; i++) {
                    var div = $html.createDiv();
                    this._attachmentDiv.appendChild(div);
                    this._controlDivs[i] = div;
                }
            } else if (this._controlDivs.length > n) {
                for (i = n; i < this._controlDivs.length; i++) {
                    this._attachmentDiv.removeChild(this._controlDivs[i]);
                }
                this._controlDivs.splice(n);
            }
            divs = this._controlDivs;
        }
        for (i = 0, n = rects.size(); i < n; i++) {
            rectangleRect = rects.get(i);
            $html.setDiv(divs[i], rectangleRect, fillColor, outlineWidth, outlineColor);
            $html.setBorderRaidus(divs[i], (isResizePoints ? '0' : width) + 'px');
            this._rotateAttachments(divs[i], width / 2, outlineWidth,points.get(i));
        }
    },
    _rotateAttachments: function(div, size, outlineWidth, point) {
        if(this._element instanceof $Node) {
            var angle = this._element.getAngle();
            if(angle == 0) {
                return;
            }
            var rect = this._element.getOriginalRect();
            var x = (div.style.left).split("px")[0];
            var y = (div.style.top).split("px")[0];
            var translateX = rect.x + rect.width / 2;
            var translateY = rect.y + rect.height / 2;
            if(!point) {
                point = {x: parseFloat(x) + size + outlineWidth, y: parseFloat(y) + size + outlineWidth};
            }
            var matrix = $math.createMatrix(angle * Math.PI / 180, rect.x + rect.width / 2, rect.y + rect.height / 2);
            var newPoint = matrix.transform(point);
            div.style.webkitTransform = "rotate(" + angle + "deg)";
            div.style.mozTransform = "rotate(" + angle + "deg)";
            div.style.OTransform = "rotate(" + angle + "deg)";
            div.style.msTransform = "rotate(" + angle + "deg)";
            div.style.transform = "rotate(" + angle + "deg)";
            div.style.left = (newPoint.x - size - outlineWidth) + "px";
            div.style.top = (newPoint.y  - size - outlineWidth) + "px";
        }
    },
    _addShapeLinkPoints: function (shapeLinkUI) {
        this._addEditPoints(shapeLinkUI._element.getPoints());
    },
    _addShapeNodePoint: function (shapeNode) {
        this._addEditPoints(shapeNode.getPoints());
    },
    _addLinkControlPoint: function (linkUI) {
        if ($link.isOrthogonalLink(linkUI._element)) {
            var controlPoint = linkUI.getControlPoint();
            if (controlPoint) {
                var points = new $List();
                points.add(controlPoint);
                this._addEditPoints(points);
            }
        }
    },
    _addEditPoints: function (points) {
        var rect = $math.getRect(points);
        if (!rect) {
            return;
        }
        var outlineWidth = this._network.getEditPointOutlineWidth();
        var outlineColor = this._network.getEditPointOutlineColor();
        var fillColor = this._network.getEditPointFillColor();

        this._addPoints(rect, points, outlineWidth, outlineColor, fillColor, false);
    },
    hit: function (x, y) {
        if (!$math.containsPoint(this._viewRect, x, y)) {
            return false;
        }
        var i;
        if (this._resizeDivs) {
            for (i = this._resizeDivs.length - 1; i >= 0; i--) {
                if ($math.containsPoint(this._resizeRects[i], x, y)) {
                    return true;
                }
            }
        }
        if (this._rotateDiv) {
            if ($math.containsPoint(this._rotateDiv._viewRect, x, y)) {
                return true;
            }
        }
        if (this._controlDivs) {
            for (i = this._controlDivs.length - 1; i >= 0; i--) {
                if ($math.containsPoint(this._controlDivs[i]._viewRect, x, y)) {
                    return true;
                }
            }
        }
        return false;
    },
    intersects: function (rect) {
        if (!$math.intersects(this._viewRect, rect)) {
            return false;
        }
        var i;
        if (this._resizeDivs) {
            for (i = this._resizeDivs.length - 1; i >= 0; i--) {
                if ($math.intersects(this._resizeRects[i], rect)) {
                    return true;
                }
            }
        }
        if (this._rotateDiv) {
            if ($math.containsPoint(this._rotateDiv._viewRect, rect)) {
                return true;
            }
        }
        if (this._controlDivs) {
            for (i = this._controlDivs.length - 1; i >= 0; i--) {
                if ($math.intersects(this._controlDivs[i]._viewRect, rect)) {
                    return true;
                }
            }
        }
        if (!$math.intersects(this._viewRect, rect)) {
            return false;
        }
        return false;
    },
    _getRotateRect: function(rect,angle,center) {
        var matrix = $math.createMatrix(angle * Math.PI / 180, center.x, center.y);
        var centerPoint = {x: rect.x + rect.width / 2,y: rect.y + rect.height / 2};
        var point = matrix.transform(centerPoint);
        var points = new twaver.List([
            {x: point.x - rect.width / 2, y: point.y - rect.height / 2},
            {x: point.x + rect.width / 2, y: point.y - rect.height / 2},
            {x: point.x + rect.width / 2, y: point.y + rect.height / 2},
            {x: point.x - rect.width / 2, y: point.y + rect.height / 2}
        ]);
        return $math.getRect(points);
    }
});