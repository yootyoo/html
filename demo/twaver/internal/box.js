var $box = {
    findMoveToBottomDatas: function (sm, datas, children) {
        for (var i = 0; i < children.size(); i++) {
            var data = children.get(i);
            if (sm.contains(data)) {
                datas.add(data);
            }
        }
        for (i = 0; i < children.size(); i++) {
            data = children.get(i);
            $box.findMoveToBottomDatas(sm, datas, data.getChildren());
        }
    },
    findMoveToTopDatas: function (sm, datas, children) {
        for (var i = 0; i < children.size(); i++) {
            var data = children.get(children.size() - 1 - i);
            if (sm.contains(data)) {
                datas.add(data);
            }
        }
        for (i = 0; i < children.size(); i++) {
            data = children.get(i);
            $box.findMoveToTopDatas(sm, datas, data.getChildren());
        }
    },
    findMoveUpDatas: function (sm, datas, children) {
        var startToIterate = false;
        for (var i = 0; i < children.size(); i++) {
            var data = children.get(i);
            if (sm.contains(data)) {
                if (startToIterate) {
                    datas.add(data);
                }
            } else {
                startToIterate = true;
            }
        }
        for (i = 0; i < children.size(); i++) {
            data = children.get(i);
            $box.findMoveUpDatas(sm, datas, data.getChildren());
        }
    },
    findMoveDownDatas: function (sm, datas, children) {
        var startToIterate = false;
        for (var i = 0; i < children.size(); i++) {
            var data = children.get(children.size() - 1 - i);
            if (sm.contains(data)) {
                if (startToIterate) {
                    datas.add(data);
                }
            } else {
                startToIterate = true;
            }
        }
        for (i = 0; i < children.size(); i++) {
            data = children.get(i);
            $box.findMoveDownDatas(sm, datas, data.getChildren());
        }
    },
    doLayout: function (network, options) {
        options = options || {};
        options.type = options.type || 'round';
        options.animate = options.animate || true;
        options.elements = options.elements || new twaver.List();
        options.repulsion = options.repulsion || 1;
        options.expandGroup = options.expandGroup || false;
        //options.explicitXOffset = options.explicitXOffset || 'round';
        //options.explicitYOffset = options.explicitYOffset || 'round';
        var autoLayouter = new twaver.layout.AutoLayouter(network.getElementBox());
        autoLayouter.getElements = function () {
            
        };
    }
};
_twaver.box = $box;
