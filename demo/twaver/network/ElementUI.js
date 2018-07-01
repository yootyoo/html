twaver.network.ElementUI = function (network, element) {
    this._view = $html.createDiv();
    this._bodyView = $html.createDiv();
    this._view.appendChild(this._bodyView);
    this._network = network;
    this._element = element;
    this._attachments = new $List();
    this._bodyBounds = new $List();
    this.invalidate(true);
};
_twaver.ext('twaver.network.ElementUI', Object, {
    _invalidateFlag: false,
    _invalidateAttachmentsFlag: false,
    getElement: function () {
        return this._element;
    },
    getNetwork: function () {
        return this._network;
    },
    getAttachments: function () {
        return this._attachments;
    },
    getStyle: function (styleProp) {
        return this._element.getStyle(styleProp);
    },
    getFont: function (styleProp) {
        var font = this._element.getStyle(styleProp);
        return font ? font : $Defaults.FONT;
    },
    getDyeColor: function (styleProp) {
        if (this._innerColor) {
            return this._innerColor;
        }
        return this.getStyle(styleProp);
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
    getHotSpot: function () {
        if (this._hotSpot) {
            return _twaver.clone(this._hotSpot);
        }
        return { x: 0, y: 0 };
    },
    setHotSpot: function (value) {
        this._hotSpot = value;
    },
    getUnionBodyBounds: function () {
        return _twaver.clone(this._unionBodyBounds);
    },
    getBodyRect: function () {
        if (!this._bodyRect) {
            this._bodyRect = this.createBodyRect();
        }
        return _twaver.clone(this._bodyRect);
    },
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
        this._bodyRect = null;
        this._invalidateFlag = true;
        this._network.invalidateElementVisibility();
    },
    updateMeasure: function () {

    },
    validate: function () {
        if (!this._invalidateFlag) {
            return;
        }
        if (this._invalidateAttachmentsFlag) {
            this._invalidateAttachmentsFlag = false;
            this.checkAttachments();
        }
        this._invalidateFlag = false;

        this._bodyBounds.clear();
        $html.clear(this._bodyView);
        this._innerColor = this._network.getInnerColor(this._element);
        this._outerColor = this._network.getOuterColor(this._element);
        this._shadowColor = this._network.getShadowColor(this._element);
        this._shadowXOffset = this._element.getStyle('shadow.xoffset');
        this._shadowYOffset = this._element.getStyle('shadow.yoffset');
        this._shadowBlur = this._element.getStyle('shadow.blur');

        // update body measure
        this.updateMeasure();
        var wholeAlpha = this._element.getStyle('whole.alpha');
        this._view.style.opacity = wholeAlpha;
        // update attachment measure
        this._attachments.forEach(function (attachment) {
            attachment.updateMeasure();

            var attachmentAlpha = attachment.getAlpha();
            if (attachment.isShowInAttachmentDiv()) {
                attachment._view.style.opacity = attachmentAlpha * wholeAlpha;
            } else {
                attachment._view.style.opacity = attachmentAlpha;
            }
        });

        // update union body bounds
        var unionRect;
        this._bodyBounds.forEach(function (rect) {
            unionRect = $math.unionRect(unionRect, rect);
        });
        this._unionBodyBounds = _twaver.clone(unionRect);

        // update view rect 
        this._attachments.forEach(function (attachment) {
            unionRect = $math.unionRect(unionRect, attachment.getViewRect());
        });
        this._viewRect = unionRect;
    },
    cleanUp: function (names) {
        var count = names.length;
        for (var i = 0; i < count; i++) {
            var name = names[i];
            var comp = this[name];
            if (comp && !comp.parentNode) {
                this[name] = null;
            }
        }
    },
    setVisible: function (value) {
        if (this.isVisible() === value) {
            return;
        }
        $html.setVisible(this._view, value);
        this._attachments.forEach(function (attachment) {
            if (attachment.isShowInAttachmentDiv()) {
                $html.setVisible(attachment._view, value);
            }
        });
        this.invalidate(true);
    },
    isVisible: function () {
        return $html.isVisible(this._view);
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
                this._labelAttachment = new twaver.network.LabelAttachment(this, $Defaults.SHOW_LABEL_IN_ATTACHMENT_DIV);
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
                this._alarmAttachment = new twaver.network.AlarmAttachment(this, $Defaults.SHOW_ALARM_IN_ATTACHMENT_DIV);
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
                this._iconsAttachment = new twaver.network.IconsAttachment(this);
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
        if (this.isEditable() &&
					this._network.hasEditInteraction() &&
					this._network.isSelected(this._element) &&
					this._network.isEditable(this._element)) {
            if (!this._editAttachment) {
                this._editAttachment = new twaver.network.EditAttachment(this);
                this.addAttachment(this._editAttachment);
            }
        } else {
            if (this._editAttachment) {
                this.removeAttachment(this._editAttachment);
                this._editAttachment = null;
            }
        }
    },
    isEditable: function () {
        return true;
    },
    handlePropertyChange: function (e) {
        this.invalidate(true);
    },
    handleSelectionChange: function (e) {
        this.invalidate(true);
    },
    dispose: function () {
        this._attachments.forEach(function (attachment) {
            if (attachment.getView().parentNode) {
                attachment.getView().parentNode.removeChild(attachment.getView());
            }
            attachment.dispose();
        });
        this._attachments.clear();
    },
    addAttachment: function (attachment) {
        this._attachments.add(attachment);
        if (attachment.isShowInAttachmentDiv()) {
            this._network.getAttachmentDiv().appendChild(attachment.getView());
        } else {
            this._view.appendChild(attachment.getView());
        }
        this.invalidate(false);
    },
    removeAttachment: function (attachment) {
        this._attachments.remove(attachment);
        if (attachment.getView().parentNode) {
            attachment.getView().parentNode.removeChild(attachment.getView());
        }
        attachment.dispose();
        this.invalidate(false);
    },
    addBodyBounds: function (rect) {
        if (rect) {
            this._bodyBounds.add(rect);
        }
    },
    addComponent: function (component) {
        this._bodyView.appendChild(component);
    },
    getBodyView: function () {
        return this._bodyView;
    },
    getView: function () {
        return this._view;
    },
    getViewRect: function () {
        return _twaver.clone(this._viewRect);
    },
    setShadow: function (part, canvas, rect) {
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
        var g = $html.setCanvas(canvas, rect);
        if (shadowable) {
            g.shadowOffsetX = this._shadowXOffset;
            g.shadowOffsetY = this._shadowYOffset;
            g.shadowBlur = this._shadowBlur;
            g.shadowColor = this._shadowColor;
        }
        return g;
    },
    isShadowable: function () {
        if (this._shadowColor &&
            this._network.isSelected(this._element) &&
            this._element.getStyle('select.style') === 'shadow') {
            return true;
        }
        return false;
    },
    hit: function (x, y) {
        return false;
    },
    hitCanvas: function (x, y, names) {
        var count = names.length;
        for (var i = 0; i < count; i++) {
            var name = names[i];
            var canvas = this[name];
            if ($g.hit(canvas, x, y, this._network.getSelectionTolerance())) {
                return true;
            }
        }
        return false;
    },
    hitComponent: function (x, y, names) {
        var count = names.length;
        for (var i = 0; i < count; i++) {
            var name = names[i];
            var component = this[name];
            if (component && $math.containsPoint(component._viewRect, x, y)) {
                return true;
            }
        }
        return false;
    },
    hitTest: function (x, y) {
        if (!this.isVisible() || !$math.containsPoint(this._viewRect, x, y)) {
            return null;
        }
        var i, n = this._attachments.size(), attachment;
        for (i = n - 1; i >= 0; i--) {
            attachment = this._attachments.get(i);
            if (attachment.isShowInAttachmentDiv() && attachment.hit(x, y)) {
                return attachment;
            }
        }
        for (i = n - 1; i >= 0; i--) {
            attachment = this._attachments.get(i);
            if (!attachment.isShowInAttachmentDiv() && attachment.hit(x, y)) {
                return attachment;
            }
        }
        if ($math.containsPoint(this._unionBodyBounds, x, y) && this.hit(x, y)) {
            return this;
        }
        return null;
    },
    intersects: function (rect) {
        return false;
    },
    intersectsComponent: function (rect, names) {
        var count = names.length;
        for (var i = 0; i < count; i++) {
            var name = names[i];
            var component = this[name];
            if (component && $math.intersects(component._viewRect, rect)) {
                return true;
            }
        }
        return false;
    },
    intersectsCanvas: function (rect, names) {
        var count = names.length;
        for (var i = 0; i < count; i++) {
            var name = names[i];
            var canvas = this[name];
            if ($g.intersects(canvas, rect)) {
                return true;
            }
        }
        return false;
    },
    intersectsTest: function (rect) {
        if (!this.isVisible() || !$math.intersects(this._viewRect, rect)) {
            return null;
        }
        var n = this._attachments.size(), i, attachment;
        for (i = n - 1; i >= 0; i--) {
            attachment = this._attachments.get(i);
            if (attachment.isShowInAttachmentDiv() && attachment.intersects(rect)) {
                return attachment;
            }
        }
        for (i = n - 1; i >= 0; i--) {
            attachment = this._attachments.get(i);
            if (!attachment.isShowInAttachmentDiv() && attachment.intersects(rect)) {
                return attachment;
            }
        }
        if ($math.intersects(this._unionBodyBounds, rect) && this.intersects(rect)) {
            return this;
        }
        return null;
    }
});
