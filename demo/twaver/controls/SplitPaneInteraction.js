twaver.controls.SplitPaneInteraction = function (splitPane) {
    this.splitPane = splitPane;
    this.view = splitPane._view;
    this.dividerDiv = splitPane._dividerDiv;

    var self = this;
    this.view.addEventListener('mousedown', function (e) {
        if (e.button === 0) {
            self.handleMouseDown(e);
        }
    }, false);
    this.view.addEventListener('mousemove', function (e) {
        self.handleMouseMove(e);
    }, false);
};
_twaver.ext('twaver.controls.SplitPaneInteraction', Object, {
    handleMouseDown: function (e) {
        if (!this.splitPane.isDividerDraggable()) return;
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
            this.resizeDiv.lastPosition = this.splitPane._orientation === 'horizontal' ? e.clientX : e.clientY;

            this.resizeDiv.maskDiv = $html.createDiv();
            style = this.resizeDiv.maskDiv.style;
            style.left = '0px';
            style.top = '0px';
            style.width = this.view.clientWidth + 'px';
            style.height = this.view.clientHeight + 'px';
            style.background = this.splitPane.getMaskBackground();

            this.view.appendChild(this.resizeDiv.maskDiv);
            this.view.appendChild(this.resizeDiv);

            $html.handle_mousedown(this, e);
            e.preventDefault();
        }
    },
    handleMouseMove: function (e) {
        if (!this.splitPane.isDividerDraggable()) return;
        if (!this.resizeDiv && !$html.target) {
            var cursor = this.splitPane._orientation === 'horizontal' ? 'ew-resize' : 'ns-resize';
            this.view.style.cursor = e.target === this.dividerDiv || e.target === this.splitPane._coverDiv ? cursor : 'default';
        } else if (this.resizeDiv && $html.target === this) {
            if (this.splitPane._orientation === 'horizontal') {
                this.resizeDiv.style.left = this.dividerDiv.position + e.clientX - this.resizeDiv.lastPosition + 'px';
            } else {
                this.resizeDiv.style.top = this.dividerDiv.position + e.clientY - this.resizeDiv.lastPosition + 'px';
            }
        }
    },
    handleMouseUp: function (e) {
        if (!this.splitPane.isDividerDraggable()) return;
        if (e.button === 0) {
            this.clear(e);
        }
    },
    clear: function (e) {
        if (this.resizeDiv) {
            var s = this.splitPane._dividerWidth,
            	v;
            // 
            // First View || Next View
            //
            if (this.splitPane._orientation === 'horizontal') {
                var w = this.view.clientWidth;
                if (s > w) s = w;
                v = this.dividerDiv.position + e.clientX - this.resizeDiv.lastPosition;
                this.splitPane.setPosition(v / (w - s));
            }
            // First View
            // ==========
            // Next View
            else {
                var h = this.view.clientHeight;
                if (s > h) s = h;
                v = this.dividerDiv.position + e.clientY - this.resizeDiv.lastPosition;
                this.splitPane.setPosition(v / (h - s));
            }
            this.view.removeChild(this.resizeDiv.maskDiv);
            this.view.removeChild(this.resizeDiv);
            delete this.resizeDiv;
        }
    }
});
