twaver.HTMLLink = function(id, from, to) {
    twaver.HTMLLink.superClass.constructor.call(this, id, from, to);
}
twaver.Util.ext('twaver.HTMLLink', twaver.Link, {
    getElementUIClass: function () {
        return twaver.network.HTMLLinkUI;
    },
    getCanvasUIClass : function() {
		return twaver.canvas.HTMLLinkUI;
	},
	getVectorUIClass : function() {
		return twaver.vector.HTMLLinkUI;
	},
});