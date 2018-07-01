var toolbar = document.createElement('div');
var network = new TopoNetwork();
var navigationTree = new NavigationTree();
var catalogTree = new CatalogTree();
var popupMenu;
var searchRackDiv = document.createElement('div');
var workOrderDiv = document.createElement('div');

document.oncontextmenu = function () {
  return false;
};

function init() {
  var navigationPane = new twaver.controls.BorderPane(navigationTree, document.getElementById('navigation'));
  var catalogTreePane = new twaver.controls.BorderPane(catalogTree, document.getElementById('catalog'));
  var leftSplit = new twaver.controls.SplitPane(navigationPane, catalogTreePane, 'vertical', 0.6);
  var rightSplit = new twaver.controls.BorderPane(network, toolbar);
  rightSplit.setTopHeight(28);
  var mainSplit = new twaver.controls.SplitPane(leftSplit, rightSplit, 'horizontal', 0.17);
  var view = mainSplit.getView();
  viewInit(view);

  document.getElementById('main').appendChild(view);
  window.onresize = function (e) {
    mainSplit.invalidate();
  };

  //界面调整
  getPaneStyle(navigationPane, catalogTreePane, leftSplit, mainSplit);
  getToolBar();

  txtNavigation.onkeypress = function (e) {
    if (e.charCode === 13) {
      var text = this.value.toLowerCase().trim();
      navigationTree.filterNavigation(text);
    }
  };
  txtCatalog.onkeypress = function (e) {
    if (e.charCode === 13) {
      var text = this.value.toLowerCase().trim();
      catalogTree.filterCatalog(text);
    }
  };

  //初始化数据
  navigationTree.getRootDatas();
  network.getRootDatas();
  // Test
  // setTimeout(function () {
  //   network.getRackData(['2828395011653632098123456']);
  // }, 100);
  catalogTree.getRootDatas();

  initPopupMenu(network);
  initPopupDiv();
}

function viewInit(view) {
  view.style.left = '0px';
  view.style.top = '0px';
  view.style.right = '0px';
  view.style.bottom = '0px';
}

function getPaneStyle(navigationPane, catalogTreePane, leftSplit, mainSplit) {
  //调整SplitPane透明度和拖拽交互
  if (navigationPane) {
    // navigationPane.setDividerOpacity(0);
    // navigationPane.setDividerDraggable(false);
    // navigationPane.setDividerBackground ('#FFFFFF');
  };
  // catalogTreePane.setDividerOpacity(0);
  // catalogTreePane.setDividerDraggable(false);
  // catalogTreePane.setDividerBackground ('#FFFFFF');
  // leftSplit.setDividerOpacity(0);
  // leftSplit.setDividerDraggable(false);
  // leftSplit.setDividerBackground ('#FFFFFF');
  // mainSplit.setDividerDraggable(false);
}

function getToolBar() {
  toolbar.style.backgroundColor = '#eeeeee';
  addButton(toolbar, 'search/Search Rack', function () {
    showDiv(searchRackDiv, 'center', '10px');
  }, 'u416');
  addButton(toolbar, 'save/Save', function () {}, 'u401');
  addButton(toolbar, 'workorder/Workorder', function () {},'u423');

  addButton(toolbar, ' /　　|　', function () {});

  addButton(toolbar, 'zoomIn', function () {
    network.setZoom(network.getZoom()*1.2);
  }, 'u407');
  addButton(toolbar, 'zoomOut', function () {
    network.setZoom(network.getZoom()*0.8);
  }, 'u405');
  addButton(toolbar, 'fullScreen', function () {
    network.zoomOverview();
  },'u409');
  addButton(toolbar, '', function () {},'u413');


  addButton(toolbar, 'status', function () {
    network.getElementBox().getDatas().forEach(function (ele) {
      if (ele.getImage() === 'rackChart') {
        ele.s('image.state', 'Status');
      }
    });
  }, './images/capacity__/u6366.png','right','middle');
  addButton(toolbar, 'state', function () {
    network.getElementBox().getDatas().forEach(function (ele) {
      if (ele.getImage() === 'rackChart') {
        ele.s('image.state', 'Overview');
      }
    });
  }, './images/capacity__/u6364.png','right');

  var items = ['Overview', 'Physical', 'Power', 'Cooling', 'Network'];
  var stateComBox = addComboBox(toolbar, items, function (e) {
    network.setRackState(this.value);
  },'','right');
  // stateComBox.hidden = true;

  addButton(toolbar, 'Turn Back', function () {
    network.turnBack();
  }, './images/capacity__/u10172.png');
}

//添加按钮。nameText格式为name/text，text为按钮旁边显示文字，如无则只保留name
function addButton(div, nameText, callback, src, float, align, fontSty) {
  var button = document.createElement('input');
  button.setAttribute('type', src ? 'image' : 'button');
  var name = nameText, text, textNode;
  if(name.indexOf('/')>0){
    name = nameText.split('/')[0];
    text = nameText.split('/')[1];
    textNode = document.createElement('i');
    textNode.innerText=text;
    textNode.style.font = fontSty ? fontSty[0] : '12px Microsoft YaHei';
    textNode.style.color = fontSty ? fontSty[1] : 'blue';
    textNode.style.verticalAlign = 'middle';
  }
  button.setAttribute('title', name);
  if (float) {
    button.style.float = float;
  }
  //??为什么看起来这句似乎没有作用？？
  button.style.verticalAlign = align || 'middle';
  if (src) {
    button.style.padding = '6px 6px 6px 6px';
    if (src.indexOf('/') < 0) {
      src = './images/capacity__/' + src + '.png';
    }
    button.setAttribute('src', src);
  } else {
    button.value = name;
  }
  button.addEventListener('click', callback, false);
  name!=' ' && div.appendChild(button);
  textNode && div.appendChild(textNode);
  return button;
}


//添加下拉菜单。items为下拉项数组；value为默认菜单项
function addComboBox(div, items, callback, value, float, align) {
  var comboBox = document.createElement('select');
  if (float) {
    comboBox.style.float = float;
  }
  comboBox.style.verticalAlign = align || 'middle';
  // comboBox.style.padding = '2px 2px 2px 2px';
  comboBox.style.marginTop = '5px';
  items.forEach(function (item) {
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(item));
    option.setAttribute('value', item);
    comboBox.appendChild(option);
  });
  comboBox.value = value ? value : items[0];
  if (callback) {
    comboBox.addEventListener('change', callback, false);
  }
  div.appendChild(comboBox);
  return comboBox;
};


//添加右键菜单
function initPopupMenu(theNetwork) {
  popupMenu = new twaver.controls.PopupMenu(theNetwork);
  var lastData, lastPoint;
  popupMenu.setWidth(100);
  popupMenu.onMenuShowing = function (e) {
    lastData = theNetwork.getSelectionModel().getLastData();
    lastPoint = theNetwork.getLogicalPoint(e);
    return true;
  };
  popupMenu.setMenuItems([
    { label:'切换视图', group:'none' },

    { label:'state', group:'rack' ,
      items:[
        { label:'Overview', groupName:'state', group:'rack' },
        { label:'Physical', groupName:'state', group:'rack' },
        { label:'Power', groupName:'state', group:'rack' },
        { label:'Cooling', groupName:'state', group:'rack' },
        { label:'Network', groupName:'state', group:'rack' },
        { label:'Status', groupName:'state', group:'rack' },
      ]
    },
    { label:'查看设备', group:'rack' },
    { label: '查看连线',  group: 'device'},

  ]);
  popupMenu.onAction = function (menuItem) {
    if (menuItem.label === '切换视图' && menuItem.group === 'none') {
      if(theNetwork.getZoom()==1){
        theNetwork.zoomOverview();
      }else{
        theNetwork.zoomReset();
        theNetwork.panToCenter();
      }
    }
    if (menuItem.group === 'rack') {
      if(menuItem.groupName === 'state'){
        lastData && lastData.s('image.state', menuItem.label);
    }
      if(menuItem.label === '查看设备'){
        var racks = theNetwork.getSelectionModel()._selectionMap;
        var ids = [];
        console.log('racks',racks);
        for(var id in racks) {
          ids.push(id);
        }
        theNetwork.getRackData(ids);
      }
    }
    if (menuItem.label === '查看连线') {
      network.showLinks(lastData);
    }
  };
  popupMenu.isVisible = function (menuItem) {
    if (lastData) {
      if(lastData.getImage()=='rackChart'){
        return menuItem.group === 'rack';
      }else if(lastData.getClient('rack') || lastData.getClient('device')){
        return menuItem.group === 'device';
      }


      return menuItem.group === 'element';
    }
    return menuItem.group === 'none';
  };
  popupMenu.isEnabled = function (menuItem) {
    if (lastData) {
      if(lastData.getImage()=='rackChart'){
        return lastData.s('image.state') != menuItem.label;
      }
      return true;
    }
    return true;
  };

}

function initPopupDiv(){
  //设置searchRackDiv
  var srTitle = 'Search Rack';
  var srFontSty = ['14px Microsoft YaHei', 'black'];
  var srWidth = 500;
  var srHeight = 300;
  initDiv(searchRackDiv, srTitle, srFontSty, srWidth, srHeight);
  searchRackDiv.style.display = 'none';

  //workOrderDiv
  var woTitle = 'Workorder';
  var woFontSty = ['14px Microsoft YaHei', 'black'];
  var woWidth = 260;
  var woHeight = 500;
  var woAlignArray = ['right', 'top'];
  var titleDiv = initDiv(workOrderDiv, woTitle, woFontSty, woWidth, woHeight);
  workOrderDiv.style.display = 'none';
  //为工单div添加两个工具按钮
  addButton(titleDiv, '', function () {}, 'u215', 'right');
  addButton(titleDiv, '', function () {}, 'u2170','right');

};


//设置div的相关参数，返回值为div的标题栏，以方便订制
function initDiv(div, title, fontSty, width, height){
  div.style.width = width + 'px';
  div.style.height = height + 'px';
  div.style.position = "absolute";
  div.style.backgroundColor = 'white';
  this.network.getView().appendChild(div);
  // div.style.zIndex = 100;
  // div.style.padding = "2px 2px 2px 2px";
  // div.style.border = 'solid 20px red';
  // // div.style.borderColor = 'red';
  // div.style.float = 'right';

  // div.innerHTML = "<table width='100%'>"
  // +"<tr><td align='left' valign='top'>HTML</td></tr>"
  // +"</table>";
  return createDivTitle(div, title, fontSty);

}

function createDivTitle(div, title, fontSty){
  var titleDiv = document.createElement('div');
  div.appendChild(titleDiv);
  titleDiv.style.height = '30px';
  titleDiv.style.backgroundColor = '#eeeeee';
  titleDiv.style.verticalAlign = 'center';
  var close = addButton(titleDiv, 'close', function () {
    div.style.display = 'none';
  },'u440','right','middle');
  close.style.padding = '10px 20px 10px 10px';
  var fontSty = fontSty || ['14px Microsoft YaHei', 'black'];
  addButton(titleDiv, ' /　'+title, function () {},'','','',fontSty);
  // titleDiv.style.verticalAlign = 'middle';
  return titleDiv;
}


function showDiv(div, alignH, alignV) {
  var rect = this.network.getViewRect();
  var divWstr = div.style.width;
  var divHstr = div.style.height;
  var divWidth = parseInt(divWstr.substring(0,divWstr.length-2));
  var divHeight = parseInt(divHstr.substring(0,divHstr.length-2));
  if(alignH == 'left'){
    div.style.left = '0px';
  }else if(alignH == 'center'){
    div.style.left = rect.width/2 - divWidth/2 + 'px';
  }else if(alignH == 'right'){
    div.style.right = '0px';
  }else{
    div.style.left = alignH || '0px';
  }
  if(alignV == 'top'){
    div.style.top = '0px';
  }else if(alignV == 'middle'){
    div.style.top = rect.height/2 - divHeight/2 + 'px';
  }else if(alignV == 'bottom'){
    div.style.bottom = '0px';
  }else{
    div.style.top = alignV || '0px';
  }
  div.style.display = 'block';
}


