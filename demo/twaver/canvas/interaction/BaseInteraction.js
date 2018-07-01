twaver.canvas.interaction.BaseInteraction = function (network) {
    this.network = network;
};
_twaver.ext('twaver.canvas.interaction.BaseInteraction', Object, {
    setUp: function () {
    },
    tearDown: function () {
    },
    repaint: function () {
        this.network.repaintTopCanvas();
    },
    convertPointFromView: function (p) {
        var x = p.x * this.network.getZoom() - this.network.getViewRect().x;
        var y = p.y * this.network.getZoom() - this.network.getViewRect().y;
        return {
            x: x,
            y: y
        };
    },
    convertFromUIToMarkerRect: function (vr, xoff, yoff) {
        var zoom = this.network.getZoom();
        return {
            x: vr.x * zoom - this.network.getViewRect().x + xoff * zoom,
            y: vr.y * zoom - this.network.getViewRect().y + yoff * zoom,
            width: vr.width * zoom,
            height: vr.height * zoom
        }
    },
    getMarkerPoint: function (e) {
        var point;

        if ($ua.isTouchable && e.changedTouches && e.changedTouches.length > 0) {
            var touch = e.changedTouches[0];
            point = {
                x: touch.clientX,
                y: touch.clientY
            };
            return point;
        }
        if ($ua.isFirefox) {
            point = {
                x: e.layerX,
                y: e.layerY
            };
        } else {
            point = {
                x: e.offsetX,
                y: e.offsetY
            };
        }
        return point;
    },
    paint: function (ctx) {
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
