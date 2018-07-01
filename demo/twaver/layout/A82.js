var $A82 = function (autoLayouter, elements, type, handleGroup, parentGroup) {
    this._a = {};
    $A82.superClass.constructor.call(this);
    var links = new $List(), i, n;
    for (i = 0, n = elements.size(); i < n; i++) {
        var element = elements.get(i);
        if (element instanceof twaver.Link) {
            links.add(element);
        } else {
            var expandGroup = handleGroup && parentGroup == null && element instanceof $Group;
            if (expandGroup) {
                element.setExpanded(true);
            }
            var size = autoLayouter.getDimension(element);
            if (expandGroup) {
                element.setExpanded(false);
            }
            if (size == null) {
                continue;
            }
            var yNode = this.xm();
            var r = autoLayouter._repulsion;
            if (type === "rightleft" || type === "leftright") {
                this.s7(yNode, size.height * r, size.width * r);
            } else {
                this.s7(yNode, size.width * r, size.height * r);
            }
            yNode.node = element;
            this._a[element.getId()] = yNode;
        }
    }

    for (i = 0, n = links.size(); i < n; i++) {
        var link = links.get(i);
        var aNode = link.getFromAgent();
        var zNode = link.getToAgent();
        var aYNode = this._a[aNode.getId()];
        var zYNode = this._a[zNode.getId()];
        if (aYNode == null || zYNode == null || aYNode === zYNode) {
            continue;
        }
        this.xo(aYNode, zYNode);
    }
};
_twaver.ext($A82, $A79, {
});
