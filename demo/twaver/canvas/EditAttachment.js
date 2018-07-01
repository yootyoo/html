twaver.canvas.EditAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.canvas.EditAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.canvas.EditAttachment', twaver.canvas.Attachment, {
    paint: function (ctx) {
        twaver.canvas.EditAttachment.superClass.paint.apply(this, arguments);
        this._viewRect = null;
        this.paintResizingPoints(ctx);
        this.paintEditPoints(ctx);
        this.paintRotatePoints(ctx);
    },
    paintResizingPoints: function (ctx) {
        var size = this.resizingPoints.size();
        if (size <= 0) {
            return;
        }
        var width = this.resizePointSize * 2;
        var height = this.resizePointSize * 2;
        var fillColor = this._network.getResizePointFillColor();
        var outlineWidth = this._network.getResizePointOutlineWidth();
        var outlineColor = this._network.getResizePointOutlineColor();
        var angle = this._element.getAngle();
        var rect = this._element.getOriginalRect();
        ctx.lineWidth = outlineWidth;
        for (var i = 0; i < size; i++) {
            var point = this.resizingPoints.get(i);
            var resizeRect = {x:point.x - this.resizePointSize, y:point.y - this.resizePointSize, width:this.resizePointSize * 2, height:this.resizePointSize * 2};
            var rotatedRect = this._getRotateRect(resizeRect,angle,{x:rect.x + rect.width / 2, y:rect.y + rect.height / 2});
            ctx.save();
            twaver.Util.rotateCanvas(ctx, rotatedRect, angle);
            $CanvasUtil.rect(ctx, rotatedRect.x, rotatedRect.y, width, height);
            ctx.restore();
        }
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = outlineColor;
        ctx.fill();
        ctx.stroke();
    },
    paintEditPoints: function (ctx) {
        var size = this.editPoints.size();
        if (size <= 0) {
            return;
        }
        var outlineColor = this._network.getEditPointOutlineColor();
        var fillColor = this._network.getEditPointFillColor();
        var outlineWidth = this._network.getEditPointOutlineWidth();
        ctx.beginPath();
        ctx.lineWidth = outlineWidth;
        for (var i = 0; i < size; i++) {
            var p = this.editPoints.get(i);
            ctx.beginPath();
            $CanvasUtil.circle(ctx, p.x, p.y, this.editPointSize, fillColor, outlineColor);
            ctx.closePath();
        }
    },
    paintRotatePoints: function(ctx) {
        var size = this.rotatePoints.size();
        if (size <= 0) {
            return;
        }
        var outlineColor = this._network.getRotatePointOutlineColor();
        var fillColor = this._network.getRotatePointFillColor();
        var outlineWidth = this._network.getRotatePointOutlineWidth();
        ctx.beginPath();
        ctx.lineWidth = outlineWidth;
        for (var i = 0; i < size; i++) {
            var p = this.rotatePoints.get(i);
            ctx.beginPath();
            $CanvasUtil.circle(ctx, p.x, p.y, this.rotatePointSize, fillColor, outlineColor);
            ctx.closePath();
        }

    },
    validate: function () {
        twaver.canvas.EditAttachment.superClass.validate.call(this);

        this.editPointSize = this._network.getEditPointSize();
        this.resizePointSize = this._network.getResizePointSize();
        this.rotatePointSize = this._network.getRotatePointSize();

        this.resizingPoints = new twaver.List();
        this.editPoints = new twaver.List();
        this.rotatePoints = new twaver.List();

        if (this._element instanceof twaver.Node) {
            this._addResizingPoint(this._element);
        }
        if(this._network.isRotatable(this._element) && this._element instanceof $Node && !(this._element instanceof twaver.ShapeNode) && !(this._element instanceof twaver.Grid) && !(this._element instanceof twaver.Group)) {
            this._addRotatePoint(this._element);
        }
        if (this._element instanceof twaver.ShapeNode) {
            this._addResizingPoint(this._element);
            this._addShapeNodePoint(this._element);
        }
        if (this._ui instanceof twaver.canvas.ShapeLinkUI) {
            this._addShapeLinkPoints(this._element);
        }
        if (this._ui instanceof twaver.canvas.LinkUI) {
            this._addLinkControlPoint(this._ui);
        }
    },
    _addResizingPoint: function (node) {
        var rect = node.getOriginalRect();
        if (!rect) {
            return;
        }
        var size = this._network.getResizePointSize();
        if (size <= 0) {
            return;
        }
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
        var outlineWidth = this._network.getResizePointOutlineWidth();
        var outlineColor = this._network.getResizePointOutlineColor();
        var fillColor = this._network.getResizePointFillColor();

        this._addPoints(node.getRect(), points, outlineWidth,outlineColor, fillColor, true);
    },
    _addRotatePoint: function (node) {
        var rect = node.getOriginalRect();
        if (!rect) {
            return;
        }
        var size = this._network.getRotatePointSize();
        if (size <= 0) {
            return;
        }
        var width = size * 2;
        var points = new twaver.List([{x: rect.x + rect.width/2, y: rect.y - this._network.getRotatePointOffset() - width/2}]);
        var angle = node.getAngle();
        if(angle != 0) {
            points = this._rotatePointList(points,angle,node.getOriginalRect());
        }
        var rotatedPoint = points.get(0);
        var rotatedRect = {x: rotatedPoint.x - width / 2, y: rotatedPoint.y - width / 2, width: width, height: width};
        var outlineWidth = this._network.getRotatePointOutlineWidth();
        var offset = this.rotatePointSize + outlineWidth;
        $math.grow(rect, offset, offset);
        var unionRect = $math.unionRect(node.getRect(),rotatedRect);
        this._viewRect = $math.unionRect(unionRect, this._viewRect);
        this.rotatePoints = points;
    },
    _addShapeNodePoint: function (shapeNode) {
        this._addEditPoints(shapeNode.getPoints());
    },
    _addShapeLinkPoints: function (shapeLink) {
        this._addEditPoints(shapeLink.getPoints());
    },
    _addLinkControlPoint: function (linkUI) {
        if ($link.isOrthogonalLink(linkUI._element)) {
            var controlPoint = linkUI.getControlPoint();
            if (controlPoint) {
                var points = new twaver.List();
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
        var size = this._network.getEditPointSize();
        if (size <= 0) {
            return;
        }
        var outlineWidth = this._network.getEditPointOutlineWidth();
        this._addPoints(rect, points, outlineWidth, false);
    },
    _addPoints: function (rect, points, outlineWidth,outlineColor, fillColor, isResizePoints) {
        var size = isResizePoints ? this._network.getResizePointSize():this._network.getEditPointSize();
        if(size < 0) {
            return;
        }
        var offset = size + outlineWidth;
        $math.grow(rect, offset, offset);
        this._viewRect = $math.unionRect(rect, this._viewRect);

        if (isResizePoints == true) {
            this.resizingPoints = points;
        } else {
            this.editPoints = points;
        }
    },
    _rotatePoint: function(point,angle,rect) {
        var matrix = $math.createMatrix(angle * Math.PI / 180, rect.x + rect.width / 2, rect.y + rect.height / 2);
        var newPoint = matrix.transform(point);
        return newPoint;
    },
    _rotatePointList: function(list, angle, rect) {
        var self = this;
        var newList = new twaver.List();
        list.forEach(function(p) {
            newList.add(self._rotatePoint(p, angle, rect));
        });
        return newList;
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