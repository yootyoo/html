twaver.vector.NodeUI = function(network, element) {
	twaver.vector.NodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.NodeUI', twaver.vector.ElementUI, {
	invalidate : function(checkAttachments) {
        if(this.curInterval) {
            clearInterval(this.curInterval);
        }
		twaver.vector.NodeUI.superClass.invalidate.call(this,checkAttachments);
	},
	createBodyRect : function() {
		return this._element.getRect();
	},
	validateImpl : function() {
		twaver.vector.NodeUI.superClass.validateImpl.call(this);
		var shape = this.getStyle('vector.shape');
		var rect = this.getBodyRect();
		this._hotSpot = $math.getHotSpot(rect.x, rect.y, rect.width, rect.height, shape);
		this.validateBodyBounds();
	},
	validate : function() {
		if (this._invalidateFlag == false) {
			return;
		}
		twaver.vector.NodeUI.superClass.validate.call(this);
	},
	validateBodyBounds : function() {
		var type = this.getStyle('body.type');
		if (type === 'default') {
			this.addBodyBounds(this.getDefaultBodyRect());
		} else if (type === 'vector') {
			this.addBodyBounds(this.getVectorBody());
		} else if (type === 'default.vector') {
			this.addBodyBounds(this.getVectorBody());
			this.addBodyBounds(this.getDefaultBodyRect());
		} else if (type === 'vector.default') {
			this.addBodyBounds(this.getDefaultBodyRect());
			this.addBodyBounds(this.getVectorBody());
		}
		if (this._outerColor  && this.getStyle('outer.style') === 'border') {
			this.addBodyBounds(this.getOuterBorderRect());
		}
		if (!this._editAttachment && this.getStyle('select.style') === 'border' && this._network.isSelected(this._element)) {
			this.addBodyBounds(this.getSelectBorderRect());
		}
	},
	getDefaultBodyRect : function() {
		var node = this._element;
		var rect = this.getBodyRect();
		if (!node.getImage() || typeof node.getImage() === 'string' && !_twaver.getImageAsset(node.getImage())) {
			return rect;
		}
		$math.addPadding(rect, this._element, 'image.padding', 1);
		var bounds = _twaver.cloneRect(rect);
		this.appendGlowBound(this, bounds);
		this.appendShadowBound(this, bounds);
		rect = bounds;
		return rect;
	},
	getVectorBody : function() {
		var rect = this.getPathRect("vector");
		return rect;
	},
	getOuterBorderRect : function() {
		return this._getBorderRect("outer");
	},
	getSelectBorderRect : function() {
		return this._getBorderRect("select");
	},
	_getBorderRect : function(prefix) {
		var node = this._element;
		var lineWidth = node.getStyle(prefix + '.width');
		if (lineWidth > 0) {
			var rect = this.getBodyRect();
			$math.addPadding(rect, node, prefix + '.padding', 1);
			var bounds = _twaver.cloneRect(rect);
			$math.grow(bounds, lineWidth * 2, lineWidth * 2);
			return bounds;
		}
		return null;
	},
	getPathRect : function(prefix, padding) {
		var node = this._element;
		var rect = this.getBodyRect();
		// var rect = this.getZoomBodyRect();
		var sizeZoom = this._network.zoomManager.getSizeZoom();
		if (padding) {
			$math.addPadding(rect, node, prefix + '.padding', 1);
		}
		var bounds = _twaver.cloneRect(rect);
		var lineWidth = node.getStyle(prefix + '.outline.width');
		if (lineWidth > 0) {
			if (this._getZoomPoints) {
				// var points = this._getZoomPoints();
				var points = this._element._points;
				var size = points.size();
				var maxD = 0;
				for(var i=0;i<size;i++){
					if(i == 0){
						var p = points.get(i);
						var preP = points.get(size -1);
						var nextP = points.get(i+1);
					}else if(i == size-1){
						var p = points.get(i);
						var preP = points.get(i-1);
						var nextP = points.get(0);
					}else{
						var p = points.get(i);
						var preP = points.get(i-1);
						var nextP = points.get(i+1);
					}
					var centerP = $math.getCenterPoint(preP,nextP);
					var angle = $math.getAngle(centerP,p);
					var d = Math.abs(10 / 2 * (lineWidth + 1) * Math.sin(angle));
					maxD = maxD < d? d:maxD;
					d = Math.abs(10 / 2 * (lineWidth + 1) * Math.cos(angle));
					maxD = maxD < d? d:maxD;
				}
				$math.grow(bounds, maxD,maxD);
			} else {
				$math.grow(bounds, lineWidth /2, lineWidth /2);
			}
		}
		this.appendGlowBound(this, bounds);
		this.appendShadowBound(this, bounds);
		return bounds;
	},
	getZoomPathRect : function(prefix, padding) {
		var node = this._element;
		var rect = this.getZoomBodyRect();
		var sizeZoom = this._network.zoomManager.getSizeZoom();
		if (padding) {
			$math.addPadding(rect, node, prefix + '.padding', 1);
		}
		var bounds = _twaver.cloneRect(rect);
		var lineWidth = node.getStyle(prefix + '.outline.width');
		if (lineWidth > 0) {
			if (this._getZoomPoints) {
				var points = this._getZoomPoints();
				var size = points.size();
				var maxD = 0;
				for(var i=0;i<size;i++){
					if(i == 0){
						var p = points.get(i);
						var preP = points.get(size -1);
						var nextP = points.get(i+1);
					}else if(i == size-1){
						var p = points.get(i);
						var preP = points.get(i-1);
						var nextP = points.get(0);
					}else{
						var p = points.get(i);
						var preP = points.get(i-1);
						var nextP = points.get(i+1);
					}
					var centerP = $math.getCenterPoint(preP,nextP);
					var angle = $math.getAngle(centerP,p);
					var d = Math.abs(10 / 2 * (lineWidth + 1) * Math.sin(angle));
					maxD = maxD < d? d:maxD;
					d = Math.abs(10 / 2 * (lineWidth + 1) * Math.cos(angle));
					maxD = maxD < d? d:maxD;
				}
				$math.grow(bounds, maxD,maxD);
			} else {
				$math.grow(bounds, lineWidth /2, lineWidth /2);
			}
		}
		this.appendGlowBound(this, bounds);
		this.appendShadowBound(this, bounds);
		return bounds;
	},
	paintBody : function(ctx) {
		if(this._network.hasEditInteraction() && this._network.isEditable(this._element) && this.isEditable()){
        if(this._network.isSelected(this._element)){
	          var box = this._network.getElementBox();
	          var newIndex;
	          var i;
	          var dataList = box.getDatas();
	          for(i=0;i<dataList.size();i++){
		            if(dataList.get(i) instanceof twaver.Link){
		              var toNode = dataList.get(i).getToNode();
		              var fromNode = dataList.get(i).getFromNode();
		              box.adjustElementIndex(fromNode);
		              box.adjustElementIndex(toNode);
		            }
	          }
        }        
    }
    if(this.curInterval) {
        clearInterval(this.curInterval);
    }
		var type = this.getStyle('body.type');
		if (type === 'default') {
			this.drawDefaultBody(ctx);
		} else if (type === 'vector') {
			this.drawVectorBody(ctx);
		} else if (type === 'default.vector') {
			this.drawVectorBody(ctx);
			this.drawDefaultBody(ctx);
		} else if (type === 'vector.default') {
			this.drawDefaultBody(ctx);
			this.drawVectorBody(ctx);
		}
		if (this._outerColor && this.getStyle('outer.style') === 'border') {
			this.drawOuterBorder(ctx);
		}
		if (this.getStyle('select.style') === 'border' && this._network.isSelected(this._element)) {
			this.drawSelectBorder(ctx);
		}
	},
	drawOuterBorder : function(ctx) {
		var node = this._element;
		var lineWidth = node.getStyle('outer.width');
		if (lineWidth > 0) {
			var rect = this.getZoomBodyRect();
			$math.addPadding(rect, node, 'outer.padding', 1);
			ctx.lineWidth = lineWidth;
			ctx.lineCap = node.getStyle('outer.cap');
			ctx.lineJoin = node.getStyle('outer.join');
			ctx.strokeStyle = this._outerColor;
			$g.drawVector(ctx, node.getStyle('outer.shape'), null, rect);
			ctx.stroke();
		}
	},
	drawDefaultBody : function(ctx) {
		var node = this._element;
		var imageAsset;
		if (!node.getImage() || typeof node.getImage() === 'string' && !(imageAsset = _twaver.getImageAsset(node.getImage()))) {
			return;
		}
		var rect = this.getZoomBodyRect();
		$math.addPadding(rect, this._element, 'image.padding', 1);
		if(node.getAngle() != 0) {
			ctx.save();
			rect = node.getOriginalRect();
			rect = this._network.zoomManager._getElementZoomRect(this,rect);
			twaver.Util.rotateCanvas(ctx, rect, node.getAngle());
		}
		this.setGlow(this, ctx);
		this.setShadow(this, ctx);
		var self = this;
		if(imageAsset && imageAsset.getImage() instanceof _gif) {
			var frames = imageAsset.getImage().frames;
			var size = imageAsset.getImage().size;
			var i = 0,curFrame;
			curFrame = getGifFrame(frames,size,0);
			ctx.drawImage(curFrame, rect.x ,rect.y, rect.width, rect.height);
			this.curInterval = setInterval(function() {
				i = (i + frames.length) % frames.length;
				curFrame = getGifFrame(frames,size,i);
				ctx.drawImage(curFrame, rect.x ,rect.y, rect.width, rect.height);
				i++;
			},100);
		} else {
			drawImage(ctx, node.getImage(), this.getInnerColor(), rect, node, this._network);
		}
		if(node.getAngle() != 0) {
			ctx.restore();
		}
	},
	drawSelectBorder : function(ctx) {
		this.clearGlow(ctx);
		var node = this._element;
		var lineWidth = node.getStyle('select.width');
		if (lineWidth > 0) {
			var rect = this.getZoomBodyRect();
			$math.addPadding(rect, node, 'select.padding', 1);

			var bounds = _twaver.cloneRect(rect);
			$math.grow(bounds, lineWidth / 2, lineWidth / 2);

			ctx.lineWidth = lineWidth;
			ctx.lineCap = node.getStyle('select.cap');
			ctx.lineJoin = node.getStyle('select.join');
			ctx.strokeStyle = node.getStyle('select.color');
			$g.drawVector(ctx, node.getStyle('select.shape'), null, rect);
			ctx.stroke();
		}
	},
	drawVectorBody : function(ctx) {
		this.drawPath(ctx, 'vector', true, this._element.getStyle('vector.outline.pattern'));
		var deep = this.getStyle('vector.deep');
		var fillColor = this.getStyle('vector.fill.color');
		if (deep !== 0 && fillColor) {
			if (this.getStyle('vector.shape') === 'rectangle') {
				var rect = this.getZoomBodyRect();
				var angle = this._element.getAngle();
				if (angle != 0) {
					ctx.save();
					var r = this._element.getOriginalRect();
					r = this._network.zoomManager._getElementZoomRect(this, r);
					twaver.Util.rotateCanvas(ctx, r, angle);
				}
				$g.draw3DRect(ctx, fillColor, deep, rect);
				if (angle != 0) {
					ctx.restore();
				}
			}
		}
	},
	
	
	drawPath : function(ctx, prefix, padding, pattern, points, segments, close) {
		var zoomManager = this._network.zoomManager;
		var node = this._element;
		var rect = null;
		if (prefix == 'group') {
			rect = this._shapeRect;
		} else {
			rect = this.getZoomBodyRect();
		};
		if (padding) {
			$math.addPadding(rect, node, prefix + '.padding', 1);
		}
		var lineWidth = node.getStyle(prefix + '.outline.width');
		this.setGlow(this, ctx);
		this.setShadow(this, ctx);
		if (node.getAngle() != 0) {
			if (!( node instanceof $Group)) {
				rect = node.getOriginalRect();
				rect = zoomManager._getElementZoomRect(this, rect);
			}
			ctx.save();
			twaver.Util.rotateCanvas(ctx, rect, node.getAngle());
		}
		var fill = node.getStyle(prefix + '.fill');
		var fillColor;
		if (fill) {
			if (this._innerColor && !$element.hasDefault(this._element)) {
				fillColor = this._innerColor;
			} else {
				fillColor = node.getStyle(prefix + '.fill.color');
			}
			var gradient = node.getStyle(prefix + '.gradient');
			if (gradient) {
				$g.fill(ctx, fillColor, gradient, node.getStyle(prefix + '.gradient.color'), rect);
			} else {
				ctx.fillStyle = fillColor;
			}
		}
		var shape = node.getStyle(prefix + '.shape');
		var roundRectRadiusValue = node.getStyle("group.shape.roundrect.radius");
		if (fill) {
			ctx.beginPath();
			if (points) {
				$g.drawLinePoints(ctx, points, null, segments, close);
			} else {
				if(shape === "roundrect" && prefix ==="group"){
          $g.drawVector(ctx, shape, null, rect, roundRectRadiusValue);
				}else{
					$g.drawVector(ctx, shape, null, rect);
				}
			}
			ctx.fill();
		}
		if (lineWidth > 0) {
			ctx.lineWidth = lineWidth;
			ctx.lineCap = node.getStyle(prefix + '.cap');
			ctx.lineJoin = node.getStyle(prefix + '.join');
			ctx.strokeStyle = node.getStyle(prefix + '.outline.color');
			ctx.beginPath();
			if (points) {
				$g.drawLinePoints(ctx, points, pattern, segments, close);
			} else {
				if(shape === "roundrect" && prefix ==="group"){
          $g.drawVector(ctx, shape, pattern, rect, roundRectRadiusValue);
        }else{
        	$g.drawVector(ctx, shape, pattern, rect);
        }
			}
			ctx.stroke();
		}
		if (node.getAngle() != 0) {
			ctx.restore();
		}
	},
	hit : function(x, y) {
    var targetRect = { x: x, y: y, width: 0, height: 0 };
    var tolerance = this._network.getSelectionTolerance();
    if (tolerance && tolerance > 0) {        
      $math.grow(targetRect, tolerance, tolerance);
    }
    if (this._network._transparentSelectionEnable) {
        var bodyRect = this.getBodyRect();
        if(_twaver.math.intersects(bodyRect, targetRect)){
        	return true;
        }
    }
		if($math.intersects(this.getZoomViewRect(), targetRect)){
			return this.hitCanvasPoint(x, y);
		}
		
		return false;
	},
	intersects : function(r) {
		var it = twaver.vector.NodeUI.superClass.intersects.apply(this, arguments);
		if (it == true) {
			return true;
		}
        if (this._network._transparentSelectionEnable) {
            var bodyRect = this.getBodyRect();
            if (_twaver.math.intersects(bodyRect, r)) {
                return true;
            }
        }
        if ($math.intersects(r, this.getZoomViewRect())){
			return this.hitCanvasRect(r);
		}
		return false;
	}
});
