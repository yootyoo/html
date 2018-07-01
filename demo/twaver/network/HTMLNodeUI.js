twaver.network.HTMLNodeUI  = function (network, element) {
    twaver.network.HTMLNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext('twaver.network.HTMLNodeUI', twaver.network.NodeUI, {
    checkAttachments: function () {
        twaver.network.NodeUI.prototype.checkAttachments.call(this);
    },

    checkLabelAttachment: function () {
        var style = this._element.getStyle('attachment.label.style');
        if(style && style === 'none'){
            twaver.network.HTMLNodeUI.superClass.checkLabelAttachment.call(this);
            return;
        }

        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new twaver.network.HTMLLabelAttachment(this, $Defaults.SHOW_LABEL_IN_ATTACHMENT_DIV);
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
        var style = this._element.getStyle('attachment.alarm.style');
        if(style && style === 'none'){
            twaver.network.HTMLNodeUI.superClass.checkAlarmAttachment.call(this);
            return;
        }

        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new twaver.network.HTMLAlarmAttachment(this, false);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    },
});