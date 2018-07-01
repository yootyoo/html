_twaver.addMethod(twaver.Follower, {
    serializeJson: function (serializer, newInstance, dataObject) {
        twaver.Follower.superClass.serializeJson.call(this, serializer, newInstance, dataObject);

        this.serializePropertyJson(serializer, "host", newInstance, dataObject);
    }
});