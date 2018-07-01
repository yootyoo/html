var MyGroup = function(){
  MyGroup.superClass.constructor.apply(this, arguments);
  this.setImage('test_vector');   
  this.setStyle('label.position', 'topleft.topright');
  this.setStyle('label.xoffset', 38);
  this.setStyle('label.yoffset', 24);
  this.setStyle('label.font', '14px "Microsoft Yahei"');
  this.setStyle('select.style', 'null');
  this.setStyle('group.padding.top', 35);
  this.setStyle('group.padding.left', 10);
  this.setStyle('group.padding.right', 5);
  this.setStyle('group.padding.bottom', 5);
  this.setStyle('group.fill.color', '#FFFCFA');
  this.setStyle('group.outline.color', '#D66204');
  this.setStyle('group.outline.width', 2);
  this.setStyle('group.deep', 0);
  this.setLayerId('node');  
};

twaver.Util.ext('MyGroup', twaver.Group,{
  getVectorUIClass : function(){
    return MyGroupUI;
  },
});

var MyGroupUI = function(){
  MyGroupUI.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext('MyGroupUI', twaver.vector.GroupUI, {
  paintBody: function (ctx) {
    if (this._shapeRect) {
      this.drawExpandedGroup(ctx);
      twaver.vector.GroupUI.superClass.paintBody.apply(this, arguments);
    }else{
      twaver.vector.GroupUI.superClass.paintBody.apply(this, arguments);
    }
  },
  validateBodyBounds: function () {
    // this.getBodyRect();
    this._bodyBounds.add(this.createBodyRect2());
    if (this._shapeRect) {
      var rect = this.getPathRect("group", false);
      var deep = this.getStyle('group.deep');
      _twaver.math.grow(rect,deep+1,deep+1);
      this.addBodyBounds(rect);
    } else {
      twaver.vector.GroupUI.superClass.validateBodyBounds.call(this);
    }
  },

  createBodyRect: function () {
    this._shapeRect = null;
    var group = this._element;
    var network = this._network;
    if (group.isExpanded()) {
      group.getChildren().forEach(function (child) {
        var ui = network.getElementUI(child);
        ui && ui.validate();
      });
      var rects = this.getChildrenRects();
      if (!rects.isEmpty()) {
        var shape = group.getStyle('group.shape');
        var func = _twaver.group[shape];
        if (!func) {
          throw "Can not resolve group shape '" + shape + "'";
        }
        this._shapeRect = func(rects);

      }
    }
    //do this.
    if (this._shapeRect) {
      _twaver.math.addPadding(this._shapeRect, group, 'group.padding', 1);
      var bodyRect = twaver.vector.GroupUI.superClass.createBodyRect.call(this);
      // console.log("shaperect___ x:"+this._shapeRect.x +" y:" + this._shapeRect.y +" width:"+this._shapeRect.width+ " height:"+ this._shapeRect.height);
      // console.log("bodyrect__x:"+bodyRect.x +" y:" + bodyRect.y +" width:"+bodyRect.width+ " height:"+ bodyRect.height);
      return {x: this._shapeRect.x, y: this._shapeRect.y , width: bodyRect.width , height: bodyRect.height};
        // return this._shapeRect;
    } else {
        return twaver.vector.GroupUI.superClass.createBodyRect.call(this);
    }
  },
  createBodyRect2: function () {
    this._shapeRect = null;
    var group = this._element;
    var network = this._network;
    if (group.isExpanded()) {
      group.getChildren().forEach(function (child) {
        var ui = network.getElementUI(child);
        ui && ui.validate();
      });
      var rects = this.getChildrenRects();
      if (!rects.isEmpty()) {
        var shape = group.getStyle('group.shape');
        var func = _twaver.group[shape];
        if (!func) {
          throw "Can not resolve group shape '" + shape + "'";
        }
        this._shapeRect = func(rects);
      }
    }
    //do this.
    if (this._shapeRect ) {
      _twaver.math.addPadding(this._shapeRect, group, 'group.padding', 1);
        return this._shapeRect;
    } else {
      return twaver.vector.GroupUI.superClass.createBodyRect.call(this);
    }
  },
});