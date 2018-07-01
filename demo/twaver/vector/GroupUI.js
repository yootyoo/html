twaver.vector.GroupUI = function (network, element) {
    twaver.vector.GroupUI.superClass.constructor.call(this, network, element);
};
_twaver.ext('twaver.vector.GroupUI', twaver.vector.NodeUI, {
    isEditable: function () {
        return !this._element.isExpanded();
    },
    paintBody: function (ctx) {
        if (this._shapeRect) {
            this.drawExpandedGroup(ctx);
        } else {
            twaver.vector.GroupUI.superClass.paintBody.apply(this, arguments);
        }
    },
    validateBodyBounds: function () {
        this.getBodyRect();
        if (this._shapeRect) {
        	var rect = this.getPathRect("group", false);
        	var deep = this.getStyle('group.deep');
        	$math.grow(rect,deep+1,deep+1);
            this.addBodyBounds(rect);
        } else {
            twaver.vector.GroupUI.superClass.validateBodyBounds.call(this);
        }
    },
    
    getZoomBodyRect : function(){
    	if(this._element.isExpanded()){
    		// return _twaver.cloneRect(this.getBodyRect());
    		return this.getBodyRect();
    	}
    	return twaver.vector.GroupUI.superClass.getZoomBodyRect.call(this);
    },
    
    getZoomViewRect : function(){
    	if(this._element.isExpanded()){
    		return this.getViewRect();
    	}
    	return twaver.vector.GroupUI.superClass.getZoomViewRect.call(this);
    },
    
    drawExpandedGroup: function (ctx) { //vector
        this.drawPath(ctx, 'group', false, this._element.getStyle('vector.outline.pattern'));
        var deep = this.getStyle('group.deep');
        var fillColor = this.getStyle('group.fill.color');
        if (deep !== 0 && fillColor) {
            if (this.getStyle('group.shape') === 'rectangle') {
                 $g.draw3DRect(ctx, fillColor, deep, this._shapeRect);
            }
        }
    },
    getChildrenRects: function () {
        return this._network.getGroupChildrenRects(this._element);
    },
    createBodyRect: function () {
        this._shapeRect = null;
        var group = this._element;
        var network = this._network;
        if (group.isExpanded()) {
        	 group.getChildren().forEach(function (child) {
                var ui = network.getElementUI(child);
                ui && ui.validate();
            });
            var rects = this.getChildrenRects();
            if (!rects.isEmpty()) {
                var shape = group.getStyle('group.shape');
                var func = $group[shape];
                if (!func) {
                    throw "Can not resolve group shape '" + shape + "'";
                }
                this._shapeRect = func(rects);
            }
        }
        if (this._shapeRect) {
            $math.addPadding(this._shapeRect, group, 'group.padding', 1);
            return this._shapeRect;
        } else {
            return twaver.vector.GroupUI.superClass.createBodyRect.call(this);
        }
    },
     //append shadow bound
    appendShadowBound : function(part, rect) {
        var shadowable = part.isShadowable() && this._shadowColor && !this._editAttachment;
        if (shadowable) {
            if (this._shadowXOffset > 0) {
                rect.width += this._shadowXOffset;
            } else {
                rect.x += this._shadowXOffset;
                rect.width += -this._shadowXOffset;
            }
            if (this._shadowYOffset > 0) {
                rect.height += this._shadowYOffset;
            } else {
                rect.y += this._shadowYOffset;
                rect.height += -this._shadowYOffset;
            }
            var blur = this._shadowBlur;
            $math.grow(rect, blur + 1,blur + 1);
        }
        return rect;
    },
});
