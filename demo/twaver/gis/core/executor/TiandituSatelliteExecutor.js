var TiandituSatelliteExecutor = function(){
    TiandituSatelliteExecutor.superClass.constructor.call(this);
};
twaver.Util.ext(TiandituSatelliteExecutor,TiandituExecutor, {
     acquireStandTileURL : function(tile){
        // var zoom = tile.zoomLevel
        // var y = Math.pow(2, zoom);
        // var t = null;
        // if(zoom<=10)
            // t = "sbsm0210";
        // else if((zoom>10)&&(zoom<12))
            // t = "e12";
        // else if(zoom == 12)
            // t ="e13";
        // else if((zoom>12) && (zoom<14))
            // t = "eastdawnall";
        // else if(zoom == 14)
            // t = "AP0115_SWHK";
        // else
            // t = "sbsm1518"
        // var service = "http://tile5"+".tianditu.com/DataServer?T="+t+"&X=";
        // if(zoom==0)
            // y = tile.rowIndex;
        // else 
            // y = y - tile.rowIndex -1;
        // var url = service+tile.colIndex+"&Y="+y+"&L="+(zoom+1);
        // return url;		return getTiandituSatelliteURL(tile);
    }
});
