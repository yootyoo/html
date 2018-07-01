var twaver = {};
twaver._isInitializing = false;
var _twaver = {
    isDeserializing: false,
    isCalculatingBus: false,
    images: {},
    registerImage: function (name, source, width, height, svg) {
        _twaver.images[name] = new twaver.ImageAsset(name, source, width, height, svg);
        refresh_pattern_cache(name);
    },
    getRegisteredImageNames: function() {
        return Object.keys(_twaver.images);
    },
    unregisterImage: function (name) {
        delete _twaver.images[name];
    },
    getImageAsset: function (name) {
        return _twaver.images[name];
    },
    showVersion: function (e) {
        if (_twaver.isCtrlDown(e) && e.shiftKey && e.keyCode == 76) {
            alert('TWaver HTML5 ' + twaver.Util.getVersion() + '\n' + $license);
        }
    },
    callLater: function (func, scope, args, delay) {
        return setTimeout(function () {
            func.apply(scope, args);
        }, delay || $Defaults.CALL_LATER_DELAY);
    },
    isEmptyObject: function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    },
    xml: function (s) {
        if (window.DOMParser) {
            return new DOMParser().parseFromString(s, "text/xml");
        } else {
            var x = new ActiveXObject("Microsoft.XmlDOM");
            x.async = false;
            x.loadXml(s);
            return x;
        }
    },
    num: function (v) {
        return typeof v === "number" && !isNaN(v) && isFinite(v);
    },
    getter: function (n) {
        var N = n.charAt(0).toUpperCase() + n.slice(1);
        var G = (/ble$/.test(n) || /ed$/.test(n)) ? 'is' : 'get'
        return G + N;
    },
    setter: function (n) {
        var N = n.charAt(0).toUpperCase() + n.slice(1);
        return 'set' + N;
    },
    _id: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
    id: function () {
        var s = [];
        for (var i = 0; i < 32; i++) {
            s[i] = this._id[Math.floor(Math.random() * 0x10)];
        }
        s[12] = "4";
        s[16] = this._id[(s[16] & 0x3) | 0x8];
        return s.join("");
    },
    keys: function (o) {
        var list = new $List();
        for (var k in o) {
            list.add(k);
        }
        return list;
    },
    es: ['toString', 'toLocaleString', 'valueOf'],
    ip: function (o, n) {
        var _n = '_' + n;
        o[_twaver.getter(n)] = function () {
            return this[_n];
        };
        o[_twaver.setter(n)] = function (v) {
            var ov = this[_n];
            this[_n] = v;
            this.firePropertyChange(n, ov, v);
        };
    },
    validateLicense: function (license) {
        $license = license;
        __v();
    },
    ibool: function (o, n) {
        var _n = '_' + n;
        var N = n.charAt(0).toUpperCase() + n.slice(1);
        o['is' + N] = function () {
            return this[_n];
        };
        o[_twaver.setter(n)] = function (v) {
            var ov = this[_n];
            this[_n] = v;
            this.firePropertyChange(n, ov, v);
        };
    },
    getValue: function (o, n, t) {
        var N = n.charAt(0).toUpperCase() + n.slice(1),
        	getF = 'get' + N,
        	isF = 'is' + N;
        if (t) {
	        if (t === 'boolean') {
	            return o[isF]();
	        } else {
	            return o[getF]();
	        }
	    } else {
	    	if (o[getF]) {
	    		return o[getF]();
	    	} else if (o[isF]) {
	    		return o[isF]();
	    	} else {
	    		return o[n];
	    	}
	    }
    },
    setValue: function (o, n, v) {
        o['set' + n.charAt(0).toUpperCase() + n.slice(1)](v);
    },
    
    clone: function (o) {
    	if (!o) {
            return null;
        }
        var c = {};
        for (var name in o) {
            c[name] = o[name];
        }
        return c;
    },
    cloneRect: function (o) {
    	if (!o) {
            return null;
        }
    	return {
    		x : o.x,
    		y : o.y,
    		width: o.width,
    		height : o.height
    	};
    },
    classCache: {},
    getClass: function (className) {
        var clazz = _twaver.classCache[className];
        if (!clazz) {
            var ss = className.split('.');
            var n = ss.length;
            clazz = window;
            for (var i = 0; i < n; i++) {
                clazz = clazz[ss[i]];
                if (!clazz) {
                    if ('twaver' === ss[i]) {
                        clazz = twaver;
                    }
                }
            }
            _twaver.classCache[className] = clazz;
        }
        return clazz;
    },
    newInstance: function (className) {
        var clazz = _twaver.getClass(className);
        if (!clazz) {
            return null;
        }
        var len = arguments.length;
        var args = arguments;
        if (len === 1) {
            return new clazz();
        } else if (len === 2) {
            return new clazz(args[1]);
        } else if (len === 3) {
            return new clazz(args[1], args[2]);
        } else if (len === 4) {
            return new clazz(args[1], args[2], args[3]);
        } else if (len === 5) {
            return new clazz(args[1], args[2], args[3], args[4]);
        } else if (len === 6) {
            return new clazz(args[1], args[2], args[3], args[4], args[5]);
        } else if (len === 7) {
            return new clazz(args[1], args[2], args[3], args[4], args[5], args[6]);
        } else if (len === 8) {
            return new clazz(args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        }
        throw "don't support args more than 7";
    },
    addMethod: function (clazz, o) {
        var p = clazz.prototype;
        for (var name in o) {
            p[name] = o[name];
        }
    },
    ext: function (subClass, superClass, o) {
        var className;
        if (typeof subClass === 'string') {
            className = subClass;
            subClass = _twaver.getClass(subClass);
        }
        if (superClass) {
            var F = function () { };
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;

            subClass.superClass = superClass.prototype;
            if (superClass.prototype.constructor == Object.prototype.constructor) {
                superClass.prototype.constructor = superClass;
            }
        }
        if (className) {
            subClass.prototype.getClassName = function () {
                return className;
            };
        }
        if (o) {
            var p = subClass.prototype;
            for (var name in o) {
                $extend.ext(name, p, o);
            }
            var n = _twaver.es.length;
            for (var i = 0; i < n; i++) {
                name = _twaver.es[i];
                if (o.hasOwnProperty(name) && !o.propertyIsEnumerable(name)) {
                    p[name] = o[name];
                }
            }
        }
    },
    setViewBounds: function (view, rect) {
        if (!view) {
            return;
        }
        if (view.adjustBounds) {
            view.adjustBounds(rect);
        }
        else {
            var style = view.style;
            if (!style && view.getView()) {
                style = view.getView().style;
            }
            if (style) {
                style.position = 'absolute';
                style.left = rect.x + 'px';
                style.top = rect.y + 'px';
                style.width = rect.width + 'px';
                style.height = rect.height + 'px';
            }
        }
    },
    getImageSrc: function (name) {
        var imageAsset = _twaver.getImageAsset(name);
        if (imageAsset) {
            if (imageAsset.getSrc()) {
                return imageAsset.getSrc();
            } else {
                return imageAsset.getImage().getAttribute('src');
            }
        } else {
            return name;
        }
    },
    nextColorCount: 0,
    nextColor: function () {
        if (_twaver.nextColorCount >= $Defaults.COLORS.length) {
            _twaver.nextColorCount = 0;
        }
        return $Defaults.COLORS[_twaver.nextColorCount++];
    },
    isCtrlDown: function (evt) {
        return evt.ctrlKey || evt.metaKey;
    },
    isShiftDown: function (evt) {
        return evt.shiftKey;
    },
    isAltDown: function (evt) {
        return evt.altKey;
    },
    setText: function (element, text, isInnerText) {
        if (isInnerText) {
	        if ($ua.isFirefox) {
                element.textContent = text;
            } else {
                element.innerText = text;
            }
        } else {
	        element.innerHTML = text;
        }
    },
    fillDescendant: function (parent, list) {
        list.add(parent);
        if (parent.hasChildren()) {
            parent.getChildren().forEach(function (child) {
                _twaver.fillDescendant(child, list);
            });
        }
    }
};

var d = Date;
var $license =
"l=1.0\n"+
"type=1\n"+
"gis=1\n"+
"3d=0\n"+
"start=2015-09-01\n"+
"end=2015-12-31\n"+
"note=This license applies to the evaluation version of TWaver. The License is limited to noncommercial use. Noncommercial use relates only to educational, research, personal or evaluation purposes. Any other use is commercial use. You may not use the Software in connection with any business activities.And You are not permitted to modify the software or attempt to decipher, decompile, disassemble or reverse engineer this Software.\n"+
"signature=60a71f854d055d7810a58e634b478dfcd94241823f4e725d358349d02dc408e6292b011e3711b6a784f42e44376003d5d9101871e0d347ccae4311f1084882cd0a6e38aa77b081ab86ac7acf5067b9ec1c57393e78ae8b88d004b9f527a5ca9183d1f450f1e0e71d73ca6451056b8596180316134306fff2926b9e6aaeeab87602674668aa5c9c084fc6ac6625515dbafb2119c0890f3f686b3ac1841efbe1670f2c87fac3b4ca9064fdbc8534d26050cedf601563fac9afd689968f70aaac72372bad0639bdb603a598917450937614048ac062aa30628a88056425f5365492899fd020f606eac1da5d2bc1b2a7f22e76aca7ec57458e81e6ec260ed13c8a20175069e9e707d4b6e5324f8fd7e7d519fe52fbc6e54eb77dcd8c83337c2f954c5950ec506b1165005193a1325c725a9de2002e0d9a0efc7806f51506699e3d451f65a3dec05b5c519bdc9d99abe8983c14dd470826bd58e4fd7e683d64396edd081a76854588caed8d43a8c1a6156e89f42a772a4b3ad3fe614915e579ce7d731aab5314563ebd3c1d5a63b766644352b1252c5a0284222726704323de34401550b5fdc230e0bf49883f4c99791b5afd7101bfb9b2f4f25b6640efad5077faaa45164c5ceb61b20a78546e1110719c39e2d26203aa2209f818cb5ac74bb3b37535ace12db632c1ad0a77b2acb71e78a1920833fbf45bb6fbe78a4e56aba9901d345632b6444c9905a5f95d3c3f747de92a554ae1a85cab00b929ea3e3d0b8d6278a358248e77dd44b152a14dc9d0ce90d191fbb6e6a9967df6bbfe96f41126d3db939610b4d2b3ae3a6f61a389532b2a3fde84af8642df938ee0a2e90d21c250bd85b8ee049e02e79e33b9e9548b10064706f5dda5bbfb806b7efd6fd25957ee";

window.twaver = twaver;
window._twaver = _twaver;
twaver.animate = {};
twaver.network = {};
twaver.network.interaction = {};
twaver.controls = {};
twaver.charts = {};
twaver.layout = {};

var Canvas, isNodejs, navigator = window.navigator, document = window.document, Image = window.Image;
if (!window.document) {
    isNodejs = true;
    Canvas = require('canvas');
    Image = Canvas.Image;
    navigator = {
        userAgent: ''
    };
    document = {
    };
}