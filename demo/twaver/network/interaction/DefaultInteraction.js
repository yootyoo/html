twaver.network.interaction.DefaultInteraction = function (network) {
    twaver.network.interaction.DefaultInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('twaver.network.interaction.DefaultInteraction', twaver.network.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove', 'keydown');
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove', 'keydown');
    },
    handle_mousedown: function (e) {
        if (!this.network.isValidEvent(e)) {
            return;
        }
        if (this.network.isFocusOnClick()) {
            twaver.Util.setFocus(this.network.getView());
        }
        var element = this.network.getElementAt(e);
        if (e.detail === 2) {
            this.handleDoubleClicked(e, element);
        } else {
            this.handleClicked(e, element);
        }
    },
    handleClicked: function (e, element) {
        $network_interaction.handleClicked(this.network, e, element);
    },
    handleDoubleClicked: function (e, element) {
        $network_interaction.handleDoubleClicked(this.network, e, element);
    },
    handle_keydown: function (e) {
        $network_interaction.handleKeyDown(this.network, e);
    },
    handle_mousemove: function (e) {
        var element = this.network.getElementAt(e),
            preElement = this._preElement,
            preImage = _getElementImage(preElement),
            image = _getElementImage(element);
        if (preElement !== element) {
            if (preElement) {
                preImage && preImage.onMouseLeave && preImage.onMouseLeave(preElement, this.network);
                this.network.onMouseLeave(preElement, e);
            }
            if (element) {
                image && image.onMouseEnter && image.onMouseEnter(element, this.network);
                this.network.onMouseEnter(element, e);
            }
        }
        element && image && image.onMouseMove && image.onMouseMove(element, this.network);
        this.network.onMouseMove(element, e);
        this._preElement = element;
    }
});
