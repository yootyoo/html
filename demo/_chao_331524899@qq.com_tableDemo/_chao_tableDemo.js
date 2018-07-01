SortFilterDemo = function () {
    this.box = new twaver.ElementBox();
    // twaver.controls.Table.prototype.isCheckMode= function() {
    //     return true;
    // };
    this.table = new twaver.controls.Table(this.box);
    this.checkColumn = null;
};
twaver.Util.ext('SortFilterDemo', Object, {
    init: function () {


        // this.appendChild(new twaver.controls.TablePane(this.table).getView(), document.getElementById('main'), 0, 0, 0, 0);

        this.initTable();

        this.initBox();

        var that = this;
        // this.table.prototype.isCheckMode= function() {
        //     // var tableDataMap = this._columnBox._dataMap;
        //     // for(var para in tableDataMap){
        //     //     if(tableDataMap[para] === that.checkColumn){
        //     //         return true;
        //     //     }
        //     // }
        //     // return false;
        //     return true;
        // };

        var tablePaneDOM = new twaver.controls.TablePane(this.table).getView();
        tablePaneDOM.style.width = "100%";
        tablePaneDOM.style.height = "100%";
        document.getElementById('main').appendChild(tablePaneDOM);
    },
    initTable: function () {
        this.table.setEditable(true);
        this.table.setRowHeight(36);
        this.createColumn(this.table, 'State', 'STATE_NAME', 'client').setWidth(150);
        this.createColumn(this.table, 'Employed', 'EMPLOYED', 'client', 'int', true).setWidth(150);
        this.createColumn(this.table, 'Unemploy', 'UNEMPLOY', 'client', 'int', true).setWidth(150);
        var maleColumn = this.createColumn(this.table, 'Male', 'MALE', 'client', 'int', true);
        maleColumn.setWidth(150);
        this.createColumn(this.table, 'Female', 'FEMALE', 'client', 'int', true).setWidth(150);
        this.table._checkColumn.renderHeader = function (div) {
            var span = document.createElement('span');
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = this.getName() ? this.getName() : this.getPropertyName();
            span.setAttribute('title', span.innerHTML);
            span.style.font = 'bold 12px Helvetica';
            div.style.textAlign = 'center';
            div.appendChild(span);
        };
        this.table._checkColumn.setWidth(150);
        this.table.getColumnBox().add(this.table._checkColumn);

        maleColumn.renderCell = function(params){
            var id = params.value;
            var aTag = document.createElement('input');
            aTag.style.marginLeft = "10%";
            aTag.type="button";
            aTag.value="show";


            // aTag.className = 'tableEdit';
            aTag.onclick = function(){
                if(this.value = "show"){
                    this.value = "male";
                }
            };
            params.div.appendChild(aTag);

        }
    },
    initBox: function () {
        var xml = document.getElementsByTagName("noscript")[0].innerText;
        xml = this.loadXmlString(xml).documentElement;
        var datas = xml.getElementsByTagName('f');

        var IS_INTERESTED_ATTRIBUTE =
		{
		    EMPLOYED: true,
		    UNEMPLOY: true,
		    MALE: true,
		    FEMALE: true,
		    STATE_NAME: true,
		    STATE_ABBR: true
		};

        for (var i = 0, count = datas.length; i < count; i++) {
            var features = datas[i];
            var node = new twaver.Node();

            var j, l, key, value, attribute;
            var attributes = features.getElementsByTagName('a');
            for (j = 0, l = attributes.length; j < l; j++) {
                attribute = attributes[j];
                key = attribute.getAttribute('n');
                if (IS_INTERESTED_ATTRIBUTE[key]) {
                    value = attribute.getAttribute('v');
                    if (key != "STATE_NAME" && key != "STATE_ABBR" && key != 'SUB_REGION') {
                        value = parseFloat(value);
                    }
                    node.setClient(key, value);
                }
            }
            this.box.add(node);
        }
    },

    createColumn: function (table, name, propertyName, propertyType, valueType, editable) {
        var column = new twaver.Column(name);
        column.setName(name);
        column.setPropertyName(propertyName);
        column.setPropertyType(propertyType);
        if (valueType) column.setValueType(valueType);
        column.setEditable(editable);
        column.renderHeader = function (div) {
            var span = document.createElement('span');
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = this.getName() ? this.getName() : this.getPropertyName();
            span.setAttribute('title', span.innerHTML);
            span.style.font = 'bold 12px Helvetica';
            div.style.textAlign = 'center';
            div.appendChild(span);
        };
        table.getColumnBox().add(column);
        return column;
    },
    loadXmlString: function (xml) {
        var xmlDoc;
        if (!twaver.Util.isIE && window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, 'text/xml');
        } else {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        }
        return xmlDoc;
    },
    // appendChild: function (e, parent, top, right, bottom, left) {
    //     e.style.position = 'absolute';
    //     if (left != null) e.style.left = left + 'px';
    //     if (top != null) e.style.top = top + 'px';
    //     if (right != null) e.style.right = right + 'px';
    //     if (bottom != null) e.style.bottom = bottom + 'px';
    //     parent.appendChild(e);
    // }
});