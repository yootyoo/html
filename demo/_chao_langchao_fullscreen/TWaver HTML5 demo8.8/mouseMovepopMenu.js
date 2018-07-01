//¶¨Òå×ó¼ü²Ëµ¥
		var leftMovePopupMenu = function(network){
      leftMovePopupMenu.superClass.constructor.apply(this, arguments);
    };

    twaver.Util.ext('leftMovePopupMenu', twaver.controls.PopupMenu, {
        setContextView: function (contextView) {
            this._contextView = contextView;
            var view = contextView.getView ? contextView.getView() : contextView;
              
	           	_twaver.html.addEventListener('mousemove', '_handleMouseMove', view, this);
     
        },
        _handleMouseMove:function(e){
            if (this.onMenuShowing(e) === true ) {
                this.show(e);
            }
            e.preventDefault();
        },      
        _handleBodyClicked:function(e){

        }
    });