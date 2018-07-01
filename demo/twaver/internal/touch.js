var $touch = {
    scrollLeft: function () {
        return $touch._filterResults(
		    window.pageXOffset ? window.pageXOffset : 0,
		    document.documentElement ? document.documentElement.scrollLeft : 0,
		    document.body ? document.body.scrollLeft : 0
	    );
    },
    scrollTop: function () {
        return $touch._filterResults(
		    window.pageYOffset ? window.pageYOffset : 0,
		    document.documentElement ? document.documentElement.scrollTop : 0,
		    document.body ? document.body.scrollTop : 0
	    );
    },
    _filterResults: function (n_win, n_docel, n_body) {
        var n_result = n_win ? n_win : 0;
        if (n_docel && (!n_result || (n_result > n_docel)))
            n_result = n_docel;
        return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
    },
    isSingleTouch: function (e) {
        return e.touches && e.touches.length == 1;
    },
    isMultiTouch: function (e) {
        return e.touches && e.touches.length > 1;
    },
    getDistance: function (e) {
        if (!$touch.isMultiTouch(e)) {
            return 0;
        }
        var t0 = e.touches[0];
        var t1 = e.touches[1];
        return Math.sqrt(
            Math.pow(t0.clientX - t1.clientX, 2) +
            Math.pow(t0.clientY - t1.clientY, 2)
        );
    }
};
_twaver.touch = $touch;
