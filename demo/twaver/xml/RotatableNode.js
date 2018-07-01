_twaver.addMethod(twaver.RotatableNode, {
    serializeXml: function (serializer, newInstance) {
        twaver.RotatableNode.superClass.serializeXml.call(this, serializer, newInstance);

        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});