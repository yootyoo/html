twaver.AlarmElementMapping = function (alarmBox, elementBox) {
    if (!elementBox) {
        throw "ElementBox can not be null";
    }
    if (!alarmBox) {
        throw "AlarmBox can not be null";
    }
    this._elementBox = elementBox;
    this._alarmBox = alarmBox;
    this._alarmsFinder = new twaver.QuickFinder(alarmBox, "elementId");
};
_twaver.ext('twaver.AlarmElementMapping', Object, {
    getCorrespondingAlarms: function (element) {
        return this._alarmsFinder.find(element.getId());
    },
    getCorrespondingElements: function (alarm) {
        var element = this._elementBox.getDataById(alarm.getElementId());
        return new $List(element);
    },
    dispose: function () {
        this._alarmsFinder.dispose();
        delete this._elementBox;
        delete this._alarmBox;
        delete this._alarmsFinder;
    }
});
