twaver.vector.interaction.CreateLinkInteraction = function(network, typeOrLinkFunction) {
	if (!typeOrLinkFunction) {
		typeOrLinkFunction = twaver.Link;
	}
	if (twaver.Util.isTypeOf(typeOrLinkFunction, twaver.Link)) {
		this.linkFunction = function(fromNode, toNode) {
			var link = new typeOrLinkFunction();
			if ( link instanceof twaver.Link) {
				link.setFromNode(fromNode);
				link.setToNode(toNode);
			}
			return link;
		};
	} else {
		this.linkFunction = typeOrLinkFunction;
	}
	twaver.vector.interaction.CreateLinkInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.vector.interaction.CreateLinkInteraction', twaver.vector.interaction.BaseInteraction, {
	setUp : function() {
		this.addListener('mousedown', 'mousemove');
		this.network.addMarker(this);
	},
	tearDown : function() {
		this.removeListener('mousedown', 'mousemove');
		this.clear();
		this.network.removeMarker(this);
	},
	paint : function(ctx) {
		ctx.beginPath();
		var rect;
		var r;
		ctx.lineWidth = this.network.getEditLineWidth();
		var lineColor = this.network.getEditLineColor();
		if (this.currentNode && this.currentNode !== this.fromNode) {
			rect = this.network.getElementUI(this.currentNode).getZoomViewRect(true);
			r = this.convertFromUIToMarkerRect(rect, 0, 0);
			$CanvasUtil.rect(ctx, r.x, r.y, r.width, r.height, null, lineColor);
		}
		if (this.fromNode) {
			rect = this.network.getElementUI(this.fromNode).getZoomViewRect(true);
			r = this.convertFromUIToMarkerRect(rect, 0, 0);
			$CanvasUtil.rect(ctx, r.x, r.y, r.width, r.height, null, lineColor);
		}
		if (this.currentPoint) {
			this.paintLine(ctx);
		}
		ctx.closePath();
	},

	convertFromUIToMarkerRect : function(vr, xoff, yoff) {
		var zm = this.network.zoomManager;
		var gzoom = zm.getGraphicsZoom();
		return {
			x : vr.x  * gzoom - this.network.getViewRect().x + xoff  * gzoom,
			y : vr.y  * gzoom - this.network.getViewRect().y + yoff  * gzoom,
			width : vr.width  * gzoom,
			height : vr.height  * gzoom
		};
	},
	
	getZoomNodeRectOrPoint : function(node,returnPoint){
		var rect = this.network.getElementUI(node).getZoomBodyRect();
		if(returnPoint){
			return {
				x : rect.x + rect.width/2,
				y : rect.y + rect.height/2
			};
		}
		return rect;
	},

	paintLine : function(ctx) {
		var lineColor = this.network.getEditLineColor();
		var rect = this.network.getElementUI(this.fromNode).getZoomBodyRect();
		var center = this.convertPointFromView({
			x : rect.x + rect.width/2,
			y : rect.y + rect.height/2,
		});
		var x1 = center.x, y1 = center.y;
		var x2 = this.currentPoint.x, y2 = this.currentPoint.y;
		ctx.strokeStyle = lineColor;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	},
	clear : function() {
		this.currentPoint = null;
		this.currentNode = null;
		this.fromNode = null;
		this.toNode = null;
	},
	createLink : function() {
		return this.linkFunction(this.fromNode, this.toNode);
	},
	handle_mousedown : function(e) {
		if (!this.network.isValidEvent(e)) {
			return;
		}
		if (this.fromNode) {
			this.toNode = this.currentNode;
			if (this.toNode) {
				var link = this.createLink();
				if (link) {
					this.network.addElementByInteraction(link);
				}
			}
			this.clear();
		} else {
			this.fromNode = this.currentNode;
			this.currentNode = null;
			this.currentPoint = null;
			this.repaint();
		}
	},
	handle_mousemove : function(e) {
		var point = this.getMarkerPoint(e);
		if (!point) {
			return;
		}
		if (this.network.isMovingElement() || this.network.isEditingElement()) {
			this.clear();
			return;
		}
		var node = null;
		if (this.fromNode) {
			this.currentNode = this.getToNode(e, this.fromNode);
			this.currentPoint = point;
			this.repaint();
		} else {
			node = this.getFromNode(e);
			if (this.currentNode !== node) {
				this.currentNode = node;
				this.repaint();
			}
		}
	},
	getFromNode : function(e) {
		return this.getNode(e);
	},
	getToNode : function(e, fromNode) {
		return this.getNode(e, fromNode);
	},
	getNode: function (e, fromNode) {
        var node = this.network.getElementAt(e);
        if (node instanceof $Node && this.network.isLinkable(node, fromNode)) {
            return node;
        }
        return null;
    }
});
