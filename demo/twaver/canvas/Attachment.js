twaver.canvas.Attachment = function (elementUI, showInTop) {
    this._ui = elementUI;
    this._element = this._ui.getElement();
    this._network = elementUI.getNetwork();
    this._showOnTop = showInTop;
};
_twaver.ext('twaver.canvas.Attachment', Object, {
    getElement: function () {
        return this._element;
    },
    getElementUI: function () {
        return this._ui;
    },
    getNetwork: function () {
        return this._network;
    },
    isShowOnTop: function () {
        return this._showOnTop === true;
    },
    setShowOnTop: function (t) {
        this._showOnTop = t;
    },
    getStyle: function (styleProp) {
        return this._ui.getStyle(styleProp);
    },
    getFont: function (styleProp) {
        return this._ui.getFont(styleProp);
    },
    getViewRect: function () {
        return _twaver.clone(this._viewRect);
    },
    getAlpha: function () {
        return 1;
    },
    validate: function () {
    },
    paint: function (ctx) {
    },
    hit: function (x, y) {
        if ($math.containsPoint(this._viewRect, x, y)) {
            return this.hitCanvasRect({
                x: x - 1,
                y: y - 1,
                width: 2,
                height: 2
            });
        }
        return false;
    },
    hitCanvasRect: function (rect) {
        var cvs = $CanvasUtil.getHitCanvas(rect.width, rect.height);
        var ctx = $CanvasUtil.getCtx(cvs);
        ctx.save();
        ctx.translate(-rect.x, -rect.y);
        this.paint(ctx);
        try {
            var imageData = ctx.getImageData(0, 0, rect.width, rect.height);
            var pixs = imageData.data;
            for (var c = 0; c < imageData.width; c++) {
                for (var r = 0; r < imageData.height; r++) {
                    var index = 4 * (r * imageData.width + c);
                    var a = pixs[index + 3];
                    if (a !== 0) {
                        ctx.restore();
                        return true;
                    }
                }
            }
        } catch (e) {
            $CanvasUtil.disposeHitCanvas();
        }
        ctx.restore();
        return false;
    },
    dispose: function() {

    },
});