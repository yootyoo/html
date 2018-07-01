var $A70 = function () {
    $A70.superClass.constructor.call(this);
    this._jm = new $A68();
    this._jk = new $A60();
};
_twaver.ext($A70, $A67, {
    i4: function (layoutgraph) {
        return true;
    },
    i3: function (layoutgraph) {
        if (layoutgraph.x0() < 2)
            return;
        this._jn = layoutgraph;

        $A83.c(this._jn);
        $A83.e(this._jn);
        var if1 = new $A81(this._jn);
        if1.a1();
        if1.h();
        var graphhider = new $A47(this._jn);
        graphhider.a();
        for (var nodecursor = if1.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var nodelist = if1.c2(node);
            if (nodelist.ay() > 1) {
                var edgelist = if1.d1(node);
                $A47.h(this._jn, edgelist.c1());
                this._jm.i3(this._jn);
                var rectangle = this._jn.g3();
                if1.s7(node, rectangle.width, rectangle.height);
            } else if (nodelist.ay() === 1) {
                var node2 = nodelist.x2();
                if1.s8(node, this._jn.gm(node2));
                this._jn.s2(node2, 0.0, 0.0);
            } else {
                if1.s7(node, 1.0, 1.0);
            }
            $A47.i(this._jn, this._jn.xf());
        }

        graphhider.b();
        var node1 = this.a7(if1);
        $A18.a4(if1, node1);
        var nodemap = if1.xk();
        var edgemap = if1.xl();
        this.a2(if1, edgemap, nodemap);
        this.a1(if1, edgemap);
        this.a3(if1, node1, edgemap);
        this._jk.a(edgemap, nodemap);
        this._jk.i3(if1);
        this.a5(if1, node1, nodemap);
        for (var nodecursor1 = if1.x9(); nodecursor1.i1(); nodecursor1.i2()) {
            var node3 = nodecursor1.i9();
            var ypoint = if1.g4(node3);
            for (var nodecursor2 = if1.c2(node3).x1(); nodecursor2.i1(); nodecursor2.i2()) {
                var node4 = nodecursor2.i9();
                this._jn.s2(node4, ypoint.x + this._jn.g5(node4), ypoint.y + this._jn.g6(node4));
            }
        }
    },
    a7: function (if1) {
        var i = -1;
        var node = null;
        for (var nodecursor = if1.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node1 = nodecursor.i9();
            if (if1.c2(node1).ay() > i) {
                node = node1;
                i = if1.c2(node1).ay();
            }
        }
        return node;
    },
    a1: function (graph, edgemap) {
        var _la = function (edge, edge1) {
            var d = edgemap.i3(edge) - edgemap.i3(edge1);
            if (d > 0.0)
                return 1;
            return d >= 0.0 ? 0 : -1;
        };
        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2())
            nodecursor.i9().av(_la);
    },
    a2: function (if1, edgemap, nodemap) {
        var ai = $A53.a(this._jn.x0());
        for (var nodecursor = if1.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            var nodelist = if1.c2(node);
            for (var nodecursor1 = nodelist.x1(); nodecursor1.i1(); nodecursor1.i2()) {
                var node2 = nodecursor1.i9();
                ai[node2.al()] = node.al();
            }
        }
        var node1 = $A18.a2(if1);
        this.a4(if1, node1, ai, edgemap, nodemap);
    },
    a3: function (if1, node, edgemap) {
        if (if1.c2(node).ay() > 1) {
            var d = 0.0;
            var d1 = 0.0;
            var d2 = 0.0;
            for (var edgecursor = node.ap(); edgecursor.i1(); edgecursor.i2()) {
                var edge = edgecursor.i8();
                var d3 = edgemap.i3(edge);
                if (d3 - d > d1) {
                    d1 = d3 - d;
                    d2 = (d + d3) / 2;
                }
                d = d3;
            }

            if (360 - d > d1)
                d2 = (360 + d) / 2;
            this.a6(if1, node, d2);
            for (var edgecursor1 = node.ap(); edgecursor1.i1(); edgecursor1.i2()) {
                var edge1 = edgecursor1.i8();
                var d4 = edgemap.i3(edge1);
                for (d4 -= d2; d4 < 0.0; d4 += 360)
                    ;
                edgemap.i6(edge1, d4);
            }

            node.av(function (edge, edge1) {
                var d = edgemap.i3(edge) - edgemap.i3(edge1);
                if (d > 0.0)
                    return 1;
                return d >= 0.0 ? 0 : -1;
            });
        }
    },
    a4: function (if1, node, ai, edgemap, nodemap) {
        var i = node.al();
        var d = nodemap.i3(node);
        for (var edgecursor = node.ap(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var edgelist = if1.b(edge);
            var d1 = 0.0;
            var d2 = 0.0;
            var d3 = 0.0;
            var d4 = 0.0;
            for (var edgecursor1 = edgelist.c1(); edgecursor1.i1(); edgecursor1.i2()) {
                var edge1 = edgecursor1.i8();
                var node1 = null;
                var node2 = null;
                if (ai[edge1.a2().al()] === i) {
                    node1 = edge1.a2();
                    node2 = edge1.a3();
                } else {
                    node1 = edge1.a3();
                    node2 = edge1.a2();
                }
                d3 -= this._jn.g5(node1);
                d4 += this._jn.g6(node1);
                d1 -= this._jn.g5(node2);
                d2 += this._jn.g6(node2);
            }

            if (d3 !== 0.0 || d4 !== 0.0) {
                var d5;
                for (d5 = Math.atan2(d4, d3) * 180.0 / Math.PI - d; d5 < 0.0; d5 += 360)
                    ;
                edgemap.i6(edge, d5);
            }
            if (d1 !== 0.0 && d2 !== 0.0) {
                var d6 = Math.atan2(d2, d1) * 180.0 / Math.PI;
                if (d6 < 0.0)
                    d6 += 360;
                nodemap.i6(edge.a3(), d6);
            }
            this.a4(if1, edge.a3(), ai, edgemap, nodemap);
        }
    },
    a5: function (if1, node, nodemap) {
        var ypoint = if1.g4(node);
        for (var edgecursor = node.ap(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var node1 = edge.a3();
            var ypoint1 = if1.g4(node1);
            var d = ypoint1.x - ypoint.x;
            var d1 = ypoint1.y - ypoint.y;
            var d2 = Math.atan2(d1, d) * 180.0 / Math.PI;
            if (nodemap.i1(node1) != null) {
                var d3 = nodemap.i3(node1);
                d2 += d3;
            }
            this.a6(if1, node1, d2);
            this.a5(if1, node1, nodemap);
        }
    },
    a6: function (if1, node, d) {
        d = d / 180.0 * Math.PI;
        var nodelist = if1.c2(node);
        if (nodelist.ay() <= 1)
            return;
        for (var nodecursor = nodelist.x1(); nodecursor.i1(); nodecursor.i2()) {
            var node1 = nodecursor.i9();
            var d1 = this._jn.g5(node1);
            var d2 = this._jn.g6(node1);
            var d3 = Math.cos(d);
            var d4 = Math.sin(d);
            var d5 = d1 * d3 - d4 * d2;
            var d6 = d1 * d4 + d3 * d2;
            this._jn.s2(node1, d5, d6);
        }
    }
});
