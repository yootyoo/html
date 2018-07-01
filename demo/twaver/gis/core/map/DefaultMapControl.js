var DefaultMapControl = function(map){
    this._map = map;
    this.initMapEventListener();
};
twaver.Util.ext(DefaultMapControl, Object, {
    initMapEventListener:function(){
        this._map.addMapEventListneer(this.mapEventListener,this,true);
    },
    mapEventListener:function(e){
        switch(e.type){
            case twaver.gis.event.MapEvent.VIEWPORT_CHANGED:
                this.onViewportChanged(e);
                break;
            case twaver.gis.event.MapEvent.ZOOM_CHANGED:
                this.onZoomChanged(e);
                break;
            default:
                break;
        }
    },
    onViewportChanged:function(evt){
        
    },
    onZoomChanged:function(evt){
        
    }
});


