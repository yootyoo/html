twaver.vector.LogicalZoomManager = function(network,sizeChange) {
	twaver.vector.LogicalZoomManager.superClass.constructor.apply(this, arguments);
	this.sizeChange = sizeChange;
};

_twaver.ext('twaver.vector.LogicalZoomManager', twaver.vector.BaseZoomManager, {
	
	getLocationZoom : function(){
		return this.getZoom();
	},
	
	getSizeZoom : function(ui){
		return this.sizeChange ? this.getZoom() : 1;
	},
});
