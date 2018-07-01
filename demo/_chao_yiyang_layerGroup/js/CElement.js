var CLinkX = function(id,fromNode,toNode,upperHalfLink){
  CLinkX.superClass.constructor.apply(this, arguments);
  this.upperHalfLink = upperHalfLink;
  if(upperHalfLink){
    this.setStyle("link.type","orthogonal.H.V");

  }else{
    this.setStyle("link.type","orthogonal.V.H");
  }
  this.setStyle("link.color","#C0C0C0");
};

twaver.Util.ext(CLinkX, twaver.Link, {

});

var CGroupUIX = function(network,element){
  CGroupUIX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CGroupUIX, twaver.vector.GroupUI, {
  validateBodyBounds: function () {
    var $math=_twaver.math;
    var node = this._element;
    this.getBodyRect();
    var shape = node.getClient("group.shape");
    if (shape === "parallelogram" && this._shapeRect) {
      var rect = this.getPathRect("group", false);
      var deep = this.getStyle('group.deep');
      var parallelogramAngle = node.getClient("group.angle") * Math.PI / 180;
      var xOffset = this._shapeRect.height*Math.tan(parallelogramAngle);
      this._shapeRect.width = this._shapeRect.width + xOffset*3/2;
      this._shapeRect.x = this._shapeRect.x-xOffset*3/4;

      var rectXOffset = rect.height*Math.tan(parallelogramAngle);
      rect.width = rect.width + rectXOffset*3/2;
      rect.x = rect.x - rectXOffset*3/4;
      $math.grow(rect,deep+1,deep+1);
      this.addBodyBounds(rect);

      var bound=_twaver.cloneRect(rect);
      bound.width+=10;
      bound.height+=10;
      this.addBodyBounds(bound);

    } else {
      twaver.vector.GroupUI.superClass.validateBodyBounds.call(this);
    }
    
  },

  drawPath : function(ctx, prefix, padding, pattern, points, segments, close) {

    var $g=_twaver.g;
    var zoomManager = this._network.zoomManager;
    var node = this._element;
    var rect = null;
    var shape = node.getClient("group.shape");
    if(shape === "parallelogram"){
      if (prefix == 'group') {
        rect = this._shapeRect;
      } else {
        rect = this.getZoomBodyRect();
      };
      if (padding) {
        $math.addPadding(rect, node, prefix + '.padding', 1);
      }
      var lineWidth = node.getStyle(prefix + '.outline.width');
      this.setGlow(this, ctx);
      this.setShadow(this, ctx);
      if (node.getAngle() != 0) {
        if (!( node instanceof $Group)) {
          rect = node.getOriginalRect();
          rect = zoomManager._getElementZoomRect(this, rect);
        }
        ctx.save();
        twaver.Util.rotateCanvas(ctx, rect, node.getAngle());
      }

      var fill = node.getStyle(prefix + '.fill');
      var fillColor;
      if (fill) {
        if (this._innerColor && !$element.hasDefault(this._element)) {
          fillColor = this._innerColor;
        } else {
          fillColor = node.getStyle(prefix + '.fill.color');
        }
        var gradient = node.getStyle(prefix + '.gradient');
        if (gradient) {
          $g.fill(ctx, fillColor, gradient, node.getStyle(prefix + '.gradient.color'), rect);
        } else {
          ctx.fillStyle = fillColor;
        }
      }

      //draw round rect body.
      var parallelogramAngle = node.getClient("group.angle") * Math.PI / 180;
      var xOffset = rect.height*Math.tan(parallelogramAngle);
      if(parallelogramAngle){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rect.x+xOffset, rect.y);
        ctx.lineTo(rect.x+rect.width, rect.y);
        ctx.lineTo(rect.x+rect.width-xOffset, rect.y+rect.height);
        ctx.lineTo(rect.x,rect.y+rect.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if(fillColor.indexOf("rgba(") !== -1){
          var groupDeep = node.getClient("group.deep");
          var changedColor = this._element.increaseOpacity(fillColor);
          ctx.fillStyle=changedColor;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(rect.x, rect.y+rect.height);
          ctx.lineTo(rect.x+rect.width-xOffset, rect.y+rect.height);
          ctx.lineTo(rect.x+rect.width-xOffset, rect.y+rect.height+groupDeep);
          ctx.lineTo(rect.x, rect.y+rect.height+groupDeep);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          changedColor = this._element.increaseOpacity(changedColor);
          ctx.fillStyle=changedColor;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(rect.x+rect.width-xOffset, rect.y+rect.height);
          ctx.lineTo(rect.x+rect.width, rect.y);
          ctx.lineTo(rect.x+rect.width, rect.y+groupDeep);
          ctx.lineTo(rect.x+rect.width-xOffset, rect.y+rect.height+groupDeep);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }  

      
    }else{
      twaver.vector.GroupUI.superClass.drawPath.apply(this,arguments);
    }

    if (node.getAngle() != 0) {
      ctx.restore();
    }
  },
  
});
var CGroupX = function(id){
  CGroupX.superClass.constructor.apply(this, arguments);
  this.enlarged = false;
};

twaver.Util.ext(CGroupX, twaver.Group, {
  getVectorUIClass:function(){
    return CGroupUIX;
  },
  isEnlarged:function() {
    return this.enlarged;
  },
  setEnlarged:function(value){
    this.enlarged = value;
    var fillColor;
    if(value === false){
      this.setClient("group.angle",45);
      this.setClient("group.shape","parallelogram");
      this.setClient("group.deep",10);

      // group.setStyle('group.shape', 'hexagon');   
      this.setStyle("select.style","none");
      this.setStyle("group.gradient","linear.northeast");
      this.setStyle("group.deep",0);
      this.setStyle("label.position","right.left");
      this.setStyle("label.xoffset",-10);
      this.setStyle("label.yoffset",-30);
      this.setStyle("label.font","italic bold 12px/30px arial,sans-serif");

      fillColor = this.changeHalfOpacity(this.getStyle("group.fill.color"));
      this.setStyle("group.fill.color",fillColor);
    }else{
      this.setClient("group.angle",1);
      this.setClient("group.shape","parallelogram");
      this.setClient("group.deep",0);

      this.setStyle("select.style","none");
      this.setStyle("group.gradient","linear.northeast");
      this.setStyle("group.deep",0);
      this.setStyle("label.position","right.right");
      this.setStyle("label.xoffset",0);
      this.setStyle("label.yoffset",0);
      this.setStyle("label.font","italic bold 12px/30px arial,sans-serif");

      fillColor = this.changeOpacity(this.getStyle("group.fill.color"));
      this.setStyle("group.fill.color",fillColor);
    }
  },

  increaseOpacity:function(rgba){
    if(typeof rgba === "string" && rgba.indexOf("rgba(") !== -1 && rgba.indexOf(")") !== -1){
      var rgbaSub = rgba.substring(5, rgba.length-1);
      var rgbaNums = rgbaSub.split(",");
      var returnColor ="rgba(";
      var i;
      for(i=0;i<rgbaNums.length;i++){
        if(i !== rgbaNums.length-1){
          returnColor = returnColor +rgbaNums[i]+",";
        }else{
          var opacity = parseFloat(rgbaNums[i])+0.25;
          returnColor = returnColor +opacity+")";
        }
      }
      return returnColor;
    }else{
      return rgba;
    }
  },
  changeOpacity:function(rgba){
    if(typeof rgba === "string" && rgba.indexOf("rgba(") !== -1 && rgba.indexOf(")") !== -1){
      var rgbaSub = rgba.substring(5, rgba.length-1);
      var rgbaNums = rgbaSub.split(",");
      var returnColor ="rgba(";
      var i;
      for(i=0;i<rgbaNums.length;i++){
        if(i !== rgbaNums.length-1){
          returnColor = returnColor +rgbaNums[i]+",";
        }else{
          var opacity = 1;
          returnColor = returnColor +opacity+")";
        }
      }
      return returnColor;
    }else{
      return rgba;
    }
  },
  changeHalfOpacity:function(rgba){
    if(typeof rgba === "string" && rgba.indexOf("rgba(") !== -1 && rgba.indexOf(")") !== -1){
      var rgbaSub = rgba.substring(5, rgba.length-1);
      var rgbaNums = rgbaSub.split(",");
      var returnColor ="rgba(";
      var i;
      for(i=0;i<rgbaNums.length;i++){
        if(i !== rgbaNums.length-1){
          returnColor = returnColor +rgbaNums[i]+",";
        }else{
          var opacity = 0.5;
          returnColor = returnColor +opacity+")";
        }
      }
      return returnColor;
    }else{
      return rgba;
    }
  },
});