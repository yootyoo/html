ChassisDemo = function () {
    this.network = this.createDraggableNetwork();
    this.box = new twaver.ElementBox();
    // this.network = new twaver.vector.Network(this.box);
    this.ports = new twaver.List();
    this.cards = new twaver.List();
};
twaver.Util.ext('ChassisDemo', Object, {
    init: function () {
        this.registImages();
        var toolbar = this.createNetworkToolbar(this.network);
        // var toolbar = document.createElement('div');
        var borderBane = new twaver.controls.BorderPane(this.network,toolbar);
        var main = document.getElementById('main');
        this.appendChild(borderBane.getView(), main, 25, 0, 0, 0);
        borderBane.getView().style.overflow = "visible";

        // var borderView = borderBane.getView();
        // document.body.appendChild(borderView);
        // borderView.style.position = 'absolute';
        // borderView.style.left = 0 + 'px';
        // borderView.style.top = 0 + 'px';
        // borderView.style.right = "0px";
        // borderView.style.bottom ="0px";
        // this.network.adjustBounds({x:0,y:0,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight});
                
        this.addButton(toolbar, "Reload", 'refresh', function () { self.initBox(); });
        var movable = this.addCheckBox(toolbar, false, "Movable");

        this.initBox();
        this.network.setElementBox(this.box);

        this.network.setMovableFunction(function (element) {
            return movable.checked;
        });

        this.network.setVisibleFunction(function (element) {
            if (element.getClient("hidden")) {
                return false;
            }
            if (element.getParent() && element.getParent().getClient("hidden")) {
                return false;
            }
            return true;
        });

        var self = this;
        setInterval(function () { self.tick(); }, 1500);


        // this.registImages();
        // // var toolbar = this.createNetworkToolbar(this.network);
        // // var borderBane = new twaver.controls.BorderPane(this.network, toolbar);
        // var main = document.getElementById('main');
        // // this.appendChild(borderBane.getView(), main, 25, 0, 0, 0);
        // main.appendChild(this.network.getView());
        // // document.getElementById("show_btn_div").style.position = "absolute";
        // // document.getElementById("show_btn_div").style.top = "25px";
        // this.network.adjustBounds({x:0,y:25,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight});
        // this.initBox();
        // this.network.setElementBox(this.box);
        // var that = this;
        // document.getElementById("show_btn").addEventListener("click",function(){
        //     that.toggleFullscreen();
        //   });

        // this.network.setMovableFunction(function (element) {
        //     return movable.checked;
        // });

        // this.network.setVisibleFunction(function (element) {
        //     if (element.getClient("hidden")) {
        //         return false;
        //     }
        //     if (element.getParent() && element.getParent().getClient("hidden")) {
        //         return false;
        //     }
        //     return true;
        // });
        // var self = this;
        // setInterval(function () { self.tick(); }, 1500);
    },
    registImages: function () {
        this.registerTheImage("images/chassis/bolt.png");
        for (var i = 1; i <= 10; i++) {
            this.registerTheImage("images/chassis/chassis" + i + ".png");
        }
    },
    registerTheImage: function (url) {
        this.registerImage(url, this.network);
    },
    tick: function () {
        for (var i = 0; i < this.ports.size(); i++) {
            this.ports.get(i).getAlarmState().clear();
        }
        for (i = 0; i < this.cards.size(); i++) {
            this.cards.get(i).setClient("hidden", false);
        }
        var node = this.ports.get(this.randomInt(this.ports.size()));
        node.getAlarmState().increaseNewAlarm(this.randomNonClearedSeverity());
        node = this.ports.get(this.randomInt(this.ports.size()));
        node.getAlarmState().increaseNewAlarm(this.randomNonClearedSeverity());

        node = this.cards.get(this.randomInt(this.cards.size()));
        node.setClient("hidden", true);

        if (this.light1.getStyle('vector.fill.color') == '#00FF00') {
            this.light1.setStyle('vector.fill.color', '#FFFF00');
        } else {
            this.light1.setStyle('vector.fill.color', '#00FF00');
        }

        if (this.light2.getStyle('vector.fill.color') == '#0000FF') {
            this.light2.setStyle('vector.fill.color', '#FF0000');
        } else {
            this.light2.setStyle('vector.fill.color', '#0000FF');
        }
    },
    initBox: function () {
        this.box.clear();

        var first = this.createNode(null, 16, 11, "chassis9");
        first.setStyle('outer.padding', 1);

        var cardContainer = this.createNode(first, 44, 27, null, 638, 269);
        cardContainer.setStyle('vector.fill.color', '#AAAAAA');
        cardContainer.setStyle('outer.padding', -1);
        cardContainer.setStyle('vector.deep', -4);

        this.cards.clear();
        for (var i = 0; i <= 12; i++) {
            this.cards.add(this.createCard(cardContainer, i));
        }

        card = this.createNode(cardContainer, 560, 27, null, 38, 268);
        this.createNode(card, 565, 223, "chassis4");
        this.createNode(card, 565, 251, "chassis4");
        card = this.createNode(card, 565, 46, null, 24, 163);
        card.setStyle('vector.fill.color', '#868686');
        this.createNode(card, 568, 52, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 166, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 147, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 128, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 109, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 90, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 71, "chassis3").setStyle('alarm.direction', 'left');
        this.createNode(card, 568, 185, "chassis3").setStyle('alarm.direction', 'left');

        card = this.createNode(cardContainer, 598, 27, null, 43, 268);
        this.light1 = this.createLight(card, 610, 225, '#00FF00');
        this.light2 = this.createLight(card, 610, 253, '#0000FF');
        card = this.createNode(card, 603, 46, null, 24, 163);
        card.setStyle('vector.fill.color', '#868686');
        this.createNode(card, 606, 52, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 166, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 147, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 128, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 109, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 90, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 71, "chassis3").setStyle('alarm.direction', 'right');
        this.createNode(card, 606, 185, "chassis3").setStyle('alarm.direction', 'right');

        var card = this.createNode(cardContainer, 641, 27, null, 43, 268);
        this.createNode(card, 653, 50, "chassis1");
        this.createNode(card, 653, 225, "chassis1");
        this.createNode(card, 653, 167, "chassis1");
        this.createNode(card, 653, 108, "chassis1");

        var secondShelf = this.createNode(null, 16, 319, "chassis10");
        var thirdShelf = this.createNode(null, 16, 447, "chassis2");
        this.createNode(thirdShelf, 363, 479, "chassis5");
        this.createNode(thirdShelf, 386, 479, "chassis5");
        this.createNode(thirdShelf, 409, 479, "chassis5");
        this.createNode(thirdShelf, 591, 479, "chassis5");
        this.createNode(thirdShelf, 614, 479, "chassis5");
        this.createNode(thirdShelf, 637, 479, "chassis5");
        this.createNode(thirdShelf, 461, 499, "chassis6");
        card = this.createNode(thirdShelf, 513, 447, null, 66, 120);
        this.createNode(card, 538, 526, "chassis7");
        this.createNode(card, 538, 489, "chassis7");
        this.createNode(card, 538, 450, "chassis7");

        var finder = new twaver.QuickFinder(this.box, "image");
        this.ports = new twaver.List(finder.find("chassis3"));
        finder.dispose();

        twaver.Util.moveElements(this.box.datas, 0, 40);
    },
    createCard: function (parent, index) {
        var node = this.createNode(parent, 44 + 43 * index, 27, null, 43, 268);
        this.createNode(node, node.getX() + 16, node.getY() + 10, "bolt");
        this.createNode(node, node.getX() + 16, node.getY() + node.getHeight() - 27, "bolt");
        return node;
    },
    createLight: function (parent, x, y, color) {
        var light = new twaver.Follower();
        light.setHost(parent);
        light.setStyle('body.type', 'vector');
        light.setStyle('vector.shape', 'circle');
        light.setStyle('vector.fill.color', color);
        light.setStyle('vector.gradient', 'radial.northeast');
        light.setSize(18, 18);
        light.setLocation(x, y);
        this.box.add(light);
        return light;
    },
    createNode: function (parent, x, y, image, w, h) {
        var node = new twaver.Follower();
        node.setStyle('outer.padding', 2);
        node.setStyle('select.color', '#000000');
        node.setStyle('alarm.position', 'center');
        node.setParent(parent);
        node.setHost(parent);
        node.setLocation(x, y);
        if (w) node.setWidth(w);
        if (h) node.setHeight(h);
        if (image != null) {
            node.setImage(image);
        } else {
            node.setStyle('body.type', 'vector');
            node.setStyle('vector.gradient', 'none');
            node.setStyle('vector.shape', 'rectangle');
            node.setStyle('vector.deep', 4);
        }
        this.box.add(node);
        return node;
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
                demo.Util._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
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
        
        var that = this;
        // var inputButton = document.createElement('input');
        // inputButton.style.marginLeft = "10%";
        // inputButton.type = "button";
        // inputButton.value ="Full Screen";
        // inputButton.id="show_btn";
        // toolbar.appendChild(inputButton);

        // inputButton.addEventListener("click",function(){
        //     that.toggleFullscreen();
        //   });
        
        // if (this.isFullScreenSupported()) {
            this.addButton(toolbar, 'Full screen', 'fullscreen', function () {
                //that.toggleFullscreen();
                var wscript = new ActiveXObject("Wscript.shell");
                wscript.SendKeys("{F11}");
            });
        // }
        return toolbar;
    },
    isFullScreenSupported: function () {
        var docElm = document.documentElement;
        return docElm.requestFullscreen || docElm.msRequestFullscreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen;
    },
    toggleFullscreen: function () {
        if (this.isFullScreenSupported()) {
            var fullscreen = document.fullscreen || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen;
            if (!fullscreen) {
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.msRequestFullscreen){
                    docElm.msRequestFullscreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
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
    appendChild: function (e, parent, top, right, bottom, left) {
        e.style.position = 'absolute';
        if (left != null) e.style.left = left + 'px';
        if (top != null) e.style.top = top + 'px';
        if (right != null) e.style.right = right + 'px';
        if (bottom != null) e.style.bottom = bottom + 'px';
        parent.appendChild(e);
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
    randomInt: function (n) {
        return Math.floor(Math.random() * n);
    },
    randomNonClearedSeverity: function () {
        while (true) {
            var severity = this.randomSeverity();
            if (!twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                return severity;
            }
        }
        return null;
    },
    randomSeverity: function () {
        var severities = twaver.AlarmSeverity.severities;
        return severities.get(this.randomInt(severities.size()));
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
    addCheckBox: function (div, checked, name, callback) {
        var checkBox = document.createElement('input');
        checkBox.id = name;
        checkBox.type = 'checkbox';
        checkBox.style.padding = '4px 4px 4px 4px';
        checkBox.checked = checked;
        if (callback) checkBox.addEventListener('click', callback, false);
        div.appendChild(checkBox);
        var label = document.createElement('label');
        label.htmlFor = name;
        label.innerHTML = name;
        div.appendChild(label);
        return checkBox;
    }
});