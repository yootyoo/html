_twaver.addMethod($Node, {
    serializeXml: function (serializer, newInstance) {
        $Node.superClass.serializeXml.call(this, serializer, newInstance);

        this.serializePropertyXml(serializer, "image", newInstance);
        this.serializePropertyXml(serializer, "location", newInstance);

        if (_twaver.num(this._width) && this._width >= 0) {
            this.serializePropertyXml(serializer, "width", newInstance);
        }
        if (_twaver.num(this._height) && this._height >= 0) {
            this.serializePropertyXml(serializer, "height", newInstance);
        }
    }
});