twaver.gis.gadget.MapToolbar = function(id,map){
    this._id = (!id)? "map_toolbar":id;
    this._map = map;
    twaver.gis.gadget.MapToolbar.superClass.constructor.call(this);
    
};
twaver.Util.ext('twaver.gis.gadget.MapToolbar',twaver.gis.gadget.ActionPanel,{
    
    initView:function(){
          this._panel.setAttribute("class","mp_toolbar");
        this._panel.setAttribute("id",this._id);
        this.initActions();
         this._panel.style.top = "5px";
    },
    initActions:function(){
        var BUTTON_NAMES = ["print","location","export"];
        var cl = [this.print,this.getLocation,this.toImage];
        var as = [];
        var v = twaver.Util.isIPad || twaver.Util.isAndroid || twaver.Util.isIPhone || twaver.Util.isIPod;
        var size = v? 48:32;
        for(var i=0;i<3;i++){
            var action = {
                command:cl[i],
                size:{
                    width:32,
                    height:23
                },
                icon:GISUtils.getRegisterImage(BUTTON_NAMES[i]+"-"+size),
                scope:this,
                name:MapUtils.getString(BUTTON_NAMES[i])

            }
            as[i] = action;
        }
        this.addActions(as);
                
    },
    print:function(){
        if(!this._map.isPermitCrossDomain()){
            alert(MapUtils.getString("Be sure the Cross Domain Policy of the WebSite"));
            return;
        }
         var dataUrl = this._map.toImage();
         if(!dataUrl)
             return;
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>'
        windowContent += '<head><title>Show Result:</title></head>';
        windowContent += '<body>';
        windowContent += '<img src="' + dataUrl + '"/>';
        windowContent += '</body>';
        windowContent += '</html>';
        var printWin = window.open('','','width=340,height=260');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
//        printWin.close();
    },
    overview:function(){
        
    },
    getLocation:function(){
        this._map.getGeoLocation(GISConsts.REQUIRE_GEO_TYPE_SHOT,{method:this.showOnMap,scope:this},{method:this.errorLocation,scope:this});
    },
    errorLocation:function(error){
        alert("error occurs when requesting the GeoLocation, error information is "+error.name+" - "+error.message);
    },
    showOnMap:function(p){
        var geo = new twaver.gis.geometry.GeoCoordinate(p.coords.latitude,p.coords.longitude);
        this._map.setCenter(geo);
        
        this._map.setZoomLevel(15);
        var img = GISUtils.getGlobalSetting("IMAGE-placemark");
        var mark = {
            image:img,
            p:geo
            
        }
        
        this._map.setMarks([mark]);
        var cor = p.coords;
        console.log("lat,lng is "+cor.latitude+","+cor.longitude+", accuracy is "+cor.accuracy)
    },
    toImage:function(){
        if(!this._map.isPermitCrossDomain()){
            alert(MapUtils.getString("Please check the Cross-Origin Resource Sharing policy of the website"));
            return;
        }
        var dataUrl = this._map.toImage();
        if(!dataUrl)
            return;
        window.open(dataUrl);
    },
    mouseUpHandle:function(evt){
        //need to cancle the event
        var p = twaver.gis.util.EventUtils.getMouseLocation(evt, this._panel);
        
        evt.stopPropagation();
    },
    mouseTouchStartHandle:function(evt){
        evt.stopPropagation();
    },
    mouseTouchEndHandle:function(evt){
        evt.stopPropagation();
    }
});
