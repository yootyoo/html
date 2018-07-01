twaver.AlarmBox = function (elementBox) {
    if (!elementBox) {
        throw "elementBox can not be null.";
    }
    twaver.AlarmBox.superClass.constructor.call(this);
    this._elementBox = elementBox;
    this._alarmElementMapping = new twaver.AlarmElementMapping(this, elementBox);
    this._elementBox.addDataBoxChangeListener(this.handleElementBoxChange, this, true);
    this.addDataBoxChangeListener(this.handleAlarmBoxChange, this, true);
    this.addDataPropertyChangeListener(this.handleAlarmPropertyChange, this, true);
};
_twaver.ext('twaver.AlarmBox', twaver.DataBox, {
    __accessor: ['removeAlarmWhenElementIsRemoved'],

    _name: 'AlarmBox',
    _removeAlarmWhenAlarmIsCleared: false,
    _removeAlarmWhenElementIsRemoved: true,

    getElementBox: function () {
        return this._elementBox;
    },
    isRemoveAlarmWhenAlarmIsCleared: function () {
        return this._removeAlarmWhenAlarmIsCleared;
    },
    setRemoveAlarmWhenAlarmIsCleared: function (removeAlarmWhenAlarmIsCleared) {
        var oldValue = this._removeAlarmWhenAlarmIsCleared;
        this._removeAlarmWhenAlarmIsCleared = removeAlarmWhenAlarmIsCleared;
        this.firePropertyChange("removeAlarmWhenAlarmIsCleared", oldValue, removeAlarmWhenAlarmIsCleared);
        if (removeAlarmWhenAlarmIsCleared) {
            this.toDatas(function (alarm) {
                return alarm.isCleared();
            }).forEach(this.remove, this);
        }
    },
    getAlarmElementMapping: function () {
        return this._alarmElementMapping;
    },
    setAlarmElementMapping: function (alarmElementMapping) {
        if (!alarmElementMapping) {
            throw "alarmElementMapping can not be null";
        }
        if (this._alarmElementMapping === alarmElementMapping) {
            return;
        }
        var oldValue = this._alarmElementMapping;

        this.getDatas().forEach(this._decreaseAlarmState, this);
        this._alarmElementMapping = alarmElementMapping;
        this.getDatas().forEach(this._increaseAlarmState, this);

        this.firePropertyChange("alarmElementMapping", oldValue, alarmElementMapping);
    },
    handleElementBoxChange: function (e) {
        if (e.kind === 'add') {
            this.handleElementAdded(e.data);
        }
        else if (e.kind === 'remove') {
            this.handleElementRemoved(e.data);
            if (this._removeAlarmWhenElementIsRemoved) {
                this.removeAlarmsByElement(e.data);
            }
        }
        else if (e.kind === 'clear') {
            e.datas.forEach(this.handleElementRemoved, this);
            if (this._removeAlarmWhenElementIsRemoved) {
                this.clear();
            }
        }
    },
    handleAlarmBoxChange: function (e) {
        if (e.kind === 'add') {
            this._increaseAlarmState(e.data);
        }
        else if (e.kind === 'remove') {
            this._decreaseAlarmState(e.data);
        }
        else if (e.kind === 'clear') {
            e.datas.forEach(this._decreaseAlarmState, this);
        }
    },
    handleAlarmPropertyChange: function (e) {
        var alarm = e.source;
        if (!alarm.isCleared()) {
            if (e.property === "alarmSeverity") {
                this.handleAlarmSeverityChange(alarm, e);
            } else if (e.property === "acked") {
                this.handleAckedChange(alarm, e);
            }
        }
        if (e.property === "cleared") {
            if (alarm.isCleared()) {
                this._decreaseAlarmState(alarm, true);
                if (this._removeAlarmWhenAlarmIsCleared) {
                    this.remove(alarm);
                }
            } else {
                this._increaseAlarmState(alarm, true);
            }
        }
    },
    handleAckedChange: function (alarm, e) {
        if (!alarm.getAlarmSeverity()) {
            return;
        }
        var elements = this.getCorrespondingElements(alarm);
        if (elements) {
            for (var i = 0; i < elements.size(); i++) {
                var element = elements.get(i);
                if (e.oldValue) {
                    element.getAlarmState().decreaseAcknowledgedAlarm(alarm.getAlarmSeverity());
                } else {
                    element.getAlarmState().decreaseNewAlarm(alarm.getAlarmSeverity());
                }
                if (e.newValue) {
                    element.getAlarmState().increaseAcknowledgedAlarm(alarm.getAlarmSeverity());
                } else {
                    element.getAlarmState().increaseNewAlarm(alarm.getAlarmSeverity());
                }
            }
        }
    },
    handleAlarmSeverityChange: function (alarm, e) {
        var oldValue = e.oldValue;
        var newValue = e.newValue;
        var elements = this.getCorrespondingElements(alarm);
        if (elements) {
            for (var i = 0; i < elements.size(); i++) {
                var element = elements.get(i);
                if (oldValue) {
                    if (alarm.isAcked()) {
                        element.getAlarmState().decreaseAcknowledgedAlarm(oldValue);
                    } else {
                        element.getAlarmState().decreaseNewAlarm(oldValue);
                    }
                }
                if (newValue) {
                    if (alarm.isAcked()) {
                        element.getAlarmState().increaseAcknowledgedAlarm(newValue);
                    } else {
                        element.getAlarmState().increaseNewAlarm(newValue);
                    }
                }
            }
        }
    },
    getCorrespondingAlarms: function (element) {
        return this._alarmElementMapping.getCorrespondingAlarms(element);
    },
    getCorrespondingElements: function (alarm) {
        return this._alarmElementMapping.getCorrespondingElements(alarm);
    },
    handleElementAdded: function (element) {
        var alarms = this.getCorrespondingAlarms(element);
        if (alarms) {
            for (var i = 0; i < alarms.size(); i++) {
                var alarm = alarms.get(i);
                if (alarm.isCleared()) {
                    continue;
                }
                var severity = alarm.getAlarmSeverity();
                if (severity) {
                    if (alarm.isAcked()) {
                        element.getAlarmState().increaseAcknowledgedAlarm(severity);
                    } else {
                        element.getAlarmState().increaseNewAlarm(severity);
                    }
                }
            }
        }
    },
    _increaseAlarmState: function (alarm, forced) {
        if (alarm.isCleared() && !forced) {
            return;
        }
        var severity = alarm.getAlarmSeverity();
        if (severity) {
            var elements = this.getCorrespondingElements(alarm);
            if (elements) {
                for (var i = 0; i < elements.size(); i++) {
                    var element = elements.get(i);
                    if (alarm.isAcked()) {
                        element.getAlarmState().increaseAcknowledgedAlarm(severity);
                    } else {
                        element.getAlarmState().increaseNewAlarm(severity);
                    }
                }
            }
        }
    },
    _decreaseAlarmState: function (alarm, forced) {
        if (alarm.isCleared() && !forced) {
            return;
        }
        var severity = alarm.getAlarmSeverity();
        if (!severity) {
            return;
        }
        var elements = this.getCorrespondingElements(alarm);
        if (elements) {
            for (var i = 0; i < elements.size(); i++) {
                var element = elements.get(i);
                if (alarm.isAcked()) {
                    element.getAlarmState().decreaseAcknowledgedAlarm(severity);
                } else {
                    element.getAlarmState().decreaseNewAlarm(severity);
                }
            }
        }
    },
    handleElementRemoved: function (element) {
        var alarms = this.getCorrespondingAlarms(element);
        if (alarms) {
            alarms.forEach(function (alarm) {
                if (!alarm.isCleared() && alarm.getAlarmSeverity()) {
                    if (alarm.isAcked()) {
                        element.getAlarmState().decreaseAcknowledgedAlarm(alarm.getAlarmSeverity());
                    } else {
                        element.getAlarmState().decreaseNewAlarm(alarm.getAlarmSeverity());
                    }
                }
            });
        }
    },
    removeAlarmsByElement: function (element) {
        var alarms = this.getCorrespondingAlarms(element);
        if (alarms) {
            alarms.forEach(this.remove, this);
        }
    },
    add: function (data, index) {
        if (!data.IAlarm) {
            throw "Only IAlarm can be added into AlarmBox";
        }
        if (this._removeAlarmWhenAlarmIsCleared && data.isCleared()) {
            return;
        }
        twaver.AlarmBox.superClass.add.apply(this, arguments);
    }
});
