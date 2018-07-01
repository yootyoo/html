var OSMExecutor = function(){
    OSMExecutor.superClass.constructor.call(this);
    this.scaleArray = [295829355.45,147914677.73,73957338.86,
    36978669.43,18489334.72,9244667.36,
    4622333.68,2311166.84,1155583.42,577791.71,288895.85,
    144447.93,72223.96,36111.98,18055.99,9028.00,4514.00,
    2257.00,1128.50,564.25,282.12,141.06,70.53];
    this.projectionType = GISConsts.PROJECTION_MERCATOR;
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_OSM);
    this._layerBounds = GISConsts.WORLD_MERCATOR_BBOX;
};
twaver.Util.ext(OSMExecutor,BaseExecutor,{
    acquireStandTileURL:function(tile){
        var url = this.service + tile.zoomLevel + "/" + tile.colIndex + "/" + tile.rowIndex
        + "." + this.format;
        return url;
    },
    setLayerBounds:function(bounds){
        if(bounds instanceof twaver.gis.geometry.GridBbox){
            if(bounds.contains(this._layerBounds)){
                this._layerBounds.minLat = Math.max(GISConsts.WORLD_MERCATOR_BBOX.minLat, bounds.minLat);
                this._layerBounds.minLng = bounds.minLng;
                this._layerBounds.maxLat = Math.min(GISConsts.WORLD_MERCATOR_BBOX.maxLat, bounds.maxLat);
                this._layerBounds.maxLng = bounds.maxLng;
            }
            this.initGridCache();
        }        
    },
    getScaleInfoByZoomLevel:function(zoomLevel){
        return this.scaleArray[zoomLevel];
    },
    correctAnchorTilePosition:function(referPoint,anchorTile){
        var anchorx = referPoint.x - anchorTile.upleft.x;
        var anchory = referPoint.y - anchorTile.upleft.y;
        anchorTile.x = anchorx;
        anchorTile.y = anchory;
    },
    locateTile : function(tile,anchorTile){			
        var location = {x:(tile.colIndex - anchorTile.colIndex) * tile.width + anchorTile.x,
            y:(tile.rowIndex - anchorTile.rowIndex) * tile.height + anchorTile.y};
        tile.x = location.x;
        tile.y = location.y;
        tile.setLocation(location.x,location.y);
    },
    getGridArea:function(zoom,layerBounds){
        var grid = [];
        if((this._layerBounds.minLat === GISConsts.WORLD_MERCATOR_BBOX.minLat) && (this._layerBounds.minLng === GISConsts.WORLD_MERCATOR_BBOX.minLng)
            && (this._layerBounds.maxLat === GISConsts.WORLD_MERCATOR_BBOX.maxLat) && (this._layerBounds.maxLng === GISConsts.WORLD_MERCATOR_BBOX.maxLng)){
            grid[0] = 0;
            grid[1] = 0;
            grid[2] = Math.pow(2,zoom) -1;
            grid[3] = grid[2];
        }else{
            var ulTile = getTileOfGeoPoint(new twaver.gis.geometry.GeoCoordinate(layerBounds.maxLat, layerBounds.minLng), 
                zoom, this.projectionType, this.layer.tileWidth, this.layer.tileHeight);
            var brTile = getTileOfGeoPoint(new twaver.gis.geometry.GeoCoordinate(layerBounds.minLat, layerBounds.maxLng), 
                zoom, this.projectionType, this.layer.tileWidth, this.layer.tileHeight);
            grid[0] = ulTile.colIndex;
            grid[1] = ulTile.rowIndex;
            grid[2] = brTile.colIndex;
            grid[3] = brTile.rowIndex;
        }
        return grid;
    }
});

