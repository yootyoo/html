var $A96 = function (layoutgraph, nodemap, nodemap1, edgemap) {
    this._k = 20;
    this._r = 0.5;
    this._d = layoutgraph;
    this._c = nodemap;
    this._j = nodemap1;
    this._m = edgemap;
    this._i = layoutgraph.xc("A") != null || layoutgraph.xc("B") != null;
    this._t = new $A75(layoutgraph, nodemap, nodemap1, edgemap);
    this._b = new $A95(layoutgraph, this);
};
_twaver.ext($A96, Object, {
    a6: function (d1) {
        this._k = d1;
        this._t.a1(d1);
        this._b.a3(d1);
    },
    g1: function () {
        return this._k;
    },
    a9: function (i1) {
        this.c1();
        return i1;
    },
    a5: function (anodelist) {
        this.a1();
        return anodelist;
    },
    b3: function (anodelist) {
        this.c1();
        anodelist = this.c4(anodelist);
        this._b.c();
        return anodelist;
    },
    g2: function (anodelist) {
        this._b.g();
        return anodelist;
    },
    e2: function (anodelist) {
        anodelist = this.f(anodelist);
        this._b.f();
    },
    e1: function () {
        this._t.d();
        if (this._n != null)
            this._d.xi(this._n);
        this.a1();
        this._d = null;
    },
    a1: function () {
        if (!this._i)
            return;
        if (this._q != null) {
            this._d.x1("A", this._q);
            this._q = null;
        }
        if (this._p != null) {
            this._d.x1("B", this._p);
            this._p = null;
        }
        if (this._h != null) {
            this._d.xj(this._h);
            this._h = null;
        }
        if (this._l != null) {
            this._d.xj(this._l);
            this._l = null;
        }
    },
    c1: function () {
        if (!this._i)
            return;
        if (this._h == null)
            this._h = this._d.xl();
        if (this._l == null)
            this._l = this._d.xl();
        for (var edgecursor = this._d.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var flag = this._j.i1(edge.a2()) != null;
            var flag1 = this._j.i1(edge.a3()) != null;
            if (flag && !flag1) {
                var edge1 = this._j.i1(edge.a2());
                if (this._m.i4(edge1))
                    this._l.i8(edge, $A84.h(this._d, edge1));
                else
                    this._l.i8(edge, $A84.i(this._d, edge1));
            } else if (!flag && flag1) {
                var edge2 = this._j.i1(edge.a3());
                if (this._m.i4(edge2))
                    this._h.i8(edge, $A84.i(this._d, edge2));
                else
                    this._h.i8(edge, $A84.h(this._d, edge2));
            } else if (!flag && !flag1)
                if (this._m.i4(edge)) {
                    this._h.i8(edge, $A84.i(this._d, edge));
                    this._l.i8(edge, $A84.h(this._d, edge));
                } else {
                    this._h.i8(edge, $A84.h(this._d, edge));
                    this._l.i8(edge, $A84.i(this._d, edge));
                }
        }
        this._q = this._d.xc("A");
        this._p = this._d.xc("B");
        this._d.x1("A", this._h);
        this._d.x1("B", this._l);
    },
    c4: function (anodelist) {
        this._n = this._d.xk();
        this._a = this._d.xl();
        this._g = this._d.xl();
        var edgelist = new $A25();
        var edgelist1 = new $A25();
        var edgelist2 = new $A25();
        var edgelist3 = new $A25();
        var edgelist4 = new $A25();
        var edgelist5 = new $A25();
        var edgelist6 = new $A25();
        var edgelist7 = new $A25();
        var edgelist8 = new $A25();
        var nodemap = this._d.xk();
        for (var i1 = 0; i1 < anodelist.length; i1++) {
            var d1 = 0.0;
            for (var nodecursor = anodelist[i1].x1(); nodecursor.i1(); ) {
                nodemap.i6(nodecursor.i9(), d1);
                nodecursor.i2();
                d1++;
            }

        }

        var comparator = function (obj, obj1) {
            var d = nodemap.i3(obj.a3()) - nodemap.i3(obj1.a3());
            return d <= 0.0 ? d >= 0.0 ? 0 : -1 : 1;
        };
        var comparator1 = function (obj, obj1) {
            var d = nodemap.i3(obj.a2()) - nodemap.i3(obj1.a2());
            return d <= 0.0 ? d >= 0.0 ? 0 : -1 : 1;
        };
        for (var j1 = 0; j1 < anodelist.length; j1++) {
            var nodelist = anodelist[j1];
            for (var listcell = nodelist._b; listcell != null; listcell = listcell.a()) {
                var node = listcell.d();
                node.av(comparator);
                node.au(comparator1);
                var k1 = 0;
                edgelist.af();
                edgelist1.af();
                edgelist2.af();
                edgelist3.af();
                edgelist4.af();
                edgelist5.af();
                edgelist6.af();
                edgelist7.af();
                edgelist8.af();
                for (var edgecursor = node.ap(); edgecursor.i1(); ) {
                    var edge = edgecursor.i8();
                    var portconstraint = this.b1(edge);
                    if (portconstraint == null || portconstraint.d() || portconstraint.g())
                        edgelist2.aa(edge);
                    else if (portconstraint.e())
                        edgelist.aa(edge);
                    else if (portconstraint.f()) {
                        edgelist1.aa(edge);
                        edgelist8.aa(edge);
                    } else if (portconstraint.c()) {
                        edgelist7.aa(edge);
                        edgelist8.aa(edge);
                    }
                    edgecursor.i2();
                    k1++;
                }

                k1 = 0;
                for (var edgecursor1 = node.am(); edgecursor1.i1(); ) {
                    var edge1 = edgecursor1.i8();
                    var portconstraint1 = this.a2(edge1);
                    if (portconstraint1 == null || portconstraint1.c() || portconstraint1.g())
                        edgelist3.aa(edge1);
                    else if (portconstraint1.e())
                        edgelist.aa(edge1);
                    else if (portconstraint1.f()) {
                        edgelist1.aa(edge1);
                        edgelist8.aa(edge1);
                    } else if (portconstraint1.d()) {
                        edgelist5.aa(edge1);
                        edgelist8.aa(edge1);
                    }
                    edgecursor1.i2();
                    k1++;
                }

                var d2 = nodemap.i3(node);
                if (!edgelist8.ar()) {
                    var d5 = 0.10000000000000001 / edgelist8.ay();
                    for (var d8 = d2 - 0.40000000000000002; !edgelist8.ar(); d8 += d5) {
                        var edge2 = edgelist8.c3();
                        if (edge2.a2() === node) {
                            var node1 = this._d.xm();
                            this._n.z1(node1, edge2.a2());
                            this._d.s7(node1, 1.0, 1.0);
                            this._c.z1(node1, this._c.i1(node));
                            nodemap.i6(node1, d8);
                            this._a.i8(edge2, this._d.gn(edge2));
                            this._d.gt(edge2, $A72._A);
                            this._d.xr(edge2, node1, edge2.a3());
                            nodelist.ao(node1, listcell);
                        } else {
                            var node2 = this._d.xm();
                            this._n.z1(node2, edge2.a3());
                            this._d.s7(node2, 1.0, 1.0);
                            this._c.z1(node2, this._c.i1(node));
                            nodemap.i6(node2, d8);
                            this._g.i8(edge2, this._d.gk(edge2));
                            this._d.gz(edge2, $A72._A);
                            this._d.xr(edge2, edge2.a2(), node2);
                            nodelist.ao(node2, listcell);
                        }
                    }

                }
                if (!edgelist.ar()) {
                    var d6 = 0.10000000000000001 / edgelist.ay();
                    for (var d9 = d2 + 0.10000000000000001; !edgelist.ar(); d9 += d6) {
                        var edge3 = edgelist.c3();
                        if (edge3.a2() === node) {
                            var node3 = this._d.xm();
                            this._n.z1(node3, edge3.a2());
                            this._d.s7(node3, 1.0, 1.0);
                            this._c.z1(node3, this._c.i1(node));
                            nodemap.i6(node3, d9);
                            this._a.i8(edge3, this._d.gn(edge3));
                            this._d.gt(edge3, $A72._A);
                            this._d.xr(edge3, node3, edge3.a3());
                            listcell = nodelist.an(node3, listcell);
                        } else {
                            var node4 = this._d.xm();
                            this._n.z1(node4, edge3.a3());
                            this._d.s7(node4, 1.0, 1.0);
                            this._c.z1(node4, this._c.i1(node));
                            nodemap.i6(node4, d9);
                            this._g.i8(edge3, this._d.gk(edge3));
                            this._d.gz(edge3, $A72._A);
                            this._d.xr(edge3, edge3.a2(), node4);
                            listcell = nodelist.an(node4, listcell);
                        }
                    }

                }
                var _lif = $A96._z;
                if (this._b.a2(node))
                    _lif = this._b.b2(node);
                var l1 = _lif._b.ay() + edgelist5.ay() + node.ao() + edgelist4.ay() + _lif._q.ay();
                if (l1 > 0) {
                    var d7 = this._d.g9(node) / 2;
                    var d10 = this._d.gj(node);
                    var d11 = this.a7(d10, l1);
                    var d13 = -0.5 * d10 + this.a8(this._d.gj(node), l1, d11) + d11 * (_lif._b.ay() + edgelist5.ay());
                    for (var edgecursor2 = node.ap(); edgecursor2.i1(); edgecursor2.i2()) {
                        var edge4 = edgecursor2.i8();
                        if (!this.c2(edge4) && this._j.i1(edge4.a2()) == null) {
                            this._d.g2(edge4).i8(new $A00(d13, d7));
                            d13 += d11;
                        }
                    }
                }
                var _la = this._t.a3(node);
                var i2 = 0;
                var j2 = 0;
                var k2 = 0;
                var l2 = 0;
                if (_la != null) {
                    i2 = _la._e.ay();
                    j2 = _la._c.ay();
                    k2 = _la._b.ay();
                    l2 = _la._d.ay();
                }
                l1 = _lif._g.ay() + i2 + edgelist7.ay() + node.ak() + edgelist6.ay() + j2 + _lif._d.ay();
                if (l1 > 0) {
                    var d12 = this._d.gj(node);
                    var d14 = this.a7(d12, l1);
                    var d15 = this.a8(d12, l1, d14);
                    var d16 = -0.5 * d12 + d15 + d14 * (_lif._g.ay() + i2 + edgelist7.ay());
                    var d18 = -this._d.g9(node) / 2;
                    for (var edgecursor3 = node.am(); edgecursor3.i1(); edgecursor3.i2()) {
                        var edge5 = edgecursor3.i8();
                        if (!this.d1(edge5) && this._j.i1(edge5.a3()) == null) {
                            this._d.g2(edge5).i9(new $A00(d16, d18));
                            d16 += d14;
                        }
                    }

                    if (_la != null) {
                        var d17 = -0.5 * d12 + d15 + d14 * ((_lif._g.ay() + edgelist7.ay() + _la._e.ay()) - 1);
                        for (var edgecursor4 = _la._e.c1(); edgecursor4.i1(); edgecursor4.i2()) {
                            var edge6 = edgecursor4.i8();
                            this._d.u1(edge6);
                            if (edge6.a2() === node && !this.c2(edge6)) {
                                this._d.g2(edgecursor4.i8()).i8(new $A00(d17, d18));
                                d17 -= d14;
                            } else if (!this.d1(edge6)) {
                                this._d.g2(edgecursor4.i8()).i9(new $A00(d17, d18));
                                d17 -= d14;
                            }
                            this._d.h1(edge6);
                        }

                        d17 = 0.5 * d12 - d15 - d14 * (_lif._d.ay() + edgelist6.ay());
                        for (var edgecursor5 = _la._c.c1(); edgecursor5.i1(); edgecursor5.i2()) {
                            var edge7 = edgecursor5.i8();
                            this._d.u1(edge7);
                            if (edge7.a2() === node && !this.c2(edge7)) {
                                this._d.g2(edgecursor5.i8()).i8(new $A00(d17, d18));
                                d17 -= d14;
                            } else if (!this.d1(edge7)) {
                                this._d.g2(edgecursor5.i8()).i9(new $A00(d17, d18));
                                d17 -= d14;
                            }
                            this._d.h1(edge7);
                        }

                    }
                }
                if (this._b.a2(node))
                    this._b.a4(node, i2 + edgelist7.ay() + node.ak() + edgelist6.ay() + j2, edgelist5.ay() + node.ao() + edgelist4.ay(), k2 + edgelist1.ay(), l2 + edgelist.ay());
            }

        }

        this._d.xi(nodemap);
        return anodelist;
    },
    a7: function (d1, i1) {
        if (i1 <= 1)
            return 0.0;
        else
            return d1 / ((i1 - 1) + 2 * this._r);
    },
    a8: function (d1, i1, d2) {
        if (i1 <= 1)
            return d1 * 0.5;
        else
            return (d1 - d2 * (i1 - 1)) * 0.5;
    },
    f: function (anodelist) {
        var d1 = this.g1();
        this._f = this._d.xk();
        for (var i1 = 0; i1 < anodelist.length; i1++) {
            var nodelist = anodelist[i1];
            for (var listcell = nodelist._b; listcell != null; ) {
                var node = listcell.d();
                var node1 = this._n.i1(node);
                if (node1 != null || this._t.b2(node)) {
                    listcell = listcell.a();
                } else {
                    var nodelist2 = new $A46();
                    var nodelist5 = new $A46();
                    var nodelist6 = new $A46();
                    var nodelist7 = new $A46();
                    var nodelist8 = new $A46();
                    var nodelist9 = new $A46();
                    var edgelist = new $A25();
                    var edgelist1 = new $A25();
                    var _lfor1 = new $A56(nodelist2, nodelist5, nodelist6, nodelist7, nodelist8, nodelist9, edgelist, edgelist1);
                    this._f.z1(node, _lfor1);
                    edgelist.ab(node.am());
                    edgelist1.ab(node.ap());
                    for (var listcell2 = listcell.b(); listcell2 != null && this._n.i1(listcell2.d()) === node; listcell2 = listcell2.b()) {
                        var node6 = listcell2.d();
                        var portconstraint = this.c3(node6);
                        if (portconstraint.f())
                            nodelist5.ac(node6);
                        else if (portconstraint.c())
                            nodelist7.ac(node6);
                        else if (portconstraint.d())
                            nodelist9.ac(node6);
                    }

                    var listcell3;
                    for (listcell3 = listcell.a(); listcell3 != null && this._n.i1(listcell3.d()) === node; listcell3 = listcell3.a()) {
                        var node8 = listcell3.d();
                        var portconstraint1 = this.c3(node8);
                        if (portconstraint1.e())
                            nodelist2.aa(node8);
                        else if (portconstraint1.c())
                            nodelist6.aa(node8);
                        else if (portconstraint1.d())
                            nodelist8.aa(node8);
                    }

                    listcell = listcell3;
                }
            }

        }

        var afor = this.d2(anodelist);
        var d2 = 0.0;
        for (var j1 = 0; j1 < anodelist.length; j1++) {
            var for1 = afor[j1];
            if (j1 > 0)
                d2 += afor[j1 - 1]._j + afor[j1 - 1]._h + afor[j1 - 1]._b;
            d2 += for1._g + for1._f + for1._a + for1._d;
            for (var nodecursor = anodelist[j1].x1(); nodecursor.i1(); nodecursor.i2()) {
                var node2 = nodecursor.i9();
                this._d.s3(node2, this._d.gi(node2), this._d.gh(node2) + d2);
            }

            for1._c += d2;
            for1._i += d2;
        }

        for (var l1 = 0; l1 < anodelist.length; l1++) {
            var nodelist4 = anodelist[l1];
            for (var nodecursor1 = nodelist4.x1(); nodecursor1.i1(); nodecursor1.i2()) {
                var node3 = nodecursor1.i9();
                if (this._n.i1(node3) != null)
                    nodelist4.av(nodecursor1);
            }
        }

        var self = this;
        var _la = function (node, node1) {
            if (self.a3(node))
                if (self.a3(node1))
                    return self._d.gi(node) >= self._d.gi(node1) ? -1 : 1;
                else
                    return 1;
            if (self.a3(node1))
                return -1;
            else
                return self._d.gi(node) >= self._d.gi(node1) ? 1 : -1;
        };
        var _lif = function (node, node1) {
            if (self.a3(node))
                if (self.a3(node1))
                    return self._d.gi(node) >= self._d.gi(node1) ? 1 : -1;
                else
                    return 1;
            if (self.a3(node1))
                return -1;
            else
                return self._d.gi(node) >= self._d.gi(node1) ? -1 : 1;
        };
        for (var i2 = 0; i2 < anodelist.length; i2++) {
            var for4 = afor[i2];
            for (var nodecursor2 = anodelist[i2].x1(); nodecursor2.i1(); nodecursor2.i2()) {
                var node4 = nodecursor2.i9();
                if (!this._t.b2(node4)) {
                    var _lfor = this._f.i1(node4);
                    var nodelist11 = _lfor._d;
                    var nodelist12 = _lfor._a;
                    var nodelist13 = _lfor._b;
                    var nodelist14 = _lfor._h;
                    var nodelist15 = _lfor._f;
                    var nodelist16 = _lfor._c;
                    var edgelist2 = _lfor._g;
                    var edgelist3 = _lfor._e;
                    var k2 = 0;
                    var l2 = 0;
                    var i3 = 0;
                    var j3 = 0;
                    var l4 = node4.ao();
                    var i5 = node4.ak();
                    var d22 = this._d.gi(node4);
                    var d23 = this._d.gh(node4);
                    var d24 = this._d.gj(node4);
                    var d25 = this._d.g9(node4);
                    var _la2 = this._t.a3(node4);
                    var _lif1 = $A96._z;
                    if (this._b.a2(node4))
                        _lif1 = this._b.b2(node4);
                    if (_la2 != null) {
                        k2 = _la2._d.ay();
                        l2 = _la2._b.ay();
                        i3 = _la2._e.ay();
                        j3 = _la2._c.ay();
                        if (k2 > 0) {
                            var k3 = _lif1._h.ay() + nodelist11.ay() + k2 + _lif1._k.ay();
                            var d10 = this.a7(d25, k3);
                            var d18 = this.a8(d25, k3, d10);
                            var d14 = d23 + d18 + d10 * (_lif1._h.ay() + this.a4(nodelist11));
                            for (var edgecursor3 = _la2._d.c1(); edgecursor3.i1(); edgecursor3.i2()) {
                                var edge3 = edgecursor3.i8();
                                this._d.u1(edge3);
                                if (edge3.a2() === node4) {
                                    if (!this.c2(edge3))
                                        this._d.gx(edge3, new $A00(d22 + d24, d14));
                                } else {
                                    if (this.d1(edge3)) {
                                    }
                                    this._d.gy(edge3, new $A00(d22 + d24, d14));
                                }
                                d14 += d10;
                                this._d.h1(edge3);
                            }

                        }
                        if (l2 > 0) {
                            var l3 = _lif1._i.ay() + nodelist12.ay() + l2 + _lif1._l.ay();
                            var d11 = this.a7(d25, l3);
                            var d19 = this.a8(d25, l3, d11);
                            var d15 = d23 + d19 + d11 * (_lif1._i.ay() + this.a4(nodelist12));
                            for (var edgecursor4 = _la2._b.c1(); edgecursor4.i1(); edgecursor4.i2()) {
                                var edge4 = edgecursor4.i8();
                                this._d.u1(edge4);
                                if (edge4.a2() === node4) {
                                    if (!this.c2(edge4))
                                        this._d.gx(edge4, new $A00(d22, d15));
                                } else if (!this.d1(edge4))
                                    this._d.gy(edge4, new $A00(d22, d15));
                                d15 += d11;
                                this._d.h1(edge4);
                            }

                        }
                    }
                    if (nodelist11.ay() > 0) {
                        nodelist11.a1(_la);
                        var i4 = _lif1._h.ay() + nodelist11.ay() + k2 + _lif1._k.ay();
                        var d12 = this.a7(d25, i4);
                        var d20 = this.a8(d25, i4, d12);
                        var d16 = d23 + d20 + d12 * _lif1._h.ay();
                        var flag = true;
                        while (!nodelist11.ar()) {
                            var node9 = nodelist11.x4();
                            if (this.a3(node9)) {
                                if (flag) {
                                    flag = false;
                                    d16 += d12 * k2;
                                }
                                var edge5 = node9.ag();
                                var ylist = this._d.gd(edge5);
                                var ypoint6 = ylist.at();
                                ylist.ac(new $A00(ypoint6.x, for4.b()));
                                if (this.c2(edge5)) {
                                    var ypoint10 = this._a.i1(edge5);
                                    ylist.ac(new $A00(ypoint6.x, ypoint10.y + this._d.g6(node4)));
                                    ylist.ac(new $A00(ypoint10.x + this._d.g5(node4), ypoint10.y + this._d.g6(node4)));
                                } else {
                                    ylist.ac(new $A00(ypoint6.x, d16));
                                    ylist.ac(new $A00(d22 + d24, d16));
                                }
                                this._d.xr(edge5, node4, edge5.a3());
                                this._d.m1(edge5, ylist);
                            } else {
                                var edge6 = node9.ae();
                                var ylist1 = this._d.gd(edge6);
                                var ypoint7 = ylist1.au();
                                ylist1.ae(new $A00(ypoint7.x, for4.a()));
                                if (this.d1(edge6)) {
                                    var ypoint11 = this._g.i1(edge6);
                                    ylist1.ae(new $A00(ypoint7.x, ypoint11.y + this._d.g6(node4)));
                                    ylist1.ae(new $A00(ypoint11.x + this._d.g5(node4), ypoint11.y + this._d.g6(node4)));
                                } else {
                                    ylist1.ae(new $A00(ypoint7.x, d16));
                                    ylist1.ae(new $A00(d22 + d24, d16));
                                }
                                this._d.xr(edge6, edge6.a2(), node4);
                                this._d.m1(edge6, ylist1);
                            }
                            this._d.x4(node9);
                            d16 += d12;
                        }
                    }
                    if (nodelist12.ay() > 0) {
                        nodelist12.a1(_lif);
                        var j4 = _lif1._i.ay() + nodelist12.ay() + l2 + _lif1._l.ay();
                        var d13 = this.a7(d25, j4);
                        var d21 = this.a8(d25, j4, d13);
                        var d17 = d23 + d21 + d13 * _lif1._i.ay();
                        var flag1 = true;
                        while (!nodelist12.ar()) {
                            var node10 = nodelist12.x4();
                            if (this.a3(node10)) {
                                if (flag1) {
                                    flag1 = false;
                                    d17 += d13 * l2;
                                }
                                var edge7 = node10.ag();
                                var ylist2 = this._d.gd(edge7);
                                var ypoint8 = ylist2.at();
                                ylist2.ac(new $A00(ypoint8.x, for4.b()));
                                if (this.c2(edge7)) {
                                    var ypoint12 = this._a.i1(edge7);
                                    ylist2.ac(new $A00(ypoint8.x, ypoint12.y + this._d.g6(node4)));
                                    ylist2.ac(new $A00(ypoint12.x + this._d.g5(node4), ypoint12.y + this._d.g6(node4)));
                                } else {
                                    ylist2.ac(new $A00(ypoint8.x, d17));
                                    ylist2.ac(new $A00(d22, d17));
                                }
                                this._d.xr(edge7, node4, edge7.a3());
                                this._d.m1(edge7, ylist2);
                            } else {
                                var edge8 = node10.ae();
                                var ylist3 = this._d.gd(edge8);
                                var ypoint9 = ylist3.au();
                                ylist3.ae(new $A00(ypoint9.x, for4.a()));
                                if (this.d1(edge8)) {
                                    var ypoint13 = this._g.i1(edge8);
                                    ylist3.ae(new $A00(ypoint9.x, ypoint13.y + this._d.g6(node4)));
                                    ylist3.ae(new $A00(ypoint13.x + this._d.g5(node4), ypoint13.y + this._d.g6(node4)));
                                } else {
                                    ylist3.ae(new $A00(ypoint9.x, d17));
                                    ylist3.ae(new $A00(d22, d17));
                                }
                                this._d.xr(edge8, edge8.a2(), node4);
                                this._d.m1(edge8, ylist3);
                            }
                            this._d.x4(node10);
                            d17 += d13;
                        }
                    }
                    var k4 = _lif1._g.ay() + _lif1._d.ay() + i5 + nodelist14.ay() + nodelist13.ay() + i3 + j3;
                    d24 = this._d.gj(node4);
                    var d26 = this.a7(d24, k4);
                    var d27 = this.a8(d24, k4, d26);
                    k4 = _lif1._b.ay() + _lif1._q.ay() + l4 + nodelist16.ay() + nodelist15.ay();
                    var d28 = this.a7(d24, k4);
                    var d29 = this.a8(d24, k4, d28);
                    if (nodelist14.ay() > 0) {
                        var d30 = d26;
                        var d34 = d1;
                        var d38 = this._d.gi(node4) + d27 + d30 * ((_lif1._g.ay() + nodelist14.ay()) - 1);
                        var d42 = this._d.gh(node4);
                        var d46 = for4._c - for4._g - nodelist14.ay() * d34;
                        var node11;
                        for (; !nodelist14.ar(); this._d.x4(node11)) {
                            node11 = nodelist14.x4();
                            var edge11 = node11.ag();
                            var ylist5 = this._d.gd(edge11);
                            var ypoint16 = ylist5.at();
                            ylist5.ac(new $A00(ypoint16.x, for4.b()));
                            ylist5.ac(new $A00(ypoint16.x, d46));
                            if (this.c2(edge11)) {
                                var ypoint20 = this._a.i1(edge11);
                                ylist5.ac(new $A00(ypoint20.x + this._d.g5(node4), d46));
                                ylist5.ac(new $A00(ypoint20.x + this._d.g5(node4), ypoint20.y + this._d.g6(node4)));
                            } else {
                                ylist5.ac(new $A00(d38, d46));
                                ylist5.ac(new $A00(d38, d42));
                                d38 -= d30;
                            }
                            d46 += d34;
                            this._d.xr(edge11, node4, edge11.a3());
                            this._d.m1(edge11, ylist5);
                        }

                    }
                    if (nodelist13.ay() > 0) {
                        var d31 = d26;
                        var d35 = d1;
                        var d39 = (this._d.gi(node4) + this._d.gj(node4)) - d27 - d31 * _lif1._d.ay();
                        var d43 = this._d.gh(node4);
                        var d47 = for4._c - for4._g - d35;
                        var node12;
                        for (; !nodelist13.ar(); this._d.x4(node12)) {
                            node12 = nodelist13.x4();
                            var edge12 = node12.ag();
                            var ylist6 = this._d.gd(edge12);
                            var ypoint17 = ylist6.at();
                            ylist6.ac(new $A00(ypoint17.x, for4.b()));
                            ylist6.ac(new $A00(ypoint17.x, d47));
                            if (this.c2(edge12)) {
                                var ypoint21 = this._a.i1(edge12);
                                ylist6.ac(new $A00(ypoint21.x + this._d.g5(node4), d47));
                                ylist6.ac(new $A00(ypoint21.x + this._d.g5(node4), ypoint21.y + this._d.g6(node4)));
                            } else {
                                ylist6.ac(new $A00(d39, d47));
                                ylist6.ac(new $A00(d39, d43));
                                d39 -= d31;
                            }
                            d47 -= d35;
                            this._d.xr(edge12, node4, edge12.a3());
                            this._d.m1(edge12, ylist6);
                        }

                    }
                    if (nodelist16.ay() > 0) {
                        var d32 = d28;
                        var d36 = d1;
                        var d40 = this._d.gi(node4) + d29 + d32 * ((_lif1._b.ay() + nodelist16.ay()) - 1);
                        var d44 = this._d.gh(node4) + this._d.g9(node4);
                        var d48 = d44 + nodelist16.ay() * d36;
                        var node13;
                        for (; !nodelist16.ar(); this._d.x4(node13)) {
                            node13 = nodelist16.x4();
                            var edge13 = node13.ae();
                            var ylist7 = this._d.gd(edge13);
                            var ypoint18 = ylist7.au();
                            ylist7.ae(new $A00(ypoint18.x, for4.a()));
                            ylist7.ae(new $A00(ypoint18.x, d48));
                            if (this.d1(edge13)) {
                                var ypoint22 = this._g.i1(edge13);
                                ylist7.ae(new $A00(ypoint22.x + this._d.g5(node4), d48));
                                ylist7.ae(new $A00(ypoint22.x + this._d.g5(node4), ypoint22.y + this._d.g6(node4)));
                            } else {
                                ylist7.ae(new $A00(d40, d48));
                                ylist7.ae(new $A00(d40, d44));
                                d40 -= d32;
                            }
                            d48 -= d36;
                            this._d.xr(edge13, edge13.a2(), node4);
                            this._d.m1(edge13, ylist7);
                        }

                    }
                    if (nodelist15.ay() > 0) {
                        var d33 = d28;
                        var d37 = d1;
                        var d41 = (this._d.gi(node4) + this._d.gj(node4)) - d29 - d28 * _lif1._q.ay();
                        var d45 = this._d.gh(node4) + this._d.g9(node4);
                        var d49 = d45 + d37;
                        var node14;
                        for (; !nodelist15.ar(); this._d.x4(node14)) {
                            node14 = nodelist15.x4();
                            var edge14 = node14.ae();
                            var ylist8 = this._d.gd(edge14);
                            var ypoint19 = ylist8.au();
                            ylist8.ae(new $A00(ypoint19.x, for4.a()));
                            ylist8.ae(new $A00(ypoint19.x, d49));
                            if (this.d1(edge14)) {
                                var ypoint23 = this._g.i1(edge14);
                                ylist8.ae(new $A00(ypoint23.x + this._d.g5(node4), d49));
                                ylist8.ae(new $A00(ypoint23.x + this._d.g5(node4), ypoint23.y + this._d.g6(node4)));
                            } else {
                                ylist8.ae(new $A00(d41, d49));
                                ylist8.ae(new $A00(d41, d45));
                                d41 -= d33;
                            }
                            d49 += d37;
                            this._d.xr(edge14, edge14.a2(), node4);
                            this._d.m1(edge14, ylist8);
                        }

                    }
                    while (!edgelist3.ar()) {
                        var edge9 = edgelist3.c3();
                        var ypoint14 = this._d.gl(edge9);
                        if (for4.a() + 12 < ypoint14.y)
                            this._d.g7(edge9).i4(ypoint14.x, for4.a());
                    }
                    while (!edgelist2.ar()) {
                        var edge10 = edgelist2.c3();
                        var ypoint15 = this._d.gs(edge10);
                        if (for4.b() - 12 > ypoint15.y) {
                            var ylist4 = this._d.gf(edge10);
                            ylist4.ac(new $A00(ypoint15.x, for4.b()));
                            this._d.s6(edge10, ylist4);
                        }
                    }
                }
            }

        }

        for (var j2 = 0; j2 < anodelist.length; j2++) {
            var nodelist10 = anodelist[j2];
            for (var listcell1 = nodelist10._b; listcell1 != null; listcell1 = listcell1.a()) {
                var node5 = listcell1.d();
                var _la1 = this._t.a3(node5);
                if (_la1 != null && _la1._a != null) {
                    this._d.x4(_la1._a);
                    nodelist10.aw(listcell1.b());
                }
            }
        }

        this._d.xi(this._f);
        this._d.xj(this._a);
        this._d.xj(this._g);
        return anodelist;
    },
    c3: function (node) {
        if (this.a3(node))
            return this.b1(node.ag());
        else
            return this.a2(node.ae());
    },
    b1: function (edge) {
        if (this._h == null)
            return $A96.s;
        else
            return this._h.i1(edge);
    },
    a2: function (edge) {
        if (this._l == null)
            return $A96.u;
        else
            return this._l.i1(edge);
    },
    c2: function (edge) {
        if (edge == null) {
            return false;
        } else {
            var portconstraint = this.b1(edge);
            return portconstraint != null && portconstraint.a();
        }
    },
    d1: function (edge) {
        if (edge == null) {
            return false;
        } else {
            var portconstraint = this.a2(edge);
            return portconstraint != null && portconstraint.a();
        }
    },
    a3: function (node) {
        return node.ao() === 1;
    },
    b2: function (node) {
        return node.ak() === 1;
    },
    a4: function (nodelist) {
        var i1 = 0;
        for (var listcell = nodelist._b; listcell != null; listcell = listcell.a())
            if (this.b2(listcell.d()))
                i1++;

        return i1;
    },
    d2: function (anodelist) {
        var d1 = this._k;
        var afor = $A53.d(anodelist.length + 1);
        for (var i1 = 0; i1 < anodelist.length; i1++) {
            var nodelist = anodelist[i1];
            var for1 = new $A73();
            afor[i1] = for1;
            for1._c = Number.MAX_VALUE;
            for1._i = Number.MIN_VALUE;
            for (var nodecursor = nodelist.x1(); nodecursor.i1(); nodecursor.i2()) {
                var node = nodecursor.i9();
                var nodelayout = this._d.gb(node);
                for1._c = Math.min(for1._c, nodelayout.i2());
                for1._i = Math.max(for1._i, nodelayout.i2() + nodelayout.i4());
            }
        }

        this._b.a5(anodelist, afor);
        for (var j1 = 0; j1 < anodelist.length; j1++) {
            var for2 = afor[j1];
            for (var nodecursor1 = anodelist[j1].x1(); nodecursor1.i1(); nodecursor1.i2()) {
                var node1 = nodecursor1.i9();
                var _lfor = this._f.i1(node1);
                if (_lfor != null) {
                    for2._h = Math.max(for2._h, Math.max(_lfor._f.ay() * d1, _lfor._c.ay() * d1));
                    for2._f = Math.max(for2._f, Math.max(_lfor._b.ay() * d1, _lfor._h.ay() * d1));
                }
            }
        }
        return afor;
    }
});
$A96.s = $A84.j(2);
$A96.u = $A84.j(1);
$A96._z = new $A74();
