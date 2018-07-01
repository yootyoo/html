var $A90 = function () {

};
_twaver.ext($A90, Object, {
    i1: function (layoutgraph, nodemap, edgelist) {
        var i = this.a1(layoutgraph, nodemap);
        this.a2(layoutgraph, nodemap, edgelist);
        return i;
    },
    a1: function (graph, nodemap) {
        var nodelist = $A90.i4(graph);
        nodelist.ax();
        var i = 0;
        for (var nodecursor = nodelist.x1(); nodecursor.i1(); nodecursor.i2())
            nodemap.i7(nodecursor.i9(), -1);

        for (var nodecursor1 = nodelist.x1(); nodecursor1.i1(); nodecursor1.i2()) {
            var node = nodecursor1.i9();
            var j = -1;
            for (var nodecursor2 = node.aq(); nodecursor2.i1(); nodecursor2.i2())
                j = Math.max(j, nodemap.i2(nodecursor2.i9()));

            nodemap.i7(node, j + 1);
            i = Math.max(i, j + 1);
        }
        return i + 1;
    },
    a2: function (graph, nodemap, edgelist) {
        edgelist.az($A90.i3(graph, nodemap));
    }
});
$A90.i3 = function (graph, nodemap) {
    var edgelist = new $A25();
    for (var edgecursor = graph.xf(); edgecursor.i1(); edgecursor.i2()) {
        var edge = edgecursor.i8();
        if (nodemap.i2(edge.a2()) > nodemap.i2(edge.a3())) {
            graph.x3(edge);
            edgelist.ac(edge);
        }
    }
    return edgelist;
};
$A90.i4 = function (graph) {
    var ai = $A53.a(graph.xa());
    (new $A17()).a1(graph, ai);
    return $A90.i2(graph, ai);
};
$A90.i2 = function (graph, ai) {
    var anode = $A53.d(graph.x0());
    for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
        var node = nodecursor.i9();
        var i = node.al();
        anode[ai[i]] = node;
    }
    return new $A46(anode);
};
