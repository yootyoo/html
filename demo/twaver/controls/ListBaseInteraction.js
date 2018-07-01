twaver.controls.ListBaseInteraction = function (listBase) {
    this.listBase = listBase;
    this.view = listBase._view;

    var self = this;
    this.view.addEventListener('scroll', function (e) {
        self.handleScroll(e);
    }, false);
    this.view.addEventListener('mousedown', function (e) {
        self.handleMouseDown(e);
    }, false);
    this.view.addEventListener('keydown', function (e) {
        self.handleKeyDown(e);
    }, false);
};
_twaver.ext('twaver.controls.ListBaseInteraction', Object, {
    handleMouseDown: function (e) {
        var list = this.listBase;
        if (e.target === list._currentEditor || e.target.parentNode === list._currentEditor) {
            return;
        }
        list._handleClick(e);
    },
    handleKeyDown: function (e) {
        var list = this.listBase;
        if (list._currentEditor) {
            return;
        }
        if (_twaver.isCtrlDown(e) && e.keyCode == 65) {
            if (list.isKeyboardSelectEnabled() && list.selectAll().size() > 0) {
                list.fireInteractionEvent({
                    kind: 'selectAll'
                });
            }
            $html.preventDefault(e);
        } else if (e.keyCode == 46) {
            if (list.isKeyboardRemoveEnabled() && list.removeSelection()) {
                list.fireInteractionEvent({
                    kind: 'removeElement'
                });
            }
            $html.preventDefault(e);
        } else if (!list.isCheckMode() && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39)) {
            var data = list.getSelectionModel().getLastData();
            if (data) {
                if (e.keyCode === 38 || e.keyCode === 40) {
                    var datas = list.getRowDatas();
                    var index = list.getRowIndexByData(data);
                    if (index >= 0) {
                        if (e.keyCode === 38) {
                            if (index !== 0) {
                                data = datas.get(index - 1);
                                list.getSelectionModel().setSelection(data);
                            }
                        } else {
                            if (index !== datas.size() - 1) {
                                data = datas.get(index + 1);
                                list.getSelectionModel().setSelection(data);
                            }
                        }
                    }
                } else if (list.expand && (e.keyCode === 37 || e.keyCode === 39)) {
                    if (data.hasChildren()) {
                        if (e.keyCode === 37) {
                            list.collapse(data);
                        } else {
                            list.expand(data);
                        }
                    }
                }
            } else {
                if (list.getRowDatas().size() > 0) {
                    data = list.getRowDatas().get(0);
                    list.getSelectionModel().setSelection(data);
                }
            }
        } else {
            _twaver.showVersion(e);
        }
    },
    handleScroll: function (e) {
        this.listBase.invalidate();
    }
});
