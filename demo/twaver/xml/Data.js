_twaver.addMethod(twaver.Data, {
    serializeXml: function (serializer, newInstance) {
        if (serializer.settings.isClientSerializable && this._clientMap) {
            for (var clientProp in this._clientMap) {
                this.serializeClientXml(serializer, clientProp, newInstance);
            }
        }
        this.serializePropertyXml(serializer, "name", newInstance);
        this.serializePropertyXml(serializer, "icon", newInstance);
        this.serializePropertyXml(serializer, "toolTip", newInstance);
        this.serializePropertyXml(serializer, "parent", newInstance);
    },
    serializePropertyXml: function (serializer, property, newInstance) {
        serializer.serializePropertyXml(this, property, newInstance);
    },
    serializeClientXml: function (serializer, clientPrope, newInstance) {
        serializer.serializeClientXml(this, clientPrope, newInstance);
    },
    deserializeXml: function (serializer, xml) {
        var ps = xml.getElementsByTagName('p'),
        	count = ps.length,
        	i, p, cs, c;
        for (i = 0; i < count; i++) {
            p = ps[i];
            if (p.hasAttribute('n')) {
                this.deserializePropertyXml(serializer, p, p.getAttribute('n'));
            }
        }

        if (serializer.settings.isClientSerializable) {
            cs = xml.getElementsByTagName('c');
            count = cs.length;
            for (i = 0; i < count; i++) {
                c = cs[i];
                if (c.hasAttribute('n')) {
                    this.deserializeClientXml(serializer, c, c.getAttribute('n'));
                }
            }
        }
    },
    deserializePropertyXml: function (serializer, propertyXml, property) {
        serializer.deserializePropertyXml(this, propertyXml, property);
    },
    deserializeClientXml: function (serializer, clientXml, clientProp) {
        serializer.deserializeClientXml(this, clientXml, clientProp);
    }
});
