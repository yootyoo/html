_twaver.addMethod(twaver.ShapeNode, {
    serializeXml: function (serializer, newInstance) {
        twaver.ShapeNode.superClass.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "points", newInstance);
        this.serializePropertyXml(serializer, "segments", newInstance);
    }
});