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
        // console.log(this._element.getX()+"----"+ this._element.getY()+"____"+this._element.getWidth()+"----------"+this._element.getHeight()+"---"+this._element.getCenterLocation().x+"_____"+this._element.getCenterLocation().y);
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
      width:280,//30/2 * this._element.getWidth() * curZoom,
      height:140//30/2 * this._element.getHeight() * curZoom
    }
    var can= this.invertColor(node.getImage(),this.getInnerColor(),newRect);
    this.toDrawImage(ctx2d, can, this.getInnerColor(), rect, node, this._network);
    // if(node.getAngle() != 0) {
    //     ctx2d.restore();
    // }
  //   var curZoom = this._network.zoomManager.getZoom();

  //   rect = {
  //     x:3/2 * this._element.getX(),
  //     y:3/2 * this._element.getY(),
  //     width:3/2 * this._element.getWidth() * curZoom,
  //     height:3/2 * this._element.getHeight() * curZoom
  //   }
    
  //   // rect = {
  //   //   x:3/2 * node.getX(),
  //   //   y:3/2 * node.getY(),
  //   //   width: node.getWidth(),
  //   //   height: node.getHeight()
  //   // }
  //   // rect = this._network.zoomManager._getElementZoomRect(this, rect);
    console.log(rect.x+"---"+rect.y+"---"+rect.width+"---"+rect.height);
    
  //   this.invertColor(ctx2d,rect);
  },

  invertColor : function(image,color,rect) {

    if(this._network.isSelected(this._element)){
      // // this._network.offsetWidth;
      // // this._network.offsetHeight;
      // var imgd = ctx2d.getImageData(rect.x,rect.y, rect.width, rect.height); 
      // // var imgd = ctx2d.getImageData(0,0, this._network.offsetWidth, this._network.offsetHeight); 
      // var pix = imgd.data; 
      // for(var i=0;i<pix.length;i++){
      //   if(pix[i] !== 0){
      //     console.log(i);
      //     break;
      //   }
      // }
      // for(var i = 0, n = pix.length; i < n; i += 4) {   
      //     pix[i] = 255 - pix[i];   
      //     pix[i + 1] = 255 - pix[i + 1];   
      //     pix[i + 2] = 255 - pix[i + 2];   
      // }   
      // ctx2d.putImageData(imgd, rect.x, rect.y); 
      
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

    //body size，include border and select
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
    // var imageAsset, imageName, sx, sy, zoom = 1;
    // if (typeof image !== 'object') {
    //   imageName = image;
    //   imageAsset = _twaver.images[image];
    //   image = imageAsset && imageAsset.getImage();
    // }
    // if (this.isImage(image)) {
    //   g.drawImage(imageAsset ? imageAsset.getImage(color,rect.width,rect.height) : image, Math.round(rect.x), Math.round(rect.y), rect.width, rect.height);
    // }
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
  this._linkBundleAttachment = null;
};

twaver.Util.ext(CLinkUIX, twaver.vector.LinkUI, {
  checkAttachments : function() {
    CLinkUIX.superClass.checkAttachments.apply(this, arguments);
    this.checkArrowLineAttachment();
  },
  checkArrowLineAttachment: function(){
    if(this._element.getClient("show.line")) {
      if(this._arrowLineAttachment == null){
        this._arrowLineAttachment = new ArrowLineAttachmentX(this);
        this.addAttachment(this._arrowLineAttachment);  
      }
    } else {
      if(this._arrowLineAttachment != null){
        this.removeAttachment(this._arrowLineAttachment);
        this._arrowLineAttachment = null; 
      }
    }
  },
    
  checkLinkBundleAttachment:function() {
    if(this._element.isBundleAgent() && !this._element.getStyle("link.bundle.expanded")) {
      if(this._linkBundleAttachment == null){
        this._linkBundleAttachment = new LinkBundleAttachmentX(this);
        this.addAttachment(this._linkBundleAttachment); 
      }
    } else {
      if(this._linkBundleAttachment != null){
        this.removeAttachment(this._linkBundleAttachment);
        this._linkBundleAttachment = null;  
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
      // var fill = node.getStyle('vector.fill');
      // _twaver.g.fill(ctx2d, outline_color, "none", node.getStyle('vector.gradient.color'), rect);
      // ctx2d.beginPath();
      // _twaver.g.drawVector(ctx2d, "circle", null, rect);
      // ctx2d.fill();

      if (outline_width > 0) {
        ctx2d.lineWidth = outline_width;
        ctx2d.strokeStyle = outline_color;
        ctx2d.beginPath();
        _twaver.g.drawVector(ctx2d, "circle", null, rect);
        ctx2d.stroke();
      }
      this.toDrawImage(ctx2d, this.names[j], this._ui.getInnerColor(), rect, this._ui._network);
      // rect.x + (rect.width/2 - imageAsset.width/2) + 1, rect.y + (rect.height/2 - imageAsset.height/2),  imageAsset.width, imageAsset.height
      // ctx2d.drawImage(this.names[j], Math.round(rect.x), Math.round(rect.y), rect.width, rect.height);


      
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

// var CGroupUIX = function(network,element){
//   CGroupUIX.superClass.constructor.apply(this, arguments);
// };

// twaver.Util.ext(CGroupUIX, twaver.vector.GroupUI, {
  
// });