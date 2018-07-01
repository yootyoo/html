var $A68 = function () {
    $A68.superClass.constructor.call(this);
    this._jo = 30;
    this._jp = new $A76();
    this._jt = 5;
};
_twaver.ext($A68, $A67, {
    i4: function (layoutgraph) {
        return true;
    },
    i3: function (layoutgraph) {
        this._ju = layoutgraph;
        $A83.c(layoutgraph);
        var nodecursor = this._jp.i1(layoutgraph);
        var d = 0.0;
        for (var nodecursor1 = layoutgraph.x9(); nodecursor1.i1(); nodecursor1.i2())
            d = Math.max(d, this.e(nodecursor1.i9()));

        if (d < this._jt)
            d = this._jt;
        this.a(nodecursor, d);
    },
    a: function (nodecursor, d) {
        var i = nodecursor.i7();
        var d1 = 2 * Math.PI / i;
        var d4 = 0.0;
        var ad = $A53.a(i);
        nodecursor.i4();
        for (var j = 0; j < i; ) {
            ad[j] = this.e(nodecursor.i9()) + this._jo;
            d4 += ad[j];
            j++;
            nodecursor.i2();
        }

        var d5 = d4 / i;
        var d3 = d4 / (Math.PI * 2);
        if (d3 < d)
            d3 = d;
        nodecursor.i4();
        var d6 = 0.0;
        for (var k = 0; k < i; ) {
            var d2 = (d1 / d5) * ad[k];
            d6 += d2 / 2;
            var d7 = Math.cos(d6) * d3;
            var d8 = Math.sin(d6) * d3;
            d6 += d2 / 2;
            this._ju.s2(nodecursor.i9(), d7, d8);
            k++;
            nodecursor.i2();
        }
        return d3;
    },
    e: function (node) {
        var d = this._ju.gj(node);
        var d1 = this._ju.g9(node);
        return d <= d1 ? d1 : d;
    }
});
