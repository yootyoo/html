twaver.PropertyChangeDispatcher = function () {
    this._dispatcher = new twaver.EventDispatcher();
};
_twaver.ext('twaver.PropertyChangeDispatcher', Object, {
    addPropertyChangeListener: function (listener, scope, ahead) {
        this._dispatcher.add(listener, scope, ahead);
    },
    removePropertyChangeListener: function (listener, scope) {
        this._dispatcher.remove(listener, scope);
    },
    firePropertyChange: function (property, oldValue, newValue) {
        if (oldValue == newValue) {
            return false;
        }
        var e = {
            property: property,
            oldValue: oldValue,
            newValue: newValue,
            source: this
        };
        this._dispatcher.fire(e);
        this.onPropertyChanged(e);
        return true;
    },
    onPropertyChanged: function (e) {
    }
});

