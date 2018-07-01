var $A57 = function () {
    $A57.superClass.constructor.call(this);
    this._kl = 340;
    this._km = 360;
    this._kk = 40;
    this._ko = 0.5;
};
_twaver.ext($A57, $A67, {
    ic: function () {
        return this._km;
    },
    ia: function () {
        return this._kl;
    },
    i9: function () {
        return this._ko;
    },
    i3: function (layoutgraph) {
        if (!$A18.a1(layoutgraph))
            throw 'Error';
        this._a = layoutgraph;
        var node = this.i8();
        var edgelist = $A18.a4(layoutgraph, node);
        $A83.c(layoutgraph);
        this._kn = $A53.d(layoutgraph.x0());
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node1 = nodecursor.i9();
            if (node1 !== node)
                this.aa(node1, new $A55(this._kk + this.q(node1.aq().i9())));
            else
                this.aa(node1, new $A55(this._kk));
        }

        this.s(node);
        layoutgraph.s2(node, 0.0, 0.0);
        this.t(node);
        var edge;
        for (; !edgelist.ar(); layoutgraph.x3(edge))
            edge = edgelist.c3();
    },
    i4: function (layoutgraph) {
        return $A18.a1(layoutgraph);
    },
    i0: function (node) {
        return this._kn[node.al()];
    },
    i8: function () {
        return $A18.a2(this._a);
    },
    i7: function (node) {
        var d = this.ib(node);
        var d1;
        do {
            d1 = this.i6(node);
            if (d1 <= d)
                break;
            for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2()) {
                var node1 = nodecursor.i9();
                this.i0(node1)._g *= 1.0 + this._ko;
            }

        } while (true);
        var d2 = (d - d1) / (2 * node.ao());
        d1 = 0.0;
        for (var nodecursor1 = node.aw(); nodecursor1.i1(); nodecursor1.i2()) {
            var nodeinfo1 = this.i0(nodecursor1.i9());
            nodeinfo1._d += d2;
            nodeinfo1._e += d2;
            d1 += nodeinfo1._d + nodeinfo1._e;
        }

        this.id(node);
    },
    id: function (node) {
        var aedge = $A53.d(node.ao());
        var i = 0;
        for (var edgecursor = node.ap(); edgecursor.i1(); ) {
            aedge[i] = edgecursor.i8();
            edgecursor.i2();
            i++;
        }

        var self = this;
        aedge.sort(function (obj, obj1) {
            var node = obj.a3();
            var node1 = obj1.a3();
            var d = self.i0(node).a() - self.i0(node1).a();
            if (d > 0.0)
                return 1;
            return d >= 0.0 ? 0 : -1;
        });
        for (var j = 0; j < aedge.length; j++)
            this._a.h1(aedge[j]);

        for (var k = 0; k < aedge.length; k += 2)
            this._a.u1(aedge[k]);

        i = aedge.length - 1;
        if (i % 2 === 0)
            i--;
        for (; i > 0; i -= 2)
            this._a.u1(aedge[i]);
    },
    ib: function (node) {
        if (node.ak() === 0)
            return this._km;
        if (node.ao() === 2)
            return Math.min(180, this._kl);
        else
            return this._kl;
    },
    i6: function (node) {
        var d = 0.0;
        for (var edgecursor = node.ap(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var node1 = edge.a3();
            var nodeinfo = this.i0(node1);
            var d2 = -nodeinfo._g;
            var d3 = nodeinfo._b;
            var ylist = nodeinfo._c;
            var d4 = 0.0;
            var d5 = d4 + 1.0;
            var listcell = ylist._b;
            var ypoint = listcell.d();
            var ypoint1;
            for (; d5 > d4; d5 = (ypoint1.y - d3) / (ypoint1.x - d2)) {
                ypoint1 = ypoint;
                listcell = ylist.ai(listcell);
                ypoint = listcell.d();
                d4 = (ypoint.y - ypoint1.y) / (ypoint.x - ypoint1.x);
            }

            nodeinfo._d = -Math.atan(d5) * 180.0 / Math.PI;
            d4 = 0.0;
            d5 = d4 - 1.0;
            listcell = ylist._b;
            for (ypoint = listcell.d(); listcell.a().d().x === ypoint.x; ypoint = listcell.d())
                listcell = listcell.a();

            var ypoint2;
            for (; d5 < d4; d5 = (ypoint2.y - d3) / (ypoint2.x - d2)) {
                ypoint2 = ypoint;
                listcell = ylist.aj(listcell);
                ypoint = listcell.d();
                d4 = (ypoint.y - ypoint2.y) / (ypoint.x - ypoint2.x);
            }

            nodeinfo._e = Math.atan(d5) * 180.0 / Math.PI; ;
            d += nodeinfo._d + nodeinfo._e;
        }

        return d;
    },
    aa: function (node, nodeinfo) {
        this._kn[node.al()] = nodeinfo;
    },
    p: function (node) {
        var nodeinfo = this.i0(node);
        var ylist = new $A35();
        var d = 2 * this.q(node);
        ylist.aa(new $A00(0.0, 0.0));
        ylist.aa(new $A00(0.0, d));
        ylist.aa(new $A00(d, d));
        ylist.aa(new $A00(d, 0.0));
        nodeinfo._c = ylist;
        nodeinfo._a = d / 2;
        nodeinfo._b = d / 2;
    },
    r: function (node) {
        if (node.ao() === 0) {
            this.p(node);
        } else {
            var nodeinfo = this.i0(node);
            var d = this.q(node);
            var ylist = new $A35();
            ylist.aa(new $A00(-d, -d));
            ylist.aa(new $A00(-d, d));
            ylist.aa(new $A00(d, -d));
            ylist.aa(new $A00(d, d));
            for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2()) {
                var nodeinfo1 = this.i0(nodecursor.i9());
                ylist.az(nodeinfo1._c);
            }

            var ylist1 = $A72.h(ylist);
            var d1 = Number.MAX_VALUE;
            var d2 = Number.MAX_VALUE;
            var d3 = Number.MIN_VALUE;
            var d4 = Number.MIN_VALUE;
            for (var ycursor = ylist1.ah(); ycursor.i1(); ycursor.i2()) {
                var ypoint = ycursor.i6();
                if (ypoint.x < d1)
                    d1 = ypoint.x;
                if (ypoint.x > d3)
                    d3 = ypoint.x;
                if (ypoint.y < d2)
                    d2 = ypoint.y;
                if (ypoint.y > d4)
                    d4 = ypoint.y;
            }

            var ylist2 = new $A35();
            for (var ycursor1 = ylist1.ah(); ycursor1.i1(); ycursor1.i2()) {
                var ypoint1 = ycursor1.i6();
                ylist2.aa(new $A00(ypoint1.x - d1, ypoint1.y - d2));
            }

            nodeinfo._c = ylist2;
            nodeinfo._a = -d1;
            nodeinfo._b = -d2;
        }
    },
    s: function (node) {
        if (node.ao() === 0) {
            this.r(node);
        } else {
            for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2())
                this.s(nodecursor.i9());
            this.i7(node);
            var d = 0.0;
            for (var nodecursor1 = node.aw(); nodecursor1.i1(); nodecursor1.i2()) {
                var node1 = nodecursor1.i9();
                var nodeinfo = this.i0(node1);
                var d1 = 180 - (360 - this.ib(node)) / 2 - d - (nodeinfo._e + nodeinfo._f);
                d += nodeinfo.a();
                d1 = d1 / 180.0 * Math.PI;
                var d2 = Math.sin(d1);
                var d3 = Math.cos(d1);
                for (var listcell = nodeinfo._c._b; listcell != null; listcell = listcell.a()) {
                    var ypoint = listcell.d();
                    var d4 = ypoint.x + nodeinfo._g;
                    var d6 = ypoint.y - nodeinfo._b;
                    var ypoint1 = new $A00(d4 * d3 - d2 * d6, d4 * d2 + d3 * d6);
                    listcell.c(ypoint1);
                }

                var d5 = nodeinfo._a + nodeinfo._g;
                nodeinfo._a = d5 * d3;
                nodeinfo._b = d5 * d2;
            }
            this.r(node);
        }
    },
    t: function (node) {
        var ypoint = this._a.g4(node);
        var d = 0.0;
        if (node.ak() > 0) {
            var node1 = node.aq().i9();
            var ypoint1 = this._a.g4(node1);
            d = Math.PI + Math.atan2(ypoint1.y - ypoint.y, ypoint1.x - ypoint.x);
        }
        for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2()) {
            var node2 = nodecursor.i9();
            var nodeinfo = this.i0(node2);
            if (d !== 0.0) {
                var d1 = Math.cos(d);
                var d2 = Math.sin(d);
                var d3 = nodeinfo._a * d1 - d2 * nodeinfo._b;
                var d4 = nodeinfo._a * d2 + d1 * nodeinfo._b;
                nodeinfo._a = d3;
                nodeinfo._b = d4;
            }
            this._a.s2(node2, ypoint.x + nodeinfo._a, ypoint.y + nodeinfo._b);
            this.t(node2);
        }
    },
    q: function (node) {
        return 1.4099999999999999 * (Math.max(this._a.gj(node), this._a.g9(node)) / 2);
    }
});
