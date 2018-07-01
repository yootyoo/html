twaver.Property = function (id) {
    twaver.Property.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Property', twaver.Data, {
    IProperty: true,
    __property: 1,
    __accessor: ['horizontalAlign', 'valueType', 'editable',
                 'propertyType', 'propertyName', 'categoryName', 'enumInfo'],
    __bool: ['innerText'],

    _innerText: $Defaults.PROPERTY_INNER_TEXT,
    _horizontalAlign: $Defaults.PROPERTY_HORIZONTAL_ALIGN,
    _propertyName: null,
    _propertyType: $Defaults.PROPERTY_PROPERTY_TYPE,
    _valueType: $Defaults.PROPERTY_VALUE_TYPE,
    _editable: $Defaults.PROPERTY_EDITABLE,
    _categoryName: $Defaults.PROPERTY_CATEGORY_NAME,
    _enumInfo: null, // {map:{1:'male', 2:'female'}, values:[1, 2]}  or  ['male', 'female']
    renderName: $Defaults.PROPERTY_RENDER_NAME,
    renderValue: $Defaults.PROPERTY_RENDER_VALUE,
    isVisible: null, // function(data){ return visible or not}
    renderEditor: $Defaults.PROPERTY_RENDER_EDITOR,

    setParent: function (parent) {
        throw 'parent not supported';
    },
    setPropertyName: function (value) {
        var oldValue = this._propertyName;
        this._propertyName = value;
        this.firePropertyChange("propertyName", oldValue, value);
    },
    setPropertyType: function (value) {
        var oldValue = this._propertyType;
        this._propertyType = value;
        this.firePropertyChange("propertyType", oldValue, value);
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
