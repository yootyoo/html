var TiandituExecutor = function(){
    TiandituExecutor.superClass.constructor.call(this);
    this.service = GISUtils.getGlobalSetting(GISSettings.MAPDRIVER_TIANDITU);
};
twaver.Util.ext(TiandituExecutor,BaseExecutor, {
    acquireStandTileURL : function(tile){
        // var zoom = tile.zoomLevel
        // var y = Math.pow(2, zoom);
        // var t = null;
        // if(zoom<=9)
            // t = "A0512_EMap";
        // else if((zoom>9)&&(zoom<12))
            // t = "B0627_EMap1112";
        // else
            // t ="siwei0608";
        // var service = "http://tile5"+".tianditu.com/DataServer?T="+t+"&X=";
        // if(zoom==0)
            // y = tile.rowIndex;
        // else 
            // y = y - tile.rowIndex -1;
        // var url = service+tile.colIndex+"&Y="+y+"&L="+(zoom+1);
        // return url;
        return getTiandituURL(this.service,tile);
    }

});

