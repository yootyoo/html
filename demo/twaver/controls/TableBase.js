twaver.controls.TableBase = function (dataBox) {
    this._columnBox = new twaver.ColumnBox();
    this._columnBox.addDataBoxChangeListener(this.handleColumnBoxChange, this);
    this._columnBox.addDataPropertyChangeListener(this.handleColumnPropertyChange, this);
    this._columnBox.addHierarchyChangeListener(this.handleColumnHierarchyChange, this);

    twaver.controls.TableBase.superClass.constructor.apply(this, arguments);

    this._cellPool = new twaver.Pool('div', 20);
    this._stringPool = new twaver.Pool('span', 20);
    this._booleanPool = new twaver.Pool('input', 20);
    this._colorPool = new twaver.Pool('div', 20);

    this._pools.add(this._cellPool);
    this._pools.add(this._stringPool);
    this._pools.add(this._booleanPool);
    this._pools.add(this._colorPool);
};
_twaver.ext('twaver.controls.TableBase', twaver.controls.ListBase, {
    getColumnBox: function () {
        return this._columnBox;
    },
    handleColumnBoxChange: function (e) {
        this.invalidateDisplay();
    },
    handleColumnPropertyChange: function (e) {
        if (e.source === this._sortColumn &&
            (e.property === 'sortDirection' || e.property === 'sortFunction' || e.property === 'sortable')) {
            this.invalidateModel();
        } else {
            this.invalidateDisplay();
        }
    },
    handleColumnHierarchyChange: function (e) {
        this.invalidateDisplay();
    },
    renderData: function (div, data, row, selected) {
        var columns = this._columnBox.getRoots();
        var count = columns.size();
        var sumWidth = 0;
        var hpx = this._rowHeight - this._rowLineWidth + 'px';

        var style;
        for (var i = 0; i < count; i++) {
            var column = columns.get(i);
            var width = column.getWidth();
            if (width < 0) width = 0;
            var columnLineWidth = Math.min(this._columnLineWidth, width);

            if (column.isVisible()) {
                var cell = this._cellPool.get();
                style = cell.style;
                style.position = 'absolute';
                style.whiteSpace = 'nowrap';
                style.verticalAlign = 'middle';
                style.textAlign = column.getHorizontalAlign();
                style.overflow = 'hidden';
                style.textOverflow = 'ellipsis';
                style.left = sumWidth + 'px';
                style.width = width - columnLineWidth + 'px';
                style.height = hpx;

                style.borderStyle = 'solid';
                style.borderWidth = '0px';
                style.borderRightWidth = columnLineWidth + 'px';
                style.borderRightColor = this._columnLineColor;
                
                if (i === 0) {
                    style.borderLeftWidth = columnLineWidth + 'px';
                    style.borderLeftColor = this._columnLineColor;
                } else {
                    style.borderLeftWidth = '0px';
                }

                div.appendChild(cell);
                var params = {
                    data: data,
                    value: this.getValue(data, column),
                    div: cell,
                    view: this,
                    column: column,
                    rowIndex: row,
                    selected: selected
                }
                this.renderCell(params);
                this.onCellRendered(params);
                sumWidth += width;
            }
        }

        style = div.style;
        style.width = sumWidth + 'px';
        style.height = hpx;
        style.backgroundColor = ((this.isCheckMode() && this._focusedRow === row) || (!this.isCheckMode() && selected)) ? this.getSelectColor(data) : '';

    },
    adjustRowSize: function () {
        // already done when rendering data
    },
    onCellRendered: function (params) {

    },
    getCurrentSortFunction: function () {
        var column = this._sortColumn;
        if (column) {
            var func = column.getSortFunction();
            if (func) {
                var table = this;
                var direction = 'asc' === column.getSortDirection() ? 1 : -1;
                return function (d1, d2) {
                    var v1 = table.getValue(d1, column);
                    var v2 = table.getValue(d2, column);
                    return func.call(table, v1, v2, d1, d2) * direction;
                };
            }
        }
        return this._sortFunction;
    },
    /*
    params
    data: data,
    value: this.getValue(data, column),
    div: cell,
    view: this,
    column: column,
    rowIndex: row,
    selected: selected,
    enumInfo: enumInfo
    */
    renderCell: function (params) {
        var column = params.column;
        if (column.renderCell) {
            column.renderCell(params);
            return;
        }
        var value = params.value;
        var enumInfo = column.getEnumInfo(params.rowIndex);
        if (enumInfo && !Array.isArray(enumInfo)) {
            value = enumInfo.map[value];
        }
        if (params.view.isCellEditable(params.data, column)) {
            params.enumInfo = enumInfo;
            params.div._editInfo = params;
        }
        $render.render(column.getValueType(), value, params.div, params.view, column.isInnerText());
    },
    getValue: function (data, column) {
        return column.getValue(data, this);
    },
    setValue: function (data, column, value) {
        column.setValue(data, value, this);
    },
    getColumnAt: function (e) {
        var point = this.getLogicalPoint(e);
        if (!point) {
            return null;
        }
        var columns = this._columnBox.getRoots();
        for (var i = 0, n = columns.size(), sum = 0; i < n; i++) {
            var column = columns.get(i);
            var width = column.getWidth();
            if (width < 0) width = 0;
            if (point.x > sum && point.x < sum + width) {
                return column;
            }
            sum += width;
        }
        return null;
    },
    isCellEditable: function (data, column) {
        return this.isEditable() && column.isEditable();
    },
    commitEditValue: function (editInfo, target) {
        if (this._isCanceling) {
            return;
        }
        var value;
        if (target.type === 'checkbox') {
            value = target.checked;
        } else {
            value = target.value;
        }
        var column = editInfo.column;
        var type = column.getValueType();
        if (type === 'int' && typeof value === 'string') {
            value = parseInt(value);
        }
        else if (type === 'number' && typeof value === 'string') {
            value = parseFloat(value);
        }
        this.setValue(editInfo.data, column, value);
        if (this._currentEditor) {
            // var editor = this._currentEditor;
            // delete this._currentEditor;
            // this._rootDiv.removeChild(editor);
            // twaver.Util.setFocus(this._view);
            var parentNode = this._currentEditor.parentNode;
            var editor = this._currentEditor;
            delete this._currentEditor;
            parentNode && parentNode.removeChild(editor);
            twaver.Util.setFocus(this._view);
        }
        delete this._isCommitting;
    },
    cancelEditing: function () {
        if (this._currentEditor) {
            // this._isCanceling = true;
            // var editor = this._currentEditor;
            // delete this._currentEditor;
            // this._rootDiv.removeChild(editor);
            // twaver.Util.setFocus(this._view);
            // delete this._isCanceling;

            this._isCanceling = true;
            var parentNode = this._currentEditor.parentNode;
            var editor = this._currentEditor;
            delete this._currentEditor;
            parentNode && parentNode.removeChild(editor);
            twaver.Util.setFocus(this._view);
            delete this._isCanceling;
        }
    },
    renderEditor: function(params){

    },
    onEditorRendered: function(params){

    },
    updateCurrentEditor: function (e) {
        var t = e.target;
        // click on editor
        if (t === this._currentEditor || t.parentNode === this._currentEditor) {
            return;
        }
        var editInfo;
        while (t && t !== this._view && !(editInfo = t._editInfo)) {
            t = t.parentNode;
        }

        if (editInfo && t === editInfo.div) {
            var editor = this.renderEditor && this.renderEditor(editInfo);
            if(editor){
                this._currentEditor = editor.view;
                if (editInfo.value != null) {
                    this._currentEditor.value = editInfo.value;
                }
            }else if (editInfo.enumInfo) {
                this._currentEditor = $html.createSelect(editInfo.enumInfo, editInfo.value);
            } else {
                this._currentEditor = document.createElement('input');
                if (editInfo.value != null) {
                    this._currentEditor.value = editInfo.value;
                }
            }
            var self = this;
            if (this._currentEditor) {
                if(editor && editor.onKeyDown){
                    var keydownEvents = editor.onKeyDown;
                    if(keydownEvents && Array.isArray(keydownEvents)){
                        self._currentEditor.addEventListener('keydown', function (e) {
                            // var view = e.target._editInfo.view;
                            for(var k = 0; k<keydownEvents.length; k++){
                                if(keydownEvents[k].combKey){
                                    var evt = null;
                                    switch (keydownEvents[k].combKey){
                                        case 'ctrlKey':
                                        evt = e.ctrlKey;
                                        break;
                                        case 'shiftKey':
                                        evt = e.shiftKey;
                                        break;
                                        case 'altKey':
                                        evt = e.altKey;
                                        break;
                                    }
                                    if(e.keyCode === keydownEvents[k].keyCode && evt){
                                        keydownEvents[k].handlerEvent && keydownEvents[k].handlerEvent(e);
                                    }
                                }else{
                                    if(e.keyCode === keydownEvents[k].keyCode){
                                        keydownEvents[k].handlerEvent && keydownEvents[k].handlerEvent(e);
                                    } 
                                }
                            }
                        });
                        } 
                    }else{
                this._currentEditor.addEventListener('keydown', function (e) {
                    var view = e.target._editInfo.view;
                    if(e.keyCode === 13 && e.shiftKey){
                        return;
                    }else if (e.keyCode === 13) {
                        view.commitEditValue(e.target._editInfo, e.target);
                    } else if (e.keyCode === 27) {
                        view.cancelEditing();
                    }
                }, false);
            }
                this._currentEditor.addEventListener('blur', function (e) {
                    var view = e.target._editInfo.view;
                    if (view._isCanceling) {
                        return;
                    }
                    view.commitEditValue(e.target._editInfo, e.target);
                }, false);
                this._currentEditor.keepDefault = true;
                this._currentEditor._editInfo = editInfo;

                if(!this._currentEditor.parentNode){
                    var style = this._currentEditor.style;
                    style.position = 'absolute';
                    style.margin = '0px';
                    style.border = '0px';
                    style.padding = '0px';
                    style.left = editInfo.div.style.left;
                    style.top = editInfo.div.parentNode.style.top;
                    style.width = editInfo.div.style.width;
                    style.height = editInfo.div.style.height;
                    this._rootDiv.appendChild(this._currentEditor);
                }
                // var style = this._currentEditor.style;
                // style.position = 'absolute';
                // style.margin = '0px';
                // style.border = '0px';
                // style.padding = '0px';
                // style.left = editInfo.div.style.left;
                // style.top = editInfo.div.parentNode.style.top;
                // style.width = editInfo.div.style.width;
                // style.height = editInfo.div.style.height;
                // this._rootDiv.appendChild(this._currentEditor);
                twaver.Util.setFocus(this._currentEditor);
            }
        }
    },
    onColumnSorted: function (column) {

    },
    getCurrentEditor: function () {
        return this._currentEditor;
    }
});
