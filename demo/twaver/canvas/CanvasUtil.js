var $CanvasUtil = {
    _hitCanvas: null,
    getHitCanvas: function (w, h) {
        if (this._hitCanvas == null) {
            this._hitCanvas = $html.createCanvas();
        }
        if (arguments.length == 0) {
            w = 2;
            h = 2;
        }
        this._hitCanvas.setAttribute("width", '' + w - 1);
        this._hitCanvas.setAttribute("height", '' + h - 1);
        this._hitCanvas.setAttribute("width", '' + w);
        this._hitCanvas.setAttribute("height", '' + h);
        var ctx = this.getCtx(this._hitCanvas);
        ctx.clearRect(0, 0, w, h);
        return this._hitCanvas;
    },
    disposeHitCanvas: function () {
        this._hitCanvas = null;
    },
    getCtx: function (cvs) {
        return cvs.getContext("2d");
    },
    render: function (ctx, fillStyle, strokeStyle) {
        if (fillStyle != undefined) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        if (strokeStyle != undefined) {
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        }
    },
    text: function (ctx, text, x, y, fillStyle, strokeStyle) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (fillStyle != null) {
            ctx.fillStyle = fillStyle;
            ctx.fillText(text, x, y);
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.strokeText(text, x, y);
        }
    },
    circle: function (ctx, cx, cy, r, fillStyle, strokeStyle) {
        ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        this.render(ctx, fillStyle, strokeStyle);
    },
    rect: function (ctx, x, y, width, height, fillStyle, strokeStyle) {
        ctx.rect(x, y, width, height);
        ctx.closePath();
        this.render(ctx, fillStyle, strokeStyle);
    },
    OUT_LEFT: 1,
    OUT_TOP: 2,
    OUT_RIGHT: 4,
    OUT_BOTTOM: 8,

    outcode: function (pX, pY, rectX, rectY, rectWidth, rectHeight) {
        var out = 0;
        if (rectWidth <= 0) {
            out |= this.OUT_LEFT | this.OUT_RIGHT;
        } else if (pX < rectX) {
            out |= this.OUT_LEFT;
        } else if (pX > rectX + rectWidth) {
            out |= this.OUT_RIGHT;
        }
        if (rectHeight <= 0) {
            out |= this.OUT_TOP | this.OUT_BOTTOM;
        } else if (pY < rectY) {
            out |= this.OUT_TOP;
        } else if (pY > rectY + rectHeight) {
            out |= this.OUT_BOTTOM;
        }
        return out;
    },

    intersectsLine: function (lineX1, lineY1, lineX2, lineY2, rectX, rectY, rectWidth, rectHeight) {
        var out1, out2;
        if ((out2 = this.outcode(lineX2, lineY2, rectX, rectY, rectWidth, rectHeight)) == 0) {
            return true;
        }
        while ((out1 = this.outcode(lineX1, lineY1, rectX, rectY, rectWidth, rectHeight)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (this.OUT_LEFT | this.OUT_RIGHT)) != 0) {
                var x = rectX;
                if ((out1 & this.OUT_RIGHT) != 0) {
                    x += rectWidth;
                }
                lineY1 = lineY1 + (x - lineX1) * (lineY2 - lineY1) / (lineX2 - lineX1);
                lineX1 = x;
            } else {
                var y = rectY;
                if ((out1 & this.OUT_BOTTOM) != 0) {
                    y += rectHeight;
                }
                lineX1 = lineX1 + (y - lineY1) * (lineX2 - lineX1) / (lineY2 - lineY1);
                lineY1 = y;
            }
        }
        return true;
    }
}

