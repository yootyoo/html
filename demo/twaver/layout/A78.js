var $A78 = function () {
    $A78.superClass.constructor.call(this);
};
_twaver.ext($A78, $A77, {
    gb: function (obj) {
        return this.g1(obj);
    },
    g7: function (obj) {
        return this.g2(obj);
    },
    g5: function (node) {
        var nodelayout = this.g1(node);
        return nodelayout.i1() + nodelayout.i3() / 2;
    },
    g6: function (node) {
        var nodelayout = this.g1(node);
        return nodelayout.i2() + nodelayout.i4() / 2;
    },
    g4: function (node) {
        return new $A00(this.g5(node), this.g6(node));
    },
    gi: function (node) {
        return this.g1(node).i1();
    },
    gh: function (node) {
        return this.g1(node).i2();
    },
    ga: function (node) {
        var nodelayout = this.g1(node);
        return new $A00(nodelayout.i1(), nodelayout.i2());
    },
    gj: function (node) {
        return this.g1(node).i3();
    },
    g9: function (node) {
        return this.g1(node).i4();
    },
    gm: function (node) {
        return new $A01(this.gj(node), this.g9(node));
    },
    s1: function (node, ypoint) {
        this.s2(node, ypoint.x, ypoint.y);
    },
    s2: function (node, d, d1) {
        var nodelayout = this.g1(node);
        nodelayout.i5(d - nodelayout.i3() / 2, d1 - nodelayout.i4() / 2);
    },
    s7: function (node, d, d1) {
        this.g1(node).i6(d, d1);
    },
    s8: function (node, ydimension) {
        this.s7(node, ydimension.width, ydimension.height);
    },
    s3: function (node, d, d1) {
        this.g1(node).i5(d, d1);
    },
    s4: function (node, ypoint) {
        this.s3(node, ypoint.x, ypoint.y);
    },
    gp: function (edge) {
        var edgelayout = this.g2(edge);
        var vector = new $List();
        for (var i = 0; i < edgelayout.i1(); i++)
            vector.add(edgelayout.i2(i));
        return new $A05(vector);
    },
    gf: function (edge) {
        var edgelayout = this.g2(edge);
        var ylist = new $A35();
        for (var i = 0; i < edgelayout.i1(); i++)
            ylist.aa(edgelayout.i2(i));
        return ylist;
    },
    gc: function (edge) {
        var vector = new $List();
        vector.add(this.gs(edge));
        for (var ypointcursor = this.gp(edge).d(); ypointcursor.i1(); ypointcursor.i2())
            vector.add(ypointcursor.i6());
        vector.add(this.gl(edge));
        return new $A05(vector);
    },
    gd: function (edge) {
        var ylist = new $A35();
        ylist.aa(this.gs(edge));
        for (var ypointcursor = this.gp(edge).d(); ypointcursor.i1(); ypointcursor.i2())
            ylist.aa(ypointcursor.i6());
        ylist.aa(this.gl(edge));
        return ylist;
    },
    m1: function (edge, ylist) {
        var edgelayout = this.g2(edge);
        edgelayout.i5();
        var ycursor = ylist.ah();
        var ypoint = ycursor.i6();
        this.gx(edge, ypoint);
        var ypoint2 = ylist.as();
        ycursor.i2();
        for (; ycursor.i6() !== ypoint2; ycursor.i2()) {
            var ypoint1 = ycursor.i6();
            edgelayout.i4(ypoint1.x, ypoint1.y);
        }
        this.gy(edge, ypoint2);
    },
    s5: function (edge, ypointpath) {
        var edgelayout = this.g2(edge);
        edgelayout.i5();
        for (var ypointcursor = ypointpath.d(); ypointcursor.i1(); ypointcursor.i2()) {
            var ypoint = ypointcursor.i6();
            edgelayout.i4(ypoint.x, ypoint.y);
        }
    },
    s6: function (edge, ylist) {
        var edgelayout = this.g2(edge);
        edgelayout.i5();
        for (var ycursor = ylist.ah(); ycursor.i1(); ycursor.i2()) {
            var ypoint = ycursor.i6();
            edgelayout.i4(ypoint.x, ypoint.y);
        }
    },
    m2: function (edge, ypoint, ypoint1) {
        this.gx(edge, ypoint);
        this.gy(edge, ypoint1);
    },
    gn: function (edge) {
        return this.g2(edge).i6();
    },
    gk: function (edge) {
        return this.g2(edge).i7();
    },
    gt: function (edge, ypoint) {
        this.g2(edge).i8(ypoint);
    },
    gz: function (edge, ypoint) {
        this.g2(edge).i9(ypoint);
    },
    gs: function (edge) {
        var ypoint = this.g2(edge).i6();
        if (ypoint == null) {
            return this.g4(edge.a2());
        } else {
            var ypoint1 = new $A00(this.g5(edge.a2()) + ypoint.x, this.g6(edge.a2()) + ypoint.y);
            return ypoint1;
        }
    },
    gl: function (edge) {
        var ypoint = this.g2(edge).i7();
        if (ypoint == null) {
            return this.g4(edge.a3());
        } else {
            var ypoint1 = new $A00(this.g5(edge.a3()) + ypoint.x, this.g6(edge.a3()) + ypoint.y);
            return ypoint1;
        }
    },
    gx: function (edge, ypoint) {
        var ypoint1 = new $A00(ypoint.x - this.g5(edge.a2()), ypoint.y - this.g6(edge.a2()));
        this.g2(edge).i8(ypoint1);
    },
    gy: function (edge, ypoint) {
        var ypoint1 = new $A00(ypoint.x - this.g5(edge.a3()), ypoint.y - this.g6(edge.a3()));
        this.g2(edge).i9(ypoint1);
    },
    g8: function () {
        var edgelist = new $A25();
        for (var edgecursor = this.xf(); edgecursor.i1(); edgecursor.i2())
            edgelist.aa(edgecursor.i8());
        return edgelist;
    },
    g3: function () {
        var d1;
        var d = d1 = Number.MAX_VALUE;
        var d3;
        var d2 = d3 = Number.MIN_VALUE;
        for (var nodecursor = this.x9(); nodecursor.i1(); nodecursor.i2()) {
            var ypoint = this.ga(nodecursor.i9());
            var ydimension = this.gm(nodecursor.i9());
            d = Math.min(ypoint.x, d);
            d1 = Math.min(ypoint.y, d1);
            d2 = Math.max(ypoint.x + ydimension.width, d2);
            d3 = Math.max(ypoint.y + ydimension.height, d3);
        }
        for (var edgecursor = this.xf(); edgecursor.i1(); edgecursor.i2()) {
            for (var ycursor = this.gp(edgecursor.i8()).c(); ycursor.i1(); ycursor.i2()) {
                var ypoint1 = ycursor.i6();
                d = Math.min(ypoint1.x, d);
                d1 = Math.min(ypoint1.y, d1);
                d2 = Math.max(ypoint1.x, d2);
                d3 = Math.max(ypoint1.y, d3);
            }
        }
        return { x: Math.floor(d), y: Math.floor(d1), width: Math.floor(d2 - d), height: Math.floor(d3 - d1) };
    }
});
