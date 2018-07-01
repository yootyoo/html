var $A23 = function (i, for1) {
    this._c = false;
    this._d = i;
    this._b = for1;
};
_twaver.ext($A23, Object, {
    i8: function (obj, obj1) {
        obj._c[this._d] = obj1;
    },
    i1: function (obj) {
        return obj._c[this._d];
    },
    i7: function (obj, flag) {
        obj._c[this._d] = flag;
    },
    i4: function (obj) {
        var obj1 = obj._c[this._d];
        if (obj1 == null)
            return false;
        return obj1;
    },
    i5: function (obj, i) {
        obj._c[this._d] = i;
    },
    i2: function (obj) {
        var obj1 = obj._c[this._d];
        if (obj1 == null)
            return 0;
        return obj1;
    },
    i6: function (obj, d1) {
        obj._c[this._d] = d1;
    },
    i3: function (obj) {
        var obj1 = obj._c[this._d];
        if (obj1 == null)
            return 0.0;
        return obj1;
    },
    a: function () {
        return this._c;
    },
    b: function () {
        this._c = true;
    }
});
