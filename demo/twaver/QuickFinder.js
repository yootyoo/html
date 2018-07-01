twaver.QuickFinder = function (dataBox, propertyName, propertyType, valueFunction, filterFunction) {
    this._map = {};
    if (!dataBox) {
        throw "dataBox can not be null";
    }
    if (!propertyName) {
        throw "propertyName can not be null";
    }
    this._dataBox = dataBox;
    this._propertyName = propertyName;
    this._propertyType = propertyType || 'accessor';
    if (this._propertyType === 'accessor') {
        this._getter = _twaver.getter(propertyName);
    }
    this._valueFunction = valueFunction || this.getValue;
    this._filterFunction = filterFunction || this.isInterested;
    this._dataBox.forEach(this._addData, this);
    this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange, this, true);
    this._dataBox.addDataPropertyChangeListener(this.handleDataPropertyChange, this, true);
};
_twaver.ext('twaver.QuickFinder', Object, {
    _NULL_: 'twaver-null-key',
    getValueFunction: function () {
        return this._valueFunction;
    },
    getFilterFunction: function () {
        return this._filterFunction;
    },
    handleDataBoxChange: function (e) {
        if (e.kind === 'add') {
            this._addData(e.data);
        }
        else if (e.kind === 'remove') {
            this._removeData(e.data);
        }
        else if (e.kind === 'clear') {
            this._map = {};
        }
    },
    handleDataPropertyChange: function (e) {
        if (!this._filterFunction.call(this, e.source)) {
            return;
        }
        if (this._propertyType === 'accessor' && this._propertyName === e.property) {
            // property change
        }
        else if (this._propertyType === 'style' && e.source.IStyle && 'S:' + this._propertyName === e.property) {
            // style change
        }
        else if (this._propertyType === 'client' && 'C:' + this._propertyName === e.property) {
            // client change
        }
        else {
            return; // do nothing
        }
        var list = this._getMap(e.oldValue);
        if (list) {
            list.remove(e.source);
        }
        this._addData(e.source);
    },
    _getMap: function (key) {
        key = key == null ? this._NULL_ : key;
        return this._map[key];
    },
    find: function (value) {
        var list = this._getMap(value);
        return list ? list.toList() : new $List();
    },
    findFirst: function (value) {
        var list = this._getMap(value);
        return (!list || list.isEmpty()) ? null : list.get(0);
    },
    _addData: function (data) {
        if (!this._filterFunction.call(this, data)) {
            return;
        }
        var value = this._valueFunction.call(this, data);
        var list = this._getMap(value);
        if (!list) {
            list = new $List();
            value = value == null ? this._NULL_ : value;
            this._map[value] = list;
        }
        list.add(data);
    },
    _removeData: function (data) {
        if (!this._filterFunction.call(this, data)) {
            return;
        }
        var value = this._valueFunction.call(this, data);
        var list = this._getMap(value);
        if (list) {
            list.remove(data);
            if (list.isEmpty()) {
                value = value == null ? this._NULL_ : value;
                delete this._map[value];
            }
        }
    },
    dispose: function () {
        this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this);
        this._dataBox.removeDataPropertyChangeListener(this.handleDataPropertyChange, this);
        delete this._dataBox;
    },
    getDataBox: function () {
        return this._dataBox;
    },
    getPropertyType: function () {
        return this._propertyType;
    },
    getPropertyName: function () {
        return this._propertyName;
    },
    isInterested: function (data) {
        if (this._propertyType === 'style' && !data.IStyle) {
            return false;
        }
        if (this._propertyType === 'accessor' && this._valueFunction === this.getValue && !data[this._getter]) {
            return false;
        }
        return true;
    },
    getValue: function (data) {
        if (this._propertyType === 'accessor') {
            return data[this._getter]();
        }
        else if (this._propertyType === 'style' && data.getStyle) {
            return data.getStyle(this._propertyName);
        }
        else if (this._propertyType === 'client' && data.getClient) {
            return data.getClient(this._propertyName);
        }
        return null;
    }
});
