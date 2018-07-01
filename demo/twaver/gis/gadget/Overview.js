twaver.gis.gadget.Overview = function(id,map){
	this._id = (id==null)? "Overview":id;
	this._target = map;
	this.map = new twaver.gis.Map(map.content,id+"m");
	twaver.gis.gadget.Overview.superClass.constructor.call(this);
	this._panel.appendChild(this.map.content);
        this.setBorder("1px solid white");
	this.reassignPaintAreaMark();
	this._thinkness = 1;
	this._strokeStyle = "#0000FF";
	this._fillStyle = "rgba(255,255,255,0.5)";
}
twaver.Util.ext('twaver.gis.gadget.Overview', twaver.gis.gadget.BlockPanel, {
	initView:function(){
		this._target.addMapEventListener(this.monitorTarget,this);
		this.map.setEnableDoubleZoom(false);
		this.map.setEnableMouseWheel(false);
		this.map.setPanFunction(this.permitPanning,this);
		this.map.setZoomLevel(this.getRelativeZoom());
	},
	setVisibleAreaRectangle:function(size){
		this._visibleAreaSize = size;
	},
	setVisibleAreaThinkness:function(w){
		this._thinknewss = w;
	},
	setVisibleAreaFillStyle:function(s){
		this._fillStyle = s;
	},
	setVisibleAreaStrokeStyle:function(s){
		this._strokeStyle = s;
	},
        setBorder:function(s) {
            this.map.content.style.border = s;
        },
	reassignPaintAreaMark:function(){
		var ow = this;
		this.map._om.paintArea = function(g){
			var vb;
			var oldStrokeStyle = g.strokeStyle;
			var oldWidth = g.lineWidth;
			var oldFillStyle = g.fillStyle;
			if(ow._visibleAreaSize){
				var cx = ow.map._om._size.width/2;
				var cy = ow.map._om._size.height/2;
				var hw = ow._visibleAreaSize.width/2;
				var hh = ow._visibleAreaSize.height/2;
				vb = new twaver.gis.geometry.Bounds(cx - hw,cx + hw,cy - hh,cy+hh);
			}else{
				// var vbs = ow._target._om._size;
				// var ref = new twaver.gis.geometry.Bounds(0,ow.map._om._size.width,0,ow.map._om._size.height);
				// vbs = new twaver.gis.geometry.Bounds(0,vbs.width,0,vbs.height);
				// var bl = ow._target.getGeoPointFromPointOnMap(vbs.minx,vbs.miny);
				// var br = ow._target.getGeoPointFromPointOnMap(vbs.minx,vbs.maxy);
				// var tl = ow._target.getGeoPointFromPointOnMap(vbs.maxx,vbs.maxy);
				// var tr = ow._target.getGeoPointFromPointOnMap(vbs.maxx,vbs.miny);
				// bl = ow.recalSP(this.getScreenPointFromGeoPoint(bl),ref);
				// br = ow.recalSP(this.getScreenPointFromGeoPoint(br),ref);
				// tl = ow.recalSP(this.getScreenPointFromGeoPoint(tl),ref);
				// tr = ow.recalSP(this.getScreenPointFromGeoPoint(tr),ref);
				// vb = new twaver.gis.geometry.Bounds(bl.x,tl.x,br.y,tr.y);
				var vbs = ow._target._om._size;
				
				vbs = new twaver.gis.geometry.Bounds(0,vbs.width,0,vbs.height);
				var bl = ow._target.getGeoPointFromPointOnMap(vbs.minx,vbs.miny);
				var br = ow._target.getGeoPointFromPointOnMap(vbs.minx,vbs.maxy);
				var tl = ow._target.getGeoPointFromPointOnMap(vbs.maxx,vbs.maxy);
				var tr = ow._target.getGeoPointFromPointOnMap(vbs.maxx,vbs.miny);
				bl = this.getScreenPointFromGeoPoint(bl);
				br = this.getScreenPointFromGeoPoint(br);
				tl = this.getScreenPointFromGeoPoint(tl);
				tr = this.getScreenPointFromGeoPoint(tr);
				var rx = ow.map._om.viewportBounds.width/ow._target._om.viewportBounds.height;
				var ry = ow.map._om.viewportBounds.height/ow._target._om.viewportBounds.height;
				var radio = Math.min(rx,ry);
				var cx = (bl.x+tl.x)/2;
				var cy = (br.y+tr.y)/2;
				var w = radio*(tl.x-bl.x)/2;
				var h = radio*(br.y - tr.y)/2;
				vb = new twaver.gis.geometry.Bounds(cx-w,cx+w,cy-h,cy+h);
			}
			g.strokeStyle = ow._strokeStyle;
			g.lineWidth = ow._thinkness;
			g.fillStyle = ow._fillStyle;
			g.fillRect(vb.minx,vb.miny,vb.maxx-vb.minx,vb.maxy-vb.miny);
			g.strokeRect(vb.minx,vb.miny,vb.maxx-vb.minx,vb.maxy-vb.miny);
			
			g.strokeStyle = oldStrokeStyle;
			g.lineWidth = oldWidth;
			g.fillStyle = oldFillStyle;
		}
	},
	recalSP:function(p,ref){
		var x = (p.x<ref.minx)? ref.x:p.x;
		var y = (p.y>ref.maxy)? ref.maxy:p.y;
		x = (x>ref.maxx)? ref.maxx:x;
		y = (y<ref.miny)? ref.miny:y;
		return {"x":x,"y":y};
	},
	permitPanning:function(){
		return false;
	},
	setSize:function(size){
		this.map.setSize(size);
       	// this.map.setViewport(size);
	},
	monitorTarget:function(evt){
		if(twaver.gis.event.MapEvent.ZOOM_CHANGED === evt.type){
			this.map.setZoomLevel(this.getRelativeZoom());
		}else if(twaver.gis.event.MapEvent.CENTER_CHANGED === evt.type){
			this.map.setCenter(this._target.getCenter());
		}
	},
	getRelativeZoom:function(){
		var tz = this._target.getZoomLevel();
		if(tz<=2){
			return 1;
		}
		return tz - 2;
	}
	
});
