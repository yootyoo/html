twaver.network.interaction.CreateElementInteraction = function (network, typeOrElementFunction) {
    if (!typeOrElementFunction) {
        typeOrElementFunction = $Node;
    }
    if (twaver.Util.isTypeOf(typeOrElementFunction, $Node)) {
        this.elementFunction = function (point) {
            var element = new typeOrElementFunction();
            if (element instanceof $Node) {
                element.setCenterLocation(point);
            }
            return element;
        };
    } else {
        this.elementFunction = typeOrElementFunction;
    }
    twaver.network.interaction.CreateElementInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.CreateElementInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown');
    },
    tearDown: function () {
        this.removeListener('mousedown');
    },
    handle_mousedown: function (e) {
        var point = this.network.getLogicalPoint(e);
        if (point) {
            var element = this.elementFunction(point);
            if (element) {
                this.network.addElementByInteraction(element);
            }
        }
    }
});
