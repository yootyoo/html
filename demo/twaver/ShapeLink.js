twaver.ShapeLink = function (id, fromNode, toNode) {
    this._points = new $List();
    this._styleMap = {};
    this._styleMap['link.bundle.enable'] = false;
    twaver.ShapeLink.superClass.constructor.call(this, id, fromNode, toNode);
};
_twaver.ext('twaver.ShapeLink', twaver.Link, {
    _icon: $Defaults.ICON_SHAPELINK,
    getElementUIClass: function () {
        return twaver.network.ShapeLinkUI;
    },
    getCanvasUIClass: function () {
        return twaver.canvas.ShapeLinkUI;
    },
    getVectorUIClass: function () {
        return twaver.vector.ShapeLinkUI;
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
    firePointsChange: function (oldPoints, newPoints) {
        this.firePropertyChange("points", oldPoints, newPoints);
    }
});
