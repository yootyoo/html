var DxfViewer = function(elementBox, inverseColor) {
  var self = this;
  DxfViewer.superClass.constructor.call(self, elementBox);
  self.inverseColor = inverseColor;
  self.init();
  self.insertEntity = self.defaultInsertEntity;
  self.setEditInteractions();
  self.setZoomManager(new twaver.vector.LogicalZoomManager(self, true));
};
twaver.Util.ext(DxfViewer, twaver.vector.Network, {
  defaultInsertEntity: new dxf.InsertData(),
  init: function() {
    var self = this,
      view = self.getView();
    self.setToolTipEnabled(false);
    view.style.backgroundColor = self.inverseColor ? 'black' : 'white';
  },
  loadDxf: function(data) {
    var self = this;
    if (data instanceof File) {
      if (data.name.match(/\.dxf$/i)) {
        var reader = new FileReader();
        reader.onload = function(e) {
          self.loadDxf(e.target.result);
        };
        reader.readAsText(data);
      } else {
        alert('Only dxf file is supported');
      }
    } else {
      var parser = self.parser = new dxf.Dxf();
      parser.parse(data);
      self.loadData();
    }
  },
  loadData: function() {
    var self = this;
    self._box.clear();
    var layers = self.parser.sections.tables.layers;
    Object.keys(layers).forEach(function(layerName) {
      var layer = layers[layerName];
      var dummy = new twaver.Dummy(layerName);
      dummy.setName(layerName);
      self._box.add(dummy);
    });
    self.parser.sections.entities.forEach(function(entity) {
      self.addData(entity);
    });
    _twaver.callLater(self.zoomOverview, self);
    //console.log(self._box.size());
  },
  addData: function(entity) {
    var self = this,
      box = self._box;
    if (entity instanceof dxf.InsertData) {
      self.insertEntity = entity;
      self.parser.sections.blocks[entity.name].entities.forEach(function(entity) {
        self._addData(entity);
      });
      self.insertEntity = self.defaultInsertEntity;
    } else {
      self._addData(entity);
    }
  },
  _addData: function(entity) {
    var self = this,
      box = self._box,
      data;
    if (entity instanceof dxf.CircleData) {
      data = new twaver.Node();
      data.setStyle('body.type', 'vector');
      data.setStyle('vector.shape', 'circle');
      var size = self.translateSize(entity.radius) * 2;
      var point = self.translatePoint({
        x: entity.cx,
        y: entity.cy
      });
      data.setSize(size, size);
      data.setCenterLocation(point);
      data.setClient('type', 'Circle');
      box.add(data);
    } else if (entity instanceof dxf.EllipseData) {
      data = new twaver.Node();
      data.setStyle('body.type', 'vector');
      data.setStyle('vector.shape', 'oval');
      var width = self.translateSize(entity.mx);
      var height = self.translateSize(entity.my);
      var point = self.translatePoint({
        x: entity.cx,
        y: entity.cy
      });
      data.setSize(width, height);
      data.setCenterLocation(point);
      data.setClient('type', 'Ellipse');
      box.add(data);
    } else if (entity instanceof dxf.LineData) {
      data = new twaver.ShapeNode();
      data.setPoints(new twaver.List(
        self.translatePoint({
          x: entity.x1,
          y: entity.y1
        }),
        self.translatePoint({
          x: entity.x2,
          y: entity.y2
        })
      ));
      data.setClient('type', 'Line');
      box.add(data);
    } else if (entity instanceof dxf.PolylineData) {
      data = new twaver.ShapeNode();
      points = [];
      entity.points.forEach(function(vertex) {
        points.push(self.translatePoint(vertex));
      });
      if (entity.flags === 1) {
        points.push({
          x: points[0].x,
          y: points[0].y,
          bulge: points[0].bulge
        });
      }
      data.setPoints(new twaver.List(points));
      data.setClient('type', 'Polyline');
      box.add(data);
    } else {
      //console.log(entity);
      return false;
    }
    if (data) {
      data.setStyle('vector.outline.width', 1);
      var layer = self.parser.sections.tables.layers[entity.attrib.layer];
      var colorNumber = entity.attrib.color;
      colorNumber = layer && (colorNumber === 256 || colorNumber === undefined) ? layer.attrib.color : colorNumber;
      if (!self.inverseColor && (colorNumber === 7 || colorNumber === 255)) {
        colorNumber = 0;
      }
      data.setStyle('vector.outline.color', dxf.getColor(colorNumber));
      data.setStyle('vector.fill', false);
      data.setClient('entity', entity);
      data.setClient('parent', self.insertEntity);
      data.setParent(box.getDataById(entity.attrib.layer));
    }
    return true;
  },
  translatePoint: function(point) {
    var self = this;
    return {
      x: point.x * self.insertEntity.sx + self.insertEntity.ipx,
      y: -point.y * self.insertEntity.sy - self.insertEntity.ipy,
      bulge: point.bulge
    };
  },
  translateSize: function(value) {
    var self = this;
    return value * Math.abs(Math.max(self.insertEntity.sx, self.insertEntity.sy));
  },
});