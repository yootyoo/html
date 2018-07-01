twaver.network.HTMLAlarmAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.HTMLBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.alarm = true;
};
twaver.Util.ext('twaver.network.HTMLAlarmAttachment', twaver.network.AlarmAttachment, {
    updateMeasure: function () {
        var font = this.getFont('alarm.font');
        this._contentDiv.innerHTML = this._network.getAlarmLabel(this._element);
        twaver.Util.setCSSStyle(this._contentDiv, "font",font);
        this._fillColor = this._network.getAlarmFillColor(this._element);
        twaver.network.HTMLBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: twaver.network.HTMLBasicAttachment.prototype.calculateMeasure
});