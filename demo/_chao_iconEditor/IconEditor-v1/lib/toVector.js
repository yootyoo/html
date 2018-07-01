function getSVGElement(svgElement) {
    var vector=[],gradientArray = [];
    var svgChildren = svgElement ? svgElement.children : [];
    var width = parseFloat(svgElement.attributes.width.value);
    var height = parseFloat(svgElement.attributes.height.value);
    var canvas = document.getElementById('canvas');
    var viewBox,v = {};
    v.w = width;
    v.h = height;
    v.origin = {x: 0, y: 0};
    console.log(svgElement);
    if(svgElement && svgElement.attributes && svgElement.attributes.viewBox) {
       viewBox = handlerViewBox(svgElement.attributes.viewBox.value);
       if(viewBox[0] > 0 || viewBox[1] > 0) {
           v.translate = { x: -viewBox[0], y : -viewBox[1]};
       }
       if(viewBox[2] != width || viewBox[3] != height) {
           v.scale =  { x: width / viewBox[2] , y: height / viewBox[3]};
       }
    }
    v.v = vector;
    svgChildren.forEach(function(target) {
        getAllGradient(target,gradientArray);
    });
    svgChildren.forEach(function(target) {
        convertToVector(target,vector,gradientArray);
    });
    return v;
}

function convertToVector(target,vector,gradientArray, arr) {
    var o = {},attrs = target.attributes;
    if(target instanceof svg.Element.g) {
        handlerG(target, vector, gradientArray, arr);
    } else if(target instanceof svg.Element.rect) {
//        var o = {},attrs = target.attributes;
        o.shape = 'rect';
        o.x = parseFloat(attrs.x ? attrs.x.value : 0);
        o.y = parseFloat(attrs.y ? attrs.y.value : 0);
        o.w = parseFloat(attrs.width ? attrs.width.value : 0);
        o.h = parseFloat(attrs.height ? attrs.height.value : 0);
        handlerFill(attrs, o,gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o, gradientArray);
        if(o.fill == null && o.gradient == null) {
            o.fill = "#000000";
        }
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        if(!o.gradient && !o.fill) {
            o.fill = "#000000";
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.line) {
//        var o = {},attrs = target.attributes;
        o.shape = 'line';
        o.p1 = {x: parseFloat(attrs.x1 ? attrs.x1.value : 0), y: parseFloat(attrs.y1 ? attrs.y1.value : 0)};
        o.p2 = {x: parseFloat(attrs.x2 ? attrs.x2.value : 0), y: parseFloat(attrs.y2 ? attrs.y2.value : 0)};
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o, gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.ellipse) {
//        var o = {},attrs = target.attributes;
        o.shape = 'ellipse';
        o.cx = parseFloat(attrs.cx ? attrs.cx.value : 0);
        o.cy = parseFloat(attrs.cy ? attrs.cy.value : 0);
        o.rx = parseFloat(attrs.rx ? attrs.rx.value : 0);
        o.ry = parseFloat(attrs.ry ? attrs.ry.value : 0);
        handlerFill(attrs, o, gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o,gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        if(!o.gradient && !o.fill) {
            o.fill = "#000000";
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.circle) {
//        var o = {},attrs = target.attributes;
        o.shape = 'ellipse';
        o.cx = parseFloat(attrs.cx ? attrs.cx.value : 0);
        o.cy = parseFloat(attrs.cy ? attrs.cy.value : 0);
        o.rx = parseFloat(attrs.r ? attrs.r.value : 0)
        o.ry = parseFloat(attrs.r ? attrs.r.value : 0);
        handlerFill(attrs, o, gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o, gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        if(!o.gradient && !o.fill) {
            o.fill = "#000000";
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.path) {
//        var o = {},attrs = target.attributes;
        o.shape = 'path';
        o.data = attrs.d ? attrs.d.value : null;
        handlerFill(attrs, o, gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o, gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
//        if(!o.gradient && !o.fill) {
//            o.fill = "#000000";
//        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.polygon) {
//        var o = {},attrs = target.attributes,data='';
        var data="";
        o.shape = 'path';
        if(target.points) {
            target.points.forEach(function(p) {
                data += p.x + ',' + p.y + ' ';
            });
            data += 'z';
        }
        o.data = data;
        handlerFill(attrs, o, gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        handlerStyle(target.styles, o, gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        if(!o.gradient && !o.fill) {
            o.fill = "#000000";
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.polyline) {
//        var o = {},attrs = target.attributes,data='';
        o.shape = 'path';
        if(target.points) {
            target.points.forEach(function(p) {
                data += p.x + ',' + p.y + ' ';
            });
            data = data.trim();
        }
        o.data = data;
        handlerFill(attrs, o, gradientArray);
        if((attrs["stroke-width"])) {
            o.lineWidth = parseFloat(attrs["stroke-width"].value);
        }
        if(attrs.stroke) {
            o.lineColor = attrs.stroke.value;
        }
        //in svg if storke property exists and storke-width don't exist, stroke-width is 1,
        handlerStyle(target.styles, o, gradientArray);
        if(o.lineColor && !o.lineWidth) {
            o.lineWidth = 1;
        }
        if(attrs.transform) {
            o.transform = attrs.transform.value;
        }
        if(attrs['fill-opacity']) {
            o.alpha = parseFloat(attrs['fill-opacity'].value);
        }
        if(!o.gradient && !o.fill) {
            o.fill = "#000000";
        }
        arr ? arr.push(o): vector.push(o);
    } else if(target instanceof svg.Element.text) {
//        var o = {},attrs = target.attributes;
//        o.shape = "text";
//        o.text = target.text;
//        if(attrs.x) {
//            o.x = parseFloat(attrs.x.value);
//        }
//        if(attrs.y) {
//            o.y = parseFloat(attrs.y.value);
//        }
//        handlerFill(attrs, o,gradientArray);
//        if((attrs["stroke-width"])) {
//            o.lineWidth = parseFloat(attrs["stroke-width"].value);
//        }
//        if(attrs.stroke) {
//            o.lineColor = attrs.stroke.value;
//        }
//        handlerStyle(target.styles, o, gradientArray);
//        if(o.fill == null && o.gradient == null) {
//            o.fill = "#000000";
//        }
//        if(o.lineColor && !o.lineWidth) {
//            o.lineWidth = 1;
//        }
//        if(attrs.transform) {
//            o.transform = attrs.transform.value;
//        }
//        if(attrs['fill-opacity']) {
//            o.alpha = parseFloat(attrs['fill-opacity'].value);
//        }
//        arr ? arr.push(o): vector.push(o);
    }
}
function handlerG(target, vector, gradientArray, arr) {
    var o = {},attrs = target.attributes;
    o.shape = 'g';
    handlerFill(attrs, o, gradientArray);
    if(attrs["stroke-width"]) {
        o.lineWidth = parseFloat(attrs["stroke-width"].value);
    }
    if(attrs.stroke) {
        o.lineColor = attrs.stroke.value;
    }
    handlerStyle(target.styles, o, gradientArray);
    if(o.lineColor && !o.lineWidth) {
        o.lineWidth = 1;
    }
    if(attrs['fill-opacity']) {
        o.alpha = parseFloat(attrs['fill-opacity'].value);
    }
//    if(attrs.transform) {
//        o.transform = attrs.transform.value;
//    }
    var garr = [];
    o.v = garr;
    if(arr) {
        arr.push(o);
    } else {
        vector.push(o);
    }
    target.children.forEach(function(child) {
        convertToVector(child,vector,gradientArray, garr);
    });
}
function handlerFill(attrs, o, gradientArray) {
    if(attrs.fill) {
        if(attrs.fill.value.indexOf('url') != -1) {
            var first = attrs.fill.value.indexOf('#');
            var last = attrs.fill.value.indexOf(")");
            var id = attrs.fill.value.substring(first + 1, last).trim();
            var gradient = gradientArray[id];
            if(gradient) {
                var attrs = gradient.attributes;
                var type = gradient.type.substring(0,6);
//                  var stopAttrs0 = gradient.children[0].attributes;
//                  var stopAttrs1 = gradient.children[1].attributes;
                var gradientChildren = gradient.children;
                var stopArray = [];
                if(gradientChildren && gradientChildren.length > 0) {
                    for(var i = 0; i < gradientChildren.length; i++) {
                        var stp = {};
                        stp.offset = gradientChildren[i].attributes.offset.value;
                        stp.color = gradientChildren[i].attributes.style.value.split(":")[1].trim();
                        stopArray.push(stp);
                    }
                }
                o.gradient = {type:type};
                if("radial" == type) {
                    o.gradient.cx = parseFloat(attrs.cx ? attrs.cx.value : 0);
                    o.gradient.cy = parseFloat(attrs.cy ? attrs.cy.value : 0);
                    o.gradient.r = parseFloat(attrs.r ? attrs.r.value : 0);
                    if(attrs.fx) {
                        o.gradient.fx = parseFloat(attrs.fx ? attrs.fx.value : 0);
                    }
                    if(attrs.fy) {
                        o.gradient.fy = parseFloat(attrs.fy ? attrs.fy.value : 0);
                    }
                } else {
                    o.gradient.x1 = parseFloat(attrs.x1 ? attrs.x1.value : 0);
                    o.gradient.y1 = parseFloat(attrs.y1 ? attrs.y1.value : 0);
                    o.gradient.x2 = parseFloat(attrs.x2 ? attrs.x2.value : 0);
                    o.gradient.y2 = parseFloat(attrs.y2 ? attrs.y2.value : 0);
                }
                o.gradient.stop = stopArray;
                if(attrs.gradientTransform) {
                    o.gradient.transform = attrs.gradientTransform.value;
                }
            }
        } else if(attrs.fill.value != "none"){
            o.fill = attrs.fill.value;
        }
    }
}
function handlerViewBox(s) {
    var newS = (s || '').replace(/,/g, ' ').replace(/[\s\r\t\n]+/gm, ' ').replace(/^\s+|\s+$/g, '').split(' ');
    for (var i=0; i<newS.length; i++) {
        newS[i] = parseFloat(newS[i]);
    }
    return newS;
}
function handlerStyle(styles, o, gradientArray) {
    if(styles) {
        if(styles["stroke-width"]) {
            o.lineWidth = styles["stroke-width"].value;
        }
        if(styles.stroke) {
            o.lineColor = styles.stroke.value;
        }
        handlerFill(styles, o, gradientArray);
    }
}

function getAllGradient(target,gradientArray) {
    if(target instanceof svg.Element.linearGradient || target instanceof svg.Element.radialGradient) {
        var id = target.attributes.id.value;
        if(id) {
            gradientArray[id] = target;
        }
    } else if(target.children && target.children.length > 0) {
        target.children.forEach(function(child) {
            getAllGradient(child,gradientArray);
        });
    }
}