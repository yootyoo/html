_twaver.addMethod(twaver.ElementBox, {
    serializeJson: function (serializer, newInstance, dataObject) {
        if (serializer.settings.isLayerBoxSerializable) {
            dataObject.layers = [];
            this._layerBox.forEachByDepthFirst(function (layer) {
                var layerObject = {};
                dataObject.layers.push(layerObject);
                if (this._layerBox.getDefaultLayer() !== layer) {
                    layerObject.id = layer.getId();
                }
                if (layer.getName()) {
                    layerObject.name = layer.getName();
                }
                layerObject.visible = layer.isVisible();
                layerObject.editable = layer.isEditable();
                layerObject.movable = layer.isMovable();
            }, null, this);
        }
        if (serializer.settings.isStyleSerializable && this._styleMap) {
            for (var styleProp in this._styleMap) {
                this.serializeStyleJson(serializer, styleProp, newInstance, dataObject);
            }
        }
        twaver.ElementBox.superClass.serializeJson.call(this, serializer, newInstance, dataObject);
    },
    serializeStyleJson: function (serializer, stylePrope, newInstance, dataObject) {
        serializer.serializeStyleJson(this, stylePrope, newInstance, dataObject);
    },
    deserializeStyleJson: function (serializer, json, styleProp) {
        serializer.deserializeStyleJson(this, json, styleProp);
    },
    deserializeJson: function (serializer, json) {
        twaver.ElementBox.superClass.deserializeJson.call(this, serializer, json);

        if (serializer.settings.isLayerBoxSerializable && json.layers) {

            if (json.layers) {
                var count = json.layers.length;
                for (var i = 0; i < count; i++) {
                    var layer;
                    var layerJson = json.layers[i];
                    if (layerJson.id != null) {
                        layer = new twaver.Layer(layerJson.id);
                        if (this._layerBox.getDataById(layer.getId())) {
                            layer = this._layerBox.getDataById(layer.getId());
                        } else {
                            this._layerBox.add(layer);
                        }
                    } else {
                        layer = this._layerBox.getDefaultLayer();
                        //this._layerBox.moveToBottom(layer);
                    }
                    if (layerJson.name) {
                        layer.setName(layerJson.name);
                    }
                    if (layerJson.visible != null) {
                        layer.setVisible(layerJson.visible);
                    }
                    if (layerJson.editable != null) {
                        layer.setEditable(layerJson.editable);
                    }
                    if (layerJson.movable != null) {
                        layer.setMovable(layerJson.movable);
                    }
                }
            }
        }

        if (serializer.settings.isStyleSerializable) {
            for (var name in json.s) {
                this.deserializeStyleJson(serializer, json.s[name], name);
            }
        }
    }
});
