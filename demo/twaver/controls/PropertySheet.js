twaver.controls.PropertySheet = function (dataBox) {
    twaver.controls.PropertySheet.superClass.constructor.apply(this, arguments);
    this._currentRowIndex = -1;
    this._currentEditor = null;
    this._currentData = null;
    this._invalidate = false;

    this._resizeDiv = $html.createDiv();
    this._resizeDiv.style.backgroundColor = 'white';
    this._resizeDiv.style.opacity = 0;
    this._resizeDiv.style.top = '0px';

    //{'null', 'name1', 'name2' ...}
    this._categoryList = new $List();

    // { ... 'name1':{isExpanded:true, properties:list(prop1, prop2, prop3...)} ... }
    this._categoryMap = {};

    // {name1,{view:sheet, data:currentData, property:property, value:value, rowDiv:div, nameRender:div, valueRender:div}}
    this._rowList = new $List();

    this._propertyBox = new twaver.PropertyBox();
    this._propertyBox.addDataBoxChangeListener(this.invalidatePropertyBox, this);
    this._propertyBox.addDataPropertyChangeListener(this.invalidatePropertyBox, this);
    this._propertyBox.addHierarchyChangeListener(this.invalidatePropertyBox, this);

    this.__divPool = new twaver.Pool('div', 2);
    this.__cellPool = new twaver.Pool('div', 2);
    this.__imagePool = new twaver.Pool('img', 2);
    this.__textPool = new twaver.Pool('span', 2);
    this._stringPool = new twaver.Pool('span', 2);
    this._booleanPool = new twaver.Pool('input', 2);
    this._colorPool = new twaver.Pool('div', 2);

    this._pools.add(this.__divPool);
    this._pools.add(this.__cellPool);
    this._pools.add(this.__imagePool);
    this._pools.add(this.__textPool);
    this._pools.add(this._stringPool);
    this._pools.add(this._booleanPool);
    this._pools.add(this._colorPool);

    this._view = $html.createView('auto');
    this._rootDiv = $html.createDiv();
    this._dataDiv = $html.createDiv();

    this._view.appendChild(this._rootDiv);
    this._rootDiv.appendChild(this._dataDiv);

    this.setDataBox(dataBox ? dataBox : new twaver.DataBox());

    var self = this;
    this._view.addEventListener('change', function (e) {
        self.handleChange(e);
    }, false);

    if ($ua.isMSToucheable) {
        new twaver.controls.PropertySheetMSTouchInteraction(this);
    } else {
        new twaver.controls.PropertySheetTouchInteraction(this);
        new twaver.controls.PropertySheetInteraction(this);
    }
};
_twaver.ext('twaver.controls.PropertySheet', twaver.controls.View, {
    __accessor: ['indent', 'rowHeight', 'sumWidth', 'propertyNameWidth', 'propertyNameHorizontalAlign',
                 'autoAdjustable', 'rowLineWidth', 'columnLineWidth', 'borderColor', 'categorizable', 'resizeTolerance',
                 'editable', 'selectColor', 'expandIcon', 'collapseIcon', 'sortFunction', 'visibleFunction'],

    _autoAdjustable: $Defaults.PROPERTYSHEET_AUTO_ADJUSTABLE,
    _selectColor: $Defaults.SELECT_COLOR,
    _categorizable: $Defaults.PROPERTYSHEET_CATEGORIZABLE,
    _editable: $Defaults.PROPERTYSHEET_EDITABLE,
    _propertyNameWidth: $Defaults.PROPERTYSHEET_PROPERTY_NAME_WIDTH,
    _propertyNameHorizontalAlign: $Defaults.PROPERTYSHEET_PROPERTY_NAME_HORIZONTAL_ALIGN,
    _sumWidth: $Defaults.PROPERTYSHEET_SUM_WIDTH,
    _indent: $Defaults.PROPERTYSHEET_INDENT,
    _rowHeight: $Defaults.PROPERTYSHEET_ROW_HEIGHT,
    _rowLineWidth: $Defaults.PROPERTYSHEET_ROW_LINE_WIDTH,
    _columnLineWidth: $Defaults.PROPERTYSHEET_COLUMN_LINE_WIDTH,
    _borderColor: $Defaults.PROPERTYSHEET_BORDER_COLOR,
    _expandIcon: $Defaults.PROPERTYSHEET_EXPAND_ICON,
    _collapseIcon: $Defaults.PROPERTYSHEET_COLLAPSE_ICON,
    _resizeTolerance: $Defaults.PROPERTYSHEET_RESIZE_TOLERANCE,

    getPropertyBox: function () {
        return this._propertyBox;
    },
    getCurrentData: function () {
        return this._currentData;
    },
    getDataDiv: function () {
        return this._dataDiv;
    },
    getDataBox: function () {
        return this._box;
    },
    setDataBox: function (dataBox) {
        if (!dataBox) {
            throw "DataBox can not be null";
        }
        if (this._box === dataBox) {
            return;
        }
        var oldValue = this._box;
        if (oldValue) {
            oldValue.removeDataPropertyChangeListener(this.handlePropertyChange, this);
            if (!this._selectionModel) {
                oldValue.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
            }
        }
        this._box = dataBox;

        this._box.addDataPropertyChangeListener(this.handlePropertyChange, this);
        if (this._selectionModel) {
            this._selectionModel._setDataBox(dataBox);
        } else {
            this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
        }

        this.invalidate();
        this.firePropertyChange("dataBox", oldValue, this._box);
    },
    invalidatePropertyBox: function () {
        if (!this._isValidating) {
            this.invalidate();
        }
    },
    onPropertyChanged: function (e) {
        if (e.property !== 'zoom') {
            this.invalidate();
        }
    },
    isVisible: function (property) {
        if (property.isVisible && !property.isVisible(this._currentData, this)) {
            return false;
        }
        return this._visibleFunction ? this._visibleFunction(property) : true;
    },
    handlePropertyChange: function (e) {
        if (this._currentData === e.source) {
            this.invalidate();
        }
    },
    handleSelectionChange: function (e) {
        if (this._currentData !== this.getSelectionModel().getLastData()) {
            this._currentRowIndex = -1;
            this.invalidate();
        }
    },
    isExpanded: function (categoryName) {
        if (!categoryName) {
            return true;
        }
        var c = this._categoryMap[categoryName];
        return c ? c.isExpanded : $Defaults.PROPERTYSHEET_EXPAND_CATEGORY;
    },
    expand: function (categoryName) {
        if (!categoryName) {
            return;
        }
        var c = this._categoryMap[categoryName];
        if (!c || c.isExpanded) {
            return;
        }
        c.isExpanded = true;
        this.invalidate();
    },
    expandAll: function () {
        for (var n in this._categoryMap) {
            var c = this._categoryMap[n];
            if (c) {
                c.isExpanded = true;
            }
        }
        this.invalidate();
    },
    collapse: function (categoryName) {
        if (!categoryName) {
            return;
        }
        var c = this._categoryMap[categoryName];
        if (!c || !c.isExpanded) {
            return;
        }
        c.isExpanded = false;
        this.invalidate();
    },
    collapseAll: function () {
        for (var n in this._categoryMap) {
            var c = this._categoryMap[n];
            if (c) {
                c.isExpanded = false;
            }
        }
        this.invalidate();
    },
    getCategoryName: function (property) {
        if (!this.isCategorizable()) {
            return 'null';
        }
        var name = property.getCategoryName();
        return name ? name : 'null';
    },
    validateModel: function () {
        this._rowList.clear();
        this._categoryList.clear();
        var map = {};
        var list = new $List();
        var properties = this._currentData ? this._propertyBox.getRoots() : new $List();
        var i, j, name, count, property;
        count = properties.size();
        for (i = 0; i < count; i++) {
            property = properties.get(i);
            if (this.isVisible(property)) {
                list.add(property);
                name = this.getCategoryName(property);
                if (!map[name]) {
                    this._categoryList.add(name);
                    map[name] = {
                        isExpanded: this.isExpanded(name),
                        properties: new $List()
                    };
                }
            }
        }
        if (this._sortFunction) {
            list.sort(this._sortFunction);
        }
        this._categoryMap = map;
        count = list.size();

        for (i = 0; i < this._categoryList.size(); i++) {
            name = this._categoryList.get(i);
            if (name !== 'null') {
                this._rowList.add(name);
            }
            var obj = map[name];
            if (obj.isExpanded) {
                for (j = 0; j < count; j++) {
                    property = list.get(j);
                    if (this.getCategoryName(property) === name) {
                        obj.properties.add(property);
                        this._rowList.add({
                            view: this,
                            data: this._currentData,
                            property: property,
                            value: this._currentData ? this.getValue(this._currentData, property) : null
                        });

                    }
                }
            }
        }

    },
    adjustWidth: function () {
        var width = this._view.offsetWidth;
        var height = this._view.offsetHeight;
        if (width <= this._indent || height <= 0) {
            return;
        }
        width -= this._indent;
        if (this._rowList.size() * this._rowHeight > height) {
            width -= $Defaults.SCROLL_BAR_WIDTH;
            if (width <= 0) {
                return;
            }
        }
        if (this._sumWidth === 0 || this._propertyNameWidth > this._sumWidth) {
            this._propertyNameWidth = width / 2;
        } else {
            this._propertyNameWidth = width * (this._propertyNameWidth / this._sumWidth);
        }
        this._sumWidth = width;
        this._view.style.overflowX = 'hidden';
        this._view.style.overflowY = 'auto';
    },
    validateDisplay: function () {
        var count = this._rowList.size();
        var color = this._borderColor;
        var indent = this._indent;
        var rowHeight = this._rowHeight;
        var nameWidth = this._propertyNameWidth;
        var valueWidth = Math.max(0, this._sumWidth - nameWidth);
        var rowLineWidth = this._rowLineWidth;
        var columnLineWidth = this._columnLineWidth;
        var cellheightpx = rowHeight - rowLineWidth + 'px';
        var lineheightpx = rowHeight - rowLineWidth - 2 + 'px';
        var indentpx = indent + 'px';
        var namepx = nameWidth - columnLineWidth + 'px';
        var valuepx = valueWidth - columnLineWidth + 'px';
        var rowwidthpx = nameWidth + valueWidth + 'px';
        var rowlinepx = rowLineWidth + 'px';
        var columnlinepx = columnLineWidth + 'px';
        var valueleftpx = nameWidth + 'px';

        var parent = this._dataDiv;
        var style = parent.style;
        style.height = count * rowHeight + 'px';
        style.width = indent + nameWidth + valueWidth + 'px';

        var div = this.__divPool.get();
        style = div.style;
        style.position = 'absolute';
        style.left = '0px';
        style.top = '0px';
        style.width = indentpx;
        style.height = parent.style.height;
        style.borderWidth = '0px';
        style.backgroundColor = color;
        parent.appendChild(div);

        for (var i = 0; i < count; i++) {
            var rowInfo = this._rowList.get(i);
            var tpx = i * rowHeight + 'px';

            var rowDiv = this.__divPool.get();
            rowInfo.rowDiv = rowDiv;
            style = rowDiv.style;
            style.position = 'absolute';
            style.whiteSpace = 'nowrap';
            style.overflow = 'hidden';
            style.textOverflow = 'ellipsis';
            style.left = indentpx;
            style.top = tpx;
            style.width = rowwidthpx;
            style.height = cellheightpx;
            style.lineHeight = lineheightpx;
            style.borderStyle = 'solid';
            style.borderWidth = '0px';
            style.borderBottomWidth = rowlinepx;
            style.borderBottomColor = color;
            parent.appendChild(rowDiv);

            // category
            if (typeof rowInfo === 'string') {
                style.backgroundColor = color;

                div = this.__divPool.get();
                style = div.style;
                style.position = 'absolute';
                style.left = '0px';
                style.top = tpx;
                style.width = indentpx;
                style.height = cellheightpx;
                style.lineHeight = lineheightpx;
                style.borderWidth = '0px';
                parent.appendChild(div);

                var image = this.__imagePool.get();
                var toggleImage = this.isExpanded(rowInfo) ? this._expandIcon : this._collapseIcon;
                image.setAttribute('src', _twaver.getImageSrc(toggleImage));
                style = image.style;
                style.verticalAlign = 'middle';
                image._expandData = rowInfo;
                div.appendChild(image);

                this.renderCategory(rowDiv, rowInfo);
                this.onCategoryRendered(rowDiv, rowInfo);
            }

            // property
            else {
                var property = rowInfo.property;
                var cell = this.__cellPool.get();
                rowInfo.nameRender = cell;

                style = cell.style;
                if (this._currentRowIndex === i) {
                    style.backgroundColor = this.getSelectColor();
                }
                style.position = 'absolute';
                style.verticalAlign = 'middle';
                style.textAlign = this._propertyNameHorizontalAlign;
                style.overflow = 'hidden';
                style.textOverflow = 'ellipsis';
                style.whiteSpace = 'nowrap';
                style.left = '0px';
                style.top = '0px';
                style.width = namepx;
                style.height = cellheightpx;
                style.borderStyle = 'solid';
                style.borderWidth = '0px';
                style.borderRightWidth = columnlinepx;
                style.borderRightColor = color;
                rowDiv.appendChild(cell);

                this.renderName(rowInfo);
                this.onNameRendered(rowInfo);

                cell = this.__cellPool.get();
                rowInfo.valueRender = cell;

                style = cell.style;
                style.position = 'absolute';
                style.verticalAlign = 'middle';
                style.textAlign = property.getHorizontalAlign();
                style.whiteSpace = 'nowrap';
                style.overflow = 'hidden';
                style.textOverflow = 'ellipsis';
                style.left = valueleftpx;
                style.top = '0px';
                style.width = valuepx;
                style.height = cellheightpx;
                style.borderStyle = 'solid';
                style.borderWidth = '0px';
                style.borderRightWidth = columnlinepx;
                style.borderRightColor = color;
                rowDiv.appendChild(cell);

                this.renderValue(rowInfo);
                this.onValueRendered(rowInfo);
            }
        }

        style = this._resizeDiv.style;
        style.left = indent + nameWidth - columnLineWidth - this._resizeTolerance + 'px';
        style.width = columnLineWidth + this._resizeTolerance * 2 + 'px';
        style.height = parent.style.height;
        parent.appendChild(this._resizeDiv);
    },
    renderCategory: function (div, categoryName) {
        var text = this.__textPool.get();
        var style = text.style;
        style.fontWeight = 'bold';
        style.whiteSpace = 'nowrap';
        style.overflow = 'hidden';
        style.textOverflow = 'ellipsis';
        style.verticalAlign = 'middle';
        style.padding = '1px 2px 1px 2px';
        text.innerHTML = categoryName;
        text.setAttribute('title', categoryName);
        div.appendChild(text);
    },
    onCategoryRendered: function (div, categoryName) {

    },
    renderName: function (params) {
        if (params.property.renderName) {
            params.property.renderName(params);
            return;
        }
        var text = this.__textPool.get();
        var style = text.style;
        style.fontWeight = '';
        style.whiteSpace = 'nowrap';
        style.verticalAlign = 'middle';
        style.padding = '1px 2px 1px 2px';
        var name = params.property.getName();
        if (!name) {
            name = params.property.getPropertyName();
        }
        text.innerHTML = name;
        text.setAttribute('title', name);
        params.nameRender.appendChild(text);
    },
    onNameRendered: function (params) {

    },
    renderValue: function (params) {
        var property = params.property;
        if (property.renderValue) {
            property.renderValue(params);
            return;
        }
        var value = params.value;
        var enumInfo = property.getEnumInfo(this._currentData);
        if (enumInfo && !Array.isArray(enumInfo)) {
            value = enumInfo.map[value];
        }
        if (params.view.isCellEditable(params.data, property)) {
            params.enumInfo = enumInfo;
            params.valueRender._editInfo = params;
        }
        params.valueRender.innerHTML = '';
        $render.render(property.getValueType(), value, params.valueRender, params.view, property.isInnerText());
    },
    onValueRendered: function (params) {

    },
    renderEditor: function(params){

    },
    onEditorRendered: function(params){

    },
    updateCurrentData: function () {
        this._currentData = this.getSelectionModel().getLastData();
    },
    validateImpl: function () {
        var oldLeft = this._view.scrollLeft;
        var oldTop = this._view.scrollTop;

        $html.release(this._dataDiv);

        this.updateCurrentData();
        this.validateModel();
        if (this.isAutoAdjustable()) {
            this.adjustWidth();
        }
        this.validateDisplay();

        this._pools.forEach(function (pool) {
            pool.clear();
        });

        if (this._view.scrollLeft !== oldLeft) {
            this._view.scrollLeft = oldLeft;
        }
        if (this._view.scrollTop !== oldTop) {
            this._view.scrollTop = oldTop;
        }
    },
    getValue: function (data, property) {
        if (!data) {
            return null;
        }
        return property.getValue(data, this);
    },
    setValue: function (data, property, value) {
        if (!data) {
            return;
        }
        property.setValue(data, value, this);
    },
    isCellEditable: function (data, property) {
        if (!data) {
            return false;
        }
        return this.isEditable() && property.isEditable();
    },
    getRowIndexAt: function (e) {
        var point = this.getLogicalPoint(e);
        if (!point) {
            return -1;
        }
        var row = parseInt(point.y / this._rowHeight);
        return (row >= 0 && row < this._rowList.size()) ? row : -1;
    },
    handleChange: function (e) {
        if (this._isCommitting || this._isCanceling || this._isValidating) {
            return;
        }
        if (e.target._editInfo && this.commitEditValue) {
            this.commitEditValue(e.target._editInfo, e.target);
        }
    },
    commitEditValue: function (editInfo, target) {
        var value;
        if (target.type === 'checkbox') {
            value = target.checked;
        } else {
            value = target.value;
        }
        var property = editInfo.property;
        var type = property.getValueType();
        if (type === 'int' && typeof value === 'string') {
            value = parseInt(value);
        }
        else if (type === 'number' && typeof value === 'string') {
            value = parseFloat(value);
        }
        else if (type === 'array.string') {
            value = value.split(',');
        }
        else if (type === 'array.number') {
            value = value.split(',');
            for (var i = 0, c = value.length; i < c; i++) {
                value[i] = parseFloat(value[i]);
            }
        }
        if(target._rowInfo){
            target._rowInfo.value = value;
            this.renderValue(target._rowInfo);
        }
        this.setValue(editInfo.data, property, value);
        twaver.Util.setFocus(this._view);
        if (this._currentEditor) {
            // this._rootDiv.removeChild(this._currentEditor);
            var parentNode = this._currentEditor.parentNode;
            parentNode && parentNode.removeChild(this._currentEditor);
            delete this._currentEditor;
        }
        delete this._isCommitting;
    },
    cancelEditing: function () {
        if (this._currentEditor) {
            // this._rootDiv.removeChild(this._currentEditor);
            var parentNode = this._currentEditor.parentNode;
            parentNode && parentNode.removeChild(this._currentEditor);
            delete this._currentEditor;
            delete this._isCanceling;
        }
    },
    updateCurrentRowIndex: function (newIndex) {
        var count = this._rowList.size();
        if (newIndex < 0 || newIndex >= count) {
            newIndex = -1;
        }
        var oldIndex = this._currentRowIndex,
        	rowInfo;
        if (newIndex !== oldIndex) {
            // clear select background color
            if (oldIndex >= 0 && oldIndex < count) {
                rowInfo = this._rowList.get(oldIndex);
                if (rowInfo.nameRender) {
                    rowInfo.nameRender.style.backgroundColor = '';
                }
            }
            this._currentRowIndex = newIndex;
        }
        if (newIndex >= 0) {
            rowInfo = this._rowList.get(newIndex);
            if (rowInfo.nameRender) {
                // update select background color
                rowInfo.nameRender.style.backgroundColor = this.getSelectColor();
                // update current editor
                if (!this._currentEditor) {
                    if (rowInfo.valueRender && rowInfo.valueRender._editInfo) {
                        var editInfo = rowInfo.valueRender._editInfo;
                        var editor = this.renderEditor && this.renderEditor(rowInfo);
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
                                        if (view._isCommitting) {
                                            return;
                                        }
                                        view._isCommitting = true;
                                        view.commitEditValue(e.target._editInfo, e.target);
                                    } else if (e.keyCode === 27) {
                                        view._isCanceling = true;
                                        view.cancelEditing();
                                    }
                                }, false);
                            }
                            this._currentEditor.addEventListener('blur', function (e) {
                                var view = e.target._editInfo.view;
                                if (view._isCommitting || view._isCanceling) {
                                    return;
                                }
                                view._isCommitting = true;
                                view.commitEditValue(e.target._editInfo, e.target);
                            }, false);
                            this._currentEditor.keepDefault = true;
                            this._currentEditor._rowInfo = rowInfo;
                            this._currentEditor._editInfo = editInfo;
                            if(!this._currentEditor.parentNode){
                                var style = this._currentEditor.style;
                                style.position = 'absolute';
                                style.margin = '0px';
                                style.border = '0px';
                                style.padding = '0px';
                                style.left = this._indent + this._propertyNameWidth + 'px';
                                style.top = rowInfo.rowDiv.style.top;
                                style.width = rowInfo.valueRender.style.width;
                                style.height = rowInfo.valueRender.style.height;
                                this._rootDiv.appendChild(this._currentEditor);
                            }
                            twaver.Util.setFocus(this._currentEditor);
                        }
                    }
                }
            }
        }
    }
});
