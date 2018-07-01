twaver.AlarmSeverity = function (value, name, nickName, color, displayName) {
    this.value = value;
    this.name = name;
    this.nickName = nickName;
    this.color = color;
    this.displayName = displayName;
};
_twaver.ext('twaver.AlarmSeverity', Object, {
    toString: function () {
        if (this.displayName) {
            return this.displayName;
        }
        return this.name;
    }
});
(function () {
    var s = twaver.AlarmSeverity;
    s.severities = new $List();
    s._vm = {};
    s._nm = {};
    s._cp = function (s1, s2) {
        if (s1 && s2) {
            var v = s1.value - s2.value;
            if (v > 0) return 1;
            if (v < 0) return -1;
            return 0;
        }
        if (s1 && !s2) return 1;
        if (!s1 && s2) return -1;
        return 0;
    };
    s.forEach = function (callbackFunction, scope) {
        s.severities.forEach(callbackFunction, scope)
    };
    s.getSortFunction = function () {
        return s._cp;
    };
    s.setSortFunction = function (sortFunction) {
        s._cp = sortFunction;
        s.severities.sort(sortFunction);
    }
    s.add = function (value, name, nickName, color, displayName) {
        var severity = new s(value, name, nickName, color, displayName);
        s._vm[value] = severity;
        s._nm[name] = severity;
        s.severities.add(severity);
        s.severities.sort(s._cp);
        return severity;
    };
    s.remove = function (name) {
        var severity = s._nm[name];
        if (severity) {
            delete s._nm[name];
            delete s._vm[severity.value];
            s.severities.remove(severity);
        }
        return severity;
    };
    s.CRITICAL = s.add(500, "Critical", "C", '#FF0000');
    s.MAJOR = s.add(400, "Major", "M", '#FFA000');
    s.MINOR = s.add(300, "Minor", "m", '#FFFF00');
    s.WARNING = s.add(200, "Warning", "W", '#00FFFF');
    s.INDETERMINATE = s.add(100, "Indeterminate", "N", '#C800FF');
    s.CLEARED = s.add(0, "Cleared", "R", '#00FF00');
    s.isClearedAlarmSeverity = function (severity) {
        return severity ? severity.value === 0 : false;
    };
    s.getByName = function (name) {
        return s._nm[name];
    };
    s.getByValue = function (value) {
        return s._vm[value];
    };
    s.clear = function () {
        s.severities.clear();
        s._vm = {};
        s._nm = {};
    };
    s.compare = function (severity1, severity2) {
        return s._cp(severity1, severity2);
    }
})();

