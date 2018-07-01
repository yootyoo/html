twaver.canvas.interaction.PanInteraction = function (network) {
    twaver.canvas.interaction.PanInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.canvas.interaction.PanInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mouseup');
        this._oldCursor = this.network.getView().style.cursor;
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mouseup');
    },
    handle_mousedown: function (e) {
        if (!this.network.isValidEvent(e)) {
            return;
        }
        this.lastPoint = this.getMarkerPoint(e);

        if (this.lastPoint) {
            this.addListener('mousemove');
            this.network.getView().style.cursor = 'pointer';
        }
    },
    handle_mouseup: function (e) {
        this._clear();
    },
    handle_mousemove: function (e) {
        if (!this.lastPoint) {
            return;
        }
        var newPoint = this.getMarkerPoint(e);
        if (!newPoint) {
            return;
        }
        var xoffset = newPoint.x - this.lastPoint.x;
        var yoffset = newPoint.y - this.lastPoint.y;
        this.network.panByOffset(-xoffset, -yoffset);
        this.lastPoint = newPoint;
    },
    _clear: function (e) {
        if (this.lastPoint) {
            this.lastPoint = null;
            this.network.getView().style.cursor = this._oldCursor;
            this.removeListener('mousemove');
        }
    }
});