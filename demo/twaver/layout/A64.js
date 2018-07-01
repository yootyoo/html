var $A64 = function () {

};
_twaver.ext($A64, $A62, {
    i1: function (layoutgraph) {
        return this.w3(layoutgraph);
    },
    i2: function (layoutgraph) {
        this.w7(layoutgraph);
        if (this.w2() != null)
            this.w4(layoutgraph);
        this.w6(layoutgraph);
    },
    w7: function (layoutgraph) {
        this.e(layoutgraph);
        this.k(layoutgraph);
        this.i(layoutgraph);
    },
    e: function (layoutgraph) {
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var ypoint = layoutgraph.g4(nodecursor.i9());
            layoutgraph.s1(nodecursor.i9(), ypoint);
        }
    },
    w6: function (layoutgraph) {
        this.l(layoutgraph);
        this.j(layoutgraph);
        this.f(layoutgraph);
    },
    l: function (layoutgraph) {
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var ypoint = layoutgraph.g4(nodecursor.i9());
            layoutgraph.s1(nodecursor.i9(), ypoint);
        }
    },
    j: function (layoutgraph) {
        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edgelayout = layoutgraph.g7(edgecursor.i8());
            var ypoint = edgelayout.i6();
            edgelayout.i8(ypoint);
            ypoint = edgelayout.i7();
            edgelayout.i9(ypoint);
            for (var i1 = 0; i1 < edgelayout.i1(); i1++) {
                var ypoint1 = edgelayout.i2(i1);
                edgelayout.i3(i1, ypoint1.x, ypoint1.y);
            }
        }
    },
    k: function (layoutgraph) {
        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edgelayout = layoutgraph.g7(edgecursor.i8());
            var ypoint = edgelayout.i6();
            edgelayout.i8(ypoint);
            ypoint = edgelayout.i7();
            edgelayout.i9(ypoint);
            for (var i1 = 0; i1 < edgelayout.i1(); i1++) {
                var ypoint1 = edgelayout.i2(i1);
                edgelayout.i3(i1, ypoint1.x, ypoint1.y);
            }
        }
    },
    f: function (layoutgraph) {
        if (this._ca != null) {
            layoutgraph.x1("A", this._ca);
            this._ca = null;
            this._b6 = null;
        }
        if (this._b8 != null) {
            layoutgraph.x1("B", this._b8);
            this._b8 = null;
            this._b9 = null;
        }
    },
    i: function (layoutgraph) {
        this._ca = layoutgraph.xc("A");
        if (this._ca != null) {
            this._b6 = new $A61(this._ca);
            layoutgraph.x1("A", this._b6);
        }
        this._b8 = layoutgraph.xc("B");
        if (this._b8 != null) {
            this._b9 = new $A61(this._b8);
            layoutgraph.x1("B", this._b9);
        }
    }
});
