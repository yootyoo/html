var $A09 = function (edgerealizer) {
    $A09.superClass.constructor.call(this, edgerealizer);
};
_twaver.ext($A09, $A08, {
    a5: function (edgerealizer) {
        return new $A09(edgerealizer);
    },
    a4: function (d, d1, bend) {
        var bend1 = new $A06(d, d1);
        this.ab(bend1, bend);
        return bend1;
    },
    ab: function (bend, bend1) {
        this._c.an(bend, this._c.al(bend1));
    }
});
