twaver.controls.TablePane = function (table, tableHeader) {
    twaver.controls.TablePane.superClass.constructor.apply(this, arguments);
    this.invalidate();
    this._table = table;
    this._tableHeader = tableHeader ? tableHeader : new twaver.controls.TableHeader(table);
    this._view = $html.createView('hidden',true);
    this._view.tabIndex = -1;
    this._view.appendChild(this._tableHeader.getView());
    this._view.appendChild(this._table.getView());
    var self = this;
    this._tableHeader.addPropertyChangeListener(function (e) {
        if (e.property === 'height') {
            self.invalidate();
        }
    });
};
_twaver.ext('twaver.controls.TablePane', twaver.controls.ControlBase, {
    onPropertyChanged: function (e) {
        this.invalidate();
    },
    getTable: function () {
        return this._table;
    },
    getTableHeader: function () {
        return this._tableHeader;
    },
    validateImpl: function () {
        var w = this._view.offsetWidth;
        var h = this._view.offsetHeight;
        var hh = this._tableHeader.getHeight();

        this._tableHeader.adjustBounds({ x: 0, y: 0, width: w, height: hh });
        this._table.adjustBounds({ x: 0, y: hh, width: w, height: Math.max(0, h - hh) });
    }
});
