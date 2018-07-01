twaver.SelectionModel = function (dataBox) {
    twaver.SelectionModel.superClass.constructor.apply(this, arguments);
    this._selectionMode = 'multipleSelection';
    this._selectionList = new $List();
    this._selectionChangeDispatcher = new twaver.EventDispatcher();
    this._selectionMap = {};
    this._setDataBox(dataBox);
};
_twaver.ext('twaver.SelectionModel', twaver.PropertyChangeDispatcher, {
    getSelectionMode: function () {
        return this._selectionMode;
    },
    setSelectionMode: function (selectionMode) {
        if (this._selectionMode === selectionMode) {
            return;
        }
        if (selectionMode !== 'noneSelection'
		&& selectionMode !== 'singleSelection'
		&& selectionMode !== 'multipleSelection') {
            return;
        }
        this.clearSelection();
        var oldValue = this._selectionMode;
        this._selectionMode = selectionMode;
        this.firePropertyChange("selectionMode", oldValue, this._selectionMode);
    },
    getDataBox: function () {
        return this._dataBox;
    },
    _setDataBox: function (dataBox) {
        if (!dataBox) {
            throw "dataBox can not be null";
        }
        if (this._dataBox === dataBox) {
            return;
        }
        if (this._dataBox) {
            this.clearSelection();
            this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this);
        }
        var oldValue = this._dataBox;
        this._dataBox = dataBox;
        this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange, this, true);
        this.firePropertyChange('dataBox', oldValue, this._dataBox);
    },
    dispose: function () {
        this.clearSelection();
        this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange, this);
    },
    handleDataBoxChange: function (e) {
        if (e.kind === 'remove') {
            var data = e.data;
            if (this.contains(data)) {
                this._selectionList.remove(data);
                delete this._selectionMap[data.getId()];
                this.fireSelectionChange('remove', new $List(data));
            }
        }
        else if (e.kind === 'clear') {
            this.clearSelection();
        }
    },
    getFilterFunction: function () {
        return this._filterFunction;
    },
    setFilterFunction: function (filterFunction) {
        if (this._filterFunction === filterFunction) {
            return;
        }
        this.clearSelection();
        var oldValue = this._filterFunction;
        this._filterFunction = filterFunction;
        this.firePropertyChange("filterFunction", oldValue, this._filterFunction);
    },
    fireSelectionChange: function (kind, datas, oldSelection) {
        if (oldSelection) {
            this._selectionList.forEach(function (data) {
                if (oldSelection.contains(data)) {
                    oldSelection.remove(data);
                } else {
                    oldSelection.add(data);
                }
            });
            datas = oldSelection.toList();
        }
        this._selectionChangeDispatcher.fire({ kind: kind, datas: new $List(datas) });
    },
    addSelectionChangeListener: function (listener, scope, ahead) {
        this._selectionChangeDispatcher.add(listener, scope, ahead);
    },
    removeSelectionChangeListener: function (listener, scope) {
        this._selectionChangeDispatcher.remove(listener, scope);
    },
    _filterList: function (datas, isAdding) {
        var array = new $List(datas);
        for (var i = 0; i < array.size(); i++) {
            var data = array.get(i);
            if ((this._filterFunction && !this._filterFunction(data)) ||
				  		(isAdding && this.contains(data)) ||
				  		(!isAdding && !this.contains(data)) ||
				  		!this._dataBox.contains(data)) {
                array.removeAt(i);
                i--;
            }
        }
        return array;
    },
    appendSelection: function (datas) {
        if (this._selectionMode === 'noneSelection') {
            return;
        }
        var array = this._filterList(datas, true);
        if (array.isEmpty()) {
            return;
        }
        var oldSelection = null;
        if (this._selectionMode === 'singleSelection') {
            oldSelection = new $List(this._selectionList);
            this._selectionList.clear();
            this._selectionMap = {};
            array = new $List(array.get(array.size() - 1));
        }
        for (var i = 0; i < array.size(); i++) {
            var data = array.get(i);
            this._selectionList.add(data);
            this._selectionMap[data.getId()] = data;
        }
        this.fireSelectionChange('append', array, oldSelection);
    },
    removeSelection: function (datas) {
        var array = this._filterList(datas);
        if (array.size() === 0) {
            return;
        }
        for (var i = 0; i < array.size(); i++) {
            var data = array.get(i);
            this._selectionList.remove(data);
            delete this._selectionMap[data.getId()];
        }
        this.fireSelectionChange('remove', array);
    },
    toSelection: function (matchFunction, scope) {
        return this._selectionList.toList(matchFunction, scope);
    },
    getSelection: function () {
        return this._selectionList;
    },
    setSelection: function (datas) {
        if (this._selectionMode === 'noneSelection') {
            return;
        }
        if (this._selectionList.size() === 0 && datas == null) {
            return;
        }
        var oldSelection = new $List(this._selectionList);
        this._selectionList.clear();
        this._selectionMap = {};
        var array = this._filterList(datas, true);
        if (this._selectionMode === 'singleSelection' && array.size() > 1) {
            array = new $List(array.get(array.size() - 1));
        }
        for (var i = 0; i < array.size(); i++) {
            var data = array.get(i);
            this._selectionList.add(data);
            this._selectionMap[data.getId()] = data;
        }
        this.fireSelectionChange('set', null, oldSelection);
    },
    clearSelection: function () {
        if (this._selectionList.size() > 0) {
            var array = this._selectionList.toList();
            this._selectionList.clear();
            this._selectionMap = {};
            this.fireSelectionChange('clear', array);
        }
    },
    selectAll: function () {
        if (this._selectionMode === 'noneSelection') {
            return;
        }
        var array = this._dataBox.toDatas();
        var i = 0;
        var data = null;
        if (this._filterFunction) {
            for (i = 0; i < array.size(); i++) {
                data = array.get(i);
                if (!this._filterFunction(data)) {
                    array.removeAt(i);
                    i--;
                }
            }
        }
        var oldSelection = new $List(this._selectionList);
        this._selectionList.clear();
        this._selectionMap = {};
        if (this._selectionMode === 'singleSelection' && array.size() > 1) {
            array = new $List(array.get(array.size() - 1));
        }
        for (i = 0; i < array.size(); i++) {
            data = array.get(i);
            this._selectionList.add(data);
            this._selectionMap[data.getId()] = data;
        }
        this.fireSelectionChange('all', null, oldSelection);
    },
    size: function () {
        return this._selectionList.size();
    },
    contains: function (data) {
        if (!data) {
            return false;
        }
        return this._selectionMap[data.getId()] != null;
    },
    getLastData: function () {
        if (this._selectionList.size() > 0) {
            return this._selectionList.get(this._selectionList.size() - 1);
        }
        return null;
    },
    getFirstData: function () {
        if (this._selectionList.size() > 0) {
            return this._selectionList.get(0);
        }
        return null;
    },
    isSelectable: function (data) {
        if (!data) {
            return false;
        }
        if (this._selectionMode === 'noneSelection') {
            return false;
        }
        if (this._filterFunction && !this._filterFunction(data)) {
            return false;
        }
        return true;
    }

});
