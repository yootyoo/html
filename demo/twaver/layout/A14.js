var $A14 = function (a) {
    this._a = a;
};
_twaver.ext($A14, $A19, {
    a2: function (edge2, node3) {
        var node4 = edge2.a1(node3);
        var _la1 = this._a[node4.al()];
        var _la2 = this._a[node3.al()];
        if (_la2._a + 1 > _la1._a) {
            _la1._c = _la1._a;
            _la1._b = _la1._d;
            _la1._a = _la2._a + 1;
            _la1._d = edge2;
        } else if (_la2._a + 1 > _la1._c) {
            _la1._c = _la2._a + 1;
            _la1._b = edge2;
        }
    }
});
