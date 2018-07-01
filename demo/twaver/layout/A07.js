var $A07 = function (d, d1) {
    this.x = d || 0;
    this.y = d1 || 0;
};
_twaver.ext($A07, Object, {
    b: function () {
        return new $A07(this.x, this.y);
    },
    a: function (edgerealizer) {
        this.z = edgerealizer;
    },
    c: function () {
        return this.x;
    },
    d: function () {
        return this.y;
    },
    f: function (d, d1) {
        this.x = d;
        this.y = d1;
    }
});
