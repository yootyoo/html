twaver.animate.AnimateBounds = function (node, newBounds, finishFunction) {
    this.node = node;
    this.newBounds = newBounds;
    this.oldBounds = node.getRect();
    this.finishFunction = finishFunction;
};
_twaver.ext('twaver.animate.AnimateBounds', twaver.animate.Animate, {
    shouldBeFinished: true,
    action: function (rate) {
        var o = this.oldBounds;
        var n = this.newBounds;
        this.node.setLocation(
					o.x + (n.x - o.x) * rate,
					o.y + (n.y - o.y) * rate);
        this.node.setSize(
					o.width + (n.width - o.width) * rate,
					o.height + (n.height - o.height) * rate);
    }
});
