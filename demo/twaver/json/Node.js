_twaver.addMethod($Node, {
    serializeJson: function (serializer, newInstance, dataObject) {
        $Node.superClass.serializeJson.call(this, serializer, newInstance, dataObject);

        this.serializePropertyJson(serializer, "image", newInstance, dataObject);
        this.serializePropertyJson(serializer, "location", newInstance, dataObject);

        if (_twaver.num(this._width) && this._width >= 0) {
            this.serializePropertyJson(serializer, "width", newInstance, dataObject);
        }
        if (_twaver.num(this._height) && this._height >= 0) {
            this.serializePropertyJson(serializer, "height", newInstance, dataObject);
        }
    }
});