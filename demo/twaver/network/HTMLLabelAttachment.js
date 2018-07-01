twaver.network.HTMLLabelAttachment = function(elementUI, showInAttachmentDiv) {
    twaver.network.HTMLBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}

twaver.Util.ext('twaver.network.HTMLLabelAttachment', twaver.network.LabelAttachment, {
   updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        this._contentDiv.innerHTML = text;
        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.network.HTMLBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: twaver.network.HTMLBasicAttachment.prototype.calculateMeasure
});