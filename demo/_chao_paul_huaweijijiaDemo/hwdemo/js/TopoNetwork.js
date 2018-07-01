var TopoNetwork = function (box) {
  TopoNetwork.superClass.constructor.call(this, box);
  this.init();
};

twaver.Util.ext(TopoNetwork, twaver.vector.Network, {
  init: function () {
    this._back = '.back';
    this._rackState = 'Overview';
    this.isPaintBottom = false;
    this.setMaxZoom(20);
    this.addInteractionListener(this.interactionHandler, this);
    this.getSelectionModel().setFilterFunction(function (data) {
      return !data.getClient('tooltip');
    });

    var focusSpaceNode = this.focusSpaceNode = new twaver.Node();
    focusSpaceNode.setStyle('body.type', 'vector');
    focusSpaceNode.setStyle('vector.outline.width', 1);
    focusSpaceNode.setStyle('vector.fill', false);
    focusSpaceNode.setLayerId('focusLayer');
    focusSpaceNode.setVisible(false);
    this.focusLayer = new twaver.Layer('focusLayer');

    var oldTarget;
    var self = this;
    this.getView().addEventListener('mousemove', function (e) {
      var nowTarget = self.getElementAt(e);
      // 如果鼠标下面的网元和以前的网元相同就return
      if (nowTarget === oldTarget) {
        return;
      }
      // 如果当前鼠标下面的网元是Tooltip则return
      if (nowTarget && nowTarget.getClient('tooltip')) {
        return;
      }
      // 如果当前鼠标下面的网元不是ShapeNode则return
      if (nowTarget && !(nowTarget instanceof twaver.ShapeNode)) {
        return;
      }
      // 当前鼠标下面的网元是空，或者是没有follower的网元则隐藏以前的tooltip
      var follower = nowTarget && nowTarget.getClient('follower');
      if (!nowTarget || !follower) {
        oldTarget && oldTarget.getClient('follower').setVisible(false);
        oldTarget = null;
        return;
      }
      // 显示当前网元的tooltip
      oldTarget && oldTarget.getClient('follower').setVisible(false);
      oldTarget = nowTarget;
      var offsetY = self.getLogicalPoint(e).y > nowTarget.getCenterLocation().y ? follower.getHeight() / 2 + 10 : -follower.getHeight() / 2 - 10;
      follower.setCenterLocation(nowTarget.getCenterLocation().x, nowTarget.getCenterLocation().y + offsetY);
      if (follower.getClient('data')) {
        follower.setVisible(true);
      }
    });

    this.getView().addEventListener('dragover', function (e) {
      e.preventDefault();
      var id = 'twaver.idc.' + catalogTree._type + (self._back ? '.back' : '') + '.panel.loader';
      if (make.Default.getCreator(id)) {
        if (self._isDragCard = make.Default.getOtherParameter(id, 'card')) {
          self.refreshFocusSpaceNodeForCard(e);
          e.dataTransfer.dropEffect = self._canInsert ? 'copy' : 'none';
        } else {
          self.refreshFocusSpaceNodeForDevice(e);
          e.dataTransfer.dropEffect = self.uLocation && self._canInsert ? 'copy' : 'none';
        }
      } else {
        e.dataTransfer.dropEffect = 'none';
      }
    });
    this.getView().addEventListener('drop', function (e) {
      e.preventDefault();

      self.focusSpaceNode.setVisible(false);
      var type = e.dataTransfer.getData('Text');
      if (!make.Default.getCreator(self.getIDFromType(type))) {
        return false;
      }
      if (self._isDragCard && self._slot) {
        self.addCard(self._slot, type);
      } else {
        self.addDevice(self._rack, null, type, self.uLocation - self._locationDiff);
      }
      self._rack = null;
      self.uLocation = 0;
      self._locationDiff = null;
    });
    this.getView().addEventListener('dragleave', function (e) {
      self.focusSpaceNode.setVisible(false);
      self._locationDiff = null;
      self._rack = null;
    });
  },
  refreshFocusSpaceNodeForCard: function (e) {
    var self = this;
    var elements = self.getElementsAt(e);
    var slot = null;
    elements && elements.forEach(function (element) {
      if (element !== self.focusSpaceNode && element.getClient('slot') && !(element.getClient('follower'))) {
        slot = element;
      }
    });
    self._slot = slot;
    if (slot) {
      self.focusSpaceNode.setStyle('vector.outline.color', 'blue');
      self.focusSpaceNode.setSize(slot.getSize());
      self.focusSpaceNode.setLocation(slot.getLocation());
      self.focusSpaceNode.setVisible(true);
      self._canInsert = true;
    } else {
      self.focusSpaceNode.setVisible(false);
      self._canInsert = false;
    }
    return self._canInsert;
  },
  refreshFocusSpaceNodeForDevice: function (e) {
    var self = this;
    self._rack = null;
    var elements = self.getElementsAt(e);
    elements && elements._as.some(function (r) {
      if (self.device === r) {
        return false;
      }
      if (r.getClient('rack')) {
        self._rack = r;
        return true;
      }
      if (r = (r.getHost && r.getHost())) {
        if (r.getClient('rack')) {
          self._rack = r;
          return true;
        }
      }
    });
    var focusSpaceNode = self.focusSpaceNode;
    var uCount;
    var uHeight = 1;
    if (this.device) {
      uHeight = this.device.getClient('size');
    } else {
      var type = catalogTree._type;
      type = make.Default.getParameters(this.getIDFromType(type));
      if (type && type.size) {
        uHeight = type.size;
        if (this._locationDiff == null) {
          this._locationDiff = Math.floor(uHeight / 2);
        }
      }
    }
    var rack = self._rack;
    if (rack) {
      uCount = rack.getClient('uCount');
      var point = self.getLogicalPoint(e);
      var zoom = rack.getClient('zoom');
      var y = (point.y - rack.getLocation().y - Util.rackTopGap * zoom) / zoom;
      self.uLocation = uCount - Math.floor(y / Util.rackUnitHeight);
    } else {
      self.uLocation = 0;
    }
    if (self.uLocation) {
      var zoom = rack.getClient('zoom');
      var rackLocation = rack.getLocation();
      if (self._canInsert = self.canInsertDevice(rack, self.uLocation, uHeight, self.device)) {
        focusSpaceNode.setStyle('vector.outline.color', 'blue');
      } else {
        focusSpaceNode.setStyle('vector.outline.color', 'red');
      }
      focusSpaceNode.setSize(Util.rackWidth * zoom, Util.rackUnitHeight * uHeight * zoom);
      focusSpaceNode.setLocation(rackLocation.x + Util.rackLeftGap * zoom, rackLocation.y + (Util.rackTopGap + (uCount - self.uLocation + self._locationDiff - uHeight + 1) * Util.rackUnitHeight) * zoom);
      focusSpaceNode.setVisible(true);
    } else {
      focusSpaceNode.setVisible(false);
    }
  },
  getToolTip: function (data) {
    return data.getToolTip();
  },
  getRootDatas: function () {
    this.setRootElement('/');
  },
  setRootElement: function (id) {
    this.clean();
    this._elementId = id;
    Api.getTopoData(id, this.setDatas, this);
  },
  interactionHandler: function (e) {
    if (e.kind === 'doubleClickElement') {
      var element = e.element;
      if (element.getLayerId() === 'backgroudLayer' || element.getClient('needNotRoot')) {
        return;
      }
      if (element.getClient('tooltip')) {
        element = element.getHost();
      }
      if (element.getName().indexOf('Rack') !== -1) {
        this.getRackData([element.getId()]);
      } else {
        this.setRootElement(element.getId());
      }
      var treeData = navigationTree.getDataBox().getDataById(element.getId());
      if (treeData) {
        navigationTree.getSelectionModel().setSelection(treeData);
        navigationTree.expand(treeData);
      } else {
        console.log('no data on navigationTree');
      }
    }
    if (e.kind === 'liveMoveStart') {
      var element = this.getSelectionModel().getLastData();
      var host = element.getHost && element.getHost();
      var movePort = false;
      if (element.getClient('device')) {
        this.device = element;
      }
      if (element.getClient('card')) {
        this.card = element;
        this.card.setClient('oldHost', this.card.getHost());
      }
      if (host && host.getClient('device')) {
        movePort = true;
        this.device = host;
      }
      if (host && host.getClient('card')) {
        movePort = true;
        this.card = host;
        this.card.setClient('oldHost', this.card.getHost());
      }
      if (movePort) {
        this.port = element;
        if (this.device) {
          this.device.setClient('oldHost', this.device.getHost());
          this.device.setHost(this.port);
        }
        if (this.card) {
          this.card.setHost(this.port);
        }
      }
      if (this.device) {
        this._oldULocation = this.device.getClient('startU');
        this.refreshFocusSpaceNodeForDevice(e.event);
      }
      if (this.card) {
        this.card.getClient('oldHost').setClient('follower', null);
        this.refreshFocusSpaceNodeForCard(e.event);
      }
    }
    if (e.kind === 'liveMoveBetween') {
      if (this.device) {
        this.refreshFocusSpaceNodeForDevice(e.event);
      }
      if (this.card) {
        this.refreshFocusSpaceNodeForCard(e.event);
      }
    }
    if (e.kind === 'liveMoveEnd') {
      if (this.port) {
        if (this.device) {
          this.device.setHost(this.device.getClient('oldHost'));
        }
        if (this.card) {
          this.card.setHost(this.card.getClient('oldHost'));
        }
      }
      if (this.device) {
        this.setDeviceLocation(this.device, this.uLocation && this._canInsert ? (this.uLocation - this._locationDiff) : this._oldULocation);
        this.focusSpaceNode.setVisible(false);
        this._locationDiff = null;
      }
      if (this.card) {
        if (this._canInsert && this._slot) {
          this.card.getClient('oldHost').setClient('follower', null);
          this.card.setHost(this._slot);
          this._slot.setClient('follower', this.card);
          this.card.setLocation(this._slot.getLocation());
        } else {
          this.card.getHost().setClient('follower', this.card);
          this.card.setLocation(this.card.getClient('oldHost').getLocation());
        }
        this.focusSpaceNode.setVisible(false);
      }
      this.port = null;
      this.device = null;
      this.card = null;
      this._rack = null;
      this._slot = null;
    }
  },
  clean: function () {
    var box = this.getElementBox();
    box.clear();
    box.getLayerBox().clear();
    this.setZoom(1);
    this.setViewRect(0, 0, this.getViewRect().width, this.getViewRect().height);
    box.add(this.focusSpaceNode);
    box.getLayerBox().add(this.focusLayer);
  },
  setDatas: function (data) {
    if (!data) {
      return;
    }

    var dataBox = this.getElementBox();
    if (data.backgroudUrl) {
      var backgroudLayer = new twaver.Layer('backgroudLayer');
      dataBox.getLayerBox().add(backgroudLayer);

      var backgroudNode = new twaver.Node();
      backgroudNode.setMovable(false);
      backgroudNode.setStyle('select.style', 'null');
      backgroudNode.setImageUrl(data.backgroudUrl);
      backgroudNode.setName('backgroudimage');
      backgroudNode.setClient('backgroud', true);
      backgroudNode.setLayerId(backgroudLayer.getId());
      dataBox.add(backgroudNode);
    }

    var NodeLayer = new twaver.Layer('NodeLayer');
    dataBox.getLayerBox().add(NodeLayer);

    //创建图表layer
    var diagramLayer = new twaver.Layer('diagramLayer');
    dataBox.getLayerBox().add(diagramLayer);
    this._setDatas(data);
  },
  _setDatas: function (data) {
    var dataType = data.dataType;
    var datas = data.datas;
    var dataBox = this.getElementBox();
    if (dataType === 'root') {
      this.isPaintBottom = false;
      datas.forEach(function (data) {
        var node = new twaver.Node(data.dn);
        node.setName(data.name);
        node.setLayerId('NodeLayer');
        node.setLocation(data.location.x, data.location.y);
        dataBox.add(node);
      });
    } else if (dataType === 'room') {
      this.isPaintBottom = true;
      datas.forEach(function (data) {
        var type = data.motype.substring(data.motype.indexOf('{') + 1, data.motype.indexOf('}')).toLocaleLowerCase();
        if (type == 'rack') {
          var chart = new twaver.Node(data.dn);
          chart.setName(data.name);
          chart.s('label.color', 'rgba(0,0,0,0)');
          chart.setImage('rackChart');
          chart.setLocation(data.location.x, data.location.y);
          chart.setLayerId('NodeLayer');
          chart.setStyle('image.state', 'Overview');
          chart.setVisible(false);
          dataBox.add(chart);
        } else {
          //绘制空调、加湿器、摄像头等非机柜设备
          var equipment = new twaver.Node(data.dn);
          equipment.setName(data.name);
          equipment.setToolTip(data.name);
          equipment.s('label.color', 'rgba(0,0,0,0)');
          equipment.s('image.state', 'vfront')
          equipment.setImage(type + 'Shape');
          equipment.setClient('data', data);
          equipment.setClient('needNotRoot', true);
          // console.log('type', type);
          equipment.setCenterLocation(data.location.x, data.location.y);
          // console.log('location', equipment.getCenterLocation());
          equipment.setLayerId('NodeLayer');
          equipment.setMovable(false);
          dataBox.add(equipment);
        }
      });
      this.refreshRackState();
    } else {
      this.isPaintBottom = false;
      datas.forEach(function (data) {
        if (data.extendPropertites.itemPoints) {
          //console.log('test points');
          //console.log(data.extendPropertites.itemPoints);
          var pointsString = data.extendPropertites.itemPoints;
          var pointsArray = pointsString.split("$");
          var points = new twaver.List();
          pointsArray.forEach(function (data) {
            var pointsData = data.split(";");
            points.add({
              x: parseFloat(pointsData[0]),
              y: parseFloat(pointsData[1])
            });
          });

          var shapeNode = new twaver.ShapeNode(data.dn);
          shapeNode.setStyle('vector.fill', true)
            .setStyle('vector.fill.color', 'rgba(100,149,237,0.3)')
            .setStyle('vector.outline.color', '#9ab0e6')
            .setStyle('select.color', '#FFFFFF')
            .setStyle('vector.outline.width', 3)
            .setStyle('label.position', 'center')
            .setStyle('label.font', 'bolder 16px Microsoft YaHei');

          shapeNode.setPoints(points);
          //console.log(points);
          shapeNode.setName(data.name);
          shapeNode.setLayerId('NodeLayer');
          shapeNode.setMovable(false);
          dataBox.add(shapeNode);
        }

        var chart = new twaver.Follower(shapeNode.getId() + 'chart');
        chart.setName(data.name);
        chart.s('label.color', 'rgba(0,0,0,0)');
        chart.setHost(shapeNode);
        shapeNode.setClient('follower', chart);
        chart.setClient('tooltip', true);
        chart.setClient('data', data.chartData);
        chart.setImage('chart');
        chart.setCenterLocation(shapeNode.getCenterLocation());
        chart.setVisible(false);
        chart.setMovable(false);
        dataBox.add(chart);
        chart.setLayerId('diagramLayer');
      });
    }
  },
  showLinks: function (data) {
    this.clean();
    this.racks = [];
    var box = this.getElementBox();
    var linkLayer = new twaver.Layer('linkLayer');
    box.getLayerBox().add(linkLayer);
    var keys = Object.keys(connectionInfo);
    keys.forEach(function (key) {
      var deviceData = connectionInfo[key];
      this.addRack(deviceData);
    }, this);
    keys.forEach(function (key) {
      var deviceData = connectionInfo[key];
      Util.addLinks(box, deviceData);
    });
  },
  getRackData: function (ids) {
    this.isPaintBottom = false;
    this.clean();
    this.racks = [];
    for (var i = 0; i < ids.length; i++) {
      this.addRack(devicesData[ids[i]]);
    }
  },
  addRack: function (devices) {
    var image = 'model/idc/svg/rack' + devices.uTotalNumber + 'U.svg'
    var self = this;
    if (twaver.Util.getImageAsset(image)) {
      self._addRack(devices, image);
    } else {
      Util.registerNormalImage(image, image, function () {
        self._addRack(devices, image);
      });
    }
  },
  _addRack: function (devices, image) {
    var uCount = parseInt(devices.uTotalNumber);
    var box = this.getElementBox();
    var racks = this.racks;
    var viewRect = this.getViewRect();
    var rack = new twaver.Node(devices.dn);
    rack.setClient('uCount', uCount);
    rack.setImage(image);
    rack.setClient('data', devices);
    rack.setClient('rack', true);
    rack.setName(devices.name);
    rack.s('label.color', 'rgba(0,0,0,0)');
    var width = rack.getWidth();
    var height = rack.getHeight();
    var zoom = Math.min(viewRect.width / width, viewRect.height / height);
    width *= zoom;
    height *= zoom;
    rack.setClient('zoom', zoom);
    rack.setSize(width, height);
    //添加空白U位
    this.addSpaceU (box, rack, uCount, zoom);
    this.addRackName (box, rack, uCount, zoom);
    box.add(rack);
    this.addChilds(rack, devices);
    racks.push(rack);

    this.arrangeRacks(racks);
  },

  addSpaceU: function (box, rack, uCount, zoom) {
    var rackLocation = rack.getLocation();
    var uWidth = Util.rackWidth * zoom;
    var uHeight = Util.rackUnitHeight * zoom;
    for (var i = 1; i <= uCount; i++) {
      var spaceU = new twaver.Follower(rack.getId()+'U'+i);
      spaceU.setHost(rack);
      spaceU.setStyle('select.padding', -1);
      spaceU.setStyle('select.style', 'border');
      spaceU.setStyle('select.width', 1);
      spaceU.setStyle('body.type', 'vector');
      spaceU.setStyle('vector.outline.width', 1);
      spaceU.setStyle('vector.outline.color', 'white');
      spaceU.setStyle('vector.fill.color', 'rgba(127, 127, 127, 0.3)');
      spaceU.setName('U' + i);
      spaceU.setStyle('label.color', 'white');
      spaceU.setStyle('label.font', parseInt(Util.rackUnitHeight * 3 / 4 * zoom) + 'px ' + Defaults.Font);
      spaceU.setStyle('label.position', 'center');
      spaceU.setStyle('label.yoffset', 0);
      spaceU.setSize(uWidth, uHeight);
      spaceU.setLocation(
        rackLocation.x + Util.rackLeftGap * zoom,
        rackLocation.y + Util.rackTopGap * zoom + uHeight*(uCount - i)
      );
      spaceU.setMovable(false);
      spaceU.setClient('needNotRoot', true);
      box.add(spaceU);
    }
  },

  addRackName: function (box, rack, uCount, zoom) {
    var rackLocation = rack.getLocation();
    var uWidth = Util.rackWidth * zoom;
    var uHeight = Util.rackUnitHeight * zoom;
    var nameStr = rack.getName();
    var rackName = new twaver.Follower(rack.getId()+nameStr);
    rackName.setHost(rack);
    rackName.setImage('rackName');
    rackName.setSize(uWidth, uHeight)
    rackName.setCenterLocation(
      rackLocation.x + (Util.rackLeftGap + Util.rackWidth/2) * zoom,
      rackLocation.y + Util.rackTopGap *1.5 * zoom + uHeight*uCount
    );
    rackName.setMovable(false);
    rackName.setClient('needNotRoot', true);
    rackName.setStyle('select.style', 'null');
    rackName.s('label.color', 'rgba(0,0,0,0)');
    box.add(rackName);

  },

  arrangeRacks(racks){
    var viewRect = this.getViewRect();
    var totalWidth = 0;
    racks.forEach(function (rack) {
      totalWidth += rack.getWidth();
    });
    var gap = Math.max(50, (viewRect.width - totalWidth) / (racks.length + 1));
    var x = gap;
    racks.forEach(function (rack, i) {
      rack.setLocation(x, (viewRect.height - rack.getHeight()) / 2);
      x = x + gap + rack.getWidth();
    });
  },
  addChilds: function (rack, devices) {
    devices.children.forEach(function (child) {
      this.addDevice(rack, child);
    }, this);
    // test
    /*this.addDevice(rack, {
      id: 'test',
      name: "Test",
      startU: "37",
      endU: "46",
      type: 'dell_poweredge_m1000e'
    });*/
  },
  getIDFromType: function (type, back) {
    return 'twaver.idc.' + type + (back == null ? this._back : back) + '.panel.loader';
  },
  addDevice: function (rack, deviceData, type, uLocation) {
    var box = this.getElementBox();
    if (deviceData && deviceData.type === 'rPDU') {
      Util.createPduPanel(box, rack, deviceData);
    } else {
      if (deviceData) {
        type = deviceData.type;
      }
      var device = this.createDevice(type, rack);
      if (deviceData) {
        device.setClient('id', deviceData.id);
        device.setToolTip(deviceData.name);
        uLocation = parseInt(deviceData.startU);
      }
      this.setDeviceLocation(device, uLocation);
      box.addByDescendant(device);
      //添加工单div
      showDiv(workOrderDiv, 'right', '5px');
    }
  },
  addCard: function (slot, type) {
    var box = this.getElementBox();
    var card = this.createCard(type, slot);
    card.setLocation(slot.getLocation());
    box.addByDescendant(card);
    //添加工单div
    showDiv(workOrderDiv, 'right', '5px');
  },
  createCard: function (type, slot) {
    if (!make.Default.getCreator(this.getIDFromType(type))) {
      type = 'dell_powerEdge_m710h';
    }
    var card = make.Default.load(this.getIDFromType(type));
    card.setHost(slot);
    slot.setClient('follower', card);
    Util.scaleCard(card);
    return card;
  },
  setDeviceLocation: function (device, uLocation) {
    var rack = device.getHost();
    var zoom = rack.getClient('zoom');
    var uCount = rack.getClient('uCount');
    var uHeight = device.getClient('size');
    var rackLocation = rack.getLocation();
    device.setLocation(
      rackLocation.x + Util.rackLeftGap * zoom,
      rackLocation.y + (Util.rackTopGap + (uCount - uLocation - uHeight + 1) * Util.rackUnitHeight) * zoom
    );
    device.setClient('startU', uLocation);
    device.setClient('endU', uLocation + uHeight - 1);
  },
  canInsertDevice: function (rack, uLocation, uHeight, device) {
    if (this._locationDiff == null) {
      if (device) {
        this._locationDiff = uLocation - device.getClient('startU');
      }
    }
    var result = true;
    var startU = uLocation - this._locationDiff;
    var endU = startU + uHeight - 1;
    if (startU < 1 || endU > rack.getClient('uCount')) {
      return false;
    }
    rack.getFollowers() && rack.getFollowers().forEach(function (follower) {
      if (follower.getClient('device') && follower !== device) {
        if (!(follower.getClient('endU') < startU || follower.getClient('startU') > endU)) {
          result = false;
        }
      }
    });
    return result;
  },
  createDevice: function (type, rack) {
    var back;
    if (!make.Default.getCreator(this.getIDFromType(type))) {
      if (make.Default.getCreator(this.getIDFromType(type, this._back ? '' : '.back'))) {
        back = this._back ? '' : '.back';
      } else {
        type = 'hw_rh2288_v3';
      }
    }
    var device = make.Default.load(this.getIDFromType(type, back));
    device.setClient('type', type);
    device.setClient('device', true);
    device.setHost(rack);
    Util.scaleDevice(device);
    if (back != null && device.getClient('halfDepth')) {
      Util.setVisible(device, false);
    }
    return device;
  },
  turnBack: function () {
    if (this._back) {
      this._back = '';
    } else {
      this._back = '.back';
    }
    var box = this.getElementBox();
    box.getDatas().toList().forEach(function (device) {
      if (device.getClient('device')) {
        var rack = device.getHost();
        var location = device.getLocation();
        var type = device.getClient('type');
        var name = device.getName();
        id = device.getClient('id');
        var startU = device.getClient('startU');
        var endU = device.getClient('endU');
        box.remove(device);
        device = this.createDevice(type, rack);
        device.setClient('id', id);
        device.setName(name);
        device.setToolTip(name+'--'+startU +'-'+ endU);
        device.setClient('startU', startU);
        device.setClient('endU', endU);
        device.setLocation(location);
        box.addByDescendant(device);
      }
    }, this);
  },
  setRackState: function (state) {
    this._rackState = state;
    var box = this.getElementBox();
    box.forEach(function (ele) {
      if (ele.getImage() === 'rackChart') {
        ele.s('image.state', state);
      }
    });
    this.refreshRackState();
  },
  refreshRackState: function () {
    var box = this.getElementBox();
    Api.getRackStates(this._elementId, this._rackState, function (datas) {
      box.forEach(function (ele) {
        if (ele.getImage() === 'rackChart') {
          var data;
          datas.some(function (d) {
            if (d.dn == ele.getId()) {
              data = d;
              return true;
            }
          });
          ele.setClient('data', data);
          ele.setVisible(true);
        }
      });
    });
  },

  //为房间机柜容量信息图添加屏幕网格（背景网格）和房间网格（前景网格）
  paintBottom: function(g) {
    //只有视图为房间机柜容量时添加网格
    if(!this.isPaintBottom) {
      return;
    }
    //网格的间隔
    var GAP = 15;
    //屏幕可视区域，即背景网格区域
    var viewRect = this.getViewRect();
    var zoom = this.getZoom();
    //确保在缩放状态下背景网格仍铺满可视区域
    var originX = viewRect.x / zoom;
    var originY = viewRect.y / zoom;
    var width = viewRect.width / zoom;
    var height = viewRect.height / zoom;
    //背景网格区域相对可视区域的边框
    var margin = 5 / zoom;
    //背景网格行列数，会随zoom缩放而增减
    var colCount = (width-margin*2) / GAP;
    var rowCount = (height-margin*2) / GAP;
    //房间网格区域，此区域随zoom正常缩放
    var racksField = topo[this._elementId]['racksField'] || {
      x: 50,
      y: 100,
      width: 800,
      height: 400
    };
    //将房间网格区域各值规范为整数以便于计算
    var rfX = Math.round(racksField.x);
    var rfY = Math.round(racksField.y);
    var rfW = Math.round(racksField.width);
    var rfH = Math.round(racksField.height);
    //房间网格中每组网格的个数，每组网格间会用加粗的网格线区分
    var bind = 3;
    //房间网格行列数，确保网格组数为整数
    var rfColCount = Math.ceil(rfW/(GAP*bind)) * bind;
    var rfRowCount = Math.ceil(rfH/(GAP*bind)) * bind;
    //背景网格初始位置调整，既要保证随鼠标拖动，又要恰好与房间网格重合
    var offsetX = originX-rfX>0?GAP-(originX-rfX+margin)%GAP:(rfX-originX-margin)%GAP;
    var offsetY = originY-rfY>0?GAP-(originY-rfY+margin)%GAP:(rfY-originY-margin)%GAP;
    //用于标识房间网格列值的数组（行值直接用数字表示了）
    var colTexts = ['AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ'];
    g.font='14px  Microsoft YaHei';
    g.textAlign='center';
    g.textBaseline='middle';

    g.save();
    //绘制背景网格
    g.strokeStyle = 'rgba(0,0,0,0.1)';
    g.lineWidth = 1;
    g.beginPath();
    for (var cr = 0; cr <= (colCount>rowCount?colCount:rowCount); cr++) {
      if(offsetX+GAP*cr < width-margin*2){
        g.moveTo(originX+margin+offsetX+GAP*cr, originY+margin);
        g.lineTo(originX+margin+offsetX+GAP*cr, originY+height-margin);
      }
      if(offsetY+GAP*cr < height-margin*2){
        g.moveTo(originX+margin, originY+margin+offsetY+GAP*cr);
        g.lineTo(originX+width-margin, originY+margin+offsetY+GAP*cr);
      }
    }
    //背景网格边框
    g.moveTo(originX + margin, originY + margin);
    g.lineTo(originX + margin, originY + height-margin);
    g.lineTo(originX + width-margin, originY + height-margin);
    g.lineTo(originX + width-margin, originY + margin);
    g.closePath();
    g.stroke();
    //绘制房间网格
    g.strokeStyle = '#EEE8AA';
    for (var cr = 0; cr <= (rfColCount>rfRowCount?rfColCount:rfRowCount); cr++) {
      g.beginPath();
      if(cr <= rfColCount){
        g.lineWidth = cr%bind == 0 ? 3 : 1;
        g.moveTo(rfX+GAP*cr, rfY);
        g.lineTo(rfX+GAP*cr, rfY+rfRowCount*GAP);
      }
      if(cr <= rfRowCount){
        g.lineWidth = cr%bind == 0 ? 3 : 1;
        g.moveTo(rfX, rfY+GAP*cr);
        g.lineTo(rfX+rfColCount*GAP, rfY+GAP*cr);
      }
      g.stroke();
    }
    //绘制行列值及刻度线
    g.lineWidth = 1;
    g.strokeStyle = '#000000';
    for (var cr = 0; cr <= (rfColCount>rfRowCount?rfColCount:rfRowCount); cr+=bind) {
      g.beginPath();
      if(cr <= rfColCount){
        g.moveTo(rfX+GAP*cr, rfY);
        g.lineTo(rfX+GAP*cr, rfY-GAP*1.5);
        //标识列值
        if(cr>0 && cr%bind==0){
          g.fillText(colTexts[cr/bind], rfX+GAP*cr-GAP*bind/2, rfY - 20);
        }
      }
      if(cr <= rfRowCount){
        g.moveTo(rfX, rfY+GAP*cr);
        g.lineTo(rfX-GAP*1.5, rfY+GAP*cr);
        //标记行值
        if(cr>0 && cr%bind==0){
          g.fillText(cr/bind, rfX - 20, rfY+GAP*cr-GAP*bind/2);
        }
      }
      g.stroke();
    }
    //房间网格边框
    g.lineWidth = 4;
    g.strokeStyle = '#888466';
    g.beginPath();
    g.moveTo(rfX, rfY);
    g.lineTo(rfX, rfY + rfRowCount*GAP);
    g.lineTo(rfX + rfColCount*GAP, rfY + rfRowCount*GAP);
    g.lineTo(rfX + rfColCount*GAP, rfY);
    g.closePath();
    g.stroke();
    g.restore();
  }
});
