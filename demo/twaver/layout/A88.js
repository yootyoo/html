var $A88 = function (
			autoLayouter,
			elements,
			handleGroup, parentGroup) {
    this._e = autoLayouter;
    this._f = elements;
    this._a = handleGroup;
    this._b = parentGroup;
    this._c = {};
};
_twaver.ext($A88, Object, {
    resetGroup: function () {
        if (!this._a || this._b != null) {
            return;
        }
        for (var id in this._c) {
            var group = this._c[id];
            if (this._e.isExpandGroup()) {
                group.group.setExpanded(true);
            } else {
                group.group.setExpanded(group.b);
            }
        }
    },
    process: function () {
        var list = new $List();
        for (var i = 0, n = this._f.size(); i < n; i++) {
            var element = this._f.get(i);
            if (element instanceof twaver.Link) {
                if (!element.isLooped()) {
                    list.add(element);
                }
            } else {
                if (this._b == null) {
                    if (element.getParent() instanceof $Group) {
                        continue;
                    }
                }
                if (this._b == null || (this._b != null && this._b !== element)) {
                    list.add(element);
                }
                if (this._b == null) {
                    if (element instanceof $Group) {
                        this.layoutGroup(element);
                    }
                }
            }
        }
        return list;
    },
    layoutGroup: function (group) {
        if (!this._a || this._c[group.getId()] != null || this._b != null) {
            return;
        }
        this._c[group.getId()] = { group: group, b: group.isExpanded() };
        var groupLayoutType = this._e.getGroupLayoutType(group);
        if (!groupLayoutType) {
            return;
        }

        // expand group
        group.setExpanded(true);

        // layout child
        var set = new $List();
        var childs = group.getChildren();
        var child;
        for (var i = 0, n = childs.size(); i < n; i++) {
            child = childs.get(i);
            if (child instanceof $Group) {
                this.layoutGroup(child);
                child.setExpanded(false);
            }
            if (!(child instanceof twaver.Link) && !set.contains(child)) {
                set.add(child);
            }
            if (child instanceof $Node) {
                var allLinks = child.getLinks();
                if (allLinks != null) {
                    for (var l = 0, c = allLinks.size(); l < c; l++) {
                        var link = allLinks.get(l);
                        if (!set.contains(link)) {
                            set.add(link);
                        }
                    }
                }
            }
        }
        var data = new $A82(this._e, set, groupLayoutType, this._a, this._b);
        try {
            var layout = null;
            if ('round' === groupLayoutType) {
                layout = new $A70();
            } else if ('symmetry' === groupLayoutType) {
                layout = new $A87();
            } else if ('hierarchic' === groupLayoutType) {
                layout = new $A89();
            } else if (groupLayoutType === 'topbottom' || groupLayoutType === 'bottomtop' || groupLayoutType === 'rightleft' || groupLayoutType === 'leftright') {
                layout = new $A52();
            }
            if (layout != null) {
                layout.i2(data);
                var matrix = $A88.createMatrix(groupLayoutType);

                var oldLocations = {};
                var newLocations = {};

                // get location result.    
                for (var id in data._a) {
                    var yNode = data._a[id];
                    var element = yNode.node;
                    var p = data.g4(yNode);

                    oldLocations[id] = element.getCenterLocation();
                    if (matrix != null) {
                        var p2 = matrix.transform(p);
                        element.setCenterLocation(p2.x, p2.y);
                    } else {
                        element.setCenterLocation(p.x, p.y);
                    }
                    newLocations[id] = element.getCenterLocation();
                }
            }
        } catch (ex) {
        }

        childs = group.getChildren();
        for (i = 0, n = childs.size(); i < n; i++) {
            child = childs.get(i);
            if (child instanceof $Group) {
                child.setExpanded(true);
            }
        }
    }
});
$A88.createMatrix = function (layoutType) {
    if (layoutType === "rightleft") {
        return $math.createMatrix(Math.PI / 2, 0, 0);
    }
    if (layoutType === "leftright") {
        return $math.createMatrix(-Math.PI / 2, 0, 0);
    }
    if (layoutType === "bottomtop") {
        return $math.createMatrix(Math.PI, 0, 0);
    }
    return null;
};
