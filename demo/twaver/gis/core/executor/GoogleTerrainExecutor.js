var GoogleTerrainExecutor = function(){
    GoogleTerrainExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_GOOGLE_MAP_TERRAIN);
};
twaver.Util.ext(GoogleTerrainExecutor,OSMExecutor,{
    acquireStandTileURL:function(tile) {
        // var url = this.service + "&hl="
            // + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
            // + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
        // return url;
        return getGoogleTerrainURL(this.service,tile);
    }
});
