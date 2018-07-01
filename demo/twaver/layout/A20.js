var $A20 = function () {
    this._n = true;
    this.a6(false);
};
_twaver.ext($A20, $A19, {
    a3: function (edge, node, flag) {
        if (!flag)
            this._n = false;
    },
    a1: function (node) {
        this._n = false;
    }
});
