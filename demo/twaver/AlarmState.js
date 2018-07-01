twaver.AlarmState = function (element) {
    this._e = element;
    this._nm = {};
    this._am = {};
    this._ps = null;
    this._haa = null;
    this._hna = null;
    this._hoa = null;
    this._hta = null;
    this._hls = false;
    this._aac = 0;
    this._nac = 0;
};
_twaver.ext('twaver.AlarmState', Object, {
    _ep: true,
    _f: function () {
        this._c1();
        this._c2();
        this._c3();
        this._c4();
        this._c5();
        this._c6();
        this._c7();
        this._e.firePropertyChange("alarmState", null, this);
    },
    getHighestAcknowledgedAlarmSeverity: function () {
        return this._haa;
    },
    getHighestNewAlarmSeverity: function () {
        return this._hna;
    },
    getHighestOverallAlarmSeverity: function () {
        return this._hoa;
    },
    getHighestNativeAlarmSeverity: function () {
        return this._hta;
    },
    hasLessSevereNewAlarms: function () {
        return this._hls;
    },

    _c1: function () {
        var result = null;
        for (var severity in this._am) {
            severity = twaver.AlarmSeverity.getByName(severity);
            if (twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                continue;
            }
            if (this.getAcknowledgedAlarmCount(severity) === 0) {
                continue;
            }
            if (result) {
                result = twaver.AlarmSeverity.compare(result, severity) > 0 ? result : severity;
            } else {
                result = severity;
            }
        }
        this._haa = result;
    },
    _c2: function () {
        var result = null;
        for (var severity in this._nm) {
            severity = twaver.AlarmSeverity.getByName(severity);
            if (twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                continue;
            }
            if (this.getNewAlarmCount(severity) === 0) {
                continue;
            }
            if (result) {
                result = twaver.AlarmSeverity.compare(result, severity) > 0 ? result : severity;
            } else {
                result = severity;
            }
        }
        this._hna = result;
    },
    _c3: function () {
        if (!this._hna) {
            this._hls = false;
            return;
        }
        for (var severity in this._nm) {
            severity = twaver.AlarmSeverity.getByName(severity);
            if (twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                continue;
            }
            if (this.getNewAlarmCount(severity) === 0) {
                continue;
            }
            if (twaver.AlarmSeverity.compare(this._hna, severity) > 0) {
                this._hls = true;
                return;
            }
        }
        this._hls = false;
    },
    _c4: function () {
        var ackResult = this._haa;
        var newResult = this._hna;
        var propagatedResult = this._ps;

        this._hoa = ackResult;
        if (twaver.AlarmSeverity.compare(newResult, this._hoa) > 0) {
            this._hoa = newResult;
        }
        if (twaver.AlarmSeverity.compare(propagatedResult, this._hoa) > 0) {
            this._hoa = propagatedResult;
        }
    },
    _c5: function () {
        var ackResult = this._haa;
        var newResult = this._hna;

        this._hta = ackResult;
        if (twaver.AlarmSeverity.compare(newResult, this._hta) > 0) {
            this._hta = newResult;
        }
    },
    increaseAcknowledgedAlarm: function (severity, increment) {
        if (increment == null) {
            increment = 1;
        }
        if (increment === 0) {
            return;
        }
        var count = this._am[severity.name];
        if (count == null) {
            count = 0;
        }
        count += increment;
        this._am[severity.name] = count;
        this._f();
    },
    increaseNewAlarm: function (severity, increment) {
        if (increment == null) {
            increment = 1;
        }
        if (increment === 0) {
            return;
        }
        var count = this._nm[severity.name];
        if (count == null) {
            count = 0;
        }
        count += increment;
        this._nm[severity.name] = count;
        this._f();
    },
    decreaseAcknowledgedAlarm: function (severity, decrement) {
        if (decrement == null) {
            decrement = 1;
        }
        if (decrement === 0) {
            return;
        }
        var count = this._am[severity.name];
        if (count == null) {
            count = 0;
        }
        count -= decrement;
        if (count < 0) {
            throw "Alarm count can not be negative";
        }
        this._am[severity.name] = count;
        this._f();
    },
    decreaseNewAlarm: function (severity, decrement) {
        if (decrement == null) {
            decrement = 1;
        }
        if (decrement === 0) {
            return;
        }
        var count = this._nm[severity.name];
        if (count == null) {
            count = 0;
        }
        count -= decrement;
        if (count < 0) {
            throw "Alarm count can not be negative";
        }
        this._nm[severity.name] = count;
        this._f();
    },
    acknowledgeAlarm: function (severity) {
        this.decreaseNewAlarm(severity, 1);
        this.increaseAcknowledgedAlarm(severity, 1);
    },
    acknowledgeAllAlarms: function (severity) {
        if (severity) {
            var count = this.getNewAlarmCount(severity);
            this.decreaseNewAlarm(severity, count);
            this.increaseAcknowledgedAlarm(severity, count);
        } else {
            for (var name in this._nm) {
                this.acknowledgeAllAlarms(twaver.AlarmSeverity.getByName(name));
            }
        }
    },
    _c6: function () {
        this._aac = 0;
        for (var severity in this._am) {
            severity = twaver.AlarmSeverity.getByName(severity);
            this._aac += this.getAcknowledgedAlarmCount(severity);
        }
    },
    getAcknowledgedAlarmCount: function (severity) {
        if (severity) {
            var count = this._am[severity.name];
            return count == null ? 0 : count;
        } else {
            return this._aac;
        }
    },
    getAlarmCount: function (severity) {
        return this.getAcknowledgedAlarmCount(severity) + this.getNewAlarmCount(severity);
    },
    _c7: function () {
        this._nac = 0;
        for (var severity in this._nm) {
            severity = twaver.AlarmSeverity.getByName(severity);
            this._nac += this.getNewAlarmCount(severity);
        }
    },
    getNewAlarmCount: function (severity) {
        if (severity) {
            var count = this._nm[severity.name];
            return count == null ? 0 : count;
        } else {
            return this._nac;
        }
    },
    setNewAlarmCount: function (severity, count) {
        this._nm[severity.name] = count;
        this._f();
    },
    removeAllNewAlarms: function (severity) {
        if (severity) {
            delete this._nm[severity];
        } else {
            this._nm = {};
        }
        this._f();
    },
    setAcknowledgedAlarmCount: function (severity, count) {
        this._am[severity.name] = count;
        this._f();
    },
    removeAllAcknowledgedAlarms: function (severity) {
        if (severity) {
            delete this._am[severity.name];
        } else {
            this._am = {};
        }
        this._f();
    },
    isEmpty: function () {
        return this._hoa == null;
    },
    clear: function () {
        this._am = {};
        this._nm = {};
        this._f();
    },
    getPropagateSeverity: function () {
        return this._ps;
    },
    setPropagateSeverity: function (propagateSeverity) {
        if (!this._ep) {
            propagateSeverity = null;
        }
        if (this._ps === propagateSeverity) {
            return;
        }
        var oldValue = this._ps;
        this._ps = propagateSeverity;
        this._f();
        this._e.firePropertyChange('propagateSeverity', oldValue, propagateSeverity);
    },
    isEnablePropagation: function () {
        return this._ep;
    },
    setEnablePropagation: function (enablePropagation) {
        var oldValue = this._ep;
        this._ep = enablePropagation;
        if (this._e.firePropertyChange('enablePropagation', oldValue, enablePropagation)) {
            if (!enablePropagation) {
                this.setPropagateSeverity(null);
            }
        }
    }
});
