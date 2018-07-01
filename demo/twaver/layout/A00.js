var $A00 = function (x, y) {
    this.x = x;
    this.y = y;
};
_twaver.ext($A00, Object, {
    equals: function (obj) {
        if (this === obj)
            return true;
        if (!(obj instanceof $A00)) {
            return false;
        } else {
            return obj.x == this.x && obj.y == this.y;
        }
    }
});
