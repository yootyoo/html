var $A67 = function () {
    this._cx = true;
    this._cs = new $A65();
    this._ct = new $A63();
    this._cw = new $A64();
};
_twaver.ext($A67, Object, {
    i5: function (flag) {
        this._cx = flag;
    },
    k: function () {
        var obj = new $A66(this);

        if (this._cx) {
            this._cs.w1(obj);
            obj = this._cs;
        }

        this._cw.w1(obj);
        obj = this._cw;

        this._ct.w1(obj);
        obj = this._ct;

        return obj;
    },
    i2: function (layoutgraph) {
        this.k().i2(layoutgraph);
    },
    i1: function (layoutgraph) {
        return this.k().i1(layoutgraph);
    }
});
