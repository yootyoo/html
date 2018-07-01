_twaver.addMethod($Group, {
    serializeJson: function (serializer, newInstance, dataObject) {
        $Group.superClass.serializeJson.call(this, serializer, newInstance, dataObject);
        this.serializePropertyJson(serializer, "expanded", newInstance, dataObject);
    }
});