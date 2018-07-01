twaver.PropertyPropagator = function (dataBox, propertyName, propertyType) {
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
        this._setter = _twaver.setter(propertyName);
    }
    this._enable = false;
    this._isPropagating = false;
};
_twaver.ext('twaver.PropertyPropagator', Object, {
    getDataBox: function () {
        return this._dataBox;
    },
    getPropertyType: function () {
        return this._propertyType;
    },
    getPropertyName: function () {
        return this._propertyName;
    },
    isEnable: function () {
        return this._enable
    },
    setEnable: function (enable) {
        if (this._enable === enable) {
            return;
        }
        this._enable = enable;
        if (this._enable) {
            this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange, this);
            this._dataBox.addDataPropertyChangeListener(this.handleDataPropertyChange, this);
            this._dataBox.forEach(function (data) {
                this.propagate(data);
            }, this);
        } else {
            this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this);
            this._dataBox.removeDataPropertyChangeListener(this.handleDataPropertyChange, this);
        }
    },
    handleDataBoxChange: function (e) {
        if (e.data) {
            this.propagate(e.data);
        }
    },
    handleDataPropertyChange: function (e) {
        if (this.isInterestedProperty(e)) {
            this.propagate(e.source);
        }
        else if (e.property === "parent") {
            var oldParent = e.oldValue;
            if (oldParent) {
                this.propagate(oldParent);
            }
            this.propagate(e.source);
        }
    },
    isInterestedProperty: function (e) {
        if (this._propertyType === 'accessor' && this._propertyName === e.property) {
            return true;
        }
        else if (this._propertyType === 'style' && e.IElement && 'S:' + this._propertyName === e.property) {
            return true;
        }
        else if (this._propertyType === 'client' && 'C:' + this._propertyName === e.property) {
            return true;
        }
        return false;
    },
    propagate: function (data) {
        if (!data || this._isPropagating) {
            return;
        }
        this._isPropagating = true;
        this.propagateToTop(data);
        this._isPropagating = false;
    },
    propagateToTop: function (data) {
        this.propagateToParent(null, data);
        while (data && data.getParent()) {
            this.propagateToParent(data, data.getParent());
            data = data.getParent();
        }
    },
    propagateToParent: function (child, parent) {

    }
});
