var $List = function () {
    this._as = [];
    if (arguments.length === 1) {
        var v = arguments[0];
        if (v instanceof $List) {
            v = v._as;
        }
        if (v instanceof Array) {
            var n = v.length;
            for (var i = 0; i < n; i++) {
                this._as.push(v[i]);
            }
        } else if (v === false) {
            this._duplicatable = false;
            this._map = {};
        } else if (v != null) {
            this._as.push(v);
        }
    } else if (arguments.length > 1) {
        n = arguments.length;
        for (i = 0; i < n; i++) {
            this._as.push(arguments[i]);
        }
    }
};
twaver.List = $List;
_twaver.ext('twaver.List', Object, {
    _duplicatable: true,
    size: function () {
        return this._as.length;
    },
    isEmpty: function () {
        return this._as.length === 0;
    },
    add: function (item, index) {
        if (!this._duplicatable) {
            if (this._map[item._id]) {
                return;
            } else {
                this._map[item._id] = true;
            }
        }
        if (index === undefined) {
            return this._as.push(item);
        } else {
            return this._as.splice(index, 0, item);
        }
    },
    addAll: function (array) {
        if (array instanceof $List) {
            array = array._as;
        }
        if (array instanceof Array) {
            var n = array.length;
            for (var i = 0; i < n; i++) {
                this.add(array[i]);
            }
        } else {
            this.add(array);
        }
    },
    get: function (index) {
        return this._as[index];
    },
    remove: function (item) {
        if (!this._duplicatable && !this._map[item && item._id]) {
            return -1;
        }
        var index = this._as.indexOf(item);
        if (index >= 0 && index < this._as.length) {
            this.removeAt(index);
        }
        return index;
    },
    removeAt: function (index) {
        var item = this._as.splice(index, 1)[0];
        if (!this._duplicatable && item) {
            delete this._map[item._id];
        }
        return item;
    },
    set: function (index, item) {
        var oldItem = this._as[index];
        if (oldItem === item) {
            return item;
        }
        if (!this._duplicatable) {
            if (this._map[item._id]) {
                throw 'duplicate item:' + item;
            }
            delete this._map[oldItem._id];
            this._map[item._id] = true;
        }
        this._as[index] = item;
        return oldItem;
    },
    clear: function () {
        if (!this._duplicatable) {
            this._map = {};
        }
        return this._as.splice(0, this._as.length);
    },
    contains: function (item) {
        if (this._duplicatable) {
            return this.indexOf(item) >= 0;
        } else {
            return !!this._map[item && item._id];
        }
    },
    indexOf: function (item) {
        return this._as.indexOf(item);
    },
    forEach: function (f, scope) {
        var n = this._as.length;
        for (var i = 0; i < n; i++) {
            var e = this._as[i];
            if (scope) {
                f.call(scope, e)
            } else {
                f(e);
            }
        }
    },
    forEachReverse: function (f, scope) {
        var n = this._as.length;
        for (var i = n - 1; i >= 0; i--) {
            var e = this._as[i];
            if (scope) {
                f.call(scope, e)
            } else {
                f(e);
            }
        }
    },
    toArray: function (matchFunction, scope) {
        if (matchFunction) {
            var list = [];
            var n = this._as.length;
            for (var i = 0; i < n; i++) {
                var e = this._as[i];
                if (scope) {
                    if (matchFunction.call(scope, e)) {
                        list.push(e);
                    }
                } else {
                    if (matchFunction(e)) {
                        list.push(e);
                    }
                }
            }
            return list;
        } else {
            return this._as.concat();
        }
    },
    toList: function (matchFunction, scope) {
        if (matchFunction) {
            var list = new $List();
            var n = this._as.length;
            for (var i = 0; i < n; i++) {
                var e = this._as[i];
                if (scope) {
                    if (matchFunction.call(scope, e)) {
                        list.add(e);
                    }
                } else {
                    if (matchFunction(e)) {
                        list.add(e);
                    }
                }
            }
            return list;
        } else {
            return new $List(this);
        }
    },
    sort: function (sortFunction) {
        if (sortFunction) {
            this._as.sort(sortFunction);
        } else {
            this._as.sort();
        }
        return this;
    },
    toString: function () {
        return this._as.toString();
    }
});
