var $A87 = function () {
    $A87.superClass.constructor.call(this);
    this._dj = 0;
    this._dh = 0;
    this._dq = 0;
    this._dp = 0;
    this._dt = 0;
    this._de = 0;
    this._d3 = 0;
    this._dr = 0;
    this._ed = 0;
    this._dw = 0.65;
    this._ea = 1;
    this._dl = 80;
    this._dx = 3;
    this._d8 = true;
    this._eb = 300000;
    this._ee = 2.0;
    this._di = 2;
    this._df = 1000;
};
_twaver.ext($A87, $A67, {
    i4: function (layoutgraph) {
        return true;
    },
    i3: function (layoutgraph) {
        if (layoutgraph == null)
            return;
        this._d5 = layoutgraph;
        if (!this.s(layoutgraph))
            return;
        var _lif = new $A86();
        var l = 0;
        var l1 = Math.floor(this._dx * (this._dz.length * this._dz.length) + (20 * this._dz.length));
        l1 = Math.max(l1, 10000);
        var d10 = this._ea * this._ea * this._dz.length;
        var i1 = this._df;
        try {
            for (; this._dj > d10 && l < l1; l++) {
                var _la = this.b(l & 0x7fffffff);
                if (i1-- === 0) {
                    if (this._dy.b() > this._eb)
                        l = l1;
                    i1 = this._df;
                }

                this.h(_la, _lif);
                this.d(_la, _lif);
                this.i(_la, _lif);

                if (this._d8) {
                    this.g(_la, _lif);
                    this.j(_la, _lif);
                } else {
                    this.f(_la, _lif);
                    this.c(_la, _lif);
                }
                var d11 = Math.sqrt(_lif._a * _lif._a + _lif._c * _lif._c + _lif._b * _lif._b);
                this.ac(_la, _lif, d11);
                this.aa(_la, _lif, d11);
            }
        }catch(ex){
        } finally {
            this.r();
        }
    },
    s: function (layoutgraph) {
        if (layoutgraph == null || layoutgraph.xa() < 1)
            return false;
        this._d5 = layoutgraph;
        this._dp = 1;
        this._dy = new $A71();
        this._dt = layoutgraph.x0();
        this._d2 = $A53.d(this._dt);
        this._df = 1 + 0x186a0 / this._dt;
        this._ed = 1.0 / (2 * this._di);
        this._de = (this._ed * this._ee) / (this._dl * 0.050000000000000003);
        this._d3 = Math.pow(this._dl, -1) * this._ed;
        this._dr = Math.pow(this._dl, 3) * this._ed;
        this._dj = 0.0;
        this._du = new $A86();
        this._dq = Math.max(20 * this._dl, 10);
        var d10 = Math.max(0.10000000000000001, Math.min(this._dw * this._dl, this._dq));
        var l = this._dt;

        $A83.c(layoutgraph);

        this._dz = $A53.d(l);
        for (var nodecursor2 = layoutgraph.x9(); nodecursor2.i1(); nodecursor2.i2()) {
            var node2 = nodecursor2.i9();
            var _la = new $A85(node2, d10, this._dl, this._dt, layoutgraph);
            this._dz[--l] = _la;

            this._dj += _la._r;
            this._dh += (_la._r * _la._r);
            this._du._a += _la._k;
            this._du._c += _la._h;
            this._du._b += _la._g;
            this._d2[node2.al()] = _la;
        }

        this._d8 = false;
        return this._dz.length > 0;
    },
    b: function (l) {
        var i1 = this._dz.length;
        var j1 = i1 - l % i1 - 1;
        var k1 = $A72.k(j1 + 1);
        var _la = this._dz[k1];
        this._dz[k1] = this._dz[j1];
        this._dz[j1] = _la;
        return _la;
    },
    f: function (_pa, _pif) {
        var d11;
        var d12;
        var d10 = d11 = d12 = 0.0;
        for (var edge = _pa._b.ae(); edge != null; edge = edge.a7()) {
            var _la = this._d2[edge.a2().al()];
            var d15 = _la._k - _pa._k;
            var d17 = _la._h - _pa._h;
            var d19 = _la._g - _pa._g;
            var d13 = d15 * d15 + d17 * d17 + d19 * d19;
            var d21;
            var d23 = Math.sqrt(d13);
            var d25 = d23 - (_la._e + _pa._e);
            if (d25 <= 0.0)
                continue;
            d21 = (d25 * d25 * this._d3) / d23;

            d10 += d15 * d21;
            d11 += d17 * d21;
            d12 += d19 * d21;
        }

        for (var edge1 = _pa._b.ag(); edge1 != null; edge1 = edge1.a8()) {
            var _la1 = this._d2[edge1.a3().al()];
            var d16 = _la1._k - _pa._k;
            var d18 = _la1._h - _pa._h;
            var d20 = _la1._g - _pa._g;
            var d14 = d16 * d16 + d18 * d18 + d20 * d20;
            var d22;

            var d24 = Math.sqrt(d14);
            var d26 = d24 - (_la1._e + _pa._e);
            if (d26 <= 0.0)
                continue;
            d22 = (d26 * d26 * this._d3) / d24;

            d10 += d16 * d22;
            d11 += d18 * d22;
            d12 += d20 * d22;
        }

        _pif._a += d10;
        _pif._c += d11;
        _pif._b += d12;
    },
    g: function (_pa, _pif) {
        var d11;
        var d12;
        var d10 = d11 = d12 = 0.0;
        this._dp++;
        _pa._f = this._dp;
        for (var edge = _pa._b.ae(); edge != null; edge = edge.a7()) {
            var _la = this._d2[edge.a2().al()];
            _la._f = this._dp;
            var d13 = _la._k - _pa._k;
            var d15 = _la._h - _pa._h;
            var d17 = _la._g - _pa._g;
            var d19 = d13 * d13 + d15 * d15 + d17 * d17;
            var d23 = Math.sqrt(d19);
            if (d23 !== 0.0) {
                var d25 = Math.max(9.9999999999999995E-007, d23 - (_pa._e + _la._e));
                var d21 = -this._ef[edge.a5()] / (d25 * d25);
                d21 += d25 * d25 * this._d1[edge.a5()];
                d21 /= d23;
                d10 += d13 * d21;
                d11 += d15 * d21;
                d12 += d17 * d21;
            }
        }

        for (var edge1 = _pa._b.ag(); edge1 != null; edge1 = edge1.a8()) {
            var _la1 = this._d2[edge1.a3().al()];
            _la1._f = this._dp;
            var d14 = _la1._k - _pa._k;
            var d16 = _la1._h - _pa._h;
            var d18 = _la1._g - _pa._g;
            var d20 = d14 * d14 + d16 * d16 + d18 * d18;
            var d24 = Math.sqrt(d20);
            if (d24 !== 0.0) {
                var d26 = Math.max(9.9999999999999995E-007, d24 - (_pa._e + _la1._e));
                var d22 = -this._ef[edge1.a5()] / (d26 * d26);
                d22 += d26 * d26 * this._d1[edge1.a5()];
                d22 /= d24;
                d10 += d14 * d22;
                d11 += d16 * d22;
                d12 += d18 * d22;
            }
        }

        _pif._a += d10;
        _pif._c += d11;
        _pif._b += d12;
    },
    j: function (_pa, _pif) {
        var d11;
        var d12;
        var d10 = d11 = d12 = 0.0;
        for (var l = this._dt - 1; l >= 0; l--) {
            var _la = this._d2[l];
            if (_la._f !== _pa._f) {
                var d13 = _pa._k - _la._k;
                var d14 = _pa._h - _la._h;
                var d15 = _pa._g - _la._g;
                var d16 = d13 * d13 + d14 * d14 + d15 * d15;
                if (d16 !== 0.0) {
                    var d18 = Math.sqrt(d16);
                    var d19 = Math.max(9.9999999999999995E-007, d18 - (_pa._e + _la._e));

                    var d17 = this._dr / (d19 * d19 * d18);
                    d10 += d13 * d17;
                    d11 += d14 * d17;
                    d12 += d15 * d17;
                }
            }
        }

        _pif._a += d10;
        _pif._c += d11;
        _pif._b += d12;
    },
    c: function (_pa, _pif) {
        var d15;
        var d16;
        var d14 = d15 = d16 = 0.0;
        for (var l = this._dt - 1; l >= 0; l--) {
            var _la = this._d2[l];
            var d10 = _pa._k - _la._k;
            var d11 = _pa._h - _la._h;
            var d12 = _pa._g - _la._g;
            var d13 = d10 * d10 + d11 * d11 + d12 * d12;
            if (d13 !== 0.0) {
                var d18 = Math.sqrt(d13);
                var d17;
                var d19 = d18 - (_pa._e + _la._e);
                if (d19 <= 0.0)
                    d17 = this._dr / (1E-008 * d18);
                else
                    d17 = this._dr / (d19 * d19 * d18);

                d14 += d10 * d17;
                d15 += d11 * d17;
                d16 += d12 * d17;
            }
        }

        _pif._a += d14;
        _pif._c += d15;
        _pif._b += d16;
    },
    i: function (_pa, _pif) {
        var d10 = this._du._b / this._dt - _pa._g;
        _pif._b += (d10 * this._dl * this._dt) / this._dh;
    },
    d: function (_pa, _pif) {
        if (this._de !== 0.0) {
            var d10 = this._du._a / this._dt - _pa._k;
            var d11 = this._du._c / this._dt - _pa._h;
            var d12 = this._du._b / this._dt - _pa._g;
            _pif._a += d10 * this._de;
            _pif._c += d11 * this._de;
            _pif._b += d12 * this._de;
        }
    },
    h: function (_pa, _pif) {
        var d10 = 0.05 * (_pa._r + 2);
        if (d10 > 0.0) {
            _pif._a = $A72.l(-d10, d10);
            _pif._c = $A72.l(-d10, d10);
            _pif._b = $A72.l(-d10, d10);
        }
    },
    ac: function (_pa, _pif, d10) {
        if (d10 !== 0.0 && _pa._a !== 0.0) {
            var d13 = _pif._a * _pa._o + _pif._c * _pa._l + _pif._b * _pa._i;
            var d12 = d13 / (d10 * _pa._a);
            this._dh -= _pa._r * _pa._r;
            this._dj -= _pa._r;
            if (_pa._p * d12 > 0.0)
                _pa._r += d12 * 0.45000000000000001;
            else
                _pa._r += d12 * 0.14999999999999999;
            if (_pa._r > this._dq)
                _pa._r = this._dq;
            else if (_pa._r < 0.10000000000000001)
                _pa._r = 0.10000000000000001;
            this._dj += _pa._r;
            this._dh += _pa._r * _pa._r;
            _pa._p = d12;
        }
    },
    aa: function (_pa, _pif, d10) {
        if (d10 > 0.0) {
            var d11 = _pa._r / d10;
            var d12 = _pif._a * d11;
            var d13 = _pif._c * d11;
            var d14 = _pif._b * d11;
            _pa._k += d12;
            _pa._h += d13;
            _pa._g += d14;
            this._du._a += d12;
            this._du._c += d13;
            this._du._b += d14;
            _pa._a = d10;
            _pa._o = _pif._a;
            _pa._l = _pif._c;
            _pa._i = _pif._b;
        }
    },
    r: function () {
        for (var l = this._d2.length - 1; l >= 0; l--) {
            var _la = this._d2[l];
            this._d5.s2(_la._b, _la._k, _la._h);
        }
    }
});
