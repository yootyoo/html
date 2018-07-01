var $A81 = function (graph) {
    $A81.superClass.constructor.call(this);
    this._ay = graph;
    this._a0 = this.xk();
    this._au = this.xl();
};
_twaver.ext($A81, $A80, {
    c2: function (node) {
        var nodelist = this._a0.i1(node);
        return nodelist;
    },
    a2: function (node, nodelist) {
        this._a0.z1(node, nodelist);
    },
    h: function () {
        if (this._az == null)
            this._az = this.xk();
        var ai = $A53.a(this._ay.x0() + 1);
        var i = 1;
        for (var nodecursor = this.x9(); nodecursor.i1(); ) {
            var nodelist = this.c2(nodecursor.i9());
            for (var nodecursor1 = nodelist.x1(); nodecursor1.i1(); nodecursor1.i2()) {
                var node = nodecursor1.i9();
                ai[node.al()] = i;
            }

            var edgelist = new $A25();
            for (var nodecursor2 = nodelist.x1(); nodecursor2.i1(); nodecursor2.i2()) {
                var node1 = nodecursor2.i9();
                var j = ai[node1.al()];
                for (var edgecursor = node1.ap(); edgecursor.i1(); edgecursor.i2()) {
                    var edge = edgecursor.i8();
                    var node2 = edge.a3();
                    var k = ai[node2.al()];
                    if (k === j)
                        edgelist.ac(edge);
                }
            }
            this._az.z1(nodecursor.i9(), edgelist);
            nodecursor.i2();
            i++;
        }
    },
    d1: function (node) {
        return this._az.i1(node);
    },
    b: function (edge) {
        return this._au.i1(edge);
    },
    a3: function (edge, edgelist) {
        this._au.i8(edge, edgelist);
    },
    a1: function () {
        var nodemap = this._ay.xk();
        var edgemap = $A49.a4($A53.a(this._ay.xh()));
        var i = $A12.a1(this._ay, edgemap, nodemap);
        var aedgelist = $A12.a5(this._ay, edgemap, i);
        this.d2(nodemap, aedgelist);
        this._ay.xi(nodemap);
    },
    c1: function (aedgelist) {
        var edgelist = null;
        var i = -1;
        for (var j = 0, n = aedgelist.length; j < n; j++) {
            var edgelist1 = aedgelist[j];
            if (edgelist1.ay() > i) {
                edgelist = edgelist1;
                i = edgelist1.ay();
            }
        }
        return edgelist;
    },
    d2: function (nodemap, aedgelist) {
        var edgemap = this._ay.xl();
        var nodemap1 = this._ay.xk();
        var n = aedgelist.length;
        for (var i = 0; i < n; i++) {
            var edgelist = aedgelist[i];
            for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2())
                edgemap.i8(edgecursor.i8(), edgelist);
        }

        var edgelist1 = this.c1(aedgelist);
        this.a4(edgelist1, nodemap, edgemap, new $List(), nodemap1);

        var hashtable = {};
        n = aedgelist.length;
        for (var j = 0; j < n; j++) {
            var edgelist3 = aedgelist[j];
            if (edgelist3.ay() > 1) {
                var node1 = this.xm();
                hashtable[edgelist3._id] = node1;
            }
        }

        for (var nodecursor1 = this._ay.x9(); nodecursor1.i1(); nodecursor1.i2()) {
            var node2 = nodecursor1.i9();
            if (nodemap.i4(node2) && nodemap1.i1(node2) == null) {
                var node3 = this.xm();
                hashtable[node2._id] = node3;
                var nodelist = new $A46();
                nodelist.aa(node2);
                this.a2(node3, nodelist);
            }
        }

        var anode = $A53.d(2);
        n = aedgelist.length;
        for (var k = 0; k < n; k++) {
            var edgelist4 = aedgelist[k];
            if (edgelist4.ay() === 1) {
                var edge = edgelist4.c2();
                anode[0] = edge.a2();
                anode[1] = edge.a3();
                for (var i1 = 0; i1 < 2; i1++) {
                    var node10 = anode[i1];
                    if (node10.ad() === 1) {
                        var node5 = this.xm();
                        hashtable[node10._id] = node5;
                        var nodelist1 = new $A46();
                        nodelist1.aa(node10);
                        this.a2(node5, nodelist1);
                    }
                }
            }
        }

        for (var nodecursor2 = this._ay.x9(); nodecursor2.i1(); nodecursor2.i2()) {
            var node4 = nodecursor2.i9();
            if (nodemap1.i1(node4) != null) {
                var edgelist5 = nodemap1.i1(node4);
                var node8 = hashtable[edgelist5._id];
                for (var edgecursor2 = node4.af(); edgecursor2.i1(); edgecursor2.i2()) {
                    var edge4 = edgecursor2.i8();
                    if (edgemap.i1(edge4) !== edgelist5) {
                        var node13 = hashtable[edgemap.i1(edge4)._id];
                        if (node13 == null) {
                            var node15 = edge4.a1(node4);
                            var edgelist8 = nodemap1.i1(node15);
                            if (edgelist8 != null)
                                node13 = hashtable[edgelist8._id];
                            else
                                node13 = hashtable[node15._id];
                        }
                        var edge5 = node8.aj(node13);
                        var edgelist9 = null;
                        if (edge5 == null) {
                            edge5 = this.xo(node8, node13);
                            edgelist9 = new $A25();
                        } else {
                            edgelist9 = this.b(edge5);
                        }
                        edgelist9.aa(edge4);
                        this.a3(edge5, edgelist9);
                    }
                }
            } else if (nodemap.i4(node4)) {
                var node6 = hashtable[node4._id];
                for (var edgecursor1 = node4.af(); edgecursor1.i1(); edgecursor1.i2()) {
                    var edge2 = edgecursor1.i8();
                    var node11 = edge2.a1(node4);
                    var node14 = hashtable[node11._id];
                    if (node14 != null) {
                        var edge6 = node6.aj(node14);
                        if (edge6 == null) {
                            var edge7 = this.xo(node6, node14);
                            var edgelist10 = new $A25();
                            edgelist10.aa(edge2);
                            this.a3(edge7, edgelist10);
                        }
                    }
                }
            }
        }

        if (this._ay.x0() === 2 && this._ay.xg() === 1) {
            var edge1 = this._ay.xf().i8();
            var node7 = hashtable[edge1.a2()._id];
            var node9 = hashtable[edge1.a3()._id];
            if (node9 != null && node7 != null && node9.aj(node7) == null) {
                var edge3 = this.xo(node7, node9);
                var edgelist7 = new $A25();
                edgelist7.aa(edge1);
                this.a3(edge3, edgelist7);
            }
        }
        var ai = $A53.a(this._ay.x0());
        var l = 1;
        n = aedgelist.length;
        for (var j1 = 0; j1 < n; j1++) {
            var edgelist6 = aedgelist[j1];
            var node12 = hashtable[edgelist6._id];
            if (node12 != null) {
                var nodelist2 = this.c2(node12);
                if (nodelist2 == null) {
                    nodelist2 = new $A46();
                    this.a2(node12, nodelist2);
                }
                for (var edgecursor3 = edgelist6.c1(); edgecursor3.i1(); edgecursor3.i2()) {
                    var edge8 = edgecursor3.i8();
                    var node16 = edge8.a2();
                    if (ai[node16.al()] !== l && (!nodemap.i4(node16) || nodemap1.i1(node16) === edgelist6)) {
                        ai[node16.al()] = l;
                        nodelist2.aa(node16);
                    }
                    node16 = edge8.a3();
                    if (ai[node16.al()] !== l && (!nodemap.i4(node16) || nodemap1.i1(node16) === edgelist6)) {
                        ai[node16.al()] = l;
                        nodelist2.aa(node16);
                    }
                }
            }
        }

        this._ay.xj(edgemap);
        this._ay.xi(nodemap1);
    },
    a4: function (edgelist, nodemap, edgemap, hashtable, nodemap1) {
        if (hashtable.contains(edgelist))
            return;
        hashtable.add(edgelist);
        var anode = [];
        for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            anode[0] = edge.a2();
            anode[1] = edge.a3();
            for (var i = 0; i < 2; i++) {
                var node = anode[i];
                if (nodemap.i4(node) && nodemap1.i1(node) == null) {
                    if (edgelist.ay() > 1)
                        nodemap1.z1(node, edgelist);
                    for (var edgecursor1 = node.af(); edgecursor1.i1(); edgecursor1.i2()) {
                        var edgelist1 = edgemap.i1(edgecursor1.i8());
                        this.a4(edgelist1, nodemap, edgemap, hashtable, nodemap1);
                    }
                }
            }
        }
    }
});
