var GoogleMapLabelExecutor = function(){
    GoogleMapLabelExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_GOOGLE_LABEL);
};
twaver.Util.ext(GoogleMapLabelExecutor, GoogleMapExecutor, {
    acquireStandTileURL : function(tile){
        // var url = this.service + "&hl="
                // + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
                // + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
        // return url;		return getGoogleLabelURL(this.service,tile);
    }
});


