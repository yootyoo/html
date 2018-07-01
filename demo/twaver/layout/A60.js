var $A60 = function () {
    $A60.superClass.constructor.call(this);
    this._kq = false;
    this._kp = 90;
};
_twaver.ext($A60, $A57, {
    a: function (edgemap, nodemap) {
        this._kr = nodemap;
        this._ks = edgemap;
        this._kq = true;
    },
    i7: function (node) {
        if (!this.u(node)) {
            $A60.superClass.i7.call(this, node);
            return;
        }
        var d = this.i9();
        var d1 = this.ib(node);
        var d2 = (360 - d1) / 2 + d1;
        var edgelist = new $A25(node.ap());
        do {
            var d3 = this.i6(node);
            d3 = (360 - d1) / 2;
            var listcell = null;
            var nodeinfo = null;
            for (var listcell1 = edgelist._b; listcell1 != null; listcell1 = listcell1.a()) {
                var edge = listcell1.d();
                var node1 = edge.a3();
                var nodeinfo1 = this.i0(node1);
                var d6 = this._ks.i3(edge);
                var d7 = d6 - (d3 + nodeinfo1._e);
                if (d7 >= 0.0 && d6 + nodeinfo1._d >= d2)
                    if (d3 + nodeinfo1.a() <= d2)
                        d7 = d2 - d3 - nodeinfo1.a();
                    else
                        d7 = 2 * (d2 - (d6 + nodeinfo1._d));
                nodeinfo1._f = 0.0;
                if (d7 >= 0.0) {
                    nodeinfo1._f = d7;
                    listcell = listcell1;
                    nodeinfo = nodeinfo1;
                } else {
                    if (-d7 > nodeinfo1._d + nodeinfo1._e)
                        d7 = (nodeinfo1._d + nodeinfo1._e) / 2;
                    else
                        d7 /= -2;
                    d3 -= d7;
                    if (d3 <= d2 && d3 + nodeinfo1.a() > d2) {
                        d3 += d7;
                        d7 = (d3 + nodeinfo1.a()) - d2;
                        d3 -= d7;
                    }
                    for (; listcell != null && d7 > nodeinfo._f; nodeinfo = this.i0(listcell.d().a3())) {
                        d7 -= nodeinfo._f;
                        nodeinfo._f = 0.0;
                        listcell = listcell.b();
                        if (listcell != null)
                            continue;
                        nodeinfo = null;
                        break;
                    }
                    if (listcell != null)
                        nodeinfo._f -= d7;
                    else
                        d3 += d7;
                }
                d3 += nodeinfo1.a();
            }
            if (d3 <= d2) {
                var d5 = 0.0;
                var d4 = (360 - d1) / 2;
                for (var edgecursor = node.ap(); edgecursor.i1(); edgecursor.i2()) {
                    var edge1 = edgecursor.i8();
                    var node3 = edge1.a3();
                    var d8 = this._ks.i3(edge1);
                    var nodeinfo2 = this.i0(node3);
                    var d9 = d4 + nodeinfo2._f + nodeinfo2._e;
                    if (d5 < Math.abs(d9 - d8))
                        d5 = Math.abs(d9 - d8);
                    d4 += nodeinfo2.a();
                }
                if (d5 <= this._kp)
                    break;
            }
            for (var nodecursor = node.aw(); nodecursor.i1(); nodecursor.i2()) {
                var node2 = nodecursor.i9();
                this.i0(node2)._g *= 1.0 + d;
            }
        } while (true);
    },
    ib: function (node) {
        if (!this.u(node))
            return $A60.superClass.ib.call(this, node);
        if (node.ak() === 0)
            return this.ic();
        else
            return this.ia();
    },
    u: function (node) {
        if (!this._kq || node.ao() === 0)
            return false;
        else
            return this._ks.i1(node.ag()) != null;
    }
});
