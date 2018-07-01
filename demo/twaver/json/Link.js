_twaver.addMethod(twaver.Link, {
    serializeJson: function (serializer, newInstance, dataObject) {
        twaver.Link.superClass.serializeJson.call(this, serializer, newInstance, dataObject);

        this.serializePropertyJson(serializer, "fromNode", newInstance, dataObject);
        this.serializePropertyJson(serializer, "toNode", newInstance, dataObject);
    }
});