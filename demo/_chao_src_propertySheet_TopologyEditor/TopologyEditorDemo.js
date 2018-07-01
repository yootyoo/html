var AutoPackTreeTable = function (dataBox) {
    AutoPackTreeTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('AutoPackTreeTable', twaver.controls.TreeTable, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        AutoPackTreeTable.superClass.adjustBounds.call(this, rect);
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

var TopologyEditorDemo = function () {
    this.box = new twaver.ElementBox();
    this.layerBox = this.box.getLayerBox();
    this.network = this.createDraggableNetwork(this.box);
    this.tree = new twaver.controls.Tree(this.box);
    this.sheet = new twaver.controls.PropertySheet(this.box);
    this.treeTable = new AutoPackTreeTable(this.box);
    this.layerTable = new twaver.controls.Table(this.layerBox);
    this.alarmTable = new twaver.controls.Table(this.box.getAlarmBox());
    this.tabPane = new twaver.controls.TabPane();
    this.toolbar = this.createNetworkToolbar(this.network);
    this.popupMenu = new twaver.controls.PopupMenu(this.network);
    this.ATTACHMENT_POSITION_TYPE = ['hotspot',
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
    this.DIRECTION_TYPE = ['northwest', 'north', 'northeast', 'east', 'west', 'south', 'southwest', 'southeast'];
    this.GRADIENT_TYPE = ['linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'];
    this.CAP_TYPE = ['butt', 'round', 'square'];
    this.JOIN_TYPE = ['miter', 'round', 'bevel'];
    this.SELECT_TYPE = ['none', 'shadow', 'border'];
    this.SHAPE_TYPE = ['rectangle','oval', 'roundrect', 'star', 'triangle', 'circle', 'hexagon', 'pentagon', 'diamond'];
    this.ORIENTATION_TYPE = ['top', 'left', 'bottom', 'right'];
    this.BODY_TYPE = ['none', 'default', 'vector', 'default.vector', 'vector.default'];
    this.LINK_TYPE = ['arc', 'triangle', 'parallel', 'flexional', 'flexional.horizontal', 'flexional.vertical', 'orthogonal', , 'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V', 'orthogonal.V.H', 'extend.top', 'extend.left', 'extend.bottom', 'extend.right'];
    this.LINK_LOOPED_TYPE = ['arc', 'rectangle'];
    this.LINK_CORNER_TYPE = ['none', 'round', 'bevel'];
    this.POSITION_TYPE = ['topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'];
    this.ARROW_SHAPE_TYPE = ['arrow.standard', 'arrow.delta', 'arrow.diamond', 'arrow.short', 'arrow.slant'];
    this.SHAPELINK_TYPE = ['lineto', 'quadto', 'cubicto'];
    this.BUS_STYLE_TYPE = ['nearby', 'north', 'south', 'west', 'east'];
};
twaver.Util.ext('TopologyEditorDemo', Object, {
    init: function () {
        twaver.Defaults.PROPERTYSHEET_EXPAND_CATEGORY = false;
        this.initToolbar();
        var leftSplit = new twaver.controls.SplitPane(this.tree, this.sheet, 'vertical', 0.5);
        var rightSplit = new twaver.controls.SplitPane(this.network, this.tabPane, 'vertical', 0.7);
        var mainSplitPane = new twaver.controls.SplitPane(leftSplit, rightSplit, 'horizontal', 0.3);
        var mainPane = new twaver.controls.BorderPane(mainSplitPane, this.toolbar);
        mainPane.setTopHeight(25);
        this.appendChild(mainPane.getView(), document.getElementById('main'), 0, 0, 0, 0);
        window.onresize = function (e) { mainPane.invalidate(); };

        this.initPropertySheet(this.sheet);
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
                e.data.setName(e.data.getClassName().substr(7) + ' ' + (++index));
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
        this.callRegisterImage("../images/svg/boy.svg");
        this.callRegisterImage("../images/svg/girl.svg");
        this.initPopupMenu();
    },
    callRegisterImage: function (url) {
        this.registerImage(url, true, this.network);
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
            this.addDraggableButton(this.toolbar, 'Create Node', 'node_icon', 'twaver.Node');
            this.addDraggableButton(this.toolbar, 'Create Group', 'group_icon', 'twaver.Group');
            this.addDraggableButton(this.toolbar, 'Create SubNetwork', 'subnetwork_icon', 'twaver.SubNetwork');
            this.addDraggableButton(this.toolbar, 'Create Grid', 'grid_icon', 'twaver.Grid');
        } else {
            this.addButton(this.toolbar, 'Create Node', 'node_icon', function () {
                self.network.setCreateElementInteractions(twaver.Node);
            });
            this.addButton(this.toolbar, 'Create Group', 'group_icon', function () {
                self.network.setCreateElementInteractions(twaver.Group);
            });
            this.addButton(this.toolbar, 'Create SubNetwork', 'subnetwork_icon', function () {
                self.network.setCreateElementInteractions(twaver.SubNetwork);
            });
            this.addButton(this.toolbar, 'Create Grid', 'grid_icon', function () {
                self.network.setCreateElementInteractions(twaver.Grid);
            });
        }

        this.addButton(this.toolbar, 'Create ShapeNode', 'shapenode_icon', function () {
            self.network.setCreateShapeNodeInteractions(twaver.ShapeNode);
        });
        this.addButton(this.toolbar, 'Create ShapeSubNetwork', 'shapesubnetwork_icon', function () {
            self.network.setCreateShapeNodeInteractions(twaver.ShapeSubNetwork);
        });

        this.addButton(this.toolbar, 'Create Link', 'link_icon', function () {
            self.network.setCreateLinkInteractions(twaver.Link);
        });
        this.addButton(this.toolbar, 'Create LinkSubNetwork', 'linksubnetwork_icon', function () {
            self.network.setCreateLinkInteractions(twaver.LinkSubNetwork);
        });
        this.addButton(this.toolbar, 'Create ShapeLink', 'shapelink_icon', function () {
            self.network.setCreateShapeLinkInteractions(twaver.ShapeLink);
        });

        this.addButton(this.toolbar, 'Align Left', 'align_left', function () { self.doAlign("left"); });
        this.addButton(this.toolbar, 'Align Horizontal Center', 'align_horizontalcenter', function () { self.doAlign("horizontalcenter"); });
        this.addButton(this.toolbar, 'Align Right', 'align_right', function () { self.doAlign("right"); });

        this.addButton(this.toolbar, 'Align Top', 'align_top', function () { self.doAlign("top"); });
        this.addButton(this.toolbar, 'Align Vertical Center', 'align_verticalcenter', function () { self.doAlign("verticalcenter"); });
        this.addButton(this.toolbar, 'Align Bottom', 'align_bottom', function () { self.doAlign("bottom"); });

        this.addButton(this.toolbar, 'Align Even Horizontal', 'align_even_horizontal', function () { self.doEvenSpace(true); });
        this.addButton(this.toolbar, 'Align Even Vertical', 'align_even_vertical', function () { self.doEvenSpace(false); });
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
        this.createColumn(this.treeTable, 'Location', 'location', 'accessor', 'string', false).getValue = function (data) {
            if (data.getLocation) {
                var location = data.getLocation();
                return 'X:' + Math.round(location.x) + ', Y:' + Math.round(location.y);
            }
            return '';
        };
        var column = this.createColumn(this.treeTable, 'Width', 'width', 'accessor', 'number', true);
        column.getValue = function (data) {
            if (data.getWidth) {
                return Math.round(data.getWidth());
            }
            return '';
        };
        column.setWidth(50);
        column = this.createColumn(this.treeTable, 'Height', 'height', 'accessor', 'number', true);
        column.getValue = function (data) {
            if (data.getHeight) {
                return Math.round(data.getHeight());
            }
            return '';
        };
        column.setWidth(50);
        column = this.createColumn(this.treeTable, 'From', 'from', 'accessor', 'string', false);
        column.getValue = function (data) {
            if (data.getFromNode) {
                return data.getFromNode().getName();
            }
            return '';
        };
        column = this.createColumn(this.treeTable, 'To', 'to', 'accessor', 'string', false);
        column.getValue = function (data) {
            if (data.getToNode) {
                return data.getToNode().getName();
            }
            return '';
        };
        this.createColumn(this.treeTable, 'Parent', 'parent', 'accessor', 'string', false).setWidth(80);
        this.createColumn(this.treeTable, 'Alpha', 'whole.alpha', 'style', 'number', true).setWidth(50);
        this.createColumn(this.treeTable, 'Layer Id', 'layerId', 'accessor', 'string', false).setWidth(50);
        this.createColumn(this.treeTable, 'ToolTip', 'toolTip', 'accessor', 'string', true);

        this.addTab('Tree Table', new twaver.controls.TablePane(this.treeTable), true);
    },
    initLayerTable: function () {
        var self = this;
        this.layerTable.setEditable(true);
        this.createColumn(this.layerTable, 'Id', 'id', 'accessor', 'string');
        this.createColumn(this.layerTable, 'Visible', 'visible', 'accessor', 'boolean', true);
        this.createColumn(this.layerTable, 'Movable', 'movable', 'accessor', 'boolean', true);
        this.createColumn(this.layerTable, 'Editable', 'editable', 'accessor', 'boolean', true);
        this.layerBox.addDataBoxChangeListener(function (e) { this.refreshLayerId(); }, this);
        var layerTableToolbar = document.createElement('div');
        var layerId = document.createElement('input');
        layerId.style.width = '50px';
        layerTableToolbar.appendChild(layerId);
        this.addButton(layerTableToolbar, 'Add layer', 'add', function () {
            self.layerBox.add(new twaver.Layer(layerId.value));
            layerId.value = '';
        });
        var btnDelete = this.addButton(layerTableToolbar, 'Delete selected layers', 'delete', function () {
            self.layerBox.getSelectionModel().getSelection().forEach(function (layer) {
                self.layerBox.remove(layer);
            });
        });
        var btnTop = this.addButton(layerTableToolbar, 'Move selected layers to top', 'top', function () {
            self.layerBox.moveSelectionToTop();
        });
        var btnUp = this.addButton(layerTableToolbar, 'Move selected layers up', 'up', function () {
            self.layerBox.moveSelectionUp();
        });
        var btnDown = this.addButton(layerTableToolbar, 'Move selected layers down', 'down', function () {
            self.layerBox.moveSelectionDown();
        });
        var btnBottom = this.addButton(layerTableToolbar, 'Move selected layers to bottom', 'bottom', function () {
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
        var layerTablePane = new twaver.controls.BorderPane(new twaver.controls.TablePane(this.layerTable), layerTableToolbar);
        layerTablePane.setTopHeight(25);

        this.addTab('Layer Table', layerTablePane);
    },
    initAlarmTable: function () {
        this.alarmTable.setEditable(true);
        var column = this.createColumn(this.alarmTable, 'Alarm Severity', 'alarmSeverity', 'accessor', 'string', true);
        column.setWidth(120);
        column.setHorizontalAlign('center');
        var setValue = column.setValue;
        column.setValue = function (data, value, view) {
            value = twaver.AlarmSeverity.getByName(value);
            setValue.call(column, data, value, view);
        };
        column.setEnumInfo(twaver.AlarmSeverity.severities.toArray());
        this.createColumn(this.alarmTable, 'Id', 'id', 'accessor', 'string').setWidth(50);
        this.createColumn(this.alarmTable, 'Element Id', 'elementId', 'accessor', 'string').setWidth(100);
        this.createColumn(this.alarmTable, 'Acked', 'acked', 'accessor', 'boolean', true).setWidth(50);
        this.createColumn(this.alarmTable, 'Cleared', 'cleared', 'accessor', 'boolean', true).setWidth(50);

        this.addTab('Alarm Table', new twaver.controls.TablePane(this.alarmTable));
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
        this.align(nodes, type);
    },
    doEvenSpace: function (isHorizontal) {
        var nodes = this.network.getSelectionModel().getSelection().toArray();
        this.evenSpace(nodes, isHorizontal);
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
    align: function (elements, alignType) {
        if (!alignType) {
            throw new Error("align type can't be null");
        }
        elements = this._checkAndFilter(elements);
        if (elements == null) {
            return;
        }
        var bounds = this._getBounds(elements);
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
        elements = this._checkAndFilter(elements);
        if (elements == null) {
            return;
        }
        var bounds = this._getBounds(elements);
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
        var that = this;
        sheet.setEditable(true);
        var sheetBox = sheet.getPropertyBox();

        var isElementVisible = function (data) {
            return data instanceof twaver.Element;
        };
        var addElementProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Basic', null, propertyType == null ? 'style' : propertyType);
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

        var addLabelProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Label', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isElementVisible;
            return property;
        };
        addLabelProperty('label.alpha');
        addLabelProperty('label.color');
        addLabelProperty('label.font');
        addLabelProperty('label.position').setEnumInfo(this.ATTACHMENT_POSITION_TYPE);
        addLabelProperty('label.direction').setEnumInfo(this.ATTACHMENT_DIRECTION_TYPE);
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
        addLabelProperty('label.gradient').setEnumInfo(this.GRADIENT_TYPE);
        addLabelProperty('label.gradient.color');
        addLabelProperty('label.outline.width');
        addLabelProperty('label.outline.color');
        addLabelProperty('label.cap').setEnumInfo(this.CAP_TYPE);
        addLabelProperty('label.join').setEnumInfo(this.JOIN_TYPE);
        addLabelProperty('label.shadowable');

        var addSelectProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Select', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isElementVisible;
            return property;
        };
        addSelectProperty('select.style').setEnumInfo(this.SELECT_TYPE);
        addSelectProperty('select.color');
        addSelectProperty('select.shape').setEnumInfo(this.SHAPE_TYPE);
        addSelectProperty('select.width');
        addSelectProperty('select.padding');
        addSelectProperty('select.padding.left');
        addSelectProperty('select.padding.right');
        addSelectProperty('select.padding.top');
        addSelectProperty('select.padding.bottom');
        addSelectProperty('select.cap').setEnumInfo(this.CAP_TYPE);
        addSelectProperty('select.join').setEnumInfo(this.JOIN_TYPE);

        var addShadowProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Shadow', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isElementVisible;
            return property;
        };
        addShadowProperty('shadow.color');
        addShadowProperty('shadow.xoffset');
        addShadowProperty('shadow.yoffset');
        addShadowProperty('shadow.blur');

        var addAlarmProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Alarm', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isElementVisible;
            return property;
        };
        addAlarmProperty('alarm.alpha');
        addAlarmProperty('alarm.color');
        addAlarmProperty('alarm.font');
        addAlarmProperty('alarm.position').setEnumInfo(this.ATTACHMENT_POSITION_TYPE);
        addAlarmProperty('alarm.direction').setEnumInfo(this.ATTACHMENT_DIRECTION_TYPE);
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
        addAlarmProperty('alarm.gradient').setEnumInfo(this.GRADIENT_TYPE);
        addAlarmProperty('alarm.gradient.color');
        addAlarmProperty('alarm.outline.width');
        addAlarmProperty('alarm.outline.color');
        addAlarmProperty('alarm.cap').setEnumInfo(this.CAP_TYPE);
        addAlarmProperty('alarm.join').setEnumInfo(this.JOIN_TYPE);
        addAlarmProperty('alarm.shadowable');

        var addIconsProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Icons', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isElementVisible;
            return property;
        };
        addIconsProperty('icons.names');
        addIconsProperty('icons.colors');
        addIconsProperty('icons.position').setEnumInfo(this.ATTACHMENT_POSITION_TYPE);
        addIconsProperty('icons.orientation').setEnumInfo(this.ORIENTATION_TYPE);
        addIconsProperty('icons.xoffset');
        addIconsProperty('icons.yoffset');
        addIconsProperty('icons.xgap');
        addIconsProperty('icons.ygap');

        var isNodeVisible = function (data) {
            return data instanceof twaver.Node;
        };
        var addNodeProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Node', null, propertyType == null ? 'style' : propertyType);
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isNodeVisible;
            return property;
        };
        addNodeProperty('image', 'accessor', true);
        addNodeProperty('location', 'accessor', true);
        addNodeProperty('width', 'accessor', true);
        addNodeProperty('height', 'accessor', true);
        addNodeProperty('body.type').setEnumInfo(this.BODY_TYPE);
        addNodeProperty('angle', 'accessor', true);

        var addImageProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Image', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isNodeVisible;
            return property;
        };
        addImageProperty('image.padding');
        addImageProperty('image.padding.left');
        addImageProperty('image.padding.right');
        addImageProperty('image.padding.top');
        addImageProperty('image.padding.bottom');

        var addVectorProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Vector', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isNodeVisible;
            return property;
        };
        addVectorProperty('vector.shape').setEnumInfo(this.SHAPE_TYPE);
        addVectorProperty('vector.fill');
        addVectorProperty('vector.fill.color');
        addVectorProperty('vector.outline.width');
        addVectorProperty('vector.outline.pattern');
        addVectorProperty('vector.outline.color');
        addVectorProperty('vector.gradient').setEnumInfo(this.GRADIENT_TYPE);
        addVectorProperty('vector.gradient.color');
        addVectorProperty('vector.padding');
        addVectorProperty('vector.padding.left');
        addVectorProperty('vector.padding.right');
        addVectorProperty('vector.padding.top');
        addVectorProperty('vector.padding.bottom');
        addVectorProperty('vector.cap').setEnumInfo(this.CAP_TYPE);
        addVectorProperty('vector.join').setEnumInfo(this.JOIN_TYPE);
        addVectorProperty('vector.deep');

        var isLinkVisible = function (data) {
            return data instanceof twaver.Link;
        };
        var addLinkProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Link', null, propertyType == null ? 'style' : propertyType);
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isLinkVisible;
            return property;
        };
        addLinkProperty('fromNode', 'accessor', false);
        addLinkProperty('toNode', 'accessor', false);
        addLinkProperty('link.color');
        addLinkProperty('link.width');
        addLinkProperty('link.cap').setEnumInfo(this.CAP_TYPE);
        addLinkProperty('link.join').setEnumInfo(this.JOIN_TYPE);
        addLinkProperty('link.type').setEnumInfo(this.LINK_TYPE);
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
        addLinkProperty('link.looped.direction').setEnumInfo(this.DIRECTION_TYPE);
        addLinkProperty('link.looped.type').setEnumInfo(this.LINK_LOOPED_TYPE);
        addLinkProperty('link.from.position').setEnumInfo(this.POSITION_TYPE);
        addLinkProperty('link.from.xoffset');
        addLinkProperty('link.from.yoffset');
        addLinkProperty('link.from.at.edge');
        addLinkProperty('link.to.position').setEnumInfo(this.POSITION_TYPE);
        addLinkProperty('link.to.xoffset');
        addLinkProperty('link.to.yoffset');
        addLinkProperty('link.to.at.edge');
        addLinkProperty('link.split.by.percent');
        addLinkProperty('link.split.percent');
        addLinkProperty('link.split.value');
        addLinkProperty('link.corner').setEnumInfo(this.LINK_CORNER_TYPE);
        addLinkProperty('link.xradius');
        addLinkProperty('link.yradius');
        addLinkProperty('link.flow');
        addLinkProperty('link.flow.converse');
        addLinkProperty('link.flow.stepping');
        addLinkProperty('link.flow.color');

        var addLinkHandleProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Link Handle', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isLinkVisible;
            return property;
        };
        addLinkHandleProperty('link.handler.alpha');
        addLinkHandleProperty('link.handler.color');
        addLinkHandleProperty('link.handler.font');
        addLinkHandleProperty('link.handler.position').setEnumInfo(this.ATTACHMENT_POSITION_TYPE);
        addLinkHandleProperty('link.handler.direction').setEnumInfo(this.ATTACHMENT_DIRECTION_TYPE);
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
        addLinkHandleProperty('link.handler.gradient').setEnumInfo(this.GRADIENT_TYPE);
        addLinkHandleProperty('link.handler.gradient.color');
        addLinkHandleProperty('link.handler.outline.width');
        addLinkHandleProperty('link.handler.outline.color');
        addLinkHandleProperty('link.handler.cap').setEnumInfo(this.CAP_TYPE);
        addLinkHandleProperty('link.handler.join').setEnumInfo(this.JOIN_TYPE);
        addLinkHandleProperty('link.handler.shadowable');

        var addLinkArrowProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Link Arrow', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isLinkVisible;
            return property;
        };
        addLinkArrowProperty('arrow.from');
        addLinkArrowProperty('arrow.from.fill');
        addLinkArrowProperty('arrow.from.shape').setEnumInfo(this.ARROW_SHAPE_TYPE);
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
        addLinkArrowProperty('arrow.to.shape').setEnumInfo(this.ARROW_SHAPE_TYPE);
        addLinkArrowProperty('arrow.to.color');
        addLinkArrowProperty('arrow.to.xoffset');
        addLinkArrowProperty('arrow.to.yoffset');
        addLinkArrowProperty('arrow.to.width');
        addLinkArrowProperty('arrow.to.height');
        addLinkArrowProperty('arrow.to.outline.color');
        addLinkArrowProperty('arrow.to.outline.width');
        addLinkArrowProperty('arrow.to.at.edge');

        var isFollowerVisible = function (data) {
            return data instanceof twaver.Follower;
        };
        var addFollowerProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Follower', null, propertyType == null ? 'style' : propertyType);
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
            var property = that._addProperty(sheetBox, propertyName, 'Group', null, propertyType == null ? 'style' : propertyType);
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isGroupVisible;
            return property;
        };
        addGroupProperty('expanded', 'accessor', true);
        addGroupProperty('group.shape').setEnumInfo(this.SHAPE_TYPE);
        addGroupProperty('group.fill');
        addGroupProperty('group.fill.color');
        addGroupProperty('group.outline.width');
        addGroupProperty('group.outline.color');
        addGroupProperty('group.gradient').setEnumInfo(this.GRADIENT_TYPE);
        addGroupProperty('group.gradient.color');
        addGroupProperty('group.padding');
        addGroupProperty('group.padding.left');
        addGroupProperty('group.padding.right');
        addGroupProperty('group.padding.top');
        addGroupProperty('group.padding.bottom');
        addGroupProperty('group.cap').setEnumInfo(this.CAP_TYPE);
        addGroupProperty('group.join').setEnumInfo(this.JOIN_TYPE);
        addGroupProperty('group.deep');

        var isGridVisible = function (data) {
            return data instanceof twaver.Grid;
        };
        var addGridProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Grid', null, 'style');
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

        var isShapeLinkVisible = function (data) {
            return data instanceof twaver.ShapeLink;
        };
        var addShapeLinkProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'ShapeLink', null, propertyType == null ? 'style' : propertyType);
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isShapeLinkVisible;
            return property;
        };
        addShapeLinkProperty('points', 'accessor', false);
        addShapeLinkProperty('shapelink.type').setEnumInfo(this.SHAPELINK_TYPE);

        var isShapeNodeVisible = function (data) {
            return data instanceof twaver.ShapeNode;
        };
        var addShapeNodeProperty = function (propertyName, propertyType, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'ShapeNode', null, propertyType == null ? 'style' : propertyType);
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isShapeNodeVisible;
            return property;
        };
        addShapeNodeProperty('points', 'accessor', false);
        addShapeNodeProperty('segments', 'accessor', false);
        addShapeNodeProperty('shapenode.closed');

        var isBusVisible = function (data) {
            return data instanceof twaver.Bus;
        };
        var addBusProperty = function (propertyName, editable) {
            var property = that._addProperty(sheetBox, propertyName, 'Bus', null, 'style');
            property.setEditable(editable == null ? true : editable);
            property.isVisible = isBusVisible;
            return property;
        };
        addBusProperty('bus.style').setEnumInfo(this.BUS_STYLE_TYPE);
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
    
});

