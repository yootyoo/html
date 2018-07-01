twaver.vector.HTMLNodeUI = function (network, element) {
    twaver.vector.HTMLNodeUI.superClass.constructor.call(this, network, element);
}

_twaver.ext('twaver.vector.HTMLNodeUI', twaver.vector.NodeUI, {
    checkAttachments: function () {
        twaver.vector.NodeUI.prototype.checkAttachments.call(this);
    },
    checkLabelAttachment: function () {
        var type = this._element.getStyle('attachment.label.style');
        if(type && type === 'none'){
            twaver.vector.HTMLNodeUI.superClass.checkLabelAttachment.call(this);
            return;
        }

        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new twaver.vector.HTMLLabelAttachment(this, $Defaults.SHOW_LABEL_IN_ATTACHMENT_DIV);
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
        var type = this._element.getStyle('attachment.alarm.style');
        if(type && type === 'none'){
            twaver.vector.HTMLNodeUI.superClass.checkAlarmAttachment.call(this);
            return;
        }

        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new twaver.vector.HTMLAlarmAttachment(this, false);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    },
    setAttachmentVisible: function (visible) {
        if(visible){
            this._labelAttachment && this._labelAttachment.setVisibility('visible');
            this._alarmAttachment && this._alarmAttachment.setVisibility('visible');
        }else {
            this._labelAttachment && this._labelAttachment.setVisibility('hidden');
            this._alarmAttachment && this._alarmAttachment.setVisibility('hidden');
        }
    },  
});
