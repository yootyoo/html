var $A15 = function (a) {
    this._a = a;
};
_twaver.ext($A15, $A19, {
    a3: function (edge, node1, flag) {
        if (flag && edge.a2() === node1)
            this._a.ac(edge);
    }
});
