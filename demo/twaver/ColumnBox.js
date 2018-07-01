twaver.ColumnBox = function (name) {
    twaver.ColumnBox.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.ColumnBox', twaver.DataBox, {
    _name: 'ColumnBox',

    add: function (data, index) {
        if (!data.IColumn) {
            throw "Only IColumn can be added into ColumnBox";
        }
        twaver.ColumnBox.superClass.add.apply(this, arguments);
    }
});
