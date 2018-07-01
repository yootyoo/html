twaver.controls.ListBase = function (dataBox) {
    twaver.controls.ListBase.superClass.constructor.apply(this, arguments);
    this._invalidate = false;
    this._invalidateModel = false;
    this._invalidateDisplay = false;
    this._invalidateDatas = null;

    this._rowDatas = new $List();

    this._startRowIndex = 0;
    this._endRowIndex = 0;
    this._renderMap = {};
    this._dataRowMap = {};

    this.__divPool = new twaver.Pool('div', 20);
    this.__imagePool = new twaver.Pool('img', 20);
    this.__canvasPool = new twaver.Pool('canvas', 20);
    this.__spanPool = new twaver.Pool('span', 20);
    this.__textPool = new twaver.Pool('span', 20);
    this.__checkBoxPool = new twaver.Pool('input', 20);
    this.__linePool = new twaver.Pool('canvas',20);

    this._pools.add(this.__divPool);
    this._pools.add(this.__linePool);
    this._pools.add(this.__imagePool);
    this._pools.add(this.__canvasPool);
    this._pools.add(this.__spanPool);
    this._pools.add(this.__textPool);
    this._pools.add(this.__checkBoxPool);

    this._view = $html.createView('auto',true);
    this._rootDiv = $html.createDiv();
    this._dataDiv = $html.createDiv();
    this._dataDiv.style.width = "1px";

    this._view.appendChild(this._rootDiv);
    this._rootDiv.appendChild(this._dataDiv);

    this.setDataBox(dataBox ? dataBox : new twaver.DataBox());

    var self = this;
    if (self.handleChange) {
        self._view.addEventListener('change', function (e) {
            self.handleChange(e);
        }, false);
    }

    if ($ua.isMSToucheable) {
        new twaver.controls.ListBaseMSTouchInteraction(this);
    } else {
        new twaver.controls.ListBaseTouchInteraction(this);
        new twaver.controls.ListBaseInteraction(this);
    }
};
_twaver.ext('twaver.controls.ListBase', twaver.controls.View, {
    __bool: ['innerText'],
    _innerText: $Defaults.LISTBASE_INNER_TEXT,

    getDataDiv: function () {
        return this._dataDiv;
    },
    getStartRowIndex: function () {
        return this._startRowIndex;
    },
    getEndRowIndex: function () {
        return this._endRowIndex;
    },
    getRowDatas: function () {
        return this._rowDatas;
    },
    getRowIndexByData: function (data) {
        return this._dataRowMap[data.getId()];
    },
    getRowIndexById: function (id) {
        return this._dataRowMap[id];
    },
    getRowSize: function () {
        return this._rowDatas.size();
    },
    getDataBox: function () {
        return this._box;
    },
    setDataBox: function (dataBox) {
        if (!dataBox) {
            throw "DataBox can not be null";
        }
        if (this._box === dataBox) {
            return;
        }

        var oldValue = this._box;
        if (oldValue) {
            oldValue.removeDataBoxChangeListener(this.handleDataBoxChange, this);
            oldValue.removeDataPropertyChangeListener(this.handlePropertyChange, this);
            oldValue.removeHierarchyChangeListener(this.handleHierarchyChange, this);
            if (!this._selectionModel) {
                oldValue.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this);
            }
        }
        this._box = dataBox;

        this._box.addDataBoxChangeListener(this.handleDataBoxChange, this);
        this._box.addDataPropertyChangeListener(this.handlePropertyChange, this);
        this._box.addHierarchyChangeListener(this.handleHierarchyChange, this);
        if (this._selectionModel) {
            this._selectionModel._setDataBox(dataBox);
        } else {
            this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);
        }

        this.invalidateModel();

        this.firePropertyChange("dataBox", oldValue, this._box);
    },
    onPropertyChanged: function (e) {
        if (e.property === 'zoom') {
            this.invalidate();
        } else {
            this.invalidateModel();
        }
    },
    invalidateModel: function () {
        if (this._invalidateModel) {
            return;
        }
        this._invalidateModel = true;
        this._invalidateDisplay = true;
        this._invalidateDatas = null;
        this.invalidate();
    },
    invalidateDisplay: function () {
        if (this._invalidateDisplay) {
            return;
        }
        this._invalidateDisplay = true;
        this._invalidateDatas = null;
        this.invalidate();
    },
    invalidateData: function (data) {
        if (this._invalidateDisplay) {
            return;
        }
        if (!this._invalidateDatas) {
            this._invalidateDatas = {};
        }
        this._invalidateDatas[data.getId()] = data;
        this.invalidate();
    },
    validateImpl: function () {
        var oldLeft = this._view.scrollLeft;
        var oldTop = this._view.scrollTop;

        if (this._invalidateModel) {
            this._invalidateModel = false;
            this.validateModel();
        }
        if (this._invalidateDisplay) {
            this._invalidateDisplay = false;
            this._renderMap = {};
            $html.release(this._dataDiv);
            this._dataDiv.style.height = this.getRowSize() * this._rowHeight + 'px';
        }
        var id;
        if (this._invalidateDatas) {
            for (id in this._invalidateDatas) {
                var render = this._renderMap[id];
                if (render) {
                    $html.release(render);
                    this._dataDiv.removeChild(render);
                    delete this._renderMap[id];
                }
            }
            this._invalidateDatas = null;
        }

        var y = this._view.scrollTop / this._zoom;
        var h = this._view.clientHeight / this._zoom;
        this._startRowIndex = Math.floor(y / this._rowHeight) - 2;
        this._endRowIndex = Math.ceil((y + h) / this._rowHeight) + 2;

        if (this._startRowIndex < 0) this._startRowIndex = 0;
        if (this._endRowIndex > this._rowDatas.size()) this._endRowIndex = this._rowDatas.size();

        var lhpx = this._rowHeight - this._rowLineWidth - 2 + 'px';
        var lwpx = this._rowLineWidth + 'px';
        for (var i = this._startRowIndex; i < this._endRowIndex; i++) {
            var data = this._rowDatas.get(i);
            id = data.getId();
            var div = this._renderMap[id];
            if (!div) {
                div = this.__divPool.get();
                var style = div.style;
                style.position = 'absolute';
                style.whiteSpace = 'nowrap';
                style.lineHeight = lhpx;
                style.top = i * this._rowHeight + 'px';
                style.borderStyle = 'solid';
                style.borderWidth = '0px';
                style.borderBottomWidth = lwpx;
                style.borderBottomColor = this._rowLineColor;
                style.opacity = data.getStyle ? data.getStyle('whole.alpha') : 1;

                this._dataDiv.appendChild(div);
                this._renderMap[id] = div;
                var selected = this.isSelected(data);
                this.renderData(div, data, i, selected);
                this.onDataRendered(div, data, i, selected);
            }
        }

        _twaver.keys(this._renderMap).forEach(function (id) {
            var row = this.getRowIndexById(id);
            if (row < this._startRowIndex || row >= this._endRowIndex) {
                var render = this._renderMap[id];
                $html.release(render);
                this._dataDiv.removeChild(render);
                delete this._renderMap[id];
            }
        }, this);

        this._pools.forEach(function (pool) {
            pool.clear();
        });

        if (this._view.scrollLeft !== oldLeft) {
            this._view.scrollLeft = oldLeft;
        }
        if (this._view.scrollTop !== oldTop) {
            this._view.scrollTop = oldTop;
        }
        this.adjustRowSize();
        this.onValidated();
    },
    adjustRowSize: function () {
        var id, div;
        var hpx = this._rowHeight - this._rowLineWidth + 'px';
        var wpx = Math.floor((this._view.scrollLeft + this._view.clientWidth) / this._zoom) + 'px';
        for (id in this._renderMap) {
            div = this._renderMap[id];
            div.style.height = hpx;
            div.style.width = wpx;
        }
    },
    onValidated: function () {

    },
    onDataRendered: function (div, data, row, selected) {

    },
    _addCheckBox: function (div, data, selected) {
        var checkBox = this.__checkBoxPool.get();
        checkBox.keepDefault = true;
        checkBox.type = 'checkbox';
        checkBox.style.margin = '0px 2px';
        checkBox.style.verticalAlign = 'middle';
        checkBox._checkData = data;
        checkBox.checked = selected;
        checkBox.disabled = false;
        div.appendChild(checkBox);
        return checkBox;
    },
    _addIcon: function (div, data, icon, _selectData) {
        var imageAsset = _twaver.getImageAsset(icon);
        var innerColor = this.getInnerColor(data);
        var outerColor = this.getOuterColor(data);
        var alarmColor = this.getAlarmFillColor(data);
        var c;
        if (imageAsset && imageAsset.getImage()) {
            var w = imageAsset.getWidth();
            var h = imageAsset.getHeight();
            c = this.__canvasPool.get();
            c.style.verticalAlign = 'middle';
            c.setAttribute('width', w);
            c.setAttribute('height', h);
            var g = c.getContext('2d');
            g.clearRect(0, 0, w, h);
            var rect = {x:0, y: 0, width: w, height: h};
            drawImage(g, icon, innerColor, rect, data, this);
            if (outerColor) {
                g.lineWidth = 2;
                g.strokeStyle = outerColor;
                g.beginPath();
                g.rect(0, 0, w, h);
                g.closePath();
                g.stroke();
            }
            if (alarmColor) {
                g.fillStyle = $g.createRadialGradient(g, alarmColor, 'white', 1, h - 9, 8, 8, 0.75, 0.25);
                g.beginPath();
                g.arc(5, h - 5, 4, 0, Math.PI * 2, true);
                g.closePath();
                g.fill();
            }
        } else {
            c = this.__imagePool.get();
            c.style.verticalAlign = 'middle';
            c.setAttribute('src', _twaver.getImageSrc(icon));
        }
        c.style.margin = '0px 1px 0px 1px';
        c._selectData = _selectData;
        div.appendChild(c);
    },
    _addLine: function(span, data, icon, isLast){
        var c = this.__linePool.get();
        var imageAsset = _twaver.getImageAsset(icon);
        var self = this;
        var toggleImage = this.getToggleImage(data);
        var level = this._levelMap[data.getId()];
        var indent = this._indent;
        var w,h;
        var iW = indent,iH = indent;
        var xoffset = 0;
        var checkable = this.isCheckable(data);
        var disabled = this.getUncheckableStyle() === 'disabled';
        xoffset = 2;

        if(imageAsset){
            iW = imageAsset.getWidth();
            iH = imageAsset.getHeight();
        }

        if(isLast){
            w = (level+xoffset-1) * indent + iW;
            h = this.getRowHeight();
        }else{
            w = (level+xoffset-1) * indent + iW;
            h =  this.getRowHeight();
        }

        span.style.width = (level+xoffset-1)*indent + 'px';
        span.style.height = h + 'px';
        var lineStyle = this.getLineType();
        var lineColor = this.getLineColor();
        var lineAlpha = this.getLineAlpha();
        var lineWidth = this.getLineThickness();
        var lineDash = this.getLineDash();
        var imgSrc = _twaver.getImageSrc(toggleImage);
       
        c.style.verticalAlign = 'top';
        c.style.margin = '0px 0px 0px 0px';
        c.style.zIndex = -1;
        c.setAttribute('width', w);
        c.setAttribute('height', h);
        var g = c.getContext('2d');
        g.lineWidth = lineWidth;
        g.strokeStyle = lineColor;
        g.globalAlpha = lineAlpha;

        if(lineStyle === 'dotted'){
            g.setLineDash(lineDash);
        }

        var t = (level+xoffset)*2;
        if(isLast){
            var currentNode = data;
            var parent = currentNode.getParent();
            g.clearRect(0, 0, w, h);
            var rect = {x:0, y: 0, width: w, height: h};
            if(parent === null){
                if(data.getChildrenSize() !== 0){
                    if(this.isExpanded(data)){
                        g.moveTo((level+xoffset+1)*w/t,h/2+iH/2);
                        g.lineTo((level+xoffset+1)*w/t,h);
                        g.stroke();
                    }
                }
            }
            for(var i=level*2 -1;i >= 1;i-=2){
                 if(currentNode.getClient('isLast')){
                    currentNode = parent;
                    parent = currentNode.getParent();
                    if((i+1)/2 != level){
                        continue;
                    }
                }else{
                    currentNode = parent;
                    parent = currentNode.getParent();
                }

                if(i == level*2-1){
                    g.moveTo((i+xoffset)*w/t,0); 
                    g.lineTo((i+xoffset)*w/t,h/2); 
                    g.stroke(); 

                    g.moveTo((i+xoffset)*w/t,h/2);
                    g.lineTo((i+xoffset+1)*w/t,h/2);
                    g.stroke(); 
                    if(data.getChildrenSize() !== 0){
                        if(this.isExpanded(data)){
                            g.moveTo((i+xoffset+2)*w/t,h/2+iH/2);
                            g.lineTo((i+xoffset+2)*w/t,h);
                            g.stroke();
                        }
                    }
                }else{
                    g.moveTo((i+xoffset)*w/t,0); 
                    g.lineTo((i+xoffset)*w/t,h); 
                    g.stroke(); 
                }
            }
        }else{
            var currentNode = data;
            var parent = currentNode.getParent();
            g.clearRect(0, 0, w, h);
            var rect = {x:0, y: 0, width: w, height: h};
            for(var i=level*2 -1;i >= 1;i-=2){
                if(currentNode.getClient('isLast')){
                    currentNode = parent;
                    parent = currentNode.getParent();
                    if((i+1)/2 != level){
                        continue;
                    }
                }else{
                    currentNode = parent;
                    parent = currentNode.getParent();
                }
                g.moveTo((i+xoffset)*w/t,0); 
                g.lineTo((i+xoffset)*w/t,h); 
                g.stroke(); 
                if(i == level*2-1){
                    g.moveTo((i+xoffset)*w/t,h/2);
                    g.lineTo((i+xoffset+1)*w/t,h/2);
                    g.stroke();
                    if(data.getChildrenSize() !== 0){
                        if(this.isExpanded(data)){
                            g.moveTo((i+xoffset+2)*w/t,h/2+iH/2);
                            g.lineTo((i+xoffset+2)*w/t,h);
                            g.stroke();
                        }
                    }
                }
                
            }
        }
        span.appendChild(c);
        return c;
    },
    isVisible: function (data) {
        if (!this._box.contains(data)) {
            return false;
        }
        return this._visibleFunction ? this._visibleFunction(data) : true;
    },
    handleDataBoxChange: function (e) {
        this.invalidateModel();
    },
    handlePropertyChange: function (e) {
        if (e.property === 'parent') {
            this.invalidateModel();
        } else {
            this.invalidateData(e.source);
        }
    },
    handleHierarchyChange: function (e) {
        this.invalidateModel();
    },
    handleSelectionChange: function (e) {
        e.datas.forEach(function (data) {
            this.invalidateData(data);
        }, this);
        this.onSelectionChanged(e);
    },
    getRowIndexAt: function (e) {
        var point = this.getLogicalPoint(e);
        if (!point) {
            return -1;
        }
        var row = parseInt(point.y / this._rowHeight);
        return (row >= 0 && row < this._rowDatas.size()) ? row : -1;
    },
    getDataAt: function (e) {
        var row = this.getRowIndexAt(e);
        return row >= 0 ? this._rowDatas.get(row) : null;
    },
    getCurrentSortFunction: function () {
        return this._sortFunction;
    },
    validateModel: function () {
        this._rowDatas.clear();
        this._dataRowMap = {};
        this._buildChildren(this._box.getRoots());
        this._rowDatas = this._rowDatas.toList(this.isVisible, this);
        var sf = this.getCurrentSortFunction();
        if (sf) {
            this._rowDatas.sort(sf);
        }
        var size = this._rowDatas.size();
        for (var i = 0; i < size; i++) {
            this._dataRowMap[this._rowDatas.get(i).getId()] = i;
        }
    },
    _buildChildren: function (children) {
        children.forEach(function (data) {
            this._rowDatas.add(data);
            this._buildChildren(data.getChildren());
        }, this);
    },
    _handlePressSelection: function (data, e) {
        var sm = this.getSelectionModel();
        if (_twaver.isCtrlDown(e)) {
            if (sm.contains(data)) {
                sm.removeSelection(data);
            } else {
                sm.appendSelection(data);
            }
        } else if (e.shiftKey && sm.getLastData()) {
            var lastData = sm.getLastData();
            var startIndex = this.getRowIndexByData(lastData);
            var endIndex = this.getRowIndexByData(data);
            var selection = new $List();
            selection.add(this.getRowDatas().get(startIndex));
            while (startIndex !== endIndex) {
                startIndex += endIndex > startIndex ? +1 : -1;
                selection.add(this.getRowDatas().get(startIndex));
            }
            sm.setSelection(selection);
        } else {
            if (sm.size() !== 1 || !sm.contains(data)) {
                sm.setSelection(data);
            }
        }
        this.fireInteractionEvent({ kind: e.detail === 2 ? 'doubleClick' : 'click', data: data });
    },
    _handleClick: function (e) {
        if (this.isFocusOnClick()) {
            twaver.Util.setFocus(this._view);
        }
        var data = this.getDataAt(e);
        if (data) {
            if (this.isCheckMode() && !e.target._checkData) {
                var focusedRow = this.getRowIndexByData(data);
                if (this._focusedRow !== focusedRow) {
                  var oldData = this._rowDatas.get(this._focusedRow);
                  this._focusedRow = focusedRow;
                  oldData && this.invalidateData(oldData);
                  this.invalidateData(data);
                }
            }
            if (!this.isCheckMode()) {
                this._handlePressSelection(data, e);
            }
        }
        if (this._currentEditor) {
            this.commitEditValue(this._currentEditor._editInfo, this._currentEditor);
        }
        if (this.updateCurrentEditor) {
            var self = this;
            setTimeout(function () {
                self.updateCurrentEditor(e);
            }, 0);
        }
    },
    handleChange: function (e) {
        if (this._isCanceling || this._isValidating) {
            return;
        }
        var data = e.target._checkData;
        if (data) {
            var selected = this.isSelected(data);
            var sm = this.getSelectionModel();
            if (selected) {
                sm.removeSelection(data);
            } else {
                sm.appendSelection(data);
            }
        }
        if (e.target._editInfo && this.commitEditValue) {
            this.commitEditValue(e.target._editInfo, e.target);
        }
    },

    scrollToData: function (data) {
        if(!data) return;
        var row = this.getRowIndexById(data.getId());
        if (row < 0) {
            return;
        }
        var start = row * this._rowHeight * this._zoom;
        var end = start + this._rowHeight * this._zoom;
        var newScrollTop = this._view.scrollTop;
        if (this._view.scrollTop > start) {
            newScrollTop = start;
        }
        if (this._view.scrollTop + this._view.clientHeight < end) {
            newScrollTop = end - this._view.clientHeight;
        }
        if (this._view.scrollTop != newScrollTop) {
            this._view.scrollTop = newScrollTop;
            this.invalidate();
        }
    },
    makeVisible: function (data) {
        if (!this.isVisible(data)) {
            return;
        }
        if (this.expand) {
            this.expand(data);
        }
        _twaver.callLater(this.scrollToData, this, [data], $Defaults.CALL_LATER_DELAY * 2);
    },
    onSelectionChanged: function (e) {
        if (this._makeVisibleOnSelected) {
            if (e.kind === 'append' || e.kind === 'set' || e.kind === 'all') {
                if (this.expand) {
                    this.getSelectionModel().getSelection().forEach(function (d) {
                        if (d.getParent()) {
                            this.expand(d.getParent());
                        }
                    }, this);
                }
                _twaver.callLater(this.scrollToData, this, [this.getSelectionModel().getLastData()], $Defaults.CALL_LATER_DELAY * 2);
            }
        }
    },
    onShareSelectionModelChanged: function () {
        this.invalidateModel();
    }
});
