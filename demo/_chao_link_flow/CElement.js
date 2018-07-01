var CLinkUIX = function(network,element){
  CLinkUIX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CLinkUIX, twaver.canvas.LinkUI, {
  paintBody: function (ctx) {
    // CLinkUIX.superClass.paintBody.apply(this, arguments);
    var points = this.getLinkPoints();
    var width = this._element.getStyle('link.width');
    var color = this._element.getStyle('link.color');
    var pattern = this._element.getStyle('link.pattern');
    this.drawlLinePoints(ctx,points,width,color,pattern);
  },
  drawlLinePoints:function(g ,points, width, color, pattern){
    g.lineWidth = width;
        g.strokeStyle = color;

        /*
        g.beginPath();
        $g.drawLinePoints(g, points, pattern);
        g.stroke();
        */
        // if (this._element.getStyle("link.flow") === true && pattern && pattern.length > 1) {
            var dashedLine = new _twaver.DashedLine(g, pattern[0], pattern[1]);
            var offset = this._element.getClient("link.flow.offset");
            var mod = Math.floor(offset /(pattern[0] + pattern[1]));
            if (mod > 2) {
                offset = offset - (pattern[0] + pattern[1]) * mod;
            }
            
            if (this._element.getClient("link.flow.converse")) {
                if (offset < pattern[0]) {
                    dashedLine.overflow = pattern[0] - offset;
                } else if (offset >= pattern[0] && offset <= pattern[0] + pattern[1]) {
                    dashedLine.overflow = pattern[1] - (offset - pattern[0]);
                    if (dashedLine.overflow) { dashedLine.isLine = false };
                } else {
                    offset -= (pattern[0] + pattern[1]);
                    dashedLine.overflow = pattern[0] - offset;
                }
            } else {
                if (offset <= pattern[1]) {
                    dashedLine.overflow = offset;
                    if (offset) dashedLine.isLine = false;
                } else if (offset > pattern[1] && offset <= pattern[0] + pattern[1]) {
                    dashedLine.overflow = offset - pattern[1];
                } else {
                    offset -= (pattern[0] + pattern[1]);
                    if (offset) { dashedLine.isLine = false };
                    dashedLine.overflow = offset;
                }
            }

            // this._element._styleMap["link.flow.offset"] = offset;
            this._element.setClient("link.flow.offset",offset);
            // g.beginPath();
            // Xb._drawLine(points, g);
            // g.stroke();

            g.shadowColor = 'transparent';
            g.beginPath();
            var linkFlowColor = this._element.getClient("link.flow.color");
            g.strokeStyle = linkFlowColor;
            this._drawLine(points, dashedLine);
            g.stroke();
            g.shadowColor = this._shadowColor;
  },
  _drawLine:function(points, g){
    var pointIndex = 0, p0, p1, p2, s, value, pointCount = points.size();
    p0 = points.get(0);
    g.moveTo(p0.x, p0.y);
    for (pointIndex = 1; pointIndex < pointCount; pointIndex++) {
      value = points.get(pointIndex);
      if (value.size) {
            s = value.size();
            if (s === 2) {
                p0 = value.get(0);
                p1 = value.get(1);
                g.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
            } else if (s === 3) {
                p0 = value.get(0);
                p1 = value.get(1);
                p2 = value.get(2);
                g.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
            }
        } else {
            g.lineTo(value.x, value.y);
        }
    }
  }
});
var CLinkX = function(id,fromNode,toNode){
  CLinkX.superClass.constructor.apply(this, arguments);
};

twaver.Util.ext(CLinkX, twaver.Link, {
  getCanvasUIClass:function(){
    return CLinkUIX;
  }
});



