editor.ui.Dialog = function(title, buttons, params){
	var title = title || 'Dialog';
	this.dialog = $('<div id="export-message" title = "'+ title +'"></div>');
	this.content = $('<div class="inner" ></div>');
	this.dialog.append(this.content);
	this.buttons = buttons;
	this.params = params;
}


editor.ui.Dialog.prototype.setData = function(data){
	if(typeof(data) === "string"){
		this.content.html(data);
	}else{
		this.content.append(data);
	}
	
}

editor.ui.Dialog.prototype.getView = function(){
	return this.dialog;
}

editor.ui.Dialog.prototype.init = function(){
	if(!this.buttons){
		this.buttons = {
			Ok: function() {
				$( this ).dialog( "close" );
			},
		}
	}
	this.dialog.dialog({
		height: 300,
		width: 350,
		autoOpen: false,
		show: {
			effect: "fade",
		},
		hide: {
			effect: "fade",
		},
		modal: true,
		buttons: this.buttons,
	});
}

editor.ui.Dialog.prototype.show = function(){
	this.dialog.dialog( "open" );
}