var $ua = (function () {
    var o = {}
    var u = navigator.userAgent.toLowerCase();
    o.isOpera = (/opera/).test(u);
    o.isIE = (/msie/).test(u) || /trident/.test(u) || /edge/.test(u);
    o.isFirefox = (/firefox/i).test(u);
    o.isChrome = (/chrome/i).test(u);
    o.isSafari = !o.isChrome && (/safari/i).test(u);
    o.isIPhone = (/iphone/).test(u);
    o.isIPod = (/ipod/).test(u);
    o.isIPad = (/ipad/).test(u);
    o.isAndroid = (/android/i).test(u);
    o.isWebOS = (/webos/i).test(u);
    o.isMSToucheable = o.isIE && ((navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
    o.isTouchable = ("ontouchend" in document) || o.isMSToucheable;
    return o;
})();
_twaver.ua = $ua;

