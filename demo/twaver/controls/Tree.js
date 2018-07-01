twaver.controls.Tree = function (dataBox) {
    this._interactionDispatcher = new twaver.EventDispatcher();
    this._initTree(dataBox);
    twaver.controls.Tree.superClass.constructor.apply(this, arguments);
    this.setToolTipEnabled($Defaults.TREE_TOOLTIP_ENABLED);
};
_twaver.ext('twaver.controls.Tree', twaver.controls.ListBase, {
    __tree: 1,

    __accessor: ['rootData', 'sortFunction', 'visibleFunction',
        'indent', 'rowHeight', 'rowLineWidth', 'rowLineColor', 'expandIcon', 'collapseIcon', 'uncheckableStyle','lineType',
        'lineColor','lineThickness','lineAlpha','lineDash'],

    __bool: ['rootVisible', 'makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],

    _checkMode: false,
    _indent: $Defaults.TREE_INDENT,
    _rowHeight: $Defaults.TREE_ROW_HEIGHT,
    _rowLineWidth: $Defaults.TREE_ROW_LINE_WIDTH,
    _rowLineColor: $Defaults.TREE_ROW_LINE_COLOR,
    _makeVisibleOnSelected: $Defaults.TREE_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: $Defaults.TREE_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: $Defaults.TREE_KEYBOARD_SELECT_ENABLED,
    _expandIcon: $Defaults.TREE_EXPAND_ICON,
    _collapseIcon: $Defaults.TREE_COLLAPSE_ICON,
    _uncheckableStyle: 'none',
    _lineType:$Defaults.TREE_LINE_TYPE,
    _lineColor:$Defaults.TREE_LINE_COLOR,
    _lineThickness:$Defaults.TREE_LINE_THICKNESS,
    _lineAlpha:$Defaults.TREE_LINE_ALPHA,
    _lineDash:$Defaults.TREE_LINE_DASH,

    getCheckMode: function () {
        return this._checkMode;
    },
    setCheckMode: function (v) {
        delete this._focusedRow;
        var oldValue = this._checkMode;
        this._checkMode = v;
        this.firePropertyChange("checkMode", oldValue, v);
    },
    renderData: function (div, data, row, selected) {
        this._renderTree(div, data, row, selected);
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
                    var element = self.getDataAt(e);
                    if(!element) {
                        $popup.hideToolTip();
                        return;
                    }
                    if (self._preElement === element) {
                        return;
                    }
                    self._preElement = element;
                    if (element) {
                        var toolTip = self.getToolTip(element);
                        $popup.showToolTip(e, toolTip);
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
    getToolTip: function (element) {
        return element.getToolTip();
    }
});
