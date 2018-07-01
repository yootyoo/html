twaver.animate.AnimateCenterLocation = function (objects, newValues, finishFunction) {
    twaver.animate.AnimateCenterLocation.superClass.constructor.call(this, objects, newValues, finishFunction);
};
_twaver.ext('twaver.animate.AnimateCenterLocation', twaver.animate.AnimateProperty, {
    getPropertyValue: function (obj) {
        return obj.getCenterLocation();
    },
    currentAction: function (obj, oldValue, newValue, rate) {
        var x = oldValue.x + (newValue.x - oldValue.x) * rate;
        var y = oldValue.y + (newValue.y - oldValue.y) * rate;
        obj.setCenterLocation(x, y);
    }
});
