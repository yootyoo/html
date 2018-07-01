_twaver.addMethod(twaver.Element, {
    serializeXml: function (serializer, newInstance) {
        if (serializer.settings.isStyleSerializable && this._styleMap) {
            for (var styleProp in this._styleMap) {
                this.serializeStyleXml(serializer, styleProp, newInstance);
            }
        }

        twaver.Element.superClass.serializeXml.call(this, serializer, newInstance);

        this.serializePropertyXml(serializer, "layerId", newInstance);

        if (this._alarmState.getHighestNativeAlarmSeverity() &&
            serializer.settings.getPropertyType("alarmState") === 'alarmstate') {

            serializer.xmlString += "\t<p n='alarmState'>\n";

            twaver.AlarmSeverity.forEach(function (severity) {
                var count = this.getNewAlarmCount(severity);
                if (count > 0) {
                    serializer.xmlString += "\t\t<n n='" + severity.name + "' c='" + count + "'/>\n";
                }
            }, this._alarmState);

            twaver.AlarmSeverity.forEach(function (severity) {
                var count = this.getAcknowledgedAlarmCount(severity);
                if (count > 0) {
                    serializer.xmlString += "\t\t<a n='" + severity.name + "' c='" + count + "'/>\n";
                }
            }, this._alarmState);

            serializer.xmlString += "\t</p>\n";
        }
    },
    serializeStyleXml: function (serializer, stylePrope, newInstance) {
        serializer.serializeStyleXml(this, stylePrope, newInstance);
    },
    deserializeXml: function (serializer, xml) {
        twaver.Element.superClass.deserializeXml.call(this, serializer, xml);

        if (serializer.settings.isStyleSerializable) {
            var ss = xml.getElementsByTagName('s'),
            	count = ss.length, i, s;
            for (i = 0; i < count; i++) {
                s = ss[i];
                if (s.hasAttribute('n')) {
                    this.deserializeStyleXml(serializer, s, s.getAttribute('n'));
                }
            }
        }
    },
    deserializeStyleXml: function (serializer, styleXml, styleProp) {
        serializer.deserializeStyleXml(this, styleXml, styleProp);
    },
    deserializePropertyXml: function (serializer, propertyXml, property) {
        if (property === "alarmState") {
            if (serializer.settings.getPropertyType("alarmState") === 'alarmstate') {
                var alarm, severity, i, s,
					ss = propertyXml.getElementsByTagName('n');
                for (i = 0; i < ss.length; i++) {
                    s = ss[i];
                    severity = twaver.AlarmSeverity.getByName(s.getAttribute('n'));
                    this._alarmState.setNewAlarmCount(severity, parseInt(s.getAttribute('c')));
                }
                ss = propertyXml.getElementsByTagName('a');
                for (i = 0; i < ss.length; i++) {
                    s = ss[i];
                    severity = twaver.AlarmSeverity.getByName(s.getAttribute('n'));
                    this._alarmState.setAcknowledgedAlarmCount(severity, parseInt(s.getAttribute('c')));
                }
            }
        }
        else {
            twaver.Element.superClass.deserializePropertyXml.call(this, serializer, propertyXml, property);
        }
    }
});
