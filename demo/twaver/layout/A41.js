var $A41 = function (graph) {
    this._id = _twaver.id();
    this._p = 0;
    graph.xs(this);
};
_twaver.ext($A41, $A33, {
    ad: function () {
        return this._n[0] + this._n[1];
    },
    ak: function () {
        return this._n[1];
    },
    ao: function () {
        return this._n[0];
    },
    al: function () {
        if (this._g._y)
            this._g.c();
        return this._p;
    },
    ag: function () {
        return this._o[0];
    },
    ae: function () {
        return this._o[1];
    },
    af: function () {
        return new $A36(this);
    },
    am: function () {
        return new $A27(this, 1);
    },
    ap: function () {
        return new $A27(this, 0);
    },
    an: function () {
        return new $A43(this);
    },
    aq: function () {
        return new $A42(this, 1);
    },
    aw: function () {
        return new $A42(this, 0);
    },
    ah: function (node) {
        for (var edge = this._o[0]; edge != null; edge = edge._k[0])
            if (edge.a3() === node)
                return edge;

        return null;
    },
    ai: function (node) {
        for (var edge = this._o[1]; edge != null; edge = edge._k[1])
            if (edge.a2() === node)
                return edge;

        return null;
    },
    aj: function (node) {
        var edge = this.ah(node);
        if (edge == null)
            edge = this.ai(node);
        return edge;
    },
    au: function (comparator) {
        this.at(comparator, 1, $A53.d(this.ak()));
    },
    av: function (comparator) {
        this.at(comparator, 0, $A53.d(this.ao()));
    },
    as: function (graph, i) {
        this.a0(i);
        this._g = graph;
        this._o = $A53.d(2);
        this._q = $A53.d(2);
        this._n = $A53.a(2);
    },
    ab: function (edge, edge1, i, j, k) {
        if (edge1 == null) {
            this.aa(edge, i, j);
            return;
        }
        var l;
        if (edge1._d === edge1._e)
            l = j;
        else
            l = this !== edge1._d ? 1 : 0;
        if (k === 0) {
            var edge2 = edge1._k[l];
            edge._f[j] = edge1;
            edge._k[j] = edge2;
            edge1._k[l] = edge;
            if (edge2 == null)
                this._q[i] = edge;
            else if (edge2._d === edge2._e)
                edge2._f[j] = edge;
            else
                edge2._f[this !== edge2._d ? 1 : 0] = edge;
        } else {
            var edge3 = edge1._f[l];
            edge._k[j] = edge1;
            edge._f[j] = edge3;
            edge1._f[l] = edge;
            if (edge3 == null)
                this._o[i] = edge;
            else if (edge3._d === edge3._e)
                edge3._k[j] = edge;
            else
                edge3._k[this !== edge3._d ? 1 : 0] = edge;
        }
        this._n[i]++;
    },
    aa: function (edge, i, j) {
        var edge1 = this._q[i];
        edge._k[j] = null;
        if (edge1 == null) {
            this._o[i] = edge;
            edge._f[j] = null;
        } else {
            edge._f[j] = edge1;
            if (edge1._d === edge1._e) {
                edge1._k[j] = edge;
            } else {
                edge1._k[this !== edge1._d ? 1 : 0] = edge;
            }
        }
        this._q[i] = edge;
        this._n[i]++;
    },
    ar: function (edge, i, j) {
        var edge1;
        var edge2;
        edge1 = edge._k[j];
        edge2 = edge._f[j];

        if (edge1 == null) {
            this._q[i] = edge2;
        } else {
            edge1._f[!(edge1._d === this) ? 1 : 0] = edge2;
        }

        if (edge2 == null) {
            this._o[i] = edge1;
        } else {
            edge2._k[!(edge2._d === this) ? 1 : 0] = edge1;
        }

        this._n[i]--;
    },
    ac: function () {
        for (var i = 0; i <= 1; i++) {
            this._o[i] = null;
            this._q[i] = null;
            this._n[i] = 0;
        }
    },
    at: function (comparator, i, aedge) {
        if (this._n[i] < 2)
            return;
        var l = this._n[i];
        var j = 0;
        var edge;
        for (edge = this._o[i]; edge != null; edge = edge._k[i]) {
            aedge[j] = edge;
            j++;
        }

        $A53.s(aedge, l, comparator);
        var edge1 = this._o[i] = aedge[0];
        edge1._f[i] = null;
        for (var k = 1; k < l; ) {
            edge = aedge[k];
            edge._f[i] = edge1;
            edge1._k[i] = edge;
            k++;
            edge1 = edge;
        }

        this._q[i] = edge;
        edge._k[i] = null;
    }
});
