var $A30 = function (count) {
    this._a = $A53.d(count);
    this._b = -1;
};
_twaver.ext($A30, Object, {
    d: function () {
        return this._a[this._b];
    },
    b: function () {
        return this._a[this._b--];
    },
    c: function (item) {
        this._a[++this._b] = item;
    },
    a: function () {
        return this._b < 0;
    }
});
