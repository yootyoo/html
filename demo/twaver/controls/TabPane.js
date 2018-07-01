twaver.controls.TabPane = function () {
    twaver.controls.TabPane.superClass.constructor.apply(this, arguments);
    this._tabBox = new twaver.TabBox();
    this._tabBox.addDataBoxChangeListener(this.handleTabChange, this);
    this._tabBox.addDataPropertyChangeListener(this.handleTabChange, this);
    this._tabBox.addHierarchyChangeListener(this.handleTabChange, this);
    this._tabBox.getSelectionModel().addSelectionChangeListener(this.handleTabChange, this);

    this._view = $html.createView('hidden', true);
    this._tabDiv = $html.createDiv();
    this._tabDiv.onmousedown = $html.preventDefault;
    this._tabDiv.onkeydown = $html.preventDefault;

    this._contentDiv = $html.createDiv();
    this._view.appendChild(this._tabDiv);
    this._view.appendChild(this._contentDiv);

    this._divPool = new twaver.Pool('div');
    this._iconPool = new twaver.Pool('img');
    this._closePool = new twaver.Pool('img');
    this._textPool = new twaver.Pool('span');
    this._resizePool = new twaver.Pool('div');

    this._pools.add(this._divPool);
    this._pools.add(this._iconPool);
    this._pools.add(this._closePool);
    this._pools.add(this._textPool);
    this._pools.add(this._resizePool);

    this.invalidateTab();

    if ($ua.isTouchable && !$ua.isMSToucheable) {
        new twaver.controls.TabPaneTouchInteraction(this);
    }
    new twaver.controls.TabPaneInteraction(this);
};
_twaver.ext('twaver.controls.TabPane', twaver.controls.ControlBase, {
    __accessor: ['tabGap', 'tabRadius', 'tabHeight', 'horizontalAlign', 'tabOrientation', 'resizeTolerance',
                 'tabBackground', 'selectBackground', 'moveBackground', 'insertBackground', 'closeIcon', 'disabledColor'],
    __bool: ['selectNextOnClose', 'selectNextOnInVisible'],

    _tabGap: $Defaults.TABPANE_TAB_GAP,
    _tabRadius: $Defaults.TABPANE_TAB_RADIUS,
    _tabHeight: $Defaults.TABPANE_TAB_HEIGHT,
    _resizeTolerance: $Defaults.TABPANE_RESIZE_TOLERANCE,
    _tabOrientation: $Defaults.TABPANE_TAB_ORIENTATION,
    _tabBackground: $Defaults.TABPANE_TAB_BACKGROUND,
    _disabledColor: $Defaults.TABPANE_DISABLED_COLOR,
    _selectBackground: $Defaults.TABPANE_SELECT_BACKGROUND,
    _moveBackground: $Defaults.TABPANE_MOVE_BACKGROUND,
    _insertBackground: $Defaults.TABPANE_INSERT_BACKGROUND,
    _horizontalAlign: $Defaults.TABPANE_HORIZONTAL_ALIGN,
    _closeIcon: $Defaults.TABPANE_CLOSE_ICON,
    _selectNextOnClose: $Defaults.TABPANE_SELECT_NEXT_ON_CLOSE,
    _selectNextOnInVisible: $Defaults.TABPANE_SELECT_NEXT_ON_INVISIBLE,

    onPropertyChanged: function (e) {
        this.invalidateTab();
    },
    getTabBox: function () {
        return this._tabBox;
    },
    getTabDiv: function () {
        return this._tabDiv;
    },
    getContentDiv: function () {
        return this._contentDiv;
    },
    handleTabChange: function (e) {
        if (this._selectNextOnInVisible
    			&& e.property === 'visible'
    			&& !e.newValue
    			&& this._tabBox.getSelectionModel().contains(e.source)) {
            var tab = e.source,
    			index = this._tabBox.getRoots().indexOf(tab),
    			roots = this._tabBox.getRoots(),
    			size = roots.size(),
    			next = index, nextTab, selectedTab;
            while (next < size - 1) {
                nextTab = roots.get(++next);
                if (nextTab.isVisible() && !nextTab.isDisabled()) {
                    selectedTab = nextTab;
                    break;
                }
            }
            if (!selectedTab) {
                next = index;
                while (next > 0) {
                    nextTab = roots.get(--next);
                    if (nextTab.isVisible() && !nextTab.isDisabled()) {
                        selectedTab = nextTab;
                        break;
                    }
                }
            }
            this._tabBox.getSelectionModel().setSelection(selectedTab);
        }
        this.invalidateTab();
    },
    invalidateTab: function (delay) {
        if (!this._invalidateTab) {
            this._invalidateTab = true;
            this.invalidate(delay);
        }
    },
    validateImpl: function () {
        if (this._invalidateTab) {
            this._invalidateTab = false;
            this.validateTab();
        }
        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;

        var rect;
        if (this._tabOrientation === 'top') {
            this._tabDiv.style.top = '0px';
            rect = { x: 0, y: this._tabHeight, width: w, height: Math.max(0, h - this._tabHeight) };
        }
        else {
            this._tabDiv.style.top = h - this._tabHeight + 'px';
            rect = { x: 0, y: 0, width: w, height: Math.max(0, h - this._tabHeight) };
        }
        if (this._currentView) {
            _twaver.setViewBounds(this._currentView, rect);
        }
    },
    getCurrentTab: function () {
        return this._currentTab;
    },
    getCurrentView: function () {
        return this._currentView;
    },
    onViewRemoved: function (view) {

    },
    onViewAdded: function (view) {

    },
    validateTab: function () {
        this._currentTab = this._tabBox.getSelectionModel().getLastData();
        var view = this._currentTab ? this._currentTab.getView() : null;
        if (view !== this._currentView) {
            var oldUi, newUi;
            if (this._currentView) {
                oldUi = this._currentView.getView ? this._currentView.getView() : this._currentView;
                oldUi.style.visibility = 'hidden';
                this.onViewRemoved(this._currentView);
            }
            if (view) {
                newUi = view.getView ? view.getView() : view;
                newUi.style.visibility = 'inherit';
                if (!newUi.parentNode) {
                    this._contentDiv.appendChild(newUi);
                }
                this.onViewAdded(view);
            }
            this._currentView = view;
        }

        $html.release(this._tabDiv);

        var tabs = this._tabBox.getRoots();
        var hpx = this._tabHeight + 'px';
        var lhpx = this._tabHeight - 2 + 'px';
        var rpx = this._tabRadius + 'px';
        var count = tabs.size();
        var sumWidth = 0;

        for (var i = 0; i < count; i++) {
            var tab = tabs.get(i);
            if (tab.isVisible()) {
                var selected = this._currentTab === tab;

                var width = tab.getWidth();
                if (width < 0) width = 0;
                var gap = Math.min(this._tabGap, width);

                var div = this._divPool.get();
                div._tab = tab;

                var style = div.style;
                style.position = 'absolute';
                style.whiteSpace = 'nowrap';
                style.lineHeight = lhpx;
                style.overflow = 'hidden';
                style.textOverflow = 'ellipsis';
                style.background = selected ? this._selectBackground : this._tabBackground;
                style.textAlign = this._horizontalAlign;

                if (this._tabOrientation === 'top') {
                    style.borderTopLeftRadius = rpx;
                    style.borderTopRightRadius = rpx;
                    style.borderBottomLeftRadius = '0px';
                    style.borderBottomRightRadius = '0px';
                } else {
                    style.borderTopLeftRadius = '0px';
                    style.borderTopRightRadius = '0px';
                    style.borderBottomLeftRadius = rpx;
                    style.borderBottomRightRadius = rpx;
                }

                style.left = sumWidth + 'px';
                style.width = width - gap + 'px';
                style.height = hpx;
                div._x = sumWidth;
                div._width = width - gap;

                this.renderTab(div, tab);
                this.onTabRendered(div, tab);
                this._tabDiv.insertBefore(div, this._tabDiv.firstChild);

                sumWidth += width;

                if (tab.isResizable()) {
                    div = this._resizePool.get();
                    div._resizeTab = tab;
                    style = div.style;
                    style.position = 'absolute';
                    style.backgroundColor = 'white';
                    style.opacity = 0;
                    style.left = sumWidth - gap - this._resizeTolerance + 'px';
                    style.width = gap + this._resizeTolerance * 2 + 'px';
                    style.height = hpx;
                    this._tabDiv.appendChild(div);
                }
            }
        }

        this._tabDiv.style.left = '0px';
        this._tabDiv.style.width = sumWidth + 'px';
        this._tabDiv.style.height = this._tabHeight + 'px';

        this._pools.forEach(function (pool) {
            pool.clear();
        });
    },
    renderTab: function (div, tab) {
        if (tab.renderTab) {
            tab.renderTab(div);
        } else {
            var icon = tab.getIcon()
            if (icon) {
                var image = this._iconPool.get();
                image.setAttribute('src', _twaver.getImageSrc(icon));
                image.style.paddingLeft = '4px';
                image.style.verticalAlign = 'middle';
                div.appendChild(image);
            }
            var name = tab.getName();
            if (name) {
                var span = this._textPool.get();
                span.style.whiteSpace = 'nowrap';
                span.style.verticalAlign = 'middle';
                span.style.padding = '2px 4px';
                span.innerHTML = name;
                div.appendChild(span);
            }
            if ($ua.isOpera) {
                var maskDiv = div.cloneNode(false);
                maskDiv.style.left = '0px';
                maskDiv.style.top = '0px';
                maskDiv.style.opacity = 0;
                div.appendChild(maskDiv);
            }
        }

        if (tab.isClosable()) {
            var m = this._tabRadius / 4 + 2;
            var image = this._closePool.get();
            image._closeTab = tab;
            image.setAttribute('src', _twaver.getImageSrc(this._closeIcon));
            image.style.position = 'absolute';
            image.style.top = m + 'px';
            image.style.right = m + 'px';
            div.appendChild(image);
        }

        if (tab.isDisabled()) {
            div.style.color = this.getDisabledColor();
        } else {
            div.style.color = ''
        }

    },
    onTabRendered: function (div, tab) {

    }
});
