var $A29 = function (ad, ai, aflag, aobj) {
    this._r = ad;
    this._s = ai;
    this._q = aflag;
    this._p = aobj;
};
_twaver.ext($A29, Object, {
    i1: function (obj) {
        return this._p[obj.a5()];
    },
    i3: function (obj) {
        return this._r[obj.a5()];
    },
    i2: function (obj) {
        return this._s[obj.a5()];
    },
    i4: function (obj) {
        return this._q[obj.a5()];
    },
    i8: function (obj, obj1) {
        this._p[obj.a5()] = obj1;
    },
    i6: function (obj, d) {
        this._r[obj.a5()] = d;
    },
    i5: function (obj, i) {
        this._s[obj.a5()] = i;
    },
    i7: function (obj, flag) {
        this._q[obj.a5()] = flag;
    }
});
