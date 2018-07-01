twaver.gis.event.MapEvent = function(type,source,attachment){
    this.type = type;
    this.source = source;
    this.attachment = attachment;
};
twaver.gis.event.MapEvent.SIZE_CHANGED = 0;
twaver.gis.event.MapEvent.VIEWPORT_CHANGED = 1;
twaver.gis.event.MapEvent.CENTER_CHANGED = 2;
twaver.gis.event.MapEvent.ZOOM_CHANGED = 3;
twaver.gis.event.MapEvent.UPLIMIT_CHANGED =4;
twaver.gis.event.MapEvent.LOWLIMIT_CHANGED = 5;
twaver.gis.event.MapEvent.LAYER_ADDED = 6;
twaver.gis.event.MapEvent.LAYER_REMOVED = 7;
twaver.gis.event.MapEvent.LAYER_EXECUTOR_CHANGED = 8;
twaver.gis.event.MapEvent.LAYER_ORDER_CHANGED = 9;
twaver.gis.event.MapEvent.LAYER_INDEX_CHANGED = 10;
twaver.gis.event.MapEvent.ALL_LAYERS_REMOVED = 11;
twaver.gis.event.MapEvent.CROSSDOMAIN_POLICY_CHANGED = 12;
twaver.Util.ext(twaver.gis.event.MapEvent, null, {
    toString:function(){
        return "MapEvent, type is "+this._type+(this.source?", source is "+this.source.toString():"");
    }
});



