twaver.network.Attachment = function (elementUI, showInAttachmentDiv) {
    this._view = $html.createDiv();
    this._ui = elementUI;
    this._element = this._ui.getElement();
    this._network = elementUI.getNetwork();
    this._isShowInAttachmentDiv = showInAttachmentDiv === true;
    if (this._isShowInAttachmentDiv) {
        $html.setVisible(this._view, elementUI.isVisible());
    }
};
_twaver.ext('twaver.network.Attachment', Object, {
    getElement: function () {
        return this._element;
    },
    getElementUI: function () {
        return this._ui;
    },
    getNetwork: function () {
        return this._network;
    },
    getStyle: function (styleProp) {
        return this._ui.getStyle(styleProp);
    },
    getFont: function (styleProp) {
        return this._ui.getFont(styleProp);
    },
    isShowInAttachmentDiv: function () {
        return this._isShowInAttachmentDiv;
    },
    getView: function () {
        return this._view;
    },
    getViewRect: function () {
        return _twaver.clone(this._viewRect);
    },
    getAlpha: function () {
        return 1;
    },
    updateMeasure: function () {

    },
    dispose: function () {

    },
    hit: function (x, y) {
        return $math.containsPoint(this._viewRect, x, y);
    },
    intersects: function (rect) {
        return $math.intersects(this._viewRect, rect);
    }
});
