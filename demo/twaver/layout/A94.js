var $A94 = function (anodelist, dataprovider) {
    $A94.superClass.constructor.call(this);
};
_twaver.ext($A94, $A93, {
    t2: function (anodelist, dataprovider) {
        var layoutgraph = this._m6;
        this._a = layoutgraph.xc("D");
        this._h = layoutgraph.xc("C");
        this.a1(layoutgraph, anodelist);
        this.tg(layoutgraph, anodelist);
        this.tf(anodelist, $A49.a5(this._e), this._m5, this._l);
        this.tb(layoutgraph, this._f[0]);
        this.ta(anodelist);
        this.th(layoutgraph, this._f[0], anodelist);
        this.b(anodelist);
        this.tb(layoutgraph, this._f[1]);
        this.ta(anodelist);
        this.th(layoutgraph, this._f[1], anodelist);
        this.b(anodelist);
        this.a11(this._f[1]);
        this.a12(anodelist);
        this.tb(layoutgraph, this._f[2]);
        this.ta(anodelist);
        this.th(layoutgraph, this._f[2], anodelist);
        this.b(anodelist);
        this.tb(layoutgraph, this._f[3]);
        this.ta(anodelist);
        this.th(layoutgraph, this._f[3], anodelist);
        this.b(anodelist);
        this.a11(this._f[3]);
        this.a12(anodelist);
        this.tc(layoutgraph);
        this.tj();
    },
    a11: function (ad) {
        for (var i1 = 0; i1 < ad.length; i1++)
            ad[i1] = -ad[i1];

    },
    b: function (anodelist) {
        for (var i1 = 0; i1 < anodelist.length; i1++) {
            var nodelist = anodelist[i1];
            nodelist.ax();
        }

        for (var j1 = 0; j1 < anodelist.length; j1++) {
            var k1 = 0;
            var node = null;
            for (var nodecursor = anodelist[j1].x1(); nodecursor.i1(); nodecursor.i2()) {
                var node1 = nodecursor.i9();
                var l1 = node1.al();
                this._l[l1] = k1++;
                this._b[l1] = node;
                this._k[l1] = null;
                if (node != null)
                    this._k[node.al()] = node1;
                node = node1;
            }
        }

        var dataprovider = this._a;
        this._a = this._h;
        this._h = dataprovider;
        for (var edgecursor = this._m6.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var ypoint = this._m6.gn(edge);
            this._m6.gt(edge, new $A00(-ypoint.x, ypoint.y));
            var ypoint1 = this._m6.gk(edge);
            this._m6.gz(edge, new $A00(-ypoint1.x, ypoint1.y));
        }

        var l = this._l;
        var _la = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a2().al()] - l[obj1.a2().al()];
        };
        var _la1 = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a3().al()] -l[obj1.a3().al()];
        };
        this._m6.x2(_la, _la1);
    },
    a12: function (anodelist) {
        for (var edgecursor = this._m6.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            this._m6.x3(edge);
            var ypoint = this._m6.gn(edge);
            var ypoint1 = this._m6.gk(edge);
            this._m6.gz(edge, ypoint);
            this._m6.gt(edge, ypoint1);
        }

        var ylist = new $A35();
        for (var i = 0; i < anodelist.length; i++)
            ylist.ae(anodelist[i]);
        for (var i1 = 0; i1 < anodelist.length; i1++)
            anodelist[i1] = ylist.au();

        var l = this._l;
        var _la = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a2().al()] - l[obj1.a2().al()];
        };
        var _la1 = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a3().al()] -l[obj1.a3().al()];
        };
        this._m6.x2(_la, _la1);
    },
    tg: function (graph, anodelist) {
        var i1 = graph.x0();
        var j1 = graph.xg();
        this._l = $A53.a(i1);
        this._b = $A53.d(i1);
        this._k = $A53.d(i1);
        this._m = $A53.d(i1);
        this._i = $A53.d(i1);
        this._o = $A53.d(i1);
        this._f = $A53.e(4, i1);
        this._c = $A53.a(i1);
        this._g = $A53.a(i1);
        this._j = $A53.a(i1);
        this._d = $A53.b(i1);
        this._e = $A53.b(j1);
        for (var k1 = 0; k1 < anodelist.length; k1++) {
            var l1 = 0;
            var node = null;
            for (var nodecursor = anodelist[k1].x1(); nodecursor.i1(); nodecursor.i2()) {
                var node1 = nodecursor.i9();
                var i2 = node1.al();
                this._l[i2] = l1++;
                this._b[i2] = node;
                this._k[i2] = null;
                if (node != null)
                    this._k[node.al()] = node1;
                node = node1;
            }
        }
        var l = this._l;
        var _la = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a2().al()] - l[obj1.a2().al()];
        };
        var _la1 = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            return l[obj.a3().al()] -l[obj1.a3().al()];
        };
        graph.x2(_la, _la1);
    },
    tb: function (graph, ad) {
        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var i1 = node.al();
            this._m[i1] = node;
            this._i[i1] = node;
            ad[i1] = Number.MAX_VALUE;
            this._o[i1] = node;
            this._c[i1] = Number.MAX_VALUE;
            this._d[i1] = false;
            this._j[i1] = this._g[i1] = 0.0;
        }
    },
    ta: function (anodelist) {
        for (var i1 = 1; i1 < anodelist.length; i1++) {
            var j1 = -1;
            for (var listcell = anodelist[i1]._b; listcell != null; listcell = listcell.a()) {
                var node = listcell.d();
                var k1 = node.al();
                var l1 = node.ak();
                if (l1 !== 0) {
                    var i2 = Math.floor((l1 + 1.0) / 2);
                    var j2 = Math.ceil((l1 + 1.0) / 2);
                    var k2 = 1;
                    var edge;
                    for (edge = node.ae(); k2 < i2; edge = edge.a7())
                        k2++;

                    for (var flag = false; k2 <= j2 && !flag; k2++) {
                        var edgelayout = this._m6.g2(edge);
                        var node1 = edge.a2();
                        var l2 = node1.al();
                        if (this._i[k1] === node && !this._e[edge.a5()] && j1 < this._l[l2]) {
                            j1 = this._l[l2];
                            this._i[l2] = node;
                            this._m[k1] = this._m[l2];
                            this._i[k1] = this._m[k1];
                            flag = true;
                            this._j[l2] = edgelayout.i6().x;
                            this._g[k1] = edgelayout.i7().x;
                        }
                        edge = edge.a7();
                    }
                }
            }
        }
    },
    th: function (layoutgraph, ad, anodelist) {
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var j1 = node.al();
            if (this._m[j1] === node)
                this.td(layoutgraph, node, ad);
        }

        for (var i1 = 0; i1 < anodelist.length; i1++) {
            var nodecursor1 = anodelist[i1].x1();
            if (nodecursor1.i1()) {
                var node1 = anodelist[i1].x1().i9();
                var k1 = node1.al();
                if (this._o[this._m[k1].al()] === node1)
                    this.tk(layoutgraph, node1, ad);
            }
        }

        for (var nodecursor2 = layoutgraph.x9(); nodecursor2.i1(); nodecursor2.i2()) {
            var node2 = nodecursor2.i9();
            var l1 = node2.al();
            var d1 = this._c[this._o[this._m[l1].al()].al()];
            if (d1 < Number.MAX_VALUE)
                ad[l1] += d1;
        }
    },
    td: function (layoutgraph, node, ad) {
        var i1 = node.al();
        if (ad[i1] === Number.MAX_VALUE) {
            ad[i1] = 0.0;
            var node1 = node;
            var d1 = 0.0;
            do {
                var j1 = node1.al();
                if (j1 !== i1)
                    d1 -= this._g[j1];
                if (this._l[j1] > 0) {
                    var node2 = this._b[j1];
                    var node3 = this._m[this._b[j1].al()];
                    var l1 = node3.al();
                    this.td(layoutgraph, node3, ad);
                    if (this._o[i1] === node)
                        this._o[i1] = this._o[l1];
                    if (this._o[i1] === this._o[l1])
                        ad[i1] = Math.max(ad[i1], (ad[node2.al()] + this.ti(layoutgraph, node2, node1)) - d1);
                }
                d1 += this._j[j1];
                node1 = this._i[j1];
            } while (node1 !== node);
            d1 = 0.0;
            node1 = node;
            do {
                var k1 = node1.al();
                if (k1 !== i1)
                    d1 -= this._g[k1];
                ad[k1] = ad[i1] + d1;
                d1 += this._j[k1];
                node1 = this._i[k1];
            } while (node1 !== node);
        }
    },
    tk: function (layoutgraph, node, ad) {
        var i1 = node.al();
        if (this._d[i1])
            return;
        this._d[i1] = true;
        var node1 = node;
        do {
            var j1 = node1.al();
            var node2 = this._k[j1];
            if (node2 != null) {
                var k1 = node2.al();
                var node3 = this._o[this._m[k1].al()];
                if (node3 !== this._o[i1]) {
                    var d1 = ad[k1] - ad[i1] - this.ti(layoutgraph, node1, node2);
                    if (this._c[node3.al()] !== Number.MAX_VALUE)
                        d1 += this._c[node3.al()];
                    this._c[this._o[i1].al()] = Math.min(this._c[this._o[i1].al()], d1);
                } else {
                    this.tk(layoutgraph, this._m[k1], ad);
                }
            }
            node1 = this._i[j1];
        } while (node1 !== node);
    },
    tc: function (layoutgraph) {
        var ad = $A53.a(4);
        var ad1 = $A53.a(4);
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var i1 = node.al();
            ad1[0] += this._f[0][i1];
            ad1[1] += this._f[1][i1];
            ad1[2] += this._f[2][i1];
            ad1[3] += this._f[3][i1];
        }

        ad1[0] /= layoutgraph.xa();
        ad1[1] /= layoutgraph.xa();
        ad1[2] /= layoutgraph.xa();
        ad1[3] /= layoutgraph.xa();
        for (var nodecursor1 = layoutgraph.x9(); nodecursor1.i1(); nodecursor1.i2()) {
            var node1 = nodecursor1.i9();
            var j1 = node1.al();
            var ypoint = layoutgraph.g4(node1);
            ad[0] = this._f[0][j1] - ad1[0];
            ad[1] = this._f[1][j1] - ad1[1];
            ad[2] = this._f[2][j1] - ad1[2];
            ad[3] = this._f[3][j1] - ad1[3];
            ad.sort($A53.n);
            var d1 = (ad[1] + ad[2]) / 2;
            layoutgraph.s1(node1, new $A00(d1, ypoint.y));
        }
    },
    ti: function (layoutgraph, node, node1) {
        var d2 = layoutgraph.gj(node);
        var d3 = layoutgraph.gj(node1);
        var d1;
        if (d2 > 1.0 && d3 > 1.0)
            d1 = this._m1 + (d2 + d3) / 2;
        else
            d1 = this._m3 + (d2 + d3) / 2;
        if (this._l[node.al()] < this._l[node1.al()]) {
            if (this._a != null)
                d1 += this._a.i3(node1);
            if (this._h != null)
                d1 += this._h.i3(node);
        } else {
            if (this._a != null)
                d1 += this._a.i3(node);
            if (this._h != null)
                d1 += this._h.i3(node1);
        }
        return d1;
    },
    tj: function () {
        this._l = null;
        this._b = null;
        this._k = null;
        this._e = null;
        this._m = null;
        this._i = null;
        this._f = null;
        this._c = null;
        this._o = null;
        this._d = null;
        this._j = null;
        this._g = null;
    },
    tf: function (anodelist, edgemap, nodemap, ai) {
        var i1 = anodelist.length;
        for (var j1 = 2; j1 < i1 - 1; j1++) {
            var k1 = -1;
            var l1 = 0;
            var i2 = 0;
            var nodecursor = anodelist[j1].x1();
            for (var nodecursor1 = anodelist[j1].x1(); nodecursor1.i1(); nodecursor1.i2()) {
                var node = nodecursor1.i9();
                var node1 = null;
                var flag = false;
                if (node.ak() === 1) {
                    node1 = node.ae().a2();
                    if (nodemap.i1(node1) != null && nodemap.i1(node) != null)
                        flag = true;
                }
                if (i2 === anodelist[j1].ay() - 1 || flag) {
                    var j2 = flag ? ai[node1.al()] : anodelist[j1 - 1].ay();
                    for (; l1 <= i2; l1++) {
                        var node2 = nodecursor.i9();
                        for (var edgecursor = node2.am(); edgecursor.i1(); edgecursor.i2()) {
                            var edge = edgecursor.i8();
                            var k2 = ai[edge.a2().al()];
                            if (k2 < k1 || k2 > j2)
                                edgemap.i7(edgecursor.i8(), true);
                        }
                        nodecursor.i2();
                    }
                    k1 = j2;
                }
                i2++;
            }
        }
    }
});
