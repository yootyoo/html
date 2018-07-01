var $A92 = function () {
    this._af = 0;
    this._b = 0;
};
_twaver.ext($A92, Object, {
    ib: function (l1) {
        this._af = l1;
    },
    ia: function (layoutgraph, nodemap, i1) {
        this.a6(layoutgraph, nodemap, i1);
        this.b2(false);
        var k1 = this.g();
        if (this.o() && k1 > 0) {
            var ai1 = this.r();
            for (var i2 = 0; i2 < 20 && k1 > 0 && this.o(); i2++) {
                this.b2(true);
                var j2 = this.g();
                if (j2 < k1) {
                    this.a7(ai1);
                    k1 = j2;
                }
            }

            this.b3(ai1);
            this.b1();
        }
        return this.c();
    },
    a6: function (graph, nodemap, i1) {
        this._b = new Date().getTime();
        this._ac = graph;
        this._ah = nodemap;
        var self = this;
        this._p = function (obj, obj1) {
            var d1 = self._n[obj.al()] - self._n[obj1.al()];
            if (d1 > 0.0)
                return 1;
            return d1 >= 0.0 ? 0 : -1;
        };
        this._ad = $A53.d(i1);
        for (var j1 = 0; j1 < this._ad.length; j1++)
            this._ad[j1] = new $A46();

        this._ab = $A53.a(this._ac.x0());
        this._f = $A53.d(this._ac.x0());
        this._n = $A53.a(this._ac.x0() + 1);
        var ab = this._ab;
        this._o = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            var edge = obj;
            var edge4 = obj1;
            var layoutgraph = edge._h;
            var node = edge.a2();
            var node4 = edge4.a2();
            var i = ab[node.al()] - ab[node4.al()];
            if (i === 0) {
                var i1 = $A92.b($A84.h(layoutgraph, edge), layoutgraph.gn(edge));
                var i2 = $A92.b($A84.h(layoutgraph, edge4), layoutgraph.gn(edge4));
                var k2 = i1 - i2;
                if (k2 === 0) {
                    var i3 = ab[edge.a3().al()] - ab[edge4.a3().al()];
                    if (i3 === 0) {
                        var k3 = $A92.a($A84.i(layoutgraph, edge), layoutgraph.gk(edge));
                        var i4 = $A92.a($A84.i(layoutgraph, edge4), layoutgraph.gk(edge4));
                        return k3 - i4;
                    } else {
                        return i3;
                    }
                } else {
                    return k2;
                }
            } else {
                return i;
            }
        };
        this._l = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            var edge1 = obj;
            var edge5 = obj1;
            var layoutgraph1 = edge1._h;
            var node1 = edge1.a3();
            var node5 = edge5.a3();
            var j = ab[node1.al()] - ab[node5.al()];
            if (j === 0) {
                var j1 = $A92.a($A84.i(layoutgraph1, edge1), layoutgraph1.gk(edge1));
                var j2 = $A92.a($A84.i(layoutgraph1, edge5), layoutgraph1.gk(edge5));
                var l2 = j1 - j2;
                if (l2 === 0) {
                    var j3 = ab[edge1.a2().al()] - ab[edge5.a2().al()];
                    if (j3 === 0) {
                        var l3 = $A92.b($A84.h(layoutgraph1, edge1), layoutgraph1.gn(edge1));
                        var j4 = $A92.b($A84.h(layoutgraph1, edge5), layoutgraph1.gn(edge5));
                        return l3 - j4;
                    } else {
                        return j3;
                    }
                } else {
                    return l2;
                }
            } else {
                return j;
            }
        };
        this._z = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            var edge2 = obj;
            var edge6 = obj1;
            var layoutgraph2 = edge2._h;
            var k = $A92.b($A84.h(layoutgraph2, edge2), layoutgraph2.gn(edge2));
            var k1 = $A92.b($A84.h(layoutgraph2, edge6), layoutgraph2.gn(edge6));
            return k - k1;
        };
        this._e = function (obj, obj1) {
            if (obj == null && obj1 != null) {
                return 1;
            }
            if (obj != null && obj1 == null) {
                return -1;
            }
            if (obj == null && obj1 == null) {
                return 0;
            }
            var edge3 = obj;
            var edge7 = obj1;
            var layoutgraph3 = edge3._h;
            var l = $A92.a($A84.i(layoutgraph3, edge3), layoutgraph3.gk(edge3));
            var l1 = $A92.a($A84.i(layoutgraph3, edge7), layoutgraph3.gk(edge7));
            return l - l1;
        };
        this._ac.x2(this._e, this._z);
    },
    c: function () {
        this._ah = null;
        this._aa = null;
        this._f = null;
        this._n = null;
        this._p = null;
        this._o = null;
        this._l = null;
        this._ac = null;
        var anodelist = this._ad;
        this._ad = null;
        return anodelist;
    },
    o: function () {
        var l1 = new Date().getTime() - this._b;
        return l1 <= this._af;
    },
    m: function () {
        var self = this;
        var f = function (obj, obj1) {
            return Math.ceil(self._n[obj.a3().al()]) - Math.ceil(self._n[obj1.a3().al()]);
        };
        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2()) {
            for (var nodecursor1 = nodecursor.i9().aw(); nodecursor1.i1(); nodecursor1.i2())
                this._n[nodecursor1.i9().al()] = $A72.j();
            nodecursor.i9().av(f);
        }
    },
    b2: function (flag) {
        for (var i1 = 0; i1 < this._ad.length; i1++)
            this._ad[i1].af();

        if (flag) {
            this.m();
            for (var i = 0, n = this._ab.length; i < n; i++) {
                this._ab[i] = 0;
            }
            this._ac.x2(null, this._z);
        }
        var node = this._ac.xm();
        this._ah.i7(node, 0);
        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2())
            if (nodecursor.i9().ak() === 0 && nodecursor.i9() !== node)
                this._ac.xo(node, nodecursor.i9());

        var dfs = new $A13(this);
        dfs.a6(true);
        dfs.a9(this._ac, node);
        this._ad[0].at();
        this._ac.x4(node);
        this.d();
    },
    a1: function () {
        this._ac.x2(this._o, this._l);
        var i1 = 0;
        for (var j1 = 1; j1 < this._ad.length; j1++) {
            var k1 = this.a2(this._ad[j1 - 1], this._ad[j1]);
            i1 += k1;
        }

        var l1 = 0;
        i1 += l1;
        return i1;
    },
    a2: function (ylist, ylist1) {
        var ycursor = ylist.ah();
        var ycursor1 = ylist1.ah();
        var ylist2 = new $A35();
        var ylist3 = new $A35();
        this._aa = $A53.d(this._ac.x0());
        var i1 = 0;
        for (; ycursor.i1() && ycursor1.i1(); ycursor1.i2()) {
            i1 += this.a8(ycursor.i6(), ylist2, ylist3, true);
            i1 += this.a8(ycursor1.i6(), ylist3, ylist2, false);
            ycursor.i2();
        }

        for (; ycursor.i1(); ycursor.i2())
            i1 += this.a8(ycursor.i6(), ylist2, ylist3, true);

        for (; ycursor1.i1(); ycursor1.i2())
            i1 += this.a8(ycursor1.i6(), ylist3, ylist2, false);

        return i1;
    },
    a8: function (node, ylist, ylist1, flag) {
        var j1 = 0;
        var k1 = 0;
        var l1 = 0;
        if (this._aa[node.al()] != null) {
            var listcell = this._aa[node.al()].a();
            for (var listcell1 = ylist._b; listcell1 !== listcell; listcell1 = listcell1.a()) {
                var node3 = listcell1._c;
                if (node3 === node) {
                    j1++;
                    l1 += k1;
                    ylist.aw(listcell1);
                } else {
                    k1++;
                }
            }
        }
        var i1 = j1 * ylist1.ay() + l1;
        if (flag) {
            for (var edge = node.ag(); edge != null; edge = edge.a8()) {
                var node1 = edge.a3();
                if (this._ab[node1.al()] >= this._ab[node.al()])
                    this._aa[node1.al()] = ylist1.ae(node1);
            }
        } else {
            for (var edge1 = node.ae(); edge1 != null; edge1 = edge1.a7()) {
                var node2 = edge1.a2();
                if (this._ab[node2.al()] > this._ab[node.al()])
                    this._aa[node2.al()] = ylist1.ae(node2);
            }
        }
        return i1;
    },
    g: function () {
        var ai1 = this.r();
        var i1 = this.a1();
        var flag = true;
        for (var k1 = 0; k1 < 3 && this.o() && i1 > 0; ) {
            var j1 = this.k();
            if (j1 < i1) {
                this.a7(ai1);
                i1 = j1;
            } else {
                k1++;
            }
            flag = !flag;
        }

        this.b3(ai1);
        this.b1();
        if (i1 > 0) {
            var byte0 = 1;
            for (var l1 = 0; byte0 === 1 && i1 > 0; l1++) {
                this.e();
                this.i();
                var i2 = this.a1();
                if (i2 < i1) {
                    byte0 = 1;
                    this.a7(ai1);
                } else {
                    byte0 = -1;
                }
                i1 = i2;
            }

            this.b3(ai1);
            this.b1();
        }
        return i1;
    },
    e: function () {
        var edgemap = this.l();
        var ai1 = this.r();
        var aylist = $A53.d(this._ac.x0());
        for (var l2 = this._ad.length - 1; l2 >= 0; l2--) {
            for (var ycursor = this._ad[l2].ah(); ycursor.i1(); ycursor.i2()) {
                var node4 = ycursor.i6();
                if (node4.ak() === 1 && node4.ao() === 1) {
                    var node = edgemap.i1(node4.ag());
                    if (node != null && aylist[node.al()] == null) {
                        var l1 = this.a4(node4, node);
                        var i1 = node.al();
                        var aylist1 = aylist[i1] = $A53.d(l1 + 1);
                        for (var j3 = aylist1.length - 1; j3 >= 0; j3--)
                            aylist1[j3] = new $A35();
                    }
                }
            }
        }

        for (var i3 = 0; i3 < this._ad.length; i3++) {
            for (var ycursor1 = this._ad[i3].ah(); ycursor1.i1(); ycursor1.i2()) {
                var node5 = ycursor1.i6();
                if (node5.ak() === 1 && node5.ao() === 1) {
                    var node1 = edgemap.i1(node5.ag());
                    if (node1 != null) {
                        var j1 = node1.al();
                        var i2 = this.a4(node5, node1) - 1;
                        aylist[j1][i2].ae(node5.ae());
                    }
                } else {
                    for (var edge = node5.ae(); edge != null; edge = edge.a7()) {
                        var node2 = edgemap.i1(edge);
                        if (node2 != null) {
                            var k1 = node2.al();
                            var j2 = this.a4(node5, node2) - 1;
                            aylist[k1][j2].ae(edge);
                        }
                    }
                }
            }
        }

        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node6 = nodecursor.i9();
            if (aylist[node6.al()] != null) {
                for (var edge3 = node6.ag(); edge3 != null; edge3 = edge3.a8()) {
                    var node3 = edgemap.i1(edge3);
                    if (node3 != null) {
                        for (var aylist2 = aylist[node3.al()]; aylist2[0].ay() > 0; ) {
                            var k2 = 0;
                            var edge1;
                            do {
                                edge1 = aylist2[k2].am();
                                var node7 = edge1.a3();
                                if (node7.ak() !== 1 || node7.ao() !== 1)
                                    break;
                                k2++;
                            } while (true);
                            var node9 = aylist2[k2].at().a3();
                            k2--;
                            node9 = edge1.a2();
                            edge1 = aylist2[k2].at();
                            var node8 = edge1.a3();
                            while (k2 >= 0) {
                                if (ai1[node9.al()] !== ai1[node8.al()])
                                    this._ab[node9.al()] = ai1[node8.al()];
                                node9 = node9.ae().a2();
                                if (--k2 >= 0) {
                                    var edge2 = aylist2[k2].at();
                                    node8 = edge2.a3();
                                }
                            }
                        }
                    }
                }
            }
        }
        this.b1();
        this._ac.xj(edgemap);
    },
    i: function () {
        var edgemap = this.f();
        var ai1 = this.r();
        var aylist = $A53.d(this._ac.x0());
        for (var l2 = 0; l2 < this._ad.length; l2++) {
            for (var ycursor = this._ad[l2].ah(); ycursor.i1(); ycursor.i2()) {
                var node4 = ycursor.i6();
                if (node4.ak() === 1 && node4.ao() === 1) {
                    var node = edgemap.i1(node4.ae());
                    if (node != null && aylist[node.al()] == null) {
                        var l1 = this.a4(node, node4);
                        var i1 = node.al();
                        var aylist1 = aylist[i1] = $A53.d(l1 + 1);
                        for (var j3 = aylist1.length - 1; j3 >= 0; j3--)
                            aylist1[j3] = new $A35();
                    }
                }
            }
        }

        for (var i3 = this._ad.length - 1; i3 >= 0; i3--) {
            for (var ycursor1 = this._ad[i3].ah(); ycursor1.i1(); ycursor1.i2()) {
                var node5 = ycursor1.i6();
                if (node5.ak() === 1 && node5.ao() === 1) {
                    var node1 = edgemap.i1(node5.ae());
                    if (node1 != null) {
                        var j1 = node1.al();
                        var i2 = this.a4(node1, node5) - 1;
                        aylist[j1][i2].ae(node5.ag());
                    }
                } else {
                    for (var edge = node5.ag(); edge != null; edge = edge.a8()) {
                        var node2 = edgemap.i1(edge);
                        if (node2 != null) {
                            var k1 = node2.al();
                            var j2 = this.a4(node2, node5) - 1;
                            aylist[k1][j2].ae(edge);
                        }
                    }
                }
            }
        }

        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node6 = nodecursor.i9();
            if (aylist[node6.al()] != null) {
                for (var edge3 = node6.ae(); edge3 != null; edge3 = edge3.a7()) {
                    var node3 = edgemap.i1(edge3);
                    if (node3 != null) {
                        for (var aylist2 = aylist[node3.al()]; aylist2[0].ay() > 0; ) {
                            var k2 = 0;
                            var edge1;
                            do {
                                edge1 = aylist2[k2].am();
                                var node7 = edge1.a2();
                                if (node7.ak() !== 1 || node7.ao() !== 1)
                                    break;
                                k2++;
                            } while (true);
                            var node9 = aylist2[k2].at().a2();
                            k2--;
                            node9 = edge1.a3();
                            edge1 = aylist2[k2].at();
                            var node8 = edge1.a2();
                            while (k2 >= 0) {
                                if (ai1[node9.al()] !== ai1[node8.al()])
                                    this._ab[node9.al()] = ai1[node8.al()];
                                node9 = node9.ag().a3();
                                if (--k2 >= 0) {
                                    var edge2 = aylist2[k2].at();
                                    node8 = edge2.a2();
                                }
                            }
                        }
                    }
                }
            }
        }
        this.b1();
        this._ac.xj(edgemap);
    },
    a4: function (node, node1) {
        return this._ah.i2(node) - this._ah.i2(node1);
    },
    l: function () {
        var edgemap = $A49.a6($A53.d(this._ac.xg()));
        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (node.ao() > 1) {
                var i1 = 0;
                for (var edge = node.ag(); edge != null; edge = edge.a8()) {
                    var node1 = edge.a3();
                    if (node1.ak() === 1 && node1.ao() === 1)
                        i1++;
                }
                if (i1 > 1) {
                    for (var edge1 = node.ag(); edge1 != null; edge1 = edge1.a8()) {
                        var edge2 = edge1;
                        var node2 = edge2.a3();
                        if (node2.ak() === 1 && node2.ao() === 1) {
                            for (; node2.ak() === 1 && node2.ao() === 1; node2 = edge2.a3()) {
                                edgemap.i8(edge2, node);
                                edge2 = node2.ag();
                            }
                            edgemap.i8(edge2, node);
                        }
                    }
                }
            }
        }
        return edgemap;
    },
    f: function () {
        var edgemap = $A49.a6($A53.d(this._ac.xg()));
        for (var nodecursor = this._ac.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (node.ak() > 1) {
                var i1 = 0;
                for (var edge = node.ae(); edge != null; edge = edge.a7()) {
                    var node1 = edge.a2();
                    if (node1.ak() === 1 && node1.ao() === 1)
                        i1++;
                }
                if (i1 > 1) {
                    for (var edge1 = node.ae(); edge1 != null; edge1 = edge1.a7()) {
                        var edge2 = edge1;
                        var node2 = edge2.a2();
                        if (node2.ak() === 1 && node2.ao() === 1) {
                            for (; node2.ak() === 1 && node2.ao() === 1; node2 = edge2.a2()) {
                                edgemap.i8(edge2, node);
                                edge2 = node2.ae();
                            }
                            edgemap.i8(edge2, node);
                        }
                    }
                }
            }
        }
        return edgemap;
    },
    k: function () {
        for (var i1 = 1; i1 < this._ad.length; i1++) {
            var nodelist = this._ad[i1];
            for (var ycursor = nodelist.ah(); ycursor.i1(); ycursor.i2()) {
                var node = ycursor.i6();
                this._n[node.al()] = this.a5(node, nodelist.ay(), node.am(), this._ad[i1 - 1].ay());
                this._n[node.al()] += this._ab[node.al()] / (this._ad[i1 - 1].ay() * 3);
            }
            this.a3(nodelist, this._p);
        }
        return this.a1();
    },
    a5: function (node, i1, edgecursor, j1) {
        var d1 = 0.0;
        if (edgecursor.i7() === 0) {
            d1 = (j1 * this._ab[node.al()]) / i1;
        } else {
            for (; edgecursor.i1(); edgecursor.i2()) {
                var edge = edgecursor.i8();
                if (edge.a2() === node) {
                    d1 += this._ab[edge.a3().al()];
                } else {
                    d1 += this._ab[edge.a2().al()];
                }
            }

            d1 /= edgecursor.i7();
        }
        return d1;
    },
    a7: function (ai1) {
        $A53.f(this._ab, ai1, ai1.length);
    },
    b3: function (ai1) {
        $A53.f(ai1, this._ab, ai1.length);
    },
    r: function () {
        var ai1 = $A53.a(this._ab.length);
        this.a7(ai1);
        return ai1;
    },
    d: function () {
        for (var j1 = 0; j1 < this._ad.length; j1++) {
            var i1 = 0;
            for (var ycursor = this._ad[j1].ah(); ycursor.i1(); ) {
                this._ab[ycursor.i6().al()] = i1;
                ycursor.i2();
                i1++;
            }
        }
    },
    b1: function () {
        for (var i1 = 0; i1 < this._ad.length; i1++) {
            var nodelist = this._ad[i1];
            for (var listcell = nodelist._b; listcell != null; listcell = listcell.a()) {
                var node = listcell.d();
                this._f[this._ab[node.al()]] = node;
            }
            var j1 = 0;
            for (var listcell1 = nodelist._b; listcell1 != null; ) {
                listcell1.c(this._f[j1]);
                listcell1 = listcell1.a();
                j1++;
            }
        }
    },
    a3: function (ylist, comparator) {
        var ycursor = ylist.ah();
        for (var i1 = 0; i1 < ylist.ay(); ycursor.i2()) {
            this._f[i1] = ycursor.i6();
            i1++;
        }
        $A53.s(this._f, ylist.ay(), comparator);
        var j1 = 0;
        for (var listcell = ylist._b; listcell != null; ) {
            listcell.c(this._f[j1]);
            this._ab[this._f[j1].al()] = j1;
            listcell = listcell.a();
            j1++;
        }
    }
});
$A92.b = function (portconstraint, ypoint) {
    if (portconstraint == null)
        return 0;
    var i = portconstraint.a() ? Math.floor(ypoint.x) : 0;
    var j = portconstraint.a() ? Math.floor(ypoint.y) : 0;
    if (portconstraint.e())
        return 10000 - j;
    if (portconstraint.f())
        return -10000 + j;
    if (portconstraint.c())
        return -20000 - i;
    else
        return i;
};
$A92.a = function (portconstraint, ypoint) {
    if (portconstraint == null)
        return 0;
    var i = portconstraint.a() ? Math.floor(ypoint.x) : 0;
    var j = portconstraint.a() ? Math.floor(ypoint.y) : 0;
    if (portconstraint.e())
        return 10000 + j;
    if (portconstraint.f())
        return -10000 - j;
    if (portconstraint.d())
        return -20000 - i;
    else
        return i;
};
