twaver.gis.Map = function(parent,id){
    this._parent = parent;
    //    this._type = !type? GISConsts.MAPTYPE_ORIGINAL:type;
    this._type = GISConsts.MAPTYPE_ORIGINAL;
    this.id = id;
    this._om = twaver.gis.util.MapFactory.createMap(parent,this._type,this.id+"om");
    this.content = this._om.content
};
var wrapCallback = function(callback){
        return function(pos){
            callback.method.call(callback.scope,pos);
        }
        
}
twaver.Util.ext('twaver.gis.Map',Object,{
	setEnableDoubleZoom:function(v){
		this._om.setEnableDoubleZoom(v);
	},
	isEnableDoubleZoom:function(){
		return this._om.isEnableDoubleZoom();
	},
	setEnableMouseWheel:function(v){
		this._om.canBeWheeled = v;
	},
	isEnableMouseWheel:function(){
		return this._om.canBeWheeled;
	},
    adjustBounds:function(rect){
        this._om.adjustBounds(rect);
    },
    getView:function(){
        return this.content;
    },
    installListeners:function(l){
        this._om.installListeners(l);
    },
    addLayer:function(name,type,path){
        this._om.addLayer(name,type,path);
    },
    removeAllLayers:function(){
        this._om.removeAllLayers();  
    },
    removeLayer:function(name){
        this._om.removeLayer(name);
    },
    setZoomLevel:function(zoom){
        this._om.setZoomLevel(zoom);
    },
    setZoomLowLimit:function(v){
        this._om.setZoomLowLimit(v);
    },
    setZoomUpLimit:function(v){
        this._om.setZoomUpLimit(v);
    },
    setCenter:function(center){
        this._om.setCenter(center);
    },
    getCenter:function(){
    	return this._om.center;
    },
    setSize:function(size){
        this._om.setSize(size);
    },
    setViewport:function(size){
        this._om.setViewport(size);
    },
    setPosition:function(p){
        this._om.setPosition(p);
    },
    addMouseListener:function(evtType,handlerName,scope){
        this._om.addMouseListener(evtType,handlerName,scope);
    },
    setBackgroundColor:function(color){
        this._om.setBackgroundColor(color);
    },
    getGeoPointFromPointOnMap:function(xOnMap,yOnMap){
        return this._om.getGeoPointFromPointOnMap(xOnMap,yOnMap);
    },
    getScreenPointFromGeoPoint:function(geoPoint){
        return this._om.getScreenPointFromGeoPoint(geoPoint);
    },
    addMapEventListener:function(listener,scope){
        this._om.addMapEventListener(listener,scope);
    },
    removeMapEventListener:function(listener,scope){
        this._om.removeMapEventListener(listener,scope);
    },
    getViewportBounds:function(){
        return this._om.viewportBounds;
    },
    setZoomLevels:function(levels){
       this._om.setZoomLevels(levels);
    },
    getZoomLevel:function(){
        return this._om.zoomLevel;
    },
    getProjectionType:function(){
        return this._om.projectionType;
    },
    setSynComponent:function(obj){  
        this._om.setSynComponent(obj);
    },
    setPanFunction:function(foo,scope){
        this._om.permitPanFunction = foo;
        this._om.permitPanFunction.scope = scope;
    },
    setProjectionType:function(type){
        this._om.setProjectionType(type);
    },
    setPadding:function(){
        if(arguments.length==1){
            this._om.setPadding(arguments[0]);
        }else if(arguments.length==4)
            this._om.setPadding(arguments[0],arguments[1],arguments[2],arguments[3]);
    },
    setMargin:function(){
        if(arguments.length==1){
            this._om.setMargin(arguments[0]);
        }else if(arguments.length==4)
            this._om.setMargin(arguments[0],arguments[1],arguments[2],arguments[3]);
    },
    setBorder:function(){
        if(arguments.length==1){
            this._om.setBorder(arguments[0]);
        }else if(arguments.length==4)
            this._om.setBorder(arguments[0],arguments[1],arguments[2],arguments[3]);
    },
    installGadget:function(gadget,p){
        var v = gadget;
        if(gadget.getView){
            v = gadget.getView();
        }
        if(p){
        	v.style.position="absolute";
        	if(p.x){
        		v.style.left = p.x+"px";
        	}
        	if(p.y)
            	v.style.top = p.y + "px";
            if(p.right)
            	v.style.right = p.right+"px";
            if(p.bottom)
            	v.style.bottom = p.bottom+"px";
            if(p.top)
            	v.style.top = p.top+"px";
        }
       
        this._om.installGadget(v);
    },
    toImage:function(size,watermark){
        try{
            return this._om.toImage(size,watermark);
        
        }
        catch(e){
            alert("Please refert to CORS settings");
        }
        return null;
        
    },
    setMarks:function(marks){
        this._om.setMarks(marks);
    },
    autoResizeByCss:function(){
        this._om.autoResizeByCss();
    },
    
    stopGetLocation:function(id){
      if(navigator.geolocation){
          navigator.geolocation.clearWatch(id);
      }  
    },
    getGeoLocation:function(type,sc,eh){
        if(navigator.geolocation){
            switch(type){
                case GISConsts.REQUIRE_GEO_TYPE_SHOT:
                    navigator.geolocation.getCurrentPosition(
                                    wrapCallback(sc),wrapCallback(eh))
                    return null;
                case GISConsts.REQUIRE_GEO_TYPE_REPEAT:
                    var watchId = navigator.geolocation.watchPosition(
                                    wrapCallback(sc),wrapCallback(eh))
                    return watchId;
                default:
                    return null;
            }
        }else{
            var error = new Error(MapUtils.getString("Your browser does not support GeoLocation"));
            if(eh && eh.method && eh.scope){
                
                eh.method.call(eh.scope,error);
                
            }
            throw error;
        }
    },
    setPermitCrossDomain:function(v){
        this._om.setPermitCrossDomain(v);
    },
    isPermitCrossDomain:function(){
        return this._om.permitCrossDomain;
    },
    getAppropriateZoomLevel:function(bbox){
    	return this._om.getAppropriateZoomLevel(bbox);
    },
    finishPan:function(start,to){
    	this._om.finishPan(start,to);
    },
    move:function(xoffset,yoffset){
        this._om.move(xoffset,yoffset);
    },
    pan:function(start,to){
    	this._om.pan(start,to);
    },
    addMark:function(mark){
    	this._om.addMark(mark);
    },
    enableCombinationInteraction:function(v){
    	this._om.enableDrag = v;
    	this._om.canBeWheeled = v;
    	this._om._enableDoubleZoom = v;
    },
});
