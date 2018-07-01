var $A83 = {};
$A83._D = new $A05();
$A83._E = new $A00(0.0, 0.0);
$A83.b = function (edgelayout) {
    if (edgelayout.i1() > 0) {
        var vector = new $List();
        for (var i = edgelayout.i1() - 1; i >= 0; i--)
            vector.add(edgelayout.i2(i));

        edgelayout.i5();
        for (var j = 0, n = vector.size(); j < n; j++) {
            var ypoint1 = vector.get(j);
            edgelayout.i4(ypoint1.x, ypoint1.y);
        }
    }
    var ypoint = edgelayout.i6();
    edgelayout.i8(edgelayout.i7());
    edgelayout.i9(ypoint);
};
$A83.c = function (layoutgraph) {
    $A83.d(layoutgraph, true);
};
$A83.d = function (layoutgraph, flag) {
    if (flag) {
        for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
            var edge = edgecursor.i8();
            layoutgraph.gt(edge, $A83._E);
            layoutgraph.gz(edge, $A83._E);
            layoutgraph.s5(edge, $A83._D);
        }
    } else {
        for (var edgecursor1 = layoutgraph.xf(); edgecursor1.i1(); edgecursor1.i2())
            layoutgraph.s5(edgecursor1.i8(), $A83._D);
    }
};
$A83.e = function (layoutgraph) {
    var ypoint = new $A00(0.0, 0.0);
    for (var edgecursor = layoutgraph.xf(); edgecursor.i1(); edgecursor.i2()) {
        var edge = edgecursor.i8();
        layoutgraph.gt(edge, ypoint);
        layoutgraph.gz(edge, ypoint);
    }
};
$A83.f = function (layoutgraph, edge, edge1, d) {
    var i = layoutgraph.gc(edge).b();
    var aypoint = $A53.d(i);
    var j = 0;
    for (var ycursor = layoutgraph.gc(edge).c(); ycursor.i1(); ycursor.i2()) {
        var ypoint2 = ycursor.i6();
        if (j <= 0 || !ypoint2.equals(aypoint[j - 1])) {
            aypoint[j] = new $A00(ypoint2.x, ypoint2.y);
            j++;
        }
    }

    i = j;
    if (i < 2)
        return;
    var vector = new $List();
    var yvector = new $A02(aypoint[1].x - aypoint[0].x, aypoint[1].y - aypoint[0].y);
    var yvector1 = $A83.i(yvector);
    yvector1.x *= d;
    yvector1.y *= d;
    var ypoint = $A83.h(aypoint[0], yvector1);
    var ypoint3 = $A83.h(aypoint[1], yvector1);
    var affineline = new $A04(ypoint, ypoint3);
    for (var k = 1; k < i - 1; k++) {
        var affineline1 = affineline;
        var yvector3 = $A83.i(new $A02(aypoint[k + 1].x - aypoint[k].x, aypoint[k + 1].y - aypoint[k].y));
        yvector3.x *= d;
        yvector3.y *= d;
        var ypoint4 = $A83.h(aypoint[k], yvector3);
        var ypoint5 = $A83.h(aypoint[k + 1], yvector3);
        affineline = new $A04(ypoint4, ypoint5);
        var ypoint6 = $A04.a6(affineline1, affineline);
        if (ypoint6 != null)
            vector.add(new $A00(ypoint6.x, ypoint6.y));
    }

    var yvector2 = new $A02(aypoint[i - 1].x - aypoint[i - 2].x, aypoint[i - 1].y - aypoint[i - 2].y);
    yvector2 = $A83.i(yvector2);
    yvector2.x *= d;
    yvector2.y *= d;
    var ypoint1 = $A83.h(aypoint[i - 1], yvector2);
    var ypointpath = new $A05(vector);
    if (edge.a2() === edge1.a2()) {
        layoutgraph.s5(edge1, ypointpath);
        layoutgraph.m2(edge1, ypoint, ypoint1);
    } else {
        layoutgraph.s5(edge1, ypointpath.a());
        layoutgraph.m2(edge1, ypoint1, ypoint);
    }
};
$A83.g = function (layoutgraph, edge, edgelist, d) {
    var d1 = d;
    for (var edgecursor = edgelist.c1(); edgecursor.i1(); edgecursor.i2()) {
        var edge1 = edgecursor.i8();
        $A83.f(layoutgraph, edge, edge1, d1);
        if (d1 < 0.0)
            d1 -= d;
        d1 = -d1;
    }
};
$A83.a = function (arectangle2d, rectangle2d, d) {
    return $A83.j(arectangle2d, rectangle2d, d, 1);
};
$A83.l = function (arectangle2d, rectangle2d, d) {
    if (arectangle2d == null || arectangle2d.length < 1) {
        if (rectangle2d != null) {
            rectangle2d.x = 0.0;
            rectangle2d.y = 0.0;
            rectangle2d.width = 0.0;
            rectangle2d.height = 0.0;
        }
        return { width: 0, height: 0 };
    }
    var d1 = 0.0;
    var d2 = 0.0;
    for (var i = 0; i < arectangle2d.length; i++) {
        var rectangle2d1 = arectangle2d[i];
        d1 = Math.max(d1, rectangle2d1.width);
        d2 = Math.max(d2, rectangle2d1.height);
    }

    var d3 = d1 * d2 * arectangle2d.length;
    var d4 = Math.sqrt(d3 / d);
    var d5 = d3 / d4;
    var j = Math.floor(d5 / d1);
    var k = Math.ceil(d5 / d1);
    var l = Math.ceil(arectangle2d.length / j);
    var i1 = Math.ceil(arectangle2d.length / k);
    var j1;
    var k1;
    if (j * l < k * i1) {
        j1 = j;
        k1 = l;
    } else {
        j1 = k;
        k1 = i1;
    }
    var l1 = 0;
    var i2 = 0;
    var d6 = 0.0;
    var d7 = 0.0;
    var are;
    if (d1 > d2) {
        for (var j2 = 0; j2 < arectangle2d.length; j2++) {
            are = arectangle2d[j2];
            are.x = i2 * d1;
            are.y = l1 * d2;
            d6 = Math.max(d6, are.x + are.width);
            d7 = Math.max(d7, are.y + are.height);
            if (++i2 >= j1) {
                l1++;
                i2 = 0;
            }
        }
    } else {
        for (var k2 = 0; k2 < arectangle2d.length; k2++) {
            are = arectangle2d[k2];
            are.x = i2 * d1;
            are.y = l1 * d2;
            d6 = Math.max(d6, are.x + are.width);
            d7 = Math.max(d7, are.y + are.height);
            if (++l1 >= k1) {
                i2++;
                l1 = 0;
            }
        }
    }
    if (rectangle2d != null) {
        rectangle2d.x = 0.0;
        rectangle2d.y = 0.0;
        rectangle2d.width = d6;
        rectangle2d.height = d7;
    }
    return { width: k1, height: j1 };
};
$A83.j = function (arectangle2d, rectangle2d, d, i) {
    if (arectangle2d == null || arectangle2d.length < 1) {
        if (rectangle2d != null) {
            rectangle2d.x = 0.0;
            rectangle2d.y = 0.0;
            rectangle2d.width = 0.0;
            rectangle2d.height = 0.0;
        }
        return 0;
    }
    var d2;
    var d1 = d2 = arectangle2d[0].width;
    var d4;
    var d3 = d4 = arectangle2d[0].height;
    var n = arectangle2d.length;
    for (var j = 1; j < n; j++) {
        var d5 = arectangle2d[j].width;
        d1 = Math.min(d1, d5);
        d2 = Math.max(d2, d5);
        var d6 = arectangle2d[j].height;
        d3 = Math.min(d3, d6);
        d4 = Math.max(d4, d6);
    }

    if (d3 / d4 > 0.94999999999999996 && d1 / d2 > 0.94999999999999996)
        return $A83.l(arectangle2d, rectangle2d, d).width;
    var ylist = new $A35();
    var k = 0;
    for (var l = 0; l < n; l++) {
        var rectangle2d1 = arectangle2d[l];
        ylist.aa(arectangle2d[l]);
        k = Math.floor(k + rectangle2d1.width * rectangle2d1.height);
    }

    ylist.a1(function (a, b) {
        var k2 = Math.floor(b.height) - Math.floor(a.height);
        if (k2 === 0)
            return Math.floor(b.width) - Math.floor(a.width);
        else
            return k2;
    });
    var d7 = 0.0;
    var d8 = 0.0;
    var i1 = Math.floor(d * Math.sqrt(k / d));
    var i2 = i1;
    var j2 = 0;
    var ylist1 = new $A35();
    do {
        var ylist2 = new $A35();
        ylist1.aa(ylist2);
        var j1;
        var k1;
        var l1 = j1 = k1 = 0;
        for (var ycursor = ylist.ah(); ycursor.i1(); ycursor.i2()) {
            var rectangle2d2 = ycursor.i6();
            if (l1 + rectangle2d2.width > i2 && ylist2.ay() > 0) {
                k1 = Math.max(k1, l1);
                ylist2 = new $A35();
                ylist2.aa(rectangle2d2);
                ylist1.aa(ylist2);
                l1 = Math.floor(rectangle2d2.width);
            } else {
                ylist2.aa(rectangle2d2);
                l1 = Math.floor(l1 + rectangle2d2.width);
            }
            if (ylist2.ay() === 1)
                j1 = Math.floor(j1 + ylist2.am().height);
        }

        k1 = Math.max(k1, l1);
        if (d * j1 > k1 && j2 !== k1) {
            ylist1.af();
            i2 = Math.floor(i2 * 1.1);
            j2 = k1;
        }
    } while (ylist1.ar());
    var d9 = 0.0;
    for (var ycursor1 = ylist1.ah(); ycursor1.i1(); ycursor1.i2()) {
        var d10 = 0.0;
        var ylist4 = ycursor1.i6();
        for (var ycursor5 = ylist4.ah(); ycursor5.i1(); ycursor5.i2()) {
            var rectangle2d3 = ycursor5.i6();
            rectangle2d3.x = d10;
            rectangle2d3.y = d9;
            d10 += rectangle2d3.width;
        }

        d7 = Math.max(d7, d10);
        d9 += $A83.k(ylist4);
        d8 = Math.max(d8, d9);
    }

    if (rectangle2d != null) {
        rectangle2d.x = 0.0;
        rectangle2d.y = 0.0;
        rectangle2d.width = d7;
        rectangle2d.height = d8;
    }
    return ylist1.ay();
};
$A83.k = function (ylist) {
    var d = 0.0;
    for (var ycursor = ylist.ah(); ycursor.i1(); ycursor.i2())
        d = Math.max(ycursor.i6().height, d);
    return d;
};
$A83.h = function (ypoint, yvector) {
    return new $A00(ypoint.x + yvector.x, ypoint.y + yvector.y);
};
$A83.i = function (yvector) {
    var d = Math.sqrt(yvector.x * yvector.x + yvector.y * yvector.y);
    return new $A02(-yvector.y / d, yvector.x / d);
};
