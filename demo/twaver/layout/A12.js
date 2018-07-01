var $A12 = {};
$A12.a2 = function (graph) {
    var nodemap = $A49.a2($A53.a(graph.xa()));
    return $A12.a4(graph, nodemap, $A12.a3(graph, nodemap));
};
$A12.a3 = function (graph, nodemap) {
    for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2())
        nodemap.i7(nodecursor.i9(), -1);

    var i = 0;
    var boundedstack = new $A30(graph.xa());
    for (var nodecursor1 = graph.x9(); nodecursor1.i1(); nodecursor1.i2()) {
        var node = nodecursor1.i9();
        if (nodemap.i2(node) === -1)
            $A12.a(node, boundedstack, nodemap, i++);
    }

    return i;
};
$A12.a6 = function (graph) {
    var edgelist = new $A25();
    var anodelist = $A12.a2(graph);
    for (var i = 0; i < anodelist.length - 1; i++) {
        var edge = graph.xo(anodelist[i].x2(), anodelist[i + 1].x3());
        edgelist.aa(edge);
    }

    return edgelist;
};
$A12.a4 = function (graph, nodemap, i) {
    var anodelist = [];
    for (var j = 0; j < i; j++)
        anodelist[j] = new $A46();

    for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2())
        anodelist[nodemap.i2(nodecursor.i9())].ae(nodecursor.i9());

    return anodelist;
};
$A12.a = function (node, boundedstack, nodemap, i) {
    boundedstack.c(node);
    nodemap.i7(node, i);
    while (!boundedstack.a()) {
        node = boundedstack.b();
        for (var edge = node.ag(); edge != null; edge = edge.a8()) {
            var node1 = edge.a3();
            if (nodemap.i2(node1) === -1) {
                nodemap.i7(node1, i);
                boundedstack.c(node1);
            }
        }

        for (var edge1 = node.ae(); edge1 != null; edge1 = edge1.a7()) {
            var node2 = edge1.a2();
            if (nodemap.i2(node2) === -1) {
                nodemap.i7(node2, i);
                boundedstack.c(node2);
            }
        }
    }
};
$A12.a1 = function (graph, edgemap, nodemap) {
    var _la = new $A21(edgemap, nodemap);
    _la.a8(graph);
    return _la._i;
};
$A12.a5 = function (graph, edgemap, i) {
    var aedgelist = [];
    for (var j = 0; j < i; j++)
        aedgelist[j] = new $A25();

    for (var edgecursor = graph.xf(); edgecursor.i1(); edgecursor.i2())
        aedgelist[edgemap.i2(edgecursor.i8())].aa(edgecursor.i8());

    return aedgelist;
};
$A12.a7 = function (graph) {
    var edgelist = new $A25();
    var nodemap = $A49.a3($A53.b(graph.xa()));
    var edgemap = $A49.a4($A53.a(graph.xh()));
    var i = $A12.a1(graph, edgemap, nodemap);
    var aedgelist = $A12.a5(graph, edgemap, i);
    if (aedgelist.length > 1) {
        var nodelist = new $A46();
        for (var j = 0; j < aedgelist.length; j++) {
            var edgelist1 = aedgelist[j];
            var node2 = null;
            if (edgelist1.ay() === 1) {
                var edge = edgelist1.c2();
                if (edge.a2().ad() === 1)
                    node2 = edge.a2();
                else if (edge.a3().ad() === 1)
                    node2 = edge.a3();
            } else {
                for (var edgecursor = edgelist1.c1(); edgecursor.i1(); edgecursor.i2()) {
                    var edge1 = edgecursor.i8();
                    if (nodemap.i4(edge1.a2()))
                        if (node2 == null)
                            node2 = edge1.a2();
                        else if (node2 !== edge1.a2()) {
                            node2 = null;
                            break;
                        }
                    if (!nodemap.i4(edge1.a3()))
                        continue;
                    if (node2 == null) {
                        node2 = edge1.a3();
                        continue;
                    }
                    if (node2 === edge1.a3())
                        continue;
                    node2 = null;
                    break;
                }

                if (node2 != null) {
                    var edge2 = edgelist1.c2();
                    if (edge2.a2() !== node2)
                        node2 = edge2.a2();
                    else
                        node2 = edge2.a3();
                }
            }
            if (node2 != null)
                nodelist.aa(node2);
        }

        var node1;
        for (var node = nodelist.x4(); !nodelist.ar(); node = node1) {
            node1 = nodelist.x4();
            edgelist.ac(graph.xo(node, node1));
        }

    }
    return edgelist;
};
