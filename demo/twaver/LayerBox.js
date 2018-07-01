twaver.LayerBox = function (elementBox) {
    twaver.LayerBox.superClass.constructor.call(this);
    this._elementBox = elementBox;
    this._defaultLayer = new twaver.Layer($Defaults.LAYER_DEFAULT_ID, $Defaults.LAYER_DEFAULT_NAME);
    this.add(this._defaultLayer);
};
_twaver.ext('twaver.LayerBox', twaver.DataBox, {
    _name: 'LayerBox',

    getElementBox: function () {
        return this._elementBox;
    },
    getDefaultLayer: function () {
        return this._defaultLayer;
    },
    add: function (data, index) {
        if (!data.ILayer) {
            throw "Only ILayer can be added into LayerBox";
        }
        twaver.LayerBox.superClass.add.apply(this, arguments);
    },
    removeById: function (id) {
        if (id === this._defaultLayer.getId()) {
            throw "Cannot remove default layer";
        }
        twaver.LayerBox.superClass.removeById.call(this, id);
    },
    getLayerByElement: function (element) {
        if (!element) {
            return null;
        }
        if (element._layerId === $Defaults.LAYER_DEFAULT_ID) {
            return this._defaultLayer;
        }
        var layer = this.getDataById(element.getLayerId());
        return layer ? layer : this._defaultLayer;
    },
    clear: function () {
        this.toDatas().forEach(function (layer) {
            if (layer != this._defaultLayer) {
                this.removeById(layer.getId());
            }
        }, this);
    }

});
