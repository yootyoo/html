var CatalogTree = function (box) {
  CatalogTree.superClass.constructor.call(this, box);
  Util.registerNormalImage('./images/tree_expand_collapse/expand.png', 'expand', this);
  Util.registerNormalImage('./images/tree_expand_collapse/collapse.png', 'collapse', this);
  this.init();
};

twaver.Util.ext(CatalogTree, twaver.controls.Tree, {
  init: function () {
    this.setExpandIcon('expand');
    this.setCollapseIcon('collapse');

    this.setVisibleFunction(function (data) {
      if (this._filterList) {
        return this._filterList.contains(data);
      }
      return true;
    });
  },
  getRootDatas: function () {
    Api.getCatalogTreeData('', this.setDatas, this);
  },
  setDatas: function (datas) {
    var self = this;
    var box = this.getDataBox();
    datas.forEach(function (data) {
      var node = new twaver.Node(data.name);
      node.setName(data.name);
      Util.registerNormalImage(data.ico, data.ico, self);
      node.setIcon(data.ico);
      node.setClient('data', data);
      node._dragImage = new Image();
      var isBack = make.Default.getCreator('twaver.idc.' + data.type + '.back.panel.loader');
      node._dragImage.src = 'model/idc/icons/device/' + data.type + (isBack ? '.back' : '') + '_front.png';
      box.add(node);
    });
    datas.forEach(function (data) {
      var parentNode = box.getDataById(data.parentName);
      var node = box.getDataById(data.name);
      node.setParent(parentNode);
    });
    this.expandAll();
  },
  onDataRendered: function (div, data, row, selected) {
    var self = this;
    if (div.getAttribute('draggable') != 'true') {
      div.setAttribute('draggable', 'true');
      div.addEventListener('dragstart', function (e) {
        var data = self.getDataAt(e);
        self._type = data.getClient('data').type;
        self.getSelectionModel().setSelection(data);
        e.dataTransfer.setData('Text', data.getClient('data').type);
        if (e.dataTransfer.setDragImage) {
          e.dataTransfer.setDragImage(data._dragImage, data._dragImage.width / 2, data._dragImage.height / 2);
        }
      });
    }
  },
  filterCatalog: function (text) {
    if (!text) {
      this._filterList = null;
    } else {
      this._filterList = this.getDataBox().getDatas().toList(function (data) {
        return data.getName().toLowerCase().indexOf(text) >= 0;
      });
      this._filterList.toList().forEach(function (data) {
        while (data = data.getParent()) {
          this._filterList.add(data);
        }
      }, this);
    }
    this.invalidateModel();
  }
});
