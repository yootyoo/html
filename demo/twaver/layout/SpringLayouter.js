twaver.layout.SpringLayouter = function (network) {
    this._network = network;
    this._damper = 1;
    this._maxMotion = 0;
    this._motionRatio = 0;
    this._isAdjusting = false;
    this._timer = null;
    this._snodeMap = {};
    this._snodes = new $List();
    this._slinks = new $List();

    this._network.getElementBox().addDataBoxChangeListener(this._handleDataBoxChange, this);
    this._network.getElementBox().addDataPropertyChangeListener(this._handleDataPropertyChange, this);
    this._network.addPropertyChangeListener(this._handleNetworkPropertyChange, this);
};
_twaver.ext('twaver.layout.SpringLayouter', Object, {
    _nodeRepulsionFactor: 0.6,
    _linkRepulsionFactor: 0.6,
    _limitBounds: null,
    _interval: 50,
    _stepCount: 10,
    _motionLimit: 0.01,
    start: function () {
        if (this._timer) {
            return;
        }
        var self = this;
        var code = function () { self.relax.call(self); }
        this._timer = window.setInterval(code, this._interval);
        this._damper = 1;
    },
    stop: function () {
        if (this._timer) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
    },
    relax: function () {
        if (this._damper < 0.1 && this._maxMotion < this._motionLimit) {
            return;
        }

        this._rebuild();

        var nodeCount = this._snodes.size();
        for (var i = 0; i < this._stepCount; i++) {
            this._slinks.forEach(this._relaxLink, this);

            for (var m = 0; m < nodeCount; m++) {
                for (var n = 0; n < nodeCount; n++) {
                    var n1 = this._snodes.get(m);
                    var n2 = this._snodes.get(n);
                    if (n1 != n2) {
                        this._relaxNodePair(n1, n2);
                    }
                }
            }
            this._moveNodes();
        }

        this._isAdjusting = true;
        for (var i = 0; i < nodeCount; i++) {
            var node = this._snodes.get(i);
            if (!node.fix) {
                node.element.setLocation(node.x, node.y);
            }
        }
        this._isAdjusting = false;
    },
    isRunning: function () {
        return !!this._timer;
    },
    getNetwork: function () {
        return this._network;
    },
    isVisible: function (element) {
        return this._network.isVisible(element);
    },
    isMovable: function (node) {
        if (!this._network.isMovable(node)) {
            return false;
        }
        if (this._network.getSelectionModel().contains(node)) {
            return false;
        }
        if (node instanceof $Group) {
            return false;
        }
        return true;
    },
    getNodeRepulsionFactor: function () {
        return this._nodeRepulsionFactor;
    },
    setNodeRepulsionFactor: function (nodeRepulsionFactor) {
        if (nodeRepulsionFactor < 0.02) {
            nodeRepulsionFactor = 0.02;
        }
        this._nodeRepulsionFactor = nodeRepulsionFactor;
        this._damper = 1;
    },
    getLinkRepulsionFactor: function () {
        return this._linkRepulsionFactor;
    },
    setLinkRepulsionFactor: function (linkRepulsionFactor) {
        if (linkRepulsionFactor < 0.02) {
            linkRepulsionFactor = 0.02;
        }
        this._linkRepulsionFactor = linkRepulsionFactor;
        this._damper = 1;
    },
    getStepCount: function () {
        return this._stepCount;
    },
    setStepCount: function (stepCount) {
        this._stepCount = stepCount;
        this._damper = 1;
    },
    getInterval: function () {
        return this._interval;
    },
    setInterval: function (interval) {
        if (this._interval === interval) {
            return;
        }
        this._interval = interval;
        if (this._timer) {
            window.clearInterval(this._timer);
            var self = this;
            var code = function () { self.relax.call(self); }
            this._timer = window.setInterval(code, this._interval);
        }
    },
    getLimitBounds: function () {
        return this._limitBounds;
    },
    setLimitBounds: function (limitBounds) {
        this._limitBounds = limitBounds;
        this._damper = 1;
    },
    _handleDataPropertyChange: function (evt) {
        if (!this._isAdjusting) {
            this._damper = 1;
        }
    },
    _handleDataBoxChange: function (evt) {
        if (this._network.getElementBox().size() === 0) {
            this._damper = 0;
        }
        else {
            this._damper = 1;
        }
    },
    _handleNetworkPropertyChange: function (evt) {
        if (evt.property === "elementBox") {
            var oldValue = evt.oldValue;
            if (oldValue != null) {
                oldValue.removeDataBoxChangeListener(this._handleDataBoxChange, this);
                oldValue.removeDataPropertyChangeListener(this._handleDataPropertyChange, this);
            }
            this._network.getElementBox().addDataBoxChangeListener(this._handleDataBoxChange, this);
            this._network.getElementBox().addDataPropertyChangeListener(this._handleDataPropertyChange, this);
        }
    },
    _relaxLink: function (link) {
        var vx = link.toNode.x - link.fromNode.x;
        var vy = link.toNode.y - link.fromNode.y;
        var len = Math.sqrt(vx * vx + vy * vy);

        var dx = vx * 0.25;
        var dy = vy * 0.25;
        dx /= (link.length * 100);
        var length = link.length;
        var div = length * 100;
        var ddy = dy;
        dy = dy / div;
        ddy /= (link.length * 100);

        link.toNode.dx = link.toNode.dx - dx * len;
        link.toNode.dy = link.toNode.dy - dy * len;

        link.fromNode.dx = link.fromNode.dx + dx * len;
        link.fromNode.dy = link.fromNode.dy + dy * len;
    },
    _relaxNodePair: function (n1, n2) {
        var dx = 0;
        var dy = 0;
        var vx = n1.x - n2.x;
        var vy = n1.y - n2.y;
        var len = vx * vx + vy * vy;
        if (len === 0) {
            dx = Math.random();
            dy = Math.random();
        }
        else if (len < 360000) {
            dx = vx / len;
            dy = vy / len;
        }

        var repSum = n1.repulsion * n2.repulsion / 100;
        var factor = repSum * 0.25;

        n1.dx += dx * factor;
        n1.dy += dy * factor;

        n2.dx -= dx * factor;
        n2.dy -= dy * factor;
    },
    _moveNodes: function () {
        var lastMaxMotion = this._maxMotion;
        var maxMotionA = 0;

        for (var i = 0, nodeSize = this._snodes.size(); i < nodeSize; i++) {
            var n = this._snodes.get(i);

            var dx = n.dx;
            var dy = n.dy;
            dx *= this._damper;
            dy *= this._damper;

            n.dx = dx / 2;
            n.dy = dy / 2;

            var distMoved = Math.sqrt(dx * dx + dy * dy);
            if (!n.fix) {
                n.x = n.x + Math.max(-30, Math.min(30, dx));
                n.y = n.y + Math.max(-30, Math.min(30, dy));
                if (!this._limitBounds) {
                    if (n.x < 1) {
                        this._adjustLocation(1, 0);
                    }
                    if (n.y < 1) {
                        this._adjustLocation(0, 1);
                    }
                }
                else {
                    if (n.x < this._limitBounds.x) {
                        n.x = this._limitBounds.x;
                        this._adjustLocation(1, 0);
                    }
                    if (n.y < this._limitBounds.y) {
                        n.y = this._limitBounds.y;
                        this._adjustLocation(0, 1);
                    }
                    var rect;
                    var ui = this._network.getElementUI(n.element);
                    if (ui) {
                        rect = ui._viewRect;
                    } else {
                        rect = n.element.getRect();
                    }
                    if (rect) {
                        if (n.x + rect.width > this._limitBounds.x + this._limitBounds.width) {
                            n.x = this._limitBounds.x + this._limitBounds.width - rect.width;
                            this._adjustLocation(-1, 0);
                        }
                        if (n.y + rect.height > this._limitBounds.y + this._limitBounds.height) {
                            n.y = this._limitBounds.y + this._limitBounds.height - rect.height;
                            this._adjustLocation(0, -1);
                        }
                    }
                }
            }
            maxMotionA = Math.max(distMoved, maxMotionA);
        }

        this._maxMotion = maxMotionA;
        if (this._maxMotion > 0) this._motionRatio = lastMaxMotion / this._maxMotion - 1;
        else this._motionRatio = 0;

        this._damp();
    },
    _damp: function () {
        if (this._motionRatio <= 0.001) {
            if ((this._maxMotion < 0.2 || (this._maxMotion > 1 && this._damper < 0.9)) && this._damper > 0.01) this._damper -= 0.01;
            else if (this._maxMotion < 0.4 && this._damper > 0.003) this._damper -= 0.003;
            else if (this._damper > 0.0001) this._damper -= 0.0001;
        }
        if (this._maxMotion < this._motionLimit) {
            this._damper = 0;
        }
    },
    _rebuild: function () {
        this._snodeMap = {};
        this._snodes.clear();
        this._slinks.clear();

        this._network.getElementBox().forEach(function (element) {
            if (this.isVisible(element)) {
                if (element instanceof twaver.Link) {
                    this._addLink(element);
                }
                else if (element instanceof $Node) {
                    this._addNode(element);
                }
            }
        }, this);
    },
    _addNode: function (element) {
        var node = this._snodeMap[element.getId()];
        if (!!node) {
            return node;
        }
        node = {};
        node.element = element;
        node.repulsion = this._getRepulsion(element);
        node.x = element.getX();
        node.y = element.getY();
        node.dx = 0;
        node.dy = 0;
        node.fix = !this.isMovable(element);
        this._snodeMap[element.getId()] = node;
        this._snodes.add(node);
        return node;
    },
    _addLink: function (element) {
        var link = {};
        link.fromNode = this._addNode(element.getFromNode());
        link.toNode = this._addNode(element.getToNode());
        link.element = element;

        var toUI = this._network.getElementUI(element.getToNode());
        var fromUI = this._network.getElementUI(element.getFromNode());
        var w, h;
        if (toUI && toUI._viewRect && fromUI && fromUI._viewRect) {
            w = (toUI._viewRect.width + fromUI._viewRect.width);
            h = (toUI._viewRect.height + fromUI._viewRect.height);
        } else {
            w = element.getToNode().getWidth() + element.getFromNode().getWidth();
            h = element.getToNode().getHeight() + element.getFromNode().getHeight();
        }
        link.length = Math.floor(Math.sqrt(w * w + h * h) * this._linkRepulsionFactor);
        if (link.length <= 0) {
            link.length = 100;
        }
        this._slinks.add(link);
    },
    _getRepulsion: function (node) {
        var ui = this._network.getElementUI(node);
        var result;
        if (ui && ui._viewRect) {
            var rect = ui._viewRect;
            result = Math.floor(Math.sqrt(rect.width * rect.width + rect.height * rect.height) * this._nodeRepulsionFactor);
        } else {
            result = 100;
        }
        if (result <= 0) {
            result = 100;
        }
        return result;
    },
    _adjustLocation: function (xoffset, yoffset) {
        for (var i = 0, nodeSize = this._snodes.size(); i < nodeSize; i++) {
            var n = this._snodes.get(i);
            var rect;
            var ui = this._network.getElementUI(n.element);
            if (ui) {
                rect = ui._viewRect;
            } else {
                rect = n.element.getRect();
            }
            if (!rect) {
                return;
            }
            if (xoffset > 0) {
                if (!this._limitBounds || n.x + rect.width + xoffset < this._limitBounds.x + this._limitBounds.width) {
                    n.x += xoffset;
                }
            } else {
                if (!this._limitBounds || n.x + xoffset > this._limitBounds.x) {
                    n.x += xoffset;
                }
            }
            if (yoffset > 0) {
                if (!this._limitBounds || n.y + rect.height + yoffset < this._limitBounds.y + this._limitBounds.height) {
                    n.y += yoffset;
                }
            } else {
                if (!this._limitBounds || n.y + yoffset > this._limitBounds.y) {
                    n.y += yoffset;
                }
            }
        }
    }
});
