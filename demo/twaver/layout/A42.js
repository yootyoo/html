var $A42 = function (node, i) {
    $A42.superClass.constructor.call(this, node, i);
    this._h = i !== 1 ? 1 : 0;
};
_twaver.ext($A42, $A27, {
    i6: function () {
        return this.i9();
    },
    i9: function () {
        return this._h !== 0 ? this._o._e : this._o._d;
    }
});
