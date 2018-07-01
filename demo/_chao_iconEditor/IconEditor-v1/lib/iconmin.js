(function(window, undefined) {
  var svg = {};
  svg.images = [];
  svg.Styles = {};
  svg.Definitions = {};
  svg.Property = function(name, value) {
    this.name = name;
    this.value = value
  };
  svg.Property.prototype.getValue = function() {
    return this.value
  };
  svg.Property.prototype.hasValue = function() {
    return this.value != null && this.value !== ""
  };
  svg.trim = function(s) {
    return s.replace(/^\s+|\s+$/g, "")
  };
  svg.compressSpaces = function(s) {
    return s.replace(/[\s\r\t\n]+/gm, " ")
  };
  svg.ajax = function(url) {
    var AJAX;
    if (window.XMLHttpRequest) {
      AJAX = new XMLHttpRequest
    } else {
      AJAX = new ActiveXObject("Microsoft.XMLHTTP")
    }
    if (AJAX) {
      AJAX.open("GET", url, false);
      AJAX.send(null);
      return AJAX.responseText
    }
    return null
  };
  svg.parseXml = function(xml) {
    if (window.DOMParser) {
      var parser = new DOMParser;
      return parser.parseFromString(xml, "text/xml")
    } else {
      xml = xml.replace(/<!DOCTYPE svg[^>]*>/, "");
      var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(xml);
      return xmlDoc
    }
  };
  svg.CreatePath = function(s) {
    var a = svg.ToNumberArray(s);
    var path = [];
    for (var i = 0; i < a.length; i += 2) {
      path.push(new svg.Point(a[i], a[i + 1]))
    }
    return path
  };
  svg.ToNumberArray = function(s) {
    var a = svg.trim(svg.compressSpaces((s || "").replace(/,/g, " "))).split(" ");
    for (var i = 0; i < a.length; i++) {
      a[i] = parseFloat(a[i])
    }
    return a
  };
  svg.Point = function(x, y) {
    this.x = x;
    this.y = y
  };
  svg.Element = {};
  svg.EmptyProperty = new svg.Property("EMPTY", "");
  svg.Element.ElementBase = function(node) {
    this.attributes = {};
    this.styles = {};
    this.children = [];
    this.attribute = function(name, createIfNotExists) {
      var a = this.attributes[name];
      if (a != null) return a;
      if (createIfNotExists == true) {
        a = new svg.Property(name, "");
        this.attributes[name] = a
      }
      return a || svg.EmptyProperty
    };
    this.getHrefAttribute = function() {
      for (var a in this.attributes) {
        if (a.match(/:href$/)) {
          return this.attributes[a]
        }
      }
      return svg.EmptyProperty
    };
    this.style = function(name, createIfNotExists) {
      var s = this.styles[name];
      if (s != null) return s;
      var a = this.attribute(name);
      if (a != null && a.hasValue()) {
        this.styles[name] = a;
        return a
      }
      var p = this.parent;
      if (p != null) {
        var ps = p.style(name);
        if (ps != null && ps.hasValue()) {
          return ps
        }
      }
      if (createIfNotExists == true) {
        s = new svg.Property(name, "");
        this.styles[name] = s
      }
      return s || svg.EmptyProperty
    };
    this.addChild = function(childNode, create) {
      var child = childNode;
      if (create) child = svg.CreateElement(childNode);
      child.parent = this;
      this.children.push(child)
    };
    if (node != null && node.nodeType == 1) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        if (childNode.nodeType == 1) this.addChild(childNode, true);
        if (this.captureTextNodes && childNode.nodeType == 3) {
          var text = childNode.nodeValue || childNode.text || ""
        }
      }
      for (var i = 0; i < node.attributes.length; i++) {
        var attribute = node.attributes[i];
        this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value)
      }
      var styles = svg.Styles[node.nodeName];
      if (styles != null) {
        for (var name in styles) {
          this.styles[name] = styles[name]
        }
      }
      if (this.attribute("class").hasValue()) {
        var classes = svg.compressSpaces(this.attribute("class").value).split(" ");
        for (var j = 0; j < classes.length; j++) {
          styles = svg.Styles["." + classes[j]];
          if (styles != null) {
            for (var name in styles) {
              this.styles[name] = styles[name]
            }
          }
          styles = svg.Styles[node.nodeName + "." + classes[j]];
          if (styles != null) {
            for (var name in styles) {
              this.styles[name] = styles[name]
            }
          }
        }
      }
      if (this.attribute("id").hasValue()) {
        var styles = svg.Styles["#" + this.attribute("id").value];
        if (styles != null) {
          for (var name in styles) {
            this.styles[name] = styles[name]
          }
        }
      }
      if (this.attribute("style").hasValue()) {
        var styles = this.attribute("style").value.split(";");
        for (var i = 0; i < styles.length; i++) {
          if (svg.trim(styles[i]) != "") {
            var style = styles[i].split(":");
            var name = svg.trim(style[0]);
            var value = svg.trim(style[1]);
            this.styles[name] = new svg.Property(name, value)
          }
        }
      }
      if (this.attribute("id").hasValue()) {
        if (svg.Definitions[this.attribute("id").value] == null) {
          svg.Definitions[this.attribute("id").value] = this
        }
      }
    }
  };
  svg.Element.svg = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.rect = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.rect.prototype = new svg.Element.ElementBase;
  svg.Element.circle = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.circle.prototype = new svg.Element.ElementBase;
  svg.Element.ellipse = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.ellipse.prototype = new svg.Element.ElementBase;
  svg.Element.line = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.line.prototype = new svg.Element.ElementBase;
  svg.Element.polyline = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node);
    this.points = svg.CreatePath(this.attribute("points").value)
  };
  svg.Element.polyline.prototype = new svg.Element.ElementBase;
  svg.Element.polygon = function(node) {
    this.base = svg.Element.polyline;
    this.base(node)
  };
  svg.Element.polygon.prototype = new svg.Element.polyline;
  svg.Element.path = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.path.prototype = new svg.Element.ElementBase;
  svg.Element.GradientBase = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node);
    this.stops = [];
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if (child.type == "stop") this.stops.push(child)
    }
  };
  svg.Element.GradientBase.prototype = new svg.Element.ElementBase;
  svg.Element.linearGradient = function(node) {
    this.base = svg.Element.GradientBase;
    this.base(node)
  };
  svg.Element.linearGradient.prototype = new svg.Element.GradientBase;
  svg.Element.radialGradient = function(node) {
    this.base = svg.Element.GradientBase;
    this.base(node)
  };
  svg.Element.radialGradient.prototype = new svg.Element.GradientBase;
  svg.Element.stop = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.stop.prototype = new svg.Element.ElementBase;
  svg.Element.text = function(node) {
    this.captureTextNodes = true;
    this.base = svg.Element.ElementBase;
    this.base(node);
    console.log(node.childNodes[0].nodeValue)
  };
  svg.Element.g = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.g.prototype = new svg.Element.ElementBase;
  svg.Element.symbol = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.symbol.prototype = new svg.Element.ElementBase;
  svg.Element.use = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.use.prototype = new svg.Element.ElementBase;
  svg.Element.image = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.image.prototype = new svg.Element.ElementBase;
  svg.Element.clipPath = function(node) {
    this.base = svg.Element.ElementBase;
    this.base(node)
  };
  svg.Element.clipPath.prototype = new svg.Element.ElementBase;
  svg.Element.MISSING = function(node) {
    if (typeof console != "undefined") {}
  };
  svg.Element.MISSING.prototype = new svg.Element.ElementBase;
  svg.CreateElement = function(node) {
    var className = node.nodeName.replace(/^[^:]+:/, "");
    className = className.replace(/\-/g, "");
    var e = null;
    if (typeof svg.Element[className] != "undefined") {
      e = new svg.Element[className](node)
    } else {
      e = new svg.Element.MISSING(node)
    }
    e.type = node.nodeName;
    return e
  };
  svg.load = function(url) {
    return svg.loadXml(svg.ajax(url))
  };
  svg.loadXml = function(xml) {
    return svg.loadXmlDoc(svg.parseXml(xml))
  };
  svg.loadString = function(s) {
    svg.loadXml(s)
  };
  svg.loadXmlDoc = function(dom) {
    var e = svg.CreateElement(dom.documentElement);
    e.root = true;
    return e
  };
  window.svg = svg
})(window);
function getSVGElement(svgElement) {
  var vector = [],
  gradientArray = [];
  var svgChildren = svgElement ? svgElement.children: [];
  var width = parseFloat(svgElement.attributes.width.value);
  var height = parseFloat(svgElement.attributes.height.value);
  var canvas = document.getElementById("canvas");
  var viewBox, v = {};
  v.w = width;
  v.h = height;
  v.origin = {
    x: 0,
    y: 0
  };
  console.log(svgElement);
  if (svgElement && svgElement.attributes && svgElement.attributes.viewBox) {
    viewBox = handlerViewBox(svgElement.attributes.viewBox.value);
    if (viewBox[0] > 0 || viewBox[1] > 0) {
      v.translate = {
        x: -viewBox[0],
        y: -viewBox[1]
      }
    }
    if (viewBox[2] != width || viewBox[3] != height) {
      v.scale = {
        x: width / viewBox[2],
        y: height / viewBox[3]
      }
    }
  }
  v.v = vector;
  svgChildren.forEach(function(target) {
    getAllGradient(target, gradientArray)
  });
  svgChildren.forEach(function(target) {
    convertToVector(target, vector, gradientArray)
  });
  return v
}
function convertToVector(target, vector, gradientArray, arr) {
  var o = {},
  attrs = target.attributes;
  if (target instanceof svg.Element.g) {
    handlerG(target, vector, gradientArray, arr)
  } else if (target instanceof svg.Element.rect) {
    o.shape = "rect";
    o.x = parseFloat(attrs.x ? attrs.x.value: 0);
    o.y = parseFloat(attrs.y ? attrs.y.value: 0);
    o.w = parseFloat(attrs.width ? attrs.width.value: 0);
    o.h = parseFloat(attrs.height ? attrs.height.value: 0);
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.fill == null && o.gradient == null) {
      o.fill = "#000000"
    }
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    if (!o.gradient && !o.fill) {
      o.fill = "#000000"
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.line) {
    o.shape = "line";
    o.p1 = {
      x: parseFloat(attrs.x1 ? attrs.x1.value: 0),
      y: parseFloat(attrs.y1 ? attrs.y1.value: 0)
    };
    o.p2 = {
      x: parseFloat(attrs.x2 ? attrs.x2.value: 0),
      y: parseFloat(attrs.y2 ? attrs.y2.value: 0)
    };
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.ellipse) {
    o.shape = "ellipse";
    o.cx = parseFloat(attrs.cx ? attrs.cx.value: 0);
    o.cy = parseFloat(attrs.cy ? attrs.cy.value: 0);
    o.rx = parseFloat(attrs.rx ? attrs.rx.value: 0);
    o.ry = parseFloat(attrs.ry ? attrs.ry.value: 0);
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    if (!o.gradient && !o.fill) {
      o.fill = "#000000"
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.circle) {
    o.shape = "ellipse";
    o.cx = parseFloat(attrs.cx ? attrs.cx.value: 0);
    o.cy = parseFloat(attrs.cy ? attrs.cy.value: 0);
    o.rx = parseFloat(attrs.r ? attrs.r.value: 0);
    o.ry = parseFloat(attrs.r ? attrs.r.value: 0);
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    if (!o.gradient && !o.fill) {
      o.fill = "#000000"
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.path) {
    o.shape = "path";
    o.data = attrs.d ? attrs.d.value: null;
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.polygon) {
    var data = "";
    o.shape = "path";
    if (target.points) {
      target.points.forEach(function(p) {
        data += p.x + "," + p.y + " "
      });
      data += "z"
    }
    o.data = data;
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    if (!o.gradient && !o.fill) {
      o.fill = "#000000"
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.polyline) {
    o.shape = "path";
    if (target.points) {
      target.points.forEach(function(p) {
        data += p.x + "," + p.y + " "
      });
      data = data.trim()
    }
    o.data = data;
    handlerFill(attrs, o, gradientArray);
    if (attrs["stroke-width"]) {
      o.lineWidth = parseFloat(attrs["stroke-width"].value)
    }
    if (attrs.stroke) {
      o.lineColor = attrs.stroke.value
    }
    handlerStyle(target.styles, o, gradientArray);
    if (o.lineColor && !o.lineWidth) {
      o.lineWidth = 1
    }
    if (attrs.transform) {
      o.transform = attrs.transform.value
    }
    if (attrs["fill-opacity"]) {
      o.alpha = parseFloat(attrs["fill-opacity"].value)
    }
    if (!o.gradient && !o.fill) {
      o.fill = "#000000"
    }
    arr ? arr.push(o) : vector.push(o)
  } else if (target instanceof svg.Element.text) {}
}
function handlerG(target, vector, gradientArray, arr) {
  var o = {},
  attrs = target.attributes;
  o.shape = "g";
  handlerFill(attrs, o, gradientArray);
  if (attrs["stroke-width"]) {
    o.lineWidth = parseFloat(attrs["stroke-width"].value)
  }
  if (attrs.stroke) {
    o.lineColor = attrs.stroke.value
  }
  handlerStyle(target.styles, o, gradientArray);
  if (o.lineColor && !o.lineWidth) {
    o.lineWidth = 1
  }
  if (attrs["fill-opacity"]) {
    o.alpha = parseFloat(attrs["fill-opacity"].value)
  }
  var garr = [];
  o.v = garr;
  if (arr) {
    arr.push(o)
  } else {
    vector.push(o)
  }
  target.children.forEach(function(child) {
    convertToVector(child, vector, gradientArray, garr)
  })
}
function handlerFill(attrs, o, gradientArray) {
  if (attrs.fill) {
    if (attrs.fill.value.indexOf("url") != -1) {
      var first = attrs.fill.value.indexOf("#");
      var last = attrs.fill.value.indexOf(")");
      var id = attrs.fill.value.substring(first + 1, last).trim();
      var gradient = gradientArray[id];
      if (gradient) {
        var attrs = gradient.attributes;
        var type = gradient.type.substring(0, 6);
        var gradientChildren = gradient.children;
        var stopArray = [];
        if (gradientChildren && gradientChildren.length > 0) {
          for (var i = 0; i < gradientChildren.length; i++) {
            var stp = {};
            stp.offset = gradientChildren[i].attributes.offset.value;
            stp.color = gradientChildren[i].attributes.style.value.split(":")[1].trim();
            stopArray.push(stp)
          }
        }
        o.gradient = {
          type: type
        };
        if ("radial" == type) {
          o.gradient.cx = parseFloat(attrs.cx ? attrs.cx.value: 0);
          o.gradient.cy = parseFloat(attrs.cy ? attrs.cy.value: 0);
          o.gradient.r = parseFloat(attrs.r ? attrs.r.value: 0);
          if (attrs.fx) {
            o.gradient.fx = parseFloat(attrs.fx ? attrs.fx.value: 0)
          }
          if (attrs.fy) {
            o.gradient.fy = parseFloat(attrs.fy ? attrs.fy.value: 0)
          }
        } else {
          o.gradient.x1 = parseFloat(attrs.x1 ? attrs.x1.value: 0);
          o.gradient.y1 = parseFloat(attrs.y1 ? attrs.y1.value: 0);
          o.gradient.x2 = parseFloat(attrs.x2 ? attrs.x2.value: 0);
          o.gradient.y2 = parseFloat(attrs.y2 ? attrs.y2.value: 0)
        }
        o.gradient.stop = stopArray;
        if (attrs.gradientTransform) {
          o.gradient.transform = attrs.gradientTransform.value
        }
      }
    } else if (attrs.fill.value != "none") {
      o.fill = attrs.fill.value
    }
  }
}
function handlerViewBox(s) {
  var newS = (s || "").replace(/,/g, " ").replace(/[\s\r\t\n]+/gm, " ").replace(/^\s+|\s+$/g, "").split(" ");
  for (var i = 0; i < newS.length; i++) {
    newS[i] = parseFloat(newS[i])
  }
  return newS
}
function handlerStyle(styles, o, gradientArray) {
  if (styles) {
    if (styles["stroke-width"]) {
      o.lineWidth = styles["stroke-width"].value
    }
    if (styles.stroke) {
      o.lineColor = styles.stroke.value
    }
    handlerFill(styles, o, gradientArray)
  }
}
function getAllGradient(target, gradientArray) {
  if (target instanceof svg.Element.linearGradient || target instanceof svg.Element.radialGradient) {
    var id = target.attributes.id.value;
    if (id) {
      gradientArray[id] = target
    }
  } else if (target.children && target.children.length > 0) {
    target.children.forEach(function(child) {
      getAllGradient(child, gradientArray)
    })
  }
}