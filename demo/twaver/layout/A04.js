var $A04 = function (ypoint, ypoint1) {
    if ($A04.a2(ypoint.x, ypoint1.x)) {
        this._a = 1.0;
        this._b = 0.0;
        this._c = -ypoint.x;
    } else {
        this._b = -1;
        var d1 = (ypoint1.y - ypoint.y) / (ypoint1.x - ypoint.x);
        var d2 = ypoint.y - ypoint.x * d1;
        this._a = d1;
        this._c = d2;
    }
};
_twaver.ext($A04, Object, {
    a3: function () {
        return this._a;
    },
    a4: function () {
        return this._b;
    },
    a5: function () {
        return this._c;
    }
});
$A04.a6 = function (affineline, affineline1) {
    if ($A04.a1(affineline.a3()) && $A04.a1(affineline1.a3()))
        return null;
    if ($A04.a1(affineline.a4()) && $A04.a1(affineline1.a4()))
        return null;
    if ($A04.a1(affineline1.a4())) {
        var affineline2 = affineline;
        affineline = affineline1;
        affineline1 = affineline2;
    }
    var d3 = affineline.a3();
    var d4 = affineline.a4();
    var d5 = -affineline.a5();
    var d6;
    var d7;
    if (!$A04.a1(affineline.a3())) {
        d6 = affineline1.a4() - (affineline1.a3() / affineline.a3()) * affineline.a4();
        d7 = -affineline1.a5() - (affineline1.a3() / affineline.a3()) * -affineline.a5();
    } else {
        d6 = affineline1.a4();
        d7 = -affineline1.a5();
    }
    var d2 = d7 / d6;
    var d1 = (d5 - d2 * d4) / d3;
    return new $A00(d1, d2);
};
$A04.a1 = function (d1) {
    return $A04.a2(d1, 0.0);
};
$A04.a2 = function (d1, d2) {
    return Math.abs(d1 - d2) < 1.0000000000000001E-005;
};