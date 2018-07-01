twaver.gis.gadget.Navigator = function(id,map){
    this._id = (!id)? "om_navigator":id;
    this.map = map;
    this._commands = [this.zoomin,this.zoomout];
    twaver.gis.gadget.Navigator.superClass.constructor.call(this,"block","vertical");
    
};
twaver.Util.ext('twaver.gis.gadget.Navigator', twaver.gis.gadget.ActionPanel, {
    
    initView:function(){
        this._panel.setAttribute("class","mp_navigator");
        this._panel.setAttribute("id",this._id);
        this.initActions();
    },
    initActions:function(){
        var BUTTON_NAMES = ["zoomin","zoomout"];
        var as = [];
        var v = twaver.Util.isIPad || twaver.Util.isAndroid || twaver.Util.isIPhone || twaver.Util.isIPod;
        var size = v? 48:32;
        for(var i=0;i<2;i++){
            var action = {
                command:this._commands[i],
                size:{
                    width:size,
                    height:size
                },
//                icon:"./resources/"+twaver.gis.gadget.Navigator.BUTTON_NAMES[i]+"-"+size+".png",
                icon:GISUtils.getRegisterImage(BUTTON_NAMES[i]+"-"+size),
                scope:this,
                name:MapUtils.getString(BUTTON_NAMES[i])

            }
            as[i] = action;
        }
                    
        this.addActions(as);
                
    },
    zoomin:function(evt){
        if(this.map){
            this.map.setZoomLevel(this.map.getZoomLevel()+1);
            twaver.gis.util.EventUtils.cancelHandler(evt);
        }
    },
    zoomout:function(evt){
        if(this.map){
            this.map.setZoomLevel(this.map.getZoomLevel()-1);
            twaver.gis.util.EventUtils.cancelHandler(evt);
        }
    },
    invalidate:function(){
        twaver.gis.gadget.Navigator.superClass.invalidate.call(this);
        this._panel.style.width = this.size.width+"px";
    }
});
