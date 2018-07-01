twaver.animate.AnimateXYZoom = function (view, newXZoom, newYZoom, finishFunction) {
    this.view = view;
    this.oldXZoom = view.getXZoom();
    this.newXZoom = newXZoom;
    this.oldYZoom = view.getYZoom();
    this.newYZoom = newYZoom;
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateXYZoom', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        this.view.setXZoom(this.oldXZoom + (this.newXZoom - this.oldXZoom) * rate, false);
        this.view.setYZoom(this.oldYZoom + (this.newYZoom - this.oldYZoom) * rate, false);
    }
});
