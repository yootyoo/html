twaver.RotatableNode = function (id) {
    twaver.RotatableNode.superClass.constructor.call(this, id);
};
_twaver.ext('twaver.RotatableNode', twaver.Follower, {
    getWidth: function () {
        if (this._angle == 0) {
            return this._getOrignalWidth();
        } else {
            return this._getRotateRect().width;
        }
    },
    setWidth: function (width) {

    },
    getHeight: function () {
        if (this._angle == 0) {
            return this._getOrignalHeight();
        } else {
            return this._getRotateRect().height;
        }
    },
    setHeight: function (height) {

    },
    getElementUIClass: function () {
        return twaver.network.RotatableNodeUI;
    },
    getCanvasUIClass: function () {
        return twaver.canvas.RotatableNodeUI;
    },
    getVectorUIClass: function () {
        return twaver.vector.RotatableNodeUI;
    },
    _getRotateRect: function () {
        var width = this._getOrignalWidth();
        var height = this._getOrignalHeight();
        var matrix = $math.createMatrix(this._angle * Math.PI / 180, width / 2, height / 2);
        var points = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height}];
        for (var i = 0, n = points.length; i < n; i++) {
            points[i] = matrix.transform(points[i]);
        }
        return $math.getRect(points);
    },
    _getOrignalWidth: function () {
        return twaver.RotatableNode.superClass.getWidth.call(this);
    },
    _getOrignalHeight: function () {
        return twaver.RotatableNode.superClass.getHeight.call(this);
    }
});

