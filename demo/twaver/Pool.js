twaver.Pool = function (tagName, redundancy) {
    if (typeof tagName === 'string') {
        this.func = function () {
            return document.createElement(tagName);
        }
    } else {
        this.func = tagName;
    }
    this.tagName = tagName;
    if (redundancy != null) {
        this.redundancy = redundancy;
    }
};
_twaver.ext('twaver.Pool', Object, {
    redundancy: 2,
    currentIndex: -1,
    get: function () {
        this.currentIndex++;
        if (this.currentIndex === this.size()) {
            var html = this.func();
            html._pool = this;
            html.style.margin = '0px';
            html.style.padding = '0px';
            if (!this.list) {
                this.list = new $List();
            }
            this.list.add(html);
            return html;
        }
        return this.list.get(this.currentIndex);
    },
    release: function (html) {
        if (this.list && this.list.remove(html) >= 0) {
            delete html._selectData;
            delete html._expandData;
            delete html._checkData;
            delete html._editInfo;
            delete html.keepDefault;
            html.style.margin = '0px';
            html.style.padding = '0px';
            html.style.backgroundColor = '';
            html.removeAttribute('title');
            if (this.tagName === 'img' && html.removeAttribute) {
                html.removeAttribute('width');
                html.removeAttribute('height');
                html.removeAttribute('src');
            }
            this.list.add(html);
            this.currentIndex--;
        }
    },
    reset: function () {
        this.currentIndex = -1;
    },
    clear: function () {
        if (this.list) {
            while (this.redundancy + this.currentIndex < this.list.size() - 1) {
                delete this.list.removeAt(this.list.size() - 1)._pool;
            }
        }
    },
    size: function () {
        return this.list ? this.list.size() : 0;
    }
});
