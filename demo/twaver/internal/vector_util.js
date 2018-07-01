var drawImage = function (g, image, color, rect, data, view, inPattern) {
  var imageAsset, imageName, sx, sy, zoom = 1;
  if (typeof image !== 'object') {
    imageName = image;
    imageAsset = _twaver.images[image];
    image = imageAsset && imageAsset.getImage();
  }
  if (isImage(image)) {
    g.drawImage(imageAsset ? imageAsset.getImage(color) : image, Math.round(rect.x), Math.round(rect.y), rect.width, rect.height);
  } else if (image && typeof image === 'object') {
    g._data = data;
    g._view = view;
    if (imageName) {
      sx = rect.width / ((image.w && getVectorValue(data, image, image, 'w')) || data.getWidth());
      sy = rect.height / ((image.h && getVectorValue(data, image, image, 'h')) || data.getHeight());
      if (view) {
        if (view.getSizeZoom) {
          zoom = view.getSizeZoom() * view.getGraphicsZoom();
        } else {
          zoom = view.getZoom();
        }
      }
      if (!imageAsset._cache || Math.max(sx * zoom, sy * zoom) > 1) {
        drawVector(g, image, color, rect, data, view, inPattern);
      } else {
        g.drawImage(color ? imageAsset.getImage(color) : imageAsset._cache, Math.round(rect.x), Math.round(rect.y), rect.width, rect.height);
      }
    } else {
      drawVector(g, image, color, rect, data, view, inPattern);
    }
    g._data = null;
    g._view = null;
  }
};

var drawVector = function (g, image, color, rect, data, view, inPattern) {
  var shapeState = data && data.getStyle('image.state'),
    v, vc, i, f, shapeData, vector, sx, sy, oldVector, oldFill, oldPattern, oldLineWidth, oldAlpha, oldScaleX, oldScaleY, oldColor, state, width, height;
  oldVector = g._vector;
  oldColor = g._color;
  oldFill = g._fill;
  oldPattern = g._pattern;
  oldLineWidth = g._lineWidth;
  oldAlpha = g._alpha;
  oldScaleX = g._sx;
  oldScaleY = g._sy;

  vector = image;

  if (getVectorValue(data, vector, vector, 'visible', view) === false) {
    return;
  }

  g._color = color;
  v = getVectorValue(data, vector, vector, 'v', view);
  vc = v && v.length;
  width = (vector.w && getVectorValue(data, vector, vector, 'w')) || data.getWidth();
  height = (vector.h && getVectorValue(data, vector, vector, 'h')) || data.getHeight();
  sx = rect.width / width;
  sy = rect.height / height;
  if (inPattern === true) {
    g._fill = null;
    g._pattern = null;
    g._lineWidth = null;
    g._alpha = null;
  } else {
    g._sx = sx;
    g._sy = sy;
  }

  g.save();
  g.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
  (sx !== 1 || sy !== 1) && g.scale(sx, sy);
  if (vector.origin) {
    g.translate((vector.origin.x - 0.5) * width, (vector.origin.y - 0.5) * height);
  }
  g._vector = vector;
  if (vector.clip) {
    g.beginPath();
    if (vector.clip === true) {
      g.rect(-(vector.origin ? vector.origin.x : 0.5) * width, -(vector.origin ? vector.origin.y : 0.5) * height, width, height);
    } else {
      if (vector.clip.length) {
        vector.clip.forEach(function (shapeData) {
          g.drawShape(shapeData);
        });
      } else {
        g.drawShape(vector.clip);
      }
    }
    g.clip();
  }
  setCanvasStyle(data, vector, vector, g, view);
  for (i = 0, vc = v.length; i < vc; i++) {
    shapeData = v[i];
    g._shapeData = shapeData;
    if (view) {
      view._shapeDataIndex = i;
      if (shapeData.animate) {
        refreshAnimate(shapeData, vector, data, view);
      }
    }
    state = getVectorValue(data, vector, shapeData, 'state', view);
    if (getVectorValue(data, vector, shapeData, 'visible', view) !== false &&
        (!state || (Array.isArray(state) ? (state.indexOf(shapeState) >= 0) : (state === shapeState)))) {
      f = shapeFunction[shapeData.shape];
      if (f) {
        g.save();
        if (shapeData.shape === 'vector' || shapeData.shape === 'g') {
          f(g, shapeData, data, view);
        } else {
          setCanvasStyle(data, vector, shapeData, g, view, function () {
            f(g, shapeData, data, view);
          });
        }
        g.restore();
      }
    }
    view && (view._shapeDataIndex = null);
    g._shapeData = null;
  }
  g.restore();

  g._vector = oldVector;
  g._shapeData = null;
  g._color = oldColor;
  g._fill = oldFill;
  g._pattern = oldPattern;
  g._lineWidth = oldLineWidth;
  g._alpha = oldAlpha;
  g._sx = oldScaleX;
  g._sy = oldScaleY;
};

var fillPattern = function fillPattern (g, pattern, rect, data, view) {
  var x, y, w, h, hc, vc, i, j, imageAsset,
    vector = g._vector,
    origin = vector.origin,
    vw = (vector.w && getVectorValue(data, vector, vector, 'w')) || data.getWidth(),
    vh = (vector.h && getVectorValue(data, vector, vector, 'h')) || data.getHeight();
  if (typeof pattern === 'string') {
    imageAsset = _twaver.images[pattern];
    if (imageAsset) {
      w = imageAsset.getWidth();
      h = imageAsset.getHeight();
    }
  } else {
    w = pattern.w && getVectorValue(data, pattern, pattern, 'w');
    h = pattern.h && getVectorValue(data, pattern, pattern, 'h');
  }
  if (!w || !h || !rect) {
    return;
  }
  hc = rect.w / w * g._sx;
  vc = rect.h / h * g._sy;
  x = rect.x - vw / 2 * (g._sx - 1);
  y = rect.y - vh / 2 * (g._sy - 1);
  if (origin) {
    x -= (origin.x - 0.5) * vw * (g._sx - 1);
    y -= (origin.y - 0.5) * vh * (g._sy - 1);
  }
  if (g._sx !== 1 || g._sy !== 1) {
    g.scale(1 / g._sx, 1 / g._sy);
    x += ((origin ? origin.x : 0.5) * vw + rect.x) * (g._sx - 1);
    y += ((origin ? origin.x : 0.5) * vh + rect.y) * (g._sy - 1);
  }
  rect = { x: 0, y: 0, width: w, height: h };
  for (i = 0; i < hc; i++) {
    for (j = 0; j < vc; j++) {
      rect.x = i * w + x;
      rect.y = j * h + y;
      drawImage(g, pattern, null, rect, data, view, true);
    }
  }
};

var shapeFunction = {
  line: function (g, shapeData, data, view) {
    var p1 = getVectorValue(data, g._vector, shapeData, 'p1', view),
      p2 = getVectorValue(data, g._vector, shapeData, 'p2', view),
      x1, y1, x2, y2;
    if (p1) {
      x1 = getHStringValue(p1.length ? p1[0] : p1.x, g);
      y1 = getVStringValue(p1.length ? p1[1] : p1.y, g);
    } else {
      x1 = getVectorValue(data, g._vector, shapeData, 'x1', view, true);
      y1 = getVectorValue(data, g._vector, shapeData, 'y1', view, false);
    }
    if (p2) {
      x2 = getHStringValue(p2.length ? p2[0] : p2.x, g);
      y2 = getVStringValue(p2.length ? p2[1] : p2.y, g);
    } else {
      x2 = getVectorValue(data, g._vector, shapeData, 'x2', view, true);
      y2 = getVectorValue(data, g._vector, shapeData, 'y2', view, false);
    }
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
  },
  rect: function (g, shapeData, data, view) {
    var rect = getVectorValue(data, g._vector, shapeData, 'rect', view),
      r = getVectorValue(data, g._vector, shapeData, 'r', view),
      x, y, w, h;
    if (rect) {
      if (Array.isArray(rect)) {
        x = rect[0];
        y = rect[1];
        w = rect[2];
        h = rect[3];
      } else {
        x = rect.x;
        y = rect.y;
        w = rect.w;
        h = rect.h;
      }
      x = getHStringValue(x, g);
      y = getVStringValue(y, g);
      w = getHStringValue(w, g);
      h = getVStringValue(h, g);
    } else {
      x = getVectorValue(data, g._vector, shapeData, 'x', view, true);
      y = getVectorValue(data, g._vector, shapeData, 'y', view, false);
      w = getVectorValue(data, g._vector, shapeData, 'w', view, true);
      h = getVectorValue(data, g._vector, shapeData, 'h', view, false);
    }
    g.drawRoundRect(x, y, w, h, r);
    if (g._gradientFunc || g._pattern) {
      g._rect = { x: x, y: y, w: w, h: h };
    }
  },
  circle: function (g, shapeData, data, view) {
    var cx = getVectorValue(data, g._vector, shapeData, 'cx', view, true),
      cy = getVectorValue(data, g._vector, shapeData, 'cy', view, false),
      w = (g._vector.w && getVectorValue(data, g._vector, g._vector, 'w')) || data.getWidth(),
      h = (g._vector.h && getVectorValue(data, g._vector, g._vector, 'h')) || data.getHeight(),
      r = getStringValue(getVectorValue(data, g._vector, shapeData, 'r', view), Math.min(w, h), shapeData, g._vector),
      startAngle = getVectorValue(data, g._vector, shapeData, 'startAngle', view),
      endAngle = getVectorValue(data, g._vector, shapeData, 'endAngle', view),
      anticlockwise = getVectorValue(data, g._vector, shapeData, 'anticlockwise', view),
      close = getVectorValue(data, g._vector, shapeData, 'close', view);
    startAngle == null && (startAngle = 0);
    endAngle == null && (endAngle = 360);
    anticlockwise == null && (anticlockwise = false);
    if (close) {
      g.moveTo(cx, cy);
    }
    g.arc(cx, cy, r, startAngle / 180 * Math.PI, endAngle / 180 * Math.PI, anticlockwise);
    if (close) {
      g.closePath();
    }
    if (g._gradientFunc || g._pattern) {
      g._rect = { x: cx - r, y: cy - r, w: r * 2, h:  r * 2 };
    }
  },
  ellipse: function (g, shapeData, data, view) {
    var cx = getVectorValue(data, g._vector, shapeData, 'cx', view, true),
      cy = getVectorValue(data, g._vector, shapeData, 'cy', view, false),
      rx = getVectorValue(data, g._vector, shapeData, 'rx', view, true),
      ry = getVectorValue(data, g._vector, shapeData, 'ry', view, false),
      startAngle = getVectorValue(data, g._vector, shapeData, 'startAngle', view),
      endAngle = getVectorValue(data, g._vector, shapeData, 'endAngle', view),
      anticlockwise = getVectorValue(data, g._vector, shapeData, 'anticlockwise', view),
      close = getVectorValue(data, g._vector, shapeData, 'close', view);
    startAngle == null && (startAngle = 0);
    endAngle == null && (endAngle = 360);
    anticlockwise == null && (anticlockwise = false);
    if (close) {
      g.moveTo(cx, cy);
    }
    g.ellipse(cx, cy, rx, ry, 0, startAngle / 180 * Math.PI, endAngle / 180 * Math.PI, anticlockwise);
    if (close) {
      g.closePath();
    }
    if (g._gradientFunc || g._pattern) {
      g._rect = { x: cx - rx, y: cy - ry, w: rx * 2, h:  ry * 2 };
    }
  },
  path: function (g, shapeData, data, view) {
    var d = getVectorValue(data, g._vector, shapeData, 'data', view);
    g.drawPath(d);
  },
  text: function (g, shapeData, data, view) {
    var text = getVectorValue(data, g._vector, shapeData, 'text', view),
      x = getVectorValue(data, g._vector, shapeData, 'x', view, true),
      y = getVectorValue(data, g._vector, shapeData, 'y', view, false),
      maxWidth = getVectorValue(data, g._vector, shapeData, 'w', view, true);
    if (text == null) {
      return;
    }
    text = String(text);
    var paragraphs = text.split('\n'),
      lineHeight = g.measureText('e').width * 2,
      size = getTextSize(g, text, maxWidth);
    y -= ((size.h / lineHeight) - 1 ) / 2 * lineHeight;
    // TODO _rect
    paragraphs.forEach(function (paragraph) {
      if (maxWidth) {
        var words = paragraph.split(' '),
          length = words.length,
          line = '',
          word, tempLine, i, tempWidth, j;
        for (i = 0; i < length; i++) {
          word = words[i] + (i === length -1 ? '': ' ');
          tempLine = line + word;
          tempWidth = g.measureText(tempLine).width;
          if (tempWidth < maxWidth) {
            line = tempLine;
          } else if (tempWidth == maxWidth) {
            g.fillText(line, x, y);
            line = '';
            y += lineHeight;
          } else {
            for (j = 0; j < word.length; j++) {
              tempLine = line + word.substr(0, j + 1);
              if (g.measureText(tempLine).width > maxWidth) {
                g.fillText(tempLine.substring(0, tempLine.length - 1), x, y);
                line = word.substring(j, word.length);
                y += lineHeight;
                break;
              }
            }
            while (line.length > 0 && g.measureText(line).width > maxWidth) {
              for (j = 0; j < line.length; j++) {
                tempLine = line.substr(0, j + 1);
                if (g.measureText(tempLine).width > maxWidth) {
                  g.fillText(line.substr(0, j), x, y);
                  line = line.substring(j, line.length);
                  y += lineHeight;
                  break;
                }
              }
            }
          }
        }
        g.fillText(line, x, y);
      } else {
        g.fillText(paragraph, x, y);
      }
      y += lineHeight;
    });
  },
  draw: function (g, shapeData, data, view) {
    var draw = shapeData.draw,
      match, source;
    if (typeof draw === 'string') {
      if (match = draw.match(bindingPattern_evaluate)) {
        source = 'with(data) { ' + match[1] + ' }';
        //try {
          draw = new Function('g', 'data', 'view', source);
        //} catch (e) {
          //console.log(e);
        //}
      } else {
        draw = drawFunctionCache[draw];
      }
    }
    (typeof draw === 'function') && draw.call(g._vector, g, data, view);
  },
  vector: function (g, shapeData, data, view) {
    var vector = g._vector,
      vectorName = getVectorValue(data, vector, shapeData, 'name', view),
      x = getVectorValue(data, vector, shapeData, 'x', view, true),
      y = getVectorValue(data, vector, shapeData, 'y', view, false),
      w = getVectorValue(data, vector, shapeData, 'w', view),
      h = getVectorValue(data, vector, shapeData, 'h', view),
      i, childShapeData, f, oldLineWidth, oldFill, oldAlpha, originShapeData, imageAssert, v, c, ow, oh, oldShapeData;
    if (typeof vectorName === 'string') {
      imageAssert = _twaver.images[vectorName];
      originShapeData = imageAssert && imageAssert._image;
    } else {
      originShapeData = vectorName;
    }
    if (originShapeData) {
      if (isImage(originShapeData)) {
        if (w != null && h != null) {
          g.drawImage(originShapeData, x, y, getHStringValue(w, g), getVStringValue(h, g));
        } else {
          g.drawImage(originShapeData, x, y);
        }
      } else {
        v = getVectorValue(data, originShapeData, originShapeData, 'v', view);
        c = v && v.length;
        ow = originShapeData.w && getVectorValue(data, originShapeData, originShapeData, 'w');
        oh = originShapeData.h && getVectorValue(data, originShapeData, originShapeData, 'h');
        if (w != null && h != null) {
          w = getHStringValue(w, g);
          h = getVStringValue(h, g);
        } else {
          w = ow;
          h = oh;
        }
        g.save();
        oldLineWidth = g._lineWidth;
        oldFill = g._fill;
        oldAlpha = g._alpha;
        setCanvasStyle(data, originShapeData, originShapeData, g, view);
        setCanvasStyle(data, vector, shapeData, g, view);
        g.translate(x, y);
        g.scale(w / ow, h / oh);
        if (originShapeData.origin) {
          g.translate((originShapeData.origin.x - 0.5) * ow, (originShapeData.origin.y - 0.5) * oh);
        }
        if (originShapeData.clip) {
          g.beginPath();
          if (originShapeData.clip === true) {
            g.rect(-(originShapeData.origin ? originShapeData.origin.x : 0.5) * ow, -(originShapeData.origin ? originShapeData.origin.y : 0.5) * oh, ow, oh);
          } else {
            if (originShapeData.clip.length) {
              originShapeData.clip.forEach(function (shapeData) {
                g.drawShape(shapeData);
              });
            } else {
              g.drawShape(originShapeData.clip);
            }
          }
          g.clip();
        }
        oldShapeData = g._shapeData;
        g._vector = originShapeData;
        for (i = 0; i < c; i++) {
          childShapeData = v[i];
          g._shapeData = childShapeData;
          if (view) {
            if (view._shapeDataIndex.length) {
              view._shapeDataIndex.push(i);
            } else {
              view._shapeDataIndex = [ view._shapeDataIndex, i ];
            }
            if (childShapeData.animate) {
              refreshAnimate(childShapeData, vector, data, view);
            }
          }
          if (getVectorValue(data, originShapeData, childShapeData, 'visible', view) !== false) {
            f = shapeFunction[childShapeData.shape];
            if (f) {
              g.save();
              if (childShapeData.shape === 'vector' || childShapeData.shape === 'g') {
                f(g, childShapeData, data, view);
              } else {
                setCanvasStyle(data, originShapeData, childShapeData, g, view, function () {
                  f(g, childShapeData, data, view);
                });
              }
              g.restore();
            }
          }
          if (view) {
            view._shapeDataIndex.pop();
          }
        }
        g._vector = vector;
        g._shapeData = oldShapeData;
        g._lineWidth = oldLineWidth;
        g._fill = oldFill;
        g._alpha = oldAlpha;
        g.restore();
      }
    }
  },
  g: function (g, shapeData, data, view) {
    var v = getVectorValue(data, g._vector, shapeData, 'v', view),
      f, oldLineWidth, oldFill, oldAlpha, oldShapeData;
    if (v && v.length) {
      g.save();
      oldLineWidth = g._lineWidth;
      oldFill = g._fill;
      oldAlpha = g._alpha;
      oldShapeData = g._shapeData;
      setCanvasStyle(data, g._vector, shapeData, g, view);
      v.forEach(function (shapeData) {
        if (getVectorValue(data, g._vector, shapeData, 'visible', view) !== false) {
          f = shapeFunction[shapeData.shape];
          if (f) {
            g.save();
            g._shapeData = shapeData;
            if (shapeData.shape === 'vector' || shapeData.shape === 'g') {
              f(g, shapeData, data, view);
            } else {
              setCanvasStyle(data, g._vector, shapeData, g, view, function () {
                f(g, shapeData, data, view);
              });
            }
            g.restore();
          }
        }
      });
      g._lineWidth = oldLineWidth;
      g._fill = oldFill;
      g._alpha = oldAlpha;
      g._shapeData = oldShapeData;
      g.restore();
    }
  }
};

function getTextSize (g, text, maxWidth) {
  var width = 0,
    height = 0,
    paragraphs = text.split('\n'),
    lineHeight = g.measureText('e').width * 2;
  paragraphs.forEach(function (paragraph) {
    if (maxWidth) {
      var words = paragraph.split(' '),
        length = words.length,
        line = '',
        word, tempLine, i, tempWidth, j;
      for (i = 0; i < length; i++) {
        word = words[i] + (i === length -1 ? '': ' ');
        tempLine = line + word;
        tempWidth = g.measureText(tempLine).width;
        if (tempWidth < maxWidth) {
          line = tempLine;
        } else if (tempWidth == maxWidth) {
          line = '';
          height += lineHeight;
        } else {
          for (j = 0; j < word.length; j++) {
            tempLine = line + word.substr(0, j + 1);
            if (g.measureText(tempLine).width > maxWidth) {
              line = word.substring(j, word.length);
              height += lineHeight;
              break;
            }
          }
          while (line.length > 0 && g.measureText(line).width > maxWidth) {
            for (j = 0; j < line.length; j++) {
              tempLine = line.substr(0, j + 1);
              if (g.measureText(tempLine).width > maxWidth) {
                line = line.substring(j, line.length);
                height += lineHeight;
                break;
              }
            }
          }
        }
      }
    } else {
      tempWidth = g.measureText(paragraph).width;
      width = tempWidth > width ? tempWidth : width;
    }
    height += lineHeight;
  });
  width = maxWidth ? maxWidth : width;
  return { w: width, h: height };
}

shapeFunction.image = shapeFunction.vector;
var nativeShapeKeys = Object.keys(shapeFunction);

var pathFunction = {
  M: function (g, seg) {
    g.moveTo(seg.x, seg.y);
    g._path_start = seg;
    g._rect && getMaxRect(g._rect, seg.x, seg.y);
    return seg;
  },
  m: function (g, seg, pre) {
    if (pre) {
      seg = { x: pre.x + seg.x, y: pre.y + seg.y };
    }
    g.moveTo(seg.x, seg.y);
    g._path_start = seg;
    g._rect && getMaxRect(g._rect, seg.x, seg.y);
    return seg;
  },
  Z: function (g) {
    g.closePath();
    return g._path_start;
  },
  z: function (g) {
    g.closePath();
    return g._path_start;
  },
  L: function (g, seg) {
    g.lineTo(seg.x, seg.y);
    g._rect && getMaxRect(g._rect, seg.x, seg.y);
    return seg;
  },
  l: function (g, seg, pre) {
    var point = { x: pre.x + seg.x, y: pre.y + seg.y };
    g.lineTo(point.x, point.y);
    g._rect && getMaxRect(g._rect, point.x, point.y);
    return point;
  },
  H: function (g, seg, pre) {
    var point = { x: seg.x, y: pre.y };
    g.lineTo(point.x, point.y);
    g._rect && getMaxRect(g._rect, point.x, point.y);
    return point;
  },
  h: function (g, seg, pre) {
    var point = { x: pre.x + seg.x, y: pre.y };
    g.lineTo(point.x, point.y);
    g._rect && getMaxRect(g._rect, point.x, point.y);
    return point;
  },
  V: function (g, seg, pre) {
    var point = { x: pre.x, y: seg.y };
    g.lineTo(point.x, point.y);
    g._rect && getMaxRect(g._rect, point.x, point.y);
    return point;
  },
  v: function (g, seg, pre) {
    var point = { x: pre.x, y: pre.y + seg.y };
    g.lineTo(point.x, point.y);
    g._rect && getMaxRect(g._rect, point.x, point.y);
    return point;
  },
  Q: function (g, seg) {
    // quadraticCurveTo(cpx, cpy, x, y)
    g._preQ_x = seg.x1;
    g._preQ_y = seg.y1;
    g.quadraticCurveTo(seg.x1, seg.y1, seg.x, seg.y);
    if (g._rect) {
      getMaxRect(g._rect, seg.x1, seg.y1);
      getMaxRect(g._rect, seg.x, seg.y);
    }
    return seg;
  },
  q: function (g, seg, pre) {
    // quadraticCurveTo(cpx, cpy, x, y)
    var point = { x: pre.x + seg.x, y: pre.y + seg.y },
      p1_x = g._preQ_x = pre.x + seg.x1,
      p1_y = g._preQ_y = pre.y + seg.y1;
    g.quadraticCurveTo(p1_x, p1_y, point.x, point.y);
    if (g._rect) {
      getMaxRect(g._rect, p1_x, p1_y);
      getMaxRect(g._rect, point.x, point.y);
    }
    return point;
  },
  T: function (g, seg, pre) {
    var x1 = g._preQ_x = 2 * pre.x - g._preQ_x,
      y1 = g._preQ_y = 2 * pre.y - g._preQ_y;
    g.quadraticCurveTo(x1, y1, seg.x, seg.y);
    if (g._rect) {
      getMaxRect(g._rect, x1, y1);
      getMaxRect(g._rect, seg.x, seg.y);
    }
    return seg;
  },
  t: function (g, seg, pre) {
    // quadraticCurveTo(cpx, cpy, x, y)
    var point = { x: pre.x + seg.x, y: pre.y + seg.y },
      x1 = g._preQ_x = 2 * pre.x - g._preQ_x,
      y1 = g._preQ_y = 2 * pre.y - g._preQ_y;
    g.quadraticCurveTo(x1, y1, point.x, point.y);
    if (g._rect) {
      getMaxRect(g._rect, x1, y1);
      getMaxRect(g._rect, point.x, point.y);
    }
    return point;
  },
  C: function (g, seg) {
    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    g._preC_x = seg.x2;
    g._preC_y = seg.y2;
    g.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y);
    if (g._rect) {
      getMaxRect(g._rect, seg.x1, seg.y1);
      getMaxRect(g._rect, seg.x2, seg.y2);
      getMaxRect(g._rect, seg.x, seg.y);
    }
    return seg;
  },
  c: function (g, seg, pre) {
    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    var point = { x: pre.x + seg.x, y: pre.y + seg.y },
      p1_x = pre.x + seg.x1,
      p1_y = pre.y + seg.y1,
      p2_x = g._preC_x = pre.x + seg.x2,
      p2_y = g._preC_y = pre.y + seg.y2;
    g.bezierCurveTo(p1_x, p1_y, p2_x, p2_y, point.x, point.y);
    if (g._rect) {
      getMaxRect(g._rect, p1_x, p1_y);
      getMaxRect(g._rect, p2_x, p2_y);
      getMaxRect(g._rect, point.x, point.y);
    }
    return point;
  },
  S: function (g, seg, pre) {
    var x1 = 2 * pre.x - g._preC_x,
      y1 = 2 * pre.y - g._preC_y;
    g._preC_x = seg.x2;
    g._preC_y = seg.y2;
    g.bezierCurveTo(x1, y1, seg.x2, seg.y2, seg.x, seg.y);
    if (g._rect) {
      getMaxRect(g._rect, x1, y1);
      getMaxRect(g._rect, seg.x2, seg.y2);
      getMaxRect(g._rect, seg.x, seg.y);
    }
    return seg;
  },
  s: function (g, seg, pre) {
    var point = { x: pre.x + seg.x, y: pre.y + seg.y },
      x1 = 2 * pre.x - g._preC_x,
      y1 = 2 * pre.y - g._preC_y,
      p2_x = g._preC_x = pre.x + seg.x2,
      p2_y = g._preC_y = pre.y + seg.y2;
    g.bezierCurveTo(x1, y1, p2_x, p2_y, point.x, point.y);
    if (g._rect) {
      getMaxRect(g._rect, x1, y1);
      getMaxRect(g._rect, p2_x, p2_y);
      getMaxRect(g._rect, point.x, point.y);
    }
    return point;
  },
  //TODO A,a
};

var setCanvasStyle = function (data, vector, shapeData, g, view, cb) {
  var line = getVectorValue(data, vector, shapeData, 'line', view),
    fill = getVectorValue(data, vector, shapeData, 'fill', view),
    fillRule = getVectorValue(data, vector, shapeData, 'fillRule', view) || 'nonzero', // 'nonzero', 'evenodd'
    gradient = getVectorValue(data, vector, shapeData, 'gradient', view),
    gradientColor = getVectorValue(data, vector, shapeData, 'gradientColor', view),
    pattern = getVectorValue(data, vector, shapeData, 'pattern', view),
    font = getVectorValue(data, vector, shapeData, 'font', view),
    textAlign = getVectorValue(data, vector, shapeData, 'textAlign', view) || 'center',
    textBaseline = getVectorValue(data, vector, shapeData, 'textBaseline', view) || 'middle',
    translate = getVectorValue(data, vector, shapeData, 'translate', view),
    rotate = getVectorValue(data, vector, shapeData, 'rotate', view),
    rotateOrigin = getVectorValue(data, vector, shapeData, 'rotateOrigin', view),
    scale = getVectorValue(data, vector, shapeData, 'scale', view),
    transform = getVectorValue(data, vector, shapeData, 'transform', view),
    alpha = getVectorValue(data, vector, shapeData, 'alpha', view),
    oldLineWidth = g._lineWidth,
    oldFill = g._fill,
    oldPattern = g._pattern,
    oldAlpha = g._alpha,
    oldGradientFunc = g._gradientFunc,
    lineColor, lineWidth, lineCap, lineJoin, miterLimit, lineDash, lineDashOffset, rect, gradientFunc, scaleX, scaleY, translateX, translateY;
  if (line) {
    lineColor = line.color;
    lineWidth = line.width;
    lineCap = line.cap;
    lineJoin = line.join;
    miterLimit = line.miterLimit;
    lineDash = line.dash;
    lineDashOffset = line.dashOffset;
  } else {
    lineColor = getVectorValue(data, vector, shapeData, 'lineColor', view),
    lineWidth = getVectorValue(data, vector, shapeData, 'lineWidth', view),
    lineCap = getVectorValue(data, vector, shapeData, 'lineCap', view),
    lineJoin = getVectorValue(data, vector, shapeData, 'lineJoin', view),
    miterLimit = getVectorValue(data, vector, shapeData, 'miterLimit', view),
    lineDash = getVectorValue(data, vector, shapeData, 'lineDash', view),
    lineDashOffset = getVectorValue(data, vector, shapeData, 'lineDashOffset', view);
  }
  lineColor != null && (g.strokeStyle = getFilterColor(lineColor, g._color));
  lineWidth != null && (g.lineWidth = g._lineWidth = (view && view.getSizeZoom ? lineWidth / view.getSizeZoom() : lineWidth));
  lineCap != null && (g.lineCap = lineCap);
  lineJoin != null && (g.lineJoin = lineJoin);
  miterLimit != null && (g.miterLimit = miterLimit);
  if (lineDash != null) {
    g.lineDash = lineDash;
    g.setLineDash(lineDash);
  }
  lineDashOffset != null && (g.lineDashOffset = lineDashOffset);
  if (pattern) {
    g._pattern = pattern;
  } else {
    fill && (g.fillStyle = g._fill = getFilterColor(fill, g._color));

    if (gradient) {
      if (typeof gradient === 'string') {
        gradientFunc = gradient_types[gradient];
      } else {
        gradientFunc = gradient_types[gradient.type];
        gradient.color && (gradientColor = gradient.color);
        if (!gradientFunc) {
          gradient = parseGradient(gradient, g);
        }
      }
      g._gradientFunc = gradientFunc;
    }
  }

  font != null && (g.font = font);
  textAlign != null && (g.textAlign = textAlign);
  textBaseline != null && (g.textBaseline = textBaseline);
  setCanvasShadowStyle(data, vector, shapeData, g, view);
  
  if (transform != null) {
    if (typeof transform === 'string') {
      transform = parseTransform(transform);
    }
    if (transform.length) {
      transform.forEach(function (transform) {
        var type = transform[0];
        if (type === 'matrix') {
          g.transform(transform[1], transform[2], transform[3], transform[4], transform[5], transform[6]);
        } else if (type === 'translate') {
          g.translate(transform[1] || 0, transform[2] || 0);
        } else if (type === 'scale') {
          g.scale(transform[1] || 1, transform[2] || transform[1] || 1);
        } else if (type === 'rotate') {
          if (transform.length > 2) {
            g.translate(transform[2], transform[3]);
            g.rotate(transform[1]);
            g.translate(-transform[2], -transform[3]);
          } else {
            g.rotate(transform[1]);
          }
        } else if (type === 'skewX') {
          g.transform(1, 0, Math.tan(transform[1] * Math.PI / 180), 1, 0, 0);
        } else if (type === 'skewY') {
          g.transform(1, Math.tan(transform[1] * Math.PI / 180), 0, 1, 0, 0);
        }
      });
    }
  } else {
    if (translate != null) {
      if (Array.isArray(translate)) {
        translateX = translate[0];
        translateY = translate[1];
      } else if (typeof translate === 'object') {
        translateX = translate.x;
        translateY = translate.y;
      } else {
        translateX = translate;
        translateY = 0;
      }
      translateX = getHStringValue(translateX, g);
      translateY = getVStringValue(translateY, g);
      if (translateX !== 0 || translateY !== 0) {
        g.translate(translateX, translateY);
      }
    }
    if (rotate != null && (rotate % 360) !== 0) {
      var rotateOriginX, rotateOriginY;
      if (rotateOrigin) {
        if (Array.isArray(rotateOrigin)) {
          rotateOriginX = rotateOrigin[0];
          rotateOriginY = rotateOrigin[1];
        } else if (typeof rotateOrigin === 'object') {
          rotateOriginX = rotateOrigin.x;
          rotateOriginY = rotateOrigin.y;
        } else {
          rotateOriginX = rotateOriginY = rotateOrigin;
        }
        rotateOriginX = getHStringValue(rotateOriginX, g);
        rotateOriginY = getVStringValue(rotateOriginY, g);
        if (rotateOriginX !== 0 || rotateOriginY !== 0) {
          g.translate(rotateOriginX, rotateOriginY);
        }
      }
      g.rotate(rotate * Math.PI / 180);
      if (rotateOrigin) {
        if (rotateOriginX !== 0 || rotateOriginY !== 0) {
          g.translate(-rotateOriginX, -rotateOriginY);
        }
      }
    }
    if (scale != null) {
      if (Array.isArray(scale)) {
        scaleX = scale[0];
        scaleY = scale[1];
      } else if (typeof scale === 'object') {
        scaleX = scale.x;
        scaleY = scale.y;
      } else {
        scaleX = scaleY = scale;
      }
      if (scaleX !== 1 || scaleY !== 1) {
        g.scale(scaleX, scaleY);
      }
    }
  }
  
  if (alpha != null) {
    g.globalAlpha = g._alpha = oldAlpha != null ? oldAlpha * alpha : alpha;
  }
  
  if (cb) {
    g.beginPath();
    cb();
    rect = g._rect || shapeData.rect;
    if (g._pattern) {
      g._lineWidth > 0 && g.stroke();
      g.clip();
      fillPattern(g, g._pattern, rect, data, view);
    } else {
      if (gradientFunc && rect) {
        gradient = gradientFunc(g, getFilterColor(fill || '#000000', g._color),
                                getFilterColor(gradientColor || '#FFFFFF', g._color), rect.x, rect.y, rect.w, rect.h);
      }
      gradient && (g.fillStyle = g._fill = gradient);
      g._fill && g.fill(fillRule);
      g._lineWidth > 0 && g.stroke();
    }

    g._lineWidth = oldLineWidth;
    g._fill = oldFill;
    g._pattern = oldPattern;
    g._alpha = oldAlpha;
    g._gradientFunc = oldGradientFunc;
    g._rect = null;
  }
};

var setCanvasShadowStyle = function (data, vector, shapeData, g, view) {
  var shadow = getVectorValue(data, vector, shapeData, 'shadow', view),
    shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor;
  if (shadow) {
    shadowOffsetX = shadow.offsetX;
    shadowOffsetY = shadow.offsetY;
    shadowBlur = shadow.blur;
    shadowColor = shadow.color;
  } else {
    shadowOffsetX = getVectorValue(data, vector, shapeData, 'shadowOffsetX', view);
    shadowOffsetY = getVectorValue(data, vector, shapeData, 'shadowOffsetY', view);
    shadowBlur = getVectorValue(data, vector, shapeData, 'shadowBlur', view);
    shadowColor = getVectorValue(data, vector, shapeData, 'shadowColor', view);
  }
  shadowOffsetX != null && (g.shadowOffsetX = shadowOffsetX);
  shadowOffsetY != null && (g.shadowOffsetY = shadowOffsetY);
  shadowBlur != null && (g.shadowBlur = shadowBlur);
  shadowColor != null && (g.shadowColor = shadowColor);
};

var bindingPattern_interpolate = /<%=([\s\S]+?)%>/;
var bindingPattern_evaluate = /<%([\s\S]+?)%>/;
var bindingPattern = new RegExp([bindingPattern_interpolate.source, bindingPattern_evaluate.source].join('|'));
var getVectorValue = function (data, vector, shapeData, prop, view, h, withAnimate) {
  var value = shapeData[prop],
    type = typeof value,
    match, source, f, vw, vh;
  if (type === 'string' && (match = value.match(bindingPattern))) {
    // TODO replace a@attr,s@attr,c@attr to attr(),s('attr'),c('attr')
    source = 'with(data) { ' + (match[1] ? 'return ' + match[1] : match[2]) + ' }';
    //try {
      f = new Function('data', 'view', source);
      value = f.call(vector, data, view);
    //} catch (e) {
      //console.log(e);
    //}
  } else if (type === 'function') {
    value = value.call(vector, data, view);
  }
  if (h === true) {
    vw = (vector.w && getVectorValue(data, vector, vector, 'w')) || data.getWidth();
    if ((shapeData.rel === true || (shapeData.rel === undefined && vector.rel)) && value <= 1 && value >= -1) {
      value = value * vw;
    } else if (typeof value === 'string') {
      value = parseInt(value) / 100 * vw;
    }
    value = value || 0;
  } else if (h === false) {
    vh = (vector.h && getVectorValue(data, vector, vector, 'h')) || data.getHeight();
    if ((shapeData.rel === true || (shapeData.rel === undefined && vector.rel)) && value <= 1 && value >= -1) {
      value = value * vh;
    } else if (typeof value === 'string') {
      value = parseInt(value) / 100 * vh;
    }
    value = value || 0;
  }
  if (withAnimate !== false && view && data && shapeData.animate && data._animates) {
    var animates = data._animates,
      shapeDataIndex = view._shapeDataIndex,
      index;
    if (shapeDataIndex.length) {
      for (var i=0; i<shapeDataIndex.length; i++) {
        index = shapeDataIndex[i];
        animates = animates[index];
      }
    } else {
      index = shapeDataIndex;
    }
    var animate = animates[index],
      animateItem = animate[prop];
    if (animateItem) {
      if (Array.isArray(animateItem)) {
        for (var i = animateItem.length - 1; i >= 0; i--) {
          var item = animateItem[i];
          if (item.stopped || item.time > 0) {
            if (item.started) {
              return getAnimateValue(item, value);
            }
          }
        }
      } else {
        if (animateItem.started) {
          return getAnimateValue(animateItem, value);
        }
      }
    }
  }
  return value;
};

var getHStringValue = function (value, g) {
  if (!value) {
    return 0;
  }
  var w = (g._vector.w && getVectorValue(g._data, g._vector, g._vector, 'w')) || g._data.getWidth();
  if (((g._shapeData && g._shapeData.rel === true) || ((!g._shapeData || g._shapeData.rel === undefined) && g._vector.rel)) && value <= 1 && value >= -1) {
    return value * w;
  }
  if (typeof value === 'string') {
    return parseInt(value) / 100 * w;
  }
  return value;
};

var getVStringValue = function (value, g) {
  if (!value) {
    return 0;
  }
  var h = (g._vector.h && getVectorValue(g._data, g._vector, g._vector, 'h')) || g._data.getHeight();
  if (((g._shapeData && g._shapeData.rel === true) || ((!g._shapeData || g._shapeData.rel === undefined) && g._vector.rel)) && value <= 1 && value >= -1) {
    return value * h;
  }
  if (typeof value === 'string') {
    return parseInt(value) / 100 * h;
  }
  return value;
};

var getStringValue = function (value, scale, shapeData, vector) {
  if (!value) {
    return 0;
  }
  if ((shapeData.rel === true || (shapeData.rel === undefined && vector.rel)) && value <= 1 && value >= -1) {
    return value * scale;
  }
  if (typeof value === 'string') {
    return parseInt(value) / 100 * scale;
  }
  return value;
};

var context_proto = (window.CanvasRenderingContext2D || Canvas.Context2d).prototype;
context_proto.drawShape = function (shapeData) {
  var g = this,
    vector = g._vector,
    oldShapeData = g._shapeData,
    data = g._data,
    view = g._view,
    f = shapeFunction[shapeData.shape];
  if (f) {
    g.save();
    g._shapeData = shapeData;
    if (shapeData.shape === 'vector' || shapeData.shape === 'g') {
      f(g, shapeData, data, view);
    } else {
      setCanvasStyle(data, vector, shapeData, g, view, function () {
        f(g, shapeData, data, view);
      });
    }
    g._shapeData = oldShapeData;
    g.restore();
  }
};
context_proto.drawPath = function (d) {
  var g = this,
    path, p, close, i, pre, seg, f, point, c, rect, x, y;
  if (typeof d === 'string') {
    d = parsePathOrPoints(d);
  }
  c = d ? d.length : 0;
  if (c <= 1) {
    return;
  }
  if (g._gradientFunc || g._pattern) {
    g._rect = rect = { x: 0, y: 0, w: 0, h: 0 };
  }
  path = d && d[0] && d[0].c;
  if (!path) {
    p = d && d[0] && d[0].x != null;
    close = d[c - 1] === 'z' || d[c - 1] === 'Z';
    if (close) {
      c--;
    }
  }
  if (path) {
    for (i = 0; i < c; i++) {
      seg = d[i];
      f = pathFunction[seg.c];
      f && (pre = f(g, seg, pre));
    }
    g._path_start = null;
    g._preC_x = null;
    g._preC_y = null;
    g._preQ_x = null;
    g._preQ_y = null;
  } else if (p) {
    point = d[0];
    x = getHStringValue(point.x, g);
    y = getVStringValue(point.y, g);
    g.moveTo(x, y);
    rect && getMaxRect(rect, x, y);
    for (i = 1; i < c; i++) {
      point = d[i];
      x = getHStringValue(point.x, g);
      y = getVStringValue(point.y, g);
      g.lineTo(x, y);
      rect && getMaxRect(rect, x, y);
    }
    close && g.closePath();
  } else {
    x = getHStringValue(d[0], g);
    y = getVStringValue(d[1], g);
    g.moveTo(x, y);
    rect && getMaxRect(rect, x, y);
    for (i = 2; i < c; i += 2) {
      x = getHStringValue(d[i], g);
      y = getVStringValue(d[i + 1], g);
      g.lineTo(x, y);
      rect && getMaxRect(rect, x, y);
    }
    close && g.closePath();
  }
  return d;
};

var getMaxRect = function (rect, x, y) {
  var x1 = Math.min(rect.x, x);
  var x2 = Math.max(rect.x + rect.w, x);
  var y1 = Math.min(rect.y, y);
  var y2 = Math.max(rect.y + rect.h, y);
  rect.x = x1;
  rect.y = y1;
  rect.w = x2 - x1;
  rect.h = y2 - y1;
};

context_proto._fillPath = function (color, d) {
  var g = this;
  g.beginPath();
  g.fillStyle = color;
  g.drawPath(d);
  g.fill();
};
context_proto._fillRect = function (color, x, y, w, h) {
  var g = this;
  g.beginPath();
  g.fillStyle = color;
  g.rect(x, y, w, h);
  g.fill();
};
if (!context_proto.ellipse) {
  // http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
  context_proto.ellipse = function (cx, cy, rx, ry) {
    var g = this,
      kappa = .5522848,
      ox = rx * kappa, // control point offset horizontal
      oy = ry * kappa, // control point offset vertical
      xe = cx + rx,    // x-end
      ye = cy + ry,    // y-end
      x = cx - rx,
      y = cy - ry;
    g.moveTo(x, cy);
    g.bezierCurveTo(x, cy - oy, cx - ox, y, cx, y);
    g.bezierCurveTo(cx + ox, y, xe, cy - oy, xe, cy);
    g.bezierCurveTo(xe, cy + oy, cx + ox, ye, cx, ye);
    g.bezierCurveTo(cx - ox, ye, x, cy + oy, x, cy);
  };
}

context_proto.drawRoundRect = function (x, y, width, height, r) {
  var g = this;
  if (!r) {
    g.rect(x, y, width, height);
    return;
  }

  var topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius;
  if (Array.isArray(r)) {
    if (r.length === 1) {
      topLeftRadius = topRightRadius = bottomLeftRadius = bottomRightRadius = r[0];
    } else if (r.length === 2) {
      topLeftRadius = topRightRadius = r[0];
      bottomLeftRadius = bottomRightRadius = r[1];
    } else if (r.length === 4) {
      topLeftRadius = r[0];
      topRightRadius = r[1];
      bottomLeftRadius = r[2];
      bottomRightRadius = r[3];
    } else {
      g.rect(x, y, width, height);
      return;
    }
  } else {
    topLeftRadius = topRightRadius = bottomLeftRadius = bottomRightRadius = r;
  }
  var xw = x + width;
  var yh = y + height;

  // Make sure none of the radius values are greater than w/h.
  // These are all inlined to avoid function calling overhead
  var minSize = width < height ? width * 2 : height * 2;
  topLeftRadius = topLeftRadius < minSize ? topLeftRadius : minSize;
  topRightRadius = topRightRadius < minSize ? topRightRadius : minSize;
  bottomLeftRadius = bottomLeftRadius < minSize ? bottomLeftRadius : minSize;
  bottomRightRadius = bottomRightRadius < minSize ? bottomRightRadius : minSize;
  
  // Math.sin and Math,tan values for optimal performance.
  // Math.rad = Math.PI / 180 = 0.0174532925199433
  // r * Math.sin(45 * Math.rad) =  (r * 0.707106781186547);
  // r * Math.tan(22.5 * Math.rad) = (r * 0.414213562373095);
  //
  // We can save further cycles by precalculating
  // 1.0 - 0.707106781186547 = 0.292893218813453 and
  // 1.0 - 0.414213562373095 = 0.585786437626905

  // bottom-right corner
  var a = bottomRightRadius * 0.292893218813453;   // radius - anchor pt;
  var s = bottomRightRadius * 0.585786437626905;   // radius - control pt;
  g.moveTo(xw, yh - bottomRightRadius);
  g.quadraticCurveTo(xw, yh - s, xw - a, yh - a);
  g.quadraticCurveTo(xw - s, yh, xw - bottomRightRadius, yh);

  // bottom-left corner
  a = bottomLeftRadius * 0.292893218813453;
  s = bottomLeftRadius * 0.585786437626905;
  g.lineTo(x + bottomLeftRadius, yh);
  g.quadraticCurveTo(x + s, yh, x + a, yh - a);
  g.quadraticCurveTo(x, yh - s, x, yh - bottomLeftRadius);

  // top-left corner
  a = topLeftRadius * 0.292893218813453;
  s = topLeftRadius * 0.585786437626905;
  g.lineTo(x, y + topLeftRadius);
  g.quadraticCurveTo(x, y + s, x + a, y + a);
  g.quadraticCurveTo(x + s, y, x + topLeftRadius, y);

  // top-right corner
  a = topRightRadius * 0.292893218813453;
  s = topRightRadius * 0.585786437626905;
  g.lineTo(xw - topRightRadius, y);
  g.quadraticCurveTo(xw - s, y, xw - a, y + a);
  g.quadraticCurveTo(xw, y + s, xw, y + topRightRadius);
  g.lineTo(xw, yh - bottomRightRadius);
};

var isImage = function (image) {
  return Canvas ? (image instanceof Canvas || image instanceof Image) : (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof HTMLVideoElement);
};
var drawFunctionCache = {};

var getDraw = function (name) {
  return drawFunctionCache[name];
};

var registerDraw = function (name, draw) {
  if (typeof draw === 'function') {
    drawFunctionCache[name] = draw;
  }
};

var getShape = function (name) {
  return shapeFunction[name];
};

var registerShape = function (name, shapeFunc) {
  if (typeof shapeFunc === 'function' && nativeShapeKeys.indexOf(name) < 0) {
    shapeFunction[name] = shapeFunc;
  }
};
