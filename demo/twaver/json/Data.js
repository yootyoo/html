_twaver.addMethod(twaver.Data, {
    serializeJson: function (serializer, newInstance, dataObject) {
        if (serializer.settings.isClientSerializable && this._clientMap) {
            for (var clientProp in this._clientMap) {
                this.serializeClientJson(serializer, clientProp, newInstance, dataObject);
            }
        }
        this.serializePropertyJson(serializer, "name", newInstance, dataObject);
        this.serializePropertyJson(serializer, "icon", newInstance, dataObject);
        this.serializePropertyJson(serializer, "toolTip", newInstance, dataObject);
        this.serializePropertyJson(serializer, "parent", newInstance, dataObject);
    },
    serializePropertyJson: function (serializer, property, newInstance, dataObject) {
        serializer.serializePropertyJson(this, property, newInstance, dataObject);
    },
    serializeClientJson: function (serializer, clientPrope, newInstance, dataObject) {
        serializer.serializeClientJson(this, clientPrope, newInstance, dataObject);
    },
    deserializeJson: function (serializer, json) {
        var name;
        for (name in json.p) {
            this.deserializePropertyJson(serializer, json.p[name], name);
        }
        if (serializer.settings.isClientSerializable) {
            for (name in json.c) {
                this.deserializeClientJson(serializer, json.c[name], name);
            }
        }
    },
    deserializePropertyJson: function (serializer, json, property) {
        serializer.deserializePropertyJson(this, json, property);
    },
    deserializeClientJson: function (serializer, json, clientProp) {
        serializer.deserializeClientJson(this, json, clientProp);
    }
});
