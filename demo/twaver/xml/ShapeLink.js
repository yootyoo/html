_twaver.addMethod(twaver.ShapeLink, {
    serializeXml: function (serializer, newInstance) {
        twaver.ShapeLink.superClass.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "points", newInstance);
    }
});