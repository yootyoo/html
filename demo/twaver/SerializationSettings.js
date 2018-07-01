twaver.SerializationSettings = function () {
    var s = twaver.SerializationSettings;

    this.isDataBoxSerializable = s.isDataBoxSerializable;
    this.isLayerBoxSerializable = s.isLayerBoxSerializable;
    this.isStyleSerializable = s.isStyleSerializable;
    this.isClientSerializable = s.isClientSerializable;
    this.isImageSerializable = s.isImageSerializable;

    this._pm = _twaver.clone(s._pm);
    this._sm = _twaver.clone(s._sm);
    this._cm = _twaver.clone(s._cm);
};
(function () {
    var s = twaver.SerializationSettings;
    s.isDataBoxSerializable = true;
    s.isLayerBoxSerializable = true;
    s.isStyleSerializable = true;
    s.isClientSerializable = true;
    s.isImageSerializable = true;

    s._pm = {};
    s._sm = {};
    s._cm = {};

    s.setPropertyType = function (property, type) {
        s._pm[property] = type;
    };
    s.getPropertyType = function (property) {
        return s._pm[property];
    }
    s.setStyleType = function (style, type) {
        s._sm[style] = type;
    };
    s.getStyleType = function (style) {
        return s._sm[style];
    };
    s.setClientType = function (client, type) {
        s._cm[client] = type;
    };
    s.getClientType = function (client) {
        return s._cm[client];
    };
})();

_twaver.ext('twaver.SerializationSettings', Object, {
    setPropertyType: function (property, type) {
        this._pm[property] = type;
    },
    getPropertyType: function (property) {
        return this._pm[property];
    },
    setStyleType: function (style, type) {
        this._sm[style] = type;
    },
    getStyleType: function (style) {
        return this._sm[style];
    },
    setClientType: function (client, type) {
        this._cm[client] = type;
    },
    getClientType: function (client) {
        return this._cm[client];
    }
});

