twaver.gis.util.EventUtils = {
    addEventListener : function(target,type,handler,scope,capture){
        if(capture==null){
            capture = false;
        }
        var f = function(evt){
            handler.call(f.scope,evt);
        }
        f.scope = scope;
        if(target.addEventListener){
            target.addEventListener(type,f,capture);
        }else{
            target.attachEvent("on"+type,f);
        }
    },
    cancelHandler : function(event){
        var evt = event || window.event;
        if(evt.preventDefault())
            evt.preventDefault();
        if(evt.stopPropagation)
            evt.stopPropagation();
        if(evt.returnValue)
            evt.returnValue = false;
        evt.cancelBubble = true;  
        return false;
    },
   
    getMouseLocation:function(evt,refer){
        if (!evt) 
            evt = window.event;
        if(!refer){
            refer = evt.target;
        }
        var posx = 0;
        var posy = 0;
        var p = MapUtils.getDOMLocation(refer);
        
        if(evt.clientX){
            posx = evt.clientX;
            posy = evt.clientY;
        }else if(evt.pageX){
            posx = evt.pageX;
            posy = evt.pageY;
        }
        return {
            x:posx - p.x,
            y:posy - p.y
        }
    },
    isLeft:function(evt){
        evt = evt || window.event;
        if(evt.which)
            return (evt.which == 1);
        else if(evt.button){
            if(twaver.Util.isIE)
                return evt.button == 1;
            else
                return evt.button == 0;
        }
    },
    isRight:function(evt){
        evt = evt || window.event;
        if(evt.which)
            return (evt.which == 3);
        else if(evt.button){
            return evt.button == 2;
        }
    },
    isMiddle:function(evt){
        evt = evt || window.event;
        if(evt.which)
            return (evt.which == 2);
        else if(evt.button){
            if(twaver.Util.isIE)
                return evt.button == 4;
            else
                return evt.button == 1;
        }
    }
};
