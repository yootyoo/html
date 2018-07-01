twaver.EventDispatcher = function () {
}
_twaver.ext('twaver.EventDispatcher', null, {
    contains: function (l, s) {
        if (this._ls) {
            for (var i = 0, n = this._ls.size(), o; i < n; i++) {
                o = this._ls.get(i);
                if (l === o.l && s === o.s) {
                    return true;
                }
            }
        }
        return false;
    },
    add: function (l, s, a) {
        var o = { l: l, s: s, a: a };
        if (!this._ls) {
            this._ls = new $List();
        }
        if (this._f) {
            if (!this._addPendings) {
                this._addPendings = new $List();
            }
            this._addPendings.add(o);
        } else {
            if (o.a) {
                this._ls.add(o, 0);
            } else {
                this._ls.add(o);
            }
        }
    },
    remove: function (l, s) {
        if (this._ls) {
            if (this._f) {
                if (!this._removePendings) {
                    this._removePendings = new $List();
                }
                this._removePendings.add({ l: l, s: s });
            } else {
                this._remove(l, s);
            }
        }
    },
    _remove: function (l, s) {
        for (var i = 0, n = this._ls.size(), o; i < n; i++) {
            o = this._ls.get(i);
            if (o.l === l && o.s === s) {
                this._ls.removeAt(i);
                return;
            }
        }
    },
    fire: function (e) {
        if (this._ls) {
            var i, n = this._ls.size(), o;
            this._f = true;
            for (i = 0; i < n; i++) {
                o = this._ls.get(i);
                if (o.s) {
                    o.l.call(o.s, e);
                } else {
                    o.l(e);
                }
            }
            this._f = false;

            if (this._removePendings) {
                n = this._removePendings.size();
                for (i = 0; i < n; i++) {
                    o = this._removePendings.get(i);
                    this._remove(o.l, o.s);
                }
                delete this._removePendings;
            }
            if (this._addPendings) {
                n = this._addPendings.size();
                for (i = 0; i < n; i++) {
                    o = this._addPendings.get(i);
                    if (o.a) {
                        this._ls.add(o, 0);
                    } else {
                        this._ls.add(o);
                    }
                }
                delete this._addPendings;
            }
        }
    }
});
