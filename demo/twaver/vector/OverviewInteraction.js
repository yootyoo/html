twaver.vector.OverviewInteraction = function (overview) {
    this.overview = overview;
    this.network = overview.getNetwork();
    this.view = overview._view;
    $html.addEventListener('mousedown', 'handleMousedown', this.view, this);
};
_twaver.ext('twaver.vector.OverviewInteraction', Object, {
    handleMousedown: function (e) {
        this.clear();
        this.endPoint = this.overview.getLogicalPoint(e);
        if (_twaver.isCtrlDown(e)) {
            this.startPoint = this.endPoint;
            $html.setVisible(this.overview._selectDiv, true);
        }
        $html.addEventListener('mousemove', 'handleMousemove', this.view, this);
        $html.addEventListener('mouseup', 'handleMouseup', this.view, this);
    },
    handleMouseup: function (e) {
        this.endPoint = this.overview.getLogicalPoint(e);
        if ('detail' in e && e.detail === 2) {
           _twaver.callLater(this.network.zoomReset, this.network, [this.endPoint, this.overview._animate]);
        } else {
            if ($html.isVisible(this.overview._selectDiv) && this.startPoint) {
                var rect = this.overview._imageDiv._viewRect;
                var x = this.overview._selectDiv._viewRect.x;
                var y = this.overview._selectDiv._viewRect.y;
                var zoomByWidth = rect.width / this.overview._selectDiv._viewRect.width;
                var zoomByHeight = rect.height / this.overview._selectDiv._viewRect.height;
                var zoom = Math.min(zoomByWidth, zoomByHeight);

                this.network.setZoom(zoom * Math.min(this.network.getViewRect().width / this.network.getCanvasSize().width,
                    this.network.getViewRect().height / this.network.getCanvasSize().height) * this.network.getZoom(), false);

                var centerX = this.network.getCanvasSize().width * ((x - rect.x + this.overview._selectDiv._viewRect.width / 2) / rect.width);
                var centerY = this.network.getCanvasSize().height * ((y - rect.y + this.overview._selectDiv._viewRect.height / 2) / rect.height);

                _twaver.callLater(this.network.centerByLogicalPoint, this.network, [centerX, centerY, this.overview._animate]);
                $html.setVisible(this.overview._selectDiv, false);
                $html.setDiv(this.overview._selectDiv, { x: 0, y: 0, width: 0, height: 0 }, null, 0, null);
                this.startPoint = null;
            } else {
                this.overview.centerNetwork(this.endPoint, this.overview._animate);
            }
        }
        this.clear();
    },
    handleMousemove: function (e) {
        var newPoint = this.overview.getLogicalPoint(e);
        this.endPoint = newPoint;
        if ($html.isVisible(this.overview._selectDiv) && this.startPoint) {
            var x = newPoint.x > this.startPoint.x ? this.startPoint.x : newPoint.x;
            var y = newPoint.x > this.startPoint.x ? this.startPoint.y : newPoint.y;
            if (newPoint.x > this.startPoint.x && newPoint.y < this.startPoint.y) {
                y = newPoint.y;
            }
            if (newPoint.x < this.startPoint.x && newPoint.y > this.startPoint.y) {
                y = this.startPoint.y;
            }
            var imageRect = this.overview._imageDiv._viewRect;
            if (x < imageRect.x) {
                x = imageRect.x;
            }
            if (x > imageRect.x + imageRect.width) {
                x = imageRect.x + imageRect.width;
            }
            if (y < imageRect.y) {
                y = imageRect.y;
            }
            if (y > imageRect.y + imageRect.height) {
                y = imageRect.y + imageRect.height;
            }
            var width = Math.abs(newPoint.x - this.startPoint.x);
            var height = Math.abs(newPoint.y - this.startPoint.y);
            if (x + width > imageRect.x + imageRect.width) {
                width = imageRect.x + imageRect.width - x;
            }
            //height = width * imageRect.height / imageRect.width;
            if (y + height > imageRect.y + imageRect.height) {
                height = imageRect.y + imageRect.height - y;
                //width = height * imageRect.width / imageRect.height;
            }
            $html.setDiv(this.overview._selectDiv, { x: x, y: y, width: width, height: height }, null, this.overview._selectWidth, this.overview._selectColor);
        } else {

            this.overview.centerNetwork(newPoint, false);
        }
    },
    clear: function () {
        if (this.endPoint) {
            this.endPoint = null;
            $html.removeEventListener('mousemove', this.view, this);
            $html.removeEventListener('mouseup', this.view, this);
        }
    }
});