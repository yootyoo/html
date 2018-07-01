twaver.SubNetwork = function (id) {
    twaver.SubNetwork.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.SubNetwork', twaver.Follower, {
    ISubNetwork: true,
    _image: $Defaults.IMAGE_SUBNETWORK,
    _icon: $Defaults.ICON_SUBNETWORK,
    _checkLinkAgent: function () {
        twaver.SubNetwork.superClass._checkLinkAgent.call(this);
        var n = this.getChildrenSize();
        for (var i = 0; i < n; i++) {
            var child = this.getChildAt(i);
            if (child instanceof $Node) {
                child._checkLinkAgent();
            }
        }
    }
});
