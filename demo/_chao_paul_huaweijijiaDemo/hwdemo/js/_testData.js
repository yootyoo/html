var Api = {
  //TOPO
  getTopoData: function (id, callback, scope) {
    callback.call(scope, topo[id]);
  },
  //NavigationTree
  getNavigationTreeData: function (id, callback, scope) {
    callback.call(scope, navigationTreeDataMap[id]);
  },
  searchNavigationTreeData: function (text, callback, scope) {
    callback.call(scope, navigationSearchDatas);
  },
  //CatalogTree
  getCatalogTreeData: function (id, callback, scope) {
    callback.call(scope, catalogTreeDatas);
  },
  //Rack states
  getRackStates: function (roomId, state, callback, scope) {
    callback.call(scope, rackStates);
  }
};
