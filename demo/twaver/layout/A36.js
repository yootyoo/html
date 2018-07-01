var $A36 = function (node) {
    this._j = 0;
    this._h = node;
    this.i4();
};
_twaver.ext($A36, Object, {
    i2: function () {
        this._k = this._k._k[this._j];
        if (this._k == null && this._j === 0) {
            this._k = this._h._o[1];
            this._j = 1;
        }
    },
    i3: function () {
        this._k = this._k._f[this._j];
        if (this._k == null && this._j === 1) {
            this._k = this._h._q[0];
            this._j = 0;
        }
    },
    i4: function () {
        this._k = this._h._o[0];
        if (this._k == null) {
            this._k = this._h._o[1];
            this._j = 1;
        } else {
            this._j = 0;
        }
    },
    i5: function () {
        this._k = this._h._q[1];
        if (this._k == null) {
            this._k = this._h._q[0];
            this._j = 0;
        } else {
            this._j = 1;
        }
    },
    i1: function () {
        return this._k != null;
    },
    i6: function () {
        return this._k;
    },
    i8: function () {
        return this._k;
    },
    i7: function () {
        return this._h.ad();
    }
});
