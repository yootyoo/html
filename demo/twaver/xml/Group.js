_twaver.addMethod($Group, {
    serializeXml: function (serializer, newInstance) {
        $Group.superClass.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "expanded", newInstance);
    }
});