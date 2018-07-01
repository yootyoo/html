twaver.vector.EditAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.vector.EditAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.vector.EditAttachment', twaver.vector.Attachment, {
    paint: function (ctx) {
        twaver.vector.EditAttachment.superClass.paint.apply(this, arguments);
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
        var zoomManager = this._network.zoomManager;
        var rect = zoomManager._getElementZoomRect(this.getElementUI(),this._element.getOriginalRect());
        ctx.lineWidth = outlineWidth;
        // var zoomPoints = zoomManager._getEditZoomPoints(this.getElementUI(),this.resizingPoints);
        var zoomPoints = this.resizingPoints;

        for (var i = 0; i < size; i++) {
            var point = zoomPoints.get(i);
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

        if(this._network._debug){
            var r = this.getViewRect('resize');
            $g.strokeRect(ctx, r, '#CCDDCC');
            var r = zoomManager._getElementZoomRect(this.getElementUI(),this.getElementUI()._viewRect);
            $g.strokeRect(ctx, r, '#FD7766');
        }
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
        // var zoomPoints = this._network.zoomManager._getEditZoomPoints(this.getElementUI(),this.editPoints);
        var zoomPoints = this.editPoints;
        for (var i = 0; i < size; i++) {
            var p = zoomPoints.get(i);
            ctx.beginPath();
            $CanvasUtil.circle(ctx, p.x, p.y, this.editPointSize, fillColor, outlineColor);
            ctx.closePath();
        }

        if(this._network._debug){
            var r = this.getViewRect('edit');
            $g.strokeRect(ctx, r, '#AAABBC');
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
        // var zoomPoints = this._network.zoomManager._getEditZoomPoints(this.getElementUI(),this.rotatePoints);
        var zoomPoints = this.rotatePoints;
        for (var i = 0; i < size; i++) {
            var p = zoomPoints.get(i);
            ctx.beginPath();
            $CanvasUtil.circle(ctx, p.x, p.y, this.rotatePointSize, fillColor, outlineColor);
            ctx.closePath();
            ctx.beginPath();
        }

        if(this._network._debug){
            var r = this.getViewRect('rotate');
            $g.strokeRect(ctx, r, 'green');
        }
    },
    getViewRect : function(type){
        if(type){
            if(type === 'resize'){
                return this._resizeRect;
            }else if(type === 'rotate'){
                return this._rotateRect;
            }else if(type === 'edit'){
                return this._editRect;
            }
        }
    	return this._viewRect || {
    		x : 0,
    		y : 0,
    		width : 0,
    		height : 0
    	};
    },
    validate: function () {
        twaver.vector.EditAttachment.superClass.validate.call(this);

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
        if (this._ui instanceof twaver.vector.ShapeLinkUI) {
            this._addShapeLinkPoints(this._element);
        }
        if (this._ui instanceof twaver.vector.LinkUI) {
            this._addLinkControlPoint(this._ui);
        }
        //resize
        // var outlineWidth = this._network.getEditPointOutlineWidth();
        var outlineWidth = this._network.getResizePointOutlineWidth();
        // var unionRect = $math.getRect(this.resizingPoints);
        var unionRect = this.getElementUI().getZoomBodyRect();
        var times = 2 * Math.sqrt(2);
        this._resizeOffset = (this.resizePointSize + outlineWidth + 1)*times;
        $math.grow(unionRect,this._resizeOffset ,this._resizeOffset);
        this._resizeRect = unionRect;

        //edit
        outlineWidth = this._network.getEditPointOutlineWidth();
        if(this.editPoints.size() > 0)  {
           var editRect = $math.getRect(this.editPoints);
           $math.grow(editRect,this.editPointSize * 2 + outlineWidth * 2);
           unionRect = $math.unionRect(unionRect,editRect); 
        }
        this._editRect = editRect;

        outlineWidth = this._network.getRotatePointOutlineWidth();
        if(this.rotatePoints.size() > 0) {
        	var point = this.rotatePoints.get(0);
            
        	var rect = {
        		x : point.x - this.rotatePointSize  - outlineWidth - 1,
        		y : point.y - this.rotatePointSize  - outlineWidth - 1,
        		width : this.rotatePointSize * 2 + outlineWidth * 2 + 2,
        		height : this.rotatePointSize * 2+ outlineWidth * 2 + 2,
        	};
        	unionRect = $math.unionRect(unionRect,rect);
            this._rotateRect = rect;
        }

        this._viewRect = unionRect;
    },
    _addResizingPoint: function (node) {
        // var rect = node.getOriginalRect();
        var rect = this._network.zoomManager._getElementZoomRect(this.getElementUI(),node.getOriginalRect());
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
        var rect = this._network.zoomManager._getElementZoomRect(this.getElementUI(),node.getOriginalRect());
        // var rect = this._ui.getZoomBodyRect();
        if (!rect) {
            return;
        }
        var size = this._network.getRotatePointSize();
        if (size <= 0) {
            return;
        }
        var width = size * 2;
        var points = new twaver.List([{x: rect.x + rect.width/2, y: rect.y -  this._network.getRotatePointOffset() - width/2}]);
        var angle = node.getAngle();
        if(angle != 0) {
            // points = this._rotatePointList(points,angle,node.getOriginalRect());
            points = this._rotatePointList(points,angle,rect);
        }
        var rotatedPoint = points.get(0);
        var rotatedRect = {x: rotatedPoint.x - width / 2, y: rotatedPoint.y - width / 2, width: width, height: width};
        var outlineWidth = this._network.getRotatePointOutlineWidth();
        var offset = this.rotatePointSize + outlineWidth;
        $math.grow(rect, offset, offset);
        var unionRect = $math.unionRect(node.getRect(),rotatedRect);
        // this._viewRect = $math.unionRect(unionRect, this._viewRect);
        this.rotatePoints = points;
    },
    _addShapeNodePoint: function (shapeNode) {
        var points = this._network.zoomManager._getShapeNodeZoomPoints(this.getElementUI(),shapeNode.getPoints());
        // this._addEditPoints(shapeNode.getPoints());
        this._addEditPoints(points);
    },
    _addShapeLinkPoints: function (shapeLink) {
        var points = this._network.zoomManager._getShapeLinkZoomPoints(shapeLink.getPoints());
        // this._addEditPoints(shapeLink.getPoints());
        this._addEditPoints(points);
    },
    _addLinkControlPoint: function (linkUI) {
        var points = new twaver.List();
        var fromAgent = linkUI._element.getFromAgent();
        var fromNode;
        if(fromAgent){
          fromNode = linkUI._element.getFromAgent();
        }else{
          fromNode = linkUI._element.getFromNode();
        }
        var fromXoffset = linkUI._element.getStyle("link.from.xoffset");
        var fromYoffset = linkUI._element.getStyle("link.from.yoffset");
        var fromCenterPoint = fromNode.getCenterLocation();
        var fromPoint = {
          x: fromCenterPoint.x + fromXoffset,
          y: fromCenterPoint.y + fromYoffset
        }
        points.add(fromPoint);
        var toAgent = linkUI._element.getToAgent();
        var toNode;
        if(toAgent){
          toNode = linkUI._element.getToAgent();
        }else{
          toNode = linkUI._element.getToNode();
        }
        var toXoffset = linkUI._element.getStyle("link.to.xoffset");
        var toYoffset = linkUI._element.getStyle("link.to.yoffset");
        var toCenterPoint = toNode.getCenterLocation();
        var toPoint = {
          x: toCenterPoint.x + toXoffset,
          y: toCenterPoint.y + toYoffset
        }
        points.add(toPoint);
        if ($link.isOrthogonalLink(linkUI._element) && linkUI.getControlPoint()) {
            var controlPoint = linkUI.getControlPoint();
            if (controlPoint) {                                
                points.add(controlPoint);
            }
        }
        this._addEditPoints(points);
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
        // this._viewRect = $math.unionRect(rect, this._viewRect);

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