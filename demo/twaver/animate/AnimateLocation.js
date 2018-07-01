twaver.animate.AnimateLocation = function (objects, newValues, finishFunction) {
    twaver.animate.AnimateLocation.superClass.constructor.call(this, objects, newValues, finishFunction);
};
_twaver.ext('twaver.animate.AnimateLocation', twaver.animate.AnimateProperty, {
    getPropertyValue: function (obj) {
        return obj.getLocation();
    },
    currentAction: function (obj, oldValue, newValue, rate) {
        var x = oldValue.x + (newValue.x - oldValue.x) * rate;
        var y = oldValue.y + (newValue.y - oldValue.y) * rate;
        obj.setLocation(x, y);
    }
});
