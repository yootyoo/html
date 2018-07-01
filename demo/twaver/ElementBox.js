twaver.ElementBox = function (name) {
    twaver.ElementBox.superClass.constructor.apply(this, arguments);
    this._styleMap = {};
    this._alarmBox = new twaver.AlarmBox(this);
    this._layerBox = new twaver.LayerBox(this);
    this._alarmStatePropagator = new twaver.AlarmStatePropagator(this);
    this._alarmStatePropagator.setEnable(true);
    this._indexChangeDispatcher = new twaver.EventDispatcher();
    this._undoManager = new twaver.UndoManager(this);
};
twaver.ElementBox.IS_INTERESTED_ADJUSTELEMENTINDEX_PROPERTY = {
    "fromAgent": 1,
    "toAgent": 1,
    "expanded": 1,
    "parent": 1,
    "host": 1
};
_twaver.ext('twaver.ElementBox', twaver.DataBox, {
    IStyle: true,
    __style: 1,

    _name: 'ElementBox',

    add: function (data, index) {
        if (!data) {
            return;
        }
        if (!data.IElement) {
            throw "Only IElement can be added into ElementBox";
        }
        twaver.ElementBox.superClass.add.apply(this, arguments);
        this.adjustElementIndex(data);
    },
    onDataPropertyChanged: function (data, e) {
        if (twaver.ElementBox.IS_INTERESTED_ADJUSTELEMENTINDEX_PROPERTY[e.property]) {
            this.adjustElementIndex(data);
        }
        twaver.ElementBox.superClass.onDataPropertyChanged.apply(this, arguments);
    },
    addIndexChangeListener: function (listener, scope, ahead) {
        this._indexChangeDispatcher.add(listener, scope, ahead);
    },
    removeIndexChangeListener: function (listener, scope) {
        this._indexChangeDispatcher.remove(listener, scope);
    },
    sendToTop: function (element) {
        if (!this.contains(element)) {
            return;
        }
        if (element !== this.getDatas().get(this.size() - 1)) {
            var oldIndex = this.getDatas().indexOf(element);
            this.getDatas().removeAt(oldIndex);
            this.getDatas().add(element);
            this._indexChangeDispatcher.fire({ element: element, oldIndex: oldIndex, newIndex: this.size() - 1 });
        }
        if (element instanceof twaver.Link) {
            if (element.getFromAgent() && !element.getFromAgent().isAdjustedToBottom()) {
                this.sendToTop(element.getFromAgent());
            }
            if (element.getToAgent() && !element.getToAgent().isAdjustedToBottom()) {
                this.sendToTop(element.getToAgent());
            }
        }
        if (element instanceof $Node) {
            if (element.getFollowers()) {
                element.getFollowers().forEach(function (f) {
                    if (f.isRelatedTo(element)) {
                        return;
                    }
                    if (element instanceof twaver.Follower && f.isLoopedHostOn(element)) {
                        return;
                    }
                    this.sendToTop(f);
                }, this);
            }
        }
        if (element.ISubNetwork) {
            return;
        }
        if (element instanceof $Group && !element.isExpanded()) {
            return;
        }
        element.getChildren().forEach(function (child) {
            if (!(child instanceof twaver.Link)) {
                this.sendToTop(child);
            }
        }, this);
    },
    sendToBottom: function (element, refElement) {
        if (element === refElement) {
            return;
        }
        if (!this.contains(element)) {
            return;
        }
        if (refElement && !this.contains(refElement)) {
            return;
        }
        var oldIndex = this.getDatas().remove(element);
        var newIndex = 0;
        if (refElement) {
            newIndex = this.getDatas().indexOf(refElement);
        }
        this.getDatas().add(element, newIndex);
        if (oldIndex != newIndex) {
            this._indexChangeDispatcher.fire({ element: element, oldIndex: oldIndex, newIndex: newIndex });
            if (element.getParent() &&
			        	!element.getParent().ISubNetwork &&
			        	!(element.getParent() instanceof twaver.Link)) {
                this.sendToBottom(element.getParent(), element);
            }
        }
    },
    fireIndexChange: function (element, oldIndex, newIndex) {
        this._indexChangeDispatcher.fire({ element: element, oldIndex: oldIndex, newIndex: newIndex });
    },
    adjustElementIndex: function (element) {
        if (!this.contains(element)) {
            return;
        }
        if (element.isAdjustedToBottom()) {
            this.sendToBottom(element);
            element.getChildren().forEach(this.adjustElementIndex, this);
        }
        else {
            this.sendToTop(element);
        }
    },
    forEachByLayer: function (callbackFunction, layer, scope) {
        var n = this.size();
        var ds = this.getDatas();
        if (!layer) {
            this._layerBox.forEachByDepthFirst(function (currentLayer) {
                for (var j = 0; j < n; j++) {
                    var element = ds.get(j);
                    if (this._layerBox.getLayerByElement(element) === currentLayer) {
                        if (scope) {
                            if (callbackFunction.call(scope, element) === false) {
                                return;
                            }
                        } else {
                            if (callbackFunction(element) === false) {
                                return;
                            }
                        }
                    }
                }
            }, null, this);
        } else {
            for (var j = 0; j < n; j++) {
                var element = ds.get(j);
                if (this._layerBox.getLayerByElement(element) === layer) {
                    if (scope) {
                        if (callbackFunction.call(scope, element) === false) {
                            return;
                        }
                    } else {
                        if (callbackFunction(element) === false) {
                            return;
                        }
                    }
                }
            }
        }
    },
    forEachByLayerReverse: function (callbackFunction, layer, scope) {
        var list = new $List();
        this.forEachByLayer(function (element) { list.add(element, 0); }, layer);
        list.forEach(callbackFunction, scope);
    },
    getLayerBox: function () {
        return this._layerBox;
    },
    getAlarmBox: function () {
        return this._alarmBox;
    },
    getAlarmStatePropagator: function () {
        return this._alarmStatePropagator;
    },
    startBatch : function(callback,scope){
    	twaver._isInitializing = true;
    	twaver._bundleLinks = {};
		twaver._links = {};
		callback.call(scope);
		var link,pair;
		for(var index in twaver._links){ 
			link = twaver._links[index];
			link._checkAgentNodeImpl();
		}
		for(var index in twaver._bundleLinks){
			pair = twaver._bundleLinks[index];
			$element.resetBundleLinks(pair[0], pair[1]);
		}
		twaver._bundleLinks = null;
		twaver._links = null;
		twaver._isInitializing = false;
    },
    getUndoManager: function () {
        return this._undoManager;
    }
});
