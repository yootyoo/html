$extend.__tree = function (p, o) {
    p._rootVisible = true;
    p._initTree = function (dataBox) {
        this._rootData = null;
        this._expandMap = {};
        this._levelMap = {};
    };
    p.validateModel = function () {
        this._rowDatas.clear();
        this._levelMap = {};
        this._dataRowMap = {};

        this._currentLevel = 0;
        if (this._rootData) {
            if (this._rootVisible) {
                if (this.isVisible(this._rootData)) {
                    this._buildData(this._rootData);
                }
            } else {
                this._buildChildren(this._rootData);
            }
        } else {
            this._buildChildren();
        }
        delete this._currentLevel;
    };
    p._buildData = function (data) {
        this._dataRowMap[data.getId()] = this._rowDatas.size();
        this._rowDatas.add(data);
        this._levelMap[data.getId()] = this._currentLevel;
        if (this.isExpanded(data)) {
            this._currentLevel++;
            this._buildChildren(data);
            this._currentLevel--;
        }
    };
    p._buildChildren = function (parent) {
        var children = parent ? parent.getChildren() : this._box.getRoots();
        var sortFunc = this.getCurrentSortFunction();
        if (sortFunc && this.isChildrenSortable(parent)) {
            children.toList(this.isVisible, this).sort(sortFunc).forEach(function (data) {
                this._buildData(data);
            }, this);
        } else {
            children.forEach(function (data) {
                if (this.isVisible(data)) {
                    this._buildData(data);
                }
            }, this);
        }
    };
    p.getLevel = function (data) {
        return this._levelMap[data.getId()];
    };
    p.getToggleImage = function (data) {
        if (data.getChildrenSize() > 0) {
            return this.isExpanded(data) ? this._expandIcon : this._collapseIcon;
        }
        return null;
    };
    p.isCheckable = function (data) {
        return this.isCheckMode();
    };
    p.isCheckMode = function () {
        return $extend.__tree._checkMap[this._checkMode] === 1;
    };
    p.isChildrenSortable = function (parent) {
        return true;
    };
    p.handleDataBoxChange = function (e) {
        if (e.kind === 'remove') {
            delete this._expandMap[e.data.getId()];
        }
        else if (e.kind === 'clear') {
            this._expandMap = {};
        }
        this.invalidateModel();
    };
    p.isExpanded = function (data) {
        return this._expandMap[data.getId()] === 1;
    };
    p.expand = function (data) {
        if (this.isExpanded(data)) {
            return;
        }
        var parent = data.getParent();
        while (parent != null && parent !== this._rootData) {
            this._expandMap[parent.getId()] = 1;
            parent = parent.getParent();
        }
        this._expandMap[data.getId()] = 1;
        this.invalidateModel();
    };
    p.collapse = function (data) {
        if (!this.isExpanded(data)) {
            return;
        }
        delete this._expandMap[data.getId()];
        this.invalidateModel();
    };
    p.expandAll = function () {
        this._box.forEach(function (data) {
            this._expandMap[data.getId()] = 1;
        }, this);
        this.invalidateModel();
    };
    p.collapseAll = function () {
        this._expandMap = {};
        this.invalidateModel();
    };
    p._handleClick = function (e) {
        if (this.isFocusOnClick()) {
            twaver.Util.setFocus(this._view);
        }
        if (this._isValidating) {
            return;
        }
        var data;
        if (e.target._expandData) {
            data = e.target._expandData;
            if (this.isExpanded(data)) {
                this.collapse(data);
                this.fireInteractionEvent({ kind: 'collapse', data: data });
            } else {
                this.expand(data);
                this.fireInteractionEvent({ kind: 'expand', data: data });
            }
        } else if (e.target._selectData || e.target.parentNode._selectData) {
            this._handlePressSelection(e.target._selectData || e.target.parentNode._selectData, e);
            if (this.isCheckMode()) {
                var row = this.getRowIndexAt(e);
                if (row >= 0) {
                    this.__handleClick(e);
                }
            }
        } else if (this._treeColumn) {
            data = this.getDataAt(e);
            if (data) {
                if (this.isCheckMode()) {
                    if (!e.target._checkData) {
                        this.__handleClick(e);
                    }
                } else {
                    this._handlePressSelection(data, e);
                }
            }
        } else if (this.isCheckMode() && !e.target._checkData) {
            this.__handleClick(e);
        }
        if (this._currentEditor && !this._isCommitting) {
            this._isCommitting = true;
            this.commitEditValue(this._currentEditor._editInfo, this._currentEditor);
        }
        if (this.updateCurrentEditor) {
            var self = this;
            setTimeout(function () {
                self.updateCurrentEditor(e);
            }, 0);
        }
    };
    p.__handleClick = function (e) {
        var data = this.getDataAt(e);
        var focusedRow = this.getRowIndexByData(data);
        if (this._focusedRow !== focusedRow) {
          var oldData = this._rowDatas.get(this._focusedRow);
          this._focusedRow = focusedRow;
          oldData && this.invalidateData(oldData);
          this.invalidateData(data);
        }
    };
    p.handleChange = function (e) {
        if (this._isCommitting || this._isCanceling || this._isValidating) {
            return;
        }
        var data = e.target._checkData;
        if (data) {
            var selected = this.isSelected(data);
            var sm = this.getSelectionModel();
            var list;
            if (this._checkMode === 'default') {
                if (selected) {
                    sm.removeSelection(data);
                } else {
                    sm.appendSelection(data);
                }
            }
            else if (this._checkMode === 'children') {
                list = new $List(data);
                list.addAll(data.getChildren());
            }
            else if (this._checkMode === 'descendant') {
                list = new $List();
                _twaver.fillDescendant(data, list);
            }
            else if (this._checkMode === 'descendantAncestor') {
                list = new $List();
                _twaver.fillDescendant(data, list);
                if (!selected) {
                    var parent = data.getParent();
                    while (parent) {
                        list.add(parent);
                        parent = parent.getParent();
                    }
                }
            }
            if (selected) {
                sm.removeSelection(list);
            } else {
                sm.appendSelection(list);
            }
        }
        if (e.target._editInfo && this.commitEditValue) {
            this._isCommitting = true;
            this.commitEditValue(e.target._editInfo, e.target);
        }
    };
    p.onLabelRendered = function (span, data, label, row, level, selected) {

    };
    p._renderTree = function (div, data, row, selected) {
        var level = this._levelMap[data.getId()];
        var toggleImage = this.getToggleImage(data);
        var lineType = this.getLineType();
        var indent = this._indent;
        var span = this.__spanPool.get();
        if (toggleImage) {
            span.style.width = this._indent * level + 'px';
        } else {
            span.style.width = this._indent * (level + 1) + 'px';
        }
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.style.verticalAlign = 'top';
        span.style.margin = '0px 1px 0px 1px';
        span.style.width = (level+1)*indent + 'px';
        div.appendChild(span);

         // draw line
        var currentNode = data;
        var parentNode = currentNode.getParent();
        var levelsUp = 0;
        
        if(lineType === 'dotted' || lineType === 'solid'){
            if(parentNode == null){
                var icon = this.getIcon(data);
                this._addLine(span, data, icon, true);
            }
            while(parentNode !== null){
                var children = parentNode.getChildren();
                var isLast = currentNode === children.get(children.size() - 1);
                var icon = this.getIcon(currentNode);
                currentNode.setClient('isLast',isLast);
                if(levelsUp == 0){
                    this._addLine(span, data, icon, isLast);
                }
                levelsUp++;
                currentNode = parentNode;
                parentNode = parentNode.getParent();
            }
        }

        if (toggleImage) {
            var image = this.__imagePool.get();
            image.setAttribute('src', _twaver.getImageSrc(toggleImage));
            image.style.verticalAlign = 'middle';
            image._expandData = data;
            image.style.position = 'absolute';
            image.style.right = '0px';
            image.style.top = this.getRowHeight()/2 - image.height/2 +'px';
            span.appendChild(image);
        }

        var checkable = this.isCheckable(data);
        var disabled = this.getUncheckableStyle() === 'disabled';
        if (checkable || disabled) {
            var checkBox = this._addCheckBox(div, data, selected);
            checkBox.disabled = !checkable;
        }

        var icon = this.getIcon(data);
        if (icon) {
            var selectData = this.isCheckMode() || this._treeColumn ? null : data;
            this._addIcon(div, data, icon, selectData);
        }

        var label = this.getLabel(data);
        if (label) {
            span = this.__textPool.get();
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            _twaver.setText(span, label, this._treeColumn ? this._treeColumn.isInnerText() : this._innerText);
            if (!this.isCheckMode() && !this._treeColumn) {
                span._selectData = data;
                span.style.backgroundColor = selected ? this.getSelectColor(data) : '';
            } else if (this._focusedRow === row) {
                span.style.backgroundColor = this.getSelectColor(data);
            }
            this.onLabelRendered(span, data, label, row, level, selected);
            div.appendChild(span);
        }

    };
};
$extend.__tree._checkMap = {
    'default': 1,
    children: 1,
    descendant: 1,
    descendantAncestor: 1
};
