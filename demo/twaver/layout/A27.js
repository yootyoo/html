var $A27 = function (node, i) {
    this._p = node;
    this._j = i;
    this._o = node._o[i];
};
_twaver.ext($A27, Object, {
    i1: function () {
        return this._o != null;
    },
    i2: function () {
        this._o = this._o._k[this._j];
    },
    i3: function () {
        this._o = this._o._f[this._j];
    },
    i4: function () {
        this._o = this._p._o[this._j];
    },
    i5: function () {
        this._o = this._p._q[this._j];
    },
    i7: function () {
        return this._p._n[this._j];
    },
    i6: function () {
        return this._o;
    },
    i8: function () {
        return this._o;
    }
});
