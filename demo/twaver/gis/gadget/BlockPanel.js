twaver.gis.gadget.BlockPanel = function(type,blockList){
    if(!blockList){
        blockList = twaver.gis.gadget.BlockPanel.blockList;
    }
    this.blockList = blockList;
    if(!type){
        type = 'block';
    }
   this.shouldBlockEvents = (type === 'block');
    this._panel = document.createElement("div");
    this.init();
    
};
twaver.gis.gadget.BlockPanel.blockList = ["mousedown","mouseup","click","dblclick","mousewheel","DOMMouseScroll"];
twaver.Util.ext('twaver.gis.gadget.BlockPanel',Object,{
    getView:function(){
        return this._panel;
    },
    initView:function(){
        
    },
    init:function(){
        this.initView();
        if(this.shouldBlockEvents){
            this.blockEvents();
        }
    },
    block:function(evt){
        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
    blockEvents:function(){
        for(var i=0;i<this.blockList.length;i++){
            twaver.gis.util.EventUtils.addEventListener(this._panel,
                        this.blockList[i] , this.block, this, false);
        }
        
    }
});
