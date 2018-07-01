twaver.gis.util.MapUtils = {
    localeCache:{},
    loadAsync : function(jsUrl){
        var head = document.getElementsByTagName("head")[0];
        var s = document.createElement("script");
        s.src = jsUrl;
        head.appendChild(s);
    },
    insertDOMElementAt : function(parent,node,index){
        if(index<0 || index>parent.childNodes.length)
            throw new Error("Invalid index in inserting DOM Element at "+index);
        else if(index == parent.childNodes.length)
            parent.appendChild(node);
        else 
            parent.insertBefore(node,parent.childNodes[index]);
    },

    getScrollOffsets : function(){
        //Use the specified window or the current window if no argument
        var w = window;
        if(w.pageXOffset != null)
            return {
                x:w.pageXOffset,
                y:w.pageYOffset
            };
        var d = w.document;
        if(document.compatMode === "CSS1Compat")
            return {
                x:d.documentElement.scrollLeft,
                y:d.documentElement.scrollTop
            };
        return {
            x:d.body.scrollLeft,
            y:d.body.scrollTop
        };
    },
    /**
* Get the viewport size as w and h properties of an object
*  to find what portions of the document are currently visible
 */
    getViewPortSize : function(w) {
        // Use the specified window or the current window if no argument
        w = w || window;
        // This works for all browsers except IE8 and before
        if (w.innerWidth != null) 
            return {
                w: w.innerWidth,
                h:w.innerHeight
            };
        // For IE (or any browser) in Standards mode
        var d = w.document;
        if (document.compatMode == "CSS1Compat")
            return {
                w: d.documentElement.clientWidth,
                h: d.documentElement.clientHeight
            };
        // For browsers in Quirks mode
        return {
            w: d.body.clientWidth, 
            h: d.body.clientWidth
        };
    },
    strip : function(html){
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent||tmp.innerText;
    },
    getElementAtPoint : function(point){
        return document.elementFromPoint(point.x, point.y);
    },
    /**
 * Get the viewport position of an Element
 */
    getElementPos : function(elt) {
        var x = 0, y = 0;
        // Loop to add up offsets
        for(var e = elt; e != null; e = e.offsetParent) {
            x += e.offsetLeft;
            y += e.offsetTop;
        }
        // Loop again, through all ancestor elements to subtract scroll offsets.
        // This subtracts the main scrollbars, too, and converts to viewport coords.
        for(var e=elt.parentNode; e != null && e.nodeType == 1; e=e.parentNode) {
            x -= e.scrollLeft;
            y -= e.scrollTop;
        }
        return {
            x:x, 
            y:y
        };
    },
    installMap : function(view,map){
        if(view){
            if(map){
                if(view.getView){
                    view = view.getView();
                }
                view.appendChild(map.content);
            }
        }
    },
    equals : function(a,b){
        if((!a) || (!b))
            return false;
        if (a.length != b.length) 
            return false; 
        //        for(var i = 0; i < a.length; i++) 
        //            if (a[i] !== b[i]) return false; 
        for(var prop in a){
            if(a.hasOwnProperty(prop)){
                if(a[prop]!=b[prop])
                    return false;
            }
        }
        return true;
    },
    setZIndex : function(div,index){
        div.style["z-index"] = index;
    },
    setDOMSize:function(dom,size){
        dom.style["width"] = size.width+"px";
        dom.style["height"] = size.height+"px";
    },
    getFloat:function(s){
        var v = parseFloat(s);
        if(!v)
            v = 0;
        return v;
    },
    getDOMStyle:function(dom){
      return window.getComputedStyle(dom, null);
    },
    getDOMOutborder:function(dom){

        //        var left = MapUtils.getFloat(dom.style["margin-left"])+
//        var left = MapUtils.getFloat(dom.style["border-left-width"])
//        +MapUtils.getFloat(dom.style["padding-left"]);
//        //        var right = MapUtils.getFloat(dom.style["margin-right"])+
//        var right = MapUtils.getFloat(dom.style["border-right-width"])
//        +MapUtils.getFloat(dom.style["padding-right"]);
//        //        var top = MapUtils.getFloat(dom.style["margin-top"])+
//        var top = MapUtils.getFloat(dom.style["border-top-width"])
//        +MapUtils.getFloat(dom.style["padding-top"]);
//        //        var bottom = MapUtils.getFloat(dom.style["margin-bottom"])+
//        var bottom = MapUtils.getFloat(dom.style["border-bottom-width"])
//        +MapUtils.getFloat(dom.style["padding-bottom"]);
        var style = window.getComputedStyle(dom, null);
        if(!style){
            return  {
                left:0,
                top:0,
                right:0,
                bottom:0
            };
        }
        var left = MapUtils.getFloat(style["border-left-width"])
                    +MapUtils.getFloat(style["padding-left"]);
        var right = MapUtils.getFloat(style["border-right-width"])
                    +MapUtils.getFloat(style["padding-right"]);
        var top = MapUtils.getFloat(style["border-top-width"])
                    +MapUtils.getFloat(style["padding-top"]);
        var bottom = MapUtils.getFloat(style["border-bottom-width"])
                    +MapUtils.getFloat(style["padding-bottom"]);
        return {
            left:left,
            top:top,
            right:right,
            bottom:bottom
        };
    },
    setDOMPosition:function(dom,left,top,right,bottom){
        dom.style["left"] = left+"px";
        if(right)
            dom.style["right"] = right+"px";
        dom.style["top"] = top+"px";
        if(bottom)
            dom.style["bottom"] = bottom+"px";
    },
    trancateInteger:function(v){
        return Math.ceil(v) - 1;
    },
    isValidateGeo:function(geo){
        return GISUtils.DEFAULT_GEOCOORDINATE_INVALIDATE_FUNCTION(geo);
    },
    translateDOM:function(div,xOff,yOff){
        var p = MapUtils.getDOMPosition(div);
        MapUtils.setDOMPosition(div, p.x + xOff, p.y+yOff);
    },
    getDOMPosition:function(dom){
        var x = dom.style.left;
        var y = dom.style.top;
        return {
            x:parseInt(x),
            y:parseInt(y)
        };
    },
    setBackgroundColor:function(div,color){
        div.style["background-color"] = color;
    },
    setDOMBounds:function(dom,rect){
        if(!dom) return;
        var style = dom.style;
        style.position = 'absolute';
        style.left = rect.x + 'px';
        style.top = rect.y + 'px';
        style.width = rect.width + 'px';
        style.height = rect.height + 'px';
    },
    getDOMSize:function(dom){
        return{width: dom.offsetWidth,height:dom.offsetHeight};
    },
    parseBounds:function(dom){
        if(!dom) return {
            x:0,
            y:0,
            width:0,
            height:0
        };
        var style = dom.style;
        var x = parseInt(style.left);
        var y = parseInt(style.top);
        var width = 0;
        if(style.clientWidth){
            width = parseInt(style.clientWidth);
        }else{
            width = parseInt(style.width);
        }
        var height = 0;
        if(style.clientHeight){
            height = parseInt(style.clientHeight);
        }else{
            height = parseInt(style.height);
        }
        return {
            x:x,
            y:y,
            width:width,
            height:height
        };
    },
    getDistanceBetweenLineAndPoint:function(segment,point){
        var from = (segment.from.x<=segment.to.x)? segment.from:segment.to;
        var to = (segment.from.x<=segment.to.x)? segment.to:segment.from;
        var f = (to.x - from.x);
        if(f!=0){
            var k = (to.y - from.y)/f;
            var b = to.y - k* to.x;
            b = from.y - k * from.x;
            return Math.abs(k*point.x - point.y + b)/Math.sqrt(k*k+1);            
        }else
            return Math.abs(point.x - from.x);
    },
    isIntesects:function(circle,segment){
        var center = circle.center;
        var from = segment.from, to = segment.to;
        if(center.x<Math.min(from.x, to.x) || center.x > Math.max(from.x, to.x)){
            return false;
        }
        var d = MapUtils.getDistanceBetweenLineAndPoint(segment, center);
        return d<=circle.radius;
    },
    rotateVectorAboutPoint:function(r,v,p){
        var tx = v.x - p.x,ty = v.y - p.y;
        var sin = Math.sin(r);
        var cos = Math.cos(r);
        return {
            x:cos*tx - sin*ty + p.x,
            y:sin*tx+cos*ty+p.y
        };
        
    },
    rotateVector:function(r,v){
        return MapUtils.rotateVectorAboutPoint(r, v, {
            x:0,
            y:0
        });
    },
    projectionOn:function(va,vb){
        var nor = MapUtils.nomalise(vb);
        return MapUtils.dotProduct(va, nor);
    },
    dotProduct:function(va,vb){
        return va.x*vb.x+va.y*vb.y;
    },
    nomalise:function(v){
        var mag = MapUtils.magnitude(v);
        return {
            x:v.x/mag,
            y:v.y/mag
        };
    },
    magnitude:function(v){
        return Math.sqrt(MapUtils.magnitudeSquare(v));
    },
    magnitudeSquare:function(v){
        return v.x*v.x + v.y*v.y;
    },
    isIntersectsWithRect:function(line,rect){
        var from = line.from;
        var to = line.to;
        var center = {
            x:rect.x+(rect.width/2),
            y:rect.y+(rect.height/2)
        };
        var d = MapUtils.getDistanceBetweenLineAndPoint(line,center);
        if(from.x === to.x){
            return d <= rect.width/2;
        }else if(from.y === to.y){
            return d <= rect.height/2;
        }else{          
            var hl = (rect.width * rect.width + rect.height * rect.height)/4;       
            return hl>d*d; 
        }        
    },
    getIntersectPointsForLineAndRect:function(line,rect){
        var points = [];
        var from = (line.from.x<=line.to.x)? line.from:line.to;
        
        var to = (line.from.x <= line.to.x)? line.to:line.from;
        if((to.x<=rect.x)||(from.x>=(rect.x+rect.width))||(Math.max(from.y, to.y)<=rect.y)||(Math.min(from.y,to.y)>=(rect.y+rect.height))){
            return points;
        }
        if(from.x<=rect.x){
            if(from.y<=rect.y){
                
            }else if(from.y >= rect.y+rect.height){
                
            }
        }else if(from.x<=rect.x+rect.width){
            
        }
        return points;
    },
    getSlope:function(line,followDirection){
        if(line.from.x === line.to.x){
            if(line.to.y<line.from.y){
                return Math.PI/2;
            }
            if(line.to.y>line.from.y){
                return -Math.PI/2;
            }
        }
        else{
            if(followDirection){
                return Math.atan((line.to.y-line.from.y)/(line.to.x-line.from.x));
            }else{
                var from = (line.from.x<=line.to.x)? line.from:line.to;
                var to = (line.from.x <= line.to.x)? line.to:line.from;  
                return Math.atan((to.y-from.y)/(to.x-from.x));
           
            }
        }
        
    },
    TimeToFade:1000.0,
    fadeElement:function(eid){
        var element = document.getElementById(eid);
        if(element == null)
            return;
   
        if(element.FadeState == null)
        {
            if(element.style.opacity == null 
                || element.style.opacity == '' 
                || element.style.opacity == '1')
                {
                element.FadeState = 2;
            }
            else
            {
                element.FadeState = -2;
            }
        }
    
        if(element.FadeState == 1 || element.FadeState == -1)
        {
            element.FadeState = element.FadeState == 1 ? -1 : 1;
            element.FadeTimeLeft = MapUtils.TimeToFade - element.FadeTimeLeft;
        }
        else
        {
            element.FadeState = element.FadeState == 2 ? -1 : 1;
            element.FadeTimeLeft = MapUtils.TimeToFade;
            setTimeout("animateFade(" + new Date().getTime() + ",'" + eid + "')", 33);
        } 
    },
    animateFade:function(lastTick,eid){
        var curTick = new Date().getTime();
        var elapsedTicks = curTick - lastTick;
  
        var element = document.getElementById(eid);
 
        if(element.FadeTimeLeft <= elapsedTicks)
        {
            element.style.opacity = element.FadeState == 1 ? '1' : '0';
            element.style.filter = 'alpha(opacity = ' 
            + (element.FadeState == 1 ? '100' : '0') + ')';
            element.FadeState = element.FadeState == 1 ? 2 : -2;
            return;
        }
 
        element.FadeTimeLeft -= elapsedTicks;
        var newOpVal = element.FadeTimeLeft/TimeToFade;
        if(element.FadeState == 1)
            newOpVal = 1 - newOpVal;

        element.style.opacity = newOpVal;
        element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';
  
        setTimeout("animateFade(" + curTick + ",'" + eid + "')", 33);  
    },
    getDOMLocation:function(obj){
        var curleft = 0,curtop = 0;
        var original = obj;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                var t = window.getComputedStyle(obj, null);
                curleft += MapUtils.getFloat(t.getPropertyValue("border-left-width"));
                curtop += MapUtils.getFloat(t.getPropertyValue("border-top-width"));
            } while (obj = obj.offsetParent);
        }
        if(original.x){
            curleft += original.x;
        }
        if(original.y){
            curtop += original.y;
        }
        return {
            x:curleft,
            y:curtop
        }
    },
    createButton:function(text,command,scope,iconPath){
        var button = document.createElement("button");
        var img = document.createElement("image");
        button.appendChild(img);
        img.src = iconPath;
        twaver.gis.util.EventUtils.addEventListener(button, "click", command, scope, false);
        return button;
    },
    addLocaleResource:function(path,callback){
        if(path){
            if(!MapUtils._localeCache){
                MapUtils._localeCache = {};
            }
            var searchJS = document.createElement('script');
                searchJS.setAttribute('type', 'text/javascript');
                searchJS.setAttribute('src', path);
                document.getElementsByTagName('head')[0].appendChild(searchJS);
            MapUtils._localeCallback = callback;
        }
    },
    getString:function(src){
        if(!MapUtils._localeCache){
            MapUtils._localeCache = {};
        }
        var result = MapUtils._localeCache[src];
        if(!result){
            result = src;
        }
        return result;
    },
    importLocaleResource:function(data){
        if(data){
            
            for(var i=0;i<data.length;i++){
                for(var s in data[i]){
                    MapUtils._localeCache[s] = data[i][s];
                }
            }
            var c = MapUtils._localeCallback;
            if(c){
                c.method.call(c.scope);
            }
        }
    } 
};
MapUtils = twaver.gis.util.MapUtils;

