var $A84 = function (byte0) {
    this._a = byte0;
    this._b = false;
};
_twaver.ext($A84, Object, {
    a: function () {
        return this._b;
    },
    b: function () {
        return this._a;
    },
    c: function () {
        return this._a === 1;
    },
    d: function () {
        return this._a === 2;
    },
    e: function () {
        return this._a === 4;
    },
    f: function () {
        return this._a === 8;
    },
    g: function () {
        return this._a === 0;
    }
});
$A84.h = function (layoutgraph, edge) {
    var dataprovider = layoutgraph.xc("A");
    if (dataprovider == null)
        return null;
    else
        return dataprovider.i1(edge);
};
$A84.i = function (layoutgraph, edge) {
    var dataprovider = layoutgraph.xc("B");
    if (dataprovider == null)
        return null;
    else
        return dataprovider.i1(edge);
};
$A84.j = function (byte0) {
    switch (byte0) {
        case 1:
            return $A84.k;

        case 2:
            return $A84.l;
    }
    return null;
};
$A84.k = new $A84(1);
$A84.l = new $A84(2);
