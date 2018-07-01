twaver.animate.AnimateSubNetwork = function (network, subNetwork, finishFunction) {
    this.network = network;
    this.subNetwork = subNetwork;
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateSubNetwork', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        if (rate > 0.5) {
            this.network.getView().style.opacity = rate * 2 - 1;
            this.network._setCurrentSubNetwork(this.subNetwork);
        } else {
            this.network.getView().style.opacity = 1 - rate * 2;
        }
    }
});
