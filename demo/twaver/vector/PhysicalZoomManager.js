twaver.vector.PhysicalZoomManager = function(network){
	twaver.vector.PhysicalZoomManager.superClass.constructor.apply(this, arguments);	
};

_twaver.ext('twaver.vector.PhysicalZoomManager', twaver.vector.BaseZoomManager, {
	
	getGraphicsZoom : function(){
		return this.getZoom();
	},
  _invalidateZoom : function(){
    
  },
}); 