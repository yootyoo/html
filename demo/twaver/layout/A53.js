var $A53 = {};
$A53.a = function (c, d) {
    var result = [];
    for (var i = 0; i < c; i++)
        result[i] = d || 0;
    return result;
};
$A53.b = function (c) {
    var result = [];
    for (var i = 0; i < c; i++)
        result[i] = false;
    return result;
};
$A53.c = function (a, b) {
    if (a instanceof $A00) {
        if (a.x < b.x)
            return -1;
        if (a.x > b.x)
            return 1;
        if (a.y < b.y)
            return -1;
        return a.y <= b.y ? 0 : 1;
    } else if (a instanceof $A01) {
        if (b.width > a.width)
            return -1;
        if (b.width < a.width)
            return 1;
        if (b.height > a.height)
            return -1;
        return b.height >= a.height ? 0 : 1;
    } else if (a instanceof $A03) {
        if (a.x < b.x)
            return -1;
        if (a.x > b.x)
            return 1;
        if (a.y < b.y)
            return -1;
        if (a.y > b.y)
            return 1;
        if (b.width > a.width)
            return -1;
        if (b.width < a.width)
            return 1;
        if (b.height > a.height)
            return -1;
        return b.height >= a.height ? 0 : 1;
    } else {
        throw 'Unkown Type: ' + a;
    }
};
$A53.d = function (c) {
    var result = [];
    for (var i = 0; i < c; i++)
        result[i] = null;
    return result;
};
$A53.e = function (a, b) {
    var result = [];
    for (var i = 0; i < a; i++)
        result[i] = $A53.a(b);
    return result;
};
$A53.f = function (src, dest, length) {
    for (var i = 0; i < length; i++)
        dest[i] = src[i];
};
$A53.s = function (src, length, compare) {
    var dest = [];
    $A53.f(src, dest, length);
    dest.sort(compare);
    $A53.f(dest, src, length);
};
$A53.n = function (a, b) {
    return a - b;
};
