twaver.ShapeNode = function (id) {
    this._isUpdatingShapeNode = false;
    this._points = new $List();
    twaver.ShapeNode.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.ShapeNode', twaver.Follower, {
    _icon: $Defaults.ICON_SHAPENODE,
    __accessor: ['segments'],
    getElementUIClass: function () {
        return twaver.network.ShapeNodeUI;
    },
    getCanvasUIClass: function () {
        return twaver.canvas.ShapeNodeUI;
    },
    getVectorUIClass : function(){
    	return twaver.vector.ShapeNodeUI;
    },
    getPoints: function () {
        return this._points;
    },
    setPoints: function (value) {
        if (!value) {
            value = new $List();
        }
        var oldPoints = new $List(this._points);
        this._points = value;
        this.firePointsChange(oldPoints, this._points);
    },
    getSegments: function () {
        return this._segments;
    },
    setSegments: function (value) {
        if (!value) {
            value = new $List();
        }
        var oldSegments = new $List(this._segments);
        this._segments = value;
        this._reCalculateLineLength();
        this.firePropertyChange("segments", oldSegments, this._segments);
    },
    addPoint: function (point, index) {
        var oldPoints = new $List(this._points);
        this._points.add(point, index);
        this.firePointsChange(oldPoints, this._points);
    },
    setPoint: function (index, point) {
        var oldPoints = new $List(this._points);
        this._points.set(index, point);
        this.firePointsChange(oldPoints, this._points);
    },
    removePoint: function (point) {
        var oldPoints = new $List(this._points);
        this._points.remove(point);
        this.firePointsChange(oldPoints, this._points);
    },
    removeAt: function (index) {
        var oldPoints = new $List(this._points);
        this._points.removeAt(index);
        this.firePointsChange(oldPoints, this._points);
    },
    setWidth: function (width) {
        if (width < 1) {
            width = 1;
        }
        // adjust points according to new width
        if (!this._isUpdatingShapeNode && !_twaver.isDeserializing) {
            this._isUpdatingShapeNode = true;

            var oldPoints = new $List(this._points);
            for (var i = 0; i < this._points.size(); i++) {
                var point = this._points.get(i);
                point.x = (point.x - this.getX()) * width / this.getWidth() + this.getX();
            }

            this.firePointsChange(oldPoints, this._points);
            this._isUpdatingShapeNode = false;
        }
        twaver.ShapeNode.superClass.setWidth.apply(this, arguments);
    },
    setHeight: function (height) {
        if (height < 1) {
            height = 1;
        }
        // adjust points according to new height
        if (!this._isUpdatingShapeNode && !_twaver.isDeserializing) {
            this._isUpdatingShapeNode = true;

            var oldPoints = new $List(this._points);
            for (var i = 0; i < this._points.size(); i++) {
                var point = this._points.get(i);
                point.y = (point.y - this.getY()) * height / this.getHeight() + this.getY();
            }

            this.firePointsChange(oldPoints, this._points);
            this._isUpdatingShapeNode = false;
        }
        twaver.ShapeNode.superClass.setHeight.apply(this, arguments);
    },
    setLocation: function () {
        if (!this._isUpdatingShapeNode && !_twaver.isDeserializing) {
            var location;
            if (arguments.length === 2) {
                location = { x: arguments[0], y: arguments[1] };
            } else {
                location = arguments[0];
            }
            if (!_twaver.num(location.x) || !_twaver.num(location.y)) {
                return;
            }
            var xoffset = location.x - this.getX();
            var yoffset = location.y - this.getY();
            if (xoffset === 0 && yoffset === 0) {
                return;
            }

            // adjust points according to new location
            this._isUpdatingShapeNode = true;
            var oldPoints = new $List(this._points);
            for (var i = 0; i < this._points.size(); i++) {
                var point = this._points.get(i);
                point.x += xoffset;
                point.y += yoffset;
            }
            this.firePointsChange(oldPoints, this._points);
            this._isUpdatingShapeNode = false;
        }
        twaver.ShapeNode.superClass.setLocation.apply(this, arguments);
    },
    firePointsChange: function (oldPoints, newPoints) {
        if (!this._isUpdatingShapeNode && !_twaver.isDeserializing) {
            var rect = $math.getRect(newPoints);
            if (rect) {
                this._isUpdatingShapeNode = true;
                if ($Defaults.CENTER_LOCATION) {
                    this.setLocation(rect.x + rect.width / 2, rect.y + rect.height / 2);
                } else {
                    this.setLocation(rect.x, rect.y);
                }
                this.setWidth(rect.width);
                this.setHeight(rect.height);
                this._isUpdatingShapeNode = false;
            } else {
                this._isUpdatingShapeNode = true;
                this.setWidth(0);
                this.setHeight(0);
                this._isUpdatingShapeNode = false;
            }
        }
        this._reCalculateLineLength();
        this.firePropertyChange("points", oldPoints, newPoints);
    },
    _reCalculateLineLength: function () {
        if (this._points != null && this._points.size() > 0) {
            this._lineLength = $math.calculateLineLength(this._points, this._segments);
        } else {
            this._lineLength = 0;
        }
    },
    getLineLength: function () {
        return this._lineLength;
    }
});
