twaver.gis.gadget.Mark = function(){
	//"shape","image"
	this._ctype = "shape";
	this.src = "";
	this.size = {width:10,height:10};
	//rect,circle,line,image
	this._shapeType = "rect";
	this.pos = {x:0,y:0};
	this.geo = {latitdu:0,longitude:0};
	
};
twaver.Util.ext('twaver.gis.gadget.Mark',Object,{
	setContentType:function(t){
		if(this._ctype!=t){
			this._ctype = t;
		}
	},
	getContentType:function(){
		return this._ctype;
	},
	setSize:function(s){
		this.size = s;
	},
	getSize:function(){
		return this._size;
	},
	setShapeType:function(st){
		this._shapeType = st;
	},
	getShapeType:function(){
		return this._shapeType;
	},
	paint:function(graphics){
		var shape = getShape(this);
		if(shape){
			shape.paint(graphics);
		}
	}
	
});

