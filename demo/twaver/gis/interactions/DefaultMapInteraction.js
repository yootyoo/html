twaver.gis.interactions.DefaultMapInteraction = function(map){
    this.map = map;
};
twaver.Util.ext('twaver.gis.interactions.DefaultMapInteraction', Object, {
    onMouseDown:function(evt){
        evt = evt || window.event;  
        if(!this.map.enableDrag){
        	return false;
        }
        if (twaver.gis.util.EventUtils.isLeft(evt)){
            this.down = true;        
            this.pressPoint = {
                x:evt.clientX,
                y:evt.clientY
            };
            this.cachedPress = this.pressPoint;
            this.map._viewContent.ondragstart = function() {
                return false;
            };
            this.map.startDragging();
            return false;
        }
    },
    onMouseMove:function(evt){
        
        if(this.down && !this.dragging){
            this.dragging = true;
        }
        
        if(this.dragging){
            this.to = {
                x:evt.clientX,
                y:evt.clientY
            };
            this.map.pan(this.pressPoint,this.to);
        }
    },
    onMouseWheel:function(evt){
        if(!this.map.canBeWheeled)
            return;
        evt = evt || window.event;
        var deltaX = evt.deltaX*-30 || evt.wheelDeltaX/4 || 0;
        var deltaY = evt.deltaY*-30 || evt.wheelDeltaY/4 || (evt.wheelDeltaY===undefined && evt.wheelDelta/4) || evt.detail*-10 ||0; 
        if(deltaY){
            var off = (deltaY>0)? 1:-1;
            this.changedZoom = this.map.zoomLevel + off;
            if((this.changedZoom < this.map.zoomLowLimit)||this.changedZoom > this.map.zoomUpLimit){
                return;
            }
            this.map.relocate(twaver.gis.util.EventUtils.getMouseLocation(evt,this.map._viewContent),this.changedZoom);
            
        }
        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
   
    onMouseUp:function(evt){
        evt = evt || window.event;
        if(this.dragging){
            this.to = {
                x:evt.clientX,
                y:evt.clientY
            };
            //stop dragging
            this.map.finishPan(this.cachedPress,this.to);
            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            
        }
        this.down = false;
        this.dragging = false;
        this.pressPoint = null;
    },
    onDBClick:function(evt){
        var syn = this.map.getSynComponent();
            if(syn && (syn instanceof twaver.network.Network || 
                syn instanceof twaver.canvas.Network ||
                syn instanceof twaver.vector.Network)){
                var data = syn.getElementAt(evt);
                if(data){
                    if(data instanceof $Group && syn.isDoubleClickToGroupExpand()) {
                        data.reverseExpanded();
                        syn.fireInteractionEvent({ kind: 'expandGroup', event: e, element: data });
                    }
                    return;
                }
            }
    	if(this.map.isEnableDoubleZoom()){
    		this.map.relocate(twaver.gis.util.EventUtils.getMouseLocation(evt,this.map),this.map.zoomLevel + 1);
    	}

        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
    getPoint:function(evt){
        if(evt.clientX){
            return{
                x:evt.clientX,
                y:evt.clientY
            }
        }
        if(evt.pageX){
            return{
                x:evt.pageX,
                y:evt.pageY
            }
        }
    },
    onTouchStart:function(evt){
        if(evt.touches.length == 1){
            var touch = evt.touches[0];  
        
            this.down = true;  
            
            this.pressPoint = {
                x:touch.clientX,
                y:touch.clientY
                }
            ;
            this.cachedPress = this.pressPoint;
            this.map._viewContent.ondragstart = function() {
                return false;
            };
            this.map.startDragging();
            this.oneFingerStart = true;
            
        }else {
            
        }
    },
    onTouchMove:function(evt){
        if(evt.targetTouches.length==1){
            if(this.down && !this.dragging){
                this.dragging = true;
            }
        
            if(this.dragging){
                var touch = evt.touches[0];
                this.to = {
                    x:touch.clientX,
                    y:touch.clientY
                    };
                this.map.pan(this.pressPoint,this.to);
//                showInfo("map should be moved");
            } 
        }else{
            this.dragging = false;
        }
        
        twaver.gis.util.EventUtils.cancelHandler(evt);
    },
   
    onTouchEnd:function(evt){
        if(this.dragging){
            this.map.finishPan(this.cachedPress,this.to);
            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            
        }else if(!this.dragging){
            if(!this.oneFingerStart){
                if(evt.scale){
                    if(evt.scale>1){
                        this.map.setZoomLevel(this.map.zoomLevel+1);
            
                    }else{
                        this.map.setZoomLevel(this.map.zoomLevel-1);
                    }
                }
            }
        }
        this.to = null;
        this.down = false;
        this.dragging = false;
        this.pressPoint = null;
    }
});
