twaver.network.LabelAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.LabelAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.network.LabelAttachment', twaver.network.BasicAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        this._textSize = $g.getTextSize(font, text);
        var g = twaver.network.LabelAttachment.superClass.updateMeasure.call(this);
        var align = this._element.getStyle("label.align");
		$g.drawText(g, text, this._contentRect, font, this.getStyle('label.color'),align);
    },
    getLabel: function () {
        return this._network.getLabel(this._element);
    },
    getContentWidth: function () {
        return this._textSize ? this._textSize.width : 0;
    },
    getContentHeight: function () {
        return this._textSize ? this._textSize.height : 0;
    },
    getCornerRadius: function () {
        return this.getStyle('label.corner.radius');
    },
    getPointerLength: function () {
        return this.getStyle('label.pointer.length');
    },
    getPointerWidth: function () {
        return this.getStyle('label.pointer.width');
    },
    getPosition: function () {
        return this.getStyle('label.position');
    },
    getXOffset: function () {
        return this.getStyle('label.xoffset');
    },
    getYOffset: function () {
        return this.getStyle('label.yoffset');
    },
    getPadding: function () {
        return this.getStyle('label.padding');
    },
    getPaddingLeft: function () {
        return this.getStyle('label.padding.left');
    },
    getPaddingRight: function () {
        return this.getStyle('label.padding.right');
    },
    getPaddingTop: function () {
        return this.getStyle('label.padding.top');
    },
    getPaddingBottom: function () {
        return this.getStyle('label.padding.bottom');
    },
    getDirection: function () {
        return this.getStyle('label.direction');
    },
    isFill: function () {
        return this.getStyle('label.fill');
    },
    getFillColor: function () {
        return this.getStyle('label.fill.color');
    },
    getGradient: function () {
        return this.getStyle('label.gradient');
    },
    getGradientColor: function () {
        return this.getStyle('label.gradient.color');
    },
    getOutlineWidth: function () {
        return this.getStyle('label.outline.width');
    },
    getOutlineColor: function () {
        return this.getStyle('label.outline.color');
    },
    getCap: function () {
        return this.getStyle('label.cap');
    },
    getJoin: function () {
        return this.getStyle('label.join');
    },
    getAlpha: function () {
        return this.getStyle('label.alpha');
    },
    isShadowable: function () {
        return this.getStyle('label.shadowable');
    }
});
