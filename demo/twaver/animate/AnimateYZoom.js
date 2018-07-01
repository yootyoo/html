twaver.animate.AnimateYZoom = function (view, newYZoom, finishFunction) {
    this.view = view;
    this.oldYZoom = view.getYZoom();
    this.newYZoom = newYZoom;
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateYZoom', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        this.view.setYZoom(this.oldYZoom + (this.newYZoom - this.oldYZoom) * rate, false);
    }
});
