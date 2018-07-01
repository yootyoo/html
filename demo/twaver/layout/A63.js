var $A63 = function () {
    this._cg = 45;
    this._ce = 400;
    this._ch = 400;
    this._cf = 0;
};
_twaver.ext($A63, $A62, {
    i1: function (layoutgraph) {
        if (this.w2() != null) {
            var flag = true;
            var nodemap = layoutgraph.xk();
            var i = $A12.a3(layoutgraph, nodemap);
            var anodelist = $A53.d(i);
            var aedgelist = $A53.d(i);
            for (var j = 0; j < i; j++) {
                anodelist[j] = new $A46();
                aedgelist[j] = new $A25();
            }

            for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
                var edge = edgecursor.i8();
                aedgelist[nodemap.i2(edge.a2())].aa(edge);
                layoutgraph.h1(edge);
            }

            for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
                var node = nodecursor.i9();
                anodelist[nodemap.i2(node)].aa(node);
                layoutgraph.h2(nodecursor.i9());
            }

            for (var k = 0; k < i; k++) {
                for (var nodecursor1 = anodelist[k].x1(); nodecursor1.i1(); nodecursor1.i2())
                    layoutgraph.h3(nodecursor1.i9());

                for (var edgecursor1 = aedgelist[k].c1(); edgecursor1.i1(); edgecursor1.i2())
                    layoutgraph.u1(edgecursor1.i8());

                flag = this.w3(layoutgraph);
                for (var edgecursor2 = aedgelist[k].c1(); edgecursor2.i1(); edgecursor2.i2())
                    layoutgraph.h1(edgecursor2.i8());

                for (var nodecursor3 = anodelist[k].x1(); nodecursor3.i1(); nodecursor3.i2())
                    layoutgraph.h2(nodecursor3.i9());

                if (!flag)
                    break;
            }

            for (var l = 0; l < i; l++) {
                for (var nodecursor2 = anodelist[l].x1(); nodecursor2.i1(); nodecursor2.i2())
                    layoutgraph.h3(nodecursor2.i9());
            }

            for (var i1 = 0; i1 < i; i1++) {
                for (var edgecursor3 = aedgelist[i1].c1(); edgecursor3.i1(); edgecursor3.i2())
                    layoutgraph.u1(edgecursor3.i8());
            }

            layoutgraph.xi(nodemap);
            return flag;
        } else {
            return true;
        }
    },
    i2: function (layoutgraph) {
        if (layoutgraph.xb())
            return;
        var nodemap = layoutgraph.xk();
        var i = $A12.a3(layoutgraph, nodemap);
        var anodelist = $A53.d(i);
        var aedgelist = $A53.d(i);
        var ayrectangle = $A53.d(i);
        var arectangle2d = $A53.d(i);
        for (var j = 0; j < i; j++) {
            anodelist[j] = new $A46();
            aedgelist[j] = new $A25();
        }

        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            aedgelist[nodemap.i2(edge.a2())].aa(edge);
            layoutgraph.h1(edge);
        }

        for (var nodecursor = layoutgraph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            anodelist[nodemap.i2(node)].aa(node);
            layoutgraph.h2(nodecursor.i9());
        }

        for (var k = 0; k < i; k++) {
            for (var nodecursor1 = anodelist[k].x1(); nodecursor1.i1(); nodecursor1.i2())
                layoutgraph.h3(nodecursor1.i9());

            for (var edgecursor1 = aedgelist[k].c1(); edgecursor1.i1(); edgecursor1.i2())
                layoutgraph.u1(edgecursor1.i8());

            this.w4(layoutgraph);
            var rectangle = layoutgraph.g3();
            ayrectangle[k] = new $A03(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            var dd = {};
            arectangle2d[k] = dd;
            if (this._cf > 0.0) {
                var d = this._cg + Math.ceil((rectangle.width + 1.0) / this._cf) * this._cf;
                var d1 = this._cg + Math.ceil((rectangle.height + 1.0) / this._cf) * this._cf;
                dd.x = rectangle.x;
                dd.y = rectangle.y;
                dd.width = d;
                dd.height = d1;
            } else {
                dd.x = rectangle.x;
                dd.y = rectangle.y;
                dd.width = rectangle.width + this._cg;
                dd.height = rectangle.height + this._cg;
            }
            for (var edgecursor2 = aedgelist[k].c1(); edgecursor2.i1(); edgecursor2.i2())
                layoutgraph.h1(edgecursor2.i8());

            for (var nodecursor3 = anodelist[k].x1(); nodecursor3.i1(); nodecursor3.i2())
                layoutgraph.h2(nodecursor3.i9());
        }

        for (var l = 0; l < i; l++) {
            for (var nodecursor2 = anodelist[l].x1(); nodecursor2.i1(); nodecursor2.i2())
                layoutgraph.h3(nodecursor2.i9());
        }

        for (var i1 = 0; i1 < i; i1++) {
            for (var edgecursor3 = aedgelist[i1].c1(); edgecursor3.i1(); edgecursor3.i2())
                layoutgraph.u1(edgecursor3.i8());
        }

        $A83.a(arectangle2d, null, this._ce / this._ch);
        if (this._cf <= 0.0) {
            for (var j1 = 0; j1 < arectangle2d.length; j1++)
                this.w5(layoutgraph, anodelist[j1], aedgelist[j1], new $A00(arectangle2d[j1].x, arectangle2d[j1].y), ayrectangle[j1]);
        } else {
            for (var k1 = 0; k1 < arectangle2d.length; k1++) {
                var d2 = Math.floor((arectangle2d[k1].x - ayrectangle[k1].x) / this._cf) * this._cf;
                var d3 = Math.floor((arectangle2d[k1].y - ayrectangle[k1].y) / this._cf) * this._cf;
                var d4 = ayrectangle[k1].x + d2;
                var d5 = ayrectangle[k1].y + d3;
                this.w5(layoutgraph, anodelist[k1], aedgelist[k1], new $A00(d4, d5), ayrectangle[k1]);
            }

        }
        layoutgraph.xi(nodemap);
    },
    w5: function (layoutgraph, nodelist, edgelist, ypoint, yrectangle) {
        var d = -yrectangle.x + ypoint.x;
        var d1 = -yrectangle.y + ypoint.y;
        for (var nodecursor = nodelist.x1(); nodecursor.i1(); nodecursor.i2()) {
            var ypoint1 = layoutgraph.ga(nodecursor.i9());
            layoutgraph.s4(nodecursor.i9(), new $A00(ypoint1.x + d, ypoint1.y + d1));
        }

        for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            var vector = new $List();
            for (var ycursor = layoutgraph.gp(edge).c(); ycursor.i1(); ycursor.i2()) {
                var ypoint2 = ycursor.i6();
                vector.add(new $A00(ypoint2.x + d, ypoint2.y + d1));
            }

            layoutgraph.s5(edge, new $A05(vector));
        }
    }
});
