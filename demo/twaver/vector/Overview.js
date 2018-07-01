twaver.vector.Overview = function (network) {
    twaver.vector.Overview.superClass.constructor.apply(this, network);
    this._view = $html.createView();
    this._rootDiv = $html.createDiv();
    this._imageCanvas = $html.createCanvas();
    this._imageDiv = $html.createDiv();
    this._maskCanvas = $html.createCanvas();
    this._selectDiv = $html.createDiv();
    this._isNetworkDirty = false;
    this._isMaskDirty = false;
    
    $html.setVisible(this._selectDiv, false);
    this._view.appendChild(this._rootDiv);
    this._rootDiv.appendChild(this._imageDiv);
    this._rootDiv.appendChild(this._maskCanvas);
    this._rootDiv.appendChild(this._selectDiv);
    this._imageDiv.appendChild(this._imageCanvas);
    
    this._exportImageCanvas = $html.createCanvas();
    this._imageCtx = this._imageCanvas.getContext('2d');
    this.setNetwork(network);
    var Interaction;
    if ($ua.isMSToucheable) {
        Interaction = twaver.vector.OverviewMSTouchInteraction;
    }
    else if ($ua.isTouchable) {
        Interaction = twaver.vector.OverviewTouchInteraction;
    } else {
        Interaction = twaver.vector.OverviewInteraction;
    }
    if (Interaction) {
        new Interaction(this);
    }
};
_twaver.ext('twaver.vector.Overview', twaver.controls.ControlBase, {
    __accessor: ['fillColor', 'outlineColor', 'outlineWidth', 'selectColor', 'selectWidth',
            'padding', 'maxPackingWidth', 'maxPackingHeight'],
    __bool: ['animate'],

    _fillColor: $Defaults.OVERVIEW_FILL_COLOR,
    _outlineColor: $Defaults.OVERVIEW_OUTLINE_COLOR,
    _outlineWidth: $Defaults.OVERVIEW_OUTLINE_WIDTH,
    _selectColor: $Defaults.OVERVIEW_SELECT_COLOR,
    _selectWidth: $Defaults.OVERVIEW_SELECT_WIDTH,
    _padding: $Defaults.OVERVIEW_PADDING,
    _animate: $Defaults.OVERVIEW_ANIMATE,
    _maxPackingWidth: $Defaults.OVERVIEW_MAX_PACKING_WIDTH,
    _maxPackingHeight: $Defaults.OVERVIEW_MAX_PACKING_HEIGHT,

    getNetwork: function () {
        return this._network;
    },
    onPropertyChanged: function (e) {
        this._invalidateMask();
    },
    setNetwork: function (network) {
        if (network === this._network) {
            return;
        }
        if (this._network) {
            this._network.removePropertyChangeListener(this._handleNetworkPropertyChange, this);
            this._network.removeViewListener(this._handleNetworkViewChange, this);
            $html.removeEventListener('scroll', '_handleScrollChange', this._network.getView(), this);
        }
        this._network = network;
        if (this._network) {
            this._network.addPropertyChangeListener(this._handleNetworkPropertyChange, this);
            this._network.addViewListener(this._handleNetworkViewChange, this);
            $html.addEventListener('scroll', '_handleScrollChange', this._network.getView(), this);
        }
        this.invalidate();
    },
    _handleNetworkPropertyChange: function (evt) {
        if (evt.property === 'zoom' || evt.property === 'currentSubNetwork' || evt.property === 'elementBox' || evt.property === 'dataBox' || evt.property === "canvasSizeChange") {
            this.invalidate();
        }
    },
    _handleNetworkViewChange: function (evt) {
        if (evt.kind === 'validateEnd') {
            this.invalidate();
        }
    },
    _handleScrollChange: function () {
        this._invalidateMask();
    },
    invalidate: function (delay) {
        if (!this._isNetworkDirty || !this._isMaskDirty) {
            if (!this._isNetworkDirty) {
                this._isNetworkDirty = true;
            }
            if (!this._isMaskDirty) {
                this._isMaskDirty = true;
            }
            _twaver.callLater(this.validate, this, null, delay);
        }
    },
    _invalidateMask: function () {
        if (!this._isMaskDirty) {
            this._isMaskDirty = true;
            _twaver.callLater(this.validate, this, [], 100);
        }
    },
    validate: function () {
        if ((this._isMaskDirty || this._isNetworkDirty) && this._network &&
                ((this._maxPackingWidth > 0 && this._maxPackingHeight > 0) || (this._view.clientWidth > 0 && this._view.clientHeight > 0)) &&
                this._network.getViewRect().width !== 0 && this._network.getViewRect().height !== 0 && !this._network._invalidate) {

            var isByMaxPackingWidthAndHeight = this._maxPackingWidth > 0 && this._maxPackingHeight > 0;
            var rect;
            if (isByMaxPackingWidthAndHeight) {
                rect = { x: 0, y: 0, width: this._maxPackingWidth, height: this._maxPackingHeight };
            } else {
                rect = { x: 0, y: 0, width: this._view.clientWidth, height: this._view.clientHeight };
            }
            $math.grow(rect, -this._padding, -this._padding);
           
            if (isByMaxPackingWidthAndHeight) {
                $html.setDiv(this._view, { x: 0, y: 0, width: this._imageDiv._viewRect.width, height: this._imageDiv._viewRect.height }, null, 0, null);
                rect.width = this._imageDiv._viewRect.width;
                rect.height = this._imageDiv._viewRect.height;
            }
            var gzoom = this._network.getGraphicsZoom();
            var unionBounds = this._network._unionBounds;
            unionBounds = $math.unionRect(unionBounds,{x:this._network.getViewRect().x ,y:this._network.getViewRect().y ,width: unionBounds.x ,height: unionBounds.y});
            unionBounds = {x:unionBounds.x/gzoom, y:unionBounds.y/gzoom, width:unionBounds.width/gzoom,height:unionBounds.height/gzoom};
            var viewPort  = {
                x : this._network.viewRect.x/gzoom,
                y : this._network.viewRect.y/gzoom,
                width : this._network.viewRect.width/gzoom,
                height:this._network.viewRect.height/gzoom,
            };
            var viewSize = $math.unionRect(unionBounds,viewPort);
            var zoom = Math.min(rect.width / viewSize.width, rect.height / viewSize.height);
            var imageWidth = viewSize.width * zoom;
            var imageHeight = viewSize.height * zoom;
            
            var imageRectWidth = viewSize.width * zoom;
            var imageRectHeight = viewSize.height * zoom;
            
            var imageX = rect.x + (rect.width - imageRectWidth) / 2 ;
            var imageY = rect.y + (rect.height - imageRectHeight) / 2;
            
            if (this._isNetworkDirty) {
                var imageRect = { x: imageX, y: imageY, width: imageRectWidth, height: imageRectHeight };
                this._network.toCanvas(imageWidth, imageHeight, this._exportImageCanvas, zoom ,viewSize.x * zoom, viewSize.y * zoom);
                this._imageCanvas.setAttribute('width', imageRectWidth);
                this._imageCanvas.setAttribute('height', imageRectHeight);
                this._imageCtx.drawImage(this._exportImageCanvas,(unionBounds.x - viewSize.x) * zoom * gzoom,(unionBounds.y - viewSize.y) * zoom * gzoom,imageWidth,imageHeight);
                $html.setDiv(this._imageDiv, imageRect, null, 0, null);
                if (this._network.getElementBox) {
                    this._imageDiv.style.backgroundColor = (this._network.getCurrentSubNetwork() || this._network.getElementBox()).getStyle('background.color') || '';
                }
                this._isNetworkDirty = false;
            }

            if (this._isMaskDirty) {
                var currentRect = {x : (viewPort.x - viewSize.x) * zoom, y : (viewPort.y - viewSize.y) * zoom,width : viewPort.width * zoom,height : viewPort.height * zoom};
                var g = $html.setCanvas(this._maskCanvas, imageX, imageY, imageRectWidth, imageRectHeight);
                g.lineWidth = 0;
                g.fillStyle = this._fillColor;
                $g.drawVector(g, 'rectangle', null, imageX, imageY, imageRectWidth , imageRectHeight);
                g.closePath();
                g.fill();
                g.stroke();
                g.clearRect(imageX + currentRect.x, imageY + currentRect.y, currentRect.width, currentRect.height);
                g.lineWidth = this._outlineWidth;
                g.strokeStyle = this._outlineColor;
                var w = currentRect.width - this._outlineWidth * 2, h = currentRect.height - this._outlineWidth * 2;
                w = Math.min(w,imageRectWidth - 2 - currentRect.x - this._outlineWidth);
                h = Math.min(h,imageRectHeight - 2 -currentRect.y - this._outlineWidth);
                $g.drawVector(g, 'rectangle', null, imageX + currentRect.x + this._outlineWidth, imageY + currentRect.y + this._outlineWidth,w, h);
                g.closePath();
                g.stroke();
                this._isMaskDirty = false;
            }
        } else {
            this._isNetworkDirty = false;
            this._isMaskDirty = false;
        }
    },
    getLogicalPoint: function (e) {
        return $html.getLogicalPoint(this._view, e, 1, this._rootDiv);
    },
    centerNetwork: function (point, animate) {
        var imageRect = this._imageDiv._viewRect;
        if ($math.containsPoint(imageRect, point)) {
            this._network.centerByLogicalPoint(
                        (point.x - imageRect.x) / imageRect.width * this._network.getCanvasSize().width,
                        (point.y - imageRect.y) / imageRect.height * this._network.getCanvasSize().height, animate);

            this._invalidateMask();
        }
    }
});
