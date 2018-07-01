var BaseExecutor = function(){
    //		static var scaleArray:Array = [295829355.45,147914677.73,73957338.86,
    //			36978669.43,18489334.72,9244667.36,
    //			4622333.68,2311166.84,1155583.42,577791.71,288895.85,
    //			144447.93,72223.96,36111.98,18055.99,9028.00,4514.00,
    //			2257.00,1128.50,564.25,282.12,141.06,70.53];
		
		
    this.format = GISUtils.getGlobalSetting(GISSettings.MAPIMAGE_FORMAT);
    this.projectionType = GISConsts.PROJECTION_4326;
    this.srs = "";
    this.service = "";
    this.style = null;
};
twaver.Util.ext(BaseExecutor, Object, {
    setLayerBounds:function(bounds){
        if(bounds instanceof twaver.gis.geometry.GridBbox){
            this._layerBounds = bounds;
            this.initGridCache();
        }
    },
    acquireTileURL : function(tile){		
        var localCache = (this.service.indexOf(GISSettings.TILEMAP_LOCALECACHE_FLAG) >= 0);
        var matrixSize = getMatrixArea(tile.zoomLevel,this.projectionType);
        if(matrixSize==null) return null;
        if((tile.colIndex < 0)||(tile.colIndex >= matrixSize.width)||(tile.rowIndex < 0)||(tile.rowIndex >= matrixSize.height)){
            return null;
        }
        var url = "";
        if (!localCache) {
            url = this.acquireStandTileURL(tile);
        } else {
            // url = this.service + "/" + tile.zoom + "/" + tile.colIndex + "/"
            // + tile.rowIndex + "." + this.format;
            url = getWMSURL(this.service,tile,this.format);
        }
        return url;
    },
    isValidate:function(tile){
        var validGridArea = this.getCoveredGridOfZoomLevel(tile.zoomLevel);
        var r = (tile.colIndex >= validGridArea.minx) && (tile.rowIndex >= validGridArea.miny)
                    && (tile.colIndex <= validGridArea.maxx) && (tile.rowIndex <= validGridArea.maxy);
        return r;
    },
    getCoveredGridOfZoomLevel:function(zoom){
        var result = this.gridCache[zoom];
        return result;
    },
    initGridCache:function(){
        if(!this.gridCache){
            this.gridCache = [];
        }
        for(var i = 0; i<20;i++){
            var grid = this.getGridArea(i,this._layerBounds);
            this.gridCache[i] = {minx:grid[0],miny:grid[1],maxx:grid[2],maxy:grid[3]};
        }
    },
    getGridArea:function(zoom,layerBounds){
        var grid = [];
        var resolution = get4326Resolution(zoom);
        grid[0] = Math.floor(layerBounds.minLng + 180)/resolution;
        grid[1] = Math.floor(layerBounds.minLat + 90)/resolution;
        grid[2] = Math.ceil(layerBounds.maxLng + 180)/resolution - 1;
        grid[3] = Math.ceil(layerBounds.maxLat + 90)/resolution - 1;
        return grid;
    },
    acquireStandTileURL : function(tile){
        var url = this.service + 
        twaver.gis.ogc.util.WMSUtils.getURL(_$wmsp.GET_MAP,
            _$wmsp.WMS_VERSION_1_1_1,
            this.srs,tile.geoBounds,this.layer.getRelativeLayers(),null,this.format);
        return url;
    },		
    calculateTilePixelBounds : function(tile){	
        return calculateTilePixelBounds(tile,this.projectionType);
    },
    locateAnchorTile : function(anchorGeo,zoomLevel,tileWidth,tileHeight){		
        return locateAnchorTile(anchorGeo,zoomLevel,this.projectionType,tileWidth,tileHeight);
    },
    getPixelXYFromGeoPoint : function(geoPint,zoomLevel,tileWidth,tileHeight){
        return getPixelXYFromGeoPoint(geoPint,zoomLevel,this.projectionType,tileWidth,tileHeight);
    },
    getCoveredTilesBounds : function(anchorTile){
        return getCoveredTilesBounds(anchorTile,
            this.layer.anchorScreenPoint,
            this.layer.viewrect,this.projectionType);
    },
    getScaleInfoByZoomLevel : function(zoomLevel){
        return "";
    },
    correctAnchorTilePosition:function(referPoint,anchorTile){
        anchorTile.x = referPoint.x - anchorTile.upleft.x;
        anchorTile.y = referPoint.y + anchorTile.upleft.y;
    },
    locateTile : function(tile,anchorTile){			
        var location = {
            x:(tile.colIndex - anchorTile.colIndex) * tile.width + anchorTile.x,
            y:-(tile.rowIndex - anchorTile.rowIndex) * tile.height + anchorTile.y
            };
        tile.x = location.x;
        tile.y = location.y;
        tile.setLocation(location.x,location.y);
    },
    locateTiles:function(tiles,cols,rows,startCol,startRow,anchorTile,zoom){
        for(var row = 0;row<rows;row++){
            for(var col=0;col<cols;col++){
                var tile = tiles[row][col];
                tile.layer = this.layer;
                tile.zoomLevel = zoom;
                tile.colIndex = startCol + col;
                tile.rowIndex = startRow + row;		
                this.locateTile(tile,anchorTile);
                tile.initGeoBounds();
                if(this.isValidate(tile)){
                    
                    // if(this.layer.permitCrossDomain){
//              
                        // tile.content.crossOrigin = "Anonymous";
                    // }
                    tile.loadImage(this.acquireTileURL(tile));
                }
               
            }
        }
    },
    
    relocateTiles : function(geo,zoom){
        var layer = this.layer;
        var anchorTile = this.locateAnchorTile(geo,zoom,layer.tileWidth,layer.tileHeight);
        if(!anchorTile){
            return;
        }
        this.correctAnchorTilePosition(layer.anchorScreenPoint,anchorTile);
        var coveredTilesBounds = this.getCoveredTilesBounds(anchorTile);
        var matrix = new twaver.gis.geometry.Dimensize(coveredTilesBounds.maxx - coveredTilesBounds.minx +1,
            coveredTilesBounds.maxy - coveredTilesBounds.miny+1);
        var rows = matrix.height;
        var cols = matrix.width;
        layer.width = cols * layer.tileWidth;
        layer.height = rows * layer.tileHeight;
        layer.recreateTiles(rows,cols);	
        this.locateTiles(layer.tiles,cols,rows,coveredTilesBounds.minx,coveredTilesBounds.miny,anchorTile,zoom);
        layer.installTiles();
    }
});


