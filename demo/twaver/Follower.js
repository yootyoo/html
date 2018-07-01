twaver.Follower = function (id) {
    this._isUpdatingFollower = false;
    this._isUpdatingLocation = false;
    twaver.Follower.superClass.constructor.call(this, id);
};
twaver.Follower.IS_INTERESTED_HOST_GRID_PROPERTY = {
    "location": 1,
    "width": 1,
    "height": 1,
    "S:grid.row.count": 1,
    "S:grid.column.count": 1,
    "S:grid.row.percents": 1,
    "S:grid.column.percents": 1,
    "S:grid.border": 1,
    "S:grid.border.left": 1,
    "S:grid.border.right": 1,
    "S:grid.border.top": 1,
    "S:grid.border.bottom": 1,
    "S:grid.padding": 1,
    "S:grid.padding.left": 1,
    "S:grid.padding.right": 1,
    "S:grid.padding.top": 1,
    "S:grid.padding.bottom": 1
};
twaver.Follower.IS_INTERESTED_FOLLOWER_STYLE = {
    "follower.row.index": 1,
    "follower.column.index": 1,
    "follower.row.span": 1,
    "follower.column.span": 1,
    "follower.padding": 1,
    "follower.padding.left": 1,
    "follower.padding.right": 1,
    "follower.padding.top": 1,
    "follower.padding.bottom": 1
};
_twaver.ext('twaver.Follower', $Node, {
    _host: null,
    getHost: function () {
        return this._host;
    },
    setHost: function (host) {
        if (this === host || this._host === host) {
            return;
        }
        var oldValue = this._host;
        if (oldValue) {
            oldValue._removeFollower(this);
        }
        this._host = host;
        if (this._host) {
            this._host._addFollower(this);
        }
        this.firePropertyChange("host", oldValue, host);
        this.onHostChanged(oldValue, host);
    },
    onStyleChanged: function (styleProp, oldValue, newValue) {
        twaver.Follower.superClass.onStyleChanged.call(this, styleProp, oldValue, newValue);
        if (twaver.Follower.IS_INTERESTED_FOLLOWER_STYLE[styleProp]) {
            this.updateFollower(null);
        }
    },
    setLocation: function () {
        if (this._isUpdatingLocation) {
            return;
        }
        this._isUpdatingLocation = true;
        twaver.Follower.superClass.setLocation.apply(this, arguments);
        this._isUpdatingLocation = false;
    },
    onHostChanged: function (oldHost, newHost) {
        this.updateFollower(null);
    },
    handleHostPropertyChange: function (e) {
        this.updateFollower(e);
    },
    updateFollower: function (e) {
        if (this._isUpdatingFollower || _twaver.isDeserializing) {
            return;
        }
        this._isUpdatingFollower = true;
        this.updateFollowerImpl(e);
        this._isUpdatingFollower = false;
    },
    updateFollowerImpl: function (e) {
        var grid = this.getHost();
        if (grid instanceof twaver.Grid) {
            if (!e || twaver.Follower.IS_INTERESTED_HOST_GRID_PROPERTY[e.property]) {
                var rowIndex = this.getStyle('follower.row.index');
                var columnIndex = this.getStyle('follower.column.index');
                var rect = grid.getCellRect(rowIndex, columnIndex);
                if (!rect) {
                    return;
                }
                var rowSpan = this.getStyle('follower.row.span');
                var columnSpan = this.getStyle('follower.column.span');
                if (rowSpan != 1 || columnSpan != 1) {
                    var rect2 = grid.getCellRect(rowIndex + rowSpan - 1, columnIndex + columnSpan - 1);
                    if (rect2) {
                        rect = $math.unionRect(rect, rect2);
                    }
                }
                $math.addPadding(rect, this, 'follower.padding');
                if (this.getStyle('follower.fill.cell')) {
                    this.setLocation(rect.x, rect.y);
                    this.setWidth(rect.width);
                    this.setHeight(rect.height);
                } else {
                    var position = this.getStyle('follower.cell.position');
                    rect = $position.get(position, rect, this.getRect());
                    this.setLocation(rect.x, rect.y);
                }
            }
        }
        else {
            if (e != null && e.property === "location") {
                var oldLocation = e.oldValue;
                var newLocation = e.newValue;
                var location = this.getLocation();
                this.setLocation(
									location.x + (newLocation.x - oldLocation.x),
									location.y + (newLocation.y - oldLocation.y));
            }
        }
    },
    isHostOn: function (node) {
        if (!node) {
            return false;
        }
        var dic = {};
        var tmpHost = this._host;
        while (tmpHost && tmpHost != this && !dic[tmpHost.getId()]) {
            if (tmpHost === node) {
                return true;
            } else {
                dic[tmpHost.getId()] = tmpHost;
                if (tmpHost instanceof twaver.Follower) {
                    tmpHost = tmpHost.getHost();
                } else {
                    tmpHost = null;
                }
            }
        }
        return false;
    },
    isLoopedHostOn: function (follower) {
        return this.isHostOn(follower) && follower.isHostOn(this);
    }
});