var $A52 = function () {
    $A52.superClass.constructor.call(this);
    this._jv = 20;
    this._jw = 40;
    this._jx = function (a, b) {
        var node = a.a3();
        var node1 = b.a3();
        var layoutgraph = node._g;
        return Math.floor(100 * (layoutgraph.g5(node) - layoutgraph.g5(node1)));
    };
};
_twaver.ext($A52, $A67, {
    i4: function (layoutgraph) {
        return $A18.a1(layoutgraph);
    },
    i3: function (layoutgraph) {
        if (!this.i4(layoutgraph))
            throw 'Error';
        var edgelist = $A18.a3(layoutgraph);
        this._j2 = layoutgraph;
        this._j3 = new $A54(layoutgraph);
        $A83.c(layoutgraph);
        this._jy = layoutgraph.xk();
        if (!layoutgraph.xb()) {
            this.bu();
            var node = this._j3.c1();
            this.f(node);
            this.b(this._j3);
            this.c(this._j3);
        }
        var edge;
        for (; !edgelist.ar(); layoutgraph.x3(edge)) {
            edge = edgelist.c3();
            $A83.b(layoutgraph.g2(edge));
        }
    },
    bu: function () {
        if (this._jx != null) {
            for (var nodecursor = this._j2.x9(); nodecursor.i1(); nodecursor.i2())
                nodecursor.i9().av(this._jx);
        }
    },
    c: function (if1) {
        var aylist = this.a2(if1);
        var ad = $A53.a(aylist.length);
        for (var i = 0; i < aylist.length; i++) {
            var ylist = aylist[i];
            var d = 0.0;
            for (var ycursor = ylist.ah(); ycursor.i1(); ycursor.i2()) {
                var node = ycursor.i6();
                d = Math.max(d, this._j2.g9(node));
            }
            ad[i] = d;
        }
        var d1 = -this._jw;
        for (var j = 0; j < aylist.length; j++) {
            d1 += this._jw + ad[j];
            var ylist1 = aylist[j];
            for (var ycursor1 = ylist1.ah(); ycursor1.i1(); ycursor1.i2()) {
                var node1 = ycursor1.i6();
                this._j2.s2(node1, this._j2.g5(node1), d1 - ad[j] / 2);
            }
        }
    },
    a2: function (if1) {
        var aylist = $A53.d(if1.b());
        for (var i = 0, n = if1.b(); i < n; i++)
            aylist[i] = new $A35();

        if1.c1();
        this.a1(if1.c1(), 0, aylist);
        return aylist;
    },
    a1: function (node, i, aylist) {
        aylist[i].ae(node);
        for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2())
            this.a1(nodecursor.i9(), i + 1, aylist);
    },
    b: function (if1) {
        var node = if1.c1();
        this._j2.s2(node, 0.0, this._j2.g6(node));
        this.g(node);
    },
    g: function (node) {
        for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2()) {
            var node1 = nodecursor.i9();
            var _lif = this._jy.i1(node1);
            this._j2.s2(node1, this._j2.g5(node) + _lif._c, this._j2.g6(node1));
            this.g(node1);
        }
    },
    f: function (node) {
        if (this._j3.c2(node)) {
            this._jy.z1(node, new $A50(this, node));
            return;
        }
        var nodecursor = node.aw();
        var node1 = nodecursor.i9();
        nodecursor.i2();
        this.f(node1);
        var _lif1 = this._jy.i1(node1);
        var _lif = new $A50(this, _lif1._a, _lif1._b, 0.0);
        if (!nodecursor.i1()) {
            _lif._a.ac(new $A51(this._j2.gj(node) / 2, 0.0));
            _lif._b.ac(new $A51(this._j2.gj(node) / 2, 0.0));
            this._jy.z1(node, _lif);
            return;
        }
        while (nodecursor.i1()) {
            node1 = nodecursor.i9();
            nodecursor.i2();
            this.f(node1);
            _lif1 = this._jy.i1(node1);
            var ycursor = _lif._b.ah();
            var ycursor1 = _lif1._a.ah();
            var d1 = 2147483647;
            var d2 = 0.0;
            var d3 = 0.0;
            while (ycursor.i1() && ycursor1.i1()) {
                var _la4 = ycursor.i6();
                ycursor.i2();
                var _la = ycursor1.i6();
                ycursor1.i2();
                d3 += _la4._a;
                d2 += _la._a;
                d1 = Math.min(d1, d2 - d3 - _la4._b - _la._b);
            }
            _lif1._c = this._jv - d1;
            d2 += _lif1._c;
            var _la1 = _lif1._b.am();
            _la1._a = _lif1._c;
            if (ycursor.i1() && !ycursor1.i1()) {
                for (var d4 = d3 - this.a3(_lif1._b); ycursor.i1(); d4 = 0.0) {
                    var _la5 = ycursor.i6();
                    ycursor.i2();
                    _lif1._b.ae(new $A51(_la5._b, _la5._a + d4));
                }

            } else if (!ycursor.i1() && ycursor1.i1()) {
                var d5 = this.a3(_lif._a);
                for (d5 = d2 - d5; ycursor1.i1(); d5 = 0.0) {
                    var _la2 = ycursor1.i6();
                    ycursor1.i2();
                    _lif._a.ae(new $A51(_la2._b, _la2._a + d5));
                }

            }
            _lif._b = _lif1._b;
        }
        this._jy.z1(node, _lif);
        var d = -_lif1._c / 2;
        for (var nodecursor1 = node.aw(); nodecursor1.i1(); ) {
            var node2 = nodecursor1.i9();
            nodecursor1.i2();
            var _lif2 = this._jy.i1(node2);
            _lif2._c += d;
            var _la3 = _lif2._b.am();
            _la3._a += d;
            _la3 = _lif2._a.am();
            _la3._a += d;
        }

        _lif._a.ac(new $A51(this._j2.gj(node) / 2, 0.0));
        _lif._b.ac(new $A51(this._j2.gj(node) / 2, 0.0));
    },
    a3: function (ylist) {
        var d = 0.0;
        for (var ycursor = ylist.ah(); ycursor.i1(); ycursor.i2()) {
            var _la = ycursor.i6();
            d += _la._a;
        }
        return d;
    }
});
