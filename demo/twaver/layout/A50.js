var $A50 = function () {
    if (arguments.length === 2) {
        this._a = new $A35();
        this._b = new $A35();
        this._c = 0.0;
        var e = arguments[0];
        var node = arguments[1];
        var _la = new $A51(e._j2.gj(node) / 2, 0.0);
        this._a.ac(_la);
        _la = new $A51(e._j2.gj(node) / 2, 0.0);
        this._b.ac(_la);
    } else {
        this._a = arguments[1];
        this._b = arguments[2];
        this._c = arguments[3];
    }
};
_twaver.ext($A50, Object, {

});
