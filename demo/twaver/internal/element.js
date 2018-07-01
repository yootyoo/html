var $element = {
    DEFAULTS: {
        'default': 1,
        'default.vector': 1,
        'vector.default': 1
    },
    VECTORS: {
        'vector': 1,
        'default.vector': 1,
        'vector.default': 1
    },
    hasDefault: function (node) {
        if (node instanceof $Node) {
            var type = node.getStyle('body.type');
            return $element.DEFAULTS[type] === 1;
        }
        return true;
    },
    hasVector: function (node) {
        if (node instanceof $Node) {
            var type = node.getStyle('body.type');
            return $element.VECTORS[type] === 1;
        }
        return false;
    },
    hasAgentLinks: function (node) {
        var n = node.getChildrenSize();
        for (var i = 0; i < n; i++) {
            var child = node.getChildAt(i);
            if (child instanceof $Node && $element.hasAgentLinks(child)) {
                return true;
            }
        }
        return node.hasAgentLinks();
    },
    getParents: function (data, root, includeRoot) {
        if (!includeRoot) {
            includeRoot = true;
        }
        var list = new $List();
        var parent = data._parent;
        while (parent != null && parent !== root) {
            list.add(parent, 0);
            parent = parent._parent;
        }
        if (includeRoot && parent != null && parent === root) {
            list.add(parent, 0);
        }
        return list;
    },
    getSubNetwork: function (element) {
        if (!element) {
            return null;
        }
        //for link, only if the fromNode and toNode have the same subnetwork,
        //return the subnetwork,otherwise return null.
        if (element instanceof twaver.Link) {
            var fromAgent = element._fromAgent;
            var toAgent = element._toAgent;
            if (!fromAgent || !toAgent) {
                return null;
            }
            //subnetwork.
            var aSubNetwork = $element.getSubNetwork(fromAgent);
            var zSubNetwork = $element.getSubNetwork(toAgent);
            if (aSubNetwork === zSubNetwork) {
                return aSubNetwork;
            }
            return null;
        }

        var parent = element._parent;
        if (!parent) {
            return null;
        }
        while (parent instanceof twaver.Link && !(parent.ISubNetwork)) {
            parent = parent._parent;
        }
        if (parent.ISubNetwork) {
            return parent;
        } else {
            return $element.getSubNetwork(parent);
        }
    },
    figureSameSubNetworkAgent: function (node) {
        if (!node) {
            return null;
        }
        var parent = node._parent;
        while (parent instanceof $Group) {
            if (parent._parent instanceof $Group) {
                if (!parent.isExpanded()) {
                    node = parent;
                }
                parent = parent._parent;
            } else {
                if (parent.isExpanded()) {
                    return node;
                } else {
                    return parent;
                }
            }
        }
        return node;
    },
    figureSpanSubNetworkAgent: function (node, refNode) {
        if (!node || !refNode) {
            return null;
        }
        var nodeSN = $element.getSubNetwork(node);
        var refNodeSN = $element.getSubNetwork(refNode);
        if (nodeSN != refNodeSN) {
            // check refNode's up subnetwork.
            while (refNodeSN != null && nodeSN != refNodeSN) {
                refNodeSN = $element.getSubNetwork(refNodeSN);
            }
            if (nodeSN === refNodeSN) {
                return node;
            }

            // check node's and refNode's same ancestor.
            var list = new $List();
            list.add(node, 0);
            var parent = node._parent;
            while (parent instanceof $Node) {
                if (!refNode.isDescendantOf(parent)) {
                    list.add(parent, 0);
                    parent = parent._parent;
                } else {
                    break;
                }
            }
            var n = list.size();
            for (var i = 0; i < n; i++) {
                var element = list.get(i);
                if (element instanceof $Group && (!element.isExpanded())) {
                    return element;
                }
                if (element.ISubNetwork) {
                    return element;
                }
            }
            return node;
        }
        return node;
    },
    figureFromAgent: function (link) {
        if (link.isLooped()) {
            return link.getFromNode();
        }
        var fromAgent = $element.figureSameSubNetworkAgent(link.getFromNode());
        var toAgent = $element.figureSameSubNetworkAgent(link.getToNode());
        if (fromAgent === toAgent) {
            return link.getFromNode();
        }
        return $element.figureSpanSubNetworkAgent(fromAgent, toAgent);
    },
    figureToAgent: function (link) {
        if (link.isLooped()) {
            return link.getToNode();
        }
        var fromAgent = $element.figureSameSubNetworkAgent(link.getFromNode());
        var toAgent = $element.figureSameSubNetworkAgent(link.getToNode());
        if (fromAgent === toAgent) {
            return link.getToNode();
        }
        return $element.figureSpanSubNetworkAgent(toAgent, fromAgent);
    },
    getBundleLinks: function (node1, node2) {
        if (!node1 || !node2) {
            return null;
        }
        var i;
        var n;
        var link;
        var list;
        if (node1 === node2) {
            list = node1.getLoopedLinks();
            if (list) {
                list = new $List(list);
            } else {
                return null;
            }
        } else {
            var list1 = node1.getAgentLinks();
            var list2 = node2.getAgentLinks();
            if (!list1 || !list2) {
                return null;
            }
            n = list1.size();
            for (i = 0; i < n; i++) {
                link = list1.get(i);
                if (list2.contains(link)) {
                    if (!list) {
                        list = new $List();
                    }
                    list.add(link);
                }
            }
        }
        if (list != null) {
            for (i = 0; i < list.size(); i++) {
                link = list.get(i);
                if (!link.getStyle('link.bundle.enable')) {
                    link._setBundleLinks(null);
                    list.removeAt(i);
                    i--;
                }
            }
        }
        return list;
    },
    resetBundleLinks: function (node1, node2) {
        var links = $element.getBundleLinks(node1, node2);
        if (!links || links.size() === 0) {
            return;
        }

        var link = null;
        if (links.size() === 1) {
            link = links.get(0);
            link._setBundleLinks(null);
            return;
        }

        var i;
        var id;
        var groupIDs = new $List();
        for (i = 0; i < links.size(); i++) {
            link = links.get(i);
            id = link.getStyle('link.bundle.id');
            if (groupIDs.indexOf(id) < 0) {
                groupIDs.add(id);
            }
        }
        groupIDs.sort();
        var bundleLinks;
        var siblings = new $List();
        var k;
        for (k = 0; k < groupIDs.size(); k++) {
            id = groupIDs.get(k);
            var siblingLinks = new $List();
            for (i = 0; i < links.size(); i++) {
                link = links.get(i);
                if (id === link.getStyle('link.bundle.id')) {
                    siblingLinks.add(link);
                }
            }
            bundleLinks = new twaver.BundleLinks(siblingLinks, siblings);
            siblings.add(bundleLinks);
        }

        for (k = 0; k < siblings.size(); k++) {
            bundleLinks = siblings.get(k);
            for (i = 0; i < bundleLinks.getLinks().size(); i++) {
                link = bundleLinks.getLinks().get(i);
                link._setBundleLinks(bundleLinks);
            }
        }
    },
    moveElements: function (elements, dx, dy, filter) {
        var list = $element.filterMovingElements(elements, filter);
        var n = list.size();
        for (var i = 0; i < n; i++) {
            list.get(i).translate(dx, dy);
        }
    },
    filterMovingElements: function (elements, filter) {
        var list = new $List();
        var n = elements.size();
        for (var i = 0; i < n; i++) {
            var element = elements.get(i);
            if (!(element instanceof $Node)) {
                continue;
            }
            if (filter && !filter(element)) {
                continue;
            }
            var needToMove = true;
            var array = list.toArray();
            for (var k = 0; k < array.length; k++) {
                var e = array[k];
                if (needToMove && e instanceof twaver.Follower && element instanceof twaver.Follower && element.isLoopedHostOn(e)) {
                    needToMove = false;
                }
                else if (e instanceof twaver.Follower && e.isHostOn(element)) {
                    list.remove(e);
                }
                else if (needToMove && element instanceof twaver.Follower && e instanceof $Node && element.isHostOn(e)) {
                    needToMove = false;
                }
                else if ($element.isDescendantOfGroup(e, element)) {
                    list.remove(e);
                }
                else if (needToMove && $element.isDescendantOfGroup(element, e)) {
                    needToMove = false;
                }
            }
            if (needToMove) {
                list.add(element);
            }
        }
        return list;
    },
    isDescendantOfGroup: function (element, group) {
        if (!element || !(group instanceof $Group)) {
            return false;
        }
        if (!group.hasChildren()) {
            return false;
        }
        element = element._parent;
        while (element instanceof $Group) {
            if (element === group) {
                return true;
            } else {
                element = element._parent;
            }
        }
        return false;
    }
};
_twaver.element = $element;
