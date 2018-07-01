PSTNDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.popupMenu = new twaver.controls.PopupMenu(this.network);

    this.nodeColor = '#FF0000';
    this.linkColor = '#66CCFF';
    this.nodeOverColor = '#FFFF00';
    this.linkOverColor = '#FF00FF';
    this.selectColor = '#00FF00';
};
twaver.Util.ext('PSTNDemo', Object, {
    init: function () {
        var that = this;
        this.registImages();
        var main = document.getElementById('main');
        var toolbar = this.createNetworkToolbar(this.network);
        var centerPane = new twaver.controls.BorderPane(this.network, toolbar);
        this.network.setLinkFlowEnabled(true);
        centerPane.setTopHeight(25);
        this.appendChild(centerPane.getView(), main, 0, 0, 0, 0);

        this.initBox();
        this.network.getElementBox().forEach(function (element) {
            if (element instanceof twaver.Link) {
                if(!element.getStyle('link.flow'))
                    element.setStyle('link.color', '#C0C0C0');
                element.setStyle('link.width', 5);
            }
        });

        this.network.getToolTip = function (data) {
            if (!data.getToolTip()) {
               var toolTipCon = '<form id="cont_general" style="padding: 5px 10px 10px;"><label style="color:#000000;">Type: <label><label style="color:#0000ff;">Database Instance<label><div class="clear"></div><label style="color:#000000;">Host: <label><label style="color:#0000ff;">msdbsvr1<label><div class="clear"></div><label style="color:#000000;">Incidents: <label><label style="color:#0000ff;">alert2<label><div class="clear"></div></form>';
               data.setToolTip(toolTipCon);
               twaver.Util.getToolTipDiv().style.width = '200px';
               twaver.Util.getToolTipDiv().style.height = '100px';
            }
            return data.getToolTip();
        };
        window.onresize = function (e) { centerPane.invalidate(); };
        this.initPopupMenu();
        

        this.network.addInteractionListener(function(e) {
            var element = e.element;
            if(e.kind === 'doubleClickElement' && element && element.getClient("nextNodes")) {
                var nextNodes = element.getClient("nextNodes");
                if(nextNodes && nextNodes.length >0){
                    var isVisible = nextNodes[0].isVisible();
                    if(isVisible){
                        that.hideAllNextNodes(element);
                    }else{
                         for(var i=0; i<nextNodes.length;i++){
                            nextNodes[i].setVisible(true);
                        }
                    }
                }
               
            }
        });

        console.log(new twaver.JsonSerializer(this.box).serialize());
    },
    hideAllNextNodes:function(element){
        var nextNodes = element.getClient("nextNodes");
        if(nextNodes){
            for(var i=0; i<nextNodes.length;i++){
                nextNodes[i].setVisible(false);
                this.hideAllNextNodes(nextNodes[i]);
            }
        }
    },
    registImages: function () {
        this.registerImage("images/antenna.png");
        this.registerImage("images/cartridge_system.png");
        this.registerImage("images/cloud.png");
        this.registerImage("images/mainframe.png");
        this.registerImage("images/modem.png");
        this.registerImage("images/msc.png");
        this.registerImage("images/phone.png");
        this.registerImage("images/router.png");
        this.registerImage("images/router2.png");
        this.registerImage("images/satellite_antenna.png");
        this.registerImage("images/terminal.png");
        this.registerImage("images/testing.png");
        this.registerImage("images/tw130.png");
        this.registerImage("images/wdm.png");

        this.registerImage("images/att1.png");
        this.registerImage("images/att2.png");
        this.registerImage("images/att3.png");
        this.registerImage("images/rackImage.png");
        this.registerImage("images/portUpImage.png");
        this.registerImage("images/portDownImage.png");
    },
    registerImage: function (url) {
        this.registerImage(url, this.network);
    },
    initBox: function () {
        var tw130 = new twaver.Node({
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
        link.setStyle('icons.names', ["att2"]);
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


        var nextNode1 = [];
        var localRouter1 = new twaver.Node("lr1");
        localRouter1.setName("router1");
        localRouter1.setLocation(651, 64);
        localRouter1.setImage("router");
        this.box.add(localRouter1);
        localRouter1.setClient("nextNodes",nextNode1);

        var nextNode2 = [];
        var localRouter2 = new twaver.Node("lr2");
        localRouter2.setImage("router");
        localRouter2.setLocation(711, 64);
        localRouter2.setName("router2");
        this.box.add(localRouter2);
        localRouter2.setClient("preNode",localRouter1);
        localRouter2.setVisible(false);
        localRouter2.setClient("nextNodes",nextNode2);
        nextNode1.push(localRouter2);

        var lr1_lr2 = new twaver.Link(localRouter1, localRouter2);
        lr1_lr2.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr1_lr2);

        var pc_pc1 = new twaver.Node("pc1");
        pc_pc1.setName("PC1");
        pc_pc1.setLocation(651, 24);
        this.box.add(pc_pc1);
        pc_pc1.setClient("preNode",localRouter1);
        pc_pc1.setVisible(false);
        nextNode1.push(pc_pc1);

        var lr1_pc1 = new twaver.Link(localRouter1, pc_pc1);
        lr1_pc1.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr1_pc1);

        var nextNode3 = [];
        var localRouter3 = new twaver.Node("lr3");
        localRouter3.setImage("router");
        localRouter3.setLocation(771, 64);
        localRouter3.setName("router3");
        this.box.add(localRouter3);
        localRouter3.setClient("preNode",localRouter2);
        localRouter3.setVisible(false);
        localRouter3.setClient("nextNodes",nextNode3);
        nextNode2.push(localRouter3);

        var lr2_lr3 = new twaver.Link(localRouter2, localRouter3);
        lr2_lr3.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr2_lr3);

        var pc_pc2 = new twaver.Node("pc2");
        pc_pc2.setName("PC2");
        pc_pc2.setLocation(711, 24);
        this.box.add(pc_pc2);
        pc_pc2.setClient("preNode",localRouter2);
        pc_pc2.setVisible(false);
        nextNode2.push(pc_pc2);

        var lr2_pc2 = new twaver.Link(localRouter2, pc_pc2);
        lr2_pc2.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr2_pc2);

        var pc_pc3 = new twaver.Node("pc3");
        pc_pc3.setName("PC3");
        pc_pc3.setLocation(771, 24);
        this.box.add(pc_pc3);
        pc_pc3.setClient("preNode",localRouter3);
        pc_pc3.setVisible(false);
        nextNode3.push(pc_pc3);

        var lr3_pc3 = new twaver.Link(localRouter3, pc_pc3);
        lr3_pc3.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr3_pc3);

        var pc_pc4 = new twaver.Node("pc4");
        pc_pc4.setName("PC4");
        pc_pc4.setLocation(831, 64);
        this.box.add(pc_pc4);
        pc_pc4.setClient("preNode",localRouter3);
        pc_pc4.setVisible(false);
        nextNode3.push(pc_pc4);

        var lr3_pc4 = new twaver.Link(localRouter3, pc_pc4);
        lr3_pc4.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(lr3_pc4);


        

        orlink = new twaver.Link(localRouter1, modem);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        // var localLink = new twaver.Link(pc_pc1, localRouter);
        // localLink.setStyle('link.type', 'orthogonal.H.V');
        // this.box.add(localLink);

        // localLink = new twaver.Link(pc_pc2, localRouter);
        // localLink.setStyle('link.type', 'orthogonal.H.V');
        // this.box.add(localLink);

        var stb = new twaver.SubNetwork();
        stb.setImage("router2");
        stb.setName("STB");
        stb.setLocation(614, 122);
        this.box.add(stb);
        orlink = new twaver.Link(stb, modem);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        var swLink = new twaver.Link(stb, wdm);
        swLink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(swLink);

        var tv = new twaver.Node();
        tv.setImage("terminal");
        tv.setName("IPTV/SDV");
        tv.setLocation(666, 152);
        this.box.add(tv);

        var l = new twaver.Link(tv, stb);
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

        var pc2 = new twaver.Node();
        pc2.setName("PC");
        pc2.setLocation(648, 266);
        this.box.add(pc2);


        orlink = new twaver.Link(pc2, ont);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        var stb2 = new twaver.SubNetwork();
        stb2.setImage("router2");
        stb2.setName("STB");
        stb2.setLocation(609, 324);
        this.box.add(stb2);

        orlink = new twaver.Link(stb2, ont);
        orlink.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(orlink);

        tv = new twaver.Node();
        tv.setImage("terminal");
        tv.setName("IPTV/SDV");
        tv.setLocation(641, 357);
        this.box.add(tv);

        l = new twaver.Link(tv, stb2);
        l.setStyle('link.type', 'orthogonal.H.V');
        this.box.add(l);

        var rack = new twaver.Node();
        rack.setName("Rack");
        rack.setLocation(150, 50);
        rack.setImage("rackImage");
        stb.addChild(rack);
        this.box.add(rack);

        for (var i = 0; i < 4; i++) {
            var dummy = new twaver.Dummy();
            dummy.setName("module" + i);
            dummy.setParent(rack);
            this.box.add(dummy);

            for (var index = 0; index < 4; index++) {
                var port = new twaver.Follower();
                var x;
                var y;
                if (i % 2 == 0) {
                    x = 210 + index * 24;
                } else {
                    x = 319 + index * 24;
                }
                if (i < 2) {
                    y = 16;
                    port.setIcon("portUpImage");
                    port.setImage("portUpImage");
                } else {
                    y = 37;
                    port.setIcon("portDownImage");
                    port.setImage("portDownImage");
                }
                x += rack.getX();
                y += rack.getY();
                port.setHost(rack);
                port.setLocation(x, y);
                port.setClient('tree.name', "port:" + i + "-" + index);
                dummy.addChild(port);
                this.box.add(port);
            }
        }

        var rack2 = new twaver.Node();
        rack2.setName("Rack");
        rack2.setLocation(150, 50);
        rack2.setImage("rackImage");
        stb2.addChild(rack2);
        this.box.add(rack2);

        for (var i = 0; i < 4; i++) {
            var dummy2 = new twaver.Dummy();
            dummy2.setName("module" + i);
            dummy2.setParent(rack2);
            this.box.add(dummy2);

            for (var index = 0; index < 4; index++) {
                var port2 = new twaver.Follower();
                var x;
                var y;
                if (i % 2 == 0) {
                    x = 210 + index * 24;
                } else {
                    x = 319 + index * 24;
                }
                if (i < 2) {
                    y = 16;
                    port2.setIcon("portUpImage");
                    port2.setImage("portUpImage");
                } else {
                    y = 37;
                    port2.setIcon("portDownImage");
                    port2.setImage("portDownImage");
                }
                x += rack2.getX();
                y += rack2.getY();
                port2.setHost(rack2);
                port2.setLocation(x, y);
                port2.setClient('tree.name', "port:" + i + "-" + index);
                dummy2.addChild(port2);
                this.box.add(port2);
            }
        }

    },

    createDraggableNetwork: function (box) {
        var network = new twaver.canvas.Network(box);

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
            if (!text) {
                return false;
            }
            if (text && text.indexOf('className:') == 0) {
                this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
            }
            if (text && text.indexOf('<twaver') == 0) {
                network.getElementBox().clear();
                new twaver.XmlSerializer(network.getElementBox()).deserialize(text);
            }
            return false;
        }, false);

        network.getView().setAttribute('draggable', 'true');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);

        return network;
    },
    _createElement: function (network, className, centerLocation) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation(centerLocation);
        element.setParent(network.getCurrentSubNetwork());
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
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

    createNetworkToolbar: function (network, interaction) {
        var toolbar = document.createElement('div');
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
                src = '../images/toolbar/' + src + '.png';
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
    }
        
});