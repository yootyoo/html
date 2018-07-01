var $A62 = function () {

};
_twaver.ext($A62, Object, {
    w1: function (layouter) {
        this._bb = layouter;
    },
    w2: function () {
        return this._bb;
    },
    w4: function (layoutgraph) {
        if (this._bb != null)
            this._bb.i2(layoutgraph);
    },
    w3: function (layoutgraph) {
        if (this._bb != null)
            return this._bb.i1(layoutgraph);
        else
            return true;
    }
});
