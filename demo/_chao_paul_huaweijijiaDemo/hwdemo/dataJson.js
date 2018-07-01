/**
 * 面板背板json
 * size U数
 */
var panelDef = {
    "hw_rh2288_v3_front": { label: "hw_rh2288_v3_front", size: 2 },
    "hw_rh2288_v3_back": { label: "hw_rh2288_v3_back", size: 2 },
    "1u": { label: "1u", size: 1 },
    "2u": { label: "2u", size: 2 },
    "3u": { label: "3u", size: 3 },
    "4u": { label: "4u", size: 4 },
    "5u": { label: "5u", size: 5 },
    "6u": { label: "6u", size: 6 },
    "7u": { label: "7u", size: 7 },
    "8u": { label: "8u", size: 8 },
    "9u": { label: "9u", size: 9 },
    "10u": { label: "10u", size: 10 },
};

  /**
 * 面板部件json
 * height width 与SVG图片宽、高一致
 * label 显示在侧边栏
 */

var component = {
    "VGA": { label: "VGA", width: 24.62, height: 7.94 },
    "port_db9": { label: "port_db9", width: 18.00, height: 9.28 },
    "rj4503": { label: "rj4503", width: 13.78, height: 9.55 },
    "rj4504": { label: "rj4504", width: 18.00, height: 12.60 },
    "text_01": { label: "text_01", width: 6.90, height: 3.07, decoration: true },
    "usb_01": { label: "usb_01", width: 12.55, height: 6.38 },
    "deco_20": { label: "deco_20", width: 20.00, height: 12.00 },
    "disk_01": { label: "disk_01", width: 17.92, height: 76.52 },
    "disk_08": { label: "disk_08", width: 98.01, height: 27.65 },
    "disk_09": { label: "disk_09", width: 98.01, height: 27.65 },
    "logo_hw": { label: "logo_hw", width: 14.09, height: 13.72 },
    "port_07": { label: "port_07", width: 5.01, height: 13.78 },
    "fan_01":{label: "fan_01", width: 89.49, height: 39.51, decoration: true },
    "port_power":{label: "port_power", width: 15.11, height: 21.04},
    "deco_24":{label: "deco_24", width: 7.17, height: 3.11, decoration: true },
    "deco_25":{label: "deco_25", width: 6.80, height: 3.11, decoration: true },
    "port_15":{label: "port_15", width: 28.82, height: 11.68},
    "port_17":{label: "port_17", width: 13.60, height: 6.65},
    "port_16":{label: "port_16", width: 28.82, height: 11.68},
}

 //设备面板端口信息json
 var devicePanel_server = {
    "hw_rh2288_v3": {
        size: 2,
        data: [{
            "id": "twaver.idc.hw_rh2288_v3_front.panel"
        }, {
            "position": [27, 2, 0],
            "id": "twaver.idc.disk_09.panel"
        }, {
            "position": [27, 31, 0],
            "id": "twaver.idc.disk_09.panel"
        }, {
            "position": [27, 60, 0],
            "id": "twaver.idc.disk_09.panel"
        }, {
            "position": [128, 2, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [127, 31, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [127, 60, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [229, 2, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [229, 31, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [229, 60, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [331, 2, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [330, 31, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [331, 60, 0],
            "id": "twaver.idc.disk_08.panel"
        }, {
            "position": [8, 4, 0],
            "id": "twaver.idc.port_07.panel"
        }, {
            "position": [0, 43, 0],
            "id": "twaver.idc.deco_20.panel"
        }, {
            "position": [7, 20, 0],
            "id": "twaver.idc.text_01.panel"
        }, {
            "position": [8, 26, 0],
            "id": "twaver.idc.port_07.panel"
        }, {
            "position": [3, 62, 0],
            "id": "twaver.idc.logo_hw.panel"
        }]
    },
    "hw_rh2288_v3.back": {
      size: 2,
      data: [{
        "id": "twaver.idc.hw_rh2288_v3_back.panel"
      }, {
        "position": [208, 77, 0],
        "id": "twaver.idc.port_17.panel"
      }, {
        "position": [34, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n1"
        }
      }, {
        "position": [65, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n2"
        }
      }, {
        "position": [249, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n3"
        }
      }, {
        "position": [232, 77, 0],
        "id": "twaver.idc.port_17.panel"
      }, {
        "position": [223, 80, 0],
        "rotation": [0, 0, 270],
        "id": "twaver.idc.text_01.panel"
      }, {
        "position": [274, 73, 0],
        "id": "twaver.idc.port_15.panel"
      }, {
        "position": [285, 85, 0],
        "id": "twaver.idc.deco_24.panel"
      }, {
        "position": [314, 73, 0],
        "id": "twaver.idc.port_16.panel"
      }, {
        "position": [325, 85, 0],
        "id": "twaver.idc.deco_25.panel"
      }, {
        "position": [355, 47, 0],
        "id": "twaver.idc.fan_01.panel"
      }, {
        "position": [355, 6, 0],
        "id": "twaver.idc.fan_01.panel"
      }, {
        "position": [369, 57, 0],
        "id": "twaver.idc.port_power.panel",
        "client": {
          "bid": "p2"
        }
      }, {
        "position": [369, 16, 0],
        "id": "twaver.idc.port_power.panel",
        "client": {
          "bid": "p1"
        }
      }]
    },
    "dell_poweredge_m1000e": {
        size: 10,
        data: [{
            "id": "twaver.idc.10u.panel"
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [30,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot1"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [80,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot2"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [130,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot3"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [180,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot4"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [230,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot5"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [280,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot6"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [330,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot7"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [380,15,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot8"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [30,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot9"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [80,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot10"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [130,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot11"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [180,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot12"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [230,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot13"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [280,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot14"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [330,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot15"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [380,225,0],
            "width": 45,
            "height": 205,
            "client":
            {
                "bid": "slot16"
            }
        }]
    },
    "dell_poweredge_m1000e.back": {
        size: 10,
        data: [{
            "id": "twaver.idc.10u.panel"
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [40,15,0],
            "width": 80,
            "height": 30,
            "client":
            {
                "bid": "slot1"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [185,15,0],
            "width": 80,
            "height": 30,
            "client":
            {
                "bid": "slot2"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [340,15,0],
            "width": 80,
            "height": 30,
            "client":
            {
                "bid": "slot3"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [27.5,60,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot4"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [27.5,150,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot5"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [27.5,240,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot6"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [102.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot7"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [132.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot8"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [162.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot9"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [192.5,60,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot10"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [192.5,150,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot11"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [192.5,240,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot12"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [267.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot13"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [297.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot14"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [327.5,60,0],
            "width": 25,
            "height": 270,
            "client":
            {
                "bid": "slot15"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [357.5,60,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot16"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [357.5,150,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot17"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [357.5,240,0],
            "width": 70,
            "height": 80,
            "client":
            {
                "bid": "slot18"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [35,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot19"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [100,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot20"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [165,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot21"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [230,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot22"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [295,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot23"
            }
        },
        {
            "id": "twaver.idc.slot.panel",
            "position": [360,345,0],
            "width": 60,
            "height": 90,
            "client":
            {
                "bid": "slot24"
            }
        }]
    },
    "dell_powerEdge_m710h": {
      card: true,
      data: [{
        "id": "twaver.idc.card.panel",
        "width": 45,
        "height": 205
      },
      {
        "id":"twaver.idc.disk_01.panel",
        "position": [20,10,0]
      },
      {
        "id":"twaver.idc.disk_01.panel",
        "position": [20,105,0]
      }]
    },
    "lenovo_system_x3650_m5.back": {
      size: 2,
      data: [{
        "id": "twaver.idc.2u.panel",
        client: {
          halfDepth: true
        }
      }, {
        "position": [208, 77, 0],
        "id": "twaver.idc.port_17.panel"
      }, {
        "position": [34, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n1"
        }
      }, {
        "position": [65, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n2"
        }
      }, {
        "position": [249, 73, 0],
        "id": "twaver.idc.rj4504.panel",
        "client": {
          "bid": "n3"
        }
      }, {
        "position": [232, 77, 0],
        "id": "twaver.idc.port_17.panel"
      }, {
        "position": [223, 80, 0],
        "rotation": [0, 0, 270],
        "id": "twaver.idc.text_01.panel"
      }, {
        "position": [274, 73, 0],
        "id": "twaver.idc.port_15.panel"
      }, {
        "position": [285, 85, 0],
        "id": "twaver.idc.deco_24.panel"
      }, {
        "position": [314, 73, 0],
        "id": "twaver.idc.port_16.panel"
      }, {
        "position": [325, 85, 0],
        "id": "twaver.idc.deco_25.panel"
      }, {
        "position": [355, 47, 0],
        "id": "twaver.idc.fan_01.panel"
      }, {
        "position": [355, 6, 0],
        "id": "twaver.idc.fan_01.panel"
      }, {
        "position": [369, 57, 0],
        "id": "twaver.idc.port_power.panel",
        "client": {
          "bid": "p2"
        }
      }, {
        "position": [369, 16, 0],
        "id": "twaver.idc.port_power.panel",
        "client": {
          "bid": "p1"
        }
      }]
    }
}

//添加面板背板示例
Util.setServerBackPanel(panelDef);
//添加面板部件示例
Util.setServerPanelComp(component);
//添加设备面板示例
Util.setServerPanel(devicePanel_server);
