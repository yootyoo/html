//¶¨Òå×ó¼ü²Ëµ¥
var leftPopupMenu = function(network){
      leftPopupMenu.superClass.constructor.apply(this, arguments);
    };

twaver.Util.ext('leftPopupMenu', twaver.controls.PopupMenu, {
        setContextView: function (contextView) {
            this._contextView = contextView;
            var view = contextView.getView ? contextView.getView() : contextView;
             
            _twaver.html.addEventListener('click', '_handleMouseDown', view, this);
	    
        },
        _handleMouseDown:function(e){
            if (this.onMenuShowing(e) === true ) {
                this.show(e);
            }
            e.preventDefault();
        },
        _handleBodyClicked:function(e){
        }
});
    
    