var $A59 = function (nodemap) {
    this._a = nodemap;
};
_twaver.ext($A59, Object, {
    i2: function (obj) {
        var i = 0;
        for (var nodecursor = obj.an(); nodecursor.i1(); nodecursor.i2())
            if (this._a.i1(nodecursor.i9()) != null)
                i++;

        return i;
    },
    i4: function (obj) {
        return this._a.i1(obj) == null;
    },
    i1: function (obj) {
        throw 'Error';
    },
    i3: function (obj) {
        throw 'Error';
    }
});
