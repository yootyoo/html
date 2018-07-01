twaver.ShapeSubNetwork = function (id) {
    twaver.ShapeSubNetwork.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.ShapeSubNetwork', twaver.ShapeNode, {
    ISubNetwork: true,
    _icon: $Defaults.ICON_SHAPESUBNETWORK,
    _checkLinkAgent: function () {
        twaver.ShapeSubNetwork.superClass._checkLinkAgent.call(this);
        var n = this.getChildrenSize();
        for (var i = 0; i < n; i++) {
            var child = this.getChildAt(i);
            if (child instanceof $Node) {
                child._checkLinkAgent();
            }
        }
    }
});
