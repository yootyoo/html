twaver.controls.ViewBase = function () {
    twaver.controls.ViewBase.superClass.constructor.apply(this, arguments);
    this._interactionDispatcher = new twaver.EventDispatcher();
    this._viewDispatcher = new twaver.EventDispatcher();
};
_twaver.ext('twaver.controls.ViewBase', twaver.controls.ControlBase, {
    __bool: ['focusOnClick'],
    _focusOnClick: $Defaults.FOCUS_ON_CLICK,

    getSelectionModel: function () {
        return this._selectionModel ? this._selectionModel : this._box.getSelectionModel();
    },
    isShareSelectionModel: function () {
        return this._selectionModel == null;
    },
    setShareSelectionModel: function (shareSelectionModel) {
        var oldValue = this._selectionModel == null;
        if (oldValue === shareSelectionModel) {
            return;
        }
        if (shareSelectionModel) {
            this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
            this._selectionModel.removeSelectionChangeListener(this.handleSelectionChange, this);
            this._selectionModel.dispose();
            this._selectionModel = null;
        } else {
            this._box.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
            this._selectionModel = new twaver.SelectionModel(this._box);
            this._selectionModel.addSelectionChangeListener(this.handleSelectionChange, this);
        }
        this.onShareSelectionModelChanged();
        this.firePropertyChange("shareSelectionModel", oldValue, shareSelectionModel);
    },
    removeSelection: function () {
        if (this.getSelectionModel().size() === 0) {
            return null;
        }
        var selection = this.getSelectionModel().toSelection();
        if (this._box._undoManager._enabled) {
            this._box._undoManager.startBatch();
        }
        selection.forEach(function (data) {
            this._box.remove(data);
        }, this);
        if (this._box._undoManager._enabled) {
            this._box._undoManager.endBatch();
        }
        return selection;
    },
    selectAll: function () {
        var list = new $List();
        this._box.forEach(function (data) {
            if (this.isVisible(data)) {
                list.add(data);
            }
        }, this);
        this.getSelectionModel().setSelection(list);
        return list;
    },
    isSelected: function (data) {
        return this.getSelectionModel().contains(data);
    },
    isSelectable: function (data) {
        return this.getSelectionModel().isSelectable(data);
    },

    getLabel: function (data) {
        return data.getName();
    },
    getToolTip: function (data) {
        return data.getToolTip();
    },
    getIcon: function (data) {
        return data.getIcon();
    },
    getSelectColor: function (data) {
        return $Defaults.SELECT_COLOR;
    },
    addViewListener: function (listener, scope, ahead) {
        this._viewDispatcher.add(listener, scope, ahead);
    },
    removeViewListener: function (listener, scope) {
        this._viewDispatcher.remove(listener, scope);
    },
    fireViewEvent: function (evt) {
        this._viewDispatcher.fire(evt);
    },
    addInteractionListener: function (listener, scope, ahead) {
        this._interactionDispatcher.add(listener, scope, ahead);
    },
    removeInteractionListener: function (listener, scope) {
        this._interactionDispatcher.remove(listener, scope);
    },
    fireInteractionEvent: function (evt) {
        this._interactionDispatcher.fire(evt);
    },
    invalidate: function (delay) {
        if (!this._invalidate) {
            this._invalidate = true;
            this.fireViewEvent({ kind: 'invalidate' });
            _twaver.callLater(this.validate, this, null, delay);
        }
    },
    validate: function () {
        if (!this._invalidate) {
            return;
        }
        this._invalidate = false;
        if (!isNodejs && this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null) {
            if (this._reinvalidateCount === undefined) {
                this._reinvalidateCount = 100;
            }
            if (this._reinvalidateCount > 0) {
                this._reinvalidateCount--;
            } else {
                this._reinvalidateCount = null;
            }
            this.invalidate();
        } else {
            this._isValidating = true;
            this.fireViewEvent({ kind: 'validateStart' });
            this.validateImpl();
            this.fireViewEvent({ kind: 'validateEnd' });
            delete this._isValidating;
        }
    }
});
