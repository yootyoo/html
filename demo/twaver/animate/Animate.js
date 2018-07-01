twaver.animate.Animate = function () {

};
_twaver.ext('twaver.animate.Animate', Object, {
    current: 0,
    step: 8,
    delay: 4,
    finishFunction: null,
    shouldBeFinished: false,

    getCurrentDelay: function () {
        return this.delay * this.current + 1;
    },
    action: function (rate) {

    }
});
