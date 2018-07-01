twaver.canvas.HTMLLinkUI = function(network, element){
	twaver.canvas.HTMLLinkUI.superClass.constructor.call(this, network, element);
}

_twaver.ext('twaver.canvas.HTMLLinkUI', twaver.canvas.LinkUI, {
	checkAttachments: function () {
		twaver.canvas.LinkUI.prototype.checkAttachments.call(this);
	},
	checkLabelAttachment: function () {
		var style = this._element.getStyle('attachment.label.style');
        if(style && style === 'none'){
            twaver.canvas.HTMLLinkUI.superClass.checkLabelAttachment.call(this);
            return;
        }

		var label = this._network.getLabel(this._element);
		if (label != null && label !== "") {
			if (!this._labelAttachment) {
				this._labelAttachment = new twaver.canvas.HTMLLabelAttachment(this);
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
            twaver.canvas.HTMLLinkUI.superClass.checkAlarmAttachment.call(this);
            return;
        }

		var label = this._network.getAlarmLabel(this._element);
		if (label != null && label !== "") {
			if (!this._alarmAttachment) {
				this._alarmAttachment = new twaver.canvas.HTMLAlarmAttachment(this, false);
				this.addAttachment(this._alarmAttachment);
			}
		} else {
			if (this._alarmAttachment) {
				this.removeAttachment(this._alarmAttachment);
				this._alarmAttachment = null;
			}
		}
	}
});