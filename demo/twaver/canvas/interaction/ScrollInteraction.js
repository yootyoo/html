twaver.canvas.interaction.ScrollInteraction = function (network) {
    twaver.canvas.interaction.ScrollInteraction.superClass.constructor.call(this, network);
    this.hThumbRect = null;
    this.vThumbRect = null;
    this.scrollBarVisible = false;
};
_twaver.ext('twaver.canvas.interaction.ScrollInteraction', twaver.canvas.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mouseover', 'mouseout');
        if ($ua.isFirefox) {
            $html.addEventListener("DOMMouseScroll", "handleMouseWheel", this.network.getView(), this);
        } else {
            $html.addEventListener("mousewheel", "handleMouseWheel", this.network.getView(), this);
        }
        $html.addEventListener("mouseup", "handleMouseUp", window, this);
        $html.addEventListener("mousemove", "handleMouseMove", window, this);

        this.network.addPropertyChangeListener(this.handleViewRectChange, this);
        this.validateScrollBar();
        this.network.addMarker(this);
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mouseover', 'mouseout');
        if ($ua.isFirefox) {
            $html.removeEventListener("DOMMouseScroll", this.network.getView(), this);
        } else {
            $html.removeEventListener("mousewheel", this.network.getView(), this);
        }
        $html.removeEventListener("mouseup", window, this);
        $html.removeEventListener("mousemove", window, this);

        this.network.removePropertyChangeListener(this.handleViewRectChange, this);
        this.network.removeMarker(this);
    },
    handleViewRectChange: function (e) {
        if (e.property == "viewRect" || e.property == "canvasSizeChange") {
            this.validateScrollBar();
        }
    },
    getScrollBarWidth: function () {
        return this.network.getScrollBarWidth();
    },
    getScrollBarColor: function () {
        return '#cccccc';
    },
    validateScrollBar: function () {
        this.hThumbRect = null;
        this.vThumbRect = null;
        if (this.network.isScrollBarVisible() == false) {
            this.repaint();
            return;
        }

        var h = this.network.getViewRect().height;
        var w = this.network.getViewRect().width;
        var x = this.network.getViewRect().x;
        var y = this.network.getViewRect().y;
        var realSize = this.network.getCanvasSize();
        var rw = realSize.width;
        var rh = realSize.height;
        if (rw > w) {
            if (x < 0 || x + w > rw) {
                this.repaint();
                return;
            }
        }
        if (rh > h) {
            if (y < 0 || y + h > rh) {
                this.repaint();
                return;
            }
        }
        var vth = 0;
        var vVisible = h < rh;
        var hVisible = w < rw;

        var scroolBarSize = this.getScrollBarWidth();

        if (h < rh) {
            if (hVisible) {
                vth = h * (h - scroolBarSize) / rh;
            } else {
                vth = h * h / rh;
            }
            var vy = y / (rh - h) * (h - vth - scroolBarSize);
            this.vThumbRect = {
                x: w - scroolBarSize,
                y: vy,
                width: scroolBarSize,
                height: vth
            }
        }
        var wtw = 0;
        if (w < rw) {
            if (vVisible) {
                wtw = w * (w - scroolBarSize) / rw;
            } else {
                wtw = w * w / rw;
            }
            var hx = x / (rw - w) * (w - wtw - scroolBarSize);
            this.hThumbRect = {
                x: hx,
                y: h - scroolBarSize,
                width: wtw,
                height: scroolBarSize
            }
        }
        this.network.setHScrollBarVisible(this.hThumbRect != null);
        this.network.setVScrollBarVisible(this.vThumbRect != null);

        this.repaint();
    },
    scrollXOffset:function(left){
        var h = this.network.getViewRect().height;
        var w = this.network.getViewRect().width;
        var x = this.network.getViewRect().x;
        var y = this.network.getViewRect().y;
        var xoffset = 30;
        if (left) {
            xoffset = -30;
        }
        this.network.setViewRect(x+xoffset, y, w, h);
    },
    scrollYOffset:function(up){
        var h = this.network.getViewRect().height;
        var w = this.network.getViewRect().width;
        var x = this.network.getViewRect().x;
        var y = this.network.getViewRect().y;
        var yoffset = 30;
        if (up) {
            yoffset = -30;
        }
        this.network.setViewRect(x, y+yoffset, w, h);
    },
    handle_mousedown: function (e) {
        if (this.network.isValidEvent(e) == true) {
            return;
        }
        var point = this.getMarkerPoint(e);

        this.hBarDownPoint = null;
        this.vBarDownPoint = null;
        if (this.vThumbRect != null) {
            if ($math.containsPoint(this.vThumbRect, point.x, point.y)) {
                this.vBarDownPoint = {
                    x: e.screenX,
                    y: e.screenY
                };
                this.vBarDownOffset = this.vBarDownPoint.y - this.vThumbRect.y;
            }
        }
        if (this.hThumbRect != null) {
            if ($math.containsPoint(this.hThumbRect, point.x, point.y)) {
                this.hBarDownPoint = {
                    x: e.screenX,
                    y: e.screenY
                };
                this.hBarDownOffset = this.hBarDownPoint.x - this.hThumbRect.x;
            }
        }
    },
    handle_mouseover: function (e) {
        if (this.scrollBarVisible == true) {
            return;
        }
        this.scrollBarVisible = true;
        this.repaint();
    },
    handle_mouseout: function (e) {
        if (this.scrollBarVisible == false) {
            return;
        }
        this.scrollBarVisible = false;
        this.repaint();
    },
    handleMouseUp: function (e) {
        this.vBarDownPoint = null;
        this.hBarDownPoint = null;
        this.repaint();
    },
    handleMouseMove: function (e) {
        var point = {
            x: e.screenX,
            y: e.screenY
        };
        var realSize = this.network.getCanvasSize();
        var h = this.network.getViewRect().height;
        var w = this.network.getViewRect().width;

        var scroolBarSize = this.getScrollBarWidth();

        if (this.hBarDownPoint != null) {
            var xoff = (point.x - this.hBarDownPoint.x);
            this.hBarDownPoint = point;
            this.network.setViewOffSet(xoff * realSize.width / (w - scroolBarSize), 0);
            return;
        }
        if (this.vBarDownPoint != null) {
            var yoff = (point.y - this.vBarDownPoint.y);
            this.vBarDownPoint = point;
            this.network.setViewOffSet(0, yoff * realSize.height / (h - scroolBarSize));
            return;
        }
    },
    handleMouseWheel: function (e) {
        var up = false;
        var left = false;
        if(e.wheelDelta !== e.wheelDeltaX){
             if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    up = true;
                }
            } else {
                if (e.detail < 0) {
                    up = true;
                }
            }
            this.scrollYOffset(up);
        }else{
            if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    up = true;
                }
            } else {
                if (e.detail < 0) {
                    up = true;
                }
            }
            this.scrollYOffset(up);
        }
    },
    paintRoundRect: function (ctx, fillStyle, alpha, x, y, w, h, r) {
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fillStyle;
        $g.drawRoundRect(ctx, x, y, w, h, r);
        ctx.fill();
    },
    paint: function (ctx) {
        if (this.network.isScrollBarVisible() == false) {
            return;
        }
        if (this.scrollBarVisible == false) {
            if (this.hBarDownPoint == null && this.vBarDownPoint == null) {
                return;
            }
        }
        var scroolBarSize = this.getScrollBarWidth();
        var h = this.network.getViewRect().height;
        var w = this.network.getViewRect().width;

        ctx.save();
        var lingrad;
        var color = this.getScrollBarColor();
        if (this.hThumbRect != null) {
            lingrad = ctx.createLinearGradient(this.hThumbRect.x, this.hThumbRect.y, this.hThumbRect.x, this.hThumbRect.y + this.hThumbRect.height);
            lingrad.addColorStop(0, color);
            lingrad.addColorStop(1, '#666666');
            this.paintRoundRect(ctx, this.getScrollBarColor(), 0.5, 0, h - scroolBarSize, w - scroolBarSize, scroolBarSize, scroolBarSize / 2);
            this.paintRoundRect(ctx, lingrad, 0.9, this.hThumbRect.x, this.hThumbRect.y + 1, this.hThumbRect.width, this.hThumbRect.height - 2, scroolBarSize / 2);
        }
        if (this.vThumbRect != null) {
            lingrad = ctx.createLinearGradient(this.vThumbRect.x, this.vThumbRect.y, this.vThumbRect.x + this.vThumbRect.width, this.vThumbRect.y);
            lingrad.addColorStop(0, color);
            lingrad.addColorStop(1, '#666666');
            this.paintRoundRect(ctx, this.getScrollBarColor(), 0.5, w - scroolBarSize, 0, scroolBarSize, h - scroolBarSize, scroolBarSize / 2);
            this.paintRoundRect(ctx, lingrad, 0.9, this.vThumbRect.x + 1, this.vThumbRect.y, this.vThumbRect.width - 2, this.vThumbRect.height, scroolBarSize / 2);
        }
        ctx.restore();
    }
});
