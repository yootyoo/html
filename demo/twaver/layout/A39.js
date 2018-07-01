var $A39 = function (ad, ai, aflag, aobj) {
    this._m = ad;
    this._n = ai;
    this._l = aflag;
    this._k = aobj;
};
_twaver.ext($A39, Object, {
    i1: function (obj) {
        return this._k[obj.al()];
    },
    i3: function (obj) {
        return this._m[obj.al()];
    },
    i2: function (obj) {
        return this._n[obj.al()];
    },
    i4: function (obj) {
        return this._l[obj.al()];
    },
    z1: function (obj, obj1) {
        this._k[obj.al()] = obj1;
    },
    i6: function (obj, d) {
        this._m[obj.al()] = d;
    },
    i7: function (obj, i) {
        this._n[obj.al()] = i;
    },
    i5: function (obj, flag) {
        this._l[obj.al()] = flag;
    }
});
