var $A45 = function (o) {
    this._o = o;
    this._c = o._a;
};
_twaver.ext($A45, Object, {
    i1: function () {
        return this._c != null;
    },
    i2: function () {
        this._c = this._c._a;
    },
    i3: function () {
        this._c = this._c._b;
    },
    i5: function () {
        this._c = this._o._b;
    },
    i4: function () {
        this._c = this._o._a;
    },
    i7: function () {
        return this._o._c;
    },
    i6: function () {
        return this._c;
    },
    i9: function () {
        return this._c;
    },
    i8: function () {
        return this._c;
    }
});
