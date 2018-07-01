var $A93 = function () {
    this._m1 = 20;
    this._m2 = 60;
    this._m3 = 5;
    this._m4 = 0.0;
};
_twaver.ext($A93, Object, {
    i4: function (d) {
        this._m3 = d;
    },
    i5: function (d) {
        this._m4 = d;
    },
    i3: function (d) {
        this._m1 = d;
    },
    i6: function (d) {
        this._m2 = d;
    },
    i2: function (nodemap) {
        this._m5 = nodemap;
    },
    t1: function () {
        return this._m2;
    },
    a1: function (layoutgraph, anodelist) {
        var anodecursor = $A53.d(anodelist.length);
        for (var i = 0; i < anodelist.length; i++)
            anodecursor[i] = anodelist[i].x1();

        this.a2(layoutgraph, anodecursor);
    },
    a2: function (layoutgraph, anodecursor) {
        var ad = $A53.a(anodecursor.length);
        var d = 0.0;
        for (var i = 0; i < anodecursor.length; i++) {
            var d1 = 0.0;
            var nodecursor = anodecursor[i];
            nodecursor.i4();
            for (; nodecursor.i1(); nodecursor.i2())
                d1 = Math.max(d1, layoutgraph.g9(nodecursor.i9()));

            ad[i] = d1;
            nodecursor.i4();
            for (; nodecursor.i1(); nodecursor.i2()) {
                var d2 = (ad[i] - layoutgraph.g9(nodecursor.i9())) / 2;
                layoutgraph.s4(nodecursor.i9(), new $A00(layoutgraph.gi(nodecursor.i9()), d + d2));
            }
            var d3 = this.t1();
            d += ad[i] + d3;
            nodecursor.i4();
        }
    },
    i1: function (layoutgraph, anodelist, dataprovider) {
        this._m6 = layoutgraph;
        this.t2(anodelist, dataprovider);
    }
});
