AutoLayoutDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork();
    this.autoLayouter = new twaver.layout.AutoLayouter(this.box);
    this.toolbar = this.createNetworkToolbar(this.network);
};
twaver.Util.ext('AutoLayoutDemo', Object, {
    init: function () {
        this.registerImage("../images/element/routerImage.png", this.network);
        var main = document.getElementById('main');
        var centerPane = new twaver.controls.BorderPane(this.network, this.toolbar);
        centerPane.setTopHeight(25);
        this.appendChild(centerPane.getView(), main, 0, 0, 0, 0);
        window.onresize = function (e) {
            centerPane.invalidate();
        };
        
        this.initControl();
        var self = this;
        var callback = function (e) {
          if (e.kind === 'validateEnd') {
            self.network.removeViewListener(callback);
            self.network.zoomOverview();
          }
        };
        this.network.addViewListener(callback);
        this.initBox();
        this.network.setElementBox(this.box);
        var self = this;
        /*var oldGetDimensionFunction = this.autoLayouter.getDimension;
        this.autoLayouter.getDimension = function (node) {
            if (self.accountAttachments.checked) {
                var ui = self.network.getElementUI(node);
                if (ui) {
                    var bounds = ui.getViewRect();
                    return { width: bounds.width, height: bounds.height };
                } else {
                    return null;
                }
            } else {
                return oldGetDimensionFunction(node);
            }
        };
        this.autoLayouter.getGroupLayoutType = function (group) {
            return 'topbottom';
        };*/
        this.autoLayouter.setAnimate(false);
        this.autoLayouter.doLayout('round');
        this.autoLayouter.setAnimate(true);
    },
    initControl: function () {
        var self = this;
        var animation = this.addCheckBox(this.toolbar, false, "Animation", function () {
            self.autoLayouter.setAnimate(animation.checked);
            self.doLayout();
        });
        animation.checked = this.autoLayouter.isAnimate();

        this.zoomToOverview = this.addCheckBox(this.toolbar, false, "Overview", function () {
            self.doLayout();
        });
        this.accountAttachments = this.addCheckBox(this.toolbar, false, "Attachment", function () {
            self.doLayout();
        });

        this.autoLayouterType = document.createElement('select');
        var items = ['round', 'symmetry', 'topbottom', 'bottomtop', 'leftright', 'rightleft', 'hierarchic'];
        items.forEach(function (item) {
            var option = document.createElement('option');
            option.appendChild(document.createTextNode(item));
            option.setAttribute('value', item);
            self.autoLayouterType.appendChild(option);
        });
        this.autoLayouterType.addEventListener('change', function () { self.doLayout(); }, false);
        this.toolbar.appendChild(this.autoLayouterType);
        this.addButton(this.toolbar, 'Create Group', 'group_icon', function () { self.createGroup(); });
    },
    doLayout: function () {
        if (this.zoomToOverview.checked) {
            var self = this;
            this.autoLayouter.doLayout(this.autoLayouterType.value, function () {
                self.network.zoomOverview(false);
            });
        } else {
            this.autoLayouter.doLayout(this.autoLayouterType.value);
        }
    },
    // initBox: function () {
    //     var self = this;
    //     var nodeCount = 4;
    //     var nodeArr = [];
    //     for(var i=0; i<nodeCount; i++){
    //         var node = new twaver.Node();
    //         nodeArr.push(node);
    //         this.box.add(node);

    //     //可以禁用分组代码查看区别
    //         var group = new twaver.Group();
    //         group.setStyle('group.fill.color', demo.Util.randomColor());
    //         group.setStyle('group.shape', 'oval');
    //         group.setExpanded(true);
    //         group.addChild(node);
    //         this.box.add(group);
    //     }

    //     for(var j=0; j<nodeCount-1; j++){
    //     createLink(nodeArr[j], nodeArr[j+1]);
    //     // createLink(nodeArr[j+1], nodeArr[j]);
    //     }
    //     createLink(nodeArr[0], nodeArr[nodeCount-1]);
    //     // createLink(nodeArr[nodeCount-1], nodeArr[0]);

    //     function createLink(srcNode, dstNode){
    //         var link = new twaver.Link(srcNode, dstNode);
    //         link.setStyle('link.width', 2);
    //         link.setStyle('link.color', '#00FF00');
    //         self.box.add(link);
    //     }

    // },
    
    initBox: function () {
        for (var k = 0; k < 2; k++) {
            var ip = "192.168." + k + ".";
            var count = 0;
            var root = new twaver.Node();
            root.setName(ip + count++);
            root.setImage("routerImage");
            this.box.add(root);

            for (var i = 0; i < 3; i++) {
                var iNode = new twaver.Node();
                iNode.setName(ip + count++);
                iNode.setImage("routerImage");
                this.box.add(iNode);
                var link = new twaver.Link(root, iNode);
                link.setStyle('link.width', 2);
                link.setStyle('link.color', '#00FF00');
                this.box.add(link);
                for (var j = 0; j < 9; j++) {
                    // var bedRoomSofa = new twaver.Follower();
                    // bedRoomSofa.setAngle(225);
                    // bedRoomSofa.setLocation(265 + i * 360,41);
                    // bedRoomSofa.setHost(room);
                    // bedRoomSofa.setImage('bedRoomSofa');
                    // box.add(bedRoomSofa);
                    var jNode = new twaver.Follower();
                    jNode.setName(ip + count++);
                    jNode.setHost(iNode);
                    // if (j % 3 == 0) {
                    //     jNode.getAlarmState().increaseNewAlarm(demo.Util.randomNonClearedSeverity());
                    // }
                    this.box.add(jNode);
                    link = new twaver.Link(iNode, jNode);
                    link.setStyle('link.width', 2);
                    link.setStyle('link.color', '#00FF00');
                    this.box.add(link);
                }
            }
        }
    },
    createGroup: function () {
        if (this.box.getSelectionModel().size() == 0) {
            alert("No Selection");
        } else {
            var group = new twaver.Group();
            group.setStyle('group.fill.color', demo.Util.randomColor());
            group.setStyle('group.shape', 'oval');
            group.setExpanded(false);
            this.box.add(group);

            this.box.getSelectionModel().getSelection().forEach(function (element) {
                if (element instanceof twaver.Node) {
                    group.addChild(element);
                }
            });
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
    randomColor: function () {
        var r = demo.Util.randomInt(255);
        var g = demo.Util.randomInt(255);
        var b = demo.Util.randomInt(255);
        return '#' + this._formatNumber((r << 16) | (g << 8) | b);
    },
    _formatNumber: function (value) {
        var result = value.toString(16);
        while (result.length < 6) {
            result = '0' + result;
        }
        return result;
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