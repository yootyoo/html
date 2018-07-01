twaver.TabBox = function (name) {
    twaver.TabBox.superClass.constructor.apply(this, arguments);
    this.getSelectionModel().setSelectionMode('singleSelection');
};
_twaver.ext('twaver.TabBox', twaver.DataBox, {
    _name: 'TabBox',

    add: function (data, index) {
        if (!data.ITab) {
            throw "Only ITab can be added into TabBox";
        }
        twaver.TabBox.superClass.add.apply(this, arguments);
    }
});
