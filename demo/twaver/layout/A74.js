var $A74 = function () {
    this._o = 0;
    this._f = 0;
    this._n = 0;
    this._m = 0;
    this._c = 0;
    this._p = 0;
    this._e = 0;
    this._a = 0;
    this._j = new $A25();
    this._g = new $A91();
    this._d = new $A91();
    this._b = new $A91();
    this._q = new $A91();
    this._h = new $A91();
    this._k = new $A91();
    this._i = new $A91();
    this._l = new $A91();
};
_twaver.ext($A74, Object, {
    a1: function () {
        return Math.max(this._q._bc, this._b._bc);
    },
    d: function () {
        return Math.max(this._d._bc, this._g._bc);
    },
    b: function () {
        return Math.max(this._k._bc, this._h._bc);
    },
    c: function () {
        return Math.max(this._l._bc, this._i._bc);
    },
    a2: function (d1, d2, d3, d4) {
        this._c = d2;
        this._a = d4;
        this._p = d1;
        this._e = d3;
        this._g.c0();
        this._d.c0();
        this._b.c0();
        this._q.c0();
        this._k.c0();
        this._h.c0();
        this._l.c0();
        this._i.c0();
    }
});
