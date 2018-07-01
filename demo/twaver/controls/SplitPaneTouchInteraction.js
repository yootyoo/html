twaver.controls.SplitPaneTouchInteraction = function (splitPane) {
    this.splitPane = splitPane;
    this.view = splitPane._view;
    this.dividerDiv = splitPane._dividerDiv;

    $html.addEventListener('touchstart', 'handleTouchstart', this.view, this);
};
_twaver.ext('twaver.controls.SplitPaneTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);
        if (this.resizeDiv) {
            this.clear(e);
        } else if (e.target === this.dividerDiv || e.target === this.splitPane._coverDiv) {
            this.resizeDiv = $html.createDiv();
            var style = this.resizeDiv.style;
            style.left = this.dividerDiv.style.left;
            style.top = this.dividerDiv.style.top;
            style.width = this.dividerDiv.style.width;
            style.height = this.dividerDiv.style.height;
            style.opacity = this.splitPane.getDividerOpacity();
            style.background = this.splitPane.getDividerBackground();
            var touch = e.changedTouches[0];
            this.resizeDiv.lastPosition = this.splitPane._orientation === 'horizontal' ? touch.clientX : touch.clientY;

            this.resizeDiv.maskDiv = $html.createDiv();
            var style = this.resizeDiv.maskDiv.style;
            style.left = '0px';
            style.top = '0px';
            style.width = this.view.clientWidth + 'px';
            style.height = this.view.clientHeight + 'px';
            style.background = this.splitPane.getMaskBackground();

            this.view.appendChild(this.resizeDiv.maskDiv);
            this.view.appendChild(this.resizeDiv);
        }
        $html.addEventListener('touchmove', 'handleTouchmove', this.view, this);
        $html.addEventListener('touchend', 'handleTouchend', this.view, this);
    },
    handleTouchmove: function (e) {
        $html.preventDefault(e);
        if (!this.resizeDiv) {
        } else {
            var touch = e.changedTouches[0];
            if (this.splitPane._orientation === 'horizontal') {
                this.resizeDiv.style.left = this.dividerDiv.position + touch.clientX - this.resizeDiv.lastPosition + 'px';
            } else {
                this.resizeDiv.style.top = this.dividerDiv.position + touch.clientY - this.resizeDiv.lastPosition + 'px';
            }
        }
    },
    handleTouchend: function (e) {
        $html.removeEventListener('touchmove', this.view, this);
        $html.removeEventListener('touchend', this.view, this);
        this.clear(e);
    },
    clear: function (e) {
        var touch = e.changedTouches[0];
        if (this.resizeDiv) {
            var s = this.splitPane._dividerWidth;
            // 
            // First View || Next View
            //
            if (this.splitPane._orientation === 'horizontal') {
                var w = this.view.clientWidth;
                if (s > w) s = w;
                var v = this.dividerDiv.position + touch.clientX - this.resizeDiv.lastPosition;
                this.splitPane.setPosition(v / (w - s));
            }
            // First View
            // ==========
            // Next View
            else {
                var h = this.view.clientHeight;
                if (s > h) s = h;
                var v = this.dividerDiv.position + touch.clientY - this.resizeDiv.lastPosition;
                this.splitPane.setPosition(v / (h - s));
            }
            this.view.removeChild(this.resizeDiv.maskDiv);
            this.view.removeChild(this.resizeDiv);
            delete this.resizeDiv;
        }
    }
});
