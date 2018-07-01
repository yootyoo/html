var $A95 = function (layoutgraph, a1) {
    this._b = 20;
    this._a = a1;
    this._d = layoutgraph;
    this._f = {};
};
_twaver.ext($A95, Object, {
    a3: function (d1) {
        this._b = d1;
    },
    a4: function (node, i, j, k, l) {
        if (this.a2(node)) {
            var _lif = this.b2(node);
            _lif._o = i;
            _lif._m = l;
            _lif._n = k;
            _lif._f = j;
        }
    },
    b2: function (node) {
        var _lif = this._f[node._id];
        if (_lif == null) {
            _lif = new $A74();
            this._f[node._id] = _lif;
        }
        return _lif;
    },
    a2: function (node) {
        return this._f[node._id] != null;
    },
    c: function () {
        var nodemap = $A49.a1($A53.a(this._d.xa()));
        var nodemap1 = $A49.a1($A53.a(this._d.xa()));
        for (var nodecursor = this._d.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (this.a2(node)) {
                var _lif = this.b2(node);
                nodemap.i6(node, this._b * (_lif.c() - 1));
                nodemap1.i6(node, this._b * (_lif.b() - 1));
            }
        }
        this._d.x1("D", nodemap);
        this._d.x1("C", nodemap1);
    },
    g: function () {
        this._d.x6("D");
        this._d.x6("C");
    },
    f: function () {
        for (var nodecursor = this._d.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (this.a2(node)) {
                var d1 = this._d.gi(node);
                var d2 = this._d.gh(node);
                var d3 = this._d.gj(node);
                var d4 = this._d.g9(node);
                var _lif = this.b2(node);
                var i = _lif._q.ay() + _lif._b.ay() + _lif._f;
                var j = _lif._d.ay() + _lif._g.ay() + _lif._o;
                var k = _lif._i.ay() + _lif._l.ay() + _lif._n;
                var l = _lif._h.ay() + _lif._k.ay() + _lif._m;
                var d5 = this._a.a7(d3, i);
                var d6 = this._a.a7(d3, j);
                var d7 = this._a.a7(d4, l);
                var d8 = this._a.a7(d4, k);
                _lif.a2(this._a.a8(d3, i, d5), this._a.a8(d3, j, d6), this._a.a8(d4, l, d7), this._a.a8(d4, k, d8));
                for (var edgecursor = _lif._j.c1(); edgecursor.i1(); edgecursor.i2()) {
                    var edge = edgecursor.i8();
                    var portconstraint = this.a1(edge);
                    var portconstraint1 = this.b1(edge);
                    var ylist = new $A35();
                    if (portconstraint.b() === portconstraint1.b()) {
                        if (portconstraint.c()) {
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2));
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2 - this._b));
                            _lif._g._bd++;
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2 - this._b));
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2));
                            _lif._g._bd++;
                            _lif._g._bc = Math.max(_lif._g._bc, 2);
                        } else if (portconstraint.d()) {
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4));
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4 + this._b));
                            _lif._b._bd++;
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4 + this._b));
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4));
                            _lif._b._bd++;
                            _lif._b._bc = Math.max(_lif._b._bc, 2);
                        } else if (portconstraint.f()) {
                            ylist.aa(new $A00(d1, d2 + _lif._i._bd * d8 + _lif._a));
                            ylist.aa(new $A00(d1 - this._b, d2 + _lif._i._bd * d8 + _lif._a));
                            _lif._i._bd++;
                            ylist.aa(new $A00(d1 - this._b, d2 + _lif._i._bd * d8 + _lif._a));
                            ylist.aa(new $A00(d1, d2 + _lif._i._bd * d8 + _lif._a));
                            _lif._i._bd++;
                            _lif._i._bc = Math.max(_lif._i._bc, 2);
                        } else if (portconstraint.e()) {
                            ylist.aa(new $A00(d1 + d3, d2 + _lif._h._bd * d7 + _lif._e));
                            ylist.aa(new $A00(d1 + d3 + this._b, d2 + _lif._h._bd * d7 + _lif._e));
                            _lif._h._bd++;
                            ylist.aa(new $A00(d1 + d3 + this._b, d2 + _lif._h._bd * d7 + _lif._e));
                            ylist.aa(new $A00(d1 + d3, d2 + _lif._h._bd * d7 + _lif._e));
                            _lif._h._bd++;
                            _lif._h._bc = Math.max(_lif._h._bc, 2);
                        }
                        this._d.m1(edge, ylist);
                    } else if (portconstraint.c() || portconstraint1.c()) {
                        if (portconstraint.e() || portconstraint1.e()) {
                            ylist.aa(new $A00((d1 + d3) - _lif._d._bd * d6 - _lif._c, d2));
                            ylist.aa(new $A00((d1 + d3) - _lif._d._bd * d6 - _lif._c, d2 - this._b * _lif._d._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif._h._bc, d2 - this._b * _lif._d._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif._h._bc, d2 + _lif._h._bd * d7 + _lif._e));
                            ylist.aa(new $A00(d1 + d3, d2 + _lif._h._bd * d7 + _lif._e));
                            _lif._d._bd++;
                            _lif._d._bc++;
                            _lif._h._bd++;
                            _lif._h._bc++;
                            if (portconstraint1.c())
                                ylist.ax();
                            this._d.m1(edge, ylist);
                        } else if (portconstraint.f() || portconstraint1.f()) {
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2));
                            ylist.aa(new $A00(d1 + _lif._g._bd * d6 + _lif._c, d2 - this._b * _lif._g._bc));
                            ylist.aa(new $A00(d1 - this._b * _lif._i._bc, d2 - this._b * _lif._g._bc));
                            ylist.aa(new $A00(d1 - this._b * _lif._i._bc, d2 + _lif._i._bd * d8 + _lif._a));
                            ylist.aa(new $A00(d1, d2 + _lif._i._bd * d8 + _lif._a));
                            _lif._g._bd++;
                            _lif._g._bc++;
                            _lif._i._bd++;
                            _lif._i._bc++;
                            if (portconstraint1.c())
                                ylist.ax();
                            this._d.m1(edge, ylist);
                        } else if (portconstraint.d() || portconstraint1.d()) {
                            ylist.aa(new $A00((d1 + d3) - _lif._d._bd * d6 - _lif._c, d2));
                            ylist.aa(new $A00((d1 + d3) - _lif._d._bd * d6 - _lif._c, d2 - this._b * _lif._d._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif.b(), d2 - this._b * _lif._d._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif.b(), d2 + d4 + this._b * _lif._q._bc));
                            ylist.aa(new $A00((d1 + d3) - _lif._q._bd * d5 - _lif._p, d2 + d4 + this._b * _lif._q._bc));
                            ylist.aa(new $A00((d1 + d3) - _lif._q._bd * d5 - _lif._p, d2 + d4));
                            _lif._d._bd++;
                            _lif._d._bc++;
                            _lif._k._bc++;
                            _lif._h._bc++;
                            _lif._q._bc++;
                            _lif._q._bd++;
                            if (portconstraint1.c())
                                ylist.ax();
                            this._d.m1(edge, ylist);
                        }
                    } else if (portconstraint.d() || portconstraint1.d()) {
                        if (portconstraint.e() || portconstraint1.e()) {
                            ylist.aa(new $A00((d1 + d3) - _lif._q._bd * d5 - _lif._p, d2 + d4));
                            ylist.aa(new $A00((d1 + d3) - _lif._q._bd * d5 - _lif._p, d2 + d4 + this._b * _lif._q._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif._k._bc, d2 + d4 + this._b * _lif._q._bc));
                            ylist.aa(new $A00(d1 + d3 + this._b * _lif._k._bc, (d2 + d4) - _lif._k._bd * d7 - _lif._e));
                            ylist.aa(new $A00(d1 + d3, (d2 + d4) - _lif._k._bd * d7 - _lif._e));
                            _lif._q._bd++;
                            _lif._q._bc++;
                            _lif._k._bd++;
                            _lif._k._bc++;
                            if (portconstraint1.d())
                                ylist.ax();
                            this._d.m1(edge, ylist);
                        } else if (portconstraint.f() || portconstraint1.f()) {
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4));
                            ylist.aa(new $A00(d1 + _lif._b._bd * d5 + _lif._p, d2 + d4 + this._b * _lif._b._bc));
                            ylist.aa(new $A00(d1 - this._b * _lif._l._bc, d2 + d4 + this._b * _lif._b._bc));
                            ylist.aa(new $A00(d1 - this._b * _lif._l._bc, (d2 + d4) - _lif._l._bd * d8 - _lif._a));
                            ylist.aa(new $A00(d1, (d2 + d4) - _lif._l._bd * d8 - _lif._a));
                            _lif._b._bd++;
                            _lif._b._bc++;
                            _lif._l._bd++;
                            _lif._l._bc++;
                            if (portconstraint1.d())
                                ylist.ax();
                            this._d.m1(edge, ylist);
                        }
                    } else {
                        ylist.aa(new $A00(d1, (d2 + d4) - _lif._l._bd * d8 - _lif._a));
                        ylist.aa(new $A00(d1 - this._b * _lif._l._bc, (d2 + d4) - _lif._l._bd * d8 - _lif._a));
                        ylist.aa(new $A00(d1 - this._b * _lif._l._bc, d2 + d4 + this._b * _lif.a1()));
                        ylist.aa(new $A00(d1 + d3 + this._b * _lif._k._bc, d2 + d4 + this._b * _lif.a1()));
                        ylist.aa(new $A00(d1 + d3 + this._b * _lif._k._bc, (d2 + d4) - _lif._k._bd * d7 - _lif._e));
                        ylist.aa(new $A00(d1 + d3, (d2 + d4) - _lif._k._bd * d7 - _lif._e));
                        _lif._l._bd++;
                        _lif._l._bc++;
                        _lif._b._bc++;
                        _lif._q._bc++;
                        _lif._k._bc++;
                        _lif._k._bd++;
                        if (portconstraint1.f())
                            ylist.ax();
                        this._d.m1(edge, ylist);
                    }
                }
            }
        }
    },
    a5: function (anodelist, afor) {
        for (var i = 0; i < anodelist.length; i++) {
            var nodelist = anodelist[i];
            var for1 = afor[i];
            for (var nodecursor = nodelist.x1(); nodecursor.i1(); nodecursor.i2()) {
                var node = nodecursor.i9();
                if (this.a2(node)) {
                    var _lif = this.b2(node);
                    for1._g = Math.max(for1._g, this._b * (_lif.d() - 1));
                    for1._j = Math.max(for1._j, this._b * (_lif.a1() - 1));
                }
            }
        }
    },
    a1: function (edge) {
        var dataprovider = this._d.xc("A");
        var portconstraint = null;
        if (dataprovider != null)
            portconstraint = dataprovider.i1(edge);
        if (portconstraint == null || portconstraint.g()) {
            var dataprovider1 = this._d.xc("B");
            if (dataprovider1 == null)
                return $A84.j(1);
            var portconstraint1 = dataprovider1.i1(edge);
            if (portconstraint1 == null || portconstraint1.g())
                return $A84.j(1);
            if (portconstraint1.c())
                return $A84.j(8);
            if (portconstraint1.f())
                return $A84.j(1);
            if (portconstraint1.d())
                return $A84.j(4);
            if (portconstraint1.e())
                return $A84.j(2);
        }
        return portconstraint;
    },
    b1: function (edge) {
        var dataprovider = this._d.xc("B");
        var portconstraint = null;
        if (dataprovider != null)
            portconstraint = dataprovider.i1(edge);
        if (portconstraint == null || portconstraint.g()) {
            var dataprovider1 = this._d.xc("A");
            if (dataprovider1 == null)
                return $A84.j(8);
            var portconstraint1 = dataprovider1.i1(edge);
            if (portconstraint1 == null || portconstraint1.g())
                return $A84.j(8);
            if (portconstraint1.c())
                return $A84.j(8);
            if (portconstraint1.f())
                return $A84.j(1);
            if (portconstraint1.d())
                return $A84.j(4);
            if (portconstraint1.e())
                return $A84.j(2);
        }
        return portconstraint;
    }
});
