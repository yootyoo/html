var $A22 = function (j, for1) {
    this._h = false;
    this._i = j;
    this._g = for1;
};
_twaver.ext($A22, Object, {
    z1: function (obj, obj1) {
        obj._c[this._i] = obj1;
    },
    i1: function (obj) {
        return obj._c[this._i];
    },
    i5: function (obj, flag) {
        obj._c[this._i] = flag;
    },
    i4: function (obj) {
        return obj._c[this._i];
    },
    i7: function (obj, j) {
        obj._c[this._i] = j;
    },
    i2: function (obj) {
        var obj1 = obj._c[this._i];
        if (obj1 == null)
            return 0;
        return obj1;
    },
    i6: function (obj, d1) {
        obj._c[this._i] = d1;
    },
    i3: function (obj) {
        var obj1 = obj._c[this._i];
        if (obj1 == null)
            return 0;
        return obj1;
    },
    c: function () {
        return this._h;
    },
    d: function () {
        this._h = true;
    }
});
