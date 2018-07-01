twaver.Styles.setStyle('select.style', 'none');

editor.GridNetwork = function(box) {
  editor.GridNetwork.superClass.constructor.call(this, box);
  this.init();
};

var GAP = 10;
function fixLocation (location, viewRect) {
  var x = parseInt(location.x / GAP) * GAP;
  var y = parseInt(location.y / GAP) * GAP;
  if (viewRect) {
    if (x !== location.x) {
      if (location.x > 0) {
        x += GAP;
      }
    }
    if (y !== location.y) {
      if (location.y > 0) {
        y += GAP;
      }
    }
  }
  return { x: x, y: y };
}

function fixSize (size) {
  var width = parseInt(size.width / GAP) * GAP;
  var height = parseInt(size.height / GAP) * GAP;
  if (width != size.width) {
    width += GAP;
  }
  if (height != size.height) {
    height += GAP;
  }
  return { width: width, height: height };
}

twaver.Util.ext(editor.GridNetwork, twaver.vector.Network, {
  init: function() {
    this.box = this.getElementBox();
    this.setKeyboardRemoveEnabled(false);
    this.setToolTipEnabled(false);
    this.setTransparentSelectionEnable(true);
    this.setMinZoom(0.001);
    this.setMaxZoom(100);
    this.getView().setAttribute('draggable', 'true');

    this.initListener();
    this.initUndoRedo();
    this.typeIndex = {};
  },
  initUndoRedo: function() {
    var box = this.box;
    var undoManager = box.getUndoManager();
    var btnUndo = $('#undo');
    var btnRedo = $('#redo');
    btnUndo.button('option', 'disabled', true);
    btnRedo.button('option', 'disabled', true);
    undoManager.setEnabled(true);
    undoManager.on(function(e) {
      btnUndo.button('option', 'disabled', !undoManager.canUndo());
      btnRedo.button('option', 'disabled', !undoManager.canRedo());
    });
    btnUndo.click(function() {
      undoManager.undo();
    });
    btnRedo.click(function() {
      undoManager.redo();
    });
  },
  initListener: function() {
    _twaver.html.addEventListener('keydown', 'handle_keydown', this.getView(), this);
    _twaver.html.addEventListener('dragover', 'handle_dragover', this.getView(), this);
    _twaver.html.addEventListener('drop', 'handle_drop', this.getView(), this);
    _twaver.html.addEventListener('mousedown', 'handle_mousedown', this.getView(), this);
    _twaver.html.addEventListener('mousemove', 'handle_mousemove', this.getView(), this);
    _twaver.html.addEventListener('mouseup', 'handle_mouseup', this.getView(), this);
    var box = this.box;
    var sm = this.getSelectionModel();
    var self = this;
    var changing = false;
    box.addDataBoxChangeListener(function (e) {
      if (e.kind === 'preAdd') {
        self.fixLocation(e.data);
      }
      self.invalidateElementUIs();
    });
    box.addDataPropertyChangeListener(function (e) {
      self.invalidateElementUIs();
    });
    this.addPropertyChangeListener(function (e) {
      if (e.property === 'movingElement') {
        self.fixLocation(self.getSelectionModel().getLastData());
      }
    });

    var buttonLayer = new twaver.Layer('button');
    box.getLayerBox().add(buttonLayer);
    var infoNode = this.infoNode = new twaver.Follower({
      image: 'info',
      layerId: 'button'
    });
    infoNode.setVisible(false);
    box.add(infoNode);
    var optionNode = this.optionNode = new twaver.Follower({
      image: 'option',
      layerId: 'button'
    });
    optionNode.setVisible(false);
    box.add(optionNode);
    var linkNode = this.linkNode = new twaver.Follower({
      image: 'link',
      layerId: 'button'
    });
    linkNode.setVisible(false);
    box.add(linkNode);
    var fourthNode = this.fourthNode = new twaver.Follower({
      image: 'fourth',
      layerId: 'button'
    });
    fourthNode.setVisible(false);
    box.add(fourthNode);

    sm.setSelectionMode('singleSelection');
    this.setMovableFunction(function (data) {
      return data.getLayerId() !== 'button';
    });
    sm.addSelectionChangeListener(function (e) {
      if (changing) {
        return;
      }
      var data = sm.getLastData();
      if (data && data.getLayerId() === 'button') {
        changing = true;
        sm.setSelection(data.getHost());
        changing = false;
        return;
      }
      box.getUndoManager().setSuspended(true);
      var visible = data instanceof twaver.Node;
      infoNode.setVisible(visible);
      optionNode.setVisible(visible);
      linkNode.setVisible(visible);
      fourthNode.setVisible(visible);
      if (visible) {
        infoNode.setHost(data);
        optionNode.setHost(data);
        linkNode.setHost(data);
        fourthNode.setHost(data);
        self.refreshButtonNodeLocation(data);
      }
      box.getUndoManager().setSuspended(false);
    });
  },
  refreshButtonNodeLocation: function (node) {
    var rect = node.getRect();
    this.infoNode.setCenterLocation({ x: rect.x, y: rect.y });
    this.optionNode.setCenterLocation({ x: rect.x, y: rect.y + rect.height });
    this.linkNode.setCenterLocation({ x: rect.x + rect.width, y: rect.y });
    this.fourthNode.setCenterLocation({ x: rect.x + rect.width, y: rect.y + rect.height });
  },
  fixLocation: function (node) {
    var location = node.getLocation();
    location = fixLocation(location);
    node.setLocation(location);
  },
  handle_mousedown: function(e) {
    var data = this.getElementAt(e);
    if (data) {
      if (data.getLayerId() === 'button') {
        this.__button = true;
        this.setInteractions(null);
        if (data.getImage() === 'fourth' && data.getHost().getImage() === 'layer') {
          this.__startPoint = this.getLogicalPoint(e);
          this.__resizeNode = data.getHost();
          this.__originSize = this.__resizeNode.getSize();
          this.box.getUndoManager().startBatch();
          this.__resize = true;
        }
      }
    } else {
      this.__dragging = true;
    }
  },
  handle_mousemove: function(e) {
    if (this.__resize) {
      var point = this.getLogicalPoint(e);
      this.__resizeNode.setSize(this.__originSize.width + point.x - this.__startPoint.x, this.__originSize.height + point.y - this.__startPoint.y);
      this.refreshButtonNodeLocation(this.__resizeNode);
    }
  },
  handle_mouseup: function(e) {
    if (this.__dragging) {
      var rect = this.getViewRect();
      var location = fixLocation(rect, true);
      this.setViewRect(location.x, location.y, rect.width, rect.height);
      this.__dragging = false;
    }
    if (this.__button) {
      this.setDefaultInteractions();
      this.__button = false;
    }
    if (this.__resize) {
      this.__resizeNode.setSize(fixSize(this.__resizeNode.getSize()));
      this.refreshButtonNodeLocation(this.__resizeNode);
      this.box.getUndoManager().endBatch();
      this.__resizeNode = null;
      this.__resize = false;
    }
  },
  handle_keydown: function(e) {
    var myKey = false;
    if (e.keyCode == 46) {
      if (this.getSelectionModel().getSelection().size() > 0) {
        var selection = this.getSelectionModel().getSelection();
        if (confirm('Sure to Delete')) {
          var box = this.box;
          var newList = new twaver.List();
          newList.addAll(selection);
          newList.forEach(function(element) {
            box.remove(element);
          });
        }
      }
      myKey = true;
    }
    if (e.keyCode == 37) { //Left
      this._moveSelectionElements("left");
      myKey = true;
    }
    if (e.keyCode == 38) { //Top
      this._moveSelectionElements("top");
      myKey = true;
    }
    if (e.keyCode == 39) { //Right 
      this._moveSelectionElements("right");
      myKey = true;
    }
    if (e.keyCode == 40) { //Bottom 
      this._moveSelectionElements("bottom");
      myKey = true;
    }

    if (myKey) {
      e.preventDefault();
      e.stopPropagation();
    }

  },
  //get element by mouse event, set lastElement as ImageShapeNode
  handle_dragover: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    e.dataTransfer.dropEffect = 'copy';

    var element = this.getElementAt(e);

    return false;
  },
  handle_drop: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    var text = e.dataTransfer.getData('Text');
    if (!text) {
      return false;
    }
    var obj = JSON.parse(text);
    var centerLocation = this.getLogicalPoint(e);
    var node = this.getElementAt(e);
    if (obj.type === 'os') {
      if (node instanceof twaver.Node && node.getImage() === 'ecs') {
        var undoManager = this.box.getUndoManager();
        undoManager.batch(function () {
          node.setClient('os', obj.os);
          node.setClient('version', obj.version);
          node.setClient('bit', obj.bit);
        });
      } else {
        alert('系统镜像只能拖放到 ECS 组件上');
      }
    } else {
      if (obj.type === 'layer' || (node instanceof twaver.Node && node.getImage() === 'layer')) {
        var clients;
        if (obj.type === 'layer') {
          this.typeIndex[obj.type] || (this.typeIndex[obj.type] = 0);
          clients = {
            title: '未命名层' + (++this.typeIndex[obj.type]),
            description: ''
          };
        } else if (obj.type === 'ecs') {
          clients = {
            cpu: 1,
            memory: 512,
            bandwidth: 1,
            sysDisk: 1,
            dataDisk: 0
          };
        } else if (obj.type === 'rds') {
          clients = {
            type: 'MySQL',
            memory: 240
          };
        }
        this.addNode(obj, centerLocation, node, clients);
      } else {
        alert('除SLB和自定义组件，组件只能放置在层内');
      }
    }
    this.getView().focus();
    return false;
  },
  addNode: function(obj, centerLocation, host, clients) {
    var box = this.box;
    var node = new twaver.Follower({
      image: obj.type,
      location: centerLocation,
      clients: clients,
      host: host
    });
    if (obj.width && obj.height) {
      node.setSize(obj.width, obj.height);
    }
    node.setCenterLocation(centerLocation);
    box.add(node);
    box.getSelectionModel().setSelection(node);
  },
  _moveSelectionElements: function(type) {
    var box = this.box;
    var selections = box.getSelectionModel().getSelection();
    if (selections.size() > 0) {
      var xoffset = 0;
      var yoffset = 0;
      if (type === "left") {
        xoffset = -GAP;
      }
      if (type === "right") {
        xoffset = GAP;
      }
      if (type === "top") {
        yoffset = -GAP;
      }
      if (type === "bottom") {
        yoffset = GAP;
      }
      twaver.Util.moveElements(selections, xoffset, yoffset, false);
    }
  },
  paintBottom: function(g) {
    var viewRect = this.getViewRect();
    var zoom = this.getZoom();
    var width = viewRect.width / zoom;
    var height = viewRect.height / zoom;
    var x = 0,
      y = 0;
    var colCount = width / GAP;
    var rowCount = height / GAP;
    g.save();
    g.strokeStyle = 'rgba(0,0,0,0.1)';
    g.lineWidth = 1;
    g.beginPath();
    g.translate(viewRect.x / zoom - 0.5, viewRect.y / zoom - 0.5);
    for (var col = 0; col < colCount; col++) {
      g.moveTo(x, 0);
      g.lineTo(x, height);
      x += GAP;
    }
    for (var row = 0; row < rowCount; row++) {
      g.moveTo(0, y);
      g.lineTo(width, y);
      y += GAP;
    }
    g.stroke();
    g.restore();
  }
});