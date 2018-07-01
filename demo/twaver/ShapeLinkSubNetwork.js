twaver.ShapeLinkSubNetwork = function () {
    twaver.ShapeLinkSubNetwork.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.ShapeLinkSubNetwork', twaver.ShapeLink, {
    ISubNetwork: true,
    _icon: $Defaults.ICON_LINKSUBNETWORK
});
