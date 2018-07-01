twaver.vector.LinkHandlerAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.vector.LinkHandlerAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.vector.LinkHandlerAttachment', twaver.vector.BasicAttachment, {
    paint: function (ctx) {
    	var zoomManager = this._network.zoomManager;
        twaver.vector.LinkHandlerAttachment.superClass.paint.apply(this, arguments);
        // $g.drawText(ctx, this.linkHandlerLabel, this._contentRect, this.linkHandlerFont, this.getStyle('link.handler.color'));
        var rect = zoomManager._getAttachmentZoomRect(this,this._contentRect);
        zoomManager._drawText(this,ctx,this.linkHandlerLabel,rect,this.linkHandlerFont,this.getStyle('link.handler.color'));
    },
    validate: function () {
        this.linkHandlerFont = this.getFont('link.handler.font');
        this.linkHandlerLabel = this._network.getLinkHandlerLabel(this._element);
        this._textSize = $g.getTextSize(this.linkHandlerFont, this.linkHandlerLabel);
        twaver.vector.LinkHandlerAttachment.superClass.validate.call(this);
    },
    getContentWidth: function () {
        return this._textSize ? this._textSize.width : 0;
    },
    getContentHeight: function () {
        return this._textSize ? this._textSize.height : 0;
    },
    getCornerRadius: function () {
        return this.getStyle('link.handler.corner.radius');
    },
    getPointerLength: function () {
        return this.getStyle('link.handler.pointer.length');
    },
    getPointerWidth: function () {
        return this.getStyle('link.handler.pointer.width');
    },
    getPosition: function () {
        return this.getStyle('link.handler.position');
    },
    getXOffset: function () {
        return this.getStyle('link.handler.xoffset');
    },
    getYOffset: function () {
        return this.getStyle('link.handler.yoffset');
    },
    getPadding: function () {
        return this.getStyle('link.handler.padding');
    },
    getPaddingLeft: function () {
        return this.getStyle('link.handler.padding.left');
    },
    getPaddingRight: function () {
        return this.getStyle('link.handler.padding.right');
    },
    getPaddingTop: function () {
        return this.getStyle('link.handler.padding.top');
    },
    getPaddingBottom: function () {
        return this.getStyle('link.handler.padding.bottom');
    },
    getDirection: function () {
        return this.getStyle('link.handler.direction');
    },
    isFill: function () {
        return this.getStyle('link.handler.fill');
    },
    getFillColor: function () {
        return this.getStyle('link.handler.fill.color');
    },
    getGradient: function () {
        return this.getStyle('link.handler.gradient');
    },
    getGradientColor: function () {
        return this.getStyle('link.handler.gradient.color');
    },
    getOutlineWidth: function () {
        return this.getStyle('link.handler.outline.width');
    },
    getOutlineColor: function () {
        return this.getStyle('link.handler.outline.color');
    },
    getCap: function () {
        return this.getStyle('link.handler.cap');
    },
    getJoin: function () {
        return this.getStyle('link.handler.join');
    },
    getAlpha: function () {
        return this.getStyle('link.handler.alpha');
    },
    isShadowable: function () {
        return this.getStyle('link.handler.shadowable');
    }
});
