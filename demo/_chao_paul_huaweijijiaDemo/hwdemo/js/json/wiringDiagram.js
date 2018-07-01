// //说明：选中某个机柜上的设备，跳到连线视图，展示当前设备的连线信息：包括该设备所在的机柜信息，以及该机柜里面的设备也需要渲染出来，以及目标设备所在的机柜信息；
// 	  返回的数据可能为一个机柜，也可能为多个机柜：如果源设备与目标在同一个机柜，则只返回一个机柜下的信息，否则返回多个，由连线属性决定。

/*	  networkConnectionInfo:[  //网络连接信息
		{
		sourceId:"30502629741639111", 	//源设备id（当前设备标识）
		sourcePort:"1",	  	//源设备端口号
		targetId:"56271197342150865", 	//目标设备id
		targetPort:"1"		//目标设备端口号
		},
		{
		sourceId:"30502629741639111",
		sourcePort:"2",
		targetId:"56271197342150865",
		targetPort:"2"
		}
	],
	powerConnectionInfo:[
		{
		sourceId:"30502629741639111",
		sourcePort:"1",
		targetId:"56271197342150865",
		targetPort:"1"
		},
		{
		sourceId:"30502629741639111",
		sourcePort:"2",
		targetId:"56271197342150865",
		targetPort:"2"
		}
	]
*/

// 模拟数据：	  Server 24 连接了两个网络端口、两个配电端口  目标为机柜Rack 2，
// 	  Server 12 连接了两个网络端口、一个配电端口  目标位当前机柜

var connectionInfo = {
	"2828395011653632098123456": {
		id:"2843974937874432",
		name:"Rack 1",
		dn:"2828395011653632098123456",
		type:"rack",
		uTotalNumber:"46",
		front:"images/Navigation_icon/icon_rack.png",
		rear:"images/Navigation_icon/icon_rack.png",
		children:[{
			type:"RackServer",
			id:30502629741639111,
			model:"RackServer 24",
			name:"Server 24",
			startU:"17",
			endU:"18",
			networkConnectionInfo:[{
				sourceId:"30502629741639111",
				sourcePort:"1",
				targetId:"56271197342150865",
				targetPort:"1"
			},
			{
				sourceId:"30502629741639111",
				sourcePort:"2",
				targetId:"56271197342150865",
				targetPort:"2"
			}],
			powerConnectionInfo:[{
				sourceId:"30502629741639111",
				sourcePort:"1",
				targetId:"56271197342150865",
				targetPort:"1"
			},
			{
				sourceId:"30502629741639111",
				sourcePort:"2",
				targetId:"56271197342150865",
				targetPort:"2"
			}]
		},{
			type:"BladeServer",
			id:40188821841851304,
			model:"BladeServer 1",
			name:"Server 12",
			startU:"31",
			endU:"32",
			networkConnectionInfo:[{
				sourceId:"40188821841851304",
				sourcePort:"1",
				targetId:"43546974813015814",
				targetPort:"7"
			},
			{
				sourceId:"40188821841851304",
				sourcePort:"2",
				targetId:"43546974813015814",
				targetPort:"8"
			}],
			powerConnectionInfo:[{
				sourceId:"40188821841851304",
				sourcePort:"1",
				targetId:"43546974813015814",
				targetPort:"2"
			}]
		},{
			type:"StorageServer",
			id:43256524543638243,
			model:"StorageServer 1",
			name:"Server 30",
			startU:"1",
			endU:"2"
		},
		{
			type:"rPDU",
			id:43546974813015814,
			model:"rPDU 1",
			name:"rPDU",
			startU:"2",
			endU:"16",
			location:"left",
			networkConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"1"},
				{port:"3",status:"1"},
				{port:"4",status:"1"},
				{port:"5",status:"1"},
				{port:"6",status:"1"},
				{port:"7",status:"2"},
				{port:"8",status:"2"},
				{port:"9",status:"1"},
				{port:"10",status:"1"},
				{port:"11",status:"1"},
				{port:"12",status:"1"},
				{port:"13",status:"1"}
			],
			powerConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"}
			]

		},
		{
			type:"rPDU",
			id:48156935926136767,
			model:"rPDU 1",
			name:"rPDU 2",
			startU:"2",
			endU:"16",
			location:"right",
			networkConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"},
				{port:"3",status:"1"},
				{port:"4",status:"2"},
				{port:"5",status:"1"},
				{port:"6",status:"1"},
				{port:"7",status:"2"},
				{port:"8",status:"2"},
				{port:"9",status:"1"},
				{port:"10",status:"1"},
				{port:"11",status:"2"},
				{port:"12",status:"1"},
				{port:"13",status:"1"}
			],
			powerConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"}
			]
		}]
	},
	"2843974937871232099123455": {
		id:"2843976516505601",
		name:"rack2",
		dn:"2843974937871232099123455",
		type:"rack",
		uTotalNumber:"46",
		front:"images/Navigation_icon/icon_rack.png",
		rear:"images/Navigation_icon/icon_rack.png",
		children:[{
			type:"RackServer",
			id:56271197342150865,
			model:"RackServer 24",
			name:"Server 24",
			startU:"17",
			endU:"18"
		},{
			type:"BladeServer",
			id:60610560681981112,
			model:"BladeServer 1",
			name:"Server 12",
			startU:"31",
			endU:"32"
		},{
			type:"StorageServer",
			id:69363434410790117,
			model:"StorageServer 1",
			name:"Server 30",
			startU:"1",
			endU:"2"
		},
		{
			type:"rPDU",
			id:80991706029474097,
			model:"rPDU 1",
			name:"rPDU",
			startU:"2",
			endU:"8",
			location:"left",
			networkConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"},
				{port:"3",status:"1"},
				{port:"4",status:"2"},
				{port:"5",status:"1"},
				{port:"6",status:"1"},
				{port:"7",status:"2"},
				{port:"8",status:"2"},
				{port:"9",status:"1"},
				{port:"10",status:"1"},
				{port:"11",status:"2"},
				{port:"12",status:"1"},
				{port:"13",status:"1"}
			],
			powerConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"}
			]
		},
		{
			type:"rPDU",
			id:88615581520937709,
			model:"rPDU 1",
			name:"rPDU 2",
			startU:"9",
			endU:"16",
			location:"left",
			networkConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"},
				{port:"3",status:"1"},
				{port:"4",status:"2"},
				{port:"5",status:"1"},
				{port:"6",status:"1"},
				{port:"7",status:"2"},
				{port:"8",status:"2"},
				{port:"9",status:"1"},
				{port:"10",status:"1"},
				{port:"11",status:"2"},
				{port:"12",status:"1"},
				{port:"13",status:"1"}
			],
			powerConnects:[
				{port:"1",status:"1"},
				{port:"2",status:"2"}
			]
		}]
	}
}

