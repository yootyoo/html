var $extend = {
    __accessor: function (p, o) {
        var ps = o['__accessor'];
        var n = ps.length;
        for (var i = 0; i < n; i++) {
            _twaver.ip(p, ps[i]);
        }
    },
    __bool: function (p, o) {
        var bs = o['__bool'];
        var n = bs.length;
        for (var i = 0; i < n; i++) {
            _twaver.ibool(p, bs[i]);
        }
    },
    __client: function (p, o) {
        p.getClient = function (clientProp) {
            return this._clientMap[clientProp];
        };
        p.setClient = function (clientProp, newValue) {
            var oldValue = this._clientMap[clientProp];
            if (newValue == null) {
                delete this._clientMap[clientProp];
            } else {
                this._clientMap[clientProp] = newValue;
            }
            if (this.firePropertyChange('C:' + clientProp, oldValue, newValue)) {
                this.onClientChanged(clientProp, oldValue, newValue);
            }
            return this;
        };
        p.getClientProperties = function () {
            return _twaver.keys(this._clientMap);
        };
        p.getClientMap = function () {
            return this._clientMap;
        };
        p.onClientChanged = function (clientProp, oldValue, newValue) {
        };
    },
    __style: function (p, o) {
        p.getStyle = function (styleProp, returnDefaultIfNull) {
            var value = this._styleMap[styleProp];
            if (returnDefaultIfNull === undefined) {
                returnDefaultIfNull = true;
            }
            if (value == null && returnDefaultIfNull) {
                return twaver.Styles.getStyle(styleProp);
            } else {
                return value;
            }
        };
        p.setStyle = function (styleProp, newValue) {
            var oldValue = this._styleMap[styleProp];
            if (newValue == null) {
                delete this._styleMap[styleProp];
            } else {
                this._styleMap[styleProp] = newValue;
            }
            if (this.firePropertyChange('S:' + styleProp, oldValue, newValue)) {
                this.onStyleChanged(styleProp, oldValue, newValue);
            }
            return this;
        };
        p.getStyleProperties = function () {
            return _twaver.keys(this._styleMap);
        };
        p.onStyleChanged = function (styleProp, oldValue, newValue) {
        };
    },
    __new: function (p, o) {
        p.newInstance = function () {
            var clazz = _twaver.getClass(this.getClassName());
            if (!clazz) {
                return null;
            }
            var len = arguments.length;
            var args = arguments;
            if (len === 0) {
                return new clazz();
            } else if (len === 1) {
                return new clazz(args[0]);
            } else if (len === 2) {
                return new clazz(args[0], args[1]);
            } else if (len === 3) {
                return new clazz(args[0], args[1], args[2]);
            } else if (len === 4) {
                return new clazz(args[0], args[1], args[2], args[3]);
            } else if (len === 5) {
                return new clazz(args[0], args[1], args[2], args[3], args[4]);
            } else if (len === 6) {
                return new clazz(args[0], args[1], args[2], args[3], args[4], args[5]);
            } else if (len === 7) {
                return new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            throw "don't support args more than 7";
        };
    },
    __property: function (p, o) {
        p.getValue = function (data, view) {
            if (this._propertyType === 'accessor') {
                return _twaver.getValue(data, this._propertyName);
            }
            else if (this._propertyType === 'style' && data.getStyle) {
                return data.getStyle(this._propertyName);
            }
            else if (this._propertyType === 'client' && data.getClient) {
                return data.getClient(this._propertyName);
            }
            else if (this._propertyType === 'field') {
                return data[this._propertyName];
            }
            return null;
        };
        p.setValue = function (data, value, view) {
            if (this._propertyType === 'accessor') {
                data[_twaver.setter(this._propertyName)](value);
            }
            else if (this._propertyType === 'style' && data.setStyle) {
                return data.setStyle(this._propertyName, value);
            }
            else if (this._propertyType === 'client' && data.setClient) {
                return data.setClient(this._propertyName, value);
            }
            else if (this._propertyType === 'field') {
                data[this._propertyName] = value;
            }
        };
    },
    map: {
        __accessor: 1,
        __bool: 1,
        __client: 1,
        __style: 1,
        __new: 1,
        __tree: 1,
        __property: 1
    },
    ext: function (name, p, o) {
        if ($extend.map[name] === 1) {
            $extend[name](p, o);
        } else {
            p[name] = o[name];
        }
    }
};
_twaver.extend = $extend;
