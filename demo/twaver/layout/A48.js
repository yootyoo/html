var $A48 = function () {
    this._g = arguments[0];
    this._f = this._g.xk();
    this._h = this._g.xk();
    this._d = new $A35();
    this._e = 0;
    if (arguments.length !== 1) {
        this.a(arguments[1], arguments[2], arguments[3], arguments[4]);
    }
};
_twaver.ext($A48, Object, {
    a: function (dataprovider, i, j, dataprovider1) {
        var anodelist = $A53.d((j - i) + 1);
        for (var k = i; k <= j; k++)
            anodelist[k] = new $A31(k);

        for (var nodecursor = this._g.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (dataprovider1 == null || dataprovider1.i4(node)) {
                this._f.z1(node, anodelist[dataprovider.i2(node) - i].ac(node));
                this._e++;
            }
        }

        for (var l = 0; l < anodelist.length; l++) {
            var nodelist = anodelist[l];
            var listcell = this._d.ae(nodelist);
            for (var nodecursor1 = nodelist.x1(); nodecursor1.i1(); nodecursor1.i2())
                this._h.z1(nodecursor1.i9(), listcell);

        }
    },
    c: function () {
        this._g.xi(this._h);
        this._g.xi(this._f);
    },
    e: function () {
        return this._e === 0;
    },
    g: function () {
        for (; this._d.am().ar(); this._d.at())
            ;
        this._e--;
        var node = this._d.am().x4();
        this._h.z1(node, null);
        this._f.z1(node, null);
        return node;
    },
    f: function () {
        for (; this._d.as().ar(); this._d.au())
            ;
        this._e--;
        var node = this._d.as().x4();
        this._h.z1(node, null);
        this._f.z1(node, null);
        return node;
    },
    d: function (node) {
        var listcell = this._f.i1(node);
        var listcell1 = this._h.i1(node);
        var _lif = listcell1.d();
        var obj = null;
        var listcell2 = listcell1.a();
        if (listcell2 != null) {
            obj = listcell2.d();
            this._h.z1(node, listcell2);
        } else {
            obj = new $A31(_lif._d + 1);
            this._h.z1(node, this._d.ae(obj));
        }
        _lif.aw(listcell);
        this._f.z1(node, obj.ac(node));
    },
    b: function (node) {
        var listcell = this._f.i1(node);
        var listcell1 = this._h.i1(node);
        var _lif = listcell1.d();
        var obj = null;
        var listcell2 = listcell1.b();
        if (listcell2 != null) {
            obj = listcell2.d();
            this._h.z1(node, listcell2);
        } else {
            obj = new $A31(_lif._d - 1);
            this._h.z1(node, this._d.ac(obj));
        }
        _lif.aw(listcell);
        this._f.z1(node, obj.ac(node));
    }
});
