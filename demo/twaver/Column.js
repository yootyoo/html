twaver.Column = function (id) {
    twaver.Column.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Column', twaver.Data, {
    IColumn: true,
    __property: 1,
    __accessor: ['width', 'horizontalAlign', 'valueType', 'propertyType', 'propertyName',
                 'editable', 'visible', 'sortable', 'resizable', 'movable',
                 'sortDirection', 'sortFunction', 'enumInfo'],
    __bool: ['innerText'],

    _innerText: $Defaults.COLUMN_INNER_TEXT,
    _width: $Defaults.COLUMN_WIDTH,
    _horizontalAlign: $Defaults.COLUMN_HORIZONTAL_ALIGN,
    _propertyName: null,
    _propertyType: $Defaults.COLUMN_PROPERTY_TYPE,
    _valueType: $Defaults.COLUMN_VALUE_TYPE,
    _editable: $Defaults.COLUMN_EDITABLE,
    _sortable: $Defaults.COLUMN_SORTABLE,
    _visible: $Defaults.COLUMN_VISIBLE,
    _resizable: $Defaults.COLUMN_RESIZABLE,
    _movable: $Defaults.COLUMN_MOVABLE,
    _sortDirection: 'asc', // 'desc', 'asc'
    _sortFunction: $Defaults.SORT_FUNCTION,
    _enumInfo: null, // {map:{1:'male', 2:'female'}, values:[1, 2]}  or  ['male', 'female']
    renderCell: $Defaults.COLUMN_RENDER_CELL,
    renderHeader: $Defaults.COLUMN_RENDER_HEADER,

    setParent: function (parent) {
        throw 'parent not supported';
    },
    getEnumInfo:function(){
        if(typeof this._enumInfo === "object"){
            return this._enumInfo;
        }else if(typeof this._enumInfo === "function"){
            if(arguments.length === 1){
                return this._enumInfo(arguments[0]);
            }else{
                return this._enumInfo();
            }
        }
    }
});
