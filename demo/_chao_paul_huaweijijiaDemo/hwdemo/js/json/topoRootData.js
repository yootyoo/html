var topo = {
  "/": {
    "backgroudUrl": "./images/datacenter/DataCenter_bg.png",
    "dataType": "root",
    "datas": [{
      "name": "数据中心",
      "dn": null,
      "motype": "{ifos}District",
      "mocId": 001,
      "row": "",
      "column": "",
      "location": {
        "x": 420.0,
        "y": 237.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "乌兰察布云服务数据中心",
      "dn": "2828395011653123",
      "motype": "{ifos}District",
      "mocId": 002,
      "row": "",
      "column": "",
      "location": {
        "x": 715.0,
        "y": 282.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }],
  },

  //乌兰察布数据中心数据
  "2828395011653123": {
    "backgroudUrl": "./images/datacenter/datacenter.png",
    "datas": [{
      "name": "辅助楼",
      "elementId": "10687",
      "dn": "284397493787123321",
      "motype": "{ifos}Building",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 620.8,
        "y": 447.6,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "620.8;447.6$1048;578$1095;590$1019;659$867;681$851;657$807;626$760;603$711;588$625;566$621;481$671;448$804;470$872;491$979;527$1048;542"
      },
      "chartData": {
        domainDn: "b2",
        name: "辅助楼",
        type: "building",
        Space: "520",
        Power: "8",
        Cooling: "5",
        Network: "41",
        SpaceAll: "1750",
        PowerAll: "10",
        CoolingAll: "7",
        NetworkAll: "46",
        SpaceColor: "green",
        PowerColor: "orange",
        CoolingColor: "green",
        NetworkColor: "green"
      },
    }, {
      "name": "主机房楼",
      "elementId": "10001",
      "dn": "284397493787123123",
      "motype": "{ifos}Building",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 616,
        "y": 278.8,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "616;278.8$624;463$616;358$837;279$1368;363$1363;426$1414;436$1414;503$1275;635$1051;578$1050;542$981;524$975;530$929;508$840;478$757;461$756;461$755;460$671;449$648;466"
      },
      "chartData":{
        domainDn: "b1",
        name: "主机房楼",
        type: "building",
        Space: "200",
        Power: "6",
        Cooling: "3",
        Network: "12",
        SpaceAll: "750",
        PowerAll: "10",
        CoolingAll: "7",
        NetworkAll: "46",
        SpaceColor: "green",
        PowerColor: "orange",
        CoolingColor: "green",
        NetworkColor: "green"
      },
    }],
  },

  //主机房楼数据
  "284397493787123123": {
    "backgroudUrl": "./images/datacenter/mainbuilding.png",
    "datas": [{
      "name": "3层",
      "elementId": "10004",
      "dn": "287493764593254099",
      "motype": "{ifos}Floor",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 38.75,
        "y": 142.05,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "38.75;142.0499999999999$42;332$39;270$396;142$741;202$1037;245$1084;253$1219;280$1217;293$1217;314$1214;358$1189;371$1104;421$957;526$637;458"
      },
      "chartData": {
        domainDn: "floor 03",
        name: "3层",
        type: "floor",
        Space: "89",
        Power: "52",
        Cooling: "40",
        Network: "20",
        SpaceAll: "100",
        PowerAll: "100",
        CoolingAll: "100",
        NetworkAll: "100",
        SpaceColor: "red",
        PowerColor: "green",
        CoolingColor: "yellow",
        NetworkColor: "red"
      },
    }, {
      "name": "1层",
      "elementId": "10002",
      "dn": "123123123123",
      "motype": "{ifos}Floor",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 46.1,
        "y": 395.25,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "46.1;395.25$386;530$51;458$46;395$219;431$353;460$554;502$596;510$674;528$755;548$923;585$1071;612$1154;548$1273;450$1210;499$1175;531$1162;541$1241;474$1296;434$1291;484$1289;501$1080;698$1075;701$951;671"
      }
    }, {
      "name": "2层",
      "elementId": "10003",
      "dn": "2843974937871232099",
      "motype": "{ifos}Floor",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 41.8,
        "y": 331.1,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "41.8;331.1$1007;492$1001;498$1114;415$1163;386$1199;363$1300;389$1295;433$1070;613$963;592$948;590$768;551$641;521$533;497$443;478$153;419$47;394$42;331$516;431$959;527"
      },
      "chartData": {
        domainDn: "floor 02",
        name: "2层",
        type: "floor",
        Space: "89",
        Power: "52",
        Cooling: "40",
        Network: "20",
        SpaceAll: "100",
        PowerAll: "100",
        CoolingAll: "100",
        NetworkAll: "100",
        SpaceColor: "red",
        PowerColor: "green",
        CoolingColor: "yellow",
        NetworkColor: "red"
      },
    }],
  },


  //2层数据
  "2843974937871232099": {
    "backgroudUrl": "./images/datacenter/floor2.png",
    "datas": [{
      "name": "L2南弱电间",
      "elementId": "10715",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1180.1,
        "y": 716.1,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1178.7;717.1$1179;718$1221;717$1227;759$1181;759"
      }
    }, {
      "name": "L2北弱电间",
      "elementId": "10714",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1152,
        "y": 174.4,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1152;174.4$1152;175$1197;174$1197;209$1154;209"
      }
    }, {
      "name": "蓄电池室-UA2",
      "elementId": "10710",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1383.45,
        "y": 224.95,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1383.45;224.95$1383;225$1514;226$1538;424$1405;425"
      }
    }, {
      "name": "蓄电池室-UB2",
      "elementId": "10711",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1407.65,
        "y": 468,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1407.65;468$1408;470$1542;468$1570;695$1431;693"
      }
    }, {
      "name": "L2变配电所A",
      "elementId": "10038",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1199.5,
        "y": 207.05,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1199.5;207.05000000000004$1200;207$1387;209$1407;427$1211;427"
      }
    }, {
      "name": "L2变配电所B",
      "elementId": "10039",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 1213.25,
        "y": 470.75,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "1213.25;470.75$1213;471$1406;472$1436;719$1227;717"
      }
    }, {
      "name": "L25",
      "elementId": "10037",
      "dn": "2828395011653632098666",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 463,
        "y": 471,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "388;471$432;473$688;471$732;473$731;473$726;549$722;669$690;668$676;843$388;847"
      },
      "chartData": {
        domainDn:"L25",
        name:"L25",
        type:"room",
        Space:"89",
        Power:"52",
        Cooling:"40",
        Network:"20",
        SpaceAll:"100",
        PowerAll:"100",
        CoolingAll:"100",
        NetworkAll:"100",
        SpaceColor:"red",
        PowerColor:"green",
        CoolingColor:"yellow",
        NetworkColor:"red"
      },
    }, {
      "name": "L23",
      "elementId": "10033",
      "dn": "282839501165363243546",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 702,
        "y": 108.25,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "702;108.25$714;108$963;110$964;429$702;425"
      }
    }, {
      "name": "L21",
      "elementId": "10034",
      "dn": "2843531653632098666",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 243.1,
        "y": 107.3,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "177.5;109.3$233;110$471;109$437;426$178;429"
      },
      "chartData": {
        domainDn: "L21",
        name: "L21",
        type: "room",
        Space: "91",
        Power: "14",
        Cooling: "73",
        Network: "20",
        SpaceAll: "100",
        PowerAll: "100",
        CoolingAll: "100",
        NetworkAll: "100",
        SpaceColor: "red",
        PowerColor: "green",
        CoolingColor: "yellow",
        NetworkColor: "red"
      },
    }, {
      "name": "H21",
      "elementId": "10032",
      "dn": "28283950116536324534666",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 721.65,
        "y": 469.3,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "721.65;469.29999999999995$731;469$964;473$963;669$722;668"
      }
    }, {
      "name": "L22",
      "elementId": "10035",
      "motype": "{ifos}Room",
      "dn": "2828395456532098666",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 499.7,
        "y": 109.05,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "436.5;107.6$469;108$717;110$702;427$437;428"
      }
    }, {
      "name": "L24",
      "elementId": "10036",
      "dn": "282834352098666",
      "motype": "{ifos}Room",
      "mocId": 0,
      "row": "",
      "column": "",
      "location": {
        "x": 175,
        "y": 469.3,
        "z": 0
      },
      "extendPropertites": {
        "itemPoints": "108;470.3$170;471$428;470$388;844$331;843$225;845$108;842$128;729"
      }
    }],
  },

  //L21数据
  "2828395011653632098666": {
    // "backgroudUrl": "./images/datacenter/u4299.png",
    "dataType": "room",
    "racksField":{
        x: 80,
        y: 140,
        width: 700,
        height: 300
      },
    "datas": [{
      "name": "空调-2F(L21)-3",
      "elementId": "10198",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "type": 'UPS',
      "mocId": 0,
      "row": "23",
      "column": "AM",
      "location": {
        "x": 328.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "加湿器-2F(L21)-1",
      "elementId": "10199",
      "motype": "{HUMIDIFIER}STAND-SMG20_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AF",
      "location": {
        "x": 152.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "空调-2F(L21)-1",
      "elementId": "10197",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AB",
      "location": {
        "x": 48.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "空调-2F(L21)-7",
      "elementId": "10202",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "BG",
      "location": {
        "x": 808.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "空调-2F(L21)-4",
      "elementId": "10200",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AR",
      "location": {
        "x": 432.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-B2",
      "elementId": "10187",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AU",
      "location": {
        "x": 504.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-B4",
      "elementId": "10188",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AC",
      "location": {
        "x": 80.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "空调-2F(L21)-6",
      "elementId": "10195",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AZ",
      "location": {
        "x": 640.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "空调-2F(L21)-2",
      "elementId": "10196",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AI",
      "location": {
        "x": 224.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "加湿器-2F(L21)-2",
      "elementId": "10194",
      "motype": "{HUMIDIFIER}STAND-SMG20_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "BD",
      "location": {
        "x": 736.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "PDU-L21-A3",
      "elementId": "10192",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AP",
      "location": {
        "x": 384.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-A4",
      "elementId": "10189",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AG",
      "location": {
        "x": 168.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-B3",
      "elementId": "10190",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AL",
      "location": {
        "x": 296.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-A1",
      "elementId": "10186",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "BH",
      "location": {
        "x": 816.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "模块化1",
      "elementId": "10182",
      "motype": "{ifos}module",
      "mocId": 0,
      "row": "02",
      "column": "AC",
      "location": {
        "x": 72.0,
        "y": 64.0,
        "z": 0.0
      },
      "extendPropertites": {
        "configuration": "3",
        "halfSlotNumber": "2",
        "totality": "17",
        "direction": "2"
      }
    }, {
      "name": "模块化3",
      "elementId": "10183",
      "motype": "{ifos}module",
      "mocId": 0,
      "row": "02",
      "column": "AU",
      "location": {
        "x": 504.0,
        "y": 64.0,
        "z": 0.0
      },
      "extendPropertites": {
        "configuration": "3",
        "halfSlotNumber": "2",
        "totality": "17",
        "direction": "2"
      }
    }, {
      "name": "模块化2",
      "elementId": "10180",
      "motype": "{ifos}module",
      "mocId": 0,
      "row": "02",
      "column": "AL",
      "location": {
        "x": 288.0,
        "y": 64.0,
        "z": 0.0
      },
      "extendPropertites": {
        "configuration": "3",
        "halfSlotNumber": "2",
        "totality": "17",
        "direction": "2"
      }
    }, {
      "name": "模块化4",
      "elementId": "10181",
      "motype": "{ifos}module",
      "mocId": 0,
      "row": "02",
      "column": "BD",
      "location": {
        "x": 720.0,
        "y": 64.0,
        "z": 0.0
      },
      "extendPropertites": {
        "configuration": "3",
        "halfSlotNumber": "2",
        "totality": "17",
        "direction": "2"
      }
    }, {
      "name": "L21西北角摄像机",
      "elementId": "11674",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "01",
      "column": "BK",
      "location": {
        "x": 888.0,
        "y": 32.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "L23东北角摄像机",
      "elementId": "11673",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "20",
      "column": "BK",
      "location": {
        "x": 888.0,
        "y": 480.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "L21东南角摄像机",
      "elementId": "11672",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "20",
      "column": "AA",
      "location": {
        "x": 24.0,
        "y": 480.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "L21西南角摄像机",
      "elementId": "11671",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "01",
      "column": "AA",
      "location": {
        "x": 24.0,
        "y": 32.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "L21辅助间摄像头02",
      "elementId": "11743",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "25",
      "column": "BK",
      "location": {
        "x": 888.0,
        "y": 600.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "L21辅助间摄像头01",
      "elementId": "11742",
      "motype": "{CAMERA}HIKVISION_CAMERA",
      "mocId": 0,
      "row": "25",
      "column": "AA",
      "location": {
        "x": 24.0,
        "y": 600.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "空调-2F(L21)-5",
      "elementId": "11812",
      "motype": "{CRAC}NetCol8000-C150_MODBUS",
      "mocId": 0,
      "row": "23",
      "column": "AV",
      "location": {
        "x": 536.0,
        "y": 560.0,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "PDU-L21-A2",
      "elementId": "11808",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "AY",
      "location": {
        "x": 600.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "PDU-L21-B1",
      "elementId": "11807",
      "motype": "{ifos}PowerELT",
      "mocId": 0,
      "row": "26",
      "column": "BD",
      "location": {
        "x": 728.0,
        "y": 640.0,
        "z": 0.0
      },
      "extendPropertites": {
        "uTotalNumber": "42"
      }
    }, {
      "name": "Rack1",
      "elementId": "L2501",
      "dn": "2828395011653632098123456",
      "motype": "{rack}RackELT",
      "mocId": 0,
      "row": "2",
      "column": "AB",
      "location": {
        "x": 200,
        "y": 200,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "Rack2",
      "elementId": "L2502",
      "dn": "2843974937871232099123455",
      "motype": "{rack}RackELT",
      "mocId": 0,
      "row": "2",
      "column": "AD",
      "location": {
        "x": 300,
        "y": 200,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "Rack3",
      "elementId": "L2503",
      "dn": "2828395011653123088123444",
      "motype": "{rack}RackELT",
      "mocId": 0,
      "row": "2",
      "column": "AF",
      "location": {
        "x": 400,
        "y": 200,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "Rack4",
      "elementId": "L2504",
      "dn": "28283950116531230881236666",
      "motype": "{rack}RackELT",
      "mocId": 0,
      "row": "2",
      "column": "AH",
      "location": {
        "x": 500,
        "y": 200,
        "z": 0.0
      },
      "extendPropertites": {}
    }, {
      "name": "Rack5",
      "elementId": "L2505",
      "dn": "28283950116531230881239999",
      "motype": "{rack}RackELT",
      "mocId": 0,
      "row": "2",
      "column": "AJ",
      "location": {
        "x": 600,
        "y": 200,
        "z": 0.0
      },
      "extendPropertites": {}
    }, ]
  },

}
