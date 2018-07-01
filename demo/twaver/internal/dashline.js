var $DashedLine = function (g, onLength, offLength) {
    this.g = g;
    this.onLength = onLength;
    this.offLength = offLength;

    this.isLine = true;
    this.overflow = 0;
    this.dashLength = onLength + offLength;
    this.pen = { x: 0, y: 0 };
};
_twaver.ext($DashedLine, Object, {
    _curveaccuracy: 6,
    moveTo: function (x, y) {
        this.pen = { x: x, y: y };
        this.g.moveTo(x, y);
        if (!this.start) {
            this.start = { x: x, y: y };
        }
    },
    lineTo: function (x, y) {
        var dx = x - this.pen.x, dy = y - this.pen.y;
        var a = Math.atan2(dy, dx);
        var ca = Math.cos(a), sa = Math.sin(a);
        var segLength = this.lineLength(this.pen.x, this.pen.y, x, y);
        if (this.overflow) {
            if (this.overflow > segLength) {
                if (this.isLine) this._lineTo(x, y);
                else this.moveTo(x, y);
                this.overflow -= segLength;
                return;
            }
            if (this.isLine) this._lineTo(this.pen.x + ca * this.overflow, this.pen.y + sa * this.overflow);
            else this.moveTo(this.pen.x + ca * this.overflow, this.pen.y + sa * this.overflow);
            segLength -= this.overflow;
            this.overflow = 0;
            this.isLine = !this.isLine;
            if (!segLength) return;
        }
        var fullDashCount = Math.floor(segLength / this.dashLength);
        if (fullDashCount) {
            var onx = ca * this.onLength, ony = sa * this.onLength;
            var offx = ca * this.offLength, offy = sa * this.offLength;
            for (var i = 0; i < fullDashCount; i++) {
                if (this.isLine) {
                    this._lineTo(this.pen.x + onx, this.pen.y + ony);
                    this.moveTo(this.pen.x + offx, this.pen.y + offy);
                } else {
                    this.moveTo(this.pen.x + offx, this.pen.y + offy);
                    this._lineTo(this.pen.x + onx, this.pen.y + ony);
                }
            }
            segLength -= this.dashLength * fullDashCount;
        }
        if (this.isLine) {
            if (segLength > this.onLength) {
                this._lineTo(this.pen.x + ca * this.onLength, this.pen.y + sa * this.onLength);
                this.moveTo(x, y);
                this.overflow = this.offLength - (segLength - this.onLength);
                this.isLine = false;
            } else {
                this._lineTo(x, y);
                if (segLength == this.onLength) {
                    this.overflow = 0;
                    this.isLine = !this.isLine;
                } else {
                    this.overflow = this.onLength - segLength;
                    this.moveTo(x, y);
                }
            }
        } else {
            if (segLength > this.offLength) {
                this.moveTo(this.pen.x + ca * this.offLength, this.pen.y + sa * this.offLength);
                this._lineTo(x, y);
                this.overflow = this.onLength - (segLength - this.offLength);
                this.isLine = true;
            } else {
                this.moveTo(x, y);
                if (segLength == this.offLength) {
                    this.overflow = 0;
                    this.isLine = !this.isLine;
                } else this.overflow = this.offLength - segLength;
            }
        }
    },
    quadraticCurveTo: function (cx, cy, x, y) {
        var sx = this.pen.x;
        var sy = this.pen.y;
        var segLength = this.curveLength(sx, sy, cx, cy, x, y);
        var t = 0;
        var t2 = 0;
        var c;
        if (this.overflow) {
            if (this.overflow > segLength) {
                if (this.isLine) this._curveTo(cx, cy, x, y);
                else this.moveTo(x, y);
                this.overflow -= segLength;
                return;
            }
            t = this.overflow / segLength;
            c = this.curveSliceUpTo(sx, sy, cx, cy, x, y, t);
            if (this.isLine) this._curveTo(c[2], c[3], c[4], c[5]);
            else this.moveTo(c[4], c[5]);
            this.overflow = 0;
            this.isLine = !this.isLine;
            if (!segLength) return;
        }
        var remainLength = segLength - segLength * t;
        var fullDashCount = Math.floor(remainLength / this.dashLength);
        var ont = this.onLength / segLength;
        var offt = this.offLength / segLength;
        if (fullDashCount) {
            for (var i = 0; i < fullDashCount; i++) {
                if (this.isLine) {
                    t2 = t + ont;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this._curveTo(c[2], c[3], c[4], c[5]);
                    t = t2;
                    t2 = t + offt;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this.moveTo(c[4], c[5]);
                } else {
                    t2 = t + offt;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this.moveTo(c[4], c[5]);
                    t = t2;
                    t2 = t + ont;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this._curveTo(c[2], c[3], c[4], c[5]);
                }
                t = t2;
            }
        }
        remainLength = segLength - segLength * t;
        if (this.isLine) {
            if (remainLength > this.onLength) {
                t2 = t + ont;
                c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                this._curveTo(c[2], c[3], c[4], c[5]);
                this.moveTo(x, y);
                this.overflow = this.offLength - (remainLength - this.onLength);
                this.isLine = false;
            } else {
                c = this.curveSliceFrom(sx, sy, cx, cy, x, y, t);
                this._curveTo(c[2], c[3], c[4], c[5]);
                if (segLength == this.onLength) {
                    this.overflow = 0;
                    this.isLine = !this.isLine;
                } else {
                    this.overflow = this.onLength - remainLength;
                    this.moveTo(x, y);
                }
            }
        } else {
            if (remainLength > this.offLength) {
                t2 = t + offt;
                c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                this.moveTo(c[4], c[5]);
                c = this.curveSliceFrom(sx, sy, cx, cy, x, y, t2);
                this._curveTo(c[2], c[3], c[4], c[5]);

                this.overflow = this.onLength - (remainLength - this.offLength);
                this.isLine = true;
            } else {
                this.moveTo(x, y);
                if (remainLength == this.offLength) {
                    this.overflow = 0;
                    this.isLine = !this.isLine;
                } else this.overflow = this.offLength - remainLength;
            }
        }
    },
    bezierCurveTo: function (cx1, cy1, cx2, cy2, x, y) {
        this.pen = { x: x, y: y };
        var lineDash = [this.onLength, this.offLength];
        this.g.setLineDash && this.g.setLineDash(lineDash);
        this.g.lineDash = lineDash;
        this.g.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    },
    rect: function (x, y, w, h) {
        this.pen = { x: x, y: y };
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.lineTo(x, y);
    },
    closePath: function () {
        this.lineTo(this.start.x, this.start.y);
    },
    lineLength: function (sx, sy, ex, ey) {
        var dx = ex - sx;
        var dy = ey - sy;
        return Math.sqrt(dx * dx + dy * dy);
    },
    curveLength: function (sx, sy, cx, cy, ex, ey, accuracy) {
        var total = 0;
        var tx = sx;
        var ty = sy;
        var px, py, t, it, a, b, c;
        var n = (accuracy > 0) ? accuracy : this._curveaccuracy;
        for (var i = 1; i <= n; i++) {
            t = i / n;
            it = 1 - t;
            a = it * it; b = 2 * t * it; c = t * t;
            px = a * sx + b * cx + c * ex;
            py = a * sy + b * cy + c * ey;
            total += this.lineLength(tx, ty, px, py);
            tx = px;
            ty = py;
        }
        return total;
    },
    curveSlice: function (sx, sy, cx, cy, ex, ey, t1, t2) {
        if (t1 == 0) return this.curveSliceUpTo(sx, sy, cx, cy, ex, ey, t2);
        else if (t2 == 1) return this.curveSliceFrom(sx, sy, cx, cy, ex, ey, t1);
        var c = this.curveSliceUpTo(sx, sy, cx, cy, ex, ey, t2);
        c.push(t1 / t2);
        return this.curveSliceFrom.apply(this, c);
    },
    curveSliceUpTo: function (sx, sy, cx, cy, ex, ey, t) {
        if (t != 1) {
            var midx = cx + (ex - cx) * t;
            var midy = cy + (ey - cy) * t;
            cx = sx + (cx - sx) * t;
            cy = sy + (cy - sy) * t;
            ex = cx + (midx - cx) * t;
            ey = cy + (midy - cy) * t;
        }
        return [sx, sy, cx, cy, ex, ey];
    },
    curveSliceFrom: function (sx, sy, cx, cy, ex, ey, t) {
        if (t != 1) {
            var midx = sx + (cx - sx) * t;
            var midy = sy + (cy - sy) * t;
            cx = cx + (ex - cx) * t;
            cy = cy + (ey - cy) * t;
            sx = midx + (cx - midx) * t;
            sy = midy + (cy - midy) * t;
        }
        return [sx, sy, cx, cy, ex, ey];
    },
    _lineTo: function (x, y) {
        if (x == this.pen.x && y == this.pen.y) return;
        this.pen = { x: x, y: y };
        this.g.lineTo(x, y);
    },
    _curveTo: function (cx, cy, x, y) {
        if (cx == x && cy == y && x == this.pen.x && y == this.pen.y) return;
        this.pen = { x: x, y: y };
        this.g.quadraticCurveTo(cx, cy, x, y);
    }
});
_twaver.DashedLine = $DashedLine;
