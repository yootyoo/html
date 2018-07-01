twaver.vector.interaction.CreateElementInteraction = function (network, typeOrElementFunction) {
    if (!typeOrElementFunction) {
        typeOrElementFunction = twaver.Node;
    }
    if (twaver.Util.isTypeOf(typeOrElementFunction, twaver.Node)) {
        this.elementFunction = function (point) {
            var element = new typeOrElementFunction();
            if (element instanceof twaver.Node) {
                element.setCenterLocation(point);
            }
            return element;
        };
    } else {
        this.elementFunction = typeOrElementFunction;
    }
    twaver.vector.interaction.CreateElementInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.vector.interaction.CreateElementInteraction', twaver.vector.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown');
    },
    tearDown: function () {
        this.removeListener('mousedown');
    },
    handle_mousedown: function (e) {
        var point = this.network.getLogicalPoint2(e);
        if (point) {
            var element = this.elementFunction(point);
            if (element) {
                this.network.addElementByInteraction(element);
            }
        }
    }
});
