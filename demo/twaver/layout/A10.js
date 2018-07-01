var $A10 = function (noderealizer) {
    if (noderealizer) {
        $A10.superClass.constructor.call(this, noderealizer);
    } else {
        $A10.superClass.constructor.call(this, 0, 0);
    }
};
_twaver.ext($A10, $A11, {
    m2: function (noderealizer) {
        return new $A10(noderealizer);
    }
});
