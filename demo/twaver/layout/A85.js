var $A85 = function (node, d10, d11, i1, layoutgraph) {
    this._o = 0;
    this._l = 0;
    this._i = 0;
    this._d = 0;
    this._f = 0;
    this._b = node;
    this._a = 0.0001;
    this._r = d10;
    this._p = 1.0;
    this._e = (layoutgraph.gj(node) + layoutgraph.g9(node)) / 4;

    var d12 = 0.45 * d11 * Math.sqrt(i1);
    this._k = $A72.l(-d12, d12);
    this._h = $A72.l(-d12, d12);
    this._g = $A72.l(-d12, d12);
};
_twaver.ext($A85, Object, {

});
