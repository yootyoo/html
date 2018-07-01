_twaver.addMethod(twaver.RotatableNode, {
    serializeJson: function (serializer, newInstance, dataObject) {
        twaver.RotatableNode.superClass.serializeJson.call(this, serializer, newInstance, dataObject);

        this.serializePropertyJson(serializer, "angle", newInstance, dataObject);
    }
});