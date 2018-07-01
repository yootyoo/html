var $A89 = function () {
    $A89.superClass.constructor.call(this);
    this._i6 = 0;
    this._i3 = 0x7fffffff;
    this._i0 = 60;
    this._iz = 20;
    this._i2 = 20;
    this._i4 = 20;
    this.i5(false);
    this._i7 = new $A90();
    this._i1 = new $A92();
    this._i8 = new $A94();
};
_twaver.ext($A89, $A67, {
    j2: function () {
        return this._i2;
    },
    i4: function (layoutgraph) {
        return true;
    },
    i3: function (layoutgraph) {
        this._i6 = new Date().getTime();
        $A83.d(layoutgraph, false);
        var nodemap = layoutgraph.xk();
        var nodemap1 = layoutgraph.xk();
        var edgemap = layoutgraph.xl();
        var edgelist = new $A25();
        var a1 = new $A96(layoutgraph, nodemap, nodemap1, edgemap);
        a1.a6(this.j2());
        this._i8.i3(this._iz);
        this._i8.i6(this._i0);
        this._i8.i4(this._i2);
        this._i8.i5(this._i4);
        this._i8.i2(nodemap1);
        var i = this._i7.i1(layoutgraph, nodemap, edgelist);
        for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            edgemap.i7(edge, true);
            var ypoint = layoutgraph.gn(edge);
            layoutgraph.gt(edge, layoutgraph.gk(edge));
            layoutgraph.gz(edge, ypoint);
        }

        this.a2(layoutgraph, nodemap, nodemap1);
        i = a1.a9(i);
        var anodelist = this.j1(layoutgraph, nodemap, i);
        anodelist = a1.a5(anodelist);
        anodelist = a1.b3(anodelist);
        this._i8.i1(layoutgraph, anodelist, nodemap);
        anodelist = a1.g2(anodelist);
        a1.e2(anodelist);
        this.b(layoutgraph, nodemap1);
        this.w(layoutgraph);
        this.a1(layoutgraph, edgelist);
        a1.e1();
        layoutgraph.xj(edgemap);
        layoutgraph.xi(nodemap1);
        layoutgraph.xi(nodemap);
    },
    j1: function (layoutgraph, nodemap, i) {
        if (this._i1 instanceof $A92) {
            var classiclayersequencer = this._i1;
            var l = new Date().getTime() - this._i6;
            classiclayersequencer.ib(this._i3 - l);
        }
        var anodelist = this._i1.ia(layoutgraph, nodemap, i);
        return anodelist;
    },
    a1: function (layoutgraph, edgelist) {
        for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var ypoint = layoutgraph.gs(edge);
            var ypoint1 = layoutgraph.gl(edge);
            layoutgraph.x3(edge);
            var ypointpath = layoutgraph.gp(edge);
            layoutgraph.s5(edge, ypointpath.a());
            layoutgraph.gy(edge, ypoint);
            layoutgraph.gx(edge, ypoint1);
        }
    },
    b: function (layoutgraph, nodemap) {
        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var edge = nodemap.i1(node);
            if (edge != null && !layoutgraph.xp(edge)) {
                for (var node1 = node.am().i8().a2(); nodemap.i1(node1) != null; node1 = node.am().i8().a2())
                    node = node1;

                layoutgraph.u1(edge);
                var edge1 = node.ae();
                var ylist = new $A35();
                for (; nodemap.i1(edge1.a3()) != null; edge1 = edge1.a3().ag()) {
                    var ypoint = layoutgraph.gs(edge1);
                    ylist.aa(ypoint);
                    ylist.az(layoutgraph.gf(edge1));
                    var ypoint2 = layoutgraph.gl(edge1);
                    if (!ypoint2.equals(ypoint))
                        ylist.aa(ypoint2);
                }

                var ypoint1 = layoutgraph.gs(edge1);
                ylist.aa(ypoint1);
                ylist.az(layoutgraph.gf(edge1));
                var ypoint3 = layoutgraph.gl(edge1);
                if (!ypoint3.equals(ypoint1))
                    ylist.aa(ypoint3);
                layoutgraph.m1(edge, ylist);
            }
        }

        for (var nodecursor1 = layoutgraph.x9(); nodecursor1.i1(); nodecursor1.i2())
            if (nodemap.i1(nodecursor1.i9()) != null)
                layoutgraph.x4(nodecursor1.i9());
    },
    w: function (layoutgraph) {
        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var edgelayout = layoutgraph.g2(edge);
            if (edgelayout.i1() > 0) {
                var vector = new $List();
                var ypointpath = layoutgraph.gc(edge);
                var ycursor = ypointpath.c();
                var ypoint = ycursor.i6();
                ycursor.i2();
                var d = ypoint.x;
                var d1 = ypoint.y;
                if (ycursor.i1()) {
                    var ypoint1 = ycursor.i6();
                    var d2 = ypoint1.x;
                    var d3 = ypoint1.y;
                    ycursor.i2();
                    for (; ycursor.i1(); ycursor.i2()) {
                        var ypoint2 = ycursor.i6();
                        var d5 = ypoint2.x;
                        var d4 = ypoint2.y;
                        var d6 = ((d - d5) * (d3 - d4)) / (d1 - d4) + d5;
                        if (Math.abs(d6 - d2) >= 1) {
                            vector.add(ypoint1);
                            d = d2;
                            d1 = d3;
                        }
                        ypoint1 = ypoint2;
                        d2 = d5;
                        d3 = d4;
                    }

                }
                if (vector.size() < edgelayout.i1())
                    layoutgraph.s5(edge, new $A05(vector));
            }
        }
    },
    a2: function (layoutgraph, nodemap, nodemap1) {
        var edgecursor = layoutgraph.g8().c1();
        edgecursor.i5();
        for (; edgecursor.i1(); edgecursor.i3()) {
            var node = edgecursor.i8().a2();
            var node1 = edgecursor.i8().a3();
            var i = nodemap.i2(node1) - nodemap.i2(node);
            if (i > 1) {
                var node2 = null;
                var edge = null;
                var node3 = node;
                for (; i > 1; i--) {
                    node2 = layoutgraph.xm();
                    layoutgraph.s7(node2, 1.0, 1.0);
                    layoutgraph.s4(node2, $A72._A);
                    edge = layoutgraph.xo(node3, node2);
                    if (node3 === node)
                        layoutgraph.gt(edge, layoutgraph.gn(edgecursor.i8()));
                    nodemap.i7(node2, nodemap.i2(node3) + 1);
                    nodemap1.z1(node2, edgecursor.i8());
                    node3 = node2;
                }

                edge = layoutgraph.xo(node2, node1);
                layoutgraph.gz(edge, layoutgraph.gk(edgecursor.i8()));
                layoutgraph.h1(edgecursor.i8());
            }
        }
    }
});
