var CLinkUIX = function(network,element){
  CLinkUIX.superClass.constructor.apply(this, arguments);
  this._fromAttachment = null;
  // this._toAttachment = null;
};

twaver.Util.ext(CLinkUIX, twaver.vector.LinkUI, {
  checkAttachments : function() {
    // CLinkUIX.superClass.checkAttachments.apply(this, arguments);
    this.checkLinkAttachment();
  },
  checkLinkAttachment: function(){
    if(!this._fromAttachment){
      this._fromAttachment = new CLinkFromIconsAttachmentX(this);
      this.addAttachment(this._fromAttachment); 
    }
    // if(!this._toAttachment){
    //   this._toAttachment = new CLinkToIconsAttachmentX(this);
    //   this.addAttachment(this._toAttachment); 
    // }
  },
    
  // checkLinkBundleAttachment:function() {
  //   if(this._element.isBundleAgent() && !this._element.getStyle("link.bundle.expanded")) {
  //     if(this._linkBundleAttachment == null){
  //       this._linkBundleAttachment = new LinkBundleAttachmentX(this);
  //       this.addAttachment(this._linkBundleAttachment); 
  //     }
  //   } else {
  //     if(this._linkBundleAttachment != null){
  //       this.removeAttachment(this._linkBundleAttachment);
  //       this._linkBundleAttachment = null;  
  //     }
  //   }
  // }
});
var CLinkX = function(id,fromNode,toNode){
  CLinkX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CLinkX, twaver.Link, {
  getVectorUIClass:function(){
    return CLinkUIX;
  }
});

var CLinkFromIconsAttachmentX = function(elementUI, showOnTop){
  CLinkFromIconsAttachmentX.superClass.constructor.apply(this, arguments);
  this._iconsRects = null;
  this.updateIconsAndRects();
};

twaver.Util.ext(CLinkFromIconsAttachmentX, twaver.vector.Attachment, {
  updateIconsAndRects:function(){
    var elementUI = this._ui;
    var element = this._ui._element;
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var offsetPercent = element.getClient("icons.offset.percent");
    var cx=  fromCenterPoint.x - (fromCenterPoint.x - toCenterPoint.x) * (1/2 - offsetPercent) ;
    var cy = fromCenterPoint.y - (fromCenterPoint.y - toCenterPoint.y) * (1/2 - offsetPercent);
    var rmax = Math.max(element.getClient("icons.rx"),element.getClient("icons.ry"));
    var rectx = cx - rmax;
    var recty = cy - rmax;
    // if(element.getStyle("link.bundle.expanded")){
    //   var bundleChangedPoint = this.bundleOffsetChange({x:rectx,y:recty});
    //   rectx = bundleChangedPoint.x;
    //   recty = bundleChangedPoint.y;
    // }
    var rect = {
      x: rectx,
      y: recty,
      width: 2 * rmax,
      height: 2 * rmax
    }
    this._viewRect = rect;
    // this._iconsRects = [];
    // this._iconsRects.push(rect);
  },
  paint:function(ctx2d){

    this.updateIconsAndRects();
    ctx2d.strokeStyle = "#AEAEAE";
    ctx2d.beginPath();
    this.drawEllipseBezierPath(ctx2d);
    ctx2d.stroke();

  },

  drawEllipseBezierPath:function(ctx2d){
    var element = this._ui._element;
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var offsetPercent = element.getClient("icons.offset.percent");
    var cx=  fromCenterPoint.x - (fromCenterPoint.x - toCenterPoint.x) * (1/2 - offsetPercent) ;
    var cy = fromCenterPoint.y - (fromCenterPoint.y - toCenterPoint.y) * (1/2 - offsetPercent);
    // var rmax = Math.max(element.getClient("icons.rx"),element.getClient("icons.ry"));
    
    if(element.getStyle("link.bundle.expanded")){
      // var bundleChangedPoint = this.bundleOffsetChange({x:cx,y:cy});
      // cx = bundleChangedPoint.x;
      // cy = bundleChangedPoint.y;
      element.setStyle('link.width',2);
    }else{
      element.setStyle('link.width',2);
      // network.addInteractionListener(function(event) {
      //     if(event.kind === "doubleClickElement") {
      //         if(event.element instanceof twaver.Link) {
                
      //           if(link1.getStyle('link.bundle.expanded')){
      //             link1.setStyle('link.width',5);
      //           }else{
      //             link1.setStyle('link.width',2);
      //           }              
      //         }
      //     }
      // });
    }

    var rx = element.getClient("icons.rx");
    var ry = element.getClient("icons.ry");

    var angle;
    if(toCenterPoint.x === fromCenterPoint.x){
      angle = Math.PI/2;
    }else{
      angle = Math.atan((fromCenterPoint.y - toCenterPoint.y) / (toCenterPoint.x - fromCenterPoint.x));
    }

    // angle = angle/180 * Math.PI;
    var k = 0.55228475;
    var basePoint = {x:cx,y:cy};
    var ps = this.rotateChange({
      x : cx - rx,
      y : cy
    },basePoint, angle);

    ctx2d.moveTo(ps.x,ps.y);
    var p1 = this.rotateChange({
      x : cx - rx,
      y : cy - k * ry
    },basePoint, angle);
    var p2 = this.rotateChange({
      x : cx - k * rx,
      y : cy - ry
    },basePoint, angle);
    var pe = this.rotateChange({
      x : cx,
      y : cy - ry
    },basePoint, angle);

    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx + k * rx,
      y : cy - ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx + rx,
      y : cy - k * ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx + rx,
      y : cy
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx + rx,
      y : cy + k * ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx + k * rx,
      y : cy + ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx,
      y : cy + ry
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx - k * rx,
      y : cy + ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx - rx,
      y : cy + k * ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx - rx,
      y : cy
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);
    ctx2d.closePath();

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

  bundleOffsetChange:function(changePoint){
    var bundleDefaultOffset = twaver.Styles.getStyle("link.bundle.gap");
    var element = this._ui._element;
    var bundleIndex = element.getClient("link.bundle.index");
    var bundleLength = element.getClient("link.bundle.length");
    var signedNormalDistance = (bundleIndex - (bundleLength-1)/2) * bundleDefaultOffset;
   
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var descartesToCenterPoint = this.canvasToDescartes(toCenterPoint,fromCenterPoint);
    var distance = Math.sqrt(descartesToCenterPoint.x * descartesToCenterPoint.x + descartesToCenterPoint.y * descartesToCenterPoint.y);

    var normalVector = {
      x: signedNormalDistance * descartesToCenterPoint.y / distance,
      y: -signedNormalDistance * descartesToCenterPoint.x / distance
    }

    var descartesChangePoint = this.canvasToDescartes(changePoint,fromCenterPoint);
    var descartesPoint = {
      x: descartesChangePoint.x + normalVector.x,
      y: descartesChangePoint.y + normalVector.y
    }
    return this.descartesToCanvas(descartesPoint,fromCenterPoint);
  },

  

});

var CLinkToIconsAttachmentX = function(elementUI, showOnTop){
  CLinkToIconsAttachmentX.superClass.constructor.apply(this, arguments);
  this._iconsRects = null;
  this.updateIconsAndRects();
};

twaver.Util.ext(CLinkToIconsAttachmentX, twaver.vector.Attachment, {
  updateIconsAndRects:function(){
    var elementUI = this._ui;
    var element = this._ui._element;
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var offsetPercent = element.getClient("icons.offset.percent");
    var cx=  fromCenterPoint.x - (fromCenterPoint.x - toCenterPoint.x) * (1/2 + offsetPercent);
    var cy = fromCenterPoint.y - (fromCenterPoint.y - toCenterPoint.y) * (1/2 + offsetPercent);
    var rmax = Math.max(element.getClient("icons.rx"),element.getClient("icons.ry"));
    var rectx = cx - rmax;
    var recty = cy - rmax;
    if(element.getStyle("link.bundle.expanded")){
      var bundleChangedPoint = this.bundleOffsetChange({x:rectx,y:recty});
      rectx = bundleChangedPoint.x;
      recty = bundleChangedPoint.y;
    }
    var rect = {
      x: rectx,
      y: recty,
      width: 2 * rmax,
      height: 2 * rmax
    }
    this._viewRect = rect;
    // this._iconsRects = [];
    // this._iconsRects.push(rect);
  },
  paint:function(ctx2d){
    this.updateIconsAndRects();
    ctx2d.fillStyle = "#AEAEAE";
    ctx2d.beginPath();
    this.drawEllipseBezierPath(ctx2d);
    ctx2d.fill();
  },
  drawEllipseBezierPath:function(ctx2d){
    var element = this._ui._element;
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var offsetPercent = element.getClient("icons.offset.percent");
    var cx=  fromCenterPoint.x - (fromCenterPoint.x - toCenterPoint.x) * (1/2 + offsetPercent);
    var cy = fromCenterPoint.y - (fromCenterPoint.y - toCenterPoint.y) * (1/2 + offsetPercent);
    // var rmax = Math.max(element.getClient("icons.rx"),element.getClient("icons.ry"));

    if(element.getStyle("link.bundle.expanded")){
      var bundleChangedPoint = this.bundleOffsetChange({x:cx,y:cy});
      cx = bundleChangedPoint.x;
      cy = bundleChangedPoint.y;
    }

    var rx = element.getClient("icons.rx");
    var ry = element.getClient("icons.ry");

    var angle;
    if(toCenterPoint.x === fromCenterPoint.x){
      angle = Math.PI/2;
    }else{
      angle = Math.atan((fromCenterPoint.y - toCenterPoint.y) / (toCenterPoint.x - fromCenterPoint.x));
    }

    // angle = angle/180 * Math.PI;
    var k = 0.55228475;
    var basePoint = {x:cx,y:cy};
    var ps = this.rotateChange({
      x : cx - rx,
      y : cy
    },basePoint, angle);

    ctx2d.moveTo(ps.x,ps.y);
    var p1 = this.rotateChange({
      x : cx - rx,
      y : cy - k * ry
    },basePoint, angle);
    var p2 = this.rotateChange({
      x : cx - k * rx,
      y : cy - ry
    },basePoint, angle);
    var pe = this.rotateChange({
      x : cx,
      y : cy - ry
    },basePoint, angle);

    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx + k * rx,
      y : cy - ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx + rx,
      y : cy - k * ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx + rx,
      y : cy
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx + rx,
      y : cy + k * ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx + k * rx,
      y : cy + ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx,
      y : cy + ry
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);

    p1 = this.rotateChange({
      x : cx - k * rx,
      y : cy + ry
    },basePoint, angle);
    p2 = this.rotateChange({
      x : cx - rx,
      y : cy + k * ry
    },basePoint, angle);
    pe = this.rotateChange({
      x : cx - rx,
      y : cy
    },basePoint, angle);
    ctx2d.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);
    ctx2d.closePath();

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
  bundleOffsetChange:function(changePoint){
    var bundleDefaultOffset = twaver.Styles.getStyle("link.bundle.gap");
    var element = this._ui._element;
    var bundleIndex = element.getClient("link.bundle.index");
    var bundleLength = element.getClient("link.bundle.length");
    var signedNormalDistance = (bundleIndex - (bundleLength-1)/2) * bundleDefaultOffset;
   
    var from = element._fromNode;
    var to = element._toNode;
    var fromCenterPoint = {
      x: from.getX() + from.getWidth()/2,
      y: from.getY() + from.getHeight()/2
    };
    var toCenterPoint = {
      x:to.getX() + to.getWidth()/2,
      y:to.getY() + to.getHeight()/2
    };
    var descartesToCenterPoint = this.canvasToDescartes(toCenterPoint,fromCenterPoint);
    var distance = Math.sqrt(descartesToCenterPoint.x * descartesToCenterPoint.x + descartesToCenterPoint.y * descartesToCenterPoint.y);

    var normalVector = {
      x: signedNormalDistance * descartesToCenterPoint.y / distance,
      y: -signedNormalDistance * descartesToCenterPoint.x / distance
    }

    var descartesChangePoint = this.canvasToDescartes(changePoint,fromCenterPoint);
    var descartesPoint = {
      x: descartesChangePoint.x + normalVector.x,
      y: descartesChangePoint.y + normalVector.y
    }
    return this.descartesToCanvas(descartesPoint,fromCenterPoint);
  }
});