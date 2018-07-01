twaver.canvas.BasicAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.canvas.BasicAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._roundRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    this._contentRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
};
_twaver.ext('twaver.canvas.BasicAttachment', twaver.canvas.Attachment, {
    paint: function (ctx) {
        twaver.canvas.BasicAttachment.superClass.paint.apply(this, arguments);
        var fill = this.isFill();
        var outlineWidth = this.getOutlineWidth();
        this.getElementUI().setShadow(this, ctx);
        if (outlineWidth > 0 || fill) {
            $g.drawRoundRect(ctx, this._roundRect.x, this._roundRect.y, this._roundRect.width, this._roundRect.height, this.getCornerRadius());
            //todo make sure drawRoundRect and pointer same direction
            if (this._pointers) {
                ctx.moveTo(this._pointers[0].x, this._pointers[0].y);
                ctx.lineTo(this._pointers[1].x, this._pointers[1].y);
                ctx.lineTo(this._pointers[2].x, this._pointers[2].y);
            }
            ctx.closePath();

            if (outlineWidth > 0) {
                ctx.lineWidth = outlineWidth;
                ctx.strokeStyle = this.getOutlineColor();
                ctx.lineCap = this.getCap();
                ctx.lineJoin = this.getJoin();
                ctx.stroke();
            }
            if (fill) {
                var fillColor = this.getFillColor();
                var gradient = this.getGradient();
                if (gradient) {
                    $g.fill(ctx, fillColor, gradient, this.getGradientColor(), this._viewRect);
                } else {
                    ctx.fillStyle = fillColor;
                }
                ctx.fill();
            }
        }
    },
    validate: function () {
        twaver.canvas.BasicAttachment.superClass.validate.call(this);
        this.calculateMeasure();

        var outlineWidth = this.getOutlineWidth();

        this._viewRect = $math.getRect(this._pointers);
        this._viewRect = $math.unionRect(this._viewRect, this._roundRect);
        if (outlineWidth > 0) {
            $math.grow(this._viewRect, outlineWidth / 2, outlineWidth / 2);
        }
        this._viewRect = this._ui.appendShadowBound(this, this._viewRect);
    },
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
            if(this._ui._element instanceof twaver.Link){
                var points = this._ui.getLinkPoints();
                var lineLength;
                if (this._ui.getLineLength) {
                    lineLength = this._ui.getLineLength();
                } else {
                    lineLength = this._ui._element.getLineLength();
                }
                
                if (Math.abs(xOffset) > 0 && Math.abs(xOffset) < 1) {
                    if(position === 'from'){
                        xOffset *= lineLength;
                    }else if(position === 'to'){
                        xOffset = lineLength * (1 - xOffset);
                    }else{
                        xOffset /= 2;
                        xOffset += 0.5;
                        xOffset *= lineLength;
                    }
                }else{
                    if(position === 'from'){
                        xOffset = xOffset;
                    }else if(position === 'to'){
                        xOffset = lineLength - xOffset;
                    }else{
                        xOffset += lineLength/2;
                    }
                }

                var pointInfo = $math.calculatePointInfoAlongLine(points, true, xOffset, yOffset);
                var translatePoint = pointInfo.point;
                var rotateAngle = pointInfo.angle;

                var c;
                if(position === 'from'){
                    c = this._ui.getFromPoint();
                }else if(position === 'to'){
                    c = this._ui.getToPoint();
                }else{
                    c = this._ui._hotSpot;
                }

                xOffset = translatePoint.x - c.x;
                yOffset = translatePoint.y - c.y;
            }
            
            location = this._network.getPosition(position, this._ui, null, xOffset, yOffset);
            var endPoint;
            if (direction === 'aboveleft') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - (roundRect.width - cornerRadius);
                endPoint = Math.max(location.x - pointerWidth, roundRect.x + cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x,
                    y: location.y - pointerLength
                },
                {
                    x: endPoint,
                    y: location.y - pointerLength
                }];
            }
            else if (direction === 'aboveright') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - cornerRadius;
                endPoint = Math.min(location.x + pointerWidth, roundRect.x + roundRect.width - cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x,
                    y: location.y - pointerLength
                },
                {
                    x: endPoint,
                    y: location.y - pointerLength
                }];
            }
            else if (direction === 'belowleft') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - (roundRect.width - cornerRadius);
                endPoint = Math.max(location.x - pointerWidth, roundRect.x + cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x,
                    y: location.y + pointerLength
                },
                {
                    x: endPoint,
                    y: location.y + pointerLength
                }];
            }
            else if (direction === 'belowright') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - cornerRadius;
                endPoint = Math.min(location.x + pointerWidth, roundRect.x + roundRect.width - cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x,
                    y: location.y + pointerLength
                },
                {
                    x: endPoint,
                    y: location.y + pointerLength
                }];
            }
            else if (direction === 'leftabove') {
                roundRect.y = location.y + cornerRadius - roundRect.height;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.max(location.y - pointerWidth, roundRect.y + cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x - pointerLength,
                    y: location.y
                },
                {
                    x: location.x - pointerLength,
                    y: endPoint
                }];
            }
            else if (direction === 'leftbelow') {
                roundRect.y = location.y - cornerRadius;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.min(location.y + pointerWidth, roundRect.y + roundRect.height - cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x - pointerLength,
                    y: location.y
                },
                {
                    x: location.x - pointerLength,
                    y: endPoint
                }];
            }
            else if (direction === 'rightabove') {
                roundRect.y = location.y + cornerRadius - roundRect.height;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.max(location.y - pointerWidth, roundRect.y + cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x + pointerLength,
                    y: location.y
                },
                {
                    x: location.x + pointerLength,
                    y: endPoint
                }];
            }
            else if (direction === 'rightbelow') {
                roundRect.y = location.y - cornerRadius;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.min(location.y + pointerWidth, roundRect.y + roundRect.height - cornerRadius / 2);
                this._pointers = [location,
                {
                    x: location.x + pointerLength,
                    y: location.y
                },
                {
                    x: location.x + pointerLength,
                    y: endPoint
                }];
            }
            else if (direction === 'above') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - roundRect.width / 2;
                endPoint = Math.min(contentWidth / 2, pointerWidth / 2);
                this._pointers = [location,
                {
                    x: location.x - endPoint,
                    y: location.y - pointerLength
                },
                {
                    x: location.x + endPoint,
                    y: location.y - pointerLength
                }];
            }
            else if (direction === 'below') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - roundRect.width / 2;
                endPoint = Math.min(contentWidth / 2, pointerWidth / 2);
                this._pointers = [location,
                {
                    x: location.x - endPoint,
                    y: location.y + pointerLength
                },
                {
                    x: location.x + endPoint,
                    y: location.y + pointerLength
                }];
            }
            else if (direction === 'left') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x - pointerLength - roundRect.width;
                endPoint = Math.min(contentHeight / 2, pointerWidth / 2);
                this._pointers = [location,
                {
                    x: location.x - pointerLength,
                    y: location.y + endPoint
                },
                {
                    x: location.x - pointerLength,
                    y: location.y - endPoint
                }];
            }
            else if (direction === 'right') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x + pointerLength;
                endPoint = Math.min(contentHeight / 2, pointerWidth / 2);
                this._pointers = [location,
                {
                    x: location.x + pointerLength,
                    y: location.y + endPoint
                },
                {
                    x: location.x + pointerLength,
                    y: location.y - endPoint
                }];
            }
            else {
                throw "Can not resolve '" + direction + "' attachment direction";
            }
        }
        else {
            location = this._network.getPosition(position, this._ui, {
                width: roundRect.width,
                height: roundRect.height
            }, xOffset, yOffset);
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
    getContentWidth: function () {
        return twaver.Defaults.ATTACHMENT_CONTENT_WIDTH;
    },
    getContentHeight: function () {
        return twaver.Defaults.ATTACHMENT_CONTENT_HEIGHT;
    },
    getCornerRadius: function () {
        return twaver.Defaults.ATTACHMENT_CORNER_RADIUS;
    },
    getPointerLength: function () {
        return twaver.Defaults.ATTACHMENT_POINTER_LENGTH;
    },
    getPointerWidth: function () {
        return twaver.Defaults.ATTACHMENT_POINTER_WIDTH;
    },
    getPosition: function () {
        return twaver.Defaults.ATTACHMENT_POSITION;
    },
    getXOffset: function () {
        return twaver.Defaults.ATTACHMENT_XOFFSET;
    },
    getYOffset: function () {
        return twaver.Defaults.ATTACHMENT_YOFFSET;
    },
    getPadding: function () {
        return twaver.Defaults.ATTACHMENT_PADDING;
    },
    getPaddingLeft: function () {
        return twaver.Defaults.ATTACHMENT_PADDING_LEFT;
    },
    getPaddingRight: function () {
        return twaver.Defaults.ATTACHMENT_PADDING_RIGHT;
    },
    getPaddingTop: function () {
        return twaver.Defaults.ATTACHMENT_PADDING_TOP;
    },
    getPaddingBottom: function () {
        return twaver.Defaults.ATTACHMENT_PADDING_BOTTOM;
    },
    getDirection: function () {
        return twaver.Defaults.ATTACHMENT_DIRECTION;
    },
    isFill: function () {
        return twaver.Defaults.ATTACHMENT_FILL;
    },
    getFillColor: function () {
        return twaver.Defaults.ATTACHMENT_FILL_COLOR;
    },
    getGradient: function () {
        return twaver.Defaults.ATTACHMENT_GRADIENT;
    },
    getGradientColor: function () {
        return twaver.Defaults.ATTACHMENT_GRADIENT_COLOR;
    },
    getOutlineWidth: function () {
        return twaver.Defaults.ATTACHMENT_OUTLINE_WIDTH;
    },
    getOutlineColor: function () {
        return twaver.Defaults.ATTACHMENT_OUTLINE_COLOR;
    },
    getCap: function () {
        return twaver.Defaults.ATTACHMENT_CAP;
    },
    getJoin: function () {
        return twaver.Defaults.ATTACHMENT_JOIN;
    },
    isShadowable: function () {
        return twaver.Defaults.ATTACHMENT_SHADOWABLE;
    },
    getRoundRect: function () {
        return _twaver.clone(this._roundRect);
    },
    getContentRect: function () {
        return _twaver.clone(this._contentRect);
    }
    /**
    ,
    getContent: function () {
    return this._content;
    },
    setContent: function (value) {
    if (this._content === value) {
    return;
    }
    this._content = value;
    }*/
});


