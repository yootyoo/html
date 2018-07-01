twaver.gis.geometry.Bounds = function(minx,maxx,miny,maxy){    
    this.setBounds = function(minx,maxx,miny,maxy){
        this.minx = (minx==null)? 0:minx;
        this.maxx = (maxx==null)? 0:maxx;
        this.miny = (miny==null)? 0:miny;
        this.maxy = (maxy==null)? 0:maxy;
        this.width = this.maxx - this.minx;
        this.height = this.maxy - this.miny;
    }
    this.toString = function(){
        return "bounds is ["+ minx+","+miny+","+maxx+","+maxy+"]";
    }
    this.setBounds(minx, maxx, miny, maxy);
    this.createIntersect = function(t){
        var x1 = Math.max(minx, t.minx);
        var y1 = Math.max(miny,t.miny);
        var x2 = Math.min(maxx, t.maxx);
        var y2 = Math.min(maxy, t.maxy);
        return new twaver.gis.geometry.Bounds(x1,x2,y1,y2);
    }
};

