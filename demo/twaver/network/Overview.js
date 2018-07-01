twaver.network.Overview = function (network) {
    twaver.network.Overview.superClass.constructor.apply(this, arguments);
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

    this.setNetwork(network);

    var Interaction;
    if ($ua.isMSToucheable) {
        Interaction = twaver.network.OverviewMSTouchInteraction;
    }
    else if ($ua.isTouchable) {
        Interaction = twaver.network.OverviewTouchInteraction;
    } else {
        Interaction = twaver.network.OverviewInteraction;
    }
    if (Interaction) {
        new Interaction(this);
    }
};
_twaver.ext('twaver.network.Overview', twaver.controls.ControlBase, {
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
        if (evt.property === 'zoom' || evt.property === 'currentSubNetwork' || evt.property === 'elementBox' || evt.property === 'dataBox') {
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
                this._network._view.clientWidth !== 0 && this._network._view.clientHeight !== 0) {
            var isByMaxPackingWidthAndHeight = this._maxPackingWidth > 0 && this._maxPackingHeight > 0;
            var rect;
            if (isByMaxPackingWidthAndHeight) {
                rect = { x: 0, y: 0, width: this._maxPackingWidth, height: this._maxPackingHeight };
            } else {
                rect = { x: 0, y: 0, width: this._view.clientWidth, height: this._view.clientHeight };
            }
            $math.grow(rect, -this._padding, -this._padding);

            var zoom = Math.min(rect.width / this._network._view.scrollWidth, rect.height / this._network._view.scrollHeight);
            if (isByMaxPackingWidthAndHeight) {
                $html.setDiv(this._view, { x: 0, y: 0, width: this._imageDiv._viewRect.width, height: this._imageDiv._viewRect.height }, null, 0, null);
                rect.width = this._imageDiv._viewRect.width;
                rect.height = this._imageDiv._viewRect.height;
            }
            var imageWidth = this._network._view.scrollWidth * zoom;
            var imageHeight = this._network._view.scrollHeight * zoom;
            var imageX = rect.x + (rect.width - imageWidth) / 2;
            var imageY = rect.y + (rect.height - imageHeight) / 2;

            if (this._isNetworkDirty) {
                var imageRect = { x: imageX, y: imageY, width: imageWidth, height: imageHeight };
                this._network.toCanvas(imageRect.width, imageRect.height, this._imageCanvas);
                $html.setDiv(this._imageDiv, imageRect, null, 0, null);
                if (this._network.getElementBox) {
                    this._imageDiv.style.backgroundColor = (this._network.getCurrentSubNetwork() || this._network.getElementBox()).getStyle('background.color') || '';
                }
                this._isNetworkDirty = false;
            }

            if (this._isMaskDirty) {
                var currentRect = { x: this._network._view.scrollLeft * zoom, y: this._network._view.scrollTop * zoom,
                    width: imageWidth * this._network._view.clientWidth / this._network._view.scrollWidth,
                    height: imageHeight * this._network._view.clientHeight / this._network._view.scrollHeight
                };

                var g = $html.setCanvas(this._maskCanvas, imageX, imageY, imageWidth, imageHeight);
                g.lineWidth = 0;
                g.fillStyle = this._fillColor;
                g.beginPath();
                $g.drawVector(g, 'rectangle', null, imageX, imageY, imageWidth, imageHeight);
                g.fill();
                g.clearRect(imageX + currentRect.x, imageY + currentRect.y, currentRect.width, currentRect.height);
                var outlineWidth = this._outlineWidth < 0 ? 0 : this._outlineWidth;
                g.lineWidth = outlineWidth;
                g.strokeStyle = this._outlineColor;
                g.beginPath();
                $g.drawVector(g, 'rectangle', null, imageX + currentRect.x + outlineWidth, imageY + currentRect.y + outlineWidth,
                    currentRect.width - outlineWidth * 2, currentRect.height - outlineWidth * 2);
                if (outlineWidth >= 0) {
                    g.stroke();
                }
                this._isMaskDirty = false;
            }
        } else {
            this._isNetworkDirty = false;
            this._isMaskDirty = false;
        }
    },
    getLogicalPoint: function (e) {
        return $html.getLogicalPoint(this._view, e, 1, this._rootDiv)
    },
    centerNetwork: function (point, animate) {
        var imageRect = this._imageDiv._viewRect;
        if ($math.containsPoint(imageRect, point)) {
            this._network.centerByLogicalPoint(
                        (point.x - imageRect.x) / imageRect.width * this._network._view.scrollWidth / this._network.getZoom(),
                        (point.y - imageRect.y) / imageRect.height * this._network._view.scrollHeight / this._network.getZoom(), animate);
            this._invalidateMask();
        }
    }
});
