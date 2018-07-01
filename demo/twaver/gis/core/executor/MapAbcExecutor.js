var MapAbcExecutor = function(){
    MapAbcExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_MAPABC);
};
twaver.Util.ext(MapAbcExecutor,OSMExecutor,{
    acquireStandTileURL:function(tile){
        // var url = this.service + "&x=" + tile.colIndex + "&y=" + tile.rowIndex + "&zoom="
                  // + (17 - tile.zoomLevel);
        // return url;
        return getMapABCURL(this.service,tile);
    }
    
});
