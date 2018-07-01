twaver.controls.SplitPane = function (firstView, nextView, orientation, position) {
    twaver.controls.SplitPane.superClass.constructor.apply(this, arguments);
    this._view = $html.createView('hidden', true);
    this._view.tabIndex = -1;
    this._dividerDiv = $html.createDiv();
    this._dividerDiv.tabIndex = -1;
    this._view.appendChild(this._dividerDiv);

    if (firstView) this.setFirstView(firstView);
    if (nextView) this.setNextView(nextView);
    if (orientation) this.setOrientation(orientation);
    if (position != null) this.setPosition(position);
    this.setDividerDraggable(true);

    this.invalidate();

    if ($ua.isTouchable && !$ua.isMSToucheable) {
        new twaver.controls.SplitPaneTouchInteraction(this);
    }
    new twaver.controls.SplitPaneInteraction(this);
};
_twaver.ext('twaver.controls.SplitPane', twaver.controls.ControlBase, {
    __accessor: ['orientation', 'dividerWidth', 'dividerBackground', 'dividerOpacity', 'maskBackground'],
    __bool: ['dividerDraggable'],
    _position: $Defaults.SPLITPANE_POSITION, // 0 ~ 1
    _orientation: $Defaults.SPLITPANE_ORIENTATION, // 'horizontal' 'vertical'
    _dividerWidth: $Defaults.SPLITPANE_DIVIDER_WIDTH,
    _dividerBackground: $Defaults.SPLITPANE_DIVIDER_BACKGROUND,
    _dividerOpacity: $Defaults.SPLITPANE_DIVIDER_OPACITY,
    _maskBackground: $Defaults.SPLITPANE_MASK_BACKGROUND,

    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getDividerDiv: function () {
        return this._dividerDiv;
    },
    getPosition: function () {
        return this._position;
    },
    setPosition: function (value) {
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        if (value === this._position) {
            return;
        }
        var oldValue = this._position;
        this._position = value;
        this.firePropertyChange('position', oldValue, value);
    },
    setFirstView: function (value) {
        if (this._firstView === value) {
            return;
        }
        var oldValue = this._firstView;
        if (oldValue) {
            if (oldValue.getView) {
                this._view.removeChild(oldValue.getView());
            } else {
                this._view.removeChild(oldValue);
            }
        }
        this._firstView = value;
        if (value) {
            if (value.getView) {
                this._view.insertBefore(value.getView(), this._dividerDiv);
            } else {
                this._view.insertBefore(value, this._dividerDiv);
            }
        }
        this.firePropertyChange('firstView', oldValue, value);
    },
    getFirstView: function () {
        return this._firstView;
    },
    setNextView: function (value) {
        if (this._nextView === value) {
            return;
        }
        var oldValue = this._nextView;
        if (oldValue) {
            if (oldValue.getView) {
                this._view.removeChild(oldValue.getView());
            } else {
                this._view.removeChild(oldValue);
            }
        }
        this._nextView = value;
        if (value) {
            if (value.getView) {
                this._view.insertBefore(value.getView(), this._dividerDiv);
            } else {
                this._view.insertBefore(value, this._dividerDiv);
            }
        }
        this.firePropertyChange('nextView', oldValue, value);
    },
    getNextView: function () {
        return this._nextView;
    },
    validateImpl: function () {
        var p = this._position;
        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;
        var s = this._dividerWidth;

        if (s >= 8 || s === 0) {
            if (this._coverDiv) {
                this._dividerDiv.removeChild(this._coverDiv);
                delete this._coverDiv;
            }
        } else {
            if (!this._coverDiv) {
                this._coverDiv = $html.createDiv();
                this._coverDiv.tabIndex = -1;
                this._dividerDiv.appendChild(this._coverDiv);
            }
        }

        // 
        // First View || Next View
        //


        if (this._orientation === 'horizontal') {
            if (s > w) s = w;
            var w1 = (w - s) * p;
            var w2 = w - s - w1 + 1;
            _twaver.setViewBounds(this._firstView, { x: 0, y: 0, width: w1, height: h });
            _twaver.setViewBounds(this._nextView, { x: w1 + s, y: 0, width: w2, height: h });
            _twaver.setViewBounds(this._dividerDiv, { x: w1, y: 0, width: s, height: h });
            this._dividerDiv.position = w1;

            if (this._coverDiv) {
                _twaver.setViewBounds(this._coverDiv, { x: s / 2 - 4, y: 0, width: 8, height: h });
            }
        }

        // First View
        // ==========
        // Next View
        else {
            if (s > h) s = h;
            var h1 = (h - s) * p;
            var h2 = h - s - h1;
            _twaver.setViewBounds(this._firstView, { x: 0, y: 0, width: w, height: h1 });
            _twaver.setViewBounds(this._nextView, { x: 0, y: h1 + s, width: w, height: h2 });
            _twaver.setViewBounds(this._dividerDiv, { x: 0, y: h1, width: w, height: s });
            this._dividerDiv.position = h1;

            if (this._coverDiv) {
                _twaver.setViewBounds(this._coverDiv, { x: 0, y: s / 2 - 4, width: w, height: 8 });
            }
        }
        var style = this._dividerDiv.style;
        style.background = this._dividerBackground;
    }
});
