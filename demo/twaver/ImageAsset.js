twaver.ImageAsset = function (name, source, width, height, svg) {
    this._name = name;
    this._width = width;
    this._height = height;
    this._svg = svg;
    this._edgeData;

    if (typeof source === "string") {
        this._src = source;
    } else if (typeof source === "function") {
        this._func = source;
    } else if (isImage(source)) {
        this._image = source;
    } else if (typeof source === 'object') {
        this._image = source;
        this._width = source.w || source.width;
        this._height = source.h || source.height;
        if (source.cache !== false && isVectorCacheable(source)) {
            getPatternImages(name, source);
            this._cache = createVectorCanvas(source);
        }
    }
};
_twaver.ext('twaver.ImageAsset', Object, {
    getName: function () {
        return this._name;
    },
    getSrc: function () {
        return this._src;
    },
    isSvg: function () {
        return this._svg;
    },
    getImage: function (color, width, height) {
        if (!color || !this._image) {
            return this._image;
        }
        if (!this._map) {
            this._map = {};
        }
        var key;
        if (this._svg && arguments.length === 3) {
            key = color + ',' + width + ',' + height;
        } else {
            key = color;
        }
        var c = this._map[key];
        if (c) {
            return c;
        }
        c = _getImage(this._cache || this._image, getColorValue(color), this._svg ? width : this.getWidth(), this._svg ? height : this.getHeight());
        this._map[key] = c;
        return c;
    },
    getWidth: function () {
        return this._width;
    },
    getHeight: function () {
        return this._height;
    },
    getFunction: function () {
        return this._func;
    },
    _createEdgeData: function (image) {
        var samplingLimit = 300;
        var samplingScaleRate = samplingLimit / image.width;
        if (image.height < image.width) {
            samplingScaleRate = samplingLimit / image.height;
        }
        var samplingWidth = Math.floor(image.width * samplingScaleRate);
        var samplingHeight = Math.floor(image.height * samplingScaleRate);
        if (!this.tempCanvas) {
            this.tempCanvas = document.createElement("canvas");
            this.ctx = this.tempCanvas.getContext("2d");
        }
        this.tempCanvas.width = samplingWidth;
        this.tempCanvas.height = samplingHeight;
        this.ctx.clearRect(0, 0, samplingWidth, samplingHeight);
        this.ctx.drawImage(image, 0, 0, samplingWidth, samplingHeight);//paint with sampling size.
        var imgData = this.ctx.getImageData(0,0,samplingWidth,samplingHeight);

        var lastTransparent=true;
        var points=[];

        //horizontal edge scan
        for (var y=0, width=samplingWidth, height=samplingHeight; y<height;y++) {
            for (var x=0;x<width;x++) {
                var index=(y*width+x)*4;
                var transparent=this._isTransparentPoint(imgData.data, index);
                var edge=(lastTransparent!=transparent) || (!transparent && (x==0 || x==width-1));
                if(edge){
                    var offset=transparent ? 1 : 0;
                    points.push({"x":x-offset, "y":y});
                }
                lastTransparent=transparent;
            }
        }

        //vertical edge scan
        lastTransparent=true;
        for (var x=0, width=samplingWidth, height=samplingHeight;x<width;x++) {
            for (var y=0;y<height;y++) {
                var index=(y*width+x)*4;
                var transparent=this._isTransparentPoint(imgData.data, index);
                var edge=(lastTransparent!=transparent) || (!transparent && (y==0 || y==height-1));
                if(edge){
                    var offset=transparent ? 1 : 0;
                    points.push({"x":x, "y":y-offset});
                }
                lastTransparent=transparent;
            }
        }

        //filter points by angle.
        var centerX=width/2, centerY=height/2;
        var edgeData=[];
        for(var i=0;i<360;i++){
            edgeData.push({"x":centerX, "y":centerY, "dist":0});//init all edges to center.
        }
        //replace each edge by outsider edge.
        for(var i=0, total=points.length; i<total; i++){
            var point=points[i];
            var angle=this._getPointAngleDegree(point.x, point.y, centerX, centerY);
            var dist=this._getPointDist(point.x, point.y, centerX, centerY);
            if(edgeData[angle].dist<dist){
                edgeData[angle]={"x":point.x, "y":point.y, "dist":dist};
            }
        }
        //reset by sampling scale rate.
        for(var i=0, total=edgeData.length; i<total; i++){
            var edge=edgeData[i];
            edge.x=edge.x/samplingScaleRate;
            edge.y=edge.y/samplingScaleRate;
            delete edge.dist;//clear this distance var.
        }
        return edgeData;
    },
    _isTransparentPoint: function (data, index) {
        return (data[index] + data[index + 1] + data[index + 2] + data[index + 3]) == 0;
    },

    _getPointAngleDegree: function (x1, y1, x2, y2) {
        var xOffset = x2 - x1;
        var yOffset = y2 - y1;
        var angle = Math.atan2(yOffset, xOffset);
        angle = angle / Math.PI * 180;
        angle = parseInt(angle) + 180;
        angle = angle % 360;

        return angle;
    },

    _getPointDist: function (x1, y1, x2, y2) {
        var xOffset = x2 - x1;
        var yOffset = y2 - y1;
        return Math.sqrt(xOffset * xOffset + yOffset * yOffset);
    }
});
var color_cache = {};
var color_canvas = $html.createCanvas();
color_canvas.width = 1;
color_canvas.height = 1;
var color_g = color_canvas.getContext('2d');

var getColorValue = function (color) {
  color = color || 'black';
  var value = color_cache[color],
    data;
  if (!value) {
    color_g.clearRect(0, 0, 1, 1);
    color_g.fillStyle = color;
    color_g.fillRect(0, 0, 1, 1);
    data = color_g.getImageData(0, 0, 1, 1).data;
    value = color_cache[color] = { r: data[0], g: data[1], b: data[2], a: data[3] };
  }
  return value;
};

var getFilterColor = function (sourceColor, filterColor) {
    if (!filterColor) {
        return sourceColor;
    }
    filterColor = getColorValue(filterColor);
    sourceColor = getColorValue(sourceColor);
    if($Defaults.PIXEL_FILTER_FUNCTION) {
        var rgb = $Defaults.PIXEL_FILTER_FUNCTION(sourceColor, filterColor);
        return 'rgba(' +
          rgb.r + ',' + 
          rgb.g + ',' + 
          rgb.b + ',' + sourceColor.a + ')';
    }  
    return null;
};

var _getImage = function (image, color, width, height) {
    var c = $html.createCanvas(width, height);
    var g2 = c.getContext('2d');
    g2.drawImage(image, 0, 0, width, height);
    try {
        var imageData = g2.getImageData(0, 0, width, height);
        var pix = imageData.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            var sourceColor = {r: pix[i + 0], g: pix[i + 1], b: pix[i + 2]};
            var result = $Defaults.PIXEL_FILTER_FUNCTION(sourceColor, color);
            pix[i + 0] = result.r;
            pix[i + 1] = result.g;
            pix[i + 2] = result.b;
        }
        g2.putImageData(imageData, 0, 0);
    } catch (e) {
        return image;
    }
    return c;
};

var vector_pattern = {};
var add_vector_pattern = function (pattern, imageName) {
  if (pattern) {
    var type = typeof pattern;
    if (type === 'string') {
      if (!pattern.match(bindingPattern)) {
        if (!_twaver.images[pattern]) {
          (vector_pattern[pattern] || (vector_pattern[pattern] = [])).push(imageName);
        }
      }
    }
  }
};
var getPatternImages = function (imageName, image) {
  image.pattern && add_vector_pattern(image.pattern, imageName);
  image.v && image.v.forEach(function (shape) {
    shape.pattern && add_vector_pattern(shape.pattern, imageName);
  });
};
var refresh_pattern_cache = function (name) {
    var patterns = vector_pattern[name];
    if (patterns) {
        patterns.forEach(function (name) {
            var pattern = _twaver.images[name];
            pattern._cache = createVectorCanvas(pattern._image);
        });
        delete vector_pattern[name];
    }
};

var isVectorCacheable = function (image) {
  if (!image.w || !image.h) {
    return false;
  }
  return isVectorGCacheable(image);
};

var isVectorGCacheable = function (g) {
  return !Object.keys(g).some(function (name) {
    if (/^on/.test(name)) {
      return false;
    }
    var value = g[name],
      result = isBidingValue(value);
    if (!result && name === 'v') {
      result = value.some(function (shapeData) {
        // if shapeData is vector and child vector is registered and not cacheable, then vector is not cacheable
        if (shapeData.shape === 'draw') {
            return true;
        }
        if (shapeData.shape === 'vector') {
          var childVector = _twaver.images[shapeData.name];
          if (childVector && !childVector._cache) {
            return true;
          }
        }
        var innerResult = Object.keys(shapeData).some(function (shapeName) {
          if (shapeName === 'state' || shapeName === 'animate') {
            return true;
          }
          return isBidingValue(shapeData[shapeName]);
        });
        if (innerResult) {
          return true;
        } else {
          if (shapeData.shape === 'g' && shapeData.v && shapeData.v.length) {
            return !isVectorGCacheable(shapeData);
          } else {
            return false;
          }
        }
      });
    }
    return result;
  });
};

var isBidingValue = function (value) {
  var type = typeof value;
  return (type === 'string' && value.match(bindingPattern)) || type === 'function';
};

var createVectorCanvas = function (vector) {
  var canvas = $html.createCanvas(vector.w, vector.h),
    g = canvas.getContext('2d');
  drawVector(g, vector, null, { x: 0, y: 0, width: vector.w, height: vector.h });
  return canvas;
};
