var $A03 = function () {
    if (arguments.length === 2) {
        $A03.superClass.constructor.call(this, arguments[1].width, arguments[1].height);
        this.x = arguments[0].x;
        this.y = arguments[0].y;
    } else {
        $A03.superClass.constructor.call(this, arguments[2], arguments[3]);
        this.x = arguments[0];
        this.y = arguments[1];
    }
};
_twaver.ext($A03, $A01, {

});
