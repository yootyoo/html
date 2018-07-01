twaver.canvas.ElementUI = function (network, element) {
    this._network = network;
    this._element = element;

    this._attachments = new twaver.List();
    this._bodyBounds = new twaver.List();
    this._hitTest = false;
    this._hitTest = false;
    this._intersectTest = false;
    this.invalidate(true);
}
_twaver.ext('twaver.canvas.ElementUI', Object, {
    getElement: function () {
        return this._element;
    },
    getNetwork: function () {
        return this._network;
    },
    handlePropertyChange: function (e) {
        this.invalidate(true);
    },
    handleSelectionChange: function (e) {
        this.invalidate(true);
    },
    //validate
    invalidate: function (checkAttachments) {
        if (checkAttachments === undefined) {
            checkAttachments = true;
        }
        if (checkAttachments) {
            this._invalidateAttachmentsFlag = true;
        }
        if (this._invalidateFlag) {
            return;
        }
        this._hotSpot = null;
        this._bodyRect = null;
        this._invalidateFlag = true;
        this._network.invalidateElementVisibility();
    },
    //update the style attribute.
    updateStyle: function () {
        this._innerColor = this._network.getInnerColor(this._element);
        this._outerColor = this._network.getOuterColor(this._element);
        this._shadowColor = this._network.getShadowColor(this._element);
        this._shadowXOffset = this._element.getStyle('shadow.xoffset');
        this._shadowYOffset = this._element.getStyle('shadow.yoffset');
        this._shadowBlur = this._element.getStyle('shadow.blur');
        this._wholeAlpha = this._element.getStyle('whole.alpha');
    },
    validate: function () {
        if (this._invalidateFlag == false) {
            return;
        }
        this._bodyBounds.clear();
        if (this._invalidateAttachmentsFlag) {
            this._invalidateAttachmentsFlag = false;
            this.checkAttachments();
        }
        this._invalidateFlag = false;

        this.updateStyle();
        //calc body bounds
        this.validateImpl();

        this._attachments.forEach(function (attachment) {
            attachment.validate();
        });

        var unionRect;
        this._bodyBounds.forEach(function (rect) {
            unionRect = $math.unionRect(unionRect, rect);
        });
        //body size，include border and select 
        this._unionBodyBounds = _twaver.clone(unionRect);

        // update view rect 
        this._attachments.forEach(function (attachment) {
            unionRect = $math.unionRect(unionRect, attachment.getViewRect());
        });
        //the whole size of the ui
        this._viewRect = unionRect;
    },
    validateImpl: function () {

    },
    setShadow: function (part, ctx) {
        var shadowable = part.isShadowable() && this._shadowColor && !this._editAttachment;
        if (ctx.shadowOffsetX === this._shadowXOffset && ctx.shadowOffsetY === this._shadowYOffset && ctx.shadowBlur === this._shadowBlur) {
            return ctx;
        }
        if (shadowable || this._network._showShadowInEdit) {
            ctx.shadowOffsetX = this._shadowXOffset;
            ctx.shadowOffsetY = this._shadowYOffset;
            ctx.shadowBlur = this._shadowBlur;
            ctx.shadowColor = this._shadowColor;
        }
        return ctx;
    },
    clearShadow: function (ctx) {
        if (ctx.shadowOffsetX != 0 || ctx.shadowOffsetY != 0 || ctx.shadowBlur != 0) {
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
        }
    },
    //append shadow bound
    appendShadowBound: function (part, rect) {
        var shadowable = part.isShadowable() && this._shadowColor && !this._editAttachment;
        if (shadowable) {
            if (this._shadowXOffset > 0) {
                rect.width += this._shadowXOffset;
            } else {
                rect.x += this._shadowXOffset;
                rect.width += -this._shadowXOffset;
            }
            if (this._shadowYOffset > 0) {
                rect.height += this._shadowYOffset;
            } else {
                rect.y += this._shadowYOffset;
                rect.height += -this._shadowYOffset;
            }
            $math.grow(rect, this._shadowBlur, this._shadowBlur);
        }
        return rect;
    },
    isShadowable: function () {
        if (this._shadowColor && this._network.isSelected(this._element) && this._element.getStyle('select.style') === 'shadow') {
            return true;
        }
        return false;
    },

    //attachment
    addAttachment: function (attachment) {
        this._attachments.add(attachment);
        //this.invalidate(false);
    },
    removeAttachment: function (attachment) {
        this._attachments.remove(attachment);
        //this.invalidate(false);
    },
    getAttachments: function () {
        return this._attachments;
    },
    checkAttachments: function () {
        this.checkLabelAttachment();
        this.checkAlarmAttachment();
        this.checkIconsAttachment();
        this.checkEditAttachment();
    },

    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new twaver.canvas.LabelAttachment(this, $Defaults.SHOW_LABEL_IN_ATTACHMENT_DIV);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
    checkAlarmAttachment: function () {
        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new twaver.canvas.AlarmAttachment(this, $Defaults.SHOW_ALARM_IN_ATTACHMENT_DIV);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    },
    checkIconsAttachment: function () {
        var icons = this._network.getIconsNames(this._element);
        if (icons && icons.length > 0) {
            if (!this._iconsAttachment) {
                this._iconsAttachment = new twaver.canvas.IconsAttachment(this);
                this.addAttachment(this._iconsAttachment);
            }
        } else {
            if (this._iconsAttachment) {
                this.removeAttachment(this._iconsAttachment);
                this._iconsAttachment = null;
            }
        }
    },
    checkEditAttachment: function () {
        if (this._network.hasEditInteraction() && this._network.isSelected(this._element) && this._network.isEditable(this._element) && this.isEditable()) {
            if (!this._editAttachment) {
                this._editAttachment = new twaver.canvas.EditAttachment(this);
                this.addAttachment(this._editAttachment);
            }
        } else {
            if (this._editAttachment) {
                this.removeAttachment(this._editAttachment);
                this._editAttachment = null;
            }
        }
    },
    getLabelAttachment: function () {
        return this._labelAttachment;
    },
    getAlarmAttachment: function () {
        return this._alarmAttachment;
    },
    getIconsAttachment: function () {
        return this._iconsAttachment;
    },
    getEditAttachment: function () {
        return this._editAttachment;
    },
    isEditable: function () {
        return true;
    },
    getInnerColor: function () {
        return this._innerColor;
    },
    getOuterColor: function () {
        return this._outerColor;
    },
    getShadowColor: function () {
        return this._shadowColor;
    },
    getDyeColor: function (styleProp) {
        if (this._innerColor) {
            return this._innerColor;
        }
        return this.getStyle(styleProp);
    },
    getStyle: function (styleProp) {
        return this._element.getStyle(styleProp);
    },
    getFont: function (styleProp) {
        var font = this._element.getStyle(styleProp);
        return font ? font : twaver.Defaults.FONT;
    },
    //paint 
    paint: function (ctx) {
        ctx.save();
        ctx.globalAlpha = this._wholeAlpha;
        ctx.beginPath();
        this.paintBody(ctx);
        this.clearShadow(ctx);
        ctx.closePath();
        ctx.beginPath();
        this.paintAttachments(ctx);
        ctx.closePath();
        ctx.restore();
    },
    paintBody: function (ctx) {

    },
    paintAttachments: function (ctx) {
        ctx.beginPath();
        var size = this._attachments.size();
        for (var i = 0; i < size; i++) {
            var att = this._attachments.get(i);
            if (this._hitTest == true) {
                if (att.isShowOnTop() == false) {
                    this.paintAttachment(ctx, att);
                }
            }
            if (this._intersectTest == true) {
                this.paintAttachment(ctx, att);
            }
            if (this._hitTest == false && this._intersectTest == false) {
                if (att.isShowOnTop()) {
                    this._network._topAttachmentList.add(att);
                } else {
                    this.paintAttachment(ctx, att);
                }
            }
        }
    },
    paintAttachment: function (ctx, att) {
        ctx.beginPath();
        att.paint(ctx);
        this.clearShadow(ctx);
    },
    /*
    * Get the bounds of the whole ui
    */
    getViewRect: function () {
        return _twaver.clone(this._viewRect);
    },
    getUnionBodyBounds: function () {
        return _twaver.clone(this._unionBodyBounds);
    },
    addBodyBounds: function (rect) {
        if (rect) {
            this._bodyBounds.add(rect);
        }
    },
    getBodyRect: function () {
        if (!this._bodyRect) {
            this._bodyRect = this.createBodyRect();
        }
        return _twaver.clone(this._bodyRect);
    },

    //hot spot
    getHotSpot: function () {
        if (this._hotSpot) {
            return _twaver.clone(this._hotSpot);
        }
        return {
            x: 0,
            y: 0
        };
    },
    setHotSpot: function (value) {
        this._hotSpot = value;
    },
    //hit interaction--getElementAt(e)
    hit: function (x, y) {
        return false;
    },
    //rect select--getELementsAtRect(rect);
    intersects: function (r) {
        if ($math.contains(r, this.getViewRect())) {
            return true;
        }
        return false;
    },
    /*
    * 1 true
    * -1 false
    * 0 exceptipn
    */
    hitCanvasRectAtBody: function (rect) {
        var cvs = $CanvasUtil.getHitCanvas(rect.width, rect.height);
        var ctx = $CanvasUtil.getCtx(cvs);
        ctx.save();
        ctx.translate(-rect.x, -rect.y);
        if(this._element.getImage) {
            var imageAsset = _twaver.getImageAsset(this._element.getImage());
            if(imageAsset && imageAsset.getImage() instanceof _gif) {
                return 1;
            }
        }
        this.paintBody(ctx);
        try {
            var imageData = ctx.getImageData(0, 0, rect.width, rect.height);
            var pixs = imageData.data;
            for (var c = 0; c < imageData.width; c++) {
                for (var r = 0; r < imageData.height; r++) {
                    var index = 4 * (r * imageData.width + c);
                    var a = pixs[index + 3];
                    if (a !== 0) {
                        ctx.restore();
                        return 1;
                    }
                }
            }
        } catch (e) {
            $CanvasUtil.disposeHitCanvas();
            if ($math.contains(this.getUnionBodyBounds(), rect)) {
                return 0;
            }
        }
        ctx.restore();
        return -1;
    },
    hitCanvasRectAtAttachments: function (rect) {
        var cvs = $CanvasUtil.getHitCanvas(rect.width, rect.height);
        var ctx = $CanvasUtil.getCtx(cvs);
        ctx.save();
        ctx.translate(-rect.x, -rect.y);
        this.paintAttachments(ctx);
        try {
            var imageData = ctx.getImageData(0, 0, rect.width, rect.height);
            var pixs = imageData.data;
            for (var c = 0; c < imageData.width; c++) {
                for (var r = 0; r < imageData.height; r++) {
                    var index = 4 * (r * imageData.width + c);
                    var a = pixs[index + 3];
                    if (a !== 0) {
                        ctx.restore();
                        return 1;
                    }
                }
            }
        } catch (e) {
            $CanvasUtil.disposeHitCanvas();
        }
        ctx.restore();
        return -1;
    },
    hitCanvasRect: function (r) {
        this._intersectTest = true;
        if (this._hitTest == true) {
            this._intersectTest = false;
        }
        var rect = $math.intersection(r, this._viewRect);
        var bh = this.hitCanvasRectAtBody(rect);
        if (bh == 1) {
            this._intersectTest = false;
            return true;
        }
        var ah = this.hitCanvasRectAtAttachments(rect);
        if (ah == 1) {
            this._intersectTest = false;
            return true;
        }
        this._intersectTest = false;
        return bh == 0;
    },
    hitCanvasPoint: function (x, y) {
        var targetRect = { x: x, y: y, width: 0, height: 0 };
        var tolerance = this._network.getSelectionTolerance();
        if (tolerance && tolerance > 0) {        
          $math.grow(targetRect, tolerance, tolerance);
        }
        if (!$math.intersects(this._viewRect, targetRect)) {
            return false;
        }
        this._hitTest = true;
        var h = this.hitCanvasRect(targetRect);
        this._hitTest = false;
        return h;
    },
    hitTest: function (x, y) {
        var targetRect = { x: x, y: y, width: 0, height: 0 };
        var tolerance = this._network.getSelectionTolerance();
        if (tolerance && tolerance > 0) {        
            $math.grow(targetRect, tolerance, tolerance);
        }
        if (!$math.intersects(this._viewRect, targetRect)) {
            return null;
        }
        var rect = $math.intersection(targetRect, this._viewRect);
        var bh = this.hitCanvasRectAtBody(rect);
        if (bh == 1) {
            return this;
        }

        var size = this._attachments.size();
        for (var i = 0; i < size; i++) {
            var att = this._attachments.get(i);
            if (att.hit(x, y)) {
                return att;
            }
        }
        if (bh == 0) {
            return this;
        }
        return null;
    },
    dispose: function () {
        this._attachments.forEach(function (attachment) {
            attachment.dispose();
        });
        this._attachments.clear();
    },
});

