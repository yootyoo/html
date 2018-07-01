twaver.controls.TitlePane = function (content, title, icon) {
    twaver.controls.TitlePane.superClass.constructor.apply(this, arguments);
    this.invalidate();

    this._titleDiv = $html.createDiv();
    this._titleDiv.tabIndex = -1;
    this._titleDiv.style.verticalAlign = 'middle';
    this._titleDiv.style.fontWeight = 'bold';
    this._titleDiv.style.textOverflow = 'ellipsis';
    this._titleDiv.style.overflow = 'hidden';
    this._titleDiv.style.whiteSpace = 'nowrap';
    this._titleDiv.onmousedown = $html.preventDefault;

    this._span = document.createElement('span');
    this._span.style.verticalAlign = 'middle';
    this._span.style.paddingLeft = '4px';
    this._span.style.paddingRight = '4px';

    this._img = document.createElement('img');
    this._img.style.verticalAlign = 'middle';
    this._img.style.paddingLeft = '4px';

    this._view = $html.createView('hidden', true);
    this._view.tabIndex = -1;
    this._view.appendChild(this._titleDiv);

    if (title) this.setTitle(title);
    if (content) this.setContent(content);
    if (icon) this.setIcon(icon);
};
_twaver.ext('twaver.controls.TitlePane', twaver.controls.ControlBase, {
    __accessor: ['icon', 'title', 'titleHeight', 'titleHorizontalAlign', 'titleBackground'],

    _titleHeight: $Defaults.TITLEPANE_TITLE_HEIGHT,
    _titleBackground: $Defaults.TITLEPANE_TITLE_BACKGROUND,
    _titleHorizontalAlign: $Defaults.TITLEPANE_TITLE_HORIZONTAL_ALIGN,

    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getTitleDiv: function () {
        return this._titleDiv;
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (value) {
        if (this._content === value) {
            return;
        }
        var oldValue = this._content;
        if (oldValue) {
            if (oldValue.getView) {
                this._view.removeChild(oldValue.getView());
            } else {
                this._view.removeChild(oldValue);
            }
        }
        this._content = value;
        if (value) {
            if (value.getView) {
                this._view.appendChild(value.getView());
            } else {
                this._view.appendChild(value);
            }
        }
        this.firePropertyChange('content', oldValue, value);
    },
    validateImpl: function () {
        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;

        var style = this._titleDiv.style;
        style.textAlign = this._titleHorizontalAlign;
        style.lineHeight = this._titleHeight - 2 + 'px';
        style.background = this._titleBackground;

        $html.clear(this._titleDiv);

        if (this._icon) {
            this._img.setAttribute('src', _twaver.getImageSrc(this._icon));
            this._titleDiv.appendChild(this._img);
        }
        if (this._title) {
            this._span.innerHTML = this._title;
            this._span.setAttribute('title', this._title);
            this._titleDiv.appendChild(this._span);
        }

        var style = this._titleDiv.style;
        style.left = '0px';
        style.top = '0px';
        style.width = w + 'px';
        style.height = this._titleHeight + 'px';

        _twaver.setViewBounds(this._content, {
            x: 0,
            y: this._titleHeight,
            width: w,
            height: Math.max(h - this._titleHeight, 0)
        });
    }
});
