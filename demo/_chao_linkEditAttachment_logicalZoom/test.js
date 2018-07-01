DataBox = twaver.DataBox;
ElementBox = twaver.ElementBox;

Data = twaver.Data;
Link = twaver.Link;
Node = twaver.Node;
Property = twaver.Property;
Column = twaver.Column;
Tab = twaver.Tab;
Network = twaver.vector.Network;

Accordion = twaver.controls.Accordion;
BorderPane = twaver.controls.BorderPane;
List = twaver.controls.List;
PropertySheet = twaver.controls.PropertySheet;
SplitPane = twaver.controls.SplitPane;
Table = twaver.controls.Table;
TablePane = twaver.controls.TablePane;
TabPane = twaver.controls.TabPane;
TitlePane = twaver.controls.TitlePane;
Tree = twaver.controls.Tree;
TreeTable = twaver.controls.TreeTable;
demo = {};

demo.Util = {
    registerImage: function (url, svg) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        image.onload = function () {
            twaver.Util.registerImage(demo.Util.getImageName(url), image, image.width, image.height, svg);
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
    createNetworkToolbar: function (network, interaction) {
        var toolbar = document.createElement('div');
        demo.Util.addButton(toolbar, 'Default', 'select', function () {
            if (twaver.Util.isTouchable) {
                network.setTouchInteractions();
            } else {
                network.setDefaultInteractions();
            }
        });
        demo.Util.addButton(toolbar, 'Magnify', 'magnify', function () {
            network.setMagnifyInteractions();
        });
        demo.Util.addButton(toolbar, 'Zoom In', 'zoomIn', function () { network.zoomIn(); });
        demo.Util.addButton(toolbar, 'Zoom Out', 'zoomOut', function () { network.zoomOut(); });
        demo.Util.addButton(toolbar, 'Zoom Reset', 'zoomReset', function () { network.zoomReset(); });
        demo.Util.addButton(toolbar, 'Zoom Overview', 'zoomOverview', function () { network.zoomOverview(); });
        demo.Util.addNetworkTypeComboBox(toolbar, network, interaction);
        demo.Util.addInteractionComboBox(toolbar, network, interaction);
        demo.Util.addZoomManagerComboBox(toolbar, network, interaction);
        demo.Util.addButton(toolbar, 'XML', 'save', function () {
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
        demo.Util.addButton(toolbar, 'Export Image', 'export', function () {
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
        if (demo.Util.isFullScreenSupported()) {
            demo.Util.addButton(toolbar, 'Full screen', 'fullscreen', function () {
                demo.Util.toggleFullscreen();
            });
        }
        return toolbar;
    },
    createTreeToolbar: function (tree) {
        var toolbar = document.createElement('div');
        demo.Util.addButton(toolbar, 'Reset Order', './images/toolbar/reset.png', function () { tree.setSortFunction(null); });
        demo.Util.addButton(toolbar, 'Ascend Order', './images/toolbar/ascend.png', function () {
            tree.setSortFunction(function (d1, d2) {
                if (d1.getName() > d2.getName()) {
                    return 1;
                } else if (d1.getName() == d2.getName()) {
                    return 0;
                } else {
                    return -1;
                }
            });
        });
        demo.Util.addButton(toolbar, 'Descend Order', './images/toolbar/descend.png', function () {
            tree.setSortFunction(function (d1, d2) {
                if (d1.getName() < d2.getName()) {
                    return 1;
                } else if (d1.getName() == d2.getName()) {
                    return 0;
                } else {
                    return -1;
                }
            });
        });
        demo.Util.addButton(toolbar, 'Move Selection To Top', './images/toolbar/top.png', function () { tree.getDataBox().moveSelectionToTop(); });
        demo.Util.addButton(toolbar, 'Move Selection Up', './images/toolbar/up.png', function () { tree.getDataBox().moveSelectionUp(); });
        demo.Util.addButton(toolbar, 'Move Selection Down', './images/toolbar/down.png', function () { tree.getDataBox().moveSelectionDown(); });
        demo.Util.addButton(toolbar, 'Move Selection To Bottom', './images/toolbar/bottom.png', function () { tree.getDataBox().moveSelectionToBottom(); });
        demo.Util.addButton(toolbar, 'Expand', './images/toolbar/expand.png', function () {
            if (tree.getSelectionModel().size() == 1) {
                tree.expand(tree.getSelectionModel().getLastData());
            } else {
                tree.expandAll();
            }
        });
        demo.Util.addButton(toolbar, 'Collapse', './images/toolbar/collapse.png', function () {
            if (tree.getSelectionModel().size() == 1) {
                tree.collapse(tree.getSelectionModel().getLastData());
            } else {
                tree.collapseAll();
            }
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
    addDraggableButton: function (div, name, src, className) {
        var image = new Image();
        image.setAttribute('title', name);
        image.setAttribute('draggable', 'true');
        image.style.cursor = 'move';
        image.style.verticalAlign = 'top';
        image.style.padding = '4px 4px 4px 4px';
        if (src.indexOf('/') < 0) {
            src = '../images/toolbar/' + src + '.png';
        }
        image.setAttribute('src', src);
        image.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', 'className:' + className);
        }, false);
        div.appendChild(image);
        return image;
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
    },
    addZoomManagerComboBox: function (div, network, interaction) {
        var items = twaver.Util.isTouchable ? ['Touch', 'None'] :
        ['Physical', 'Logical', 'Mixed'];
        var callback = function () {
            if (this.value === 'Physical') {
                network.setZoomManager(new twaver.vector.PhysicalZoomManager(network));
            } else if (this.value === 'Logical') {
                network.setZoomManager(new twaver.vector.LogicalZoomManager(network));
            } else if (this.value === 'Mixed') {
                network.setZoomManager(new twaver.vector.MixedZoomManager(network));
            }
        };
        return demo.Util.addComboBox(div, items, callback, interaction);
    },
    addNetworkTypeComboBox: function (div, network, interaction) {
        var items = twaver.Util.isTouchable ? ['Touch', 'None'] :
        ['network', 'canvas', 'vector'];
        var callback = function () {
            if (this.value === 'network') {
                Network = twaver.network.Network;
            } else if (this.value === 'canvas') {
                Network = twaver.canvas.Network;
            } else if (this.value === 'vector') {
                Network = twaver.vector.Network;
            }
        };
        return demo.Util.addComboBox(div, items, callback, interaction);
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
        return demo.Util.addComboBox(div, items, callback, interaction);
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
    initOverviewPopupMenu: function (overview) {
        var popupMenu = new twaver.controls.PopupMenu(overview);
        popupMenu.setMenuItems([
            {label: 'Show Mask', type: 'check', selected: true, action: function (menuItem) {
                if (menuItem.selected) {
                    overview.setFillColor(overview.oldFillColor);
                    delete overview.oldFillColor;
                } else {
                    overview.oldFillColor = overview.getFillColor();
                    overview.setFillColor('rgba(0, 0, 0, 0)');
                }
            }},
            {label: 'Show Border', type: 'check', selected: true, action: function (menuItem) {
                if (menuItem.selected) {
                    overview.setOutlineColor(overview.oldOutlineColor);
                    delete overview.oldOutlineColor;
                } else {
                    overview.oldOutlineColor = overview.getOutlineColor();
                    overview.setOutlineColor('rgba(0, 0, 0, 0)');
                }
            }}
            ]);
    },
    addInput: function (div, value, name, callback) {
        var input = document.createElement('input');
        input.id = name;
        input.value = value;
        input.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                callback(input.value);
            }
        }, false);
        var label = document.createElement('label');
        label.htmlFor = name;
        label.innerHTML = name;
        div.appendChild(label);
        div.appendChild(input);
        return input;
    },
    addTab: function (tabPane, name, view, selected, closable) {
        var tab = new twaver.Tab(name);
        tab.setName(name);
        tab.setView(view);
        tabPane.getTabBox().add(tab);
        tab.setClosable(closable);
        if (selected) {
            tabPane.getTabBox().getSelectionModel().setSelection(tab);
        }
        return tab;
    },
    randomInt: function (n) {
        return Math.floor(Math.random() * n);
    },
    randomBoolean: function () {
        return demo.Util.randomInt(2) != 0;
    },
    randomNonClearedSeverity: function () {
        while (true) {
            var severity = demo.Util.randomSeverity();
            if (!twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                return severity;
            }
        }
        return null;
    },
    randomSeverity: function () {
        var severities = twaver.AlarmSeverity.severities;
        return severities.get(demo.Util.randomInt(severities.size()));
    },
    randomColor: function () {
        var r = demo.Util.randomInt(255);
        var g = demo.Util.randomInt(255);
        var b = demo.Util.randomInt(255);
        return '#' + demo.Util._formatNumber((r << 16) | (g << 8) | b);
    },
    randomAlarm: function (alarmID, elementID, nonClearedSeverity) {
        var alarm = new twaver.Alarm(alarmID, elementID);
        alarm.setAcked(demo.Util.randomBoolean());
        alarm.setCleared(demo.Util.randomBoolean());
        alarm.setAlarmSeverity(nonClearedSeverity ? demo.Util.randomNonClearedSeverity() : demo.Util.randomSeverity());
        alarm.setClient('raisedTime', new Date());
        return alarm;
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
    _formatNumber: function (value) {
        var result = value.toString(16);
        while (result.length < 6) {
            result = '0' + result;
        }
        return result;
    },
    loadXmlString: function (xml) {
        var xmlDoc;
        if (!twaver.Util.isIE && window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, 'text/xml');
        } else {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        }
        return xmlDoc;
    },
    loadXmlFile: function (url) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', url, false);
        xhttp.send();
        return xhttp.responseXML;
    },
    addStyleProperty: function (box, propertyName, category, name) {
        return demo.Util._addProperty(box, propertyName, category, name, 'style');
    },
    addClientProperty: function (box, propertyName, category, name) {
        return demo.Util._addProperty(box, propertyName, category, name, 'client');
    },
    addAccessorProperty: function (box, propertyName, category, name) {
        return demo.Util._addProperty(box, propertyName, category, name, 'accessor');
    },
    _addProperty: function (box, propertyName, category, name, proprtyType) {
        var property = new twaver.Property();
        property.setCategoryName(category);
        if (!name) {
            name = demo.Util._getNameFromPropertyName(propertyName);
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
    createColumn: function (table, name, propertyName, propertyType, valueType, editable) {
        var column = new twaver.Column(name);
        column.setName(name);
        column.setPropertyName(propertyName);
        column.setPropertyType(propertyType);
        if (valueType) column.setValueType(valueType);
        column.setEditable(editable);
        column.renderHeader = function (div) {
            var span = document.createElement('span');
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = column.getName() ? column.getName() : column.getPropertyName();
            span.setAttribute('title', span.innerHTML);
            span.style.font = 'bold 12px Helvetica';
            div.style.textAlign = 'center';
            div.appendChild(span);
        };
        table.getColumnBox().add(column);
        return column;
    },
    formatDate: function (date, format) {
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return format;
        },
        getPropertyName: function (e) {
            var name = e.property;
            if (name.indexOf('C:') == 0) {
                return name.substring(2, name.length);
            }
            if (name.indexOf('S:') == 0) {
                return name.substring(2, name.length);
            }
            return name;
        },
        align: function (elements, alignType) {
            if (!alignType) {
                throw new Error("align type can't be null");
            }
            elements = demo.Util._checkAndFilter(elements);
            if (elements == null) {
                return;
            }
            var bounds = demo.Util._getBounds(elements);
            if (bounds == null || bounds.x == Number.MAX_VALUE) {
                return;
            }
            alignType = alignType.toLowerCase();
            elements.forEach(function (node, index, array) {
                if (!(node instanceof twaver.Node)) {
                    return;
                }
                var x = node.getX();
                var y = node.getY();
                switch (alignType) {
                    case 'left':
                    x = bounds.x;
                    break;
                    case 'right':
                    x = bounds.x + bounds.width - node.getWidth();
                    break;
                    case 'top':
                    y = bounds.y;
                    break;
                    case 'bottom':
                    y = bounds.y + bounds.height - node.getHeight();
                    break;
                    case 'horizontalcenter':
                    x = bounds.x + (bounds.x + bounds.width - bounds.x - node.getWidth()) / 2;
                    break;
                    case 'verticalcenter':
                    y = bounds.y + (bounds.y + bounds.height - bounds.y - node.getHeight()) / 2;
                    break;
                }
                node.setLocation(x, y);
            });
        },
        evenSpace: function (elements, isHorizontal, isEvenGap) {
            if (!isEvenGap) {
                isEvenGap = true;
            }
            elements = demo.Util._checkAndFilter(elements);
            if (elements == null) {
                return;
            }
            var bounds = demo.Util._getBounds(elements);
            if (bounds == null || bounds.x == Number.MAX_VALUE) {
                return;
            }
            elements.sort(function (item1, item2) {
                return isHorizontal ? (item1.getX() - item2.getX()) : (item1.getY() - item2.getY());
            });

            var count = elements.length;
            var lastItem = elements[count - 1];
            var gap;
            if (isEvenGap) {
                var realSize = 0;
                elements.forEach(function (item, index, array) {
                    realSize += isHorizontal ? item.getWidth() : item.getHeight();
                });
                gap = ((isHorizontal ? bounds.width : bounds.height) - realSize) / (count - 1);
            } else {
                gap = (isHorizontal ? (bounds.width - lastItem.getWidth()) : (bounds.height - lastItem.getHeight())) / (count - 1);
            }
            var currentLocation = isHorizontal ? bounds.x : bounds.y;

            elements.forEach(function (node, index, array) {
                if (!(node instanceof twaver.Node)) {
                    return;
                }
                if (isHorizontal) {
                    node.setLocation(currentLocation + index * gap, node.getY());
                } else {
                    node.setLocation(node.getX(), currentLocation + index * gap);
                }
                if (isEvenGap) {
                    currentLocation += isHorizontal ? node.getWidth() : node.getHeight();
                }
            });
        },
        _checkAndFilter: function (elements) {
            if (!elements || elements.length == 0) {
                return null;
            }
            elements = elements.filter(function (item, index, array) {
                return item instanceof twaver.Node;
            });
            if (elements.length <= 1) {
                return null;
            }
            return elements;
        },
        _getBounds: function (elements) {
            var xMin = Number.MAX_VALUE;
            var xMax = Number.MIN_VALUE;
            var yMin = Number.MAX_VALUE;
            var yMax = Number.MIN_VALUE;

            elements.forEach(function (node, index, array) {
                if (node instanceof twaver.Node) {
                    var x = node.getX();
                    xMin = Math.min(x, xMin);
                    var width = node.getWidth();
                    xMax = Math.max(x + width, xMax);
                    var y = node.getY();
                    yMin = Math.min(y, yMin);
                    var height = node.getHeight();
                    yMax = Math.max(y + height, yMax);
                }
            });
            return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
        },
        initPropertySheet: function (sheet) {
            sheet.setEditable(true);
            var sheetBox = sheet.getPropertyBox();

            var addAlarmProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Alarm', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addAlarmProperty('alarm.alpha');
            addAlarmProperty('alarm.color');
            addAlarmProperty('alarm.font');
            addAlarmProperty('alarm.position').setEnumInfo(demo.ATTACHMENT_POSITION_TYPE);
            addAlarmProperty('alarm.direction').setEnumInfo(demo.ATTACHMENT_DIRECTION_TYPE);
            addAlarmProperty('alarm.corner.radius');
            addAlarmProperty('alarm.pointer.length');
            addAlarmProperty('alarm.pointer.width');
            addAlarmProperty('alarm.xoffset');
            addAlarmProperty('alarm.yoffset');
            addAlarmProperty('alarm.padding');
            addAlarmProperty('alarm.padding.left');
            addAlarmProperty('alarm.padding.right');
            addAlarmProperty('alarm.padding.top');
            addAlarmProperty('alarm.padding.bottom');
            addAlarmProperty('alarm.gradient').setEnumInfo(demo.GRADIENT_TYPE);
            addAlarmProperty('alarm.gradient.color');
            addAlarmProperty('alarm.outline.width');
            addAlarmProperty('alarm.outline.color');
            addAlarmProperty('alarm.cap').setEnumInfo(demo.CAP_TYPE);
            addAlarmProperty('alarm.join').setEnumInfo(demo.JOIN_TYPE);
            addAlarmProperty('alarm.shadowable');

            var isElementVisible = function (data) {
                return data instanceof twaver.Element;
            };
            var addElementProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Basic', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addElementProperty('id', 'accessor', false);
            addElementProperty('name', 'accessor', true);
            addElementProperty('icon', 'accessor', true);
            addElementProperty('toolTip', 'accessor', true);
            addElementProperty('parent', 'accessor', false);
            addElementProperty('layerId', 'accessor', true);
            addElementProperty('whole.alpha');
            addElementProperty('network.label');

            var isBusVisible = function (data) {
                return data instanceof twaver.Bus;
            };
            var addBusProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Bus', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isBusVisible;
                return property;
            };
            addBusProperty('bus.style').setEnumInfo(demo.BUS_STYLE_TYPE);

            var isFollowerVisible = function (data) {
                return data instanceof twaver.Follower;
            };
            var addFollowerProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Follower', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isFollowerVisible;
                return property;
            };
            addFollowerProperty('host', 'accessor', false);
            addFollowerProperty('follower.row.index');
            addFollowerProperty('follower.column.index');
            addFollowerProperty('follower.row.span');
            addFollowerProperty('follower.column.span');
            addFollowerProperty('follower.padding');
            addFollowerProperty('follower.padding.left');
            addFollowerProperty('follower.padding.right');
            addFollowerProperty('follower.padding.top');
            addFollowerProperty('follower.padding.bottom');

            var isGroupVisible = function (data) {
                return data instanceof twaver.Group;
            };
            var addGroupProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Group', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isGroupVisible;
                return property;
            };
            addGroupProperty('expanded', 'accessor', true);
            addGroupProperty('group.shape').setEnumInfo(demo.SHAPE_TYPE);
            addGroupProperty('group.fill');
            addGroupProperty('group.fill.color');
            addGroupProperty('group.outline.width');
            addGroupProperty('group.outline.color');
            addGroupProperty('group.gradient').setEnumInfo(demo.GRADIENT_TYPE);
            addGroupProperty('group.gradient.color');
            addGroupProperty('group.padding');
            addGroupProperty('group.padding.left');
            addGroupProperty('group.padding.right');
            addGroupProperty('group.padding.top');
            addGroupProperty('group.padding.bottom');
            addGroupProperty('group.cap').setEnumInfo(demo.CAP_TYPE);
            addGroupProperty('group.join').setEnumInfo(demo.JOIN_TYPE);
            addGroupProperty('group.deep');

            var isGridVisible = function (data) {
                return data instanceof twaver.Grid;
            };
            var addGridProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Grid', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isGridVisible;
                return property;
            };
            addGridProperty('grid.row.count');
            addGridProperty('grid.column.count');
            addGridProperty('grid.row.percents');
            addGridProperty('grid.column.percents');
            addGridProperty('grid.border');
            addGridProperty('grid.border.left');
            addGridProperty('grid.border.right');
            addGridProperty('grid.border.top');
            addGridProperty('grid.border.bottom');
            addGridProperty('grid.padding');
            addGridProperty('grid.padding.left');
            addGridProperty('grid.padding.right');
            addGridProperty('grid.padding.top');
            addGridProperty('grid.padding.bottom');
            addGridProperty('grid.fill');
            addGridProperty('grid.fill.color');
            addGridProperty('grid.deep');
            addGridProperty('grid.cell.deep');

            var addLabelProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Label', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addLabelProperty('label.alpha');
            addLabelProperty('label.color');
            addLabelProperty('label.font');
            addLabelProperty('label.position').setEnumInfo(demo.ATTACHMENT_POSITION_TYPE);
            addLabelProperty('label.direction').setEnumInfo(demo.ATTACHMENT_DIRECTION_TYPE);
            addLabelProperty('label.corner.radius');
            addLabelProperty('label.pointer.length');
            addLabelProperty('label.pointer.width');
            addLabelProperty('label.xoffset');
            addLabelProperty('label.yoffset');
            addLabelProperty('label.padding');
            addLabelProperty('label.padding.left');
            addLabelProperty('label.padding.right');
            addLabelProperty('label.padding.top');
            addLabelProperty('label.padding.bottom');
            addLabelProperty('label.fill');
            addLabelProperty('label.fill.color');
            addLabelProperty('label.gradient').setEnumInfo(demo.GRADIENT_TYPE);
            addLabelProperty('label.gradient.color');
            addLabelProperty('label.outline.width');
            addLabelProperty('label.outline.color');
            addLabelProperty('label.cap').setEnumInfo(demo.CAP_TYPE);
            addLabelProperty('label.join').setEnumInfo(demo.JOIN_TYPE);
            addLabelProperty('label.shadowable');

            var isLinkVisible = function (data) {
                return data instanceof twaver.Link;
            };
            var addLinkProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Link', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isLinkVisible;
                return property;
            };
            addLinkProperty('fromNode', 'accessor', false);
            addLinkProperty('toNode', 'accessor', false);
            addLinkProperty('link.color');
            addLinkProperty('link.width');
            addLinkProperty('link.cap').setEnumInfo(demo.CAP_TYPE);
            addLinkProperty('link.join').setEnumInfo(demo.JOIN_TYPE);
            addLinkProperty('link.type').setEnumInfo(demo.LINK_TYPE);
            addLinkProperty('link.pattern');
            addLinkProperty('link.extend');
            addLinkProperty('link.control.point');
            addLinkProperty('link.bundle.id');
            addLinkProperty('link.bundle.enable');
            addLinkProperty('link.bundle.expanded');
            addLinkProperty('link.bundle.independent');
            addLinkProperty('link.bundle.offset');
            addLinkProperty('link.bundle.gap');
            addLinkProperty('link.looped.gap');
            addLinkProperty('link.looped.direction').setEnumInfo(demo.DIRECTION_TYPE);
            addLinkProperty('link.looped.type').setEnumInfo(demo.LINK_LOOPED_TYPE);
            addLinkProperty('link.from.position').setEnumInfo(demo.POSITION_TYPE);
            addLinkProperty('link.from.xoffset');
            addLinkProperty('link.from.yoffset');
            addLinkProperty('link.from.at.edge');
            addLinkProperty('link.to.position').setEnumInfo(demo.POSITION_TYPE);
            addLinkProperty('link.to.xoffset');
            addLinkProperty('link.to.yoffset');
            addLinkProperty('link.to.at.edge');
            addLinkProperty('link.split.by.percent');
            addLinkProperty('link.split.percent');
            addLinkProperty('link.split.value');
            addLinkProperty('link.corner').setEnumInfo(demo.LINK_CORNER_TYPE);
            addLinkProperty('link.xradius');
            addLinkProperty('link.yradius');
            addLinkProperty('link.flow');
            addLinkProperty('link.flow.converse');
            addLinkProperty('link.flow.stepping');
            addLinkProperty('link.flow.color');

            var addLinkHandleProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Link Handle', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isLinkVisible;
                return property;
            };
            addLinkHandleProperty('link.handler.alpha');
            addLinkHandleProperty('link.handler.color');
            addLinkHandleProperty('link.handler.font');
            addLinkHandleProperty('link.handler.position').setEnumInfo(demo.ATTACHMENT_POSITION_TYPE);
            addLinkHandleProperty('link.handler.direction').setEnumInfo(demo.ATTACHMENT_DIRECTION_TYPE);
            addLinkHandleProperty('link.handler.corner.radius');
            addLinkHandleProperty('link.handler.pointer.length');
            addLinkHandleProperty('link.handler.pointer.width');
            addLinkHandleProperty('link.handler.xoffset');
            addLinkHandleProperty('link.handler.yoffset');
            addLinkHandleProperty('link.handler.padding');
            addLinkHandleProperty('link.handler.padding.left');
            addLinkHandleProperty('link.handler.padding.right');
            addLinkHandleProperty('link.handler.padding.top');
            addLinkHandleProperty('link.handler.padding.bottom');
            addLinkHandleProperty('link.handler.fill');
            addLinkHandleProperty('link.handler.fill.color');
            addLinkHandleProperty('link.handler.gradient').setEnumInfo(demo.GRADIENT_TYPE);
            addLinkHandleProperty('link.handler.gradient.color');
            addLinkHandleProperty('link.handler.outline.width');
            addLinkHandleProperty('link.handler.outline.color');
            addLinkHandleProperty('link.handler.cap').setEnumInfo(demo.CAP_TYPE);
            addLinkHandleProperty('link.handler.join').setEnumInfo(demo.JOIN_TYPE);
            addLinkHandleProperty('link.handler.shadowable');

            var addLinkArrowProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Link Arrow', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isLinkVisible;
                return property;
            };
            addLinkArrowProperty('arrow.from');
            addLinkArrowProperty('arrow.from.fill');
            addLinkArrowProperty('arrow.from.shape').setEnumInfo(demo.ARROW_SHAPE_TYPE);
            addLinkArrowProperty('arrow.from.color');
            addLinkArrowProperty('arrow.from.xoffset');
            addLinkArrowProperty('arrow.from.yoffset');
            addLinkArrowProperty('arrow.from.width');
            addLinkArrowProperty('arrow.from.height');
            addLinkArrowProperty('arrow.from.outline.color');
            addLinkArrowProperty('arrow.from.outline.width');
            addLinkArrowProperty('arrow.from.at.edge');

            addLinkArrowProperty('arrow.to');
            addLinkArrowProperty('arrow.to.fill');
            addLinkArrowProperty('arrow.to.shape').setEnumInfo(demo.ARROW_SHAPE_TYPE);
            addLinkArrowProperty('arrow.to.color');
            addLinkArrowProperty('arrow.to.xoffset');
            addLinkArrowProperty('arrow.to.yoffset');
            addLinkArrowProperty('arrow.to.width');
            addLinkArrowProperty('arrow.to.height');
            addLinkArrowProperty('arrow.to.outline.color');
            addLinkArrowProperty('arrow.to.outline.width');
            addLinkArrowProperty('arrow.to.at.edge');

            var isNodeVisible = function (data) {
                return data instanceof twaver.Node;
            };
            var addNodeProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Node', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isNodeVisible;
                return property;
            };
            addNodeProperty('image', 'accessor', true);
            addNodeProperty('location', 'accessor', true);
            addNodeProperty('width', 'accessor', true);
            addNodeProperty('height', 'accessor', true);
            addNodeProperty('body.type').setEnumInfo(demo.BODY_TYPE);
            addNodeProperty('angle', 'accessor', true);

            var addIconsProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Icons', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addIconsProperty('icons.names');
            addIconsProperty('icons.colors');
            addIconsProperty('icons.position').setEnumInfo(demo.ATTACHMENT_POSITION_TYPE);
            addIconsProperty('icons.orientation').setEnumInfo(demo.ORIENTATION_TYPE);
            addIconsProperty('icons.xoffset');
            addIconsProperty('icons.yoffset');
            addIconsProperty('icons.xgap');
            addIconsProperty('icons.ygap');

            var addImageProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Image', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isNodeVisible;
                return property;
            };
            addImageProperty('image.padding');
            addImageProperty('image.padding.left');
            addImageProperty('image.padding.right');
            addImageProperty('image.padding.top');
            addImageProperty('image.padding.bottom');

            var addSelectProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Select', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addSelectProperty('select.style').setEnumInfo(demo.SELECT_TYPE);
            addSelectProperty('select.color');
            addSelectProperty('select.shape').setEnumInfo(demo.SHAPE_TYPE);
            addSelectProperty('select.width');
            addSelectProperty('select.padding');
            addSelectProperty('select.padding.left');
            addSelectProperty('select.padding.right');
            addSelectProperty('select.padding.top');
            addSelectProperty('select.padding.bottom');
            addSelectProperty('select.cap').setEnumInfo(demo.CAP_TYPE);
            addSelectProperty('select.join').setEnumInfo(demo.JOIN_TYPE);

            var addShadowProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Shadow', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isElementVisible;
                return property;
            };
            addShadowProperty('shadow.color');
            addShadowProperty('shadow.xoffset');
            addShadowProperty('shadow.yoffset');
            addShadowProperty('shadow.blur');

            var isShapeLinkVisible = function (data) {
                return data instanceof twaver.ShapeLink;
            };
            var addShapeLinkProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'ShapeLink', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isShapeLinkVisible;
                return property;
            };
            addShapeLinkProperty('points', 'accessor', false);
            addShapeLinkProperty('shapelink.type').setEnumInfo(demo.SHAPELINK_TYPE);

            var isShapeNodeVisible = function (data) {
                return data instanceof twaver.ShapeNode;
            };
            var addShapeNodeProperty = function (propertyName, propertyType, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'ShapeNode', null, propertyType == null ? 'style' : propertyType);
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isShapeNodeVisible;
                return property;
            };
            addShapeNodeProperty('points', 'accessor', false);
            addShapeNodeProperty('segments', 'accessor', false);
            addShapeNodeProperty('shapenode.closed');

            var addVectorProperty = function (propertyName, editable) {
                var property = demo.Util._addProperty(sheetBox, propertyName, 'Vector', null, 'style');
                property.setEditable(editable == null ? true : editable);
                property.isVisible = isNodeVisible;
                return property;
            };
            addVectorProperty('vector.shape').setEnumInfo(demo.SHAPE_TYPE);
            addVectorProperty('vector.fill');
            addVectorProperty('vector.fill.color');
            addVectorProperty('vector.outline.width');
            addVectorProperty('vector.outline.pattern');
            addVectorProperty('vector.outline.color');
            addVectorProperty('vector.gradient').setEnumInfo(demo.GRADIENT_TYPE);
            addVectorProperty('vector.gradient.color');
            addVectorProperty('vector.padding');
            addVectorProperty('vector.padding.left');
            addVectorProperty('vector.padding.right');
            addVectorProperty('vector.padding.top');
            addVectorProperty('vector.padding.bottom');
            addVectorProperty('vector.cap').setEnumInfo(demo.CAP_TYPE);
            addVectorProperty('vector.join').setEnumInfo(demo.JOIN_TYPE);
            addVectorProperty('vector.deep');


        },
        createDraggableNetwork: function (box) {
            var network = new Network(box);
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
        _createElement: function (network, className, centerLocation) {
            var element = twaver.Util.newInstance(className);
            element.setCenterLocation(centerLocation);
            element.setParent(network.getCurrentSubNetwork());
            network.getElementBox().add(element);
            network.getElementBox().getSelectionModel().setSelection(element);
        },
        isFullScreenSupported: function () {
            var docElm = document.documentElement;
            return docElm.requestFullscreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen;
        },
        toggleFullscreen: function () {
            if (demo.Util.isFullScreenSupported()) {
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
        }
    };
    demo.SHAPE_TYPE = ['rectangle', 'oval', 'roundrect', 'star', 'triangle', 'circle', 'hexagon', 'pentagon', 'diamond'];
    demo.GRADIENT_TYPE = ['linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'];
    demo.DIRECTION_TYPE = ['northwest', 'north', 'northeast', 'east', 'west', 'south', 'southwest', 'southeast'];
    demo.ATTACHMENT_DIRECTION_TYPE = ['aboveleft', 'aboveright', 'belowleft', 'belowright', 'leftabove', 'leftbelow', 'rightabove', 'rightbelow', 'above', 'below', 'left', 'right'];
    demo.POSITION_TYPE = ['topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'];
    demo.ATTACHMENT_POSITION_TYPE = ['hotspot',
    'from',
    'to',
    'topleft.topleft',
    'topleft.topright',
    'top.top',
    'topright.topleft',
    'topright.topright',
    'topleft',
    'top',
    'topright',
    'topleft.bottomleft',
    'topleft.bottomright',
    'top.bottom',
    'topright.bottomleft',
    'topright.bottomright',
    'left.left',
    'left',
    'left.right',
    'center',
    'right.left',
    'right',
    'right.right',
    'bottomleft.topleft',
    'bottomleft.topright',
    'bottom.top',
    'bottomright.topleft',
    'bottomright.topright',
    'bottomleft',
    'bottom',
    'bottomright',
    'bottomleft.bottomleft',
    'bottomleft.bottomright',
    'bottom.bottom',
    'bottomright.bottomleft',
    'bottomright.bottomright'];
    demo.LINK_TYPE = ['arc', 'triangle', 'parallel', 'flexional', 'flexional.horizontal', 'flexional.vertical', 'orthogonal', , 'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V', 'orthogonal.V.H', 'extend.top', 'extend.left', 'extend.bottom', 'extend.right'];
    demo.LINK_LOOPED_TYPE = ['arc', 'rectangle'];
    demo.LINK_CORNER_TYPE = ['none', 'round', 'bevel'];
    demo.LAYOUT_TYPE = ['round', 'topbottom', 'bottomtop', 'symmetry', 'rightleft', 'leftright', 'hierarchic'];
    demo.BUS_STYLE_TYPE = ['nearby', 'north', 'south', 'west', 'east'];
    demo.SHAPELINK_TYPE = ['lineto', 'quadto', 'cubicto','orthogonalto'];
    demo.BODY_TYPE = ['none', 'default', 'vector', 'default.vector', 'vector.default'];
    demo.SEGMENT_TYPE = ['moveto', 'lineto', 'quadto', 'cubicto'];
    demo.CAP_TYPE = ['butt', 'round', 'square'];
    demo.JOIN_TYPE = ['miter', 'round', 'bevel'];
    demo.ORIENTATION_TYPE = ['top', 'left', 'bottom', 'right'];
    demo.SELECT_TYPE = ['none', 'shadow', 'border'];
    demo.ARROW_SHAPE_TYPE = ['arrow.standard', 'arrow.delta', 'arrow.diamond', 'arrow.short', 'arrow.slant'];

    demo.ChipNode = function (id) {
        demo.ChipNode.superClass.constructor.call(this, id);
    }
    twaver.Util.ext('demo.ChipNode', twaver.Node, {
        getElementUIClass: function () {
            return demo.ChipNodeUI;
        },
        getCanvasUIClass: function () {
            return demo.CanvasChipNodeUI;
        }
    });
    demo.ChipNodeUI = function (network, element) {
        demo.ChipNodeUI.superClass.constructor.call(this, network, element);
    };

    demo.CanvasChipNodeUI = function (network, element) {
        demo.CanvasChipNodeUI.superClass.constructor.call(this, network, element);
    };

    twaver.Util.ext('demo.ChipNodeUI', twaver.network.NodeUI, {
        drawTopPin: function (ctx) {
            var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
            var offsetX = (gap + 10) / 2;
            var offsetY = 0;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
                ctx.moveTo(offsetX + i * gap, offsetY + 5);
                ctx.lineTo(offsetX + i * gap, offsetY);
            }
            ctx.stroke();
        },
        drawBottomPin: function (ctx) {
            var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
            var offsetX = (gap + 10) / 2;
            var offsetY = this.getElement().getHeight() + 5;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
                ctx.moveTo(offsetX + i * gap, offsetY + 5);
                ctx.lineTo(offsetX + i * gap, offsetY);
            }
            ctx.stroke();
        },
        drawLeftPin: function (ctx) {
            var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
            var offsetX = 0;
            var offsetY = (gap + 10) / 2;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
                ctx.moveTo(offsetX + 5, offsetY + i * gap);
                ctx.lineTo(offsetX, offsetY + i * gap);
            }
            ctx.stroke();
        },
        drawRightPin: function (ctx) {
            var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
            var offsetX = this.getElement().getWidth() + 5;
            var offsetY = (gap + 10) / 2;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
                ctx.moveTo(offsetX + 5, offsetY + i * gap);
                ctx.lineTo(offsetX, offsetY + i * gap);
            }
            ctx.stroke();
        },
        drawBody: function () {
            twaver.network.NodeUI.prototype.drawBody.call(this);
            if (this.getNetwork().pinVisible) {
                if (!this.pinCanvas) {
                    this.pinCanvas = document.createElement("canvas");
                    this.pinCanvas.style.position = 'absolute';
                }

                var rect = this.getBodyRect();
                twaver.Util.grow(rect, 5, 5);
                this.pinCanvas.style.left = rect.x + 'px';
                this.pinCanvas.style.top = rect.y + 'px';
                this.pinCanvas.setAttribute('width', rect.width);
                this.pinCanvas.setAttribute('height', rect.height);
                var ctx = this.pinCanvas.getContext("2d");
                this.drawTopPin(ctx);
                this.drawBottomPin(ctx);
                this.drawLeftPin(ctx);
                this.drawRightPin(ctx);

                this.addBodyBounds(rect);
                this.addComponent(this.pinCanvas);
                this.pinCanvas._viewRect = rect;
            }
        },
        hit: function (x, y) {
            return twaver.Util.containsPoint(this.getViewRect(), x, y);
        }
    });

    twaver.Util.ext('demo.CanvasChipNodeUI', twaver.canvas.NodeUI, {
        drawTopPin: function (ctx) {
            var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
            var offsetX = this.getElement().getX() + gap / 2;
            var offsetY = this.getElement().getY();
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
                ctx.moveTo(offsetX + i * gap, offsetY - 5);
                ctx.lineTo(offsetX + i * gap, offsetY);
            }
            ctx.stroke();
        },
        drawBottomPin: function (ctx) {
            var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
            var offsetX = this.getElement().getX() + gap / 2;
            var offsetY = this.getElement().getY() + this.getElement().getHeight();
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
                ctx.moveTo(offsetX + i * gap, offsetY + 5);
                ctx.lineTo(offsetX + i * gap, offsetY);
            }
            ctx.stroke();
        },
        drawLeftPin: function (ctx) {
            var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
            var offsetX = this.getElement().getX();
            var offsetY = this.getElement().getY() + gap / 2;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
                ctx.moveTo(offsetX - 5, offsetY + i * gap);
                ctx.lineTo(offsetX, offsetY + i * gap);
            }
            ctx.stroke();
        },
        drawRightPin: function (ctx) {
            var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
            var offsetX = this.getElement().getX() + this.getElement().getWidth();
            var offsetY = this.getElement().getY() + gap / 2;
            ctx.beginPath();
            for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
                ctx.moveTo(offsetX + 5, offsetY + i * gap);
                ctx.lineTo(offsetX, offsetY + i * gap);
            }
            ctx.stroke();
        },
        paintBody: function (ctx) {
            twaver.canvas.NodeUI.prototype.paintBody.call(this, ctx);
            if (this.getNetwork().pinVisible) {
                this.drawTopPin(ctx);
                this.drawBottomPin(ctx);
                this.drawLeftPin(ctx);
                this.drawRightPin(ctx);
            }
        },
        hit: function (x, y) {
            return twaver.Util.containsPoint(this.getViewRect(), x, y);
        }
    });

    demo.Rack = function (id) {
        demo.Rack.superClass.constructor.call(this, id);

        this.setIcon('rack_icon');
        this.setStyle('body.type', 'vector');
        this.setStyle('vector.shape', 'rectangle');
        this.setStyle('vector.gradient', 'none');
        this.setStyle('vector.fill.color', '#C0C0C0');
        this.setStyle('vector.deep', 8);
        this.setWidth(160);
        this.setHeight(160);
    };
    twaver.Util.ext('demo.Rack', twaver.Follower);

    demo.Card = function (id) {
        demo.Card.superClass.constructor.call(this, id);

        this.setIcon('card_icon');
        this.setStyle('body.type', 'vector');
        this.setStyle('vector.shape', 'rectangle');
        this.setStyle('vector.gradient', 'none');
        this.setStyle('vector.deep', 2);
        this.setWidth(30);
        this.setHeight(100);
    };
    twaver.Util.ext('demo.Card', twaver.Follower);

    demo.LED = function (id) {
        demo.LED.superClass.constructor.call(this, id);

        this.setIcon('led_icon');
        this.setStyle('body.type', 'vector');
        this.setStyle('vector.shape', 'circle');
        this.setStyle('vector.gradient', 'radial.southwest');
        this.setStyle('vector.fill.color', '#00FF00');
        this.setWidth(20);
        this.setHeight(20);
    };
    twaver.Util.ext('demo.LED', twaver.Follower);

    demo.Port = function (id) {
        demo.Port.superClass.constructor.call(this, id);

        this.setIcon('port_icon');
        this.setImage('port_image');
    };
    twaver.Util.ext('demo.Port', twaver.Follower);

    demo.Shelf = function (id) {
        demo.Shelf.superClass.constructor.call(this, id);

        this.setIcon('shelf_icon');
        this.setStyle('grid.row.count', 1);
        this.setStyle('grid.column.count', 4);
        this.setStyle('grid.padding', 2);
        this.setWidth(160);
        this.setHeight(120);
    };
    twaver.Util.ext('demo.Shelf', twaver.Grid);

    demo.Slot = function (id) {
        demo.Slot.superClass.constructor.call(this, id);

        this.setIcon('slot_icon');
        this.setStyle('outer.padding', 0);
        this.setWidth(35);
        this.setHeight(105);
    };
    twaver.Util.ext('demo.Slot', twaver.Grid);

    demo.Text = function (id) {
        demo.Text.superClass.constructor.call(this, id);

        this.setStyle('body.type', 'none');
        this.setSize(0, 0);
        this.setName('Text');
    };
    twaver.Util.ext('demo.Text', twaver.Follower);

    demo.KPICard = function (id) {
        demo.KPICard.superClass.constructor.call(this, id);
    };
    twaver.Util.ext('demo.KPICard', twaver.Grid, {
        getElementUIClass: function () {
            return demo.KPICardUI;
        }
    });

    demo.KPICardUI = function (network, element) {
        demo.KPICardUI.superClass.constructor.call(this, network, element);
    };
    twaver.Util.ext('demo.KPICardUI', twaver.network.GridUI, {
        drawBody: function () {
            if (!this._nodeCanvas) {
                this._nodeCanvas = twaver.Util.createCanvas();
            }
            this.addComponent(this._nodeCanvas);
            var rect = this.getBodyRect();
            var bounds = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
            var g = this.setShadow(this, this._nodeCanvas, rect);

            g.fillStyle = '#000000';
            g.rect(rect.x, rect.y, rect.width, rect.height);
            g.fill();

            twaver.Util.grow(rect, -4, -4);
            g.strokeStyle = '#FFFFFF';
            g.lineWidth = 1;
            g.beginPath();
            g.rect(rect.x, rect.y, rect.width, rect.height);
            g.stroke();

            twaver.Util.grow(rect, -1, 0);
            var value = this.getElement().getClient('value');
            var h = rect.height * value / 100;
            rect.y = rect.y + rect.height - h;
            rect.height = h;

            g.beginPath();
            twaver.Util.fill(g, '#FF9900', 'spread.west', '#FFFFFF', rect.x, rect.y, rect.width, rect.height);
            g.rect(rect.x, rect.y, rect.width, rect.height);
            g.fill();
            this.addBodyBounds(bounds);
        }
    });

    demo.MatrixNode = function (id) {
        demo.MatrixNode.superClass.constructor.call(this, id);
    };
    twaver.Util.ext('demo.MatrixNode', twaver.Node, {
        getElementUIClass: function () {
            return demo.MatrixNodeUI;
        }
    });

    demo.MatrixNodeUI = function (network, element) {
        demo.MatrixNodeUI.superClass.constructor.call(this, network, element);
    };
    twaver.Util.ext('demo.MatrixNodeUI', twaver.network.NodeUI, {
        updateMeasure: function () {
            demo.MatrixNodeUI.superClass.updateMeasure.call(this);
            var element = this.getElement();
            var imagePadding = element.getStyle('image.padding');
            var point = { x: element.getX() + element.getWidth() + imagePadding - 3, y: element.getY() - imagePadding + 3 };
            this.setHotSpot(point);
        }
    });

    demo.AbstractPipe = function (id) {
        demo.AbstractPipe.superClass.constructor.call(this, id);
        this.setSize(160, 160);
        this.setStyle('body.type', 'vector');
        this.setStyle('vector.fill.color', '#C0C0C0');
        this.setStyle('vector.outline.width', 1);
        this.setStyle('vector.outline.color', '#00B200');
        this.setClient('holeIndex', -1);
        this.setClient('innerWidth', 1);
        this.setClient('innerColor', '#00B200');
    };
    twaver.Util.ext('demo.AbstractPipe', twaver.Follower, {
        IPipe: true,
        onClientChanged: function (clientProp, oldValue, newValue) {
            demo.AbstractPipe.superClass.onClientChanged.call(this, clientProp, oldValue, newValue);
            if (clientProp === 'holeIndex') {
                this._adjustBounds();
            }
        },
        updateFollowerImpl: function (e) {
            demo.AbstractPipe.superClass.updateFollowerImpl.call(this, e);
            this._adjustBounds();
        },
        _adjustBounds: function () {
            var host = this.getHost();
            if (host && host.IPipe) {
                var bounds = host.getPipeHoleBoundsByHole(this);
                if (bounds != null) {
                    this.setLocation(bounds.x + host.getClient('innerWidth'), bounds.y + host.getClient('innerWidth'));
                    this.setSize(bounds.width - host.getClient('innerWidth') * 2, bounds.height - host.getClient('innerWidth') * 2);
                }
            }
        },
        getPipeHoleBoundsByHole: function (hole) {
            return this.getPipeHoleBoundsByHoleIndex(hole.getClient('holeIndex'));
        },
        getPipeHoleBoundsByHoleIndex: function (holeIndex) {
            return null;
        },
        getPipeHoleByHoleIndex: function (holeIndex) {
            for (var i = 0, c = this.getChildrenCount(); i < c; i++) {
                var element = this.getChildAt(i);
                if (element.IPipe) {
                    if (element.getClient('holeIndex') === holeIndex) {
                        return element;
                    }
                }
            }
            return null;
        }
    });

    demo.RoundPipe = function (id) {
        demo.RoundPipe.superClass.constructor.call(this, id);
        this.setClient('holeCount', 0);
        this.setClient('isCenterHole', true);
        this.setIcon('roundPipe');
        this.setStyle('vector.shape', 'circle');
        this.setStyle('vector.gradient', 'radial.northwest');
    };
    twaver.Util.ext('demo.RoundPipe', demo.AbstractPipe, {
        getElementUIClass: function () {
            return demo.RoundPipeUI;
        },
        getPipeHoleBoundsByHoleIndex: function (holeIndex) {
            var holeCount = this.getClient('holeCount');
            if (holeIndex < 0 || holeIndex >= holeCount) {
                return null;
            }
            var center = this.getClient('isCenterHole');
            var R = Math.min(this.getWidth(), this.getHeight()) / 2.0;
            var cx = this.getX() + this.getWidth() / 2.0;
            var cy = this.getY() + this.getHeight() / 2.0;
            var count = center ? holeCount - 1 : holeCount;
            var angle = Math.PI / count;
            var r = R * Math.sin(angle) / (1 + Math.sin(angle));
            var x = (R - r) * Math.sin(angle * 2 * holeIndex);
            var y = (R - r) * Math.cos(angle * 2 * holeIndex);
            if (center && holeIndex == holeCount - 1) {
                r = R - 2 * r;
                return { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r };
            } else {
                return { x: cx + x - r, y: cy + y - r, width: 2 * r, height: 2 * r };
            }
        }
    });

    demo.RoundPipeUI = function (network, element) {
        demo.RoundPipeUI.superClass.constructor.call(this, network, element);
    };
    twaver.Util.ext('demo.RoundPipeUI', twaver.network.NodeUI, {
        drawBody: function () {
            demo.RoundPipeUI.superClass.drawBody.call(this);

            var roundPipe = this.getElement();
            if (roundPipe == null || roundPipe.getClient('holeCount') <= 0) {
                return;
            }
            var innerWidth = roundPipe.getClient('innerWidth');
            if (innerWidth > 0) {
                var innerColor = roundPipe.getClient('innerColor');
                var g = this._vectorCanvas.getContext('2d');
                g.strokeStyle = innerColor;
                g.lineWidth = innerWidth;
                for (var i = 0, c = roundPipe.getClient('holeCount'); i < c; i++) {
                    var rect = roundPipe.getPipeHoleBoundsByHoleIndex(i);
                    if (rect != null) {
                        g.beginPath();
                        g.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.min(rect.width, rect.height) / 2, 0, Math.PI * 2, true);
                        g.stroke();
                    }
                }
            }
        }
    });

    demo.SquarePipe = function (id) {
        demo.SquarePipe.superClass.constructor.call(this, id);
        this.setClient('cellCounts', []);
        this.setClient('isHorizontal', true);
        this.setIcon('squarePipe');
        this.setStyle('vector.shape', 'rectangle');
        this.setStyle('vector.gradient', 'linear.northwest');
    };
    twaver.Util.ext('demo.SquarePipe', demo.AbstractPipe, {
        getElementUIClass: function () {
            return demo.SquarePipeUI;
        },
        getAllCellCount: function () {
            var cellCounts = this.getClient('cellCounts');
            if (cellCounts == null || cellCounts.length == 0) {
                return 0;
            }
            var count = 0;
            for (var i = 0, c = cellCounts.length; i < c; i++) {
                count += cellCounts[i];
            }
            return count;
        },
        getRowIndexByPoint: function (point) {
            for (var i = 0, count = this.getAllCellCount(); i < count; i++) {
                var rect = this.getPipeHoleBoundsByHoleIndex(i);
                if (rect != null && twaver.Util.containsPoint(rect, point)) {
                    return this.getRowIndexByCellIndex(i);
                }
            }
            return -1;
        },
        getRowIndexByCellIndex: function (cellIndex) {
            if (cellIndex < 0 || cellIndex >= this.getAllCellCount()) {
                return -1;
            }
            var count = 0;
            var cellCounts = this.getClient('cellCounts');
            var isHorizontal = this.getClient('isHorizontal');
            for (var i = 0, c = cellCounts.length; i < c; i++) {
                var rowCount = cellCounts[i];
                count += rowCount;
                if (count >= cellIndex + 1) {
                    if (isHorizontal) {
                        return i;
                    } else {
                        return rowCount - (count - cellIndex);
                    }
                }
            }
            return -1;
        },
        getColumnIndexByPoint: function (point) {
            var count = this.getAllCellCount();
            for (var i = 0; i < count; i++) {
                var rect = this.getPipeHoleBoundsByHoleIndex(i);
                if (rect != null && rect.containsPoint(point)) {
                    return this.getColumnIndexByCellIndex(i);
                }
            }
            return -1;
        },
        getColumnIndexByCellIndex: function (cellIndex) {
            if (cellIndex < 0 || cellIndex >= this.getAllCellCount()) {
                return -1;
            }
            var count = 0;
            var cellCounts = this.getClient('cellCounts');
            var isHorizontal = this.getClient('isHorizontal');
            for (var i = 0, c = cellCounts.length; i < c; i++) {
                var columnCount = cellCounts[i];
                count += columnCount;
                if (count >= cellIndex + 1) {
                    if (isHorizontal) {
                        return columnCount - (count - cellIndex);
                    } else {
                        return i;
                    }
                }
            }
            return -1;
        },
        getPipeHoleBoundsByHoleIndex: function (holeIndex) {
            if (holeIndex < 0 || holeIndex >= this.getAllCellCount()) {
                return null;
            }
            var row = this.getRowIndexByCellIndex(holeIndex);
            var column = this.getColumnIndexByCellIndex(holeIndex);
            if (row < 0 || column < 0) {
                return null;
            }

            var location = this.getLocation();
            var borderWidth = this.getStyle('vector.outline.width');
            if (borderWidth < 0) {
                borderWidth = 0;
            }
            var x = location.x + borderWidth;
            var y = location.y + borderWidth;
            var w = this.getWidth() - borderWidth * 2;
            var h = this.getHeight() - borderWidth * 2;

            var cellCounts = this.getClient('cellCounts');
            var rect = {};
            if (this.getClient('isHorizontal')) {
                var rowCount = cellCounts[row];
                rect.width = w / rowCount;
                rect.height = h / cellCounts.length;
                rect.x = x + column * w / rowCount;
                rect.y = y + row * h / cellCounts.length;
            } else {
                var columnCount = cellCounts[column];
                rect.width = w / cellCounts.length;
                rect.height = h / columnCount;
                rect.x = x + column * w / cellCounts.length;
                rect.y = y + row * h / columnCount;
            }
            return rect;
        }
    });

demo.SquarePipeUI = function (network, element) {
    demo.SquarePipeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('demo.SquarePipeUI', twaver.network.NodeUI, {
    drawBody: function () {
        demo.SquarePipeUI.superClass.drawBody.call(this);

        var squarePipe = this.getElement();
        if (squarePipe == null) {
            return;
        }
        var cellCounts = squarePipe.getClient('cellCounts');
        var count = squarePipe.getAllCellCount();
        if (cellCounts == null || count <= 0) {
            return;
        }
        var innerWidth = squarePipe.getClient('innerWidth');
        if (innerWidth > 0) {
            var innerColor = squarePipe.getClient('innerColor');
            var g = this._vectorCanvas.getContext('2d');
            g.strokeStyle = innerColor;
            g.lineWidth = innerWidth;
            for (var i = 0; i < count; i++) {
                var rect = squarePipe.getPipeHoleBoundsByHoleIndex(i);
                if (rect != null) {
                    g.beginPath();
                    g.rect(rect.x, rect.y, rect.width, rect.height);
                    g.stroke();
                }
            }
        }
    }
});

demo.StoryLayouter = function (network, part) {
    demo.StoryLayouter.superClass.constructor.call(this, network);
    this.part = part;
    this.setElliptical(false);
    this.setCeaseRate(0.8);
    this.setInterval(80);
    this.setMoveSpeed(2);
    this.lastElement = null;
};
twaver.Util.ext('demo.StoryLayouter', twaver.layout.CloudLayouter, {
    isLayoutable: function (node) {
        return node.getClient('part') === this.part;
    },
    getLayoutRect: function () {
        var w = this.getNetwork().getView().clientWidth / this.getNetwork().getZoom();
        var h = this.getNetwork().getView().clientHeight / this.getNetwork().getZoom();
        if (this.part === 0) {
            return { x: w / 8, y: h / 8, width: w / 4, height: h / 4 };
        }
        if (this.part === 1) {
            return { x: w * 5 / 8, y: h / 8, width: w / 4, height: h / 4 };
        }
        if (this.part === 2) {
            return { x: w / 8, y: h * 5 / 8, width: w / 4, height: h / 4 };
        }
        if (this.part === 3) {
            return { x: w * 5 / 8, y: h * 5 / 8, width: w / 4, height: h / 4 };
        }
        return null;
    },
    updateNode: function (node, zIndex, count, alpha) {
        node.setStyle('whole.alpha', 0.3 + alpha * 0.7);
        var point = node.getCenterLocation();
        var image = twaver.Util.getImageAsset(node.getImage());
        if (image) {
            node.setWidth = image.getWidth() * (0.1 + alpha * 0.4);
            node.setheight = image.getHeight() * (0.1 + alpha * 0.4);
            node.setCenterLocation(point);
        }
    },
    handleMouseMove: function (e) {
        demo.StoryLayouter.superClass.handleMouseMove.call(this, e);
        this._handleMouseEvent(e);
    },
    handleMouseOver: function (e) {
        demo.StoryLayouter.superClass.handleMouseOver.call(this, e);
        this._handleMouseEvent(e);
    },
    _handleMouseEvent: function (e) {
        var element = this.getNetwork().getElementAt(e);
        if (element != this.lastElement) {
            if (this.lastElement != null) {
                this.lastElement.setStyle('vector.outline.width', -1);
            }
            this.lastElement = element;
            if (this.lastElement != null) {
                this.lastElement.setStyle('vector.outline.width', 1);
            }
        }

        var point = network.getLogicalPoint(e);
        var activeRect = this.getLayoutRect();
        twaver.Util.grow(activeRect, activeRect.width / 2, activeRect.height / 2);
        if (twaver.Util.containsPoint(activeRect, point) && !this.isRunning()) {
            this.start();
        } else {
            this.stop();
        }
    },
    handleRollOut: function (e) {
        demo.StoryLayouter.superClass.handleRollOut.call(this, e);
        this.stop();
    },
    handleResize: function (e) {
        demo.StoryLayouter.superClass.handleResize.call(this, e);
        this.updateLayoutRect();
    }
});

demo.AlarmOverview = function (elementBox) {
    demo.AlarmOverview.superClass.constructor.call(this);
    this._init();
    this.setElementBox(elementBox);
};
twaver.Util.ext('demo.AlarmOverview', twaver.controls.TabPane, {
    setElementBox: function (elementBox) {
        this._elementBox = elementBox;
        if (this._alarmStateStatistics == null) {
            this._alarmStateStatistics = new twaver.AlarmStateStatistics(elementBox);
            var ass = this._alarmStateStatistics;
            var table = this._table;
            var update = function (e) {
                twaver.AlarmSeverity.forEach(function (severity) {
                    var data = table.getDataBox().getDataById(severity.name);
                    data.setClient('new', ass.getNewAlarmCount(severity));
                    data.setClient('acked', ass.getAcknowledgedAlarmCount(severity));
                    data.setClient('total', ass.getTotalAlarmCount(severity));
                });
                var data = table.getDataBox().getDataById('total');
                data.setClient('total', ass.getTotalAlarmCount());
                data.setClient('new', ass.getNewAlarmCount());
                data.setClient('acked', ass.getAcknowledgedAlarmCount());
            }
            ass.addPropertyChangeListener(function (e) {
                if (e.property === 'alarmState') {
                    update();
                }
            });
            update();
        } else {
            this._alarmStateStatistics.setElementBox(elementBox);
        }
    },
    _addTab: function (name, icon, view) {
        var tab = new twaver.Tab(name);
        tab.setIcon(icon);
        tab.setView(view)
        tab.setWidth(50);
        this.getTabBox().add(tab);
    },
    _headerImage: 'data:image/gif;base64,R0lGODlhAgAYAIcAANDQ0Ovs7uzt7+3u8O7v8e/w8vDx8/Hy9Pn5+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAP8ALAAAAAACABgAAAghABEIHEiwYMEDCA8YWMiwgMMCBAgMmDhAgIAAGAMAABAQADs=',
    _init: function () {
        var tabPane = this;
        // Init Table
        var table = new twaver.controls.Table();
        this._table = table;
        table.getView().style.overflow = 'hidden';
        var tablePane = new twaver.controls.TablePane(table);
        tablePane.getTableHeader().getView().style.background = 'url(' + this._headerImage + ') repeat-x';
        var column = demo.Util.createColumn(table, 'Severity', 'severity', 'client');
        column.setWidth(120);
        column.setHorizontalAlign('center');
        column.renderCell = function (params) {
            var severity = params.value;
            var span = document.createElement('span');
            span.innerHTML = severity.toString().toUpperCase();
            span.style.whiteSpace = 'nowrap';
            params.div.style.backgroundColor = severity.color ? severity.color : '';
            params.div.appendChild(span);
        };
        demo.Util.createColumn(table, 'New', 'new', 'client').setWidth(40);
        demo.Util.createColumn(table, 'Acked', 'acked', 'client').setWidth(40);
        demo.Util.createColumn(table, 'Total', 'total', 'client').setWidth(40);

        twaver.AlarmSeverity.severities.forEachReverse(function (severity) {
            var data = new twaver.Data(severity.name);
            data.setClient('severity', severity);
            table.getDataBox().add(data);
        });
        var data = new twaver.Data('total');
        data.setClient('severity', 'Total');
        data.setClient('new', 0);
        data.setClient('acked', 0);
        data.setClient('total', 0);
        table.getDataBox().add(data);

        // Init Bar Chart
        var barChart = new twaver.charts.BarChart(table.getDataBox());
        barChart.setYScaleValueGap(2);
        barChart.setYScaleMinTextVisible(true);
        barChart.formatYScaleText = function (value) {
            return value.toFixed(0);
        };
        barChart.setVisibleFunction(function (data) {
            return data.getId() !== 'total';
        });
        barChart.getValue = function (data) {
            return data.getClient('total');
        };
        barChart.getColor = function (data) {
            return data.getClient('severity').color;
        };
        barChart.getName = function (data) {
            return data.getClient('severity').nickName;
        };
        barChart.getToolTipByData = function (data, info) {
            var severity = data.getClient('severity');
            return '<h4 style="margin:0px"><span style="color:' + severity.color + '">' + severity.name +
            '</span>:&nbsp;<span style="text-decoration: underline">' + info.value + '</span></h4>';
        };

        // Init Pie Chart
        var pieChart = new twaver.charts.PieChart(table.getDataBox());
        pieChart.setVisibleFunction(barChart.getVisibleFunction());
        pieChart.getValue = barChart.getValue;
        pieChart.getColor = barChart.getColor;
        pieChart.getName = barChart.getName;
        pieChart.getToolTipByData = barChart.getToolTipByData;

        // init tabPane
        var r = function (name, width, height, src) {
            var img = document.createElement('img');
            img.src = src;
            twaver.Util.registerImage(name, img, width, height);
        }
        r('bar', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFgSURBVHjanFO9SgNBEM7d/szeXe4SkVQWCrFIbZVX0CewSGdjbyuIIPgEgm+gb2AnwQcQ0cIUgiiIEJGQgOTu9s8JSyLqaX4GdpmZ3W+/b5YZz1pbmt8oru3Di7kw5web1HmdztPN2e4sGMfhlxYy+tfB9f6KczaOXn6f/scWln8+aoyZwiYlYRx8P5hklDZSTYNRBowJwkZ+q3nskieXe1NEMjQOhAfG2DRT9doSJjNlC9iaO+tJzNPUXp3eE4pszOOJ1IYzEoSUcj8rFImY+lqt+zYc6+S459ogAASjhGTSFIgMhKhWEiGECwkd/UeuDKUEBBbr52OR32EgkiQGYO7HPDGqJ5UI86OKgJBnUhXAQEAcRZyKXOsJLJOWhzRejqAM6BfUNujr58e89y5R2GCQ37bbHourytw9dF97H73+cEtqd9PDwcHuxFaesRsbjdWvCcBgrlb2FhvTTwEGAPjOf5jsJjzBAAAAAElFTkSuQmCC');
        r('table', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjaYvz//z8D6YAFiCMat5OkZ0W9JwucRaQeiB0scH5wlZOkGN/dR0+2950hqJkJzpIU51dVE+HnZQOyDSJnABGcAWej+A0C7j56/Ob9y6cv3gPZ3ZVBEEE4A8L+9+8flAMMyfCGbf+JAL///P324zdEMcK249Wm/Pys71++su69g+YToLo/f//9BqH/6I7k52eXlGD5+ZkJzRvnlqYbRc+EsHfNTETX9v7Vi59fmD5+/IbmJaAlcO7PP//QtVn3INzmqicGJIEB8PvPv19//xkr8f/68//X3/8/f2NoC7ZtkxTgvvvo7faLTUAuyDN//v3+9x9o28/fIBKo7fcfDL8B9WhKinx6/x0YAIZRM48tSLZKmAuRWj8pLjBvEZAxvz0CXdu9R2+Bep6++Qy0BOgZoKvgXvr1B+o9oLXo2rZdbAJ55i/QD/9MlPmBvteQ4f39G+Q2IFuQhw2o+efvv+jaoAEA9AyQBAcAUN1vEANI/gV57w8o6lC0kZp3GMnLpgABBgBINSR0kosVBQAAAABJRU5ErkJggg==');
        r('pie', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIjSURBVHjanJNNaBNBFICTbGrSNCUNiAlVDy0aKeJPFcSDKIhU60WPAYmgiEUUBcGDQRS9iiCiYBV68CAehJ4kUBEpSvFgj3pRY7trk83+z85mZ3dndsbBYpRND8bHzOPxmI/3M+/FGWOx3iXJb/l2rSfmxa3JZMf6R2Y1RjLi9Ux58dHUYHFUtHILSyPYJ03Fvjd9plAciibZEXlxTpp/trtyM53J4I/1/YWhzcW8VFculR9fqB4/PLGz8zLxdxzp7cye0zdSAqG2yNoyVB2zYcVccvLA2P3qbEu2KKVRjOc2dqxCgRgCkVoidVq25hgrgB+gOvu2DF89P+NjGk0yO5jtSyAKGswD1DOpY9vqxqSNPYR9j8RxzBFhEHZhqX6BWcvUM5hvMWRQB3+tqzRkhNBUIdGXYWS06RPW1RJkhuA7+4UR7NYUcOLa1Mi2fChAiHQbaXPvLZ90RXMtmQIa4jbBQcPx1m0/WtqVs5FqQ41riLSWrqxRGxKGoSnHE5Rgf7YhTJ49pMEftqdBVwWc0ZQA5YLfSf7p5N6L09++tFAbiKYdKx10iaFDSYcih3VTebfw+XLlro9JFEvni1tPPVlecl8Z/eM7SrojqVBSQVNaab6Z/1SeuDOQWe9jtsaUbBg/ktn04emDK83XtXQ65mNkAFcIi9VzL7MDnKG4uyV8Arg3nis8vP6c1xCELCDcww2uw1UGR/6t192J/9+a/hRgAEzlajsC1G6iAAAAAElFTkSuQmCC');

        this._addTab('Table', 'table', tablePane);
        this._addTab('Bar', 'bar', new twaver.charts.ChartPane(barChart, null, 'top'));
        this._addTab('Pie', 'pie', new twaver.charts.ChartPane(pieChart, null, 'top'));

        var tabBox = tabPane.getTabBox();
        tabPane.setTabOrientation('bottom');
        tabBox.getSelectionModel().setSelection(tabBox.getDataById('Table'));
    }
});

demo.CustomAlarmElementMapping = function (elementBox) {
    this._elementFinder = new twaver.QuickFinder(elementBox, 'MAPPINGID', 'client');
    this._alarmFinder = new twaver.QuickFinder(elementBox.getAlarmBox(), 'MAPPINGID', 'client');
};
twaver.Util.ext('demo.CustomAlarmElementMapping', Object, {
    getCorrespondingAlarms: function (element) {
        return this._alarmFinder.find(element.getClient('MAPPINGID'));
    },
    getCorrespondingElements: function (alarm) {
        return this._elementFinder.find(alarm.getClient('MAPPINGID'));
    }
});

demo.AutoPackTable = function (dataBox) {
    demo.AutoPackTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('demo.AutoPackTable', twaver.controls.Table, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        demo.AutoPackTable.superClass.adjustBounds.call(this, rect);
        this.packColumns(rect.width);
    },
    packColumns: function (width) {
        var packCoumns = new twaver.List(),
        packWidth;
        this.getColumnBox().getRoots().forEach(function (column) {
            if (column.getClient('pack')) {
                packCoumns.add(column);
            } else {
                width -= column.getWidth();
            }
        });
        if (packCoumns.size() === 0) {
            return;
        }
        packWidth = width / packCoumns.size();
        if (packWidth < this._minPackWidth) {
            packWidth = this._minPackWidth;
        }
        packCoumns.forEach(function (column) {
            column.setWidth(packWidth);
        });
    }
});


demo.AutoPackTreeTable = function (dataBox) {
    demo.AutoPackTreeTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('demo.AutoPackTreeTable', twaver.controls.TreeTable, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        demo.AutoPackTreeTable.superClass.adjustBounds.call(this, rect);
        this.packColumns(rect.width);
    },
    packColumns: function (width) {
        var packCoumns = new twaver.List(),
        packWidth;
        this.getColumnBox().getRoots().forEach(function (column) {
            if (column.getClient('pack')) {
                packCoumns.add(column);
            } else {
                width -= column.getWidth();
            }
        });
        if (packCoumns.size() === 0) {
            return;
        }
        packWidth = width / packCoumns.size();
        if (packWidth < this._minPackWidth) {
            packWidth = this._minPackWidth;
        }
        packCoumns.forEach(function (column) {
            column.setWidth(packWidth);
        });
    }
});

TestFrame = function () {
    this.box = new ElementBox();
    this.layerBox = this.box.getLayerBox();
    this.network = demo.Util.createDraggableNetwork(this.box);
    this.tree = new Tree(this.box);
    this.sheet = new PropertySheet(this.box);
    this.treeTable = new demo.AutoPackTreeTable(this.box);
    this.layerTable = new Table(this.layerBox);
    this.alarmTable = new Table(this.box.getAlarmBox());
    this.tabPane = new TabPane();
    this.toolbar = demo.Util.createNetworkToolbar(this.network);
    this.popupMenu = new twaver.controls.PopupMenu(this.network);
};

twaver.Util.ext('TestFrame', Object, {
    app: function () {
        twaver.Defaults.PROPERTYSHEET_EXPAND_CATEGORY = false;
        this.initToolbar();
        var leftSplit = new SplitPane(this.tree, this.sheet, 'vertical', 0.5);
        var rightSplit = new SplitPane(this.network, this.tabPane, 'vertical', 0.7);
        var mainSplitPane = new SplitPane(leftSplit, rightSplit, 'horizontal', 0.2);
        var mainPane = new BorderPane(mainSplitPane, this.toolbar);
        mainPane.setTopHeight(25);
        demo.Util.appendChild(mainPane.getView(), document.getElementById('main'), 0, 0, 0, 0);
        window.onresize = function (e) { 
            mainPane.invalidate(); 
        };

        demo.Util.initPropertySheet(this.sheet);
        this.tabPane.setTabRadius(8);
        this.tabPane.setTabGap(5);
        this.tabPane.setSelectBackground('#8080FF');
        this.tabPane.setTabBackground('#C0C0C0');
        this.refreshLayerId();
        this.initTreeTable();
        this.initLayerTable();
        this.initAlarmTable();

        var index = 0;
        this.box.addDataBoxChangeListener(function (e) {
            if (e.kind === 'add' && !twaver.Util.isDeserializing()) {
                // e.data.setName(e.data.getClassName().substr(7) + ' ' + (++index));
            }
        });
        this.network.getToolTip = function (data) {
            var tooltip = data.getToolTip();
            if (tooltip) {
                return tooltip;
            }
            return data.getName();
        };
        this.initBox();

        var self = this;
        this.network.getView().addEventListener('mousedown', function (e) {
            var target = self.network.hitTest(e);
            if (target) {
                if (target instanceof twaver.network.ElementUI) {
                    console.log('clicked ElementUI');
                }
                if (target instanceof twaver.network.LabelAttachment) {
                    console.log('clicked LabelAttachment');
                }
            }
        });
        var timer = 0, doubleClickInterval = 300;
        this.network.addInteractionListener(function (e) {
            if (e.kind === 'clickElement') {
                // console.log(self.network.getElementBox().getSelectionModel().getLastData());
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                timer = setTimeout(function () {
                    console.log("1");
                }, doubleClickInterval);
            } else if (e.kind === 'doubleClickElement') {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                console.log("2");
            }
        });
        this.network.setLinkableFunction(function (node) {
            return !(node instanceof twaver.Group);
        });
        this.registerImage("../images/svg/boy.svg");
        this.registerImage("../images/svg/girl.svg");
        this.initPopupMenu();
    },
    registerImage: function (url) {
        demo.Util.registerImage(url, true, this.network);
    },
    initBox: function () {
        var group1 = new twaver.Group();
        group1.setExpanded(true);
        this.box.add(group1);

        var node3 = new twaver.Node();
        node3.setImage('boy');
        node3.setLocation(50, 50);
        node3.setParent(group1);
        node3.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.CRITICAL);
        this.box.add(node3);

        var node4 = new twaver.Node();
        node4.setImage('boy');
        node4.setLocation(150, 150);
        node4.setParent(group1);
        this.box.add(node4);

        var group2 = new twaver.Group();
        group2.setStyle('group.shape', 'circle');
        group2.setExpanded(true);
        this.box.add(group2);

        var node5 = new twaver.Node();
        //node5.setImage('girl');
        node5.setLocation(350, 50);
        node5.setParent(group2);
        this.box.add(node5);

        var node6 = new twaver.Node();
        //node6.setImage('girl');
        node6.setSize(120, 120);
        node6.setLocation(450, 150);
        node6.setParent(group2);
        this.box.add(node6);

        var link7 = new twaver.Link(node3, node5);
        link7.setStyle('arrow.from', true);
        link7.setStyle('arrow.from.shape', 'arrow.slant');
        this.box.add(link7);
        var link8 = new twaver.Link(node4, node6);
        link8.setStyle('arrow.to', true);
        link8.setStyle('arrow.to.shape', 'arrow.slant');
        this.box.add(link8);

        this.box.getSelectionModel().setSelection(group2);
    },
    initToolbar: function () {
        var self = this;
        if (!twaver.Util.isTouchable) {
            demo.Util.addDraggableButton(self.toolbar, 'Create Node', 'node_icon', 'twaver.Node');
            demo.Util.addDraggableButton(self.toolbar, 'Create Group', 'group_icon', 'twaver.Group');
            demo.Util.addDraggableButton(self.toolbar, 'Create SubNetwork', 'subnetwork_icon', 'twaver.SubNetwork');
            demo.Util.addDraggableButton(self.toolbar, 'Create Grid', 'grid_icon', 'twaver.Grid');
        } else {
            demo.Util.addButton(self.toolbar, 'Create Node', 'node_icon', function () {
                self.network.setCreateElementInteractions(twaver.Node);
            });
            demo.Util.addButton(self.toolbar, 'Create Group', 'group_icon', function () {
                self.network.setCreateElementInteractions(twaver.Group);
            });
            demo.Util.addButton(self.toolbar, 'Create SubNetwork', 'subnetwork_icon', function () {
                self.network.setCreateElementInteractions(twaver.SubNetwork);
            });
            demo.Util.addButton(self.toolbar, 'Create Grid', 'grid_icon', function () {
                self.network.setCreateElementInteractions(twaver.Grid);
            });
        }

        demo.Util.addButton(this.toolbar, 'Create ShapeNode', 'shapenode_icon', function () {
            self.network.setCreateShapeNodeInteractions(twaver.ShapeNode);
        });
        demo.Util.addButton(this.toolbar, 'Create ShapeSubNetwork', 'shapesubnetwork_icon', function () {
            self.network.setCreateShapeNodeInteractions(twaver.ShapeSubNetwork);
        });

        demo.Util.addButton(this.toolbar, 'Create Link', 'link_icon', function () {
            self.network.setCreateLinkInteractions(twaver.Link);
        });
        demo.Util.addButton(this.toolbar, 'Create LinkSubNetwork', 'linksubnetwork_icon', function () {
            self.network.setCreateLinkInteractions(twaver.LinkSubNetwork);
        });
        demo.Util.addButton(this.toolbar, 'Create ShapeLink', 'shapelink_icon', function () {
            self.network.setCreateShapeLinkInteractions(twaver.ShapeLink);
        });

        demo.Util.addButton(this.toolbar, 'Align Left', 'align_left', function () { self.doAlign("left"); });
        demo.Util.addButton(this.toolbar, 'Align Horizontal Center', 'align_horizontalcenter', function () { self.doAlign("horizontalcenter"); });
        demo.Util.addButton(this.toolbar, 'Align Right', 'align_right', function () { self.doAlign("right"); });

        demo.Util.addButton(this.toolbar, 'Align Top', 'align_top', function () { self.doAlign("top"); });
        demo.Util.addButton(this.toolbar, 'Align Vertical Center', 'align_verticalcenter', function () { self.doAlign("verticalcenter"); });
        demo.Util.addButton(this.toolbar, 'Align Bottom', 'align_bottom', function () { self.doAlign("bottom"); });

        demo.Util.addButton(this.toolbar, 'Align Even Horizontal', 'align_even_horizontal', function () { self.doEvenSpace(true); });
        demo.Util.addButton(this.toolbar, 'Align Even Vertical', 'align_even_vertical', function () { self.doEvenSpace(false); });
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

   { label: 'Add Node', group: 'none', icon: './images/toolbar/node_icon.png' },
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
initTreeTable: function () {
    this.treeTable.setEditable(true);
    this.treeTable.getTreeColumn().setClient('pack', true);
    var headerPool = new twaver.Pool('spane');
    this.treeTable.addPool(headerPool);
    this.treeTable.getTreeColumn().renderHeader = function (div) {
        var span = headerPool.get();
        span.style.whiteSpace = 'nowrap';
        span.style.verticalAlign = 'middle';
        span.style.padding = '1px 2px 1px 2px';
        span.innerHTML = 'Tree';
        span.setAttribute('title', span.innerHTML);
        span.style.font = 'bold 12px Helvetica';
        div.style.textAlign = 'center';
        div.appendChild(span);
    };
    demo.Util.createColumn(this.treeTable, 'Location', 'location', 'accessor', 'string', false).getValue = function (data) {
        if (data.getLocation) {
            var location = data.getLocation();
            return 'X:' + Math.round(location.x) + ', Y:' + Math.round(location.y);
        }
        return '';
    };
    var column = demo.Util.createColumn(this.treeTable, 'Width', 'width', 'accessor', 'number', true);
    column.getValue = function (data) {
        if (data.getWidth) {
            return Math.round(data.getWidth());
        }
        return '';
    };
    column.setWidth(50);
    column = demo.Util.createColumn(this.treeTable, 'Height', 'height', 'accessor', 'number', true);
    column.getValue = function (data) {
        if (data.getHeight) {
            return Math.round(data.getHeight());
        }
        return '';
    };
    column.setWidth(50);
    column = demo.Util.createColumn(this.treeTable, 'From', 'from', 'accessor', 'string', false);
    column.getValue = function (data) {
        if (data.getFromNode) {
            return data.getFromNode().getName();
        }
        return '';
    };
    column = demo.Util.createColumn(this.treeTable, 'To', 'to', 'accessor', 'string', false);
    column.getValue = function (data) {
        if (data.getToNode) {
            return data.getToNode().getName();
        }
        return '';
    };
    demo.Util.createColumn(this.treeTable, 'Parent', 'parent', 'accessor', 'string', false).setWidth(80);
    demo.Util.createColumn(this.treeTable, 'Alpha', 'whole.alpha', 'style', 'number', true).setWidth(50);
    demo.Util.createColumn(this.treeTable, 'Layer Id', 'layerId', 'accessor', 'string', false).setWidth(50);
    demo.Util.createColumn(this.treeTable, 'ToolTip', 'toolTip', 'accessor', 'string', true);

    this.addTab('Tree Table', new TablePane(this.treeTable), true);
},
initLayerTable: function () {
    var self = this;
    this.layerTable.setEditable(true);
    demo.Util.createColumn(this.layerTable, 'Id', 'id', 'accessor', 'string');
    demo.Util.createColumn(this.layerTable, 'Visible', 'visible', 'accessor', 'boolean', true);
    demo.Util.createColumn(this.layerTable, 'Movable', 'movable', 'accessor', 'boolean', true);
    demo.Util.createColumn(this.layerTable, 'Editable', 'editable', 'accessor', 'boolean', true);
    this.layerBox.addDataBoxChangeListener(function (e) { this.refreshLayerId(); }, this);
    var layerTableToolbar = document.createElement('div');
    var layerId = document.createElement('input');
    layerId.style.width = '50px';
    layerTableToolbar.appendChild(layerId);
    demo.Util.addButton(layerTableToolbar, 'Add layer', 'add', function () {
        self.layerBox.add(new twaver.Layer(layerId.value));
        layerId.value = '';
    });
    var btnDelete = demo.Util.addButton(layerTableToolbar, 'Delete selected layers', 'delete', function () {
        self.layerBox.getSelectionModel().getSelection().forEach(function (layer) {
            self.layerBox.remove(layer);
        });
    });
    var btnTop = demo.Util.addButton(layerTableToolbar, 'Move selected layers to top', 'top', function () {
        self.layerBox.moveSelectionToTop();
    });
    var btnUp = demo.Util.addButton(layerTableToolbar, 'Move selected layers up', 'up', function () {
        self.layerBox.moveSelectionUp();
    });
    var btnDown = demo.Util.addButton(layerTableToolbar, 'Move selected layers down', 'down', function () {
        self.layerBox.moveSelectionDown();
    });
    var btnBottom = demo.Util.addButton(layerTableToolbar, 'Move selected layers to bottom', 'bottom', function () {
        self.layerBox.moveSelectionToBottom();
    });
    btnDelete.setAttribute('disabled', 'disabled');
    btnTop.setAttribute('disabled', 'disabled');
    btnUp.setAttribute('disabled', 'disabled');
    btnDown.setAttribute('disabled', 'disabled');
    btnBottom.setAttribute('disabled', 'disabled');
    this.layerBox.getSelectionModel().addSelectionChangeListener(function (e) {
        var isEmpty = this.layerBox.getSelectionModel().size() == 0;
        if (isEmpty) {
            btnDelete.setAttribute('disabled', 'disabled');
            btnTop.setAttribute('disabled', 'disabled');
            btnUp.setAttribute('disabled', 'disabled');
            btnDown.setAttribute('disabled', 'disabled');
            btnBottom.setAttribute('disabled', 'disabled');
        } else {
            btnDelete.removeAttribute('disabled');
            btnTop.removeAttribute('disabled');
            btnUp.removeAttribute('disabled');
            btnDown.removeAttribute('disabled');
            btnBottom.removeAttribute('disabled');
        }
    }, this);
    var layerTablePane = new BorderPane(new TablePane(this.layerTable), layerTableToolbar);
    layerTablePane.setTopHeight(25);

    this.addTab('Layer Table', layerTablePane);
},
initAlarmTable: function () {
    this.alarmTable.setEditable(true);
    var column = demo.Util.createColumn(this.alarmTable, 'Alarm Severity', 'alarmSeverity', 'accessor', 'string', true);
    column.setWidth(120);
    column.setHorizontalAlign('center');
    var setValue = column.setValue;
    column.setValue = function (data, value, view) {
        value = twaver.AlarmSeverity.getByName(value);
        setValue.call(column, data, value, view);
    };
    column.setEnumInfo(twaver.AlarmSeverity.severities.toArray());
    demo.Util.createColumn(this.alarmTable, 'Id', 'id', 'accessor', 'string').setWidth(50);
    demo.Util.createColumn(this.alarmTable, 'Element Id', 'elementId', 'accessor', 'string').setWidth(100);
    demo.Util.createColumn(this.alarmTable, 'Acked', 'acked', 'accessor', 'boolean', true).setWidth(50);
    demo.Util.createColumn(this.alarmTable, 'Cleared', 'cleared', 'accessor', 'boolean', true).setWidth(50);

    this.addTab('Alarm Table', new TablePane(this.alarmTable));
},
addTab: function (name, view, selected) {
    var tab = new twaver.Tab(name);
    tab.setName(name);
    tab.setView(view)
    this.tabPane.getTabBox().add(tab);
    if (selected) {
        this.tabPane.getTabBox().getSelectionModel().setSelection(tab);
    }
},
refreshLayerId: function () {
    var layers = [];
    this.layerBox.forEach(function (layer) {
        layers.push(layer.getId());
    });
    this.sheet.getPropertyBox().forEach(function (property) {
        if (property.getPropertyName() === 'layerId') {
            property.setEnumInfo(layers);
        }
    });
},
doAlign: function (type) {
    var nodes = this.network.getSelectionModel().getSelection().toArray();
    demo.Util.align(nodes, type);
},
doEvenSpace: function (isHorizontal) {
    var nodes = this.network.getSelectionModel().getSelection().toArray();
    demo.Util.evenSpace(nodes, isHorizontal);
},
addAlarm: function (alarmID, elementID, alarmSeverity, alarmBox) {
  var alarm = new twaver.Alarm(alarmID, elementID, alarmSeverity);
  alarmBox.add(alarm);
},
});