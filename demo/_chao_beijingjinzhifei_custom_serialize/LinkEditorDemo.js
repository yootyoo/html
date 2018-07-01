var POSITION_TYPE = ['topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'];
var LINK_TYPE = ['arc', 'triangle', 'parallel', 'flexional', 'flexional.horizontal', 'flexional.vertical', 'orthogonal', , 'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V', 'orthogonal.V.H', 'extend.top', 'extend.left', 'extend.bottom', 'extend.right'];
LinkEditorDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.imageNodesDiv = document.createElement('div');
    this.subNetworkDiv = document.createElement('div');
    this.linksDiv = document.createElement('div');
    this.accordion = new twaver.controls.Accordion();
    this.existId = 9;
    this.existIp = 11;
};
twaver.Util.ext('LinkEditorDemo', Object, {
    init: function () {
        this.registImages();
        var toolbar = this.createNetworkToolbar(this.network);
        var centerPane = new twaver.controls.BorderPane(this.network, toolbar);
        centerPane.setTopHeight(25);
        var mainSplit = new twaver.controls.SplitPane(this.accordion, centerPane, 'horizontal', 0.2);
        this.appendChild(mainSplit.getView(), document.getElementById('main'), 0, 0, 0, 0);
        this.initAccordion();
        window.onresize = function (e) { mainSplit.invalidate(); };
        this.network.setEditableFunction(function (element) {
            if (element instanceof twaver.Node) {
                return element.getWidth() > 0 && element.getHeight() > 0;
            }
            return true;
        });

        this.initBox();
    },
    initBox: function () {

        var jsonStr = '{"nodes":[{"id":"0","name":"服务器一","ip":"192.168.1.2","type":"server","location":{"x":200,"y":120}},{"id":"1","name":"服务器二","ip":"192.168.1.3","type":"server","location":{"x":200,"y":220}},{"id":"2","name":"终端一","ip":"192.168.1.4","type":"pc","location":{"x":50,"y":50}},{"id":"3","name":"终端二","ip":"192.168.1.5","type":"pc","location":{"x":50,"y":200}},{"id":"4","name":"子网一","ip":"192.168.1.6","type":"subNetwork","location":{"x":400,"y":100},"children":[{"id":"6","name":"终端一","ip":"192.168.1.8","type":"pc","location":{"x":150,"y":150}},{"id":"7","name":"终端三","ip":"192.168.1.9","type":"pc","location":{"x":250,"y":250}}]},{"id":"5","name":"子网二","ip":"192.168.1.7","type":"subNetwork","location":{"x":400,"y":200},"children":[{"id":"8","name":"终端二","ip":"192.168.1.10","type":"pc","location":{"x":250,"y":150}},{"id":"9","name":"终端三","ip":"192.168.1.11","type":"pc","location":{"x":150,"y":250}}]}],"links":[{"from":"0","to":"2","name":"link1","style":{"link.type":"orthogonal"}},{"from":"0","to":"4","name":"link2","style":{}},{"from":"1","to":"3","name":"link3","style":{}},{"from":"1","to":"5","name":"link4","style":{}},{"from":"6","to":"7","name":"->","style":{}},{"from":"8","to":"9","name":"->","style":{}}]}';
        
        var jsonObj = JSON.parse(jsonStr);
        this.parseJsonObj(this.box,jsonObj);

    },
    registImages: function () {
        this.registerTheImage("images/pc.png");
        this.registerTheImage("images/server.png");
        this.registerTheImage("images/subNetwork.png");
        this.registerTheImage("images/link/HAProxy.png");
        this.registerTheImage("images/link/INTARWEB.png");
        this.registerTheImage("images/link/SOWEB.png");
        this.registerTheImage("images/link/VLAN.png");       
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
    addImageNodeButton: function (src) {
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
    addSubNetworkButton: function (src) {
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
            e.dataTransfer.setData('Text', 'className:twaver.SubNetwork');
            if(imageName === "ecs80"){
                e.dataTransfer.setData('Image', 'image:node_vector');
            }else{
                e.dataTransfer.setData('Image', 'image:' + imageName);
            }
        }, false);
        this.subNetworkDiv.appendChild(image);
        return image;
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
        this.accordion.add('SubNetworks', this.subNetworkDiv);
        this.accordion.add('Links', this.linksDiv);

        this.addImageNodeButton('images/pc.png');
        
        this.addSubNetworkButton('images/subNetwork.png');

        this.addLinkButton('images/link/flexional.png');
        this.addLinkButton('images/link/orthogonal.png');
        this.addLinkButton('images/link/extend.top.png');
        this.addLinkButton('images/link/extend.left.png');
        this.addLinkButton('images/link/extend.bottom.png');
        this.addLinkButton('images/link/extend.right.png');
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
                    var element = network.getElementAt(e);
                    if(element instanceof twaver.SubNetwork){
                        that._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), src, element);
                    }else{
                        that._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), src);
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
        // toolbar.innerHTML = '<input style="margin-left:10%;" type="button" value="Full Screen" id="show_btn"/>';
        var that = this;
        this.addButton(toolbar, 'Export', null, function () {
            var jsonStr = JSON.stringify(that.serializeBox(that.box));
            console.log(jsonStr);
        });
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
    _createElement: function (network, className, centerLocation, src, parent) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation({x:centerLocation.x-10,y:centerLocation.y-10});
        // element.setParent(network.getCurrentSubNetwork());
        if(src){
            element.setImage(src);
        }
        if(parent){
            element.setParent(parent);
        }
        this.existId++;
        this.existIp++;
        element.setClient("id",this.existId+"");
        element.setName("192.168.1."+this.existIp);
        if(className === "twaver.SubNetwork"){
            element.setName2("subNetwork");
        }else if(className === "twaver.Node"){
            element.setName2("node");
        }
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
    },


    parseJsonObj:function(box ,jsonObj){
        var nodeMap = {};
        function createNodeMap(box,nodes,parentId){
            
            var i;
            for(i=0;i<nodes.length;i++){
                var node;
                if(nodes[i].type === "server"){
                    node = new twaver.Node();
                    node.setImage("server");
                }else if(nodes[i].type === "pc"){
                    node = new twaver.Node();
                    node.setImage("pc");
                    node.setSize(46,46);
                }else if(nodes[i].type === "subNetwork"){
                    node = new twaver.SubNetwork();
                    node.setImage("subNetwork");
                    node.setSize(46,46);
                }
                node.setName(nodes[i].ip);
                node.setName2(nodes[i].name);
                node.setLocation(nodes[i].location.x, nodes[i].location.y);
                node.setClient("id",nodes[i].id);
                if(parentId){
                    nodeMap[parentId].addChild(node);
                }
                nodeMap[nodes[i].id] = node;
                box.add(node);
                if(nodes[i].children){
                    createNodeMap(box,nodes[i].children,nodes[i].id);
                }
            }
        }

        function addLinks(box,links){
            var i;
            for(i=0;i<links.length;i++){
                var link;
                var fromNode = nodeMap[links[i].from];
                var toNode = nodeMap[links[i].to];
                link = new twaver.Link(fromNode,toNode);
                link.setName(links[i].name);
                var style = links[i].style;
                for(var prop in style){
                    link.setStyle(prop, style[prop]);
                }
                box.add(link);
            }
        }
        createNodeMap(box,jsonObj.nodes);
        addLinks(box,jsonObj.links);
    },

    serializeBox:function(box){
        function serializeRootNodes(rootNodes){
            var returnArr = [];
            var i;
            for(i=0;i<rootNodes.length;i++){
                returnArr.push(serializeNode(rootNodes[i]));
            }
            return returnArr;
        }
        function serializeNode(node){
            var nodeObj={};
            var childrenList = node.getChildren();
            var childrenSize = childrenList.size();
            var i;
            if(childrenSize > 0){
                nodeObj.children = [];
                for(i=0;i<childrenSize;i++){
                    nodeObj.children.push(serializeNode(childrenList.get(i)));
                }
            }       
            nodeObj.id = node.getClient("id");
            nodeObj.name = node.getName2();
            nodeObj.ip = node.getName();
            nodeObj.location = node.getLocation();
            var im = node.getImage();
            if(node instanceof twaver.SubNetwork){
                nodeObj.type = "subNetwork";
            }else{
                var image = node.getImage();
                if(image === "server"){
                    nodeObj.type = "server";
                }else if(image === "pc"){
                    nodeObj.type = "pc";
                }
            }
            return nodeObj;
        }

        function serializeLinks(links){
            var returnArr = [];
            var i;
            for(i=0;i<links.length;i++){
                var linkObj ={};
                linkObj.from = links[i].getFromNode().getClient("id");
                linkObj.to = links[i].getToNode().getClient("id");
                linkObj.name = links[i].getName();
                linkObj.style = {};
                for(var prop in links[i]._styleMap){
                    linkObj.style[prop] = links[i]._styleMap[prop];
                }
                returnArr.push(linkObj);
            }
            return returnArr;
        }

        function separateNodesAndLinks(dataList){
            var i;
            var returnObj = {
                rootNodes:[],
                otherNodes:[],
                links:[]
            };      
            for(i=0;i<dataList.size();i++){
                var data = dataList.get(i);
                if(data instanceof twaver.Node){
                    if(data.getParent()){
                        returnObj.otherNodes.push(data);
                    }else{
                        returnObj.rootNodes.push(data);
                    }
                }else if(data instanceof twaver.Link){
                    returnObj.links.push(data);
                }
            }
            return returnObj;
        }
        var returnObj = {};
        var jsonObj = separateNodesAndLinks(box.getDatas());
        returnObj.nodes = serializeRootNodes(jsonObj.rootNodes);
        returnObj.links = serializeLinks(jsonObj.links);
        return returnObj;
    }
});