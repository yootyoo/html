var highlightedNodeColor='#FFFED5';
  var highlightedLinkColor='#FF7D02';
  var nodeMovable=true;

  var globalNode;

  twaver.Util.registerImage('test_vector', {    
    w: '<%=getClient("width")%>',
    h: 28,
    origin: { x: 0, y: 0 },
    lineWidth:1,
    lineColor: '#D66204', 
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

  MyGroup = function(){
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
  }

  twaver.Util.ext('MyGroup', twaver.Group,{
    getVectorUIClass : function(){
      return MyGroupUI;
    },
  });
 
  MyGroupUI = function(){
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

    function init() {
    var box = new twaver.ElementBox();
    var network = new twaver.vector.Network(box);

    document.body.appendChild(network.getView());
    network.adjustBounds({x:0,y:0,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight});
    network.setLinkPathFunction(createLinkPath);
    network.setMovableFunction(function (element) { return nodeMovable; });
    network.setToolTipEnabled(false);
    network.getView().addEventListener('mousemove',function(e){   
      var element = network.getElementAt(e);
      highlightNode(network.getElementBox(), element);
    })

    box.addDataPropertyChangeListener(function(e){
      if(e.property==='expanded'){
        var node=e.source;
        // fixLocation(node);
      }
    });
        
    box.getLayerBox().add(new twaver.Layer('node'));
    box.getLayerBox().add(new twaver.Layer('link'));      
    
    setupData(box);
    var autoLayouter = new twaver.layout.AutoLayouter(box);
    autoLayouter.doLayout('leftright', function(){
      globalNode.setLocation();
    });
    autoLayouter.setExplicitYOffset(-100);
    autoLayouter.setExplicitXOffset(10);
    autoLayouter.setExpandGroup(true);
    autoLayouter.setRepulsion(0.1);
    window.onresize = function (e) { 
      network.adjustBounds({x:0,y:0,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight});
    };
    }

  function fixLocation(node){   
    if(node.isExpanded()){
      node.getChildren().forEach(function(child){
        child.setLocation(child.getClient('x'), child.getClient('y'));
        fixLocation(child);
      });
    }else{
      node.setLocation(node.getClient('x'), node.getClient('y'));
    }
  }

  function updateFocus(data, focus){
    if(data instanceof MyGroup){
      var oldFocus=data.getClient('focus');
      if(oldFocus!=focus){
        data.setClient('focus', focus); 
      }
    }
  }

  function createNode(box, x, y, name, icon, parent){
    var node = new MyGroup();     
    node.setClient('width', 100);
    node.setClient('x', x);
    node.setClient('y', y);
    box.add(node);    

    if(x && y){
      node.setLocation(x, y);
    }
    if(name){
      node.setName(name);
    }
    if(icon){
      node.setClient('icon', icon);
    }
    if(parent){
      node.setParent(parent);
      parent.setExpanded(true);
    }

    return node;
  }

  function createLink(box, from, to, offset, pattern){
    var link = new twaver.Link(from, to); 
    if(offset){
      link.setClient('offset', offset);
    }
    link.setStyle('link.type', 'orthogonal.horizontal');
    link.setStyle('arrow.to', true);    
    link.setStyle('arrow.to.height', 6);
    link.setStyle('arrow.to.width', 8);
    link.setStyle('arrow.to.xoffset', -3);
    if(pattern){
      link.setStyle('link.pattern', pattern);
    }
    link.setLayerId('link');
    highlightLink(link, false);
    box.add(link);
  }

  function createLinkPath(linkUI, defaultPoints){
    var f = linkUI.getFromPoint();
    var t = linkUI.getToPoint();    
    var fromNode=linkUI.getElement().getFromAgent();
    var toNode=linkUI.getElement().getToAgent();

    var points = new twaver.List();
    var pFrom={x: f.x+fromNode.getWidth()/2+1, y: f.y};
    var pFromNext={x: f.x+fromNode.getWidth()/2+1+20, y: f.y};
    var pToNext2={x: t.x-toNode.getWidth()/2-2-20, y: t.y};
    var pToNext1={x: t.x-toNode.getWidth()/2-2-10, y: t.y};
    var pTo={x: t.x-toNode.getWidth()/2-2, y: t.y};

    points.add(pFrom);
    if(linkUI._element.getClient('offset')){
      var direction=t.x<f.x ? -1: 1;
      var controlY=linkUI._element.getClient('offset');
      var seg = new twaver.List();
      seg.add({x: f.x+fromNode.getWidth()/2+1+10, y: f.y});
      seg.add({x: f.x+fromNode.getWidth()/2+1+10, y: controlY});            
      seg.add({x: f.x+fromNode.getWidth()/2+1+50*direction, y: controlY});
      points.add(seg);
      points.add({x: t.x-toNode.getWidth()/2-2-50*direction, y: controlY});
      var seg = new twaver.List();
      seg.add({x: t.x-toNode.getWidth()/2-2-20, y: controlY});
      seg.add({x: t.x-toNode.getWidth()/2-2-20, y: t.y});
      seg.add({x: t.x-toNode.getWidth()/2-2-5, y: t.y});
      points.add(seg);
    }else{
      var seg = new twaver.List();  
      seg.add(pFromNext);
      seg.add(pToNext2);
      seg.add(pToNext1);      
      points.add(seg);
    }
    points.add(pTo);

    return points;
  }

  function highlightNode(box, element){   
    box.forEach(function(data){
      if(data instanceof twaver.Node){
        data.setClient('highlighted', false);   
        data.setStyle('group.fill.color', '#FFFCFA');
      }
      if(data instanceof twaver.Link){
        highlightLink(data, false);
      }
    });
    if(element){
      if(element instanceof twaver.Node){
        element.setClient('highlighted', true);
        element.setStyle('group.fill.color', highlightedNodeColor);
      }
      if(element instanceof twaver.Link){
        highlightLink(element, true);
      }
    }
    //highlight related links.
    if(element instanceof twaver.Node){
      var nodes=[];
      nodes.push(element);
      if(element.getChildrenSize()>0){
        nodes=nodes.concat(element.getChildren().toArray());
      }
      
      box.forEach(function(data){
        if(data instanceof twaver.Link){
          var link=data;
          var from=link.getFromAgent();
          var to=link.getToAgent();
          if(arrayContains(nodes, from, to)){
            highlightLink(link, true);
          }
        }
      });
    }   
  }

  function highlightLink(link, highlighted){
    if(highlighted){
      link.setStyle('link.color', highlightedLinkColor);
      link.setStyle('link.width', 1);
      link.setStyle('arrow.to.color', highlightedLinkColor);
    }else{
      link.setStyle('link.color','#309FC9');
      link.setStyle('link.width', 0.5);
      link.setStyle('arrow.to.color', '#309FC9');
    }
  }

  function arrayContains(array, object1, object2) {
    var i = array.length;
    while (i--) {
      if (array[i] === object1 || array[i] === object2) {
        return true;
      }
    }
    return false;
  }

  function setupData(box){

    var bw62=createNode(box, 1100, 320, '表1','icon_apple');
    globalNode = bw62;
    var bw621=createNode(box, 1100, 348, '字段1','icon_apple',bw62);
    var bw622=createNode(box, 1100, 376, '字段2','icon_apple',bw62);
    var bw623=createNode(box, 1100, 404, '字段3','icon_apple',bw62);
    var bw624=createNode(box, 1100, 432, '字段4','icon_apple',bw62);

    var bw71=createNode(box, 1250, 150, '表2', 'icon_apple');
    var bw711=createNode(box, 1260, 190, '字段1', 'icon_apple', bw71);
    var bw712=createNode(box, 1260, 230, '字段2', 'icon_apple', bw71);
    var bw713=createNode(box, 1260, 270, '字段3', 'icon_apple', bw71);

    var bw72=createNode(box, 1250, 320, '表3', 'icon_apple');
    var bw721=createNode(box, 1260, 360, '字段1', 'icon_apple', bw72);
    var bw722=createNode(box, 1260, 400, '字段2', 'icon_apple', bw72);
    var bw723=createNode(box, 1260, 440, '字段3', 'icon_apple', bw72);
    var bw7211=createNode(box, 1260, 480, '字段4', 'icon_apple', bw72);
    var bw7222=createNode(box, 1260, 520, '字段5', 'icon_apple', bw72);
    var bw7233=createNode(box, 1260, 560, '字段6', 'icon_apple', bw72);
    var bw7214=createNode(box, 1260, 620, '字段7', 'icon_apple', bw72);
    var bw7225=createNode(box, 1260, 660, '字段8', 'icon_apple', bw72);
    var bw7236=createNode(box, 1260, 700, '字段9', 'icon_apple', bw72);

    createLink(box, bw71, bw62);
    createLink(box, bw71, bw72);

    // var erp=createNode(box, 190, 108, 'ERP系统', 'icon_apple'); 
    // var bw=createNode(box, 340, 108, 'BW系统', 'icon_apple'); 
    // var bw1=createNode(box, 350, 150, '数据处理', 'icon_apple', bw);
    // var bw2=createNode(box, 500, 150, '数据模型', 'icon_apple', bw);
    // var bw31=createNode(box, 650, 150, '数据处理', 'icon_apple', bw);
    // var bw32=createNode(box, 650, 190, '应用功能', 'icon_apple', bw);
    // var bw33=createNode(box, 650, 230, '数据接口', 'icon_apple', bw);
    // var bw41=createNode(box, 800, 150, '数据接口', 'icon_apple', bw);
    // var bw42=createNode(box, 800, 190, '数据模型', 'icon_apple', bw);
    // var bw51=createNode(box, 950, 150, '数据处理', 'icon_apple', bw);
    // var bw52=createNode(box, 950, 190, '应用功能', 'icon_apple', bw);
    // var bw53=createNode(box, 950, 230, '数据接口', 'icon_apple', bw);
    // var bw531=createNode(box, 965, 270, '/BIC/AM', 'icon_apple', bw53);
    // var bw61=createNode(box, 1100, 150, '数据处理', 'icon_apple', bw);
    // var bw611=createNode(box, 1110, 190, 'ZMM_1', 'icon_apple', bw61);
    // var bw612=createNode(box, 1110, 230, 'ZMM_2', 'icon_apple', bw61);
    // var bw613=createNode(box, 1110, 270, 'ZMM_3', 'icon_apple', bw61);
    // var bw62=createNode(box, 1100, 320, '数据接口', 'icon_apple', bw);
    // var bw621=createNode(box, 1110, 360, '/BIC/OC', 'icon_apple', bw62);
    // var bw622=createNode(box, 1110, 400, '/BIC/OC', 'icon_apple', bw62);
    // var bw623=createNode(box, 1110, 440, '/BIC/OC', 'icon_apple', bw62);
    // var bw624=createNode(box, 1110, 480, '/BIC/OC', 'icon_apple', bw62);
    // var bw625=createNode(box, 1110, 520, '/BIC/OC', 'icon_apple', bw62);
    // var bw626=createNode(box, 1110, 560, '/BIC/OC', 'icon_apple', bw62);
    // var bw71=createNode(box, 1250, 150, '数据模型', 'icon_apple', bw);
    // var bw711=createNode(box, 1260, 190, 'ZMM_1', 'icon_apple', bw71);
    // var bw712=createNode(box, 1260, 230, 'ZMM_2', 'icon_apple', bw71);
    // var bw713=createNode(box, 1260, 270, 'ZMM_3', 'icon_apple', bw71);
    // var bw72=createNode(box, 1250, 320, '应用功能', 'icon_apple', bw);
    // var bw721=createNode(box, 1260, 360, '/BIC/OC', 'icon_apple', bw72);
    // var bw722=createNode(box, 1260, 400, '/BIC/OC', 'icon_apple', bw72);
    // var bw723=createNode(box, 1260, 440, '/BIC/OC', 'icon_apple', bw72);
    // var bw724=createNode(box, 1260, 480, '/BIC/OC', 'icon_apple', bw72);
    // var bw725=createNode(box, 1260, 520, '/BIC/OC', 'icon_apple', bw72);
    // var bw726=createNode(box, 1260, 560, '/BIC/OC', 'icon_apple', bw72);
    // var bw81=createNode(box, 1400, 150, '数据处理', 'icon_apple', bw);
    // var bw82=createNode(box, 1400, 190, '应用功能', 'icon_apple', bw);
    // var bw83=createNode(box, 1400, 230, '数据接口', 'icon_apple', bw);
    // var bw91=createNode(box, 1550, 150, '数据模型', 'icon_apple', bw);
    // var node10=createNode(box, 1700, 108, '数据存储中心', 'icon_apple');  
    // var node11=createNode(box, 1700, 448, '指标管理平台', 'icon_apple');  
    // node10.setClient('width', 130);
    // node11.setClient('width', 130);

    // createLink(box, erp, bw1);
    // createLink(box, erp, node10, 50);
    // createLink(box, erp, node11, 660);
    // createLink(box, bw1, bw2);
    // createLink(box, bw1, bw31, 130);
    // createLink(box, bw1, bw42, 280);
    // createLink(box, bw1, bw531, 300);
    // createLink(box, bw2, bw31);
    // createLink(box, bw2, bw32);
    // createLink(box, bw2, bw33);
    // createLink(box, bw32, bw41);
    // createLink(box, bw31, bw42);
    // createLink(box, bw41, node10, 60);
    // createLink(box, bw42, bw51);
    // createLink(box, bw42, bw52);
    // createLink(box, bw42, bw531);
    // createLink(box, bw42, node10, 70);
    // createLink(box, bw51, bw42, 80, [5, 2]);
    // createLink(box, bw51, bw42, 85, [5, 2]);
    // createLink(box, bw51, bw42, 90, [5, 2]);
    // createLink(box, bw51, bw42, 95, [5, 2]);
    // createLink(box, bw52, bw611);
    // createLink(box, bw52, bw612);
    // createLink(box, bw52, bw613);
    // createLink(box, bw52, bw621);
    // createLink(box, bw52, bw622);
    // createLink(box, bw52, bw623);
    // createLink(box, bw52, bw624);
    // createLink(box, bw52, bw625);
    // createLink(box, bw52, bw626);
    // createLink(box, bw531, node11, 655);
    // createLink(box, bw621, node11, 630);
    // createLink(box, bw622, node11, 635);
    // createLink(box, bw623, node11, 640);
    // createLink(box, bw624, node11, 645);
    // createLink(box, bw625, node11, 650);
    // createLink(box, bw611, node10, 80);
    // createLink(box, bw612, node10, 90);
    // createLink(box, bw612, bw711);
    // createLink(box, bw612, bw712);
    // createLink(box, bw612, bw713);
    // createLink(box, bw613, bw721);
    // createLink(box, bw613, bw722);
    // createLink(box, bw613, bw723);
    // createLink(box, bw613, bw724);
    // createLink(box, bw613, bw725);
    // createLink(box, bw613, bw726);
    // createLink(box, bw711, bw81);
    // createLink(box, bw712, bw81);
    // createLink(box, bw713, bw81);
    // createLink(box, bw721, bw82);
    // createLink(box, bw722, bw82);
    // createLink(box, bw723, bw82);
    // createLink(box, bw724, bw83);
    // createLink(box, bw725, bw83);
    // createLink(box, bw726, bw83);
    // createLink(box, bw81, node10, 100);
    // createLink(box, bw82, bw91);
    // createLink(box, bw83, bw91);
    // createLink(box, bw91, node10);
    // createLink(box, bw91, node11);
  }