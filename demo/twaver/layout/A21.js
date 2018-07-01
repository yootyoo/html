var $A21 = function (edgemap, nodemap) {
    this._i = 0;
    this._m = nodemap;
    this._j = edgemap;
    this._l = false;
};
_twaver.ext($A21, $A19, {
    a8: function (graph) {
        this._h = $A53.a(graph.x0());
        this._k = $A53.a(graph.x0());
        this._g = new $A30(graph.xh());
        $A21.superClass.a8.call(this, graph);
    },
    a5: function (node, i1) {
        this._k[node.al()] = this._h[node.al()] = i1;
    },
    a3: function (edge, node, flag) {
        this._g.c(edge);
        if (!flag) {
            var node1 = edge.a1(node);
            this._h[node1.al()] = Math.min(this._h[node1.al()], this._k[node.al()]);
        }
    },
    a1: function (node) {
        this._l = false;
    },
    a2: function (edge, node) {
        var node1 = edge.a1(node);
        if (this._h[node.al()] >= this._k[node1.al()]) {
            for (; this._g.d() !== edge; this._j.i5(this._g.b(), this._i))
                ;
            this._j.i5(this._g.b(), this._i);
            this._i++;
            if (this._g.a()) {
                if (this._l)
                    this._m.i5(node1, true);
                else
                    this._l = true;
            } else {
                this._m.i5(node1, true);
            }
        }
        this._h[node1.al()] = Math.min(this._h[node1.al()], this._h[node.al()]);
    }
});
