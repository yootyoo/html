twaver.controls.Accordion = function () {
    twaver.controls.Accordion.superClass.constructor.apply(this, arguments);
    this._titleMap = {}; // title: {content:content, titleDiv:div, span:span, img:img}
    this._titleList = new $List();
    this._currentTitle = null;
    this._currentView = null;

    this._view = $html.createView('hidden', true);
    this.invalidate();

    var self = this;
    this._view.addEventListener('mousedown', function (e) {
        self.handleMouseDown(e);
    }, false);
};
_twaver.ext('twaver.controls.Accordion', twaver.controls.ControlBase, {
    __accessor: ['expandIcon', 'collapseIcon', 'titleHeight', 'titleBackground', 'borderBottomColor', 'iconPosition'],

    _expandIcon: $Defaults.ACCORDION_EXPAND_ICON,
    _collapseIcon: $Defaults.ACCORDION_COLLAPSE_ICON,

    _titleHeight: $Defaults.ACCORDION_TITLE_HEIGHT,
    _titleBackground: $Defaults.ACCORDION_TITLE_BACKGROUND,
    _borderBottomColor: $Defaults.ACCORDION_BORDER_BOTTOM_COLOR,
    _iconPosition: $Defaults.ACCORDION_ICON_POSITION,

    onPropertyChanged: function (e) {
        this.invalidate();
    },
    handleMouseDown: function (e) {
        if (e.button !== 0) {
            return;
        }
        var title = e.target._title;
        if (!title) {
            title = e.target.parentNode._title;
        }
        if (title) {
            if (this._currentTitle === title) {
                this.collapse();
            } else {
                this.expand(title);
            }
        }
    },
    getTitles: function () {
        return this._titleList;
    },
    getCurrentTitle: function () {
        return this._currentTitle;
    },
    add: function (title, content) {
        if (this._titleMap[title]) {
            throw "Title ' + title + ' already exists";
        }

        var titleDiv = $html.createDiv();
        titleDiv._title = title;
        titleDiv.onmousedown = $html.preventDefault;
        titleDiv.style.cursor = 'pointer';
        titleDiv.style.textAlign = 'left';
        titleDiv.style.textOverflow = 'ellipsis';
        titleDiv.style.whiteSpace = 'nowrap';
        titleDiv.style.overflow = 'hidden';
        titleDiv.style.borderBottomWidth = '1px';
        titleDiv.style.borderBottomStyle = 'solid';

        var img = document.createElement('img');
        img.style.verticalAlign = 'middle';
        img.style.paddingLeft = '4px';

        var span = document.createElement('span');
        span.style.verticalAlign = 'middle';
        span.style.paddingLeft = '4px';
        span.innerHTML = title;
        span.setAttribute('title', title);

        this._view.appendChild(titleDiv);
        titleDiv.appendChild(img);
        titleDiv.appendChild(span);
        if(this._iconPosition == 'right'){
            var s = img.style;
            var top = (this._titleHeight - 8) / 2;
            s.marginTop = top + 'px';
            s.right = '15px';
            s.position = 'absolute';
        }


        this._titleMap[title] = {
            content: content,
            titleDiv: titleDiv,
            span: span,
            img: img
        };
        this._titleList.add(title);
        this.invalidate();
    },
    remove: function (title) {
        var info = this._titleMap[title];
        if (info) {
            this._view.removeChild(info.titleDiv);
        }
        delete this._titleMap[title];
        this._titleList.remove(title);
        this.invalidate();
    },
    clear: function () {
        var self = this;
        Object.keys(self._titleMap).forEach(function (title) {
            self._view.removeChild(self._titleMap[title].titleDiv);
        });
        self._titleMap = {};
        self._titleList.clear();
        self.invalidate();
    },
    expand: function (title) {
        if (this._titleMap[title] && this._currentTitle !== title) {
            this._currentTitle = title;
            this.onExpanded(title);
            this.invalidate();
        }
    },
    onExpanded: function (title) {
        // do nothing
    },
    collapse: function () {
        if (this._currentTitle) {
            this.onCollapsed(this._currentTitle);
            this._currentTitle = null;
            this.invalidate();
        }
    },
    onCollapsed: function (title) {
        // do nothing
    },
    validateImpl: function () {
        var oldView = this._currentView;
        this._currentView = null;

        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;
        var count = this._titleList.size();

        var y = 0;
        for (var i = 0; i < count; i++) {
            var title = this._titleList.get(i);
            var info = this._titleMap[title];

            var style = info.titleDiv.style;
            style.lineHeight = this._titleHeight - 3 + 'px';
            style.background = this._titleBackground;
            style.borderBottomColor = this._borderBottomColor;
            style.left = '0px';
            style.top = y + 'px';
            style.width = w + 'px';
            style.height = this._titleHeight - 1 + 'px';

            var isExpanded = this._currentTitle === title;
            var icon = isExpanded ? this._expandIcon : this._collapseIcon;
            info.img.setAttribute('src', _twaver.getImageSrc(icon));

            if (isExpanded) {
                var contentHeight = Math.max(0, h - count * this._titleHeight);
                if (info.content) {
                    this._currentView = info.content.getView ? info.content.getView() : info.content;
                    _twaver.setViewBounds(info.content, {
                        x: 0,
                        y: y + this._titleHeight,
                        width: w,
                        height: contentHeight
                    });
                }
                y += this._titleHeight + contentHeight;
            } else {
                y += this._titleHeight;
            }
        }

        if (this._currentView && this._currentView !== oldView) {
            this._view.appendChild(this._currentView);
        }
        if (oldView && oldView !== this._currentView) {
            this._view.removeChild(oldView);
        }
    }
});
