function LableLinkUI(network, element) {
    LableLinkUI.superClass.constructor.call(this, network, element);
}

twaver.Util.ext(LableLinkUI, twaver.network.LinkUI, {
    checkAttachments: function () {
        twaver.network.LinkUI.prototype.checkAttachments.call(this);
        this.checkChartAttachments();
    },
    checkChartAttachments:function(){
        var  fromLabelAttachment = new LinkFromLableAttachment(this);
        this.addAttachment(fromLabelAttachment);
        var  toLabelAttachment = new LinkToLableAttachment(this);
        this.addAttachment(toLabelAttachment);
    }
});

function LinkFromLableAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}

twaver.Util.ext(LinkFromLableAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        var link = this._element;

        this._contentDiv.innerHTML = link.getFromNode().getName();

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);

        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },

    getPosition:function(){
        return "from";
    },

    getXOffset:function(){
        var link =this._element;
        var from = link.getFromNode();
        if (from) {
            return from.getWidth()/1;
        }
        return 0;
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function LinkToLableAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(LinkToLableAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');

        var link = this._element;
        this._contentDiv.innerHTML = link.getToNode().getName();

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);

        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },

    getPosition:function(){
        return "to";
    },

    getXOffset:function(){
        var link =this._element;
        var from = link.getToNode();
        if (from) {
            return -from.getWidth()/1;
        }
        return 0;
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function LableLink(id,fromNode,toNode){
    LableLink.superClass.constructor.call(this,id,fromNode,toNode);
}

twaver.Util.ext(LableLink,twaver.Link,{
    getElementUIClass :function(){
        return LableLinkUI;
    }
});


dome = {
	init: function(){
		var box = new twaver.ElementBox();
		var node1 = new twaver.Node();
        node1.setName("node1");

		var node2 = new twaver.Node();
        node2.setName("node2");

        var link = new LableLink("link1",node1, node2);

		node1.setLocation(200, 100);
		node2.setLocation(300, 200);
		
		box.add(node1);
		box.add(node2);
		box.add(link);

		var network = new twaver.network.Network(box);
		document.body.appendChild(network.getView());
		network.getView().style.background = '#E9E9E9';
		network.adjustBounds({x: 10, y: 10, width: 500, height: 300});
	},
};

function attachment(){
	dome.init();
}