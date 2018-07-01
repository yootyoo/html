var $A65 = function () {
    this._a = new $A25();
    this._c = 10;
};
_twaver.ext($A65, $A62, {
    i2: function (layoutgraph) {
        this._b = layoutgraph.xl();
        this.w9(layoutgraph);
        this.w4(layoutgraph);
        this.c(layoutgraph);
        this.w8(layoutgraph, this._b);
        layoutgraph.xj(this._b);
    },
    i1: function (layoutgraph) {
        if (this.w2() == null) {
            return true;
        } else {
            this._b = layoutgraph.xl();
            this.w9(layoutgraph);
            var flag = this.w3(layoutgraph);
            this.c(layoutgraph);
            layoutgraph.xj(this._b);
            return flag;
        }
    },
    w8: function (layoutgraph, edgemap) {
        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            if (edgemap.i1(edge) != null) {
                var edgelist = edgemap.i1(edge);
                $A83.g(layoutgraph, edge, edgelist, this._c);
            }
        }
    },
    w9: function (graph) {
        var nodemap = graph.xk();
        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            for (var edgecursor = node.af(); edgecursor.i1(); edgecursor.i2()) {
                var edge = edgecursor.i8();
                var node1 = edge.a1(node);
                var edge2 = nodemap.i1(node1);
                if (edge2 !== edge)
                    if (edge2 == null) {
                        nodemap.z1(node1, edge);
                    } else {
                        if (this._b.i1(edge2) == null)
                            this._b.i8(edge2, new $A25());
                        var edgelist = this._b.i1(edge2);
                        edgelist.aa(edge);
                        this._a.ac(edge);
                        graph.h1(edge);
                    }
            }

            for (var edgecursor1 = node.af(); edgecursor1.i1(); edgecursor1.i2()) {
                var edge1 = edgecursor1.i8();
                var node2 = edge1.a1(node);
                nodemap.z1(node2, null);
            }
        }
        graph.xi(nodemap);
    },
    c: function (graph) {
        for (; !this._a.ar(); graph.u1(this._a.c3()))
            ;
    }
});
