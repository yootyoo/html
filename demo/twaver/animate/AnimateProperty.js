twaver.animate.AnimateProperty = function (objects, newValues, finishFunction) {
    this.objects = objects;
    this.newValues = newValues;
    this.finishFunction = finishFunction;
    this.oldValues = new $List();
    var size = this.objects.size();
    for (var i = 0; i < size; i++) {
        var obj = this.objects.get(i);
        this.oldValues.add(this.getPropertyValue(obj));
    }
};
_twaver.ext('twaver.animate.AnimateProperty', twaver.animate.Animate, {
    action: function (rate) {
        var size = this.objects.size();
        for (var i = 0; i < size; i++) {
            var obj = this.objects.get(i);
            var oldValue = this.oldValues.get(i);
            var newValue = this.newValues.get(i);
            this.currentAction(obj, oldValue, newValue, rate);
        }
    },
    getPropertyValue: function (obj) {
    },
    currentAction: function (obj, oldValue, newValue, rate) {
    }
});
