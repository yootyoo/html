twaver.animate.AnimateZoom = function (view, newZoom, finishFunction) {
    this.view = view;
    this.oldZoom = view.getZoom();
    this.newZoom = newZoom;
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateZoom', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        this.view.setZoom(this.oldZoom + (this.newZoom - this.oldZoom) * rate, false);
    }
});
