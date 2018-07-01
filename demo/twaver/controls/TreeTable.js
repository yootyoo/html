twaver.controls.TreeTable = function (dataBox) {
    this._treeColumn = new twaver.Column();
    this._treeColumn.setName('tree');
    this._treeColumn.setWidth(120);
    this._treeColumn.renderCell = this.renderTreeCell;
    this._treeColumn.getValue = this.getTreeValue;
    this._treeColumn.setValue = this.setTreeValue;

    this._initTree(dataBox);
    twaver.controls.TreeTable.superClass.constructor.apply(this, arguments);

    this._columnBox.add(this._treeColumn);
};
_twaver.ext('twaver.controls.TreeTable', twaver.controls.TableBase, {
    __tree: 1,

    __accessor: ['sortFunction', 'visibleFunction', 'checkMode', 'rootData', 'sortColumn',
        'indent', 'rowHeight', 'rowLineWidth', 'rowLineColor', 'columnLineWidth', 'columnLineColor',
        'expandIcon', 'collapseIcon', 'uncheckableStyle','lineType',
        'lineColor','lineThickness','lineAlpha','lineDash'],

    __bool: ['editable', 'rootVisible', 'makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],

    _editable: $Defaults.TREETABLE_EDITABLE,
    _indent: $Defaults.TREETABLE_INDENT,
    _rowHeight: $Defaults.TREETABLE_ROW_HEIGHT,
    _rowLineWidth: $Defaults.TREETABLE_ROW_LINE_WIDTH,
    _rowLineColor: $Defaults.TREETABLE_ROW_LINE_COLOR,
    _columnLineWidth: $Defaults.TREETABLE_COLUMN_LINE_WIDTH,
    _columnLineColor: $Defaults.TREETABLE_COLUMN_LINE_COLOR,
    _makeVisibleOnSelected: $Defaults.TREETABLE_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: $Defaults.TREETABLE_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: $Defaults.TREETABLE_KEYBOARD_SELECT_ENABLED,
    _expandIcon: $Defaults.TREETABLE_EXPAND_ICON,
    _collapseIcon: $Defaults.TREETABLE_COLLAPSE_ICON,
    _lineType:$Defaults.TREE_LINE_TYPE,
    _lineColor:$Defaults.TREE_LINE_COLOR,
    _lineThickness:$Defaults.TREE_LINE_THICKNESS,
    _lineAlpha:$Defaults.TREE_LINE_ALPHA,
    _lineDash:$Defaults.TREE_LINE_DASH,

    getTreeColumn: function () {
        return this._treeColumn;
    },

    renderTreeCell: function (params) {
        params.view._renderTree(params.div, params.data, params.rowIndex, params.selected);
    },

    getTreeValue: function (data, table) {
        return table.getLabel(data);
    },

    setTreeValue: function (data, value, table) {
        data.setName(value);
    }
});
