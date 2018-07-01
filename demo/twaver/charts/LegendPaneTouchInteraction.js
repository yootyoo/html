twaver.charts.LegendPaneTouchInteraction = function (legendPane) {
    this.legendPane = legendPane;

    $html.addEventListener('touchstart', 'handleTouchstart', this.legendPane._legendDiv, this);
};
_twaver.ext('twaver.charts.LegendPaneTouchInteraction', Object, {
    handleTouchstart: function (e) {
        $html.preventDefault(e);

        var data = e.target._data;
        if (!data) {
            data = e.target.parentNode._data;
        }
        if (data) {
            if (this.legendPane._hiddenMap[data.getId()]) {
                delete this.legendPane._hiddenMap[data.getId()];
            } else {
                this.legendPane._hiddenMap[data.getId()] = data;
            }
            this.legendPane._chart.invalidateModel();
        }
    }
});
