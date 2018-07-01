var $A28 = function (obj) {
    this._c = obj;
};
_twaver.ext($A28, Object, {
    a: function () {
        return this._a;
    },
    b: function () {
        return this._b;
    },
    c: function (element) {
        this._c = element;
    },
    d: function () {
        return this._c;
    }
});
