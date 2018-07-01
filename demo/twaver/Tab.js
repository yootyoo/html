twaver.Tab = function (id) {
    twaver.Tab.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Tab', twaver.Data, {
    ITab: true,
    __accessor: ['view', 'width', 'closable', 'resizable', 'movable', 'disabled', 'visible'],

    _icon: null,
    _width: $Defaults.TAB_WIDTH,
    _closable: $Defaults.TAB_CLOSABLE,
    _resizable: $Defaults.TAB_RESIZABLE,
    _movable: $Defaults.TAB_MOVABLE,
    _disabled: $Defaults.TAB_DISABLED,
    _visible: $Defaults.TAB_VISIBLE,

    setParent: function (parent) {
        throw 'parent not supported';
    }
});
