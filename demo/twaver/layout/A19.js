var $A19 = function () {
    this._c = 0;
    this._d = 0;
    this._e = 0;
    this._b = true;
    this._f = false;
};
_twaver.ext($A19, Object, {
    a6: function (flag) {
        this._f = flag;
    },
    a7: function (flag) {
        this._b = flag;
    },
    a8: function (graph) {
        if (graph.x0() !== 0) {
            this.a9(graph, graph.x9().i9());
        }
    },
    a9: function (graph, node) {
        this._xx = graph.xk();
        this._c = graph.xl();
        this._d = 0;
        this._e = 0;
        this.a0(node);
        if (this._b) {
            for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
                var node1 = nodecursor.i9();
                if (this._xx.i1(node1) == null) {
                    this.a1(node1);
                    this.a0(node1);
                }
            }

        }
        graph.xi(this._xx);
        graph.xj(this._c);
    },
    a0: function (node) {
        var i = ++this._d;
        this._xx.z1(node, $A19._B);
        this.a5(node, i);
        for (var edgecursor = this._f ? node.ap() : node.af(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            if (!this._c.i4(edge)) {
                this._c.i7(edge, true);
                var node1 = edge.a1(node);
                if (this._xx.i1(node1) == null) {
                    this.a3(edge, node1, true);
                    this.a0(node1);
                    this.a2(edge, node1);
                } else {
                    this.a3(edge, node1, false);
                }
            }
        }

        this.a4(node, i, ++this._e);
        this._xx.z1(node, $A19._C);
    },
    a5: function (node, i) {
    },
    a4: function (node, i, j) {
    },
    a3: function (edge, node, flag) {
    },
    a2: function (edge, node) {
    },
    a1: function (node) {
    }
});
$A19._B = {};
$A19._C = {};
