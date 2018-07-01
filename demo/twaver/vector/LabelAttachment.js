twaver.vector.LabelAttachment = function(elementUI, showInAttachmentDiv) {
	twaver.vector.LabelAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.vector.LabelAttachment', twaver.vector.BasicAttachment, {
	paint : function(ctx) {
	    var rotatable = this._element instanceof twaver.Link && this._element.getStyle('link.label.rotatable');
	    if (rotatable) {
            ctx.save();
            var _vewRect = this.getZoomViewRect();
            var x = _vewRect.x + _vewRect.width / 2,
                y = _vewRect.y + _vewRect.height / 2;
            ctx.translate(x, y);
            ctx.rotate(this._network.getElementUI(this._element).getAngle());
            ctx.translate(-x, -y);
        }
		twaver.vector.LabelAttachment.superClass.paint.apply(this, arguments);
		var zoomManager = this._network.zoomManager;
		// if (this.textArr === undefined) {
           var rect = zoomManager._getAttachmentZoomRect(this,this._contentRect);
           var align = this._element.getStyle("label.align");
           zoomManager._drawText(this,ctx,this.text,rect,this.font,this.getStyle('label.color'),align);
		// } else {
			// for (var i in this.textArr) {
                // var rect = zoomManager._getAttachmentZoomRect(this,this._contentRect,i);
                // zoomManager._drawText(this,ctx,this.textArr[i],rect,this.font,this.getStyle('label.color'));
			// }
		// }
		if (rotatable) {
            ctx.restore();
        }

        if(this._network._debug){
        	var attachmentSizeZoom = zoomManager.getAttachmentSizeZoom(this);
            var r = rect;
            r.width *= attachmentSizeZoom;
            r.height *= attachmentSizeZoom;
			$g.strokeRect(ctx, r, '#AAABBB');
		}
	},
	validate : function() {
		this.font = this.getFont('label.font');
        this.text = this.getLabel();
        this._textSize = $g.getTextSize(this.font, this.text);
		twaver.vector.LabelAttachment.superClass.validate.call(this);
	},
	getLabel : function() {
		return this._network.getLabel(this._element);
	},
	getContentWidth : function() {
		return this._textSize ? this._textSize.width : 0;
	},
	getContentHeight : function() {
		return this._textSize ? this._textSize.height : 0;
	},
	getCornerRadius : function() {
		return this.getStyle('label.corner.radius');
	},
	getPointerLength : function() {
		return this.getStyle('label.pointer.length');
	},
	getPointerWidth : function() {
		return this.getStyle('label.pointer.width');
	},
	getPosition : function() {
		return this.getStyle('label.position');
	},
	getXOffset : function() {
		return this.getStyle('label.xoffset');
	},
	getYOffset : function() {
		return this.getStyle('label.yoffset');
	},
	getPadding : function() {
		return this.getStyle('label.padding');
	},
	getPaddingLeft : function() {
		return this.getStyle('label.padding.left');
	},
	getPaddingRight : function() {
		return this.getStyle('label.padding.right');
	},
	getPaddingTop : function() {
		return this.getStyle('label.padding.top');
	},
	getPaddingBottom : function() {
		return this.getStyle('label.padding.bottom');
	},
	getDirection : function() {
		return this.getStyle('label.direction');
	},
	isFill : function() {
		return this.getStyle('label.fill');
	},
	getFillColor : function() {
		return this.getStyle('label.fill.color');
	},
	getGradient : function() {
		return this.getStyle('label.gradient');
	},
	getGradientColor : function() {
		return this.getStyle('label.gradient.color');
	},
	getOutlineWidth : function() {
		return this.getStyle('label.outline.width');
	},
	getOutlineColor : function() {
		return this.getStyle('label.outline.color');
	},
	getCap : function() {
		return this.getStyle('label.cap');
	},
	getJoin : function() {
		return this.getStyle('label.join');
	},
	getAlpha : function() {
		return this.getStyle('label.alpha');
	},
	isShadowable : function() {
		return this.getStyle('label.shadowable');
	},
}); 
