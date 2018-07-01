var $A11 = function () {
    if (arguments.length === 2) {
        var d1 = arguments[0], d2 = arguments[1];
        this._s = false;
        this._w = 30;
        this._h = 30;
        this._x = d1 - this._w / 2;
        this._y = d2 - this._h / 2;
    } else {
        var noderealizer = arguments[0];
        this._s = noderealizer._s;
        this._w = noderealizer._w;
        this._h = noderealizer._h;
        this._x = noderealizer._x;
        this._y = noderealizer._y;
    }
};
_twaver.ext($A11, Object, {
    m3: function () {
        return this.m2(this);
    },
    m4: function () {
        return this._x + this._w / 2;
    },
    m5: function () {
        return this._y + this._h / 2;
    },
    m6: function (d1, d2) {
        this._x = d1 - this._w / 2;
        this._y = d2 - this._h / 2;
    },
    i1: function () {
        return this._x;
    },
    i2: function () {
        return this._y;
    },
    i5: function (d1, d2) {
        this._x = d1;
        this._y = d2;
    },
    i3: function () {
        return this._w;
    },
    i4: function () {
        return this._h;
    },
    i6: function (d1, d2) {
        var d3 = (this._w - d1) / 2;
        var d4 = (this._h - d2) / 2;
        this._x += d3;
        this._y += d4;
        this._w = d1;
        this._h = d2;
    },
    m1: function (rectangle2d) {
        var d1, d2, d3, d4;
        if (rectangle2d.width <= 0.0) {
            d1 = this._x;
            d2 = this._x + this._w;
            d3 = this._y;
            d4 = this._y + this._h;
        } else {
            d1 = Math.min(this._x, rectangle2d.x);
            d2 = Math.max(this._x + this._w, rectangle2d.x + rectangle2d.width);
            d3 = Math.min(this._y, rectangle2d.y);
            d4 = Math.max(this._y + this._h, rectangle2d.y + rectangle2d.height);
        }

        rectangle2d.x = d1;
        rectangle2d.y = d3;
        rectangle2d.width = d2 - d1;
        rectangle2d.height = d4 - d3;
    }
});
