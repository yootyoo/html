twaver.network.interaction.BaseInteraction = function (network) {
    this.network = network;
};
_twaver.ext('twaver.network.interaction.BaseInteraction', Object, {
    setUp: function () {

    },
    tearDown: function () {

    },
    addListener: function () {
        for (var i = 0; i < arguments.length; i++) {
            var type = arguments[i];
            $html.addEventListener(type, 'handle_' + type, this.network.getView(), this);
        }
    },
    removeListener: function () {
        for (var i = 0; i < arguments.length; i++) {
            $html.removeEventListener(arguments[i], this.network.getView(), this);
        }
    },
    _handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        this._startLogical = this.network.getLogicalPoint(e);
        this._startClient = $html.getClientPoint(e);
        if (this._startLogical) {
            $html.handle_mousedown(this, e);
        }
    },
    _handle_mousemove: function (e) {
        this._endLogical = {
            x: this._startLogical.x + (e.clientX - this._startClient.x) / this.network.getZoom(),
            y: this._startLogical.y + (e.clientY - this._startClient.y) / this.network.getZoom()
        };
    },
    _handle_mouseup: function (e) {
        delete this._startClient;
        delete this._startLogical;
        delete this._endLogical;
    }
});
