_twaver.addMethod(twaver.ElementBox, {

    serializeXml: function (serializer, newInstance) {

        if (serializer.settings.isLayerBoxSerializable) {
            serializer.xmlString += "\t<layerBox>\n";

            this._layerBox.forEachByDepthFirst(function (layer) {
                if (this._layerBox.getDefaultLayer() === layer) {
                    serializer.xmlString += "\t\t<layer ";
                } else {
                    serializer.xmlString += "\t\t<layer id='" + layer.getId() + "' ";
                }
                if (layer.getName()) {
                    serializer.xmlString += "name='" + layer.getName() + "' ";
                }
                serializer.xmlString += "visible='" + layer.isVisible() +
									    "' editable='" + layer.isEditable() +
									    "' movable='" + layer.isMovable() + "'/>\n";
            }, null, this);

            serializer.xmlString += "\t</layerBox>\n";

        }

        if (serializer.settings.isStyleSerializable && this._styleMap) {
            for (var styleProp in this._styleMap) {
                this.serializeStyleXml(serializer, styleProp, newInstance);
            }
        }

        twaver.ElementBox.superClass.serializeXml.call(this, serializer, newInstance);

    },
    serializeStyleXml: function (serializer, stylePrope, newInstance) {
        serializer.serializeStyleXml(this, stylePrope, newInstance);
    },
    deserializeStyleXml: function (serializer, styleXml, styleProp) {
        serializer.deserializeStyleXml(this, styleXml, styleProp);
    },
    deserializeXml: function (serializer, xml) {
        twaver.ElementBox.superClass.deserializeXml.call(this, serializer, xml);

        if (serializer.settings.isLayerBoxSerializable && xml.getElementsByTagName("layerBox").length == 1) {

            var layers = xml.getElementsByTagName("layerBox")[0].getElementsByTagName('layer');
            for (var i = 0; i < layers.length; i++) {
                var layerXml = layers[i];
                var layer;
                if (layerXml.hasAttribute("id")) {
                    var idType = serializer.settings.getPropertyType("layerId");
                    if (idType === 'string') {
                        layer = new twaver.Layer(layerXml.getAttribute('id'));
                    }
                    else if (idType === 'int') {
                        layer = new twaver.Layer(parseInt(layerXml.getAttribute('id')));
                    }
                    else if (idType === 'number') {
                        layer = new twaver.Layer(parseFloat(layerXml.getAttribute('id')));
                    }
                    else {
                        throw "Unsupported layer id type '" + idType + "'";
                    }
                    if (this._layerBox.getDataById(layer.getId())) {
                        layer = this._layerBox.getDataById(layer.getId());
                    } else {
                        this._layerBox.add(layer);
                    }
                } else {
                    layer = this._layerBox.getDefaultLayer();
                    //this._layerBox.moveToBottom(layer);
                }
                if (layerXml.hasAttribute("name")) {
                    layer.setName(layerXml.getAttribute('name'));
                }
                if (layerXml.hasAttribute("visible")) {
                    layer.setVisible(layerXml.getAttribute('visible') === "true");
                }
                if (layerXml.hasAttribute("editable")) {
                    layer.setEditable(layerXml.getAttribute('editable') === "true");
                }
                if (layerXml.hasAttribute("movable")) {
                    layer.setMovable(layerXml.getAttribute('movable') === "true");
                }
            }
        }

        if (serializer.settings.isStyleSerializable) {
            var ss = xml.getElementsByTagName('s');
            var count = ss.length;
            for (var i = 0; i < count; i++) {
                var s = ss[i];
                if (s.hasAttribute('n')) {
                    this.deserializeStyleXml(serializer, s, s.getAttribute('n'));
                }
            }
        }
    }
});