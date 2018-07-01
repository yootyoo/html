twaver.vector.ShapeNodeUI = function (network, element) {
    twaver.vector.ShapeNodeUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.ShapeNodeUI', twaver.vector.NodeUI, {
    getDefaultBodyRect: function () {
        if (this._element._points.size() < 2) {
            return null;
        }
        // return this.getPathRect("vector", true);
        return this._reverseZoomPathRect();
    },
    
    drawDefaultBody: function (ctx) {
        if (this._element._points.size() < 2) {//vector
            return;
        }
        this.drawPath(ctx, "vector", true, this._element.getStyle('vector.outline.pattern'),
        	this._getZoomPoints(), this._element._segments, this._element.getStyle('shapenode.closed'));
        $arrow.drawLinkArrow(this, ctx, $math.getPointObject(this._element._points, this._element._segments));
    },
    
    invalidateZoom : function(){
    	this._zoomPoints = null;
    	twaver.vector.LinkUI.superClass.invalidateZoom.call(this);
    },
    
    _getZoomPoints : function(){
    	this._zoomPoints = this._network.zoomManager._getShapeNodeZoomPoints(this,this._element._points);
    	return this._zoomPoints;
    },
    _reverseZoomPathRect : function(){
        return this._network.zoomManager._reverseElementZoomRect(this,this.getZoomPathRect('vector', true));
    }
});
