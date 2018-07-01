twaver.Alarm = function (id, elementId, alarmSeverity, isAcked, isCleared) {
    twaver.Alarm.superClass.constructor.call(this, id);
    this._elementId = elementId;
    this._alarmSeverity = alarmSeverity;
    this._acked = isAcked || false;
    this._cleared = isCleared || false;
};
_twaver.ext('twaver.Alarm', twaver.Data, {
    IAlarm: true,
    getElementId: function () {
        return this._elementId;
    },
    __accessor: ['acked', 'cleared', 'alarmSeverity']
});
