var POSITION_TYPE = ['topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'];
var LINK_TYPE = ['arc', 'triangle', 'parallel', 'flexional', 'flexional.horizontal', 'flexional.vertical', 'orthogonal', , 'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V', 'orthogonal.V.H', 'extend.top', 'extend.left', 'extend.bottom', 'extend.right'];
LinkEditorDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.sheet = new twaver.controls.PropertySheet(this.box);
    this.imageNodesDiv = document.createElement('div');
    this.shapeNodesDiv = document.createElement('div');
    this.linksDiv = document.createElement('div');
    this.accordion = new twaver.controls.Accordion();
};
twaver.Util.ext('LinkEditorDemo', Object, {
    init: function () {
        this.registImages();
        this.sheet.getView().style.width = '250px';
        var toolbar = this.createNetworkToolbar(this.network);
        var centerPane = new twaver.controls.BorderPane(this.network, toolbar);
        centerPane.setTopHeight(25);
        var mainSplit = new twaver.controls.SplitPane(this.accordion, centerPane, 'horizontal', 0.2);
        this.appendChild(this.sheet.getView(), centerPane.getView(), 25, 17, null, null);
        this.appendChild(mainSplit.getView(), document.getElementById('main'), 0, 0, 0, 0);
        this.sheet.setEditable(true);
        this.sheet.getDataBox().getSelectionModel().addSelectionChangeListener(function (e) {
            if (this.sheet.getDataBox().getSelectionModel().getLastData() instanceof twaver.Link) {
                this.sheet.getView().style.height = '400px';
            } else {
                this.sheet.getView().style.height = '120px';
            }
        }, this);
        this.initSheet();
        this.initAccordion();
        window.onresize = function (e) { mainSplit.invalidate(); };
        this.network.setEditableFunction(function (element) {
            if (element instanceof twaver.Node) {
                return element.getWidth() > 0 && element.getHeight() > 0;
            }
            return true;
        });

        this._createElement(this.network, "twaver.Node", {x:500,y: 500}, "node_vector");
        this.initBox();
    },
    registImages: function () {
        
        this.registerTheImage("images/os/linux.png");
        this.registerTheImage("images/os/centos.png");
        this.registerTheImage("images/os/debian.png");
        this.registerTheImage("images/os/solaris.png");
        this.registerTheImage("images/link/HAProxy.png");
        this.registerTheImage("images/link/INTARWEB.png");
        this.registerTheImage("images/link/SOWEB.png");
        this.registerTheImage("images/link/VLAN.png");
        this.registerTheImage('images/os/ecs80.png');
        this.registerTheImage('images/os/cent32os_c.png');
        this.registerTheImage('images/os/cent64os_s.png');
        this.registerTheImage('images/os/ico_32bit_c.png');
        this.registerTheImage('images/os/ico_64bit_s.png');
        this.registerTheImage('images/os/ico_bandwidth_s.png');
        this.registerTheImage('images/os/ico_bdisk_s.png');
        this.registerTheImage('images/os/ico_nobit_s.png');
        this.registerTheImage('images/os/ico_nocode_s.png');
        this.registerTheImage('images/os/ico_nosys_s.png');
        this.registerTheImage('images/os/os_centos.png');
        this.registerTheImage('images/os/ico_info_s.png');
        this.registerTheImage('images/os/ico_line_s.png');
        this.registerTheImage('images/os/ico_option_s.png');
        this.registerTheImage('images/os/ico_wdisk_s.png');
        

        twaver.Util.registerImage('node_vector', {    
            w: 80,
            h: 80,
            origin: { x: 0, y: 0 },
            // lineWidth:1,
            // lineColor: '#A3F2C2', 
            v: [{
                shape: 'vector',
                name: '<%=getClient("node.image")%>',
                scale: { x: 1, y: 1 },
                x: 0,
                y: 0,
                lineWidth:0,
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon1")%>',
                scale: { x: 1, y: 1 },
                x: 15,
                y: 20,
                lineWidth:0,
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon2")%>',
                scale: { x: 1, y: 1 },
                x: 33,
                y: 20,
                lineWidth:0,
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon3")%>',
                scale: { x: 1, y: 1 },
                x: 51,
                y: 20,
                lineWidth:0,
              },{
                shape: 'text',
                text: '<%=getClient("node.text")%>',
                font: '10px "Microsoft Yahei"',
                translate: {x:40,y:44},
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon4")%>',
                scale: { x: 1, y: 1 },
                x: 16,
                y: 54,
                lineWidth:0,
              },{
                shape: 'text',
                text: '<%=getClient("node.icon4.text")%>',
                font: '10px "Microsoft Yahei"',
                fill: '#ffffff',
                translate: {x:28,y:60},
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon5")%>',
                scale: { x: 1, y: 1 },
                x: 43,
                y: 54,
                lineWidth:0,
              },{
                shape: 'text',
                text: '<%=getClient("node.icon5.text")%>',
                font: '10px "Microsoft Yahei"',
                fill: '#ffffff',
                translate: {x:53,y:60},
              }]
          });

        twaver.Util.registerImage('icon_node_vector', {    
            w: 20,
            h: 20,
            origin: { x: 0, y: 0 },
            // lineWidth:1,
            // lineColor: '#A3F2C2', 
            v: [{
                shape: 'circle',
                cx: 10,
                cy: 10,
                r: 10,
                // lineColor: '<%=twaver.Styles.getStyle("vector.outline.color")%>',
                // lineWidth: '<%=twaver.Styles.getStyle("vector.outline.width")%>',
                fill: '#999999',
              },{
                shape: 'vector',
                name: '<%=getClient("node.icon1")%>',
                scale: { x: 1, y: 1 },
                x: 2,
                y: 2,
                lineWidth:0,
              }]
          });

        
    },
    registerTheImage: function (url) {
        this.registerImage(url, this.network);
    },
    registerImage: function (url, svg) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        var that = this;
        image.onload = function () {
            twaver.Util.registerImage(that.getImageName(url), image, image.width, image.height, svg);
            image.onload = null;
            for (var i = 1; i < views.length; i++) {
                var view = views[i];
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };
    },
    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
    addNodeButton: function (src) {
        var imageName = this.getImageName(src);
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
                var element = new twaver.Node();
                element.setImage(imageName);
                element.setCenterLocation(point);
                return element;
            });
        }, false);
        this.imageNodesDiv.appendChild(button);
        return button;
    },
    addDraggableNodeButton: function (src) {
        var image = new Image();
        var imageName = this.getImageName(src);
        image.setAttribute('title', imageName);
        image.setAttribute('draggable', 'true');
        image.style.cursor = 'move';
        image.style.verticalAlign = 'top';
        image.style.padding = '5px 5px 5px 5px';
        if (src.indexOf('/') < 0) {
            src = '../images/toolbar/' + src + '.png';
        }
        image.setAttribute('src', src);
        image.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', 'className:twaver.Node');
            if(imageName === "ecs80"){
                e.dataTransfer.setData('Image', 'image:node_vector');
            }else{
                e.dataTransfer.setData('Image', 'image:' + imageName);
            }
        }, false);
        this.imageNodesDiv.appendChild(image);
        return image;
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
                var node = new twaver.Node();
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
        var imageName = this.getImageName(src);
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

        // this.addDraggableNodeButton('images/os/linux.png');
        // this.addDraggableNodeButton('images/os/centos.png');
        // this.addDraggableNodeButton('images/os/debian.png');
        // this.addDraggableNodeButton('images/os/solaris.png');
        // this.addDraggableNodeButton('images/link/HAProxy.png');
        // this.addDraggableNodeButton('images/link/INTARWEB.png');
        // this.addDraggableNodeButton('images/link/SOWEB.png');
        // this.addDraggableNodeButton('images/link/VLAN.png');
        this.addDraggableNodeButton('images/os/ecs80.png');
        this.addDraggableNodeButton('images/os/cent32os_c.png');
        this.addDraggableNodeButton('images/os/cent64os_s.png');

        this.addShapeNodeButton('circle');
        this.addShapeNodeButton('diamond');
        this.addShapeNodeButton('hexagon');
        this.addShapeNodeButton('oval');
        this.addShapeNodeButton('pentagon');
        this.addShapeNodeButton('rectangle');
        this.addShapeNodeButton('roundrect');
        this.addShapeNodeButton('star');
        this.addShapeNodeButton('triangle');

        this.addLinkButton('images/link/flexional.png');
        this.addLinkButton('images/link/orthogonal.png');
        this.addLinkButton('images/link/extend.top.png');
        this.addLinkButton('images/link/extend.left.png');
        this.addLinkButton('images/link/extend.bottom.png');
        this.addLinkButton('images/link/extend.right.png');
    },
    initSheet: function () {
        this.sheet.setVisibleFunction(function (property) {
            var propertyTpe = property.getPropertyType();
            if (propertyTpe === 'style') {
                var propertyName = property.getPropertyName();
                if (propertyName.indexOf('label') == 0) {
                    return true;
                } else {
                    return this.getDataBox().getSelectionModel().getLastData() instanceof twaver.Link;
                };
            } else {
                return true;
            }
        });
        var propertyBox = this.sheet.getPropertyBox();
        var catagory = 'Basic';
        this.addAccessorProperty(propertyBox, 'name', catagory);
        this.addStyleProperty(propertyBox, 'label.color', catagory);
        this.addStyleProperty(propertyBox, 'label.position', catagory).setEnumInfo(POSITION_TYPE);
        this.addStyleProperty(propertyBox, 'label.xoffset', catagory);
        this.addStyleProperty(propertyBox, 'label.yoffset', catagory);
        catagory = 'Link';
        this.addStyleProperty(propertyBox, 'link.type', catagory).setEnumInfo(LINK_TYPE);
        this.addStyleProperty(propertyBox, 'link.color', catagory);
        this.addStyleProperty(propertyBox, 'link.width', catagory);
        this.addStyleProperty(propertyBox, 'link.split.by.percent', catagory);
        this.addStyleProperty(propertyBox, 'link.split.percent', catagory);
        this.addStyleProperty(propertyBox, 'link.split.value', catagory);
        this.addStyleProperty(propertyBox, 'link.extend', catagory);
        this.addStyleProperty(propertyBox, 'link.from.at.edge', catagory);
        this.addStyleProperty(propertyBox, 'link.from.xoffset', catagory);
        this.addStyleProperty(propertyBox, 'link.from.yoffset', catagory);
        this.addStyleProperty(propertyBox, 'link.to.at.edge', catagory);
        this.addStyleProperty(propertyBox, 'link.to.xoffset', catagory);
        this.addStyleProperty(propertyBox, 'link.to.yoffset', catagory);
    },
    initBox: function () {
        var title = this.createTitle('Stack Overflow\nNetwork Configuration', 5, 40);
        var VLAN1 = this.createNode("VLAN1(PRIVATE) Ports 1-12", "VLAN", 300, 25, 'bottomright.topright');
        var HAProxy1 = this.createNode("HAProxy1", "HAProxy", 180, 280, 'bottomleft');
        var HAProxy2 = this.createNode("HAProxy2", "HAProxy", 400, 280, 'bottomright');
        var VLAN2 = this.createNode("VLAN2(PUBLIC) Ports 13-24", "VLAN", 300, 350, 'bottomright.topright');
        var PECK_GW = this.createNode("PECK GW", "HAProxy", 300, 480, 'right.right');
        var INTARWEBZ = this.createNode("INTARWEBZ", "INTARWEB", 50, 480);

        this.createLink(HAProxy1, HAProxy2, '#F00020', 'parallel', "Backup");
        this.createLink(HAProxy1, VLAN2, '#F00020', 'orthogonal.V.H');
        this.createLink(HAProxy2, VLAN2, '#F00020', 'orthogonal.V.H');
        this.createLink(VLAN2, PECK_GW, '#F00020', 'parallel', "Backup", 'right.right');
        this.createLink(VLAN2, PECK_GW, '#F00020', 'parallel');
        this.createLink(PECK_GW, INTARWEBZ, '#F00020', 'parallel');

        for (var i = 1; i <= 8; i++) {
            var SOWEB = this.createNode("SOWEB" + i, "SOWEB", 30 + 75 * (i - 1), 160, 'bottomleft');
            this.createLink(VLAN1, SOWEB, '#10F000');
            if (i <= 6) {
                this.createLink(SOWEB, HAProxy1, '#F00020');
                this.createLink(SOWEB, HAProxy2, '#F00020');
            } else {
                this.createLink(SOWEB, VLAN2, '#F00020', 'orthogonal.V.H');
            }
        }
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
        var node = new twaver.Node();
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
        var link = new twaver.Link(from, to);
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

    createDraggableNetwork: function (box) {
        var network = new twaver.vector.Network(box);
        var that = this;
        var vv = network.getView();
        network.getView().addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }, false);
        network.getView().addEventListener('drop', function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var text = e.dataTransfer.getData('Text');
            var image = e.dataTransfer.getData('Image');
            if (!text) {
                return false;
            }
            if (text && text.indexOf('className:') == 0) {
                if(image && image.indexOf('image:') == 0){
                    var src = image.substr(6, image.length);
                    if(src === "node_vector"){
                        that._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), src);
                    }else if(src === "cent32os_c" || src === "cent64os_s"){
                        var element = network.getElementAt(e);
                        if(element instanceof twaver.Node && element.getImage() === "node_vector"){
                            element.setClient("node.icon1","os_centos");
                            if(src === "cent32os_c"){
                                element.setClient("node.icon2","ico_32bit_c");
                            }else{
                                element.setClient("node.icon2","ico_64bit_s");
                            }
                        }
                    }
                }else{
                  that._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
                }
            }
            if (text && text.indexOf('<twaver') == 0) {
                network.getElementBox().clear();
                new twaver.XmlSerializer(network.getElementBox()).deserialize(text);
            }
            return false;
        }, false);

        box.getSelectionModel().addSelectionChangeListener(function(e) { 
            var dataList = box.getDatas();
            var selectionModel = network.getSelectionModel();
            var i,j;
            for(i=0;i<dataList.size();i++){
                var data = dataList.get(i);
                if(data instanceof twaver.Node && data.getImage() === "node_vector"){
                    var iconNodeArray;
                    if(selectionModel.contains(data)){
                        iconNodeArray = data.getClient("node.icons");
                        for(j=0;j<iconNodeArray.length;j++){
                            iconNodeArray[j].setVisible(true);
                        }
                    }else{
                        iconNodeArray = data.getClient("node.icons");
                        for(j=0;j<iconNodeArray.length;j++){
                            if(selectionModel.contains(iconNodeArray[j])){
                                break;
                            }
                        }
                        if(j === iconNodeArray.length){
                            for(j=0;j<iconNodeArray.length;j++){
                                iconNodeArray[j].setVisible(false);
                            }
                        }else{
                            selectionModel.appendSelection(data);
                        }
                        
                    }
                }
            }
        });

        network.getView().addEventListener('mousemove', function (e) {
            var element = network.getElementAt(e);
            if(element instanceof twaver.Node){
                if(element.getClient("node.icon1") === "ico_info_s"){
                    _twaver.popup.showToolTip({ x: e.clientX, y: e.clientY}, "<p style='text-align:center;'><b>ecs1601</b></p><p><b>CPU/内存/带宽:</b>1核/0.5G/1M</p><p><b>镜像:</b>Debian 6.09 32位</p>");
                }else if(element.getClient("node.icon1") === "ico_line_s"){
                    _twaver.popup.showToolTip({ x: e.clientX, y: e.clientY}, "line");
                }else if(element.getClient("node.icon1") === "ico_option_s"){
                    _twaver.popup.showToolTip({ x: e.clientX, y: e.clientY}, "option");
                }else if(element.getClient("node.icon1") === "ico_wdisk_s"){
                    _twaver.popup.showToolTip({ x: e.clientX, y: e.clientY}, "wdisk");
                }
            }
        });
        network.setMovableFunction(function(element){
            if(element instanceof twaver.Node && element.getImage() === "icon_node_vector"){
                return false;
            }
            return true;
        });

        network.getView().setAttribute('draggable', 'true');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);

        return network;
    },
    createNetworkToolbar: function (network, interaction) {
        var toolbar = document.createElement('div');
        this.addButton(toolbar, 'Default', 'select', function () {
            if (twaver.Util.isTouchable) {
                network.setTouchInteractions();
            } else {
                network.setDefaultInteractions();
            }
        });
        this.addButton(toolbar, 'Magnify', 'magnify', function () {
            network.setMagnifyInteractions();
        });
//        demo.Util.addButton(toolbar, 'Pan', 'pan', function () { network.setPanInteractions(); });

        this.addButton(toolbar, 'Zoom In', 'zoomIn', function () { network.zoomIn(); });
        this.addButton(toolbar, 'Zoom Out', 'zoomOut', function () { network.zoomOut(); });
        this.addButton(toolbar, 'Zoom Reset', 'zoomReset', function () { network.zoomReset(); });
        this.addButton(toolbar, 'Zoom Overview', 'zoomOverview', function () { network.zoomOverview(); });
        this.addInteractionComboBox(toolbar, network, interaction);
        this.addButton(toolbar, 'XML', 'save', function () {
            var box = network.getElementBox();
            var text = new twaver.XmlSerializer(box).serialize();
            if (twaver.Util.isIE) {
                /*
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.document.body = text;
                document.appendChild(iframe);
                iframe.document.execCommand("SaveAs");
                */
                var iframe = document.createElement('iframe');
                document.body.insertBefore(iframe);
                iframe.style.display = 'none';
                iframe.contentDocument.write(text);
                iframe.contentDocument.execCommand('SaveAs', true, 'file.xml');
                document.body.removeChild(iframe);
            } else {
                var uriContent = "data:text/xml," + encodeURIComponent(text);
                window.open(uriContent, 'network');
            }
            box.clear();
            new twaver.XmlSerializer(box).deserialize(text);

            text = new twaver.JsonSerializer(box).serialize();
            box.clear();
            new twaver.JsonSerializer(box).deserialize(text);

            if (console) {
                console.log(new twaver.JsonSerializer(box).serialize());
            }
        });
        this.addButton(toolbar, 'Export Image', 'export', function () {
            var canvas;
            if (network.getCanvasSize) {
                canvas = network.toCanvas(network.getCanvasSize().width, network.getCanvasSize().height);
            } else {
                canvas = network.toCanvas(network.getView().scrollWidth, network.getView().scrollHeight);
            }
            if (twaver.Util.isIE) {
                var w = window.open();
                w.document.open();
                w.document.write("<img src='" + canvas.toDataURL() + "'/>");
                w.document.close();
            } else {
                window.open(canvas.toDataURL(), 'network.png');
            }
        });
        if (this.isFullScreenSupported()) {
            this.addButton(toolbar, 'Full screen', 'fullscreen', function () {
                this.toggleFullscreen();
            });
        }
        return toolbar;
    },
     addButton: function (div, name, src, callback) {
        var button = document.createElement('input');
        button.setAttribute('type', src ? 'image' : 'button');
        button.setAttribute('title', name);
        button.style.verticalAlign = 'top';
        if (src) {
            button.style.padding = '4px 4px 4px 4px';
            if (src.indexOf('/') < 0) {
                src = 'images/toolbar/' + src + '.png';
            }
            button.setAttribute('src', src);
        } else {
            button.value = name;
        }
        button.addEventListener('click', callback, false);
        div.appendChild(button);
        return button;
    },
    addInteractionComboBox: function (div, network, interaction) {
        var items = twaver.Util.isTouchable ? ['Touch', 'None'] :
            ['Default-Live', 'Default-Lazy', 'Edit-Live', 'Edit-Lazy', 'Magnify', 'None'];
        var callback = function () {
            if (this.value === 'Default-Live') {
                network.setDefaultInteractions();
            } else if (this.value === 'Default-Lazy') {
                network.setDefaultInteractions(true);
            } else if (this.value === 'Edit-Live') {
                network.setEditInteractions();
            } else if (this.value === 'Edit-Lazy') {
                network.setEditInteractions(true);
            } else if (this.value === 'Pan') {
                network.setPanInteractions();
            } else if (this.value === 'Magnify') {
                network.setMagnifyInteractions();
            } else if (this.value === 'Touch') {
                network.setTouchInteractions();
            } else if (this.value === 'None') {
                network.setInteractions(null);
            }
        };
        return this.addComboBox(div, items, callback, interaction);
    },
    addComboBox: function (div, items, callback, value) {
        var comboBox = document.createElement('select');
        comboBox.style.verticalAlign = 'top';
        items.forEach(function (item) {
            var option = document.createElement('option');
            option.appendChild(document.createTextNode(item));
            option.setAttribute('value', item);
            comboBox.appendChild(option);
        });

        if (callback) {
            comboBox.addEventListener('change', callback, false);
        }

        if (value) {
            comboBox.value = value;
        }
        div.appendChild(comboBox);
        return comboBox;
    },

    isFullScreenSupported: function () {
        var docElm = document.documentElement;
        return docElm.requestFullscreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen;
    },
    toggleFullscreen: function () {
        if (this.isFullScreenSupported()) {
            var fullscreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
            if (!fullscreen) {
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
    },
    appendChild: function (e, parent, top, right, bottom, left) {
        e.style.position = 'absolute';
        if (left != null) e.style.left = left + 'px';
        if (top != null) e.style.top = top + 'px';
        if (right != null) e.style.right = right + 'px';
        if (bottom != null) e.style.bottom = bottom + 'px';
        parent.appendChild(e);
    },
    addStyleProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'style');
    },
    addAccessorProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'accessor');
    },
    _addProperty: function (box, propertyName, category, name, proprtyType) {
        var property = new twaver.Property();
        property.setCategoryName(category);
        if (!name) {
            name = this._getNameFromPropertyName(propertyName);
        }
        property.setName(name);
        property.setEditable(true);
        property.setPropertyType(proprtyType);
        property.setPropertyName(propertyName);

        var valueType;
        if (proprtyType === 'style') {
            valueType = twaver.SerializationSettings.getStyleType(propertyName);
        } else if (proprtyType === 'client') {
            valueType = twaver.SerializationSettings.getClientType(propertyName);
        } else {
            valueType = twaver.SerializationSettings.getPropertyType(propertyName);
        }
        if (valueType) {
            property.setValueType(valueType);
        }

        box.add(property);
        return property;
    },
    _getNameFromPropertyName: function (propertyName) {
        var names = propertyName.split('.');
        var name = '';
        for (var i = 0; i < names.length; i++) {
            if (names[i].length > 0) {
                name += names[i].substring(0, 1).toUpperCase() + names[i].substring(1, names[i].length);
            }
            if (i < names.length - 1) {
                name += ' ';
            }
        }
        return name;
    },
    _createElement: function (network, className, centerLocation, src) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation({x:centerLocation.x-10,y:centerLocation.y-10});
        element.setParent(network.getCurrentSubNetwork());
        if(src){
          element.setImage(src);
          if(src === "node_vector"){
            element.setClient("node.image","ecs80");
            element.setClient("node.icon1","ico_nosys_s");
            element.setClient("node.icon2","ico_nobit_s");
            element.setClient("node.icon3","ico_nocode_s");
            element.setClient("node.text","1核 512M");
            element.setClient("node.icon4","ico_bandwidth_s");
            element.setClient("node.icon4.text","1M");
            element.setClient("node.icon5","ico_bdisk_s");
            element.setClient("node.icon5.text","1");
            element.setStyle("select.shape", "rectangle");
            element.setStyle("select.style", "border");
            // element.setStyle("select.padding",0);
            element.setStyle("select.width", 30),
            element.setStyle("select.padding.bottom", 10),
            element.setStyle("select.color","rgba(204,204,204,0.2)");

            var iconNode1 = new twaver.Follower();
            iconNode1.setClient("node.icon1","ico_info_s");
            iconNode1.setImage("icon_node_vector");
            iconNode1.setCenterLocation({x:centerLocation.x-40,y:centerLocation.y-35});
            // infoNode.setParent(chassis);
            iconNode1.setHost(element);
            iconNode1.setVisible(false);
            network.getElementBox().add(iconNode1);

            var iconNode2 = new twaver.Follower();
            iconNode2.setClient("node.icon1","ico_line_s");
            iconNode2.setImage("icon_node_vector");
            iconNode2.setCenterLocation({x:centerLocation.x+70,y:centerLocation.y-35});
            // infoNode.setParent(chassis);
            iconNode2.setHost(element);
            iconNode2.setVisible(false);
            network.getElementBox().add(iconNode2);

            var iconNode3 = new twaver.Follower();
            iconNode3.setClient("node.icon1","ico_option_s");
            iconNode3.setImage("icon_node_vector");
            iconNode3.setCenterLocation({x:centerLocation.x-40,y:centerLocation.y+85});
            // infoNode.setParent(chassis);
            iconNode3.setHost(element);
            iconNode3.setVisible(false);
            network.getElementBox().add(iconNode3);

            var iconNode4 = new twaver.Follower();
            iconNode4.setClient("node.icon1","ico_wdisk_s");
            iconNode4.setImage("icon_node_vector");
            iconNode4.setCenterLocation({x:centerLocation.x+70,y:centerLocation.y+85});
            // infoNode.setParent(chassis);
            iconNode4.setHost(element);
            iconNode4.setVisible(false);
            network.getElementBox().add(iconNode4);

            element.setClient("node.icons",[iconNode1,iconNode2,iconNode3,iconNode4]);
          }
        }
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
    },
});