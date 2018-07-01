twaver.animate.AnimateManager = {
    timer: null,
    animate: null,
    start: function (newAnimate, delay) {
        var a = twaver.animate.AnimateManager;
        if (newAnimate.current < 0) {
            newAnimate.current = 0;
        }
        if (delay) {
            _twaver.callLater(a.startImpl, null, [newAnimate], delay);
        } else {
            a.startImpl(newAnimate);
        }
    },
    startImpl: function (newAnimate) {
        var a = twaver.animate.AnimateManager;
        if (a.animate) {
            a.endAnimate();
        }
        a.animate = newAnimate;
        a.timer = setTimeout(a.tick, newAnimate.getCurrentDelay());
    },
    tick: function () {
        var a = twaver.animate.AnimateManager;
        var animate = a.animate;
        if (!animate) {
            return;
        }
        if (animate.current < 0) {
            animate.current++;
            return;
        }
        if (animate.current < animate.step) {
            animate.current++;
            animate.action(animate.current / animate.step);
            a.timer = setTimeout(a.tick, animate.getCurrentDelay());
        }
        if (animate.current >= animate.step) {
            a.endAnimate();
        }
    },
    endAnimate: function () {
        var a = twaver.animate.AnimateManager;
        if (a.animate) {
            if (a.animate.shouldBeFinished && a.animate.current < a.animate.step) {
                a.animate.current = a.animate.step;
                a.animate.action(a.animate.current / a.animate.step);
            }
            var f = a.animate.finishFunction;
            a.animate = null;
            if (a.timer) {
                clearTimeout(a.timer);
                a.timer = null;
            }
            if (f) {
                f();
            }
        } else {
            if (a.timer) {
                clearTimeout(a.timer);
                a.timer = null;
            }
        }
    }
};

