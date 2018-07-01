var $A79 = function () {
    $A79.superClass.constructor.call(this);
    this.a(new $A10(), new $A09());
};
_twaver.ext($A79, $A78, {
    a: function (noderealizer, edgerealizer) {
        this._a3 = noderealizer;
        this._a4 = edgerealizer;
    },
    xo: function (node, node1) {
        return this.l2(node, node1, this._a4.a6());
    },
    l2: function (node, node1, edgerealizer) {
        return this.l1(node, null, node1, null, 0, 0, edgerealizer);
    },
    xn: function (node, edge, node1, edge1, i, j) {
        return this.l1(node, edge, node1, edge1, i, j, this._a4.a6());
    },
    l1: function (node, edge, node1, edge1, i, j, edgerealizer) {
        var result = new $A34(this, node, edge, node1, edge1, i, j);
        result._l = edgerealizer;
        return result;
    },
    xm: function () {
        var node = new $A41(this);
        node._r = this._a3.m3();
        return node;
    },
    g3: function () {
        var rectangle = { x: 0, y: 0, width: -1, height: -1 };
        for (var nodecursor = this.x9(); nodecursor.i1(); nodecursor.i2())
            nodecursor.i9()._r.m1(rectangle);
        return rectangle;
    },
    g1: function (node) {
        return node._r;
    },
    g2: function (edge) {
        return edge._l;
    },
    g5: function (node) {
        return node._r.m4();
    },
    g6: function (node) {
        return node._r.m5();
    },
    gi: function (node) {
        return node._r.i1();
    },
    gh: function (node) {
        return node._r.i2();
    },
    gj: function (node) {
        return node._r.i3();
    },
    g9: function (node) {
        return node._r.i4();
    },
    s2: function (node, d, d1) {
        node._r.m6(d, d1);
    },
    s7: function (node, d, d1) {
        node._r.i6(d, d1);
    },
    s3: function (node, d, d1) {
        node._r.i5(d, d1);
    }
});
