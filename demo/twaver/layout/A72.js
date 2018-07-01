var $A72 = {};
$A72._A = new $A00(0.0, 0.0);
$A72.b = function (ypoint, ypoint1, ypoint2) {
    return $A72.c(ypoint.x, ypoint.y, ypoint1.x, ypoint1.y, ypoint2.x, ypoint2.y);
};
$A72.c = function (d, d1, d2, d3, d4, d5) {
    d2 -= d;
    d3 -= d1;
    d4 -= d;
    d5 -= d1;
    var d6 = d4 * d3 - d5 * d2;
    if (Math.abs(d6) < 0.00001) {
        return 0;
    }
    return d6 >= 0.0 ? d6 <= 0.0 ? 0 : -1 : 1;
};
$A72.d = function (ypoint, ypoint1, ypoint2) {
    return $A72.b(ypoint, ypoint1, ypoint2) > 0;
};
$A72.f = function (ypoint, ypoint1, ypoint2) {
    return $A72.b(ypoint, ypoint1, ypoint2) < 0;
};
$A72.g = function (ypoint, ypoint1, ypoint2) {
    return $A72.b(ypoint, ypoint1, ypoint2) === 0;
};
$A72.h = function (ylist) {
    return $A72.i(ylist);
};
$A72.i = function (ylist) {
    var ylist1 = new $A35(ylist.ah());
    var ylist2 = new $A35();
    ylist1.a2();
    if (ylist1.ar())
        return ylist2;
    var ypoint = ylist1.at();
    ylist2.ae(ypoint);
    for (; !ylist1.ar() && ypoint.equals(ylist1.am()); ylist1.at())
        ;
    if (ylist1.ar())
        return ylist2;
    ypoint = ylist1.at();
    var listcell = ylist2.ae(ypoint);
    for (var ycursor = ylist1.ah(); ycursor.i1(); ycursor.i2()) {
        var ypoint1 = ycursor.i6();
        if (!ypoint1.equals(ypoint)) {
            ypoint = ypoint1;
            if (ylist2.ay() === 2 && $A72.g(ylist2.am(), ylist2.as(), ypoint1)) {
                listcell.c(ypoint1);
            } else {
                var listcell1;
                for (listcell1 = listcell; !$A72.f(ylist2.ai(listcell1).d(), listcell1.d(), ypoint1); listcell1 = ylist2.ai(listcell1))
                    ;
                var listcell2;
                for (listcell2 = listcell; !$A72.d(ylist2.aj(listcell2).d(), listcell2.d(), ypoint1); listcell2 = ylist2.aj(listcell2))
                    ;
                for (; listcell2 !== ylist2.aj(listcell1); ylist2.aw(ylist2.aj(listcell1)))
                    ;
                listcell = ylist2.an(ypoint1, listcell1);
            }
        }
    }
    return ylist2;
};
$A72.j = function () {
    return $A72.k(Number.MAX_VALUE);
};
$A72.k = function (value) {
    return Math.floor(Math.random() * value);
};
$A72.l = function (d, d1) {
    return Math.random() * (d1 - d) + d;
};
