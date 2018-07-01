var $Group = function (id) {
    this._isUpdatingLocationFromChildren = false;
    this._isAdjusting = false;
    this._expanded = false;
    $Group.superClass.constructor.call(this, id);
};
twaver.Group = $Group;
_twaver.ext('twaver.Group', twaver.Follower, {
    _image: $Defaults.IMAGE_GROUP,
    _icon: $Defaults.ICON_GROUP,
    isAdjustedToBottom: function () {
        return this.isExpanded() && $element.hasAgentLinks(this);
    },
    onChildAdded: function (child, index) {
        $Group.superClass.onChildAdded.apply(this, arguments);
        this.updateLocationFromChildren();
    },
    onChildRemoved: function (child, index) {
        $Group.superClass.onChildRemoved.apply(this, arguments);
        this.updateLocationFromChildren();
    },
    updateLocationFromChildren: function () {
        if (this._isAdjusting || _twaver.isDeserializing) {
            return;
        }
        var rect, i = 0, n = this.getChildrenSize(), child;
        for (; i < n; i++) {
            child = this.getChildAt(i);
            if (child instanceof $Node) {
                rect = $math.unionRect(rect, this.getChildRect(child));
            }
        }
        if (rect) {
            this._isUpdatingLocationFromChildren = true;
            this.setLocation(rect.x + rect.width / 2 - this.getWidth() / 2, rect.y + rect.height / 2 - this.getHeight() / 2);
            this._isUpdatingLocationFromChildren = false;
        }
    },
    getChildRect: function (child) {
        var rect;
        if (child instanceof $Node) {
            if (child instanceof $Group) {
                if (child.isExpanded()) {
                    child.getChildren().forEach(function (element) {
                        rect = $math.unionRect(rect, child.getChildRect(element));
                    });
                }
                if (!rect) {
                    rect = child.getRect();
                }
            } else {
                rect = child.getRect();
            }
        }
        return rect;
    },
    setLocation: function () {
        if (this._isAdjusting) {
            return;
        }
        var location;
        if (arguments.length === 2) {
            location = { x: arguments[0], y: arguments[1] };
        } else {
            location = arguments[0];
        }
        if (!_twaver.isDeserializing && !this._isUpdatingLocationFromChildren) {
            this._isAdjusting = true;
            var dx = location.x - this.getX();
            var dy = location.y - this.getY();
            $element.moveElements(this.getChildren(), dx, dy);
            this._isAdjusting = false;
        }
        $Group.superClass.setLocation.call(this, location);
    },
    reverseExpanded: function () {
        this.setExpanded(!this.isExpanded());
    },
    isExpanded: function () {
        return this._expanded;
    },
    setExpanded: function (expanded) {
        if (this._expanded === expanded) {
            return;
        }
        var oldValue = this._expanded;
        this._expanded = expanded;
        this.firePropertyChange("expanded", oldValue, this._expanded);
        this._checkLinkAgent();
    },
    _checkLinkAgent: function () {
        $Group.superClass._checkLinkAgent.call(this);
        var n = this.getChildrenSize();
        for (var i = 0; i < n; i++) {
            var child = this.getChildAt(i);
            if (child instanceof $Node) {
                child._checkLinkAgent();
            }
        }
    },
    getElementUIClass: function () {
        return twaver.network.GroupUI;
    },
    getCanvasUIClass: function () {
        return twaver.canvas.GroupUI;
    },
    getVectorUIClass : function(){
    	return twaver.vector.GroupUI;
    },
});
