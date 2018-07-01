var $A35 = function (ycursor) {
    this._id = _twaver.id();
    this._a = 0;
    if (ycursor) {
        ycursor.i4();
        for (; ycursor.i1(); ycursor.i2())
            this.ae(ycursor.i6());
    }
};
_twaver.ext($A35, Object, {
    ac: function (obj) {
        var listcell = this.ag(obj);
        if (this._b == null) {
            this._b = this._c = listcell;
        } else {
            this._b._b = listcell;
            listcell._a = this._b;
            this._b = listcell;
        }
        this._a++;
        return listcell;
    },
    ae: function (obj) {
        var listcell = this.ag(obj);
        if (this._c == null) {
            this._b = this._c = listcell;
        } else {
            this._c._a = listcell;
            listcell._b = this._c;
            this._c = listcell;
        }
        this._a++;
        return listcell;
    },
    z1: function (listcell) {
        listcell._b = null;
        listcell._a = null;
        if (this._c == null) {
            this._b = this._c = listcell;
        } else {
            this._c._a = listcell;
            listcell._b = this._c;
            this._c = listcell;
        }
        this._a++;
    },
    ad: function (listcell) {
        listcell._b = null;
        listcell._a = null;
        if (this._b == null) {
            this._b = this._c = listcell;
        } else {
            this._b._b = listcell;
            listcell._a = this._b;
            this._b = listcell;
        }
        this._a++;
    },
    aa: function (obj) {
        this.ae(obj);
        return true;
    },
    ab: function (ycursor) {
        for (; ycursor.i1(); ycursor.i2())
            this.ae(ycursor.i6());
    },
    ao: function (obj, listcell) {
        if (listcell === this._b)
            return this.ac(obj);
        if (listcell == null) {
            return this.ae(obj);
        } else {
            var listcell1 = this.ag(obj);
            this.aq(listcell1, listcell);
            return listcell1;
        }
    },
    aq: function (listcell, listcell1) {
        if (listcell1 == null)
            this.ad(listcell);
        else if (listcell1 === this._b) {
            this.ad(listcell);
        } else {
            if (this._c == null) {
                listcell._b = null;
                listcell._a = null;
                this._b = this._c = listcell;
            } else {
                var listcell2 = listcell1._b;
                listcell1._b = listcell;
                listcell._a = listcell1;
                listcell2._a = listcell;
                listcell._b = listcell2;
            }
            this._a++;
        }
    },
    ap: function (listcell, listcell1) {
        if (listcell1 == null)
            this.z1(listcell);
        else if (listcell1 === this._c) {
            this.z1(listcell);
        } else {
            if (this._b == null) {
                listcell._b = null;
                listcell._a = null;
                this._b = this._c = listcell;
            } else {
                var listcell2 = listcell1._a;
                listcell1._a = listcell;
                listcell._a = listcell2;
                listcell2._b = listcell;
                listcell._b = listcell1;
            }
            this._a++;
        }
    },
    an: function (obj, listcell) {
        if (listcell === this._c)
            return this.ae(obj);
        if (listcell == null) {
            return this.ac(obj);
        } else {
            var listcell1 = this.ag(obj);
            this.ap(listcell1, listcell);
            return listcell1;
        }
    },
    ay: function () {
        return this._a;
    },
    ar: function () {
        return this._a === 0;
    },
    af: function () {
        this._b = this._c = null;
        this._a = 0;
    },
    am: function () {
        return this._b._c;
    },
    at: function () {
        var obj = this.am();
        this.aw(this._b);
        return obj;
    },
    as: function () {
        return this._c._c;
    },
    au: function () {
        return this.aw(this._c);
    },
    ak: function (i) {
        var j = 0;
        for (var listcell = this._b; listcell != null; ) {
            if (i === j)
                return listcell._c;
            listcell = listcell._a;
            j++;
        }
        return null;
    },
    aj: function (listcell) {
        if (listcell._a == null)
            return this._b;
        else
            return listcell._a;
    },
    ai: function (listcell) {
        if (listcell._b == null)
            return this._c;
        else
            return listcell._b;
    },
    aw: function (listcell) {
        if (listcell !== this._b)
            listcell._b._a = listcell._a;
        else
            this._b = listcell._a;
        if (listcell !== this._c)
            listcell._a._b = listcell._b;
        else
            this._c = listcell._b;
        this._a--;
        return listcell._c;
    },
    av: function (ycursor) {
        return this.aw(ycursor._aa);
    },
    ah: function () {
        return new $A32(this);
    },
    al: function (obj) {
        var listcell = this._b;
        while (listcell != null) {
            if (listcell._c == null && obj == null) {
                return listcell;
            }
            if (listcell._c === obj) {
                return listcell;
            }
            listcell = listcell._a;
        }
        return null;
    },
    a0: function () {
        var aobj = $A53.d(this._a);
        var i = 0;
        for (var listcell = this._b; listcell != null; ) {
            aobj[i] = listcell._c;
            listcell = listcell._a;
            i++;
        }
        return aobj;
    },
    ax: function () {
        for (var listcell2 = this._b; listcell2 != null; listcell2 = listcell2._b) {
            var listcell = listcell2._a;
            listcell2._a = listcell2._b;
            listcell2._b = listcell;
        }

        var listcell1 = this._b;
        this._b = this._c;
        this._c = listcell1;
    },
    a1: function (comparator) {
        var aobj = this.a0();
        aobj.sort(comparator);
        var i = 0;
        for (var listcell = this._b; listcell != null; ) {
            listcell._c = aobj[i];
            listcell = listcell._a;
            i++;
        }
    },
    a2: function () {
        var aobj = this.a0();
        aobj.sort($A53.c);
        var i = 0;
        for (var listcell = this._b; listcell != null; ) {
            listcell._c = aobj[i];
            listcell = listcell._a;
            i++;
        }
    },
    az: function (ylist) {
        if (this._b == null) {
            this._b = ylist._b;
            this._c = ylist._c;
        } else if (ylist._b != null) {
            this._c._a = ylist._b;
            ylist._b._b = this._c;
            this._c = ylist._c;
        }
        this._a += ylist._a;
        ylist._b = ylist._c = null;
        ylist._a = 0;
    },
    ag: function (obj) {
        return new $A28(obj);
    }
});
