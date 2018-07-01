var demo = {};
// 自定义Node构造函数
demo.ScaleNode = function(id) {
    // 调用基类构造函数
  demo.ScaleNode.superClass.constructor.call(this, id);
};
// 设置自定义Node继承twaver.Node
twaver.Util.ext('demo.ScaleNode', twaver.Node, {
  getCanvasUIClass: function () {
    return demo.ScaleNodeUI;
  }
});

// 自定义NodeUI构造函数
demo.ScaleNodeUI = function(network, element){
    // 调用基类构造函数
    demo.ScaleNodeUI.superClass.constructor.call(this, network, element);
};
// 设置自定义NodeUI继承twaver.canvas.NodeUI
twaver.Util.ext('demo.ScaleNodeUI', twaver.canvas.NodeUI, {
    // 重载画网元方法，画上层链路
    paintBody: function (ctx) {
      demo.ScaleNodeUI.superClass.paintBody.call(this, ctx);
      var result = this.getAttachedLinks();
      if (!result) {
        return;
      }
      for (var position in result) {
        this.paintLink(ctx, result[position], position);
      }
    },
    // 画链路
    paintLink: function (ctx, links, position) {
      var center = this.getElement().getCenterLocation(),
        count = links.length,
        half = count / 2,
        network = this.getNetwork(),
        gap = (count - 1) * -10,
        terminal, link, i, offset, shortenLength, angle, tempCenter, textWidth, textHeight = 20, textCenter;
      for (i=0; i<count; i++) {
        link = links[i];
        offset = link.getStyle('link.bundle.offset');
        shortenLength = link.getClient('shortenLength');
        textWidth = ctx.measureText(link.getName()).width;
        if (position === 'left') {
          terminal = {x: center.x - offset - shortenLength, y: center.y + gap};
          tempCenter = {x: center.x - offset, y: center.y + gap};
          textCenter = {x: terminal.x - textWidth/2 - 10, y: terminal.y};
          angle = Math.PI/2;
        } else if (position === 'right') {
          terminal = {x: center.x + offset + shortenLength, y: center.y + gap};
          tempCenter = {x: center.x + offset, y: center.y + gap};
          textCenter = {x: terminal.x + textWidth/2 + 10, y: terminal.y};
          angle = Math.PI/2;
        } else if (position === 'top') {
          terminal = {x: center.x + gap, y: center.y - offset - shortenLength};
          tempCenter = {x: center.x + gap, y: center.y - offset};
          textCenter = {x: terminal.x, y: terminal.y - 10};
          angle = 0;
        } else {
          terminal = {x: center.x + gap, y: center.y + offset + shortenLength};
          tempCenter = {x: center.x + gap, y: center.y + offset};
          textCenter = {x: terminal.x, y: terminal.y + 10};
          angle = 0;
        }
        gap += 20;
        var isFrom = link.getFromNode() === this.getElement(),
          points;
        if (isFrom) {
          points = new twaver.List([tempCenter, terminal]);
        } else {
          points = new twaver.List([terminal, tempCenter]);
        }
        network.getElementUI(link)._paintBody(ctx, points, angle);
        
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      // 另一端节点标签
      var name = isFrom ? link.getToNode().getName() : link.getFromNode().getName();
      ctx.fillText(name, textCenter.x, textCenter.y);
      textCenter = {x: (tempCenter.x + terminal.x)/2, y: (tempCenter.y + terminal.y)/2};
      // Link标签
      ctx.fillText(link.getName(), textCenter.x, textCenter.y);
        
      // 画起始箭头
      if (link.getClient('arrow.from')) {
          twaver.Util.drawArrow(ctx, 12, 9, points, true, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
            }
        // 画结束箭头
            if (link.getClient('arrow.to')) {
          twaver.Util.drawArrow(ctx, 12, 9, points, false, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
            }
      }
    },
    // 获取不同方位的上层链路集合
  getAttachedLinks: function () {
    var currentSubNetwork = this.getNetwork().getCurrentSubNetwork();
    if (!currentSubNetwork || !this.getElement().getLinks()) {
      return null;
    }
    var result;
    this.getElement().getLinks().forEach(function (link) {
      var fromSubNetwork = twaver.Util.getSubNetwork(link.getFromNode()),
        toSubNetwork = twaver.Util.getSubNetwork(link.getToNode());
      if (fromSubNetwork !== toSubNetwork) {
        if (!result) {
          result = {};
        }
        var fromCenter = link.getFromNode().getCenterLocation(),
          toCenter = link.getToNode().getCenterLocation(),
          angle = getAngle(fromCenter, toCenter),
          isOut = currentSubNetwork === fromSubNetwork,
          position;
        if (isOut) {
          if (fromCenter.x <= toCenter.x) {
            if (angle >= -Math.PI/4 && angle <= Math.PI/4) {
              position = 'right';
            } else if (angle > Math.PI/4) {
              position = 'bottom';
            } else {
              position = 'top';
            }
          } else {
            if (angle >= -Math.PI/4 && angle <= Math.PI/4) {
              position = 'left';
            } else if (angle > Math.PI/4) {
              position = 'top';
            } else {
              position = 'bottom';
            }
          }
        } else {
          if (fromCenter.x <= toCenter.x) {
            if (angle >= -Math.PI/4 && angle <= Math.PI/4) {
              position = 'left';
            } else if (angle > Math.PI/4) {
              position = 'top';
            } else {
              position = 'bottom';
            }
          } else {
            if (angle >= -Math.PI/4 && angle <= Math.PI/4) {
              position = 'right';
            } else if (angle > Math.PI/4) {
              position = 'bottom';
            } else {
              position = 'top';
            }
          }
        }
        if (!result[position]) {
          result[position] = [];
        }
        result[position].push(link);
      }
    });
    return result;
  }
});

// 自定义Link构造函数
demo.ScaleLink = function(id, from, to) {
    // 调用基类构造函数
    demo.ScaleLink.superClass.constructor.call(this, id, from, to);
    // 设置链路宽度为10个像素
    this.setStyle('link.width', 10);
    //this.setStyle('link.color', 'rgba(0, 0, 0, 0)');
    // 设置Link类型为平行
    this.setStyle('link.type', 'parallel');
    // 设置链路捆绑的间距为40
    this.setStyle('link.bundle.offset', 40);
    // 设置刻度颜色
    this.setClient('scaleColor', 'black');
    // 设置刻度宽度
    this.setClient('scaleWidth', 1);
    // 设置刻度个数
    this.setClient('scaleNumbers', 4);
    // 设置是否变短
    this.setClient('shortened', false);
    // 设置变短后的长度
    this.setClient('shortenLength', 100);
    // 设置分割线颜色
    this.setClient('splitterColor', 'black');
    // 设置起始填充百分比
    this.setClient('fromFillPercent', 0);
    // 设置结束填充百分比
    this.setClient('toFillPercent', 0);
};
// 设置自定义Link继承twaver.Link
twaver.Util.ext('demo.ScaleLink', twaver.Link, {
    // 重载获取UI类方法，返回自定义UI类
  getCanvasUIClass : function () {
    return demo.ScaleLinkUI;
  },
  // 获取起始填充颜色
  getFromFillColor: function () {
    return this.getClient("fromFillColor");
  },
  // 获取结束填充颜色
  getToFillColor: function () {
    return this.getClient("toFillColor");
  },
  // 获取起始百分比
  getFromFillPercent: function () {
      // 如果是链路捆绑代理，返回所有捆绑链路中填充百分比最大的值
    if (this.isBundleAgent()) {
      var fromAgent = this.getFromAgent(),
        percentKey, maxPercent = 0, percent;
      this.getBundleLinks().forEachSiblingLink(function (link) {
        percentKey = fromAgent === link.getFromAgent() ? 'fromFillPercent' : 'toFillPercent';
        percent = link.getClient(percentKey);
        maxPercent = percent > maxPercent ? percent : maxPercent;
      });
      return maxPercent;
    } else {
      return this.getClient('fromFillPercent');
    }
  },
  // 获取结束百分比
  getToFillPercent: function () {
      // 如果是链路捆绑代理，返回所有捆绑链路中填充百分比最大的值
    if (this.isBundleAgent()) {
      var toAgent = this.getToAgent(),
        percentKey, maxPercent = 0, percent;
      this.getBundleLinks().forEachSiblingLink(function (link) {
        percentKey = toAgent === link.getToAgent() ? 'toFillPercent' : 'fromFillPercent';
        percent = link.getClient(percentKey);
        maxPercent = percent > maxPercent ? percent : maxPercent;
      });
      return maxPercent;
    } else {
      return this.getClient('toFillPercent');
    }
  },
  // 重载获取网元名称方法，判断如果是链路捆绑代理，就返回起始和结束代理节点的名称
  getName: function () {
      if (this.getClient('shortened')) {
          return null;
      } else if (this.isBundleAgent()) {
      return this.getFromAgent().getName() + '-' + this.getToAgent().getName();
    } else {
      return demo.ScaleLink.superClass.getName.call(this);
    }
  }
});

// 自定义LinkUI构造函数
demo.ScaleLinkUI = function(network, element){
    // 调用基类构造函数
    demo.ScaleLinkUI.superClass.constructor.call(this, network, element);
};
// 设置自定义Link继承twaver.canvas.LinkUI
twaver.Util.ext('demo.ScaleLinkUI', twaver.canvas.LinkUI, {
  // 获取Link角度
  getAngle: function () {
    return getAngle(this.getFromPoint(), this.getToPoint());
  },
  // 获取Link中间点
  getMiddlePoint: function (from, to, percent) {
    return {
        x: from.x + (to.x - from.x) * percent,
        y: from.y + (to.y - from.y) * percent
      };
  },
  // 画刻度线
  drawScaleLine: function (from, to, angle, length, ctx, percent, lineWidth, lineColor) {
      var point = this.getMiddlePoint(from, to, percent);
      var y = length/2 * Math.sin(angle),
        x = length/2 * Math.cos(angle);
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(point.x + x, point.y + y);
      ctx.lineTo(point.x - x, point.y -y);
      ctx.stroke();
  },
  // 获取是否将链路变短
  isShorten: function () {
    var link = this.getElement();
    return link.getClient('shortened') && this.getLineLength() > link.getClient('shortenLength') * 2;
  },
  // 重载画链路函数，用自定义逻辑画链路
  paintBody: function (ctx) {
        var points = this.getLinkPoints(),
          link = this.getElement();
        if (!points || points.size() < 2) {
            return;
        }
        
        var lineLength = this.getLineLength(),
          shortenLength = link.getClient('shortenLength'),
          percent = shortenLength / lineLength,
        from = points.get(0),
        to = points.get(1),
        angle = this.getAngle() + Math.PI/2;
      if (this.isShorten()) {
          fromPoints = new twaver.List([from, this.getMiddlePoint(from, to, percent)]);
          toPoints = new twaver.List([this.getMiddlePoint(from, to, 1 - percent), to]);
          this._paintBody(ctx, fromPoints, angle);
          this._paintBody(ctx, toPoints, angle);
          
          // 画文字
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      var textCenter = {x: (fromPoints.get(0).x + fromPoints.get(1).x)/2, y: (fromPoints.get(0).y + fromPoints.get(1).y)/2};
      ctx.fillText(link.getName(), textCenter.x, textCenter.y);
      
      textCenter = {x: (toPoints.get(0).x + toPoints.get(1).x)/2, y: (toPoints.get(0).y + toPoints.get(1).y)/2};
      ctx.fillText(link.getName(), textCenter.x, textCenter.y);
      
      ctx.fillText(link.getToNode().getName(), fromPoints.get(1).x, fromPoints.get(1).y);
      ctx.fillText(link.getFromNode().getName(), toPoints.get(0).x, toPoints.get(0).y);
        } else {
          this._paintBody(ctx, points, angle);
        }
      
    // 画起始箭头
    if (link.getClient('arrow.from')) {
        twaver.Util.drawArrow(ctx, 12, 9, points, true, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
          }
      // 画结束箭头
          if (link.getClient('arrow.to')) {
        twaver.Util.drawArrow(ctx, 12, 9, points, false, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
          }
  },
  _paintBody: function (ctx, points, angle) {
        var link = this.getElement(),
          width = link.getStyle('link.width'),
          grow = width,
          outerColor = this.getOuterColor();
        if (outerColor) {
            var outerWidth = link.getStyle('outer.width');
            grow += outerWidth * 2;
        }
        var selectBorder = !this.getEditAttachment() && link.getStyle('select.style') === 'border' && this.getNetwork().isSelected(link);
        if (selectBorder) {
            var selectWidth = link.getStyle('select.width');
            grow += selectWidth * 2;
        }
        ctx.lineCap = link.getStyle('link.cap');
        ctx.lineJoin = link.getStyle('link.join');

        var fromFillPercent = link.getFromFillPercent();
        var toFillPercent = link.getToFillPercent();
        var fromFillColor = link.getFromFillColor();
        var toFillColor = link.getToFillColor();
        var from = points.get(0);
        var to = points.get(1);
        var fromEnd = {
          x: from.x + (to.x - from.x) / 2 * fromFillPercent, 
          y: from.y + (to.y - from.y) / 2 * fromFillPercent
        };
        var fromPoints = new twaver.List([from, fromEnd]);
        var toEnd = {
          x: to.x + (from.x - to.x) / 2 * toFillPercent,
          y: to.y + (from.y - to.y) / 2 * toFillPercent
        }
        var toPoints = new twaver.List([to, toEnd]);
        var middlePoints = new twaver.List([fromEnd, toEnd]);

        // 画选中边框
        if (selectBorder) {
            var position = this._element.getClient("position");
            if(position){
              if(position === "from"){
                this.drawLinePoints(ctx, fromPoints, grow, link.getStyle('select.color'));
              }else if(position === "to"){
                this.drawLinePoints(ctx, toPoints, grow, link.getStyle('select.color'));
              }else{
                this.drawLinePoints(ctx, middlePoints, grow, link.getStyle('select.color'));
              }
            }
        }
        // 画边框
        if (outerColor) {
            this.drawLinePoints(ctx, points, width + outerWidth * 2, outerColor);
        }
        // // 画Link
        // this.drawLinePoints(ctx, points, width, this.getInnerColor() || link.getStyle('link.color'));
        // 

        // 画起始填充色
        this.drawLinePoints(ctx, fromPoints, width, fromFillColor);
        // 画结束填充色
        this.drawLinePoints(ctx, toPoints, width, toFillColor);
        // 画中间填充色
        this.drawLinePoints(ctx, middlePoints, width, this.getInnerColor() || link.getStyle('link.color'));
      
      from = points.get(0);
      to = points.get(1);
      var scaleWidth = link.getClient('scaleWidth'),
        scaleColor = link.getClient('scaleColor');
      // 画刻度
      for (var i = 1, n = link.getClient('scaleNumbers') * 2; i < n; i++) {
        this.drawScaleLine(from, to, angle, width/2, ctx, i/n, scaleWidth, scaleColor);
      }
      // 画分隔线
      this.drawScaleLine(from, to, angle, width, ctx, 0.5, 3, link.getClient('splitterColor'));
  },

  hitCanvasRectAtScaleLine: function(x, y){
      var rect = { x: x, y: y, width: 0, height: 0 };
      var tolerance = this._network.getSelectionTolerance();
      if (tolerance && tolerance > 0) {        
        _twaver.math.grow(rect, tolerance, tolerance);
      }
      var link = this.getElement();
      var cvs = this.getHitCanvas(rect.width, rect.height);
      var ctx = this.getCtx(cvs);
      ctx.save();
      ctx.translate(-rect.x, -rect.y);
      this.paintBody(ctx);
      try {
          var imageData = ctx.getImageData(0, 0, rect.width, rect.height);
          var pixs = imageData.data;
          for (var c = 0; c < imageData.width; c++) {
              for (var r = 0; r < imageData.height; r++) {
                  var index = 4 * (r * imageData.width + c);
                  var r = pixs[index];
                  var g = pixs[index + 1];
                  var b = pixs[index + 2];
                  var a = pixs[index + 3];
                  var rString, gString, bString;
                  if(r<16){
                    rString = "0" + r.toString(16);
                  }else{
                    rString = r.toString(16);
                  }
                  if(g<16){
                    gString = "0" + g.toString(16);
                  }else{
                    gString = g.toString(16);
                  }
                  if(b<16){
                    bString = "0" + b.toString(16);
                  }else{
                    bString = b.toString(16);
                  }
                  var hexColor =  "#" + rString + gString + bString;
                  console.log(hexColor);
                  if(hexColor === link.getFromFillColor()){
                    ctx.restore();
                    return "from";
                  }else if(hexColor === link.getToFillColor()){
                    ctx.restore();
                    return "to";
                  }else if(hexColor === link.getStyle("link.color")){
                    ctx.restore();
                    return "center";
                  }else if(hexColor === SCALE_LINK_SHADOW_COLOR){
                    ctx.restore();
                    return null;
                  }
              }
          }
      } catch (e) {
          this.disposeHitCanvas();
          if (_twaver.math.contains(this.getUnionBodyBounds(), rect)) {
              return null;
          }
      }
      ctx.restore();
      return null;
  },
  getHitCanvas: function (w, h) {
      if (this._hitCanvas == null) {
          this._hitCanvas = _twaver.html.createCanvas();
      }
      if (arguments.length == 0) {
          w = 2;
          h = 2;
      }
      this._hitCanvas.setAttribute("width", '' + w - 1);
      this._hitCanvas.setAttribute("height", '' + h - 1);
      this._hitCanvas.setAttribute("width", '' + w);
      this._hitCanvas.setAttribute("height", '' + h);
      var ctx = this.getCtx(this._hitCanvas);
      ctx.clearRect(0, 0, w, h);
      return this._hitCanvas;
  },
  getCtx: function (cvs) {
      return cvs.getContext("2d");
  },
  disposeHitCanvas: function () {
      this._hitCanvas = null;
  }
});