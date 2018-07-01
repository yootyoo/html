twaver.vector.interaction.MagnifyInteraction = function(network, scale, xRadius, yRadius, shape) {
	twaver.vector.interaction.MagnifyInteraction.superClass.constructor.call(this, network);
	this.scale = scale || 2;
	this.xRadius = xRadius || 100;
	this.yRadius = yRadius || 100;
	this.shape = shape || 'circle';
	this.borderColor = 'black';
	this.borderWidth = 1;
	this.backgroundColor = 'white';
	this.markCanvas = $html.createCanvas();
};
_twaver.ext('twaver.vector.interaction.MagnifyInteraction', twaver.vector.interaction.BaseInteraction, {
	setUp : function() {
		this.addListener('mousemove');
		this.addListener('mousewheel');
		this.network.addMarker(this);
	},
	tearDown : function() {
		this.removeListener('mousemove');
		this.removeListener('mousewheel');
		this.network.removeMarker(this);
	},
	paint : function(ctx) {
		if (this.point) {
			var zm = this.network.zoomManager;
			var locationZoom = zm.getLocationZoom();
			var gzoom = zm.getGraphicsZoom();
			var sizeZoom = zm.getSizeZoom();
			var zoom = this.network.getZoom();
			var halfWidth = this.xRadius / this.scale / gzoom;
			var halfHeight = this.yRadius / this.scale / gzoom;

			if(this.mouseFlag === "mousewheel"){
				var rect = {
					x : this.zoomPoint.x - halfWidth,
					y : this.zoomPoint.y - halfHeight,
					width : halfWidth * 2,
					height : halfHeight * 2
				};
				this.network.toCanvasByRegion(rect, this.scale * gzoom, this.markCanvas,'white');
				var r = {
					x: this.zoomPoint.x  - this.xRadius - this.network.viewRect.x, 
					y: this.zoomPoint.y  - this.yRadius - this.network.viewRect.y,
					width: this.markCanvas.width,
					height: this.markCanvas.height
				}
			}else {
				var rect = {
					x : this.point.x * locationZoom - halfWidth,
					y : this.point.y * locationZoom  - halfHeight,
					width : halfWidth * 2,
					height : halfHeight * 2
				};
				this.network.toCanvasByRegion(rect, this.scale * gzoom, this.markCanvas,'white');
				var r = {
					x: this.point.x * locationZoom * gzoom - this.xRadius - this.network.viewRect.x, 
					y: this.point.y * locationZoom * gzoom - this.yRadius - this.network.viewRect.y,
					width: this.markCanvas.width,
					height: this.markCanvas.height
				}
			}
			ctx.save();
      ctx.beginPath();
      $g.drawVector(ctx, this.shape, null, r.x , r.y, 2 * rect.width * gzoom, 2 * rect.height * gzoom);
      ctx.clip();
      ctx.fillStyle =this.backgroundColor;
      ctx.beginPath();
      ctx.rect(r.x,r.y,r.width,r.height);
      ctx.fill();
      ctx.drawImage(this.markCanvas, r.x, r.y);
      ctx.restore();

      ctx.beginPath();
      ctx.lineWidth = this.borderWidth;
      $g.drawVector(ctx, this.shape, null, r.x + this.borderWidth/2 , r.y + this.borderWidth/2 , 2 * rect.width * gzoom - this.borderWidth, 2 * rect.height * gzoom - this.borderWidth);
      ctx.strokeStyle = this.borderColor;
      ctx.stroke();
      this.mouseFlag = null;
		}
	},
	handle_mousemove : function(e) {
		this.point = this.network.getLogicalPoint(e);
		if (!this.point) {
			return;
		}
		this.mouseFlag = "mousemove";
		this.repaint();
	},
	handle_mousewheel : function(e) {
		var zm = this.network.zoomManager;
		var locationZoom = zm.getLocationZoom();
		if(locationZoom !== 1){
			this.zoomPoint = this.network.getLogicalPoint2(e);
		}
		if (!this.zoomPoint) {
			return;
		}
		this.mouseFlag = "mousewheel";
		this.repaint();
	},
	getScale: function () {
	    return this.scale;
	},
	setScale: function (value) {
	    this.scale = value;
	    this.network.repaintTopCanvas();
	},
	getShape: function () {
	    return this.shape;
	},
	setShape: function (value) {
	    this.shape = value;
	    this.network.repaintTopCanvas();
	},
	getXRadius: function () {
	    return this.xRadius;
	},
	setXRadius: function (value) {
	    this.xRadius = value;
	    this.network.repaintTopCanvas();
	},
	getYRadius: function () {
	    return this.yRadius;
	},
	setYRadius: function (value) {
	    this.yRadius = value;
	    this.network.repaintTopCanvas();
	},
	getBorderColor: function () {
	    return this.borderColor;
	},
	setBorderColor: function (value) {
	    this.borderColor = value;
	    this.network.repaintTopCanvas();
	},
	getBorderWidth: function () {
	    return this.borderWidth;
	},
	setBorderWidth: function (value) {
	    this.borderWidth = value;
	    this.network.repaintTopCanvas();
	},
	getBackgroundColor: function () {
	    return this.backgroundColor;
	},
	setBackgroundColor: function (value) {
	    this.backgroundColor = value;
	    this.network.repaintTopCanvas();
	}
});
