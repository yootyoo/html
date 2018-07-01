_twaver.addMethod(twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.Follower.superClass.serializeXml.call(this, serializer, newInstance);

        this.serializePropertyXml(serializer, "host", newInstance);
    }
});