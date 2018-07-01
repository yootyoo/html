var $A77 = function () {
    this._v = new $A26();
    this._x = new $A26();
    this._z = new $A40(3, 5);
    this._w = new $A40(3, 5);
    this._y = false;
    this._u = false;
    this._t = {};
};
_twaver.ext($A77, Object, {
    xm: function () {
        var node = new $A41(this);
        return node;
    },
    xo: function (node, node1) {
        return this.xn(node, null, node1, null, 0, 0);
    },
    xn: function (node, edge, node1, edge1, i, j) {
        return new $A34(this, node, edge, node1, edge1, i, j);
    },
    x4: function (node) {
        this.b3(node);
    },
    b3: function (node) {
        var edge;
        while ((edge = node._o[0]) != null)
            this.x5(edge);
        while ((edge = node._o[1]) != null)
            this.x5(edge);
        this._v.c(node);
        node._g = null;
        this._y = true;
    },
    x5: function (edge) {
        this.a11(edge);
    },
    a11: function (edge) {
        if (edge._h !== this)
            throw 'Error';
        var node = edge.a2();
        var node1 = edge.a3();
        this.a12(edge, node, node1);
        this._x.c(edge);
        edge._h = null;
        this._u = true;
    },
    x7: function (node) {
        node._p = this._v._c;
        node._g = this;
        node.ac();
        if (node._c.length < this._z._b)
            this._z.a3(node, node._c.length, this._z._b);
        this._v.a(node);
        this._y = true;
    },
    x8: function (edge) {
        if (edge._h != null)
            throw 'Error';
        if (edge._c.length < this._w._b)
            this._w.a3(edge, edge._c.length, this._w._b);
        if (edge._a == null || edge._a._h !== this)
            this._x.a(edge);
        else
            this._x.b(edge, edge._a);
        edge._h = this;
        edge.a4();
        this.b2(edge, edge.a2(), null, edge.a3(), null, 0, 0);
        this._u = true;
    },
    xr: function (edge, node, node1) {
        var node2 = edge.a2();
        var node3 = edge.a3();
        if (edge._h == null) {
            edge._d = node;
            edge._e = node1;
        } else {
            if (node2 !== node) {
                node2.ar(edge, 0, 0);
                edge._d = node;
                node.ab(edge, null, 0, 0, 0);
            }
            if (node3 !== node1) {
                node3.ar(edge, 1, 1);
                edge._e = node1;
                node1.ab(edge, null, 1, 1, 0);
            }
        }
    },
    x3: function (edge) {
        this.xr(edge, edge.a3(), edge.a2());
    },
    h1: function (edge) {
        this.a11(edge);
    },
    u1: function (edge) {
        this.x8(edge);
    },
    h2: function (node) {
        this.x4(node);
    },
    h3: function (node) {
        this.x7(node);
    },
    xa: function () {
        return this._v._c;
    },
    x0: function () {
        return this._v._c;
    },
    xh: function () {
        return this._x._c;
    },
    xg: function () {
        return this._x._c;
    },
    xb: function () {
        return this._v._c === 0;
    },
    xq: function (node) {
        return node._g === this;
    },
    xp: function (edge) {
        return edge._h === this;
    },
    xd: function () {
        return this._v._a;
    },
    x9: function () {
        return new $A45(this._v);
    },
    xf: function () {
        return new $A45(this._x);
    },
    x2: function (comparator, comparator1) {
        var aedge = $A53.d(this.xh());
        if (comparator != null && comparator1 != null) {
            for (var nodecursor = this.x9(); nodecursor.i1(); nodecursor.i2()) {
                nodecursor.i9().at(comparator, 1, aedge);
                nodecursor.i9().at(comparator1, 0, aedge);
            }

        } else if (comparator1 == null && comparator != null) {
            for (var nodecursor1 = this.x9(); nodecursor1.i1(); nodecursor1.i2())
                nodecursor1.i9().at(comparator, 1, aedge);

        } else if (comparator1 != null && comparator == null) {
            for (var nodecursor2 = this.x9(); nodecursor2.i1(); nodecursor2.i2())
                nodecursor2.i9().at(comparator1, 0, aedge);
        }
    },
    xk: function () {
        return this._z.b(this._v);
    },
    xl: function () {
        return this._w.c(this._x);
    },
    xi: function (nodemap) {
        this._z.a5(nodemap, this._v);
    },
    xj: function (edgemap) {
        this._w.a6(edgemap, this._x);
    },
    xc: function (obj) {
        return this._t[obj];
    },
    x1: function (obj, dataprovider) {
        this._t[obj] = dataprovider;
    },
    x6: function (obj) {
        delete this._t[obj];
    },
    b2: function (edge, node, edge1, node1, edge2, i, j) {
        node.ab(edge, edge1, 0, 0, i);
        node1.ab(edge, edge2, 1, 1, j);
    },
    a12: function (edge, node, node1) {
        node.ar(edge, 0, 0);
        node1.ar(edge, 1, 1);
    },
    c: function () {
        var i = 0;
        for (var nodecursor = this.x9(); nodecursor.i1(); nodecursor.i2())
            nodecursor.i9()._p = i++;
        this._y = false;
    },
    b1: function () {
        var i = 0;
        for (var edgecursor = this.xf(); edgecursor.i1(); edgecursor.i2())
            edgecursor.i8()._g = i++;
        this._u = false;
    },
    xs: function (node) {
        node.as(this, this._z._b);
        node._p = this._v._c;
        this._v.a(node);
    },
    xt: function (edge, node, edge1, node1, edge2, i, j) {
        edge.a6(this, node, node1, this._w._b);
        edge._g = this._x._c;
        this._x.a(edge);
        this.b2(edge, edge.a2(), edge1, edge.a3(), edge2, i, j);
    }
});
