var EdushiExecutor = function(){
    EdushiExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_MAPABC);
    this.area = getFakeMapArea();
    this.onlineURLs = GISUtils.getGlobalSetting(GISSettings.FAKE_3D_MAP_URLS);
    this.projectionType = GISConsts.PROJECTION_EDUSHI;
};
twaver.Util.ext(EdushiExecutor, BaseExecutor, {
    acquireStandTileURL : function(tile){
        if((this.onlineURLs!=null) && 
        	(this.onlineURLs.length>0)){
            var url = this.onlineURLs[tile.zoomLevel] + (tile.colIndex)
            + "," + (tile.rowIndex) + ".png";
            return url;
            // return getEdushiURL(this.onLineURLS[tile.zoom],tile);
        }
			
        return "";
    },
    correctAnchorTilePosition:function(referPoint,anchorTile){
        anchorTile.x = referPoint.x - anchorTile.upleft.x;
        anchorTile.y = referPoint.y - anchorTile.upleft.y;
    },
    locateTile : function(tile,anchorTile){			
        var location = {
            x:(tile.colIndex - anchorTile.colIndex) * tile.width + anchorTile.x,
            y:(tile.rowIndex - anchorTile.rowIndex) * tile.height + anchorTile.y
            };
        tile.x = location.x;
        tile.y = location.y;
        tile.setLocation(location.x,location.y);
    },
    initGridCache:function(){
    	var length = this.area.length;
    	this.gridCache = [];
    	 for(var i = 0; i<length;i++){
            var grid = this.area[i];
            this.gridCache[i] = {minx:grid[0],miny:grid[1],maxx:grid[2],maxy:grid[3]};
        }
    }
});

