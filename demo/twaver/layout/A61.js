var $A61 = function (dataprovider) {
    this._a = dataprovider;
};
_twaver.ext($A61, Object, {
    i1: function (obj) {
        return this._a.i1(obj);
    },
    i2: function (obj) {
        throw 'Error';
    },
    i3: function (obj) {
        throw 'Error';
    },
    i4: function (obj) {
        throw 'Error';
    }
});
