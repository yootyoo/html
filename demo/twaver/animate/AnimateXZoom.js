twaver.animate.AnimateXZoom = function (view, newXZoom, finishFunction) {
    this.view = view;
    this.oldXZoom = view.getXZoom();
    this.newXZoom = newXZoom;
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateXZoom', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        this.view.setXZoom(this.oldXZoom + (this.newXZoom - this.oldXZoom) * rate, false);
    }
});
