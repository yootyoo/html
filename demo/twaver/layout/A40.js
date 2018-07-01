var $A40 = function (i, j) {
    this._b = i;
    this._r = j;
    this._a = [];
    for (var k = this._b - 1; k >= 0; k--)
        this._a.push(k);

    this._c = new $List();
};
_twaver.ext($A40, Object, {
    a1: function (int1) {
        var i;
        if (this._a.length === 0) {
            this.a2(int1, this._b, this._b + this._r);
            for (var j = (this._b + this._r) - 1; j > this._b; j--)
                this._a.push(j);

            i = this._b;
            this._b += this._r;
        } else {
            i = this._a.pop();
        }
        return i;
    },
    b: function (int1) {
        var i = this.a1(int1);
        var do1 = new $A22(i, this);
        this._c.add(do1);
        this.a4(int1, i);
        return do1;
    },
    c: function (int1) {
        var i = this.a1(int1);
        var new1 = new $A23(i, this);
        this._c.add(new1);
        this.a4(int1, i);
        return new1;
    },
    a2: function (int1, i, j) {
        for (var if1 = int1._a; if1 != null; if1 = if1._a) {
            var aobj = $A53.d(j);
            $A53.f(if1._c, aobj, i);
            if1._c = aobj;
        }
    },
    a3: function (if1, i, j) {
        var aobj = $A53.d(j);
        $A53.f(if1._c, aobj, i);
        if1._c = aobj;
    },
    a4: function (int1, i) {
        for (var if1 = int1._a; if1 != null; if1 = if1._a)
            if1._c[i] = null;
    },
    a5: function (nodemap, int1) {
        if (nodemap instanceof $A22) {
            var do1 = nodemap;
            if (do1.c())
                throw 'Error';
            do1.d();
            var i = nodemap._i;
            if (this._a.indexOf(i) < 0) {
                this.a4(int1, i);
                this._a.push(i);
                this._c.remove(nodemap);
            }
        }
    },
    a6: function (edgemap, int1) {
        if (edgemap instanceof $A23) {
            var new1 = edgemap;
            if (new1.a())
                throw 'Error';
            new1.b();
            var i = new1._d;
            if (this._a.indexOf(i) < 0) {
                this.a4(int1, i);
                this._a.push(i);
                this._c.remove(edgemap);
            }
        }
    }
});
