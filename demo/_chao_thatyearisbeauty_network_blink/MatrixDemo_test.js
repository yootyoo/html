MatrixDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.sheet = new twaver.controls.PropertySheet();
    this.titlePane = new twaver.controls.TitlePane(this.sheet, '');
    this.finderByTAG = new twaver.QuickFinder(this.box, 'Tag', 'client');
    this.finderByBID = new twaver.QuickFinder(this.box, 'businessID', 'client');

    this.fillColor = 0x2877A8;
    this.fillAlpha = 1;
    this.increase = false;
};
twaver.Util.ext('MatrixDemo', Object, {
    init: function () {
        var self = this;
        var toolbar = this.createNetworkToolbar(this.network);
        var centerPane = new twaver.controls.BorderPane(this.network, toolbar);
        centerPane.setTopHeight(25);
        var main = document.getElementById('main');
        this.appendChild(centerPane.getView(), main, 0, 0, 0, 0);
        this.addButton(toolbar, 'Create Group', 'group_icon', function () {
            self.createGroup();
        });
        this.addButton(toolbar, 'Start', null, function () {
            self.initBox(true);
        });
        this.titlePane.getView().style.width = '280px';
        this.titlePane.getView().style.height = '310px';
        this.appendChild(this.titlePane.getView(), main, 25, 17, null, null);
        this.initSheet();
        window.onresize = function (e) {
            centerPane.invalidate();
        };

        this.network.setVisibleFunction(function (element) {
            if (self.data.getClient('hide.link') && element instanceof twaver.Link) {
                return false;
            }
            if (!self.data.getClient('NONE') && element.getAlarmState().isEmpty()) {
                return false;
            }
            if (!self.data.getClient('INDETERMINATE') && element.getAlarmState().getAlarmCount(twaver.AlarmSeverity.INDETERMINATE) != 0) {
                return false;
            }
            if (!self.data.getClient('WARNING') && element.getAlarmState().getAlarmCount(twaver.AlarmSeverity.WARNING) != 0) {
                return false;
            }
            if (!self.data.getClient('MINOR') && element.getAlarmState().getAlarmCount(twaver.AlarmSeverity.MINOR) != 0) {
                return false;
            }
            if (!self.data.getClient('MAJOR') && element.getAlarmState().getAlarmCount(twaver.AlarmSeverity.MAJOR) != 0) {
                return false;
            }
            if (!self.data.getClient('CRITICAL') && element.getAlarmState().getAlarmCount(twaver.AlarmSeverity.CRITICAL) != 0) {
                return false;
            }
            return true;
        });

        this.network.getLabel = function (element) {
            if (self.data.getClient('hide.label')) {
                return null;
            } else if (element instanceof MatrixNode) {
                return "TAG(" + element.getClient('Tag') + ") BID(" + element.getClient('businessID') + ")";
            } else {
                return element.getName();
            }
        };

        this.network.getAlarmLabel = function (element) {
            var severity = element.getAlarmState().getHighestNewAlarmSeverity();
            if (!self.data.getClient('hide.alarm') && severity != null) {
                var label = element.getAlarmState().getNewAlarmCount(severity) + severity.nickName;
                if (element.getAlarmState().hasLessSevereNewAlarms()) {
                    label += "+";
                }
                return label;
            }
            return null;
        };

        this.network.getSelectionModel().addSelectionChangeListener(function (e) {
            e.datas.forEach(function (element) {
                var color = this.createColor(this.fillColor, this.fillAlpha);
                //if (element instanceof demo.MatrixNode) {
                //    if (self.box.getSelectionModel().contains(element)) {
                        element.setStyle('body.type', 'default.vector');
                        element.setStyle('vector.fill.color', color);
                    //} else {
                    //    element.setStyle('body.type', 'default');
                    //}
                //}
            }, this);
            if (this.network.getSelectionModel().size() > 0) {
                if (!this.timer) {
                    this.timer = setInterval(function () {
                        self.tick.call(self);
                    }, 300);
                }
            } else {
                window.clearInterval(this.timer);
                this.timer = null;
            }
        }, this);

        //this.network.setRemoveElementUIOnInvisible(true);
        this.initBox(false);
    },
    initSheet: function () {
        this.sheet.setEditable(true);
        var propertyBox = this.sheet.getPropertyBox();
        this.addClientProperty(propertyBox, "row.count").setValueType('int');
        this.addClientProperty(propertyBox, "column.count").setValueType('int');
        this.addClientProperty(propertyBox, "hide.link").setValueType('boolean');
        this.addClientProperty(propertyBox, "hide.label").setValueType('boolean');
        this.addClientProperty(propertyBox, "hide.alarm").setValueType('boolean');
        this.addClientProperty(propertyBox, "NONE").setValueType('boolean');
        this.addClientProperty(propertyBox, "INDETERMINATE").setValueType('boolean');
        this.addClientProperty(propertyBox, "WARNING").setValueType('boolean');
        this.addClientProperty(propertyBox, "MINOR").setValueType('boolean');
        this.addClientProperty(propertyBox, "MAJOR").setValueType('boolean');
        this.addClientProperty(propertyBox, "CRITICAL").setValueType('boolean');
        this.addClientProperty(propertyBox, "remove.on.hidden").setValueType('boolean');
        this.addClientProperty(propertyBox, "no.agent.visible").setValueType('boolean');
        this.addClientProperty(propertyBox, "lookup.by.BID").setValueType('int');
        this.addClientProperty(propertyBox, "lookup.by.TAG").setValueType('int');

        this.data = new twaver.Element();
        this.data.setClient("row.count", 5);
        this.data.setClient("column.count", 5);
        this.data.setClient("hide.link", false);
        this.data.setClient("hide.label", false);
        this.data.setClient("hide.alarm", false);
        this.data.setClient("NONE", true);
        this.data.setClient("INDETERMINATE", true);
        this.data.setClient("WARNING", true);
        this.data.setClient("MINOR", true);
        this.data.setClient("MAJOR", true);
        this.data.setClient("CRITICAL", true);
        this.data.setClient("remove.on.hidden", true);
        this.data.setClient("no.agent.visible", this.network.isNoAgentLinkVisible());
        this.data.setClient("lookup.by.BID", '');
        this.data.setClient("lookup.by.TAG", '');
        this.sheet.getDataBox().add(this.data);
        this.sheet.getDataBox().getSelectionModel().setSelection(this.data);
        this.sheet.getDataBox().addDataPropertyChangeListener(this.handlePropertyChange, this);
    },
    handlePropertyChange: function (e) {
        var name = demo.Util.getPropertyName(e);
        if (name === 'hide.link' || name === 'NONE' || name === 'INDETERMINATE' || name === 'WARNING'
            || name === 'MINOR' || name === 'MAJOR' || name === 'CRITICAL') {
            this.network.invalidateElementVisibility();
        } else if (name === 'hide.label' || name === 'hide.alarm') {
            this.network.invalidateElementUIs();
        } else if (name === 'remove.on.hidden') {
            this.network.setRemoveElementUIOnInvisible(e.newValue);
        } else if (name === 'no.agent.visible') {
            this.network.setNoAgentLinkVisible(e.newValue);
            this.network.invalidateElementUIs(true);
        } else if (name === 'lookup.by.BID') {
            this.lookup(this.finderByBID, e.newValue);
        } else if (name === 'lookup.by.TAG') {
            this.lookup(this.finderByTAG, e.newValue);
        }
    },
    initBox: function (showMessage) {
        this.box.clear();

        var x = this.data.getClient('column.count');
        var y = this.data.getClient('row.count');
        var gap = 180;

        //create nodes
        var nodeCounter = 0;
        var time = new Date().getTime();
        for (var nodeColumn = 0; nodeColumn < x; nodeColumn++) {
            for (var nodeRow = 0; nodeRow < y; nodeRow++) {
                var node = new MatrixNode("node-" + nodeColumn + "-" + nodeRow);
                node.setStyle('image.padding', -10);
                node.setSize(52, 52);

                node.setStyle('vector.shape', 'circle');
                node.setStyle('vector.gradient', 'radial.center');
                node.setStyle('vector.gradient.color', 'rgba(255, 255, 255, 0.5)');
                node.setStyle('vector.fill', true);
                node.setStyle('vector.fill.color', '#' + this.fillColor);

                node.setStyle('label.color', '#0000FF');
                node.setClient('Tag', nodeColumn * x + nodeRow);
                node.setClient('businessID', this.randomInt(100));
                node.setLocation(gap * (nodeColumn + 1), gap * (nodeRow + 1));
                this.box.add(node);
                nodeCounter++;
            }
        }

        var message = "Create " + nodeCounter + " nodes, time cost: " + (new Date().getTime() - time) + " ms";

        time = new Date().getTime();
        var linkCounter = 0;
        var linkWidth = 5;
        //create links.
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                var from, to, link;
                if (i > 0) {
                    from = this.box.getDataById("node-" + i + "-" + j);
                    to = this.box.getDataById("node-" + (i - 1) + "-" + j);
                    link = new twaver.Link(from, to);
                    link.setStyle('link.width', linkWidth);
                    this.box.add(link);
                    linkCounter++;
                }
                if (j > 0) {
                    from = this.box.getDataById("node-" + i + "-" + j);
                    to = this.box.getDataById("node-" + i + "-" + (j - 1));
                    link = new twaver.Link(from, to);
                    link.setStyle('link.width', linkWidth);
                    this.box.add(link);
                    linkCounter++;
                }
            }
        }


        message += "\nCreate " + linkCounter + " links, time cost: " + (new Date().getTime() - time) + " ms";

        time = new Date().getTime();
        var alarmCounter = 0;

        var that = this;
        this.box.forEach(function (element) {
            if (that.randomBoolean()) {
                element.getAlarmState().increaseNewAlarm(that.randomSeverity(), that.randomInt(5) + 1);
                alarmCounter++;
            }
        });

        message += "\nCreate " + alarmCounter + " alarms, time cost: " + (new Date().getTime() - time) + " ms";

        this.titlePane.setTitle("Node:" + nodeCounter + " Link:" + linkCounter + " Alarm:" + alarmCounter);

        if (showMessage) {
            alert(message);
        }

        this.network.zoomOverview(true);
    },
    tick: function () {
        if (this.increase) {
            this.fillAlpha += 0.2
            if (this.fillAlpha > 1) {
                this.fillAlpha = 1;
                this.increase = false;
            }
        } else {
            this.fillAlpha -= 0.2
            if (this.fillAlpha < 0) {
                this.fillAlpha = 0;
                this.increase = true;
            }
        }
        var color = this.createColor(this.fillColor, this.fillAlpha);
        this.box.getSelectionModel().getSelection().forEach(function (element) {
            //if (element instanceof demo.MatrixNode) {
                element.setStyle('vector.fill.color', color);
            //}
        });
    },
    lookup: function (finder, text) {
        this.box.getSelectionModel().clearSelection();
        var elements = finder.find(text).toList(this.network.isVisible, this.network);
        if (elements != null && elements.size() > 0) {
            var fistElement = elements.get(0);
            this.box.getSelectionModel().setSelection(elements);
            this.network.centerByLogicalPoint(fistElement.getX(), fistElement.getY(), true);
        }
    },
    createGroup: function () {
        if (this.box.getSelectionModel().size() == 0) {
            alert("No Selection");
        } else {
            var group = new twaver.Group();
/*            group.setStyle('group.fill.color', demo.Util.randomColor());
            group.setStyle('group.shape', 'oval');*/

            group.setStyle('group.shape', 'roundrect');
            group.setSize(60, 60);
            group.setStyle('image.padding', '-10');
            group.setStyle('select.style', 'none');

            group.setStyle('vector.shape', 'circle');
            group.setStyle('vector.gradient', 'radial.center');
            group.setStyle('vector.gradient.color', 'rgba(255, 255, 255, 0.5)');
            group.setStyle('vector.fill', true);
            group.setStyle('vector.fill.color', '#' + this.fillColor);

            group.setStyle('group.fill.color', '#eaeaff');
            group.setStyle('group.outline.width', '1');
            group.setStyle('group.outline.color', '#ccccff');


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
        var network = new twaver.vector.Network(box);

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

        network.getView().setAttribute('draggable', 'false');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);

        return network;
    },
    createNetworkToolbar: function (network, interaction) {
        var that = this;
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
        this.addButton(toolbar, 'Pan', 'pan', function () {
            network.setPanInteractions();
        });

        this.addButton(toolbar, 'Zoom In', 'zoomIn', function () {
            network.zoomIn();
        });
        this.addButton(toolbar, 'Zoom Out', 'zoomOut', function () {
            network.zoomOut();
        });
        this.addButton(toolbar, 'Zoom Reset', 'zoomReset', function () {
            network.zoomReset();
        });
        this.addButton(toolbar, 'Zoom Overview', 'zoomOverview', function () {
            network.zoomOverview();
        });
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
            var canvas = network.toCanvas(network.getView().scrollWidth, network.getView().scrollHeight);
            if (twaver.Util.isIE) {
                var w = window.open();
                w.document.open();
                w.document.write("<img src='" + canvas.toDataURL() + "'/>");
                w.document.close();
            } else {
                /*var rect = network.getViewRect();
                 console.log(rect);
                 var canvas = network.toCanvas(rect.width, rect.height);*/
                 var imageData = canvas.toDataURL();
                 that.registerImage(imageData);
                 var nodeno = that.box.getDataById("node-" + 1 + "-" + 1);
                 // nodeno.setImage(canvas);
                 nodeno.setImage("Matrix");
                // window.open(canvas.toDataURL(), 'network.png');
            }
        });
        if (this.isFullScreenSupported()) {
            this.addButton(toolbar, 'Full screen', 'fullscreen', function () {
                this.toggleFullscreen();
            });
        }
        return toolbar;
    },
    registerImage: function (url) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        var that = this;
        image.onload = function () {
            twaver.Util.registerImage("Matrix", image, image.height, image.width, that.network);
            image.onload = null;
            if (that.network.invalidateElementUIs) {
                that.network.invalidateElementUIs();
            }
            if (that.network.invalidateDisplay) {
                that.network.invalidateDisplay();
            }
        };
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
    _createElement: function (network, className, centerLocation) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation(centerLocation);
        element.setParent(network.getCurrentSubNetwork());
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
    },
    createColor: function (rgb, a) {
        if (typeof rgb == 'string' && rgb.indexOf('#') == 0) {
            rgb = parseInt(rgb.substring(1, rgb.length), 16);
        }
        var r = (rgb >> 16) & 0xFF;
        var g = (rgb >> 8) & 0xFF;
        var b = rgb & 0xFF;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
    },
    randomSeverity: function () {
        var severities = twaver.AlarmSeverity.severities;
        return severities.get(this.randomInt(severities.size()));
    },
    randomInt: function (n) {
        return Math.floor(Math.random() * n);
    },
    randomBoolean: function () {
        return this.randomInt(2) != 0;
    },
    addClientProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'client');
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
    addInteractionComboBox: function (div, network, interaction) {
        var items = twaver.Util.isTouchable ? ['Touch', 'None'] :
            ['Default-Live', 'Default-Lazy', 'Edit-Live', 'Edit-Lazy', 'Pan','Magnify', 'None'];
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
});

var MatrixNode = function (id) {
    MatrixNode.superClass.constructor.call(this, id);
};
twaver.Util.ext('MatrixNode', twaver.Node, {
    getElementUIClass: function () {
        return MatrixNodeUI;
    }
});
var MatrixNodeUI = function (network, element) {
    MatrixNodeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('MatrixNodeUI', twaver.network.NodeUI, {
    updateMeasure: function () {
        MatrixNodeUI.superClass.updateMeasure.call(this);
        var element = this.getElement();
        var imagePadding = element.getStyle('image.padding');
        var point = { x: element.getX() + element.getWidth() + imagePadding - 3, y: element.getY() - imagePadding + 3 };
        this.setHotSpot(point);
    }
});