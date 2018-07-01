twaver.network.interaction.PanInteraction = function (network) {
    twaver.network.interaction.PanInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.PanInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown');
        this._oldCursor = this.network.getView().style.cursor;
    },
    tearDown: function () {
        this.removeListener('mousedown');
    },
    handle_mousedown: function (e) {
        this._startLogical = this.network.getLogicalPoint(e);
        if (this._startLogical) {
            this._handle_mousedown(e);
            this.network.getView().style.cursor = 'pointer';
        }
    },
    handle_mouseup: function (e) {
        this._clear();
    },
    handle_mousemove: function (e) {
        if (!this._startLogical) {
            return;
        }
        this._handle_mousemove(e);
        var xoffset = this._startLogical.x - this._endLogical.x;
        var yoffset = this._startLogical.y - this._endLogical.y;
        var result = this.network.panByOffset(xoffset, yoffset);
        this._startLogical = this._endLogical;
        this._startClient = $html.getClientPoint(e);
    },
    _clear: function (e) {
        if (this._startLogical) {
            this._handle_mouseup(e);
            this.network.getView().style.cursor = this._oldCursor;
        }
    }
});
