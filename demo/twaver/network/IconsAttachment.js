twaver.network.IconsAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.IconsAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._iconsCanvas = null;
};
_twaver.ext('twaver.network.IconsAttachment', twaver.network.Attachment, {
    isShadowable: function () {
        return $Defaults.ATTACHMENT_SHADOWABLE;
    },
    updateMeasure: function () {
        twaver.network.IconsAttachment.superClass.updateMeasure.call(this);

        var names = this._network.getIconsNames(this._element);
        if (!names || names.length == 0) {
            return;
        }

        var colors = this._network.getIconsColors(this._element);
        var orientation = this._element.getStyle('icons.orientation');
        var position = this._element.getStyle('icons.position');
        var xoffset = this._element.getStyle('icons.xoffset');
        xoffset = xoffset instanceof Array? xoffset[0] : xoffset;
        var yoffset = this._element.getStyle('icons.yoffset');
        yoffset = yoffset instanceof Array? yoffset[0] : yoffset;
        var xgap = this._element.getStyle('icons.xgap');
        xgap = xgap instanceof Array? xgap[0] : xgap; 
        var ygap = this._element.getStyle('icons.ygap');
        ygap = ygap instanceof Array? ygap[0] : ygap;
        var iconsSize = this._getIconsSize(names, orientation, xgap, ygap);
        if (!iconsSize) {
            return;
        }
        var location = this._network.getPosition(position, this._ui, iconsSize, xoffset, yoffset);
        this._viewRect = { x: location.x, y: location.y, width: iconsSize.width, height: iconsSize.height };
        if (orientation === 'top') {
            location.y += iconsSize.height;
        }
        else if (orientation === 'left') {
            location.x += iconsSize.width;
        }

        if (!this._iconsCanvas) {
            this._iconsCanvas = $html.createCanvas();
            this._view.appendChild(this._iconsCanvas);
        }
        var g = this._ui.setShadow(this, this._iconsCanvas, _twaver.clone(this._viewRect));

        var x = location.x;
        var y = location.y;
        var index = 0;
        for (var name in names) {
            var rect = null;
            var color = null;
            if (colors && colors.length > index) {
                color = colors[index++];
            }
            var imageAsset = _twaver.getImageAsset(names[name]);
            if (imageAsset == null) {
                continue;
            }
            if (orientation === 'right') {
                rect = { x: x, y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                x += rect.width + xgap;
            }
            else if (orientation === 'left') {
                rect = { x: x - imageAsset.getWidth(), y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                x -= rect.width + xgap;
            }
            else if (orientation === 'top') {
                rect = { x: x, y: y - imageAsset.getHeight(), width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                y -= rect.height + ygap;
            }
            else if (orientation === 'bottom') {
                rect = { x: x, y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                y += rect.height + ygap;
            }
            else {
                throw "Can not resolve '" + orientation + "' orientation";
            }
            drawImage(g, imageAsset.getImage(color, rect.width, rect.height), color, rect, this._element, this._network);
        }
    },
    _getIconsSize: function (names, orientation, xgap, ygap) {
        var x = 0;
        var y = 0;
        var rect = null;
        var imageAsset = null;
        var unionRect = null;
        for (var name in names) {
            imageAsset = _twaver.getImageAsset(names[name]);
            if (!imageAsset) {
                continue;
            }
            if (orientation === 'right') {
                rect = { x: x, y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                x += rect.width + xgap;
            }
            else if (orientation === 'left') {
                rect = { x: x - imageAsset.getWidth(), y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                x -= rect.width + xgap;
            }
            else if (orientation === 'top') {
                rect = { x: x, y: y - imageAsset.getHeight(), width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                y -= rect.height + ygap;
            }
            else if (orientation === 'bottom') {
                rect = { x: x, y: y, width: imageAsset.getWidth(), height: imageAsset.getHeight() };
                y += rect.height + ygap;
            }
            else {
                throw "Can not resolve '" + orientation + "' orientation";
            }
            if (unionRect == null) {
                unionRect = _twaver.clone(rect);
            } else {
                unionRect = $math.unionRect(unionRect, rect);
            }
        }
        if (unionRect) {
            return { width: Math.abs(unionRect.width), height: Math.abs(unionRect.height) };
        }
        return null;
    }
});
