twaver.controls.List = function (dataBox) {
    twaver.controls.List.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.controls.List', twaver.controls.ListBase, {
    __accessor: ['rowHeight', 'indent', 'rowLineWidth', 'rowLineColor',
        'sortFunction', 'visibleFunction'],

    __bool: ['makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],

    _checkMode: false,
    _rowHeight: $Defaults.LIST_ROW_HEIGHT,
    _indent: $Defaults.LIST_INDENT,
    _rowLineWidth: $Defaults.LIST_ROW_LINE_WIDTH,
    _rowLineColor: $Defaults.LIST_ROW_LINE_COLOR,
    _makeVisibleOnSelected: $Defaults.LIST_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: $Defaults.LIST_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: $Defaults.LIST_KEYBOARD_SELECT_ENABLED,

    isCheckMode: function () {
        return this._checkMode;
    },
    setCheckMode: function (v) {
        delete this._focusedRow;
        var oldValue = this._checkMode;
        this._checkMode = v;
        this.firePropertyChange("checkMode", oldValue, v);
    },
    isCheckable: function (data) {
        return this._checkMode === true;
    },
    renderData: function (div, data, row, selected) {
        var span;
        if (this._indent > 0) {
            span = this.__spanPool.get();
            span.style.width = this._indent + 'px';
            span.style.display = 'inline-block';
            div.appendChild(span);
        }

        var checkable = this.isCheckable(data);
        if (checkable) {
            this._addCheckBox(div, data, selected);
        }

        var icon = this.getIcon(data);
        if (icon) {
            this._addIcon(div, data, icon)
        }

        var label = this.getLabel(data);
        if (label) {
            span = this.__textPool.get();
            var style = span.style;
            style.whiteSpace = 'nowrap';
            style.verticalAlign = 'middle';
            style.padding = '1px 2px 1px 2px';
            style.display = 'inline-block';
            _twaver.setText(span, label, this._innerText);
            this.onLabelRendered(span, data, label, row, selected);
            div.appendChild(span);
        }

        if (this.isCheckMode()) {
            div.style.backgroundColor = this._focusedRow === row ? this.getSelectColor(data) : '';
        } else {
            div.style.backgroundColor = selected ? this.getSelectColor(data) : '';
        }
    },
    onLabelRendered: function (span, data, label, row, selected) {

    }

});
