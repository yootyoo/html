twaver.canvas.HTMLAlarmAttachment = function(elementUI, showInAttachmentDiv) {
  twaver.canvas.HTMLAlarmAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
  this._triangleDiv = twaver.Util.createDiv();
  this._roundDiv = twaver.Util.createDiv();
  this._contentDiv = twaver.Util.createDiv();
  twaver.Util.setCSSStyle(this._triangleDiv, "border-style", "solid");
  twaver.Util.setCSSStyle(this._triangleDiv,'pointer-events','none');
  twaver.Util.setCSSStyle(this._contentDiv, "white-space", "nowrap");
  twaver.Util.setCSSStyle(this._contentDiv,'pointer-events','none');
  var self = this;
  this._network.getView().appendChild(this._roundDiv);
  this._roundDiv.appendChild(this._contentDiv);
};

_twaver.ext('twaver.canvas.HTMLAlarmAttachment', twaver.canvas.AlarmAttachment, {
  validate: function () {
    var font = this.getFont('alarm.font');
    var text = this._network.getAlarmLabel(this._element);
    this._contentDiv.innerHTML = text;
    this._contentDiv.style.visibility = 'hidden';
    twaver.canvas.HTMLAlarmAttachment.superClass.validate.call(this);
  },
  getContentWidth : function () {
    return this._contentDiv.scrollWidth || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "width"));
  },
  getContentHeight : function () {
    return this._contentDiv.scrollHeight || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "height"));
  },
  paint : function(ctx) {
    var fill = this.isFill();
    var outlineWidth = this.getOutlineWidth();
    var rect = this._contentRect;
    this.getElementUI().setShadow(this, ctx);

    if (outlineWidth > 0 || fill) {
     $g.drawRoundRect(ctx, rect.x, rect.y, rect.width, rect.height, this.getCornerRadius());
            if (this._pointers) {
             var pointers = this._pointers;
             ctx.moveTo(pointers[0].x, pointers[0].y);
             ctx.lineTo(pointers[1].x, pointers[1].y);
             ctx.lineTo(pointers[2].x, pointers[2].y);
           }
           ctx.closePath();

           if (outlineWidth > 0) {
            ctx.lineWidth = outlineWidth;
            ctx.strokeStyle = this.getOutlineColor();
            ctx.lineCap = this.getCap();
            ctx.lineJoin = this.getJoin();
            ctx.stroke();
          }
          if (fill) {
            var fillColor = this.getFillColor();
            var gradient = this.getGradient();
            if (gradient) {
              $g.fill(ctx, fillColor, gradient, this.getGradientColor(), this._viewRect);
            } else {
              ctx.fillStyle = fillColor;
            }
            ctx.fill();
          }
        }
        
    var font = this.getFont('alarm.font');
    var text = this._network.getAlarmLabel(this._element);
    var cx = this._network.getViewRect().x;
    var cy = this._network.getViewRect().y;
    var zoom = this._network.getZoom();
    var cl = {x: this._contentRect.x + this._contentRect.width/2 , y: this._contentRect.y + this._contentRect.height/2};
    var left = (cl.x * zoom - cx) - this._contentDiv.offsetWidth/2 * zoom + 'px';
    var top = (cl.y * zoom - cy) - this._contentDiv.offsetHeight/2  * zoom+ 'px';
    this._contentDiv.style.left =  left ;
    this._contentDiv.style.top =  top;
    this._contentDiv.style.setProperty("-webkit-transform", "scale("+ zoom +")", null);
    this._contentDiv.style.setProperty("-webkit-transform-origin", "0 0", null);

    if(this._network._debug){
      $g.strokeRect(ctx, this._contentRect, '#AAAAAB');
    }
    
    twaver.canvas.AlarmAttachment.superClass.paint.apply(this, arguments);
  },
  setVisibility: function(visibility){
    this._contentDiv.style.visibility = visibility;
  },
  dispose: function() {
    this._network.getView().removeChild(this._roundDiv);
  },
  getView: function () {
    return this._roundDiv;
  },
}); 