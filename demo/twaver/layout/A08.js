var $A08 = function (edgerealizer) {
    this._c = new $A35();
    if (edgerealizer) {
        this.ac(edgerealizer.a8().b());
        this.ad(edgerealizer.a9().b());
    } else {
        this.ac(new $A07());
        this.ad(new $A07());
    }
};
_twaver.ext($A08, Object, {
    a6: function () {
        return this.a5(this);
    },
    ac: function (port) {
        port.a(this);
        this._a = port;
    },
    ad: function (port) {
        port.a(this);
        this._b = port;
    },
    a8: function () {
        return this._a;
    },
    a9: function () {
        return this._b;
    },
    a1: function (d1, d2) {
        return this.a4(d1, d2, this.aa());
    },
    a2: function () {
        return this._c.ay();
    },
    a7: function (i1) {
        return this._c.ak(i1);
    },
    aa: function () {
        if (this._c.ay() === 0)
            return null;
        else
            return this._c.as();
    },
    a3: function () {
        this._c.af();
    },
    i2: function (i1) {
        var bend = this.a7(i1);
        if (bend != null)
            return new $A00(bend.x, bend.y);
        else
            return null;
    },
    i1: function () {
        return this.a2();
    },
    i6: function () {
        var port = this.a8();
        return new $A00(port.c(), port.d());
    },
    i7: function () {
        var port = this.a9();
        return new $A00(port.c(), port.d());
    },
    i8: function (ypoint) {
        this.a8().f(ypoint.x, ypoint.y);
    },
    i9: function (ypoint) {
        this.a9().f(ypoint.x, ypoint.y);
    },
    i3: function (i1, d1, d2) {
        var bend = this.a7(i1);
        if (bend != null)
            bend.a(d1, d2);
    },
    i4: function (d1, d2) {
        this.a1(d1, d2);
    },
    i5: function () {
        this.a3();
    }
});
