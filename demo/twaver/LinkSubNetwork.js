twaver.LinkSubNetwork = function () {
    twaver.LinkSubNetwork.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.LinkSubNetwork', twaver.Link, {
    ISubNetwork: true,
    _icon: $Defaults.ICON_LINKSUBNETWORK
});
