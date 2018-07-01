$(function () {
  twaver.Defaults.CENTER_LOCATION = true;

  var box = window.box = new twaver.ElementBox();
  var network = new twaver.vector.Network(box);
  var pane = new twaver.controls.BorderPane(network);
  var view = pane.getView();
  view.style.left = '0px';
  view.style.top = '0px';
  view.style.right = '0px';
  view.style.bottom = '0px';
  document.body.appendChild(view);
  window.onresize = function () {
    pane.invalidate();
  };

  var autoLayouter = new twaver.layout.AutoLayouter(box);

  network.addInteractionListener(function (e) {
    // 监听双击网元事件，加载或删除子节点
    if (e.kind === 'doubleClickElement' && e.element instanceof twaver.Node) {
      var node = e.element;
      var layer = node.getClient('layer');
      var nodes = box.getDatas().toList(function (node) {
        return node.getClient('layer') === layer;
      });
      if (node.getClient('loaded')) {
        // 删除已加载孩子节点
        nodes.forEach(function (node) {
          node.toChildren().forEach(function (data) {
            box.remove(data);
          });
          node.setClient('loaded', false);
        });
        // 删除完节点和连线后，执行圆形自动布局
        doLayout();
      } else {
        // 添加孩子节点
        var count = 0;
        nodes.forEach(function (node) {
          ajax(node.getId(), {
            success: function (datas) {
              node.setClient('loaded', true);
              addDatas(node, datas);
              count ++;
              if (count === nodes.size()) {
                // 添加完节点和连线后，执行圆形自动布局
                doLayout();
              }
            }
          });
        });
      }
    }
  });

  function doLayout () {
    autoLayouter.doLayout('round', function () {
      var nodesBounds = null,
        networkBounds = network.getViewRect();
      box.forEach(function (element) {
        if (element instanceof twaver.Node) {
          nodesBounds = twaver.Util.unionRect(nodesBounds, element.getRect());
        }
      });
      if (nodesBounds.width > networkBounds.width || nodesBounds.height > networkBounds.height) {
        network.zoomOverview(false);
      } else {
        network.setZoom(1);
      }
      var callback = function (e) {
        if (e.kind === 'validateEnd') {
          network.removeViewListener(callback);
          network.panToCenter();
        }
      };
      network.addViewListener(callback);
    });
  }

  // debug为true，表示测试模式，真实应用场景应该是从后台拿json数据
  var debug = true;

  function ajax (url, settings) {
    if (debug) {
      setTimeout(function () {
        settings.success(fakeDatas[url]);
      }, 0);
    } else {
      $.ajax('/api/' + url, settings);
    }
  }

  // 请求顶层数据
  ajax('', {
    success: function (datas) {
      addDatas(null, datas);
      // 添加完节点和连线后，执行圆形自动布局
      doLayout();
    }
  });
  
  // 添加节点和连线
  function addDatas (parent, datas) {
    if (!datas) {
      return;
    }
    datas.nodes.forEach(function (data) {
      var node = new twaver.Node(data.id);
      node.setName(data.name);
      node.setClient('layer', data.layer);
      if (data.type === 'switch') {
        node.setImage('switch');
      }
      if (data.type === 'unknown') {
        node.setImage('unknown');
        node.setSize(node.getWidth() * 2, node.getHeight() * 2);
      }
      if (parent) {
        node.setLocation(parent.getLocation());
        parent.addChild(node);
      }
      box.add(node);
    });
    datas.links.forEach(function (data) {
      var from = box.getDataById(data.from),
        to = box.getDataById(data.to),
        link = new twaver.Link(from, to);
      link.setName(data.name);
      if (parent) {
        parent.addChild(link);
      }
      box.add(link);
    });
  }

  // 模拟数据
  var fakeDatas = window.fakeDatas = {};

  // 顶层数据
  var id = 0;
  var topDatas = {
    // 节点
    nodes: [
      {
        // 编号
        id: id++,
        // 名称
        name: 'Node0',
        // 类型
        type: 'switch',
        // 层级
        layer: 0
      },
      {
        // 编号
        id: id++,
        // 名称
        name: 'Node1',
        // 类型
        type: 'switch',
        layer: 1
      },
      {
        id: id++,
        name: 'Node2',
        type: 'switch',
        layer: 1
      },
      {
        id: id++,
        name: 'Node3',
        type: 'switch',
        layer: 1
      },
      {
        id: id++,
        name: 'Node4',
        type: 'switch',
        layer: 1
      }
    ],
    // 连线
    links: [
      {
        // 起始节点编号
        from: 0,
        // 结束节点编号
        to: 1,
        // 名称
        name: 'Link1'
      },
      {
        from: 0,
        to: 2,
        name: 'Link2'
      },
      {
        from: 0,
        to: 3,
        name: 'Link3'
      },
      {
        from: 0,
        to: 4,
        name: 'Link4'
      }
    ]
  };
  fakeDatas[''] = topDatas;
  makeFakeDatas(topDatas.nodes, 2);

  function makeFakeDatas (nodes, layer) {
    nodes.forEach(function (node) {
      if (node.id === 0) {
        return;
      }
      var nodes = [],
        links = [];
      for (var i=0; i<8; i++) {
        var child = {
          id: id++,
          name: node.name + (i + 1),
          layer: layer
        };
        if (Math.random() > 0.9) {
          child.type = 'unknown';
        }
        nodes.push(child);
        links.push({
          from: node.id,
          to: child.id
        });
      }
      fakeDatas[node.id] = {
        nodes: nodes,
        links: links
      };
      if (layer < 4) {
        makeFakeDatas(nodes, layer + 1);
      }
    });
  }

  // 注册图片
  twaver.Util.registerImage('switch', {
    "w": 86.09,
    "h": 15.298,
    "origin": {
      "x": 0,
      "y": 0
    },
    "clip": true,
    "v": [
      {
        "shape": "rect",
        "x": 0,
        "y": 0,
        "w": 86.09,
        "h": 15.298,
        "gradient": {
          "type": "linear",
          "x1": 43.0449,
          "y1": 0.2998,
          "x2": 43.0449,
          "y2": 15.5977,
          "stop": [
            {
              "offset": "0.0588",
              "color": "#E0E0E0"
            },
            {
              "offset": "0.2804",
              "color": "#D3D3D3"
            },
            {
              "offset": "0.7029",
              "color": "#C1C1C1"
            },
            {
              "offset": "1",
              "color": "#BABABA"
            }
          ]
        }
      },
      {
        "shape": "g",
        "v": [
          {
            "shape": "g",
            "v": [
              {
                "shape": "g",
                "v": [
                  {
                    "shape": "g",
                    "v": [
                      {
                        "shape": "path",
                        "data": "M0,15.298c0,0,85.54,0,85.69,0c0.15,0,0.4,0,0.4,0V0l-0.65-0.001v14.549H0V15.298z",
                        "fill": "#000000"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "shape": "rect",
        "x": 41.517,
        "y": 9.245,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "g",
        "v": [
          {
            "shape": "rect",
            "x": 31.709,
            "y": 2.529,
            "w": 22.722,
            "h": 10.349,
            "fill": "#E6E6E6"
          },
          {
            "shape": "rect",
            "x": 33.54,
            "y": 4.057,
            "w": 8.249,
            "h": 4.949,
            "fill": "#639963"
          },
          {
            "shape": "rect",
            "x": 43.364,
            "y": 4.132,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 46.673,
            "y": 4.132,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 49.845,
            "y": 4.132,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 43.364,
            "y": 6.531,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 46.673,
            "y": 6.531,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 49.845,
            "y": 6.531,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 43.364,
            "y": 8.686,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 46.673,
            "y": 8.686,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 49.845,
            "y": 8.686,
            "w": 2.068,
            "h": 1.24,
            "fill": "#A1A1A1"
          },
          {
            "shape": "rect",
            "x": 34.665,
            "y": 9.926,
            "w": 2.4,
            "h": 1.425,
            "fill": "#787878"
          },
          {
            "shape": "rect",
            "x": 38.189,
            "y": 9.926,
            "w": 2.4,
            "h": 1.425,
            "fill": "#787878"
          }
        ]
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 2.302,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 3.866,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 4.611,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 6.176,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 6.921,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 9.245,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 8.485,
        "w": 3.056,
        "h": 0.746,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 11.541,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 26.928,
        "y": 10.796,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 2.302,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 3.866,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 4.611,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 6.176,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 6.921,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 8.485,
        "w": 3.056,
        "h": 0.746,
        "fill": "#FFEAEA"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 9.231,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 11.541,
        "w": 3.056,
        "h": 1.564,
        "fill": "#FF4540"
      },
      {
        "shape": "rect",
        "x": 55.975,
        "y": 10.796,
        "w": 3.056,
        "h": 0.745,
        "fill": "#FFEAEA"
      },
      {
        "shape": "g",
        "v": [
          {
            "shape": "rect",
            "x": 2.813,
            "y": 2.154,
            "w": 23.097,
            "h": 11.099,
            "fill": "#181818"
          },
          {
            "shape": "rect",
            "x": 4.137,
            "y": 3.254,
            "w": 20.448,
            "h": 8.899,
            "fill": "#F1F1F1"
          },
          {
            "shape": "rect",
            "x": 7.412,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 6.224,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 11.611,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 10.424,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 15.661,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 14.473,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 19.748,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 18.56,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 19.748,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 18.56,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 15.548,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 14.361,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 11.499,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 10.311,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 7.412,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 6.224,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          }
        ]
      },
      {
        "shape": "g",
        "v": [
          {
            "shape": "rect",
            "x": 60.18,
            "y": 2.154,
            "w": 23.097,
            "h": 11.099,
            "fill": "#181818"
          },
          {
            "shape": "rect",
            "x": 61.505,
            "y": 3.254,
            "w": 20.448,
            "h": 8.899,
            "fill": "#F1F1F1"
          },
          {
            "shape": "rect",
            "x": 64.78,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 63.592,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 68.979,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 67.792,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 73.028,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 71.841,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 77.116,
            "y": 2.154,
            "w": 0.875,
            "h": 2.875,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 75.928,
            "y": 5.029,
            "w": 3.25,
            "h": 2.225,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 77.116,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 75.928,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 72.916,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 71.729,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 68.867,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 67.679,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          },
          {
            "shape": "rect",
            "x": 64.78,
            "y": 10.379,
            "w": 0.875,
            "h": 2.874,
            "fill": "#686868"
          },
          {
            "shape": "rect",
            "x": 63.592,
            "y": 8.153,
            "w": 3.25,
            "h": 2.226,
            "fill": "#161616"
          }
        ]
      }
    ]
  });
  twaver.Util.registerImage('unknown', {
    "w": 15.771,
    "h": 16,
    "origin": {
      "x": 0,
      "y": 0
    },
    "clip": true,
    "v": [
      {
        "shape": "rect",
        "x": 1.125,
        "y": 0,
        "w": 8,
        "h": 14,
        "fill": "#848484"
      },
      {
        "shape": "rect",
        "x": 2.125,
        "y": 1,
        "w": 6,
        "h": 12,
        "fill": "#FFFFFF"
      },
      {
        "shape": "rect",
        "x": 3.125,
        "y": 3,
        "w": 4,
        "h": 10,
        "fill": "#848484"
      },
      {
        "shape": "rect",
        "x": 4.125,
        "y": 4,
        "w": 2,
        "h": 9,
        "fill": "#FFFFFF"
      },
      {
        "shape": "rect",
        "x": 4.125,
        "y": 2,
        "w": 2,
        "h": 1,
        "fill": "#848484"
      },
      {
        "shape": "rect",
        "x": 2.125,
        "y": 14,
        "w": 6,
        "h": 1,
        "fill": "#363540"
      },
      {
        "shape": "rect",
        "x": 0,
        "y": 15,
        "w": 10,
        "h": 1,
        "fill": "#363540"
      },
      {
        "shape": "path",
        "data": "M15.771,10.5c0,3.039-2.462,5.5-5.5,5.5l0,0c-3.038,0-5.5-2.461-5.5-5.5l0,0c0-3.037,2.462-5.5,5.5-5.5l0,0  C13.309,5,15.771,7.463,15.771,10.5L15.771,10.5z",
        "fill": "#848484"
      },
      {
        "shape": "path",
        "data": "M14.771,10.5c0,2.486-2.015,4.5-4.5,4.5l0,0c-2.485,0-4.5-2.014-4.5-4.5l0,0c0-2.484,2.015-4.5,4.5-4.5l0,0  C12.756,6,14.771,8.016,14.771,10.5L14.771,10.5z",
        "fill": "#FFFFFF"
      },
      {
        "shape": "g",
        "v": [
          {
            "shape": "path",
            "data": "M10.719,11.823H9.862v-0.594c0-0.198,0.04-0.355,0.121-0.47s0.257-0.276,0.53-0.487   c0.416-0.319,0.624-0.658,0.624-1.016c0-0.27-0.082-0.483-0.244-0.642c-0.163-0.158-0.375-0.237-0.635-0.237   c-0.604,0-0.959,0.418-1.068,1.252L8.232,9.459c0.059-0.624,0.289-1.114,0.692-1.47c0.402-0.356,0.885-0.534,1.448-0.534   c0.56,0,1.022,0.166,1.389,0.499C12.127,8.286,12.31,8.7,12.31,9.195c0,0.246-0.051,0.479-0.151,0.701   c-0.102,0.221-0.216,0.393-0.345,0.514c-0.129,0.122-0.401,0.335-0.817,0.64c-0.117,0.085-0.192,0.168-0.224,0.248   C10.74,11.379,10.722,11.554,10.719,11.823z M10.895,12.447v1.099H9.862v-1.099H10.895z",
            "fill": "#848484"
          }
        ]
      }
    ]
  });
});