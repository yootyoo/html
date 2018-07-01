twaver.gis.shape = {};

var paintCircle = function(g,circle){
	g.beginPath();
	g.arc(circle.x,circle.y,circle.radius,0,2*Math.PI,false);
	if(circle.fillStyle){
		g.fillStyle = circle.fillStyle;
		g.fill();
	}
	if(circle.strokeStyle){
		g.strokeStyle = circle.strokeStyle;
	}
	g.stroke();
	g.closePath();
};
var paintRectangle = function(g,rect){
	var x = rect.x-rect.width/2;
	var y = rect.y-rect.height/2;
	if(rect.fillStyle){
		g.fillStyle = rect.fillStyle;
		g.fillRect(x,y,rect.width,rect.height);
	}
	if(rect.strokeStyle){
		g.strokeStyle = rect.strokeStyle;
	}
	g.strokeRect(x,y,rect.width,rect.height);
	
	
};
var paintLine = function(g,line){
	var length = line.points.length-1;
	g.lineWidth = line.width;
	if(line.strokeStyle){
		g.strokeStyle = line.strokeStyle;
	}
	for(var i=0;i<=length;i++){
		var p = line.points[i];
		if(i==0){
			g.moveTo(p.x,p.y);
		}
		g.lineTo(p.x,p.y);
	}
	g.stroke();
};
var paintImage = function(g,image){
	var imageObj = new Image();
	imageObj = image.src;
	g.drawImage(imageObj,image.x-image.width/2,image.y-image.height/2);
};
var getShape = function(mark){
    	var r;
    	switch(mark.getShapeType()){
    		case "rect":
    			r = new twaver.gis.shape.Rectangle(mark.size,mark.pos);
    			break;
    		case "circle":
    			r = new twaver.gis.shape.Circle(mark.radius,mark.pos);
    			break;
    		case "link":
    			r = new twaver.gis.shape.Line(mark.from,mark.to);
    			break;
    		default:
    			break;
    	}
    	if(r){
    		if(mark.fillStyle)
    			r.fillStyle = mark.fillStyle;
    		if(mark.strokeStyle)
    			r.strokeStyle = mark.strokeStyle;
    	}
    	return r;
   };
   twaver.gis.shape.Circle = function(r,pos){
	this.radius = r;
	this.x = pos.x;
	this.y = pos.y;
	this.fillStyle = "#FF0000";
	this.strokeStyle = "#000000"
};
twaver.Util.ext('twaver.gis.shape.Circle',Object,{
	paint:function(g){
		paintCircle(g,this);
	}
});
twaver.gis.shape.Rectangle = function(size,pos){
	this.width = size.width;
	this.height = size.height;
	this.x = pos.x;
	this.y = pos.y;
	this.strokeStyle = "#000000"
	this.isFilled = function(){
		return ((this.fillStyle!=null)||(this.fillStyle!=undefined));
	}
};
twaver.Util.ext('twaver.gis.shape.Rectangle',Object,{
	paint:function(g){
		paintRectangle(g,this);
	}
});
twaver.gis.shape.Line = function(f,t){
	this.from = f;
	this.to = t;
	this.strokeStyle = "#000000"
}
twaver.Util.ext('twaver.gis.shape.Line',Object,{
	paint:function(g){
		paintLine(g,this);
	}
});
CanvasUtils = {
    isSupportCanvas:function(){
        return CanvasUtils.getGraphic(CanvasUtils.getCanvas("")) != null;
    },
    getCanvas:function(id){
        var canvas = document.createElement("canvas");

        if(id){
            canvas.id = id;
        }
        return canvas;
    },
    getGraphic:function(canvas){
        if(canvas){
            var context = canvas.getContext("2d");
            return context;
        }
        return null;
    }
    
    
};


