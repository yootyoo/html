var CNodeUIX = function(network,element){
  CNodeUIX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CNodeUIX, twaver.vector.NodeUI, {
  createBodyRect:function(){
    if(this.updateBodyRect){
      return this._element.getRect();
    }else{
      var vector_radius = this._element.getClient("vector.radius");
      if(vector_radius && vector_radius > Math.max(this._element.getWidth(), this._element.getHeight())/2) {
        var rect ={};
        rect.x = this._element.getCenterLocation().x - vector_radius;
        rect.y = this._element.getCenterLocation().y - vector_radius;
        rect.width = vector_radius * 2;
        rect.height = rect.width;
        return rect;
      }
      return this._element.getRect();
    }
  },
  paintBody: function(ctx2d) {
    this.drawVectorBody(ctx2d);
    this.drawDefaultBody(ctx2d);
  },

  drawDefaultBody: function(ctx2d) {
    var node = this._element;
    var imageAsset;
    if (!node.getImage() || typeof node.getImage() === 'string' && !(imageAsset = _twaver.getImageAsset(node.getImage()))) {
      return;
    }
    var rect = node.getRect();
    _twaver.math.addPadding(rect, this._element, 'image.padding', 1);
    if(node.getAngle() != 0) {
        ctx2d.save();
        rect = node.getOriginalRect();
        rect = this._network.zoomManager._getElementZoomRect(this,rect);
        twaver.Util.rotateCanvas(ctx2d, rect, node.getAngle());
    }
    this.setShadow(this, ctx2d);
    var self = this;
    var curZoom = this._network.zoomManager.getZoom();
    var newRect = {
      width:280,
      height:140
    }
    var can= this.invertColor(node.getImage(),this.getInnerColor(),newRect);
    this.toDrawImage(ctx2d, can, this.getInnerColor(), rect, node, this._network);
  },

  invertColor : function(image,color,rect) {

    if(this._network.isSelected(this._element)){      
      var can = document.createElement("canvas");
      var ctx2d = can.getContext("2d");
      var imageAsset = _twaver.images[image];
      ctx2d.drawImage(imageAsset.getImage(color,rect.width,rect.height), 0, 0, rect.width, rect.height);
      var imgd = ctx2d.getImageData(0,0, rect.width, rect.height); 
      var pix = imgd.data; 
      for(var i = 0, n = pix.length; i < n; i += 4) {   
          pix[i] = 255 - pix[i];   
          pix[i + 1] = 255 - pix[i + 1];   
          pix[i + 2] = 255 - pix[i + 2];   
      }
      ctx2d.putImageData(imgd, 0, 0); 
      return can;  
    }else{
      var can = document.createElement("canvas");
      var ctx2d = can.getContext("2d");
      var imageAsset = _twaver.images[image];
      ctx2d.drawImage(imageAsset.getImage(color,rect.width,rect.height), 0, 0, rect.width, rect.height);
      return can;
    }
  },

  drawVectorBody: function(ctx2d) {
    CNodeUIX.superClass.drawVectorBody.apply(this, arguments);
  },

  checkIconsAttachment : function() {
    var icons = this._network.getIconsNames(this._element);
    if (icons && icons.length > 0) {
      if (!this._iconsAttachment) {
        this._iconsAttachment = new CIconsAttachmentX(this);
        this.addAttachment(this._iconsAttachment);
      }
    } else {
      if (this._iconsAttachment) {
        this.removeAttachment(this._iconsAttachment);
        this._iconsAttachment = null;
      }
    }
  },
  validate:function(){      
    var scope = this;
    if (this._invalidateFlag == false) {
      return;
    }
    this._bodyBounds.clear();
    if (this._invalidateAttachmentsFlag) {
      this._invalidateAttachmentsFlag = false;
      this.checkAttachments();
    }
    this._invalidateFlag = false;

    this.updateStyle();
    //calc body bounds
    this.validateImpl();

    this._attachments.forEach(function(attachment) {
      attachment.validate();
    });

    var unionRect;
    this._bodyBounds.forEach(function(rect) {
      unionRect = _twaver.math.unionRect(unionRect, rect);
    });
    if(unionRect == null){
      unionRect = _twaver.cloneRect(this._element.getLocation());
      unionRect.width = 0;
      unionRect.height = 0;
    }
    var _iconOffset,_iconsRadius;
    if(this._element.getClient("icons.offset")) {
      _iconOffset = this._element.getClient("icons.offset");
    }
    if(this._element.getClient("icons.radius")) {
      _iconsRadius = this._element.getClient("icons.radius");
    }
    if(_iconOffset && _iconsRadius){
      var increase = _iconOffset + _iconsRadius * 2;
      //body size，include border and select
      unionRect = {
        x:unionRect.x - increase,
        y:unionRect.y - increase,
        width:unionRect.width + 2 * increase,
        height:unionRect.height + 2 * increase
      };
    }
    this._unionBodyBounds = {
      x : unionRect.x,
      y : unionRect.y,
      width : unionRect.width,
      height : unionRect.height
    };
    
    // update view rect
    this._attachments.forEach(function(attachment) {
      if(attachment instanceof twaver.vector.EditAttachment){
                if(attachment.getElementUI() instanceof  twaver.vector.LinkUI ){
                    unionRect = _twaver.math.unionRect(unionRect, attachment._viewRect);
                }else {
                    unionRect = _twaver.math.unionRect(unionRect, scope._network.zoomManager._reverseElementZoomRect(scope, attachment._viewRect));
                }
            }else if(attachment.getElementUI() instanceof twaver.vector.LinkUI ){
              unionRect = _twaver.math.unionRect(unionRect, scope._network.zoomManager._getAttachmentZoomOutLineRect(attachment, attachment._viewRect));
            }else if((attachment.getElementUI() instanceof twaver.vector.GroupUI && attachment.getElementUI()._shapeRect)){
              if(attachment instanceof twaver.vector.IconsAttachment){
                unionRect = _twaver.math.unionRect(unionRect, attachment._viewRect);
              }else{
                unionRect = _twaver.math.unionRect(unionRect, scope._network.zoomManager._getAttachmentZoomOutLineRect(attachment, attachment._viewRect));
              }
            }else{
        unionRect = _twaver.math.unionRect(unionRect, attachment._viewRect);
      }
    });

    //the whole size of the ui
    this._viewRect = unionRect;
  },

  toDrawImage:function(g, image, color, rect, data, view, inPattern){
    g.drawImage(image, Math.round(rect.x), Math.round(rect.y), rect.width, rect.height);
  },

  isImage : function (image) {
    return image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof HTMLVideoElement;
  },
});

var CNodeX = function(id){
  CNodeX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CNodeX, twaver.Node, {
  getVectorUIClass:function(){
    return CNodeUIX;
  }
});

var CLinkUIX = function(network,element){
  CLinkUIX.superClass.constructor.apply(this, arguments);
  this._arrowLineAttachment = null;
};

twaver.Util.ext(CLinkUIX, twaver.vector.LinkUI, {
  checkAttachments : function() {
    CLinkUIX.superClass.checkAttachments.apply(this, arguments);
    this.checkArrowLineAttachment();
  },
  checkArrowLineAttachment: function(){
    if(this._element.getClient("show.line")) {
      if(this._arrowLineAttachment === null){
        this._arrowLineAttachment = new ArrowLineAttachmentX(this);
        this.addAttachment(this._arrowLineAttachment);  
      }
    } else {
      if(this._arrowLineAttachment !== null){
        this.removeAttachment(this._arrowLineAttachment);
        this._arrowLineAttachment = null; 
      }
    }
  }
});

var CLinkX = function(id,fromNode,toNode){
  CLinkX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CLinkX, twaver.Link, {
  getVectorUIClass:function(){
    return CLinkUIX;
  }
});

var CGroupUIX = function(network,element){
  CGroupUIX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CGroupUIX, twaver.vector.GroupUI, {
  
});

var CGroupX = function(id){
  CGroupX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CGroupX, twaver.Group, {
  getVectorUIClass:function(){
    return CGroupUIX;
  }  
});


var CIconsAttachmentX = function(elementUI, showOnTop){
  CIconsAttachmentX.superClass.constructor.apply(this, arguments);
  this.names=null;
  this.offset = 0;
  this.radius = 0;
  this._iconsRects = null;
  this._iconsNames = null;
  this.updateIconsAndRects();
};

twaver.Util.ext(CIconsAttachmentX, twaver.vector.Attachment, {
  updateIconsAndRects:function(){
    var element = this._ui._element;
    this._iconsRects = [];
    var angles = element.getClient("icons.angle");
    this._iconsNames =  network.getIconsNames(element);
    if(element.getClient("icons.radius")){
      this.radius = element.getClient("icons.radius");
    }
    if(this._iconsNames){
      for(var i=0;i<this._iconsNames.length;i++){
        var rect = this.convertAngleToRectangle(angles[i]);
        this._iconsRects.push(rect);
      }
    }
  },
  convertAngleToRectangle:function(angle){
    var element = this._ui._element;
    var bodyRect = this._ui.getBodyRect();
    if(element.getClient("icons.offset")){
      this.offset = element.getClient("icons.offset");
    }
    var rect = {};
    rect.x = bodyRect.x + bodyRect.width / 2 + Math.sin((angle/180) * Math.PI) * (bodyRect.width / 2 + this.offset + this.radius) - this.radius;
    rect.y = bodyRect.y + bodyRect.height / 2 - Math.cos((angle/180) * Math.PI) * (bodyRect.height / 2 + this.offset + this.radius) - this.radius;
    rect.width = this.radius * 2;
    rect.height = rect.width;
    return rect;
  },
  paint:function(ctx2d){
    var element = this._ui._element;
    this.names = network.getIconsNames(element);
    var angles = element.getClient("icons.angle");
    var bodyRect = this._ui.getBodyRect();
    if(this.names == null || this.names.length == 0 || !angles){
      return;
    }
    if(angles.length != this.names.length) {
      return;
    }
    if(element.getClient("icons.radius")){
      this.radius = element.getClient("icons.radius");
    }
    var outline_width = element.getClient("icons.outline.width");
    var outline_color = element.getClient("icons.outline.color");
    var fill_color = element.getClient("icons.fill.color");
    this.updateIconsAndRects();
    for(var j=0;j<this.names.length;j++){
      var imageAsset = _twaver.images[this.names[j]];
      if(imageAsset == null){
        return;
      }
      var rect= this.convertAngleToRectangle(angles[j]);

      if (outline_width > 0) {
        ctx2d.lineWidth = outline_width;
        ctx2d.strokeStyle = outline_color;
        ctx2d.beginPath();
        _twaver.g.drawVector(ctx2d, "circle", null, rect);
        ctx2d.stroke();
      }
      this.toDrawImage(ctx2d, this.names[j], this._ui.getInnerColor(), rect, this._ui._network); 
    }

  },

  toDrawImage:function(g, image, color, rect, view, inPattern){
    var imageAsset, imageName, sx, sy, zoom = 1;
    if (typeof image !== 'object') {
      imageName = image;
      imageAsset = _twaver.images[image];
      image = imageAsset && imageAsset.getImage();
    }
    if (this.isImage(image)) {
      g.drawImage(imageAsset ? imageAsset.getImage(color) : image, rect.x + (rect.width/2 - imageAsset._width/2) + 1, rect.y + (rect.height/2 - imageAsset._height/2),  imageAsset._width, imageAsset._height);
    }
  },

  isImage : function (image) {
    return image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof HTMLVideoElement;
  },

});

var ArrowLineAttachmentX = function(elementUI, showOnTop){
  ArrowLineAttachmentX.superClass.constructor.apply(this, arguments);
  this._percentLine = -1;
  this._offsetLine = -1;
  this._lengthLine = -1;
  this._colorLine = null;
  this._widthLine = -1;
  this._arrowLength = 5;
  this._iconFromText = null;
  this._iconToText = null;
};

twaver.Util.ext(ArrowLineAttachmentX, twaver.vector.Attachment, {
  paint:function(ctx2d){
    var element = this._ui._element;
    var arrays = this.getPoints();
    var i;
    if(!arrays || arrays.length == 0) {
      return;
    }
    this._colorLine = element.getClient("color.line"); 
    this._widthLine = element.getClient("width.line");
    this._iconFromText = element.getClient("icon.from.text");
    this._iconToText = element.getClient("icon.to.text");

    if(!this._colorLine) {
      this._colorLine = "#1DB964";
    }
    if(this._widthLine === -1) {
      this._widthLine = 1;
    }

    ctx2d.strokeStyle = this._colorLine;
    ctx2d.lineWidth = this._widthLine;
    ctx2d.beginPath();
    ctx2d.moveTo(arrays[0].x,arrays[0].y);
    ctx2d.lineTo(arrays[1].x,arrays[1].y);
    ctx2d.stroke();
    ctx2d.fillStyle = this._colorLine;
    ctx2d.beginPath();
    ctx2d.moveTo(arrays[2].x,arrays[2].y);
    ctx2d.lineTo(arrays[3].x,arrays[3].y);
    ctx2d.lineTo(arrays[4].x,arrays[4].y);
    ctx2d.closePath();
    ctx2d.fill();

    ctx2d.strokeStyle = this._colorLine;
    ctx2d.lineWidth = this._widthLine;
    ctx2d.beginPath();
    ctx2d.moveTo(arrays[6].x,arrays[6].y);
    ctx2d.lineTo(arrays[7].x,arrays[7].y);
    ctx2d.stroke();
    ctx2d.fillStyle = this._colorLine;
    ctx2d.beginPath();
    ctx2d.moveTo(arrays[8].x,arrays[8].y);
    ctx2d.lineTo(arrays[9].x,arrays[9].y);
    ctx2d.lineTo(arrays[10].x,arrays[10].y);
    ctx2d.closePath();
    ctx2d.fill();

    var link = this._ui._element;
    var fromPoint = link._fromNode.getCenterLocation();
    var toPoint = link._toNode.getCenterLocation();
    var angle= this.getTextAngleInDescartes(fromPoint, toPoint);
    if(this._iconFromText){
      ctx2d.font = "12px arial";
      ctx2d.fillStyle = this._colorLine;
      ctx2d.textAlign = "center";
      ctx2d.textBaseline = 'middle';
      ctx2d.save();
      ctx2d.translate(arrays[5].x,arrays[5].y);
      ctx2d.rotate(-angle);
      ctx2d.translate(-arrays[5].x,-arrays[5].y);
      ctx2d.fillText(this._iconFromText,arrays[5].x,arrays[5].y);
      ctx2d.restore();

    }
    if(this._iconToText){
      ctx2d.font = "12px arial";
      ctx2d.fillStyle = this._colorLine;
      ctx2d.textAlign = "center";
      ctx2d.textBaseline = 'middle';

      ctx2d.save();
      ctx2d.translate(arrays[11].x,arrays[11].y);
      ctx2d.rotate(-angle);
      ctx2d.translate(-arrays[11].x,-arrays[11].y);
      ctx2d.fillText(this._iconToText,arrays[11].x,arrays[11].y);
      ctx2d.restore();
    }

  },
  
  getPoints:function (){
    var link = this._ui._element;
    this._percentLine = link.getClient("percent.line");
    if(this._percentLine === -1) {
      this._percentLine = 0.1;
    }
    this._offsetLine = link.getClient("offset.line");
    if(this._offsetLine === -1) {
      this._offsetLine = 5;
    }
    this._lengthLine = link.getClient("length.line");
    if(this._lengthLine === -1) {
      this._lengthLine = 20;
    }
    var arrays= [];    
    var fromPoint = link._fromNode.getCenterLocation();
    var toPoint = link._toNode.getCenterLocation();
    var linkLength = this.getLinkLength(fromPoint, toPoint);
    if(this._lengthLine > linkLength) {
      return null;
    }
    var angle= this.getAngleInDescartes(fromPoint, toPoint);
    
    var fromNodeRaidus = Math.max(link._fromNode.getWidth(),link._fromNode.getHeight());
    var toNodeRadius = Math.max(link._toNode.getWidth(),link._toNode.getHeight())
    if(link._fromNode.getClient("vector.radius")) {
      if(link._fromNode.getClient("vector.radius") > fromNodeRaidus) {
        fromNodeRaidus = link._fromNode.getClient("vector.radius");
      }
    } 
    if(link._toNode.getClient("vector.radius")) {
      if(link._toNode.getClient("vector.radius") > toNodeRadius) {
        toNodeRadius = link._toNode.getClient("vector.radius");
      }
    } 
    //from direction line and arrow
       
    var xstart = this. _offsetLine * Math.sin(angle) + fromPoint.x - (fromPoint.x - toPoint.x) * (fromNodeRaidus/linkLength + this._percentLine);
    var ystart = this. _offsetLine * Math.cos(angle) + fromPoint.y - (fromPoint.y - toPoint.y) * (fromNodeRaidus/linkLength + this._percentLine);
    var ps = {
      x : xstart,
      y : ystart
    };

    var pe = this.rotateChange({
      x : xstart + this._lengthLine,
      y : ystart
    },ps, angle);

    var p1 = this.rotateChange({
      x : xstart + this._lengthLine + Math.cos(Math.PI / 6) * this._arrowLength,
      y : ystart
    },ps, angle);

    var p2 = this.rotateChange({
      x : xstart + this._lengthLine,
      y : ystart - Math.sin(Math.PI / 6) * this._arrowLength
    },ps, angle);

    var p3 = this.rotateChange({
      x : xstart + this._lengthLine,
      y : ystart + Math.sin(Math.PI / 6) * this._arrowLength
    },ps, angle);

    arrays.push(ps);
    arrays.push(pe);
    arrays.push(p1);
    arrays.push(p2);
    arrays.push(p3);

    var ptxt = {
      x : (ps.x + pe.x) /2 - (this. _offsetLine + 7) * Math.sin(angle),
      y : (ps.y + pe.y) /2 - (this. _offsetLine + 7) * Math.cos(angle)
    };

    arrays.push(ptxt);

    //to direction line and arrow
    xstart = toPoint.x - (toPoint.x -fromPoint.x) * (toNodeRadius/linkLength + this._percentLine) - this. _offsetLine * Math.sin(angle);
    ystart = toPoint.y - (toPoint.y -fromPoint.y) * (toNodeRadius/linkLength + this._percentLine) - this. _offsetLine * Math.cos(angle);

    ps = {
      x : xstart,
      y : ystart
    };

    pe = this.rotateChange({
      x : xstart - this._lengthLine,
      y : ystart
    },ps, angle);

    p1 = this.rotateChange({
      x : xstart - this._lengthLine - Math.cos(Math.PI / 6) * this._arrowLength,
      y : ystart
    },ps, angle);

    p2 = this.rotateChange({
      x : xstart - this._lengthLine,
      y : ystart - Math.sin(Math.PI / 6) * this._arrowLength
    },ps, angle);

    p3 = this.rotateChange({
      x : xstart - this._lengthLine,
      y : ystart + Math.sin(Math.PI / 6) * this._arrowLength
    },ps, angle);

    arrays.push(ps);
    arrays.push(pe);
    arrays.push(p1);
    arrays.push(p2);
    arrays.push(p3);

    ptxt = {
      x : (ps.x + pe.x) /2 + (this. _offsetLine + 7) * Math.sin(angle),
      y : (ps.y + pe.y) /2 + (this. _offsetLine + 7) * Math.cos(angle)
    };
    
    arrays.push(ptxt);
    
    return arrays;
  },
  
  getLinkLength :function (p1, p2){
    var length = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y),0.5);
    return length;
  },

  getAngleInDescartes:function (p1, p2){
    if(p1.x > p2.x){
      return Math.atan((p1.y - p2.y) / (p2.x - p1.x)) + Math.PI;
    }else if(p1.x < p2.x){
      return Math.atan((p1.y - p2.y) / (p2.x - p1.x));
    }else{
      if(p2.y == p1.y){
        return 0;
      }
      else if(p2.y > p1.y){
        return Math.PI/2;
      }
      else{
        return -Math.PI/2;
      }
    }
  },

  getTextAngleInDescartes:function (p1, p2){
    if(p1.x !== p2.x){
      return Math.atan((p1.y - p2.y) / (p2.x - p1.x));
    }else{
      if(p2.y == p1.y){
        return 0;
      }
      else if(p2.y > p1.y){
        return Math.PI/2;
      }
      else{
        return -Math.PI/2;
      }
    }
  },

  canvasToDescartes : function(canvasPoint,baseCanvasPoint){
    return {
      x : canvasPoint.x - baseCanvasPoint.x,
      y : baseCanvasPoint.y - canvasPoint.y
    }
  },
  descartesToCanvas : function(descartesPoint,baseCanvasPoint){
    return {
      x : baseCanvasPoint.x + descartesPoint.x,
      y : baseCanvasPoint.y - descartesPoint.y
    }
  },

  rotateChange : function(changePoint,basePoint,angle){
    var rotateInDescartes = function(descartesPoint,angle){
      return {
        x : descartesPoint.x * Math.cos(angle) - descartesPoint.y * Math.sin(angle),
        y : descartesPoint.x * Math.sin(angle) + descartesPoint.y * Math.cos(angle)
      }
    };
    var descartesPoint = this.canvasToDescartes(changePoint,basePoint);
    var rotatedDescartesPoint = rotateInDescartes(descartesPoint,angle);
    return this.descartesToCanvas(rotatedDescartesPoint,basePoint);
  },
});

