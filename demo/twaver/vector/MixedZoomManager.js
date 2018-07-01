twaver.vector.MixedZoomManager = function(network,sizeChange) {
	twaver.vector.MixedZoomManager.superClass.constructor.call(this, network,sizeChange);
};

_twaver.ext('twaver.vector.MixedZoomManager', twaver.vector.LogicalZoomManager, {});

(function mix() {
	var l = twaver.vector.LogicalZoomManager.prototype;
	var l2 = twaver.vector.PhysicalZoomManager.prototype;
	var m = twaver.vector.MixedZoomManager.prototype;

	for (var func in l2) {
		if (typeof l2[func] === 'function' && func != "constructor" && (l.hasOwnProperty(func) || l2.hasOwnProperty(func)) ) {
			mixedFunc(func);
		}
	}
	m._invalidateZoom = function() {
		this.network.invalidateElementUIs();
	};

	function mixedFunc(func) {
		m[func] = function() {
			if (this.getZoom() > 1) {
				return l[func].apply(this, arguments);
			} else {
				return l2[func].apply(this, arguments);
			}

		};
	}

})();

