var $A46 = function (nodecursor) {
    if (nodecursor && nodecursor.length) {
        $A46.superClass.constructor.call(this);
        for (var i = 0; i < nodecursor.length; i++)
            this.ae(nodecursor[i]);
    } else {
        $A46.superClass.constructor.call(this, nodecursor);
    }
};
_twaver.ext($A46, $A35, {
    x1: function () {
        return new $A44(this);
    },
    x2: function () {
        return this.am();
    },
    x3: function () {
        return this.as();
    },
    x4: function () {
        return this.at();
    }
});
