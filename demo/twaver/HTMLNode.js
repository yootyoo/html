var $HTMLNode = function(id) {
	$HTMLNode.superClass.constructor.call(this, id);
};

twaver.HTMLNode = $HTMLNode;

_twaver.ext('twaver.HTMLNode', twaver.Node, {
	getElementUIClass : function() {
		return twaver.network.HTMLNodeUI;
	},
	getCanvasUIClass : function() {
		return twaver.canvas.HTMLNodeUI;
	},
	getVectorUIClass : function() {
		return twaver.vector.HTMLNodeUI;
	},
});

