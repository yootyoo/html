var $A47 = function (graph) {
    this._a = graph;
    this._b = new $A25();
    this._c = new $A46();
};
_twaver.ext($A47, Object, {
    a: function () {
        for (var nodecursor = this._a.x9(); nodecursor.i1(); nodecursor.i2())
            this.e(nodecursor.i9());
    },
    b: function () {
        this.c();
        this.d();
    },
    c: function () {
        while (!this._c.ar()) {
            var node = this._c.x4();
            if (!this._a.xq(node))
                this.g(node);
        }
    },
    d: function () {
        while (!this._b.ar()) {
            var edge = this._b.c3();
            if (!this._a.xp(edge))
                this.f(edge);
        }
    },
    e: function (node) {
        for (var edgecursor = node.af(); edgecursor.i1(); edgecursor.i2()) {
            this._b.ac(edgecursor.i8());
            this._a.h1(edgecursor.i8());
        }

        this._c.ac(node);
        this._a.h2(node);
    },
    f: function (edge) {
        this._a.u1(edge);
    },
    g: function (node) {
        this._a.h3(node);
    }
});
$A47.h = function (graph, edgecursor) {
    edgecursor.i4();
    for (; edgecursor.i1(); edgecursor.i2()) {
        var edge = edgecursor.i8();
        if (!graph.xq(edge.a2()))
            graph.h3(edge.a2());
        if (!graph.xq(edge.a3()))
            graph.h3(edge.a3());
        if (!graph.xp(edge))
            graph.u1(edge);
    }
};
$A47.i = function (graph, edgecursor) {
    edgecursor.i4();
    for (; edgecursor.i1(); edgecursor.i2()) {
        var edge = edgecursor.i8();
        if (graph.xp(edge))
            graph.h1(edge);
        if (edge.a2().ad() === 0)
            graph.h2(edge.a2());
        if (edge.a3().ad() === 0)
            graph.h2(edge.a3());
    }
};
