twaver.PropertyBox = function (name) {
    twaver.PropertyBox.superClass.constructor.apply(this, arguments);
};
_twaver.ext('twaver.PropertyBox', twaver.DataBox, {
    _name: 'PropertyBox',

    add: function (data, index) {
        if (!data.IProperty) {
            throw "Only IProperty can be added into PropertyBox";
        }
        twaver.PropertyBox.superClass.add.apply(this, arguments);
    }
});
