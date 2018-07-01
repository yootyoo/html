var $A34 = function (graph, node, edge, node1, edge1, l, i1) {
    this._g = 0;
    graph.xt(this, node, edge, node1, edge1, l, i1);
};
_twaver.ext($A34, $A33, {
    a5: function () {
        if (this._h._u)
            this._h.b1();
        return this._g;
    },
    a2: function () {
        return this._d;
    },
    a3: function () {
        return this._e;
    },
    a1: function (node) {
        return this._d !== node ? this._d : this._e;
    },
    a4: function () {
        for (var l = 0; l <= 1; l++) {
            this._k[l] = null;
            this._f[l] = null;
        }
    },
    a8: function () {
        return this._k[0];
    },
    a7: function () {
        return this._k[1];
    },
    a6: function (graph, node, node1, l) {
        this.a0(l);
        this._h = graph;
        this._k = $A53.d(2);
        this._f = $A53.d(2);
        this._d = node;
        this._e = node1;
    }
});
