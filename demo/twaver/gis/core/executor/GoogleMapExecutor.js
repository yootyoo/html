var GoogleMapExecutor = function(){
    GoogleMapExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_GOOGLE_MAP);
};
twaver.Util.ext(GoogleMapExecutor, OSMExecutor, {
    acquireStandTileURL : function(tile){
        // var url = this.service + "&hl="
                // + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
                // + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
        // return url;
        return getGoogleMapURL(this.service,tile);
    }
});


