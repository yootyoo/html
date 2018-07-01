twaver.Data = function (id) {
    twaver.Data.superClass.constructor.apply(this, arguments);
    this._childList = new $List();
    this._childMap = {};
    this._clientMap = {};
    if (id === undefined || id === null) {
        this._id = _twaver.id();
    } else if (typeof id === 'string' || typeof id === 'number' || typeof id === 'boolean') {
        this._id = id;
    } else {
        for (var property in id) {
            if (property === 'clients') {
                for (var client in id.clients) {
                    this._clientMap[client] = id.clients[client];
                }
            } else if (property === 'styles') {
                for (var style in id.styles) {
                    this._styleMap[style] = id.styles[style];
                }
            } else {
                 if (id[property] != null) property === 'id' ? (this._id = id[property]) : this[_twaver.setter(property)](id[property]);
            }
        }
        if (this._id == null) this._id = _twaver.id();
    }
};
_twaver.ext('twaver.Data', twaver.PropertyChangeDispatcher, {
    IData: true,
    IClient: true,
    __client: 1,
    __new: 1,
    _parent: null,
    __accessor: ['name','name2','icon', 'toolTip'],
    _icon: $Defaults.ICON_DATA,
    getId: function () {
        return this._id;
    },
    getChildren: function () {
        return this._childList;
    },
    getChildrenSize: function () {
        return this._childList.size();
    },
    toChildren: function (matchFunction, scope) {
        return this._childList.toList(matchFunction, scope);
    },
    addChild: function (child, index) {
        if (index === undefined) {
            index = this._childList.size();
        }
        if (!child || child === this) {
            return false;
        }
        if (this._childMap[child.getId()]) {
            return false;
        }
        if (this.isDescendantOf(child)) {
            return false;
        }
        if (child.getParent()) {
            child.getParent().removeChild(child);
        }
        if (index < 0 || index > this._childList.size()) {
            index = this._childList.size();
        }
        this._childList.add(child, index);
        this._childMap[child._id] = child;
        child.setParent(this);

        this.firePropertyChange('children', null, child);
        this.onChildAdded(child, index);
        return true;
    },
    onChildAdded: function (child, index) {

    },
    removeChild: function (child) {
        if (!child) {
            return false;
        }
        if (!this._childMap[child._id]) {
            return false;
        }
        var index = this._childList.remove(child);
        delete this._childMap[child._id];

        this.firePropertyChange('children', child, null);
        child.setParent(null);

        this.onChildRemoved(child, index);
        return true;
    },
    onChildRemoved: function (child, index) {

    },
    getChildAt: function (index) {
        return this._childList.get(index);
    },
    clearChildren: function () {
        if (this._childList.size() === 0) {
            return false;
        }
        var children = this._childList.toArray();
        var n = children.length;
        for (var i = 0; i < n; i++) {
            this.removeChild(children[i]);
        }
        this.onChildrenCleared(children);
        return true;
    },
    onChildrenCleared: function (children) {

    },
    getParent: function () {
        return this._parent;
    },
    setParent: function (parent) {
        if (this._isUpdatingParent || this._parent === parent || this === parent) {
            return;
        }
        // if parent is descendant of me, return
        if (parent && parent.isDescendantOf(this)) {
            return;
        }

        var oldValue = this._parent;
        this._parent = parent;

        this._isUpdatingParent = true;

        //remove from old parent.
        if (oldValue) {
            oldValue.removeChild(this);
        }
        if (parent) {
            parent.addChild(this);
        }

        delete this._isUpdatingParent;

        //fire event.
        this.firePropertyChange("parent", oldValue, parent);

        this.onParentChanged(oldValue, parent);
    },
    onParentChanged: function (oldParent, parent) {
    },
    hasChildren: function () {
        return this._childList.size() > 0;
    },
    isRelatedTo: function (data) {
        if (!data) {
            return false;
        }
        return this.isDescendantOf(data) || data.isDescendantOf(this);
    },
    isParentOf: function (data) {
        if (!data) {
            return false;
        }
        return this._childMap[data._id] != null;
    },
    isDescendantOf: function (data) {
        if (!data) {
            return false;
        }
        if (!data.hasChildren()) {
            return false;
        }
        var tempParent = this._parent;
        while (tempParent) {
            if (data === tempParent) {
                return true;
            } else {
                tempParent = tempParent.getParent();
            }
        }
        return false;
    },
    toString: function () {
        if (this.getName()) {
            return this.getName();
        }
        return this._id;
    }
});
