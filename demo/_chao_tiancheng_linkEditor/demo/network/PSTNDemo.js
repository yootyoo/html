PSTNDemo = function () {
    this.box = new ElementBox();
    this.network = demo.Util.createDraggableNetwork(this.box);
  
  /*ming add*/
  this.sheet = new PropertySheet(this.box);
    this.sheetBox = this.sheet.getPropertyBox();
    this.visibleFunc = function (data, sheet) { return data instanceof twaver.Grid; };
  this.popupMenu = new twaver.controls.PopupMenu(this.network);
  
  this.imageNodesDiv = document.createElement('div');
    this.shapeNodesDiv = document.createElement('div');
  this.linksDiv = document.createElement('div');
    this.accordion = new Accordion();
};
twaver.Util.ext('PSTNDemo', Object, {
    init: function () {
    
        this.registImages();
    var toolbar = demo.Util.createNetworkToolbar(this.network);
    var centerPane = new BorderPane(this.network, toolbar);
        centerPane.setTopHeight(25);
    
    var mainSplit = new SplitPane(this.accordion, centerPane, 'horizontal', 0.2);
        demo.Util.appendChild(this.sheet.getView(), centerPane.getView(), 25, 17, null, null);
        demo.Util.appendChild(mainSplit.getView(), document.getElementById('main'), 0, 0, 0, 0);
    
    var self = this;
    /*if (!twaver.Util.isOpera) {
            demo.Util.addDraggableButton(toolbar, 'Rack', 'rack_icon', 'demo.Rack');
            demo.Util.addDraggableButton(toolbar, 'Shelf', 'shelf_icon', 'demo.Shelf');
            demo.Util.addDraggableButton(toolbar, 'Slot', 'slot_icon', 'demo.Slot');
            demo.Util.addDraggableButton(toolbar, 'Card', 'card_icon', 'demo.Card');
            demo.Util.addDraggableButton(toolbar, 'Port', 'port_icon', 'demo.Port');
            demo.Util.addDraggableButton(toolbar, 'LED', 'led_icon', 'demo.LED');
            demo.Util.addDraggableButton(toolbar, 'Text', 'text_icon', 'demo.Text');
      
        } else {
            demo.Util.addButton(toolbar, 'Rack', 'rack_icon', function () { self.network.setCreateElementInteractions(demo.Rack); });
            demo.Util.addButton(toolbar, 'Shelf', 'shelf_icon', function () { self.network.setCreateElementInteractions(demo.Shelf); });
            demo.Util.addButton(toolbar, 'Slot', 'slot_icon', function () { self.network.setCreateElementInteractions(demo.Slot); });
            demo.Util.addButton(toolbar, 'Card', 'card_icon', function () { self.network.setCreateElementInteractions(demo.Card); });
            demo.Util.addButton(toolbar, 'Port', 'port_icon', function () { self.network.setCreateElementInteractions(demo.Port); });
            demo.Util.addButton(toolbar, 'LED', 'led_icon', function () { self.network.setCreateElementInteractions(demo.LED); });
            demo.Util.addButton(toolbar, 'Text', 'text_icon', function () { self.network.setCreateElementInteractions(demo.Text); });
      
        }*/
    
    this.sheet.getView().style.width = '300px';
        this.sheet.getView().style.height = '100%';
    //this.sheet.getView().style.background = 'rgba(255,255,255,0.8)';
     demo.Util.appendChild(this.sheet.getView(), centerPane.getView(), 25, 17, null, null);
     
     this.sheet.setEditable(true);
        this.initSheet();
    
        this.initAccordion();
    
        var main = document.getElementById('main');
        var toolbar = demo.Util.createNetworkToolbar(this.network);
        //var centerPane = new BorderPane(this.network, toolbar);
        this.network.setLinkFlowEnabled(true);
        //centerPane.setTopHeight(25);
        demo.Util.appendChild(centerPane.getView(), main, 0, 0, 0, 0);
twaver.Styles.setStyle('link.color', '#C0C0C0');
                twaver.Styles.setStyle('link.width', 2);
        this.initBox();
        this.network.getElementBox().forEach(function (element) {
            /*if (element instanceof twaver.Link) {
                if(!element.getStyle('link.flow'))
                    
            }*/
        });
        window.onresize = function (e) { centerPane.invalidate(); };
    
    /*ming add*/
    this.initPopupMenu();
    },
    registImages: function () {
        this.registerImage("../images/pstn/antenna.png");
        this.registerImage("../images/pstn/cartridge_system.png");
        this.registerImage("../images/pstn/cloud.png");
        this.registerImage("../images/pstn/mainframe.png");
        this.registerImage("../images/pstn/modem.png");
        this.registerImage("../images/pstn/msc.png");
        this.registerImage("../images/pstn/phone.png");
        this.registerImage("../images/pstn/router.png");
        this.registerImage("../images/pstn/router2.png");
        this.registerImage("../images/pstn/satellite_antenna.png");
        this.registerImage("../images/pstn/terminal.png");
        this.registerImage("../images/pstn/testing.png");
        this.registerImage("../images/pstn/tw130.png");
        this.registerImage("../images/pstn/wdm.png");

        this.registerImage("../images/attachment/att1.png");
        this.registerImage("../images/attachment/att2.png");
        this.registerImage("../images/attachment/att3.png");
    
    
    /*pml add*/
    this.registerImage("../images/toolbar/contor_icon.png");
        this.registerImage("../images/toolbar/pc_icon.png");
        this.registerImage("../images/toolbar/chassis_icon.png");
    this.registerImage("../images/toolbar/bus_icon.png");
    this.registerImage("../images/toolbar/switch_icon.png");
    this.registerImage("../images/toolbar/controller_icon.png");
    this.registerImage("../images/toolbar/system_icon.png");
    this.registerImage("../images/toolbar/bus_icon2.png");
    
    },
  addNodeButton: function (src) {
        var imageName = demo.Util.getImageName(src);
        var button = document.createElement('input');
        button.setAttribute('type', 'image');
        button.setAttribute('title', imageName);
        button.style.padding = '5px 5px 5px 5px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.setAttribute('src', src);
        var self = this;
        button.addEventListener('click', function () {
            self.network.setCreateElementInteractions(function (point) {
                var element = new Node();
                element.setImage(imageName);
                element.setCenterLocation(point);
                return element;
            });
        }, false);
        this.imageNodesDiv.appendChild(button);
        return button;
  
        // var image = new Image();
        // image.setAttribute('title', name);
        // image.setAttribute('draggable', 'true');
        // image.style.cursor = 'move';
        // image.style.verticalAlign = 'top';
        // image.style.padding = '4px 4px 4px 4px';
        // if (src.indexOf('/') < 0) {
        //     src = src;
        // }
        // image.setAttribute('src', src);
        // image.addEventListener('dragstart', function (e) {
        //     e.dataTransfer.effectAllowed = 'copy';
        //     e.dataTransfer.setData('Text', 'className:' + className);
        // }, false);
        // this.imageNodesDiv.appendChild(image);
        // return image;
    },
    addShapeNodeButton: function (shape) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('title', shape);
        canvas.style.cursor = 'pointer';
        var rect = { x: 0, y: 0, width: 50, height: 50 };
        var g = twaver.Util.setCanvas(canvas, rect);
        g.strokeStyle = twaver.Styles.getStyle('vector.outline.color');
        g.lineWidth = 1;
        g.fillStyle = twaver.Styles.getStyle('vector.fill.color');
        g.beginPath();
        twaver.Util.grow(rect, -5, -5);
        twaver.Util.drawVector(g, shape, null, rect);
        g.fill();
        g.stroke();
        var self = this;
        canvas.addEventListener('click', function () {
            self.network.setCreateElementInteractions(function (point) {
                var node = new Node();
                node.setStyle('body.type', 'vector');
                node.setStyle('vector.shape', shape);
                node.setCenterLocation(point);
                return node;
            });
        }, false);
        this.shapeNodesDiv.appendChild(canvas);
        return canvas;
    },
  addLinkButton: function (src) {
        var imageName = demo.Util.getImageName(src);
        var button = document.createElement('input');
        button.setAttribute('type', 'image');
        button.setAttribute('title', imageName);
        button.style.padding = '5px 5px 5px 5px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.setAttribute('src', src);
        var self = this;
        button.addEventListener('click', function () {
            self.network.setCreateLinkInteractions(function (fromNode, toNode) {
                var imageAsset = _twaver.images;
                if (twaver.Util.isTouchable) {
                    self.network.setTouchInteractions();
                } else {
                    self.network.setDefaultInteractions();
                }
                if(fromNode !== toNode){
                    var link = new twaver.Link();
                    link.setStyle('link.type', imageName);
                    link.setFromNode(fromNode);
                    link.setToNode(toNode);
                    return link;
                }else{
                    return null;
                }
            });
        }, false);
        this.linksDiv.appendChild(button);
        return button;
    },
  initAccordion: function () {
        this.accordion.add('Image Nodes', this.imageNodesDiv);
        this.accordion.add('Shape Nodes', this.shapeNodesDiv);
        this.accordion.add('Links', this.linksDiv);
        var imageAsset = _twaver.images;

        // this.addNodeButton('../images/toolbar/contor_icon.png');
        // this.addNodeButton('../images/toolbar/pc_icon.png');
        // this.addNodeButton('../images/toolbar/chassis_icon.png');
        // this.addNodeButton('../images/toolbar/bus_icon.png');
        // this.addNodeButton('../images/toolbar/switch_icon.png');
        // this.addNodeButton('../images/toolbar/controller_icon.png');
        // this.addNodeButton('../images/toolbar/system_icon.png');
        // this.addNodeButton('../images/toolbar/bus_icon2.png');
    
    demo.Util.addDraggableButton(this.imageNodesDiv, '控制中心', 'contor_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '管理机', 'pc_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '客户端', 'chassis_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '监控引擎', 'bus_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '工业交换机', 'switch_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '监控引擎', 'controller_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '仿真系统', 'system_icon', 'twaver.Node');
    demo.Util.addDraggableButton(this.imageNodesDiv, '仪表总线', 'bus_icon2', 'twaver.Node');
    
    
    /*形状节点列表*/
        this.addShapeNodeButton('circle');
        this.addShapeNodeButton('diamond');
        this.addShapeNodeButton('hexagon');
        this.addShapeNodeButton('oval');
        this.addShapeNodeButton('pentagon');
        this.addShapeNodeButton('rectangle');
        this.addShapeNodeButton('roundrect');
        this.addShapeNodeButton('star');
        this.addShapeNodeButton('triangle');

        this.addLinkButton('../images/link/flexional.png');
        this.addLinkButton('../images/link/orthogonal.png');
        this.addLinkButton('../images/link/extend.top.png');
        this.addLinkButton('../images/link/extend.left.png');
        this.addLinkButton('../images/link/extend.bottom.png');
        this.addLinkButton('../images/link/extend.right.png');
    
    demo.Util.addDraggableButton(this.shapeNodesDiv, 'Text', 'text_icon', 'demo.Text')
    },
  initSheet: function () {
        /*this.addGridProperty('grid.row.count');
        this.addGridProperty('grid.column.count');
        this.addGridProperty('grid.row.percents');
        this.addGridProperty('grid.column.percents');
        this.addGridProperty('grid.border');
        this.addGridProperty('grid.padding');
        this.addGridProperty('grid.deep');
     
        this.addGridProperty('grid.cell.deep');
        this.addGridProperty('grid.fill');
        this.addGridProperty('grid.fill.color');
        this.addCellProperty('follower.row.index');
        this.addCellProperty('follower.column.index');
        this.addCellProperty('follower.row.span');
        this.addCellProperty('follower.column.span');
        this.addCellProperty('follower.padding');*/
    this.sheet.setVisibleFunction(function (property) {
            var propertyTpe = property.getPropertyType();
            if (propertyTpe === 'style') {
                var propertyName = property.getPropertyName();
                if (propertyName.indexOf('label') == 0) {
                    return true;
                } else {
                    return this.getDataBox().getSelectionModel().getLastData() instanceof Link;
                };
            } else {
                return true;
            }
        });
        var propertyBox = this.sheet.getPropertyBox();
        var catagory = 'Basic';
        demo.Util.addAccessorProperty(propertyBox, 'name', catagory);
        demo.Util.addStyleProperty(propertyBox, 'label.color', catagory);
        demo.Util.addStyleProperty(propertyBox, 'label.position', catagory).setEnumInfo(demo.POSITION_TYPE);
        demo.Util.addStyleProperty(propertyBox, 'label.xoffset', catagory);
        demo.Util.addStyleProperty(propertyBox, 'label.yoffset', catagory);
    
    catagory = 'Link';
        demo.Util.addStyleProperty(propertyBox, 'link.type', catagory).setEnumInfo(demo.LINK_TYPE);
        demo.Util.addStyleProperty(propertyBox, 'link.color', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.width', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.split.by.percent', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.split.percent', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.split.value', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.extend', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.from.at.edge', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.from.xoffset', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.from.yoffset', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.to.at.edge', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.to.xoffset', catagory);
        demo.Util.addStyleProperty(propertyBox, 'link.to.yoffset', catagory);
    },
  addGridProperty: function (propertyName) {
        var property = demo.Util.addStyleProperty(this.sheetBox, propertyName, 'Grid Properties');
        property.isVisible = this.visibleFunc;
        return property;
    },
    addCellProperty: function (propertyName) {
        var property = demo.Util.addStyleProperty(this.sheetBox, propertyName, 'Cell Properties');
        return property;
    },
    registerImage: function (url) {
        demo.Util.registerImage(url, this.network);
    },
  initPopupMenu: function () {
        var lastData, lastPoint, magnifyInteraction;
        this.popupMenu.onMenuShowing = function (e) {
            lastData = self.network.getSelectionModel().getLastData();
            lastPoint = self.network.getLogicalPoint(e);
            magnifyInteraction = null;
            self.network.getInteractions().forEach(function (interaction) {
                if (interaction instanceof twaver.network.interaction.MagnifyInteraction
                        || interaction instanceof twaver.canvas.interaction.MagnifyInteraction) {
                    magnifyInteraction = interaction;
                }
            });
            return true;
        };
        var self = this;
        this.popupMenu.onAction = function (menuItem) {
            if (menuItem.label === 'Expand Group'
          || menuItem.label === 'Collapse Group') {
                lastData.reverseExpanded();
            }
            if (menuItem.label === 'Enter SubNetwork') {
                self.network.setCurrentSubNetwork(lastData);
            }
            if (menuItem.label === 'Up SubNetwork') {
                self.network.upSubNetwork();
            }
            if (menuItem.label === 'Expand LinkBundle'
          || menuItem.label === 'Collapse LinkBundle') {
                lastData.reverseBundleExpanded();
            }
            if (menuItem.label === 'Critical') {
                lastData.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.CRITICAL, 1);
            }
            if (menuItem.label === 'Major') {
                lastData.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.MAJOR, 1);
            }
            if (menuItem.label === 'Minor') {
                lastData.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.MINOR, 1);
            }
            if (menuItem.label === 'Warning') {
                lastData.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.WARNING, 1);
            }
            if (menuItem.label === 'Indeterminate') {
                lastData.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.INDETERMINATE, 1);
            }
            if (menuItem.label === 'Clear Alarm') {
                lastData.getAlarmState().clear();
            }
            if (menuItem.label === 'Remove') {
                self.box.remove(lastData);
            }
            if (menuItem.label === 'Add Node') {
                var node = new twaver.Node();
                node.setParent(self.network.getCurrentSubNetwork());
                node.setCenterLocation(lastPoint);
                self.box.add(node);
            }
        };
        this.popupMenu.isVisible = function (menuItem) {
            if (magnifyInteraction) {
                return menuItem.group === 'Magnify';
            } else {
                if (lastData) {
                    if (lastData instanceof twaver.SubNetwork && menuItem.group === 'SubNetwork') {
                        return true;
                    }
                    if (lastData instanceof twaver.Group && menuItem.group === 'Group') {
                        return true;
                    }
                    if (lastData instanceof twaver.Link && menuItem.group === 'Link') {
                        return true;
                    }
                    return menuItem.group === 'Element';
                } else {
                    return menuItem.group === 'none';
                }
            }
        };
        this.popupMenu.isEnabled = function (menuItem) {
            if (lastData) {
                if (lastData instanceof twaver.SubNetwork) {
                    return true;
                }
                if (lastData instanceof twaver.Group && menuItem.group === 'Group') {
                    var expanded = lastData.isExpanded();
                    return menuItem.expand ? !expanded : expanded;
                }
                if (lastData instanceof twaver.Link && menuItem.group === 'Link') {
                    var expanded = lastData.getStyle("link.bundle.expanded");
                    return menuItem.expand ? !expanded : expanded;
                }
                if (menuItem.label === 'Clear Alarm') {
                    return !lastData.getAlarmState().isEmpty();
                }
            } else {
                if (menuItem.label === 'Up SubNetwork') {
                    return self.network.getCurrentSubNetwork() != null;
                }
            }
            return true;
        };
        this.popupMenu.setMenuItems([
      { label: 'Remove', group: 'Element' },
      { label: 'Add Alarm', group: 'Element', 
                     items:[{label:'Critical', group:'Element'},
                            {label:'Major', group:'Element'},
                            {label:'Minor', group:'Element'},
                            {label:'Warning', group:'Element'},
                            {label:'Indeterminate', group:'Element'}] },
      { label: 'Clear Alarm', group: 'Element' },
      { separator: true, group: 'Element' },
      { label: 'Expand LinkBundle', group: 'Link', expand: true },
      { label: 'Collapse LinkBundle', group: 'Link' },
      { separator: true, group: 'Link' },
      { label: 'Expand Group', group: 'Group', expand: true },
      { label: 'Collapse Group', group: 'Group' },
      { separator: true, group: 'Group' },
      { label: 'Enter SubNetwork', group: 'SubNetwork' },

      { label: 'Add Node', group: 'none', icon: '../images/toolbar/node_icon.png' },
      { label: 'Up SubNetwork', group: 'none' },
      { label: 'Shape', group: 'Magnify', items: [
            { label: 'rectangle', type: 'radio', groupName: 'Shape', group: 'Magnify', action: function () {
                magnifyInteraction.setShape('rectangle');
                magnifyInteraction.setYRadius(magnifyInteraction.getXRadius());
            } },
            { label: 'roundrect', type: 'radio', groupName: 'Shape', group: 'Magnify', action: function () {
                magnifyInteraction.setShape('roundrect');
                magnifyInteraction.setYRadius(magnifyInteraction.getXRadius());
            } },
            { label: 'oval', type: 'radio', groupName: 'Shape', group: 'Magnify', action: function () {
                magnifyInteraction.setShape('oval');
                magnifyInteraction.setYRadius(magnifyInteraction.getXRadius() * 0.75);
            } },
            { label: 'round', type: 'radio', groupName: 'Shape', selected: true, group: 'Magnify', action: function () {
                magnifyInteraction.setShape('round');
                magnifyInteraction.setYRadius(magnifyInteraction.getXRadius());
            } },
            { label: 'star', type: 'radio', groupName: 'Shape', group: 'Magnify', action: function () {
                magnifyInteraction.setShape('star');
                magnifyInteraction.setYRadius(magnifyInteraction.getXRadius());
            } },
        ] },
      { label: 'Zoom', group: 'Magnify', items: [
            { label: 2, type: 'radio', groupName: 'Zoom', selected: true, group: 'Magnify', action: function () { magnifyInteraction.setZoom(2); } },
            { label: 3, type: 'radio', groupName: 'Zoom', group: 'Magnify', action: function () { magnifyInteraction.setZoom(3); } },
            { label: 4, type: 'radio', groupName: 'Zoom', group: 'Magnify', action: function () { magnifyInteraction.setZoom(4); } }
        ] },
      { label: 'Size', group: 'Magnify', items: [
            { label: 50, type: 'radio', groupName: 'Size', group: 'Magnify', action: function () { magnifyInteraction.setXRadius(50); magnifyInteraction.setYRadius(50); } },
            { label: 100, type: 'radio', groupName: 'Size', selected: true, group: 'Magnify', action: function () { magnifyInteraction.setXRadius(100); magnifyInteraction.setYRadius(100); } },
            { label: 200, type: 'radio', groupName: 'Size', group: 'Magnify', action: function () { magnifyInteraction.setXRadius(200); magnifyInteraction.setYRadius(200); } }
        ] },
      { label: 'BorderWidth', group: 'Magnify', items: [
            { label: '1', type: 'radio', groupName: 'BorderWidth', selected: true, group: 'Magnify', action: function () { magnifyInteraction.setBorderWidth(1); } },
            { label: '2', type: 'radio', groupName: 'BorderWidth', group: 'Magnify', action: function () { magnifyInteraction.setBorderWidth(2); } },
            { label: '3', type: 'radio', groupName: 'BorderWidth', group: 'Magnify', action: function () { magnifyInteraction.setBorderWidth(3); } }
        ] },
      { label: 'BorderColor', group: 'Magnify', items: [
            { label: 'black', type: 'radio', groupName: 'BorderColor', selected: true, group: 'Magnify', action: function () { magnifyInteraction.setBorderColor('black'); } },
            { label: 'green', type: 'radio', groupName: 'BorderColor', group: 'Magnify', action: function () { magnifyInteraction.setBorderColor('green'); } },
            { label: 'blue', type: 'radio', groupName: 'BorderColor', group: 'Magnify', action: function () { magnifyInteraction.setBorderColor('blue'); } }
        ] },
      { label: 'BackgroundColor', group: 'Magnify', items: [
            { label: 'white', type: 'radio', groupName: 'BackgroundColor', selected: true, group: 'Magnify', action: function () { magnifyInteraction.setBackgroundColor('white'); } },
            { label: 'transparent', type: 'radio', groupName: 'BackgroundColor', group: 'Magnify', action: function () { magnifyInteraction.setBackgroundColor('transparent'); } },
            { label: 'black', type: 'radio', groupName: 'BackgroundColor', group: 'Magnify', action: function () { magnifyInteraction.setBackgroundColor('black'); } }
        ] }
    ]);
    },
  createTitle: function (name, x, y) {
        var title = new twaver.Follower();
        title.setName(name);
        title.setWidth(0);
        title.setHeight(0);
        title.setStyle('label.font', 'bold 18px Arial');
        title.setStyle('label.position', 'bottomright.bottomright');
        title.setLocation(x, y);
        this.box.add(title);
        return title;
    },
    createNode: function (name, image, x, y, labelPosition) {
        var node = new Node();
        node.setName(name);
        node.setImage(image);
        node.setLocation(x, y);
        if (labelPosition) {
            node.setStyle('label.position', labelPosition);
        }
        this.box.add(node);
        return node;
    },
  createLink: function (from, to, color, linkType, name, labelPosition, lineWidth) {
        if (lineWidth == null) {
            lineWidth = 2;
        }
        var link = new Link(from, to);
        link.setStyle('link.color', color);
        link.setStyle('link.width', lineWidth);
        if (linkType == null) {
            linkType = 'orthogonal.vertical';
            link.setStyle('link.split.value', 34);
            link.setStyle('link.corner', 'none');
        }
        link.setStyle('link.type', linkType);
        if (name) {
            link.setName(name);
        }
        if (labelPosition) {
            link.setStyle('label.position', labelPosition);
        }
        this.box.add(link);
        return link;
    },
    initBox: function () {
    var contor_node = new twaver.Node({
            location: { x: 56, y: 71 },
            image: 'contor_icon',
            name: '控制中心 10.10.10.121'
        });
    contor_node.setSize(110, 22);
        this.box.add(contor_node);
  
    var pc_node = new twaver.Node({
            location: { x: 306, y: 59 },
            image: 'pc_icon',
            name: '管理机'
        });
    pc_node.setSize(66, 49);
        this.box.add(pc_node);
    
    var link = new twaver.Link(contor_node, pc_node);
        link.setStyle('link.flow', true);
        link.setStyle('link.flow.converse',true);
        link.setStyle('link.pattern', [5, 5]);
        link.setStyle('link.flow.color', '#999999');
        link.setStyle('link.color', 'white');
    link.setStyle('link.from.xoffset', 65);
    link.setStyle('link.to.xoffset', -40);
        link.setStyle('vector.outline.color', '#FFFFFF');
        this.box.add(link);
    
    var chassis_node = new twaver.Node({
            location: { x: 506, y: 59 },
            image: 'chassis_icon',
            name: '操作员站 192.168.1.72'
        });
    chassis_node.setSize(40, 48);
        this.box.add(chassis_node);
    
    var chassis_node2 = new twaver.Node({
            location: { x: 696, y: 59 },
            image: 'chassis_icon',
            name: '工程师站 192.168.1.73'
        });
    chassis_node2.setSize(40, 48);
        this.box.add(chassis_node2);
    
    var bus_node = new twaver.Node({
            location: { x: 72, y: 159 },
            image: 'bus_icon',
            name: '监控引擎 10.10.10.200'
        });
    bus_node.setSize(78, 38);
        this.box.add(bus_node);
    
    link = new twaver.Link(contor_node, bus_node);
    link.setStyle('link.color', '#3cff91');
    link.setStyle('link.from.yoffset', 30);
    link.setStyle('link.to.yoffset', -20);
    
        link.setStyle('icons.position', 'center');
    link.setStyle('arrow.from', true);
        link.setStyle('arrow.from.shape', 'arrow.slant');
    link.setStyle('arrow.from.color', '#3cff91');
    link.setStyle('arrow.to', true);
        link.setStyle('arrow.to.shape', 'arrow.slant');
    link.setStyle('arrow.to.color', '#3cff91');
        this.box.add(link);
    
    var switch_node = new twaver.Node({
            location: { x: 292, y: 169 },
            image: 'switch_icon',
            name: '工业交换机'
        });
    switch_node.setSize(100, 22);
        this.box.add(switch_node);
    
    link = new twaver.Link(switch_node, bus_node);
    link.setStyle('link.color', '#3cff91');
    link.setStyle('link.to.xoffset', 45);
    link.setStyle('link.corner', 'none');
        link.setStyle('icons.position', 'center');
    link.setStyle('arrow.to', true);
        link.setStyle('arrow.to.shape', 'arrow.slant');
    link.setStyle('arrow.to.color', '#dd0000');
    link.getAlarmState().setNewAlarmCount(twaver.AlarmSeverity.CRITICAL, 5);
    
        this.box.add(link);
    
    link = new twaver.Link(switch_node, chassis_node);
    link.setStyle('link.color', '#01bfff');
    link.setStyle('link.type', 'orthogonal.H.V');
    link.setStyle('link.corner', 'none');
    link.setName('10/100M自适应以太网');
        link.setStyle('icons.position', 'center');
    link.setStyle('link.to.yoffset', 20);
        this.box.add(link);
    
    link = new twaver.Link(switch_node, chassis_node2);
    link.setStyle('link.color', '#01bfff');
    link.setStyle('link.type', 'orthogonal.H.V');
        link.setStyle('icons.position', 'center');
    link.setStyle('link.to.yoffset', 20);
    link.setStyle('link.corner', 'none');
        this.box.add(link);
    
    var controller_node = new twaver.Node({
            location: { x: 62, y: 269 },
            image: 'controller_icon',
            name: '监控引擎 10.10.10.200'
        });
    controller_node.setSize(98, 60);
        this.box.add(controller_node);
    
    link = new twaver.Link(switch_node, controller_node);
    link.setName('物理I/O');
    
    link.setStyle('label.yoffset', 12);
    link.setStyle('label.xoffset', 70);
    link.setStyle('link.color', '#038dff');
    link.setStyle('link.type', 'orthogonal.V.H');
    link.setStyle('link.from.yoffset', 20);
    link.setStyle('link.to.yoffset', -10);
    link.setStyle('link.to.xoffset', 20);
    link.setStyle('link.corner', 'none');
        link.setStyle('icons.position', 'center');
    link.setStyle('arrow.to', true);
        link.setStyle('arrow.to.shape', 'arrow.slant');
    link.setStyle('arrow.to.color', '#333333');
        this.box.add(link);
    
    var system_node = new twaver.Node({
            location: { x: 392, y: 269 },
            image: 'system_icon',
            name: '仿真系统 10.10.10.200'
        });
    system_node.setSize(157, 80);
        this.box.add(system_node);
    
    link = new twaver.Link(system_node, controller_node);
    link.setStyle('link.color', '#000000');
    link.setStyle('link.type', 'orthogonal.V.H');
    link.setStyle('link.from.yoffset', 20);
    link.setStyle('link.to.yoffset', 10);
    link.setStyle('link.to.xoffset', 20);
    
        link.setStyle('icons.position', 'center');
    link.setStyle('arrow.to', true);
        link.setStyle('arrow.to.shape', 'arrow.slant');
    link.setStyle('arrow.to.color', '#333333');
    //link.setStyle('link.to.yoffset', '10');
        this.box.add(link);
    
    
    
    var bus_node2 = new twaver.Node({
            location: { x: 22, y: 399 },
            image: 'bus_icon2',
            name: '仪表总线'
        });
    bus_node2.setSize(69, 35);
        this.box.add(bus_node2);
    
    var bus_node3 = new twaver.Node({
            location: { x: 132, y: 399 },
            image: 'bus_icon2',
            name: '仪表总线'
        });
    bus_node3.setSize(69, 35);
        this.box.add(bus_node3);
    
    link = new twaver.Link(controller_node, bus_node2);
    link.setStyle('link.color', '#ff722c');
    link.setStyle('link.corner', 'none');
    link.setStyle('link.type', 'orthogonal.vertical');
    link.setStyle('link.from.yoffset', 20);
  
    
        link.setStyle('icons.position', 'center');
        this.box.add(link);
    
    link = new twaver.Link(controller_node, bus_node3);
    link.setStyle('link.color', '#ff722c');
    link.setStyle('link.corner', 'none');
    
    link.setStyle('link.type', 'orthogonal.vertical');
    link.setStyle('link.from.yoffset', 20);
    
        link.setStyle('icons.position', 'center');
        this.box.add(link);
        /*var tw130 = new twaver.Node({
            location: { x: 356, y: 139 },
            image: 'tw130',
            name: 'TWaver Router',
            styles: { 'label.yoffset': -75 }
        });
        this.box.add(tw130);

        var cloudData = new twaver.Node({
            location: { x: 246, y: 145 },
            image: 'cloud',
            name: 'DATA',
            styles: { 'label.yoffset': -30, 'label.color': '#000000' }
        });
        this.box.add(cloudData);

        var link = new twaver.Link(cloudData, tw130);
        this.box.add(link);

        var cloudPSTN = new twaver.Node();
        cloudPSTN.setLocation(246, 209);
        cloudPSTN.setImage("cloud");
        cloudPSTN.setName("PSTN");
        cloudPSTN.setStyle('label.yoffset', -30);
        cloudPSTN.setStyle('label.color', '#000000');
        cloudPSTN.getAlarmState().propagateSeverity = twaver.AlarmSeverity.WARNING;
        this.box.add(cloudPSTN);

        var orlink = new twaver.Link(cloudPSTN, tw130);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        var scrambler = new twaver.Node();
        scrambler.setLocation(175, 157);
        scrambler.setImage("router");
        scrambler.setName("Scrambler");
        this.box.add(scrambler);

        link = new twaver.Link(scrambler, cloudData);
        link.setStyle('link.flow', true);
        link.setStyle('link.flow.converse',true);
        link.setStyle('link.pattern', [5, 5]);
        link.setStyle('link.flow.color', 'red');
        link.setStyle('link.color', 'yellow');
        link.setStyle('vector.outline.color', '#FFFFFF');
        this.box.add(link);

        for (var i = 0; i < 7; i++) {
            node = new twaver.Node();
            if (i < 5) {
                node.setLocation(106, 95 + i * 12);
            } else {
                node.setLocation(106, 122 + i * 20);
            }
            node.setImage("router");
            this.box.add(node);
            if (i == 4) {
                node.setName("Encoder");
            }

            orlink = new twaver.Link(node, scrambler);
            orlink.setStyle('link.type', 'orthogonal.H.V');
            this.box.add(orlink);
        }
        var node = new twaver.Node();
        node.setImage("satellite_antenna");
        node.setLocation(31, 90);
        node.setName("Satellite Feed");
        this.box.add(node);

        node = new twaver.Node();
        node.setImage("antenna");
        node.setLocation(33, 183);
        node.setName("Off Air");
        this.box.add(node);

        node = new twaver.Node();
        node.setImage("msc");
        node.setLocation(33, 291);
        node.setName("Programming");
        this.box.add(node);

        var preAmp = new twaver.Node();
        preAmp.setImage("cartridge_system");
        preAmp.setLocation(191, 292);
        preAmp.setName("Pre-Amp");
        preAmp.setStyle('icons.names', ["att1", "att2", "att3"]);
        preAmp.setStyle('icons.colors', [null, "#00FF00", "#0000FF"]);
        this.box.add(preAmp);

        node = new twaver.Node();
        node.setLocation(105, 302);
        node.setImage("router");
        node.getAlarmState().setNewAlarmCount(twaver.AlarmSeverity.CRITICAL, 5);
        this.box.add(node);
        node.setName("V-OLT");

        link = new twaver.Link(node, preAmp);
        link.setStyle('icons.names', ["error"]);
    link.setStyle('link.color', 'red');
        link.setStyle('icons.position', 'center');
    
        this.box.add(link);

        var wdm = new twaver.Node();
        wdm.setName("WDM");
        wdm.setLocation(432, 146);
        wdm.setImage("wdm");
        this.box.add(wdm);

        orlink = new twaver.Link(preAmp, wdm);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        orlink.setStyle('vector.outline.color', '#FF00FF');
        this.box.add(orlink);

        link = new twaver.Link(tw130, wdm);
        this.box.add(link);

        var test = new twaver.Node();
        test.setLocation(476, 161);
        test.setImage("testing");
        test.getAlarmState().setNewAlarmCount(twaver.AlarmSeverity.MAJOR, 1);
        this.box.add(test);

        link = new twaver.Link(test, wdm);
        this.box.add(link);

        wdm = new twaver.Node();
        wdm.setName("WDM");
        wdm.setLocation(516, 146);
        wdm.setImage("wdm");
        this.box.add(wdm);

        link = new twaver.Link(test, wdm);
        this.box.add(link);

        var ont = new twaver.Node();
        ont.setName("ONT");
        ont.setLocation(555, 196);
        ont.setImage("mainframe");
        this.box.add(ont);

        orlink = new twaver.Link(ont, wdm);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        orlink.setStyle('icons.names', ["att2"]);
        this.box.add(orlink);

        var modem = new twaver.Node();
        modem.setImage("modem");
        modem.setLocation(560, 98);
        modem.setName("Modem");
        this.box.add(modem);

        var pc = new twaver.Node();
        pc.setName("PC");
    pc.getAlarmState().setNewAlarmCount(twaver.AlarmSeverity.CRITICAL, 5);
        pc.setLocation(651, 64);
        this.box.add(pc);

        orlink = new twaver.Link(pc, modem);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        var stb = new twaver.Node();
        stb.setImage("router2");
        stb.setName("STB");
        stb.setLocation(614, 122);
        this.box.add(stb);
        orlink = new twaver.Link(stb, modem);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        /*var tv = new twaver.Node();
        tv.setImage("terminal");
        tv.setName("IPTV/SDV");
        tv.setLocation(666, 152);
        this.box.add(tv);*/

        /*var l = new twaver.Link(tv, stb);
        l.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(l);

        var phone = new twaver.Node();
        phone.setImage("phone");
        phone.setLocation(648, 223);
        phone.setName("Phone");
        this.box.add(phone);

        orlink = new twaver.Link(phone, ont);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        pc = new twaver.Node();
        pc.setName("PC");
        pc.setLocation(648, 266);
        this.box.add(pc);

        orlink = new twaver.Link(pc, ont);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        stb = new twaver.Node();
        stb.setImage("router2");
        stb.setName("STB");
        stb.setLocation(609, 324);
        this.box.add(stb);

        orlink = new twaver.Link(stb, ont);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        var tv = new twaver.Node();
        tv.setImage("terminal");
        tv.setName("IPTV/SDV");
        tv.setLocation(624, 357);
        this.box.add(tv);

        l = new twaver.Link(tv, stb);
        l.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(l);*/
    }
});