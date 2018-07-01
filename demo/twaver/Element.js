twaver.Element = function (id) {
    this._styleMap = this._styleMap || {};
    this._alarmState = new twaver.AlarmState(this);
    twaver.Element.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Element', twaver.Data, {
    IElement: true,
    IStyle: true,
    __accessor: ['layerId'],
    __bool: ['visible','movable'],
    __style: 1,
    _layerId: $Defaults.LAYER_DEFAULT_ID,
    _visible: true,
    _movable: true,
    getAlarmState: function () {
        return this._alarmState;
    },
    isAdjustedToBottom: function () {
        return false;
    },
    getElementUIClass: function () {
        return null;
    },
    getCanvasUIClass: function () {
        return null;
    },
    getVectorUIClass : function(){
    	return null;
    },
    s : function(style,value){
    	if(value === undefined){
    		return this.getStyle(style);
    	}else{
    		this.setStyle(style,value);
    		return this;
    	}
    },
});
