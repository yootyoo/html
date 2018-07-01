var GoogleStatelliteExecutor = function(){
    GoogleStatelliteExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_GOOGLE_STATELLITE);
};
twaver.Util.ext(GoogleStatelliteExecutor, OSMExecutor, {
    acquireStandTileURL:function(tile){
        // var url = this.service + "&hl="
        // + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
        // + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
        // return url;
        return getGoogleSatelliteURL(this.service,tile);
    }
});


