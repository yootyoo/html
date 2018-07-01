twaver.canvas.AlarmAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.canvas.AlarmAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.canvas.AlarmAttachment', twaver.canvas.BasicAttachment, {
    paint: function (ctx) {
        twaver.canvas.AlarmAttachment.superClass.paint.apply(this, arguments);
        $g.drawText(ctx, this.text, this._contentRect, this.font, this.getStyle('alarm.color'));
    },
    validate: function () {
        this.font = this.getFont('alarm.font');
        this.text = this._network.getAlarmLabel(this._element);
        this._textSize = $g.getTextSize(this.font, this.text);
        this._fillColor = this._network.getAlarmFillColor(this._element);
        twaver.canvas.LabelAttachment.superClass.validate.call(this);
    },
    getContentWidth: function () {
        return this._textSize ? this._textSize.width : 0;
    },
    getContentHeight: function () {
        return this._textSize ? this._textSize.height : 0;
    },
    getCornerRadius: function () {
        return this.getStyle('alarm.corner.radius');
    },
    getPointerLength: function () {
        return this.getStyle('alarm.pointer.length');
    },
    getPointerWidth: function () {
        return this.getStyle('alarm.pointer.width');
    },
    getPosition: function () {
        return this.getStyle('alarm.position');
    },
    getXOffset: function () {
        return this.getStyle('alarm.xoffset');
    },
    getYOffset: function () {
        return this.getStyle('alarm.yoffset');
    },
    getPadding: function () {
        return this.getStyle('alarm.padding');
    },
    getPaddingLeft: function () {
        return this.getStyle('alarm.padding.left');
    },
    getPaddingRight: function () {
        return this.getStyle('alarm.padding.right');
    },
    getPaddingTop: function () {
        return this.getStyle('alarm.padding.top');
    },
    getPaddingBottom: function () {
        return this.getStyle('alarm.padding.bottom');
    },
    getDirection: function () {
        return this.getStyle('alarm.direction');
    },
    isFill: function () {
        return this._fillColor != null;
    },
    getFillColor: function () {
        return this._fillColor;
    },
    getGradient: function () {
        return this.getStyle('alarm.gradient');
    },
    getGradientColor: function () {
        return this.getStyle('alarm.gradient.color');
    },
    getOutlineWidth: function () {
        return this.getStyle('alarm.outline.width');
    },
    getOutlineColor: function () {
        return this.getStyle('alarm.outline.color');
    },
    getCap: function () {
        return this.getStyle('alarm.cap');
    },
    getJoin: function () {
        return this.getStyle('alarm.join');
    },
    getAlpha: function () {
        return this.getStyle('alarm.alpha');
    },
    isShadowable: function () {
        return this.getStyle('alarm.shadowable');
    }
});
