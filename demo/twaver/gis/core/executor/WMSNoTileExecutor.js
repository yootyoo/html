var WMSNoTileExecutor = function(){
     WMSNoTileExecutor.superClass.constructor.call(this);
};
twaver.Util.ext(WMSNoTileExecutor, BaseExecutor, {
    relocateTiles:function(geo,zoom){
        var layer = this.layer;
        var anchor = this.getTile(zoom);		
        var rows = 1;
        var cols = 1;
        layer.width = layer.viewrect.width;
        layer.height = layer.viewrect.height;
        layer.recreateTiles(rows,cols);	
        layer.installTiles();
        this.locateTiles(layer.tiles,cols,rows,0,0,anchor,zoom);
    },
    getTile:function(zoom){
        return getWMSNoTile(zoom);
    },
    initGridCache:function(){
        
    },
    isValidate:function(tile){
        return true;
    },
    acquireStandTileURL:function(tile) {
        var url = this.service
        + twaver.gis.ogc.util.WMSUtils.getURL(_$wmsp.GET_MAP, 
            _$wmsp.WMS_VERSION_1_1_1, this.srs,
            tile.geoBounds,this.layer.getRelativeLayers(), 
            [ this.style ],
            this.format,tile.width,tile.height);
        return url;
    },
    calculatePixelBounds:function(tile){
        var bbox = tile.geoBounds;
        if(bbox!=null){
            var upLeftPixel = getPixelXYFromGeoPoint(
                new twaver.gis.geometry.GeoCoordinate(bbox.minLng,bbox.maxLat),tile.zoom,this.projectionType);
            var bottomRightPixel = getPixelXYFromGeoPoint(
                new twaver.gis.geometry.GeoCoordinate(bbox.maxLng,bbox.minLat),tile.zoom,this.projectionType);
            return new twaver.gis.geometry.Bounds(upLeftPixel.x,bottomRightPixel.x,bottomRightPixel.y,upLeftPixel.y);
        }
			
        return new twaver.gis.geometry.Bounds();
    },
    locateTiles:function(tiles,cols,rows,startCol,startRow,anchoTile,zoom){
        for(var row = 0;row<rows;row++){
            for(var col=0;col<cols;col++){
                var tile = tiles[row][col] ;
                tile.layer = this.layer;
                tile.zoom = zoom;	
                calculateWMSNoTileBBox(tile,this.layer.viewrect,this.layer.center);
                tile.loadImage(this.acquireTileURL(tile));
            }
        }
    }
});


