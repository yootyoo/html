var $A71 = function () {
    this._a = new Date().getTime();
};
_twaver.ext($A71, Object, {
    b: function () {
        return new Date().getTime() - this._a;
    }
});
