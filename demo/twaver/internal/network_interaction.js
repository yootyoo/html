var $network_interaction = {
    handleClicked: function (network, e, element) {
        if (!$ua.isTouchable && e.button !== 0) {
            return;
        }
        if (element) {
            var image = _getElementImage(element);
            image && image.onClick && image.onClick(element, network);
            network.onClickElement(element, e);
            network.fireInteractionEvent({ kind: 'clickElement', event: e, element: element });
        } else {
            network.onClickBackground(e);
            network.fireInteractionEvent({ kind: 'clickBackground', event: e });
        }
    },
    handleDoubleClicked: function (network, e, element) {
        if (!$ua.isTouchable && e.button !== 0) {
            return;
        }
        if (network.isEditingElement()) {
            return;
        }
        if (element) {
            var image = _getElementImage(element);
            image && image.onDoubleClick && image.onDoubleClick(element, network);
            network.onDoubleClickElement(element, e);
            network.fireInteractionEvent({ kind: 'doubleClickElement', event: e, element: element });
        } else {
            network.onDoubleClickBackground(e);
            network.fireInteractionEvent({ kind: 'doubleClickBackground', event: e });
        }
        if (element) {
            if (element instanceof twaver.Link && network.isDoubleClickToLinkBundle()) {
                if (element.ISubNetwork && network.isDoubleClickToSubNetwork() && !_twaver.isCtrlDown(e)) {
                    if (network.isDoubleClickToEmptySubNetwork() || element.getChildrenSize() > 0) {
                        network.setCurrentSubNetwork(element, network.isSubNetworkAnimate(), function () {
                            network.fireInteractionEvent({ kind: 'enterSubNetwork', event: e, element: element });
                        });
                    }
                } else {
                    if (element.reverseBundleExpanded()) {
                        network.fireInteractionEvent({ kind: 'bundleLink', event: e, element: element });
                    }
                }
            }
            else if (element.ISubNetwork && network.isDoubleClickToSubNetwork()) {
                if (network.isDoubleClickToEmptySubNetwork() || element.getChildrenSize() > 0) {
                    network.setCurrentSubNetwork(element, network.isSubNetworkAnimate(), function () {
                        network.fireInteractionEvent({ kind: 'enterSubNetwork', event: e, element: element });
                    });
                }
            }
            else if (element instanceof $Group && network.isDoubleClickToGroupExpand()) {
                element.reverseExpanded();
                network.fireInteractionEvent({ kind: 'expandGroup', event: e, element: element });
            }
        } else {
            if (network.isDoubleClickToUpSubNetwork()) {
                network.upSubNetwork(network.isSubNetworkAnimate(), function () {
                    network.fireInteractionEvent({ kind: 'upSubNetwork', event: e });
                });
            }
        }
    },
    handleKeyDown: function (network, e) {
        if (_twaver.isCtrlDown(e) && e.keyCode == 65) {
            if (network.isKeyboardSelectEnabled() && network.selectAll().size() > 0) {
                network.fireInteractionEvent({ kind: 'selectAll' });
            }
            $html.preventDefault(e);
        }
        else if (e.keyCode == 46) {
            if (network.isKeyboardRemoveEnabled() && network.removeSelection()) {
                network.fireInteractionEvent({ kind: 'removeElement' });
            }
            $html.preventDefault(e);
        }
        else {
            _twaver.showVersion(e);
        }
    },
    handleLongClicked: function(network, e, element){
        if (!$ua.isTouchable && e.button !== 0) {
            return;
        }

        if(element){
            var image = _getElementImage(element);
            image && image.onLongClick && image.onLongClick(element, network);
            network.onLongClickElement(element, e);
            network.fireInteractionEvent({ kind: 'longClickElement', event: e ,element: element });
        }else{
            network.onLongClickBackground(e);
            network.fireInteractionEvent({ kind: 'longClickBackground', event: e  });
        }
    }
},
_getElementImage = function (element) {
    if (element && element._image) {
        if (typeof element._image !== 'object') {
            var image = _twaver.getImageAsset(element._image);
            if (image) {
                return image._image;
            }
        } else {
            return element._image;
        }
    }
    return null;
};
_twaver.interaction = $network_interaction;