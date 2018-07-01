twaver.AlarmStatePropagator = function (elementBox) {
    twaver.AlarmStatePropagator.superClass.constructor.call(this, elementBox, 'alarmState');
};
_twaver.ext('twaver.AlarmStatePropagator', twaver.PropertyPropagator, {
    handleDataPropertyChange: function (e) {
        if (e.property === "enablePropagation") {
            this.propagate(e.source);
        } else {
            twaver.AlarmStatePropagator.superClass.handleDataPropertyChange.call(this, e);
        }
    },
    propagateToParent: function (child, parent) {
        var result = null;
        parent.getChildren().forEach(function (child) {
            var severity = child.getAlarmState().getHighestOverallAlarmSeverity();
            if (twaver.AlarmSeverity.compare(severity, result) > 0) {
                result = severity;
            }
        });
        parent.getAlarmState().setPropagateSeverity(result);
    }

});
