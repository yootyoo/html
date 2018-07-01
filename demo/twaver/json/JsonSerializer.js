twaver.JsonSerializer = function (dataBox, settings, filterFunction) {
    this.dataBox = dataBox;
    this.settings = settings ? settings : new twaver.SerializationSettings();
    this.filterFunction = filterFunction;
    this.ref = 0;
    this.refMap = {};
    this.idMap = {};
    this.jsonObject = {};
};
_twaver.ext('twaver.JsonSerializer', Object, {
    serialize: function () {
        this.jsonObject = {
            version: twaver.Util.getVersion(),
            platform: 'html5'
        };
        if (this.settings.isImageSerializable) {
            this.jsonObject.images = {};
        }
        this.serializeBody();
        return JSON.stringify(this.jsonObject);
    },
    serializeBody: function () {
        this.ref = 0;
        this.dataBox.getRoots().forEach(this.initRefs, this);

        if (this.settings.isDataBoxSerializable) {
            var dataBoxObject = {
                'class': this.dataBox.getClassName(),
                p: {},
                s: {},
                c: {}
            };
            this.jsonObject.dataBox = dataBoxObject;
            this.dataBox.serializeJson(this, this.dataBox.newInstance(), dataBoxObject);
            if (_twaver.isEmptyObject(dataBoxObject.p)) {
                delete dataBoxObject.p;
            }
            if (_twaver.isEmptyObject(dataBoxObject.s)) {
                delete dataBoxObject.s;
            }
            if (_twaver.isEmptyObject(dataBoxObject.c)) {
                delete dataBoxObject.c;
            }
        }

        this.jsonObject.datas = [];
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
            var dataObject = {
                'class': data.getClassName(),
                ref: ref,
                p: {},
                s: {},
                c: {}
            };
            if (this.settings.getPropertyType("id")) {
                this.jsonObject.id = data.getId();
            }
            this.jsonObject.datas.push(dataObject);
            data.serializeJson(this, newInstance, dataObject);
            if (_twaver.isEmptyObject(dataObject.p)) {
                delete dataObject.p;
            }
            if (_twaver.isEmptyObject(dataObject.s)) {
                delete dataObject.s;
            }
            if (_twaver.isEmptyObject(dataObject.c)) {
                delete dataObject.c;
            }
            if (this.settings.isImageSerializable && data.getImage) {
                var imageName = data.getImage();
                if (typeof imageName === 'string' && !_defaultImages[imageName] && !this.jsonObject.images[imageName]) {
                    var imageAssert = _twaver.getImageAsset(imageName);
                    var image = imageAssert && imageAssert.getImage();
                    if (image && !isImage(image)) {
                        this.jsonObject.images[imageName] = image;
                    }
                }
            }
        }
        data.getChildren().forEach(this.serializeData, this);
    },
    serializePropertyJson: function (instance, property, newInstance, dataObject) {
        var type = this.settings.getPropertyType(property);
        if (type) {
            var value = _twaver.getValue(instance, property, type);
            var newInstanceValue = _twaver.getValue(newInstance, property, type);
            if (value !== newInstanceValue) {
                this.serializeValue(property, value, newInstanceValue, type, dataObject.p);
            }
        }
    },
    serializeStyleJson: function (instance, style, newInstance, dataObject) {
        var type = this.settings.getStyleType(style);
        if (type) {
            var value = instance.getStyle(style);
            var newInstanceValue = newInstance.getStyle(style);
            if (value != newInstanceValue) {
                this.serializeValue(style, value, newInstanceValue, type, dataObject.s);
            }
        }
    },
    serializeClientJson: function (instance, client, newInstance, dataObject) {
        var type = this.settings.getClientType(client);
        if (type != null) {
            var value = instance.getClient(client);
            var newInstanceValue = newInstance.getClient(client);
            if (value != newInstanceValue) {
                this.serializeValue(client, value, newInstanceValue, type, dataObject.c);
            }
        }
    },
    serializeValue: function (property, value, newInstanceValue, type, dataObject) {
        if (value == null) {
            dataObject[property] = null;
        }
        else if (value instanceof $List) {
            dataObject[property] = value._as;
        }
        else if (type === 'data') {
            var dataRef = this.refMap[value.getId()];
            if (dataRef != null) {
                dataObject[property] = dataRef;
            }
        } else {
            dataObject[property] = value;
        }
    },
    deserialize: function (jsonString, rootParent) {
        _twaver.isDeserializing = true;
        this.jsonObject = JSON.parse(jsonString);

        var images = this.jsonObject.images;
        if (this.settings.isImageSerializable && images) {
            Object.keys(images).forEach(function (imageName) {
                _twaver.registerImage(imageName, images[imageName]);
            });
        }

        this.refMap = {};
        this.idMap = {};

        var list = new $List();
        var objectList = new $List();
        var data;

        // create datas
        var count = this.jsonObject.datas.length;
        for (var i = 0; i < count; i++) {
            var dataObject = this.jsonObject.datas[i];
            var type = dataObject['class'];
            var idType = this.settings.getPropertyType('id');
            if (idType && dataObject.id != null) {
                // remove old data
                if (dataObject.action === "remove") {
                    this.dataBox.removeById(dataObject.id);
                    continue;
                }
                // update old data
                data = this.dataBox.getDataById(dataObject.id);
                // create new data
                if (!data) {
                    data = _twaver.newInstance(type, dataObject.id);
                }
            } else {
                data = _twaver.newInstance(type);
            }
            if (dataObject.ref != null) {
                this.refMap[dataObject.ref] = data;
            }
            list.add(data);
            objectList.add(dataObject);
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
            data.deserializeJson(this, objectList.get(i));
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
        if (this.settings.isDataBoxSerializable && this.jsonObject.dataBox) {
            this.dataBox.deserializeJson(this, this.jsonObject.dataBox);
        }
        _twaver.isDeserializing = false;
    },
    deserializePropertyJson: function (instance, json, property) {
        var type = this.settings.getPropertyType(property);
        if (type) {
            _twaver.setValue(instance, property, this.deserializeValue(json, type));
        }
    },
    deserializeStyleJson: function (instance, json, property) {
        var type = this.settings.getStyleType(property);
        if (type) {
            instance.setStyle(property, this.deserializeValue(json, type));
        }
    },
    deserializeClientJson: function (instance, json, property) {
        var type = this.settings.getClientType(property);
        if (type) {
            instance.setClient(property, this.deserializeValue(json, type));
        }
    },
    deserializeValue: function (json, type) {
        if (type === 'data') {
            var data = this.refMap[json];
            if (data) {
                return data;
            } else {
                return this.idMap[json];
            }
        }
        if (type === 'array.number') {
            return json;
        }
        if (json instanceof Array) {
            return new $List(json);
        }
        return json;
    }

});

