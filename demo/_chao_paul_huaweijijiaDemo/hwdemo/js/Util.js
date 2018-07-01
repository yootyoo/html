'use strict';

var Util = {
  registerNormalImage: (function () {
    var loadingImages = {};
    return function (url, name, view) {
      if (loadingImages[url]) {
        loadingImages[url].push(callback);
        return;
      }
      if (twaver.Util.getImageAsset(name)) {
        return;
      }
      loadingImages[url] = [callback];
      var image = new Image();
      image.src = url;
      image.onload = function () {
        twaver.Util.registerImage(name, image, image.width, image.height);
        image.onload = null;
        loadingImages[url].forEach(function (cb) {
          cb();
        });
        delete loadingImages[url];
      };

      function callback () {
        if (view.invalidateElementUIs) {
          view.invalidateElementUIs();
        } else  if (view.invalidateDisplay) {
          view.invalidateDisplay();
        } else {
          view();
        }
      }
    };
  })(),
  rackWidth: 450,
  rackUnitHeight: 44.45,
  rackLeftGap: 120.2,
  rackTopGap: 66.5,
  scaleDevice: function (device) {
    var rackAlpha = 0.4;
    var uSize = device.getClient('size');
    var zoom = device.getHost().getClient('zoom');
    var scale = {
      x: Util.rackWidth * zoom / device.getWidth(),
      y: Util.rackUnitHeight * zoom / device.getHeight() * uSize
    };
    var back = /\.back\./.test(device.getClient('id'));
    device.setSize(Util.rackWidth * zoom, Util.rackUnitHeight * zoom * uSize);
    var hasSlot = Util.hasSlot(device);
    if (back && !hasSlot) {
      device.setStyle('whole.alpha', rackAlpha);
    }
    device.getChildren().forEach(function (child) {
      child.setSize(child.getWidth() * scale.x, child.getHeight() * scale.y);
      child.setLocation(child.getX() * scale.x, child.getY() * scale.y);
      var id = child.getClient('id');
      if (back && !child.getClient('slot') && !/port/.test(id) && !/rj45/.test(id)) {
        child.setStyle('whole.alpha', rackAlpha);
      }
      var bid = child.getClient('bid');
      if (child.getClient('slot') && bid) {
        child.setToolTip(bid);
        // TODO use vector to show slot name
        /*child.setStyle('label.position', 'center');
        child.setStyle('label.color', 'white');
        child.setStyle('label.font', parseInt(Math.min(child.getWidth(), child.getHeight())) + 'px ' + Defaults.Font);
        child.setStyle('label.maxlength', Math.min(child.getWidth(), child.getHeight()));
        child.setName(bid);*/
      }
      if (!child.isMovable()) {
        child.setMovable(true);
      }
    });
  },
  scaleCard: function (card) {
    var slot = card.getHost();
    var scale = {
      x: slot.getWidth() / card.getWidth(),
      y: slot.getHeight() / card.getHeight()
    };
    card.setSize(slot.getSize());
    card.getChildren().forEach(function (child) {
      child.setSize(child.getWidth() * scale.x, child.getHeight() * scale.y);
      child.setLocation(child.getX() * scale.x, child.getY() * scale.y);
      if (!child.isMovable()) {
        child.setMovable(true);
      }
    });
  },
  hasSlot: function (device) {
    var result = false;
    device.getChildren().forEach(function (follower) {
      if (follower.getClient('slot')) {
        result = true;
      }
    });
    return result;
  },
  getDevicePort: function (device, portName) {
    var result;
    device.getFollowers().forEach(function (follower) {
      if (follower.getClient('bid') === portName) {
        result = follower;
      }
    });
    return result;
  },
  getNodeById: function (box, id) {
    var result;
    box.forEach(function (node) {
      if (node.getClient('id') == id) {
        result = node;
      }
    });
    return result;
  },
  addLinks: function (box, deviceData) {
    deviceData.children.forEach(function (device) {
      device.networkConnectionInfo && device.networkConnectionInfo.forEach(function (connection) {
        Util.addLink(box, device, connection, true);
      });
      device.powerConnectionInfo && device.powerConnectionInfo.forEach(function (connection) {
        Util.addLink(box, device, connection, false);
      });
    });
  },
  addLink: function (box, device, connection, isNetwork) {
    var fromDevice = Util.getNodeById(box, connection.sourceId);
    var toDevice = Util.getNodeById(box, connection.targetId);
    if (!fromDevice || !toDevice) {
      console.log('can not find from device or to device', fromDevice ? '' : connection.sourceId, toDevice ? '' : connection.targetId);
      return;
    }
    var prefix = isNetwork ? 'n' : 'p';
    var fromPort = Util.getDevicePort(fromDevice, prefix + connection.sourcePort);
    var toPort = Util.getDevicePort(toDevice, prefix + connection.targetPort);
    if (!fromPort || !toPort) {
      console.log('can not find from port or to port', connection, fromPort ? '' : connection.sourcePort, toPort ? '' : connection.targetPort);
      return;
    }
    var link = new twaver.Link(fromPort, toPort);
    link.setLayerId('linkLayer');
    link.setStyle('link.color', isNetwork ? 'blue' : 'red');
    link.setStyle('link.width', 1);
    link.setStyle('link.type', 'extend.top');
    box.add(link);
  },
  createPduPanel: function  (box, rack, data) {
    var zoom = rack.getClient('zoom');
    var uCount = rack.getClient('uCount');
    var pduPanel = new twaver.Follower();
    var location = data.location;
    pduPanel.setClient('id', data.id);
    pduPanel.setStyle('body.type', 'vector');
    pduPanel.setStyle('vector.outline.width', 0);
    pduPanel.setStyle('vector.outline.color', 'blue');
    pduPanel.setStyle('vector.fill.color', 'rgba(1, 1, 1, 0.3)');
    pduPanel.setSize(40 * zoom, (parseInt(data.endU) - parseInt(data.startU) + 1) * Util.rackUnitHeight * zoom);
    pduPanel.setLocation((location === 'left' ? 60 : 590) * zoom, (Util.rackTopGap + (uCount - parseInt(data.endU)) * Util.rackUnitHeight) * zoom);
    pduPanel.setHost(rack);
    box.add(pduPanel);
    var uLocaiton = parseInt(data.startU);
    data.networkConnects.forEach(function (portData, index) {
      Util.createPduPort(box, pduPanel, uLocaiton++, 'n' + portData.port, portData.status, location, index);
    });
    data.powerConnects.forEach(function (portData, index) {
      Util.createPduPort(box, pduPanel, uLocaiton++, 'p' + portData.port, portData.status, location, index);
    });
  },
  createPduPort: function (box, pduPanel, uLocaiton, portName, status, location) {
    var rack = pduPanel.getHost();
    var zoom = rack.getClient('zoom');
    var uCount = rack.getClient('uCount');
    var port = new twaver.Follower();
    port.setClient('bid', portName);
    port.setStyle('body.type', 'vector');
    port.setStyle('vector.outline.width', 1);
    port.setStyle('vector.outline.color', 'white');
    port.setStyle('vector.fill.color', status == 1 ? 'gray' : 'black');
    port.setSize(40 * zoom, 40 * zoom);
    port.setLocation((location === 'left' ? 60 : 590) * zoom, (Util.rackTopGap + (uCount - uLocaiton) * Util.rackUnitHeight) * zoom);
    port.setHost(pduPanel);
    port.setMovable(false);
    box.add(port);
  },
  setVisible: function (node, visible) {
    node.setVisible(visible);
    node.hasChildren() && node.getChildren().forEach(function (child) {
      child.setVisible(visible);
    });
  },
  setServerBackPanel: function (data) {
      var dataBackPanel = data;
      for (var name in dataBackPanel) {
        this.registerServerBackPanel(name, dataBackPanel[name]);
      }
    },

    setServerPanelComp: function (data) {
      var dataPanelComp = data;
      for (var name in dataPanelComp) {
        this.registerServerPanelCompImage(name, dataPanelComp[name]);
      }
    },

    setServerPanel: function (data) {
      var dataDevicePanel = data;
      for (var name in dataDevicePanel) {
        if (dataDevicePanel[name].data) {
          this.registerDeviceFrontPanel(name, dataDevicePanel[name], 'server');
        }
      }
    },

    /**
     * 注册面板背板
     */
    registerServerBackPanel: function (name, args) {
      var self = this;
      var id = 'twaver.idc.' + name + '.panel';
      make.Default.register(id, function (json) {

        make.Default.copyProperties({
          imageUrl: self.getIdcSVGPath(name),
          client: {
            category: 'networkDevice-panel',
            host: true,
            editable: true,
            size: args.size
          }
        }, json);
        var follower = make.Default.createFollower(json);
        return follower;
      }, this.getServerBackPanelParams(args));
    },

    /**
     * ai默认是72分辨率,1PT = 1/72英寸 = 1/72 * 25.4 mm = 0.3528mm  所以要除以比例系数
     * 10 换算成mm
     * 0.35277778 比例系数
     */
    getServerBackPanelParams: function (args) {
      return {
        name: args.label,
        modelDefaultParameters: {
          width: {
            name: "宽度",
            value: args.relWidth || (make.Default.getEquipmentWidth()) * 10, //换算成mm
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
          },
          height: {
            name: "高度",
            value: args.relHeight || (make.Default.getEquipmentHeight(args.size || 1)) * 10, //换算成mm
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
          },
          halfDepth: {
            name: "半深设备",
            value: false,
            type: make.Default.PARAMETER_TYPE_BOOLEAN,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT
          }
        },
        category: '面板背板',
        icon: this.getIdcIconPath(args.label + '.png'),
        host: true,
      }
    },


    /**
     * 注册面板部件
     */
    registerServerPanelCompImage: function (name, args) {
      var self = this;
      var id = 'twaver.idc.' + name + '.panel';
      make.Default.register(id, function (json) {

        make.Default.copyProperties({
          imageUrl: self.getIdcSVGPath(name),
          client: {
            category: 'device-panel-comp',
            host: false,
          }
        }, json);
        var follower = make.Default.createFollower(json);
        return follower;
      }, this.getServerPanelCompParams(args));
    },

    getServerPanelCompParams: function (args) {

      var modelDefaultParameters = {
        width: {
          name: "宽度",
          value: args.width,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        },
        height: {
          name: "高度",
          value: args.height,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        },
        position: {
          name: "位置[x,y,z]",
          value: [0, 0, 0],
          type: make.Default.PARAMETER_TYPE_ARRAY_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_FIELD,
          hidden: true,
        },
        x: {
          name: "X轴位置",
          value: 0,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR,
          exportable: false,
        },
        y: {
          name: "Y轴位置",
          value: 0,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR,
          exportable: false,
        },
        rotation: {
          name: "旋转[x,y,z]",
          value: [0, 0, 0],
          type: make.Default.PARAMETER_TYPE_ARRAY_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_FIELD,
          hidden: true,
        },
        angle: {
          name: "Z轴旋转",
          value: 0,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR,
          exportable: false,
        },
        decoration: {
          name: "装饰部件",
          value: args.decoration,
          type: make.Default.PARAMETER_TYPE_BOOLEAN,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT,
          hidden: true,
        },
      };
      if (!args.decoration) {
        modelDefaultParameters['bid'] = {
          name: "业务ID",
          value: undefined,
          type: make.Default.PARAMETER_TYPE_STRING,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT,
          index: 0
        }
      }
      var result = {
        name: args.label,
        modelDefaultParameters: modelDefaultParameters,
        category: '面板部件',
        icon: this.getIdcIconPath(args.label + '.png'),
      }
      return result;
    },

    /**
     * 注册设备面板
     */
    registerDeviceFrontPanel: function (name, props, subType) {
      var self = this;
      var size = props.size;

      //前视图
      make.Default.copy('twaver.idc.' + name + '.device.front', 'twaver.idc.equipment' + size + '.front', function (json) {
        json.image = self.getDeviceImagePath2D(name);
      }, {
        icon: self.getDeviceIconPath2D(name),
        subType: subType,
        size: size
      })

      //面板图数据
      make.Default.register('twaver.idc.' + name + '.panel.data', function (json) {

        return props.data;
      }, {
        subType: subType,
        icon: self.getDeviceIconPath2D(name),
        name: name,
        category: '设备面板',
        size: size
      })

      //面板图
      make.Default.copy('twaver.idc.' + name + '.panel.loader', 'twaver.idc.panel.loader', {
        data: props.data,
        client: {
          card: props.card
        }
      }, {
        subType: subType,
        icon: self.getDeviceIconPath2D(name),
        size: size,
        card: props.card
      })
    },

    getDeviceIconPath2D: function (icon) {
      return make.Default.path + 'model/idc/icons/device/' + icon + '_front.png';
    },

    getDeviceImagePath2D: function (icon) {
      return make.Default.path + 'model/idc/images/device/' + icon + '_front.png';
    },

    getIdcIconPath: function (icon) {

      if (icon.indexOf('/') > 0) {
        return icon;
      }
      return 'model/idc/icons/' + icon;
    },

    getIdcSVGPath: function (image) {
      if (image.indexOf('/') > 0) {
        return image;
      }
      if (image.length > 4 && image.lastIndexOf('.svg') == image.length - 4) {
        return make.Default.path + 'model/idc/svg/' + image;
      } else {
        return make.Default.path + 'model/idc/svg/' + image + '.svg';
      }
    },
};

/**
 * 板卡
 */
make.Default.register('twaver.idc.card.panel', function(json) {

    make.Default.copyProperties({
        style: {
            'body.type': 'vector',
            'vector.fill.color': '#444444'
        },
        client: {
            host: true,
            resizeable: true,
            editable: true,
        }
    }, json);
    return make.Default.createFollower(json);
}, {
    name: 'card',
    modelDefaultParameters: {
        width: {
            name: "宽度",
            value: 100,
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        },
        height: {
            name: "高度",
            value: 30,
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        }
    },
    category: '面板背板',
    icon: Util.getIdcIconPath('network_panel.png'),
    host: true,
});

/**
 * 面板槽位
 */
make.Default.register('twaver.idc.slot.panel', function(json) {

    make.Default.copyProperties({
        style: {
            'body.type': 'vector',
            'vector.fill.color': 'gray'
        },
        client: {
            host: false,
            resizeable: true,
            editable: true,
            slot: true
        }
    }, json);
    return make.Default.createFollower(json);
}, {
    name: 'slot',
    modelDefaultParameters: {
        position: {
          name: "位置[x,y,z]",
          value: [0, 0, 0],
          type: make.Default.PARAMETER_TYPE_ARRAY_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_FIELD,
          hidden: true,
        },
        x: {
          name: "X轴位置",
          value: 0,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR,
          exportable: false,
        },
        y: {
          name: "Y轴位置",
          value: 0,
          type: make.Default.PARAMETER_TYPE_NUMBER,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR,
          exportable: false,
        },
        width: {
            name: "宽度",
            value: 100,
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        },
        height: {
            name: "高度",
            value: 30,
            type: make.Default.PARAMETER_TYPE_INT,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_ACCESSOR
        },
        bid: {
          name: "业务ID",
          value: undefined,
          type: make.Default.PARAMETER_TYPE_STRING,
          propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT,
          index: 0
        }
    },
    category: '面板部件',
    icon: Util.getIdcIconPath('network_panel.png'),
    host: false,
});

make.Default.register('twaver.idc.panel.loader', function(json) {

    var data = json.data || [];
    var scale = json.scale || 1;
    var x = json.x || 0;
    var y = json.y || 0;

    if (!data || data.length == 0) {
        return;
    }
    data.forEach(function(d) {
        d.scale = scale;
    });

    var elements = make.Default.load(data);
    if (make.Default.getOtherParameter(data[0].id, 'host')) {

        var nodes = elements;
        var parentNode = nodes[0];
        for (var i = 1; i < nodes.length; i++) {
            nodes[i].setMovable(false);
            nodes[i].setHost(parentNode);
            nodes[i].setParent(parentNode);
            parentNode.addChild(nodes[i]);
        }
        make.Default.setObject2dCSProps(parentNode, json);
        parentNode.setLocation(x, y);
        return parentNode;
    } else {
        var result = [];
        var nodeMap = {},
            nodeArray = [],
            linkArray = [];
        elements.forEach(function(element, index) {
            element.index = index;
            if (make.Default.getOtherParameter(make.Default.getId(element), 'link')) {
                linkArray.push(element);
            } else {
                nodeArray.push(element);
                var bid = element.getClient('bid');
                if (bid && bid.length > 0) {
                    nodeMap[bid] = element;
                }
            }
        })
        nodeArray.forEach(function(n) {
            n.setMovable(false);
            result.push(n);
        })
        linkArray.forEach(function(link) {
            var linkData = data[link.index];
            link.setFromNode(nodeMap[linkData.from]);
            link.setToNode(nodeMap[linkData.to]);
            result.push(link);
        })
        return result;
    }
});
