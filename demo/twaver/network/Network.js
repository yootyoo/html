twaver.network.Network = function (elementBox) {
    twaver.network.Network.superClass.constructor.apply(this, arguments);
    this._elementUIMap = {};
    this._layerMap = {};
    this._layerList = new $List();

    /* 
    network hierarchy:
    -> view		   
    -> rootDiv
    -> topDiv
    -> attachmentDiv
    -> layersDiv
    -> layer n
    -> layer ...
    -> default layer
    -> bottomDiv
    */
    this._view = $html.createView('auto');
    this._rootDiv = $html.createDiv();
    this._topDiv = $html.createDiv();
    this._attachmentDiv = $html.createDiv();
    this._layersDiv = $html.createDiv();
    this._bottomDiv = $html.createDiv();

    this._rootDiv.appendChild(this._bottomDiv);
    this._rootDiv.appendChild(this._layersDiv);
    this._rootDiv.appendChild(this._attachmentDiv);
    this._rootDiv.appendChild(this._topDiv);
    this._view.appendChild(this._rootDiv);

    this.setElementBox(elementBox ? elementBox : new twaver.ElementBox());
    if ($ua.isMSToucheable) {
        this.setMSTouchInteractions();
    } else {
        this.setDefaultInteractions(false);
    }

    var self = this;
    this._flowLink = function () {
        if (self.isMovingElement() || self.isSelectingElement() || self.isEditingElement() || self._box._layoutMovingElements) {
            return;
        }
        if (!self._flowLinkQuickFinder) {
            self._flowLinkQuickFinder = new twaver.QuickFinder(self._box, "link.flow", "style");
        }
        var links = self._flowLinkQuickFinder.find(true);
        links.forEach(function (link) {
            link._styleMap["link.flow.offset"] = self.getLinkFlowOffset(link);
            var ui = self.getElementUI(link);
            ui.drawBody();
        })
    }
    this.setToolTipEnabled($Defaults.NETWORK_TOOLTIP_ENABLED);
    
    this._view.addEventListener('scroll',function(e){
    	__l.twm(self);
    });
    
    this.addPropertyChangeListener(function(e){
    	if(e.property === 'zoom'){
         	__l.twm(self);
    	}
    });
};
_twaver.ext('twaver.network.Network', twaver.controls.View, {
    __accessor: ['selectMode', 'makeVisibleOnSelected', 'movableFunction',
        'editPointSize', 'editPointFillColor',
		'editPointOutlineWidth', 'editPointOutlineColor', 'editLineColor',
		'editLineWidth', 'resizePointSize', 'resizePointFillColor', 'resizePointOutlineWidth',
		'resizePointOutlineColor', 'resizeLineColor', 'resizeLineWidth',
        'rotatePointSize','rotatePointFillColor','rotatePointOffset',
        'rotatePointOutlineWidth','rotatePointOutlineColor','rotateScaleFillColor','rotateScaleFontColor','rotateScaleWidth','rotateScaleHeight',
		'selectOutlineColor', 'selectOutlineWidth', 'selectFillColor',
		'lazyMoveOutlineColor', 'lazyMoveOutlineWidth', 'lazyMoveFillColor',
		'rectSelectFilter', 'selectionTolerance'],

    __bool: ['doubleClickToUpSubNetwork', 'doubleClickToSubNetwork', 'doubleClickToEmptySubNetwork',
			    'doubleClickToLinkBundle', 'doubleClickToGroupExpand',
			    'subNetworkAnimate', 'lazyMoveAnimate', 'resizeAnimate',
			    'noAgentLinkVisible', 'keyboardRemoveEnabled', 'keyboardSelectEnabled',
			    'sendToTopOnSelected', 'lazyMoveFill', 'editingElement','rotatingElement', 'movingElement',
                'selectingElement', 'rectSelectEnabled', 'limitElementInPositiveLocation', 'showRotateScale', 'transparentSelectionEnable'],

    _viewRect: { x: 0, y: 0, width: 0, height: 0 },
    _currentSubNetwork: null,
    _selectMode: $Defaults.NETWORK_SELECT_MODE,
    _noAgentLinkVisible: $Defaults.NETWORK_NO_AGENT_LINK_VISIBLE,
    _makeVisibleOnSelected: $Defaults.NETWORK_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: $Defaults.NETWORK_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: $Defaults.NETWORK_KEYBOARD_SELECT_ENABLED,
    _rectSelectEnabled: $Defaults.NETWORK_RECT_SELECT_ENABLED,
    _rectSelectFilter: null,
    _subNetworkAnimate: $Defaults.NETWORK_SUBNETWORK_ANIMATE,
    _transparentSelectable: $Defaults.NETWORK_TRANSPARENT_SELECTABLE,
    _removeElementUIOnInvisible: $Defaults.NETWORK_REMOVE_ELEMENTUI_ON_INVISIBLE,
    _elementUIFunction: $Defaults.ELEMENTUI_FUNCTION,

    _doubleClickToUpSubNetwork: $Defaults.NETWORK_DOUBLECLICK_TO_UPSUBNETWORK,
    _doubleClickToSubNetwork: $Defaults.NETWORK_DOUBLECLICK_TO_SUBNETWORK,
    _doubleClickToEmptySubNetwork: $Defaults.NETWORK_DOUBLECLICK_TO_EMPTYSUBNETWORK,
    _doubleClickToLinkBundle: $Defaults.NETWORK_DOUBLECLICK_TO_LINKBUNDLE,
    _doubleClickToGroupExpand: $Defaults.NETWORK_DOUBLECLICK_TO_GROUPEXPAND,

    _sendToTopOnSelected: $Defaults.NETWORK_SENDTOTOP_ON_SELECTED,
    _selectOutlineColor: $Defaults.NETWORK_SELECT_OUTLINE_COLOR,
    _selectOutlineWidth: $Defaults.NETWORK_SELECT_OUTLINE_WIDTH,
    _selectFillColor: $Defaults.NETWORK_SELECT_FILL_COLOR,

    _lazyMoveOutlineColor: $Defaults.NETWORK_LAZYMOVE_OUTLINE_COLOR,
    _lazyMoveOutlineWidth: $Defaults.NETWORK_LAZYMOVE_OUTLINE_WIDTH,
    _lazyMoveFillColor: $Defaults.NETWORK_LAZYMOVE_FILL_COLOR,
    _lazyMoveFill: $Defaults.NETWORK_LAZYMOVE_FILL,
    _lazyMoveAnimate: $Defaults.NETWORK_LAZYMOVE_ANIMATE,

    _editPointSize: $Defaults.NETWORK_EDIT_POINT_SIZE,
    _editPointFillColor: $Defaults.NETWORK_EDIT_POINT_FILL_COLOR,
    _editPointOutlineColor: $Defaults.NETWORK_EDIT_POINT_OUTLINE_COLOR,
    _editPointOutlineWidth: $Defaults.NETWORK_EDIT_POINT_OUTLINE_WIDTH,
    _editLineColor: $Defaults.NETWORK_EDIT_LINE_COLOR,
    _editLineWidth: $Defaults.NETWORK_EDIT_LINE_WIDTH,

    _resizePointSize: $Defaults.NETWORK_RESIZE_POINT_SIZE,
    _resizePointFillColor: $Defaults.NETWORK_RESIZE_POINT_FILL_COLOR,
    _resizePointOutlineColor: $Defaults.NETWORK_RESIZE_POINT_OUTLINE_COLOR,
    _resizePointOutlineWidth: $Defaults.NETWORK_RESIZE_POINT_OUTLINE_WIDTH,
    _resizeLineColor: $Defaults.NETWORK_RESIZE_LINE_COLOR,
    _resizeLineWidth: $Defaults.NETWORK_RESIZE_LINE_WIDTH,
    _resizeAnimate: $Defaults.NETWORK_RESIZE_ANIMATE,

    _rotatePointSize: $Defaults.NETWORK_ROTATE_POINT_SIZE,
    _rotatePointFillColor: $Defaults.NETWORK_ROTATE_POINT_FILL_COLOR,
    _rotatePointOffset: $Defaults.NETWORK_ROTATE_POINT_OFFSET,
    _rotatePointOutlineWidth: $Defaults.NETWORK_ROTATE_POINT_OUTLINE_WIDTH,
    _rotatePointOutlineColor: $Defaults.NETWORK_ROTATE_POINT_OUTLINE_COLOR,

    _rotateScaleWidth: $Defaults.NETWORK_ROTATE_SCALE_WIDTH,
    _rotateScaleHeight: $Defaults.NETWORK_ROTATE_SCALE_HEIGHT,
    _rotateScaleFillColor: $Defaults.NETWORK_ROTATE_SCALE_FILL_COLOR,
    _rotateScaleFontColor: $Defaults.NETWORK_ROTATE_SCALE_FONT_COLOR,

    _limitElementInPositiveLocation: $Defaults.NETWORK_LIMIT_ELEMENT_INPOSITIVE_LOCATION,


    _linkFlowInterval: $Defaults.NETWORK_LINK_FLOW_INTERVAL,
    _selectionTolerance: $Defaults.NETWORK_SELECTION_TOLERANCE,

    _invalidate: false,
    _invalidateElementVisibility: false,
    _invalidateElementIndex: false,

    _isEditingElement: false,
    _isRotatingElement: false,
    _isMovingElement: false,
    _isSelectingElement: false,
    _hasEditInteraction: false,
    _showRotateScale: true,
    _transparentSelectionEnable:twaver.Defaults.NETWORK_TRANSPARENT_SELECTION_ENABLE,

    getLabel: function (element) {
        return element.getStyle('network.label') || element.getName();
    },
    isToolTipEnabled: function () {
        return this._toolTipEnabled ? true : false;
    },
    setToolTipEnabled: function (value) {
        this._toolTipEnabled = value;
        if (value) {
            if (!this._toolTipListener) {
                var self = this;
                this._toolTipListener = function (e) {
                    var element = self.getElementAt(e);
                    if (self._preElement === element) {
                        return;
                    }
                    self._preElement = element;
                    if (element) {
                        var toolTip = self.getToolTip(element);
                        $popup.showToolTip({ x: e.pageX, y: e.pageY }, toolTip);
                        var toolTipDiv = $popup.getToolTipDiv();
                        if (toolTipDiv.children.length > 0) {
                            var viewBounds = self._view.getBoundingClientRect();
                            var toolTipBounds = toolTipDiv.getBoundingClientRect();
                            if (toolTipBounds.width + toolTipBounds.left > viewBounds.width + viewBounds.left) {
                                toolTipDiv.style.left = (viewBounds.width + viewBounds.left - toolTipBounds.width + (document.documentElement.scrollLeft || document.body.scrollLeft)) + "px";
                            }
                            if (toolTipBounds.height + toolTipBounds.top > viewBounds.height + viewBounds.top) {
                                toolTipDiv.style.top = (viewBounds.height + viewBounds.top - toolTipBounds.height + (document.documentElement.scrollTop || document.body.scrollTop)) + "px";
                            }
                        }
                    } else {
                        $popup.hideToolTip();
                    }
                };
                this._view.addEventListener('mousemove', this._toolTipListener, true);
                this.firePropertyChange('toolTipEnabled', false, true);
            }
        } else {
            if (this._toolTipListener) {
                $popup.hideToolTip();
                this._view.removeEventListener('mousemove', this._toolTipListener, true);
                delete this._toolTipListener;
                this.firePropertyChange('toolTipEnabled', true, false);
            }
        }
    },
    isLinkFlowEnabled: function () {
        return this._linkFlowEnabled ? true : false;
    },
    setLinkFlowEnabled: function (value) {
        if (value) {
            if (!this._linkFlowEnabled) {
                this._linkFlowEnabled = true;
                this.firePropertyChange('linkFlowEnabled', false, true);
            }
            clearInterval(this._linkFlowTimerId);
            this._linkFlowTimerId = setInterval(this._flowLink, this._linkFlowInterval);
        } else {
            if (this._linkFlowEnabled) {
                this._linkFlowEnabled = false;
                this.firePropertyChange('linkFlowEnabled', true, false);
            }
            clearInterval(this._linkFlowTimerId);
            delete this._linkFlowTimerId;
        }
    },
    getLinkFlowInterval: function () {
        return this._linkFlowInterval;
    },
    setLinkFlowInterval: function (value) {
        var oldValue = this._linkFlowInterval;
        this._linkFlowInterval = value;
        this.firePropertyChange('linkFlowInterval', oldValue, value);

        clearInterval(this._linkFlowTimerId);
        if (this.isLinkFlowEnabled()) {
            this._linkFlowTimerId = setInterval(this._flowLink, this._linkFlowInterval);
        }
    },
    getTopDiv: function () {
        return this._topDiv;
    },
    getAttachmentDiv: function () {
        return this._attachmentDiv;
    },
    getLayersDiv: function () {
        return this._layersDiv;
    },
    getBottomDiv: function () {
        return this._bottomDiv;
    },
    validateImpl: function () {
    	__l.twm(this);
    	if(!this.__lics__){
    		return;
    	}
        var i = 0;
        var canvas = null;
        var attachments = null;
        var attachment = null;

        var needToUpdateViewRect = this._invalidateElementVisibility;

        if (this._invalidateElementVisibility) {
            this._invalidateElementVisibility = false;

            // in this case we should update element index too.
            if (this._removeElementUIOnInvisible) {
                this._invalidateElementIndex = true;
            }

            this.forEachElementUI(function (ui) {
                ui.validate();
                var element = ui.getElement();
                ui.setVisible(this.isVisible(element));

                // remove element ui when invisible
                if (this._removeElementUIOnInvisible) {
                    canvas = this.getLayerDivByElement(element);
                    if (ui.isVisible()) {
                        if (ui.getView().parentNode !== canvas) {
                            canvas.appendChild(ui.getView());
                            attachments = ui.getAttachments();
                            for (i = 0; i < attachments.size(); i++) {
                                attachment = attachments.get(i);
                                if (attachment.isShowInAttachmentDiv()) {
                                    this._attachmentDiv.appendChild(attachment.getView());
                                }
                            }
                        }
                    }
                    else {
                        if (ui.getView().parentNode === canvas) {
                            canvas.removeChild(ui.getView());
                            attachments = ui.getAttachments();
                            for (i = 0; i < attachments.size(); i++) {
                                attachment = attachments.get(i);
                                if (attachment.isShowInAttachmentDiv()) {
                                    this._attachmentDiv.removeChild(attachment.getView());
                                }
                            }
                        }
                    }
                }
                else {
                    // keep elementui in layer canvas 
                    if (!ui.getView().parentNode) {
                        canvas = this.getLayerDivByElement(element);
                        canvas.appendChild(ui.getView());
                        attachments = ui.getAttachments();
                        for (i = 0; i < attachments.size(); i++) {
                            attachment = attachments.get(i);
                            if (attachment.isShowInAttachmentDiv()) {
                                this._attachmentDiv.appendChild(attachment.getView());
                            }
                        }
                    }
                }
            }, null, this);
        }
        if (this._invalidateElementIndex) {
            this._invalidateElementIndex = false;
            var attachmentRef;
            var self = this;
            this._box.getLayerBox().forEachByDepthFirst(function (layer) {
                var canvas = self._layerMap[layer.getId()];
                var viewRef;
                self._box.forEachByLayer(function (element) {
                    var ui = self._elementUIMap[element.getId()];
                    if (ui && ui.getView().parentNode === canvas) {
                        //ui.getView().style.zIndex = index++;
                        viewRef = $html.insertAfter(ui.getView(), viewRef);
                        var attachments = ui.getAttachments();
                        for (var i = 0; i < attachments.size(); i++) {
                            var attachment = attachments.get(i);
                            if (attachment.getView().parentNode === self._attachmentDiv) {
                                //attachment.getView().style.zIndex = attachmentIndex++;
                                attachmentRef = $html.insertAfter(attachment.getView(), attachmentRef);
                            }
                        }
                    }
                }, layer);
            });
        }

        if (needToUpdateViewRect && !this._invalidateElementVisibility) {
            var unionRect;
            for (var o in this._elementUIMap) {
                var ui = this._elementUIMap[o];
                if (ui.isVisible()) {
                    unionRect = $math.unionRect(unionRect, ui.getViewRect());
                }
            }
            if (unionRect) {
                unionRect = { x: 0, y: 0, width: unionRect.x + unionRect.width, height: unionRect.y + unionRect.height };
            } else {
                unionRect = { x: 0, y: 0, width: 0, height: 0 };
            }

            if (unionRect.x !== this._viewRect.x ||
                unionRect.y !== this._viewRect.y ||
                unionRect.width !== this._viewRect.width ||
                unionRect.height !== this._viewRect.height) {

                var oldValue = this._viewRect;
                this._viewRect = unionRect;

                this._rootDiv.style.left = '0px';
                this._rootDiv.style.top = '0px';
                this._rootDiv.style.width = unionRect.width + 'px';
                this._rootDiv.style.height = unionRect.height + 'px';

                this.firePropertyChange("viewRect", oldValue, unionRect);
            }
        }
    },
    setInteractions: function (interactions) {
        var oldValue = this._interactions;
        if (oldValue) {
            oldValue.forEach(function (handler) {
                handler.tearDown();
            });
        }
        this._interactions = interactions;
        if (interactions) {
            interactions.forEach(function (handler) {
                handler.setUp();
            });
        }
        this.invalidateSelectedElementUIs(true);
        this.firePropertyChange("interactions", oldValue, interactions);
    },
    getInteractions: function () {
        return this._interactions;
    },
    upSubNetwork: function (animate, finishFunction) {
        if (this._currentSubNetwork) {
            this.setCurrentSubNetwork($element.getSubNetwork(this._currentSubNetwork), animate, finishFunction);
        }
    },
    sendToTop: function (element) {
        if (!this.isVisible(element)) {
            return;
        }
        var parent = element;
        while (this.isVisible(parent.getParent())) {
            parent = parent.getParent();
            if (!parent) {
                break;
            }
        }
        if (parent !== element) {
            this._box.adjustElementIndex(parent);
        }
        this._box.adjustElementIndex(element);
    },
    invalidateElementIndex: function () {
        if (!this._invalidateElementIndex) {
            this._invalidateElementIndex = true;
            this.invalidate();
        }
    },
    invalidateElementVisibility: function () {
        if (!this._invalidateElementVisibility) {
            this._invalidateElementVisibility = true;
            this.invalidate();
        }
    },
    updateLayers: function () {
        $html.clear(this._layersDiv);
        $html.clear(this._attachmentDiv);
        this._layerMap = {};
        this._layerList.clear();
        var self = this;
        this._box.getLayerBox().forEachByDepthFirst(function (layer) {
            var canvas = $html.createDiv();
            $html.setVisible(canvas, layer.isVisible());
            self._layerMap[layer.getId()] = canvas;
            self._layersDiv.appendChild(canvas);
            self._layerList.add(layer);
        });

        this._box.forEach(this.createElementUI, this);
    },
    getCurrentSubNetwork: function () {
        return this._currentSubNetwork;
    },
    setCurrentSubNetwork: function (currentSubNetwork, animate, finishFunction) {
        var a = twaver.animate.AnimateManager;
        a.endAnimate();
        if (animate) {
            if (this._currentSubNetwork === currentSubNetwork) {
                return;
            }
            if (currentSubNetwork && !this._box.contains(currentSubNetwork)) {
                throw currentSubNetwork + " is not contained in this network's elementBox";
            }
            a.start(new twaver.animate.AnimateSubNetwork(this, currentSubNetwork, finishFunction));
        } else {
            this._setCurrentSubNetwork(currentSubNetwork);
            if (finishFunction) {
                finishFunction();
            }
        }
    },
    _setCurrentSubNetwork: function (currentSubNetwork) {
        if (this._currentSubNetwork === currentSubNetwork) {
            return;
        }
        if (currentSubNetwork && !this._box.contains(currentSubNetwork)) {
            throw currentSubNetwork + " is not contained in this network's elementBox";
        }
        var oldValue = this._currentSubNetwork;
        this._currentSubNetwork = currentSubNetwork;
        this.firePropertyChange("currentSubNetwork", oldValue, currentSubNetwork);

        this.invalidateElementVisibility();
    },
    isVisible: function (element) {
        if (!this._box.contains(element)) {
            return false;
        }
        if(!element.isVisible()) {
            return false;
        }
        if (this._visibleFunction && !this._visibleFunction(element)) {
            return false;
        }
        if (!this._box.getLayerBox().getLayerByElement(element).isVisible()) {
            return false;
        }
        if ($element.getSubNetwork(element) !== this._currentSubNetwork) {
            return false;
        }
        if (element instanceof twaver.Link) {
            if (!this.isNoAgentLinkVisible()) {
                if (!element.getFromAgent() || !element.getToAgent()) {
                    return false;
                }
                if (!this.isVisible(element.getFromAgent()) || !this.isVisible(element.getToAgent())) {
                    return false;
                }
            }
            if (element.getBundleIndex() > 0 && element.getBundleCount() > 1 && !element.getStyle("link.bundle.expanded")) {
                return false;
            }
        }
        else {
            var parent = element.getParent();
            while (parent && !parent.ISubNetwork) {
                if (parent instanceof $Group) {
                    if (!parent.isExpanded() || !this.isVisible(parent)) {
                        return false;
                    }
                }
                parent = parent.getParent();
            }
        }
        if (element.IDummy) {
            return false;
        }
        return true;
    },
    isMovable: function (element) {
        if (!this._box.contains(element)) {
            return false;
        }
        if (element instanceof twaver.Link) {
            return false;
        }
        if (this._movableFunction && !this._movableFunction(element)) {
            return false;
        }
        return this._box.getLayerBox().getLayerByElement(element).isMovable();
    },
    isEditable: function (element) {
        if (!this._box.contains(element)) {
            return false;
        }
        if (this._editableFunction && !this._editableFunction(element)) {
            return false;
        }
        return this._box.getLayerBox().getLayerByElement(element).isEditable();
    },
    isRotatable: function (element) {
        if (this._rotatableFunction && !this._rotatableFunction(element)) {
            return false;
        }
        return true;
    },
    getVisibleFunction: function () {
        return this._visibleFunction;
    },
    setVisibleFunction: function (value) {
        var oldValue = this._visibleFunction;
        this._visibleFunction = value;
        this.firePropertyChange("visibleFunction", oldValue, value);
        this.invalidateElementVisibility();
    },
    getEditableFunction: function () {
        return this._editableFunction;
    },
    setEditableFunction: function (value) {
        var oldValue = this._editableFunction;
        this._editableFunction = value;
        this.firePropertyChange("editableFunction", oldValue, value);
        this.invalidateSelectedElementUIs(true);
    },
    getRotatableFunction: function () {
        return this._rotatableFunction;
    },
    setRotatableFunction: function (value) {
        var oldValue = this._rotatableFunction;
        this._rotatableFunction = value;
        this.firePropertyChange("rotatableFunction", oldValue, value);
        this.invalidateSelectedElementUIs(true);
    },
    isLinkable: function (node) {
        return (this._linkableFunction == null || this._linkableFunction(node));
    },
    getLinkableFunction: function () {
        return this._linkableFunction;
    },
    setLinkableFunction: function (value) {
        var oldValue = this._linkableFunction;
        this._linkableFunction = value;
        this.firePropertyChange("linkableFunction", oldValue, value);
        this.invalidateSelectedElementUIs(true);
    },
    onShareSelectionModelChanged: function () {
        this.invalidateElementUIs();
    },
    getElementBox: function () {
        return this._box;
    },
    setElementBox: function (elementBox) {
        if (!elementBox) {
            throw "ElementBox can not be null";
        }
        if (this._box === elementBox) {
            return;
        }

        var oldValue = this._box;
        if (oldValue) {
            oldValue.removeDataBoxChangeListener(this.handleElementBoxChange, this);
            oldValue.removeDataPropertyChangeListener(this.handleElementPropertyChange, this);
            oldValue.removePropertyChangeListener(this.handleElementBoxPropertyChange, this);
            oldValue.removeIndexChangeListener(this.handleIndexChange, this);
            oldValue.getLayerBox().removeDataBoxChangeListener(this.handleLayerBoxChange, this);
            oldValue.getLayerBox().removeDataPropertyChangeListener(this.handleLayerPropertyChange, this);
            oldValue.getLayerBox().removeHierarchyChangeListener(this.handleLayerHierarchyChange, this);
            if (!this._selectionModel) {
                oldValue.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
            }
        }
        this._box = elementBox;

        this._box.addDataBoxChangeListener(this.handleElementBoxChange, this);
        this._box.addDataPropertyChangeListener(this.handleElementPropertyChange, this);
        this._box.addPropertyChangeListener(this.handleElementBoxPropertyChange, this);
        this._box.addIndexChangeListener(this.handleIndexChange, this);
        this._box.getLayerBox().addDataBoxChangeListener(this.handleLayerBoxChange, this);
        this._box.getLayerBox().addDataPropertyChangeListener(this.handleLayerPropertyChange, this);
        this._box.getLayerBox().addHierarchyChangeListener(this.handleLayerHierarchyChange, this);
        if (this._flowLinkQuickFinder) {
            this._flowLinkQuickFinder.dispose();
            this._flowLinkQuickFinder = new twaver.QuickFinder(this._box, "link.flow", "style");
        }
        if (this._selectionModel) {
            this._selectionModel._setDataBox(elementBox);
        } else {
            this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
        }

        this._elementUIMap = {};
        this.updateLayers();
        this.invalidateElementVisibility();

        this.firePropertyChange("elementBox", oldValue, this._box);
    },
    invalidateElementUI: function (element, checkAttachments) {
        var ui = this.getElementUI(element);
        if (ui) {
            ui.invalidate(checkAttachments);
        }
    },
    invalidateElementUIs: function (checkAttachments) {
        for (var o in this._elementUIMap) {
            var ui = this._elementUIMap[o];
            ui.invalidate(checkAttachments);
        }
    },
    invalidateSelectedElementUIs: function (checkAttachments) {
        this.getSelectionModel().getSelection().forEach(function (element) {
            this.invalidateElementUI(element, checkAttachments);
        }, this);
    },
    getElementUI: function (element) {
        if (!element) {
            return null;
        }
        return this._elementUIMap[element.getId()];
    },
    getLayerDivByElement: function (element) {
        var layer = this._box.getLayerBox().getLayerByElement(element);
        if (!layer) {
            return null;
        }
        return this._layerMap[layer.getId()];
    },
    createElementUI: function (element) {
        var ui = this._elementUIMap[element.getId()];
        if (!ui) {
            ui = this._elementUIFunction(this, element);
            if (ui) {
                this._elementUIMap[element.getId()] = ui;
            }
        }
        if (ui) {
            var canvas = this.getLayerDivByElement(element);
            if (ui.getView().parentNode !== canvas) {
                canvas.appendChild(ui.getView());
                ui.getAttachments().forEach(function (attachment) {
                    if (attachment.isShowInAttachmentDiv() && attachment.getView().parentNode !== this._attachmentDiv) {
                        this._attachmentDiv.appendChild(attachment.getView());
                    }
                }, this)
            }
            this.invalidateElementIndex();
        }
    },
    invalidateBundleLink: function (element) {
        if (element instanceof twaver.Link && element._bundleLinks) {
            var elementUIMap = this._elementUIMap;
            element._bundleLinks.forEachSiblingLink(function (link) {
                if (link !== element) {
                    var ui = elementUIMap[link._id];
                    if (ui) {
                        ui.invalidate(false);
                    }
                }
            }, this);
        }
    },
    handleLayerBoxChange: function (e) {
        this.updateLayers();
        this.invalidateElementVisibility();
    },
    handleLayerPropertyChange: function (e) {
        var layer = e.source;
        if (e.property === "visible") {
            var canvas = this._layerMap[layer.getId()];
            $html.setVisible(canvas, layer.isVisible());
        }
        else if (e.property === "editable") {
            this.invalidateSelectedElementUIs(true);
        }
        this.invalidateElementVisibility();
    },
    handleLayerHierarchyChange: function (e) {
        var i = 0;
        var lastCanvas;
        this._layerList.clear();
        this._box.getLayerBox().forEachByDepthFirst(function (layer) {
            var canvas = this._layerMap[layer.getId()];
            //canvas.style.zIndex = i++;
            lastCanvas = $html.insertAfter(canvas, lastCanvas);
            this._layerList.add(layer);
        }, null, this);
        this.invalidateElementVisibility();
    },
    handleSelectionChange: function (e) {
        e.datas.forEach(function (element) {
            var ui = this.getElementUI(element);
            if (ui) {
                ui.handleSelectionChange(e);
            }
        }, this);
        this.invalidateElementVisibility();

        var element = this.getSelectionModel().getLastData();
        if (element) {
            if (e.kind === 'append' || e.kind === 'set') {
                if (this.isMakeVisibleOnSelected()) {
                    this.makeVisible(element);
                }
                if (this.isSendToTopOnSelected()) {
                    this.sendToTop(element);
                }
            }
        }

    },
    makeVisible: function (element) {
        var ui = this.getElementUI(element);
        if (!ui) {
            return;
        }
        var subNetwork = $element.getSubNetwork(element);
        if (subNetwork !== this._currentSubNetwork) {
            var self = this;
            this.setCurrentSubNetwork(subNetwork, this.isSubNetworkAnimate(), function () {
                _twaver.callLater(self.makeVisible, self, [element]);
            });
            return;
        }
        var e = element;
        while ((e = e.getParent()) && e !== subNetwork) {
            if (e instanceof $Group) {
                e.setExpanded(true);
            }
        }
        var bounds = ui.getUnionBodyBounds();
        if (!bounds) {
            return;
        }
        var viewRect = { x: this._view.scrollLeft / this._zoom, y: this._view.scrollTop / this._zoom,
            width: this._view.clientWidth / this._zoom, height: this._view.clientHeight / this._zoom
        };
        if (!$math.intersects(viewRect, bounds)) {
            if (this.isVisible(element)) {
                _twaver.callLater(this.centerByLogicalPoint, this, [bounds.x + bounds.width / 2, bounds.y + bounds.height / 2]);
            }
        }
    },
    handleElementBoxChange: function (e) {
        var element = e.data;
        if (e.kind === 'add') {
            this.createElementUI(element);
            this.invalidateBundleLink(element);
        }
        else if (e.kind === 'remove') {
            var ui = this.getElementUI(element);
            if (ui) {
                var layer = this._box.getLayerBox().getLayerByElement(element);
                var canvas = this._layerMap[layer.getId()];
                if (ui.getView().parentNode === canvas) {
                    canvas.removeChild(ui.getView());
                }
                ui.dispose();
                delete this._elementUIMap[element.getId()];
            }
            if (element === this._currentSubNetwork && this._currentSubNetwork != null) {
                this._setCurrentSubNetwork(null);
            }
        }
        else if (e.kind === 'clear') {
            this.forEachElementUI(function (elementUI) {
                elementUI.dispose();
            });
            this._elementUIMap = {};
            this.updateLayers();
            if (this._currentSubNetwork != null) {
                this._setCurrentSubNetwork(null);
            }
        }
        this.invalidateElementVisibility();
    },
    handleElementPropertyChange: function (e) {
        var element = e.source;
        var ui = this.getElementUI(element);
        if (ui) {
            ui.handlePropertyChange(e);
            if (e.property === "layerId") {
                var layer = this._box.getLayerBox().getLayerByElement(element);
                var canvas = this._layerMap[layer.getId()];
                if (ui.getView().parentNode !== canvas) {
                    canvas.appendChild(ui.getView());
                    this.invalidateElementIndex();
                }
            }
        }
        this.invalidateBundleLink(element);
        this.invalidateElementVisibility();
    },
    handleElementBoxPropertyChange: function (e) {
        this.invalidateElementVisibility();
    },
    handleIndexChange: function (e) {
        this.invalidateElementIndex();
    },
    getElementUIFunction: function () {
        return this._elementUIFunction;
    },
    setElementUIFunction: function (value) {
        if (!value) {
            throw "ElementUIFunction can not be null";
        }
        if (this._elementUIFunction === value) {
            return;
        }
        var oldValue = this._elementUIFunction;
        this._elementUIFunction = value;
        this.firePropertyChange("elementUIFunction", oldValue, value);
        if (!this._box.isEmpty()) {
            this.updateLayers();
        }
    },
    getIconsNames: function (element) {
        return element.getStyle('icons.names');
    },
    getIconsColors: function (element) {
        return element.getStyle('icons.colors');
    },
    getLinkHandlerLabel: function (link) {
        if (link.isBundleAgent()) {
            return "+(" + link.getBundleCount() + ")";
        }
        return null;
    },
    getSelectColor: function (element) {
        return element.getStyle('select.color');
    },
    getShadowColor: function (element) {
        var color = element.getStyle('shadow.color');
        if (!color && this.isSelected(element) && element.getStyle('select.style') === 'shadow') {
            return element.getStyle('select.color')
        }
        return color;
    },
    getAlarmLabel: function (element) {
        var severity = element.getAlarmState().getHighestNewAlarmSeverity();
        if (severity) {
            var label = element.getAlarmState().getNewAlarmCount(severity) + severity.nickName;
            if (element.getAlarmState().hasLessSevereNewAlarms()) {
                label += "+";
            }
            return label;
        }
        return null;
    },
    isRemoveElementUIOnInvisible: function () {
        return this._removeElementUIOnInvisible;
    },
    setRemoveElementUIOnInvisible: function (value) {
        var oldValue = this._removeElementUIOnInvisible;
        this._removeElementUIOnInvisible = value;
        this.firePropertyChange("removeElementUIOnInvisible", oldValue, value);
        this.invalidateElementVisibility();
    },
    setDefaultInteractions: function (lazyMode, moveLink) {
        var interactions = [
			new twaver.network.interaction.SelectInteraction(this),
			new twaver.network.interaction.MoveInteraction(this, lazyMode),
			new twaver.network.interaction.DefaultInteraction(this),
            new twaver.network.interaction.TouchInteraction(this)
        ];
		if (moveLink) interactions.push(new twaver.network.interaction.MoveLinkInteraction(this, lazyMode));
        this.setInteractions(interactions);
    },
    setPanInteractions: function () {
        this.setInteractions([
			new twaver.network.interaction.PanInteraction(this),
			new twaver.network.interaction.DefaultInteraction(this)
        ]);
    },
    setEditInteractions: function (lazyMode, moveLink) {
        var interactions = [
			new twaver.network.interaction.SelectInteraction(this),
			new twaver.network.interaction.EditInteraction(this, lazyMode),
			new twaver.network.interaction.MoveInteraction(this, lazyMode),
			new twaver.network.interaction.DefaultInteraction(this)
        ];
		if (moveLink) interactions.push(new twaver.network.interaction.MoveLinkInteraction(this, lazyMode));
        this.setInteractions(interactions);
    },
    setCreateElementInteractions: function (type) {
        this.setInteractions([
			new twaver.network.interaction.CreateElementInteraction(this, type),
			new twaver.network.interaction.DefaultInteraction(this)
        ]);
    },
    setCreateLinkInteractions: function (type) {
        this.setInteractions([
			new twaver.network.interaction.CreateLinkInteraction(this, type),
			new twaver.network.interaction.DefaultInteraction(this)
        ]);
    },
    setCreateShapeLinkInteractions: function (type) {
        this.setInteractions([
			new twaver.network.interaction.CreateShapeLinkInteraction(this, type),
			new twaver.network.interaction.DefaultInteraction(this)
        ]);
    },
    setCreateShapeNodeInteractions: function (type) {
        this.setInteractions([
			new twaver.network.interaction.CreateShapeNodeInteraction(this, type),
			new twaver.network.interaction.DefaultInteraction(this),
        ]);
    },
    setTouchInteractions: function () {
        this.setDefaultInteractions(false);
    },
    setMSTouchInteractions: function () {
        this.setInteractions([
            new twaver.network.interaction.MSTouchInteraction(this)
        ]);
    },
    setMagnifyInteractions: function () {
        this.setInteractions([
		    new twaver.network.interaction.SelectInteraction(this),
		    new twaver.network.interaction.MoveInteraction(this),
		    new twaver.network.interaction.DefaultInteraction(this),
            new twaver.network.interaction.MagnifyInteraction(this)
        ]);
    },
    hasEditInteraction: function () {
        return this._hasEditInteraction;
    },
    setHasEditInteraction: function (value) {
        var oldValue = this._hasEditInteraction;
        this._hasEditInteraction = value;
        this.firePropertyChange("hasEditInteraction", oldValue, value);
    },
    moveSelectedElements: function (xoffset, yoffset, animate, finishFunction) {
        if (xoffset === 0 && yoffset === 0) {
            return;
        }
        var bound = this.getMovableSelectedElementsRect();
        if (bound == null) {
            return;
        }
        if (this._limitElementInPositiveLocation) {
            if (bound.x + xoffset < 0) {
                xoffset = -bound.x;
            }
            if (bound.y + yoffset < 0) {
                yoffset = -bound.y;
            }
        }
        twaver.Util.moveElements(this.getMovableSelectedElements(), xoffset, yoffset, animate, finishFunction, this);
    },
    getMovableSelectedElements: function () {
        return this.getSelectionModel().toSelection(function (element) {
            return this.isMovable(element);
        }, this);
    },
    hasMovableSelectedElements: function () {
        var selection = this.getSelectionModel().getSelection();
        for (var i = 0; i < selection.size(); i++) {
            var element = selection.get(i);
            if (this.isMovable(element)) {
                return true;
            }
        }
        return false;
    },
    getMovableSelectedElementsRect: function () {
        var elements = this.getMovableSelectedElements();
        if (elements.size() === 0) {
            return null;
        }
        var unionRect = null;
        for (var i = 0, n = elements.size(); i < n; i++) {
            var element = elements.get(i);
            if (element instanceof $Node) {
                var ui = this.getElementUI(element);
                if (ui) {
                    unionRect = $math.unionRect(unionRect, ui.getViewRect());
                }
            }
        }
        return unionRect;
    },
    getLayerByElement: function (element) {
        return this._box.getLayerBox().getLayerByElement(element);
    },
    getPosition: function (position, obj, tarSize, xoffset, yoffset) {
        var point;
        var ui = obj instanceof twaver.network.ElementUI ? obj : this.getElementUI(obj);
        if (ui) {
            if (position === 'from' || position === 'to') {
                if (ui.getFromPosition) {
                    point = position === 'from' ? ui.getFromPosition(xoffset, yoffset) : ui.getToPosition(xoffset, yoffset);
                    if (point) {
                        return { x: point.x - tarSize.width / 2, y: point.y - tarSize.height / 2 };
                    }
                }
            } else if (position === 'hotspot') {
                point = ui.getHotSpot();
            } else {
                point = $position.get(position, ui.getBodyRect(), tarSize);
            }
        }
        if (!point && obj.getRect) {
            point = $position.get(position, obj.getRect(), tarSize);
        }
        if (point) {
            return { x: point.x + xoffset, y: point.y + yoffset };
        }
        throw "position '" + position + "' object '" + obj + "'";
    },
    getViewRect: function () {
        if (this._viewRect) {
            return _twaver.clone(this._viewRect);
        }
        return { x: 0, y: 0, width: 0, height: 0 };
    },
    forEachElementUI: function (callbackFunction, layer, scope) {
        if (layer) {
            this._box.forEachReverse(function (element) {
                if (this.getLayerByElement(element) === layer) {
                    var ui = this.getElementUI(element);
                    if (ui) {
                        if (scope) {
                            callbackFunction.call(scope, ui);
                        } else {
                            callbackFunction(ui);
                        }
                    }
                }
            }, this);
        } else {
            this._layerList.forEachReverse(function (layer) {
                this.forEachElementUI(callbackFunction, layer, scope);
            }, this);
        }
    },
    findFirstElement: function (matchFunction, scope) {
        var layerSize = this._layerList.size() - 1;
        var elementSize = this._box.size() - 1;
        for (var i = layerSize; i >= 0; i--) {
            var layer = this._layerList.get(i);
            for (var j = elementSize; j >= 0; j--) {
                var element = this._box.getDataAt(j);
                if (this.getLayerByElement(element) === layer) {
                    if (scope) {
                        if (matchFunction.call(scope, element) === true) {
                            return element;
                        }
                    } else {
                        if (matchFunction(element) === true) {
                            return element;
                        }
                    }
                }
            }
        }
        return null;
    },
    /*
    * getElementAt(point, selectable)
    * getElementAt(evt, selectable)
    */
    getElementAt: function (point, selectable) {
        if (arguments.length === 1) {
            selectable = true;
        }
        if (!this.isValidEvent(point)) {
            return null;
        }
        point = this._getPoint(point);
        if (!point) {
            console.log('null');
        }
        var x = point.x, y = point.y;
        var tolerance = this._selectionTolerance;
        if (tolerance && tolerance > 0) {
            var targetRect = { x: x, y: y, width: 0, height: 0 };
            $math.grow(targetRect, tolerance, tolerance);
        }
        return this.findFirstElement(function (element) {
            if (selectable && !this.isSelectable(element)) {
                return false;
            }
            var ui = this.getElementUI(element);
            if (ui) {
                if (targetRect) {
                    return !!ui.intersectsTest(targetRect);
                } else {
                    return !!ui.hitTest(x, y);
                }
            }
            return false;
        }, this);
    },
    _getPoint: function (point) {
        if (!point) {
            return null;
        }
        if (point.target) {
            return this.getLogicalPoint(point);
        } else {
            return point;
        }
    },
    getElementsAtRect: function (rect, intersectMode, filter, selectable) {
        var list = new $List();
        selectable = selectable === undefined ? true : selectable;
        this.forEachElementUI(function (ui) {
            if (ui.isVisible() && (!filter || filter(ui._element)) && ((selectable && this.isSelectable(ui._element)) || !selectable)) {
                if (intersectMode) {
                    if (ui.intersectsTest(rect)) {
                        list.add(ui._element);
                    }
                } else {
                    if ($math.contains(rect, ui.getViewRect())) {
                        list.add(ui._element);
                    }
                }
            }
        }, null, this);
        return list;
    },
    hitTest: function (point) {
        var element = this.getElementAt(point);
        if (!element) {
            return null;
        }
        var elementUI = this.getElementUI(element);
        if (!elementUI) {
            return null;
        }
        point = this._getPoint(point);
        return elementUI.hitTest(point.x, point.y);
    },
    addElementByInteraction: function (element) {
        if (!element.getParent()) {
            element.setParent(this._currentSubNetwork);
        }
        this._box.add(element);
        this.getSelectionModel().setSelection(element);
        this.fireInteractionEvent({ kind: 'createElement', element: element });
    },
    getLinkFlowStepping: function (link) {
        var stepping = parseInt(link.getStyle("link.flow.stepping"));
        if (!stepping) {
            stepping = $Defaults.NETWORK_LINK_FLOW_STEPPING;
        }
        return stepping;
    },
    getLinkFlowOffset: function (link) {
        var currentOffset = link.getStyle("link.flow.offset");
        if (isNaN(currentOffset)) {
            currentOffset = 0;
        }
        return currentOffset + this.getLinkFlowStepping(link);
    },
    toCanvas: function (w, h, c) {
        if (!c) {
            c = $html.createCanvas();
        }
        c.setAttribute('width', w);
        c.setAttribute('height', h);
        if (c._viewRect) {
            c._viewRect.width = w;
            c._viewRect.height = h;
        } else {
            c._viewRect = { x: 0, y: 0, width: w, height: h };
        }
        var g = c.getContext('2d');
        g.clearRect(0, 0, w, h);

        if (this._view.clientWidth === 0 || this._view.clientHeight === 0) {
            return c;
        }
        var sx = w / this._view.scrollWidth * this._zoom;
        var sy = h / this._view.scrollHeight * this._zoom;
        g.scale(sx, sy);

        $html.forEach(this._view, function (e) {
            if ((e.tagName === 'CANVAS' || e.tagName === 'IMG') && !e._isIgnored) {
                var rect = e._viewRect;
                if (rect) {
                    try {
                        g.drawImage(e, rect.x, rect.y, rect.width, rect.height);
                    } catch (e) {
                    }
                }
            }
        });

        return c;
    },
    toCanvasByRegion: function (rect, scale, c) {
        if (!c) {
            c = $html.createCanvas();
        }
        var width = rect.width * scale;
        var height = rect.height * scale;
        c.setAttribute('width', width);
        c.setAttribute('height', height);
        var g = c.getContext('2d');
        g.clearRect(0, 0, width, height);

        if (this._view.clientWidth === 0 || this._view.clientHeight === 0) {
            return c;
        }
        
        g.save();
        g.scale(scale, scale);

        $html.forEach(this._view, function (e) {
            if ((e.tagName === 'CANVAS' || e.tagName === 'IMG') && !e._isIgnored) {
                var viewRect = e._viewRect;
                if (viewRect && $math.intersects(viewRect, rect)) {
                    try {
                        g.drawImage(e, viewRect.x - rect.x, viewRect.y - rect.y, viewRect.width, viewRect.height);
                    } catch (e) {
                    }
                }
            }
        });

        g.restore();
        return c;
    },
    getGroupChildrenRects: function (group) {
        var list = new $List();
        group.getChildren().forEach(function (child) {
            if (child instanceof $Node) {
                var ui = this.getElementUI(child);
                if (ui) {
                    var rect = ui.getViewRect();
                    if (rect) {
                        list.add(rect);
                    }
                }
            }
        }, this);
        return list;
    },
    getLinkPathFunction: function () {
        return this._linkPathFunction;
    },
    setLinkPathFunction: function (value) {
        var oldValue = this._linkPathFunction;
        this._linkPathFunction = value;
        this.firePropertyChange("linkPathFunction", oldValue, value);
        this.invalidateElementUIs();
    },
    onClickElement: function (element, e) {

    },
    onClickBackground: function (e) {

    },
    onDoubleClickElement: function (element, e) {

    },
    onDoubleClickBackground: function (e) {
        
    },
    onLongClickElement: function (element, e) {

    },
    onLongClickBackground: function (e) {
        
    },
    onMouseMove: function (element, e) {
        
    },
    onMouseEnter: function (element, e) {
        
    },
    onMouseLeave: function (element, e) {
        
    },
    setMovingElement: function (v) {
        if (v == this._movingElement) {
            return;
        }
        var oldValue = this._movingElement;
        this._movingElement = v;
        this.firePropertyChange("movingElement", oldValue, v);
        if (this._box._undoManager._enabled) {
            if (v) {
                this._box._undoManager.startBatch();
            } else {
                this._box._undoManager.endBatch();
            }
        }
    },
    setEditingElement: function (v) {
        if (v == this._editingElement) {
            return;
        }
        var oldValue = this._editingElement;
        this._editingElement = v;
        this.firePropertyChange("editingElement", oldValue, v);
        if (this._box._undoManager._enabled) {
            if (v) {
                this._box._undoManager.startBatch();
            } else {
                this._box._undoManager.endBatch();
            }
        }
    }
});
