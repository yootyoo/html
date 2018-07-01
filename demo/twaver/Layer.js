twaver.Layer = function (id) {
    twaver.Layer.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Layer', twaver.Data, {
    ILayer: true,
    __accessor: ['visible', 'movable', 'editable', 'rotatable'],
    _visible: true,
    _movable: true,
    _editable: true,
    _rotatable: true,
    _name: 'Default'
});
