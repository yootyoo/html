twaver.canvas.interaction.MagnifyInteraction = function(network, zoom, xRadius, yRadius, shape) {
	twaver.canvas.interaction.MagnifyInteraction.superClass.constructor.call(this, network);
	this.zoom = zoom || 2;
	this.xRadius = xRadius || 100;
	this.yRadius = yRadius || 100;
	this.shape = shape || 'circle';
	this.borderColor = 'black';
	this.borderWidth = 1;
	this.backgroundColor = 'white';
	this.markCanvas = $html.createCanvas();
};
_twaver.ext('twaver.canvas.interaction.MagnifyInteraction', twaver.canvas.interaction.BaseInteraction, {
	setUp : function() {
		this.addListener('mousemove');
		this.network.addMarker(this);
	},
	tearDown : function() {
		this.removeListener('mousemove');
		this.network.removeMarker(this);
	},
	paint : function(g) {
		if (!this.point) {
		    return;
		}
		var zoom = this.network._zoom,
		    scale = this.zoom * zoom,
		    x = this.point.x * zoom - this.network.viewRect.x - this.xRadius,
		    y = this.point.y * zoom - this.network.viewRect.y - this.yRadius,
		    width = this.xRadius * 2,
		    height = this.yRadius * 2,
		    rect = {
    		    x: this.point.x - this.xRadius / scale,
    		    y: this.point.y - this.yRadius / scale,
    		    width: width / scale,
    		    height: height / scale
    		},
    		borderWidth = this.borderWidth,
    		canvas = $html.createCanvas();
		
		canvas.width = width;
		canvas.height = height;
		this.network.toCanvasByRegion(rect, scale, canvas);
    	
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
	handle_mousemove : function(e) {
		this.point = this.network.getLogicalPoint(e);
		if (!this.point) {
			return;
		}
		this.repaint();
	},
	getZoom: function () {
	    return this.zoom;
	},
	setZoom: function (value) {
	    this.zoom = value;
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
