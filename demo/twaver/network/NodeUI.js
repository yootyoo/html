twaver.network.NodeUI = function (network, element) {
    twaver.network.NodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.network.NodeUI', twaver.network.ElementUI, {
    createBodyRect: function () {
        return this._element.getRect();
    },
    invalidate: function (checkAttachments) {
        twaver.network.NodeUI.superClass.invalidate.call(this, checkAttachments);
        var links = this._element.getAgentLinks();
        if (links) {
            links.forEach(function (link) {
                this._network.invalidateElementUI(link, false);
            }, this);
        }
    },
    updateMeasure: function () {
        twaver.network.NodeUI.superClass.updateMeasure.call(this);
        var shape = this.getStyle('vector.shape');
        var rect = this.getBodyRect();
        this._hotSpot = $math.getHotSpot(rect.x, rect.y, rect.width, rect.height, shape);
        this.drawBody();
        if (this._outerColor) {
            this.drawOuterBorder();
        }
        if (!this._editAttachment && this.getStyle('select.style') === 'border' && this._network.isSelected(this._element)) {
            this.drawSelectBorder();
        }
        this.cleanUp(['_selectCanvas', '_nodeCanvas', '_nodeImage', '_nodeComponent', '_vectorCanvas', '_outerCanvas']);
        var parent = this._element.getParent();
        if (parent instanceof $Group) {
            this._network.invalidateElementUI(parent, false);
        }
    },
    drawBody: function () {
        var type = this.getStyle('body.type');
        if (type === 'default') {
            this.drawDefaultBody();
        }
        else if (type === 'vector') {
            this.drawVectorBody();
        }
        else if (type === 'default.vector') {
            this.drawVectorBody();
            this.drawDefaultBody();
        }
        else if (type === 'vector.default') {
            this.drawDefaultBody();
            this.drawVectorBody();
        }else {
            this.addBodyBounds({x : this._element.getX(), y : this._element.getY(), width: 0, height: 0});
        }
    },
    drawOuterBorder: function () {
        var node = this._element;
        var lineWidth = node.getStyle('outer.width');
        if (lineWidth > 0) {
            var rect = this.getBodyRect();
            $math.addPadding(rect, node, 'outer.padding', 1);
            if (!this._outerCanvas) {
                this._outerCanvas = $html.createCanvas();
            }
            var bounds = _twaver.clone(rect);
            $math.grow(bounds, lineWidth / 2, lineWidth / 2);
            var g = $html.setCanvas(this._outerCanvas, bounds);

            g.lineWidth = lineWidth;
            g.lineCap = node.getStyle('outer.cap');
            g.lineJoin = node.getStyle('outer.join');
            g.strokeStyle = this._outerColor;
            $g.drawVector(g, node.getStyle('outer.shape'), null, rect);
            g.stroke();
            this.addComponent(this._outerCanvas);
            this.addBodyBounds(bounds);
        }
    },
    drawSelectBorder: function () {
        var node = this._element;
        var lineWidth = node.getStyle('select.width');
        if (lineWidth > 0) {
            var rect = this.getBodyRect();
            $math.addPadding(rect, node, 'select.padding', 1);
            if (!this._selectCanvas) {
                this._selectCanvas = $html.createCanvas();
            }
            var bounds = _twaver.clone(rect);
            $math.grow(bounds, lineWidth / 2, lineWidth / 2);
            var g = $html.setCanvas(this._selectCanvas, bounds);

            g.lineWidth = lineWidth;
            g.lineCap = node.getStyle('select.cap');
            g.lineJoin = node.getStyle('select.join');
            g.strokeStyle = node.getStyle('select.color');
            $g.drawVector(g, node.getStyle('select.shape'), null, rect);
            g.stroke();
            this.addComponent(this._selectCanvas);
            this.addBodyBounds(bounds);
        }
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
            if(node.getAngle() != 0) {
                rect = node.getOriginalRect();
                twaver.Util.rotateCanvas(g, rect, node.getAngle());
            }
            drawImage(g, node.getImage(), this.getInnerColor(), rect, node, this._network);
            rect = bounds;
            this.addComponent(this._nodeCanvas);
        }
        else if (imageAsset.getSrc()) {
            if (!this._nodeImage) {
                this._nodeImage = $html.createImg();
            }
            $html.setImg(this._nodeImage, imageAsset.getSrc(), rect);
            this.addComponent(this._nodeImage);
        }
        else if (imageAsset.getFunction()) {
            if (this._currentImageAsset !== imageAsset) {
                this._nodeComponent = imageAsset.getFunction()(this, rect);
            } else {
                this._nodeComponent = imageAsset.getFunction()(this, rect, this._nodeComponent);
            }
            this.addComponent(this._nodeComponent);
            this._nodeComponent._viewRect = _twaver.clone(rect);
        }
        else {
            throw "ImageAsset '" + node.getImage() + " ' is empty";
        }
        this.addBodyBounds(rect);
        this._currentImageAsset = imageAsset;
    },
    hit: function (x, y) {
        if (this._network._transparentSelectionEnable) {
            var bodyRect = this.getBodyRect();
            if (_twaver.math.containsPoint(bodyRect, x, y)) {
                return true;
            }
        }
        if (this.hitCanvas(x, y, ['_nodeCanvas', '_outerCanvas', '_vectorCanvas'])) {
            return true;
        }
        return this.hitComponent(x, y, ['_nodeImage', '_nodeComponent']);
    },
    intersects: function (rect) {
        if (this._network._transparentSelectionEnable) {
            var bodyRect = this.getBodyRect();
            if (_twaver.math.intersects(bodyRect, rect)) {
                return true;
            }
        }
        if (this.intersectsCanvas(rect, ['_nodeCanvas', '_outerCanvas', '_vectorCanvas'])) {
            return true;
        }
        return this.intersectsComponent(rect, ['_nodeImage', '_nodeComponent']);
    },
    drawVectorBody: function () {
        if (!this._vectorCanvas) {
            this._vectorCanvas = $html.createCanvas();
        }
        var bounds = $g.drawPath(this, this._vectorCanvas, 'vector', true, this._element.getStyle('vector.outline.pattern'));

        var deep = this.getStyle('vector.deep');
        var g = this._vectorCanvas.getContext('2d');
        var rect = this.getBodyRect();
        var fillColor = this.getStyle('vector.fill.color');
        if (deep !== 0 && fillColor) {
            var angle = this._element.getAngle();
            if(angle != 0) {
                rect = this._element.getOriginalRect();
                twaver.Util.rotateCanvas(g, rect, -angle);
                twaver.Util.rotateCanvas(g, rect, angle);
            }
            if (this.getStyle('vector.shape') === 'rectangle') {
                $g.draw3DRect(g, fillColor, deep, rect);
            }
        }

        this.addBodyBounds(bounds);
        this.addComponent(this._vectorCanvas);
    }
});
