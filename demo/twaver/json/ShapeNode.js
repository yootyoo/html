_twaver.addMethod(twaver.ShapeNode, {
    serializeJson: function (serializer, newInstance, dataObject) {
        twaver.ShapeNode.superClass.serializeJson.call(this, serializer, newInstance, dataObject);
        this.serializePropertyJson(serializer, "points", newInstance, dataObject);
        this.serializePropertyJson(serializer, "segments", newInstance, dataObject);
    }
});