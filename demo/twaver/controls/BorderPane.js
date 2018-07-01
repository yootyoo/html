twaver.controls.BorderPane = function (center, top, right, bottom, left) {
    twaver.controls.BorderPane.superClass.constructor.apply(this, arguments);
    this.invalidate();

    this._view = $html.createView('hidden', true);
    this._view.tabIndex = -1;

    if (center) this.setCenter(center);
    if (top) this.setTop(top);
    if (right) this.setRight(right);
    if (bottom) this.setBottom(bottom);
    if (left) this.setLeft(left);
};
_twaver.ext('twaver.controls.BorderPane', twaver.controls.ControlBase, {
    __accessor: ['hGap', 'vGap', 'topHeight', 'bottomHeight', 'leftWidth', 'rightWidth'],
    _hGap: $Defaults.BORDERPANE_HGAP,
    _vGap: $Defaults.BORDERPANE_VGAP,
    _topHeight: 0,
    _bottomHeight: 0,
    _leftWidth: 0,
    _rightWidth: 0,
    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getCenter: function () {
        return this._center;
    },
    setCenter: function (value) {
        this._setContent('center', value);
    },
    getTop: function () {
        return this._top;
    },
    setTop: function (value) {
        this._setContent('top', value);
    },
    getRight: function () {
        return this._right;
    },
    setRight: function (value) {
        this._setContent('right', value);
    },
    getBottom: function () {
        return this._bottom;
    },
    setBottom: function (value) {
        this._setContent('bottom', value);
    },
    getLeft: function () {
        return this._left;
    },
    setLeft: function (value) {
        this._setContent('left', value);
    },
    _setContent: function (name, value) {
        var oldValue = this['_' + name];
        if (oldValue === value) {
            return;
        }
        if (oldValue) {
            var oldView = oldValue.getView ? oldValue.getView() : oldValue;
            if (this._view.contains(oldView)) {
                this._view.removeChild(oldView);
            }
        }
        this['_' + name] = value;
        if (value) {
            if (value.getView) {
                this._view.appendChild(value.getView());
            } else {
                this._view.appendChild(value);
            }
        }
        this.firePropertyChange(name, oldValue, value);
    },
    validateImpl: function () {
        var w = this._view.offsetWidth, h = this._view.offsetHeight;
        var lx = 0, ty = 0, rx = w, by = h, th = 0, bh = 0, lw = 0, rw = 0;
        if (this._top) {
            th = this._topHeight || (this._top.getView ? this._top.getView().offsetHeight : this._top.offsetHeight);
            ty = th + this._vGap;
        }
        if (this._bottom) {
            bh = this._bottomHeight || (this._bottom.getView ? this._bottom.getView().offsetHeight : this._bottom.offsetHeight);
            by = h - bh - this._vGap;
        }
        if (this._left) {
            lw = this._leftWidth || (this._left.getView ? this._left.getView().offsetWidth : this._left.offsetWidth);
            lx = lw + this._hGap;
        }
        if (this._right) {
            rw = this._rightWidth || (this._right.getView ? this._right.getView().offsetWidth : this._right.offsetWidth);
            rx = w - rw - this._hGap;
        }
        var cw = Math.max(0, rx - lx);
        var ch = Math.max(0, by - ty);

        if (this._top) {
            _twaver.setViewBounds(this._top, { x: 0, y: 0, width: w, height: th });
        }
        if (this._bottom) {
            _twaver.setViewBounds(this._bottom, { x: 0, y: by, width: w, height: bh });
        }
        if (this._left) {
            _twaver.setViewBounds(this._left, { x: 0, y: ty, width: lw, height: ch });
        }
        if (this._right) {
            _twaver.setViewBounds(this._right, { x: rx, y: ty, width: rw, height: ch });
        }
        if (this._center) {
            _twaver.setViewBounds(this._center, { x: lx, y: ty, width: cw, height: ch });
        }
    }
});
