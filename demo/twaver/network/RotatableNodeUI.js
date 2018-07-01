twaver.network.RotatableNodeUI = function (network, element) {
    twaver.network.RotatableNodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.RotatableNodeUI', twaver.network.NodeUI, {
    isEditable: function () {
        return false;
    },
    drawDefaultBody: function () {
        var node = this._element;
        var imageAsset = _twaver.getImageAsset(node.getImage());
        var rect = this.getBodyRect();
        if (!imageAsset) {
            this.addBodyBounds(rect);
            this._currentImageAsset = null;
            return;
        }
        $math.addPadding(rect, this._element, 'image.padding', 1);

        if (imageAsset.getImage()) {
            if (!this._nodeCanvas) {
                this._nodeCanvas = $html.createCanvas();
            }
            var bounds = _twaver.clone(rect);
            var g = this.setShadow(this, this._nodeCanvas, bounds);

            var ow = this._element._getOrignalWidth(),
            	oh = this._element._getOrignalHeight(),
				rotateRect = this._element._getRotateRect();

            g.save();
            g.translate(rect.x - rotateRect.x + ow / 2, rect.y - rotateRect.y + oh / 2);
            g.rotate(this._element._angle * Math.PI / 180);
            var rect = {x: -ow/2, y:  -oh / 2, width: ow, height: oh}
            drawImage(g, imageAsset.getImage(this._innerColor, rect.width, rect.height), this._innerColor, rect, node, this._network);
            g.restore();
            this.addComponent(this._nodeCanvas);
        }
        else if (imageAsset.getSrc()) {
        }
        else if (imageAsset.getFunction()) {
        }
        else {
            throw "ImageAsset '" + node.getImage() + " ' is empty";
        }
        this.addBodyBounds(rect);
        this._currentImageAsset = imageAsset;
    }
});
