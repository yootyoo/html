var $A26 = function () {
    this._c = 0;
};
_twaver.ext($A26, Object, {
    a: function (entry) {
        this._c++;
        entry._b = this._b;
        entry._a = null;
        if (this._b != null) {
            this._b._a = entry;
            this._b = entry;
        } else {
            this._b = this._a = entry;
        }
    },
    b: function (entry, target) {
        if (target == null) {
            this.a(entry);
            return;
        }
        var if3 = target._b;
        if (if3 != null)
            if3._a = entry;
        else
            this._a = entry;
        entry._b = if3;
        entry._a = target;
        target._b = entry;

        this._c++;
    },
    c: function (entry) {
        var next = entry._a;
        var prev = entry._b;
        this._c--;
        if (next != null)
            next._b = prev;
        else
            this._b = prev;
        if (prev != null)
            prev._a = next;
        else
            this._a = next;
    }
});
