_twaver.addMethod(twaver.ShapeLink, {
    serializeJson: function (serializer, newInstance, dataObject) {
        twaver.ShapeLink.superClass.serializeJson.call(this, serializer, newInstance, dataObject);
        this.serializePropertyJson(serializer, "points", newInstance, dataObject);
    }
});