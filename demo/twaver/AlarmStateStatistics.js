twaver.AlarmStateStatistics = function (elementBox) {
    twaver.AlarmStateStatistics.superClass.constructor.apply(this, arguments);
    this.sumNew = 0;
    this.sumAcked = 0;
    this.sumTotal = 0;
    this.severtiyMap = {};
    this.elementMap = {};
    this.setElementBox(elementBox);
};
_twaver.ext('twaver.AlarmStateStatistics', twaver.PropertyChangeDispatcher, {
    getElementBox: function () {
        return this._elementBox;
    },
    setElementBox: function (box) {
        if (!box) {
            throw "ElementBox can not be null";
        }
        if (this._elementBox === box) {
            return;
        }
        var oldValue = this._elementBox;
        if (oldValue) {
            oldValue.removeDataPropertyChangeListener(this.handleElementPropertyChange, this);
            oldValue.removeDataBoxChangeListener(this.handleElementBoxChange, this);
            this.severtiyMap = {};
            this.elementMap = {};
        }
        this._elementBox = box;
        this.reset();
        box.addDataPropertyChangeListener(this.handleElementPropertyChange, this);
        box.addDataBoxChangeListener(this.handleElementBoxChange, this);
        this.firePropertyChange("elementBox", oldValue, box);
    },
    dispose: function () {
        this._elementBox.removeDataPropertyChangeListener(this.handleElementPropertyChange, this);
        this._elementBox.removeDataBoxChangeListener(this.handleElementBoxChange, this);
        delete this._elementBox;
    },
    handleElementPropertyChange: function (e) {
        if (e.property === "alarmState") {
            this.increase(e.source);
            this.fireAlarmStateChange();
        }
    },
    handleElementBoxChange: function (e) {
        if (e.kind === 'add') {
            this.increase(e.data);
            this.fireAlarmStateChange();
        }
        else if (e.kind === 'remove') {
            this.decrease(e.data);
            this.fireAlarmStateChange();
        }
        else if (e.kind === 'clear') {
            this.severtiyMap = {};
            this.elementMap = {};
            this.fireAlarmStateChange();
        }
    },
    fireAlarmStateChange: function () {
        this.sumAcked = 0;
        this.sumNew = 0;
        this.sumTotal = 0;

        twaver.AlarmSeverity.forEach(function (severity) {
            var sumInfo = this.getSumInfo(severity);
            this.sumAcked += sumInfo["ackedCount"];
            this.sumNew += sumInfo["newCount"];
            this.sumTotal += sumInfo["totalCount"];
        }, this);

        this.firePropertyChange("alarmState", false, true);
    },
    getNewAlarmCount: function (severity) {
        if (!severity) {
            return this.sumNew;
        }
        var sumInfo = this.getSumInfo(severity);
        return sumInfo["newCount"];
    },
    getAcknowledgedAlarmCount: function (severity) {
        if (!severity) {
            return this.sumAcked;
        }
        var sumInfo = this.getSumInfo(severity);
        return sumInfo["ackedCount"];
    },
    getTotalAlarmCount: function (severity) {
        if (!severity) {
            return this.sumTotal;
        }
        var sumInfo = this.getSumInfo(severity);
        return sumInfo["totalCount"];
    },
    getSumInfo: function (severity) {
        var sumInfo = this.severtiyMap[severity.name];
        if (!sumInfo) {
            sumInfo = {};
            sumInfo["newCount"] = 0;
            sumInfo["ackedCount"] = 0;
            sumInfo["totalCount"] = 0;
            this.severtiyMap[severity.name] = sumInfo;
        }
        return sumInfo;
    },
    decrease: function (element) {
        var dic = this.elementMap[element.getId()];
        if (dic) {
            delete this.elementMap[element.getId()];
            twaver.AlarmSeverity.forEach(function (severity) {
                var info = dic[severity.name];
                var sumInfo = this.getSumInfo(severity);
                sumInfo["newCount"] = sumInfo["newCount"] - info["newCount"];
                sumInfo["ackedCount"] = sumInfo["ackedCount"] - info["ackedCount"];
                sumInfo["totalCount"] = sumInfo["totalCount"] - info["totalCount"];
            }, this);
        }
    },
    increase: function (element) {
        this.decrease(element);
        if (this._filterFunction && !this._filterFunction(element)) {
            return;
        }
        var dic = {};
        this.elementMap[element.getId()] = dic;
        twaver.AlarmSeverity.forEach(function (severity) {
            var info = {};
            info["newCount"] = element.getAlarmState().getNewAlarmCount(severity);
            info["ackedCount"] = element.getAlarmState().getAcknowledgedAlarmCount(severity);
            info["totalCount"] = element.getAlarmState().getAlarmCount(severity);
            dic[severity.name] = info;

            var sumInfo = this.getSumInfo(severity);
            sumInfo["newCount"] = sumInfo["newCount"] + info["newCount"];
            sumInfo["ackedCount"] = sumInfo["ackedCount"] + info["ackedCount"];
            sumInfo["totalCount"] = sumInfo["totalCount"] + info["totalCount"];
        }, this);
    },
    reset: function () {
        this.severtiyMap = {};
        this.elementMap = {};
        this._elementBox.forEach(this.increase, this);
        this.fireAlarmStateChange();
    },
    setFilterFunction: function (f) {
        var oldValue = this._filterFunction;
        this._filterFunction = f;
        this.reset();
        this.firePropertyChange("filterFunction", oldValue, f);
    },
    getFilterFunction: function () {
        return _filterFunction;
    }
});
