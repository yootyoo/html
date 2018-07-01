var $A54 = function (layoutgraph) {
    this._b = layoutgraph;
    this.a();
};
_twaver.ext($A54, Object, {
    c1: function () {
        if (this._a == null)
            this.a();
        return this._a;
    },
    b: function () {
        if (this._a == null)
            return -1;
        else
            return this.d(this._a);
    },
    d: function (node) {
        var i = 0;
        for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2())
            i = Math.max(i, this.d(nodecursor.i9()));
        return i + 1;
    },
    c2: function (node) {
        return node.ao() === 0;
    },
    a: function () {
        for (var nodecursor = this._b.x9(); nodecursor.i1(); nodecursor.i2())
            if (nodecursor.i9().ak() === 0) {
                this._a = nodecursor.i9();
                return;
            }
    }
});
