var OriginalLayer = function(name,type,sp,bbox,tw,th){
    
    this.name = !name? "default":name;
    this.servicePath = sp;
    this.tiles = [];
    this.tileWidth = !tw? 256:tw;
    this.tileHeight = !th? 256:th;
    this.recreate = false;
    this.anchorScreenPoint = null;
    this.center = GISConsts.ORIGINAL_GEO;
    this.geoBounds = bbox;
    this._relativeLayers = null;
    this.x = 0;
    this.y = 0;
    this.initContent();
    this.zoomLevel = 0;
    this.setExecutorType(type);
    
};
twaver.Util.ext(OriginalLayer,Object,{
    setCenter:function(c){
        if(!MapUtils.equals(this.center,c)){
            this.center = c;
            this.onCenterChanged();
        }
    },
    setZoomLevel:function(z){
        z = Math.floor(z);
        if(this.zoomLevel!==z){
            this.zoomLevel = z;
            this.onZoomLevelChanged();
        }
    },
    setViewport:function(v){
        
        if(!MapUtils.equals(this.viewrect, v)){
            this.viewrect = v;
            this.onViewportChanged();
        }
    },
    onViewportChanged:function(){
        //recalculate tiles array
        var a = 2;
        for(var i=0;i<10;i++){
            a = a/2;
        }
        var x = this.viewrect.width/2;
        var y = this.viewrect.height/2;
        this.anchorScreenPoint = {
            x:x,y:y
        };
        this.relocateTiles(this.center,this.zoomLevel);
    },
    initContent : function(){
        this.content = document.createElement("div");
        this.content.setAttribute("class","tlayer");
        this.content.setAttribute("id","ln"+this.name);
    },
    setExecutorType:function(type){
        if((type==undefined) || (type==null)||(type<GISConsts.EXECUTOR_TYPE_GEOSERVER_WMS) || (type>GISConsts.EXECUTOR_TYPE_GOOGLELABEL)){
            throw new Error("Please input validate executor type to create a layer!");
        }
        if(this.executorType !== type){
            this.executorType = type;
            this.onExecutorTypeChanged();
        }
    },
    onExecutorTypeChanged:function(){
        if(this._executor){
            this._executor = null;
        }
        this._executor = createExecutor(this.executorType);
        if(this.servicePath){
            this._executor.service = this.servicePath;
        }
        this.projectionType = this._executor.projectionType;
        this._executor.layer = this;
        this._executor.setLayerBounds(this.geoBounds);
        this.relocateTiles(this.center,this.zoomLevel);
    },
    setServicePath:function(path){
        if(this.servicePath!==path){
            this.servicePath = path;
            if(this.executor){
                this.executor.service = this.servicePath;
            }
        }
    },
    onZoomLevelChanged:function(){
        this.relocateTiles(this.center,this.zoomLevel);
    },
    onServicePathChanged:function(){
        if(this._executor!=null){
            this._executor.service = this.servicePath;
        }
    },
    onCenterChanged:function(){
        this.relocateTiles(this.center,this.zoomLevel);
    },
    release:function(){
        this.clearTiles();
    },
    reset:function(){
        this.relocateTiles(this.center,this.zoomLevel);
    },
    installTiles:function(){
        if((this.tiles != null)&&(this.tiles.length>0)){
             var tempDOM = document.createElement("div");
             for(var ai=0;ai<this.tiles.length;ai++){
                var rArray = this.tiles[ai];
                for(var i = 0;i<rArray.length;i++){
                    var tile = rArray[i];
                       tempDOM.appendChild(tile.content);
                }
             }
             if(this._tilesDOM)
                 this.content.removeChild(this._tilesDOM);
             this.content.appendChild(tempDOM);
             this._tilesDOM = tempDOM;
        }
    },
    pan:function(xOffset,yOffset){
        if(this.tiles){
             if((this.tiles != null)&&(this.tiles.length>0)){
             for(var ai=0;ai<this.tiles.length;ai++){
                var rArray = this.tiles[ai];
                for(var i = 0;i<rArray.length;i++){
                    var tile = rArray[i];
                    MapUtils.setDOMPosition(tile.content, tile.x+xOffset, tile.y+yOffset);
                }
             }
        }
        }
    },
    
    recreateTiles:function(rows,cols){
        this.tiles = [];
        for(var row = 0;row<rows;row++){
            this.tiles[row] =[];
            for(var col=0;col<cols;col++){
                this.tiles[row][col] = new Tile(this.projectionType,0,0,this.zoomLevel);
            }
        }
    },
    getCoveredTilesBounds:function(anchorTile){
        return this._executor.getCoveredTilesBounds(anchorTile);
    },
    relocateTiles:function(geo,zoom){
        if((this.viewrect!=null)&&(this._executor != null)){
            if(!zoom || (zoom == -1)){
                zoom = this.zoomLevel;
            }
            this._executor.relocateTiles(geo,zoom);				
            this.zoomLevel = zoom;
        }	
    },
    reloadTile:function(area){
        if((this.tiles != null)&&(this.tiles.length>0)){
            for(var rArray in this._tiles){					
                for(var tile in rArray){
                    if(tile.geoBounds.intersects(area)
                        ||area.contains(tile.geoBounds)
                        ||(tile.geoBounds.contains(area))){
                        var url = this.executor.acquireTileURL(tile);
                        this.releaseImageCache(url);
                        tile.release();
                        tile.loadImage(url,true);
                    }
                }				
            }
        }
    },
    setPosition:function(p){
        if((this.x!==p.x) && (this.y!==p.y)){
            this.x = p.x;
            this.y = p.y;
            this.relocateTiles(this.center,this.zoomLevel);
        }        
    },
    getRelativeLayers:function(){
        if(!this._relativeLayers){
            this._relativeLayers = [this.name];
        }
        return this._relativeLayers;
    },
    setRelativeLayers:function(layers){
        if(layers){
            this._relativeLayers = layers;
        }
    },
    printToImage:function(g){
        for(var row = 0;row<this.tiles.length;row++){
            for(var col=0;col<this.tiles[row].length;col++){
                var tile = this.tiles[row][col];
                g.drawImage(tile.content,tile.x,tile.y);
            }
        }
    },
    closeOutput:function(){
//        for(var row = 0;row<this.tiles.length;row++){
//            for(var col=0;col<this.tiles[row].length;col++){
//                var tile = this.tiles[row][col];
//                tile.content.crossOrigin = tile.old;
//            }
//        }
    }
    
});
