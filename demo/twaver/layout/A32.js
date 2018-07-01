var $A32 = function (list) {
    this._bb = list;
    this.i4();
};
_twaver.ext($A32, Object, {
    i1: function () {
        return this._aa != null;
    },
    i2: function () {
        this._aa = this._aa._a;
    },
    i3: function () {
        this._aa = this._aa._b;
    },
    i4: function () {
        this._aa = this._bb._b;
    },
    i5: function () {
        this._aa = this._bb._c;
    },
    i7: function () {
        return this._bb.ay();
    },
    i6: function () {
        return this._aa._c;
    }
});
