var Tile = function(pt,r,c,z,w,h){
    this.projectionType = pt;   
    this.rowIndex = r;
    this.colIndex = c;
    this.zoomLevel = (z===undefined)? 0:z;
    this.width = (!w? 256:w);
    this.height = (!h? 256:h);
    this.createContent();
    
};
twaver.Util.ext(Tile,Object,{
    createContent : function(){
        this.content = document.createElement("img");
//        if(twaver.Util.isChrome || twaver.Util.isAndroid){
//            this.content.crossOrigin = "Anonymous";
//        }
        this.content.src = GISUtils.getGlobalSetting(GISSettings.NO_IMAGE_PATH);
        this.content.setAttribute("style","position:absolute;left:0px;top:0px");
        MapUtils.setDOMSize(this.content,{width:this.width,height:this.height});
    },
    setLocation:function(x,y){
        MapUtils.setDOMPosition(this.content, x, y);
    },
    setSize:function(size){
        if(this.content)
            MapUtils.setDOMSize(this.content, size);
    },
    loadImage : function(url){
        if(!this.content){
           createContent(); 
        }
        this.content.src = url;
    },
    initGeoBounds : function(){
        this.geoBounds = getTileBbox(this.projectionType,
                                this.zoomLevel,this.colIndex,this.rowIndex);        
                          
    },
    release : function(){
        if(this.content && this.content.parent){
            this.content.parent.removeChild(this.content);
            this.content = null;
            delete this.content;
        }        
    }
});
