twaver.gis.interactions.NonBlockTouchInteraction = function(network){
    twaver.gis.interactions.NonBlockTouchInteraction.superClass.constructor.call(this,network);
};
twaver.Util.ext('twaver.gis.interactions.NonBlockTouchInteraction', twaver.network.interaction.TouchInteraction, {
    handleTouchstart: function (e) {
        if (_twaver.touch.isSingleTouch(e)) {
//            showInfo("touch start ");
            this.lastPoint = this.network.getLogicalPoint(e);
            var element = this.network.getElementAt(this.lastPoint);
            this.isClickBackground = !element;
            if (!this.isClickBackground) {
                if (!this.network.getSelectionModel().contains(element)) {
                    this.network.getSelectionModel().setSelection(element);
                }
            } else {
                this.network.getSelectionModel().clearSelection();
            }
        }

        if (_twaver.touch.isMultiTouch(e)) {
            this.distance = _twaver.touch.getDistance(e);
            this.zoom = this.network.getZoom();
        }
        $html.addEventListener('touchmove', 'handleTouchmove', this.network.getView(), this);
        $html.addEventListener('touchend', 'handleTouchend', this.network.getView(), this);
    },
    handleTouchmove: function (e) {
        if (!this.moved) {
            this.moved = true;
        }
        if (_twaver.touch.isSingleTouch(e)) {
            var newPoint = this.network.getLogicalPoint(e);
            var xoffset, yoffset;
            if (!this.network.hasMovableSelectedElements()) {
                this.handleTouchend(e);
//                this.touchEnd();
                return;
            }
            newPoint = this.network.getLogicalPoint(e);
            xoffset = newPoint.x - this.lastPoint.x;
            yoffset = newPoint.y - this.lastPoint.y;
            this.lastPoint = newPoint;
            this.network.moveSelectedElements(xoffset, yoffset);
            this.network.setMovingElement(true);
//            showInfo("network moving selected elements");
            
        } 
    }
});
