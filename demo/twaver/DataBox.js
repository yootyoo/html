twaver.DataBox = function (name) {
    twaver.DataBox.superClass.constructor.apply(this, arguments);
    if (arguments.length === 1) {
        this._name = name;
    }
    this._dataList = new $List();
    this._dataMap = {};
    this._rootList = new $List();
    this._rootMap = {};
    this._clientMap = {};

    this._dataBoxChangeDispatcher = new twaver.EventDispatcher();
    this._dataPropertyChangeDispatcher = new twaver.EventDispatcher();
    this._hierarchyChangeDispatcher = new twaver.EventDispatcher();

    this._selectionModel = new twaver.SelectionModel(this);

};
_twaver.ext('twaver.DataBox', twaver.PropertyChangeDispatcher, {
    IClient: true,
    __client: 1,
    __new: 1,
    _limit: -1,
    _name: 'DataBox',
    _icon: $Defaults.ICON_DATABOX,
    __accessor: ['name', 'icon', 'toolTip'],
    getSelectionModel: function () {
        return this._selectionModel;
    },
    size: function () {
        return this._dataList.size();
    },
    isEmpty: function () {
        return this._dataList.isEmpty();
    },
    getLimit: function () {
        return this._limit;
    },
    setLimit: function (limit) {
        var oldValue = this._limit;
        this._limit = limit;
        this.firePropertyChange('limit', oldValue, limit);
        this._checkLimit();
    },
    _checkLimit: function () {
        if (this._limit >= 0 && this.size() > this._limit) {
            this.removeFirst(this.size() - this._limit);
        }
    },
    removeFirst: function (count) {
        if (arguments.length === 0) {
            count = 1;
        }
        while (count > 0 && this._dataList.size() > 0) {
            var data = this._dataList.get(0);
            this.remove(data);
            count--;
        }
    },
    getSiblings: function (data) {
        if (!this.contains(data)) {
            throw data + " dosen't belong to this dataBox";
        }
        var parent = data.getParent();
        if (parent) {
            return parent.getChildren();
        } else {
            return this._rootList;
        }
    },
    getRoots: function () {
        return this._rootList;
    },
    getSiblingIndex: function (data) {
        if (data.getParent()) {
            return data.getParent().getChildren().indexOf(data);
        } else {
            return this._rootList.indexOf(data);
        }
    },
    getDatas: function () {
        return this._dataList;
    },
    getDataAt: function (index) {
        return this._dataList.get(index);
    },
    toDatas: function (matchFunction, scope) {
        return this._dataList.toList(matchFunction, scope);
    },
    forEach: function (f, scope) {
        this._dataList.forEach(f, scope);
    },
    forEachReverse: function (f, scope) {
        this._dataList.forEachReverse(f, scope);
    },
    forEachByDepthFirst: function (callbackFunction, data, scope) {
        if (data) {
            this._depthFirst(callbackFunction, data, scope);
        } else {
            var n = this._rootList.size();
            for (var i = 0; i < n; i++) {
                var root = this._rootList.get(i);
                if (this._depthFirst(callbackFunction, root, scope) === false) {
                    return;
                }
            }
        }
    },
    _depthFirst: function (callbackFunction, data, scope) {
        var n = data.getChildrenSize()
        for (var i = 0; i < n; i++) {
            var child = data.getChildAt(i);
            if (this._depthFirst(callbackFunction, child, scope) === false) {
                return false;
            }
        }
        if (scope) {
            if (callbackFunction.call(scope, data) === false) {
                return false;
            }
        } else {
            if (callbackFunction(data) === false) {
                return false;
            }
        }
    },
    forEachByBreadthFirst: function (callbackFunction, data, scope) {
        var list = new $List();
        if (data) {
            list.add(data);
        } else {
            this._rootList.forEach(list.add, list);
        }
        while (list.size() > 0) {
            data = list.removeAt(0);
            data.getChildren().forEach(list.add, list);
            if (scope) {
                if (callbackFunction.call(scope, data) === false) {
                    return;
                }
            } else {
                if (callbackFunction(data) === false) {
                    return;
                }
            }
        }
    },
    add: function (data, index) {
        if (!data) {
            return;
        }
        if (arguments.length === 1) {
            index = -1;
        }
        var id = data.getId();
        if (this._dataMap.hasOwnProperty(id)) {
            throw "Data with ID '" + id + "' already exists";
        }
        this._dataBoxChangeDispatcher.fire({ kind: 'preAdd', data: data });
        this._dataMap[id] = data;
        this._dataList.add(data);

        if (!data.getParent()) {
            this._rootMap[id] = data;
            if (index >= 0) {
                this._rootList.add(data, index);
            } else {
                this._rootList.add(data);
            }
        }

        data.addPropertyChangeListener(this.handleDataPropertyChange, this, true);
        this._dataBoxChangeDispatcher.fire({ kind: 'add', data: data });

        this._checkLimit();
    },
    remove: function (data) {
        this.removeById(data.getId());
    },
    removeSelection: function () {
        this._selectionModel.toSelection().forEach(function (data) {
            this.remove(data);
        }, this);
    },
    removeById: function (id) {
        var data = this.getDataById(id);
        if (!data) {
            return;
        }

        this._dataBoxChangeDispatcher.fire({ kind: 'preRemove', data: data });

        // if link, remove from and to node
        if (data instanceof twaver.Link) {
            data.setFromNode(null);
            data.setToNode(null);
        }

        // if have link, remove link first.
        if (data instanceof $Node && data.getLinks()) {
            data.getLinks().toList().forEach(function (link) {
                this.remove(link);
            }, this);
        }

        // if have followers, remove relation
        if (data instanceof $Node && data.getFollowers()) {
            data.getFollowers().toList().forEach(function (follower) {
                follower.setHost(null);
            });
        }

        // if have host, remove relation
        if (data instanceof twaver.Follower && data.getHost()) {
            data.setHost(null);
        }

        // if have children, remove children first.
        data.toChildren().forEach(function (child) {
            this.remove(child);
        }, this);

        // if parent not null, remove from parent.			
        if (data.getParent()) {
            data.getParent().removeChild(data);
        }

        this._dataList.remove(data);
        delete this._dataMap[id];

        if (this._rootMap[id]) {
            delete this._rootMap[id];
            this._rootList.remove(data);
        }

        this._dataBoxChangeDispatcher.fire({ kind: 'remove', data: data });
        data.removePropertyChangeListener(this.handleDataPropertyChange, this);
    },
    clear: function () {
        if (this._dataList.size() > 0) {
            this._dataList.forEach(function (data) {
                data.removePropertyChangeListener(this.handleDataPropertyChange, this);
            }, this);
            var datas = this._dataList.toList();
            this._dataList.clear();
            this._dataMap = {};
            this._rootList.clear();
            this._rootMap = {};
            this._dataBoxChangeDispatcher.fire({ kind: 'clear', datas: datas });
        }
    },
    getDataById: function (id) {
        return this._dataMap[id];
    },
    containsById: function (id) {
        return this._dataMap.hasOwnProperty(id);
    },
    contains: function (data) {
        if (data) {
            return this._dataMap[data._id] === data;
        }
        return false;
    },
    moveTo: function (data, newIndex) {
        if (!this.contains(data)) {
            throw data + " dosen't belong to this dataBox";
        }
        var list = this.getSiblings(data);
        var oldIndex = list.indexOf(data);
        if (oldIndex === newIndex || oldIndex < 0) {
            return;
        }
        if (newIndex >= 0 && newIndex <= list.size()) {
            list.remove(data);
            if (newIndex > list.size()) {
                newIndex--;
            }
            list.add(data, newIndex);
            this._hierarchyChangeDispatcher.fire({
                data: data,
                oldIndex: oldIndex,
                newIndex: newIndex
            });
        }
    },
    moveUp: function (data) {
        var list = this.getSiblings(data);
        this.moveTo(data, list.indexOf(data) - 1);
    },
    moveDown: function (data) {
        var list = this.getSiblings(data);
        this.moveTo(data, list.indexOf(data) + 1);
    },
    moveToTop: function (data) {
        this.moveTo(data, 0);
    },
    moveToBottom: function (data) {
        var list = this.getSiblings(data);
        this.moveTo(data, list.size());
    },
    moveSelectionUp: function (sm) {
        if (!sm) {
            sm = this._selectionModel;
        }
        var datas = new $List();
        $box.findMoveUpDatas(sm, datas, this._rootList);
        datas.forEach(this.moveUp, this);
    },
    moveSelectionDown: function (sm) {
        if (!sm) {
            sm = this._selectionModel;
        }
        var datas = new $List();
        $box.findMoveDownDatas(sm, datas, this._rootList);
        datas.forEach(this.moveDown, this);
    },
    moveSelectionToTop: function (sm) {
        if (!sm) {
            sm = this._selectionModel;
        }
        var datas = new $List();
        $box.findMoveToTopDatas(sm, datas, this._rootList);
        datas.forEach(this.moveToTop, this);
    },
    moveSelectionToBottom: function (sm) {
        if (!sm) {
            sm = this._selectionModel;
        }
        var datas = new $List();
        $box.findMoveToBottomDatas(sm, datas, this._rootList);
        datas.forEach(this.moveToBottom, this);
    },
    handleDataPropertyChange: function (e) {
        var data = e.source;
        if (e.property === "parent") {
            var id = data.getId();
            if (data.getParent()) {
                if (this._rootMap[id]) {
                    delete this._rootMap[id];
                    this._rootList.remove(data);
                }
            } else {
                if (!this._rootMap[id]) {
                    this._rootMap[id] = data;
                    this._rootList.add(data);
                }
            }
        }
        this.onDataPropertyChanged(data, e);
        this._dataPropertyChangeDispatcher.fire(e);
    },
    onDataPropertyChanged: function (data, e) {

    },
    addDataBoxChangeListener: function (listener, scope, ahead) {
        this._dataBoxChangeDispatcher.add(listener, scope, ahead);
    },
    removeDataBoxChangeListener: function (listener, scope) {
        this._dataBoxChangeDispatcher.remove(listener, scope);
    },
    addDataPropertyChangeListener: function (listener, scope, ahead) {
        this._dataPropertyChangeDispatcher.add(listener, scope, ahead);
    },
    removeDataPropertyChangeListener: function (listener, scope) {
        this._dataPropertyChangeDispatcher.remove(listener, scope);
    },
    addHierarchyChangeListener: function (listener, scope, ahead) {
        this._hierarchyChangeDispatcher.add(listener, scope, ahead);
    },
    removeHierarchyChangeListener: function (listener, scope) {
        this._hierarchyChangeDispatcher.remove(listener, scope);
    },
    getRandomData: function (type) {
        if (type) {
            var typeLists = new twaver.List();
            for(var i=0;i<this._dataList.size()-1;i++){
                var e = this._dataList.get(i);
                if( e instanceof type){
                    typeLists.add(e);
                }
            }
            if(typeLists.size() == 0){
                return null;
            }
        }

        var element = type? typeLists.get(parseInt(Math.random()*typeLists.size())):
            this._dataList.get(parseInt(Math.random()*this._dataList.size()));
        return element;
    }
});
