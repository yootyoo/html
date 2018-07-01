twaver.vector.interaction.BaseInteraction = function (network) {
    this.network = network;
};
_twaver.ext('twaver.vector.interaction.BaseInteraction', Object, {
    setUp: function () {
    },
    tearDown: function () {
    },
    repaint: function () {
        this.network.repaintTopCanvas();
    },
    getOffset:function(newPoint,lastPoint){
        return this.network.getOffset(newPoint,lastPoint);
    },
    convertPointFromView: function (p) {
        return this.network.convertPointFromView(p);
    },
    convertFromUIToMarkerRect: function (vr, xoff, yoff,node) {
    	var zm = this.network.zoomManager;
        var locationZoom = zm.getLocationZoom();
        var gzoom = zm.getGraphicsZoom();
        var sizeZoom = zm.getSizeZoom(this.network.getElementUI(node));
        return {
            x: vr.x * locationZoom * gzoom - this.network.getViewRect().x + xoff * locationZoom * gzoom,
            y: vr.y * locationZoom * gzoom - this.network.getViewRect().y + yoff * locationZoom * gzoom,
            width: vr.width * sizeZoom * gzoom,
            height: vr.height * sizeZoom * gzoom
        };
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
        this._startLogical = this.network.getLogicalPoint2(e);
        this._startClient = $html.getClientPoint(e);
        if (this._startLogical) {
            $html.handle_mousedown(this, e);
        }
    },
    _handle_mousemove: function (e) {
        this._endLogical = {
            x: this._startLogical.x + (e.clientX - this._startClient.x) / this.network.getGraphicsZoom(),
            y: this._startLogical.y + (e.clientY - this._startClient.y) / this.network.getGraphicsZoom()
        };
    },
    _handle_mouseup: function (e) {
        delete this._startClient;
        delete this._startLogical;
        delete this._endLogical;
    }
});
