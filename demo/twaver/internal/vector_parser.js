var parsePathOrPoints = function (d) {
  if (d.trim()[0].match(/[mlhvcsqta]/i)) {
    return parsePath(d);
  } else {
    return parsePoints(d);
  }
};

var pointsCache = {};

var parsePoints = function (points) {
  var result = pointsCache[points];
  if (result) {
    return result;
  }
  pointsCache[points] = result = [];
  points.trim().split(' ').forEach(function (point) {
    point = point.split(',');
    if (point.length === 2) {
      result.push({
        x: parseFloat(point[0]),
        y: parseFloat(point[1])
      });
    } else {
      result.push(point[0]);
    }
  });
  return result;
};

var pathCache = {};
var pattern_path = /[mlhvcsqtaz][\d.,\-\s]*/gi;
var pattern_path_points = /-?(\d)+(\.(\d)+)?/g;

var parsePath = function (d) {
  var result = pathCache[d],
    match;
  if (result) {
    return result;
  }
  match = d.trim().match(pattern_path);
  pathCache[d] = result = [];
  if (match) {
    match.forEach(function (seg) {
      var c = seg[0],
        points = seg.match(pattern_path_points),
        length = points && points.length,
        i;
      result.push(seg = {
        c: c
      });
      if (length) {
        points.forEach(function (point, index) {
          points[index] = parseFloat(point);
        });
        switch (c) {
          case 'M':
          case 'm':
          case 'L':
          case 'l':
            for (i = 0; i < length; i += 2) {
              if (i !== 0) {
                result.push(seg = {
                  c: (c === 'M' || c === 'L') ? 'L' : 'l'
                });
              }
              seg.x = points[i];
              seg.y = points[i + 1];
            }
            break;
          case 'H':
          case 'h':
            for (i = 0; i < length; i ++) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.x = points[i];
            }
            break;
          case 'V':
          case 'v':
            for (i = 0; i < length; i ++) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.y = points[i];
            }
            break;
          case 'C':
          case 'c':
            for (i = 0; i < length; i += 6) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.x1 = points[i];
              seg.y1 = points[i + 1];
              seg.x2 = points[i + 2];
              seg.y2 = points[i + 3];
              seg.x = points[i + 4];
              seg.y = points[i + 5];
            }
            break;
          case 'S':
          case 's':
            for (i = 0; i < length; i += 4) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.x2 = points[i];
              seg.y2 = points[i + 1];
              seg.x = points[i + 2];
              seg.y = points[i + 3];
            }
            break;
          case 'Q':
          case 'q':
            for (i = 0; i < length; i += 4) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.x1 = points[i];
              seg.y1 = points[i + 1];
              seg.x = points[i + 2];
              seg.y = points[i + 3];
            }
            break;
          case 'T':
          case 't':
            for (i = 0; i < length; i += 2) {
              if (i !== 0) {
                result.push(seg = {
                  c: c
                });
              }
              seg.x = points[i];
              seg.y = points[i + 1];
            }
            break;
        }
      }
    });
  }
  return result;
};

var parseGradient = function (gradient, g) {
    var transform = gradient.transform && parseTransform(gradient.transform),
      matrix, point, result,
      x1, y1, x2, y2,
      fx, fy, cx, cy, r;
    if (transform && transform.length) {
      matrix = $Matrix.identity();
      transform.forEach(function (transform) {
        var type = transform[0];
        if (type === 'matrix') {
          matrix.multiply(new $Matrix(transform[1], transform[2], transform[3], transform[4], transform[5], transform[6]));
        } else if (type === 'translate') {
          matrix.translate(transform[1] || 0, transform[2] || 0);
        } else if (type === 'scale') {
          matrix.scale(transform[1] || 1, transform[2] || transform[1] || 1);
        } else if (type === 'rotate') {
          matrix.rotate(transform[1] || 0, transform[2] || 0, transform[3] || 0);
        } else if (type === 'skewX') {
          matrix.skew(transform[1] || 0, 0);
        } else if (type === 'skewY') {
          matrix.skew(0, transform[1] || 0);
        }
      });
    }
    if (gradient.type === 'linear') {
      x1 = gradient.x1 || 0;
      y1 = gradient.y1 || 0;
      x2 = gradient.x2 || 0;
      y2 = gradient.y2 || 0;
      if (matrix) {
        point = matrix.transform(x1, y1);
        x1 = point.x;
        y1 = point.y;
        point = matrix.transform(x2, y2);
        x2 = point.x;
        y2 = point.y;
      }
      result = g.createLinearGradient(x1, y1, x2, y2);
    } else if (gradient.type === 'radial') {
      fx = gradient.fx || 0;
      fy = gradient.fy || 0;
      cx = gradient.cx || 0;
      cy = gradient.cy || 0;
      r = gradient.r || 0;
      gradient.fx == null && (fx = cx);
      gradient.fy == null && (fy = cy);
      result = g.createRadialGradient(fx, fy, 0, cx, cy, r);
    }
    if (result) {
      gradient.stop && gradient.stop.length && gradient.stop.forEach(function (seg) {
        result.addColorStop(parseFloat(seg.offset), getFilterColor(seg.color, g._color));
      });
    }
  return result;
};

var parseTransform = function (text) {
  return text.replace(/[\s\r\t\n]+/gm, ' ').trim().replace(/\)(\s?,\s?)/g, ') ').split(/\s(?=[a-z])/).map(function (data) {
    return data.replace(')', '').trim().split(/\s*\(\s*|\s+,?\s*|,\s*/).map(function (data, i) {
      return i === 0 ? data : parseFloat(data);
    });
  });
};
