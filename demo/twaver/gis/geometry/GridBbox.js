twaver.gis.geometry.GridBbox = function(minlat,minlng,maxlat,maxlng){
    this.minLat = (minlat==null)? -90:minlat;
    this.minLng = (minlng==null)? -180:minlng;
    this.maxLat = (maxlat==null)? 90:maxlat;
    this.maxLng = (maxlng==null)? 180:maxlng;
    this.containsCoordinate = function(coordinate){
        var longitude=coordinate.longitude
        var latitude=coordinate.latitude;
        return ((longitude >= this.minLng) && (longitude <= this.maxLng) && (latitude >= this.minLat) && (latitude <= this.maxLat));
    }
    this.intersects = function(r){
        if(r==null)
            return true;
        var tw = this.getWidth();
        var th = this.getHeight();
        var rw = r.width;
        var rh = r.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = this.minLng;
        var ty = this.minLat;
        var rx = r.minLng;
        var ry = r.minLat;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        //      overflow || intersect
        return ((rw < rx || rw > tx) &&
            (rh < ry || rh > ty) &&
            (tw < tx || tw > rx) &&
            (th < ty || th > ry));  
    }
    this.containsGridBbox = function(bbox){
        if (!bbox)
            return false;
        return ((this.maxLng >= bbox.maxLng) && (this.minLng <= bbox.minLng) && (this.minLat <= bbox.minLat) && (this.maxLat >= bbox.maxLat));
    }
    this.contains = function(obj){
        if(obj instanceof twaver.gis.geometry.GeoCoordinate){
            return this.containsCoordinate(obj);
        }else if(obj instanceof twaver.gis.geometry.GridBbox){
            return this.containsGridBbox(obj);
        }
        return false;
    }
    this.getWidth = function(){
        return this.maxLng - this.minLng;
    }
    this.getHeight = function(){
        return this.maxLat - this.minLat;
    }
    this.toString = function(){
        return "GridBbox minlat:"+this.minLat+", minLng:"+this.minLng+",maxLat:"+this.maxLat+",minLat:"+this.minLat;
    }
    this.union = function(r){
        var tx2 = this.width;
        var ty2 = this.height;
        if ((tx2 | ty2) < 0) {
            return this;
        }
        var rx2 = r.width;
        var ry2 = r.height;
        if ((rx2 | ry2) < 0) {
            return this;
        }
        var tx1 = minLng;
        var ty1 = minLat;
        tx2 += tx1;
        ty2 += ty1;
        var rx1 = r.minLng;
        var ry1 = r.minLat;
        rx2 += rx1;
        ry2 += ry1;
        if (tx1 > rx1) tx1 = rx1;
        if (ty1 > ry1) ty1 = ry1;
        if (tx2 < rx2) tx2 = rx2;
        if (ty2 < ry2) ty2 = ry2;
			
        if (tx2 > 180) 
            tx2 = 180;
        if (ty2 > 180) 
            ty2 = 180;
        return new GridBbox(ty1,tx1,ty2 ,  tx2);
    }
};
