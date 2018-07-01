twaver.Bus = function (id) {
    this._styleMap = {};
    this._styleMap['vector.fill'] = false;
    this._styleMap['shapenode.closed'] = false;
    twaver.Bus.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.Bus', twaver.ShapeNode, {
    _icon: $Defaults.ICON_BUS,
    firePointsChange: function () {
        var count = this._points.size();
        if (!_twaver.isDeserializing && count >= 2) {
            var lastPoint = this._points.get(0);
            for (var i = 1; i < count; i++) {
                var point = this._points.get(i);
                if (Math.abs(point.x - lastPoint.x) > Math.abs(point.y - lastPoint.y)) {
                    point.y = lastPoint.y;
                } else {
                    point.x = lastPoint.x;
                }
                lastPoint = point;
            }
        }
        twaver.Bus.superClass.firePointsChange.apply(this, arguments);
    }
});
