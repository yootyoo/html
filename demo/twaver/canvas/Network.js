twaver.canvas = {};
twaver.canvas.interaction = {};
twaver.canvas.Network = function (elementBox) {
    twaver.canvas.Network.superClass.constructor.apply(this, arguments);

    /* 
    network hierarchy:
    -> view		   
    -> rootCanvas
    -> topcanvas
    */
    this._rootCanvas = $html.createCanvas();
    this._topCanvas = $html.createCanvas();

    //real size
    this.realWidth = 0;
    this.realHeight = 0;
    this._unionBounds = {
        x : 0, y : 0, width : 0,height : 0
    };
    this._zoom = 1;

    this._elementUIMap = {};

    this._visibleMap = {};

    this.viewRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    this.hScrollBarVisible = false;
    this.vScrollBarVisible = false;

    this.markerList = new twaver.List();
    this._topAttachmentList = new twaver.List();

    //this._dirtyRects = new twaver.List();
    this.setElementBox(elementBox ? elementBox : new twaver.ElementBox());

    if (!isNodejs) {
        this._view = $html.createView('hidden');
        this._view.appendChild(this._rootCanvas);
        this._view.appendChild(this._topCanvas);
    
        if ($ua.isMSToucheable) {
            this.setMSTouchInteractions();
        } else {
            this.setDefaultInteractions(false);
        }
        this.setToolTipEnabled(twaver.Defaults.NETWORK_TOOLTIP_ENABLED);
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
            //ui.drawBody();
            ui.invalidate(false);
        });
    };
};
_twaver.ext('twaver.canvas.Network', twaver.controls.View, {

    __accessor: ['selectMode', 'makeVisibleOnSelected', 'movableFunction',
	    'editPointSize', 'editPointFillColor',
	    'scrollBarWidth',
	    'editPointOutlineWidth', 'editPointOutlineColor', 'editLineColor',
	    'editLineWidth','resizePointSize', 'resizePointFillColor', 'resizePointOutlineWidth',
	    'resizePointOutlineColor', 'resizeLineColor', 'resizeLineWidth',
        'rotatePointSize','rotatePointFillColor','rotatePointOffset',
        'rotatePointOutlineWidth','rotatePointOutlineColor', 'rotateScaleFillColor', 'rotateScaleFontColor', 'rotateScaleWidth', 'rotateScaleHeight',
	    'selectOutlineColor', 'selectOutlineWidth', 'selectFillColor',
	    'lazyMoveOutlineColor', 'lazyMoveOutlineWidth', 'lazyMoveFillColor',
		'rectSelectFilter', 'paddingRight', 'paddingBottom','selectionTolerance'],

    __bool: ['doubleClickToUpSubNetwork', 'doubleClickToSubNetwork', 'doubleClickToEmptySubNetwork',
	    'doubleClickToLinkBundle', 'doubleClickToGroupExpand',
	    'scrollBarVisible', 'limitViewInCanvas', 'autoValidateCanvasSize',
	    'subNetworkAnimate', 'lazyMoveAnimate', 'resizeAnimate',
	    'noAgentLinkVisible', 'keyboardRemoveEnabled', 'keyboardSelectEnabled',
	    'sendToTopOnSelected', 'lazyMoveFill', 'editingElement', 'rotatingElement','movingElement',
	    'selectingElement', 'rectSelectEnabled', 'limitElementInPositiveLocation', 'showRotateScale', 'transparentSelectionEnable','debug','showShadowInEdit'],

    _currentSubNetwork: null,
    _subNetworkAnimate: twaver.Defaults.NETWORK_SUBNETWORK_ANIMATE,
    _scrollBarWidth: 10, //need twaver.Defaults.NETWORK_CANVAS_SCROLLBAR_WIDTH

    _scrollBarVisible: true, //need twaver.Defaults.NETWORK_CANVAS_SCROLLBAR_VISIBLE
    _limitViewInCanvas: true, //need twaver.Defaults.NETWORK_CANVAS_LIMIT_VIEW_IN_CANVAS
    _autoValidateCanvasSize: true, //need twaver.Defaults.NETWORK_CANVAS_AUTO_VALIDATE_CANVAS_SIZE

    _makeVisibleOnSelected: twaver.Defaults.NETWORK_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: twaver.Defaults.NETWORK_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: twaver.Defaults.NETWORK_KEYBOARD_SELECT_ENABLED,
    _rectSelectEnabled: $Defaults.NETWORK_RECT_SELECT_ENABLED,
    _rectSelectFilter: null,
    _elementUIFunction: twaver.Defaults.CANVASUI_FUNCTION,

    _doubleClickToUpSubNetwork: twaver.Defaults.NETWORK_DOUBLECLICK_TO_UPSUBNETWORK,
    _doubleClickToSubNetwork: twaver.Defaults.NETWORK_DOUBLECLICK_TO_SUBNETWORK,
    _doubleClickToEmptySubNetwork: twaver.Defaults.NETWORK_DOUBLECLICK_TO_EMPTYSUBNETWORK,
    _doubleClickToLinkBundle: twaver.Defaults.NETWORK_DOUBLECLICK_TO_LINKBUNDLE,
    _doubleClickToGroupExpand: twaver.Defaults.NETWORK_DOUBLECLICK_TO_GROUPEXPAND,

    _selectOutlineColor: twaver.Defaults.NETWORK_SELECT_OUTLINE_COLOR,
    _selectOutlineWidth: twaver.Defaults.NETWORK_SELECT_OUTLINE_WIDTH,
    _selectFillColor: twaver.Defaults.NETWORK_SELECT_FILL_COLOR,
    _sendToTopOnSelected: twaver.Defaults.NETWORK_SENDTOTOP_ON_SELECTED,

    _lazyMoveOutlineColor: twaver.Defaults.NETWORK_LAZYMOVE_OUTLINE_COLOR,
    _lazyMoveOutlineWidth: twaver.Defaults.NETWORK_LAZYMOVE_OUTLINE_WIDTH,
    _lazyMoveFillColor: twaver.Defaults.NETWORK_LAZYMOVE_FILL_COLOR,
    _lazyMoveFill: twaver.Defaults.NETWORK_LAZYMOVE_FILL,
    _lazyMoveAnimate: twaver.Defaults.NETWORK_LAZYMOVE_ANIMATE,

    _resizePointSize: twaver.Defaults.NETWORK_RESIZE_POINT_SIZE,
    _resizePointFillColor: twaver.Defaults.NETWORK_RESIZE_POINT_FILL_COLOR,
    _resizePointOutlineColor: twaver.Defaults.NETWORK_RESIZE_POINT_OUTLINE_COLOR,
    _resizePointOutlineWidth: twaver.Defaults.NETWORK_RESIZE_POINT_OUTLINE_WIDTH,
    _resizeLineColor: twaver.Defaults.NETWORK_RESIZE_LINE_COLOR,
    _resizeLineWidth: twaver.Defaults.NETWORK_RESIZE_LINE_WIDTH,
    _resizeAnimate: twaver.Defaults.NETWORK_RESIZE_ANIMATE,

    _editPointSize: twaver.Defaults.NETWORK_EDIT_POINT_SIZE,
    _editPointFillColor: twaver.Defaults.NETWORK_EDIT_POINT_FILL_COLOR,
    _editPointOutlineColor: twaver.Defaults.NETWORK_EDIT_POINT_OUTLINE_COLOR,
    _editPointOutlineWidth: twaver.Defaults.NETWORK_EDIT_POINT_OUTLINE_WIDTH,
    _editLineColor: twaver.Defaults.NETWORK_EDIT_LINE_COLOR,
    _editLineWidth: twaver.Defaults.NETWORK_EDIT_LINE_WIDTH,

    _rotatePointSize: twaver.Defaults.NETWORK_ROTATE_POINT_SIZE,
    _rotatePointFillColor: twaver.Defaults.NETWORK_ROTATE_POINT_FILL_COLOR,
    _rotatePointOffset: twaver.Defaults.NETWORK_ROTATE_POINT_OFFSET,
    _rotatePointOutlineWidth: twaver.Defaults.NETWORK_ROTATE_POINT_OUTLINE_WIDTH,
    _rotatePointOutlineColor: twaver.Defaults.NETWORK_ROTATE_POINT_OUTLINE_COLOR,

    _rotateScaleWidth: $Defaults.NETWORK_ROTATE_SCALE_WIDTH,
    _rotateScaleHeight: $Defaults.NETWORK_ROTATE_SCALE_HEIGHT,
    _rotateScaleFillColor: $Defaults.NETWORK_ROTATE_SCALE_FILL_COLOR,
    _rotateScaleFontColor: $Defaults.NETWORK_ROTATE_SCALE_FONT_COLOR,

    _limitElementInPositiveLocation: $Defaults.NETWORK_LIMIT_ELEMENT_INPOSITIVE_LOCATION,

    _linkFlowInterval: $Defaults.NETWORK_LINK_FLOW_INTERVAL,
    _selectionTolerance: $Defaults.NETWORK_SELECTION_TOLERANCE,


    _invalidateElementVisibility: false,
    _invalidateViewRectFlag: false,
    _repaintTopFlag: false,
    _invalidateCanvasSizeFlag: false,

    _isEditingElement: false,
    _isRotatingElement: false,
    _isMovingElement: false,
    _isSelectingElement: false,
    _hasEditInteraction: false,
    _showRotateScale: true,
    
    _paddingRight: 0,
    _paddingBottom: 0,
    _transparentSelectionEnable:twaver.Defaults.NETWORK_TRANSPARENT_SELECTION_ENABLE,
    _debug: false,
    _showShadowInEdit:false,

    adjustBounds: function (rect) {
        if (isNodejs) {
            this._rootCanvas = new Canvas(rect.width, rect.height);
            this._topCanvas = new Canvas(rect.width, rect.height);
            this.setViewRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            var b = false;
            var style = this._view.style;
            if (style.left == rect.x + 'px' &&
                style.top == rect.y + 'px' &&
                style.width == rect.width + 'px' &&
                style.height == rect.height + 'px') {
                b = true;
            }
            twaver.canvas.Network.superClass.adjustBounds.apply(this, arguments);
            if (b == true) {
                return;
            }
            var w = this._view.offsetWidth;
            var h = this._view.offsetHeight;
    
            this._rootCanvas.setAttribute("width", w);
            this._rootCanvas.setAttribute("height", h);
            this._topCanvas.setAttribute("width", w);
            this._topCanvas.setAttribute("height", h);
    
            this.setViewRect(this.viewRect.x, this.viewRect.y, w, h);
        }
        if (typeof twaver.gis == 'undefined') {
            twaver.Util.makeHighRes(this._rootCanvas);
            twaver.Util.makeHighRes(this._topCanvas);
        }
        this.invalidateElementVisibility();
    },

    getLabel: function (element) {
        return element.getStyle('network.label') || element.getName();
    },
    getBackgroundImage : function(){
    	return this._backgroundImage;
    },
    
	setBackgroundImage : function(backgroundImage) {
        if (this._backgroundImage != backgroundImage) {
            var oldValue = this._backgroundImage;
            this._backgroundImage = backgroundImage;

            var image = this._backgroundImage;
            if (image && !image._viewRect) {
                if (image.width > 0) {
                    image._viewRect = {
                        x : 0,
                        y : 0,
                        width : image.width,
                        height : image.height
                    };
                    this.validateCanvasSize();
                    this.firePropertyChange("backgroundImage", oldValue, image);
                } else {
                    var self = this;
                    image.onload = function() {
                        image._viewRect = {
                            x : 0,
                            y : 0,
                            width : image.width,
                            height : image.height
                        };
                        self.validateCanvasSize();
                        self.firePropertyChange("backgroundImage", oldValue, image);
                        image.onload = null;
                    };
                }

            } else {
                this.firePropertyChange("backgroundImage", oldValue, image);
                this.validateCanvasSize();
            }
            

        }
    },
    getRootCanvas: function () {
        return this._rootCanvas;
    },
    getTopCanvas: function () {
        return this._topCanvas;
    },
    validateImpl: function () {
    	!isNodejs && __l.twm(this);
        if (this._invalidateElementVisibility == true) {
            this._invalidateElementVisibility = false;
            //validate ui
            var list = this.getElementBox().getDatas()._as;
            var size = list.length;
            var visibleMap = {};
            var i, n, ui, visibleFunction = this._visibleFunction, defaultLayer = this._box._layerBox.size() === 1 ? this._box._layerBox._defaultLayer : null;
            for (i = 0; i < size; i++) {
                n = list[i];
                visibleMap[n._id] = this.isVisible(n, visibleFunction, defaultLayer);
            }
            if (this._visibleMap) {
                for (i = 0; i < size; i++) {
                    n = list[i];
                    if (visibleMap[n._id] !== this._visibleMap[n._id]) {
                        ui = this._elementUIMap[n._id];
                        if (ui) {
                            ui.invalidate();
                        }
                    }
                }
            }
            for (i = 0; i < size; i++) {
                n = list[i];
                ui = this._elementUIMap[n._id];
                if (ui) {
                    ui.validate();
                }
            }
            this._visibleMap = visibleMap;
            this.paintRoot();
        }
        this.validateCanvasSize();
        if (this._repaintTopFlag == true) {
            this._repaintTopFlag = false;
            this.paintTopCanvas();
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
        this._box.forEach(this.createElementUI, this);
        this.invalidateElementVisibility();
        this.invalidateCanvasSize();
        this.firePropertyChange("elementBox", oldValue, this._box);
    },
    // handle event change.
    handleElementBoxChange: function (e) {
        var element = e.data;
        if (e.kind === 'add') {
            this.createElementUI(element);
            this.invalidateBundleLink(element);
        } else if (e.kind === "remove") {
            var ui = this.getElementUI(element);
            if (ui) {
                ui.dispose();
                delete this._elementUIMap[element.getId()];
                //this._dirtyRects.add(ui._viewRect);
            }
            if (element === this._currentSubNetwork && this._currentSubNetwork != null) {
                this._setCurrentSubNetwork(null);
            }
        } else if (e.kind === 'clear') {
            this._elementUIMap = {};
            if (this._currentSubNetwork != null) {
                this._setCurrentSubNetwork(null);
            }
        }
        this.invalidateElementVisibility();
        this.invalidateCanvasSize();
    },
    handleElementPropertyChange: function (e) {
        var element = e.source;
        var ui = this.getElementUI(element);
        if (ui) {
            ui.handlePropertyChange(e);
        }
        this.invalidateBundleLink(element);
        this.invalidateElementVisibility();
        this.invalidateCanvasSize();
    },
    handleElementBoxPropertyChange: function () {
        this.invalidateElementVisibility();
    },
    handleIndexChange: function (c) {
        this.invalidateElementVisibility();
    },
    handleLayerBoxChange: function () {
        this.invalidateElementVisibility();
    },
    handleLayerPropertyChange: function (e) {
        if (e.property === "editable") {
            this.invalidateSelectedElementUIs(true);
        }
        this.invalidateElementVisibility();
    },
    handleLayerHierarchyChange: function () {
        this.invalidateElementVisibility();
    },
    handleSelectionChange: function (e) {
        e.datas.forEach(function (element) {
            var ui = this.getElementUI(element);
            if (ui) {
                ui.handleSelectionChange(e);
            }
        }, this);

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
        this.invalidateElementVisibility();
    },
    sendToTop: function (element) {
        if (!this._box.contains(element)) {
            return;
        }
        var parent = element;
        while (parent._parent && this.isVisible(parent._parent)) {
            parent = parent._parent;
            if (!parent) {
                break;
            }
        }
        if (parent !== element) {
            this._box.adjustElementIndex(parent);
        }
        this._box.adjustElementIndex(element);
    },

    //view&&real size
    getViewRect: function () {
        if (this.viewRect) {
            return _twaver.clone(this.viewRect);
        }
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    },
    getCanvasSize: function () {
        return {
            width: this.realWidth,
            height: this.realHeight
        };
    },
    //    setCanvasSize:function(w,h){
    //        this.realWidth =   w*this.getZoom(),
    //        this.realHeight=  h*this.getZoom()
    //    },
    setViewOffSet: function (xoff, yoff) {
        var x = this.viewRect.x;
        var y = this.viewRect.y;
        var w = this.viewRect.width;
        var h = this.viewRect.height;
        this.setViewRect(x + xoff, y + yoff, w, h);
    },
    setViewRect: function (x, y, w, h) {
        if (this.isLimitViewInCanvas() == true) {
            if (x < 0) {
                x = 0;
            }
            if (w > this.realWidth) {
                x = 0;
            } else {
                if (x + w > this.realWidth) {
                    x = this.realWidth - w;
                }
            }
            if (y < 0) {
                y = 0;
            }
            if (h > this.realHeight) {
                y = 0;
            } else {
                if (y + h > this.realHeight) {
                    y = this.realHeight - h;
                }
            }
        }
        var old = this.viewRect;
        if (this.viewRect != null) {
            if (x == this.viewRect.x && y == this.viewRect.y && w == this.viewRect.width && h == this.viewRect.height) {
                return;
            }
        }
        this.viewRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        this.firePropertyChange("viewRect", old, this.viewRect);
        this.invalidateElementVisibility();
    },
    //scroll bar 
    isHScrollBarVisible: function () {
        return this.hScrollBarVisible;
    },
    setHScrollBarVisible: function (v) {
        this.hScrollBarVisible = v;
    },
    isVScrollBarVisible: function () {
        return this.vScrollBarVisible;
    },
    setVScrollBarVisible: function (v) {
        this.vScrollBarVisible = v;
    },
    dispose: function() {
        for (var o in this._elementUIMap) {
            var ui = this._elementUIMap[o];
            if(ui.curInterval) {
                clearTimeout(ui.curInterval);
            }
        }
    },
    //handle validate
    invalidateElementVisibility: function () {
        if (!this._invalidateElementVisibility) {
            this._invalidateElementVisibility = true;
            this.invalidate();
        }
    },
    repaintTopCanvas: function () {
        if (!this._repaintTopFlag) {
            this._repaintTopFlag = true;
            this.invalidate();
        }
    },
    invalidateCanvasSize: function (delay) {
        if (!this._invalidateCanvasSizeFlag) {
            this._invalidateCanvasSizeFlag = true;
            this.invalidate();
        }
        /*
        if (delay == null) {
        delay = 300;
        }
        if (this._invalidateCanvasSizeFlag == false) {
        this._invalidateCanvasSizeFlag = true;
        _twaver.callLater(this.validateCanvasSize, this, null, delay);
        }
        */
    },
    validateCanvasSize: function () {
        if (this._invalidateCanvasSizeFlag == false) {
            return;
        }
        this._invalidateCanvasSizeFlag = false
        this._validateCanvasSize();
    },
    _validateCanvasSize: function () {
        if (this.isMovingElement()) {
            return;
        }
        if (this.isAutoValidateCanvasSize() == false) {
            this.realWidth = 0;
            this.realHeight = 0;
            this._unionBounds = {
                x : 0, y : 0,width : 0,height : 0
            };
            return;
        }
        var list = this.getElementBox().getDatas();
        var size = list.size();
        if (size > 0) {
            var r = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            for (var i = 0; i < size; i++) {
                var n = list.get(i);
                if (this._visibleMap[n._id]) {
                    var ui = this._elementUIMap[n._id];
                    if (ui) {
                        r = $math.unionRect(r, ui._viewRect);
                    }
                }
            }
           
			
			var img = this.getBackgroundImage();
			if (img) {
				r = $math.unionRect(r, img._viewRect);
			}


            if (r.x < 0) {
                r.width += r.x;
                r.x = 0;
            }
            if (r.y < 0) {
                r.height += r.y;
                r.y = 0;
            }
            if (this.realWidth == (r.x + r.width) * this.getZoom() && this.realHeight == (r.y + r.height) * this.getZoom()) {
                return;
            }
            var zoom = this.getZoom();
            this.realWidth = (r.x + r.width) * zoom + this._paddingRight;
            this.realHeight = (r.y + r.height) * zoom + this._paddingBottom;
            
            this._unionBounds = {
                x : r.x * zoom, y : r.y * zoom ,width : r.width * zoom + this._paddingRight,height : r.height * zoom + this._paddingRight
            };
            
        } else {
            this.realWidth = 0;
            this.realHeight = 0;
            this._unionBounds = {
                x : 0, y : 0,width : 0,height : 0
            };
        }
        this.setViewRect(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height);
        this.firePropertyChange("canvasSizeChange", null, this.viewRect);
        ////////////////////fire event/////////////////////////////
    },
    //element ui
    getElementUI: function (data) {
        if (data == null) {
            return null;
        }
        return this._elementUIMap[data._id];
    },
    createElementUI: function (data) {
        var ui = this._elementUIMap[data.getId()];
        if (!ui) {
            ui = this._elementUIFunction(this, data);
            if (ui) {
                this._elementUIMap[data.getId()] = ui;
            }
        }
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
            this._elementUIMap = {};
            this._box.forEach(this.createElementUI, this);
            this.invalidateElementVisibility();
            this.invalidateCanvasSize();
        }
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

    //paint
    paintRoot: function () {
        var ctx = this._rootCanvas.getContext("2d");
        ctx.clearRect(0, 0, this._rootCanvas.width, this._rootCanvas.height);
        this.visibleList = new twaver.List();
        this._topAttachmentList = new twaver.List();
        if (this.getElementBox() == null) {
            return;
        }
        $backgroundUI.draw(ctx, this);
        var list = this.getElementBox().getDatas()._as;
        var size = list.length;
        ctx.save();
        ctx.scale(this.getZoom(), this.getZoom());
        ctx.translate(-this.viewRect.x / this.getZoom(), -this.viewRect.y / this.getZoom());
        this.paintBottom(ctx);
        var v = {
            x: this.viewRect.x / this.getZoom(),
            y: this.viewRect.y / this.getZoom(),
            width: this.viewRect.width / this.getZoom(),
            height: this.viewRect.height / this.getZoom()
        };
        
        var img = this.getBackgroundImage();
	var backgroundRect = this.getBackgroundImageRect();
        if(img instanceof Image){
	    if(backgroundRect){
                ctx.drawImage(img,backgroundRect.x,backgroundRect.y,backgroundRect.width,backgroundRect.height);
            }else {
        	ctx.drawImage(img, 0,0 ,img.width,img.height);
	    }
        	img._viewRect = {
        		x : 0 ,
        		y : 0 ,
        	    width : img.width,
        	    height : img.height
        	};
        }
        if(typeof img == "string") {
           var imageAsset =  _twaver.getImageAsset(img);

            var rect = {x: 0, y: 0, width: imageAsset.getWidth(), height: imageAsset.getHeight()};
            drawImage(ctx, img, null, rect, null, this);
        }

        var layerBox = this._box._layerBox,
        	i, n, ui, att;

        if (layerBox.size() === 1) {
            for (i = 0; i < size; i++) {
                n = list[i];
                if (this._visibleMap[n._id]) {
                    ui = this._elementUIMap[n._id];
                    if (ui != null && this._isInView(ui, v)) {
                        ui.paint(ctx);
                        ui.setAttachmentVisible && ui.setAttachmentVisible(true);
                        this.visibleList.add(n);
                    }else{
                        ui.setAttachmentVisible && ui.setAttachmentVisible(false);
                    }
                }
            }
        } else {
            layerBox.forEachByDepthFirst(function (layer) {
                for (i = 0; i < size; i++) {
                    n = list[i];
                    if (layerBox.getLayerByElement(n) === layer && this._visibleMap[n._id]) {
                        ui = this._elementUIMap[n._id];
                        if (ui != null && this._isInView(ui, v)) {
                            ui.paint(ctx);
                            ui.setAttachmentVisible && ui.setAttachmentVisible(true);
                            this.visibleList.add(n);
                        }else{
                            ui.setAttachmentVisible && ui.setAttachmentVisible(false);
                        }
                    }
                }
            }, null, this);
        }
        size = this._topAttachmentList.size();
        for (i = 0; i < size; i++) {
            att = this._topAttachmentList.get(i);
            att.getElementUI().paintAttachment(ctx, att);
        }
        
        // paint license compoent
        if(this._xyz){
        	var ld = this._xyz;
        	var mark = ld.markText;
        	var t = ld.type;
        	var expired = ld.expired;
        	var text = ld.innerHTML;
        	var x = 0;
        	var y = 0;
        	var size;
        	var scale = 1;
        	var r = this.viewRect;
            ctx.translate(this.viewRect.x / this.getZoom(), this.viewRect.y / this.getZoom());
        	ctx.scale(1/this.getZoom(), 1/ this.getZoom());
            var zoom = this.getZoom();
			if ((mark != undefined && mark != null && mark != '') || t == '2') {
				ctx.font = '15px Arial sans-serif';
				size = _twaver.g.getTextSize(ctx.font,text);
				ctx.fillStyle = 'red';
				x =  r.width - size.width;
				y =  r.height -20;
			}else{
				ctx.font = '10px Arial sans-serif';
				size = _twaver.g.getTextSize(ctx.font,text); 
				x =  r.width / 2 - size.width / 2;
				y =  r.height / 2;
			}
        	ctx.fillText(text,x,y);
        	
        }
        
        
        
        ctx.restore();
    },
    paintBottom: function (ctx) {
    },
    _isInView: function (ui, realRect) {
        return $math.intersects(realRect, ui._viewRect);
    },
    paintTopCanvas: function () {
        var ctx = this._topCanvas.getContext("2d");
        ctx.clearRect(0, 0, this._topCanvas.width, this._topCanvas.height);
        this.paintMarker(ctx);
    },
    paintMarker: function (ctx) {
        var size = this.markerList.size();
        for (var i = 0; i < size; i++) {
            var marker = this.markerList.get(i);
            marker.paint(ctx);
        }
    },
    getLayerByElement: function (element) {
        return this._box.getLayerBox().getLayerByElement(element);
    },
    //location 
    getLogicalPoint: function (e) {
        var point;
        if ($ua.isTouchable && e.changedTouches && e.changedTouches.length > 0) {
            var bound = this._view.getBoundingClientRect();
            var touch = e.changedTouches[0];
            var scrollLeft = $ua.isAndroid ? 0 : $touch.scrollLeft();
            var scrollTop = $ua.isAndroid ? 0 : $touch.scrollTop();
            point = { x: (touch.clientX + this.viewRect.x - bound.left - scrollLeft) / this._zoom,
                y: (touch.clientY + this.viewRect.y - bound.top - scrollTop) / this._zoom
            };
            return point;
        }

        if ($ua.isFirefox) {
            point = {
                x: (e.layerX + this.viewRect.x) / this.getZoom(),
                y: (e.layerY + this.viewRect.y) / this.getZoom()
            };
        } else {
            point = {
                x: (e.offsetX + this.viewRect.x) / this.getZoom(),
                y: (e.offsetY + this.viewRect.y) / this.getZoom()
            };
        }
        return point;
    },
    getElementAt: function (e, selectable) {
        if (this.visibleList == null) {
            return null;
        }
        if (arguments.length === 1) {
            selectable = true;
        }
        var point, element;
        if (e.target) {
            point = this.getLogicalPoint(e);
        } else if(e.event) {
            if(e.event.target) {
                point = this.getLogicalPoint(e.event);
            }
        } else {
            point = e;
        }

        if (this._topAttachmentList != null) {
            var tsize = this._topAttachmentList.size();
            for (var j = tsize - 1; j >= 0; j--) {
                var att = this._topAttachmentList.get(j);
                element = att.getElement();
                if ((!selectable || this.isSelectable(element)) && att.hit(point.x, point.y)) {
                    return element;
                }
            }
        }
        if (this.visibleList != null) {
            var size = this.visibleList.size();
            for (var i = size - 1; i >= 0; i--) {
                var n = this.visibleList.get(i);
                var ui = this.getElementUI(n);
                if ((!selectable || this.isSelectable(n)) && ui && ui.hit(point.x, point.y)) {
                    return n;
                }
            }
        }
        return null;
    },
    hitTest: function (e) {
        var element = this.getElementAt(e);
        if (!element) {
            return null;
        }
        var elementUI = this.getElementUI(element);
        if (!elementUI) {
            return null;
        }
        var point;
        if (e.target) {
            point = this.getLogicalPoint(e);
        } else {
            point = e;
        }
        return elementUI.hitTest(point.x, point.y);
    },
    getElementsAtRect: function (rect, intersectMode, filter, selectable) {
        var list = new twaver.List();
        if (this.visibleList == null) {
            return list;
        }
        selectable = selectable === undefined ? true : selectable;
        var size = this.visibleList.size();
        for (var i = size - 1; i >= 0; i--) {
            var n = this.visibleList.get(i);
            var ui = this.getElementUI(n);
            if (ui && (!filter || filter(ui._element)) && ((selectable && this.isSelectable(ui._element)) || !selectable)) {
                if (intersectMode) {
                    if (ui.intersects(rect)) {
                        list.add(n);
                    }
                } else {
                    if ($math.contains(rect, ui.getViewRect())) {
                        list.add(n);
                    }
                }
            }
        }
        return list;
    },
    getPosition: function (position, obj, tarSize, xoffset, yoffset) {
        var point;
        var ui = obj instanceof twaver.canvas.ElementUI ? obj : this.getElementUI(obj);
        if (ui) {
            if (position === 'from' || position === 'to') {
                if (ui.getFromPosition) {
                    point = position === 'from' ? ui.getFromPosition(xoffset, yoffset) : ui.getToPosition(xoffset, yoffset);
                    if (point) {
                        if(!tarSize){
                            return point;
                        }
                        return {
                            x: point.x - tarSize.width / 2,
                            y: point.y - tarSize.height / 2
                        };
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
            return {
                x: point.x + xoffset,
                y: point.y + yoffset
            };
        }
        throw "position '" + position + "' object '" + obj + "'";
    },
    isValidEvent: function (e) {
        if (!e) {
            return false;
        }
        var x;
        var y;
        if (e.currentTarget === this._view) {
            if ($ua.isFirefox) {
                x = e.layerX;
                y = e.layerY;
            } else {
                x = e.offsetX;
                y = e.offsetY;
            }
            if (this.isHScrollBarVisible() == true) {
                if (y >= this.viewRect.height - this.getScrollBarWidth()) {
                    return false;
                }
            }
            if (this.isVScrollBarVisible() == true) {
                if (x >= this.viewRect.width - this.getScrollBarWidth()) {
                    return false;
                }
            }
        }
        return true;
    },
    //marker
    addMarker: function (marker) {
        this.markerList.add(marker);
        this.repaintTopCanvas();
    },
    removeMarker: function (marker) {
        this.markerList.remove(marker);
        this.repaintTopCanvas();
    },
    clearMarker: function () {
        this.markerList.clear();
        this.repaintTopCanvas();
    },
    //move
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
        return this.getLayerByElement(element).isMovable();
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
    getMovableSelectedElements: function () {
        return this.getSelectionModel().toSelection(function (element) {
            return this.isMovable(element);
        }, this);
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

    isVisible: function (element, visibleFunction, defaultLayer) {
        if (!this._box.contains(element)) {
            return false;
        }
        if(!element.isVisible()) {
            return false;
        }
        if (arguments.length !== 3) {
            visibleFunction = this._visibleFunction;
        }
        if (visibleFunction && !visibleFunction(element)) {
            return false;
        }
        if (!(defaultLayer || this._box._layerBox.getLayerByElement(element))._visible) {
            return false;
        }
        if ($element.getSubNetwork(element) !== this._currentSubNetwork) {
            return false;
        }
        if (element instanceof twaver.Link) {
            if (!this._noAgentLinkVisible) {
                if (!element._fromAgent || !element._toAgent) {
                    return false;
                }
                if (!this.isVisible(element._fromAgent, visibleFunction, defaultLayer) || !this.isVisible(element._toAgent, visibleFunction, defaultLayer)) {
                    return false;
                }
            }
            if (element.getBundleIndex() > 0 && element.getBundleCount() > 1 && !element.getStyle("link.bundle.expanded")) {
                return false;
            }
        } else {
            var parent = element._parent;
            while (parent && !parent.ISubNetwork) {
                if (parent instanceof twaver.Group) {
                    if (!parent.isExpanded() || !this.isVisible(parent, visibleFunction, defaultLayer)) {
                        return false;
                    }
                }
                parent = parent._parent;
            }
        }
        if (element.IDummy) {
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
    isEditable: function (element) {
        if (!this._box.contains(element)) {
            return false;
        }
        if (this._editableFunction && !this._editableFunction(element)) {
            return false;
        }
        return this.getLayerByElement(element).isEditable();
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
    isRotatable: function (element) {
        if (this._rotatableFunction && !this._rotatableFunction(element)) {
            return false;
        }
        return true;
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
    //paint attribute
    getShadowColor: function (element) {
        var color = element.getStyle('shadow.color');
        if (!color && this.isSelected(element) && element.getStyle('select.style') === 'shadow') {
            return element.getStyle('select.color')
        }
        return color;
    },
    getSelectColor: function (element) {
        return element.getStyle('select.color');
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
    getLinkHandlerLabel: function (link) {
        if (link.isBundleAgent()) {
            return "+(" + link.getBundleCount() + ")";
        }
        return null;
    },

    //interaction 
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
    setDefaultInteractions: function (lazyMode) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
            new twaver.canvas.interaction.SelectInteraction(this),
            new twaver.canvas.interaction.MoveInteraction(this, lazyMode),
            new twaver.canvas.interaction.ScrollInteraction(this),
            new twaver.canvas.interaction.TouchInteraction(this)
            ]);
    },
    setTouchInteractions: function () {
        this.setDefaultInteractions(false);
    },
    setMSTouchInteractions: function () {
        this.setInteractions([
        new twaver.canvas.interaction.ScrollInteraction(this),
            new twaver.canvas.interaction.MSTouchInteraction(this)

        ]);
    },
    setEditInteractions: function (lazyMode) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
			new twaver.canvas.interaction.SelectInteraction(this),
			new twaver.canvas.interaction.EditInteraction(this, lazyMode),
			new twaver.canvas.interaction.MoveInteraction(this, lazyMode),
            new twaver.canvas.interaction.ScrollInteraction(this)
        ]);
    },
    setCreateElementInteractions: function (type) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
            new twaver.canvas.interaction.CreateElementInteraction(this, type)
            ]);
    },
    setCreateLinkInteractions: function (type) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
            new twaver.canvas.interaction.CreateLinkInteraction(this, type),
            new twaver.canvas.interaction.ScrollInteraction(this)
            ]);
    },
    setCreateShapeLinkInteractions: function (type) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
			new twaver.canvas.interaction.CreateShapeLinkInteraction(this, type),
                         new twaver.canvas.interaction.ScrollInteraction(this)
        ]);
    },
    setCreateShapeNodeInteractions: function (type) {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
			new twaver.canvas.interaction.CreateShapeNodeInteraction(this, type),
                        new twaver.canvas.interaction.ScrollInteraction(this)
        ]);
    },
    setPanInteractions: function () {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
            new twaver.canvas.interaction.PanInteraction(this),
            new twaver.canvas.interaction.ScrollInteraction(this)
            ]);
    },
    setMagnifyInteractions: function () {
        this.setInteractions([
            new twaver.canvas.interaction.DefaultInteraction(this),
		    new twaver.canvas.interaction.SelectInteraction(this),
		    new twaver.canvas.interaction.MoveInteraction(this),
		    new twaver.canvas.interaction.ScrollInteraction(this),
            new twaver.canvas.interaction.MagnifyInteraction(this)
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
    addElementByInteraction: function (element) {
        if (!element.getParent()) {
            element.setParent(this._currentSubNetwork);
        }
        this._box.add(element);
        this.getSelectionModel().setSelection(element);
        this.fireInteractionEvent({ kind: 'createElement', element: element });
    },
    //tooltip
    getToolTip: function (element) {
        if (element) {
            var tooltip = element.getToolTip();
            if (tooltip) {
                return tooltip;
            }
            return element.getName();
        }
        return null;
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
                    if (self.isMovingElement()) {
                        $popup.hideToolTip();
                        return;
                    }
                    var element = self.getElementAt(e);
                    if (self._preElement === element) {
                        return;
                    }
                    self._preElement = element;
                    if (element) {
                        var toolTip = self.getToolTip(element);
                        $popup.showToolTip({ x: e.pageX, y: e.pageY }, toolTip);
                        var toolTipDiv = $popup.getToolTipDiv();

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
                        return;
                    }
                    $popup.hideToolTip();
                };
                this._view.addEventListener('mousemove', this._toolTipListener, false);
                this.firePropertyChange('toolTipEnabled', false, true);
            }
        } else {
            if (this._toolTipListener) {
                $popup.hideToolTip();
                this._view.removeEventListener('mousemove', this._toolTipListener, false);
                delete this._toolTipListener;
                this.firePropertyChange('toolTipEnabled', true, false);
            }
        }
    },
    //zoom
    setZoom: function (z) {
    	z = this.checkZoom(z);
        var old = this._zoom;
        if (this._zoom == z) {
            return;
        }
        var center = {
            x: (this.viewRect.x + this.viewRect.width / 2) / this.getZoom() * z,
            y: (this.viewRect.y + this.viewRect.height / 2) / this.getZoom() * z
        };
        this._zoom = z;
        this.invalidateElementVisibility();
        this.invalidateCanvasSize();
        this.validateCanvasSize();
        this.setViewRect(center.x - this.viewRect.width / 2, center.y - this.viewRect.height / 2, this.viewRect.width, this.viewRect.height);
        this.firePropertyChange("zoom", old, this._zoom);
    },
    getZoom: function () {
        return this._zoom;
    },
    //setTouchZoom
    setTouchZoom: function(z){
        this.setZoom(z, false);
    },
    zoomOverview: function (animate) {
        if (this.realWidth <= 0 || this.realHeight <= 0) {
            return;
        }
        var rw = this.realWidth / this.getZoom();
        var rh = this.realHeight / this.getZoom();
        var wzoom = this.viewRect.width / rw;
        var hzoom = this.viewRect.height / rh;
        var min = Math.min(wzoom, hzoom);
        this.setZoom(min);
    },
    zoomReset: function () {
        this.setZoom(1);
    },
    zoomIn: function () {
        this.setZoom(this.getZoom() * 1.2);
    },
    zoomOut: function () {
        this.setZoom(this.getZoom() / 1.2);
    },
    //subnetwork
    upSubNetwork: function (animate, finishFunction) {
        if (this._currentSubNetwork) {
            this.setCurrentSubNetwork($element.getSubNetwork(this._currentSubNetwork), animate, finishFunction);
        }
    },
    getCurrentSubNetwork: function () {
        return this._currentSubNetwork;
    },
    setCurrentSubNetwork: function (currentSubNetwork, animate, finishFunction) {
        twaver.animate.AnimateManager.endAnimate();
        if (animate) {
            if (this._currentSubNetwork === currentSubNetwork) {
                return;
            }
            if (currentSubNetwork && !this._box.contains(currentSubNetwork)) {
                throw currentSubNetwork + " is not contained in this network's elementBox";
            }
            var animateSubNetwork = new twaver.animate.AnimateSubNetwork(this, currentSubNetwork, finishFunction);
            twaver.animate.AnimateManager.start(animateSubNetwork);
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
        this.invalidateCanvasSize();
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
            if (e instanceof twaver.Group) {
                e.setExpanded(true);
            }
        }
        var bounds = ui.getViewRect();
        if (!bounds) {
            return;
        }
        var vr = {
            x: bounds.x * this.getZoom(),
            y: bounds.y * this.getZoom(),
            width: bounds.width * this.getZoom(),
            height: bounds.height * this.getZoom()
        };

        if (!$math.intersects(this.viewRect, vr)) {
            if (this.isVisible(element)) {
                _twaver.callLater(this.centerByLogicalPoint, this, [vr.x + vr.width / 2, vr.y + vr.height / 2]);
            }
        }
    },
    centerByLogicalPoint: function (x, y, animate) {
        var xoff = x - this.viewRect.width / 2;
        var yoff = y - this.viewRect.height / 2;
        this.setViewRect(xoff, yoff, this.viewRect.width, this.viewRect.height);
    },
    panByOffset: function (xoff, yoff) {
        this.setViewOffSet(xoff, yoff);
    },
    getIconsNames: function (element) {
        return element.getStyle('icons.names');
    },
    getIconsColors: function (element) {
        return element.getStyle('icons.colors');
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
        var ctx = c.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        $backgroundUI.draw(ctx, this);

        if (this._view.clientWidth === 0 || this._view.clientHeight === 0) {
            return c;
        }
        var sx = w / this.realWidth * this._zoom;
        var sy = h / this.realHeight * this._zoom;
        ctx.scale(sx, sy);
        
        var img = this.getBackgroundImage();
		if (img && img._viewRect) {
			var rect = img._viewRect;
			try {
				ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height);
			} catch (e) {
			}
		}

        var list = this.getElementBox().getDatas()._as;
        var size = list.length;
        this._topAttachmentList = new twaver.List();
        var layerBox = this.getElementBox().getLayerBox(),
        	layers = layerBox.getRoots(),
        	layerSize = layers.size(),
            j, layer, i, n, ui, att;
        if (layerSize === 1) {
            for (i = 0; i < size; i++) {
                n = list[i];
                if (this._visibleMap[n._id]) {
                    ui = this._elementUIMap[n._id];
                    if (ui != null) {
                        ui.paint(ctx);
                    }
                }
            }
        } else {
            for (j = 0; j < layerSize; j++) {
                layer = layers.get(j);
                for (i = 0; i < size; i++) {
                    n = list[i];
                    if (layerBox.getLayerByElement(n) === layer && this._visibleMap[n._id]) {
                        ui = this._elementUIMap[n._id];
                        if (ui != null) {
                            ui.paint(ctx);
                        }
                    }
                }
            }
        }
        size = this._topAttachmentList.size();
        for (i = 0; i < size; i++) {
            att = this._topAttachmentList.get(i);
            att.getElementUI().paintAttachment(ctx, att);
        }
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
        if (c._viewRect) {
            c._viewRect.width = width;
            c._viewRect.height = height;
        } else {
            c._viewRect = { x: 0, y: 0, width: width, height: height };
        }
        var ctx = c.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        $backgroundUI.draw(ctx, this);
        if (this._view.clientWidth === 0 || this._view.clientHeight === 0) {
            return c;
        }

        ctx.save();
        ctx.scale(scale, scale);
        ctx.beginPath();

        ctx.translate(-rect.x, -rect.y);

        var list = this.getElementBox().getDatas()._as;
        var size = list.length;

        this._topAttachmentList = new twaver.List();
        
        var img = this.getBackgroundImage();
		if (img && img._viewRect && $math.intersects(rect, img._viewRect)) {
			var rect = $math.intersection(rect,img._viewRect);
			var r = img._viewRect;
			try {
				ctx.drawImage(img, r.x,r.y,r.width,r.height);
			} catch (e) {
			}
		}

        var layerBox = this.getElementBox().getLayerBox(),
            layers = layerBox.getRoots(),
            layerSize = layers.size(),
        j, layer, i, n, ui, att;
        if (layerSize === 1) {
            for (i = 0; i < size; i++) {
                n = list[i];
                if (this._visibleMap[n._id]) {
                    ui = this._elementUIMap[n._id];
                    if (ui != null && $math.intersects(rect, ui._viewRect)) {
                        ui.paint(ctx);
                    }
                }
            }
        } else {
            for (j = 0; j < layerSize; j++) {
                layer = layers.get(j);
                for (i = 0; i < size; i++) {
                    n = list[i];
                    if (layerBox.getLayerByElement(n) === layer && this._visibleMap[n._id]) {
                        ui = this._elementUIMap[n._id];
                        if (ui != null && $math.intersects(rect, ui._viewRect)) {
                            ui.paint(ctx);
                        }
                    }
                }
            }
        }
        size = this._topAttachmentList.size();
        for (i = 0; i < size; i++) {
            att = this._topAttachmentList.get(i);
            att.getElementUI().paintAttachment(ctx, att);
        }
        ctx.restore();
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
    getBackgroundImageRect: function(){
        return null;
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