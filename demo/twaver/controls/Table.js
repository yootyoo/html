twaver.controls.Table = function (dataBox) {
    this._checkColumn = new twaver.Column();
    this._checkColumn.setName('check');
    this._checkColumn.setEditable(true);
    this._checkColumn.setWidth(40);
    this._checkColumn.setHorizontalAlign('center');
    this._checkColumn.renderCell = this.renderCheckCell;
    var self = this;
    this._checkColumn.getValue = function (data, column) {
        return self.isSelected(data);
    };

    twaver.controls.Table.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.controls.Table', twaver.controls.TableBase, {
    __accessor: ['rowHeight', 'rowLineWidth', 'rowLineColor', 'columnLineWidth', 'columnLineColor',
        'sortFunction', 'visibleFunction', 'sortColumn'],

    __bool: ['editable', 'makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],

    _editable: $Defaults.TABLE_EDITABLE,
    _rowHeight: $Defaults.TABLE_ROW_HEIGHT,
    _rowLineWidth: $Defaults.TABLE_ROW_LINE_WIDTH,
    _rowLineColor: $Defaults.TABLE_ROW_LINE_COLOR,
    _columnLineWidth: $Defaults.TABLE_COLUMN_LINE_WIDTH,
    _columnLineColor: $Defaults.TABLE_COLUMN_LINE_COLOR,
    _makeVisibleOnSelected: $Defaults.TABLE_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: $Defaults.TABLE_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: $Defaults.TABLE_KEYBOARD_SELECT_ENABLED,

    getCheckColumn: function () {
        return this._checkColumn;
    },
    isCheckMode: function () {
        return this._columnBox.contains(this._checkColumn);
    },
    setCheckMode: function (value) {
        if (value === this.isCheckMode()) {
            return;
        }
        delete this._focusedRow;
        if (value) {
            this._columnBox.add(this._checkColumn, 0);
        } else {
            this._columnBox.remove(this._checkColumn);
        }
        this.firePropertyChange('checkMode', !value, value);
    },
    renderCheckCell: function (params) {
        var checkBox = params.view._booleanPool.get();
        checkBox.disabled = false;
        checkBox.type = 'checkbox';
        checkBox.style.margin = '0px 2px';
        checkBox.style.verticalAlign = 'middle';
        checkBox.checked = params.selected;
        var div = params.div;
        div.appendChild(checkBox);
        if (div.style.textAlign === '') {
            div.style.textAlign = 'center';
        }
        checkBox._checkData = params.data;
    }
});
