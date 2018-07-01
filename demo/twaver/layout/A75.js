var $A75 = function (layoutgraph, nodemap, nodemap1, edgemap) {
    this._i = 20;
    this._j = layoutgraph;
    this._g = nodemap;
    this._a = nodemap1;
    this._h = edgemap;
};
_twaver.ext($A75, Object, {
    a1: function (d1) {
        this._i = d1;
    },
    b2: function (node) {
        return this._e == null ? false : this._e.i4(node);
    },
    a3: function (node) {
        return this._f == null ? null : this._f.i1(node);
    },
    d: function () {
        this._j.xi(this._f);
        this._j.xi(this._e);
    }
});
