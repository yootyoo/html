var $A05 = function (vector) {
    this._a = new $A35();
    if (vector) {
        for (var i = 0; i < vector.size(); i++)
            this._a.aa(vector.get(i));
    }
};
_twaver.ext($A05, Object, {
    c: function () {
        return this._a.ah();
    },
    d: function () {
        return this._a.ah();
    },
    a: function () {
        var vector = new $List();
        for (var ycursor = this.c(); ycursor.i1(); ycursor.i2())
            vector.add(ycursor.i6(), 0);

        return new $A05(vector);
    },
    b: function () {
        return this._a.ay();
    }
});
