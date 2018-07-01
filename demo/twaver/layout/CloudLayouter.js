twaver.layout.CloudLayouter = function (network) {
    twaver.layout.CloudLayouter.superClass.constructor.apply(this, arguments);
    this._network = network;
    this._centerX = 0;
    this._centerY = 0;
    this._radius = 1;
    this._rect = null;
    this._localPoint = null;
    this._lastWidth = -1000;
    this._lastHeight = -1000;
    this._nodes = new $List();
    this._sa = 0;
    this._ca = 0;
    this._sb = 0;
    this._cb = 0;
    this._sc = 0;
    this._cc = 0;
    this._lasta = 0;
    this._lastb = 0;
    this._active = false;
    this._horizontalElliptical = 1;
    this._verticalElliptical = 1;
    this._timer = null;
    this._centering = false;
    this._centeringNode = null;
    this._freeze = false;

    if (this._network.getClassName() === 'twaver.network.Network') {
        this._network.setInteractions([new twaver.network.interaction.SelectInteraction(this._network)]);
    } else {
        this._network.setInteractions([new twaver.canvas.interaction.SelectInteraction(this._network)]);
    }
};
_twaver.ext('twaver.layout.CloudLayouter', twaver.PropertyChangeDispatcher, {
    __accessor: ['updateNodeFunction', 'mouseMoveFunction', 'mouseOverFunction',
			'percentPadding', 'ceaseRate', 'ceaseLimit'],
    __bool: ['elliptical', 'active', 'updateLayoutRectOnResized', 'reloadOnDataBoxChanged'],
    _moveSpeed: 2,
    _ceaseRate: 0.90,
    _ceaseLimit: 0.01,
    _percentPadding: 0.20,
    _elliptical: true,
    _interval: 50,
    _reloadOnDataBoxChanged: true,
    _updateLayoutRectOnResized: true,
    getNetwork: function () {
        return this._network;
    },
    isLayoutable: function (node) {
        return this._network.isVisible(node) && this._network.isMovable(node);
    },
    start: function (needToReset) {
        if (arguments.length === 0) {
            needToReset = true;
        }
        if (this._timer) {
            return;
        }
        this._installListeners();
        if (needToReset) {
            this.updateLayoutRect(true);
        }
        var self = this;
        var code = function () { self._update.call(self); }
        this._timer = window.setInterval(code, this._interval);
        this._update();
    },
    stop: function () {
        if (this._timer) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
    },
    isRunning: function () {
        return !!this._timer;
    },
    getInterval: function () {
        return this._interval;
    },
    setInterval: function (interval) {
        if (this._interval === interval) {
            return;
        }
        var ov = this._interval;
        this._interval = interval;
        if (this._timer) {
            window.clearInterval(this._timer);
            var self = this;
            var code = function () { self._update.call(self); }
            this._timer = window.setInterval(code, this._interval);
        }
        this.firePropertyChange('interval', ov, interval);
    },
    getMoveSpeed: function () {
        return this._moveSpeed;
    },
    setMoveSpeed: function (v) {
        var ov = this._moveSpeed;
        this._moveSpeed = v;
        this.firePropertyChange('moveSpeed', ov, v);
    },
    getLayoutRect: function () {
        var w = this._network.getView().offsetWidth / this._network.getZoom();
        var h = this._network.getView().offsetHeight / this._network.getZoom();
        var wp = w * this._percentPadding;
        var hp = h * this._percentPadding;
        return { x: wp, y: hp, width: w - 2 * wp, height: h - 2 * hp };
    },
    getCount: function () {
        return this._nodes.size();
    },
    updateLayoutRect: function (needToReload) {
        var last = this._radius;

        this._rect = this.getLayoutRect();
        if (this._rect.width <= 2) {
            this._rect.width = 2;
        }
        if (this._rect.height <= 2) {
            this._rect.height = 2;
        }
        this._radius = Math.min(this._rect.width / 2, this._rect.height / 2);
        if (this.isElliptical()) {
            this._horizontalElliptical = this._rect.width / 2 / this._radius;
            this._verticalElliptical = this._rect.height / 2 / this._radius;
        } else {
            this._horizontalElliptical = 1;
            this._verticalElliptical = 1;
        }

        this._centerX = this._rect.x + this._rect.width / 2;
        this._centerY = this._rect.y + this._rect.height / 2

        if (needToReload) {
            this.reload();
        }
        else {
            this._lasta = 1;
            this._lastb = 1;
            var max = this._nodes.size();
            for (var i = 0; i < max; i++) {
                var node = this._nodes.get(i);
                node.cx *= this._radius / last;
                node.cy *= this._radius / last;
                node.cz *= this._radius / last;
            }
            if (this._freeze) {
                this._updateNodes(0, 0, 0);
            } else {
                this._update();
            }
        }

        this._lastWidth = this._network.getView().offsetWidth;
        this._lastHeight = this._network.getView().offsetHeight;
    },
    reload: function () {
        this._freeze = false;
        this._centeringNode = null;
        this._localPoint = null;
        this._centering = false;
        this._nodes = new $List();
        this._box.forEach(function (e) {
            if (e && this.isLayoutable(e)) {
                var o = {};
                o.node = e;
                this._nodes.add(o);
            }
        }, this);

        this._sineCosine(0, 0, 0);
        this._active = false;
        this._lasta = 1;
        this._lastb = 1;

        var phi = 0;
        var theta = 0;
        var max = this._nodes.size();
        for (var i = 0; i < max; i++) {
            phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
            theta = Math.sqrt(max * Math.PI) * phi;
            var node = this._nodes.get(i);
            node.cx = this._radius * Math.cos(theta) * Math.sin(phi);
            node.cy = this._radius * Math.sin(theta) * Math.sin(phi);
            node.cz = this._radius * Math.cos(phi);
        }
    },
    _sineCosine: function (a, b, c) {
        var sineCosineDtr = Math.PI / 180;
        this._sa = Math.sin(a * sineCosineDtr);
        this._ca = Math.cos(a * sineCosineDtr);
        this._sb = Math.sin(b * sineCosineDtr);
        this._cb = Math.cos(b * sineCosineDtr);
        this._sc = Math.sin(c * sineCosineDtr);
        this._cc = Math.cos(c * sineCosineDtr);
    },
    handleSelectionChange: function (e) {
        this.centerNode(this._network.getSelectionModel().getLastData());
    },
    handleDataBoxChange: function (e) {
        if (this._reloadOnDataBoxChanged || e.kind === 'clear') {
            this.reload();
        }
    },
    handleMouseMove: function (e) {
        if (!this._centering) {
            this._updateLogicalPoint(e);
        }
        if (!this._mouseMoveFunction) {
            this._active = true;
        } else {
            this._active = this._mouseMoveFunction(e);
        }
    },
    handleMouseOver: function (e) {
        if (!this._centering) {
            this._updateLogicalPoint(e);
        }
        if (!this._mouseOverFunction) {
            this._active = true;
        } else {
            this._active = this._mouseOverFunction(e);
        }
    },
    _updateLogicalPoint: function (e) {
        this._localPoint = this._network.getLogicalPoint(e);
    },
    handleRollOut: function (e) {
        this._active = false;
    },
    handleResize: function (e) {
        if (e.kind === 'validateEnd') {
            if (!this._updateLayoutRectOnResized) {
                return;
            }
            if (Math.abs(this._network.getView().offsetWidth - this._lastWidth) <= 2 &&
				Math.abs(this._network.getView().offsetHeight - this._lastHeight) <= 2) {
                return;
            }
            this.updateLayoutRect();
        }
    },
    handleNetworkPropertyChange: function (e) {
        if (e.property === 'elementBox') {
            this._box.removeDataBoxChangeListener(this.handleDataBoxChange, this);
            this._box = this._network.getElementBox();
            this._box.addDataBoxChangeListener(this.handleDataBoxChange, this);
            this.reload();
        }
        if (e.property === 'zoom') {
            this._localPoint = null;
            this.updateLayoutRect();
        }
    },
    _adjustIndex: function () {
        this._nodes.sort(this._sortFunction);
        var count = this._nodes.size();
        for (var i = 0; i < count; i++) {
            var node = this._nodes.get(i).node;
            var oldIndex = this._box.getDatas().indexOf(node);
            this._box.getDatas().removeAt(oldIndex);
            this._box.getDatas().add(node, i);
            this._box.fireIndexChange(node, oldIndex, i);

            this.updateNode(node, i, count, this._nodes.get(i).alpha);
        }
    },
    _sortFunction: function (e1, e2) {
        if (e2.cz > e1.cz) {
            return 1;
        } else if (e2.cz < e1.cz) {
            return -1;
        } else {
            return 0;
        }
    },
    updateNode: function (node, zIndex, count, alpha) {
        if (this._updateNodeFunction) {
            this._updateNodeFunction(node, zIndex, count, alpha);
        }
    },
    _update: function () {
        if (this._freeze) {
            return;
        }
        var a;
        var b;
        if (this._centering) {
            if (this._centeringNode) {
                var atCenter = this.isAtCenter(this._centeringNode.node, this._centeringNode.perspective, this._centeringNode.cx, this._centeringNode.cy, this._centeringNode.cz);
                if (atCenter) {
                    this._freeze = true;
                    this._centering = false;
                    this._centeringNode = null;
                    return;
                }
            }
        }
        if (!this._freeze && (this._active || this._centering) && this._localPoint) {
            if (!this.isElliptical()) {
                a = (this._centerY - this._localPoint.y) / this._radius * this._moveSpeed;
                b = (this._localPoint.x - this._centerX) / this._radius * this._moveSpeed;
            } else {
                a = (this._centerY - this._localPoint.y) / (this._rect.height / 2) * this._moveSpeed;
                b = (this._localPoint.x - this._centerX) / (this._rect.width / 2) * this._moveSpeed;
            }
        } else {
            a = this._lasta * this._ceaseRate;
            b = this._lastb * this._ceaseRate;
        }

        this._lasta = a;
        this._lastb = b;

        if (Math.abs(a) > this._ceaseLimit || Math.abs(b) > this._ceaseLimit) {
            var c = 0;
            this._sineCosine(a, b, c);
            for (var j = 0, nodeSize = this._nodes.size(); j < nodeSize; j++) {
                var nodeStruct = this._nodes.get(j);
                // multiply positions by a x-rotation matrix
                var rx1 = nodeStruct.cx;
                var ry1 = nodeStruct.cy * this._ca + nodeStruct.cz * -this._sa;
                var rz1 = nodeStruct.cy * this._sa + nodeStruct.cz * this._ca;
                // multiply new positions by a y-rotation matrix
                var rx2 = rx1 * this._cb + rz1 * this._sb;
                var ry2 = ry1;
                var rz2 = rx1 * -this._sb + rz1 * this._cb;
                // multiply new positions by a z-rotation matrix
                var rx3 = rx2 * this._cc + ry2 * -this._sc;
                var ry3 = rx2 * this._sc + ry2 * this._cc;
                var rz3 = rz2;
                // set arrays to new positions
                nodeStruct.cx = rx3;
                nodeStruct.cy = ry3;
                nodeStruct.cz = rz3;
                // add perspective
                var perspective = this._radius * 2;
                perspective = perspective / (perspective + rz3);
                nodeStruct.perspective = perspective;
                nodeStruct.alpha = (this._radius - rz3) / (this._radius * 2);
                var x = (this._horizontalElliptical * rx3 * perspective) - (this._horizontalElliptical * 2) + this._centerX;
                var y = ry3 * perspective * this._verticalElliptical + this._centerY;
                nodeStruct.node.setCenterLocation(x, y);
            }

            this._adjustIndex();
        }
    },
    centerNode: function (node) {
        if (node && this.isLayoutable(node)) {
            if (this._centeringNode && node === this._centeringNode.node && this._freeze) {
                return;
            }
            for (var i = 0, nodeSize = this._nodes.size(); i < nodeSize; i++) {
                var nodeStruct = this._nodes.get(i);
                if (nodeStruct && node === nodeStruct.node) {
                    this._centering = true;
                    this._freeze = false;
                    this._active = true;
                    this._centeringNode = nodeStruct;
                    this._localPoint = this.createControlPoint(this._centeringNode.node);
                    break;
                }
            }
        } else {
            this._centering = false;
            this._freeze = false;
            this._active = false;
            this._localPoint = null;
        }
    },
    createControlPoint: function (node) {
        var nodePoint = node.getCenterLocation();
        var layoutRect = this.getLayoutRect();
        var layoutCenterX = layoutRect.x + layoutRect.width / 2;
        var layoutCenterY = layoutRect.y + layoutRect.height / 2;
        var angle = Math.atan2(nodePoint.y - layoutCenterY, nodePoint.x - layoutCenterX);
        var distance = layoutRect.width + layoutRect.height;
        return { x: layoutCenterX + distance * Math.cos(angle), y: layoutCenterY + distance * Math.sin(angle) };
    },
    isAtCenter: function (node, perspective, cx, cy, cz) {
        if (this._moveSpeed <= 0) {
            return true;
        }
        var z2r = 16 / this._moveSpeed;
        if (z2r > 20) {
            z2r = 20;
        } else if (z2r < 2) {
            z2r = 2;
        }
        return -cz / Math.sqrt(cx * cx + cy * cy) > z2r;
    },
    _updateNodes: function (a, b, c) {
        this._sineCosine(a, b, c);
        for (var j = 0, nodeSize = this._nodes.size(); j < nodeSize; j++) {
            var nodeStruct = this._nodes.get(j);
            // multiply positions by a x-rotation matrix
            var rx1 = nodeStruct.cx;
            var ry1 = nodeStruct.cy * this._ca + nodeStruct.cz * -this._sa;
            var rz1 = nodeStruct.cy * this._sa + nodeStruct.cz * this._ca;
            // multiply new positions by a y-rotation matrix
            var rx2 = rx1 * this._cb + rz1 * this._sb;
            var ry2 = ry1;
            var rz2 = rx1 * -this._sb + rz1 * this._cb;
            // multiply new positions by a z-rotation matrix
            var rx3 = rx2 * this._cc + ry2 * -this._sc;
            var ry3 = rx2 * this._sc + ry2 * this._cc;
            var rz3 = rz2;
            // set arrays to new positions
            nodeStruct.cx = rx3;
            nodeStruct.cy = ry3;
            nodeStruct.cz = rz3;
            // add perspective
            var perspective = this._radius * 2;
            perspective = perspective / (perspective + rz3);
            nodeStruct.perspective = perspective;

            var x = (this._horizontalElliptical * rx3 * perspective) - (this._horizontalElliptical * 2) + this._centerX;
            var y = ry3 * perspective * this._verticalElliptical + this._centerY;
            nodeStruct.node.setCenterLocation(x, y);
        }
        this._adjustIndex();
    },
    _installListeners: function () {
        this._box = this._network.getElementBox();
        this._box.addDataBoxChangeListener(this.handleDataBoxChange, this);
        this._network.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
        this._network.addViewListener(this.handleResize, this);
        $html.addEventListener('mouseout', 'handleRollOut', this._network.getView(), this);
        $html.addEventListener('mousemove', 'handleMouseMove', this._network.getView(), this);
        $html.addEventListener('mouseover', 'handleMouseOver', this._network.getView(), this);
        this._network.addPropertyChangeListener(this.handleNetworkPropertyChange, this);
    },
    _uninstallListeners: function () {
        this._box.removeDataBoxChangeListener(this.handleDataBoxChange, this);
        this._network.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
        this._network.removeViewListener(this.handleResize, this);
        $html.removeEventListener('mouseout', this._network.getView(), this);
        $html.removeEventListener('mousemove', this._network.getView(), this);
        $html.removeEventListener('mouseover', this._network.getView(), this);
        this._network.removePropertyChangeListener(this.handleNetworkPropertyChange, this);
    }
});
