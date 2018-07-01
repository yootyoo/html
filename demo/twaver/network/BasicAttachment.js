twaver.network.BasicAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.BasicAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._roundRect = { x: 0, y: 0, width: 0, height: 0 };
    this._contentRect = { x: 0, y: 0, width: 0, height: 0 };
    this._attachmentCanvas = $html.createCanvas();
    this._view.insertBefore(this._attachmentCanvas, this._view.firstChild);
};
_twaver.ext('twaver.network.BasicAttachment', twaver.network.Attachment, {
    calculateMeasure: function () {
        var contentWidth = this.getContentWidth();
        var contentHeight = this.getContentHeight();
        var cornerRadius = this.getCornerRadius();
        var pointerLength = this.getPointerLength();
        var pointerWidth = this.getPointerWidth();
        var position = this.getPosition();
        var xOffset = this.getXOffset();
        var yOffset = this.getYOffset();

        var roundRect = this._roundRect;
        roundRect.width = contentWidth + cornerRadius * 2;
        roundRect.height = contentHeight;
        var location;

        if (pointerLength > 0) {
            var direction = this.getDirection();
            location = this._network.getPosition(position, this._ui, null, xOffset, yOffset);
            var endPoint;
            if (direction === 'aboveleft') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - (roundRect.width - cornerRadius);
                endPoint = Math.max(location.x - pointerWidth, roundRect.x + cornerRadius / 2);
                this._pointers = [location,
	     						{ x: location.x, y: location.y - pointerLength },
	     						{ x: endPoint, y: location.y - pointerLength}];
            }
            else if (direction === 'aboveright') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - cornerRadius;
                endPoint = Math.min(location.x + pointerWidth, roundRect.x + roundRect.width - cornerRadius / 2);
                this._pointers = [location,
     							 { x: location.x, y: location.y - pointerLength },
     							 { x: endPoint, y: location.y - pointerLength}];
            }
            else if (direction === 'belowleft') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - (roundRect.width - cornerRadius);
                endPoint = Math.max(location.x - pointerWidth, roundRect.x + cornerRadius / 2);
                this._pointers = [location,
     							 { x: location.x, y: location.y + pointerLength },
     							 { x: endPoint, y: location.y + pointerLength}];
            }
            else if (direction === 'belowright') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - cornerRadius;
                endPoint = Math.min(location.x + pointerWidth, roundRect.x + roundRect.width - cornerRadius / 2);
                this._pointers = [location,
     							 { x: location.x, y: location.y + pointerLength },
     							 { x: endPoint, y: location.y + pointerLength}];
            }
            else if (direction === 'leftabove') {
                roundRect.y = location.y + cornerRadius - roundRect.height;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.max(location.y - pointerWidth, roundRect.y + cornerRadius / 2);
                this._pointers = [location,
     							 { x: location.x - pointerLength, y: location.y },
     							 { x: location.x - pointerLength, y: endPoint}];
            }
            else if (direction === 'leftbelow') {
                roundRect.y = location.y - cornerRadius;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.min(location.y + pointerWidth, roundRect.y + roundRect.height - cornerRadius / 2);
                this._pointers = [location,
     							{ x: location.x - pointerLength, y: location.y },
     							{ x: location.x - pointerLength, y: endPoint}];
            }
            else if (direction === 'rightabove') {
                roundRect.y = location.y + cornerRadius - roundRect.height;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.max(location.y - pointerWidth, roundRect.y + cornerRadius / 2);
                this._pointers = [location,
     							{ x: location.x + pointerLength, y: location.y },
     							{ x: location.x + pointerLength, y: endPoint}];
            }
            else if (direction === 'rightbelow') {
                roundRect.y = location.y - cornerRadius;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.min(location.y + pointerWidth, roundRect.y + roundRect.height - cornerRadius / 2);
                this._pointers = [location,
     								{ x: location.x + pointerLength, y: location.y },
     								{ x: location.x + pointerLength, y: endPoint}];
            }
            else if (direction === 'above') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - roundRect.width / 2;
                endPoint = Math.min(contentWidth / 2, pointerWidth / 2);
                this._pointers = [location,
     							{ x: location.x - endPoint, y: location.y - pointerLength },
     							{ x: location.x + endPoint, y: location.y - pointerLength}];
            }
            else if (direction === 'below') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - roundRect.width / 2;
                endPoint = Math.min(contentWidth / 2, pointerWidth / 2);
                this._pointers = [location,
     							{ x: location.x - endPoint, y: location.y + pointerLength },
     							{ x: location.x + endPoint, y: location.y + pointerLength}];
            }
            else if (direction === 'left') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.min(contentHeight / 2, pointerWidth / 2);
                this._pointers = [location,
     							{ x: location.x - pointerLength, y: location.y + endPoint },
     							{ x: location.x - pointerLength, y: location.y - endPoint}];
            }
            else if (direction === 'right') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.min(contentHeight / 2, pointerWidth / 2);
                this._pointers = [location,
     							{ x: location.x + pointerLength, y: location.y + endPoint },
     							{ x: location.x + pointerLength, y: location.y - endPoint}];
            }
            else {
                throw "Can not resolve '" + direction + "' attachment direction";
            }
        }
        else {
            location = this._network.getPosition(position, this._ui, { width: roundRect.width, height: roundRect.height }, xOffset, yOffset);
            roundRect.x = location.x;
            roundRect.y = location.y;
            this._pointers = null;
        }

        this._contentRect.x = roundRect.x + (roundRect.width - contentWidth) / 2;
        this._contentRect.y = roundRect.y + (roundRect.height - contentHeight) / 2;
        this._contentRect.width = contentWidth;
        this._contentRect.height = contentHeight;

        var padding = this.getPadding();
        if (padding != 0) {
            $math.grow(roundRect, padding, padding);
        }
        padding = this.getPaddingLeft();
        if (padding != 0) {
            roundRect.x -= padding;
            roundRect.width += padding;
        }
        padding = this.getPaddingRight();
        if (padding != 0) {
            roundRect.width += padding;
        }
        padding = this.getPaddingTop();
        if (padding != 0) {
            roundRect.y -= padding;
            roundRect.height += padding;
        }
        padding = this.getPaddingBottom();
        if (padding != 0) {
            roundRect.height += padding;
        }
        if (roundRect.width < 0) {
            roundRect.width = roundRect.width;
            roundRect.x -= roundRect.width;
        }
        if (roundRect.height < 0) {
            roundRect.height = -roundRect.height;
            roundRect.y -= roundRect.height;
        }
    },

    updateMeasure: function () {
        twaver.network.BasicAttachment.superClass.updateMeasure.call(this);
        this.calculateMeasure();

        var fill = this.isFill();
        var outlineWidth = this.getOutlineWidth();

        this._viewRect = $math.getRect(this._pointers);
        this._viewRect = $math.unionRect(this._viewRect, this._roundRect);
        if (outlineWidth > 0) {
            $math.grow(this._viewRect, outlineWidth / 2, outlineWidth / 2);
        }
        var g = this._ui.setShadow(this, this._attachmentCanvas, this._viewRect);

        if (outlineWidth > 0 || fill) {
            g.beginPath();
            $g.drawRoundRect(g, this._roundRect.x, this._roundRect.y, this._roundRect.width, this._roundRect.height, this.getCornerRadius());
            //todo make sure drawRoundRect and pointer same direction
            if (this._pointers) {
                g.moveTo(this._pointers[0].x, this._pointers[0].y);
                g.lineTo(this._pointers[1].x, this._pointers[1].y);
                g.lineTo(this._pointers[2].x, this._pointers[2].y);
            }
            g.closePath();

            if (outlineWidth > 0) {
                g.lineWidth = outlineWidth;
                g.strokeStyle = this.getOutlineColor();
                g.lineCap = this.getCap();
                g.lineJoin = this.getJoin();
                g.stroke();
            }
            if (fill) {
                var fillColor = this.getFillColor();
                var gradient = this.getGradient();
                if (gradient) {
                    $g.fill(g, fillColor, gradient, this.getGradientColor(), this._viewRect);
                } else {
                    g.fillStyle = fillColor;
                }
                g.fill();
            }
        }
        return g;
    },
    getRoundRect: function () {
        return _twaver.clone(this._roundRect);
    },
    getContentRect: function () {
        return _twaver.clone(this._contentRect);
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (value) {
        if (this._content === value) {
            return;
        }
        if (this._content) {
            this._view.removeChild(this._content);
        }
        this._content = value;
        if (value) {
            this._view.appendChild(value);
        }
    },
    getContentWidth: function () {
        return $Defaults.ATTACHMENT_CONTENT_WIDTH;
    },
    getContentHeight: function () {
        return $Defaults.ATTACHMENT_CONTENT_HEIGHT;
    },
    getCornerRadius: function () {
        return $Defaults.ATTACHMENT_CORNER_RADIUS;
    },
    getPointerLength: function () {
        return $Defaults.ATTACHMENT_POINTER_LENGTH;
    },
    getPointerWidth: function () {
        return $Defaults.ATTACHMENT_POINTER_WIDTH;
    },
    getPosition: function () {
        return $Defaults.ATTACHMENT_POSITION;
    },
    getXOffset: function () {
        return $Defaults.ATTACHMENT_XOFFSET;
    },
    getYOffset: function () {
        return $Defaults.ATTACHMENT_YOFFSET;
    },
    getPadding: function () {
        return $Defaults.ATTACHMENT_PADDING;
    },
    getPaddingLeft: function () {
        return $Defaults.ATTACHMENT_PADDING_LEFT;
    },
    getPaddingRight: function () {
        return $Defaults.ATTACHMENT_PADDING_RIGHT;
    },
    getPaddingTop: function () {
        return $Defaults.ATTACHMENT_PADDING_TOP;
    },
    getPaddingBottom: function () {
        return $Defaults.ATTACHMENT_PADDING_BOTTOM;
    },
    getDirection: function () {
        return $Defaults.ATTACHMENT_DIRECTION;
    },
    isFill: function () {
        return $Defaults.ATTACHMENT_FILL;
    },
    getFillColor: function () {
        return $Defaults.ATTACHMENT_FILL_COLOR;
    },
    getGradient: function () {
        return $Defaults.ATTACHMENT_GRADIENT;
    },
    getGradientColor: function () {
        return $Defaults.ATTACHMENT_GRADIENT_COLOR;
    },
    getOutlineWidth: function () {
        return $Defaults.ATTACHMENT_OUTLINE_WIDTH;
    },
    getOutlineColor: function () {
        return $Defaults.ATTACHMENT_OUTLINE_COLOR;
    },
    getCap: function () {
        return $Defaults.ATTACHMENT_CAP;
    },
    getJoin: function () {
        return $Defaults.ATTACHMENT_JOIN;
    },
    isShadowable: function () {
        return $Defaults.ATTACHMENT_SHADOWABLE;
    },
    hit: function (x, y) {
        if (!$math.containsPoint(this._viewRect, x, y)) {
            return false;
        }
        if ($math.containsPoint(this._contentRect, x, y)) {
            return true;
        }
        return $g.hit(this._attachmentCanvas, x, y);
    },
    intersects: function (rect) {
        if (!$math.intersects(this._viewRect, rect)) {
            return false;
        }
        if ($math.intersects(this._contentRect, rect)) {
            return true;
        }
        return $g.intersects(this._attachmentCanvas, rect);
    }
});
