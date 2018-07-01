twaver.charts.LegendPaneInteraction = function (legendPane) {
    this.legendPane = legendPane;

    var self = this;
    this.legendPane._legendDiv.addEventListener('mousedown', function (e) {
        self.handleMouseDown(e);
    }, false);
};
_twaver.ext('twaver.charts.LegendPaneInteraction', Object, {
    handleMouseDown: function (e) {
        if (e.button !== 0) {
            return;
        }
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
