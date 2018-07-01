var $A18 = {};
$A18.a1 = function (graph) {
    var _la = new $A20();
    _la.a8(graph);
    return _la._n;
};
$A18.a2 = function (graph) {
    var nodecursor = graph.x9();
    var node = null;
    var i = 0;
    nodecursor.i4();
    for (; nodecursor.i1(); nodecursor.i2())
        if (nodecursor.i9().ak() === 0) {
            node = nodecursor.i9();
            i++;
        }

    if (i === 1)
        return node;
    i = 0;
    nodecursor.i4();
    for (; nodecursor.i1(); nodecursor.i2())
        if (nodecursor.i9().ao() === 0) {
            node = nodecursor.i9();
            i++;
        }

    if (i === 1)
        return node;
    else
        return $A18.a8(graph);
};
$A18.a8 = function (graph) {
    var ai = $A53.a(graph.x0());
    var nodemap = $A49.a2(ai);
    return $A18.a6(graph, nodemap);
};
$A18.a6 = function (graph, nodemap) {
    var node = graph.xd();
    var anode = $A53.d(1);
    var ai = $A53.a(graph.x0(), -1);
    var edgelist = $A18.a4(graph, node);
    $A18.a7(node, nodemap, anode, ai, -1);
    for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2())
        graph.x3(edgecursor.i8());

    return anode[0];
};
$A18.a7 = function (node, nodemap, anode, ai, i) {
    var j = 0;
    for (var edge = node.ag(); edge != null; edge = edge.a8()) {
        var node1 = edge.a3();
        var l = $A18.a7(node1, nodemap, anode, ai, i);
        if (l > i)
            i = l;
        j += ai[node1.al()];
    }

    var k = j * (node._g.xa() - 1 - j);
    for (var edge1 = node.ag(); edge1 != null; edge1 = edge1.a8()) {
        var node2 = edge1.a3();
        for (var edge2 = edge1.a8(); edge2 != null; edge2 = edge2.a8()) {
            var node3 = edge2.a3();
            k += ai[node2.al()] * ai[node3.al()];
        }

    }

    nodemap.i7(node, k);
    ai[node.al()] = j + 1;
    if (k > i) {
        i = k;
        anode[0] = node;
    }
    return i;
};
$A18.a4 = function (graph, node) {
    var reversed = new $A25();
    var dfs = new $A15(reversed);
    dfs.a6(false);
    dfs.a9(graph, node);
    for (var edgecursor = reversed.c1(); edgecursor.i1(); edgecursor.i2())
        graph.x3(edgecursor.i8());

    return reversed;
};
$A18.a3 = function (graph) {
    return $A18.a4(graph, $A18.a2(graph));
};
