var $A37 = function () {
    this._a = $A72._A;
    this._b = $A72._A;
    this._c = new $List();
};
_twaver.ext($A37, Object, {
    i1: function () {
        return this._c.size();
    },
    i2: function (i) {
        return this._c.get(i);
    },
    i3: function (i, d, d1) {
        this._c.set(i, new $A00(d, d1));
    },
    i4: function (d, d1) {
        this._c.add(new $A00(d, d1));
    },
    i5: function () {
        this._c.clear();
    },
    i6: function () {
        return this._a;
    },
    i7: function () {
        return this._b;
    },
    i8: function (ypoint) {
        this._a = ypoint;
    },
    i9: function (ypoint) {
        this._b = ypoint;
    }
});
