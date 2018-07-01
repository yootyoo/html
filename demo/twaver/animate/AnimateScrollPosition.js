twaver.animate.AnimateScrollPosition = function (view, newHorizontalOffset, newVerticalOffset) {
    this.view = view;
    this.oldHorizontalOffset = view.scrollLeft;
    this.oldVerticalOffset = view.scrollTop;
    this.newHorizontalOffset = newHorizontalOffset;
    this.newVerticalOffset = newVerticalOffset;
};
_twaver.ext('twaver.animate.AnimateScrollPosition', twaver.animate.Animate, {
    action: function (rate) {
        this.view.scrollLeft = this.oldHorizontalOffset + (this.newHorizontalOffset - this.oldHorizontalOffset) * rate;
        this.view.scrollTop = this.oldVerticalOffset + (this.newVerticalOffset - this.oldVerticalOffset) * rate;
    }
});
