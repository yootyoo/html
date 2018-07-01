var NavigationTree = function (box) {
  NavigationTree.superClass.constructor.call(this, box);
  Util.registerNormalImage('./images/tree_expand_collapse/expand.png', 'expand', this);
  Util.registerNormalImage('./images/tree_expand_collapse/collapse.png', 'collapse', this);
  this.init();
};

twaver.Util.ext(NavigationTree, twaver.controls.Tree, {
  init: function () {
    this.addInteractionListener(this.interactionHandler, this);
  },
  interactionHandler: function (e) {
    if (e.kind === "click") {
      var element = e.data;
      if (element.getName().indexOf('rack') !== -1) {
        network.getRackData([element.getId()]);
      } else {
        network.setRootElement(element.getId());
      }
    }
  },
  getToggleImage: function (data) {
    if (data.getClient('isLeaf')) {
      return null;
    }
    return this.isExpanded(data) ? 'expand' : 'collapse';
  },
  setDatas: function (datas, parent) {
    if (!datas) {
      return;
    }
    var box = this.getDataBox();
    var self = this;
    datas.forEach(function (data) {
      var node = new twaver.Node(data.domainDn);
      node.setName(data.domainName);
      Util.registerNormalImage(data.ico, data.ico, self);
      node.setIcon(data.ico);
      node.setClient('isLeaf', data.isLeaf);
      parent && node.setParent(parent);
      box.add(node);
    });
    !parent && datas.forEach(function (data) {
      var parentNode = box.getDataById(data.parentDn);
      var node = box.getDataById(data.domainDn);
      parentNode && parentNode.setClient('loaded', true);
      node.setParent(parentNode);
    });
  },
  getRootDatas: function () {
    Api.getNavigationTreeData('', function (datas) {
      this.setDatas(datas);
      this.expand(this.getDataBox().getRoots().get(0));
    }, this);
  },
  filterNavigation: function (text) {
    this.getDataBox().clear();
    if (text) {
      Api.searchNavigationTreeData(text, function (datas) {
        this.setDatas(datas);
        this.expand(this.getDataBox().getRoots().get(0));
      }, this);
    } else {
      this.getRootDatas();
    }
  },
  expand: function (node) {
    NavigationTree.superClass.expand.call(this, node);
    var box = this.getDataBox();
    if (!node.getClient('loaded')) {
      node.setClient('loaded', true);
      Api.getNavigationTreeData(node.getId(), function (datas) {
        this.setDatas(datas, node);
      }, this);
    }
  }
});
