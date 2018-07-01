_twaver.addMethod(twaver.Link, {
    serializeXml: function (serializer, newInstance) {
        twaver.Link.superClass.serializeXml.call(this, serializer, newInstance);

        this.serializePropertyXml(serializer, "fromNode", newInstance);
        this.serializePropertyXml(serializer, "toNode", newInstance);
    }
});