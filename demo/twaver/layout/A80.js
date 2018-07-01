var $A80 = function () {
    $A80.superClass.constructor.call(this);
    this._ap = this.xk();
    this._as = this.xl();
};
_twaver.ext($A80, $A78, {
    g1: function (node) {
        var nodelayout = this._ap.i1(node);
        if (nodelayout == null) {
            nodelayout = new $A38();
            this._ap.z1(node, nodelayout);
        }
        return nodelayout;
    },
    g2: function (edge) {
        var edgelayout = this._as.i1(edge);
        if (edgelayout == null) {
            edgelayout = new $A37();
            this._as.i8(edge, edgelayout);
        }
        return edgelayout;
    }
});
