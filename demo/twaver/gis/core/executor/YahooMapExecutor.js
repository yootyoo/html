var YahooMapExecutor = function(){
    YahooMapExecutor.superClass.constructor.call(this);
    this.service = "http://maps2.yimg.com/hx/tl?b=1&v=4.3&.intl=en&r=3";
}
twaver.Util.ext(YahooMapExecutor,OSMExecutor,{
    acquireStandTileURL:function(tile){
         var url = this.service + "&x=" + tile.rowIndex + "&y="+ tile.colIndex + "&z=" + (tile.zoomLevel+1);
			return url;
    }
   
})
