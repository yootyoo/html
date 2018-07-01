twaver.network.interaction.MagnifyInteraction = function(network, zoom, xRadius, yRadius, shape) {
	twaver.network.interaction.MagnifyInteraction.superClass.constructor.call(this, network);
	this.zoom = zoom || 2;
	this.xRadius = xRadius || 100;
	this.yRadius = yRadius || 100;
	this.shape = shape || 'circle';
	this.borderColor = 'black';
	this.borderWidth = 1;
	this.backgroundColor = 'white';
	this.markCanvas = $html.createCanvas();
	this.markCanvas._isIgnored = true;
};
_twaver.ext('twaver.network.interaction.MagnifyInteraction', twaver.network.interaction.BaseInteraction, {
	setUp : function() {
		this.addListener('mousemove');
	},
	tearDown : function() {
		this.removeListener('mousemove');
		this._clear();
	},
	handle_mousemove : function(e) {
		var point = this.network.getLogicalPoint(e);
		if (!point) {
			return;
		}
		if (!this.lastPoint) {
			this.network.getView().appendChild(this.markCanvas);
		}
		this.lastPoint = point;
		this.updateMark();
	},
	updateMark : function() {
		var zoom = this.network._zoom,
		    scale = this.zoom * zoom,
		    x = this.lastPoint.x * zoom - this.xRadius,
		    y = this.lastPoint.y * zoom - this.yRadius,
		    width = this.xRadius * 2,
		    height = this.yRadius * 2,
		    rect = {
    		    x: this.lastPoint.x - this.xRadius / scale,
    		    y: this.lastPoint.y - this.yRadius / scale,
    		    width: width / scale,
    		    height: height / scale
    		},
    		borderWidth = this.borderWidth,
    		canvas = $html.createCanvas(),
    		g;
		
		canvas.width = width;
		canvas.height = height;
		this.network.toCanvasByRegion(rect, scale, canvas);
    	
		$html.setCanvas(this.markCanvas, x, y, width, height);
		g = this.markCanvas.getContext('2d');
    	g.save();
		g.beginPath();
		$g.drawVector(g, this.shape, null, x, y, width, height);
		g.clip();
		// background
        g.fillStyle = this.backgroundColor;
        g.beginPath();
    	g.rect(x, y, width, height);
    	g.fill();
    	// image
    	g.drawImage(canvas, x, y);
    	g.restore();
    	// border
		g.beginPath();
		g.lineWidth = borderWidth;
		$g.drawVector(g, this.shape, null, x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth);
		g.strokeStyle = this.borderColor;
		g.stroke();
	},
	_clear : function(e) {
		if (this.lastPoint) {
			this.network.getView().removeChild(this.markCanvas);
			this.lastPoint = null;
		}
	},
	getZoom: function () {
	    return this.zoom;
	},
	setZoom: function (value) {
	    this.zoom = value;
	    this.updateMark();
	},
	getShape: function () {
	    return this.shape;
	},
	setShape: function (value) {
	    this.shape = value;
	    this.updateMark();
	},
	getXRadius: function () {
	    return this.xRadius;
	},
	setXRadius: function (value) {
	    this.xRadius = value;
	    this.updateMark();
	},
	getYRadius: function () {
	    return this.yRadius;
	},
	setYRadius: function (value) {
	    this.yRadius = value;
	    this.updateMark();
	},
	getBorderColor: function () {
	    return this.borderColor;
	},
	setBorderColor: function (value) {
	    this.borderColor = value;
	    this.updateMark();
	},
	getBorderWidth: function () {
	    return this.borderWidth;
	},
	setBorderWidth: function (value) {
	    this.borderWidth = value;
	    this.updateMark();
	},
	getBackgroundColor: function () {
	    return this.backgroundColor;
	},
	setBackgroundColor: function (value) {
	    this.backgroundColor = value;
	    this.updateMark();
	}
});
