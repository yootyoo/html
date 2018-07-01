twaver.gis.gadget.ActionPanel = function(type,direction,blockList){
    this._actionList = [];
    this.actionNumber = 0;
    this._actionMap = {};
    this._buttonMap = {};
    this._direction = (!direction)? "horizontal":direction;
    twaver.gis.gadget.ActionPanel.superClass.constructor.call(this,"type",blockList);
};
twaver.Util.ext('twaver.gis.gadget.ActionPanel',twaver.gis.gadget.BlockPanel,{
   
     addAction:function(action){
//        action.id,action.command,action.name,action.icon,action.catalogue,
        if(action){
            this._actionList[this.actionNumber] = action;
            this._actionMap[action.id] = this.actionNumber;
            this.actionNumber++;
            this.invalidate();
        }
    },
     invalidate:function(){
       //re-layout the action in the toolbar; 
       var tempDom = document.createElement("div");
       this.size = {width:0,height:0};
       for(var i=0;i<this.actionNumber;i++){
           var a = this._actionList[i];
           var button = this.createButtonForAction(a);
           var s = MapUtils.getDOMSize(button);
           if(this._direction == "vertical"){
               this.size.width = Math.max(this.size.width, a.size.width);
               this.size.height += a.size.height;
           }else{
              this.size.width += a.size.width;
              this.size.height = Math.max(this.size.height, a.size.height); 
           }
           
           tempDom.appendChild(button);
           this._buttonMap[a.id] = button;
       }
       var ob = MapUtils.getDOMOutborder(this._panel);
       this.size.width += ob.left+ob.right;
       this.size.height += ob.top+ob.bottom;
       if(this._content){
           this._panel.removeChild(this._content);
       }
       this._panel.appendChild(tempDom);
       this._content = tempDom;
       this._panel.style.cssText = "position:absolute;";
    },
      createButtonForAction:function(action){
        var button = document.createElement("a");
        button.title = action.name;
        button.className = "toobar-button";
        if(action.id)
            button.id = action.id;
        var image = document.createElement("img");
        image.className = "tb-img";
        image.src = action.icon.src;
        button.appendChild(image);
        button.action = action;
        button.addEventListener("mousedown",this.onMouseDown);
        button.addEventListener("mouseup",this.onMouseUp);
        button.addEventListener("dblclick", this.onMouseDBClick);
        button.addEventListener("touchstart",this.onMouseDown);
        button.addEventListener("touchend",this.onMouseUp);
        
        return button;
    },
    findActionById:function(id){
        return this._actionMap[id];
    },
    removeAction:function(action){
        if(action){
            var id = action.id;
            if(!id)
                id = action;
            var index = this.findActionById(id);
            delete this._actionMap[id];
            delete this._actionList[index];
            this.actionNumber--;
            this.invalidate();
            action = null;
            
        }
    },
    onMouseDBClick:function(evt){
        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
    onMouseDown:function(evt){
        var button = evt.currentTarget;
        button.down = true;
        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
    onMouseUp:function(evt){
        var button = evt.currentTarget;
        if(button.down){
             var action = button.action;
            if(action){
                action.command.call(action.scope,evt);
            }
        }
        twaver.gis.util.EventUtils.cancelHandler(evt);
        button.down = false;
    },
    addActions:function(actions){
        if(actions && actions.length){
            this._actionList = this._actionList.concat(actions);
            this.actionNumber += actions.length;
            this.invalidate();
        }
        
    }
});

