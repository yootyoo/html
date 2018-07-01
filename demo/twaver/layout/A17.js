var $A17 = function () {
    this._a = 0;
};
_twaver.ext($A17, Object, {
    a1: function (graph, ai) {
        this._a = 0;
        for (var i = ai.length - 1; i >= 0; i--)
            ai[i] = -1;

        for (var nodecursor = graph.x9(); nodecursor.i1(); nodecursor.i2()) {
            var node = nodecursor.i9();
            if (node.ak() !== 0)
                continue;
            this.a2(node, node.al(), ai);
            break;
        }
        for (var nodecursor1 = graph.x9(); nodecursor1.i1(); nodecursor1.i2()) {
            var node1 = nodecursor1.i9();
            var j = node1.al();
            if (ai[j] === -1)
                this.a2(node1, j, ai);
        }
    },
    a2: function (node, i, ai) {
        ai[i] = -2;
        for (var edge = node.ag(); edge != null; ) {
            var node1 = edge.a3();
            var j = node1.al();
            switch (ai[j]) {
                case -1:
                    this.a2(node1, j, ai);
                case -2:
                default:
                    edge = edge.a8();
                    break;
            }
        }

        ai[i] = this._a++;
    }
});
