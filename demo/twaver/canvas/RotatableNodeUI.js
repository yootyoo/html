twaver.canvas.RotatableNodeUI = function (network, element) {
    twaver.canvas.RotatableNodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.canvas.RotatableNodeUI', twaver.canvas.NodeUI, {
    isEditable: function () {
        return false;
    },
    //need
    getDefaultBodyRect: function () {
        var node = this._element;
        var imageAsset = _twaver.getImageAsset(node.getImage());
        var rect = this.getBodyRect();
        if (!imageAsset) {
            return rect;
        }
        $math.addPadding(rect, this._element, 'image.padding', 1);
        return rect;
    },
    drawDefaultBody: function (ctx) {
        var node = this._element;
        var imageAsset = _twaver.getImageAsset(node.getImage());
        var rect = this.getBodyRect();
        $math.addPadding(rect, this._element, 'image.padding', 1);

        if (imageAsset.getImage()) {
            var ow = this._element._getOrignalWidth(),
            oh = this._element._getOrignalHeight(),
            rotateRect = this._element._getRotateRect();

            ctx.save();
            ctx.translate(rect.x - rotateRect.x + ow / 2, rect.y - rotateRect.y + oh / 2);
            ctx.rotate(this._element._angle * Math.PI / 180);
            var rect = {x:-ow / 2,y: -oh / 2, width: ow, height: oh }
            drawImage(ctx, imageAsset.getImage(this._innerColor, rect.width, rect.height), this._innerColor, rect, node, this._network);
            ctx.restore();
        }
        else if (imageAsset.getSrc()) {
        }
        else if (imageAsset.getFunction()) {
        }
        else {
            throw "ImageAsset '" + node.getImage() + " ' is empty";
        }
    }
});
