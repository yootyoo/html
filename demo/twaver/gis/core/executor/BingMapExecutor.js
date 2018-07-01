var BingMapExecutor = function(){
    BingMapExecutor.superClass.constructor.call(this);
    this.locale = GISUtils.getGlobalSetting(GISSettings.BINGMAP_LOCALE);
    if(GISConsts.LOCALE_CH === this.locale){
        this.service = "http://r3.tiles.ditu.live.com";
    }else{
        this.service = "http://ecn.t4.tiles.virtualearth.net";
    }
};
twaver.Util.ext(BingMapExecutor,OSMExecutor, {
    acquireStandTileURL : function(tile){
        //locale e demo:http://ecn.t4.tiles.virtualearth.net/tiles/r1.png?g=0			
        //locale ch demo:http://r3.tiles.ditu.live.com/tiles/r1.png?g=50
        // var quadkey = getQuadkey(tile.colIndex,tile.rowIndex,tile.zoomLevel)
        // if(""==quadkey)
            // quadkey = "0";
        // var url = this.service + "/tiles/r"+quadkey+".png?g=0";
        // return url
		return getBingMapURL(this.service,tile);
    }
});

