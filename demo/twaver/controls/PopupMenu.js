twaver.controls.PopupMenu = function (contextView) {
    this._view = $html.createDiv();
    this._view.style.zIndex = 100001;
    this._items = [];
    this._itemsMap = {};

    this.setContextView(contextView);
    var view = this._view, self = this;
    view.addEventListener('mouseover', function (e) {
        self._mouseOver = true;
    }, false);
    view.addEventListener('mouseout', function (e) {
        self._mouseOver = false;
    }, false);
    view.oncontextmenu = function (e) {
        e.preventDefault();
    };
    $html.addEventListener('mousedown', '_handleClick', view, this);
};
_twaver.ext('twaver.controls.PopupMenu', Object, {
    _width: 200,
    _menuItemHeight: 25,
    _background: '#F9F9F9',
    _border: '2px outset white',
    _disabledColor: '#BABBBC',
    _focusColor: '#C2CFF1',
    _subMenuEnableIcon: $Defaults.POPUPMENU_SUBNENU_ENABLE_ICON,
    _subMenuDisableIcon: $Defaults.POPUPMENU_SUBNENU_DISABLE_ICON,
    _checkboxSelectedIcon: $Defaults.POPUPMENU_CHECKBOX_SELECTED_ICON,
    _checkboxUnselectedIcon: $Defaults.POPUPMENU_CHECKBOX_UNSELECTED_ICON,
    _radiobuttonSelectedIcon: $Defaults.POPUPMENU_RADIOBUTTON_SELECTED_ICON,
    _radiobuttonUnselectedIcon: $Defaults.POPUPMENU_RADIOBUTTON_UNSELECTED_ICON,

    getView: function () {
        return this._view;
    },
    getContextView: function () {
        return this._contextView;
    },
    setContextView: function (contextView) {
        this._removeContextmenuListener();
        this._contextView = contextView;
        if (contextView) {
            var view = contextView.getView ? contextView.getView() : contextView;
            if ($ua.isTouchable) {
                view.addEventListener('touchstart', this._getTouchStartListener(), false);
                view.addEventListener('touchmove', this._getTouchMoveListener(), false);
                view.addEventListener('touchend', this._getTouchEndListener(), false);
            } else {
                $html.addEventListener('contextmenu', '_handleContextmenu', view, this);
            }
        }
    },
    getMenuItems: function () {
        return this._items;
    },
    setMenuItems: function (menuItems) {
        this._items = [];
        this._itemsMap = {};
        if (menuItems) {
            for (var i = 0, n = menuItems.length; i < n; i++) {
                this.addMenuItem(menuItems[i]);
            }
        }
    },
    /*
    *{id, type, icon, label, visible, enabled, separator, action, items, selected, groupName}
    */
    addMenuItem: function (menuItem) {
        if (menuItem.separator !== true) {
            this._itemsMap[menuItem.id || menuItem.label] = menuItem;
        }
        this._items.push(menuItem);
    },
    getMenuItem: function (id) {
        return this._itemsMap[id];
    },
    addSeparator: function () {
        this.addMenuItem({ separator: true });
    },
    getMenuItemById: function (id) {
        return this._itemsMap[id];
    },
    isVisible: function (menuItem) {
        return menuItem.visible !== false;
    },
    isEnabled: function (menuItem) {
        return menuItem.enabled !== false;
    },
    show: function (e) {
        this.hide();
        var view = this._view,
			style = this._view.style,
			x, y;
        if ($ua.isTouchable) {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        } else {
            x = e.clientX,
			y = e.clientY;
        }
        $html.clear(view);
        this.renderMenu(view, this._items);
        if (this._height === 0) {
            return;
        }
        $html.addEventListener($ua.isTouchable ? 'touchstart' : 'mousedown', '_handleBodyClicked', document.body, this);

        var maxX = $html.windowWidth() - this._width - 10, maxY = $html.windowHeight() - this._height - 10;
        x = x > maxX ? maxX : x;
        y = y > maxY ? maxY : y;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        style.left = x + $touch.scrollLeft() + 'px';
        style.top = y + $touch.scrollTop() + 'px';
        document.body.appendChild(view);
    },
    _showMenuItem: function (e, div) {
        this._hideMenuItem(div);
        var view = document.createElement('div');
        div.menuItem.childrenDiv = view;
        var style = view.style;
        style.color = '#000000';
        style.position = 'absolute';
        var x = this._width;
        var y = div.offsetTop;
        var items = div.menuItem.items;
        this._itemsShow = true;
        div.appendChild(view);
        $html.clear(view);
        this.renderMenu(view, items);
        if (this._height === 0) {
            return;
        }
        var maxX = $html.windowWidth() - this._width - 10;
        var maxY = $html.windowHeight() - 10;
        var viewPosition = this._getPosition(this._view);
        x = (viewPosition.left + this._width) > maxX ? -this._width : x;
        y = (viewPosition.top + y + items.length * this._menuItemHeight) > (maxY) ? y - (items.length - 1) * this._menuItemHeight : y;
        style.left = x + 'px';
        style.top = y + 'px';
        div.appendChild(view);
    },
    hide: function () {
        if (document.body.contains(this._view)) {
            document.body.removeChild(this._view);
        }
        delete this._mouseOver;
        delete this._itemsShow;
        $html.removeEventListener($ua.isTouchable ? 'touchstart' : 'mousedown', document.body, this);
    },
    _hideMenuItem: function (div) {
        var childrenDiv = div.menuItem.childrenDiv;
        if(childrenDiv && div.contains(childrenDiv)){
            div.removeChild(childrenDiv);
        }
        this._itemsShow = false;
    },
    dispose: function () {
        this._removeContextmenuListener();
        this.hide();
    },
    onMenuShowing: function (e) {
        return true;
    },
    onAction: function (menuItem) {

    },
    renderMenu: function (view, menuItems) {
        var style = view.style;
        style.background = this._background;
        style.border = this._border;
        style.width = this._width + 'px';
        this._height = 0;
        delete this._separator;
        for (var i = 0, n = menuItems.length, menuItem; i < n; i++) {
            menuItem = menuItems[i];
            if (this.isVisible(menuItem)) {
                if (menuItem.separator === true) {
                    this._separator = true;
                } else {
                    var div = document.createElement('div');
                    if (this.isEnabled(menuItem)) {
                        this._addMouseoverListener(div, menuItem);
                    }
                    div.menuItem = menuItem;
                    view.appendChild(div);
                    this.renderMenuItem(div, menuItem);
                    this.onMenuItemRendered(div, menuItem);
                    this._separator = false;
                    this._height += this._menuItemHeight;
                }
            }
        }
    },
    renderMenuItem: function (div, menuItem) {
        var style = div.style;
        style.height = this._menuItemHeight + 'px';
        if (this._separator) {
            style.borderTop = '1px solid gray';
        }
        if (!this.isEnabled(menuItem)) {
            style.color = this._disabledColor;
        }

        var span = document.createElement('span');
        style = span.style;
        style.position = 'absolute';
        style.width = '25px';
        style.height = this._menuItemHeight + 'px';
        style.lineHeight = this._menuItemHeight + 'px';
        style.textAlign = 'center';

        div.appendChild(span);
        var icon;
        if (menuItem.type === 'check') {
            icon = menuItem.selected ? this._checkboxSelectedIcon : this._checkboxUnselectedIcon;
        } else if (menuItem.type === 'radio') {
            icon = menuItem.selected ? this._radiobuttonSelectedIcon : this._radiobuttonUnselectedIcon;
        } else if (menuItem.icon) {
            icon = menuItem.icon;
        }
        if (icon) {
            var image = new Image();
            image.src = _twaver.getImageSrc(icon);
            image.style.verticalAlign = 'middle';
            span.appendChild(image);
        }

        var label = document.createElement('label');
        _twaver.setText(label, menuItem.label, true);
        style = label.style;
        style.position = 'absolute';
        style.height = this._menuItemHeight + 'px';
        style.lineHeight = this._menuItemHeight + 'px';
        style.left = '25px';
        div.appendChild(label);
        if(menuItem.items && div.parentNode === this._view){
            var subMenuIcon = document.createElement('img');
            style = subMenuIcon.style;
            if (!this.isEnabled(menuItem)) {
                subMenuIcon.setAttribute('src',_twaver.getImageSrc(this._subMenuDisableIcon));
            }else{
                subMenuIcon.setAttribute('src',_twaver.getImageSrc(this._subMenuEnableIcon));
            }
            var top = (this._menuItemHeight - 8) / 2;
	        style.marginTop = top + 'px';
			style.right = '5px';
            style.position = 'absolute';
            div.appendChild(subMenuIcon);
        }
    },
    onMenuItemRendered: function (div, menuItem) {

    },
    _addMouseoverListener: function (div, menuItem) {
        var self = this;
        div.addEventListener($ua.isTouchable ? 'touchstart' : 'mouseover', function (e) {
            div.style.background = self._focusColor;
            div.style.color = '#FFFFFF';
            if (this !== e.relatedTarget && !this.contains(e.relatedTarget)){
	            if(menuItem.items && !self._itemsShow && div.parentNode == self._view){
	                self._showMenuItem(e, div);
	            }
            }
        }, false);
        div.addEventListener($ua.isTouchable ? 'touchend' : 'mouseout', function (e) {
            div.style.background = self._background;
            div.style.color = '#000000';
            if (this !== e.relatedTarget && !this.contains(e.relatedTarget)){
	            if(menuItem.items && div.parentNode === self._view){
	                var x = e.clientX;
	                var y = e.clientY;
	                var childrenDiv = menuItem.childrenDiv;
                     var p = self._getPosition(childrenDiv);
	                if ((x < p.left + 2 || x > (p.left + childrenDiv.offsetWidth - 2))
							|| (y < p.top + 2 || y > (p.top + childrenDiv.offsetHeight - 2))) {
						self._hideMenuItem(div);
					}
	            }
            }
        }, false);
    },
    _getPosition : function(div) {
		var topValue = 0, leftValue = 0;
		while (div) {
			leftValue += div.offsetLeft;
			topValue += div.offsetTop;
			div = div.offsetParent;
		}
		return {
			left : leftValue,
			top : topValue
		};
	},
    _removeContextmenuListener: function () {
        var view = this._contextView;
        if (view) {
            view = view.getView ? view.getView() : view;
            if ($ua.isTouchable) {
                view.removeEventListener('touchstart', this._getTouchStartListener(), false);
                view.removeEventListener('touchmove', this._getTouchMoveListener(), false);
                view.removeEventListener('touchend', this._getTouchEndListener(), false);
            } else {
                $html.removeEventListener('contextmenu', view, this);
            }
        }
    },
    _handleContextmenu: function (e) {
        if (this.onMenuShowing(e) === true) {
            this.show(e);
        }
        e.preventDefault();
    },
    _handleBodyClicked: function (e) {
        if ($ua.isTouchable) {
            var target = e.target;
            while (target && target !== this._view) {
                target = target.parentElement;
            }
            if (target !== this._view) {
                this.hide();
            }
        } else {
            if (!this._mouseOver) {
                this.hide();
            }
        }

    },
    _handleClick: function (e) {
        if (e.button !== 0) {
            return;
        }
        var target = e.target;
        while (!target.menuItem && target.parentElement) {
            target = target.parentElement;
        }
        var menuItem = target ? target.menuItem : null;
        if (menuItem && this.isEnabled(menuItem)) {
            if (menuItem.type === 'check') {
                menuItem.selected = !menuItem.selected;
            }
            if (menuItem.type === 'radio') {
                if (menuItem.groupName) {
                    menuItem.selected = true;
                    this._items.forEach(function (item) {
                        if (menuItem !== item && item.groupName === menuItem.groupName) {
                            item.selected = false;
                        }
                        if (item.items) {
                            item.items.forEach(function (subItem) {
                                if (menuItem !== subItem && subItem.groupName === menuItem.groupName) {
                                    subItem.selected = false;
                                }
                            });
                        }
                    });
                } else {
                    menuItem.selected = !menuItem.selected;
                }
            }
            if (menuItem.action) {
                menuItem.action(menuItem);
            }
            this.onAction(menuItem);
            if(!(menuItem.items && menuItem.items.length > 0)){
                this.hide();
            }
        }
    },
    _getTouchStartListener: function () {
        if (!this._touchStartListener) {
            var self = this;
            this._touchStartListener = function (e) {
                self._touchMoved = false;
                self._lastTouch = new Date();
            };
        }
        return this._touchStartListener;
    },
    _getTouchMoveListener: function () {
        if (!this._touchMoveListener) {
            var self = this;
            this._touchMoveListener = function (e) {
                self._touchMoved = true;
            };
        }
        return this._touchMoveListener;
    },
    _getTouchEndListener: function () {
        if (!this._touchEndListener) {
            var self = this;
            this._touchEndListener = function (e) {
                if (!self._touchMoved && new Date().getTime() - self._lastTouch.getTime() > 1000) {
                    self._handleContextmenu(e);
                }
            };
        }
        return this._touchEndListener;
    },
    getWidth: function () {
        return this._width;
    },
    setWidth: function (value) {
        this._width = value;
    },
    getMenuItemHeight: function () {
        return this._menuItemHeight;
    },
    setMenuItemHeight: function (value) {
        this._menuItemHeight = value;
    },
    getBackground: function () {
        return this._background;
    },
    setBackground: function (value) {
        this._background = value;
    },
    getBorder: function () {
        return this._border;
    },
    setBorder: function (value) {
        this._border = value;
    },
    getDisabledColor: function () {
        return this._disabledColor;
    },
    setDisabledColor: function (value) {
        this._disabledColor = value;
    },
    getFocusColor: function () {
        return this._focusColor;
    },
    setFocusColor: function (value) {
        this._focusColor = value;
    },
    getSubMenuEnableIcon: function () {
        return this._subMenuEnableIcon;
    },
    setSubMenuEnableIcon: function (value) {
        this._subMenuEnableIcon = value;
    },
    getSubMenuDisableIcon: function () {
        return this._subMenuDisableIcon;
    },
    setSubMenuDisableIcon: function (value) {
        this._subMenuDisableIcon = value;
    },
    getCheckboxSelectedIcon: function () {
        return this._checkboxSelectedIcon;
    },
    setCheckboxSelectedIcon: function (value) {
        this._checkboxSelectedIcon = value;
    },
    getCheckboxUnselectedIcon: function () {
        return this._checkboxUnselectedIcon;
    },
    setCheckboxUnselectedIcon: function (value) {
        this._checkboxUnselectedIcon = value;
    },
    getRadiobuttonSelectedIcon: function () {
        return this._radiobuttonSelectedIcon;
    },
    setRadiobuttonSelectedIcon: function (value) {
        this._radiobuttonSelectedIcon = value;
    },
    getRadiobuttonUnselectedIcon: function () {
        return this._radiobuttonUnselectedIcon;
    },
    setRadiobuttonUnselectedIcon: function (value) {
        this._radiobuttonUnselectedIcon = value;
    }
});