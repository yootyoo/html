var OriginalMap = function(parent,id){
    this._parent = parent;
    this.id = (!id)?"t-g-om":id;
    this._gadgets = {};
    this._gadgetIDIndex = 0;
    this.content = document.createElement("div");  
    this._marks = [];  
    this.markCanvas = CanvasUtils.getCanvas("mc");
    this._viewContent = document.createElement("div");
    this._layerContent = document.createElement("div");
    this.content.appendChild(this._viewContent);
    this.content.appendChild(this.markCanvas);
    this._dispatcher = new twaver.EventDispatcher();
    this._layerList = new twaver.List();
    this._layerNamePair = new twaver.List();
    this._layerMap = {};
    this.layerNum = 0;
    this.zoomLevel = 0;
    this.zoomUpLimit = 17;
    this.zoomLowLimit = 1;
    this.center = GISConsts.ORIGINAL_GEO;
    this.pannable = true;
    this.permitPanFunction = null;
    this.canBeWheeled = true;
    this.enableDrag = true;
    this._enableDoubleZoom = true;
    //this.viewportBounds
    this.init();
    this.x = 0;
    this.y = 0;
    this.addInteraction(new twaver.gis.interactions.DefaultMapInteraction(this));
    this._contextListeners = {};
    MapUtils.installMap(this._parent, this);
    this.adjustClip(this._size);
    this.synComponent = null;
};
var findProximalIndex = function(arr,value,ref){
    var up = value>=ref;
    if(up){
       for(var i=0;i<arr.length;i++){
            if(arr[i]>=value){
                return i;
            } 
       }
    }else{
       for(var i=arr.length-1;i>=0;i--){
            if(arr[i]<=value){
                return i;
            } 
       } 
    }
    return 0;
};
var calculateZoom = function(levels,zoom,ref){
    if(levels){
        var index = findProximalIndex(levels,zoom,ref);
        return levels[index];
    }else{
       return zoom; 
    }
};
twaver.Util.ext(OriginalMap,Object,{
	setEnableDoubleZoom:function(v){
		this._enableDoubleZoom = v;
	},
	isEnableDoubleZoom:function(){
		return this._enableDoubleZoom;
	},
    adjustBounds:function(rect){
        this.setSize({width:rect.width,height:rect.height});
        MapUtils.setDOMPosition(this.content, rect.x, rect.y);
    },
    initViewportStyle:function(){
        this._viewContent.setAttribute("class","om_viewport");
        //        this._viewContent.setAttribute("id",this.id+"-v");
        this._viewContent.setAttribute("style","position:absolute;'");
        this._viewContent.appendChild(this._layerContent);
        
    },
    initContentStyle:function(){
        this.content.setAttribute("class","om");
        this.content.setAttribute("id",this.id);
        this.content.setAttribute("style","position:absolute;left:0px;top:0px");
        this.markCanvas.style.cssText = "position:absolute";
       	twaver.gis.util.EventUtils.addEventListener(this.content,"contextmenu", function(evt){ 
            evt.preventDefault();
            return false;
        },this,true);
    },
    init:function(){
        if((this.content) && (this._parent)){
            this.initContentStyle();
            this.initViewportStyle(); 
            twaver.gis.util.EventUtils.addEventListener(this._parent,"resize",this.onParentDOMResized,this,false);
            //            this._parent.addEventListener("resize",this.onParentDOMResized,false);
            this.initMapChangedListener();
        }
    },
    setPermitCrossDomain:function(v){
        if(this.permitCrossDomain!=v){
            this.iterateLayersFor(function(layer){
                layer.permitCrossDomain = v;
            });
            this.permitCrossDomain = v;
            this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.CROSSDOMAIN_POLICY_CHANGED));
            
        }
        
    },
    onParentDOMResized:function(evt){
        var size = {
            width:this._parent.clientWidth,
            height:this._parent.clientHeight
        };
        this.setSize(size);
        
    },   
    initMapChangedListener:function(){
        this.addMapEventListener(this.defaultOnMapChanged,this);
    },
    defaultOnMapChanged:function(e){
        switch(e.type){
            case twaver.gis.event.MapEvent.SIZE_CHANGED:
                this.adjustViewport();
                break;
            case twaver.gis.event.MapEvent.LAYER_ADDED:
                this.onLayerAdded(e);
                break;
            case twaver.gis.event.MapEvent.CENTER_CHANGED:
                this.setLayersCenter(this.center);
                break;
            case twaver.gis.event.MapEvent.ZOOM_CHANGED:
                this.setLayersZoom(this.zoomLevel);
                break;
            case twaver.gis.event.MapEvent.UPLIMIT_CHANGED:
                break;
            case twaver.gis.event.MapEvent.LOWLIMIT_CHANGED:
                break;
            case twaver.gis.event.MapEvent.LAYER_REMOVED:
                break;
            case twaver.gis.event.MapEvent.LAYER_EXECUTOR_CHANGED:
                break;
            case twaver.gis.event.MapEvent.LAYER_ORDER_CHANGED:
                break;
            case twaver.gis.event.MapEvent.LAYER_INDEX_CHANGED:
                break;
            case twaver.gis.event.MapEvent.ALL_LAYERS_REMOVED:
                break;
            case twaver.gis.event.MapEvent.VIEWPORT_CHANGED:
                this.setLayersViewport(this.viewport);
                break;
            default:
                break;
        }
    },
    onLayerAdded:function(evt){
        var layer = evt.attachment.layer;
        var layerGeoBounds = layer.geoBounds;
        var mapGeoBounds = this.geoBounds;
        this.projectionType = layer.projectionType;
        if(!mapGeoBounds && layerGeoBounds){
            this.setGeoBounds(layerGeoBounds);
        }else if(mapGeoBounds && layerGeoBounds){
            var minlat = Math.min(mapGeoBounds.minLat,layerGeoBounds.minLat);
            var minlng = Math.min(mapGeoBounds.minLng,layerGeoBounds.minLng);
            var maxlat = Math.max(layerGeoBounds.maxLat,mapGeoBounds.maxLat);
            var maxlng = Math.max(layerGeoBounds.maxLng,mapGeoBounds.maxLng);
            this.setGeoBounds(new twaver.gis.geometry.GridBbox(minlat, minlng, maxlat, maxlng));
        }
        layer.setPosition({
            x:this.x,
            y:this.y
        });
        layer.setViewport(this.viewport);
        layer.setZoomLevel(this.zoomLevel);
        layer.setCenter(this.center);
    },
    iterateLayersFor:function(call){
        for(var i=0;i<this.layerNum;i++){
            var l = this._layerList.get(i);
            call(l);
        }
    },
    setLayersPosition:function(){
        this.iterateLayersFor(function(l){
            l.setPosition({
                x:this.x,
                y:this.y
            });
        });
    },
    covertStagePointToGeoCoordinate:function(pointOnMap){
        var x = pointOnMap.x;
        var y = pointOnMap.y;
        var coordinate = getGeoPointFromScreenPoint(x,y,
            this.viewportBounds,this.zoomLevel,this.projectionType);
        return coordinate;
    },
    relocate:function(pointOnMap,zoom){
        var targetGeo = this.covertStagePointToGeoCoordinate(pointOnMap);
        var c = {
            x:this.viewport.width/2,
            y:this.viewport.height/2
        };
        this.setZoomLevel(zoom);
        var pixelXOff = c.x - pointOnMap.x;
        var pixelYOff = c.y - pointOnMap.y;
        var targetPixel = getPixelXYFromGeoPoint(targetGeo,
            this.zoomLevel,this.projectionType);
        var index = (this.projectionType == GISConsts.PROJECTION_4326)? -1:1;
        this.setCenter(getGeoPointFromPixelXY(targetPixel.x + pixelXOff,
            targetPixel.y + index * pixelYOff,this.zoomLevel,this.projectionType)); 
       
    },
    setGeoBounds:function(bbox){
        if(!MapUtils.equals(this.geoBounds,bbox)){
            this.geoBounds = bbox;
            if(!this.center){
               this.setCenter(new twaver.gis.geometry.GeoCoordinate((bbox.maxLat+bbox.minLat)/2,(bbox.maxLng+bbox.minLng)/2)); 
            }
        }
    },
    calculateViewportBounds : function(){
        if(this.viewport && this.center){
            var pixelxy = getPixelXYFromGeoPoint(this.center,this.zoomLevel,this.projectionType);
            var x = pixelxy.x - this.viewport.width / 2;
            var y = pixelxy.y - this.viewport.height / 2;
            return new twaver.gis.geometry.Bounds(x,x+this.viewport.width,y,y+this.viewport.height);
        }
        return new twaver.gis.geometry.Bounds();
    },
    setZoomLowLimit:function(v){
        if(v<0){
            v = 0;
        }
        this.zoomLowLimit = v;
        if(this._levels){
            if(this._levels[0]<v){
                this._levels[0] = v;
                this.setZoomLevel(this.zoomLevel);
            }
        }
    },
    setZoomUpLimit:function(v){
        this.zoomUpLimit = v;
        if(this._levels){
            var i = this._levels.length-1;
            if(this._levels[i]>v){
                this._levels[i] = v;
                this.setZoomLevel(this.zoomLevel);
            }
        }
    },
    setZoomLevels:function(levels){
        this._levels = levels;
        this.setZoomLevel(this.zoomLevel);
    },
    
    setZoomLevel:function(z){
        z = z>this.zoomUpLimit? this.zoomUpLimit:z;
        z = z<this.zoomLowLimit? this.zoomLowLimit:z;
        z = calculateZoom(this._levels,z,this.zoomLevel);
        if(this.zoomLevel != z){
            var old = this.zoomLevel;
            this.zoomLevel = z;
            this.viewportBounds = this.calculateViewportBounds();
            this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.ZOOM_CHANGED, 
                this, {
                    oldValue:old,
                    newValue:z
                }));
            this.paintMarks();
        }
    },
    setLayersZoom:function(z){
        this.iterateLayersFor(function(l){
            l.setZoomLevel(z);
        });
    },
    setPosition:function(p){
        if((this.x!==p.x)&&(this.y!==p.y)){
            this.x = p.x;
            this.y = p.y;
            this.setLayersPosition();
        }        
    },
    setCenter:function(c){
        var b = __isPermissionGIS();
        if(!b){
            return;
        }
        if(!MapUtils.isValidateGeo(c)){
            this.reloadLayers();
            return;
        }
        if(!MapUtils.equals(this.center, c)){
            var old = this.center;
            this.center = c;      
            this.viewportBounds = this.calculateViewportBounds();
            this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.CENTER_CHANGED,
                this,{
                    oldValue:old,
                    newValue:this.center
                }));
            this.paintMarks();
        }
    },
    reloadLayers:function(){
        this.iterateLayersFor(function(l){
            l.onCenterChanged();
        });
    },
    setLayersCenter:function(c){
        this.iterateLayersFor(function(l){
            l.setCenter(c);
        });
    },
    appendChild:function(div){
        this._viewContent.appendChild(div);  
    },
    adjustClip:function(size){
        if(!size)
            size = this._size;
        if(!size)
            return;
        var outborder = MapUtils.getDOMOutborder(this._viewContent);
        var clipcss = 'rect('+outborder.top+'px,'
        +(size.width+outborder.left)+'px,'
        +(size.height+outborder.top)+'px,'+outborder.left+'px)';
        if(this.content.style){
            //top right bottom left
            this._viewContent.style.clip = clipcss;
        } 
    },
    setSize:function(size){
        if(!MapUtils.equals(this._size, size)){
            var old = this._size;
            this._size = size;
            if(this.content){
                MapUtils.setDOMSize(this.content, size);
                this.markCanvas.width = size.width;
                this.markCanvas.height = size.height;
                this.setViewport(size);
                this.adjustClip(size);
                this.synchronizeSizeChanged();
            }            
        }
    },
    setViewport:function(vp){
        if(!MapUtils.equals(this.viewport, vp)){
            var old = this.viewport;
            this.viewport = vp;
            this.viewportBounds = this.calculateViewportBounds();
            this.adjustViewport();
            this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.VIEWPORT_CHANGED,
                this,{
                    oldValue:old,
                    newValue:vp
                }))
        }        
    },
    adjustViewport:function(){
    },
    setLayersViewport:function(vp){
        this.iterateLayersFor(function(l){
            l.setViewport(vp);
        })
    },
    addLayer:function(name,executorType,servicePath,bbox,styles){
        var layer;
        if(this.contains(name)){
            layer = this.getLayer(name);
            layer.setExecutorType(executorType);
        }else{
            bbox = !bbox? GISConsts.WORLD_GRIDBBOX:bbox;
            layer = new OriginalLayer(name,executorType,servicePath,bbox);
            layer.permitCrossDomain = this.permitCrossDomain;
            this.addLayerInstance(name,layer);
        }
    },
    addLayerInstance:function(name,layer){
        this._layerList.add(layer);
        this.layerNum++;
        this._layerMap[name] = layer;
        this._layerNamePair.add(name,layer);
        //        this._viewContent.appendChild(layer.content);
        this._layerContent.appendChild(layer.content);
        MapUtils.setZIndex(layer.content, GISConsts.LAYER_BASE_ZINDEX+this.layerNum);
        this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.LAYER_ADDED,
            this,{
                layer:layer
            }));
    },
    indexOfLayer:function(name){
        var layer = this.getLayer(name);
        return this._layerList.indexOf(layer);
    },
    moveLayerTo:function(flag,index){
        if((index>this.layerNum) || (index<0)){
            throw new Error("Invalid index in moving layer to specified index: "+index);
        }
        var layer = this.getLayer(flag);
        if(layer){
            var oi = this.indexOf(layer);
            if(oi>-1){
                if(oi !== index){
                    this._layerList.set(index,layer);
                    for(var i=index;i<this._layerNum;i++){
                        var l = this._layerList.get(i);
                        MapUtils.setZIndex(l.content,GISConsts.LAYER_BASE_ZINDEX+i);
                    }
                    this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.LAYER_INDEX_CHANGED,
                        this, {
                            layer:layer,
                            oldValue:oi,
                            newValue:index
                        }));
                }     
            }
        }        
    },
    moveLayerToBottom:function(flag){
        this.moveLayerTo(flag,0);
    },
    moveLayerToTop:function(flag){
        this.moveLayerTo(flag,this.layerNum);
    },
    removeLayer:function(flag){
        var layer = this.getLayer(flag);
        if(layer){
            this._layerMap[layer.name] = null;
            delete this._layerMap[layer.name];
            this.removeLayerInstance(layer);
        }
    },
    removeLayerInstance:function(layer){
        this._layerList.remove(layer);
        this.layerNum--;
        //        this._viewContent.removeChild(layer.content);
        this._layerContent.removeChild(layer.content);
        this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.LAYER_REMOVED,
            this, {
                layer:layer
            }))
    },
    
    removeAllLayers:function(){
        var num = this.layerNum;
        for(var i = 0;i<num;i++){
            var layer = this._layerList.get(i);
            //            this._viewContent.removeChild(layer.content);   
            this._layerContent.removeChild(layer.content);
        }
        this._layerList = new twaver.List();
        this._layerMap = new Object();
        this.layerNum = 0;
        this.fireEvent(new twaver.gis.event.MapEvent(twaver.gis.event.MapEvent.ALL_LAYERS_REMOVED,
            this, {}));
    },
    contains:function(name){
        if(this.getLayer(name))
            return true;
        return false;
    },
    getLayer:function(flag){
        var type = typeof flag;
        if("string" === type){
            return this._layerMap[flag];
        }else if("number" === type){
            return this._layerList.get(flag);
        }
        throw new Error("The flag "+flag+" is invalidate.");
        
    },
    addMapEventListener:function(listener,scope){
        this._dispatcher.add(listener,scope);
    },
    fireEvent:function(evt){
        this._dispatcher.fire(evt);
    },
    removeMapEventListener:function(listener,scope){
        this._dispatcher.add(listener,scope);
    },
    getGeoPointFromPointOnMap:function(xOnMap,yOnMap){
        xOnMap = xOnMap - this.x;
        yOnMap = yOnMap - this.y;
        return getGeoPointFromScreenPoint(xOnMap,yOnMap,
            this.viewportBounds,this.zoomLevel,this.projectionType);
    },
    getScreenPointFromGeoPoint:function(geoPoint){
        var p =  getScreenPointFromGeoPoint(geoPoint,this.viewportBounds,
            this.zoomLevel,this.projectionType);
        return {
            x:p.x + this.x,
            y:p.y + this.y
        };
    },
    repaint:function(bbox){
        if(this._layerList){
            if(!bbox){
                bbox = this.geoBounds;
            }
            for(var i=0;i<this.layerNum;i++){
                var layer = this._layerList.get(i);
                layer.reloadTile(bbox);                                             
            }
            this.paintMarks();
        }
    },
    addInteraction:function(interaction){
        if(interaction.onKeyDown){
            twaver.gis.util.EventUtils.addEventListener(this.content, "onkeydown", interaction.onKeyDown, interaction, false);
        }
        if(interaction.onMouseDown){
            twaver.gis.util.EventUtils.addEventListener(this.content, "mousedown", interaction.onMouseDown, interaction, false);
        }
        if(interaction.onMouseMove){
            twaver.gis.util.EventUtils.addEventListener(this.content, "mousemove", interaction.onMouseMove, interaction, false);
        }
        if(interaction.onMouseUp){
            twaver.gis.util.EventUtils.addEventListener(this.content, "mouseup", interaction.onMouseUp, interaction, false);
        }
        if(interaction.onMouseWheel){
            if(twaver.Util.isFirefox){
                twaver.gis.util.EventUtils.addEventListener(this.content, "DOMMouseScroll", interaction.onMouseWheel, interaction, false);
            }else{
                twaver.gis.util.EventUtils.addEventListener(this.content, "mousewheel", interaction.onMouseWheel, interaction, false);
            }
        }
        if(interaction.onDBClick){
            twaver.gis.util.EventUtils.addEventListener(this.content, "dblclick", interaction.onDBClick, interaction, false);
        }
        if(interaction.onTouchStart){
            twaver.gis.util.EventUtils.addEventListener(this.content, "touchstart", interaction.onTouchStart, interaction,false);
        }
        if(interaction.onTouchEnd){
            twaver.gis.util.EventUtils.addEventListener(this.content, "touchend", interaction.onTouchEnd, interaction,false);
        }
        if(interaction.onTouchMove){
            twaver.gis.util.EventUtils.addEventListener(this.content, "touchmove", interaction.onTouchMove, interaction,false);
        }
    },
    canBePanned:function(){
        var v = (this.permitPanFunction!=null)? this.permitPanFunction.call(this.permitPanFunction.scope):true;
        return this.pannable && v;
    }, 
    setSynComponent:function(syn){
        var self = this;
        if(self.synComponent !== syn){
            var div = self.synComponent;
            if(div && div.getView){
                div = div.getView();
            }
            if(div){
                self._viewContent.removeChild(div);
                div.removeChild(self.markCanvas);
            }
            
            self.synComponent = syn;
            div = syn;
            if(syn && syn.getView){
                div = syn.getView();
            };
            if(syn){
                self.appendChild(div);
                div.appendChild(self.markCanvas);
                self.adjustClip();
                self.synchronizeSizeChanged();
            }else{
                self.content.appendChild(self.markCanvas);
            }
        }
    },
    getSynComponent:function(){
        return this.synComponent;
    },
    finishPan:function(start,to){
        if(!this.panning) return;
        this.panning = false;
        var ceneterPixel = getPixelXYFromGeoPoint(this.center,this.zoomLevel,this.projectionType);
        var xOff = to.x - start.x;
        var yOff = to.y - start.y;
        var index = (this.projectionType == GISConsts.PROJECTION_4326)? -1:1;
        ceneterPixel = {
            x:ceneterPixel.x - xOff,
            y:ceneterPixel.y - index*yOff
        };
        var geo = getGeoPointFromPixelXY(ceneterPixel.x,ceneterPixel.y,
            this.zoomLevel,this.projectionType);
        MapUtils.setDOMPosition(this.markCanvas,0 ,0 );
        this.setCenter(geo); 
        if(this.synComponent){
            var div = this.synComponent.getView();
            var isNotNetwork = !div;        
            if(isNotNetwork){
                div = this.synComponent;
            }
            if(!isNotNetwork){
                this.finishPanningNetwork();
                
            }else{
                MapUtils.setDOMPosition(div,0 ,0 );
            }
        }
        
        
    },
    panNetwork:function(xOffset,yOffset){
        var n = this.synComponent;
        if(n){
            if(n.pan){
                n.pan(xOffset,yOffset);
            }else{
                if(!n.original){
                    n.original = MapUtils.getDOMPosition(n.getView());
                }
                var original = n.original;
                var tx = original.x + xOffset;
                var ty = original.y + yOffset;
                MapUtils.setDOMPosition(n.getView(),tx ,ty);
                n.moving = true; 
            }
           
        }
        
    },
    finishPanningNetwork:function(){
        var n = this.synComponent;
        if(n){
            n.validate();
            if(n.finishPan){
                    
                this.synComponent.finishPan();
                    
            }else{
                MapUtils.setDOMPosition(n.getView(),0,0 );
                n.moving = false;
            }
            
        }
    },
    pan:function(start,to){
        if(!this.canBePanned()){
            return;
        }
        this.panning = true;
        var xOffset = to.x - start.x;
        var yOffset = to.y - start.y;
        var x = this.x + xOffset;
        var y = this.y + yOffset;
        for(var i=0;i<this.layerNum;i++){
            var l = this._layerList.get(i);
            l.pan(xOffset,yOffset);
        }
        if(this.synComponent){
            var div = this.synComponent.getView();
            var isNotNetwork = !div;        
            if(isNotNetwork){
                div = this.synComponent;
            }

            if(!isNotNetwork){
                this.panNetwork(xOffset,yOffset);
            }else{
                if(!this.synComponent.original){
                    this.synComponent.original = MapUtils.getDOMPosition(div);
                }
                var original = this.synComponent.original;
                var tx = original.x + xOffset;
                var ty = original.y + yOffset;
                MapUtils.setDOMPosition(this.synComponent,tx ,ty );
                MapUtils.setDOMPosition(this.markCanvas,tx ,ty );
            }
            
        }
    },
    startDragging:function(){
        if(this.synComponent){
            var div = this.synComponent.getView();
            var isNotNetwork = !div;        
            if(!isNotNetwork){
                if(this.synComponent._linkCanvas){
                    var rg = this.synComponent._linkCanvas.getContext("2d");
                    var g = this.synComponent._offscreenCanvas.getContext("2d");
                    g.save();    
                    g.drawImage(this.synComponent._linkCanvas,0,0);               
                    g.restore();
                    var r = MapUtils.parseBounds(this.synComponent._offscreenCanvas);            
                    rg.clearRect(r.x,r.y,r.width,r.height);
                }  
            }
            
        }
         
    },
    addMouseListener:function(type,handler,scope){
        $html.addEventListener(type, handler, this.content, scope)
    },
    setBackgroundColor:function(color){
        MapUtils.setBackgroundColor(this.content,color);
    },
    setProjectionType:function(type){
        if(this.layerNum == 0){
            this.projectionType = type;
        }
    },
    setBorder:function(){
        var p = 'px';
        if(arguments.length==1){
            this.content.style['border-width'] = arguments[0]+p;
            this._borderWidth = arguments[0];
        }else if(arguments.length == 4){
            this.content.style['border-left-width'] = arguments[3]+p;
            this.content.style['border-top-width'] = arguments[0]+p;
            this.content.style['border-right-width'] = arguments[1]+p;
            this.content.style['border-bottom-width'] = arguments[2]+p;
            this._borderTopWidth = arguments[0];
            this._borderRightWidth = arguments[1];
            this._borderBottomWidth = arguments[2];
            this._borderLeftWidth = arguments[3];
        }
    },
    setPadding:function(){
        var p = 'px';
        var blank = " ";
        if(arguments.length==1){
            this.content.style.padding = arguments[0]+p;
            this._padding = arguments[0];
        }else if(arguments.length == 4){
            this.content.style.padding = arguments[0]+p
            +blank+arguments[1]+p+blank+arguments[2]+p
            +blank+arguments[3]+p;
            this._paddingTop = arguments[0];
            this._paddingRight = arguments[1];
            this._paddingBottom = arguments[2];
            this._paddingLeft = arguments[3];
        }
    },
    setMargin:function(){
        var p = 'px';
        var blank = " ";
        if(arguments.length==1){
            this.content.style.margin = arguments[0]+p;
            this._padding = arguments[0];
        }else if(arguments.length == 4){
            this.content.style.margin = arguments[0]+p
            +blank+arguments[1]+p+blank+arguments[2]+p
            +blank+arguments[3]+p;
            this._marginTop = arguments[0];
            this._marginRight = arguments[1];
            this._marginBottom = arguments[2];
            this._marginLeft = arguments[3];
        }
    },
    toImage:function(size,watermark){
        var canvas = CanvasUtils.getCanvas("temp-toImage");
        if(!size){
            size = this._size;
        }
        canvas.width = size.width;
        canvas.height = size.height;
        var g = CanvasUtils.getGraphic(canvas);
        this.printToImage(g);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    //        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        
    },
    printToImage:function(g){
        this.iterateLayersFor(function(l){
            l.printToImage(g);
        });
        g.drawImage(this.markCanvas,0,0);
        if(this.synComponent){
            if(this.synComponent._linkCanvas){
                g.drawImage(this.synComponent._linkCanvas,0,0);
            }
            if(this.synComponent.toCanvasByRegion){
                var c = this.synComponent.toCanvasByRegion({
                    x:0,
                    y:0,
                    width:this._size.width,
                    height:this._size.height
                    },1);
                g.drawImage(c,0,0);
            }
        }
        
    },
    closeLayer:function(){
        this.iterateLayersFor(function(l){
            l.closeOutput();
        })
    },
    setMarks:function(marks){
        this._marks = marks;
        this.paintMarks();
    },
    paintMarks:function(){
        //new added for marks
            var length = this._marks.length;
            var g = CanvasUtils.getGraphic(this.markCanvas);
            g.clearRect(0,0,this.markCanvas.width,this.markCanvas.height);
            for(var i=0;i<length;i++){
            	var mark = this._marks[i];
            	var p = getScreenPointFromGeoPoint(mark.geo,
            	this.viewportBounds,this.zoomLevel,this.projectionType);
            	mark.pos = p;
            	mark.paint(g);
            }
            this.paintArea(g);
    },
    setAreaMarkVisible:function(v){
    	this._areaVisible = v;
    	this.paintArea(CanvasUtils.getGraphic(this.markCanvas));
    },
    paintArea:function(g){
    	
    },
    installGadget:function(gadget){
        for(var index in this._gadgets){
            if(this._gadgets[index] === gadget){
                return null;
            }
        }
        this._gadgets[this._gadgetIndex] = gadget;
        var id = this._gadgetIndex;
        this._gadgetIndex++;
        this.content.appendChild(gadget);
        return id;
    },
    removeGadgetById:function(id){
        if(id in this._gadgets){
            var gadget = this._gadgets[id];
            delete this._gadgets[i];
            this.content.removeChild(gadget); 
        }
    },
    autoResizeByCss:function(){
        var style = MapUtils.getDOMStyle(this._parent);
        var size = null;
        if(style.width){
            size = {
                width:MapUtils.getFloat(style.width),
                height:MapUtils.getFloat(style.height)
                };
        }else if(this._parent.clientWidth){
            size = {
                width:this._parent.clientWidth,
                height:this._parent.clientHeight
                };
        }
        this.setSize(size);
    },
    synchronizeSizeChanged:function(){
        if(this.synComponent){
            if(this.synComponent.adjustBounds){
                this.synComponent.adjustBounds({
                    x:0,
                    y:0,
                    width:this._size.width,
                    height:this._size.height
                    });
            }
        }
    },
    getAppropriateZoomLevel:function(bbox){
    	return GISUtils.getAppropriateZoomLevel(bbox,this);
    },
    //new added for marks
    addMark:function(mark){
    	this._marks.push(mark);
    	this.paintMarks();
    },
    removeMark:function(mark){
    	var index = this._marks.indexof(mark);
    	if(index>=0){
    		this._marks.splice(index,1);
    	}
    	this.paintMarks();
    },
    clearMarks:function(){
    	this._marks = [];
    	this.paintMarks();
    },
    updateMark:function(mark){
    	var index = this._marks.indexof(mark);
    	if(index>=0)
    		this.paintMarks();
    }
});
