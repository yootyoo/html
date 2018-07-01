var $A76 = function () {

};
_twaver.ext($A76, Object, {
    i1: function (graph) {
        this._b = graph;
        var edgelist = new $A25();
        edgelist = $A12.a6(graph);
        edgelist.az($A12.a7(graph));
        var nodelist = this.a1();
        for (; !edgelist.ar(); graph.x5(edgelist.c3()))
            ;
        return nodelist.x1();
    },
    a1: function () {
        if (this._b.x0() < 3)
            return new $A46(this._b.x9());
        var nodemap = this._b.xk();
        var nodemap1 = this._b.xk();
        var edgemap = this._b.xl();
        var listintnodepq = new $A48(this._b, new $A58(), 0, this.a3(this._b));
        var i = this._b.x0();
        var edgelist = new $A25();
        var edgelist1 = new $A25();
        var graphhider = new $A47(this._b);
        for (; i > 3; i--) {
            var node = listintnodepq.g();
            for (var nodecursor = node.an(); nodecursor.i1(); nodecursor.i2()) {
                nodemap.z1(nodecursor.i9(), i);
                nodemap1.i5(nodecursor.i9(), false);
            }

            for (var nodecursor1 = node.an(); nodecursor1.i1(); nodecursor1.i2()) {
                var node1 = nodecursor1.i9();
                for (var edgecursor1 = node1.ap(); edgecursor1.i1(); edgecursor1.i2()) {
                    var edge3 = edgecursor1.i8();
                    if (nodemap.i2(edge3.a3()) === i) {
                        edgelist1.aa(edge3);
                        nodemap1.i5(edge3.a2(), true);
                        nodemap1.i5(edge3.a3(), true);
                    }
                }
            }

            if (edgelist1.ay() < node.ad() - 1) {
                var node2 = null;
                for (var nodecursor3 = node.an(); nodecursor3.i1(); nodecursor3.i2()) {
                    var node4 = nodecursor3.i9();
                    if (nodemap.i2(node4) === i && !nodemap1.i4(node4))
                        if (node2 == null) {
                            node2 = node4;
                        } else {
                            var edge5 = this._b.xo(node2, node4);
                            edgemap.i7(edge5, true);
                            edgelist1.aa(edge5);
                            node2 = null;
                        }
                }

                if (node2 != null) {
                    for (var nodecursor4 = node.an(); nodecursor4.i1(); nodecursor4.i2()) {
                        var node5 = nodecursor4.i9();
                        if (node5 === node2 || node5.aj(node2) != null)
                            continue;
                        var edge7 = this._b.xo(node2, node5);
                        edgemap.i7(edge7, true);
                        edgelist1.aa(edge7);
                        break;
                    }
                }
                if (edgelist1.ay() < node.ad() - 1) {
                    var j = 0x7fffffff;
                    var node6 = null;
                    for (var nodecursor5 = node.an(); nodecursor5.i1(); nodecursor5.i2()) {
                        var node7 = nodecursor5.i9();
                        if (node7.ad() < j) {
                            node6 = node7;
                            j = node7.ad();
                        }
                    }

                    for (var nodecursor6 = node.an(); nodecursor6.i1(); nodecursor6.i2()) {
                        var node8 = nodecursor6.i9();
                        if (node6.aj(node8) != null || node6 === node8)
                            continue;
                        var edge9 = this._b.xo(node6, node8);
                        edgemap.i7(edge9, true);
                        edgelist1.aa(edge9);
                        if (edgelist1.ay() >= node.ad() - 1)
                            break;
                    }
                }
            }
            for (var nodecursor2 = node.an(); nodecursor2.i1(); nodecursor2.i2())
                listintnodepq.b(nodecursor2.i9());

            for (var edgecursor2 = edgelist1.c1(); edgecursor2.i1(); edgecursor2.i2()) {
                var edge4 = edgecursor2.i8();
                if (edgemap.i4(edge4)) {
                    listintnodepq.d(edge4.a2());
                    listintnodepq.d(edge4.a3());
                }
            }

            edgelist.az(edgelist1);
            graphhider.e(node);
        }

        graphhider.b();
        listintnodepq.c();
        for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            if (edge._h != null)
                if (edgemap.i4(edge))
                    this._b.x5(edge);
                else
                    this._b.h1(edge);
        }

        var edgelist2 = this.a4(this._b);
        var nodelist = new $A46();
        var edge1 = edgelist2.ak(0);
        var edge2 = edgelist2.ak(1);
        var node3 = null;
        if (edge1.a2() === edge2.a2() || edge1.a2() === edge2.a3())
            node3 = edge1.a3();
        else
            node3 = edge1.a2();
        nodelist.aa(node3);
        for (var edgecursor3 = edgelist2.c1(); edgecursor3.i1(); edgecursor3.i2()) {
            var edge6 = edgecursor3.i8();
            node3 = edge6.a1(node3);
            nodelist.aa(node3);
        }

        for (var edgecursor4 = edgelist.c1(); edgecursor4.i1(); edgecursor4.i2()) {
            var edge8 = edgecursor4.i8();
            if (!edgemap.i4(edge8) && edge8._h == null)
                this._b.u1(edge8);
        }

        this._b.xi(nodemap1);
        this._b.xj(edgemap);
        this._b.xi(nodemap);
        this.a2(nodelist);
        return nodelist;
    },
    a2: function (nodelist) {
        if (nodelist.ay() < this._b.x0()) {
            var nodemap = this._b.xk();
            for (var listcell = nodelist._b; listcell != null; listcell = listcell.a()) {
                var node = listcell.d();
                nodemap.z1(node, listcell);
            }

            var listintnodepq;
            for (listintnodepq = new $A48(this._b, new $A59(nodemap), 0, nodelist.ay(), new $A59(nodemap)); !listintnodepq.e(); ) {
                var node1 = listintnodepq.f();
                for (var nodecursor = node1.an(); nodecursor.i1(); nodecursor.i2()) {
                    var node2 = nodecursor.i9();
                    if (nodemap.i1(node2) == null)
                        continue;
                    var listcell1 = nodemap.i1(node2);
                    var node4 = nodelist.ai(listcell1).d();
                    var listcell2 = null;
                    if (node1.aj(node4) != null)
                        listcell2 = nodelist.ao(node1, listcell1);
                    else
                        listcell2 = nodelist.an(node1, listcell1);
                    nodemap.z1(node1, listcell2);
                    break;
                }

                for (var nodecursor1 = node1.an(); nodecursor1.i1(); nodecursor1.i2()) {
                    var node3 = nodecursor1.i9();
                    if (nodemap.i1(node3) == null)
                        listintnodepq.d(node3);
                }
            }

            this._b.xi(nodemap);
            listintnodepq.c();
        }
    },
    a3: function (graph) {
        var i = 0;
        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2())
            i = Math.max(i, nodecursor.i9().ad());
        return i;
    },
    a4: function (graph) {
        var infoArray = [];
        for (var i = 0, n = graph.x0(); i < n; i++)
            infoArray[i] = new $A16();

        var dfs = new $A14(infoArray);
        dfs.a6(false);
        dfs.a8(graph);
        var j = -1;
        var node = null;
        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node1 = nodecursor.i9();
            var _la = infoArray[node1.al()];
            if (_la._a + _la._c > j) {
                j = _la._a + _la._c;
                node = node1;
            }
        }

        var edgelist = new $A25();
        var node2 = node;
        for (var edge = infoArray[node2.al()]._d; edge != null; edge = infoArray[node2.al()]._d) {
            edgelist.ac(edge);
            node2 = edge.a1(node2);
        }

        node2 = node;
        for (var edge1 = infoArray[node2.al()]._b; edge1 != null; edge1 = infoArray[node2.al()]._d) {
            edgelist.ae(edge1);
            node2 = edge1.a1(node2);
        }

        return edgelist;
    }
});
