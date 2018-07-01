var CustomAlarmElementMapping = function (elementBox) {
    this._elementFinder = new twaver.QuickFinder(elementBox, 'MAPPINGID', 'client');
    this._alarmFinder = new twaver.QuickFinder(elementBox.getAlarmBox(), 'MAPPINGID', 'client');
};
twaver.Util.ext('CustomAlarmElementMapping', Object, {
    getCorrespondingAlarms: function (element) {
        return this._alarmFinder.find(element.getClient('MAPPINGID'));
    },
    getCorrespondingElements: function (alarm) {
        return this._elementFinder.find(alarm.getClient('MAPPINGID'));
    }
});

var AlarmMappingDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.tree = new twaver.controls.Tree(this.box);
    this.table = new twaver.controls.Table(this.box.getAlarmBox());
    this.toolbar = document.createElement('div');
};
twaver.Util.ext('AlarmMappingDemo', Object, {
    init: function () {
        var tablePane = new twaver.controls.BorderPane(new twaver.controls.TablePane(this.table), null, null, this.toolbar);
        tablePane.setBottomHeight(25);
        var centerSplit = new twaver.controls.SplitPane(this.network, tablePane, 'vertical', 0.6);
        var mainSplit = new twaver.controls.SplitPane(this.tree, centerSplit, 'horizontal', 0.3);
        this.appendChild(mainSplit.getView(), document.getElementById('main'), 0, 0, 0, 0);
        this.initButton();
        this.initTable();
        window.onresize = function (e) { mainSplit.invalidate(); };

        this.box.getAlarmBox().setAlarmElementMapping(new CustomAlarmElementMapping(this.box));
        this.network.setMovableFunction(function (element) { return false; });
        this.initBox();
    },
    initButton: function () {
        var self = this;
        this.addButton(this.toolbar, 'Create Alarm', null, function () {
            var alarm = self.randomAlarm();
            alarm.setClient('MAPPINGID', self.randomInt(5) + 1);
            self.box.getAlarmBox().add(alarm);
        });
        this.addButton(this.toolbar, 'Remove Alarm', null, function () {
            self.box.getAlarmBox().removeSelection();
        });
        this.addButton(this.toolbar, '! Acked', null, function () {
            self.box.getAlarmBox().getSelectionModel().getSelection().forEach(function (alarm) {
                alarm.setAcked(!alarm.isAcked());
            });
        });
        this.addButton(this.toolbar, '! Cleared', null, function () {
            if (self.box.getAlarmBox().getSelectionModel().size() == 0) {
                return;
            }
            self.box.getAlarmBox().getSelectionModel().getSelection().forEach(function (alarm) {
                alarm.setCleared(!alarm.isCleared());
            });
        });
        var checkBox = this.addCheckBox(this.toolbar, self.box.getAlarmBox().isRemoveAlarmWhenAlarmIsCleared(), 'Remove On Cleared', function () {
            self.box.getAlarmBox().setRemoveAlarmWhenAlarmIsCleared(checkBox.checked);
        });
    },
    initTable: function () {
        this.table.setEditable(true);
        this.table.onCellRendered = function (params) {
            if (params.column.getName() === 'Alarm Severity') {
                params.div.style.backgroundColor = params.data.getAlarmSeverity().color;
            }
        };

        this.createColumn(this.table, 'Mapping ID', 'MAPPINGID', 'client');
        var column = this.createColumn(this.table, 'Alarm Severity', 'alarmSeverity', 'accessor', 'string', true);
        column.setWidth(120);
        column.setHorizontalAlign('center');
        var setValue = column.setValue;
        column.setValue = function (data, value, view) {
            value = twaver.AlarmSeverity.getByName(value);
            setValue.call(column, data, value, view);
        };
        var enumInfoFunction = function(rowIndex){
            var severities = twaver.AlarmSeverity.severities.toArray();
            if(rowIndex === 0){
                severities.splice(1,1);
                return severities;
            }else{
                return severities;
            }
        };
        column.setEnumInfo(enumInfoFunction);
        this.createColumn(this.table, 'Acked', 'acked', 'accessor', 'boolean', true).setWidth(50);
        this.createColumn(this.table, 'Cleared', 'cleared', 'accessor', 'boolean', true).setWidth(50);
        var timeColumn = this.createColumn(this.table, 'Raised Time', 'raisedTime', 'client');
        timeColumn.setWidth(150);
        timeColumn.setHorizontalAlign('center');
        var that = this;
        timeColumn.renderCell = function (params) {
            var span = document.createElement('span');
            span.innerHTML = that.formatDate(params.value, 'yyyy-MM-dd hh:mm:ss');
            span.style.whiteSpace = 'nowrap';
            params.div.appendChild(span);
        }
    },
    initBox: function () {
        this.createData("Geography Group", 250, 60);
        this.createData("Business Group", 60, 160);
        this.createData("Manufacturer Group", 430, 160);

        var i, alarm;
        for (i = 1; i <= 5; i++) {
            alarm = new twaver.Alarm({ clients: { 'MAPPINGID': i, "raisedTime": new Date()} });
            alarm.setAlarmSeverity(twaver.AlarmSeverity.severities.get(i));
            this.box.getAlarmBox().add(alarm);
        }
        for (i = 1; i <= 5; i++) {
            alarm = new twaver.Alarm({ clients: { 'MAPPINGID': 5 - i + 1, "raisedTime": new Date()} });
            alarm.setAlarmSeverity(twaver.AlarmSeverity.severities.get(i));
            alarm.setAcked(true);
            this.box.getAlarmBox().add(alarm);
        }
        this.tree.expandAll();
    },
    createData: function (name, x, y) {
        var dummy = new twaver.Dummy({ id: name, name: name });
        this.box.add(dummy);

        for (var i = 1; i <= 5; i++) {
            var node = new twaver.Node({ name: "BSC_" + i, clients: { 'MAPPINGID': i} });
            if (name === "Geography Group") {
                node.setLocation(i * 100, 50);
            } else if (name === "Business Group") {
                node.setLocation(i * 100, 150);
            } else if (name === "Manufacturer Group") {
                node.setLocation(i * 100, 250);
            }
            node.setParent(dummy);
            this.box.add(node);
        }
    },
    createDraggableNetwork: function (box) {
        var network = new twaver.vector.Network(box);
        var that = this;
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
                that._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
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
    randomAlarm: function (alarmID, elementID, nonClearedSeverity) {
        var alarm = new twaver.Alarm(alarmID, elementID);
        alarm.setAcked(this.randomBoolean());
        alarm.setCleared(this.randomBoolean());
        alarm.setAlarmSeverity(nonClearedSeverity ? this.randomNonClearedSeverity() : this.randomSeverity());
        alarm.setClient('raisedTime', new Date());
        return alarm;
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
    randomInt: function (n) {
        return Math.floor(Math.random() * n);
    },
    randomBoolean: function () {
        return this.randomInt(2) != 0;
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
});


