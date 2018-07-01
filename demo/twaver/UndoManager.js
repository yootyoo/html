var UndoManager = twaver.UndoManager = function (box) {
  var self = this;
  self._list = [];
  self._cursor = -1;
  self._suspended = false;
  self._dispatcher = new twaver.EventDispatcher();
  self._box = box;
  self._enabled = false;
  self._limit = 100;
};

UndoManager._IGNORE_PROPERTIES = {
  alarmState: 1,
  propagateSeverity: 1,
  enablePropagation: 1,
  children: 1,
  fromAgent: 1,
  toAgent: 1,
  bundleLinks: 1
};

_twaver.ext('twaver.UndoManager', Object, {
  setEnabled: function (enabled) {
    var self = this,
      box = self._box;
    if (self._enabled != enabled) {
      if (enabled) {
        box.addDataBoxChangeListener(self._handleDataBoxChange, self, true);
        box.addDataPropertyChangeListener(self._handleDataPropertyChange, self, true);
      } else {
        box.removeDataBoxChangeListener(self._handleDataBoxChange, self);
        box.removeDataPropertyChangeListener(self._handleDataPropertyChange, self);
      }
    }
    self._enabled = enabled;
  },
  isEnabled: function () {
    return this._enabled;
  },
  undo: function () {
    var self = this,
      list = self._list,
      action, i, c;
    if (!self.canUndo()) {
      return;
    }
    action = list[self._cursor--];
    self._suspended = true;
    if (action.length) {
      for (c = action.length, i = c - 1; i >= 0; i--) {
        action[i].undo();
      }
    } else {
      action.undo();
    }
    self._suspended = false;
    self._fire({
      kind: 'undo',
      action: action
    });
  },
  redo: function () {
    var self = this,
      list = self._list,
      action;
    if (!self.canRedo()) {
      return;
    }
    action = list[++self._cursor];
    self._suspended = true;
    if (action.length) {
      action.forEach(function (item) {
        item.redo();
      });
    } else {
      action.redo();
    }
    self._suspended = false;
    self._fire({
      kind: 'redo',
      action: action
    });
  },
  canUndo: function () {
    return this._cursor >= 0;
  },
  canRedo: function () {
    return this._cursor < this._list.length - 1;
  },
  _add: function (action) {
    var self = this,
      batch = self._batch,
      list = self._list;
    if (batch) {
      batch.push(action);
    } else {
      if (self._cursor !== list.length - 1) {
        list.splice(self._cursor + 1, list.length);
      }
      list.push(action);
      self._cursor = list.length - 1;
      self._fire({
        kind: 'add',
        action: action
      });
    }
  },
  _handleDataBoxChange: function (e) {
    if (this._suspended) {
      return;
    }
    var self = this,
      box = self._box,
      kind = e.kind,
      data = e.data;
    if (kind === 'add') {
      self._add({
        undo: function () {
          var self = this;
          self.parent = data.getParent();
          self.host = data.getHost && data.getHost();
          if (data.getFromNode) {
            self.fromNode = data.getFromNode();
            self.toNode = data.getToNode();
          }
          box.remove(data);
        },
        redo: function () {
          var self = this;
          self.parent && data.setParent(self.parent);
          data.getHost && self.host && data.setHost(self.host);
          if (data.getFromNode) {
            self.fromNode && data.setFromNode(self.fromNode);
            self.toNode && data.setToNode(self.toNode);
          }
          box.add(data);
        }
      });
    } else if (kind === 'remove') {
      self._add({
        undo: function () {
          box.add(data);
        },
        redo: function () {
          box.remove(data);
        }
      });
    }
  },
  _handleDataPropertyChange: function (e) {
    if (this._suspended) {
      return;
    }
    var self = this,
      property = e.property,
      prefix = property.substr(0, 2),
      data = e.source,
      oldValue = e.oldValue,
      newValue = e.newValue;
    if (prefix === 'C:') {
      property = property.substr(2);
      self._add({
        undo: function () {
          data.setClient(property, oldValue);
        },
        redo: function () {
          data.setClient(property, newValue);
        }
      });
    } else if (prefix === 'S:') {
      property = property.substr(2);
      self._add({
        undo: function () {
          data.setStyle(property, oldValue);
        },
        redo: function () {
          data.setStyle(property, newValue);
        }
      });
    } else {
      if (UndoManager._IGNORE_PROPERTIES[property]) {
        ;
      } else {
        self._add({
          undo: function () {
            data[_twaver.setter(property)](oldValue);
          },
          redo: function () {
            data[_twaver.setter(property)](newValue);
          }
        });
      }
    }
  },
  size: function () {
    return this._list.length;
  },
  getCursor: function () {
    return this._cursor;
  },
  _fire: function (e) {
    this._dispatcher.fire(e);
  },
  on: function (listener, scope, ahead) {
    this._dispatcher.add(listener, scope, ahead);
  },
  off: function (listener, scope) {
    this._dispatcher.remove(listener, scope);
  },
  isSuspended: function () {
    return this._suspended;
  },
  setSuspended: function (suspended) {
    this._suspended = suspended;
  },
  getLimit: function () {
    return this._limit;
  },
  setLimit: function (limit) {
    var self = this;
    if (limit > 0 & limit != self._limit) {
      if (limit < self._limit) {
        // todo
      }
      self._limit = limit;
    }
    return self;
  },
  clear: function () {
    var self = this;
    self._list = [];
    self._cursor = -1;
    self._fire({
      kind: 'clear'
    });
    return self;
  },
  batch: function (callback, scope) {
    var self = this;
    self.startBatch();
    callback.call(scope);
    self.endBatch();
    return self;
  },
  startBatch: function () {
    var self = this;
    if (!self._batch) {
      self._batch = [];
    }
    return self;
  },
  endBatch: function () {
    var self = this,
      batch;
    if (self._batch) {
      batch = self._batch;
      self._batch = null;
      batch.length && self._add(batch);
    }
    return self;
  }
});
