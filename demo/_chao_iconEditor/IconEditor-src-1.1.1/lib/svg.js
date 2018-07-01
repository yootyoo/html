(function(window, undefined) {
    var svg = {};
    svg.version = '1.1.1';
    svg.images = [];
    svg.Styles = {};
    svg.Definitions = {};
    svg.Property = function (name, value) {
        this.name = name;
        this.value = value;
    }
    svg.Property.prototype.getValue = function () {
        return this.value;
    }
    svg.Property.prototype.hasValue = function () {
        return (this.value != null && this.value !== '');
    }
    svg.trim = function (s) {
        return s.replace(/^\s+|\s+$/g, '');
    }
    svg.compressSpaces = function (s) {
        return s.replace(/[\s\r\t\n]+/gm, ' ');
    }
    svg.ajax = function (url) {
        var AJAX;
        if (window.XMLHttpRequest) {
            AJAX = new XMLHttpRequest();
        }
        else {
            AJAX = new ActiveXObject('Microsoft.XMLHTTP');
        }
        if (AJAX) {
            AJAX.open('GET', url, false);
            AJAX.send(null);
            return AJAX.responseText;
        }
        return null;
    }
    svg.parseXml = function (xml) {
        if (window.DOMParser) {
            var parser = new DOMParser();
            return parser.parseFromString(xml, 'text/xml');
        }
        else {
            xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
            var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xml);
            return xmlDoc;
        }
    }
    svg.CreatePath = function(s) {
        var a = svg.ToNumberArray(s);
        var path = [];
        for (var i=0; i<a.length; i+=2) {
            path.push(new svg.Point(a[i], a[i+1]));
        }
        return path;
    }
    svg.ToNumberArray = function(s) {
        var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
        for (var i=0; i<a.length; i++) {
            a[i] = parseFloat(a[i]);
        }
        return a;
    }
    svg.Point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    // elements
    svg.Element = {}

    svg.EmptyProperty = new svg.Property('EMPTY', '');

    svg.Element.ElementBase = function (node) {
        this.attributes = {};
        this.styles = {};
        this.children = [];
        // get or create attribute
        this.attribute = function (name, createIfNotExists) {
            var a = this.attributes[name];
            if (a != null) return a;

            if (createIfNotExists == true) {
                a = new svg.Property(name, '');
                this.attributes[name] = a;
            }
            return a || svg.EmptyProperty;
        }
        this.getHrefAttribute = function () {
            for (var a in this.attributes) {
                if (a.match(/:href$/)) {
                    return this.attributes[a];
                }
            }
            return svg.EmptyProperty;
        }
        // get or create style, crawls up node tree
        this.style = function (name, createIfNotExists) {
            var s = this.styles[name];
            if (s != null) return s;

            var a = this.attribute(name);
            if (a != null && a.hasValue()) {
                this.styles[name] = a; // move up to me to cache
                return a;
            }

            var p = this.parent;
            if (p != null) {
                var ps = p.style(name);
                if (ps != null && ps.hasValue()) {
                    return ps;
                }
            }

            if (createIfNotExists == true) {
                s = new svg.Property(name, '');
                this.styles[name] = s;
            }
            return s || svg.EmptyProperty;
        }

        this.addChild = function (childNode, create) {
            var child = childNode;
            if (create) child = svg.CreateElement(childNode);
            child.parent = this;
            this.children.push(child);
        }

        if (node != null && node.nodeType == 1) { //ELEMENT_NODE
            // add children
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
                if (this.captureTextNodes && childNode.nodeType == 3) {
                    var text = childNode.nodeValue || childNode.text || '';
    //                console.log(svg.trim(svg.compressSpaces(text)));
                }
            }
            // add attributes
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes[i];
                this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value);
            }

            // add tag styles
            var styles = svg.Styles[node.nodeName];
            if (styles != null) {
                for (var name in styles) {
                    this.styles[name] = styles[name];
                }
            }

            // add class styles
            if (this.attribute('class').hasValue()) {
                var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
                for (var j = 0; j < classes.length; j++) {
                    styles = svg.Styles['.' + classes[j]];
                    if (styles != null) {
                        for (var name in styles) {
                            this.styles[name] = styles[name];
                        }
                    }
                    styles = svg.Styles[node.nodeName + '.' + classes[j]];
                    if (styles != null) {
                        for (var name in styles) {
                            this.styles[name] = styles[name];
                        }
                    }
                }
            }
            // add id styles
            if (this.attribute('id').hasValue()) {
                var styles = svg.Styles['#' + this.attribute('id').value];
                if (styles != null) {
                    for (var name in styles) {
                        this.styles[name] = styles[name];
                    }
                }
            }
            // add inline styles
            if (this.attribute('style').hasValue()) {
                var styles = this.attribute('style').value.split(';');
                for (var i = 0; i < styles.length; i++) {
                    if (svg.trim(styles[i]) != '') {
                        var style = styles[i].split(':');
                        var name = svg.trim(style[0]);
                        var value = svg.trim(style[1]);
                        this.styles[name] = new svg.Property(name, value);
                    }
                }
            }
            // add id
            if (this.attribute('id').hasValue()) {
                if (svg.Definitions[this.attribute('id').value] == null) {
                    svg.Definitions[this.attribute('id').value] = this;
                }
            }
        }
    }

    // svg element
    svg.Element.svg = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }

    // rect element
    svg.Element.rect = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.rect.prototype = new svg.Element.ElementBase;

    // circle element
    svg.Element.circle = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.circle.prototype = new svg.Element.ElementBase;

    // ellipse element
    svg.Element.ellipse = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.ellipse.prototype = new svg.Element.ElementBase;

    // line element
    svg.Element.line = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.line.prototype = new svg.Element.ElementBase;

    // polyline element
    svg.Element.polyline = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
        this.points = svg.CreatePath(this.attribute('points').value);
    }
    svg.Element.polyline.prototype = new svg.Element.ElementBase;

    // polygon element
    svg.Element.polygon = function (node) {
        this.base = svg.Element.polyline;
        this.base(node);
    }
    svg.Element.polygon.prototype = new svg.Element.polyline;

    // path element
    svg.Element.path = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.path.prototype = new svg.Element.ElementBase;

    // base for gradients
    svg.Element.GradientBase = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
        this.stops = [];
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.type == 'stop') this.stops.push(child);
        }
    }
    svg.Element.GradientBase.prototype = new svg.Element.ElementBase;

    // linear gradient element
    svg.Element.linearGradient = function (node) {
        this.base = svg.Element.GradientBase;
        this.base(node);
    }
    svg.Element.linearGradient.prototype = new svg.Element.GradientBase;

    // radial gradient element
    svg.Element.radialGradient = function (node) {
        this.base = svg.Element.GradientBase;
        this.base(node);
    }
    svg.Element.radialGradient.prototype = new svg.Element.GradientBase;

    // gradient stop element
    svg.Element.stop = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.stop.prototype = new svg.Element.ElementBase;

    // text element
    svg.Element.text = function (node) {
        this.captureTextNodes = true;
        this.base = svg.Element.ElementBase;
        this.base(node);
        //console.log(node.childNodes[0].nodeValue);
//        if(node.childNodes.length) {
//            this.text = node.childNodes[0].trim();
//        }
    }

    // group element
    svg.Element.g = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.g.prototype = new svg.Element.ElementBase;

    // symbol element
    svg.Element.symbol = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.symbol.prototype = new svg.Element.ElementBase;

    // use element
    svg.Element.use = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);

    }
    svg.Element.use.prototype = new svg.Element.ElementBase;

    svg.Element.image = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);

    }
    svg.Element.image.prototype = new svg.Element.ElementBase;

    // clip element
    svg.Element.clipPath = function (node) {
        this.base = svg.Element.ElementBase;
        this.base(node);
    }
    svg.Element.clipPath.prototype = new svg.Element.ElementBase;

    svg.Element.MISSING = function (node) {
        if (typeof(console) != 'undefined') {
    //        console.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
        }
    }
    svg.Element.MISSING.prototype = new svg.Element.ElementBase;

    svg.CreateElement = function (node) {
        var className = node.nodeName.replace(/^[^:]+:/, ''); // remove namespace
        className = className.replace(/\-/g, ''); // remove dashes
        var e = null;
        if (typeof(svg.Element[className]) != 'undefined') {
            e = new svg.Element[className](node);
        }
        else {
            e = new svg.Element.MISSING(node);
        }

        e.type = node.nodeName;
        return e;
    }
    // load from url
    svg.load = function (url) {
        return svg.loadXml(svg.ajax(url));
    }
    // load from xml
    svg.loadXml = function (xml) {
        return svg.loadXmlDoc(svg.parseXml(xml));
    }
    svg.loadString = function(s) {
        svg.loadXml(s);
    }
    svg.loadXmlDoc = function (dom) {
        var e = svg.CreateElement(dom.documentElement);
        e.root = true;
        return e;
    }
    window.svg = svg;
})(window);
