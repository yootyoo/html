/**
 * 各种矢量图形式
 */

 var Defaults = {
  lineWidth: 1,
  lineColor:'#797979',
  lineTingeColor:'#c9c9c9',
  lineRichColor:'#494949',
  fontSize:12,
  textColor:'#666666',
  boldFontSize:14,
  boldTextColor:'#333333',
  lightFontSize:16,
  lightTextColor:'#00aaff',
  Font:'Microsoft YaHei'
}

/*
 * 容量信息图表，均为矢量图形式
 */

//管理域的容量信息图表
twaver.Util.registerImage('chart', {
  w: 266,
  h: 170,
  v: function (data, view) {
    return [{
      //容量信息图轮廓边框
      shape: 'domainBorder',
      halfW: this.w/2,
      halfH: (this.h-20)/2,
    },{
      //图形中部的直方图
      shape: 'histogram',
      //需显示的各项目，各项目值为其单位
      items:{
        Space: 'U',
        Power: 'kW',
        Cooling: 'kW',
        Network: 'kW'
      },
      halfW: this.w/2,
      halfH: (this.h-20)/2-(this.h-20)/8,
      translate: [0, (this.h-20)/8],
    },{
      //管理域的名称
      shape: 'domainName',
      halfW: this.w/2,
      halfH: (this.h-20)/8,
      fontSize: Defaults.boldFontSize,
      fontType: Defaults.Font,
      fontColor: Defaults.boldTextColor,
      // fontTrait:'bolder',
      translate: [0, (this.h-20)/8-(this.h-20)/2],
    }];
  }
});



//机柜的容量信息图表
twaver.Util.registerImage('rackChart', {
  w: 70,
  h: 144,
  v: function (data, view) {
    return[{
      //机柜的轮廓边框
      shape: 'rackBorder',
      halfW: this.w/2,
      halfH: this.h/2,
    },{
      //中间的横直方图
      shape: 'barchartH',
      //直方图各项目
      items:{
        Overview:{
          Space: 'S',
          Power: 'P',
          Cooling: 'C',
          Network: 'N'
        }
      },
      halfW: this.w/2,
      halfH: this.h/2,
      //显示此直方图的网元state值
      state: 'Overview'
    },{
      //中间的竖直方图
      shape: 'barchartV',
      //直方图各项
      items:{
        Physical:{
          Space: 'S',
          Weight: 'W'
        },
        Power:{
          APhase: 'A',
          BPhase: 'B'
        },
        Cooling:{
          Cooling: 'C',
          Temperature: 'T'
        },
        Network:{
          Fiber: 'F',
          Copper: 'C'
        }
      },
      halfW: this.w/2,
      halfH: this.h/2,
      //显示此直方图的网元state值
      state: ['Physical', 'Power', 'Cooling', 'Network']
    },{
      //机柜的status图
      shape: 'rarckStatus',
      halfW: this.w/2,
      halfH: this.h/2,
      //只有在网元state值为‘Status’时显示此部分图形
      state: 'Status'
    }];
  }
});






//楼层的带框名称
twaver.Util.registerImage('floorName', {
  w: 100,
  h: 40,
  v: function (data, view) {
    return [{
      shape: 'nameBox',
      halfW: this.w/2,
      halfH: this.h/2,
      text: data.getClient('data').name,
      fontTrait:'bolder',
      fontSize: Defaults.boldFontSize,
      fontType: Defaults.Font,
      fontColor: Defaults.boldTextColor,
      iconName: 'floorIcon'
    }];
  }
});

//建筑物的轮廓边框————
// twaver.Util.registerShape('buildBorder', function (g, shapeData, data, view) {
//   var halfW = shapeData.halfW;
//   var halfH = shapeData.halfH;
//   g.drawShape({
//     shape: 'path',
//     data: 'M0,'+(halfH+10)+'L10,'+halfH+'L'+halfW+','+halfH+'L'+halfW+',-'+halfH+'L-'+halfW+',-'+halfH+'L-'+halfW+','+halfH+'L-10,'+halfH+'Z',
//     lineWidth: view.isSelected(data)?Defaults.lineWidth*1.5:Defaults.lineWidth,
//     lineColor: view.isSelected(data)?Defaults.lineRichColor:Defaults.lineColor,
//     fill: view.isSelected(data)?'Lavender':'white'
//   });
// });

//绘制管理域容量信息直方图的方法
twaver.Util.registerShape('histogram', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW;
  var halfH = shapeData.halfH;
  var dataClient = data.getClient('data');
  //显示直方图的项目
  var items = shapeData.items;
  var attrLenght=0, itemLenght=0, itemsLenght=0;
  //分别获取直方图前后字符串的像素长度的最大者
  for (var attr in items){
    //属性名字符串的像素长度
    var attrLen = getTextLenght(attr+':',Defaults.fontSize);
    //各项目中最长属性名字符串的像素长度
    if(attrLen > attrLenght){
      attrLenght = attrLen;
    }
    //属性值字符串的像素长度
    var itemLen = getTextLenght(dataClient[attr].toString(), Defaults.lightFontSize) + getTextLenght('/'+dataClient[attr+'All']+'('+items[attr]+')',Defaults.fontSize);
    //各项目中最长属性值字符串的像素长度
    if(itemLen > itemLenght){
      itemLenght = itemLen;
    }
    itemsLenght++;
  }
  //通过直方图前后字符串的像素长度判断直方图的位移值，以达到居中的效果
  var offsetX = (attrLenght-itemLenght)/2;
  var i = 0;
  //循环绘制各项目
  for (var attr in items){
    var offsetY = halfH*(2*i+1-itemsLenght)/(itemsLenght+1);
    //绘制比例条
    g.drawShape({
      shape: 'scaleBar',
      proportion: dataClient[attr]/dataClient[attr+'All'],
      customColor:dataClient[attr+'Color'],
      translate: [offsetX, offsetY]
    });
    //绘制比例条前部的属性文字
    g.drawShape({
      shape: 'diagramText',
      normalText: attr+':',
      normalFont: Defaults.fontSize+'px '+Defaults.Font,
      normalColor: Defaults.lineColor,
      translate: [offsetX-60, offsetY]
    });
    //绘制比例条后部的值文字，当前值高亮
    g.drawShape({
      shape: 'diagramText',
      highlightText: dataClient[attr],
      highlightFont: Defaults.lightFontSize+'px '+Defaults.lightFont,
      highlightColor:Defaults.lightTextColor,
      normalText:'/'+dataClient[attr+'All']+'('+items[attr]+')',
      font: Defaults.fontSize+'px '+Defaults.Font,
      normalColor:Defaults.lineColor,
      translate: [offsetX+60, offsetY]
    });
    i++;
  }
});

//绘制带框名字的方法
twaver.Util.registerShape('nameBox', function (g, shapeData, data, view) {
  var dataClient = data.getClient('data');
  var fontTrait = shapeData.fontTrait || '';
  var fontSize = Number(shapeData.fontSize) || 16;
  var fontType = shapeData.fontType || Defaults.Font;
  var fontColor = shapeData.fontColor || Defaults.boldTextColor ;
  //名字字符串的像素长度，需要据此调整框的长度
  var textLength = getTextLenght(dataClient.name, fontSize);
  var halfH = shapeData.halfH || 25;
  var halfW = halfH*1.2 + textLength/2;
  //绘制名字的边框
  g.drawShape({
    shape: 'rect',
    rect: [-halfW, -halfH, halfW*2, halfH*2],
    r: 10,
    line: {width: Defaults.lineWidth, color: 'blue'},      
    fill: view.isSelected(data)?'Lavender':'white'
  });
  //绘制管理域标志的圆框
  g.drawShape({
    shape: 'circle',
    cx: -halfW+halfH,
    cy: 0,
    r: halfH/2,
    line: {width: 1, color: 'green'},
  });
  //绘制管理域标志图形
  g.drawShape({
      shape: 'vector',
      name: shapeData.iconName,
      scale: halfH/100,
      translate: [-halfW+halfH, 0]
  });
  //绘制名字
  g.drawShape({
    shape: 'text',
    text: shapeData.text || dataClient.name,
    font: fontTrait + ' ' + fontSize  + 'px ' + fontType,
    fill: fontColor,
    translate: [halfH*0.8, 0]
  });
});







//绘制管理域轮廓边框的方法
twaver.Util.registerShape('domainBorder', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW;
  var halfH = shapeData.halfH;
  g.drawShape({
    shape: 'path',
    data: 'M0,'+(halfH+10)+'L20,'+halfH+'L'+halfW+','+halfH+'L'+halfW+',-'+halfH+'L-'+halfW+',-'+halfH+'L-'+halfW+','+halfH+'L-20,'+halfH+'Z',
    //边框在网元被选中的时候有加粗加深的效果
    lineWidth: view.isSelected(data)?Defaults.lineWidth*1.5:Defaults.lineWidth,
    lineColor: view.isSelected(data)?Defaults.lineRichColor:Defaults.lineColor,
    fill: view.isSelected(data)?'Lavender':'white',
    //边框根据与host的相对位置进行旋转，产生指上或指下的效果
    rotate: (data instanceof twaver.Follower)  && (data.getCenterLocation().y-data.getHost().getCenterLocation().y>0) ? 180 : 0
  });
});

//绘制管理域名称的方法
twaver.Util.registerShape('domainName', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW;
  var halfH = shapeData.halfH;
  var fontTrait = shapeData.fontTrait || '';
  var fontSize = Number(shapeData.fontSize) || 16;
  var fontType = shapeData.fontType || Defaults.Font;
  var fontColor = shapeData.fontColor || Defaults.boldTextColor;

  var dataClient = data.getClient('data');
  //在名字下面画一条直线，注意不能遮挡边框
  g.drawShape({
    shape: 'line',
    p1: {x:-halfW+(view.isSelected(data)?Defaults.lineWidth*1.5:Defaults.lineWidth)/2, y:halfH},
    p2: {x:halfW-(view.isSelected(data)?Defaults.lineWidth*1.5:Defaults.lineWidth)/2, y:halfH},
    line: {width: Defaults.lineWidth, color: Defaults.lineColor},
  });
  //绘制名字，靠左
  g.drawShape({
    shape: 'text',
    text: dataClient.name,
    font: fontTrait + ' ' + fontSize  + 'px ' + fontType,
    fill: fontColor,
    textAlign: 'left',
    translate: [-halfW+5, 0]
  });
});




//绘制机柜边框的方法
twaver.Util.registerShape('rackBorder', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW || 40;
  var halfH = shapeData.halfH || 80;
  var status = data.getClient('data')['Status'];
  //机柜在Status不同状态时的颜色
  var fColor = status=='Open'?'lightGreen':status=='Closed'?'lightPink':status=='Reserved'?'lightBlue':status=='Internal'?'#FFFF88':'';
  //机柜边框
  g.drawShape({
    shape: 'path',
    data: 'M'+halfW+','+halfH+'L'+halfW+',-'+halfH+'L-'+halfW+',-'+halfH+'L-'+halfW+','+halfH+'Z',
    lineWidth: view.isSelected(data)?Defaults.lineWidth*3:Defaults.lineWidth*2,
    lineColor: view.isSelected(data)?Defaults.lineColor:Defaults.lineTingeColor,
    //在Status状态时可以显示不同的颜色
    fill: data.s('image.state')=='Status'?fColor:view.isSelected(data)?'Lavender':'white'
  });
  //机柜上部的名字
  g.drawShape({
    shape: 'text',
    text: data.getClient('data')['name'],
    font: Defaults.fontSize+'px '+Defaults.Font,
    fill: Defaults.textColor,
    translate: [0, halfH/5-halfH]
  });
});

//绘制机柜status为‘Reserved’时各雇主的名字
twaver.Util.registerShape('rarckStatus', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW || 40;
  var halfH = shapeData.halfH || 80;

  var clients = data.getClient('data')['Clients'];
  if(data.getClient('data')['Status']=='Reserved' && clients){
    for (var i = 0; i < clients.length; i++) {
      g.drawShape({
        shape: 'text',
        text: clients[i],
        font: Defaults.fontSize+'px '+Defaults.Font,
        fill: Defaults.textColor,
        //根据雇主的数量自动调整垂直布局
        translate: [0, -halfH/3+halfH*4/(clients.length+1)/3*i]
      });
    }
  }
});


//绘制机柜水平直方图
twaver.Util.registerShape('barchartH', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW || 40;
  var halfH = shapeData.halfH || 80;
  var dataClient = data.getClient('data');
  var items = data.getStyle('image.state')?shapeData.items[data.getStyle('image.state')]:shapeData.items;
  //先获取项目总数
  var itemsLenght=0;
  for (var attr in items){
    itemsLenght++;
  }
  //循环绘制各项目
  var i = 0;
  for (var attr in items){
    var offsetX = 6;
    var offsetY = 0.9*halfH*(2*i+2-itemsLenght)/(itemsLenght+1);
    //绘制比例条
    g.drawShape({
      shape: 'scaleBar',
      proportion: dataClient[attr]/dataClient[attr+'All'],
      customColor:dataClient[attr+'Color'],
      scale: [0.5, 1],
      // rotate: -90,
      lineWidth: 0,
      translate: [offsetX, offsetY]
    });
    //绘制比例条前的项目名简称
    g.drawShape({
      shape: 'text',
      text: items[attr],
      font: Defaults.fontSize+'px '+Defaults.Font,
      fill: Defaults.textColor,
      translate: [-halfW+8, offsetY]
    });
    i++;
  }
});


//绘制机柜垂直直方图
twaver.Util.registerShape('barchartV', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW || 40;
  var halfH = shapeData.halfH || 80;
  var dataClient = data.getClient('data');
  var attr = [], value = [], items;
  //获取项目组数据
  items = data.getStyle('image.state')?shapeData.items[data.getStyle('image.state')]:shapeData.items;
  //转换为项目属性数组和项目属性值数组
  for (var a in items){
    if(dataClient[a]){
      attr[attr.length] = a;
      value[value.length] = items[a];
    }
  }
  //循环绘制各项目直方图
  for (var i = 0; i < attr.length; i++) { 
    var offsetX = halfW*2*(1+i)/(attr.length+1)-halfW;
    var offsetY = halfH/10;
    //绘制比例条
    g.drawShape({
      shape: 'scaleBar',
      proportion: dataClient[attr[i]]/dataClient[attr[i]+'All'],
      customColor:dataClient[attr[i]+'Color'],
      scale: [halfH*1.1/100, 7/(attr.length+4)],
      rotate: -90,
      lineWidth: 0,
      translate: [offsetX, offsetY]
    });
    //绘制比例条下方的项目名简称
    g.drawShape({
      shape: 'text',
      text: value[i],
      font: Defaults.fontSize+'px '+Defaults.Font,
      fill: Defaults.textColor,
      translate: [offsetX, halfH*0.75]
    });
  }
});

//绘制比例条的方法
twaver.Util.registerShape('scaleBar', function (g, shapeData, data, view) {
  var propor = shapeData.proportion;
  //如果没有给定比例条使用部分颜色，可以根据比例大小自动变换颜色
  var color = shapeData.customColor || (propor>0.9?'red':propor>0.7?'orange':propor>0.5?'yellow':'green');
  //绘制比例条的当前值部分
  g.drawShape({
    shape: 'rect',
    rect: [100*propor-50, -5, 100*(1-propor), 10],
    fill: view.isSelected(data)?'DarkGray':'LightGray'
  });
  //绘制比例条其余部分
  g.drawShape({
    shape: 'rect',
    rect: [-50, -5, 100*propor, 10],
    fill: color
  });
});


//绘制比例条前后文字的方法
twaver.Util.registerShape('diagramText', function (g, shapeData, data, view) {
  //绘制高亮文字
  g.drawShape({
    shape: 'text',
    text: shapeData.highlightText || '',
    fill: shapeData.highlightColor,
    font: shapeData.highlightFont,
    textAlign: 'left',
  });
  //绘制普通文字
  g.drawShape({
    shape: 'text',
    text: shapeData.normalText,
    fill: shapeData.normalColor,
    font: shapeData.normalFont,
    fill: Defaults.textColor,
    textAlign: shapeData.highlightText ? 'left' : 'right',
    //如果有高亮文字则靠右放在高亮文字后；没有高亮文字说明是属性名则靠左
    translate: [shapeData.highlightText ? getTextLenght(shapeData.highlightText, Defaults.lightFontSize)+2 : 0, 0]
   });
});



/*
 * 示意图形
 */

//空白U位示意图
twaver.Util.registerImage('spaceU', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
      shape: 'rect',
      rect: [-this.w/2, -this.h/2, this.w, this.h],
      lineWidth: view.isSelected(data) ? Defaults.lineWidth : Defaults.lineWidth/2,
      lineColor: view.isSelected(data) ? 'gray' : '#cccccc',
      fill: view.isSelected(data) ? 'Lavender' : '#eeeeee',
      alpha: 0.8
    },{
      shape: 'text',
      text: data.getClient('mark'),
      font: view.isSelected(data) ? '24px '+Defaults.Font : Defaults.fontSize+Defaults.Font,
      fill: view.isSelected(data) ? 'yellow' : 'white'
    }];
  }
});

//移动示意图 待转移（目标位置）
twaver.Util.registerImage('movetoRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#409320',
    fill: '#5eae3f',
    alpha: 0.8
  },{
      shape: 'arrow',
      segment: this.h/20,
      translate: [this.w/2-this.h/1.5, 0],
      rotate: 90
    }];
  }
});
//移动示意图 待转移（源位置）
twaver.Util.registerImage('moveoffRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#1c4f9d',
    fill: '#4482e0',
    alpha: 0.8
  },{
      shape: 'arrow',
      segment: this.h/20,
      translate: [this.w/2-this.h/1.5, 0],
      rotate: -90
    }];
  }
});

//下架示意图 待删除
twaver.Util.registerImage('removeRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#178517',
    fill: '#339933',
    alpha: 0.8
  },{
      shape: 'cross',
      segment: this.h/20,
      iconColor: 'red',
      translate: [this.w/2-this.h/1.5, 0],
      rotate: 45
    }];
  }
});


//上架示意图 待增加
twaver.Util.registerImage('addRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#409320',
    fill: '#5eae2f',
    alpha: 0.8
  },{
      shape: 'cross',
      segment: this.h/20,
      translate: [this.w/2-this.h/1.5, 0]
    }];
  }
});

//最佳机位示意图
twaver.Util.registerImage('bestbitRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#178517',
    fill: '#339933',
    alpha: 0.8
  }];
  }
});


//已安装机位示意图
twaver.Util.registerImage('installedRender', {
  w: Util.rackWidth,
  h: Util.rackUnitHeight,
  v: function (data, view) {
    return [{
    shape: 'rect',
    rect: [-this.w/2, -this.h/2, this.w, this.h],
    lineWidth: 1,
    lineColor: '#333333',
    fill: '#666666',
    alpha: 0.8
  },{
    shape: 'text',
    text: data.getClient('data')['name'],
    font: Defaults.fontSize+'px '+Defaults.Font,
    fill: 'white'
  }];
  }
});

//机柜名称
twaver.Util.registerImage('rackName', {
  w: Util.rackWidth,
  h: Util.rackTopGap,
  v: function (data, view) {
    return [{
    shape: 'text',
    text: data.getHost().getName(),
    font: parseInt(Util.rackTopGap*3/4) + 'px '+Defaults.Font,
    fill: Defaults.textColor
  }];
  }
});

//机柜朝向
twaver.Util.registerImage('rackToward', {
  w: Util.rackWidth,
  h: Util.rackTopGap,
  v: function (data, view) {
    return [{
      shape: 'text',
      text: data.getClient('toward') || 'front',
      font: parseInt(Util.rackTopGap*3/4) + 'px '+Defaults.Font,
      fill: Defaults.textColor,
    }];
  },
  onDoubleClick: function(data, view){
    view.turnBack(data.getHost());
  }
});


//箭头
twaver.Util.registerShape('arrow', function (g, shapeData, data, view) {
  var s = shapeData.segment;
  g.drawShape({
    shape: 'circle',
    cx:0,
    cy:0,
    r:s*8,
    lineWidth:0,
    fill: shapeData.iconColor || Defaults.boldTextColor,
    // alpha: 0.8
  });
  g.drawShape({
    shape: 'path',
    data: 'M-'+5*s+',0L'+3*s+',0M'+2*s+',-'+1*s+'L'+2*s+','+1*s+'L'+3*s+',0Z',
    lineWidth:s*2,
    lineColor: 'white'
  });
});

//十字
twaver.Util.registerShape('cross', function (g, shapeData, data, view) {
  var s = shapeData.segment;
  g.drawShape({
    shape: 'circle',
    cx:0,
    cy:0,
    r:s*8,
    lineWidth:0,
    fill: shapeData.iconColor || Defaults.boldTextColor,
    // alpha: 0.8
  });
  g.drawShape({
    shape: 'path',
    data: 'M-'+5*s+',0L'+5*s+',0M0,-'+5*s+'L0,'+5*s,
    lineWidth:s*2,
    lineColor: 'white'
  });
});





/*
 * 设备图形
 */

//CRAC 空调
twaver.Util.registerImage('cracShape', {
  w: 100,
  h: 100,
  clients: {
    halfW: 100/8,
    halfH: 100/2,
    linePosit: 10,
    bkColor: 'cyan',
    textScale: [0.6, 1],
  },
  v: [{
      shape: 'equipmentUp',
      state: 'vfront'
    },{
      shape: 'equipmentDown',
      rotate: -90,
      state: 'hfront'
    },{
      shape: 'equipmentDown',
      state: 'vback'
    },{
      shape: 'equipmentDown',
      rotate: 90,
      state: 'hback'
    }
  ],
  onDoubleClick: function (data, view) {
    var rackState = data.getStyle('image.state');
    if(rackState=='vfront'){
      data.setStyle('image.state','hfront');
    } else if(rackState=='hfront'){
      data.setStyle('image.state','vback');
    } else if(rackState=='vback'){
      data.setStyle('image.state','hback');
    } else if(rackState=='hback'){
      data.setStyle('image.state','vfront');
    }
  }
});


//UPS 
twaver.Util.registerImage('upsShape', {
  w: 100,
  h: 100,
  clients: {
    halfW: 100/8,
    halfH: 100*0.3,
    linePosit: 10,
    bkColor: 'khaki',
  },
  v: [{
      shape: 'equipmentUp',
      state: 'vfront'
    },{
      shape: 'equipmentDown',
      rotate: -90,
      state: 'hfront'
    },{
      shape: 'equipmentDown',
      state: 'vback'
    },{
      shape: 'equipmentDown',
      rotate: 90,
      state: 'hback'
    }
  ],
  onDoubleClick: function (data, view) {
    var rackState = data.getStyle('image.state');
    if(rackState=='vfront'){
      data.setStyle('image.state','hfront');
    } else if(rackState=='hfront'){
      data.setStyle('image.state','vback');
    } else if(rackState=='vback'){
      data.setStyle('image.state','hback');
    } else if(rackState=='hback'){
      data.setStyle('image.state','vfront');
    }
  }
});

//HUMIDIFIER 加湿器
twaver.Util.registerImage('humidifierShape', {
  w: 100,
  h: 100,
  clients: {
    halfW: 100/2,
    halfH: 100*0.2,
    linePosit: 10,
    bkColor: 'LimeGreen',
  },
  v: [{
      shape: 'equipmentUp',
      state: 'vfront'
    },{
      shape: 'equipmentDown',
      rotate: -90,
      state: 'hfront'
    },{
      shape: 'equipmentDown',
      state: 'vback'
    },{
      shape: 'equipmentDown',
      rotate: 90,
      state: 'hback'
    }
  ],
  onDoubleClick: function (data, view) {
    var rackState = data.getStyle('image.state');
    if(rackState=='vfront'){
      data.setStyle('image.state','hfront');
    } else if(rackState=='hfront'){
      data.setStyle('image.state','vback');
    } else if(rackState=='vback'){
      data.setStyle('image.state','hback');
    } else if(rackState=='hback'){
      data.setStyle('image.state','vfront');
    }
  }
});

//ifos PDU、模块化
twaver.Util.registerImage('ifosShape', {
  w: 100,
  h: 100,
  clients: {
    halfW: 100*0.4,
    halfH: 100*0.25,
    linePosit: 10,
    bkColor: 'Silver'
  },
  v: [{
      shape: 'equipmentUp',
      state: 'vfront'
    },{
      shape: 'equipmentDown',
      rotate: -90,
      state: 'hfront'
    },{
      shape: 'equipmentDown',
      state: 'vback'
    },{
      shape: 'equipmentDown',
      rotate: 90,
      state: 'hback'
    }
  ],
  onDoubleClick: function (data, view) {
    var rackState = data.getStyle('image.state');
    if(rackState=='vfront'){
      data.setStyle('image.state','hfront');
    } else if(rackState=='hfront'){
      data.setStyle('image.state','vback');
    } else if(rackState=='vback'){
      data.setStyle('image.state','hback');
    } else if(rackState=='hback'){
      data.setStyle('image.state','vfront');
    }
  }
});


//CAMERA 摄像机
twaver.Util.registerImage('cameraShape', {
  w: 20,
  h: 20,
  v: function (data, view) {
    return [{
      shape: 'beads',
      beadsR: this.h*9/20
    },{
      shape: 'circle',
      cx: 0,
      cy: 0,
      r: this.h/2,
      lineWidth: 1,
      lineColor: Defaults.lineColor,
    },{
      shape: 'bead',
      beadR: this.h/4,
      lineWidth: 0,
      fColor: [Defaults.lineRichColor,'white']
    }];
  }
});

//  画设备  朝上
twaver.Util.registerShape('equipmentUp', function (g, shapeData, data, view) {
  var clients = twaver.Util.getImageAsset(data.getImage()).getImage().clients;
  var halfW = clients.halfW || 40;
  var halfH = clients.halfH || 80;
  var linePosit = clients.linePosit || 10;
  var bkColor = clients.bkColor || 'cyan';
  var textScale = clients.textScale || [1, 1];
  g.drawShape({
    shape: 'equipmentBorder',
    halfW: halfW,
    halfH: halfH,
    linePosit: linePosit,
    fill: bkColor,
  });
  g.drawShape({
    shape: 'equipmentText',
    scale: textScale,
    translate: [0, halfH - linePosit*2]
  });
});

//  画设备  朝下
twaver.Util.registerShape('equipmentDown', function (g, shapeData, data, view) {
  var clients = twaver.Util.getImageAsset(data.getImage()).getImage().clients;
  var halfW = clients.halfW || 40;
  var halfH = clients.halfH || 80;
  var linePosit = clients.linePosit || 10;
  var bkColor = clients.bkColor || 'cyan';
  var textScale = clients.textScale || [1, 1];
  g.drawShape({
    shape: 'equipmentBorder',
    halfW: halfW,
    halfH: halfH,
    linePosit: linePosit,
    fill: bkColor,
    rotate: 180
  });
  g.drawShape({
    shape: 'equipmentText',
    scale: textScale,
    translate: [0, -halfH + linePosit*2]
  });
});

//设备轮廓
twaver.Util.registerShape('equipmentBorder', function (g, shapeData, data, view) {
  var halfW = shapeData.halfW || 40;
  var halfH = shapeData.halfH || 80;
  var linePosit = shapeData.linePosit || 8;
  g.drawShape({
    shape: 'path',
    data: 'M'+halfW+','+halfH+'L'+halfW+',-'+halfH+'L-'+halfW+',-'+halfH+'L-'+halfW+','+halfH+'Z',
    lineWidth: view.isSelected(data)?Defaults.lineWidth*3:Defaults.lineWidth*2,
    lineColor: view.isSelected(data)?Defaults.lineRichColor:Defaults.lineColor,
    fill: shapeData.bkColor
  });
  g.drawShape({
    shape: 'path',
    data: 'M'+(-halfW+Defaults.lineWidth*2)+','+(halfH-linePosit)+'L'+(halfW-Defaults.lineWidth*2)+','+(halfH-linePosit),
    lineWidth: Defaults.lineWidth*2,
    lineColor: Defaults.boldTextColor
  });
});
//设备名称
twaver.Util.registerShape('equipmentText', function (g, shapeData, data, view) {
  g.drawShape({
    shape: 'text',
    text: data.getClient('data').motype.substring(data.getClient('data').motype.indexOf('{')+1, data.getClient('data').motype.indexOf('}')),
    font: 'bolder '+Defaults.fontSize+'px '+Defaults.Font,
    fill: Defaults.boldTextColor
  });
});


//环形珠串
twaver.Util.registerShape('beads', function (g, shapeData, data, view) {
  var r = shapeData.beadsR || 20;
  // var status = data.getClient('data')['Status'];
  // var fColor = status=='Open'?'lightGreen':status=='Closed'?'lightPink':status=='Reserved'?'lightBlue':status=='Internal'?'#FFFF88':'';
  for (var i = 0; i < 12; i++) {
    g.drawShape({
      shape: 'bead',
      beadR: r/6,
      lineWidth: 0,
      fColor: ['gray','white'],
      offset: r*5/6,
      rotate: i*30
    });
  }
});

//珠子
twaver.Util.registerShape('bead', function (g, shapeData, data, view) {
  g.drawShape({
    shape: 'circle',
    cx: 0,
    cy: 0,
    r: shapeData.beadR,
    lineWidth: 0,
    fill: shapeData.fColor[0],
    gradient:'radial.center',
    gradientColor:shapeData.fColor[1],
    translate: [shapeData.offset, 0]
  });
});








/*
 * 其他图形
 */


twaver.Util.registerImage('gridding', {
  w: 1080,
  h: 720,
  v: [{
    shape: 'gline',
    width: 900,
    height: 720,
    interval: 10
  }]
});

//画线
twaver.Util.registerShape('gline', function (g, shapeData, data, view) {
  var width = shapeData.width;
  var height = shapeData.height;
  var interval = shapeData.interval;
  for (var i = 0; i < width/interval; i++) {
    g.drawShape({
      shape: 'line',
      x1: -width/2 + interval*i,
      y1: -height/2,
      x2: -width/2 + interval*i,
      y2: height/2,
      lineWidth: i%3==0?1:0.5,
      lineColor: Defaults.lineTingeColor,
    });
  }
  for (var i = 0; i < height/interval+1; i++) {
    g.drawShape({
      shape: 'line',
      x1: -width/2,
      y1: -height/2 + interval*i,
      x2: width/2,
      y2: -height/2 + interval*i,
      lineWidth: i%3==0?1:0.5,
      lineColor: Defaults.lineTingeColor,
    });
  }
});

//close icon
twaver.Util.registerImage('closeIcon', {
  w: 20,
  h: 20,
  v: [{
    shape: 'path',
    data: 'M-10,-10L10,10M-10,10L10,-10',
    lineWidth: 2,
    fill: Defaults.lineTingeColor
  }]
});



twaver.Util.registerImage('floorIcon', {
  w: 76,
  h: 76,
  lineWidth: 2,
  lineColor: 'green',
  v: [{
    shape: 'path',
    data: 'M0,-36L-36,-10L0,16L36,-10Z',
    lineWidth: 0,
    fill: 'green'
  },{
    shape: 'path',
    data: 'M-36,0L0,26L36,0'+'M-36,10L0,36L36,10',
  }]
});




twaver.Util.registerImage('buildingIcon', {
  w: 76,
  h: 76,
  lineWidth: 5,
  lineColor: 'green',
  v: [{
    shape: 'path',
    data: 'M-24,-36L24,-36M-36,36L36,36',
    lineWidth: 6
  },{
    shape: 'path',
    data: 'M0,-25L0,-15M-20,-25L-20,-15,M20,-25L20,-15M-10,-25L-10,-15,M10,-25L10,-15',
  },{
    shape: 'path',
    data: 'M0,-5L0,5M-20,-5L-20,5,M20,-5L20,5M-10,-5L-10,5,M10,-5L10,5',
  },{
    shape: 'path',
    data: 'M0,28L0,15M-25,28L-25,15,M25,28L25,15',
    lineWidth: 12
  },{
    shape: 'path',
    data: 'M-30,28L-30,-25L30,-25L30,28'+'M-30,-15L30,-15'+'M-30,-5L30,-5'+'M-30,5L30,5'+'M-30,15L30,15',
  }]
});












function getTextLenght(text, fontSize){
  var letterLength = text.replace(/[^\x00-\xff]/g,"ay").length;
  return letterLength*fontSize/2;
}





//