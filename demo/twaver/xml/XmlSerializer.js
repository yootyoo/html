twaver.XmlSerializer = function (dataBox, settings, filterFunction) {
    this.dataBox = dataBox;
    this.settings = settings ? settings : new twaver.SerializationSettings();
    this.filterFunction = filterFunction;
    this.ref = 0;
    this.refMap = {};
    this.idMap = {};
    this.xmlString = '';
};
_twaver.ext('twaver.XmlSerializer', Object, {
    serialize: function () {
        this.xmlString = "<twaver version='" + twaver.Util.getVersion() + "' platform='html5'>\n";
        this.serializeBody();
        this.xmlString += "</twaver>\n";
        return this.xmlString;
    },
    serializeBody: function () {
        this.ref = 0;
        this.dataBox.getRoots().forEach(this.initRefs, this);

        if (this.settings.isDataBoxSerializable) {
            this.xmlString += "<dataBox class='" + this.dataBox.getClassName() + "'>\n";
            this.dataBox.serializeXml(this, this.dataBox.newInstance());
            this.xmlString += "</dataBox>\n";
        }

        this.dataBox.getRoots().forEach(this.serializeData, this);
    },
    initRefs: function (data) {
        this.refMap[data.getId()] = this.ref++;
        data.getChildren().forEach(this.initRefs, this);
    },
    isSerializable: function (data) {
        if (!this.dataBox.contains(data)) {
            return false;
        }
        if (this.filterFunction && !this.filterFunction(data)) {
            return false;
        }
        return true;
    },
    serializeData: function (data) {
        if (this.isSerializable(data)) {
            var newInstance = data.newInstance();
            var ref = this.refMap[data.getId()];

            this.xmlString += "<data class='" + data.getClassName() + "' ref='" + ref + "'";
            if (this.settings.getPropertyType("id") != null) {
                this.xmlString += " id='" + data.getId() + "'";
            }
            this.xmlString += ">\n";
            data.serializeXml(this, newInstance);
            this.xmlString += "</data>\n";
        }
        data.getChildren().forEach(this.serializeData, this);
    },
    serializePropertyXml: function (instance, property, newInstance) {
        var type = this.settings.getPropertyType(property);
        if (type) {
            var value = _twaver.getValue(instance, property, type);
            var newInstanceValue = _twaver.getValue(newInstance, property, type);
            if (value !== newInstanceValue) {
                this.serializeValue("p", property, value, newInstanceValue, type);
            }
        }
    },
    serializeStyleXml: function (instance, style, newInstance) {
        var type = this.settings.getStyleType(style);
        if (type) {
            var value = instance.getStyle(style);
            var newInstanceValue = newInstance.getStyle(style);
            if (value != newInstanceValue) {
                this.serializeValue("s", style, value, newInstanceValue, type);
            }
        }
    },
    serializeClientXml: function (instance, client, newInstance) {
        var type = this.settings.getClientType(client);
        if (type != null) {
            var value = instance.getClient(client);
            var newInstanceValue = newInstance.getClient(client);
            if (value != newInstanceValue) {
                this.serializeValue("c", client, value, newInstanceValue, type);
            }
        }
    },
    serializeValue: function (c, property, value, newInstanceValue, type) {
        if (value == null) {
            this.xmlString += "\t<" + c + " n='" + property + "' none=''/>\n";
        }
        else if (type === 'cdata') {
            this.xmlString += "\t<" + c + " n='" + property + "'><![CDATA[" + value + "]]></" + c + ">\n";
        }
        else if (type === 'data') {
            var dataRef = this.refMap[value.getId()];
            if (dataRef != null) {
                this.xmlString += "\t<" + c + " n='" + property + "' ref='" + dataRef + "'/>\n";
            }
        }
        else if (type === 'point') {
            if (!newInstanceValue || value.x !== newInstanceValue.x || value.y !== newInstanceValue.y) {
                this.xmlString += "\t<" + c + " n='" + property + "' x='" + value.x + "' y='" + value.y + "'/>\n";
            }
        }
        else if (type === 'list.point') {
            this.xmlString += "\t<" + c + " n='" + property + "'>\n";
            value.forEach(function (point) {
                this.xmlString += "\t\t<p x='" + point.x + "' y='" + point.y + "'/>\n";
            }, this);
            this.xmlString += "\t</" + c + ">\n";
        }
        else if (type === 'list.string' || type === 'list.number') {
            this.xmlString += "\t<" + c + " n='" + property + "'>\n";
            value.forEach(function (item) {
                this.xmlString += "\t\t<s>" + item + "</s>\n";
            }, this);
            this.xmlString += "\t</" + c + ">\n";
        }
        else if (type === 'rectangle') {
            this.xmlString += "\t<" + c + " n='" + property + "' x='" + value.x + "' y='" + value.y + "' w='" + value.width + "' h='" + value.height + "'/>\n";
        }
        else {
            this.xmlString += "\t<" + c + " n='" + property + "'>" + value + "</" + c + ">\n";
        }
    },
    deserialize: function (xmlString, rootParent) {
        _twaver.isDeserializing = true;
        this.xmlString = xmlString;
        var xml = _twaver.xml(xmlString).documentElement;

        this.refMap = {};
        this.idMap = {};

        var list = new $List(),
        	xmlList = new $List(),
        	data, dataXml, i,
        // create datas
        	datas = xml.getElementsByTagName('data'),
        	count = datas.length;

        for (i = 0; i < count; i++) {
            dataXml = datas[i];
            var type = dataXml.getAttribute('class');
            var idType = this.settings.getPropertyType('id');
            if (idType && dataXml.hasAttribute('id')) {
                // create id value
                var id = null;
                if (idType === 'string') {
                    id = dataXml.getAttribute('id');
                }
                else if (idType === 'int') {
                    id = parseInt(dataXml.getAttribute('id'));
                }
                else if (idType === 'number') {
                    id = parseFloat(dataXml.getAttribute('id'));
                }
                else {
                    throw "Unsupported id type '" + idType + "'";
                }
                // remove old data
                if (dataXml.getAttribute('action') === "remove") {
                    this.dataBox.removeById(id);
                    continue;
                }
                // update old data
                data = this.dataBox.getDataById(id);
                // create new data
                if (!data) {
                    data = _twaver.newInstance(type, id);
                }
            } else {
                data = _twaver.newInstance(type);
            }
            if (dataXml.hasAttribute('ref')) {
                var ref = dataXml.getAttribute('ref');
                this.refMap[ref] = data;
            }
            list.add(data);
            xmlList.add(dataXml);
            this.idMap[data.getId()] = data;
        }

        // add all datas to idmap
        this.dataBox.forEach(function (data) {
            this.idMap[data.getId()] = data;
        }, this);

        // fill all datas properties
        count = list.size();
        for (i = 0; i < count; i++) {
            data = list.get(i);
            dataXml = xmlList.get(i);
            data.deserializeXml(this, dataXml);
        }

        // add all datas into box
        for (i = 0; i < count; i++) {
            data = list.get(i);
            if (this.dataBox.containsById(data.getId())) {
                continue;
            }
            if (rootParent && !data.getParent()) {
                data.setParent(rootParent);
            }
            this.dataBox.add(data);
        }
        // fill databox properties
        if (this.settings.isDataBoxSerializable && xml.getElementsByTagName("dataBox").length === 1) {
            this.dataBox.deserializeXml(this, xml.getElementsByTagName("dataBox")[0]);
        }
        _twaver.isDeserializing = false;
    },
    deserializePropertyXml: function (instance, xml, property) {
        var type = this.settings.getPropertyType(property);
        if (type) {
            _twaver.setValue(instance, property, this.deserializeValue(xml, type));
        }
    },
    deserializeStyleXml: function (instance, xml, property) {
        var type = this.settings.getStyleType(property);
        if (type) {
            instance.setStyle(property, this.deserializeValue(xml, type));
        }
    },
    deserializeClientXml: function (instance, xml, property) {
        var type = this.settings.getClientType(property);
        if (type) {
            instance.setClient(property, this.deserializeValue(xml, type));
        }
    },
    deserializeValue: function (xml, type) {
        if (xml.hasAttribute("@none")) {
            return null;
        }
        if (type === 'string') {
            return xml.textContent;
        }
        if (type === 'number') {
            return parseFloat(xml.textContent);
        }
        if (type === 'boolean') {
            return xml.textContent === "true";
        }
        if (type === 'int') {
            return parseInt(xml.textContent);
        }
        if (type === 'point') {
            return { x: parseFloat(xml.getAttribute('x')), y: parseFloat(xml.getAttribute('y')) };
        }
        if (type === 'data') {
            var ref = xml.getAttribute('ref');
            var data = this.refMap[ref];
            if (data) {
                return data;
            } else {
                return this.idMap[ref];
            }
        }
        var count, numbers, ss, i;
        if (type === 'list.point') {
            var points = new $List();
            var ps = xml.getElementsByTagName('p');
            count = ps.length;
            for (i = 0; i < count; i++) {
                var p = ps[i];
                points.add({ x: parseFloat(p.getAttribute('x')), y: parseFloat(p.getAttribute('y')) });
            }
            return points;
        }
        if (type === 'list.string') {
            var strings = new $List();
            ss = xml.getElementsByTagName('s');
            count = ss.length;
            for (i = 0; i < count; i++) {
                strings.add(ss[i].textContent);
            }
            return strings;
        }
        if (type === 'list.number') {
            numbers = new $List();
            ss = xml.getElementsByTagName('s');
            count = ss.length;
            for (i = 0; i < count; i++) {
                numbers.add(parseFloat(ss[i].textContent));
            }
            return numbers;
        }
        if (type === 'array.string') {
            return xml.textContent.split(',');
        }
        if (type === 'array.number') {
            numbers = xml.textContent.split(',');
            count = numbers.length;
            for (i = 0; i < count; i++) {
                numbers[i] = parseFloat(numbers[i]);
            }
            return numbers;
        }
        if (type === 'rectangle') {
            return {
                x: parseFloat(xml.getAttribute('x')),
                y: parseFloat(xml.getAttribute('y')),
                width: parseFloat(xml.getAttribute('w')),
                height: parseFloat(xml.getAttribute('h'))
            };
        }
        return xml.textContent;
    }

});

