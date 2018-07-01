var $A38 = function () {
    this._x = 0;
    this._y = 0;
    this._w = 0;
    this._h = 0;
};
_twaver.ext($A38, Object, {
    i5: function (d, d1) {
        this._x = d;
        this._y = d1;
    },
    i6: function (d, d1) {
        this._w = d;
        this._h = d1;
    },
    i4: function () {
        return this._h;
    },
    i3: function () {
        return this._w;
    },
    i1: function () {
        return this._x;
    },
    i2: function () {
        return this._y;
    }
});
