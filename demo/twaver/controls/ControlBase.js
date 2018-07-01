twaver.controls.ControlBase = function () {
    twaver.controls.ControlBase.superClass.constructor.apply(this, arguments);
    this._pools = new $List();
};
_twaver.ext('twaver.controls.ControlBase', twaver.PropertyChangeDispatcher, {
    _autoAdjustBounds:false,
    addPool: function (pool) {
        if (!this._pools.contains(pool)) {
            this._pools.add(pool);
        }
    },
    removePool: function (pool) {
        this._pools.remove(pool);
    },

    adjustBounds: function (rect) {
        var style = this._view.style;
        style.position = 'absolute';
        style.left = rect.x + 'px';
        style.top = rect.y + 'px';
        style.width = rect.width + 'px';
        style.height = rect.height + 'px';
        if(this._autoAdjustBounds === true){
            style.left = '0px';
            style.top = '0px';
            style.right = '0px';
            style.bottom = '0px';
        }
        if (this.invalidate) {
            this.invalidate();
        }
    },

    setAutoAdjustBounds:function(autoAdjustBounds){
        if(autoAdjustBounds === true){
            $html.addEventListener("resize","_handleResize",window,this);
        }else{
            $html.removeEventListener("resize",window,this);
        }
        this._autoAdjustBounds = autoAdjustBounds;
    },
    isAutoAdjustBounds:function(){
        return this._autoAdjustBounds;
    },
    _handleResize: function(e){
        this.adjustBounds({x:0,y:0,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight});
    },

    getView: function () {
        return this._view;
    },
    invalidate: function (delay) {
        if (!this._invalidate) {
            this._invalidate = true;
            _twaver.callLater(this.validate, this, null, delay);
        }
    },
    validate: function () {
        if (!this._invalidate) {
            return;
        }
        this._invalidate = false;
        if (this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null) {
            if (this._reinvalidateCount === undefined) {
                this._reinvalidateCount = 100;
            }
            if (this._reinvalidateCount > 0) {
                this._reinvalidateCount--;
            } else {
                this._reinvalidateCount = null;
            }
            this.invalidate();
        } else {
            this.validateImpl();
        }
    },
    validateImpl: function () {
    }
});
