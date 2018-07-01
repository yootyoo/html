twaver.layout.AutoLayouter = function (elementBox) {
    this._box = elementBox;
};
_twaver.ext('twaver.layout.AutoLayouter', Object, {
    _expandGroup: false,
    _repulsion: 1,
    _type: null,
    _animate: true,
    _explicitXOffset: Number.NaN,
    _explicitYOffset: Number.NaN,
    _xOffset: 0,
    _yOffset: 0,
    isExpandGroup: function () {
        return this._expandGroup;
    },
    setExpandGroup: function (value) {
        this._expandGroup = value;
    },
    getRepulsion: function () {
        return this._repulsion;
    },
    setRepulsion: function (value) {
        this._repulsion = value;
    },
    getType: function () {
        return this._type;
    },
    isAnimate: function () {
        return this._animate;
    },
    setAnimate: function (value) {
        this._animate = value;
    },
    getElementBox: function () {
        return this._box;
    },
    getExplicitXOffset: function () {
        return this._explicitXOffset;
    },
    setExplicitXOffset: function (value) {
        this._explicitXOffset = value;
    },
    getExplicitYOffset: function () {
        return this._explicitYOffset;
    },
    setExplicitYOffset: function (value) {
        this._explicitYOffset = value;
    },
    getDimension: function (node) {
        if (node instanceof $Group && node.getChildrenSize() > 0) {
            var rect = null;
            for (var i = 0, n = node.getChildrenSize(); i < n; i++) {
                var child = node.getChildAt(i);
                if (child instanceof $Node) {
                    if (rect) {
                        rect = $math.unionRect(rect, child.getRect());
                    } else {
                        rect = child.getRect();
                    }
                }
            }
            if (rect) {
                return { width: rect.width, height: rect.height };
            } else {
                return null;
            }
        } else {
            return { width: node.getWidth(), height: node.getHeight() };
        }
    },
    isVisible: function (element) {
        return true;
    },
    isMovable: function (element) {
        return true;
    },
    getGroupLayoutType: function (group) {
        return this._type;
    },
    getElements: function () {
        var list, box = this._box;
        var hasSelected = box.getSelectionModel().size() > 1;
        if (hasSelected) {
            list = box.getSelectionModel().getSelection();
        } else {
            list = new $List();
            box.forEachByBreadthFirst(list.add, null, list);
        }
        this._xOffset = -1;
        this._yOffset = -1;
        var elements = new $List();
        for (var i = 0, n = list.size(); i < n; i++) {
            var element = list.get(i);
            if (this.isVisible(element)) {
                if (element instanceof twaver.Link) {
                    elements.add(element);
                }
                else if (this.isMovable(element) && element instanceof $Node) {
                    elements.add(element);
                    if (hasSelected) {
                        if (this._xOffset < 0 || element.getX() < this._xOffset) {
                            this._xOffset = element.getX();
                        }
                        if (this._yOffset < 0 || element.getY() < this._yOffset) {
                            this._yOffset = element.getY();
                        }
                    }
                }
            }
        }
        if (!hasSelected) {
            if (!isNaN(this._explicitXOffset)) {
                this._xOffset = this._explicitXOffset;
            } else {
                this._xOffset = 50 / this._repulsion;
            }
            if (!isNaN(this._explicitYOffset)) {
                this._yOffset = this._explicitYOffset;
            } else {
                this._yOffset = 50 / this._repulsion;
            }
        }
        return elements;
    },
    getLayoutResult: function (type) {
        var result = {};
        this.doLayoutImpl(type, null, result);
        return result;
    },
    doLayout: function (type, finishFunction) {
        return this.doLayoutImpl(type, finishFunction);
    },
    doLayoutImpl: function (type, finishFunction, result) {
        var self = this;
        var oldFinishFunction = finishFunction;
        finishFunction = function () {
            self._box._layoutMovingElements = false;
            if (oldFinishFunction) oldFinishFunction();
        }
        this._type = type;
        var layout = null;
        if ('round' === type) {
            layout = new $A70();
        } else if ('symmetry' === type) {
            layout = new $A87();
        } else if ('hierarchic' === type) {
            layout = new $A89();
        } else if (type === 'topbottom' || type === 'bottomtop' || type === 'rightleft' || type === 'leftright') {
            layout = new $A52();
        }
        if (layout == null) {
            return false;
        }
        self._box._layoutMovingElements = true;
        var newLocations = {};
        var elements = this.getElements();
        var preProcessor = new $A88(this, elements, true, null);
        elements = preProcessor.process();
        var data = new $A82(this, elements, type, true, null);

        try {
            layout.i2(data);
        } catch (ex) {
            preProcessor.resetGroup();
            if (finishFunction != null) {
                finishFunction();
            }
            return false;
        }

        // get location result.
        var id, yNode;
        for (id in data._a) {
            yNode = data._a[id];
            var p = data.g4(yNode);
            newLocations[id] = { x: p.x + this._xOffset, y: p.y + this._yOffset };
        }
        var newLocation;
        if (type === "rightleft" || type === "leftright" || type === "bottomtop") {
            var matrix = $A88.createMatrix(type);

            var mx = Number.MAX_VALUE;
            var my = Number.MAX_VALUE;
            for (id in newLocations) {
                yNode = data._a[id];
                newLocation = newLocations[id];
                var p2 = matrix.transform(newLocation);
                newLocation.x = p2.x;
                newLocation.y = p2.y;

                var v;
                if (type === "rightleft" || type === "leftright") {
                    v = p2.x - data.g9(yNode) / 2 / this._repulsion;
                    if (v < mx) {
                        mx = v;
                    }
                    v = p2.y - data.gj(yNode) / 2 / this._repulsion;
                    if (v < my) {
                        my = v;
                    }
                } else {
                    v = p2.x - data.gj(yNode) / 2 / this._repulsion;
                    if (v < mx) {
                        mx = v;
                    }
                    v = p2.y - data.g9(yNode) / 2 / this._repulsion;
                    if (v < my) {
                        my = v;
                    }
                }
            }

            for (id in newLocations) {
                yNode = data._a[id];
                newLocation = newLocations[id];
                newLocation.x = newLocation.x - mx + this._xOffset;
                newLocation.y = newLocation.y - my + this._yOffset;
            }
        }

        if (result == null && this._animate) {
            var objs = new $List();
            var locs = new $List();
            for (id in newLocations) {
                objs.add(data._a[id].node);
                locs.add(newLocations[id]);
            }
            twaver.animate.AnimateManager.endAnimate();
            twaver.animate.AnimateManager.start(new twaver.animate.AnimateCenterLocation(objs, locs, function () {
                preProcessor.resetGroup();
                if (finishFunction != null) {
                    _twaver.callLater(finishFunction);
                }
            }));
        } else {
            for (id in newLocations) {
                yNode = data._a[id];
                newLocation = newLocations[id];
                if (result == null) {
                    yNode.node.setCenterLocation(newLocation.x, newLocation.y);
                } else {
                    result[yNode.node.getId()] = newLocation;
                }
            }
            preProcessor.resetGroup();
            if (finishFunction != null) {
                _twaver.callLater(finishFunction);
            }
        }

        return true;
    }
});
