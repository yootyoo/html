twaver.Util.registerImage('test_vector', {    
  w: '<%=getClient("width")%>',
  h: '<%=getClient("height")%>',
  origin: { x: 0, y: 0 },
  lineWidth:1,
  lineColor: '#D66204',
  // lineColor: '#017A75',  
  v: [{
    shape: 'rect',
    w: '100%',
    h: '100%',
    fill: function(data, view){
      if(data.getClient('highlighted')){
        return highlightedNodeColor;
      }
      if(data.getChildrenSize()>0){
        return '#FFE6D5';
        // return '#999999';
      }
      return '#FFFCFA';
    },
    lineWidth:2,
  },{
    shape: 'rect',
    x: 7.5,
    y: 8.5,
    w: 12,
    h: 12,          
    visible: '<%=getChildrenSize()>0%>',
  },{
    shape: 'line',
    p1: { x: 13.5, y: 9 },
    p2: { x: 13.5, y: 21, },
    lineWidth:0.5,
    visible: '<%=getChildrenSize()>0 && !isExpanded()%>',
  },{
    shape: 'line',
    p1: { x: 8, y: 14.5 },
    p2: { x: 20, y: 14.5 },
    lineWidth:0.5,      
    visible: '<%=getChildrenSize()>0%>',
  },{
    shape: 'vector',
    name: '<%=getClient("icon")%>',
    scale: { x: 0.85, y: 0.85 },
    x: 30,
    y: 13,
    lineWidth:0,
  }],
  onMouseEnter: function (data, view) {
    updateFocus(data, true);
  },
  onMouseLeave: function (data, view) {
    updateFocus(data, false);
  },
});

var MyGroup = function(){
  MyGroup.superClass.constructor.apply(this, arguments);
  this.setImage('test_vector');   
  this.setStyle('label.position', 'topleft.topright');
  this.setStyle('label.xoffset', 38);
  this.setStyle('label.yoffset', 24);
  this.setStyle('label.font', '14px "Microsoft Yahei"');
  this.setStyle('select.style', 'null');
  // this.setStyle('group.padding.top', 37);
  // this.setStyle('group.padding.left', 7);
  // this.setStyle('group.padding.left',-5);
  // this.setStyle('group.padding.right', -5);
  // this.setStyle('group.padding.bottom', -5);
  this.setStyle('group.fill.color', '#FFFCFA');
  // this.setStyle('group.fill.color', '#EEF4FF');    
  this.setStyle('group.outline.color', '#D66204');
  // this.setStyle('group.outline.color', '#017A75');
  this.setStyle('group.outline.width', 2);
  this.setStyle('group.deep', 0);
  this.setLayerId('node');
  // this.setStyle('group.shape', 'rectangle'); 
}

twaver.Util.ext('MyGroup', twaver.Group,{
  /**
   * 获取网元矢量UI的类名，网元UI用于在network组件上绘制这个网元。
   * TWaver会用返回的这个UI类去创建UI对象
   * @method twaver.Element.getVectorUIClass
   * @return {twaver.vector.ElementUI} 矢量UI类型
   */
  getVectorUIClass : function(){
    return MyGroupUI;
    // return twaver.vector.GroupUI
  },
});

var MyGroupUI = function(){
  MyGroupUI.superClass.constructor.apply(this, arguments);
  console.log(this);
  // this.getNetwork().getView().addEventListener('click',function(e){    
  //  if (this.getElement()) {
  //    console.log("123");
  //  }
  // });  
};

twaver.Util.ext('MyGroupUI', twaver.vector.GroupUI, {
      //绘制网元主体，判断是否为展开状态，进行相应的绘制。
      paintBody: function (ctx) { 
        // console.log('paintBody:'+this);    
        if (this._shapeRect) {
          this.drawExpandedGroup(ctx);
          twaver.vector.GroupUI.superClass.paintBody.apply(this, arguments);
          // MyGroupUI.superClass.paintBody.apply(this, arguments);
        }else{
          // console.log(this.getElement().getName());
          // console.log(this.getElement().getWidth());
          // console.log(this.getElement().getHeight());
          twaver.vector.GroupUI.superClass.paintBody.apply(this, arguments);
        }
      },
      validateBodyBounds: function () {
        // _ bodyBounds是一个数组
        // console.log('validateBodyBounds'+this);
        // this._bodyBounds.add(this.createBodyRect2());
        if (this._shapeRect) {
          var rect = this.getPathRect("group", false);
          // console.debug('rect:'+rect);
          //group.deep 网元组深度
          var deep = this.getStyle('group.deep');
          _twaver.math.grow(rect,deep,deep);
          this.addBodyBounds(rect);
        } else {
          twaver.vector.GroupUI.superClass.validateBodyBounds.call(this);
        }
      },
      createBodyRect: function () {
        // console.log('createBodyRect'+this._shapeRect);
        this._shapeRect = null;
        // console.log(this);
        var group = this._element;
        // console.log('this._element:'+this);
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
        var groupPad = this._element.getStyle('group.padding');
          _twaver.math.addPadding(this._shapeRect, group, 'group.padding', 1);
          var bodyRect = twaver.vector.GroupUI.superClass.createBodyRect.call(this);
          return bodyRect;
          // return {x: this._shapeRect.x, y: this._shapeRect.y , width: bodyRect.width, height: bodyRect.height};
        } else {
          if(this._element.getClient("category") && this._element.getClient("category") === "table"){
             var boborect =twaver.vector.GroupUI.superClass.createBodyRect.call(this);
             return {x:boborect.x,y:boborect.y,width:boborect.width,height:28};
          }else{
            return twaver.vector.GroupUI.superClass.createBodyRect.call(this);
          }
        }
      },
      createBodyRect2: function () {
        // console.log('createBodyRect2'+this);
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