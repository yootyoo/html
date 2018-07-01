_twaver.addMethod(twaver.Element, {
    serializeJson: function (serializer, newInstance, dataObject) {
        if (serializer.settings.isStyleSerializable && this._styleMap) {
            for (var styleProp in this._styleMap) {
                this.serializeStyleJson(serializer, styleProp, newInstance, dataObject);
            }
        }
        twaver.Element.superClass.serializeJson.call(this, serializer, newInstance, dataObject);

        this.serializePropertyJson(serializer, "layerId", newInstance, dataObject);

        if (this._alarmState.getHighestNativeAlarmSeverity() &&
            serializer.settings.getPropertyType("alarmState") === 'alarmstate') {

            var as = {
                n: {},
                a: {}
            };
            dataObject.p.alarmState = as;

            twaver.AlarmSeverity.forEach(function (severity) {
                var count = this.getNewAlarmCount(severity);
                if (count > 0) {
                    as.n[severity.name] = count;
                }
            }, this._alarmState);

            twaver.AlarmSeverity.forEach(function (severity) {
                var count = this.getAcknowledgedAlarmCount(severity);
                if (count > 0) {
                    as.a[severity.name] = count;
                }
            }, this._alarmState);

            if (_twaver.isEmptyObject(as.n)) {
                delete as.n;
            }
            if (_twaver.isEmptyObject(as.a)) {
                delete as.a;
            }
            if (_twaver.isEmptyObject(as)) {
                delete dataObject.p.alarmState;
            }
        }
    },
    serializeStyleJson: function (serializer, stylePrope, newInstance, dataObject) {
        serializer.serializeStyleJson(this, stylePrope, newInstance, dataObject);
    },
    deserializeJson: function (serializer, json) {
        twaver.Element.superClass.deserializeJson.call(this, serializer, json);

        if (serializer.settings.isStyleSerializable) {
            for (var name in json.s) {
                this.deserializeStyleJson(serializer, json.s[name], name);
            }
        }
    },
    deserializeStyleJson: function (serializer, json, styleProp) {
        serializer.deserializeStyleJson(this, json, styleProp);
    },
    deserializePropertyJson: function (serializer, json, property) {
        if (property === "alarmState") {
            if (serializer.settings.getPropertyType("alarmState") === 'alarmstate') {
                var name;
                for (name in json.n) {
                    this._alarmState.setNewAlarmCount(twaver.AlarmSeverity.getByName(name), json.n[name]);
                }
                for (name in json.a) {
                    this._alarmState.setAcknowledgedAlarmCount(twaver.AlarmSeverity.getByName(name), json.a[name]);
                }
            }
        }
        else {
            twaver.Element.superClass.deserializePropertyJson.call(this, serializer, json, property);
        }
    }
});
