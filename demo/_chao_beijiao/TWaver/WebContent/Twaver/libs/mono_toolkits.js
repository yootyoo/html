function inherit(e) {
  function t() {}
  if (null == e) throw TypeError();
  if (Object.create) return Object.create(e);
  var i = typeof e;
  if ("object" !== i && "function" !== i) throw TypeError();
  return t.prototype = e,
  new t
}
var TWEEN = TWEEN ||
function() {
  var e = [];
  return {
    REVISION: "14",
    getAll: function() {
      return e
    },
    removeAll: function() {
      e = []
    },
    add: function(t) {
      e.push(t)
    },
    remove: function(t) {
      t = e.indexOf(t),
      -1 !== t && e.splice(t, 1)
    },
    update: function(t) {
      if (0 === e.length) return ! 1;
      for (var i = 0,
      t = void 0 !== t ? t: "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); i < e.length;) e[i].update(t) ? i++:e.splice(i, 1);
      return ! 0
    }
  }
} ();
TWEEN.Tween = function(e) {
  var t, i = {},
  n = {},
  o = {},
  a = 1e3,
  s = 0,
  r = !1,
  l = !1,
  d = 0,
  h = null,
  c = TWEEN.Easing.Linear.None,
  g = TWEEN.Interpolation.Linear,
  m = [],
  u = null,
  p = !1,
  f = null,
  v = null,
  y = null;
  for (t in e) i[t] = parseFloat(e[t], 10);
  this.to = function(e, t) {
    return void 0 !== t && (a = t),
    n = e,
    this
  },
  this.start = function(t) {
    TWEEN.add(this),
    l = !0,
    p = !1,
    h = void 0 !== t ? t: "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(),
    h += d;
    for (var a in n) {
      if (n[a] instanceof Array) {
        if (0 === n[a].length) continue;
        n[a] = [e[a]].concat(n[a])
      }
      i[a] = e[a],
      !1 == i[a] instanceof Array && (i[a] *= 1),
      o[a] = i[a] || 0
    }
    return this
  },
  this.stop = function() {
    return l ? (TWEEN.remove(this), l = !1, null !== y && y.call(e), this.stopChainedTweens(), this) : this
  },
  this.stopChainedTweens = function() {
    for (var e = 0,
    t = m.length; t > e; e++) m[e].stop()
  },
  this.delay = function(e) {
    return d = e,
    this
  },
  this.repeat = function(e) {
    return s = e,
    this
  },
  this.yoyo = function(e) {
    return r = e,
    this
  },
  this.easing = function(e) {
    return c = e,
    this
  },
  this.interpolation = function(e) {
    return g = e,
    this
  },
  this.chain = function() {
    return m = arguments,
    this
  },
  this.onStart = function(e) {
    return u = e,
    this
  },
  this.onUpdate = function(e) {
    return f = e,
    this
  },
  this.onComplete = function(e) {
    return v = e,
    this
  },
  this.onStop = function(e) {
    return y = e,
    this
  },
  this.update = function(t) {
    var l;
    if (h > t) return ! 0; ! 1 === p && (null !== u && u.call(e), p = !0);
    var y = (t - h) / a,
    y = y > 1 ? 1 : y,
    C = c(y);
    for (l in n) {
      var S = i[l] || 0,
      I = n[l];
      I instanceof Array ? e[l] = g(I, C) : ("string" == typeof I && (I = S + parseFloat(I, 10)), "number" == typeof I && (e[l] = S + (I - S) * C))
    }
    if (null !== f && f.call(e, C), 1 == y) {
      if (! (s > 0)) {
        for (null !== v && v.call(e), l = 0, y = m.length; y > l; l++) m[l].start(t);
        return ! 1
      }
      isFinite(s) && s--;
      for (l in o)"string" == typeof n[l] && (o[l] += parseFloat(n[l], 10)),
      r && (y = o[l], o[l] = n[l], n[l] = y),
      i[l] = o[l];
      h = t + d
    }
    return ! 0
  }
},
TWEEN.Easing = {
  Linear: {
    None: function(e) {
      return e
    }
  },
  Quadratic: {
    In: function(e) {
      return e * e
    },
    Out: function(e) {
      return e * (2 - e)
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e: -.5 * (--e * (e - 2) - 1)
    }
  },
  Cubic: {
    In: function(e) {
      return e * e * e
    },
    Out: function(e) {
      return--e * e * e + 1
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e: .5 * ((e -= 2) * e * e + 2)
    }
  },
  Quartic: {
    In: function(e) {
      return e * e * e * e
    },
    Out: function(e) {
      return 1 - --e * e * e * e
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e * e: -.5 * ((e -= 2) * e * e * e - 2)
    }
  },
  Quintic: {
    In: function(e) {
      return e * e * e * e * e
    },
    Out: function(e) {
      return--e * e * e * e * e + 1
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e * e * e: .5 * ((e -= 2) * e * e * e * e + 2)
    }
  },
  Sinusoidal: {
    In: function(e) {
      return 1 - Math.cos(e * Math.PI / 2)
    },
    Out: function(e) {
      return Math.sin(e * Math.PI / 2)
    },
    InOut: function(e) {
      return.5 * (1 - Math.cos(Math.PI * e))
    }
  },
  Exponential: {
    In: function(e) {
      return 0 === e ? 0 : Math.pow(1024, e - 1)
    },
    Out: function(e) {
      return 1 === e ? 1 : 1 - Math.pow(2, -10 * e)
    },
    InOut: function(e) {
      return 0 === e ? 0 : 1 === e ? 1 : 1 > (e *= 2) ? .5 * Math.pow(1024, e - 1) : .5 * ( - Math.pow(2, -10 * (e - 1)) + 2)
    }
  },
  Circular: {
    In: function(e) {
      return 1 - Math.sqrt(1 - e * e)
    },
    Out: function(e) {
      return Math.sqrt(1 - --e * e)
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
    }
  },
  Elastic: {
    In: function(e) {
      var t, i = .1;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = .1) : t = .4 * Math.asin(1 / i) / (2 * Math.PI), -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / .4)))
    },
    Out: function(e) {
      var t, i = .1;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = .1) : t = .4 * Math.asin(1 / i) / (2 * Math.PI), i * Math.pow(2, -10 * e) * Math.sin(2 * (e - t) * Math.PI / .4) + 1)
    },
    InOut: function(e) {
      var t, i = .1;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = .1) : t = .4 * Math.asin(1 / i) / (2 * Math.PI), 1 > (e *= 2) ? -.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / .4) : .5 * i * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / .4) + 1)
    }
  },
  Back: {
    In: function(e) {
      return e * e * (2.70158 * e - 1.70158)
    },
    Out: function(e) {
      return--e * e * (2.70158 * e + 1.70158) + 1
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * (3.5949095 * e - 2.5949095) : .5 * ((e -= 2) * e * (3.5949095 * e + 2.5949095) + 2)
    }
  },
  Bounce: {
    In: function(e) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - e)
    },
    Out: function(e) {
      return 1 / 2.75 > e ? 7.5625 * e * e: 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
    },
    InOut: function(e) {
      return.5 > e ? .5 * TWEEN.Easing.Bounce.In(2 * e) : .5 * TWEEN.Easing.Bounce.Out(2 * e - 1) + .5
    }
  }
},
TWEEN.Interpolation = {
  Linear: function(e, t) {
    var i = e.length - 1,
    n = i * t,
    o = Math.floor(n),
    a = TWEEN.Interpolation.Utils.Linear;
    return 0 > t ? a(e[0], e[1], n) : t > 1 ? a(e[i], e[i - 1], i - n) : a(e[o], e[o + 1 > i ? i: o + 1], n - o)
  },
  Bezier: function(e, t) {
    var i, n = 0,
    o = e.length - 1,
    a = Math.pow,
    s = TWEEN.Interpolation.Utils.Bernstein;
    for (i = 0; o >= i; i++) n += a(1 - t, o - i) * a(t, i) * e[i] * s(o, i);
    return n
  },
  CatmullRom: function(e, t) {
    var i = e.length - 1,
    n = i * t,
    o = Math.floor(n),
    a = TWEEN.Interpolation.Utils.CatmullRom;
    return e[0] === e[i] ? (0 > t && (o = Math.floor(n = i * (1 + t))), a(e[(o - 1 + i) % i], e[o], e[(o + 1) % i], e[(o + 2) % i], n - o)) : 0 > t ? e[0] - (a(e[0], e[0], e[1], e[1], -n) - e[0]) : t > 1 ? e[i] - (a(e[i], e[i], e[i - 1], e[i - 1], n - i) - e[i]) : a(e[o ? o - 1 : 0], e[o], e[o + 1 > i ? i: o + 1], e[o + 2 > i ? i: o + 2], n - o)
  },
  Utils: {
    Linear: function(e, t, i) {
      return (t - e) * i + e
    },
    Bernstein: function(e, t) {
      var i = TWEEN.Interpolation.Utils.Factorial;
      return i(e) / i(t) / i(e - t)
    },
    Factorial: function() {
      var e = [1];
      return function(t) {
        var i, n = 1;
        if (e[t]) return e[t];
        for (i = t; i > 1; i--) n *= i;
        return e[t] = n
      }
    } (),
    CatmullRom: function(e, t, i, n, o) {
      var e = .5 * (i - e),
      n = .5 * (n - t),
      a = o * o;
      return (2 * t - 2 * i + e + n) * o * a + ( - 3 * t + 3 * i - 2 * e - n) * a + e * o + t
    }
  }
},
function() {
  function e(e) {
    e.setStyle("select.offset", 1),
    e.setStyle("select.width", 1)
  }
  function n(e, t, i) {
    if (t = t || [], e.length <= 3) return t.push(e),
    t;
    for (var a = [], r = e.length, l = [], d = [], h = 0, c = 0; r > c; c++) {
      var g = e[c],
      m = e[c + 1 === r ? 0 : c + 1],
      u = {
        x: m.x - g.x,
        y: m.y - g.y
      };
      l.push(u),
      d.push(g),
      h += (m.x - g.x) * (m.y + g.y)
    }
    i = void 0 === i ? 0 > h: i;
    for (var p = l.length,
    f = !1,
    c = 0; p - 1 > c; c++) if (o(l[c], l[c + 1], i)) {
      for (var v = c + 1,
      y = null,
      C = 0; p > C; C++) if (s(e[C], e[v - 1], e[v], i) < 0 && s(e[C], e[v], e[v + 1 === r ? 0 : v + 1], i) < 0) {
        y = C;
        break
      }
      if (null === y && (y = v - 2, 0 > y && (y += e.length)), null != y) {
        var S = y;
        S > v && (S -= e.length);
        for (var I = S; v >= I; I++) {
          var A = I;
          0 > A && (A += e.length),
          a.push(e[A])
        }
        t.push(a);
        for (var I = v - 1; I > S; I--) {
          var A = I;
          0 > A && (A += e.length);
          var P = e[A],
          E = d.indexOf(P);
          d.splice(E, 1)
        }
        n(d, t, i),
        f = !0
      }
      break
    }
    return d.length > 0 && !f && t.push(d),
    t
  }
  function o(e, t, i) {
    var n = i ? 1 : -1;
    return (e.x * t.y - t.x * e.y) * n < 0 ? !0 : !1
  }
  function s(e, t, i, n) {
    var o = n ? 1 : -1;
    if (!e || !t || !i) return 1;
    var a = -e.x * t.y - t.x * i.y - i.x * e.y + i.x * t.y + t.x * e.y + e.x * i.y;
    return a * o
  }
  OUTLINE_SHAPE = "dshape",
  WALL_INNER_PATH = "wallInnerPic",
  WALL_OUTER_PATH = "wallOuterPic",
  WALL_CLOSED = "shapenode.closed",
  WALL_SIZE = "size",
  POLE_IMAGE_PATH = "poleTexture",
  USE_TEXTURE = "useTexture",
  OUTFRAME_IMAGE_PATH = "framePic",
  POLE_SEGMENTS = "poleSegments",
  IS_INNER_WALL = "isInnerWall",
  BELONG_ID = "edgeIndex",
  BLOCK_OFFSET = "offset",
  IMAGE_SRC = "picture",
  SPACE_POS_Y = "positionY",
  SPACE_SIZE = "size",
  BTYPE = "bType",
  GID = "gid",
  OID = "oid",
  SPACE_POSITION = "position",
  SHAPE_TYPE = "className",
  DESIGN_SCALE = "oscale",
  SPACE_SCALE = "scale",
  SPACE_ROTATION = "rot",
  SIZE_LENGTH = "length",
  SIZE_DEPTH = "depth",
  SIZE_HEIGHT = "height",
  TEXTURE = "texture",
  PRIMITIVE_NAME = "primitiveName",
  HOST_NODE_ID = "hostNodeId",
  FLOOR_HEIGHT = "floorHeight",
  BID = "businessId",
  GENERAL = "General",
  CUSTOM_PROPS = "customProps",
  SPE_STR = "specularStrength",
  TRA_PAR = "transparent",
  OPA = "opacity",
  ANGLE = "angle",
  MAIN_VISIBLE = "mainVisible",
  LIB_PRIMITIVES = "primitivesLib",
  LIB_ASSEMBLES = "assemblesLib",
  LIB_GRAPH = "graphLib",
  LIB_COMPONENTS = "componentLib",
  TAG_ANIMATION = "animation",
  FLOOR_NAME = "floorName",
  FLOOR_HEIGHT = "floorHeight",
  FLOOR_VISIBLE = "floorVisible",
  FLOOR_REF = "floorRef",
  FLOOR_LAYER = "floorLayer",
  PATH = "path",
  SEGMENTSH = "segmentsH",
  SEGMENTSR = "segmentsR",
  ARC = "arc",
  START_CLOSED = "startClosed",
  END_CLOSED = "endClosed",
  VERTICES = "vertices",
  FACES = "faces",
  UVS = "uvs",
  LOAD_RESOURCE_TYPE = "loadResource",
  CLOUD_KEY = "cloudKey",
  CLOUD_PASSWORD = "cloudPassword",
  TYPE_LOCAL = "local",
  TYPE_CLOUD = "cloud",
  MONO_URL = "https://mono-design.cn/api",
  MONO_URL_LOGIN = "https://mono-design.cn/login",
  MONO_URL_LOGOUT = "https://mono-design.cn/logout",
  SHOW_FLOOR = "showFloor",
  ALL_VIEW_SELECTABLE = "allViewSelectable",
  AMBIENT_LIGHT_ON = "ambientLightOn",
  AMBIENT_LIGHT_COLOR = "ambientLightColor",
  POINT_LIGHT_ON = "pointLightOn",
  POINT_LIGHT_POSITION = "pointLightPosition",
  POINT_LIGHT_COLOR = "pointLightColor",
  POINT_LIGHT_INTENSITY = "pointLightIntensity",
  POINT_LIGHT_ON1 = "pointLightOn1",
  POINT_LIGHT_POSITION1 = "pointLightPosition1",
  POINT_LIGHT_COLOR1 = "pointLightColor1",
  POINT_LIGHT_INTENSITY1 = "pointLightIntensity1",
  POINT_LIGHT_ON2 = "pointLightOn2",
  POINT_LIGHT_POSITION2 = "pointLightPosition2",
  POINT_LIGHT_COLOR2 = "pointLightColor2",
  POINT_LIGHT_INTENSITY2 = "pointLightIntensity2",
  POINT_LIGHT_ON3 = "pointLightOn3",
  POINT_LIGHT_POSITION3 = "pointLightPosition3",
  POINT_LIGHT_COLOR3 = "pointLightColor3",
  POINT_LIGHT_INTENSITY3 = "pointLightIntensity3",
  POINT_LIGHT_ON4 = "pointLightOn4",
  POINT_LIGHT_POSITION4 = "pointLightPosition4",
  POINT_LIGHT_COLOR4 = "pointLightColor4",
  POINT_LIGHT_INTENSITY4 = "pointLightIntensity4",
  POINT_LIGHT_ON5 = "pointLightOn5",
  POINT_LIGHT_POSITION5 = "pointLightPosition5",
  POINT_LIGHT_COLOR5 = "pointLightColor5",
  POINT_LIGHT_INTENSITY5 = "pointLightIntensity5",
  SHOW_PROPERTY_SHEET = "showPropertySheet",
  SHOW_AXIS = "showAxis",
  SHOW_AXIS_TEXT = "showAxisText",
  SHOW_DIM = "showDim",
  SHOW_COORD = "showCoord",
  SHOW_TARGET_FLAG = "showTargetFlag",
  SHOW_GRID = "showGrid",
  GRID_GAP = "gridGap",
  SNAPGRID = "snapGrid",
  DECIMAL_NUMBER = "decimalNumber",
  IS_FULL_ROTATION = "isFullRotation",
  IS_FULL_ROTATION_COMPONENT = "isFullRotationComponent",
  ZOOM_SPEED = "zoomSpeed",
  ROTATE_SPEED = "rotateSpeed",
  PAN_SPEED = "panSpeed",
  MAX_DISTANCE = "maxDistance",
  MIN_DISTANCE = "minDistance",
  ZOOM_SPEED_COMPONENT = "zoomSpeedComponent",
  ROTATE_SPEED_COMPONENT = "rotateSpeedComponent",
  PAN_SPEED_COMPONENT = "panSpeedComponent",
  MAX_DISTANCE_COMPONENT = "maxDistanceComponent",
  MIN_DISTANCE_COMPONENT = "minDistanceComponent",
  SHOW_ORIGINAL_FLAG = "showOriginalFlag",
  SCALE_MIN_LIMIT = "scaleMinLimit",
  SCALE_MAX_LIMIT = "scaleMaxLimit",
  ENABLE_SCALE = "enableScale",
  COMPONENT_TEMPLATES = "componentTemplates",
  PUBLIC_TEMPLATES = "Public Templates",
  TEMPLATES = "Private Templates",
  ROOMS = "Rooms",
  SUBTITLE_ROOM = "Room",
  SUBTITLE_COMPONENT = "Component",
  SUBTITLE_MODEL = "Model",
  DEFALUT_POINTS_SHAPE = "-200,0,-200,200,0,-200,200,0,200,-200,0,200",
  PropertyConsts = {
    ROOM_PRIVATE_CATEGORY: "roomPrivateCategory",
    ROOM_PUBLIC_CATEGORY: "roomPublicCategory",
    COMPONENT_PRIVATE_CATEGORY: "componentPrivateCategory",
    COMPONENT_PUBLIC_CATEGORY: "componentPublicCategory",
    SCOPE_PRIMITIVE: 0,
    SCOPE_PUBLIC: 1,
    Font: {
      fontFamily: ["gentilis", "helvetiker", "optimer"],
      fontStyle: ["bold", "normal"]
    },
    WRAPMODE: ["six-each", "front-other", "back-other", "left-other", "right-other", "top-other", "bottom-other"],
    CUSTOM_PROPS: ["p1", "p2", "p3", "p4"],
    FloorStyle: {
      BUFFER_NODE_FLOOR: "Half Transparent",
      PLANE_FLOOR: "Wireframe"
    },
    FloorSize: {
      SMALL: "Small",
      MEDIUM: "Medium",
      LARGE: "Large"
    },
    LocalStorage: {
      FLOOR_STYLE: "floorStyle",
      FLOOR_SIZE: "floorSize",
      SELECT_STYLE: "selectStyle"
    },
    COMPONENTFLOOR: "componentFloor",
    MONO_KEY: "mono2025",
    MONO_IMG_PRE: "https://mono-design.cn/",
    MONO_URL_PRE: "https://mono-design.cn/",
    TYPE_ROOMS: "rooms",
    TYPE_COMPONENT: "component",
    TYPE_ROOTCATEGORY: "rootCategory",
    DEFAULT_IMAGE: "crash.png",
    NEAR_PLANE: "nearPlane",
    FAR_PLANE: "farPlane",
    FOV: "fov",
    NEAR_PLANE_COMPONENT: "nearPlaneComponent",
    FAR_PLANE_COMPONENT: "farPlaneComponent",
    FOV_COMPONENT: "fovComponent",
    ORDER_BY_ASC: 0,
    ORDER_BY_DESC: 1,
    LINK_STYPE: ["", "orthogonal.x", "orthogonal.x.n", "orthogonal.y", "orthogonal.y.n", "orthogonal.z", "orthogonal.z.n", "control"],
    SELECT_STYLE: {
      WIREFRAME: "wireframe",
      NORMAL: "normal",
      BORDER: "border"
    },
    Layer: {
      WALL: "Wall",
      FLOOR: "Floor",
      WINDOW: "Window",
      DOOR: "Door",
      PIPE: "Pipe",
      BILLBOARD: "Billboard",
      TEMPLATE: "Template",
      DEFAULT: "default"
    },
    LAYERID: "layerId",
    ENABLE_EASING: "enableEasing",
    TEMPLATE_AUTHOR: "templateAuthor",
    SHOW_RULER_GUIDES: "showRulerGuides",
    SHOW_RULER: "showRuler",
    SCALE_UNIT_TEXT: "scaleUnitText"
  },
  Utils = {
    Path: "images/",
    RelativePath: "",
    renderNetwork: function(e, t, i) {
      e.setRenderCallback(i)
    },
    createDraggableNetwork: function(e) {
      if (!e) var e = new twaver.network.Network;
      return e.getView().addEventListener("dragover",
      function(e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1,
        e.dataTransfer.dropEffect = "copy",
        !1
      },
      !1),
      e.setEditableFunction(function(e) {
        return "unresize" !== e.getClient("resize")
      }),
      e.getView().addEventListener("drop",
      function(t) {
        t.stopPropagation && t.stopPropagation(),
        t.preventDefault ? t.preventDefault() : t.returnValue = !1;
        var i = t.dataTransfer.getData("Text");
        Utils._handle2dDrop(t, i, e)
      },
      !1),
      e
    },
    _handle2dDrop: function(e, t, i) {
      if (!t) return ! 1;
      var n = JSON.parse(t),
      o = i.getElementBox();
      if (void 0 !== n.className && "twaver.Grid" === n.className) {
        var a, s, r, l;
        o.forEach(function(e) {
          e instanceof ImageNode && (a = e.getWidth(), s = e.getHeight(), r = e.getLocation(), l = e)
        });
        var d = Utils._createGrid(a, s, r, l);
        o.add(d)
      } else if ("Material" === n.classType) {
        var h = i.getElementAt(e);
        console.log(h),
        h instanceof twaver.Follower && !(h.getParent() instanceof ImageNode) ? (Utils.registerImage(Utils.Path + n.material, i), h.setImage(Utils.Path + n.material), h.setClient("material", n.material), handleText2d(i)) : null == h && o.forEach(function(e) {
          if (e instanceof ImageNode) {
            var t = Utils.Path + n.material;
            Utils.registerImage(t, i),
            e.setImage(t),
            0 == faceObject.faceIndex ? faceObject.element.setStyle("right.m.texture.image", t) : 1 == faceObject.faceIndex ? faceObject.element.setStyle("left.m.texture.image", t) : 2 == faceObject.faceIndex ? faceObject.element.setStyle("top.m.texture.image", t) : 3 == faceObject.faceIndex ? faceObject.element.setStyle("bottom.m.texture.image", t) : 4 == faceObject.faceIndex ? faceObject.element.setStyle("front.m.texture.image", t) : 5 == faceObject.faceIndex && faceObject.element.setStyle("back.m.texture.image", t)
          }
        })
      } else if ("Cube" === n.classType) if (_twaver.isShiftDown(e)) Utils.showPortDialog(i, e, n, t);
      else {
        var l = i.getElementAt(e),
        c = Utils.Path + n.material,
        a = n.args.x,
        s = n.args.y,
        g = Utils._createFollower(e, l, c, n.resize, a, s, t, i);
        o.add(g),
        o.getSelectionModel().setSelection(g),
        handleText2d(i)
      } else if ("Template" === n.classType) {
        var m = Utils.Path + "default_texture.png";
        if (loadResource === TYPE_CLOUD) modelManager.loadTemplatesAssembleSize(n.id, this,
        function(n) {
          var a = i.getElementAt(e),
          s = Utils._createFollower(e, a, m, "unresize", n.x, n.y, t, i);
          o.add(s),
          handleText2d(i)
        });
        else {
          var u = modelManager.loadTemplatesAssembleSize(n.id),
          l = i.getElementAt(e),
          g = Utils._createFollower(e, l, m, "unresize", u.x, u.y, t, i);
          o.add(g),
          handleText2d(i)
        }
      }
    },
    _createGrid: function(e, t, i, n) {
      var o = new CGrid;
      return o.setLocation(i),
      o.setSize(e, t),
      o.setStyle("grid.border", 1),
      o.setStyle("grid.row.count", 3),
      o.setStyle("grid.column.count", 3),
      o.setStyle("grid.deep", 1),
      o.setStyle("whole.alpha", .6),
      o.setClient("grid.outer.padding", 0),
      o.setClient("width", e),
      o.setClient("height", t),
      o.setClient("location", i),
      o.setClient("offset", .1),
      o.setStyle("grid.padding", 1),
      o.setParent(n),
      o
    },
    _createFollower: function(e, t, i, n, o, a, s, r) {
      var l = new twaver.Follower;
      if (Utils.registerImage(i, r, "component"), l.setImage(i), l.setClient("text", s), l.setClient("resize", n), t instanceof twaver.Grid) {
        var d = r.getLogicalPoint(e),
        h = t.getCellObject(d);
        if (null != h) {
          "unresize" === n && (l.setStyle("follower.fill.cell", !1), l.setWidth(o * r.zoom), l.setHeight(a * r.zoom)),
          l.setStyle("follower.row.index", h.rowIndex),
          l.setStyle("follower.column.index", h.columnIndex),
          l.setParent(t),
          l.setHost(t);
          var c = l.getParent().getParent(),
          g = l.getCenterLocation().x - c.getCenterLocation().x,
          m = l.getCenterLocation().y - c.getCenterLocation().y;
          l.setClient("offsetX", g / r.zoom),
          l.setClient("offsetY", m / r.zoom);
          var u = t.getClient("offset");
          l.setClient("offset", u + .15),
          l.setClient("selfID", l.getId()),
          l.setClient("hostCell", t),
          console.log("translate to 2d")
        }
      }
      return l
    },
    createDraggableNetwork3D: function(e) {
      if (!e) var e = new(new mono.Network3D);
      return e.getRootView().addEventListener("dragover",
      function(e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1,
        e.dataTransfer.dropEffect = "copy",
        !1
      },
      !1),
      e.getRootView().addEventListener("drop",
      function(t) {
        t.stopPropagation && t.stopPropagation(),
        t.preventDefault ? t.preventDefault() : t.returnValue = !1;
        var i = t.dataTransfer.getData("Text");
        return i ? (Utils._handle3dDrop(t, i, e), !1) : !1
      },
      !1),
      e.getRootView().setAttribute("draggable", "true"),
      e
    },
    _findFirstObjectByMouse: function(e, t, i) {
      i || (i = function(e) {
        return ! (e instanceof mono.Billboard || e.getClient(PropertyConsts.COMPONENTFLOOR))
      });
      var n = e.getElementsByMouseEvent(t);
      if (n.length) for (var o = 0; o < n.length; o++) {
        var a = n[o],
        s = a.element;
        if (i(s)) return a
      }
      return null
    },
    _init3dObject: function(t) {
      var i = Utils.Path + "default_texture.png";
      t.setStyle("m.texture.image", i),
      t.setStyle("m.texture.wrapS", mono.RepeatWrapping),
      t.setStyle("m.texture.wrapT", mono.RepeatWrapping),
      t.setStyle("m.texture.repeat", new mono.Vec2(3, 3)),
      t.setStyle("m.side", mono.DoubleSide),
      t.setStyle("m.type", "phong"),
      t.setEditable(!0),
      t.setSelectable(!0),
      e(t)
    },
    _createPath: function(e, t) {
      var i = t || 1,
      n = new mono.Path;
      if (e instanceof Array) for (var o = e.concat(); o && o.length > 0;) {
        var a = o.shift();
        "m" === a && n.moveTo(parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i)),
        "l" === a && n.lineTo(parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i)),
        "c" === a && n.curveTo(parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i), parseInt(o.shift() * i))
      }
      return n
    },
    _createPrimitiveObject: function(e, t) {
      var i, n = ("mono." + e.className, Utils.Path + "default_texture.png", e.args);
      if ("Cube" === e.className && (i = new mono.Cube(n.x, n.y, n.z)), "Sphere" === e.className && (i = new mono.Sphere(n.radius)), "Cylinder" === e.className) {
        var o = window.prompt("Segment count:", n.radialSegments);
        if (null === o) return;
        i = new mono.Cylinder(n.radiusTop, n.radiusBottom, n.height, o),
        n.smooth ? (i.setStyle("m.normalType", mono.NormalTypeSmooth), i.setStyle("top.m.normalType", mono.NormalTypeFlat), i.setStyle("bottom.m.normalType", mono.NormalTypeFlat)) : i.setStyle("m.normalType", mono.NormalTypeFlat)
      }
      if ("Torus" === e.className && (i = new mono.Torus(n.radius, n.tube, n.radialSegments, n.tubularSegments)), "PathNode" === e.className && (i = new mono.PathNode(Utils._createPath(n.path), n.pathSegments, n.radius, n.shapeSegments, n.startCap, n.endCap), i.setSegmentsCap(10), n.startCapSize && i.setStartCapSize(n.startCapSize), n.endCapSize && i.setEndCapSize(n.endCapSize)), "TextNode" === e.className) {
        var a = [{
          label: "Text:",
          id: "text3d",
          value: n.text,
          tab: "Properties"
        },
        {
          label: "Font:",
          id: "font3d",
          type: "select",
          options: PropertyConsts.Font.fontFamily,
          value: n.font,
          tab: "Properties"
        },
        {
          label: "Style:",
          id: "style3d",
          type: "select",
          options: PropertyConsts.Font.fontStyle,
          value: n.style,
          tab: "Properties"
        }],
        s = "Text Property",
        r = function(e) {
          var i = new mono.TextNode(e.text3d, null, n.height, e.font3d, e.style3d),
          o = n.scale || 1;
          i.setScale(o, o, o),
          Utils._init3dObject(i),
          t.add(i),
          t.getSelectionModel().clearSelection(),
          i.setSelected(!0)
        };
        return void Utils.showInputDialog(a, s, !0, r)
      }
      return Utils._init3dObject(i),
      i
    },
    _createLatheObject: function(e) {
      var t = new GridNetwork;
      t.setInteractions([new twaver.canvas.interaction.CreateShapeNodeInteraction(t, window.RoundPipeShapeNode), new twaver.canvas.interaction.EditInteraction(t, !1), new twaver.canvas.interaction.DefaultInteraction(t)]),
      t.setEditPointSize(10),
      t.addElementByInteraction = function(e) {
        twaver.canvas.Network.prototype.addElementByInteraction.call(this, e),
        setTimeout(function() {
          t.setInteractions([new twaver.canvas.interaction.EditInteraction(t, !1), new twaver.canvas.interaction.SelectInteraction(t), new twaver.canvas.interaction.MoveInteraction(t, !1), new twaver.canvas.interaction.DefaultInteraction(t)])
        },
        500)
      };
      var i = new twaver.Node("axis");
      Utils.registerImage(Utils.Path + "axis.png"),
      i.setImage(Utils.Path + "axis.png"),
      i.setLocation(400, 100),
      i.setStyle("select.style", "none"),
      t.setEditableFunction(function(e) {
        return e === i ? !1 : !0
      }),
      t.getElementBox().add(i);
      var n = document.createElement("div"),
      o = document.createElement("p");
      o.innerHTML = "Note:double click to end path",
      n.appendChild(o),
      n.style.width = "800px",
      n.style.height = "400px",
      n.appendChild(t.getView()),
      setTimeout(function() {
        t.adjustBounds({
          width: 800,
          height: 400
        }),
        t.getView().style.position = "relative"
      },
      100);
      var a = [{
        id: "shapePath",
        type: "div",
        value: n,
        tab: "Path"
      },
      {
        label: "Height Segments:",
        id: "segmentsH",
        value: 64,
        tab: "Properties"
      },
      {
        label: "Radius Segments:",
        id: "segmentsR",
        value: 20,
        tab: "Properties"
      },
      {
        label: "Rotation Angle:",
        id: "rotationAngle",
        value: 360,
        tab: "Properties"
      },
      {
        label: "Start Closed:",
        id: "startClosed",
        checked: !1,
        type: "checkbox",
        tab: "Properties"
      },
      {
        label: "End Closed:",
        id: "endClosed",
        checked: !1,
        type: "checkbox",
        tab: "Properties"
      }],
      s = "Lathe Property",
      r = function(t, i) {
        var n = new mono.Path;
        if (t) {
          var o, a = t.getElementBox().getDatas();
          a.forEach(function(e) {
            e instanceof PipeShapeNode && (o = e)
          });
          var s = t.getElementBox().getDataById("axis"),
          r = s.getRect(),
          l = {
            x: r.x + 7,
            y: r.y + r.height
          };
          if (o) {
            var d = o.getPoints();
            if (d && d.size() > 1) {
              var h = d.get(0);
              n.moveTo(h.x - l.x, l.y - h.y, 0);
              for (var c = 1; c < d.size(); c++) h = d.get(c),
              n.lineTo(h.x - l.x, l.y - h.y, 0)
            }
            var g = parseInt(i.segmentsH),
            m = parseInt(i.segmentsR),
            u = parseInt(i.rotationAngle) * Math.PI / 180,
            p = new mono.LatheNode(n, g, m, u, i.startClosed, i.endClosed);
            p.setStyle("m.side", TGL.DoubleSide).setStyle("m.texture.image", "images/default_texture.png"),
            e.add(p)
          }
        }
      };
      Utils.showInputDialog(a, s, !0, r, this, [t])
    },
    _createPipeObject: function(e) {
      var t = e.getInteractions(),
      i = !1;
      t.forEach(function(t) {
        t instanceof ComponentsDragPipeInteraction && (t = new ComponentsDragPipeInteraction(e), i = !0)
      }),
      i || (t.push(new ComponentsDragPipeInteraction(e)), e.setInteractions(t))
    },
    _setDropPosition: function(e, t, i) {
      var n = t.getElementsByMouseEvent(e);
      if (n.length) {
        var o = n[0],
        a = (o.element, o.point);
        i.setPosition(a)
      }
    },
    _handle3dDrop: function(t, i, n, o) {
      var a = JSON.parse(i);
      if ("Primitive" === a.classType) {
        var s = Utils._createPrimitiveObject(a, n.getDataBox());
        s && (Utils._setDropPosition(t, n, s), n.getDataBox().add(s), n.getDataBox().getSelectionModel().clearSelection(), s.setEditable(!0), s.setSelectable(!0))
      }
      if ("Pipe" === a.classType && Utils._createPipeObject(n), "Combo" === a.classType) {
        for (var r = (a.className, Utils.Path + "default_texture.png"), l = a.primitives, d = a.ops, h = 0; h < l.length; h++) {
          var c = l[h],
          s = Utils._createPrimitiveObject(c);
          s && (c.position && s.setPosition(c.position.x, c.position.y, c.position.z), c.rotation && s.setRotation(c.rotation.x, c.rotation.y, c.rotation.z), e(s)),
          l[h] = s
        }
        var g = new mono.ComboNode(l, d, !0);
        e(g),
        Utils._setDropPosition(t, n, s),
        n.getDataBox().add(g),
        n.getDataBox().getSelectionModel().clearSelection(),
        g.setEditable(!0),
        g.setSelectable(!0)
      }
      if ("Lathe" === a.classType && Utils._createLatheObject(n.getDataBox()), "Billboard" === a.classType) {
        var m, u = Utils._findFirstObjectByMouse(n, t);
        u && (m = u.element);
        var r = Utils.Path + a.material,
        s = new mono.Billboard;
        if (s.setStyle("m.texture.image", r), s.setStyle("m.alignment", mono.BillboardAlignment.bottomCenter), s.setStyle("m.transparent", !1), s.setStyle("m.opacity", 1), s.setStyle("m.vertical", !0), m) {
          s.setParent(m),
          m.boundingBox || m.computeBoundingBox();
          var p = m.boundingBox.max.y;
          s.setPosition(0, p, 0)
        } else Utils._setDropPosition(t, n, s);
        s.setEditable(!0),
        s.setSelectable(!0),
        s.setScale(a.args.x, a.args.y, 1),
        n.getDataBox().add(s)
      }
      if ("Cube" === a.classType) {
        var f = Utils.Path + a.material,
        v = Utils.Path + "brush_metal.png",
        y = a.args,
        C = !1;
        a.transparent && (C = a.transparent);
        var s = new mono.Cube(y.x, y.y, y.z);
        s.setStyle("m.texture.image", v),
        s.setStyle("m.texture.repeat", new mono.Vec2(1, 1)),
        s.setClient("shape", a.shape);
        var S = ["front"];
        a.faces && (S = a.faces);
        for (var I = 0; I < S.length; I++) {
          var A = S[I];
          s.setStyle(A + ".m.texture.image", f),
          s.setStyle(A + ".m.transparent", C)
        }
        s.setEditable(!0),
        s.setSelectable(!0),
        e(s),
        Utils._setDropPosition(t, n, s);
        var u = Utils._findFirstObjectByMouse(n, t);
        if (Utils.stickOnSurface(s, n, t, u), a.text) {
          var i = window.prompt("Text:", a.text.content),
          P = new mono.TextNode(i, null, a.text.height, a.text.font, a.text.style),
          E = a.text.scale || 1;
          P.setScale(E, E, E),
          P.setEditable(!0),
          P.setSelectable(!0),
          P.setParent(s),
          P.editTransformToParent = !0,
          P.setStyle("m.texture.image", Utils.Path + a.text.material),
          e(P);
          var u = Utils._findFirstObjectByMouse(n, t);
          Utils.stickOnSurface(P, n, t, u),
          a.text.position && P.setPosition(s.getPosition().x + a.text.position.x, s.getPosition().y + a.text.position.y, s.getPosition().z + a.text.position.z),
          a.text.rotation && P.setRotation(s.getRotation().x + a.text.rotation.x, s.getRotation().y + a.text.rotation.y, s.getRotation().z + a.text.rotation.z),
          n.getDataBox().add(P)
        }
        n.getDataBox().add(s);
        var w;
        if (a.panel) {
          if (w = new mono.Cube(a.panel.x, a.panel.y, a.panel.z), w.setStyle("m.texture.image", v), a.panel.pic) {
            var b = Utils.Path + a.panel.pic;
            w.setStyle("front.m.texture.image", b)
          }
          w.setParent(s),
          w.editTransformToParent = !0,
          w.getPosition().z += s.depth / 2,
          e(w),
          n.getDataBox().add(w);
          var x = s.getId() + ":" + w.getId();
          s.setGroupId(x),
          w.setGroupId(x)
        }
        if (o) {
          s.setClient("cellID", o.getId());
          var _ = faceObject.element.depth;
          "verticalCard" === a.shape ? (s.setHeight(o.getHeight()), w && w.setHeight(o.getHeight())) : "horizontalCard" === a.shape ? (s.setWidth(o.getWidth()), w && w.setWidth(o.getWidth())) : "cube" === a.shape && (s.setWidth(o.getWidth()), s.setHeight(o.getHeight()), s.setDepth(_ / 10));
          var O = o.getClient("offsetX"),
          T = o.getClient("offsetY");
          setPositionByRelative(faceObject.faceIndex, s, O, T)
        }
      }
      if ("Material" === a.classType) {
        var r = Utils.Path + a.material,
        N = 1,
        L = 1,
        M = !0,
        C = !1;
        a.texture && (N = a.texture.row, L = a.texture.column),
        void 0 !== a.visible && (M = a.visible),
        a.transparent && (C = a.transparent);
        var u = Utils._findFirstObjectByMouse(n, t);
        if (u) if (a.texture) {
          var R = [{
            label: "Row:",
            id: "row",
            value: N
          },
          {
            label: "Column:",
            id: "column",
            value: L
          },
          {
            label: "Scope:",
            id: "useForAllFaces",
            type: "checkbox",
            inner: "Use this material for all faces"
          }];
          Utils.showInputDialog(R, "Set Material", !0, this.setMaterial, this, [r, M, C, u])
        } else {
          var U = {};
          U.row = N,
          U.column = L,
          this.setMaterial(r, M, C, u, U, a.wrapMode)
        }
      }
      if ("Dye-Color" === a.classType) {
        var u = Utils._findFirstObjectByMouse(n, t),
        D = a.color;
        if (u && D) {
          var s = u.element,
          R = [{
            label: "Scope:",
            id: "useForAllFaces",
            type: "checkbox",
            inner: "Use this dye color for all faces"
          }];
          Utils.showInputDialog(R, "Set Dye Color", !0, this.setDyeColor, this, [D, u])
        }
      }
      if ("Template" === a.classType) {
        var k = "Load Template",
        B = [{
          label: "",
          "class": "lb-save-template",
          id: "opentemp",
          name: "templates",
          type: "radio",
          checked: !0,
          inner: "Open template in the scense"
        },
        {
          label: "",
          "class": "lb-save-template",
          id: "loadtemp",
          name: "templates",
          type: "radio",
          checked: !1,
          inner: "Insert template in the scense"
        }];
        Utils.showInputDialog(B, k, !0,
        function(e) {
          var i = Utils._findFirstObjectByMouse(n, t),
          o = modelManager.loadComponentTemplate(n.getDataBox(), a.id, e.opentemp, this,
          function(o) {
            e.opentemp || (Utils._setDropPosition(t, n, o), o.setPositionY(o.getHeight() / 2), Utils.stickOnSurface(o, n, t, i))
          });
          o && !e.opentemp && (Utils._setDropPosition(t, n, o), o.setPositionY(o.getHeight() / 2), Utils.stickOnSurface(o, n, t, i))
        })
      }
      n.getView().focus()
    },
    stickOnSurface: function(e, t, i, n) {
      if (n) {
        {
          var o = n.face,
          a = n.element,
          s = n.point;
          a.getPosition()
        }
        s = a.worldToLocal(s),
        e.setParent(a),
        e.setPosition(s.x, s.y, s.z),
        e.getPosition().z += 1,
        e.setClient("faceIndex", o.materialIndex);
        var r = o.normal.clone();
        a.setClient("parentFaceIndex", o.materialIndex);
        for (var l, d, h = e.getParent(); h;) l = h,
        d = l.getClient("parentFaceIndex"),
        h = h.getParent();
        0 == d ? r = new mono.Vec3(1, 0, 0) : 1 == d ? r = new mono.Vec3( - 1, 0, 0) : 2 == d ? r = new mono.Vec3(0, 1, 0) : 3 == d ? r = new mono.Vec3(0, -1, 0) : 4 == d ? r = new mono.Vec3(0, 0, 1) : 5 == d && (r = new mono.Vec3(0, 0, -1)),
        r = r.applyMatrix4((new mono.Mat4).extractRotation(a.matrix)),
        r.normalize();
        var c = new mono.Vec3(0, 0, 1),
        g = Math.acos(r.dot(c) / r.length() / c.length()),
        m = (new mono.Vec3).crossVectors(r, c).normalize(),
        u = new mono.Mat4;
        u.makeRotationAxis(m, -g);
        var p = (new mono.Vec3).setEulerFromRotationMatrix((new mono.Mat4).extractRotation(u)),
        p = a.getRotation();
        e.setRotation(p)
      }
      Utils.isCtrlDown(i) && e.setRotationZ(e.getRotation().z + Math.PI / 2)
    },
    setDyeColor: function(e, t, i) {
      var n = t.face,
      o = t.element,
      a = n.materialIndex;
      if (i.useForAllFaces) {
        var s = "m.color";
        o.setStyle(s, e),
        s = "m.ambient",
        o.setStyle(s, e)
      } else {
        var s = "m.color";
        o.getIndexSideMapping() && (s = o.getIndexSideMapping()[a] + "." + s),
        o.setStyle(s, e),
        s = "m.ambient",
        o.getIndexSideMapping() && (s = o.getIndexSideMapping()[a] + "." + s),
        o.setStyle(s, e)
      }
    },
    setMaterial: function(e, t, i, n, o, a) {
      repeatRow = parseInt(o.row),
      repeatColumn = parseInt(o.column);
      var s, r = n.element,
      l = n.face,
      d = l.materialIndex,
      h = o.useForAllFaces,
      c = r.getIndexSideMapping();
      if (!a && c && (s = r.getIndexSideMapping()[d], s += "."), void 0 === s) {
        var g = ["m.texture.image", "m.texture.repeat", "m.visible", "m.transparent"];
        for (nameIndex in g) {
          var m, u = g[nameIndex],
          p = r.getStyle(u, !0, !0);
          if ("m.texture.image" === u && (m = e), "m.texture.repeat" === u && (m = new mono.Vec2(repeatRow, repeatColumn)), "m.visible" === u && (m = t), "m.transparent" === u && (m = i), h) for (var f = 0; f < p.length; f++) p[f] = m;
          else p[d] = m;
          r.setStyle(u, p)
        }
        a && (r.setStyle("m.texture.image", e), r.setStyle("m.texture.repeat", new mono.Vec2(1, 1)), r.setWrapMode(a))
      } else if (h) {
        if (c) for (var f = 0; f < r.getIndexSideMapping().length; f++) {
          var s = r.getIndexSideMapping()[f];
          s += ".",
          r.setStyle(s + "m.texture.image", null),
          r.setStyle(s + "m.texture.repeat", null),
          r.setStyle(s + "m.visible", null),
          r.setStyle(s + "m.transparent", null)
        }
        r.setStyle("m.texture.image", e),
        r.setStyle("m.texture.repeat", new mono.Vec2(repeatRow, repeatColumn)),
        r.setStyle("m.visible", t),
        r.setStyle("m.transparent", i)
      } else r.setStyle(s + "m.texture.image", e),
      r.setStyle(s + "m.texture.repeat", new mono.Vec2(repeatRow, repeatColumn)),
      r.setStyle(s + "m.visible", t),
      r.setStyle(s + "m.transparent", i)
    },
    registerImage: function(e, t, i, n, o, a) {
      var s = new Image;
      e.startsWith("data:image") ? s.src = e: (s.crossOrigin = "", s.src = Utils.RelativePath + e);
      var r = arguments;
      a && (e = a),
      s.onload = function() {
        "component" == i ? twaver.Util.registerImage(e, s, s.width, s.height, t) : twaver.Util.registerImage(e, s, s.width, s.height),
        n && n.call(o, s.width, s.height);
        for (var a = 1; a < r.length; a++) {
          var l = r[a];
          l && l.invalidateElementUIs && l.invalidateElementUIs(),
          l && l.invalidateDisplay && l.invalidateDisplay()
        }
      }
    },
    getImageName: function(e) {
      var t = e.lastIndexOf("/"),
      i = e;
      return t >= 0 && (i = e.substring(t + 1)),
      t = i.lastIndexOf("."),
      t >= 0 && (i = i.substring(0, t)),
      i
    },
    addMask: function(e) {
      {
        var t;
        parseInt(window.screen.availWidth),
        parseInt(window.screen.availHeight)
      }
      return t = document.createElement("div"),
      e ? t.setAttribute("id", "mask_" + e) : t.setAttribute("id", "mask"),
      t.setAttribute("class", "mask"),
      document.body.appendChild(t),
      t
    },
    randomInt: function(e) {
      return Math.floor(Math.random() * e)
    },
    randomColor: function() {
      var e = Utils.randomInt(255),
      t = Utils.randomInt(255),
      i = Utils.randomInt(255);
      return "#" + Utils._formatNumber(e << 16 | t << 8 | i)
    },
    _formatNumber: function(e) {
      for (var t = e.toString(16); t.length < 6;) t = "0" + t;
      return t
    },
    changeTwoDecimal: function(e) {
      return Utils.changeDecimalDigit(e, 2)
    },
    rChangeTwoDecimal: function(e) {
      return e ? parseFloat(e.toString().replace(/[^\d\.-]/g, "")) : 0
    },
    changeDecimalDigit: function(e, n) {
      n = n > 0 && 20 >= n ? n: 2,
      e = Utils.rChangeTwoDecimal(e),
      e = parseFloat((e + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      var o = e.split(".")[0].split("").reverse(),
      a = e.split(".")[1];
      for (t = "", i = 0; i < o.length; i++) t += o[i];
      var s = t.split("").reverse().join("") + "." + a;
      return parseFloat(s)
    },
    disposeDialog: function(e) {
      document.body.removeChild(document.getElementById("mask_" + e) ? document.getElementById("mask_" + e) : document.getElementById("mask")),
      document.body.removeChild(document.getElementById(e))
    },
    parameterReset: function(e, t) {
      if (this.setButtonStyle(e), "ScaleReset" === e) {
        var i = document.getElementById(t + "X");
        i.value = parseFloat(1).toFixed(decimalNumber),
        i = document.getElementById(t + "Y"),
        i.value = parseFloat(1).toFixed(decimalNumber),
        i = document.getElementById(t + "Z"),
        i.value = parseFloat(1).toFixed(decimalNumber)
      } else if ("PositionReset" === e) {
        var i = document.getElementById(t + "X");
        i.value = parseFloat(0).toFixed(decimalNumber),
        i = document.getElementById(t + "Y"),
        i.value = parseFloat(0).toFixed(decimalNumber),
        i = document.getElementById(t + "Z"),
        i.value = parseFloat(0).toFixed(decimalNumber)
      } else if ("RotationReset" === e) {
        var i = document.getElementById(t + "X");
        i.value = 0,
        i = document.getElementById(t + "Y"),
        i.value = 0,
        i = document.getElementById(t + "Z"),
        i.value = 0
      } else if ("TextureReset" === e) {
        var i = document.getElementById(t + "C");
        i.value = 1,
        i = document.getElementById(t + "R"),
        i.value = 1
      }
    },
    setButtonStyleHover: function(e) {
      var t = document.getElementById(e);
      t.setAttribute("class", "parameterReset_hover")
    },
    setButtonStyle: function(e) {
      var t = document.getElementById(e);
      t.setAttribute("class", "parameterReset")
    },
    showInputDialog: function(e, t, i, n, o, a, s, r, l) {
      if (e) {
        var d, h, c = [],
        g = [],
        m = [],
        u = {};
        if (s) {
          var p = [{
            label: "p1",
            id: "p1",
            tab: "User Properties",
            readonly: !1,
            "class": "customlabel"
          },
          {
            label: "p2",
            id: "p2",
            tab: "User Properties",
            readonly: !1,
            "class": "customlabel"
          },
          {
            label: "p3",
            id: "p3",
            tab: "User Properties",
            readonly: !1,
            "class": "customlabel"
          },
          {
            label: "p4",
            id: "p4",
            tab: "User Properties",
            readonly: !1,
            "class": "customlabel"
          }];
          e = e.concat(p)
        }
        for (var f = 0,
        v = e.length; v > f; f++) {
          var y = e[f];
          h = y.tab || GENERAL,
          d = u[h] || document.createElement("form"); {
            var C = y.id,
            S = y.type ? y.type: "text";
            y.label
          }
          if ("div" !== S) {
            var I = document.createElement("input");
            "undefined" != typeof y.label && I.setAttribute("value", y.label),
            I.tabIndex = "-1",
            y.readonly !== !1 && I.setAttribute("readonly", !0),
            y.class ? I.setAttribute("class", y.class) : I.setAttribute("class", "field"),
            y.labelId ? I.setAttribute("id", y.labelId) : y.id && I.setAttribute("id", "label" + y.id);
            var A = "select" === S,
            P = document.createElement("input");
            if (A) {
              P = document.createElement("select"),
              P.style.width = "304px";
              var E = y.value,
              w = y.options;
              if (w) for (var b = 0; b < w.length; b++) {
                var x = w[b],
                _ = document.createElement("option");
                _.innerHTML = x,
                _.setAttribute("value", x),
                E && E === x && _.setAttribute("selected", "true"),
                P.appendChild(_)
              }
            }
            if (!A && (P.setAttribute("type", S), y.pick ? (P.style.borderRight = "0px", P.style.width = "272px") : P.setAttribute("size", 40), y.list)) {
              var O = C + "_datalist";
              P.setAttribute("list", O);
              var T = document.createElement("datalist");
              T.setAttribute("id", O);
              for (var N = 0; N < y.list.length; N++) {
                var L = y.list[N],
                M = document.createElement("option");
                M.setAttribute("value", L),
                T.appendChild(M)
              }
              y.datalist = T
            }
            if (void 0 === S || "input" === S || "text" === S || "password" === S ? P.setAttribute("class", "input") : "label" === S || P.setAttribute("class", "input-r"), y.name && P.setAttribute("name", y.name), y.pick && (P.pickImage = !0), void 0 !== y.display && (y.display ? (I.style.display = "block", P.style.display = "block") : (I.style.display = "none", P.style.display = "none")), void 0 === y.min || isNaN(y.min) || P.setAttribute("min", y.min), void 0 === y.max || isNaN(y.max) || P.setAttribute("max", y.max), y.listener && (P[y.eve] = y.listener), 0 == y.editable && (P.setAttribute("readonly", "readonly"), P.style.border = "0px", P.style.borderBottom = "1px solid #ABADB3"), "checkbox" === S || "radio" === S) {
              var R = y.checked;
              void 0 === R && (R = !1),
              R && P.setAttribute("checked", R)
            }
            if (y.id && (P.setAttribute("id", y.id), "User Properties" == y.tab ? g.push(y.id) : c.push(y.id)), "undefined" != typeof y.value && P.setAttribute("value", y.value), "multipleF" != S && "multipleS" !== S && "multipleT" !== S && "button" !== S && d.appendChild(I), ("multipleF" === S || "multipleS" === S || "multipleT" === S) && ("undefined" != typeof y.labelMinor && I.setAttribute("value", y.labelMinor), y.class ? I.setAttribute("class", y.class) : I.setAttribute("class", "fieldlabel"), "textureRepeatC" === y.id ? I.style.width = "48px": "textureRepeatR" === y.id ? I.style.width = "30px": "shapeW" === y.id ? I.style.width = "17px": "shapeH" === y.id || "shapeD" === y.id ? I.style.width = "11px": "ambientLightColor" === y.id ? I.style.width = "50px": "pointLightColor" === y.idTyle ? I.style.width = "50px": "pointLightPosition" === y.idTyle ? I.style.width = "65px": "pointLightIntensity" === y.idTyle && (I.style.width = "70px"), d.appendChild(I)), "range" === S) {
              var U = document.createElement("div"),
              D = document.createElement("output");
              D.value = P.value,
              D.style.paddingLeft = "10px",
              D.setAttribute("id", "rangeValue"),
              function(e, t) {
                e.addEventListener("change",
                function() {
                  t.value = e.value
                })
              } (P, D),
              U.appendChild(P),
              U.appendChild(D),
              d.appendChild(U)
            } else if ("textArea" === S) {
              var k = document.createElement("div"),
              D = document.createElement("textarea");
              D.setAttribute("id", C),
              D.value = y.value,
              D.style.width = "500px",
              D.style.height = "300px",
              k.appendChild(D),
              d.appendChild(k)
            } else if ("multipleF" === S || "multipleS" === S || "multipleT" === S) P.style.width = "84px",
            P.style.marginLeft = "1px",
            "textureRepeatC" === y.id || "textureRepeatR" === y.id ? P.style.width = "106px": "shapeW" === y.id || "shapeH" === y.id || "shapeD" === y.id ? P.style.width = "81px": "ambientLightColor" === y.id ? P.style.width = "60px": "pointLightColor" === y.idTyle ? P.style.width = "60px": "pointLightPosition" === y.idTyle ? P.style.width = "115px": "pointLightIntensity" === y.idTyle && (P.style.width = "60px"),
            d.appendChild(P);
            else if ("label" == S);
            else if ("button" == S) {
              var B = document.createElement("input");
              B.id = y.label,
              B.setAttribute("type", "button"),
              B.setAttribute("class", "parameterReset"),
              B.setAttribute("title", "reset"),
              "PositionReset" === y.label ? (B.setAttribute("onclick", "Utils.parameterReset('PositionReset','position')"), B.setAttribute("onmouseover", "Utils.setButtonStyleHover('PositionReset')"), B.setAttribute("onmouseout", "Utils.setButtonStyle('PositionReset')")) : "RotationReset" === y.label ? (B.setAttribute("onclick", "Utils.parameterReset('RotationReset','rotation')"), B.setAttribute("onmouseover", "Utils.setButtonStyleHover('RotationReset')"), B.setAttribute("onmouseout", "Utils.setButtonStyle('RotationReset')")) : "ScaleReset" === y.label ? (B.setAttribute("onclick", "Utils.parameterReset('ScaleReset','scale')"), B.setAttribute("onmouseover", "Utils.setButtonStyleHover('ScaleReset')"), B.setAttribute("onmouseout", "Utils.setButtonStyle('ScaleReset')")) : "TextureReset" === y.label && (B.setAttribute("onclick", "Utils.parameterReset('TextureReset','textureRepeat')"), B.setAttribute("onmouseover", "Utils.setButtonStyleHover('TextureReset')"), B.setAttribute("onmouseout", "Utils.setButtonStyle('TextureReset')")),
              B.setAttribute("onmousedown", "Utils.stopPropagation(event)"),
              d.appendChild(B)
            } else d.appendChild(P);
            if (y.inner && y.display !== !1) {
              var F = document.createElement("label");
              F.setAttribute("class", "innerLabel"),
              F.innerHTML = y.inner,
              d.appendChild(F)
            }
            if (y.pick) {
              var z = document.createElement("input");
              z.setAttribute("class", "image-pick-button"),
              z.setAttribute("name", "pick"),
              z.setAttribute("type", "button"),
              z.onclick = y.pickFunction,
              d.appendChild(z)
            }
            if (void 0 === y.
            return) {
              var G = document.createElement("div");
              G.setAttribute("class", "clear"),
              d.appendChild(G)
            }
            y.datalist && d.appendChild(y.datalist),
            u[h] = d
          } else d ? d.appendChild(y.value) : (d = document.createElement("div"), d.style.width = "800px", d.style.height = "400px", d.appendChild(y.value)),
          u[h] = d,
          y.id && c.push(y.id)
        }
        var H = new TabPanel;
        for (var V in u) H.addTab(V, u[V]);
        H.setTabChangedFunction(function(e) {
          Utils.setDialogRect("dialog_id"),
          r && r(e)
        });
        var Y = l ? l: "input_dialog_id";
        Utils.showDialog(Y, H.getView(), t, i, !1, null, n, o, a, c, g, m)
      }
    },
    showDialog: function(e, t, i, n, o, a, s, r, l, d, h) {
      Utils.addMask(e);
      var c = document.createElement("div");
      c.setAttribute("id", e),
      c.setAttribute("title", i),
      a ? c.setAttribute("class", a) : c.setAttribute("class", "dialog");
      var g = document.createElement("div");
      g.setAttribute("id", "dialog_title" + e),
      g.setAttribute("class", "dialog-title-div");
      var m = document.createElement("img");
      if (m.setAttribute("class", "new_icon"), m.setAttribute("src", "images/tw.png"), g.appendChild(m), i) {
        var u = document.createElement("span");
        u.innerHTML = i,
        u.setAttribute("class", "nd"),
        c.appendChild(u),
        g.appendChild(u)
      }
      if (o) {
        var p = document.createElement("img");
        p.setAttribute("src", "images/index01_03.png"),
        p.setAttribute("class", "delete"),
        p.onclick = function() {
          Utils.disposeDialog(e)
        },
        g.appendChild(p)
      }
      c.appendChild(g);
      var f = document.createElement("div");
      if (f.setAttribute("class", "clear"), g.appendChild(f), t && "string" == typeof t) {
        var v = document.createElement("div");
        v.innerHTML = t,
        a || v.setAttribute("class", "inner"),
        c.appendChild(v)
      }
      if (t && "object" == typeof t) {
        var v = document.createElement("div");
        if (v.appendChild(t), a || v.setAttribute("class", "inner"), c.appendChild(v), t.resetRect) {
          var y = document.getElementById("mask");
          document.getElementById("mask_" + e) && (y = document.getElementById("mask_" + e));
          var C = y.offsetWidth,
          S = y.offsetHeight;
          t.style.width = parseInt(.8 * C) + "px",
          t.style.height = parseInt(.7 * S) + "px"
        }
      }
      var I = {};
      if (n) {
        if (s) {
          var A = document.createElement("button");
          A.setAttribute("class", "cbt"),
          A.onclick = function() {
            Utils.disposeDialog(e)
          };
          var P = document.createElement("a");
          P.appendChild(A),
          c.appendChild(P)
        }
        var E = document.createElement("button");
        E.setAttribute("class", "obt");
        var w = document.createElement("a");
        w.appendChild(E),
        E.onclick = s ?
        function() {
          if (h && h.length > 0) {
            for (var t = {},
            i = 0; i < h.length; i++) {
              var n = h[i],
              o = document.getElementById("label" + n).value,
              a = document.getElementById(n).value;
              t[o] = a
            }
            I.customProps = t
          }
          if (d) for (var i = 0; i < d.length; i++) {
            var c = d[i],
            g = "";
            document.getElementById(c) && (I[c] = document.getElementById(c).value, g = document.getElementById(c).type),
            "checkbox" === g || "radio" === g ? I[c] = document.getElementById(c).checked: "select" === g ? I[c] = document.getElementById(c).selected: "file" === g && (I[c] = document.getElementById(c).files)
          }
          var m = [];
          l && (m = l),
          m.push(I);
          var u = s.apply(r, m); ("undefined" == typeof u || u) && Utils.disposeDialog(e)
        }: function() {
          Utils.disposeDialog(e)
        },
        c.appendChild(w)
      }
      return document.body.appendChild(c),
      Utils.setDialogRect(e),
      c.setAttribute("tabindex", -1),
      c.focus(),
      c.onkeydown = function(e) {
        window.event ? keynum = e.keyCode: e.which && (keynum = e.which),
        !Utils.isShiftDown(e) && 13 == keynum && E && E.click()
      },
      Utils.move("dialog_title" + e, e),
      I
    },
    getMouseP: function(e) {
      e = e || window.event;
      var t = e.pageX || e.pageY ? {
        x: e.pageX,
        y: e.pageY
      }: {
        x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: e.clientY + document.body.scrollTop - document.body.clientTop
      };
      return t
    },
    move: function(e, t) {
      e = document.getElementById(e),
      t = document.getElementById(t),
      t.moving = !1,
      e.onmousedown = function(e) {
        var i = Utils.getMouseP(e),
        n = {
          x: i.x - t.offsetLeft,
          y: i.y - t.offsetTop
        };
        document.onmousemove = function(e) {
          var i = Utils.getMouseP(e);
          t.style.left = i.x - n.x + "px",
          t.style.top = i.y - n.y + "px",
          t.moving = !0
        },
        document.onmouseup = function() {
          t.moving && (window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(), this.onmousemove = null, t.moving = !1)
        }
      }
    },
    setDialogRect: function(e) {
      var t = document.getElementById("mask");
      if (document.getElementById("mask_" + e) && (t = document.getElementById("mask_" + e)), t) {
        var i = t.offsetWidth,
        n = t.offsetHeight,
        o = document.getElementById(e),
        a = o.offsetWidth,
        s = o.offsetHeight;
        o.style.left = i / 2 - a / 2 + "px",
        o.style.top = n / 2 - s / 2 + "px"
      }
    },
    createRoom: function(e) {
      "room" === e ? (document.body.removeChild(document.getElementById("mask_newEditor")), document.body.removeChild(document.getElementById("newEditor")), Utils.checkLoadLocalImage()) : "component" === e && (document.location.href = "index.html?showEditor=false")
    },
    createComponent: function(e) {
      "room" === e ? document.location = "components.html": "component" === e && (document.body.removeChild(document.getElementById("mask_newEditor")), document.body.removeChild(document.getElementById("newEditor")), Utils.checkLoadLocalImage())
    },
    createLayerRow: function(e, t, i, n, o) {
      var a = new TreeComboBox(e, null, !0, o.getRoots(), null, null, i),
      s = {
        id: t,
        value: a.getView(),
        type: "div",
        tab: n
      };
      return s
    },
    createImageRow: function(e, t, i, n) {
      var o = localStorage.getItem(LOAD_RESOURCE_TYPE) === TYPE_CLOUD ? {
        label: e,
        id: t,
        value: i,
        pick: !0,
        tab: n,
        pickFunction: function() {
          Utils.pickImage(t)
        }
      }: {
        label: e,
        id: t,
        value: i,
        tab: n
      };
      return o
    },
    pickImage: function(e) {
      var t = new TextureImagePanel;
      t.init(),
      Utils.showDialog("imagepane", t.getView(), "Select Image", !0, !1, null, Utils.setImageCategory, Utils, [e, t])
    },
    setImageCategory: function(e, t) {
      var i = t.getLastNetworkData();
      i && document.getElementById(e) && (document.getElementById(e).value = i.getClient("path"))
    },
    pickAnimation: function(e, t) {
      var t = document.getElementById(e).value,
      i = new twaver.LayerBox,
      n = i.getDataById("default");
      if (Utils.isNotNull(t) && "" != t) {
        var o = t.split(";");
        for (var a in o) {
          var s = new twaver.Layer;
          0 == a && (s = n);
          var r = o[a],
          l = r ? r.split(":") : ["", "", ""],
          d = l[0],
          h = l[1],
          c = parseFloat(l[2]),
          g = l.length > 3 ? parseInt(l[3]) : 1500,
          m = l.length > 4 ? parseInt(l[4]) : 0,
          u = l.length > 5 ? l[5] : "Linear.None";
          s.setClient("action", d),
          s.setClient("anchor", h),
          s.setClient("value", c),
          s.setClient("time", g),
          s.setClient("delay", m),
          s.setClient("easing", u),
          i.getDataById(s.getId()) || i.add(s)
        }
      } else n.setClient("time", 1500),
      n.setClient("delay", 0),
      n.setClient("easing", "Linear.None");
      var p = new AnimationTable(i);
      p.showDialog(e)
    },
    queryString: function(e, t) {
      var i = new RegExp("" + t + "=([^&?]*)", "ig");
      return e.match(i) ? e.match(i)[0].substr(t.length + 1) : null
    },
    getImageSrc: function(e) {
      var t = "";
      return t = e.indexOf("http") >= 0 ? e: e.indexOf("base64") >= 0 ? e: e.indexOf(Utils.Path) >= 0 ? e: Utils.Path + e
    },
    showPortDialog: function(e, t, i, n) {
      var o = [{
        label: "Rows:",
        id: "rows",
        type: "input",
        value: 2
      },
      {
        label: "Columns:",
        id: "columns",
        type: "input",
        value: 2
      }];
      Utils.showInputDialog(o, "Port Params", !0, this.createPortByMat, this, [e, t, i, n])
    },
    createPortByMat: function(e, t, i, n, o) {
      var a = parseInt(o.rows),
      s = parseInt(o.columns),
      r = e.getElementBox(),
      l = e.getElementAt(t);
      if (l instanceof twaver.Grid) {
        var d = (i.resize, e.getLogicalPoint(t)),
        h = l.getCellObject(d);
        Utils.registerImage(Utils.Path + i.material, e, "component");
        for (var c = 0; a > c; c++) for (var g = 0; s > g; g++) {
          var m = new twaver.Follower;
          if (m.setImage(Utils.Path + i.material), m.setClient("text", n), m.setClient("resize", i.resize), r.getSelectionModel().setSelection(m), null != h) {
            "unresize" === i.resize && (m.setStyle("follower.fill.cell", !1), m.setWidth(i.args.x * e.zoom), m.setHeight(i.args.y * e.zoom)),
            m.setParent(l),
            m.setHost(l),
            m.setStyle("follower.row.index", h.rowIndex + c),
            m.setStyle("follower.column.index", h.columnIndex + g);
            var u = m.getParent().getParent(),
            p = m.getCenterLocation().x - u.getCenterLocation().x,
            f = m.getCenterLocation().y - u.getCenterLocation().y;
            m.setClient("offsetX", p / e.zoom),
            m.setClient("offsetY", f / e.zoom);
            var v = l.getClient("offset");
            m.setClient("offset", v + .15),
            m.setClient("selfID", m.getId()),
            m.setClient("hostCell", l),
            r.add(m)
          }
        }
        handleText2d(e)
      }
    },
    showTemplateDialog: function(e, t, i, n, o) {
      var a = [{
        label: "Rows :",
        id: "rows",
        type: "input",
        value: 2
      },
      {
        label: "Columns :",
        id: "columns",
        type: "input",
        value: 2
      },
      {
        label: "X Gap :",
        id: "xGap",
        type: "input",
        value: 20
      },
      {
        label: "Y Gap :",
        id: "yGap",
        type: "input",
        value: 20
      }];
      Utils.showInputDialog(a, "Template Params", !0, this.createTemplateByMat, this, [e, t, i, n, o])
    },
    createTemplateByMat: function(e, t, i, n, o, a) {
      var s = parseInt(a.rows),
      r = parseInt(a.columns),
      l = parseInt(a.xGap),
      d = parseInt(a.yGap),
      h = [];
      if (n.loadFromCloud) for (var o = function(e, n, o) {
        processHost(e, i),
        e._host ? e._host.setCenterLocation({
          x: t.getLogicalPoint(i).x + (e.getWidth() + l) * o,
          y: t.getLogicalPoint(i).y + (e.getHeight() + d) * n
        }) : e.setCenterLocation({
          x: t.getLogicalPoint(i).x + (e.getWidth() + l) * o,
          y: t.getLogicalPoint(i).y + (e.getHeight() + d) * n
        }),
        h.push(e),
        t.getSelectionModel().clearSelection(),
        h.forEach(function(e) {
          t.getSelectionModel().appendSelection(e)
        })
      },
      c = 0; s > c; c++) for (var g = 0; r > g; g++) e._createElement(t, t.getLogicalPoint(i), n, o, c, g);
      else for (var c = 0; s > c; c++) for (var g = 0; r > g; g++) {
        var m = e._createElement(t, t.getLogicalPoint(i), n, o);
        m._host ? m._host.setCenterLocation({
          x: t.getLogicalPoint(i).x + (m.getWidth() + l) * g,
          y: t.getLogicalPoint(i).y + (m.getHeight() + d) * c
        }) : m.setCenterLocation({
          x: t.getLogicalPoint(i).x + (m.getWidth() + l) * g,
          y: t.getLogicalPoint(i).y + (m.getHeight() + d) * c
        })
      }
    },
    checkPointFlag: function(e, t, i, n) {
      if ("undefined" != typeof i) if (t) t.setShowPoint(i);
      else if (i) {
        t = new TargetFlagNode(n);
        var o = borderPane.getView();
        if (n == f.ORIGINAL_POINT) var a = 0,
        s = 0;
        else var a = o.offsetWidth - ACCORDION_WIDTH,
        s = o.offsetHeight;
        t.setCenterLocation(a / 2, s / 2),
        e.getElementBox().add(t)
      }
    },
    isCtrlDown: function(e) {
      return e.ctrlKey || e.metaKey
    },
    isAltDown: function(e) {
      return e.altKey
    },
    isShiftDown: function(e) {
      return e.shiftKey
    },
    getVersion: function() {
      return "2.1"
    },
    createPointLight: function(e, t) {
      var i = new mono.PointLight(16777215, 1),
      n = 1e4;
      return "undefined" != typeof e && (n = e),
      i.setPosition(n, n, n),
      0 == t && i.setVisible(!1),
      i
    },
    clearLocalStorage: function() {
      localStorage && (localStorage.clear(), alert("success"))
    },
    setNetworkBackground: function(e, t) {
      var i = localStorage.getItem(t);
      i || (i = "#FFFFFF"),
      e.setClearColor(i)
    },
    copyDatasToBoxAnchor: function(e, t) {
      var i = modelManager.serializeDatasInfo(e, network._scaleUnitValue);
      console.log(i),
      t.copyAnchor = i
    },
    pasteBoxAnchorToBox: function(e, t) {
      var i = [];
      if (e.copyAnchor) {
        var n = modelManager.parseSketch(JSON.parse(e.copyAnchor));
        if (n instanceof Array) for (var o in n) t && n[o].setClient("floorName", t),
        e.add(n[o]),
        i.push(n[o])
      }
      return i
    },
    string2Boolean: function(e) {
      return e ? "false" === e ? !1 : !0 : !1
    },
    string2Float: function(e) {
      return e ? parseFloat(e) : defautValue
    },
    loadPropertiesFromLocalStorage: function(e, t, i, n, o) {
      var a = localStorage.getItem(LOAD_RESOURCE_TYPE);
      a ? loadResource = a: document.URL.startsWith(PropertyConsts.MONO_URL_PRE) && (loadResource = TYPE_CLOUD);
      var a = localStorage.getItem(DECIMAL_NUMBER);
      a && (decimalNumber = parseInt(a)),
      a = localStorage.getItem(CLOUD_KEY),
      a && (cloudKey = a),
      a = localStorage.getItem(CLOUD_PASSWORD),
      a && (cloudPassword = a),
      a = localStorage.getItem(AMBIENT_LIGHT_ON),
      a && t.setVisible(Utils.string2Boolean(a)),
      a = localStorage.getItem(AMBIENT_LIGHT_COLOR),
      a && t.setColor(a),
      a = localStorage.getItem(PropertyConsts.LocalStorage.SELECT_STYLE),
      a && (selectStyle = a);
      for (var s = 1; s <= i.length; s++) {
        if (a = localStorage.getItem(POINT_LIGHT_ON + s + ""), a && i[s - 1].setVisible(Utils.string2Boolean(a)), a = localStorage.getItem(POINT_LIGHT_POSITION + s + "")) {
          var r = a.split(",");
          3 == r.length ? i[s - 1].setPosition(r[0], r[1], r[2]) : i[s - 1].setPosition(r[0], r[0], r[0])
        }
        a = localStorage.getItem(POINT_LIGHT_COLOR + s + ""),
        a && i[s - 1].setColor(a),
        a = localStorage.getItem(POINT_LIGHT_INTENSITY + s + ""),
        a && i[s - 1].setIntensity(parseFloat(a))
      }
      if (e) a = localStorage.getItem(PropertyConsts.LocalStorage.FLOOR_STYLE),
      a && (floorStyle = a),
      a = localStorage.getItem(PropertyConsts.LocalStorage.FLOOR_SIZE),
      a && (floorSize = a),
      a = localStorage.getItem(SHOW_FLOOR),
      a && (showFloor = Utils.string2Boolean(a), showFloor || n.remove(viewFloor)),
      a = localStorage.getItem(ALL_VIEW_SELECTABLE),
      a && (allViewSelectable = Utils.string2Boolean(a));
      else {
        if (a = localStorage.getItem(SHOW_PROPERTY_SHEET), Utils.isNotNull(a) ? (showPropertySheet = Utils.string2Boolean(a), borderPane.setRight(showPropertySheet ? sheetPane: null)) : borderPane.setRight(null), a = localStorage.getItem(SHOW_TARGET_FLAG)) var l = Utils.string2Boolean(a);
        if (a = localStorage.getItem(SHOW_ORIGINAL_FLAG)) var d = Utils.string2Boolean(a);
        a = localStorage.getItem(SHOW_GRID),
        showGrid = Utils.isNotNull(a) ? Utils.string2Boolean(a) : !0,
        a = localStorage.getItem(PropertyConsts.SHOW_RULER_GUIDES),
        showRulerGuides = Utils.isNotNull(a) ? Utils.string2Boolean(a) : !1,
        a = localStorage.getItem(PropertyConsts.SHOW_RULER),
        showRuler = Utils.isNotNull(a) ? Utils.string2Boolean(a) : !0,
        o[0] instanceof GridNetwork && setTimeout(function() {
          o[0].setShowGrid(0 == showGrid ? !1 : !0)
        },
        100)
      }
      a = localStorage.getItem(ENABLE_SCALE),
      a && (enableScale = Utils.string2Boolean(a)),
      a = localStorage.getItem(SHOW_AXIS),
      a && (showAxis = Utils.string2Boolean(a)),
      a = localStorage.getItem(SHOW_AXIS_TEXT),
      a && (showAxisText = Utils.string2Boolean(a)),
      a = localStorage.getItem(PropertyConsts.ENABLE_EASING),
      a && (enableEasing = Utils.string2Boolean(a)),
      a = localStorage.getItem(SHOW_DIM),
      a && (showDim = Utils.string2Boolean(a)),
      a = localStorage.getItem(SHOW_COORD),
      a && (showCoord = Utils.string2Boolean(a)),
      e && (a = localStorage.getItem(IS_FULL_ROTATION_COMPONENT), a && (isFullRotation = Utils.string2Boolean(a), "undefined" != typeof o[1] && (isFullRotation ? o[1].getInteractions()[1].yRistrict = !1 : (o[1].getInteractions()[1].yRistrict = !0, reset4CCamera(6, 3)))), a = localStorage.getItem(SCALE_MIN_LIMIT), a && (scaleMinLimit = Utils.string2Float(a, .1)), a = localStorage.getItem(SCALE_MAX_LIMIT), a && (scaleMaxLimit = Utils.string2Float(a, 100)), a = localStorage.getItem(ZOOM_SPEED_COMPONENT), a && (comZoomSpeed = parseFloat(a)), a = localStorage.getItem(ROTATE_SPEED_COMPONENT), a && (comRotateSpeed = parseFloat(a)), a = localStorage.getItem(PAN_SPEED_COMPONENT), a && (comPanSpeed = Utils.string2Float(a)), a = localStorage.getItem(MAX_DISTANCE_COMPONENT), a && (comMaxDistance = parseFloat(a)), a = localStorage.getItem(MIN_DISTANCE_COMPONENT), a && (comMinDistance = parseFloat(a)), a = localStorage.getItem(PropertyConsts.NEAR_PLANE_COMPONENT), a && (comNearPlane = parseFloat(a)), a = localStorage.getItem(PropertyConsts.FAR_PLANE_COMPONENT), a && (comFarPlane = parseFloat(a)), a = localStorage.getItem(PropertyConsts.FOV_COMPONENT), a && (comFov = parseFloat(a))),
      e || (a = localStorage.getItem(IS_FULL_ROTATION), a && (isFullRotation = Utils.string2Boolean(a), "undefined" != typeof defaultInteraction && (isFullRotation ? defaultInteraction.yRistrict = !1 : (defaultInteraction.yRistrict = !0, defaultInteraction.yLowerLimitAngle = -Math.PI / 8, defaultInteraction.yUpLimitAngle = Math.PI / 2))), a = localStorage.getItem(ZOOM_SPEED), a && (zoomSpeed = parseInt(a)), a = localStorage.getItem(ROTATE_SPEED), a && (rotateSpeed = parseInt(a)), a = localStorage.getItem(PAN_SPEED), a && (panSpeed = Utils.string2Float(a)), a = localStorage.getItem(MAX_DISTANCE), a && (maxDistance = parseInt(a)), a = localStorage.getItem(MIN_DISTANCE), a && (minDistance = parseInt(a)), a = localStorage.getItem(PropertyConsts.NEAR_PLANE), a && (nearPlane = parseFloat(a)), a = localStorage.getItem(PropertyConsts.FAR_PLANE), a && (farPlane = parseFloat(a)), a = localStorage.getItem(PropertyConsts.FOV), a && (fov = parseFloat(a)));
      var h = localStorage.getItem(e ? "componentBackground": "roomBackground");
      if (o instanceof Array && o.length) for (var s = 0; s < o.length; s++) {
        var c = o[s];
        if (c instanceof GridNetwork) Utils.checkPointFlag(c, targetFlagElement, l),
        Utils.checkPointFlag(c, originalFlagElement, d, f.ORIGINAL_POINT),
        c.invalidateElementVisibility();
        else if (c instanceof mono.Network3D && (c.setShowAxis(showAxis), c.setShowAxisText(showAxisText), h && c.setClearColor(h), Utils.isNotNull(enableEasing))) {
          var g, m = c.getInteractions();
          m && m.forEach(function(e) {
            e instanceof mono.DefaultInteraction && (g = e)
          }),
          g && g.setEasing(enableEasing)
        }
      }
    },
    validateCloudKeyCallback: function(e, t, i, n) {
      var o = JSON.parse(e);
      if (o.error) alert(o.error);
      else {
        var a = o.value;
        if (!a) return void alert("Cloud key is invalid");
        if (a.end_date) {
          var s = new Date;
          if (Date.parse(a.end_date) - s < 0) return void alert("Cloud key is past due")
        }
        localStorage.setItem(CLOUD_KEY, t),
        localStorage.setItem(CLOUD_PASSWORD, i),
        n ? (accordion4C.clearAllCategories(), fillComponentCategoryView(), refreshComponentAccordion(accordion4C.getAccodion().getCurrentTitle())) : (accordionPane.clearAllCategories(), fillCategoryView(), refreshAccordion(accordionPane.getAccodion().getCurrentTitle()))
      }
    },
    validateCloudKey: function(e, t, i, n) {
      return e ? void Utils.doLogin(e, t, this, n) : void alert("Cloud key is required")
    },
    doLogin: function(e, t, i, n) {
      var o = {
        arguments: {
          username: e,
          password: t
        }
      };
      require(MONO_URL_LOGIN, o, n, i)
    },
    login: function(e, t, i, n) {
      var o = new XMLHttpRequest;
      o.timeout = 15e3,
      o.ontimeout = function() {
        n && n.call(i, {
          error: "request timeout"
        })
      };
      var a = new FormData;
      a.append("username", e),
      a.append("password", t),
      o.open("post", MONO_URL_LOGIN, !0),
      o.withCredentials = !0,
      o.onreadystatechange = function() {
        4 == o.readyState && 200 == o.status && n && n.call(i, http.responseText)
      },
      o.send(a)
    },
    doLogout: function() {
      if (confirm("Logout?")) {
        var e = {
          arguments: {}
        };
        document.location.href = "login.html",
        localStorage.setItem("mono-user", ""),
        require(MONO_URL_LOGOUT, e)
      }
    },
    isNotNull: function(e) {
      return void 0 !== e && "undefined" !== e && null !== e && "null" !== e && "" !== e
    },
    registerRandomImage: function(e, t) {
      var i = new Image;
      i.src = Utils.RelativePath + t,
      i.crossOrigin = "";
      i.onload = function() {
        twaver.Util.registerImage(e, i, i.width, i.height),
        i.onload = null
      }
    },
    handlerTexture: function(e, t, i) {
      var n;
      if (Utils.isNotNull(e)) {
        if (e instanceof Array) {
          n = [];
          for (var o = 0; o < e.length; o++) {
            var a = Utils.handlerTexture(e[o], t, i);
            n.push(a)
          }
        } else "string" != typeof e || e.startsWith("data:image") || e.startsWith("http") ? n = e.startsWith("http") && i && e.indexOf("%") >= 0 ? decodeURI(e) : e: (n = Utils.RelativePath + e, t && (n = PropertyConsts.MONO_IMG_PRE + n));
        return n
      }
      return n
    },
    scaleCanvas: function(e, t, i) {
      var n = e.width,
      o = e.height;
      void 0 == t && (t = n),
      void 0 == i && (i = o);
      var a = o > n ? n: o,
      s = n > a ? (n - a) / 2 : 0,
      r = o > a ? (o - a) / 2 : 0,
      l = document.createElement("canvas"),
      d = l.getContext("2d");
      return l.width = t,
      l.height = i,
      d.drawImage(e, s, r, a, a, 0, 0, t, i),
      l
    },
    checkLoadLocalImage: function() {
      try {
        var e = document.createElement("canvas"),
        t = new Image;
        t.src = Utils.getImageSrc("floor.png");
        var i = e.getContext("2d");
        i.fillStyle = "#EEEEFF",
        i.fillRect(0, 0, 400, 300),
        t.onload = function() {
          i.drawImage(t, 0, 0, 100, 100);
          try {
            i.getImageData(0, 0, 100, 100)
          } catch(e) {
            if (console.log(e), console.log(e.name), console.log(e.message), "SecurityError" === e.name && (e.message.indexOf("the canvas has been tainted by cross-origin data") >= 0 || e.message.indexOf("SecurityError: DOM Exception 18") >= 0)) {
              var n = "<div class='error_dialog'><span class='r_title'>Get cross-origin data</span><p>Your browser can not access local file and will get security error.<br>click <a href='http://twaver.servasoft.com/?p=7366' target='_blank'>twaver.servasoft.com</a> to get solution</p></div>";
              Utils.showDialog("errorDialog", n, "Warning", !1, !0, "loadimagedialog")
            }
          }
        }
      } catch(n) {
        console.log(n)
      }
    },
    paintArrow: function(e, t, i, n, o, a) {
      if (e && t && i) {
        e.moveTo(t.x, t.y),
        e.lineTo(i.x, i.y);
        var s = i.x,
        r = i.y;
        o = o || 10,
        a = a || 5,
        n = n || "up",
        e.moveTo(s, r),
        "up" == n ? (e.lineTo(s - o / 2, r + a), e.lineTo(s + o / 2, r + a)) : "right" == n ? (e.lineTo(s - a, r - o / 2), e.lineTo(s - a, r + o / 2)) : "left" == n ? (e.lineTo(s + a, r + o / 2), e.lineTo(s + a, r - o / 2)) : "down" == n && (e.lineTo(s + o / 2, r - a), e.lineTo(s - o / 2, r - a)),
        e.lineTo(s, r),
        e.fill()
      }
    },
    isTargetFlag: function(e) {
      return e && e instanceof TargetFlagNode && e.getType() == f.TARGET_POINT
    },
    isOriginalFlag: function(e) {
      return e && e instanceof TargetFlagNode && e.getType() == f.ORIGINAL_POINT
    },
    createSelectInput: function(e, t, i) {
      if (e && !(e.length <= 0)) {
        var n = document.createElement("select");
        t && (i = i || "onchange", n[i] = t);
        for (var o = 0; o < e.length; o++) {
          var a = e[o],
          s = document.createElement("option");
          s.setAttribute("value", a),
          s.innerHTML = a,
          n.appendChild(s)
        }
      }
    },
    categoryCache: {},
    publicCategoryCache: {},
    initCategory: function(e, t, i, n) {
      Object.getOwnPropertyNames(e).length <= 0 ? Utils.getTemplateCategory(e, t, i, n) : n && n()
    },
    getTemplateCategory: function(e, t, i, n) {
      function o(e, t, i) {
        if (i.type && i.type == PropertyConsts.TYPE_COMPONENT) {
          var n = e[i.type];
          n || (e[i.type] = n = {})
        }
        if (n) {
          var o = n[t];
          o || (n[t] = o = {})
        } else {
          var o = e[t];
          o || (e[t] = o = {})
        }
        if (o.children ? o.children.push(i) : o.children = [i], i.type && i.type == PropertyConsts.TYPE_COMPONENT && t == PropertyConsts.TYPE_ROOTCATEGORY) {
          var a = e[t];
          a || (e[t] = a = {}),
          a.children ? a.children.push(i) : a.children = [i]
        }
        return o
      }
      var a = {};
      Utils.isNotNull(i) && (a.scope = i);
      var s = {
        module: t,
        method: "search",
        arguments: a
      },
      r = function() {
        if (1 === arguments.length) {
          var t = JSON.parse(arguments[0]);
          if (t.error) return void alert(t.error);
          for (var i = t.value,
          a = 0; a < i.length; a++) {
            var s = i[a];
            s.type && s.type == PropertyConsts.TYPE_COMPONENT && (e[s.type] || (e[s.type] = {}), e[s.type][s.id] = s),
            e[s.id] = s
          }
          for (var a = 0; a < i.length; a++) {
            var s = i[a];
            s.parent_id ? o(e, s.parent_id, s) : o(e, PropertyConsts.TYPE_ROOTCATEGORY, s)
          }
          n && n()
        }
      };
      require(MONO_URL, s, r, this)
    },
    requestMono: function(e, t, i) {
      require(MONO_URL, e, t, i)
    },
    stopPropagation: function(e) {
      e.stopPropagation && e.stopPropagation(),
      e.preventDefault ? e.preventDefault() : e.returnValue = !1
    },
    convert2Radian: function(e) {
      return e * Math.PI / 180
    },
    convert2Angle: function(e) {
      return 180 * e / Math.PI
    },
    showLoginDialog: function() {
      var e = [{
        label: "Cloud Key:",
        id: "key"
      },
      {
        label: "Cloud Password:",
        type: "password",
        id: "password"
      }];
      Utils.showInputDialog(e, "Login", !0,
      function() {
        var e = document.getElementById("key").value,
        t = document.getElementById("password").value;
        Utils.validateCloudKey(e, t, !1,
        function(i) {
          var n = JSON.parse(i);
          if (n.error) alert(n.error);
          else {
            var o = n.value;
            o ? Date.parse(o.end_date) - new Date < 0 ? alert("Cloud key is past due") : (localStorage.setItem(LOAD_RESOURCE_TYPE, TYPE_CLOUD), localStorage.setItem(CLOUD_KEY, e), localStorage.setItem(CLOUD_PASSWORD, t)) : alert("Cloud key is invalid")
          }
          location.reload()
        })
      },
      this)
    },
    generateAssembleId: function(e) {
      return e = e || mono.Math.generateUUID()
    },
    setButtonsStyle: function(e, t) {
      if (e) for (var i = 0; i < e.length; i++) if (e[i] !== t) {
        var n = document.getElementById(e[i]);
        n.setAttribute("class", e[i])
      } else {
        var o = document.getElementById(t);
        o.setAttribute("class", t + "_hover")
      }
    },
    createLinkHandle: function(e) {
      var t = e.getSelectionModel().getSelection();
      if (! (2 != t.size() || t.get(0) instanceof mono.Link || t.get(1) instanceof mono.Link)) {
        var i = [{
          label: "Link Style:",
          id: "linkStyle",
          type: "select",
          options: PropertyConsts.LINK_STYPE,
          value: "orthogonal.y"
        },
        {
          label: "Link Color:",
          id: "linkColor",
          value: "blue"
        },
        {
          label: "Link Size:",
          id: "linkSize",
          value: 5
        },
        {
          label: "Link Extend:",
          id: "linkExtend",
          value: 0
        },
        {
          label: "Link point data:",
          id: "linkPoints",
          tab: "Link Points",
          type: "textArea",
          readonly: !1,
          value: ""
        }];
        this.showInputDialog(i, "Link Properties", !0, this.createLinkDialogHandle, this, [e], !0)
      }
    },
    createLinkDialogHandle: function(e, t) {
      var i = e.getSelectionModel().getSelection(),
      n = new TGL.Link(i.get(0), i.get(1));
      if (n.setExtend(parseFloat(t.linkExtend)), n.setLinkType(t.linkStyle), n.s({
        "m.color": t.linkColor,
        "m.linewidth": parseFloat(t.linkSize)
      }), "control" == t.linkStyle && t.linkPoints) {
        for (var o = t.linkPoints.toString().replace(/\s/g, ",").replace(/\r\n/g, ","), a = o.split(","), s = [], r = 0; r < a.length; r += 3) isNaN(parseFloat(a[r])) || s.push(new TGL.Vec3(parseFloat(a[r]), parseFloat(a[r + 1]), parseFloat(a[r + 2])));
        n.setControls(s)
      }
      e.add(n)
    },
    scale3DElement: function(e, t) {
      var i = e.getPosition().clone();
      e.setPosition(i.x * t, i.y * t, i.z * t);
      var n = e.getClassName();
      switch (n = n.replace("TGL.", "mono.")) {
      case "mono.Cube":
        e.setWidth(e.getWidth() * t),
        e.setHeight(e.getHeight() * t),
        e.setDepth(e.getDepth() * t);
        break;
      case "mono.Sphere":
        e.setRadius(e.getRadius() * t);
        break;
      case "mono.Cylinder":
        e.setRadiusTop(e.getRadiusTop() * t),
        e.setRadiusBottom(e.getRadiusBottom() * t),
        e.setHeight(e.getHeight() * t);
        break;
      case "mono.Torus":
        e.setRadius(e.getRadius() * t),
        e.setTube(e.getTube() * t);
        break;
      case "mono.Billboard":
        var o = e.getScale();
        e.setScale(o.x * t, o.y * t, 1);
        break;
      case "mono.PathNode":
        e.setRadius(e.getRadius() * t);
        var a = e.getPath(),
        s = a.toArray(),
        r = Utils._createPath(s, t);
        e.setPath(r);
        break;
      case "mono.TextNode":
        var l = e.getScale();
        e.setHeight(e.getHeight() * t),
        e.setScale(l.x * t, l.y * t, l.z * t);
        break;
      case "mono.ComboNode":
        var d = e.getCombos(),
        h = e.getStyle("m.texture.image", !0),
        c = e.getStyle("m.texture.repeat", !0),
        g = [];
        for (var m in d) Utils.scale3DElement(d[m], t),
        g.push(d[m]);
        e.setCombos(g),
        e.setStyle("m.texture.image", h),
        e.setStyle("m.texture.repeat", c);
        break;
      case "mono.LatheNode":
        var a = e.getPath(),
        s = a.toArray(),
        r = Utils._createPath(s, t);
        e.setPath(r);
        break;
      case "mono.Entity":
      }
    }
  };
  var r = function(e) {
    for (var t = box.getNodes().toArray(), i = t.length, n = 0; i > n; n++) {
      var o = t[n];
      o.isSelected() && o.setRotationZ(o.getRotation().z + e)
    }
  };
  $rSelected = r;
  var l = function() {
    var e = box.getSelectionModel().getSelection(),
    t = e.size();
    if (0 === t) alert("Select one or more objects.");
    else {
      var i = "";
      1 === t && (i = e.get(0).getGroupId());
      for (var n = window.prompt("Group ID:", i), o = 0; t > o; o++) {
        var a = e.get(o);
        a.setGroupId(n)
      }
    }
  };
  $group = l;
  var d = function(e) {
    var t = [];
    t.push();
    var i = [{
      label: "Select align pattern:",
      id: "group_on_ground",
      name: "align",
      type: "radio",
      checked: !0,
      inner: '<img src="' + Utils.Path + '../images/align_group_on_ground.png" />   Group align on ground'
    },
    {
      label: "",
      id: "group_under_ground",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_group_under_ground.png" />   Group align under ground'
    },
    {
      label: "",
      id: "on_ground",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_on_ground.png" />   Align on ground'
    },
    {
      label: "",
      id: "under_ground",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_under_ground.png" />   Align under ground'
    },
    {
      label: "",
      id: "center",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_center_3d.png" />   Align center'
    },
    {
      label: "",
      id: "top",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_top_3d.png" />   Align top'
    },
    {
      label: "",
      id: "bottom",
      name: "align",
      type: "radio",
      checked: !1,
      inner: '<img src="' + Utils.Path + '../images/align_bottom_3d.png" />   Align bottom'
    }];
    Utils.showInputDialog(i, "Align Pattern", !0, h, this, [e])
  },
  h = function(e, t) {
    for (var i = (t.group_on_ground || t.group_under_ground, new Array), n = e.getSelectionModel().getSelection(), o = n.size(), a = 0; o > a; a++) {
      var s = n.get(a);
      i.push(s)
    }
    var r, l;
    if (i.length > 0) for (var a = 0; a < i.length; a++) {
      var s = i[a];
      if (s && !s.getParent()) {
        var d = s.getWorldBoundingBox();
        d && (t.under_ground && s.setPositionY(s.getPosition().y - d.max.y), t.on_ground && s.setPositionY(s.getPosition().y - d.min.y), (!r || r < d.max.y) && (r = d.max.y), (!l || l > d.min.y) && (l = d.min.y))
      }
    }
    if (!t.under_ground && !t.on_ground && (r || l) && i.length > 0) for (var a = 0; a < i.length; a++) {
      var s = i[a];
      if (s && !s.getParent()) {
        if (t.top) {
          var h = r - s.getWorldBoundingBox().max.y;
          s.setPositionY(s.getPosition().y + h)
        }
        if (t.group_under_ground && s.setPositionY(s.getPosition().y - r), t.bottom) {
          var h = s.getWorldBoundingBox().min.y - l;
          s.setPositionY(s.getPosition().y - h)
        }
        t.group_on_ground && s.setPositionY(s.getPosition().y - l),
        t.center && s.setPositionY((r + l) / 2)
      }
    }
  };
  $align3d = d;
  var c = function() {
    var e = [];
    e.push();
    var t = [{
      label: "Select layout pattern:",
      id: "star",
      name: "layout",
      type: "radio",
      checked: !0,
      inner: '<img src="' + Utils.Path + '../images/align_group_on_ground.png" />   Star layout'
    }];
    Utils.showInputDialog(t, "Layout Pattern", !0, g, this, [box])
  },
  g = function(e, t) {
    for (var i = (t.group_on_ground || t.group_under_ground, new Array), n = e.getSelectionModel().getSelection(), o = n.size(), a = 0; o > a; a++) {
      var s = n.get(a);
      s.getParent() || i.push(s)
    }
    var r, l, d, h = new mono.Vec3(0, 1, 0);
    if (i.length > 0) for (var a = 0; a < i.length; a++) {
      var s = i[a];
      if (s && !s.getParent()) {
        s.setRotation(0, 0, 0),
        0 == a && (r = s.getPosition().x, l = s.getPosition().y, d = s.getPosition().z),
        s.setPosition(r, l, d);
        var c = s.getWorldBoundingBox();
        if (c) {
          var g = c.max.x - c.min.x;
          if (s.setPositionX(s.getPosition().x + g / 2), a > 0) {
            var m = 2 * Math.PI / i.length * a;
            s.rotateFromAxis(h, new mono.Vec3(r - s.getPosition().x, l - s.getPosition().y, d - s.getPosition().z), m)
          }
        }
      }
    }
  };
  $layout3d = c;
  var m = function(e) {
    for (var t = new Array,
    i = box.getSelectionModel().getSelection(), n = i.size(), o = 0; n > o; o++) {
      var a = i.get(o);
      t.push(a)
    }
    u(t, e)
  };
  $combo = m;
  var u = function(e, t) {
    if (e.length > 1) {
      for (var i = [], n = 1; n < e.length; n++) i.push(t);
      for (var o = new mono.ComboNode(e, i), n = 0; n < e.length; n++) {
        var a = e[n];
        box.remove(a)
      }
      Utils.setComboCentralized(o),
      box.add(o)
    }
  };
  Utils.setComboCentralized = function(e) {
    if (e) {
      e.setCentralized(!0);
      var t = e.getOffsetPosition(),
      i = e.getPosition();
      t && e.setPosition(i.x + t.x, i.y + t.y, i.z + t.z)
    }
  };
  var p = function() {
    var e = (new Date).getFullYear(),
    t = "<div id = 'about' class='mar' style='margin-top:0px;'><p>MONO DESIGN is a TWaver online 2D/3D modelling tool.</p><br><p>Visit our website to get more information:</p><p><a href='http://twaver.servasoft.com'>twaver.servasoft.com</a></p><p><a href='http://doc.servasoft.com/'>doc.servasoft.com</a></p><br><p>Contact us:<a href='mailto:info@servasoftware.com'>info@servasoftware.com</a></p><br><p>&copy; Copyright " + e + " <b>Serva Software LLC.</b> All rights reserved.</p><br></div>";
    Utils.showDialog("dialog-about", t, "About MONO DESIGN " + Utils.getVersion(), !0, !1)
  };
  $showabout = p;
  Utils.getUnPredefinedFloorLayers = function(e) {
    var t = new twaver.List;
    return e.getLayerBox().getRoots().forEach(function(e) {
      e.getClient("floorLayer") && !e.getClient("predefined") && t.add(e)
    }),
    t
  },
  Utils.addInteractionComboBox = function(e, t) {
    var i = twaver.Util.isTouchable ? ["Touch", "None"] : ["Default-Lazy", "Edit-Live"],
    n = function() {
      "Default-Lazy" === this.value ? (allNetworks[2].setDefaultInteractions(!0), allNetworks[2]._lazyMoveAnimate = null) : "Edit-Live" === this.value && allNetworks[2].setEditInteractions()
    };
    Utils.addComboBox(e, i, n, t)
  },
  Utils.addComboBox = function(e, t, i, n) {
    var o = document.createElement("select");
    return o.style.verticalAlign = "top",
    o.setAttribute("class", "combobox-comp"),
    t.forEach(function(e) {
      var t = document.createElement("option");
      t.appendChild(document.createTextNode(e)),
      t.setAttribute("value", e),
      o.appendChild(t)
    }),
    i && o.addEventListener("change", i, !1),
    n && (o.value = n),
    e.appendChild(o),
    o
  },
  Utils.getLayerByFloorName = function(e, t) {
    var i = null;
    return e.forEach(function(e) {
      return e.getClient("floorName") == t ? void(i = e) : void 0
    }),
    i
  },
  Utils.createProgressBar = function(e, t) {
    var i = document.createElement("div");
    i.style.width = e + "px",
    i.style.height = t + "px",
    i.style.position = "absolute";
    for (var n = 1; 8 >= n; n++) {
      var o = document.createElement("div");
      o.className = "blockG",
      o.id = "rotateG_0" + n,
      i.appendChild(o)
    }
    return i
  },
  Utils.createToolTipDiv = function(e, t) {
    if (0 / 0 != parseInt(e) && 0 / 0 != parseInt(t)) {
      e = parseInt(e),
      t = parseInt(t);
      var i = document.createElement("div");
      i.style.width = e + "px",
      i.style.height = t + "px",
      i.style.zIndex = "1001",
      i.style.display = "none",
      i.id = "toolTipId",
      i.setAttribute("class", "bubble arrow"),
      i.style.backgroundColor = "#FCFBF7",
      i.style.backgroundImage = "url(images/loading.png)",
      i.style.backgroundRepeat = "no-repeat",
      document.body.appendChild(i);
      var n = document.createElement("span");
      n.id = "toolTipTextId",
      n.innerHTML = "",
      n.style.color = "rgb(240,120,25)",
      n.style.fontSize = "11px",
      n.style.position = "absolute",
      n.style.top = "3px",
      n.style.left = "5px",
      n.style.width = "205px",
      i.appendChild(n)
    }
  },
  Utils.addNumberCommas = function(e) {
    e += "",
    x = e.split("."),
    x1 = x[0],
    x2 = x.length > 1 ? "." + x[1] : "";
    for (var t = /(\d+)(\d{3})/; t.test(x1);) x1 = x1.replace(t, "$1,$2");
    return x1 + x2
  },
  Utils.loginMONO = function(e, t) {
    if (!e || !t) return void alert("username and password is required");
    var i = new XMLHttpRequest,
    n = new FormData;
    n.append("username", e),
    n.append("password", t),
    i.open("post", "https://mono-design.cn/login", !0),
    i.withCredentials = !0,
    i.onreadystatechange = function() {
      if (4 == i.readyState && 200 == i.status) {
        var t = JSON.parse(i.responseText);
        t.error ? alert(t.error) : (localStorage.setItem("mono-user", e), localStorage.setItem("loadResource", "cloud"))
      }
    },
    i.send(n)
  },
  Utils.setupLogout = function() {
    var e = document.getElementById("main_toolbar");
    if (e) {
      var t = localStorage.getItem("mono-user");
      e.innerHTML += null == t ? '<img src="images/user.png"><a href="login.html"> Login</a>': '<img src="images/user.png"><a id="user" href="#" onclick="Utils.showUserProfile();" title="Click show your profile">' + t + '</a> | <a id="logout" href="#" onclick="Utils.doLogout();">Logout</a>'
    }
  },
  Utils.ready = function(e) {
    return "complete" == document.readyState ? e() : void(window.addEventListener ? window.addEventListener("load", e, !1) : window.attachEvent ? window.attachEvent("onload", e) : window.onload = e)
  },
  Utils.ready(function() {
    Utils.setupLogout()
  }),
  Utils.showUserProfile = function() {
    var e = (localStorage.getItem("mono-user"), {
      arguments: {},
      method: "getSelf",
      module: "users"
    });
    require(MONO_URL, e, Utils.showUserProfileDialog)
  },
  Utils.publishTemplate = function(e, t, i) {
    var n = (localStorage.getItem("mono-user"), {
      arguments: {
        template_id: e,
        category_id: i
      },
      method: "publish",
      module: "templates"
    });
    require(MONO_URL, n,
    function() {
      var e = 'Template "' + t + '" has been published successfully.';
      alert(e)
    })
  },
  Utils.unpublishTemplate = function(e, t, i) {
    var n = (localStorage.getItem("mono-user"), {
      arguments: {
        template_id: e,
        category_id: i
      },
      method: "unpublish",
      module: "templates"
    });
    require(MONO_URL, n,
    function() {
      var e = 'Template "' + t + '" has been unpublished successfully.';
      alert(e)
    })
  },
  Utils.showUserProfileDialog = function(e) {
    var t = JSON.parse(e),
    i = t.value,
    n = [{
      label: "User:",
      id: "user",
      readonly: !0,
      value: i.user,
      editable: !1
    },
    {
      label: "Valid From:",
      id: "start_date",
      readonly: !0,
      value: Utils.formatDate(i.start_date),
      editable: !1
    },
    {
      label: "Valid Thru:",
      id: "end_date",
      readonly: !0,
      value: Utils.formatDate(i.end_date),
      editable: !1
    },
    {
      label: "Old Password:",
      id: "old_password",
      readonly: !1,
      type: "password",
      value: "",
      editable: !0
    },
    {
      label: "New Password:",
      id: "password",
      readonly: !1,
      type: "password",
      value: "",
      editable: !0
    },
    {
      label: "Confirm Password:",
      id: "password2",
      readonly: !1,
      type: "password",
      value: "",
      editable: !0
    }],
    o = function(e) {
      if (e.password != e.password2) return void alert("New password and confirm password do not match");
      if (!e.password || e.length < 8) return void alert("New password should at least 8 characters");
      var t = {
        module: "users",
        method: "changepw",
        arguments: {
          old_password: e.old_password,
          new_password: e.password
        }
      };
      require(MONO_URL, t,
      function() {
        alert("New password has been set up")
      })
    };
    Utils.showInputDialog(n, "User Profile", !0, o, this, [], null, null)
  },
  Utils.formatDate = function(e) {
    if (e) {
      var t = Date.parse(e),
      i = new Date(t),
      n = new Date(i).format("yyyy-MM-dd");
      return n
    }
    return ""
  },
  Utils.setPolygonOffset = function(e, t, i) {
    var n = "m.polygonOffset";
    if (i && (n = i + "." + n), e) {
      var o = n + "Factor",
      a = n + "Units";
      e.setStyle(n, !0),
      e.setStyle(o, 1),
      e.setStyle(a, t)
    }
  },
  Utils.updateBoxInfo = function(e) {
    if (!e.batch) {
      var t = document.getElementById("boxInfo");
      if (t) {
        for (var i = e.getDatas().toArray(), n = 0, o = 0, a = 0; a < i.length; a++) {
          var s = i[a];
          if (s.faces) {
            if (s.getClient(PropertyConsts.COMPONENTFLOOR)) continue;
            o += s.faces.length,
            n++
          }
        }
        n = Utils.addNumberCommas(n),
        o = Utils.addNumberCommas(o),
        t.innerHTML = "Objects: " + n + "<br>Faces: " + o
      }
    }
  },
  Utils.updateFpsInfo = function(e, t) {
    var i = document.getElementById("fpsInfo");
    i && (i.innerHTML = "FPS: " + e + "<br>TPF: " + t + " ms")
  },
  Utils.setupEightLights = function(e, t) {
    t = t || 5e3;
    for (var i = .5,
    n = [[1, 1, 1], [ - 1, 1, 1], [1, 1, -1], [ - 1, 1, -1], [1, -1, 1], [ - 1, -1, 1], [1, -1, -1], [ - 1, -1, -1]], o = 0; o < n.length; o++) {
      var a = n[o][0] * t,
      s = n[o][1] * t,
      r = n[o][2] * t,
      l = new mono.PointLight(16777215, i);
      l.setPosition(a, s, r),
      e.add(l)
    }
  },
  Utils.createNetworkInfoTag = function(e, t, i) {
    var n = document.createElement("span");
    n.innerHTML = "",
    n.style.position = "absolute",
    n.style.left = "2px",
    n.style.background = "transparent",
    n.style.width = "200px",
    n.style.top = i,
    n.style.color = "#AAAAAA",
    n.setAttribute("id", t),
    e.appendChild(n)
  },
  Utils.setupNetworkInfoTags = function(e) {
    var t = document.createElement("div");
    Utils.createNetworkInfoTag(t, "boxInfo", "0px"),
    Utils.createNetworkInfoTag(t, "fpsInfo", "25px"),
    t.setAttribute("class", "network3d-boxinfo"),
    e.getRootView().appendChild(t)
  },
  Utils.createToggleImage = function(e, t, i) {
    i = i || document.body;
    var n = document.createElement("div");
    n.setAttribute("class", e),
    i.appendChild(n);
    var o = document.createElement("div");
    return o.setAttribute("class", t),
    o.style.display = "block",
    n.appendChild(o),
    o
  },
  Utils.createLeftToggleImage = function(e, t, i) {
    var n = Utils.createToggleImage("hidden-left-div", "left-expand-img", i);
    n.onclick = function() {
      var i = document.getElementsByClassName("hidden-left-div")[0];
      "left-expand-img" == this.getAttribute("class") ? (this.setAttribute("class", "left-expand-img left-collapse-img"), i.setAttribute("class", "hidden-left-div hidden-left-collapse-div"), e()) : (i.setAttribute("class", "hidden-left-div"), this.setAttribute("class", "left-expand-img"), t())
    }
  },
  Utils.createTopToggleImage = function(e, t, i) {
    var n = Utils.createToggleImage("hidden-top-div", "top-expand-img", i);
    n.onclick = function() {
      var i = document.getElementsByClassName("hidden-top-div")[0],
      n = document.getElementById("menubar");
      "top-expand-img" == this.getAttribute("class") ? (this.setAttribute("class", "top-expand-img top-collapse-img"), i.setAttribute("class", "hidden-top-div hidden-top-collapse-div"), n.style.display = "none", e()) : (i.setAttribute("class", "hidden-top-div"), this.setAttribute("class", "top-expand-img"), n.style.display = "block", t())
    }
  },
  Utils.isMainNode = function(e) {
    var t = !1;
    return e && e.getClient && Utils.isNotNull(e.getClient("mainVisible")) && 0 == e.getClient("mainVisible") && (t = !0),
    t
  },
  Utils.setBox3DSelectStyle = function(e, t) {
    e.forEach(function(e) {
      e instanceof mono.Entity && Utils.setElementSelectStyle(e, t)
    })
  },
  Utils.setElementSelectStyle = function(e, t) {
    t == PropertyConsts.SELECT_STYLE.WIREFRAME ? e.setStyle("select.style", "outline.wireframe") : t == PropertyConsts.SELECT_STYLE.NORMAL ? e.setStyle("select.style", "outline.normal") : t == PropertyConsts.SELECT_STYLE.BORDER && e.setStyle("select.style", "border")
  },
  Utils.setElementCustomProps = function(e, t, i) {
    var n = t.getClient(CUSTOM_PROPS);
    if (n) for (var o in n) {
      var a = n[o];
      void 0 == i[a] && t.setClient(a, null)
    }
    if (i) {
      var s;
      for (var o in i) s = i[o],
      t.setClient(s, e.getClient(s));
      t.setClient(CUSTOM_PROPS, i)
    }
  },
  Utils.isFloorVisibleByFloorName = function(e, t) {
    var i = !0;
    return t.forEach(function(t) {
      return t.getClient("floorName") == e ? i = t.getClient("floorVisible") : void 0
    }),
    i
  },
  Utils.transforAndScaleCanvasContext = function(e, t) {
    var i = e.getContext("2d");
    if (!t && e.isTransfor && e.width && e.height) return i;
    if (devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = i.webkitBackingStorePixelRatio || i.mozBackingStorePixelRatio || i.msBackingStorePixelRatio || i.oBackingStorePixelRatio || i.backingStorePixelRatio || 1, ratio = devicePixelRatio / backingStoreRatio, devicePixelRatio !== backingStoreRatio) {
      var n = e.width,
      o = e.height;
      e.width = n * ratio,
      e.height = o * ratio,
      e.style.width = n + "px",
      e.style.height = o + "px",
      i.scale(ratio, ratio)
    }
    return e.width && e.height && (e.isTransfor = !0),
    i
  },
  Date.prototype.format = function(e) {
    var t = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds()
    };
    /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var i in t) new RegExp("(" + i + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? t[i] : ("00" + t[i]).substr(("" + t[i]).length)));
    return e
  },
  Number.prototype.format = function(e, t, i, n) {
    var o = "\\d(?=(\\d{" + (t || 3) + "})+" + (e > 0 ? "\\D": "$") + ")",
    a = this.toFixed(Math.max(0, ~~e));
    return (n ? a.replace(".", n) : a).replace(new RegExp(o, "g"), "$&" + (i || ","))
  },
  ImageShapeNode = function() {
    ImageShapeNode.superClass.constructor.apply(this, arguments),
    this.setClient(IMAGE_SRC, Utils.Path + "room.png"),
    this.setStyle("vector.outline.color", "#333333"),
    this.setStyle("vector.outline.width", 10),
    this.setClient("shapenode.closed", !0),
    this.setClient("focusColor", "green"),
    this.setClient("resizeBorderWidth", 10),
    this.setClient("resizeBorderLength", 18),
    this.setClient("resizeBorderGap", 10),
    this.setClient("resizeBorderColor", "yellow"),
    this.setClient("wallInnerPic", Utils.Path + "wall00-inner.png"),
    this.setClient("wallOuterPic", Utils.Path + "wall00.png"),
    this.setClient("size", {
      x: 0,
      y: 300,
      z: 10
    }),
    this.setClient("useTexture", !1),
    this.setClient("framePic", Utils.Path + "wall00-frame.png"),
    this.setClient("fill", !0),
    this.setClient("showDim", showDim),
    this.setClient("dimLeadLength", 35),
    this.setClient("dimLineOffset", .7),
    this.setClient("dimLineWidth", 1),
    this.setClient("dimColor", "#F07819"),
    this.setClient("dimTextGap", 5),
    this.setClient("dimTextFont", "12px Arial"),
    this.setClient("dimArrowWidth", 8),
    this.setClient("dimArrowHeight", 3),
    this.setClient("showCoord", showCoord),
    this.setClient("coordTextColor", "white"),
    this.setClient("coordTextFont", "12px Arial"),
    this.setClient("coordTextOffsetX", 0),
    this.setClient("coordTextOffsetY", 20),
    this.setClient("coordTextAlign", "center"),
    this.setClient("coordTextBaseline", "middle"),
    this.setClient("coordTextBackground", "rgba(240,120,25,0.7)"),
    this.setClient("decimalNumber", 0),
    this.setClient("room.gap.right", 100),
    this.setClient("room.gap.bottom", 100),
    this.offsetY = 0,
    this.offsetX = 0,
    this.negatedYInterval = !1
  },
  twaver.Util.ext("ImageShapeNode", twaver.ShapeNode, {
    getCanvasUIClass: function() {
      return ImageShapeNodeUI
    },
    getElementUIClass: function() {
      return ImageShapeNodeUI
    },
    getVectorUIClass: function() {
      return ImageShapeNodeUI
    },
    onChildRemoved: function() {
      this.refreshChilden()
    },
    onChildAdded: function() {
      this.refreshChilden()
    },
    onPropertyChanged: function(e) {
      ImageShapeNode.superClass.onPropertyChanged.call(this, e),
      "points" === e.property && this.refreshChilden()
    },
    checkBlockOnEdge: function(e) {
      var t = !1;
      return this.getChildren().forEach(function(i) {
        i.getClient("edgeIndex") === e && (t = !0)
      }),
      t
    },
    refreshChilden: function() {
      this.getChildren().forEach(function(e) {
        e.refresh()
      })
    },
    translate3d: function(e, t, i) {
      var n = new Array,
      o = this.getPoints(),
      a = this.getCenterLocation(),
      s = new twaver.List;
      o.forEach(function(e) {
        s.add({
          x: e.x - a.x,
          y: e.y - a.y
        })
      });
      var r = o.size();
      if (! (0 >= r)) {
        2 == r && this.setClient("shapenode.closed", !1);
        var l = this.getClient("shapenode.closed");
        this._wallInnerPic = "" === this.getClient("wallInnerPic") ? null: Utils.handlerTexture(this.getClient("wallInnerPic")),
        this._wallOuterPic = "" === this.getClient("wallOuterPic") ? null: Utils.handlerTexture(this.getClient("wallOuterPic")),
        this._wallFramePic = "" === this.getClient("framePic") ? null: Utils.handlerTexture(this.getClient("framePic")),
        this._lightMapPic = Utils.handlerTexture(Utils.Path + "lightmap.png"),
        this instanceof InnerWallShapeNode && (this._wallOuterPic = this._wallInnerPic),
        this.floorName = this.getClient("floorName"),
        this.floorHeight = this.getClient("floorHeight");
        var d = this.getClient("size"),
        h = this.getClient("useTexture"),
        c = this.getClient("transparent"),
        g = this.getClient("opacity"),
        m = this.getClient(CUSTOM_PROPS),
        u = this.getClient(PropertyConsts.LAYERID);
        this.deep = 10;
        var p = 300;
        this.repeat = 50,
        d && (this.deep = d.z, p = d.y),
        0 == h && (this.repeat = p);
        for (var f = new mono.Path,
        v = 0; r > v; v++) {
          if (i) var y = s.get(v);
          else var y = o.get(v);
          0 == v ? f.moveTo(y.x, -y.y, 0) : f.lineTo(y.x, -y.y, 0)
        }
        l && f.closePath();
        var C = this.getId(),
        S = e.getDataById(C),
        I = new mono.PathCube({
          path: f,
          width: this.deep,
          height: p,
          repeat: this.repeat
        });
        e.startBatch(),
        I.setStyle("m.texture.image", this._wallOuterPic),
        I.setStyle("inside.m.texture.image", this._wallInnerPic),
        I.setStyle("top.m.texture.image", this._wallFramePic),
        I.setStyle("bottom.m.texture.image", this._wallFramePic),
        I.setStyle("aside.m.texture.image", this._wallFramePic),
        I.setStyle("zside.m.texture.image", this._wallFramePic),
        I.setStyle("m.transparent", c),
        I.setStyle("inside.m.lightmap.image", this._lightMapPic),
        I.setStyle("outside.m.lightmap.image", this._lightMapPic),
        I.setStyle("m.opacity", g);
        var A = this.getClient("shapeNodeIndex");
        Utils.setPolygonOffset(I, 2 * -A),
        e.endBatch();
        var P = [],
        E = [];
        P.push(I);
        for (var w = 0; w < t.length; w++) {
          var b = t[w],
          x = this.createBlocks(e, b, n, a);
          P.push(x),
          E.push("-")
        }
        return ! S && C && (S = C ? new mono.ComboNode(P, E, !1, C) : new mono.ComboNode),
        P.length > 0 && S.setCombos(P),
        E && S.setOperators(E),
        S.setStyle("m.type", "phong"),
        S.setClient("floorName", this.floorName),
        S.setPositionY(this.floorHeight || 0),
        S.setPositionX(a.x),
        S.setPositionZ(a.y),
        S.setEditable(!0),
        S.setSelectable(!0),
        Utils.setElementCustomProps(this, S, m),
        u && S.setClient(PropertyConsts.LAYERID, u),
        e.getDataById(C) || e.add(S),
        n.push(S),
        n
      }
    },
    createBlocks: function(e, t, i, n) {
      var o = new mono.Path,
      a = t.getCenterLocation(),
      s = t.getClient("leftPoint"),
      r = t.getClient("rightPoint");
      s = {
        x: s.x - n.x,
        y: s.y - n.y
      },
      r = {
        x: r.x - n.x,
        y: r.y - n.y
      },
      o.moveTo(s.x, -s.y, 0),
      o.lineTo(r.x, -r.y, 0);
      var l = t.getClient("height"),
      d = t.getClient("positionY"),
      h = new mono.PathCube(o, this.deep, l, null, this.repeat);
      if (h.setStyle("m.texture.image", this._wallFramePic), h.setPositionY(d || 0), !t.isCutoff()) {
        var c = t.getBlockPicture(),
        g = t.getStyle("vector.outline.width"),
        m = t.getBlockWidth() + g,
        u = t.getBlockHeight(),
        p = this.deep / 3,
        f = r.x - s.x,
        v = r.y - s.y,
        y = t.getAngle(f, -v),
        C = new MaterialDesc,
        S = t.getClient("transparent"),
        I = t.getClient("opacity"),
        A = t.getClient(PropertyConsts.LAYERID);
        C.transparent = !0,
        null == c ? (C.color = "white", C.alpha = 0) : C.texture = c,
        e.getDataById(t.getId()) && e.removeById(t.getId());
        var P = t.getClient(CUSTOM_PROPS),
        E = GeometryTranslater.get3DGeometry(C, "mono.Cube", {
          x: m,
          y: u,
          z: p
        },
        {
          x: a.x,
          y: d + (this.floorHeight || 0) + u / 2,
          z: a.y
        },
        null, null, null, {
          id: t.getId()
        });
        E.setRotationY(y),
        E.setClient("floorName", this.floorName),
        E.setClient("animation", t.getClient("animation")),
        E.setStyle("m.specularStrength", t.getClient("specularStrength")),
        E.setStyle("m.opacity", 1),
        E.setStyle("m.transparent", !1),
        E.setStyle("front.m.transparent", S),
        E.setStyle("front.m.opacity", I),
        E.setStyle("back.m.transparent", S),
        E.setStyle("back.m.opacity", I),
        E.setStyle("m.polygonOffset", !0),
        E.setStyle("m.polygonOffsetFactor", .1),
        E.setStyle("m.polygonOffsetUnits", 1),
        E.setEditable(!1),
        E.setSelectable(!1),
        E.setWidth(m),
        t.getClient("horizontalFlip") && E.setStyle("back.m.texture.flipX", t.getClient("horizontalFlip")),
        A && E.setClient(PropertyConsts.LAYERID, A),
        Utils.setElementCustomProps(t, E, P),
        e.getDataById(t.getId()) || e.add(E),
        i.push(E)
      }
      return h
    },
    isPointOnPoints: function(e) {
      for (var t = this.getPoints(), i = 0; i < t.size(); i++) if (_twaver.math.getDistance(e, t.get(i)) <= 10) return ! 0;
      return ! 1
    },
    getPointIndex: function(e) {
      var t = this.getPoints();
      if (t.size() < 2) return - 1;
      for (var i = 0; i < t.size(); i++) if (_twaver.math.getDistance(e, t.get(i)) <= 10) return - 1;
      for (var n, o = t.get(0), i = 1; i < t.size(); i++) {
        if (n = t.get(i), this.isPointOnLine(e, o, n, 10)) return i - 1;
        o = n
      }
      return o = t.get(0),
      this.isPointOnLine(e, o, n, 10) ? t.size() - 1 : -1
    },
    isPointOnLine: function(e, t, i, n) {
      0 > n && (n = 0);
      var o = this.getDistanceFromPointToLine(e, t, i);
      return n >= o && e.x >= Math.min(t.x, i.x) - n && e.x <= Math.max(t.x, i.x) + n && e.y >= Math.min(t.y, i.y) - n && e.y <= Math.max(t.y, i.y) + n
    },
    getDistanceFromPointToLine: function(e, t, i) {
      if (t.x === i.x) return Math.abs(e.x - t.x);
      var n = (i.y - t.y) / (i.x - t.x),
      o = (i.x * t.y - t.x * i.y) / (i.x - t.x);
      return Math.abs(n * e.x - e.y + o) / Math.sqrt(n * n + 1)
    },
    setOffsetYofPoints: function(e) {
      this.offsetY = e
    },
    setOffsetXofPoints: function(e) {
      this.offsetX = e
    },
    getOffsetYofPoints: function() {
      return this.offsetY
    },
    getOffsetXofPoints: function() {
      return this.offsetX
    },
    setNegatedYInterval: function(e) {
      this.negatedYInterval = e
    },
    getNegatedYInterval: function() {
      return this.negatedYInterval
    }
  }),
  ImageShapeNodeUI = function() {
    ImageShapeNodeUI.superClass.constructor.apply(this, arguments)
  },
  twaver.Util.ext("ImageShapeNodeUI", twaver.vector.ShapeNodeUI, {
    drawDefaultBody: function(e) {
      var t = this._element;
      if (t._points && !(t._points.size() < 1)) {
        var i = this._getZoomPoints(),
        n = t._segments,
        o = t.getStyle("vector.outline.width"),
        a = t.getStyle("vector.outline.pattern"),
        s = t.getStyle("vector.outline.width"),
        r = t.getStyle("vector.outline.color"),
        l = t.getClient("shapenode.closed"),
        d = twaver.Util.getRect(i),
        h = e;
        o > 0 && twaver.Util.grow(d, o, o);
        var c, g = this._network.isSelected(this._element),
        m = this._element.getClient("resizeBorderWidth"),
        u = this._element.getClient("resizeBorderLength"),
        p = this._element.getClient("resizeBorderGap"),
        f = this._element.getClient("resizeBorderColor"),
        v = t.getClient("showDim"),
        y = t.getClient("showCoord");
        g && (c = _twaver.clone(d)),
        h = this.setShadow(this, h),
        h.beginPath();
        var C = twaver.Util.getImageAsset(t.getClient(IMAGE_SRC));
        C && (h.fillStyle = h.createPattern(C.getImage(), "repeat")),
        h.lineWidth = s,
        h.strokeStyle = r,
        _twaver.g.drawLinePoints(h, i, a, n, l),
        t.getClient("fill") && h.fill(),
        h.stroke();
        var S = t.getClient("focusIndex");
        if (S >= 0) {
          var I = i.get(S),
          A = i.get(S === i.size() - 1 ? 0 : S + 1);
          h.beginPath(),
          h.strokeStyle = t.getClient("focusColor"),
          h.moveTo(I.x, I.y),
          h.lineTo(A.x, A.y),
          h.stroke()
        }
        if (g) {
          h.lineWidth = m + 2,
          h.strokeStyle = "black",
          h.beginPath(),
          this._borderLines = [];
          var P, E, w;
          P = {
            x: c.x - p,
            y: c.y - p
          },
          E = {
            x: P.x,
            y: P.y + u
          },
          w = {
            x: P.x + u,
            y: P.y
          },
          this._addBorderLine(h, P, E, w),
          P = {
            x: c.x + c.width + p,
            y: c.y - p
          },
          E = {
            x: P.x - u,
            y: P.y
          },
          w = {
            x: P.x,
            y: P.y + u
          },
          this._addBorderLine(h, P, E, w),
          P = {
            x: c.x + c.width + p,
            y: c.y + c.height + p
          },
          E = {
            x: P.x,
            y: P.y - u
          },
          w = {
            x: P.x - u,
            y: P.y
          },
          this._addBorderLine(h, P, E, w),
          P = {
            x: c.x - p,
            y: c.y + c.height + p
          },
          E = {
            x: P.x + u,
            y: P.y
          },
          w = {
            x: P.x,
            y: P.y - u
          },
          this._addBorderLine(h, P, E, w),
          h.stroke(),
          h.beginPath(),
          h.lineWidth = m,
          h.strokeStyle = f,
          u -= 1,
          P = {
            x: c.x - p,
            y: c.y - p
          },
          E = {
            x: P.x,
            y: P.y + u
          },
          w = {
            x: P.x + u,
            y: P.y
          },
          h.moveTo(E.x, E.y),
          h.lineTo(P.x, P.y),
          h.lineTo(w.x, w.y),
          P = {
            x: c.x + c.width + p,
            y: c.y - p
          },
          E = {
            x: P.x - u,
            y: P.y
          },
          w = {
            x: P.x,
            y: P.y + u
          },
          h.moveTo(E.x, E.y),
          h.lineTo(P.x, P.y),
          h.lineTo(w.x, w.y),
          P = {
            x: c.x + c.width + p,
            y: c.y + c.height + p
          },
          E = {
            x: P.x,
            y: P.y - u
          },
          w = {
            x: P.x - u,
            y: P.y
          },
          h.moveTo(E.x, E.y),
          h.lineTo(P.x, P.y),
          h.lineTo(w.x, w.y),
          P = {
            x: c.x - p,
            y: c.y + c.height + p
          },
          E = {
            x: P.x + u,
            y: P.y
          },
          w = {
            x: P.x,
            y: P.y - u
          },
          h.moveTo(E.x, E.y),
          h.lineTo(P.x, P.y),
          h.lineTo(w.x, w.y),
          h.stroke()
        }
        g && (y && this.drawCoord(h), v && this.drawDim(h))
      }
    },
    validateBodyBounds: function() {
      ImageShapeNodeUI.superClass.validateBodyBounds.call(this);
      var e = this._element;
      if (e._points && !(e._points.size() < 1)) {
        var t = this._getZoomPoints();
        if (! (t.size() < 2)) {
          var i = e.getStyle("vector.outline.width"),
          n = this.getPathRect("vector", !0);
          i > 0 && twaver.Util.grow(n, i, i);
          var o = this._network.isSelected(this._element),
          a = this._element.getClient("resizeBorderWidth"),
          s = this._element.getClient("resizeBorderGap");
          o && twaver.Util.grow(n, (a + s) / this._network.getZoom() * 2 + 2, (a + s) / this._network.getZoom() * 2 + 2),
          this.addBodyBounds(n)
        }
      }
    },
    _addBorderLine: function(e, t, i, n) {
      this._borderLines.push({
        point1: i,
        point2: t
      }),
      this._borderLines.push({
        point1: t,
        point2: n
      }),
      e.moveTo(i.x, i.y),
      e.lineTo(t.x, t.y),
      e.lineTo(n.x, n.y)
    },
    isPointOnBorderLine: function(e) {
      if (!this._borderLines) return null;
      for (var t = this._element.getClient("resizeBorderWidth"), i = 0; i < this._borderLines.length; i++) {
        var n = this._borderLines[i];
        if (this._element.isPointOnLine(e, n.point1, n.point2, t)) return Math.floor(i / 2)
      }
      return null
    },
    drawDim: function(e) {
      function t(e, t, o) {
        var a = _twaver.math.getCenterPoint(e, t),
        s = angle1 = _twaver.math.getAngle(e, t);
        t.x < e.x && (s = Math.PI + s);
        var r = o.toFixed(2),
        h = n.measureText(r).width,
        c = _twaver.math.createMatrix(s, e.x, e.y),
        m = c.transform({
          x: e.x,
          y: e.y - l
        }),
        f = c.transform({
          x: e.x,
          y: e.y - l * d
        });
        c = _twaver.math.createMatrix(s, t.x, t.y);
        var v = c.transform({
          x: t.x,
          y: t.y - l
        }),
        y = c.transform({
          x: t.x,
          y: t.y - l * d
        }),
        C = i.getPointBetween(f, y, .5 - (h / 2 + g) / o),
        S = i.getPointBetween(f, y, .5 + (h / 2 + g) / o),
        I = i.getPointBetween(f, y, u / o);
        c = _twaver.math.createMatrix(s, I.x, I.y);
        var A = c.transform({
          x: I.x,
          y: I.y - p
        }),
        P = c.transform({
          x: I.x,
          y: I.y + p
        }),
        E = i.getPointBetween(f, y, 1 - u / o);
        c = _twaver.math.createMatrix(s, E.x, E.y);
        var w = c.transform({
          x: E.x,
          y: E.y - p
        }),
        b = c.transform({
          x: E.x,
          y: E.y + p
        });
        n.beginPath(),
        n.moveTo(e.x, e.y),
        n.lineTo(m.x, m.y),
        n.moveTo(t.x, t.y),
        n.lineTo(v.x, v.y),
        n.moveTo(f.x, f.y),
        n.lineTo(C.x, C.y),
        n.moveTo(S.x, S.y),
        n.lineTo(y.x, y.y),
        n.moveTo(f.x, f.y),
        n.lineTo(A.x, A.y),
        n.moveTo(f.x, f.y),
        n.lineTo(P.x, P.y),
        n.moveTo(y.x, y.y),
        n.lineTo(w.x, w.y),
        n.moveTo(y.x, y.y),
        n.lineTo(b.x, b.y),
        n.stroke(),
        n.save(),
        a = {
          x: (f.x + y.x) / 2,
          y: (f.y + y.y) / 2
        },
        n.translate(a.x, a.y),
        n.rotate(angle1),
        n.translate( - a.x, -a.y),
        n.fillText(r, a.x, a.y),
        n.restore()
      }
      var i = this,
      n = e,
      o = this._element,
      a = this._getZoomPoints(),
      s = o.getPoints();
      if (a && !(a.size() < 2) && this._network.isSelected(o)) {
        var r = this.getBodyRect(),
        l = o.getClient("dimLeadLength"),
        d = o.getClient("dimLineOffset"),
        h = o.getClient("dimLineWidth"),
        c = o.getClient("dimColor"),
        g = o.getClient("dimTextGap"),
        m = o.getClient("dimTextFont"),
        u = o.getClient("dimArrowWidth"),
        p = o.getClient("dimArrowHeight"),
        f = {
          x: r.x - l,
          y: r.y - l,
          width: r.width + 2 * l,
          height: r.height + 2 * l
        };
        this.isClockwise() && (l = -l),
        this.addBodyBounds(f),
        n = this.setShadow(this, n),
        n.strokeStyle = c,
        n.lineWidth = h,
        n.fillStyle = c,
        n.font = m,
        n.textAlign = "center",
        n.textBaseline = "middle";
        for (var v = a.get(0), y = s.get(0), C = 1, S = a.size(); S > C; C++) {
          var I = a.get(C),
          A = s.get(C),
          P = _twaver.math.getDistance(y, A);
          y = A,
          t(v, I, P),
          v = I
        }
        if (S > 2) {
          var P = _twaver.math.getDistance(y, s.get(0));
          t(v, a.get(0), P)
        }
      }
    },
    getPointBetween: function(e, t, i) {
      return {
        x: e.x + (t.x - e.x) * i,
        y: e.y + (t.y - e.y) * i
      }
    },
    isClockwise: function(e) {
      var t = this._element,
      e = t.getPoints();
      if (!e || e.size() < 2) return ! 0;
      for (var i = 0,
      n = e.size(), o = 0; n > o; o++) {
        var a = e.get(o),
        s = e.get(o + 1 === n ? 0 : o + 1);
        i += (s.x - a.x) * (s.y + a.y)
      }
      return i > 0
    },
    drawCoord: function(e) {
      var t = e,
      i = this._element,
      n = this._getZoomPoints(),
      o = i.getPoints();
      if (n && o) {
        var a = this.getBodyRect(),
        s = i.getClient("coordTextColor"),
        r = i.getClient("coordTextFont"),
        l = i.getClient("coordTextOffsetX"),
        d = i.getClient("coordTextOffsetY"),
        h = i.getClient("coordTextAlign"),
        c = i.getClient("coordTextBaseline"),
        g = i.getClient("coordTextBackground"),
        m = i.getClient("decimalNumber"),
        u = {
          x: a.x - 100,
          y: a.y - 50,
          width: a.width + 200,
          height: a.height + 100
        };
        this.addBodyBounds(u),
        t = this.setShadow(this, t),
        t.save(),
        t.font = r;
        for (var p = 0,
        f = n.size(); f > p; p++) {
          var v = n.get(p),
          y = o.get(p),
          C = "(" + (v.x + i.getOffsetXofPoints()).toFixed(m) + ", " + (v.y * (i.getNegatedYInterval() ? -1 : 1) + i.getOffsetYofPoints()).toFixed(m) + ")";
          y && (C = "(" + (y.x + i.getOffsetXofPoints()).toFixed(m) + ", " + (y.y * (i.getNegatedYInterval() ? -1 : 1) + i.getOffsetYofPoints()).toFixed(m) + ")");
          var S = _twaver.g.getTextSize(t.font, C);
          t.fillStyle = g,
          t.fillRect(v.x - S.width / 2 + l, v.y - S.height / 2 + d, S.width, S.height),
          t.fillStyle = s,
          t.textAlign = h,
          t.textBaseline = c,
          t.fillText(C, v.x, v.y + d)
        }
        t.restore()
      }
    }
  }),
  InnerWallShapeNode = function() {
    InnerWallShapeNode.superClass.constructor.apply(this, arguments),
    this.setClient(IMAGE_SRC, Utils.Path + "room.png"),
    this.setStyle("vector.outline.color", "#333333"),
    this.setStyle("vector.outline.width", 5),
    this.setClient("shapenode.closed", !1),
    this.setClient("focusColor", "green"),
    this.setClient("resizeBorderWidth", 10),
    this.setClient("resizeBorderLength", 25),
    this.setClient("resizeBorderGap", 10),
    this.setClient("resizeBorderColor", "yellow"),
    this.setClient("size", {
      x: 0,
      y: 230,
      z: 4
    }),
    this.setClient("repeat", {
      row: 1,
      column: 1
    })
  },
  twaver.Util.ext("InnerWallShapeNode", ImageShapeNode, {
    translate3d: function(e, t, i) {
      var n = this.getPoints(),
      o = n.size();
      if (! (0 >= o)) {
        for (var a = 0; o > a; a++) this.setStyle("inner_wall_" + a, !0);
        return ImageShapeNode.prototype.translate3d.call(this, e, t, i)
      }
    }
  }),
  FloorShapeNode = function() {
    FloorShapeNode.superClass.constructor.apply(this, arguments),
    this.setClient(IMAGE_SRC, Utils.Path + "floor02_3d.png"),
    this.setStyle("vector.outline.color", "#FFFFFF"),
    this.setStyle("vector.outline.width", 0),
    this.setClient("shapenode.closed", !0),
    this.setClient("focusColor", "blue"),
    this.setClient("repeat", 100),
    this.setClient("size", {
      x: 0,
      y: 0,
      z: .1
    }),
    this.setClient("transparent", !1),
    this.setClient("opacity", 1)
  },
  twaver.Util.ext("FloorShapeNode", ImageShapeNode, {
    translate3d: function(e) {
      var t = this.getPoints(),
      i = t.size(),
      n = this.getCenterLocation(),
      o = new twaver.List;
      if (t.forEach(function(e) {
        o.add({
          x: e.x - n.x,
          y: e.y - n.y
        })
      }), !(0 >= i || 2 >= i)) {
        for (var a = this.getClient("floorHeight"), s = this.getClient("floorName"), r = this.getClient("transparent"), l = this.getClient("opacity"), d = Utils.handlerTexture("" === this.getClient(IMAGE_SRC) ? null: this.getClient(IMAGE_SRC)), h = this.getClient("repeat"), c = this.getClient(CUSTOM_PROPS), g = this.getClient(PropertyConsts.LAYERID), m = new mono.Path, u = 0; i > u; u++) {
          var p = o.get(u);
          0 == u ? m.moveTo(p.x, -p.y, 0) : m.lineTo(p.x, -p.y, 0)
        }
        var f = .1,
        i = this.getClient("size");
        i && (f = i.z),
        f = parseFloat(f || 1);
        var v = e.getDataById(this.getId());
        if (!v) var v = new mono.ShapeNode({
          id: this.getId(),
          path: m
        });
        return a = (a || 0) - 1,
        v.setPath(m),
        v.setPositionX(n.x),
        v.setPositionZ(n.y),
        v.setAmount(f),
        v.setVertical(!0),
        v.setRepeat(h),
        v.setStyle("m.texture.image", d),
        v.setStyle("m.type", "phong"),
        v.setStyle("m.transparent", r),
        v.setStyle("m.opacity", l),
        v.setClient("floorName", s),
        v.setPositionY(a),
        v.setSelectable(!1),
        Utils.setElementCustomProps(this, v, c),
        g && v.setClient(PropertyConsts.LAYERID, g),
        e.getDataById(this.getId()) || e.add(v),
        v
      }
    }
  }),
  mono.Floor = function(e) {
    this.material = new mono.EntityMaterial,
    this.materialSize = 1,
    mono.BufferNode.call(this),
    this.points = e._as ? e._as: e,
    this.points = n(this.points),
    this.compuateBufferData(),
    this.renderDepth = 1e3
  },
  mono.extend(mono.Floor, mono.BufferNode, {
    constructor: mono.Floor,
    fixCenter: function() {
      var e = new Array;
      if (this.points) {
        for (var t = 0,
        i = 0,
        n = 0; n < this.points.length; n++) {
          var o = this.points[n];
          t += o.x,
          i += o.y
        }
        t /= this.points.length,
        i /= this.points.length;
        for (var n = 0; n < this.points.length; n++) {
          var o = this.points[n];
          e.push({
            x: o.x - t,
            y: o.y - i
          })
        }
        this.points = e,
        this.setPosition(new mono.Vec3(o.x, 0, o.y))
      }
    },
    compuateBufferData: function() {
      for (var e = {},
      t = 0,
      i = 0,
      n = 0,
      o = 0,
      a = 0,
      i = 0; i < this.points.length; i++) {
        var s = this.points[i];
        n += 3 * s.length,
        o += 3 * (s.length - 2),
        a += 2 * s.length
      }
      var r = new Float32Array(n);
      for (e.array = r, e.itemSize = 3, e.numItems = n, this.attributes.position = e, i = 0; i < this.points.length; i++) for (var s = this.points[i], l = 0; l < s.length; l++) {
        var d = s[l],
        h = d.length ? d[0] : d.x,
        c = d.length ? d[1] : d.y;
        r[t] = h,
        r[t + 1] = 0,
        r[t + 2] = c,
        t += 3
      }
      this.offsets = [{
        index: 0,
        count: o
      }];
      var g = {};
      g.array = new Uint16Array(o),
      this.attributes.index = g,
      t = 0;
      var m = 0;
      for (i = 0; i < this.points.length; i++) {
        for (var s = this.points[i], l = 0; l < s.length - 2; l++) g.array[t] = m,
        g.array[t + 1] = m + l + 1,
        g.array[t + 2] = m + l + 2,
        t += 3;
        m += s.length
      }
      var u = {};
      u.itemSize = 2,
      u.numItems = a,
      u.array = new Float32Array(a),
      this.attributes.uv = u;
      var p = this.getRect();
      for (t = 0, i = 0; i < this.points.length; i++) for (var s = this.points[i], l = 0; l < s.length; l++) {
        var d = s[l],
        h = d.length ? d[0] : d.x,
        f = d.length ? d[1] : d.y,
        v = (h - p.x) / p.width,
        y = (f - p.y) / p.height;
        u.array[t] = v,
        u.array[t + 1] = y,
        t += 2
      }
      this.verticesNeedUpdate = !0,
      this.elementsNeedUpdate = !0,
      this.uvsNeedUpdate = !0
    },
    getRect: function() {
      for (var e = null,
      t = 0; t < this.points.length; t++) {
        var i = this.points[t];
        if (null === e) e = this.getPointsRect(i);
        else {
          var n = this.getPointsRect(i);
          e = this.unionRect(e, n)
        }
      }
      return e
    },
    unionRect: function(e, t) {
      if (e && t) {
        var i = {};
        return i.x = Math.min(e.x, t.x),
        i.y = Math.min(e.y, t.y),
        i.width = Math.max(e.x + e.width, t.x + t.width) - i.x,
        i.height = Math.max(e.y + e.height, t.y + t.height) - i.y,
        i
      }
      return null
    },
    getPointsRect: function(e) {
      if (!e) return null;
      e._as && (e = e._as);
      var t = e.length;
      if (0 >= t) return null;
      for (var i = e[0], n = i.length ? i[0] : i.x, o = i.length ? i[1] : i.y, a = {
        x: n,
        y: o,
        width: 0,
        height: 0
      },
      s = 1; t > s; s++) {
        i = e[s];
        var n = i.length ? i[0] : i.x,
        o = i.length ? i[1] : i.y,
        r = Math.min(a.x, n),
        l = Math.max(a.x + a.width, n),
        d = Math.min(a.y, o),
        h = Math.max(a.y + a.height, o);
        a.x = r,
        a.y = d,
        a.width = l - r,
        a.height = h - d
      }
      return a
    }
  }),
  PrimitiveNode = function() {
    PrimitiveNode.superClass.constructor.apply(this, arguments),
    this.setClient("oscale", 100),
    this.setClient("scaleFont", "18px Verdana"),
    this.setClient("scaleColor", "black"),
    this.setClient("maskColor", "white"),
    this.setClient("maskAlpha", .5),
    this.setClient("tipsFont", "12px Calibri"),
    this.setClient("tips", "Scroll to Scale"),
    this.setClient("selectedColor", "yellow"),
    this.setStyle("label.position", "center"),
    this.setStyle("select.style", "null"),
    this.setClient("vertical", !0),
    this.setImage("primitiveNode_Image")
  },
  twaver.Util.ext("PrimitiveNode", twaver.Follower, {
    translate3d: function(e) {
      var t = this.getClient("scale"),
      i = this.getClient("oscale"),
      n = this.getClient("size"),
      o = this.getClient("assembleSize"),
      a = this.getClient("rot"),
      s = this.getClient("texture"),
      r = this.getClient("className"),
      l = this.getClient("transparent"),
      d = this.getClient("opacity"),
      h = null,
      c = this.getClient(CUSTOM_PROPS),
      g = this.getClient("vertical"),
      m = this.getClient(PropertyConsts.LAYERID);
      h = s ? s instanceof Array ? s: s instanceof twaver.List ? s.toArray() : s.indexOf(Utils.Path) >= 0 ? s: Utils.Path + s: Utils.Path + PropertyConsts.DEFAULT_IMAGE,
      this.setClient(IMAGE_SRC, h);
      var u = this.getClient("repeat"),
      p = this.getClient("types"),
      f = this.getClient("colors"),
      v = this.getClient("visible"),
      y = this.getClient("other"),
      C = this.getClient("positionY"),
      S = this.getClient("floorHeight"),
      I = this.getClient("flipX"),
      A = this.getClient("flipY"),
      P = new MaterialDesc;
      h instanceof Array && (P.tType = h.length),
      P.texture = h,
      u && u instanceof twaver.List && (u = u.toArray()),
      (u instanceof Array && u.length > 0 || !u instanceof Array) && (P.repeat = u),
      p && (p instanceof twaver.List && (p = p.toArray()), (p instanceof Array && p.length > 0 || !p instanceof Array) && (P.type = p)),
      f && (f instanceof twaver.List && (f = f.toArray()), (f instanceof Array && f.length > 0 || !f instanceof Array) && (P.color = f)),
      l && (l instanceof twaver.List && (l = l.toArray()), (l instanceof Array && l.length > 0 || !l instanceof Array) && (P.transparent = l)),
      d && (d instanceof twaver.List && (d = d.toArray()), P.opacity = d),
      v && (v instanceof twaver.List && (v = v.toArray()), (v instanceof Array && v.length > 0 || !v instanceof Array) && (P.visible = v)),
      I && (I instanceof twaver.List && (I = I.toArray()), (I instanceof Array && I.length > 0 || !I instanceof Array) && (P.flipX = I)),
      A && (A instanceof twaver.List && (A = A.toArray()), (A instanceof Array && A.length > 0 || !A instanceof Array) && (P.flipY = A)),
      y && Utils.isNotNull(y.openTop) && (P.openTop = y.openTop),
      y && Utils.isNotNull(y.openBottom) && (P.openBottom = y.openBottom),
      P.color = this.getClient("colors"),
      P.ambient = this.getClient("ambient"),
      y = y || {},
      n = n || o,
      y.id = this.getId();
      var E = this.get3DShape(P, r, n, y, e);
      if (E.setName(this.getClient("primitiveName")), E) {
        Utils.setElementCustomProps(this, E, c),
        m && E.setClient(PropertyConsts.LAYERID, m);
        var w = this.getClient(OID);
        w && E.setClient(OID, w);
        var b = this.getClient(BID);
        b && E.setClient(BID, b),
        a && E.setRotation(a.x, a.y, a.z),
        Utils.isNotNull(this.getAngle()) && 0 != this.getAngle() && (isSettingRotation = !0, E.setRotation(0, 0, 0), isSettingRotation = !1, E.rotateFromWorldYAxis(Utils.convert2Radian( - this.getAngle())));
        var x = this.getCenterLocation();
        if (null == this.getHost() || this.getHost() instanceof FloorShapeNode) {
          if (x) {
            E.setPositionX(x.x),
            E.setPositionY(o ? o.y / 2 : 0),
            E.setPositionZ(x.y);
            var _ = this.getClient("off");
            _ && (E.setPositionX(x.x - _.x), E.setPositionZ(x.y - _.z))
          }
        } else if (x) {
          var O = this.getClient("position");
          O && E.setPosition(O.x, O.y, O.z)
        }
        var t = this.getClient("scale");
        t || (t = new mono.Vec3(1, 1, 1)),
        t && (i && (i /= 100, t = new mono.Vec3(t.x * i, t.y * i, t.z * i), E.setPositionY(E.getPosition().y * i)), E.setScale(t)),
        void 0 !== g && E.setStyle("m.vertical", g),
        C = C ? C: 0,
        E.setPositionY(E.getPosition().y + C),
        S && E.setPositionY(E.getPosition().y + S),
        E.setEditable(!0),
        E.setSelectable(!0);
        var T = this.getClient(TAG_ANIMATION);
        T && E.setClient(TAG_ANIMATION, T);
        var N = this.getClient("animationGroup");
        N && E.setClient("animationGroup", N);
        var L = this.getClient("mainVisible");
        Utils.isNotNull(L) && (E.setClient("mainVisible", L), E.setStyle("m.transparent", !0), E.setStyle("m.opacity", .001)),
        E.setClient("floorName", this.getClient("floorName")),
        E.setGroupId(this.getClient("groupid")),
        E.setClient("nodeId", this.getId()),
        this.getClient("isEntity") && E.setClient("isEntity", !0);
        var M = parseFloat(this.getClient("scaleValue"));
        if (M) if (E instanceof mono.Billboard) {
          E.setPositionX(parseFloat(E.getPositionX() * M)),
          E.setPositionY(parseFloat(E.getPositionY() * M)),
          E.setPositionZ(parseFloat(E.getPositionZ() * M));
          var t = E.getScale();
          E.setScale(parseFloat(t.x * M), parseFloat(t.y * M), parseFloat(t.z * M))
        } else if (E instanceof mono.Cube) {
          var R = E.getWidth(),
          U = E.getHeight(),
          D = E.getDepth();
          E.setWidth(R * M),
          E.setHeight(U * M),
          E.setDepth(D * M),
          this.getParent() && (E.setPositionX(parseFloat(E.getPositionX() * M)), E.setPositionY(parseFloat(E.getPositionY() * M)), E.setPositionZ(parseFloat(E.getPositionZ() * M)))
        } else {
          E.setPositionX(parseFloat(E.getPositionX() * M)),
          E.setPositionY(parseFloat(E.getPositionY() * M)),
          E.setPositionZ(parseFloat(E.getPositionZ() * M));
          var t = E.getScale();
          E.setScale(parseFloat(t.x * M), parseFloat(t.y * M), parseFloat(t.z * M))
        }
        if (E instanceof mono.PointLight) {
          if (this.getClient("lightPosition")) {
            var k = this.getClient("lightPosition").split(",");
            3 === k.length && E.setPosition(new mono.Vec3(parseFloat(k[0]), parseFloat(k[1]), parseFloat(k[2])))
          }
          this.getClient("lightColor") && E.setColor(this.getClient("lightColor")),
          this.getClient("lightIntensity") && E.setIntensity(parseFloat(this.getClient("lightIntensity")))
        }
        if (E instanceof mono.SpotLight) {
          if (this.getClient("lightPosition")) {
            var k = this.getClient("lightPosition").split(",");
            3 === k.length && E.setPosition(new mono.Vec3(parseFloat(k[0]), parseFloat(k[1]), parseFloat(k[2])))
          } else E.setPositionY(100);
          this.getClient("lightColor") && E.setColor(this.getClient("lightColor")),
          this.getClient("lightIntensity") && E.setIntensity(parseFloat(this.getClient("lightIntensity"))),
          this.getClient("angle") && E.setAngle(parseFloat(this.getClient("angle")))
        }
        return this.afterTranslate3d(E),
        E
      }
    },
    afterTranslate3d: function(e) {
      mono.AniUtil.resetAnimatedFlag(e)
    },
    get3DShape: function(e, t, i, n, o) {
      var a = $gt3d(e, t, i, null, null, null, null, n, this, o);
      return a.setSelectable(!0),
      a
    },
    getVectorUIClass: function() {
      return PrimitiveNodeUI
    }
  }),
  PrimitiveNodeUI = function() {
    PrimitiveNodeUI.superClass.constructor.apply(this, arguments)
  },
  twaver.Util.ext("PrimitiveNodeUI", twaver.vector.NodeUI, {
    validateBodyBounds: function() {
      PrimitiveNodeUI.superClass.validateBodyBounds.call(this);
      var e = this.getBodyRect();
      0 != this._element.getAngle() && (e = this._element.getOriginalRect()),
      this.addBodyBounds(e)
    }
  }),
  twaver.Util.registerShape("triangle",
  function(e, t, i, n) {
    var o = i.getOriginalRect(),
    a = o.width,
    s = o.height;
    a > 12 / n.getZoom() && (a -= 12 / n.getZoom()),
    s > 12 / n.getZoom() && (s -= 12 / n.getZoom()),
    e.moveTo( - a / 2, s / 2),
    e.lineTo(a / 2, s / 2),
    e.lineTo(0, 0),
    e.lineTo( - a / 2, s / 2),
    e.closePath()
  }),
  twaver.Util.registerShape("small_triangle",
  function(e, t, i, n) {
    if (i.getHost()) {
      var o = i.getOriginalRect(),
      a = 8 / n.getZoom();
      a > o.width && (a = o.width),
      a > o.height && (a = o.height),
      o.height / 2 < a && (a = 0),
      e.moveTo(0, 0),
      e.lineTo(0, a)
    }
  }),
  twaver.Util.registerImage("primitiveNode_Image", {
    v: [{
      shape: "rect",
      fill: function(e) {
        var t = network.isSelected(e),
        i = e.getClient("maskColor");
        return t && (i = e.getClient("selectedColor")),
        i
      },
      alpha: '<%=getClient("maskAlpha")%>',
      rect: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 12 / network.getZoom() && (i -= 12 / network.getZoom()),
        n > 12 / network.getZoom() && (n -= 12 / network.getZoom()),
        [ - i / 2, -n / 2, i, n]
      }
    },
    {
      shape: "rect",
      alpha: 1,
      lineColor: "#927652",
      lineWidth: 6,
      rect: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 6 / network.getZoom() && (i -= 6 / network.getZoom()),
        n > 6 / network.getZoom() && (n -= 6 / network.getZoom()),
        [ - i / 2, -n / 2, i, n]
      }
    },
    {
      shape: "line",
      fill: "gray",
      lineWidth: 1,
      p1: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 12 / network.getZoom() ? i -= 12 / network.getZoom() : i = 0,
        n > 12 / network.getZoom() ? n -= 12 / network.getZoom() : n = 0,
        {
          x: -i / 2,
          y: -n / 2
        }
      },
      p2: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 12 / network.getZoom() ? i -= 12 / network.getZoom() : i = 0,
        n > 12 / network.getZoom() ? n -= 12 / network.getZoom() : n = 0,
        {
          x: i / 2,
          y: n / 2
        }
      }
    },
    {
      shape: "line",
      fill: "gray",
      lineWidth: 1,
      p1: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 12 / network.getZoom() ? i -= 12 / network.getZoom() : i = 0,
        n > 12 / network.getZoom() ? n -= 12 / network.getZoom() : n = 0,
        {
          x: -i / 2,
          y: n / 2
        }
      },
      p2: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 12 / network.getZoom() ? i -= 12 / network.getZoom() : i = 0,
        n > 12 / network.getZoom() ? n -= 12 / network.getZoom() : n = 0,
        {
          x: i / 2,
          y: -n / 2
        }
      }
    },
    {
      shape: "triangle",
      fill: "#927652",
      data: {
        w: 90,
        h: 90
      },
      alpha: .4
    },
    {
      shape: "small_triangle",
      position: 0,
      lineWidth: 8,
      lineColor: "#927652",
      translate: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 17 / network.getZoom() ? i -= 17 / network.getZoom() : i = 0,
        n -= 11 / network.getZoom(),
        {
          x: -i / 2,
          y: -n / 2
        }
      }
    },
    {
      shape: "small_triangle",
      position: 1,
      lineWidth: 8,
      lineColor: "#927652",
      translate: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 17 / network.getZoom() ? i -= 17 / network.getZoom() : i = 0,
        n -= 11 / network.getZoom(),
        {
          x: i / 2,
          y: -n / 2
        }
      }
    },
    {
      shape: "small_triangle",
      position: 0,
      lineWidth: 8,
      lineColor: "#927652",
      translate: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 17 / network.getZoom() ? i -= 17 / network.getZoom() : i = 0,
        n -= 25 / network.getZoom(),
        {
          x: -i / 2,
          y: n / 2
        }
      }
    },
    {
      shape: "small_triangle",
      position: 1,
      lineWidth: 8,
      lineColor: "#927652",
      translate: function(e) {
        var t = e.getOriginalRect(),
        i = t.width,
        n = t.height;
        return i > 17 / network.getZoom() ? i -= 17 / network.getZoom() : i = 0,
        n -= 25 / network.getZoom(),
        {
          x: i / 2,
          y: n / 2
        }
      }
    }]
  }),
  Block = function() {
    Block.superClass.constructor.apply(this, arguments),
    this.setClient("length", 90),
    this.setClient("edgeIndex", -1),
    this.setClient("offset", .5),
    this.setClient("gap", 0),
    this.setClient("angle", 0),
    this.setClient("focus", !1),
    this.setStyle("vector.outline.width", 2),
    this.setStyle("vector.outline.color", "gray"),
    this.setStyle("vector.fill.color", "white"),
    this.setSize(0, 0),
    this.setClient("fullWidth", !1),
    this.setClient("horizontalFlip", !1),
    this.setImage("image_block"),
    this.isDoor() && (this.blockPicture = this.blockPicture || Utils.Path + "door00_3d.png", this.blockWidth = this.blockWidth || 80, this.blockHeight = this.blockHeight || 200, this.positionY = this.positionY || 0),
    this.isWindow() && (this.blockPicture = this.blockPicture || Utils.Path + "window00_3d.png", this.blockWidth = this.blockWidth || 100, this.blockHeight = this.blockHeight || 120, this.positionY = this.positionY || (this.height - this.blockHeight) / 2);
    var e = this.getClient("transparent"),
    t = this.getClient("opacity");
    this.setStyle("m.transparent", e),
    this.setStyle("m.opacity", t),
    this.isCutoff() && (this.blockWidth = this.blockWidth || 100, this.blockHeight = this.blockHeight || 100, this.positionY = this.positionY || (this.height - this.blockHeight) / 2, this.blockPicture || (this.blockPicture = new mono.BasicMaterial({
      color: "green",
      transparent: !0,
      opacity: .5
    }))),
    this.setClient("height", this.blockHeight),
    this.setClient("positionY", this.positionY)
  },
  twaver.Util.ext("Block", twaver.Node, {
    onPropertyChanged: function(e) {
      Block.superClass.onPropertyChanged.call(this, e),
      !this.getParent() || "C:length" !== e.property && "C:edgeIndex" !== e.property && "C:offset" !== e.property && "C:gap" !== e.property || this.refresh()
    },
    refresh: function() {
      var e = this.getParent(),
      t = this.getClient("edgeIndex"),
      i = this.getClient("offset"),
      n = e.getPoints();
      if (n && t >= 0 && t < n.size()) {
        var o = n.get(t),
        a = n.get(t === n.size() - 1 ? 0 : t + 1),
        s = a.x - o.x,
        r = a.y - o.y,
        l = {
          x: o.x + s * i,
          y: o.y + r * i
        },
        d = this.getAngle(s, r),
        h = this.getStyle("vector.outline.width"),
        c = this.getClient("gap"),
        g = this.getClient("length") / 2 + h / 2,
        m = e.getStyle("vector.outline.width") / 2 + h / 2 + c,
        u = twaver.Util.getRect([twaver.Util.transformPoint(l, d, -g, -m).point, twaver.Util.transformPoint(l, d, g, -m).point, twaver.Util.transformPoint(l, d, g, m).point, twaver.Util.transformPoint(l, d, -g, m).point]);
        this.setSize(u.width, u.height),
        this.setCenterLocation(l),
        this.setClient("angle", d),
        this.setClient("leftPoint", twaver.Util.transformPoint(l, d, -g, 0).point),
        this.setClient("rightPoint", twaver.Util.transformPoint(l, d, g, 0).point)
      }
    },
    getAngle: function(e, t) {
      return 0 === e ? 0 === t ? 0 : t > 0 ? Math.PI / 2 : -Math.PI / 2 : Math.atan(t / e)
    },
    getEdgeIndex: function() {
      return this.getClient("edgeIndex")
    },
    isDoor: function() {
      return this instanceof Door
    },
    isWindow: function() {
      return this instanceof Window
    },
    isCutoff: function() {
      return this instanceof Cutoff
    },
    getBlockWidth: function() {
      return Math.abs(this.getClient("length"))
    },
    getBlockHeight: function() {
      return Math.abs(this.getClient("height"))
    },
    getBlockPicture: function() {
      return this.getClient("picture")
    },
    getBlockPositionY: function() {
      return Math.abs(this.getClient("positionY"))
    }
  }),
  Door = function() {
    Door.superClass.constructor.apply(this, arguments),
    this.setClient("positionY", 0)
  },
  twaver.Util.ext("Door", Block, {}),
  Window = function() {
    Window.superClass.constructor.apply(this, arguments),
    this.setClient("positionY", 100)
  },
  twaver.Util.ext("Window", Block, {}),
  Cutoff = function() {
    Cutoff.superClass.constructor.apply(this, arguments),
    this.setClient("positionY", 100)
  },
  twaver.Util.ext("Cutoff", Block, {}),
  twaver.Util.registerImage("image_block", {
    rotate: '<%=getClient("angle")*180/Math.PI%>',
    diameter: function(e) {
      var t = 10,
      i = e.getParent();
      return i && (t = i.getStyle("vector.outline.width") + 2 * e.getClient("gap")),
      t / network.getZoom()
    },
    v: [{
      shape: "rect",
      rect: function(e) {
        var t = e.getClient("length");
        t && (t = Math.abs(t));
        var i = e.getParent(),
        n = 10;
        i && (n = i.getStyle("vector.outline.width") + 2 * e.getClient("gap"));
        var o = this.diameter(e);
        return t > o && (t -= o),
        n /= network.getZoom(),
        [ - t / 2, -n / 2, t, n]
      },
      lineWidth: '<%=getStyle("vector.outline.width")%>',
      lineColor: '<%if(getClient("focus")){return "green"}else{return getStyle("vector.outline.color")}%>',
      fill: '<%=getStyle("vector.fill.color")%>'
    },
    {
      shape: "line",
      x1: function(e) {
        if (e instanceof Window || e instanceof Door) {
          var t = e.getClient("length");
          t && (t = Math.abs(t));
          var i = this.diameter(e);
          return t > i && (t -= i),
          -t / 2
        }
        return 0
      },
      y1: 0,
      x2: function(e) {
        if (e instanceof Window || e instanceof Door) {
          var t = e.getClient("length");
          t && (t = Math.abs(t));
          var i = this.diameter(e);
          return t > i && (t -= i),
          t / 2
        }
        return 0
      },
      y2: 0,
      lineWidth: 1,
      lineColor: '<%if(getClient("focus")){return "green"}else{return getStyle("vector.outline.color")}%>',
      lineDash: function(e) {
        return e instanceof Window ? [10, 2] : void 0
      }
    },
    {
      shape: "circle",
      cx: function(e) {
        var t = e.getClient("length");
        t && (t = Math.abs(t));
        var i = this.diameter(e);
        return t > i && (t -= i),
        -t / 2
      },
      cy: 0,
      r: function(e) {
        if (null == network || !network.getSelectionModel().contains(e)) return 0;
        var t = e.getParent(),
        i = 10;
        return t && (i = t.getStyle("vector.outline.width") + 2 * e.getClient("gap")),
        i /= network.getZoom(),
        i / 2
      },
      lineWidth: 1,
      fill: "yellow",
      stroke: "black"
    },
    {
      shape: "circle",
      cx: function(e) {
        var t = e.getClient("length");
        t && (t = Math.abs(t));
        var i = this.diameter(e);
        return t > i && (t -= i),
        t / 2
      },
      cy: 0,
      r: function(e) {
        if (null == network || !network.getSelectionModel().contains(e)) return 0;
        var t = e.getParent(),
        i = 10;
        return t && (i = t.getStyle("vector.outline.width") + 2 * e.getClient("gap")),
        i /= network.getZoom(),
        i / 2
      },
      lineWidth: 1,
      fill: "yellow",
      stroke: "black"
    }]
  }),
  PipeShapeNode = function() {
    PipeShapeNode.superClass.constructor.apply(this, arguments),
    this.setClient(IMAGE_SRC, Utils.Path + "default_texture.png"),
    this.setStyle("vector.outline.color", "red"),
    this.setStyle("vector.outline.width", 5),
    this.setClient("shapenode.closed", !0),
    this.setClient("focusColor", "blue"),
    this.setClient("shapenode.closed", !1),
    this.setClient("fill", !1),
    this.setClient("radius", 10),
    this.setClient("segments", 20),
    this.setClient("positionY", 100),
    this.setClient("startCap", "none"),
    this.setClient("endCap", "none"),
    this.setClient("startCapSize", "1"),
    this.setClient("endCapSize", "1"),
    this.setClient("repeat", {
      row: 100,
      column: 3
    }),
    this.setClient("pointPositions", {}),
    this.setClient("adjust", !1),
    this.setClient("adjust.degree", 10),
    this.setClient("transparent", !1),
    this.setClient("opacity", 1)
  },
  twaver.Util.ext("PipeShapeNode", ImageShapeNode, {
    getPointPositionY: function(e) {
      var t = this.getClient("floorHeight"),
      i = "" + e,
      n = this.getClient("pointPositions")[i];
      return parseInt(n ? n + t: this.getClient("positionY") + t)
    },
    translate3d: function(e) {
      var t = this.getClient("floorName"),
      i = this.getPoints(),
      n = this.getClient("startCap"),
      o = this.getClient("endCap"),
      a = this.getClient("startCapSize"),
      s = this.getClient("endCapSize"),
      r = this.getClient("transparent"),
      l = this.getClient("opacity"),
      d = this.getClient(CUSTOM_PROPS),
      h = this.getClient(PropertyConsts.LAYERID),
      c = new mono.Path;
      if (i && i.size() > 1) {
        c.moveTo(i.get(0).x, this.getPointPositionY(0), i.get(0).y);
        for (var g = 1; g < i.size(); g++) c.lineTo(i.get(g).x, this.getPointPositionY(g), i.get(g).y)
      }
      var m = parseInt(this.getClient("radius"));
      c = this.adjustPath(c);
      var u = parseInt(this.getClient("segments")),
      p = e.getDataById(this.getId());
      p || (p = new mono.PathNode({
        id: this.getId()
      })),
      p.setPath(c),
      p.setSegments(u),
      p.setRadius(m),
      p.setSegmentsR(50),
      p.setStartCap(n),
      p.setEndCap(o),
      p.setStartCapSize(a),
      p.setEndCapSize(s);
      var f = "" === this.getClient(IMAGE_SRC) ? null: this.getClient(IMAGE_SRC),
      v = this.getClient("repeat");
      return v || (v = {
        row: 100,
        column: 3
      }),
      p.setStyle("m.texture.image", f),
      p.setStyle("m.texture.wrapS", mono.RepeatWrapping),
      p.setStyle("m.texture.wrapT", mono.RepeatWrapping),
      p.setStyle("m.texture.repeat", new mono.Vec2(v.row, v.column)),
      p.setStyle("m.side", mono.DoubleSide),
      p.setStyle("m.type", "phong"),
      p.setStyle("m.transparent", r),
      p.setStyle("m.opacity", l),
      p.setEditable(!1),
      p.setSelectable(!1),
      p.setClient("floorName", t),
      Utils.setElementCustomProps(this, p, d),
      h && p.setClient(PropertyConsts.LAYERID, h),
      e.getDataById(this.getId()) || e.add(p),
      p
    },
    adjustPath: function(e) {
      if (this.getClient("adjust")) {
        var t = this.getClient("adjust.degree") || 10,
        i = parseInt(this.getClient("radius"));
        return mono.PathNode.prototype.adjustPath(e, i, t)
      }
      return e
    }
  }),
  RoundPipeShapeNode = function() {
    RoundPipeShapeNode.superClass.constructor.apply(this, arguments),
    this.setClient("adjust", !0),
    this.setStyle("vector.outline.color", "green")
  },
  twaver.Util.ext("RoundPipeShapeNode", PipeShapeNode, {}),
  function() {
    abc = {},
    modelnode = {},
    modelimp = {},
    interaction = {},
    gadgets = {},
    modellib = {},
    editnodes = {},
    DEFAULT_THUMBNAIL = "crash.png",
    MaterialDesc = function() {
      this.type = "phong",
      this.sides = mono.DoubleSide,
      this.repeat = null,
      this.tType = 6,
      this.wraps = mono.RepeatWrapping,
      this.wrapt = mono.RepeatWrapping,
      this.transparent = !1,
      this.opacity = [],
      this.texture = []
    },
    twaver.Util.ext("MaterialDesc", Object, {
      wrap3DStyle: function(e) {
        var t = {};
        if (this.texture = Utils.handlerTexture(this.texture), this.texture && (t[M_MAP_SRC] = this.texture), this.type || (this.type = "phong"), this.repeat) if (2 != this.repeat.length || this.repeat[0] instanceof Array) {
          if (this.repeat instanceof Array) {
            var i = [];
            for (var n in this.repeat) i.push(new mono.Vec2(this.repeat[n][0], this.repeat[n][1]));
            this.repeat = i
          }
        } else this.repeat = new mono.Vec2(this.repeat[0], this.repeat[1]);
        else this.repeat = new mono.Vec2(1, 1);
        t[M_MAP_REPEAT] = this.repeat,
        this.type && (t[M_TYPE] = this.type),
        this.transparent instanceof Array ? t[M_TRANSPARENT] = this.transparent: void 0 != this.transparent && (t[M_TRANSPARENT] = this.transparent),
        t[M_OPACITY] = this.opacity instanceof Array ? this.opacity: void 0 != this.opacity ? this.opacity: 1,
        t[M_VISIBLE] = this.visible instanceof Array ? this.visible: !1 === this.visible ? !1 : !0,
        t[M_TEXTURE_FLIPX] = this.flipX instanceof Array ? this.flipX: !0 === this.flipX ? !0 : !1,
        t[M_TEXTURE_FLIPY] = this.flipY instanceof Array ? this.flipY: !0 === this.flipY ? !0 : !1,
        this.specularStrength instanceof Array ? t[M_SPECULARSTRENGTH] = this.specularStrength: void 0 != this.specularStrength && (t[M_SPECULARSTRENGTH] = this.specularStrength),
        t[M_POLYGONOFFSET] = this.polygonOffset instanceof Array ? this.polygonOffset: !0 === this.polygonOffset ? !0 : !1,
        this.polygonOffsetFactor instanceof Array ? t[M_POLYGONOFFSETFACTOR] = this.polygonOffsetFactor: void 0 != this.polygonOffsetFactor && (t[M_POLYGONOFFSETFACTOR] = this.polygonOffsetFactor),
        this.polygonOffsetUnits instanceof Array ? t[M_POLYGONOFFSETUNITS] = this.polygonOffsetUnits: void 0 != this.polygonOffsetUnits && (t[M_POLYGONOFFSETUNITS] = this.polygonOffsetUnits),
        this.type && (t[M_TYPE] = this.type),
        this.ambient && (t[M_AMBIENT] = this.ambient),
        t[M_SIDE] = mono.DoubleSide,
        this.color && (t[M_COLOR] = this.color),
        e instanceof mono.Billboard || (e.setStyle(M_WRAPS, mono.RepeatWrapping), e.setStyle(M_WRAPT, mono.RepeatWrapping)),
        e instanceof mono.Cylinder && (this.openTop && e.setOpenTop(!0), this.openBottom && e.setOpenBottom(this.openBottom)),
        e.s(t)
      }
    }),
    Cylinder_faces = ["side", "top", "bottom"],
    MaterialDesc.faces = ["right", "left", "top", "bottom", "front", "back"],
    M_MAP_SRC = "m.texture.image",
    M_MAP_REPEAT = "m.texture.repeat",
    M_VISIBLE = "m.visible",
    M_TRANSPARENT = "m.transparent",
    M_COLOR = "m.color",
    M_WRAPS = "m.texture.wrapS",
    M_WRAPT = "m.texture.wrapT",
    M_OPACITY = "m.opacity",
    M_CUBE_REPEAT = [1, 1],
    M_TYPE = "m.type",
    M_SIDE = "m.side",
    M_ALIGNMENT = "m.alignment",
    M_AMBIENT = "m.ambient",
    M_TEXTURE_FLIPX = "m.texture.flipX",
    M_TEXTURE_FLIPY = "m.texture.flipY",
    M_SPECULARSTRENGTH = "m.specularStrength",
    M_POLYGONOFFSET = "m.polygonOffset",
    M_POLYGONOFFSETFACTOR = "m.polygonOffsetFactor",
    M_POLYGONOFFSETUNITS = "m.polygonOffsetUnits",
    GeometryTranslater = {},
    GeometryTranslater.get3DGeometryFromModelImp = function(e) {
      var t = modelManager.getModelLib(),
      i = t.getValue(e, "size"),
      n = t.getValue(e, "pos"),
      o = t.getValue(e, "className");
      o || (o = t.getValue(e, "type"));
      var a = t.getValue(e, "scale"),
      s = t.getValue(e, "dt"),
      r = t.getValue(e, "repeat"),
      l = t.getValue(e, "types"),
      d = t.getValue(e, "color"),
      h = t.getValue(e, "transparent"),
      c = t.getValue(e, "opacity"),
      g = t.getValue(e, "visible"),
      m = t.getValue(e, "ambient"),
      u = t.getValue(e, TAG_ANIMATION),
      p = t.getValue(e, "animationGroup"),
      f = t.getValue(e, CUSTOM_PROPS),
      v = t.getValue(e, "flipX"),
      y = t.getValue(e, "flipY"),
      C = t.getValue(e, "specularStrength"),
      S = t.getValue(e, "polygonOffset"),
      I = t.getValue(e, "polygonOffsetFactor"),
      A = t.getValue(e, "polygonOffsetUnits"),
      P = t.getValue(e, "openTop"),
      E = t.getValue(e, "openBottom"),
      w = t.getValue(e, "object3dId"),
      b = t.getValue(e, "scaleValue"),
      x = t.getValue(e, "mainVisible"),
      _ = t.getValue(e, OID),
      O = new MaterialDesc;
      O.type = l,
      O.repeat = r,
      O.texture = s,
      O.color = d,
      O.opacity = c,
      O.transparent = h,
      O.visible = g,
      O.ambient = m,
      O.flipX = v,
      O.flipY = y,
      O.openTop = P,
      O.openBottom = E,
      O.specularStrength = C,
      O.polygonOffset = S,
      O.polygonOffsetFactor = I,
      O.polygonOffsetUnits = A,
      O.tType = s instanceof Array ? 6 : 1;
      var T = t.getValue(e, "rot"),
      N = GeometryTranslater.get3DOtherGeometry(e, o),
      L = GeometryTranslater.get3DGeometry(O, o, i, n, a, T, void 0, N);
      if (u && L.setClient(TAG_ANIMATION, u), p && L.setClient("animationGroup", p), f) {
        var M;
        for (var R in f) M = f[R],
        L.setClient(M, t.getValue(e, M));
        L.setClient(CUSTOM_PROPS, f)
      }
      for (var R = 0; 6 > R; R++) {
        var U = t.getValue(e, "face" + R);
        U && L.setClient("face" + R, U)
      }
      return w && L.setClient("object3dId", w),
      b && L.setClient("scaleValue", b),
      Utils.isNotNull(x) && L.setClient("mainVisible", x),
      _ && L.setClient(OID, _),
      L
    },
    GeometryTranslater.get3DGeometry = function(e, t, i, n, o, a, s, r, l, d) {
      t || (t = "mono.Cube"),
      0 != t.indexOf("mono.") && (t = "mono." + t);
      var h = null,
      c = null;
      switch (r && (c = r.id), c && d && (h = d.getDataById(c)), t) {
      case "mono.Cube":
        h || (h = c ? new mono.Cube({
          id: c
        }) : new mono.Cube),
        i && (h.setWidth(i.x), h.setHeight(i.y), h.setDepth(i.z)),
        r.wrapMode && h.setWrapMode(r.wrapMode);
        break;
      case "mono.Sphere":
        h || (h = c ? new mono.Sphere({
          id: c
        }) : new mono.Sphere),
        i && i.x && h.setRadius(i.x / 2);
        break;
      case "mono.Cylinder":
        h || (h = c ? new mono.Cylinder({
          id: c
        }) : new mono.Cylinder);
        var g = null;
        r && (g = r.radialSegments),
        g || (g = 4),
        i.x && h.setRadiusTop(i.x),
        i.z && h.setRadiusBottom(i.z),
        i.y && h.setHeight(i.y),
        g && h.setSegmentsR(g);
        break;
      case "mono.Torus":
        h || (h = c ? new mono.Torus({
          id: c
        }) : new mono.Torus),
        r.radius && h.setRadius(r.radius),
        r.tube && h.setTube(r.tube),
        r.radialSegments && h.setSegmentsR(r.radialSegments),
        r.tubularSegments && h.setSegmentsT(r.tubularSegments),
        r.arc && h.setArc(r.arc);
        break;
      case "mono.Billboard":
        h || (h = c ? new mono.Billboard(c) : new mono.Billboard);
        var m = mono.BillboardAlignment.bottomCenter;
        r && r.alignment && (m = r.alignment),
        o || i && (o = {
          x: i.x,
          y: i.y,
          z: 1
        }),
        h.setStyle(M_ALIGNMENT, m);
        break;
      case "mono.Floor":
        s && (h = new mono.Floor(s));
        break;
      case "mono.PathNode":
        h || (h = c ? new mono.PathNode({
          id: c
        }) : new mono.PathNode),
        r && (r.radius && h.setRadius(parseFloat(r.radius)), r.path && h.setPath(Utils._createPath(r.path)), r.segments && h.setSegments(parseInt(r.segments)), r.segmentsR && h.setSegmentsR(parseInt(r.segmentsR)), r.startCap && h.setStartCap(r.startCap), r.endCap && h.setEndCap(r.endCap), r.startCapSize && h.setStartCapSize(parseFloat(r.startCapSize)), r.endCapSize && h.setEndCapSize(parseFloat(r.endCapSize)), r.segmentsCap && h.setSegmentsCap(parseInt(r.segmentsCap)));
        break;
      case "mono.TextNode":
        h || (h = c ? new mono.TextNode({
          id: c
        }) : new mono.TextNode),
        r && (r.text && h.setText(r.text), r.height && h.setHeight(r.height), r.weight && h.setWeight(r.weight), r.style && h.setStyle(r.style), r.curveSegments && h.setCurveSegments(r.curveSegments), r.bevelEnabled && h.setBevelEnabled(r.bevelEnabled), r.textSize && h.setSize(r.textSize));
        break;
      case "mono.ComboNode":
        var u = [];
        if (r.combos && r.combos.length > 1) for (var p = 0; p < r.combos.length; p++) {
          var f = r.combos[p].id,
          v = modelManager.getModelNode(f);
          if (v) {
            var y = ModelFactory.getModelFromModelNode(modelManager.getModelLib(), v);
            if (y instanceof modelimp.ModelImp) for (var C = y.get2DObjects(), S = 0; S < C.length; S++) {
              C[S].setHost(l ? l: new twaver.Node);
              var I = C[S].translate3d();
              d && d.remove(I),
              u.push(I)
            }
          }
        }
        h || (h = c ? new mono.ComboNode({
          id: c
        }) : new mono.ComboNode),
        u.length > 0 && (h.setCombos(u), r.operators && h.setOperators(r.operators)),
        r.centralized && Utils.setComboCentralized(h),
        e.texture == Utils.Path + PropertyConsts.DEFAULT_IMAGE && (e.texture = null);
        break;
      case "mono.LatheNode":
        h || (h = c ? new mono.LatheNode({
          id: c
        }) : new mono.LatheNode),
        r && (r.path && h.setPath(Utils._createPath(r.path)), r.segmentsH && h.setSegmentsH(r.segmentsH), r.segmentsR && h.setSegmentsR(r.segmentsR), r.arc && h.setArc(r.arc), void 0 !== r.startClosed && h.setStartClosed(r.startClosed), void 0 !== r.endClosed && h.setEndClosed(r.endClosed));
        break;
      case "mono.Entity":
        if (h || (h = c ? new mono.Entity({
          id: c
        }) : new mono.Entity), r) {
          if (r.vertices && h.setVertices(r.vertices), r.faces) {
            var A = [];
            h.setFaces(A)
          }
          r.uvs && h.setUvs(r.uvs)
        }
        break;
      case "mono.PointLight":
        h || (h = c ? new mono.PointLight({
          id: c
        }) : new mono.PointLight);
        break;
      case "mono.SpotLight":
        h || (c ? (h = new mono.SpotLight({
          id: c
        }), h._id = c) : h = new mono.SpotLight)
      }
      return n && h.setPosition(n.x, n.y, n.z),
      a && h.setRotation(a.x, a.y, a.z),
      o && h.setScale(o.x, o.y, o.z),
      r && Utils.isNotNull(r.mainVisible) && h.setClient("mainVisible", r.mainVisible),
      e && e.wrap3DStyle(h),
      h
    },
    GeometryTranslater.get2DGeometry = function(e, t, i) {
      var i = getValue(this, "size"),
      n = getValue(this, "pos"),
      o = new PrimitiveNode,
      a = getValue(this, "ov", PropertyConsts.DEFAULT_IMAGE);
      i && o.setClient("size", i);
      var s = getValue(this, "scale");
      s && o.setClient("scale", s);
      var r = getValue(this, "dt");
      r && o.setClient("texture", r);
      var l = getValue(this, "rot");
      l && o.setClient("rot", l);
      var d = getValue(this, "scaleValue");
      d && o.setClient("scaleValue", d),
      a && (o.setImage(a), Utils.registerImage(Utils.Path + a)),
      o.setName(this.pid),
      n && o.setClient("position", n),
      this.ishost && (o.ishost = !0);
      var t = getValue(this, "className", "mono.Cube");
      return o.setClient("className", t),
      o
    },
    GeometryTranslater.get3DCombination = function(e) {
      var t, i, n, o, a = e.operations,
      s = e.primitives,
      r = 1;
      if (s.length >= 2 && a.length == s.length - 1) {
        t = s[0],
        n = new mono.CSG(t);
        for (var l = 0; l < a.length; l++) {
          i = s[r],
          o = new mono.CSG(i);
          var d = a[l];
          "+" == d ? n = n.union(o) : "-" == d && (n = n.substract(o))
        }
      }
    },
    GeometryTranslater.copyPropertyForRoom2D = function(e, t, i) {
      var n = t,
      o = e;
      if ($cpc(o, n), o[WALL_INNER_PATH] && n.setClient(WALL_INNER_PATH, o[WALL_INNER_PATH]), o[WALL_OUTER_PATH] && n.setClient(WALL_OUTER_PATH, o[WALL_OUTER_PATH]), !1 === i.getValue(o, WALL_CLOSED) && n.setClient("shapenode.closed", !1), o[WALL_SIZE]) {
        var a = o[WALL_SIZE];
        n.setClient(WALL_SIZE, {
          x: 0,
          y: a[1],
          z: a[2]
        })
      }
      o[POLE_IMAGE_PATH] && n.setClient(POLE_IMAGE_PATH, o[POLE_IMAGE_PATH]),
      !0 === i.getValue(o, USE_TEXTURE) && n.setClient(USE_TEXTURE, !0),
      o[OUTFRAME_IMAGE_PATH] && n.setClient(OUTFRAME_IMAGE_PATH, o[OUTFRAME_IMAGE_PATH])
    },
    GeometryTranslater.copyCommonPropertyFor2D = function(e, t) {
      var i = t;
      if (i.setClient(GID, e[GID]), e[OID] && i.setClient(OID, e[OID]), e[BID] && i.setClient(BID, e[BID]), e[PRIMITIVE_NAME] && i.setClient(PRIMITIVE_NAME, e[PRIMITIVE_NAME]), e[FLOOR_NAME] && i.setClient(FLOOR_NAME, e[FLOOR_NAME]), e[FLOOR_HEIGHT] && i.setClient(FLOOR_HEIGHT, e[FLOOR_HEIGHT]), e[CUSTOM_PROPS]) {
        var n = e[CUSTOM_PROPS];
        for (var o in n) {
          var a = n[o];
          i.setClient(a, e[a])
        }
        i.setClient(CUSTOM_PROPS, n)
      }
      e[PropertyConsts.LAYERID] && i.setClient(PropertyConsts.LAYERID, e[PropertyConsts.LAYERID]),
      e[TRA_PAR] && i.setClient(TRA_PAR, e[TRA_PAR]),
      e[OPA] && i.setClient(OPA, e[OPA])
    },
    GeometryTranslater.copyPropertyForStandObject2D = function(e, t, i) {
      var n = t,
      o = e;
      if ($cpc(e, t), o[SPACE_SCALE]) {
        var a = o[SPACE_SCALE];
        n.setClient(DESIGN_SCALE, 100 * a[0])
      }
      var s = i.getValue(o, SPACE_POSITION);
      s && n.setCenterLocation({
        x: s[0],
        y: s[2]
      });
      var r = i.getValue(o, SPACE_ROTATION);
      r && n.setClient(SPACE_ROTATION, r);
      var l = i.getValue(o, SPACE_POS_Y);
      l && n.setClient(SPACE_POS_Y, l);
      var d = i.getValue(o, "selectable");
      void 0 != d && n.setClient("selectable", d);
      var h = i.getValue(o, ANGLE);
      h && n.setAngle(h)
    },
    GeometryTranslater.get3DOtherGeometry = function(e, t) {
      function i(t) {
        e.wrapMode && (t.wrapMode = e.wrapMode)
      }
      function n(t) {
        e.path && (t.path = e.path),
        e.segments && (t.segments = e.segments);
        var i = e.getValue(e, "segmentsR");
        i && (t.segmentsR = i),
        e.startCap && (t.startCap = e.startCap),
        e.endCap && (t.endCap = e.endCap),
        e.startCapSize && (t.startCapSize = e.startCapSize),
        e.endCapSize && (t.endCapSize = e.endCapSize),
        e.segmentsCap && (t.segmentsCap = e.segmentsCap)
      }
      function o(t) {
        e.text && (t.text = e.text),
        e.textSize && (t.textSize = e.textSize),
        e.height && (t.height = e.height),
        e.weight && (t.weight = e.weight),
        e.style && (t.style = e.style),
        e.curveSegments && (t.curveSegments = e.curveSegments),
        e.bevelEnabled && (t.bevelEnabled = e.bevelEnabled)
      }
      function a(t) {
        e.operators && (t.operators = e.operators),
        e.combos && (t.combos = e.combos),
        e.centralized && (t.centralized = e.centralized)
      }
      function s(t) {
        e[PATH] && (t.path = e[PATH]),
        e[SEGMENTSH] && (t.segmentsH = e[SEGMENTSH]),
        e[SEGMENTSR] && (t.segmentsR = e[SEGMENTSR]),
        e[ARC] && (t.arc = e[ARC]),
        void 0 !== e[START_CLOSED] && (t.startClosed = e[START_CLOSED]),
        void 0 !== e[END_CLOSED] && (t.endClosed = e[END_CLOSED])
      }
      function r(t) {
        e[VERTICES] && (t.vertices = e[VERTICES]),
        e[FACES] && (t.faces = e[FACES]),
        e[UVS] && (t.uvs = e[UVS])
      }
      var l = {},
      d = e.getValue(e, "radialSegments");
      d && (l.radialSegments = d),
      e.radius && (l.radius = e.radius),
      e.tube && (l.tube = e.tube),
      e.tubularSegments && (l.tubularSegments = e.tubularSegments),
      e.arc && (l.arc = e.arc);
      var h = e.getValue(e, "alignment");
      return h && (l.alignment = h),
      "mono.Cube" === t ? i(l) : "mono.PathNode" === t ? n(l) : "mono.TextNode" === t ? o(l) : "mono.ComboNode" === t ? a(l) : "mono.LatheNode" === t ? s(l) : "mono.Entity" === t && r(l),
      l
    },
    $gt3d = GeometryTranslater.get3DGeometry,
    $cpfr = GeometryTranslater.copyPropertyForRoom2D,
    $cpc = GeometryTranslater.copyCommonPropertyFor2D,
    $cpfs2 = GeometryTranslater.copyPropertyForStandObject2D,
    $gt3dog = GeometryTranslater.get3DOtherGeometry,
    modellib.ModelNode = function() {},
    twaver.Util.ext("modellib.ModelNode", Object, {
      getID: function() {
        var e = this.pid;
        return e || (e = this.assembleid),
        e || (e = this.id),
        e
      },
      getType: function() {
        return this.type
      },
      getThumbnail: function() {
        return this.thumbnail ? this.thumbnail: DEFAULT_THUMBNAIL
      },
      getOverview: function() {
        return this.ov ? this.ov: this.getThumbnail()
      },
      getContents: function() {
        return this.children
      },
      getTips: function() {
        return this.tips ? this.tips: this.id
      },
      getLabel: function() {
        return this.label = this.label ? this.label: this.name,
        this.label = this.label ? this.label: this.id,
        this.label
      },
      getTexture: function() {
        return this.dt ? this.dt: DEFAULT_THUMBNAIL
      },
      getClassType: function() {
        return this.classType
      },
      getClassName: function() {
        return this.className
      }
    }),
    modellib.ModelNode.TYPE_ASSEMBLE = "assemble",
    modellib.ModelNode.TYPE_PRIMITIVE = "primitive",
    modellib.Assemble = function(e) {
      this.id = e,
      this.children = []
    },
    twaver.Util.ext("modellib.Assemble", Object, {
      addChild: function(e) {
        if (e instanceof modellib.Assemble) {
          var t = {
            id: e.id
          };
          e.pos && (t.pos = e.pos),
          e.rot && (t.rot = e.rot),
          this._children.push(t)
        }
        this.children.push(e)
      },
      setHost: function(e) {
        var t = this.findByID(e);
        t && (t.ishost = !0)
      },
      findByID: function(e) {
        return a(this.children, e)
      }
    }),
    modellib.ModelLibEvent = function() {},
    modellib.ModelLibEvent.LIBCONTENT_ADDED = "lib.contents.added",
    modellib.ModelLibEvent.LIBCONTENT_REMOVED = "lib.contents.removed",
    modellib.ModelLibrary = function() {
      this._library = {},
      this._primitives = {},
      this._assembles = {},
      this._categories = {},
      this._subTitles = {},
      this.targetCount = 3,
      this._contentsChangedispatcher = new twaver.EventDispatcher
    },
    twaver.Util.ext("modellib.ModelLibrary", Object, {
      parsePrimitives: function(e, t, i, n) {
        for (var o = e.length,
        a = 0; o > a; a++) {
          var s = new modellib.ModelNode(modellib.ModelNode.TYPE_PRIMITIVE),
          r = e[a];
          for (var l in r) s[l] = r[l];
          this.addPrimitive(s)
        }
        this.targetCount--,
        i && i.call(n, t, "executed")
      },
      parseAssembles: function(e, t, i, n) {
        for (var o = e.length,
        a = 0; o > a; a++) {
          var s = new modellib.ModelNode(modellib.ModelNode.TYPE_ASSEMBLE),
          r = e[a];
          for (var l in r) s[l] = r[l];
          this.addAssemble(s)
        }
        this.targetCount--,
        i && i.call(n, t, "executed")
      },
      parseLib: function(e, t, i, n) {
        this._categories = e.categories;
        for (var o = 0; o < this._categories.length; o++) {
          var a = this._categories[o];
          this._library[a.id] = a;
          for (var s = a.contents,
          r = 0; r < s.length; r++) {
            var l = s[r];
            this._subTitles[l.subtitle] = l
          }
        }
        this.targetCount--,
        i && i.call(n, t, "executed")
      },
      isLoaded: function() {
        return 0 == this.targetCount
      },
      getCategories: function() {
        var e = [];
        for (var t in this._library) e.push(this._library[t]);
        return e
      },
      getChildren: function(e) {
        return this._library[e]
      },
      getModelNode: function(e) {
        var t = this._assembles[e];
        return t || (t = this._primitives[e]),
        t
      },
      getModelNodeByTemplateName: function(e) {
        var t = null;
        if (this._assembles) for (var i in this._assembles) this._assembles[i].templateName == e && (t = this._assembles[i]);
        return t
      },
      addModelNode: function(e) {
        modellib.ModelNode.TYPE_ASSEMBLE == e.getType() ? this.addAssemble(e) : this.addPrimitive(e)
      },
      addPrimitive: function(e) {
        if (e && e.id) {
          var t = e.id;
          this._primitives[t] || (this._primitives[t] = e)
        }
      },
      addAssemble: function(e) {
        if (e && e.id) {
          var t = e.id;
          this._assembles[t] || (this._assembles[t] = e)
        }
      },
      removeAccemble: function(e) {
        if (this._accemble[e]) {
          {
            this._accemble[e]
          }
          delete this._accemble[e]
        }
      },
      fireContentsChangedEvent: function(e) {
        this._contentsChangedispatcher.fire(e)
      },
      addContentsChangedListener: function(e, t) {
        this._contentsChangedispatcher.add(e, t)
      },
      getDefaultModelValue: function(e, t) {
        var i = this.getModelNode(e);
        return i ? i[t] : null
      },
      getValue: function(e, t) {
        if (!e) return null;
        var i = e[t];
        return (void 0 === i || null === i) && (i = this.getDefaultModelValue(e.id, t)),
        (void 0 === i || null === i) && 3 == arguments.length && (i = arguments[2]),
        i
      },
      getModelNodeContents: function(e) {
        var t = null;
        if (e.getContents && (t = e.getContents()), !t) {
          var i = this.getModelNode(e.id);
          i || (i = this.getModelNode(e.pid)),
          i && (t = i.getContents())
        }
        return t
      }
    }),
    modellib.ModelManager = function() {
      modellib.ModelManager.superClass.constructor.apply(this, arguments),
      this._modellib = new modellib.ModelLibrary,
      this.init(),
      this.initSerializationSettings(),
      localStorage.getItem(LIB_PRIMITIVES) || localStorage.setItem(LIB_PRIMITIVES, "{}"),
      localStorage.getItem(LIB_ASSEMBLES) || localStorage.setItem(LIB_ASSEMBLES, "{}"),
      localStorage.getItem(LIB_GRAPH) || localStorage.setItem(LIB_GRAPH, "{}"),
      localStorage.getItem(LIB_COMPONENTS) || localStorage.setItem(LIB_COMPONENTS, "{}"),
      this.roots = [],
      this.assembleCache = [],
      this.primitivesCache = [],
      this.nodesMap = {},
      this.lastAssemble = null,
      this.buildings = [],
      this.equipments = [],
      this.targets = [],
      this.pipes = [],
      this.floors = [],
      this.roomAssembles = [],
      this.roomPrimitives = [],
      this.jsonVersion = 1.1
    },
    twaver.Util.ext("modellib.ModelManager", Object, {
      lastAssemble: null,
      init: function() {
        this.loadResource = localStorage.getItem(LOAD_RESOURCE_TYPE) || TYPE_LOCAL,
        this._modellib.addContentsChangedListener(this.onLibContentsChanged, this)
      },
      initSerializationSettings: function() {
        mono.SerializationSettings.setClientType(MAIN_VISIBLE, "boolean"),
        mono.SerializationSettings.setClientType(OID, "string"),
        mono.SerializationSettings.setClientType(TAG_ANIMATION, "string")
      },
      getModelLib: function() {
        return this._modellib
      },
      parsePrimitives: function(e) {
        this._modellib.parsePrimitives(e),
        this.loadSharedPrimitive()
      },
      parseAssembles: function(e) {
        this._modellib.parseAssembles(e),
        this.loadSharedAssemble(e)
      },
      parseLib: function(e) {
        this._modellib.parseLib(e)
      },
      wrapModelNodeIntoItem: function(e, t, i, n) {
        var o = this.getModelNode(t);
        if (o || e != TEMPLATES || (o = this._modellib.getModelNodeByTemplateName(i)), o) {
          o.label = o.label || i,
          o.tips = o.tips || i,
          o.templateName = i;
          var a = {
            className: this._modellib.getValue(o, "shape") || o.getClassName(),
            image: n ? n: o.getThumbnail(),
            classType: o.getClassType(),
            actionType: this._modellib.getValue(o, "actionType"),
            tooltip: o.getTips(),
            label: o.getLabel(),
            dragImage: o.getOverview(),
            image3d: o.getTexture(),
            id: o.id,
            embeded: o.embeded,
            json: o.json,
            args: o.args,
            texture: o.texture,
            material: o.material,
            color: o.color,
            material_index: o.material_index,
            resize: o.resize,
            panel: o.panel,
            shape: o.shape,
            faces: o.faces,
            transparent: o.transparent,
            layer: o.layer,
            wrapMode: o.wrapMode
          },
          s = this._modellib.getValue(o, "type");
          s && (a.type = s);
          var r = this._modellib.getValue(o, "radialSegments");
          return r && (a.radialSegments = r),
          a
        }
        if (o = this.getSharedGraph(t)) {
          var l = i,
          d = n ? n: o.thumbnail;
          d = n ? n: "crash.png";
          var a = {
            className: "Graph",
            image: d,
            classType: "Graph",
            actionType: "loadTemplate",
            tooltip: l,
            label: l,
            dragImage: d,
            id: t
          };
          return a
        }
        return null
      },
      getModelNode: function(e) {
        return this._modellib.getModelNode(e)
      },
      getCategory: function(e) {
        return JSON.parse(localStorage.getItem(e))
      },
      getSharedComponent: function(e) {
        var t = JSON.parse(localStorage.getItem(LIB_COMPONENTS));
        return t ? t[e] : null
      },
      getSharedGraph: function(e) {
        var t = JSON.parse(localStorage.getItem(LIB_GRAPH));
        return t ? t[e] : null
      },
      getSharedAssemble: function(e) {
        var t = this.getSharedAssembles();
        return t ? t[e] : null
      },
      getSharedPrimitive: function(e) {
        var t = this.getSharedPrimitives();
        return t ? t[e] : null
      },
      getSharedComponent: function(e) {
        var t = this.getSharedComponents();
        return t ? t[e] : null
      },
      removeShareComponent: function(e) {
        var t = this.getSharedComponents();
        if (t && t[e]) {
          delete t[e];
          var i = JSON.stringify(t);
          localStorage.setItem(LIB_COMPONENTS, i)
        }
      },
      removeShareCategory: function(e, t) {
        var i = localStorage.getItem(LOAD_RESOURCE_TYPE);
        if (i === TYPE_CLOUD) this.deleteItemFromDB(t, null, this);
        else {
          if (e) {
            var n = null,
            o = null;
            if (n = JSON.parse(localStorage.getItem(e))) for (var a = 0; a < n.contents.length; a++) o = n.contents[a],
            o && ModelUtils.containsID(o.children, t) && ModelUtils.removeChild(o.children, t)
          }
          "Templates" === e && this.removeShareItem(t),
          localStorage.setItem(e, JSON.stringify(n))
        }
      },
      deleteItemFromDB: function(e, t, i) {
        var n = {
          method: "remove",
          module: "templates",
          arguments: {
            id: e
          }
        };
        require(MONO_URL, n, t, i)
      },
      removeShareAssemble: function(e) {
        var t = this.getSharedAssembles();
        if (t && t[e]) {
          delete t[e];
          var i = JSON.stringify(t);
          localStorage.setItem(LIB_ASSEMBLES, i)
        }
      },
      removeShareGraph: function(e) {
        var t = this.getSharedGraphLibrary();
        if (t && t[e]) {
          delete t[e];
          var i = JSON.stringify(t);
          localStorage.setItem(LIB_GRAPH, i)
        }
      },
      removeShareItem: function(e) {
        var t = this.getSharedAssembles();
        if (t && t[e]) {
          for (var i = t[e], n = i.children, o = this.getSharedPrimitives(), a = 0; a < n.length; a++) {
            var s = n[a].id;
            o[s] && delete o[s]
          }
          var r = JSON.stringify(o);
          localStorage.setItem(LIB_PRIMITIVES, r),
          delete t[e];
          var l = JSON.stringify(t);
          localStorage.setItem(LIB_ASSEMBLES, l)
        } else {
          var d = this.getSharedGraphLibrary();
          if (d && d[e]) {
            delete d[e];
            var h = JSON.stringify(d);
            localStorage.setItem(LIB_GRAPH, h)
          }
        }
      },
      shareGraph: function(e, t, i, n, o) {
        if (i) {
          var a = null,
          s = null;
          if (e && (a = this.getCategory(e), a || (a = {
            id: e,
            contents: []
          }), a)) {
            for (var r = 0; r < a.contents.length; r++) t == a.contents[r].subtitle && (s = a.contents[r]);
            s || (s = {
              subtitle: t,
              children: []
            },
            a.contents.push(s))
          }
          var l = this.getSharedGraphLibrary();
          if (l) {
            l[i.id] = i,
            s && (ModelUtils.containsID(s.children, i.id) || s.children.push({
              id: i.id,
              name: o,
              thumbnail: n
            }));
            var d = JSON.stringify(l);
            localStorage.setItem(LIB_GRAPH, d),
            localStorage.setItem(e, JSON.stringify(a))
          }
        }
      },
      sharePrimitive: function(e, t, i, n) {
        if (i) {
          var o = null,
          a = null;
          if (e && (o = JSON.parse(localStorage.getItem(e)), o || (o = {
            id: e,
            contents: []
          }), o)) {
            for (var s = 0; s < o.contents.length; s++) t == o.contents[s].subtitle && (a = o.contents[s]);
            a || (a = {
              subtitle: t,
              children: []
            },
            o.contents.push(a))
          }
          var r = this.getSharedPrimitives();
          if (r) {
            if (i instanceof Array) for (var s = 0; s < i.length; s++) r[i[s].id] = i[s],
            a && (ModelUtils.containsID(a.children, i[s].id) || a.children.push(i[s]));
            else r[i.id] = i,
            a && (ModelUtils.containsID(a.children, i.id) || a.children.push(i));
            var l = JSON.stringify(r);
            localStorage.setItem(LIB_PRIMITIVES, l),
            n && localStorage.setItem(e, JSON.stringify(o))
          }
        }
      },
      shareAssemble: function(e, t, i, n, o) {
        if (i) {
          var a = null,
          s = null;
          if (e && (a = JSON.parse(localStorage.getItem(e)), a || (a = {
            id: e,
            contents: []
          }), a)) {
            for (var r = 0; r < a.contents.length; r++) t == a.contents[r].subtitle && (s = a.contents[r]);
            s || (s = {
              subtitle: t,
              children: []
            },
            a.contents.push(s))
          }
          var l = this.getSharedAssembles();
          if (l) {
            if (i instanceof Array) for (var r = 0; r < i.length; r++) l[i[r].id] = i[r],
            s && i[r].templateName === n && (ModelUtils.containsID(s.children, i[r].id) || s.children.push({
              id: i[r].id,
              name: n,
              thumbnail: o
            }));
            else l[i.id] = i,
            s && i.templateName === n && (ModelUtils.containsID(s.children, i.id) || s.children.push({
              id: i.id,
              name: n,
              thumbnail: o
            }));
            var d = JSON.stringify(l);
            localStorage.setItem(LIB_ASSEMBLES, d),
            localStorage.setItem(e, JSON.stringify(a))
          }
        }
      },
      getSharedPrimitives: function() {
        return JSON.parse(localStorage.getItem(LIB_PRIMITIVES))
      },
      getSharedAssembles: function() {
        return JSON.parse(localStorage.getItem(LIB_ASSEMBLES))
      },
      getSharedGraphLibrary: function() {
        return JSON.parse(localStorage.getItem(LIB_GRAPH))
      },
      getSharedComponents: function() {
        return JSON.parse(localStorage.getItem(LIB_COMPONENTS))
      },
      loadResourceFile: function(e, t) {
        var i = document.createElement("script");
        i.setAttribute("type", "text/javascript"),
        i.setAttribute("src", "resources/" + e),
        t && (i.onload = t.call(i, e, "loaded")),
        document.getElementsByTagName("head")[0].appendChild(i)
      },
      loadGraph: function(e, t, i, n, o) {
        var a = new twaver.ElementBox,
        s = this.loadGraphto2d(a, t, o),
        r = this.show3D(a, e, s, i, n);
        return {
          box2d: a,
          box3d: r
        }
      },
      loadGraphto2d: function(e, t, i) {
        var n = null,
        o = null;
        if (t) {
          var a = t.scaleValue,
          s = this.parseSketch(t, !1, i);
          if (s instanceof Array) {
            var r, l;
            e.forEach(function(e) {
              Utils.isTargetFlag(e) ? r = e: Utils.isOriginalFlag(e) && (l = e)
            });
            for (var d = 0; d < s.length; d++) if (s[d] instanceof twaver.Layer) {
              var h = !1,
              c = Utils.getUnPredefinedFloorLayers(e);
              c.forEach(function(e) {
                return e.getClient("floorRef") ? void(h = !0) : void 0
              }),
              e.getLayerBox().getDataById(s[d].getId()) || Utils.getLayerByFloorName(e.getLayerBox(), s[d].getClient(FLOOR_NAME)) || (h && s[d].getClient("floorRef") && s[d].setClient("floorRef", !1), e.getLayerBox().add(s[d]))
            } else s[d] instanceof TargetFlagNode ? (Utils.isTargetFlag(s[d]) ? (r && e.remove(r), r = s[d], n = s[d]) : Utils.isOriginalFlag(s[d]) && (l && e.remove(l), l = s[d], o = s[d]), e.add(s[d])) : s[d] && e.add(s[d])
          }
          this.scale = 1 / parseFloat(a),
          this.scale = this.scale || 1;
          var g = this,
          m = {};
          e.forEach(function(e) {
            e instanceof PrimitiveNode && (m[e.getId()] = e.getCenterLocation())
          }),
          e.forEach(function(e) {
            if (e instanceof twaver.ShapeNode) {
              if (e instanceof PipeShapeNode) {
                var t = e.getStyle("vector.outline.width"),
                i = Math.abs(Math.log(g.scale));
                t = g.scale > 1 ? t / Math.pow(1.5, i) : t * Math.pow(1.5, i),
                e.setStyle("vector.outline.width", t)
              }
              var n = new twaver.List,
              o = e.getPoints();
              o.forEach(function(e) {
                n.add({
                  x: e.x / g.scale,
                  y: e.y / g.scale
                })
              }),
              e.setPoints(n)
            } else if (e instanceof Window || e instanceof Door || e instanceof Cutoff) {
              var a = e.getClient("length"),
              s = e.getStyle("vector.outline.width"),
              i = Math.abs(Math.log(g.scale));
              s = g.scale > 1 ? s / Math.pow(1.5, i) : s * Math.pow(1.5, i),
              e.setStyle("vector.outline.width", s),
              e.setClient("length", a / g.scale)
            }
          }),
          e.forEach(function(e) {
            if (e instanceof PrimitiveNode) {
              var t = parseFloat(1) / parseFloat(e.scaleValue || 1),
              i = e.getHeight(),
              n = e.getWidth();
              e.setHeight(i / t),
              e.setWidth(n / t);
              var o = m[e.getId()] || e.getCenterLocation(),
              a = {
                x: o.x / g.scale,
                y: o.y / g.scale
              };
              e.setCenterLocation(a)
            }
          })
        }
        return {
          targetPoint: n,
          originalPoint: o
        }
      },
      addPrimitiveInfoIntoModelLib: function(e, t) {
        var i = new modellib.ModelNode(e);
        ModelUtils.copyProperties(i, t),
        i.type = "primitive",
        i.shape = "PrimitiveModel",
        this._modellib.addPrimitive(i)
      },
      addAssembleInfoIntoModelLib: function(e, t) {
        var i = new modellib.ModelNode(e);
        ModelUtils.copyProperties(i, t),
        i.type = "assemble",
        i.shape = "AssembleModel",
        this._modellib.addAssemble(i)
      },
      loadSharedPrimitive: function() {
        var e;
        if (e = arguments.length > 0 ? arguments[0] : this.getSharedPrimitives(), e instanceof Array) for (var t = 0; t < e.length; t++) this.addPrimitiveInfoIntoModelLib(modellib.ModelNode.TYPE_PRIMITIVE, e[t]);
        else for (var i in e) this.addPrimitiveInfoIntoModelLib(modellib.ModelNode.TYPE_PRIMITIVE, e[i])
      },
      loadSharedAssemble: function() {
        if (assembles = arguments.length > 0 ? arguments[0] : this.getSharedAssembles(), assembles instanceof Array) for (var e = 0; e < assembles.length; e++) this.addAssembleInfoIntoModelLib(modellib.ModelNode.TYPE_ASSEMBLE, assembles[e]);
        else for (var t in assembles) this.addAssembleInfoIntoModelLib(modellib.ModelNode.TYPE_ASSEMBLE, assembles[t])
      },
      parseSketch: function(e, t, i) {
        var n = e.assembles,
        o = e.primitives,
        a = e.sketch;
        o && this.loadSharedPrimitive(o),
        n && this.loadSharedAssemble(n);
        var s = this.parseCustomSketch(a, t, i);
        return this.wrapImageShapeNodeHost(s),
        s
      },
      wrapImageShapeNodeHost: function(e) {
        var t = {};
        if (e instanceof Array) {
          for (var i = 0; i < e.length; i++) e[i] && e[i].getClient("primitiveName") && e[i].setName(e[i].getClient("primitiveName")),
          e[i] && e[i].getClient(OID) && (t[e[i].getClient(OID)] = e[i].getId());
          for (var i = 0; i < e.length; i++) if (e[i] && e[i] instanceof ImageShapeNode) {
            e[i].getClient(OID) && e[i].setClient(OID, e[i].getId());
            var n = e[i].getClient("hostNodeId");
            n && e[i].setClient("hostNodeId", t[n])
          }
        }
      },
      parseCustomSketch: function(e, t, i) {
        var n = e.buildings,
        o = e.equipments,
        a = e.floors,
        s = e.pipes,
        r = e.layers,
        l = e.targets,
        d = [];
        if (r instanceof Array) for (var h = 0; h < r.length; h++) d = d.concat(this.parseLayer(r[h], t));
        if (n instanceof Array) for (var h = 0; h < n.length; h++) {
          var c = n[h];
          d = d.concat(this.parseCustomBuilding(c, t))
        }
        if (o instanceof Array) for (var h = 0; h < o.length; h++) d = d.concat(this.parseStandObject3D(o[h], t, i));
        if (a instanceof Array) for (var h = 0; h < a.length; h++) d = d.concat(this.parseFloor(a[h], t));
        if (s instanceof Array) for (var h = 0; h < s.length; h++) d = d.concat(this.parsePipes(s[h], t));
        if (l && l instanceof Array) for (var h = 0; h < l.length; h++) d = d.concat(this.parseTarget(l[h], t));
        return d
      },
      parseLayer: function(e, t) {
        if (!t) {
          var i = new twaver.Layer;
          return i.setClient(FLOOR_NAME, e[FLOOR_NAME]),
          i.setClient(FLOOR_HEIGHT, e[FLOOR_HEIGHT]),
          i.setClient(FLOOR_VISIBLE, e[FLOOR_VISIBLE]),
          i.setClient(FLOOR_REF, e[FLOOR_REF]),
          i.setClient(FLOOR_LAYER, e[FLOOR_LAYER]),
          [i]
        }
      },
      parseCustomBuilding: function(e, t) {
        var i = [],
        n = this._modellib.getValue(e, IS_INNER_WALL) ? new InnerWallShapeNode: new ImageShapeNode,
        o = e.children,
        a = this._modellib.getValue(e, OUTLINE_SHAPE);
        if (a.length % 3 == 0) {
          for (var s = [], r = 0; r < a.length; r += 3) s.push({
            x: a[r],
            y: a[r + 2]
          });
          n.setPoints(new twaver.List(s))
        }
        if ($cpfr(e, n, this._modellib), o instanceof Array) for (var r = 0; r < o.length; r++) {
          var l = o[r];
          if (l.children) i = i.concat(this.parseCustomBuilding(l));
          else {
            var d = null,
            h = l.bType;
            d = "window" === h ? new Window: "door" === h ? new Door: "cutoff" === h ? new Cutoff: new Block;
            var c = l[IMAGE_SRC],
            g = l[SPACE_SIZE];
            l[SIZE_LENGTH] && d.setClient(SIZE_LENGTH, l[SIZE_LENGTH]),
            l[TAG_ANIMATION] && d.setClient(TAG_ANIMATION, l[TAG_ANIMATION]),
            l[SIZE_HEIGHT] && d.setClient(SIZE_HEIGHT, l[SIZE_HEIGHT]),
            l[FLOOR_NAME] && d.setClient(FLOOR_NAME, l[FLOOR_NAME]),
            l[FLOOR_HEIGHT] && d.setClient(FLOOR_HEIGHT, l[FLOOR_HEIGHT]),
            l[SIZE_LENGTH] || l[SIZE_HEIGHT] || (g || (g = this._modellib.getValue(this.getModelNode(l.gid), SPACE_SIZE)), g && (d.setClient(SIZE_LENGTH, g[0]), d.setClient(SIZE_HEIGHT, g[1])));
            var m = l[SPACE_POS_Y];
            if (m)"door" != h && d.setClient(SPACE_POS_Y, m);
            else {
              var u = l[SPACE_POSITION];
              u && "door" != h && d.setClient(SPACE_POS_Y, u[1])
            }
            c && d.setClient(IMAGE_SRC, c),
            d.setClient(BELONG_ID, l[BELONG_ID]),
            d.setClient(SHAPE_TYPE, "BlockModel"),
            d.setClient(GID, l.gid),
            d.setClient(BLOCK_OFFSET, l[BLOCK_OFFSET]),
            d.setClient(SPE_STR, l[SPE_STR]),
            d.setClient("transparent", l[TRA_PAR]),
            d.setClient("opacity", l[OPA]),
            this.parseCustomProps(d, l),
            n.addChild(d)
          }
        }
        if (t) {
          var p = new mono.DataBox;
          return n.translate3d(p, n.getChildren().toArray()),
          i = i.concat(p.getNodes().toArray())
        }
        var f = [n];
        return f = f.concat(n.getChildren().toArray())
      },
      parseStandObject3D: function(e, t, i) {
        var n = [],
        o = this._modellib.getModelNode(e.gid);
        if (o) {
          var a = ModelFactory.getModelFromModelNode(this._modellib, o);
          if (t) {
            n = n.concat(a.get3DObjects());
            var s = a.hostModel3DNode;
            if (s) {
              var r = this._modellib.getValue(e, SPACE_POSITION),
              l = this._modellib.getValue(e, SPACE_POS_Y);
              r && (l && (r.y += l), s.setPosition(r[0], r[1], r[2]));
              var d = this._modellib.getValue(e, "scale"),
              h = this._modellib.getValue(e, DESIGN_SCALE);
              d || (d = [1, 1, 1]),
              h instanceof Array && (d = [d[0] * h[0], d[1] * h[1], d[2] * h[2]]),
              s.setScale(d[0], d[1], d[2]);
              var c = this._modellib.getValue(e, "rot");
              c && s.setRotation(c[0], c[1], c[2]),
              s[GID] = e[GID],
              s[OID] = e[OID]
            }
          } else {
            n = n.concat(a.get2DObjects(!i));
            var s = a.mainNode;
            s || (s = n[0]),
            s && ($cpfs2(e, s, this._modellib), s.scaleValue = a.scaleValue)
          }
        }
        return n
      },
      parseFloor: function(e, t) {
        var i = [],
        n = new FloorShapeNode;
        n[GID] = e[GID],
        n[OID] = e[OID];
        var o = this.getModelNode(e[GID]),
        a = this._modellib.getValue(e, OUTLINE_SHAPE);
        if (a || o && (a = this._modellib.getValue(o, OUTLINE_SHAPE)), a && a.length % 3 == 0) {
          for (var s = [], r = 0; r < a.length; r += 3) s.push({
            x: a[r],
            y: a[r + 2]
          });
          n.setPoints(new twaver.List(s))
        }
        var l = this._modellib.getValue(e, IMAGE_SRC);
        l || o && (l = this._modellib.getValue(o, "dt")),
        l && (refreshNetwork ? Utils.registerImage(l, null, null, refreshNetwork) : Utils.registerImage(l), n.setClient(IMAGE_SRC, l));
        var d = this._modellib.getValue(e, HOST_NODE_ID);
        d && n.setClient(HOST_NODE_ID, d);
        var h = this._modellib.getValue(e, FLOOR_NAME);
        h && n.setClient(FLOOR_NAME, h);
        var c = this._modellib.getValue(e, FLOOR_HEIGHT);
        c && n.setClient(FLOOR_HEIGHT, c);
        var g = this._modellib.getValue(e, "repeat");
        g && n.setClient("repeat", g);
        var m = this._modellib.getValue(e, "size");
        m && n.setClient("size", m);
        var u = this._modellib.getValue(e, TRA_PAR);
        u && n.setClient(TRA_PAR, u);
        var p = this._modellib.getValue(e, OPA);
        if (p && n.setClient(OPA, p), this.parseCustomProps(n, e), t) {
          var f = new mono.DataBox;
          return n.translate3d(f, n.getChildren().toArray()),
          i = i.concat(f.getNodes().toArray())
        }
        return [n]
      },
      parsePipes: function(e, t) {
        var i = [],
        n = new PipeShapeNode;
        if (e.className && "RoundPipeShapeNode" == e.className && (n = new RoundPipeShapeNode), e[GID] && (n.setClient(GID, e[GID]), n[GID] = e[GID]), e[OID] && n.setClient(OID, e[OID]), e.repeat && n.setClient("repeat", e.repeat), e.positionY && n.setClient("positionY", e.positionY), e[OUTLINE_SHAPE]) var o = e[OUTLINE_SHAPE];
        var o = e[OUTLINE_SHAPE];
        if (o && o.length % 3 == 0) {
          for (var a = [], s = 0; s < o.length; s += 3) a.push({
            x: o[s],
            y: o[s + 2]
          });
          n.setPoints(new twaver.List(a))
        }
        if (e[FLOOR_NAME] && n.setClient(FLOOR_NAME, e[FLOOR_NAME]), e.startCap && n.setClient("startCap", e.startCap), e.endCap && n.setClient("endCap", e.endCap), e.startCapSize && n.setClient("startCapSize", e.startCapSize), e.endCapSize && n.setClient("endCapSize", e.endCapSize), e.radius && n.setClient("radius", e.radius), e.segments && n.setClient("segments", e.segments), e[IMAGE_SRC] && n.setClient(IMAGE_SRC, e[IMAGE_SRC]), e.pointPositions && n.setClient("pointPositions", e.pointPositions), this.parseCustomProps(n, e), t) {
          var r = new mono.DataBox;
          return n.translate3d(r, n.getChildren().toArray()),
          i = i.concat(r.getNodes().toArray())
        }
        return [n]
      },
      parseTarget: function(e) {
        var t = new TargetFlagNode(e.type);
        return t.setCenterLocation(e.x, e.z),
        t.setClient(SPACE_POS_Y, e.y),
        t.setShowPoint(e.visible),
        [t]
      },
      parseCustomProps: function(e, t) {
        var i = this._modellib.getValue(t, CUSTOM_PROPS);
        if (i) {
          for (var n in i) e.setClient(i[n], this._modellib.getValue(t, i[n]));
          e.setClient(CUSTOM_PROPS, i)
        }
        var o = this._modellib.getValue(t, PropertyConsts.LAYERID);
        o && e.setClient(PropertyConsts.LAYERID, o)
      },
      loadTemplate: function(e, t) {
        var i = this;
        if ("object" == typeof t) {
          var n = t,
          o = {
            module: "templates",
            method: "getData",
            arguments: {
              id: n.id
            }
          },
          a = function() {
            var t = JSON.parse(arguments[0]);
            if (t.error) return void alert(t.error);
            var n = JSON.parse(t.value);
            i.loadDataCheck(cloudKey, this.loadGraphto2d, [e, n]),
            refreshNetwork()
          };
          require(MONO_URL, o, a, this)
        } else {
          var s = this.getSharedGraph(t);
          this.loadGraphto2d(e, s),
          refreshNetwork()
        }
      },
      loadDataCheck: function(e, t, i) {
        var n = i[1],
        o = this;
        if (n) {
          for (var a = [], s = n.sketch.equipments, r = 0; r < s.length; r++) {
            var l = this._modellib.getModelNode(s[r].gid);
            l || a.indexOf(s[r].gid) < 0 && a.push(s[r].gid)
          }
          if (a.length > 0) {
            var d = {
              module: "templates",
              method: "getDatas",
              arguments: {
                gids: a.join(",")
              }
            },
            h = function() {
              var e = JSON.parse(arguments[0]);
              if (e.error) return void alert(e.error);
              var n = e.value;
              if (n && n.length > 0) for (r in n) {
                var a = JSON.parse(n[r].data);
                a.primitives || a.assembles ? (o.loadSharedPrimitive(a.primitives), o.loadSharedAssemble(a.assembles)) : (o.loadSharedPrimitive(a.primitivesCache), o.loadSharedAssemble(a.assembleCache))
              }
              t.apply(o, i)
            };
            require(MONO_URL, d, h, this)
          } else t.apply(o, i)
        }
      },
      loadDataFromRoom: function(e, t) {
        var i, n, o = new twaver.ElementBox,
        a = this.parseSketch(e);
        if (a instanceof Array) for (var s = 0; s < a.length; s++) a[s] instanceof twaver.Layer ? o.getLayerBox().add(a[s]) : a[s] instanceof TargetFlagNode ? (Utils.isTargetFlag(a[s]) ? i = a[s] : Utils.isOriginalFlag(a[s]) && (n = a[s]), o.add(a[s])) : o.add(a[s]);
        this.show3D(o, t, {
          targetPoint: i,
          originalPoint: n
        })
      },
      loadDatafromComponent: function(e, t, i) {
        this.loadSharedPrimitive(t.primitives),
        this.loadSharedAssemble(t.assembles);
        var n = {
          x: 120,
          y: 100
        },
        o = this._modellib.getModelNode(i);
        if (o) {
          var a = ModelFactory.getModelFromModelNode(this._modellib, o);
          if (a instanceof modelimp.ModelImp) {
            var s, r = (e.getDataBox(), new twaver.ElementBox),
            l = a.get2DObjects();
            l[0] && (a.mainNode ? (a.mainNode.setCenterLocation(n), a.mainNode instanceof PrimitiveNode && a.mainNode.setName(a.id), s = a.mainNode) : (l[0].setCenterLocation(n), l[0] instanceof PrimitiveNode && l[0].setName(a.id), s = l[0]), s && (s.getX() < 0 && s.setX(0), s.getY() < 0 && s.setY(0)));
            for (var d = 0; d < l.length; d++) r.add(l[d]);
            this.show3D(r, e)
          }
        }
      },
      show3D: function(e, t, i, n, o) {
        t || (t = new mono.Network3D);
        var a = t.getDataBox();
        if (o || (a.clear(), a.getAlarmBox().clear()), i) var s = i.targetPoint,
        r = i.originalPoint;
        a.addDataBoxChangeListener(function(e) {
          if (e.data && e.data.getPosition()) {
            var t = e.data.getPosition();
            if (r && r.isShowPoint()) {
              var i = r.getCenterLocation();
              t.x = t.x - i.x,
              t.y = t.y - r.getClient(SPACE_POS_Y),
              t.z = t.y - i.y
            }
          }
        },
        this);
        var l = {},
        d = 0;
        a.startBatch(),
        e.forEach(function(e) {
          var i = e;
          if (i instanceof twaver.ShapeNode) {
            var n = i.getPoints(),
            o = n.size();
            if (o > 0 && i instanceof ImageShapeNode) {
              i.setClient("shapeNodeIndex", d++);
              var s = i.getChildren(),
              r = [];
              s && s.forEach(function(e) {
                e instanceof Block && r.push(e)
              }),
              i.translate3d(a, r, t)
            }
          } else i instanceof PrimitiveNode && (l[i.getId()] = i.translate3d(a, t))
        }),
        e.forEach(function(e) {
          var t = e;
          if (t.getHost) {
            var i = t.getHost();
            i && l[t.getId()].setParent(l[i.getId()])
          }
        });
        var h = [];
        for (var c in l) l[c].getParent() || h.push(l[c]);
        a.getRoots().forEachReverse(function(e) {
          e instanceof mono.ComboNode && e.getClient("entity") && a.remove(e)
        });
        for (var g = 0; g < h.length; g++) {
          var m = h[g];
          if (!a.getDataById(m.getId())) {
            var u = m.getDescendants();
            if (m.getClient("isEntity")) {
              u.push(m);
              var p = new mono.ComboNode(u, null, null, "entity" + m.getId());
              p.setClient("floorName", m.getClient("floorName")),
              p.setClient(BID, m.getClient(BID)),
              p.setClient("entity", !0),
              a.add(p)
            } else a.addByDescendant(m)
          }
        }
        if (a.endBatch(), l = null, s && s.isShowPoint()) {
          var f = s.getCenterLocation(),
          v = new mono.Vec3(f.x, 100, f.y);
          t.getCamera().look(v);
          for (var y = t.getInteractions(), c = 0; c < y.length; c++) y[c] instanceof mono.DefaultInteraction && (y[c].target = v)
        }
        return a
      },
      loadGraphUrl: function(e, t, i, n, o, a) {
        var s = this;
        this.loadFile(t,
        function(t) {
          var r = JSON.parse(t);
          if (r) {
            var l = s.loadGraph(e, r, i, n);
            a && a.call(o, l.box2d, l.box3d)
          }
        })
      },
      loadGraphDatas: function(e) {
        var t = this,
        i = new mono.Network3D;
        return this.loadFile(e,
        function(e) {
          var n = JSON.parse(e);
          n && t.loadGraph(i, n)
        }),
        i.getDataBox().getDatas()
      },
      loadFile: function(e, t) {
        if (e) {
          var i = new XMLHttpRequest;
          void 0 !== t && i.addEventListener("load",
          function(e) {
            t(e.target.responseText)
          },
          !1),
          i.open("GET", e, !0),
          i.send(null)
        }
      },
      loadComponentDatas: function(e, t) {
        var i = {};
        if (this.loadResource === TYPE_CLOUD) {
          var n = {
            module: "templates",
            method: "getData",
            arguments: {
              id: e
            }
          };
          require(MONO_URL, n, t, this)
        } else {
          var o = modelManager.getSharedComponent(e);
          o && (i = o.data)
        }
        return i
      },
      loadCloudTemplateById: function(e, t, i, n, o) {
        var a = this,
        s = {
          module: "templates",
          method: "getData",
          arguments: {
            id: t
          }
        };
        loadCloud = function() {
          var t = JSON.parse(arguments[0]);
          if (t.error) return void alert(t.error);
          if (!t.value) return void alert("No Template with Id " + id);
          var s, r = JSON.parse(t.value);
          if (r.primitives && r.primitives.length > 0 && r.assembles && r.assembles.length > 0 || r.primitivesCache && r.assembleCache) {
            var l = e ? e.getDataBox() : null;
            s = a.loadComponentTemplateFromContents(l, t.value, i, !1)
          } else a.loadDataCheck(null, a.loadGraph, [e, r, !0]);
          o && o.call(n, s)
        },
        require(MONO_URL, s, loadCloud, this)
      },
      loadTemplateFromCloud: function(e, t, i, n) {
        var o = {
          module: "templates",
          method: "search",
          arguments: {
            name: t
          }
        },
        a = this,
        s = function() {
          if (1 === arguments.length) {
            var r = JSON.parse(arguments[0]);
            if (r.error) return void alert(r.error);
            if (!r.value || r.value.length <= 0) return void alert(t + " dese not exist");
            var l = r.value[0];
            o = {
              module: "templates",
              method: "getData",
              arguments: {
                id: l.id
              }
            },
            s = function() {
              var o = JSON.parse(arguments[0]);
              if (o.error) return void alert(o.error);
              if (!o.value) return void alert("No Template with name " + t);
              var s = JSON.parse(o.value);
              "Component" === l.type ? a.loadDatafromComponent(e, s, t) : a.loadDataCheck(i, a.loadGraph, [e, s, n])
            },
            require(MONO_URL, o, s, this)
          }
        };
        require(MONO_URL, o, s, this)
      },
      exportRoomToTemplate: function(e, t, i, n, o, a, s, r, l) {
        var d = n;
        if (!d) return alert("Template name is required"),
        !1;
        if (this.loadResource === TYPE_CLOUD && !o) return alert("Template category is required"),
        !1;
        d || (d = "Your Graph");
        var h = this.serializeGraphInfo(e);
        if (h.id = Utils.generateAssembleId(), this.loadResource === TYPE_CLOUD) {
          var c = JSON.stringify(h);
          if (l) g = {
            module: "templates",
            method: "update",
            arguments: {
              id: a,
              name: n,
              data: c,
              category: o,
              gid: h.id,
              icon: t,
              author: s,
              tags: r,
              preview: i
            }
          };
          else var g = {
            module: "templates",
            method: "add",
            arguments: {
              name: n,
              data: c,
              category: o,
              scope: 0,
              gid: h.id,
              icon: t,
              preview: i,
              author: s,
              tag: r
            }
          };
          var m = function() {
            if (1 === arguments.length) {
              var e = JSON.parse(arguments[0]);
              if (e.error) return void alert(e.error);
              alert("Models have been export to the cloud library.")
            }
          };
          require(MONO_URL, g, m, this)
        } else this.shareGraph(TEMPLATES, SUBTITLE_ROOM, h, t, d),
        alert("Models have been export to the local library.");
        return h
      },
      serializeDatasInfo: function(e, t) {
        for (var i = e.size(), n = 0; i > n; n++) this.dfs2DNodes(e.get(n));
        for (var o = {
          buildings: this.buildings,
          equipments: this.equipments,
          pipes: this.pipes,
          floors: this.floors
        },
        a = {
          primitives: [],
          assembles: [],
          sketch: o
        },
        n = 0; i > n; n++) delete e.get(n).visited;
        return t && (a.scaleValue = t),
        this.buildings = [],
        this.equipments = [],
        this.floors = [],
        this.pipes = [],
        JSON.stringify(a)
      },
      serializeGraphInfo: function(e, t) {
        for (var i = e.getDatas(), n = i.size(), o = 0; n > o; o++) this.dfs2DNodes(i.get(o));
        var a = [],
        s = Utils.getUnPredefinedFloorLayers(e);
        if (s && s.size() > 0) {
          var r = this;
          s.forEach(function(e) {
            a.push(r.dfs2DLayers(e))
          })
        }
        var l = {
          buildings: this.buildings,
          equipments: this.equipments,
          targets: this.targets,
          pipes: this.pipes,
          floors: this.floors,
          layers: a
        },
        d = {
          primitives: [],
          assembles: [],
          sketch: l
        };
        t && (this.handlePrimitivesInfo(), this.handleAssemblesInfo(), d = {
          primitives: this.roomPrimitives,
          assembles: this.roomAssembles,
          sketch: l
        });
        var h = e.getClient("scaleValue");
        h && (d.scaleValue = h);
        for (var o = 0; n > o; o++) delete i.get(o).visited;
        return this.buildings = [],
        this.equipments = [],
        this.targets = [],
        this.floors = [],
        this.pipes = [],
        this.layerInfo = [],
        this.roomPrimitives = [],
        this.roomAssembles = [],
        d
      },
      handleAssemblesInfo: function() {
        for (var e, t, i = this.roomAssembles,
        n = 0; n < i.length; n++) {
          e = i[n],
          t = e.getContents();
          for (var o = 0; o < t.length; o++) {
            var a = t[o],
            s = this.getModelNode(a.id);
            for (var r in a)"id" != r && a[r] == s[r] && (a[r] = void 0);
            a.type = void 0,
            a.shape = void 0
          }
          e.type = void 0,
          e.shape = void 0
        }
      },
      handlePrimitivesInfo: function() {
        for (var e, t = this.roomPrimitives,
        i = 0; i < t.length; i++) e = t[i],
        e.type = void 0,
        e.shape = void 0
      },
      searchTemplatesFromDB: function(e, t, i, n, o) {
        var a = {
          module: "templates",
          method: "search",
          arguments: {
            scope: t,
            category: o
          }
        };
        require(MONO_URL, a, i, n)
      },
      getPreviewById: function(e, t, i) {
        var n = (localStorage.getItem(CLOUD_KEY), {
          module: "templates",
          method: "getPreview",
          arguments: {
            id: e
          }
        });
        require(MONO_URL, n, t, i, !0)
      },
      dfs2DNodes: function(e) {
        if (!e.visited) {
          e.visited = !0;
          var t, i = e.getParent();
          if (i) i instanceof ImageShapeNode && (t = this.getBlockInfo(e));
          else if (t = this.getBasicInfo(e), e instanceof PipeShapeNode) this.wrapPipeInfo(t, e),
          this.pipes.push(t);
          else if (e instanceof FloorShapeNode) this.wrapFloorInfo(t, e),
          this.floors.push(t);
          else if (e instanceof ImageShapeNode) {
            var n = e.getChildren().size();
            if (this.wrapRoomInfo(t, e), this.buildings.push(t), n > 0) for (var o = e.getChildren(), a = 0; n > a; a++) {
              var s = o.get(a);
              t.children.push(this.dfs2DNodes(s))
            }
          } else e instanceof TargetFlagNode ? (t = this.pointsFlagInfo(t, e), this.targets.push(t)) : this.equipments.push(t);
          return e.visited = !1,
          t
        }
      },
      dfs2DLayers: function(e) {
        var t = {};
        return t[FLOOR_NAME] = e.getClient(FLOOR_NAME),
        t[FLOOR_HEIGHT] = e.getClient(FLOOR_HEIGHT),
        t[FLOOR_VISIBLE] = e.getClient(FLOOR_VISIBLE),
        t[FLOOR_REF] = e.getClient(FLOOR_REF),
        t[FLOOR_LAYER] = e.getClient(FLOOR_LAYER),
        t
      },
      getBasicInfo: function(e) {
        var t = e.getClient(GID);
        t && !s(this.roomAssembles, t) && this.buildingAssembles(t);
        var i = e.getClient(OID),
        n = ModelUtils.covertTo3DPosition(e),
        o = {
          id: e.getId(),
          oid: i
        };
        o[GID] = t,
        o[SPACE_POSITION] = [n.x, n.y, n.z],
        o[SPACE_POS_Y] = e.getClient(SPACE_POS_Y),
        o[SPACE_ROTATION] = e.getClient(SPACE_ROTATION),
        o[PRIMITIVE_NAME] = e.getClient(PRIMITIVE_NAME),
        o[FLOOR_NAME] = e.getClient(FLOOR_NAME),
        o[FLOOR_HEIGHT] = e.getClient(FLOOR_HEIGHT),
        o[BID] = e.getClient(BID),
        o[ANGLE] = e.getAngle();
        var a = e.getClient(DESIGN_SCALE);
        a && (a /= 100, o[SPACE_SCALE] = [a, a, a]);
        var r = e.getClient("animation");
        r && "" != r && (o.animation = r);
        var l = e.getClient(CUSTOM_PROPS);
        if (l) {
          for (var d in l) {
            var h = l[d];
            o[h] = e.getClient(h)
          }
          o.customProps = l
        }
        var c = e.getClient(PropertyConsts.LAYERID);
        return c && (o.layerId = c),
        o
      },
      pointsFlagInfo: function(e, t) {
        e = {};
        var i = t.getLocation();
        return e.x = i.x,
        e.y = t.getClient(SPACE_POS_Y),
        e.z = i.y,
        e.visible = t.isShowPoint(),
        e.type = t.getType(),
        e
      },
      wrapPipeInfo: function(e, t) {
        e.dshape = this.getDShapeOfImageShapedNode(t),
        t instanceof RoundPipeShapeNode && (e.className = "RoundPipeShapeNode"),
        e.repeat = t.getClient("repeat"),
        e[IMAGE_SRC] = t.getClient(IMAGE_SRC),
        e.pointPositions = t.getClient("pointPositions"),
        e.startCap = t.getClient("startCap"),
        e.endCap = t.getClient("endCap"),
        e.startCapSize = t.getClient("startCapSize"),
        e.endCapSize = t.getClient("endCapSize"),
        e.radius = t.getClient("radius"),
        e.segments = t.getClient("segments"),
        e.positionY = t.getClient("positionY")
      },
      wrapFloorInfo: function(e, t) {
        e.dshape = this.getDShapeOfImageShapedNode(t),
        e[IMAGE_SRC] = t.getClient(IMAGE_SRC),
        e.repeat = t.getClient("repeat"),
        e.size = t.getClient("size");
        var i = t.getClient("hostNodeId");
        i && "" != i && (e.hostNodeId = i),
        e[TRA_PAR] = t.getClient(TRA_PAR),
        e[OPA] = t.getClient(OPA)
      },
      wrapRoomInfo: function(e, t) {
        var i = modelManager.getModelNode(e[GID]);
        e.dshape = this.getDShapeOfImageShapedNode(t),
        e.children = [];
        var n = t.getClient(USE_TEXTURE);
        e[USE_TEXTURE] = !0 === n ? !0 : !1;
        var o = t.getClient(WALL_SIZE),
        a = !0;
        if (o) {
          var s = this._modellib.getValue(i, WALL_SIZE);
          s && o.x == s.x && o.y == s.y && o.z == s.z && (a = !1)
        }
        a && (e[WALL_SIZE] = [o.x, o.y, o.z], a = !1);
        var r = t.getClient(WALL_CLOSED); ! 1 === r && (e[WALL_CLOSED] = !1),
        e[POLE_IMAGE_PATH] = t.getClient(POLE_IMAGE_PATH),
        e[OUTFRAME_IMAGE_PATH] = t.getClient(OUTFRAME_IMAGE_PATH),
        e[WALL_INNER_PATH] = t.getClient(WALL_INNER_PATH),
        e[WALL_OUTER_PATH] = t.getClient(WALL_OUTER_PATH),
        e[IS_INNER_WALL] = t instanceof InnerWallShapeNode;
        var l = t.getClient(OID);
        l && "" != l && (e[OID] = l);
        t.getClient(TRA_PAR),
        t.getClient(OPA);
        e[TRA_PAR] = t.getClient(TRA_PAR),
        e[OPA] = t.getClient(OPA)
      },
      getDShapeOfImageShapedNode: function(e) {
        for (var t = e.getPoints(), i = [], n = t.size(), o = 0; n > o; o++) {
          var a = t.get(o);
          i = i.concat([a.x, 0, a.y])
        }
        return i
      },
      buildingAssembles: function(e) {
        var t = this.getModelNode(e);
        if (t) if (t.children && t.children.length > 0) {
          this.roomAssembles.push(t);
          for (var i = 0; i < t.children.length; i++) {
            var n = t.children[i].id;
            this.buildingAssembles(n)
          }
        } else if (!s(this.roomPrimitives, t.id) && (this.roomPrimitives.push(t), "mono.ComboNode" === t.className && t.combos)) for (var o = t.combos,
        i = 0; i < o.length; i++) this.buildingAssembles(o[i].id)
      },
      getBlockInfo: function(e) {
        info = this.getBasicInfo(e),
        e instanceof Window ? info[BTYPE] = "window": e instanceof Door ? info[BTYPE] = "door": e instanceof Cutoff && (info[BTYPE] = "cutoff");
        this.getModelNode(info[GID]);
        info[BELONG_ID] = e.getClient(BELONG_ID),
        info[IMAGE_SRC] = e.getClient(IMAGE_SRC);
        var t = e.getClient(SPACE_SIZE);
        return info[SPACE_POSITION][1] = e.getClient(SPACE_POS_Y),
        info[SPACE_SIZE] = t ? [t.x, t.y, t.z] : [e.getClient(SIZE_LENGTH), e.getClient(SIZE_HEIGHT), e.getClient(SIZE_DEPTH)],
        info[BLOCK_OFFSET] = e.getClient(BLOCK_OFFSET),
        info[SPE_STR] = e.getClient(SPE_STR),
        info[TRA_PAR] = e.getClient(TRA_PAR),
        info[OPA] = e.getClient(OPA),
        console.log(info),
        info
      },
      organizeComponentsDrawing: function(e) {
        var t = (this.serializeComponentsInfo(e), {
          primitives: this.primitivesCache,
          assembles: this.assembleCache
        });
        return console.log(t),
        this.disposeComponents(e.getNodes().toArray(), e.getBillboards().toArray()),
        t
      },
      exportComponentToTemplate: function(e, t, i, n, o, a, s, r, l, d, h) {
        var c = n;
        return c ? this.loadResource !== TYPE_CLOUD || o ? void this.organizeAssembles(e, c, null, t, i, o, a, s, r, l, d, h) : (alert("Template category is required"), !1) : (alert("Template name is required"), !1)
      },
      serializeComponentsInfo: function(e, t, i, n) {
        for (var o = e.getNodes().toArray(), a = e.getBillboards().toArray(), s = 0; s < o.length; s++) {
          var r = o[s];
          r.getClient(PropertyConsts.COMPONENTFLOOR || r instanceof mono.Floor) || this.serialize3DDate(r, o, a, e)
        }
        for (var l = this.assembleCache,
        d = 0; d < l.length; d++) {
          var h = l[d].boundingBox;
          if (h) {
            l[d].assembleSize = h.size();
            var c = ModelUtils.getCenterOfBoundingBox(h);
            c = {
              x: c.x,
              y: c.y,
              z: c.z
            },
            l[d].off = c
          }
          0 != d && delete l[d].boundingBox
        }
        for (var s = 0; s < a.length; s++) if (!a[s].visited) {
          var g = {};
          this.getInfoOfBillboard(g, a[s]),
          this.primitivesCache.push(g),
          this.roots.push(a[s]),
          this.nodesMap[a[s].getId()] = a[s]
        }
        var m = null;
        if (this.roots.length > 1 || 1 == this.roots.length && 0 == this.assembleCache.length) {
          var u = Utils.generateAssembleId(i);
          m = new modellib.Assemble(u);
          for (var s = 0; s < this.roots.length; s++) {
            var r = this.roots[s],
            p = null;
            p = r.assembleID ? {
              id: r.assembleID
            }: {
              id: this.roots[s].getId()
            },
            r.oid && (p.oid = r.oid),
            this.wrapAnimation(p, r),
            this.wrapCustomProps(p, r),
            m && m.addChild(p)
          }
          var f = mono.Utils.getBoundingBox(this.roots, !0);
          m.assembleSize = f.size();
          var c = ModelUtils.getCenterOfBoundingBox(f);
          c = {
            x: c.x,
            y: c.y,
            z: c.z
          },
          m.off = c,
          m.ishost = !0,
          t && (m.templateName = t),
          this.assembleCache.push(m)
        } else {
          var v = ModelUtils.indexInArray(this.assembleCache, this.roots[0].assembleID);
          m = this.assembleCache[v];
          var u = Utils.generateAssembleId(i);
          this.roots[0].assembleID = u,
          t && (m.templateName = t),
          m.id = u,
          m.ishost = !0
        }
        if (m && m.children.length > 0) {
          m.scaleValue = comScaleValue,
          m.isEntity = n;
          for (var y = m.off,
          C = !1,
          s = 0; s < m.children.length; s++) {
            var p = m.children[s];
            p.ishost && (C = !0)
          }
          for (var s = 0; s < m.children.length; s++) {
            var p = m.children[s];
            C ? p.ishost && this.setChildPosition(p, y) : this.setChildPosition(p, y)
          }
        }
        return this.assembleCache.length > 0 && delete this.assembleCache[0].boundingBox,
        m
      },
      setChildPosition: function(e, t) {
        var i = e.id;
        i.startsWith("assemble") && (i = i.substring("assemble".length, i.length));
        var n = this.nodesMap[i].getPosition();
        e.pos = {
          x: n.x - t.x,
          y: n.y - t.y,
          z: n.z - t.z
        }
      },
      organizeAssembles: function(e, t, i, n, o, a, s, r, l, d, h, c) {
        console.log(o);
        var g = this.serializeComponentsInfo(e, t, null, d);
        if (this.loadResource === TYPE_CLOUD) {
          for (var m, u = 0; u < this.assembleCache.length; u++) this.assembleCache[u].ishost && (h && c && (this.assembleCache[u].id = c), m = this.assembleCache[u].id, d && (this.assembleCache[u].isEntity = !0));
          var p = {
            primitives: this.primitivesCache,
            assembles: this.assembleCache
          },
          f = JSON.stringify(p);
          console.log(f);
          var v;
          v = h ? {
            module: "templates",
            method: "update",
            arguments: {
              id: s,
              name: t,
              data: f,
              category: a,
              method: "Component",
              gid: m,
              icon: n,
              author: r,
              tags: l,
              preview: o
            }
          }: {
            module: "templates",
            method: "add",
            arguments: {
              name: t,
              data: f,
              category: a,
              method: "Component",
              scope: 0,
              gid: m,
              icon: n,
              author: r,
              tags: l,
              preview: o
            }
          };
          var y = function() {
            if (1 === arguments.length) {
              var e = JSON.parse(arguments[0]);
              if (e.error) return void alert(e.error);
              alert("Models have been export to the cloud library.")
            }
          };
          require(MONO_URL, v, y, this)
        } else {
          for (var u = 0; u < this.primitivesCache.length; u++) this.sharePrimitive("Private Templates", "Component", this.primitivesCache[u], !1);
          g && (this.shareAssemble("Private Templates", "Component", g, t, n), delete g.off);
          for (var C = this.assembleCache,
          S = 0; u < C.length; S++) C[S].ishost && d && (C[S].isEntity = !0),
          modelManager.shareAssemble("Private Templates", "Component", C[S], t, n);
          alert("Models have been export to the local library.")
        }
        console.log("primitives ext lib:\n" + localStorage.getItem(LIB_PRIMITIVES)),
        console.log(localStorage.getItem(LIB_PRIMITIVES).length),
        console.log("assemble ext lib:\n" + localStorage.getItem(LIB_ASSEMBLES)),
        this.disposeComponents(e.getNodes().toArray(), e.getBillboards().toArray())
      },
      loadComponentTemplateFromContents: function(e, t, i, n) {
        var o, a = JSON.parse(t);
        if (a.primitives && a.assembles || a.primitivesCache && a.assembleCache) {
          this.loadSharedPrimitive(a.primitives || a.primitivesCache),
          this.loadSharedAssemble(a.assembles || a.assembleCache);
          var s = this.getTemplateGID(a.assembles || a.assembleCache);
          s && (o = this.create3DElementsFromModelNode(e, s, n)),
          i && o && o.setParent(i)
        }
        return o
      },
      getTemplateGID: function(e) {
        var t;
        if (e) for (var i = 0; i < e.length; i++) if (e[i].ishost || e[i].templateName) {
          t = e[i].id;
          break
        }
        return t
      },
      loadComponentTemplateFromURL: function(e, t, i, n, o) {
        var a = this;
        this.loadFile(t,
        function(t) {
          if (t) {
            var s = a.loadComponentTemplateFromContents(e, t, i, !1);
            o && o.call(n, s)
          }
        })
      },
      loadComponentTemplate: function(e, t, i, n, o) {
        if (this.loadResource !== TYPE_CLOUD) return this.create3DElementsFromModelNode(e, t, i);
        var a = {
          module: "templates",
          method: "get",
          arguments: {
            id: t
          }
        },
        s = function() {
          var t = JSON.parse(arguments[0]);
          if (t.error) return void alert(t.error);
          var a = t.value;
          if (a) {
            var s = JSON.parse(a.data);
            s.primitives || s.assembles ? (this.loadSharedPrimitive(s.primitives), this.loadSharedAssemble(s.assembles)) : (this.loadSharedPrimitive(s.primitivesCache), this.loadSharedAssemble(s.assembleCache));
            var r = this.create3DElementsFromModelNode(e, a.gid, i, a.version);
            o && o.call(n, r)
          }
        };
        require(MONO_URL, a, s, this)
      },
      create3DElementsFromModelNode: function(e, t, i) {
        var n, o = !i,
        a = this.getModelNode(t);
        if (a || (a = this._modellib.getModelNodeByTemplateName(t)), a) {
          var s = ModelFactory.getModelFromModelNode(this._modellib, a);
          if (s instanceof modelimp.ModelImp) {
            var r = s.get3DObjects(o),
            l = parseFloat(s.scaleValue) / parseFloat(e.scaleValue || 1);
            if (e) for (var d = 0; d < r.length; d++) Utils.scale3DElement(r[d], l),
            e.add(r[d]);
            2 != r.length || i || r[0] instanceof mono.Cube && (r[0].setSelectable(s.mainNode.isSelectable()), r[0].setEditable(s.mainNode.isEditable()), e.remove(s.mainNode, !0), s.mainNode = r[0]),
            s.mainNode ? n = s.mainNode: s.rootNodes && 1 == s.rootNodes.length && (n = s.rootNodes[0])
          }
        }
        return n
      },
      getHostNodeAssembleSize: function(e) {
        var t, i = this.getModelNode(e);
        if (i || (i = this._modellib.getModelNodeByTemplateName(e)), i) {
          var n = ModelFactory.getModelFromModelNode(this._modellib, i);
          n && (t = n.assembleSize),
          n instanceof modelimp.ModelImp && n.mainNode && n.mainNode.getClient("assembleSize") && (t = n.mainNode.getClient("assembleSize"))
        }
        return t
      },
      loadTemplatesAssembleSize: function(e, t, i) {
        if (this.loadResource !== TYPE_CLOUD) return this.getHostNodeAssembleSize(e);
        var n = {
          module: "templates",
          method: "get",
          arguments: {
            id: e
          }
        },
        o = function() {
          var e = JSON.parse(arguments[0]);
          if (e.error) return void alert(e.error);
          var n = e.value;
          if (n) {
            var o = JSON.parse(n.data);
            this.loadSharedPrimitive(o.primitives),
            this.loadSharedAssemble(o.assembles);
            var a = this.getHostNodeAssembleSize(n.gid);
            i && i.call(t, a)
          }
        };
        require(MONO_URL, n, o, this)
      },
      disposeComponents: function(e, t) {
        this.nodesMap = {},
        this.assembleCache = [],
        this.primitives = [],
        this.primitivesCache = [],
        this.roots = [];
        for (var i = 0; i < e.length; i++) delete e[i].visited,
        delete e[i].assembleID;
        for (var i = 0; i < t.length; i++) delete t[i].visited
      },
      serialize3DDate: function(e, t, i, n) {
        if (!e.visited) {
          if (e.visited = !0, !ModelUtils.containsInArray(t, e.getId(), "_id") && !ModelUtils.containsInArray(i, e.getId(), "_id")) return;
          e.getParent() || this.roots.push(e);
          var o = this.pushPrimitive(e, n);
          if (this.nodesMap[e.getId()] = e, e.getChildren().size() > 0) {
            var a, s = e.getChildren(),
            r = this.createAssembleID(e.getId()),
            l = ModelUtils.indexInArray(this.assembleCache, r);
            a = l >= 0 ? this.assembleCache[l] : new modellib.Assemble(r);
            var d = {
              id: o.id,
              oid: e.getClient(OID)
            };
            this.wrapAnimation(d, e),
            this.wrapCustomProps(d, e),
            a.addChild(d),
            e.assembleID = a.id;
            var h = mono.Utils.getBoundingBox([e], !0);
            a.boundingBox = h,
            a.setHost(e.getId()),
            ModelUtils.containsInArray(this.assembleCache, a.id) || this.assembleCache.push(a);
            for (var c = 0; c < s._as.length; c++) {
              var g = s._as[c];
              if (this.serialize3DDate(g, t, i, n), g.getChildren()._as.length <= 0) {
                var d = {
                  id: g.getId(),
                  pos: g.getPosition(),
                  oid: g.getClient(OID)
                };
                this.wrapAnimation(d, g),
                this.wrapCustomProps(d, g),
                a.addChild(d)
              } else {
                var m = this.createAssembleID(g.getId()),
                d = {
                  id: m,
                  pos: g.getPosition(),
                  oid: g.getClient(OID)
                };
                this.wrapAnimation(d, g),
                this.wrapCustomProps(d, g),
                a.addChild(d)
              }
            }
          }
        }
      },
      pushPrimitive: function(e) {
        var t = this.getModelInfo(e);
        return this.primitivesCache.push(t),
        t
      },
      getCommonInfo: function(e) {
        var t = {};
        return t.id = e.getId(),
        e.getScale() && (t.scale = e.getScale()),
        e.getPosition() && (t.pos = e.getPosition()),
        e.getRotation() && (t.rot = e.getRotation()),
        e.getGroupId() && (t.groupid = e.getGroupId()),
        t
      },
      getStyleInfo: function(e, t) {
        t.styleMap[M_AMBIENT] && (e.ambient = t.getStyle(M_AMBIENT)),
        t.styleMap[M_COLOR] && (e.color = t.getStyle(M_COLOR)),
        t.styleMap[M_MAP_SRC] && (e.dt = t.getStyle(M_MAP_SRC)),
        t.styleMap[M_TRANSPARENT] && (e.transparent = t.getStyle(M_TRANSPARENT)),
        t.styleMap[M_TYPE] && (e.types = t.getStyle(M_TYPE)),
        t.styleMap[M_VISIBLE] && (e.visible = t.getStyle(M_VISIBLE)),
        t.styleMap[M_OPACITY] && (e.opacity = t.getStyle(M_OPACITY)),
        t.styleMap[M_TEXTURE_FLIPX] && (e.flipX = t.getStyle(M_TEXTURE_FLIPX)),
        t.styleMap[M_TEXTURE_FLIPY] && (e.flipY = t.getStyle(M_TEXTURE_FLIPY)),
        t.styleMap[M_SPECULARSTRENGTH] && (e.specularStrength = t.getStyle(M_SPECULARSTRENGTH)),
        t.styleMap[M_POLYGONOFFSET] && (e.polygonOffset = t.getStyle(M_POLYGONOFFSET)),
        t.styleMap[M_POLYGONOFFSETFACTOR] && (e.polygonOffsetFactor = t.getStyle(M_POLYGONOFFSETFACTOR)),
        t.styleMap[M_POLYGONOFFSETUNITS] && (e.polygonOffsetUnits = t.getStyle(M_POLYGONOFFSETUNITS));
        var i = t.getStyle(M_MAP_REPEAT);
        if (e.repeat = [], i instanceof Array) for (var n = 0; n < i.length; n++) e.repeat.push(i[n] ? [i[n].x, i[n].y] : [1, 1]);
        else e.repeat = [i.x, i.y]
      },
      getClientInfo: function(e, t) {
        t.getClient("object3dId") && (e.object3dId = t.getClient("object3dId")),
        t.getClient("scaleValue") && (e.scaleValue = t.getClient("scaleValue")),
        Utils.isNotNull(t.getClient("mainVisible")) && (e.mainVisible = t.getClient("mainVisible")),
        t.getClient(OID) && (e.oid = t.getClient(OID)),
        t.getClient("animationGroup") && (e.animationGroup = t.getClient("animationGroup"))
      },
      getModelInfo: function(e) {
        var t = this.getCommonInfo(e);
        return this.getObject3DInfo(t, e),
        this.getStyleInfo(t, e),
        this.getClientInfo(t, e),
        t
      },
      getObject3DInfo: function(e, t) {
        return t instanceof mono.Cube ? this.getInfoOfCube(e, t) : t instanceof mono.Sphere ? this.getInfoOfSphere(e, t) : t instanceof mono.Cylinder ? this.getInfoOfCylinder(e, t) : t instanceof mono.Torus ? this.getInfoOfTorus(e, t) : t instanceof mono.PathNode ? this.getInfoOfPathNode(e, t) : t instanceof mono.TextNode ? this.getInfoOfTextNode(e, t) : t instanceof mono.ComboNode ? this.getInfoOfComboNode(e, t) : t instanceof mono.LatheNode ? this.getInfoOfLatheNode(e, t) : t instanceof mono.Billboard ? this.getInfoOfBillboard(e, t) : t instanceof mono.Entity ? this.getInfoOfEntity(e, t) : e
      },
      getInfoOfCube: function(e, t) {
        e.size = {
          x: t.width,
          y: t.height,
          z: t.depth
        },
        e.className = "mono.Cube";
        for (var i = 0; 6 > i; i++) t.getClient("face" + i) && (e["face" + i] = t.getClient("face" + i));
        var n = (t.material, t.getWrapMode());
        return n && (e.wrapMode = n),
        e
      },
      getInfoOfSphere: function(e, t) {
        var i = 2 * t.radius;
        e.size = {
          x: i,
          y: i,
          z: i
        };
        t.material;
        return e.className = "mono.Sphere",
        e
      },
      getInfoOfBillboard: function(e, t) {
        return e.id = t.getId(),
        e.scale = {
          x: t.getScale().x,
          y: t.getScale().y,
          z: t.getScale().z
        },
        e.className = "mono.Billboard",
        e.dt = t.getStyle(M_MAP_SRC),
        e.alignment = t.getStyle(M_ALIGNMENT),
        e.transparent = t.getStyle(M_TRANSPARENT),
        e.opacity = t.getStyle(M_OPACITY),
        e.pos = {
          x: t.getPosition().x,
          y: t.getPosition().y,
          z: t.getPosition().z
        },
        e[OID] = t.getClient(OID),
        e
      },
      getInfoOfCylinder: function(e, t) {
        var i = t.radiusTop,
        n = t.radiusBottom,
        o = t.height;
        e.size = {
          x: i,
          y: o,
          z: n
        };
        t.material;
        return e.className = "mono.Cylinder",
        e.radialSegments = t.segmentsR,
        e.openTop = t.openTop,
        e.openBottom = t.openBottom,
        e
      },
      getInfoOfTorus: function(e, t) {
        e[SHAPE_TYPE] = "mono.Torus",
        e.radialSegments = t.segmentsR,
        e.radius = t.radius,
        e.tube = t.tube,
        e.tubularSegments = t.segmentsT,
        e.arc = t.arc;
        var i = t.radius + t.tube;
        return e[SPACE_SIZE] = {
          x: i,
          y: i,
          z: i
        },
        e
      },
      getInfoOfPathNode: function(e, t) {
        return e[SHAPE_TYPE] = "mono.PathNode",
        e.radius = t.radius,
        e.path = t.getPath().toArray(),
        e.segments = t.segments,
        e.segmentsR = t.segmentsR,
        e.startCap = t.startCap,
        e.endCap = t.endCap,
        e.startCapSize = t.startCapSize,
        e.endCapSize = t.endCapSize,
        e.segmentsCap = t.segmentsCap,
        e
      },
      getInfoOfTextNode: function(e, t) {
        return e[SHAPE_TYPE] = "mono.TextNode",
        e.text = t.text,
        e.textSize = t.size,
        e.height = t.height,
        e.weight = t.weight,
        e.style = t.style,
        e.curveSegments = t.curveSegments,
        e.bevelEnabled = t.bevelEnabled,
        e
      },
      getInfoOfComboNode: function(e, t) {
        var i = [];
        if (e[SHAPE_TYPE] = "mono.ComboNode", e.operators = t.getOperators(), t.getCombos()) for (var n = t.getCombos(), o = 0; o < n.length; o++) {
          var a = this.pushPrimitive(n[o]);
          i.push({
            id: a.id
          })
        }
        return e.combos = i,
        e.centralized = t.isCentralized(),
        e
      },
      getInfoOfLatheNode: function(e, t) {
        return e[SHAPE_TYPE] = "mono.LatheNode",
        e[PATH] = t.getPath().toArray(),
        e[SEGMENTSH] = t.getSegmentsH(),
        e[SEGMENTSR] = t.getSegmentsR(),
        e[ARC] = t.getArc(),
        e[START_CLOSED] = t.isStartClosed(),
        e[END_CLOSED] = t.isEndClosed(),
        e
      },
      getInfoOfEntity: function(e, t) {
        return e[SHAPE_TYPE] = "mono.Entity",
        e[VERTICES] = t.getVertices(),
        e[FACES] = t.getFaces(),
        e[UVS] = t.getUvs(),
        e
      },
      createAssembleID: function(e) {
        return "assemble" + e
      },
      wrapAnimation: function(e, t) {
        var i = t.getClient("animation");
        i && "" != i && (e.animation = i)
      },
      wrapCustomProps: function(e, t) {
        var i = t.getClient(CUSTOM_PROPS),
        n = PropertyConsts.CUSTOM_PROPS,
        o = !1,
        a = !0;
        if (i) for (var s in i) {
          if (!n[s]) {
            a = !1;
            break
          }
          if (i[s] != n[s]) {
            a = !1;
            break
          }
        }
        if (a) {
          var r;
          for (var l in i) t.getClient(i[l]) && (o = !0)
        }
        if (o && i) {
          var r;
          for (var l in i) r = i[l],
          e[r] = t.getClient(r);
          e.customProps = i
        }
      }
    }),
    ModelUtils = {};
    var e;
    ModelUtils.setDefaultModelManager = function(t) {
      e = t
    };
    var t = (180 / Math.PI, Math.PI / 180),
    i = function(e) {
      return e * t
    },
    n = function(e) {
      return e ? !0 : !1
    };
    require = function(e, t, i, n, a) {
      o(e, t, i, n, a)
    };
    var o = function(e, t, i, o, a) {
      if (n(e) || i("error: url error, " + e), !navigator.onLine) return void alert("NETWORK CONNECT ERROR");
      var s = Utils.createProgressBar(40, 50),
      r = new FormData,
      l = t.module;
      l && (e += "/" + l);
      var d = t.method;
      d && (e += "/" + d);
      var h = t.arguments;
      if (h) for (var c in h) r.append(c, h[c]);
      var g = new XMLHttpRequest;
      g.open("POST", e, !0),
      g.withCredentials = !0,
      g.timeout = 15e4;
      var m;
      g.ontimeout = function() {
        s && s.parentNode && s.parentNode.removeChild(s),
        m && m.parentNode && m.parentNode.removeChild(m),
        alert("request timeout")
      },
      setTimeout(function() {
        if ((4 != g.readyState || 200 != g.status) && !a) {
          m = Utils.addMask("progressBars"),
          m.style.zIndex = 1001,
          s.style.zIndex = 1002;
          var e = m.offsetWidth,
          t = m.offsetHeight;
          s.style.left = e / 2 - 20 + "px",
          s.style.top = t / 2 - 25 + "px",
          document.body.appendChild(s)
        }
      },
      1e3);
      var u = function(e) {
        i && i.call(this.scope, e)
      };
      u.scope = o,
      g.onreadystatechange = function() {
        if (navigator.onLine || (s && s.parentNode && s.parentNode.removeChild(s), m && m.parentNode && m.parentNode.removeChild(m), alert("NETWORK CONNECT ERROR")), 404 == g.status && (s && s.parentNode && s.parentNode.removeChild(s), m && m.parentNode && m.parentNode.removeChild(m)), 4 == g.readyState && 200 == g.status) {
          if (i) {
            var e = JSON.parse(g.responseText);
            e.error ? "Login First" == e.error ? document.location.href = "login.html": alert(e.error) : i.call(o, g.responseText)
          }
          s && s.parentNode && s.parentNode.removeChild(s),
          m && m.parentNode && m.parentNode.removeChild(m)
        }
      },
      g.send(r)
    },
    a = function(e, t) {
      for (var i = 0; i < e.length; i++) if (t == e[i].id) return e[i];
      return null
    };
    ModelUtils.containsInArray = function(e, t, i) {
      return ModelUtils.indexInArray(e, t, i) >= 0 ? !0 : !1
    },
    ModelUtils.indexInArray = function(e, t, i) {
      i || (i = "id");
      for (var n = 0; n < e.length; n++) if (t == e[n][i]) return n;
      return - 1
    };
    var s = function(e, t) {
      if (e && e instanceof Array) for (var i = 0; i < e.length; i++) {
        var n = e[i];
        if (n && n.id == t) return ! 0
      }
      return ! 1
    };
    ModelUtils.covertTo3DPosition = function(e) {
      var t = e.getCenterLocation(),
      i = {};
      i.x = t.x;
      var n = e.getClient("size");
      return n && (i.y = n.y / 2),
      i.z = t.y,
      i
    },
    ModelUtils.isEquals = function(e, t) {
      return e ? e.x == t.x && e.y == t.y && e.z == t.z: t ? !1 : !0
    },
    ModelUtils.containsID = function(e, t) {
      for (var i = 0; i < e.length; i++) if (t == e[i].id) return ! 0;
      return ! 1
    },
    ModelUtils.removeChild = function(e, t) {
      for (var i, n = 0; n < e.length; n++) t == e[n].id && (i = e[n]);
      if (i) {
        var o = e.indexOf(i);
        o > -1 && e.splice(o, 1)
      }
    },
    ModelUtils.copyProperties = function(e, t, i) {
      for (var n in t) n != i && (e[n] = t[n])
    },
    ModelUtils.copyNeedProperties = function(e, t) {
      for (var i in t) e[i] ? e[i] != t[i] && (e[i] = t[i]) : e[i] = t[i]
    },
    ModelUtils.mergeBoundingBox = function(e, t, i) {
      e || (e = new mono.BoundingBox),
      t || (t = new mono.BoundingBox);
      var n = (t.max.x - t.min.x) / 2,
      o = (t.max.y - t.min.y) / 2,
      a = (t.max.z - t.min.z) / 2,
      s = i.x + n,
      r = i.y + o,
      l = i.z + a,
      d = i.x - n,
      h = i.y - o,
      c = i.z - a,
      g = {
        x: e.max.x > s ? e.max.x: s,
        y: e.max.y > r ? e.max.y: r,
        z: e.max.z > l ? e.max.z: l
      },
      m = {
        x: e.min.x < d ? e.min.x: d,
        y: e.min.y < h ? e.min.y: h,
        z: e.min.z < c ? e.min.z: c
      };
      return new mono.BoundingBox(m, g)
    },
    ModelUtils.getCenterOfBoundingBox = function(e) {
      return {
        x: (e.max.x + e.min.x) / 2,
        y: (e.max.y + e.min.y) / 2,
        z: (e.max.z + e.min.z) / 2
      }
    },
    modelimp.ModelImp = function() {
      modelimp.ModelImp.superClass.constructor.apply(this)
    },
    twaver.Util.ext("modelimp.ModelImp", Object, {
      parse: function(e) {
        this._modelnode = e
      },
      getContents: function() {
        return this._contents
      },
      get3DObjects: function() {
        return default3DShape
      },
      get2DObjects: function() {
        return defautl2DShape
      },
      getValue: function(e, t) {
        if (!e) return null;
        var i = e[t];
        return (void 0 === i || null === i) && 3 == arguments.length && (i = arguments[2]),
        i
      }
    }),
    modelimp.AssembleModel = function() {
      modelimp.AssembleModel.superClass.constructor.apply(this),
      this._contents = [],
      this.hostModelNode = null,
      this.mainNode = null,
      this.version
    },
    twaver.Util.ext("modelimp.AssembleModel", modelimp.ModelImp, {
      appendChild: function(e) {
        this._contents.push(e)
      },
      get3DObjects: function(e) {
        for (var t = [], i = 0; i < this._contents.length; i++) {
          var n = this._contents[i],
          o = this._contents[i].get3DObjects(this.version);
          if (e && (this.ishost || this.templateName)) {
            var a = this.getValue(this, "assembleSize");
            this.mainNode = new mono.Cube(a.x, a.y, a.z),
            this.mainNode.setClient("mainVisible", !1),
            this.mainNode.setStyle("m.transparent", !0),
            this.mainNode.setStyle("m.opacity", .001)
          }
          n.ishost && (this.hostModelNode = o[0], this.pos && this.hostModelNode.setPosition(this.pos.x, this.pos.y, this.pos.z)),
          t = t.concat(o)
        }
        if (!e && this.mainNode && (this.mainNode = void 0), this.hostModelNode) for (var i = 0; i < t.length; i++) this.hostModelNode != t[i] && (t[i].getParent() || t[i].setParent(this.hostModelNode));
        if (this.mainNode) {
          t = t.concat(this.mainNode);
          for (var i = 0; i < t.length; i++) this.mainNode != t[i] && (t[i].getParent() || t[i].setParent(this.mainNode))
        }
        this.rootNodes = [];
        for (var i = 0; i < t.length; i++) t[i].getParent() || this.rootNodes.push(t[i]);
        return t
      },
      get2DObjects: function(e) {
        for (var t = [], i = 0; i < this._contents.length; i++) {
          var n = this._contents[i],
          o = this._contents[i].get2DObjects();
          if (e && (this.ishost || this.templateName)) {
            var a = this.getValue(this, "assembleSize");
            this.mainNode = new PrimitiveNode,
            this.mainNode.setClient("mainVisible", !1),
            this.mainNode.setClient("assembleSize", a),
            this.mainNode.setClient("gid", this.id),
            this.isEntity && this.mainNode.setClient("isEntity", !0)
          }
          n.ishost && (this.hostModelNode = o[0]),
          t = t.concat(o)
        }
        if (!e && this.mainNode && (this.mainNode = void 0), this.hostModelNode) {
          var s = (this.getValue(this, "rot"), this.getValue(this, "pos"));
          s && (this.hostModelNode.setCenterLocation({
            x: s.x,
            y: s.y
          }), this.hostModelNode.setClient("position", s));
          var r = this.getValue(this, "scaleValue");
          r && this.hostModelNode.setClient("scaleValue", r);
          for (var l = this.hostModelNode.getCenterLocation(), i = 0; i < t.length; i++) if (this.hostModelNode != t[i]) {
            var d = t[i].getCenterLocation();
            t[i].getHost() || (t[i].setCenterLocation({
              x: l.x + d.x,
              y: l.y + d.y
            }), t[i].setHost(this.hostModelNode), t[i].setParent(this.hostModelNode))
          }
        }
        if (this.mainNode) {
          t = t.concat(this.mainNode);
          for (var l = this.mainNode.getClient("off"), i = 0; i < t.length; i++) this.mainNode != t[i] && (t[i].getParent() || (t[i].setParent(this.mainNode), t[i].setHost(this.mainNode)))
        }
        return t
      }
    }),
    modelimp.PrimitiveModel = function() {
      modelimp.PrimitiveModel.superClass.constructor.apply(this),
      this.databox = new mono.DataBox
    },
    twaver.Util.ext("modelimp.PrimitiveModel", modelimp.ModelImp, {
      getContents: function() {
        return this._contents
      },
      get3DObjects: function(e) {
        var t = [];
        if (e) {
          var i = {};
          for (var n in this) {
            var o = this[n];
            "function" == typeof o && o.constructor == Function || o instanceof mono.DataBox || (console.log(n, ":", this[n] + ">>>>>>>"), i[n] = this[n])
          }
          this.databox.clear();
          var a = new mono.SerializationSettings;
          a.isDataBoxSerializable = !1;
          var s = new mono.JsonSerializer(this.databox, a),
          r = s.serialize(),
          l = JSON.parse(r);
          l.datas.push(i),
          s.deserialize(JSON.stringify(l)),
          t.push(this.dataBox.getDataAt(0))
        } else t.push(GeometryTranslater.get3DGeometryFromModelImp(this));
        return t
      },
      get2DObjects: function() {
        var e = [],
        t = new PrimitiveNode,
        i = this.getValue(this, "className", "mono.Cube");
        t.setClient("className", i),
        this.setBasicInfo(t);
        var n = {},
        o = this.getValue(this, "radialSegments");
        o && (n.radialSegments = o),
        this.radius && (n.radius = this.radius),
        this.tube && (n.tube = this.tube),
        this.tubularSegments && (n.tubularSegments = this.tubularSegments),
        this.arc && (n.arc = this.arc);
        var a = this.getValue(this, "alignment");
        a && (n.alignment = a);
        var s = this.getValue(this, "mainVisible");
        return Utils.isNotNull(s) && (n.mainVisible = s),
        "mono.Cube" === i ? this.setCubeInfo(n) : "mono.PathNode" === i ? this.setPathNodeInfo(n) : "mono.TextNode" === i ? this.setTextNodeInfo(n) : "mono.ComboNode" === i ? this.setComboNodeInfo(n) : "mono.LatheNode" === i ? this.setLatheNodeInfo(n) : "mono.Cylinder" === i && this.setCylinderInfo(n),
        t.setClient("other", n),
        e.push(t),
        e
      },
      setBasicInfo: function(e) {
        var t = this.getValue(this, "selectable");
        e.setClient("selectable", t);
        var i = this.getValue(this, "editable");
        e.setClient("editable", i);
        var n = this.getValue(this, "size");
        n && e.setClient("size", n);
        var o = this.getValue(this, "scale");
        o && e.setClient("scale", o);
        var a = this.getValue(this, "dt");
        a && e.setClient("texture", a);
        var s = this.getValue(this, "rot");
        s && e.setClient("rot", s);
        var r = this.getValue(this, "scaleValue");
        r && e.setClient("scaleValue", r);
        var l = this.getValue(this, "transparent");
        l && e.setClient("transparent", l);
        var d = this.getValue(this, "repeat");
        d && e.setClient("repeat", d);
        var h = this.getValue(this, "types");
        h && e.setClient("types", h);
        var c = this.getValue(this, "ov");
        c && (e.setImage(Utils.Path + c), Utils.registerImage(Utils.Path + c, null, null,
        function(t, i) {
          e.setSize(t, i)
        }));
        var g = this.getValue(this, "oid");
        g && e.setClient(OID, g);
        var m = this.getValue(this, "id");
        m || (m = this.pid),
        e.setClient(GID, m);
        var u = this.getValue(this, "visible");
        e.setClient("visible", u),
        e.setClient("opacity", this.getValue(this, "opacity"));
        var p = this.getValue(this, "pos");
        p && e.setClient("position", p),
        this.ishost && (e.ishost = !0);
        var f = this.getValue(this, "color");
        f && e.setClient("colors", f),
        e.setClient("ambient", this.getValue(this, "ambient"));
        var v = this.getValue(this, TAG_ANIMATION);
        v && e.setClient(TAG_ANIMATION, v);
        var y = this.getValue(this, "animationGroup");
        y && e.setClient("animationGroup", y),
        e.setClient("groupid", this.getValue(this, "groupid"));
        var C = this.getValue(this, CUSTOM_PROPS);
        if (C) {
          for (var S in C) e.setClient(C[S], this.getValue(this, C[S]));
          e.setClient(CUSTOM_PROPS, C)
        }
        var I = this.getValue(this, "flipX");
        I && e.setClient("flipX", I);
        var A = this.getValue(this, "flipY");
        A && e.setClient("flipY", A);
        var P = this.getValue(this, PropertyConsts.LAYERID);
        P && e.setClient(PropertyConsts.LAYERID, P);
        var E = this.getValue(this, "specularStrength");
        E && e.setClient("specularStrength", E);
        var w = this.getValue(this, "polygonOffset");
        Utils.isNotNull(w) && e.setClient("polygonOffset", w);
        var b = this.getValue(this, "polygonOffsetFactor");
        b && e.setClient("polygonOffsetFactor", b);
        var x = this.getValue(this, "polygonOffsetUnits");
        x && e.setClient("polygonOffsetUnits", x)
      },
      setCubeInfo: function(e) {
        this.wrapMode && (e.wrapMode = this.wrapMode)
      },
      setPathNodeInfo: function(e) {
        this.path && (e.path = this.path),
        this.segments && (e.segments = this.segments);
        var t = this.getValue(this, "segmentsR");
        t && (e.segmentsR = t),
        this.startCap && (e.startCap = this.startCap),
        this.endCap && (e.endCap = this.endCap),
        this.startCapSize && (e.startCapSize = this.startCapSize),
        this.endCapSize && (e.endCapSize = this.endCapSize),
        this.segmentsCap && (e.segmentsCap = this.segmentsCap)
      },
      setTextNodeInfo: function(e) {
        this.text && (e.text = this.text),
        this.textSize && (e.textSize = this.textSize),
        this.height && (e.height = this.height),
        this.weight && (e.weight = this.weight),
        this.style && (e.style = this.style),
        this.curveSegments && (e.curveSegments = this.curveSegments),
        this.bevelEnabled && (e.bevelEnabled = this.bevelEnabled)
      },
      setComboNodeInfo: function(e) {
        this.operators && (e.operators = this.operators),
        this.combos && (e.combos = this.combos),
        this.centralized && (e.centralized = this.centralized)
      },
      setLatheNodeInfo: function(e) {
        this[PATH] && (e.path = this[PATH]),
        this[SEGMENTSH] && (e.segmentsH = this[SEGMENTSH]),
        this[SEGMENTSR] && (e.segmentsR = this[SEGMENTSR]),
        this[ARC] && (e.arc = this[ARC]),
        void 0 !== this[START_CLOSED] && (e.startClosed = this[START_CLOSED]),
        void 0 !== this[END_CLOSED] && (e.endClosed = this[END_CLOSED])
      },
      setCylinderInfo: function(e) {
        Utils.isNotNull(this.openTop) && (e.openTop = this.openTop),
        Utils.isNotNull(this.openBottom) && (e.openBottom = this.openBottom)
      }
    }),
    modelimp.Normal = function() {
      modelimp.Normal.superClass.constructor.apply(this)
    },
    twaver.Util.ext("modelimp.Normal", modelimp.PrimitiveModel, {
      get2DObjects: function() {
        var e = [],
        t = getValue(this, "size"),
        n = {
          x: -t.x / 2,
          y: 0
        },
        o = {
          x: t.x / 2,
          y: 0
        },
        a = getValue(this, "rot");
        if (a) {
          var s = i(a.y),
          r = _twaver.math.createMatrix(s, 0, 0);
          n = r.transform(n),
          o = r.transform(o)
        }
        var l = new ImageShapeNode,
        d = [n, o];
        return l.setStyle("vector.outline.color", "#333333"),
        t && (l.setStyle("vector.outline.width", t.z), l.setClient("size", t)),
        l.setStyle("shapenode.closed", !1),
        l.setPoints(new twaver.List(d)),
        e.push(l),
        e
      }
    }),
    modelimp.FloorShapedModel = function() {
      modelimp.FloorShapedModel.superClass.constructor.apply(this)
    },
    twaver.Util.ext("modelimp.FloorShapedModel", modelimp.PrimitiveModel, {
      get3DObjects: function() {
        return default3DShape
      },
      get2DObjects: function() {
        var e = this.getValue(this, "dt"),
        t = this.getValue(this, OUTLINE_SHAPE),
        i = this.getValue(this, TRA_PAR),
        n = this.getValue(this, OPA),
        o = this.getValue(this, PropertyConsts.LAYERID);
        if (t.length % 3 == 0) {
          for (var a = [], s = 0; s < t.length; s += 3) a.push({
            x: t[s],
            y: t[s + 2]
          });
          var r = new FloorShapeNode;
          return r.setLayerId(bottomLayer.getId()),
          r.setPoints(new twaver.List(a)),
          r.setClient(SHAPE_TYPE, "FloorShapedModel"),
          r.setClient(GID, this.getID()),
          r.setClient(TRA_PAR, i),
          r.setClient(OPA, n),
          o && r.setClient(PropertyConsts.LAYERID, o),
          e && (Utils.registerImage(Utils.Path + e), r.setClient(IMAGE_SRC, Utils.Path + e)),
          [r]
        }
        return null
      }
    }),
    modelimp.RoomModel = function() {
      modelimp.RoomModel.superClass.constructor.apply(this)
    },
    twaver.Util.ext("modelimp.RoomModel", modelimp.FloorShapedModel, {
      get3DObjects: function() {
        return []
      },
      get2DObjects: function() {
        var e = this.getValue(this, OUTLINE_SHAPE),
        t = this.getValue(this, TRA_PAR),
        i = this.getValue(this, OPA),
        n = this.getValue(this, PropertyConsts.LAYERID);
        if (e.length % 3 == 0) {
          for (var o = [], a = 0; a < e.length; a += 3) o.push({
            x: e[a],
            y: e[a + 2]
          });
          var s = this.getValue(this, "size"),
          r = new ImageShapeNode;
          return s && r.setClient("size", {
            x: s.x,
            y: s.y,
            z: s.z
          }),
          r.setPoints(new twaver.List(o)),
          r.setClient("className", "RoomModel"),
          r.setClient("gid", this.getID()),
          r.setClient(TRA_PAR, t),
          r.setClient(OPA, i),
          n && r.setClient(PropertyConsts.LAYERID, n),
          [r]
        }
        return null
      }
    }),
    modelimp.BlockModel = function() {
      modelimp.BlockModel.superClass.constructor.apply(this)
    },
    twaver.Util.ext("modelimp.BlockModel", modelimp.PrimitiveModel, {
      get3DObjects: function() {
        return default3DShape
      },
      get2DObjects: function() {
        var e = this.getValue(this, "dt"),
        t = this.getValue(this, "dsize"),
        i = this.getValue(this, "pos"),
        n = this.getValue(this, "btype"),
        o = this.getValue(this, "specularStrength"),
        a = this.getValue(this, TRA_PAR),
        s = this.getValue(this, OPA),
        r = this.getValue(this, PropertyConsts.LAYERID),
        l = null;
        l = "window" == n ? new Window: "door" == n ? new Door: "cutoff" == n ? new Cutoff: new Block,
        l.setClient("length", t.x),
        l.setClient("height", t.y),
        o && l.setClient("specularStrength", o),
        i && l.setClient("positionY", i.y),
        e && l.setClient("picture", Utils.Path + e);
        var d = this.getValue(this, "rot");
        return d && l.setClient("angle", d.y),
        a && l.setClient(TRA_PAR, a),
        s && l.setClient(OPA, s),
        r && l.setClient(PropertyConsts.LAYERID, r),
        l.setClient("className", "BlockModel"),
        l.setClient("gid", this.getID()),
        [l]
      }
    }),
    ModelFactory = {},
    ModelFactory.models = {},
    ModelFactory.createModel = function(e) {
      var t = e;
      t && t.indexOf(".") < 0 && (t = "modelimp." + t);
      var i = _twaver.newInstance(t);
      return i
    },
    ModelFactory.getModelFromModelNode = function(e, t) {
      if (!t) return null;
      var i = t.pid;
      i || (i = t.id);
      var n = ModelFactory.models[i];
      return n || (n = ModelFactory.createModelFromModelNode(e, t), n && (ModelFactory.models[i] = n)),
      n
    },
    ModelFactory.createModelFromModelNode = function(e, t) {
      if (!t) return null;
      var i = e.getValue(t, "type"),
      n = e.getValue(t, "shape");
      if (modellib.ModelNode.TYPE_ASSEMBLE == i) {
        var o = null;
        if (n || (n = "AssembleModel"), o = ModelFactory.createModel(n)) {
          o.id = t.id,
          o.pid = t.pid;
          for (var a = e.getModelNodeContents(t), s = 0; s < a.length; s++) {
            var r = a[s],
            l = e.getModelNode(r.id),
            d = {},
            h = ModelFactory.getModelFromModelNode(e, l);
            ModelUtils.copyNeedProperties(d, h),
            ModelUtils.copyNeedProperties(d, r),
            o.appendChild(d)
          }
          ModelUtils.copyProperties(o, t)
        }
        return o
      }
      n || (n = "PrimitiveModel");
      var c = ModelFactory.createModel(n);
      return c.id = t.id,
      ModelUtils.copyProperties(c, t),
      c
    }
  } (),
  TargetFlagNode = function(e) {
    TargetFlagNode.superClass.constructor.apply(this, arguments),
    this.type = e || f.TARGET_POINT,
    this.type == f.ORIGINAL_POINT ? (this.setImage("images/originalpoint.png"), this.setClient(SPACE_POS_Y, 0)) : (this.setImage("images/targetpoint.png"), this.setClient(SPACE_POS_Y, 100)),
    this.showPoint = !0
  },
  twaver.Util.ext("TargetFlagNode", twaver.Follower, {
    isShowPoint: function() {
      return this.showPoint
    },
    setShowPoint: function(e) {
      this.showPoint = e
    },
    getType: function() {
      return this.type
    }
  });
  var f = {
    TARGET_POINT: "targetPoint",
    ORIGINAL_POINT: "originalPoint"
  };
  RoomInteraction = function(e) {
    RoomInteraction.superClass.constructor.call(this, e)
  },
  twaver.Util.ext("RoomInteraction", twaver.vector.interaction.BaseInteraction, {
    lastIndex: -1,
    lastElement: null,
    lastLogicalPoint: null,
    mouseDown: null,
    mouseMoved: null,
    horizontal: null,
    vertical: null,
    block: null,
    addPointCursor: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAF7SURBVHjatJSxasJQFIa/q0GQBOLWpVIXBbO6iA+gQ8HVxTkiuHXu1FcQJM59Ajd9ACdnBV0qvoCBBCFU0uXapjHGRPRfkns5/8e593J+UavVCKkJtIAGUJV7K2AOTIFZsHixWBAlJfBfAgZAr1+xNaPg8aJ+A7B1lfpyn6uP1roJWMAQ+CJGSgD6YZbtbrvoks/6/4oM3cPQPV6fXW2yU9/GG/0JeI+DZ+R3YJbtbqfknEGDymd9OiUHs2x35emIAzeBXrvoklSytie9F8GtfsXW4jqN6rxfsTX5yBfBDaPgkVbS04gDV0+vn0bSU732eHdXBlhtXSW1UXpWceD5cp9LDZaeeRx4OlrrzuEoEkMPR8ForTtyxC+CZ4A12amJwbLWCudG1EgP5ZhGjnSw08lOZbzRP4HhKYCEED4gfP/PJwLpFhdCLPe50/EtCf3NiWvgxLEZjspIcHBxq+4GliCS5HFqdmjth/ceNtI3dRy+PiHE2f7DOv4ZAHRil+NB+pB1AAAAAElFTkSuQmCC'),auto",
    setUp: function() {
      this.addListener("mousedown", "mousemove", "mouseup", "keydown", "dragover", "drop", "dblclick")
    },
    tearDown: function() {
      this.removeListener("mousedown", "mousemove", "mouseup", "keydown", "dragover", "drop", "dblclick")
    },
    handle_dblclick: function(e) {
      var t = -1,
      i = this.network.getElementAt(e);
      i instanceof ImageShapeNode && (t = twaver.Util.getPointIndex(i.getPoints(), this.network.getLogicalPoint(e), this.network.getEditPointSize()));
      var n = new RoomDialog(i, t);
      n.show()
    },
    handle_mousedown: function(e) {
      if (this.mouseDown = !0, this.lastLogicalPoint = this.network.getLogicalPoint(e), this.lastLogicalPoint) {
        var t = this.network.getElementAt(e);
        if (t instanceof ImageShapeNode && !lock2d) if (resize = this.network.getElementUI(t).isPointOnBorderLine(this.lastLogicalPoint), null !== resize) this.lastElement = t,
        this.network.isMovable = function() {
          return ! 1
        };
        else {
          var i = t.getPointIndex(this.network.getLogicalPoint(e));
          i >= 0 && (this.lastIndex = i, this.lastElement = t, this.network.isMovable = function() {
            return ! 1
          })
        }
        t instanceof Block && (this.block = t)
      }
    },
    handleClicked: function(e, t, i) {
      e.fireInteractionEvent(i ? {
        kind: "clickElement",
        event: t,
        element: i
      }: {
        kind: "clickBackground",
        event: t
      })
    },
    handle_mousemove: function(e) {
      if (!lock2d) if (this._setNetworkCreateShapeNodeCursor(), this.mouseDown) {
        var t = this.network.getLogicalPoint(e);
        if (!t) return this.network.getView().scrollTop += 10,
        void(this.network.getView().scrollLeft += 10);
        if (offsetX = this.lastLogicalPoint ? t.x - this.lastLogicalPoint.x: 0, offsetY = this.lastLogicalPoint ? t.y - this.lastLogicalPoint.y: 0, this.lastIndex >= 0) {
          var i = this.lastElement.getPoints(),
          n = i.get(this.lastIndex),
          o = i.get(this.lastIndex === i.size() - 1 ? 0 : this.lastIndex + 1);
          this.network.enableSingleOrientationMove ? this.mouseMoved || (this.horizontal = n.x == o.x, this.vertical = !this.horizontal, this.mouseMoved = !0) : !this.mouseMoved && _twaver.isCtrlDown(e) && (this.horizontal = Math.abs(offsetX) >= Math.abs(offsetY), this.vertical = !this.horizontal, this.mouseMoved = !0),
          this.vertical || (n.x += offsetX, o.x += offsetX),
          this.horizontal || (n.y += offsetY, o.y += offsetY),
          this.lastElement.firePointsChange(),
          this.lastLogicalPoint = t
        }
        if (this.block) {
          var a = this.block.getClient("edgeIndex"),
          s = this.block.getClient("length"),
          r = this.block.getClient("offset"),
          i = this.block.getParent().getPoints(),
          n = i.get(a),
          o = i.get(a === i.size() - 1 ? 0 : a + 1),
          l = o.x - n.x,
          d = o.y - n.y,
          h = Math.abs(l) > Math.abs(d),
          c = h ? offsetX: offsetY,
          g = c;
          if (this.block.getClient("focusLeft")) h ? l > 0 && (g = -g) : (l >= 0 && 0 > d && (c = -c), l >= 0 && d > 0 && (g = -g), 0 > l && d > 0 && (c = -c, g = -g)),
          this.block.setClient("length", s - c),
          this.block.setClient("offset", r - g / Math.abs(h ? l: d) / 2);
          else if (this.block.getClient("focusRight")) h ? 0 > l && (g = -g) : (l >= 0 && 0 > d && (c = -c, g = -g), 0 > l && d > 0 && (c = -c), 0 > l && 0 > d && (g = -g)),
          this.block.setClient("length", s + c),
          this.block.setClient("offset", r + g / Math.abs(h ? l: d) / 2);
          else {
            var r = Math.abs(l) > Math.abs(d) ? (t.x - this.lastLogicalPoint.x) / l: (t.y - this.lastLogicalPoint.y) / d;
            this.block.setClient("offset", this.block.getClient("offset") + r)
          }
          this.lastLogicalPoint = t
        }
        null !== resize && this.lastElement && (0 === resize ? (this.lastElement.setLocation(this.lastElement.getX() + offsetX, this.lastElement.getY() + offsetY), this.lastElement.setSize(this.lastElement.getWidth() - offsetX, this.lastElement.getHeight() - offsetY)) : 1 === resize ? (this.lastElement.setLocation(this.lastElement.getX(), this.lastElement.getY() + offsetY), this.lastElement.setSize(this.lastElement.getWidth() + offsetX, this.lastElement.getHeight() - offsetY)) : 2 === resize ? this.lastElement.setSize(this.lastElement.getWidth() + offsetX, this.lastElement.getHeight() + offsetY) : 3 === resize && (this.lastElement.setLocation(this.lastElement.getX() + offsetX, this.lastElement.getY()), this.lastElement.setSize(this.lastElement.getWidth() - offsetX, this.lastElement.getHeight() + offsetY)), this.lastLogicalPoint = t)
      } else {
        var m = this.network.getElementAt(e),
        t = this.network.getLogicalPoint(e);
        if (this.lastElement && this.lastElement !== m && (this.lastElement instanceof ImageShapeNode && (this.lastElement.setClient("focusIndex", -1), this.network.getView().style.cursor = "default"), this.lastElement instanceof Block && (this.lastElement.setClient("focus", !1), this.lastElement.setClient("focusLeft", !1), this.lastElement.setClient("focusRight", !1), this.network.getView().style.cursor = "default"), this.lastElement = null), m instanceof ImageShapeNode) if (resize = this.network.getElementUI(m).isPointOnBorderLine(t), null !== resize) this.lastElement = m,
        this.network.getView().style.cursor = "move";
        else {
          var a = m.getPointIndex(t);
          m.setClient("focusIndex", a),
          a >= 0 ? (this.lastElement = m, this.network.getView().style.cursor = _twaver.isAltDown(e) ? this.addPointCursor: "move") : m.isPointOnPoints(t) || (this.network.getView().style.cursor = "default")
        } else m instanceof Block ? (m.setClient("focus", !0), this.network.getSelectionModel().contains(m) && _twaver.math.getDistance(t, m.getClient("leftPoint")) <= 10 ? (m.setClient("focusLeft", !0), m.setClient("focusRight", !1), this.network.getView().style.cursor = "move") : this.network.getSelectionModel().contains(m) && _twaver.math.getDistance(t, m.getClient("rightPoint")) <= 10 ? (m.setClient("focusLeft", !1), m.setClient("focusRight", !0), this.network.getView().style.cursor = "move") : (m.setClient("focusLeft", !1), m.setClient("focusRight", !1), this.network.getView().style.cursor = "default"), this.lastElement = m) : this.lastElement = null
      }
    },
    handle_mouseup: function() {
      this.mouseDown = !1,
      this.mouseMoved = !1,
      this.horizontal = !1,
      this.vertical = !1,
      this.lastIndex = -1,
      this.lastElement = null,
      this.lastLogicalPoint = null,
      this.block = null,
      this.resize = !1,
      this.network.getView().style.cursor = "default",
      lock2d || delete this.network.isMovable
    },
    handle_mousewheel: function(e) {
      if (!lock2d) {
        this.network.getSelectionModel().size() > 0 && (e.preventDefault(), e.stopPropagation());
        var t = !1,
        i = this;
        e.wheelDelta !== e.wheelDeltaX && (e.wheelDelta ? e.wheelDelta > 0 && (t = !0) : e.detail < 0 && (t = !0)),
        this.network.getSelectionModel().toSelection(function(e) {
          e instanceof PrimitiveNode && i._scaleElement(t, e)
        })
      }
    },
    handle_keydown: function(e) {
      if (!lock2d) {
        var t = !1;
        if (46 == e.keyCode) {
          if (this.network.getSelectionModel().getSelection().size() > 0) {
            var i = this.network.getSelectionModel().getSelection();
            if (1 == i.size() && this.network.getSelectionModel().getLastData() instanceof TargetFlagNode) return;
            if (confirm("Sure to Delete")) {
              var n = this.network.getElementBox(),
              o = new twaver.List;
              o.addAll(i),
              o.forEach(function(e) {
                e instanceof TargetFlagNode || n.remove(e)
              })
            }
          }
          t = !0
        }
        37 == e.keyCode && (this._moveSelectionElements("left"), t = !0),
        38 == e.keyCode && (this._moveSelectionElements("top"), t = !0),
        39 == e.keyCode && (this._moveSelectionElements("right"), t = !0),
        40 == e.keyCode && (this._moveSelectionElements("bottom"), t = !0),
        Utils.isCtrlDown(e) && (67 === e.keyCode && (this._copySelection(), t = !0), 86 === e.keyCode && (this._pasteSelection(), t = !0)),
        83 === e.keyCode && this._adsorptionSelectionElements(),
        t && (e.preventDefault(), e.stopPropagation())
      }
    },
    handle_dragover: function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = !1,
      e.dataTransfer.dropEffect = "copy";
      var t = this.network.getElementAt(e),
      i = this.network.getLogicalPoint(e);
      if (this.network.lastElement && this.network.lastElement !== t && (this.network.lastElement instanceof ImageShapeNode && this.network.lastElement.setClient("focusIndex", -1), this.network.lastElement = null), t instanceof ImageShapeNode) {
        var n = t.getPointIndex(i);
        t.setClient("focusIndex", n),
        n >= 0 && (this.network.lastElement = t)
      } else this.network.lastElement = null;
      return ! 1
    },
    getAllElementsAt: function(e) {
      var t = {
        x: e.x - 1,
        y: e.y - 1,
        width: 2,
        height: 2
      },
      i = this.network.getElementsAtRect(t, !0, null, !1);
      return i
    },
    findFirstFloorAt: function(e) {
      var t = this.getAllElementsAt(e);
      if (t) for (var i = 0; i < t.size(); i++) if (t.get(i) instanceof FloorShapeNode) return t.get(i)
    },
    handle_drop: function(e) {
      e.stopPropagation && e.stopPropagation(),
      e.preventDefault ? e.preventDefault() : e.returnValue = !1;
      var t = e.dataTransfer.getData("Text");
      if (!t) return ! 1;
      var i = JSON.parse(t);
      loadResource === TYPE_CLOUD && i.isTemplate && (i.loadFromCloud = !0, "Component" != i.method && (i.actionType = "loadTemplate"));
      var n = this.network.getElementAt(e);
      if (i.actionType)"loadTemplate" === i.actionType ? i.loadFromCloud ? (modelManager.loadTemplate(this.network.getElementBox(), i), roomTemplateId = i.id) : modelManager.loadTemplate(this.network.getElementBox(), i.id) : (type = "ImageShapeNode", "CreateFloorShapeNode" === i.actionType ? type = "FloorShapeNode": "CreateInnerWallShapeNode" === i.actionType ? type = "InnerWallShapeNode": "CreatePipeShapeNode" === i.actionType ? type = "PipeShapeNode": "CreateRoundPipeShapeNode" === i.actionType ? type = "RoundPipeShapeNode": "CreateRoomWithFloorShapeNode" === i.actionType && (type = function(t) {
        var i = new ImageShapeNode;
        return i instanceof twaver.ShapeNode && t && (i.setPoints(t), i.setClient("isHostNode", !0), i.setClient("decimalNumber", decimalNumber), i.setClient("transparent", !1), i.setClient("opacity", 1), i.setClient(PropertyConsts.LAYERID, PropertyConsts.Layer.WALL), 2 == t._as.length && (alert("Please draw more than two points!"), i.removeAt(0), i.removeAt(1), network.fireInteractionEvent({
          kind: "removePoint",
          event: e,
          element: this.shapeNode
        }))),
        i
      }), classType = window[type] ? window[type] : type, this._createShapeNodeInteractions(classType));
      else if (n && n instanceof ImageShapeNode) if (!i.embeded || n instanceof FloorShapeNode) if ("FloorShapedModel" != i.className || n.getClient(OID)) {
        var o = i.mtarget;
        if (o) {
          if ("Floor" === o) {
            var a = this.network.getLogicalPoint2(e),
            s = this.findFirstFloorAt(a);
            if (s && i.material) {
              var r = Utils.Path + i.material;
              Utils.registerImage(r, this.network),
              s.setClient(IMAGE_SRC, r)
            }
          }
          "Room" === o && n instanceof ImageShapeNode && this.handleRoomMaterial(n, i)
        } else i.embeded || this._createRoom(this.network, e, i)
      } else {
        var l = this._createElement(this.network, n.getCenterLocation(), i.id);
        l.setClient("hostNodeId", n.getId()),
        n.setClient(OID, n.getId())
      } else {
        var a = this.network.getLogicalPoint(e);
        n.setClient("focusIndex", -1);
        var d = n.getPointIndex(a);
        if (d >= 0) {
          var h = n.getPoints(),
          c = h.get(d),
          g = h.get(d === h.size() - 1 ? 0 : d + 1),
          m = g.x - c.x,
          u = g.y - c.y,
          p = Math.abs(m) > Math.abs(u) ? (a.x - c.x) / m: (a.y - c.y) / u;
          this._createPureElement(this.network, i,
          function(e) {
            e.setClient("edgeIndex", d),
            e.setParent(n),
            e.setClient("offset", p);
            var t = parseFloat("1m") / parseFloat(network._scaleUnitValue),
            i = e.getClient("length"),
            o = e.getStyle("vector.outline.width"),
            a = Math.abs(Math.log(t));
            o = t > 1 ? o / Math.pow(1.5, a) : o * Math.pow(1.5, a),
            e.setClient("length", i * t)
          })
        }
      } else {
        if ("BlockModel" == i.className && i.embeded) return ! 1;
        var o = i.mtarget;
        n || "Room" !== o ? this._createRoom(this.network, e, i) : this.handleRoomMaterial(null, i)
      }
      return this._setNetworkCreateShapeNodeCursor(),
      !1
    },
    handleRoomMaterial: function(e, t) {
      var i = !1;
      if (box2d.forEach(function(e) {
        var t = e;
        return t instanceof ImageShapeNode && !(t instanceof FloorShapeNode) ? (i = !0, !1) : void 0
      }), i) {
        var n = "Change Room Material",
        o = [];
        if (e || (n = "Change All Room Material", o = [{
          label: "Scope:",
          id: "cfloor",
          name: "scope",
          type: "radio",
          checked: !0,
          inner: "For current floor's images"
        },
        {
          label: "",
          id: "afloor",
          name: "scope",
          type: "radio",
          checked: !1,
          inner: "For all floors' images"
        }]), t.texture) var a = [{
          label: "Image:",
          id: "pic",
          value: Utils.Path + t.material
        },
        {
          label: "Usage:",
          id: "outside",
          name: "side",
          type: "radio",
          checked: !0,
          inner: "For all external faces (incudes all frame and pole faces)"
        },
        {
          label: "",
          id: "inside",
          name: "side",
          type: "radio",
          checked: !1,
          inner: "For all internal faces"
        }];
        else var a = [{
          label: "External Image:",
          id: "external",
          value: Utils.Path + t.outside
        },
        {
          label: "Internal Image:",
          id: "internal",
          value: Utils.Path + t.inside
        },
        {
          label: "Frame Image:",
          id: "frame",
          value: Utils.Path + t.frame
        }];
        a = o.concat(a),
        Utils.showInputDialog(a, n, !0, this.setRoomMaterial, this, [e, t.texture])
      }
    },
    setRoomMaterial: function(e, t, i) {
      var n = [];
      if (e ? n.push(e) : box2d.forEach(function(e) {
        var t = e;
        t instanceof ImageShapeNode && !(t instanceof FloorShapeNode) && (i.cfloor ? t.getClient("floorName") === floorPane.getCurrentFloorName() && n.push(t) : n.push(t))
      }), n.length > 0) for (var o = 0; o < n.length; o++) {
        var a = n[o];
        t ? (i.outside ? (a.setClient("wallOuterPic", i.pic), a.setClient("framePic", i.pic), a.setClient("poleTexture", i.pic)) : a.setClient("wallInnerPic", i.pic), a.setClient("useTexture", !0)) : (a.setClient("wallOuterPic", i.external), a.setClient("wallInnerPic", i.internal), a.setClient("framePic", i.frame), a.setClient("poleTexture", i.external), a.setClient("useTexture", !1));
        var s = a instanceof InnerWallShapeNode;
        s && (a.setClient("poleTexture", a.getClient("wallInnerPic")), a.setClient("wallOuterPic", a.getClient("wallInnerPic")))
      }
    },
    _createShapeNodeInteractions: function(e) {
      this.network.setInteractions([new MyCreateShapeNodeInteraction(this.network, e), new twaver.vector.interaction.DefaultInteraction(this.network)])
    },
    _createPureElement: function(e, t, i) {
      var n = t.id;
      a = modelManager.getModelNode(n);
      var o = modelManager.getModelLib();
      if (a) {
        var s = ModelFactory.getModelFromModelNode(o, a);
        if (s instanceof modelimp.ModelImp) for (var r = s.get2DObjects(), l = e.getElementBox(), d = 0; d < r.length; d++) l.add(r[d]),
        e.getSelectionModel().clearSelection(),
        e.getSelectionModel().setSelection(r[d]),
        i && i(r[d])
      }
    },
    _createRoom: function(e, t, i) {
      if ("squareRoomWithFloor" === i.id) {
        var n = this._createElement(e, e.getLogicalPoint(t), "floor02"),
        o = this._createElement(e, e.getLogicalPoint(t), "squareRoom");
        n.setClient("hostNodeId", o.getId()),
        o.setClient(OID, o.getId()),
        o.setClient("decimalNumber", decimalNumber)
      } else if ("LShapedRoomWithFloor" === i.id) {
        var n = this._createElement(e, e.getLogicalPoint(t), "floor03"),
        o = this._createElement(e, e.getLogicalPoint(t), "LShapedRoom");
        n.setClient("hostNodeId", o.getId()),
        o.setClient(OID, o.getId()),
        o.setClient("decimalNumber", decimalNumber)
      } else if ("SquareAddOnRoomWithFloor" === i.id) {
        var n = this._createElement(e, e.getLogicalPoint(t), "floor04"),
        o = this._createElement(e, e.getLogicalPoint(t), "SquareAddOnRoom");
        n.setClient("hostNodeId", o.getId()),
        o.setClient(OID, o.getId()),
        o.setClient("decimalNumber", decimalNumber)
      } else if ("AngledAddOnRoomWithFloor" === i.id) {
        var n = this._createElement(e, e.getLogicalPoint(t), "floor05"),
        o = this._createElement(e, e.getLogicalPoint(t), "AngledAddOnRoom");
        n.setClient("hostNodeId", o.getId()),
        o.setClient(OID, o.getId()),
        o.setClient("decimalNumber", decimalNumber)
      } else if ("RoomByPoints" === i.id) {
        var a = new RoomByPointsDialog(i, e, t);
        a.show()
      } else if (i.loadFromCloud) if (_twaver.isShiftDown(t)) Utils.showTemplateDialog(this, e, t, i);
      else var s = function(e) {
        processHost(e, t)
      },
      r = this._createElement(e, e.getLogicalPoint(t), i, s);
      else if (_twaver.isShiftDown(t)) Utils.showTemplateDialog(this, e, t, i.id);
      else {
        var r = this._createElement(e, e.getLogicalPoint(t), i.id);
        if (processHost(r, t), !i.id) return;
        i.id.indexOf("billboard") >= 0 ? r.setStyle("m.vertical", !0) : i.id.indexOf("pointlight") >= 0 ? "pointlight01" == i.id ? (r.setClient("lightColor", new mono.Color(16777215)), r.setClient("lightIntensity", 1)) : "pointlight02" == i.id && (r.setClient("lightColor", new mono.Color(16773335)), r.setClient("lightIntensity", 1)) : i.id.indexOf("spotlight") >= 0 && "spotlight01" == i.id && (r.setClient("lightColor", new mono.Color(14146559)), r.setClient("lightIntensity", 1), r.setClient("angle", Math.PI))
      }
    },
    _createElement: function(e, t, i, n, o, a) {
      if ("object" != typeof i) return this._createElementDeal(e, t, i, n);
      var s = i,
      r = {
        module: "templates",
        method: "get",
        arguments: {
          id: s.id
        }
      },
      l = function() {
        var i = JSON.parse(arguments[0]);
        if (i.error) return void alert(i.error);
        var s = i.value;
        if (s) {
          var r = JSON.parse(s.data);
          if (r) return r.primitives || r.assembles ? (modelManager.loadSharedPrimitive(r.primitives), modelManager.loadSharedAssemble(r.assembles)) : (modelManager.loadSharedPrimitive(r.primitivesCache), modelManager.loadSharedAssemble(r.assembleCache)),
          this._createElementDeal(e, t, s.gid, n, o, a)
        }
      };
      require(MONO_URL, r, l, this)
    },
    _createElementDeal: function(e, t, i, n, o, a) {
      var s = modelManager.getModelLib(),
      r = modelManager.getModelNode(i);
      if (r || (r = s.getModelNodeByTemplateName(i)), r) {
        var l = ModelFactory.getModelFromModelNode(s, r);
        if (l instanceof modelimp.ModelImp) {
          var d, h = l.get2DObjects(!0),
          c = e.getElementBox();
          h[0] && (l.mainNode ? (l.mainNode instanceof PrimitiveNode && l.mainNode.setName(l.templateName || l.id), d = l.mainNode, d.setClient(PropertyConsts.LAYERID, PropertyConsts.Layer.TEMPLATE)) : (h[0] instanceof PrimitiveNode && (h[0].setName(l.templateName), h[0].getClient(PropertyConsts.LAYERID) || h[0].setClient(PropertyConsts.LAYERID, PropertyConsts.Layer.TEMPLATE)), d = h[0]));
          for (var g = parseFloat(l.scaleValue || 1), m = 0; m < h.length; m++) c.add(h[m]),
          e.getSelectionModel().clearSelection(),
          e.getSelectionModel().setSelection(h[m]);
          l.mainNode && (e.getSelectionModel().clearSelection(), e.getSelectionModel().setSelection(l.mainNode)),
          "mono.Billboard" == r.className && h[0].setStyle("m.vertical", !0);
          var u = l.mainNode;
          u || (u = h[0]),
          u.scaleValue = r.scaleValue;
          var g = parseFloat(u.scaleValue || 1),
          p = u.getHeight(),
          f = u.getWidth();
          return u.setHeight(p * g),
          u.setWidth(f * g),
          u.setCenterLocation(t),
          n && n(u, o, a),
          u
        }
      }
    },
    _setNetworkCreateShapeNodeCursor: function() {
      var e = this;
      this.network.getInteractions().forEach(function(t) {
        t instanceof twaver.vector.interaction.CreateShapeNodeInteraction && (e.network.getView().style.cursor = "crosshair")
      })
    },
    _scaleElement: function(e, t) {
      if (t && t instanceof PrimitiveNode && this.network.isSelected(t)) {
        var i = t.getSize(),
        n = t.getClient("oscale"),
        o = t.getCenterLocation();
        if (e && 1e3 > n) {
          var a = Math.round(1.1 * n),
          s = 1.1 * i.width,
          r = 1.1 * i.height;
          a > 1e3 && (a = 1e3, s = i.width * (1e3 / n), r = i.height * (1e3 / n)),
          t.setSize(s, r),
          t.setClient("oscale", a)
        } else if (!e && n > 5) {
          var a = Math.round(n / 1.1),
          s = i.width / 1.1,
          r = i.height / 1.1;
          5 > a && (a = 5, s = i.width * (5 / n), r = i.height * (5 / n)),
          t.setSize(s, r),
          t.setClient("oscale", a)
        }
        t.setName(Utils.changeTwoDecimal(t.getClient("oscale")) + "%\nScroll to Scale"),
        t.setCenterLocation(o)
      }
    },
    _adsorptionSelectionElements: function() {
      var e = box2d.getSelectionModel().getSelection(),
      t = parseInt(localStorage.getItem(SNAPGRID)) || 10;
      e.size() > 0 && e.forEach(function(e) {
        var i = e.getPoints();
        i.forEach(function(e) {
          e.x = parseInt(e.x / t) * t + (e.x % t < t / 2 ? 0 : t),
          e.y = parseInt(e.y / t) * t + (e.y % t < t / 2 ? 0 : t)
        }),
        e.setPoints(i)
      })
    },
    _moveSelectionElements: function(e) {
      var t = box2d.getSelectionModel().getSelection();
      if (t.size() > 0) {
        var i = 0,
        n = 0;
        "left" === e && (i = -1),
        "right" === e && (i = 1),
        "top" === e && (n = -1),
        "bottom" === e && (n = 1),
        twaver.Util.moveElements(t, i, n, !1)
      }
    },
    _copySelection: function() {
      var e = box2d.getSelectionModel().getSelection(),
      t = e.toList();
      e.forEach(function(i) {
        box2d.forEach(function(n) { ! e.contains(n) && n.isDescendantOf(i) && t.add(n),
          n.getClient("hostNodeId") && i.getClient("oid") && n.getClient("hostNodeId") === i.getClient("oid") && t.add(n)
        })
      }),
      Utils.copyDatasToBoxAnchor(t, box2d)
    },
    _pasteSelection: function() {
      var e = floorPane.getCurrentFloorName(),
      t = Utils.pasteBoxAnchorToBox(box2d, e);
      if (t && t.length > 0) {
        box2d.getSelectionModel().clearSelection();
        for (var i in t) t[i] instanceof Block || t[i] instanceof FloorShapeNode && t[i].getClient("hostNodeId") || (box2d.getSelectionModel().appendSelection(t[i]), t[i].setX(t[i].getX() + 20), t[i].setY(t[i].getY() + 20))
      }
    }
  }),
  MonoEditInteraction = function(e) {
    MonoEditInteraction.superClass.constructor.call(this, e)
  },
  twaver.Util.ext("MonoEditInteraction", twaver.vector.interaction.EditInteraction, {
    deletePointCursor: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAGYSURBVHja1JS/SwJhGMc/r16ieXENRSBJQijo0OIS/gE1BK4tzorQVHNTU3OB2ByNDW21tTidtClY0A+nFvHojsCyt+UNTvMujSL6LHccz/fD8/Lc+4hsNssQa8A6kAPS6lsTqAHnwIW72DRNRqG53hPAFlAqpyw9M9tjKfoKwL2jrTa6odVKyygCVeAQuMMHzSXdKyatQj7uEAnKgaKM0SNj9NhYdPSzdnTn6NpYAHb95AH13ComrcJmwv4kdRMJSjYTNsWkVVCnw0+8BpTycYdxUbUllfUUr5dTlu7X6ajOyylLV0P2FOcysz0mRWVyfuL0x/QnQWXSXw3vxwkAzXtHmzioMk0/ca3RDU0sVpman/i80jLs574YW/rcF1Rahq2uuKf4AqietaNji1VtdXhvuAnGYjGAVr0TngsH5cryzAtTAe9OTx90jq6NY2DfNM3uV+IucFXvhPsntzMrUU2GEDCtSV7eBDdPU1w+Rtg25+16J3ygpL5LSHxnbXqtygGxlPJX/mPtOyEhhPyzjn/1Sv8v8fsAeL2I1faEYBkAAAAASUVORK5CYII'),auto",
    setUp: function() {
      MonoEditInteraction.superClass.setUp.apply(this, arguments),
      this.addListener("keydown", "keyup")
    },
    tearDown: function() {
      MonoEditInteraction.superClass.setUp.apply(this, arguments),
      this.removeListener("keydown", "keyup")
    },
    handle_keydown: function(e) {
      this.currentKeyEvent = e,
      this.showSnap = !0
    },
    handle_keyup: function() {
      this.currentKeyEvent = null,
      this.showSnap = !1
    },
    handle_mouseup: function(e) {
      if (this.isStart) {
        var t = _twaver.clone(this._endLogical);
        if (this.resizingRect) if (this.lazyMode) if (this.network.isResizeAnimate()) {
          var i = this,
          n = new twaver.animate.AnimateBounds(this.node, this.resizingRect,
          function() {
            i.network.fireInteractionEvent({
              kind: "lazyResizeEnd",
              event: e,
              element: i.node,
              resizeDirection: i.resizeDirection
            })
          });
          twaver.animate.AnimateManager.start(n)
        } else this.node.setLocation(this.resizingRect.x, this.resizingRect.y),
        this.node.setSize(this.resizingRect.width, this.resizingRect.height),
        this.network.fireInteractionEvent({
          kind: "lazyResizeEnd",
          event: e,
          element: this.node,
          resizeDirection: this.resizeDirection
        });
        else this.node.setLocation(this.resizingRect.x, this.resizingRect.y),
        this.node.setSize(this.resizingRect.width, this.resizingRect.height),
        this.network.fireInteractionEvent({
          kind: "liveResizeEnd",
          event: e,
          element: this.node,
          resizeDirection: this.resizeDirection
        });
        else if (this.shapeNode && this.pointIndex >= 0 && t) {
          var o = this.shapeNode.getPoints().get(this.pointIndex);
          if (this.horizontal && (t.y = o.y), this.vertical && (t.x = o.x), this.currentKeyEvent && 83 === this.currentKeyEvent.keyCode) {
            var a = parseInt(localStorage.getItem(SNAPGRID)) || 10;
            t.x = parseInt(t.x / a) * a + (t.x % a < a / 2 ? 0 : a),
            t.y = parseInt(t.y / a) * a + (t.y % a < a / 2 ? 0 : a)
          }
          this.shapeNode.setPoint(this.pointIndex, t),
          this.network.fireInteractionEvent({
            kind: "liveMovePointEnd",
            event: e,
            element: this.shapeNode,
            pointIndex: this.pointIndex
          })
        } else if (this.shapeLink && this.pointIndex >= 0 && t) {
          var o = this.shapeLink.getPoints().get(this.pointIndex);
          this.horizontal && (t.y = o.y),
          this.vertical && (t.x = o.x),
          this.shapeLink.setPoint(this.pointIndex, t),
          this.network.fireInteractionEvent({
            kind: "liveMovePointEnd",
            event: e,
            element: this.shapeLink,
            pointIndex: this.pointIndex
          })
        } else this.linkUI && t && (this.linkUI.setControlPoint(t), this.network.fireInteractionEvent({
          kind: "liveMovePointEnd",
          event: e,
          element: this.linkUI._element
        }))
      }
      this._handle_mouseup(e),
      this.clear()
    },
    _isEditingShapeNode: function(e, t) {
      if (this.node instanceof twaver.ShapeNode) {
        this.shapeNode = this.node;
        for (var i = this.shapeNode.getPoints(), n = 0, o = i.size(); o > n; n++) {
          var a = i.get(n);
          if (this._contains(e, a, this.editPointSize)) return _twaver.isAltDown(t) ? this._setCursor(this.deletePointCursor) : this._setCrossCursor(),
          this.pointIndex = n,
          !0
        }
        if (null != this.shapeNode.getPointIndex(e) && this.shapeNode.getPointIndex(e) >= 0) return ! 0
      }
      return this.pointIndex = -1,
      !1
    },
    handle_mousemove: function(e) {
      if (this.network.isValidEvent(e)) {
        if (this.isStartRotate && this.node) return this._handleRotateElement(e, this.node),
        void(this.network.isShowRotateScale() && this.repaint());
        if (this.isStart) {
          if (this.shapeNode && this.pointIndex >= 0) {
            this._handleMovingShapeNodePoint(e);
            var t = {},
            i = parseInt(localStorage.getItem(SNAPGRID)) || 10;
            if (this.currentKeyEvent && 83 === this.currentKeyEvent.keyCode) {
              var n = this.shapeNode.getPoints().get(this.pointIndex);
              t.x = parseInt(n.x / i) * i + (n.x % i < i / 2 ? 0 : i),
              t.y = parseInt(n.y / i) * i + (n.y % i < i / 2 ? 0 : i),
              (t.x != n.x || t.y != n.y) && this.repaint()
            }
            return
          }
          if (this.shapeLink && this.pointIndex >= 0) return void this._handleMovingShapeLinkPoint(e);
          if (this.node && this.resizeDirection) return void this._handleResizing(e);
          if (this.linkUI) return void this._handleMovingLinkControlPoint(e);
          var n = this.network.getLogicalPoint2(e);
          if (this.node && this.node instanceof twaver.ShapeNode && this.node.getPointIndex(n) && this.node.getPointIndex(n) >= 0) return void(this.network._dragToPan = !1)
        } else {
          var o = this.network.getElementAt(e);
          if (this.network.isSelectingElement() || this.network.isMovingElement() || 0 === this.network.getSelectionModel().size()) return void this.clear();
          var a = this.network.getElementUI(o);
          if (!a || !a.getEditAttachment()) return void this.clear();
          var n = this.network.getLogicalPoint2(e);
          if (o instanceof twaver.ShapeNode && (n = this.network.getLogicalPoint(e)), o instanceof twaver.Node) {
            if (this.node = o, this.node instanceof Block) return this.network._dragToPan = !1,
            void(this.isStart = !0);
            if (this._isEditingShapeNode(n, e) || this._isResizingNode(n)) return void this.network.setEditingElement(!0);
            if (this._isRotatingElement(n)) return this.network.setRotatingElement(!0),
            void this.network.setEditingElement(!0)
          } else if (o instanceof twaver.ShapeLink) {
            if (this.shapeLink = o, this._isEditingShapeLink(n)) return void this.network.setEditingElement(!0)
          } else if (a instanceof twaver.network.LinkUI && twaver.Link.isOrthogonalLink(a._element)) {
            this.linkUI = a;
            var s = this.linkUI.getControlPoint();
            return void(s && this._contains(n, s) && (this._setCrossCursor(), this.network.setEditingElement(!0)))
          }
          this.clear()
        }
      }
    },
    handle_mousedown: function(e) {
      if (0 === e.button) if (!_twaver.isAltDown(e) || this.network.isEditingElement()) {
        if (this.network.isEditingElement() && !this.isStart && !this.isStartRotate) if (this.node && this.resizeDirection) this.isStart = !0,
        this._handle_mousedown(e),
        this.network.fireInteractionEvent({
          kind: this.lazyMode ? "lazyResizeStart": "liveResizeStart",
          event: e,
          element: this.node,
          resizeDirection: this.resizeDirection
        });
        else if (this.shapeNode && this.pointIndex >= 0) {
          var t = this.shapeNode.getPoints()._as.length;
          _twaver.isAltDown(e) ? 2 == t ? confirm("You will delete the entire wall, Sure to Delete") && (this.shapeNode.removeAt(0), this.shapeNode.removeAt(1), this.network.fireInteractionEvent({
            kind: "removePoint",
            event: e,
            element: this.shapeNode
          })) : confirm("Sure to Delete") && (3 == t && this.shapeNode.setClient("shapenode.closed", !1), this.shapeNode.removeAt(this.pointIndex), this.network.fireInteractionEvent({
            kind: "removePoint",
            event: e,
            element: this.shapeNode
          })) : (this.isStart = !0, this._handle_mousedown(e), this.network.fireInteractionEvent({
            kind: "liveMovePointStart",
            event: e,
            element: this.shapeNode,
            pointIndex: this.pointIndex
          }))
        } else this.shapeLink && this.pointIndex >= 0 ? _twaver.isAltDown(e) ? (this.shapeLink.removeAt(this.pointIndex), this.network.fireInteractionEvent({
          kind: "removePoint",
          event: e,
          element: this.shapeLink
        })) : (this.isStart = !0, this._handle_mousedown(e), this.network.fireInteractionEvent({
          kind: "liveMovePointStart",
          event: e,
          element: this.shapeLink,
          pointIndex: this.pointIndex
        })) : this.linkUI ? (this.isStart = !0, this._handle_mousedown(e), this.network.fireInteractionEvent({
          kind: "liveMovePointStart",
          event: e,
          element: this.linkUI._element
        })) : this.shapeNode ? this.isStart = !0 : this.node && (this.node.getClient("className") && "mono.Billboard" == this.node.getClient("className") || (this.isStartRotate = !0, this._handle_mousedown(e)))
      } else {
        var i = this.network.getElementAt(e),
        n = this.network.getLogicalPoint(e);
        if (i instanceof twaver.ShapeNode) {
          var o = this.getPointIndex(i.getPoints(), n, !0);
          o > 0 && (this._handle_mousedown(e), this.pointIndex = o, this.shapeNode = i, i.addPoint(n, o), this._setCrossCursor(), this.network.setEditingElement(!0), this.isStart = !0, this.network.fireInteractionEvent({
            kind: "addPoint",
            event: e,
            element: i,
            pointIndex: o
          }), this.network.fireInteractionEvent({
            kind: "liveMovePointStart",
            event: e,
            element: i,
            pointIndex: o
          }))
        }
        if (i instanceof twaver.ShapeLink) {
          var a = new twaver.List(i.getPoints()),
          s = this.network.getElementUI(i);
          a.add(s.getFromPoint(), 0),
          a.add(s.getToPoint());
          var o = this.getPointIndex(a, n) - 1;
          o > 0 && (this._handle_mousedown(e), this.pointIndex = o, this.shapeLink = i, i.addPoint(n, o), this._setCrossCursor(), this.network.setEditingElement(!0), this.isStart = !0, this.network.fireInteractionEvent({
            kind: "addPoint",
            event: e,
            element: i,
            pointIndex: o
          }), this.network.fireInteractionEvent({
            kind: "liveMovePointStart",
            event: e,
            element: i,
            pointIndex: o
          }))
        }
      }
    },
    paint: function(e) {
      if (MonoEditInteraction.superClass.paint.apply(this, arguments), this.shapeNode) {
        var t = 10,
        i = new twaver.List,
        n = {},
        o = this.shapeNode.getPoints().size(),
        a = this;
        if (snapGrid = parseInt(localStorage.getItem(SNAPGRID)) || 10, this.shapeNode && this.pointIndex >= 0 && this.showSnap) {
          var s = this.shapeNode.getPoints(),
          r = s.get(this.pointIndex);
          if (!r) return;
          n.x = parseInt(r.x / snapGrid) * snapGrid + (r.x % snapGrid < snapGrid / 2 ? 0 : snapGrid),
          n.y = parseInt(r.y / snapGrid) * snapGrid + (r.y % snapGrid < snapGrid / 2 ? 0 : snapGrid);
          var l = this.pointIndex + 1 >= o ? this.pointIndex + 1 - o: this.pointIndex + 1,
          d = this.pointIndex - 1 < 0 ? this.pointIndex - 1 + o: this.pointIndex - 1;
          if (n.x && n.y) {
            this.img = new Image,
            i.add(s.get(l)),
            i.add(n),
            i.add(s.get(d));
            var h = "(" + n.x + "," + n.y + ")",
            c = _twaver.math.getRect(i),
            g = this.shapeNode.getClient("coordTextFont"),
            l = (i.get(0), n),
            d = i.get(1),
            m = _twaver.g.getTextSize(g, h);
            _twaver.math.grow(c, 3 * t + Math.max(m.width, m.height), 3 * t + Math.max(m.width, m.height));
            var u = e;
            u.fillStyle = "rgb(0,100,0)",
            u.strokeStyle = "#000000",
            u.beginPath(),
            u.arc(n.x, n.y, t, 0, 2 * Math.PI),
            u.fill(),
            u.stroke(),
            u.closePath(),
            u.strokeStyle = "rgb(0,100,0)";
            var p = new twaver.List(["moveto", "lineto", "lineto"]);
            u.beginPath(),
            _twaver.g.drawLinePoints(u, i, [5, 5], p),
            u.stroke(),
            u.closePath(),
            u.fillStyle = "rgba(0,100,0,0.5)",
            u.fillRect(n.x + t, n.y - m.height / 2, m.width, m.height),
            u.font = g,
            u.fillStyle = "#FFFFFF",
            u.textBaseline = "middle",
            u.fillText(h, n.x + t, n.y),
            u.strokeStyle = "rgb(0,100,0)",
            this.img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAYAAAARIY8tAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAANVSURBVHjapJVfaFtVHMc/9+Q2yU1jZq3RplLFaYu6LQrTTh/0QRixdP6BwRAftuGDlDvfBB9UrChDUQZDWNYHQZxvA/9b2UXxT3ErCI51tUxszexcGtusWxuSnCT35h4fmibNFtOsft/Oj3M+38Pv/H6/oymlaKZ4zBBADNgD7AB6gCCQAZLASeA48J1pyWtgWjODeMx4HHi/O9S25Y4OL53tHtq9Al1o2GVF3nZJZx0uLNmkMvZvwIumJX9a1yAeMzTgja4b9Nd7wz5uv9HLepq9UuLn8zkFDJuWfOs/DSopOdIX9g1FIwY+XaNVSdtl8p8C0+niQdOSr11jEI8ZHuBYX9j33EM9gbrD2ZLLdLpIctlG2i5Gm+C2TW30hn0EvaK6r+QoxmdzXFy2nzYt+WWdwdGB4GRfp771wavgZ1OSyVRhHjgEfA2kgG5gEHhpW8R/azRiVPfPZWx+mMleAHqrBiODIQWgXFftvDughYM6AKeTknPzhTFgt2nJSw3e6xbgm2jE2L4t4q/Gx//Kkbhc2icAjh94WFEx0oTQvp3Ju3MZm18v5jk3X7CAgUZwANOSC8CTZ1My67i1bPR0eAF2i69e2bVw+fwUrltGlZ1VE/FjIl/+faH4BfCUacl8s8c1LZkCPvxzsVSNdQY8AP0iOTEWXk2T5tFr9Ss8JyppKbVYRKfSWae6MNoEQJcApCYEYg0c+BjYZVqyzP+UAHYCy2tix4C9G2A9Em6vXbLgKIAFMTSaOQncUym/j4B9AEOjmZbJ8ZjRBezf3Fnr+MWcA/BLXR+MDIbYAHwTYEUjxo66Mp3NkVgs7dfWm6brwDuAE1u6/P0PdNcaLZWx+X4mOwfcKTYKPzoQvA8Y23oVvFRWTF8qAhwwLVnSNwIfGQxFNSHG77pJD9y/Bu64iok5yd9L9tumJT9fraLrhgMTQCCx5NqnZld6sOgoTiclf6SLh4BXW/pwGsCfAT4DUMpF0wSA0xMSutcD0+nim6Ylh1v+0RrDFW55pf+E8ICmgVJX3LLzjmnJdxs1WquKVu5UB/d4/cn+vcNTjeDXa3AQ+ABYGSuaRvDm7qXtz76cOPPp4UebjYqWNDSaKQMvAO8BZd3nn7r3ieePnPnk8GPNzv07AK/5bsWWYLHkAAAAAElFTkSuQmCC",
            this.img.onload = function() {
              u.drawImage(a.img, n.x - 3 * t, n.y - 3 * t, 2 * t, 2 * t)
            }
          }
        }
      }
    },
    clear: function() {
      MonoEditInteraction.superClass.clear.apply(this, arguments),
      this.network._dragToPan = !0,
      this.network.setRotatePointSize(twaver.Defaults.NETWORK_ROTATE_POINT_SIZE)
    }
  }),
  mono.AniUtil = {},
  mono.AniUtil.Easing = TWEEN.Easing,
  mono.AniUtil.DefaultEasing = mono.AniUtil.Easing.Linear.None,
  mono.AniUtil.AllEasings = {
    "Linear.None": mono.AniUtil.Easing.Linear.None,
    "Quadratic.In": mono.AniUtil.Easing.Quadratic.In,
    "Quadratic.Out": mono.AniUtil.Easing.Quadratic.Out,
    "Quadratic.InOut": mono.AniUtil.Easing.Quadratic.InOut,
    "Cubic.In": mono.AniUtil.Easing.Cubic.In,
    "Cubic.Out": mono.AniUtil.Easing.Cubic.Out,
    "Cubic.InOut": mono.AniUtil.Easing.Cubic.InOut,
    "Quartic.In": mono.AniUtil.Easing.Quartic.In,
    "Quartic.Out": mono.AniUtil.Easing.Quartic.Out,
    "Quartic.InOut": mono.AniUtil.Easing.Quartic.InOut,
    "Quintic.In": mono.AniUtil.Easing.Quintic.In,
    "Quintic.Out": mono.AniUtil.Easing.Quintic.Out,
    "Quintic.InOut": mono.AniUtil.Easing.Quintic.InOut,
    "Sinusoidal.In": mono.AniUtil.Easing.Sinusoidal.In,
    "Sinusoidal.Out": mono.AniUtil.Easing.Sinusoidal.Out,
    "Sinusoidal.InOut": mono.AniUtil.Easing.Sinusoidal.InOut,
    "Exponential.In": mono.AniUtil.Easing.Exponential.In,
    "Exponential.Out": mono.AniUtil.Easing.Exponential.Out,
    "Exponential.InOut": mono.AniUtil.Easing.Exponential.InOut,
    "Circular.In": mono.AniUtil.Easing.Circular.In,
    "Circular.Out": mono.AniUtil.Easing.Circular.Out,
    "Circular.InOut": mono.AniUtil.Easing.Circular.InOut,
    "Elastic.In": mono.AniUtil.Easing.Elastic.In,
    "Elastic.Out": mono.AniUtil.Easing.Elastic.Out,
    "Elastic.InOut": mono.AniUtil.Easing.Elastic.InOut,
    "Back.In": mono.AniUtil.Easing.Back.In,
    "Back.Out": mono.AniUtil.Easing.Back.Out,
    "Back.InOut": mono.AniUtil.Easing.Back.InOut,
    "Bounce.In": mono.AniUtil.Easing.Bounce.In,
    "Bounce.Out": mono.AniUtil.Easing.Bounce.Out,
    "Bounce.InOut": mono.AniUtil.Easing.Bounce.InOut
  },
  mono.AniUtil.AllEasingNames = [];
  for (name in mono.AniUtil.AllEasings) mono.AniUtil.AllEasingNames.push(name);
  mono.AniUtil.getAllActions = function() {
    return ["", "rotation", "move", "scale"]
  },
  mono.AniUtil.getAllAnchors = function() {
    return ["", "left", "right", "top", "bottom", "front", "back", "center-x", "center-y", "center-z"]
  },
  mono.AniUtil.getAllValues = function() {
    return [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.25, 1.5, 1.75, 2, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, -30, -60, -90, -120, -150, -180, -210, -240, -270, -300, -330, -360]
  },
  mono.AniUtil.oldAnimationTypes = ["LeftMove", "RightMove", "FrontMove", "BackMove", "LeftRotationClockwise90", "LeftRotationAnticlockwise90", "LeftRotationClockwise120", "LeftRotationAnticlockwise120", "CenterRotationClockwise270", "CenterRotationAnticlockwise270"],
  mono.AniUtil.animate = function(e) {
    requestAnimationFrame(mono.AniUtil.animate),
    TWEEN.update(e)
  },
  mono.AniUtil.animate(),
  mono.AniUtil.createAxisByName = function(e) {
    var t = new mono.Vec3(0, 1, 0);
    return "y" === e && (t = new mono.Vec3(0, 1, 0)),
    "x" === e && (t = new mono.Vec3(1, 0, 0)),
    "z" === e && (t = new mono.Vec3(0, 0, 1)),
    t
  },
  mono.AniUtil.createAnchorPosition = function(e, t) {
    var i = e.getBoundingBox(),
    n = i.size(),
    o = 0,
    a = 0,
    s = 0;
    return "center" === t.substring(0, 6) || ("left" === t ? o = -n.x / 2 : "right" === t ? o = n.x / 2 : "front" === t ? s = n.z / 2 : "back" === t ? s = -n.z / 2 : "top" === t ? a = n.y / 2 : "bottom" === t && (a = -n.y / 2)),
    new mono.Vec3(o, a, s)
  },
  mono.AniUtil.playRotate = function(e, t, i, n, o, a, s, r) {
    var l = mono.AniUtil.createAxisByName(t),
    d = mono.AniUtil.createAnchorPosition(e, i);
    if (!e.__tween) {
      var h = 0,
      c = e.__animated ? n: -n;
      return e.__tweenLastRotation = h,
      e.__tweenDestRotation = c,
      e.__animated = !e.__animated,
      o = o || 1e3,
      a = a || 0,
      s = s || mono.AniUtil.DefaultEasing,
      e.__tween = new TWEEN.Tween({
        v: h
      }).to({
        v: c
      },
      o).easing(s).delay(a).onUpdate(function() {
        e.rotateFromAxis(l, d, this.v - e.__tweenLastRotation),
        e.__tweenLastRotation = this.v
      }).onComplete(function() {
        delete e.__tween,
        delete e.__tweenLastRotation,
        delete e.__tweenDestRotation,
        r && r.apply(e)
      }).start(),
      e.__tween
    }
  },
  mono.AniUtil.playScale = function(e, t, i, n, o, a, s) {
    if (!e.__tween) {
      var r = 0,
      l = i || 1;
      1 > i && (r = 1, l = i || 0),
      n = n || 1e3,
      o = o || 0,
      a = a || mono.AniUtil.DefaultEasing,
      e.__fromPosition = e.getPosition().clone(),
      e.__fromScale = e.getScale().clone();
      var d, h;
      "top" === t || "bottom" === t ? (d = e.getHeight() / 2, h = "y", "bottom" === t && (d = -1 * d)) : "front" === t || "back" === t ? (d = e.getDepth() / 2, h = "z", "back" === t && (d = -1 * d)) : "left" === t || "right" === t ? (d = e.getWidth() / 2, h = "x", "left" === t && (d = -1 * d)) : "center-x" === t ? h = "x": "center-y" === t ? h = "y": "center-z" === t ? h = "z": (d = e.getHeight() / 2, h = "y");
      var c = e.getPosition()[h] - d * e.getScale()[h],
      g = e.getPosition()[h] / e.getScale()[h] * i;
      return 1 > i && (c = e.getPosition()[h], g = e.getPosition()[h] / e.getScale()[h] * i - d * e.getScale()[h]),
      console.log(c, g),
      e.__tween = new TWEEN.Tween({
        scale: r,
        v: c
      }).to({
        scale: l,
        v: g
      },
      n).easing(a).delay(o).onUpdate(function() {
        if (d) {
          var t = e.__fromPosition.clone();
          t[h] = this.v,
          e.setPosition(t)
        }
        var i = e.__fromScale.clone();
        i[h] = this.scale,
        e.setScale(i)
      }).onComplete(function() {
        delete e.__tween,
        delete e.__fromPosition,
        delete e.__fromScale,
        s && s.apply(e)
      }).start(),
      e.__tween
    }
  },
  mono.AniUtil.playMove = function(e, t, i, n, o, a, s) {
    var r; ("left" === t || "right" === t) && (r = "x", "left" === t && (i = -1 * i)),
    ("top" === t || "bottom" === t) && (r = "y", "bottom" === t && (i = -1 * i)),
    ("front" === t || "back" === t) && (r = "z", "back" === t && (i = -1 * i));
    var l = e.getBoundingBox(),
    d = l.max.x - l.min.x,
    h = l.max.y - l.min.y,
    c = l.max.z - l.min.z;
    if ("x" === r && (i *= d), "y" === r && (i *= h), "z" === r && (i *= c), !e.__tween) {
      var g = e.getPosition()[r],
      m = e.__animated ? e.getPosition()[r] - i: e.getPosition()[r] + i;
      return e.__animated = !e.__animated,
      e.__fromPosition = e.getPosition().clone(),
      n = n || 1e3,
      o = o || 0,
      a = a || mono.AniUtil.DefaultEasing,
      e.__tween = new TWEEN.Tween({
        v: g
      }).to({
        v: m
      },
      n).easing(a).delay(o).onUpdate(function() {
        var t = e.__fromPosition.clone();
        t[r] = this.v,
        e.setPosition(t)
      }).onComplete(function() {
        delete e.__tween,
        s && s.apply(e)
      }).start(),
      e.__tween
    }
  },
  mono.AniUtil.getAxisByAnchor = function(e) {
    if ("top" === e || "bottom" === e) return "x";
    if ("left" === e || "right" === e) return "y";
    if ("front" === e || "back" === e) return "y";
    if ("center" === e.substring(0, 6)) {
      var t = e.split("-");
      return t[1]
    }
  },
  mono.AniUtil.playAnimation = function(e, t, i, n, o, a) {
    if (e && t) {
      if ( - 1 != mono.AniUtil.oldAnimationTypes.indexOf(t)) switch (t) {
      case "LeftMove":
        t = "move:left:0.9";
        break;
      case "RightMove":
        t = "move:right:0.9";
        break;
      case "FrontMove":
        t = "move:front:0.9";
        break;
      case "BackMove":
        t = "move:back:0.9";
        break;
      case "LeftRotationClockwise90":
        t = "rotation:left:90";
        break;
      case "LeftRotationAnticlockwise90":
        t = "rotation:left:-90";
        break;
      case "LeftRotationClockwise120":
        t = "rotation:left:120";
        break;
      case "LeftRotationAnticlockwise120":
        t = "rotation:left:-120";
        break;
      case "CenterRotationClockwise270":
        t = "rotation:center-y:270";
        break;
      case "CenterRotationAnticlockwise270":
        t = "rotation:center-y:-270"
      }
      i = i || 1e3,
      n = n || 0,
      o = o || mono.AniUtil.DefaultEasing;
      var s = t.split(":"),
      r = s[0],
      l = s[1],
      d = parseFloat(s[2]);
      if (s.length > 3 && (i = parseInt(s[3])), s.length > 4 && (n = parseInt(s[4])), s.length > 5 && (o = mono.AniUtil.AllEasings[s[5]]), "rotation" === r) {
        var h = mono.AniUtil.getAxisByAnchor(l);
        return d = d / 180 * Math.PI,
        mono.AniUtil.playRotate(e, h, l, d, i, n, o, a)
      }
      return "move" === r ? mono.AniUtil.playMove(e, l, d, i, n, o, a) : "scale" === r ? mono.AniUtil.playScale(e, l, d, i, n, o, a) : void 0
    }
  },
  mono.AniUtil.getAnimationString = function(e, t, i, n, o, a) {
    if (!e || !t || !i) return "";
    var s = e + ":" + t + ":" + i;
    return n && (s += ":" + n),
    s += o ? ":" + o: ":0",
    a && (s += ":" + a),
    s
  },
  mono.AniUtil.findAnimationAgent = function(e) {
    for (var t = e.getClient("animation"); ! t && e.getParent();) t = e.getParent().getClient("animation"),
    e = e.getParent();
    return t ? e: null
  },
  mono.AniUtil.playAlarmAnimation = function(e, t, i, n, o, a) {
    if (!e.__tween) {
      var s = 0,
      r = 60;
      return i = i || 1500,
      n = n || 0,
      o = o || TWEEN.Easing.Elastic.Out,
      e.__tween = new TWEEN.Tween({
        scale: s
      }).to({
        scale: r
      },
      i).easing(o).delay(n).onUpdate(function() {
        t.setScale(this.scale, this.scale, 1)
      }).onComplete(function() {
        delete e.__tween,
        a && a.apply()
      }).start()
    }
  },
  mono.AniUtil.playInspection = function(e, t, i) {
    return t.unshift({
      px: e.getCamera().getPosition().x,
      py: e.getCamera().getPosition().y,
      pz: e.getCamera().getPosition().z,
      tx: e.getCamera().getTarget().x,
      ty: e.getCamera().getTarget().y,
      tz: e.getCamera().getTarget().z
    }),
    t.__cursor || (t.__cursor = 1),
    mono.AniUtil._doPlayInspection(e, t, i)
  },
  mono.AniUtil._doPlayInspection = function(e, t, i) {
    if (t.__cursor < t.length) {
      var n = t[t.__cursor - 1],
      o = t[t.__cursor],
      a = mono.AniUtil._createInspectionTween(e, n, o);
      return a.onComplete(function() {
        t.__cursor++,
        mono.AniUtil._doPlayInspection(e, t, i)
      }),
      a.start(),
      a
    }
    i && i.apply()
  },
  mono.AniUtil._fixStopMissingValues = function(e, t) {
    null == t.px && (t.px = e.getCamera().getPosition().x),
    null == t.py && (t.py = e.getCamera().getPosition().y),
    null == t.pz && (t.pz = e.getCamera().getPosition().z),
    null == t.tx && (t.tx = e.getCamera().getTarget().x),
    null == t.ty && (t.ty = e.getCamera().getTarget().y),
    null == t.tz && (t.tz = e.getCamera().getTarget().z)
  },
  mono.AniUtil._createInspectionTween = function(e, t, i) {
    var n = i.time ? i.time: 2e3,
    o = i.delay ? i.delay: 0,
    a = i.easing ? i.easing: mono.AniUtil.DefaultEasing;
    return mono.AniUtil._fixStopMissingValues(e, t),
    mono.AniUtil._fixStopMissingValues(e, i),
    new TWEEN.Tween(t).to(i, n).easing(a).delay(o).onUpdate(function() {
      e.getCamera().look(new mono.Vec3(this.tx, this.ty, this.tz)),
      e.getCamera().setPosition(this.px, this.py, this.pz)
    })
  },
  mono.AniUtil.playTransform = function(e, t, i, n, o, a) {
    i = i || 2e3,
    n = n || 0,
    o = o || TWEEN.Easing.Linear.None,
    mono.AniUtil._fixTransformMissingValues(e, t);
    var s = mono.AniUtil.createElementTransform(e);
    return new TWEEN.Tween(s).to(t, i).easing(o).delay(n).onUpdate(function() {
      e.setPosition(this.px, this.py, this.pz),
      e.setRotation(this.rx, this.ry, this.rz),
      e.setScale(this.sx, this.sy, this.sz)
    }).onComplete(function() {
      a && a.apply()
    }).start()
  },
  mono.AniUtil._fixTransformMissingValues = function(e, t) {
    null == t.px && (t.px = t.getPosition().x),
    null == t.py && (t.py = t.getPosition().y),
    null == t.pz && (t.pz = t.getPosition().z),
    null == t.rx && (t.rx = t.getRotation().x),
    null == t.ry && (t.ry = t.getRotation().y),
    null == t.rz && (t.rz = t.getRotation().z),
    null == t.sx && (t.sx = t.getScale().x),
    null == t.sy && (t.sy = t.getScale().y),
    null == t.sz && (t.sz = t.getScale().z)
  },
  mono.AniUtil.createElementTransform = function(e) {
    return {
      px: e.getPosition().x,
      py: e.getPosition().y,
      pz: e.getPosition().z,
      rx: e.getRotation().x,
      ry: e.getRotation().y,
      rz: e.getRotation().z,
      sx: e.getScale().x,
      sy: e.getScale().y,
      sz: e.getScale().z
    }
  },
  mono.AniUtil.createTransform = function(e, t, i, n, o, a, s, r, l) {
    return {
      px: e,
      py: t,
      pz: i,
      rx: n,
      ry: o,
      rz: a,
      sx: s,
      sy: r,
      sz: l
    }
  },
  mono.AniUtil.isAnimated = function(e) {
    return e && null != e.__animated && e.__animated === !0
  },
  mono.AniUtil.resetAnimation = function(e) {
    if (e) {
      var t = e.getNodes().toArray();
      if (t) for (var i = 0; i < t.length; i++) {
        var n = t[i];
        mono.AniUtil.isAnimated(n) && mono.AniUtil.playAnimation(n, n.getClient("animation"))
      }
    }
  },
  mono.AniUtil.resetAnimatedFlag = function(e) {
    e && (delete e.__animated, delete e.__played)
  },
  mono.AniUtil.playCameraAnimation = function(e, t, i, n, o, a) {
    if (e && t) {
      i = i || 1e3,
      n = n || 0,
      o = o || mono.AniUtil.DefaultEasing;
      var s = t.split(":"),
      r = (s[0], parseFloat(s[1]));
      r = r / 180 * Math.PI;
      var l = mono.AniUtil.createAxisByName("y"),
      d = e.getTarget();
      if (!e.__tween) {
        var h = 0,
        c = r;
        return e.__tweenLastRotation = h,
        e.__tweenDestRotation = c,
        e.__tween = new TWEEN.Tween({
          v: h
        }).to({
          v: c
        },
        i).easing(o).delay(n).onUpdate(function() {
          var t = v(l, e.getPosition(), d, this.v - e.__tweenLastRotation);
          e.setPosition(t),
          e.__tweenLastRotation = this.v
        }).onComplete(function() {
          delete e.__tween,
          delete e.__tweenLastRotation,
          delete e.__tweenDestRotation,
          a && a.apply(e)
        }).start(),
        e.__tween
      }
    }
  };
  var v = function(e, t, i, n) {
    var o = t.clone();
    return o.rotateFromAxisAndCenter(e, n, i)
  };
  mono.AnimationData = function(e, t, i, n) {
    this.object = t,
    this.animation = i,
    this.groupName = n,
    this._id = e
  },
  twaver.Util.ext("mono.AnimationData", Object, {
    play: function() {
      if (this.object instanceof mono.Entity) {
        this.object.__animated = this.object.__played;
        var e = this.animation.split(";");
        e.length >= 1 && (this.object.__played ? this.playAnimationString(e, e.length - 1, e.length, this.object.__played) : this.playAnimationString(e, 0, e.length, this.object.__played)),
        this.object.__played = !this.object.__played
      }
    },
    playAnimationString: function(e, t, i, n) {
      var o = this;
      this.object.__animated = n,
      n ? e[i - 1] && t >= 0 && mono.AniUtil.playAnimation(this.object, e[t], null, null, null,
      function() {
        o.playAnimationString(e, --t, i, n)
      }) : e[t] && i > t && mono.AniUtil.playAnimation(this.object, e[t], null, null, null,
      function() {
        o.playAnimationString(e, ++t, i, n)
      })
    },
    setAnimationGroup: function(e) {
      this.groupName = e
    },
    setAnimation: function(e) {
      this.animation = e
    },
    isPlayed: function() {
      return this.object && null != this.object.__played && this.object.__played === !0
    },
    reset: function() {
      this.isPlayed() && this.play()
    }
  }),
  mono.AnimationManager = function(e) {
    this.name = e,
    this.animations = [],
    this.animationMap = {},
    this.totalAnimations = [],
    this.isPlayed = !1
  },
  twaver.Util.ext("mono.AnimationManager", Object, {
    add: function(e) {
      this.animations.push(e),
      this.totalAnimations.push(e),
      this.animationMap[e._id] = e
    },
    remove: function(e) {
      var t = this.animations.indexOf(e); - 1 !== t && this.animations.splice(t, 1),
      this.animationMap[e._id] = null,
      t = this.totalAnimations.indexOf(e),
      -1 !== t && this.totalAnimations.splice(t, 1)
    },
    getAnimationById: function(e) {
      return this.animationMap[e]
    },
    stop: function() {
      var e = this.getCurrentAnimation();
      e.stop()
    },
    setTotalAnimations: function(e) {
      if (e && e.length > 0) for (var t in e) {
        var i = this.totalAnimations.indexOf(e[t]); - 1 !== i && this.totalAnimations.push(e[t])
      }
    },
    playAll: function() {
      if (this.animations && this.animations.length > 0) if (isPlayed) for (var e = this.animations.length - 1; e >= 0; e--) this.play(this.animations[e]);
      else for (var e = 0; e < animations.length; e++) this.play(this.animations[e]);
      isPlayed = !isPlayed
    },
    getCurrentAnimation: function() {
      if (this.animations && this.animations.length > 0) for (var e in this.animations) if (this.animations[e].isPlaying) return this.animations[e]
    },
    reset: function() {
      for (var e in this.animations) this.animations[e].reset()
    },
    play: function(e) {
      if (e.groupName) {
        var t = this.getAllAnimationsByGroupName(e.groupName);
        for (var i in t) t[i].play()
      } else e.play()
    },
    getAllAnimations: function() {
      return this.animations
    },
    getAllAnimationsByGroupName: function(e) {
      var t = [];
      if (this.totalAnimations && this.totalAnimations.length > 0) for (var i in this.totalAnimations) this.totalAnimations[i].groupName == e && t.push(this.totalAnimations[i]);
      return t
    },
    resetAllAnimations: function() {
      if (this.animations && this.animations.length > 0) for (var e in this.animations) this.animations[e].reset()
    }
  })
} ();
var extend = function(e, t, i) {
  e.superClass = t,
  e.prototype = inherit(t.prototype),
  e.prototype.constructor = e;
  for (prop in i) e.prototype[prop] = i[prop]
},
Healper_addEventListener = function(e, t, i, n, o) {
  null == o && (o = !1);
  var a = function(e) {
    i.call(a.scope, e)
  };
  a.scope = n,
  e.addEventListener ? e.addEventListener(t, a, o) : e.attachEvent("on" + t, a)
};
SampleData = function() {
  this.x = 0,
  this.y = 0,
  this.value = null
},
RecordSet = function(e, t) {
  this.max = e,
  this.data = t
},
CommonObject = function() {
  CommonObject.superClass.apply(this),
  this._c = {}
},
extend(CommonObject, Object, {
  get: function(e) {
    return this._c[e]
  },
  set: function(e, t) {
    this._c[e] = t
  },
  print: function(e) {
    console.log(e)
  },
  initDefaults: function(e) {
    for (pro in e) this._c[pro] = e[pro]
  }
}),
TH3 = function(e) {
  TH3.superClass.apply(this, arguments),
  this._store = new Store(this),
  this.initDefaults({
    radius: 40,
    element: null,
    canvas: {},
    acanvas: {},
    ctx: {},
    actx: {},
    legend: null,
    visible: !0,
    width: 0,
    height: 0,
    max: 1,
    gradient: !1,
    opacity: 180,
    premultiplyAlpha: !1,
    bounds: {
      l: 1e3,
      r: 0,
      t: 1e3,
      b: 0
    },
    gradient: {.25 : "rgb(0,0,255)",
      .5 : "rgb(0,255,255)",
      .75 : "rgb(0,255,0)",
      1 : "rgb(255,0,0)"
    },
    blur: 15
  }),
  this.init(),
  e ? this.configure(e) : this.initColorPalette()
},
extend(TH3, CommonObject, {
  setRadius: function(e) {
    var t = this.get("radius");
    t != e && (this.set("radius", e), this.updateSettings())
  },
  setBlur: function(e) {
    e && this.set("blur", e)
  },
  setGradient: function(e) {
    this.set("gradient", e || {.25 : "rgb(0,0,255)",
      .5 : "rgb(0,255,255)",
      .75 : "rgb(0,255,0)",
      1 : "rgb(255,0,0)"
    }),
    this.initColorPalette()
  },
  setBounds: function() {
    if (2 == arguments.length) this.set("width", arguments[0]),
    this.set("height", arguments[1]);
    else if (1 == arguments.length) {
      var e = arguments[0],
      t = this.get("bounds");
      e.hasOwnProperty("left") && (t.l = e.left),
      e.hasOwnProperty("right") && (t.r = e.right),
      e.hasOwnProperty("top") && (t.t = e.top),
      e.hasOwnProperty("bottom") && (t.b = e.bottom)
    }
    this.updateSettings()
  },
  addPoint: function(e) {
    this._store.addPoint(e)
  },
  pushDataSet: function(e, t) {
    this._store.pushRecordSet(e, t)
  },
  showData: function() {
    console.log(this._store.toJSON())
  },
  configure: function(e) {
    if (this.set("radius", e.radius || 40), this.set("element", e.element instanceof Object ? e.element: document.getElementById(e.element)), this.set("visible", null != e.visible ? e.visible: !0), this.set("max", e.max || !1), this.setGradient(e.gradient), this.set("opacity", parseInt(255 / (100 / e.opacity), 10) || 180), this.set("width", e.width || 0), this.set("height", e.height || 0), e.legend) {
      var t = e.legend;
      t.gradient = this.get("gradient"),
      this.set("legend", new Legend(t))
    }
    this.updateSettings()
  },
  resize: function() {
    var e = this.get("element"),
    t = this.get("canvas"),
    i = this.get("acanvas");
    e ? (t.width = i.width = this.get("width") || e.style.width.replace(/px/, "") || this.getWidth(e), this.set("width", t.width), t.height = i.height = this.get("height") || e.style.height.replace(/px/, "") || this.getHeight(e), this.set("height", t.height)) : (t.width = i.width = this.get("width"), t.height = i.height = this.get("height"))
  },
  init: function() {
    var e = document.createElement("canvas"),
    t = document.createElement("canvas"),
    i = e.getContext("2d"),
    n = t.getContext("2d");
    e.className = "h29#3",
    this.set("canvas", e),
    this.set("ctx", i),
    this.set("acanvas", t),
    this.set("actx", n),
    e.style.cssText = t.style.cssText = "position:absolute;top:0;left:0;",
    e.isMovable = !0,
    this.get("visible") || (e.style.display = "none"),
    n.shadowOffsetX = 15e3,
    n.shadowOffsetY = 15e3,
    n.shadowBlur = this.get("blur")
  },
  bindElement: function(e) {
    this.set("element", e),
    this.appendTo(e)
  },
  updateSettings: function() {
    this.resize();
    var e = this.get("element");
    this.appendTo(e)
  },
  appendTo: function(e) {
    var t = this.get("canvas"),
    i = t.parentElement;
    i !== e && e && (e.appendChild(t), this.get("legend") && e.appendChild(this.get("legend").getElement()))
  },
  initColorPalette: function() {
    var e, t, i, n = document.createElement("canvas"),
    o = this.get("gradient");
    n.width = "1",
    n.height = "256",
    e = n.getContext("2d"),
    t = e.createLinearGradient(0, 0, 1, 256),
    i = e.getImageData(0, 0, 1, 1),
    i.data[0] = i.data[3] = 64,
    i.data[1] = i.data[2] = 0,
    e.putImageData(i, 0, 0),
    i = e.getImageData(0, 0, 1, 1),
    this.set("premultiplyAlpha", i.data[0] < 60 || i.data[0] > 70);
    for (var a in o) t.addColorStop(a, o[a]);
    e.fillStyle = t,
    e.fillRect(0, 0, 1, 256),
    this.set("gradientdata", e.getImageData(0, 0, 1, 256).data)
  },
  getWidth: function(e) {
    var t = e.offsetWidth;
    return e.style.paddingLeft && (t += e.style.paddingLeft),
    e.style.paddingRight && (t += e.style.paddingRight),
    t
  },
  getHeight: function(e) {
    var t = e.offsetHeight;
    return e.style.paddingTop && (t += e.style.paddingTop),
    e.style.paddingBottom && (t += e.style.paddingBottom),
    t
  },
  colorize: function(e, t) {
    var i, n, o, a, s, r, l, d, h, c, g = this.get("width"),
    m = this.get("radius"),
    u = this.get("height"),
    p = this.get("actx"),
    f = this.get("ctx"),
    v = 3 * m,
    y = this.get("premultiplyAlpha"),
    C = this.get("gradientdata"),
    S = this.get("opacity"),
    I = this.get("bounds");
    null != e && null != t ? (e + v > g && (e = g - v), 0 > e && (e = 0), 0 > t && (t = 0), t + v > u && (t = u - v), i = e, n = t, a = e + v, o = t + v) : (i = I.l < 0 ? 0 : I.l, a = I.r > g ? g: I.r, n = I.t < 0 ? 0 : I.t, o = I.b > u ? u: I.b),
    s = p.getImageData(i, n, a - i, o - n),
    r = s.data,
    l = r.length;
    for (var A = 3; l > A; A += 4) d = r[A],
    h = 4 * d,
    h && (c = S > d ? d: S, r[A - 3] = C[h], r[A - 2] = C[h + 1], r[A - 1] = C[h + 2], y && (r[A - 3] /= 255 / c, r[A - 2] /= 255 / c, r[A - 1] /= 255 / c), r[A] = c);
    s.data = r,
    f.putImageData(s, i, n)
  },
  drawAlpha: function(e, t, i, n) {
    var o = this.get("radius"),
    a = this.get("actx"),
    s = (this.getMax(), this.get("bounds")),
    r = this.get("blur"),
    l = e - 1.5 * o >> 0,
    d = t - 1.5 * o >> 0,
    h = e + 1.5 * o >> 0,
    c = t + 1.5 * o >> 0;
    a.shadowColor = "rgba(0,0,0," + (i ? i / this._store._max: "0.1") + ")",
    a.shadowOffsetX = 15e3,
    a.shadowOffsetY = 15e3,
    a.shadowBlur = r,
    a.beginPath(),
    a.arc(e - 15e3, t - 15e3, o, 0, 2 * Math.PI, !0),
    a.closePath(),
    a.fill(),
    n ? this.colorize(l, d) : (l < s.l && (s.l = l), d < s.t && (s.t = d), h > s.r && (s.r = h), c > s.b && (s.b = c))
  },
  toggleDisplay: function() {
    var e = this.get("visible"),
    t = this.get("canvas");
    t.style.display = e ? "none": "block",
    this.set("visible", !e)
  },
  getImage: function() {
    var e = this.get("canvas");
    return e.toDataURL()
  },
  clear: function() {
    var e = this.get("width"),
    t = this.get("height");
    this._store.set("data", []),
    this.get("ctx").clearRect(0, 0, e, t),
    this.get("actx").clearRect(0, 0, e, t)
  },
  cleanup: function() {
    this.get("element").removeChild(this.get("canvas"))
  },
  getMax: function() {
    return this._store._max
  },
  getDataSet: function() {
    return this._store.get("data")
  },
  updateAlpha: function(e) {
    for (var e = this.getDataSet(), t = 0; t < e.length; t++) {
      var i = e[t];
      if (i) for (var n = 0; n < i.length; n++) {
        var o = i[n];
        o && this.drawAlpha(t, n, o, !0)
      }
    }
  },
  print: function() {
    TH3.superClass.prototype.print.apply(this, arguments)
  }
}),
Store = function(e) {
  Store.superClass.apply(this, arguments),
  this._max = 1,
  this._m = e,
  this.set("data", [])
},
extend(Store, CommonObject, {
  addPoint: function(e) {
    e.value ? this.addDataPoint(e.x, e.y, e.value) : e.count ? this.addDataPoint(e.x, e.y, e.count) : this.addDataPoint(e.x, e.y)
  },
  addDataPoint: function(e, t) {
    if (! (0 > e || 0 > t)) {
      var i = this.get("data");
      return i[e] || (i[e] = []),
      i[e][t] || (i[e][t] = 0),
      i[e][t] += arguments.length < 3 ? 1 : arguments[2],
      2 == i[e][t] && console.log("add data point " + e + "," + t + "   " + i[e][t]),
      this.set("data", i),
      this._max < i[e][t] ? (this._m.get("actx").clearRect(0, 0, this._m.get("width"), this._m.get("height")), void this.setDataSet({
        max: i[e][t],
        data: i
      },
      !0)) : void this._m.drawAlpha(e, t, i[e][t], !0)
    }
  },
  pushRecordSet: function(e, t) {
    this.setDataSet(e, t)
  },
  setDataSet: function(e, t) {
    var i = [],
    n = e.data,
    o = n.length;
    if (this._m.clear(), this._max = e.max, this._m.get("legend") && this._m.get("legend").update(e.max), null != t && t) {
      for (var a in n) if (void 0 !== a) for (var s in n[a]) void 0 !== s && this._m.drawAlpha(a, s, n[a][s], !1)
    } else for (; o--;) {
      var r = n[o];
      i[r.x] || (i[r.x] = []),
      i[r.x][r.y] || (i[r.x][r.y] = 0),
      r.value ? i[r.x][r.y] = r.value: r.count ? i[r.x][r.y] = r.count: i[r.x][r.y] ? i[r.x][r.y]++:i[r.x][r.y] = 1,
      this._m.drawAlpha(r.x, r.y, i[r.x][r.y], !1)
    }
    this._m.colorize(),
    this.set("data", n)
  },
  exportDataSet: function() {
    var e = this.get("data"),
    t = [];
    for (var i in e) if (void 0 !== i) for (var n in e[i]) void 0 !== n && t.push({
      x: parseInt(i, 10),
      y: parseInt(n, 10),
      count: e[i][n]
    });
    return {
      max: this._max,
      data: t
    }
  },
  generateRandomDataSet: function(e) {
    var t = this._m.get("width"),
    i = this._m.get("height"),
    n = {},
    o = Math.floor(1e3 * Math.random() + 1);
    n.max = o;
    for (var a = []; e--;) a.push({
      x: Math.floor(Math.random() * t + 1),
      y: Math.floor(Math.random() * i + 1),
      count: Math.floor(Math.random() * o + 1)
    });
    n.data = a,
    this.setDataSet(n)
  },
  toJSON: function() {
    for (var e = [], t = this.get("data"), i = 0; i < t.length; i++) if (t[i]) for (var n = 0; n < t[i].length; n++) t[i][n] && e.push({
      x: i,
      y: n,
      v: t[i][n]
    });
    return JSON.stringify(e)
  }
}),
Legend = function(e) {
  Legend.superClass.apply(this, arguments),
  this.set("decimal", 0),
  this.init(e)
},
extend(Legend, CommonObject, {
  init: function(e) {
    this.config = e,
    e && e.decimal && this.set("decimal", e.decimal);
    var t, i, n = e.title || "Legend",
    o = e.position,
    a = e.offset || 10,
    s = (e.gradient, document.createElement("ul")),
    r = "";
    this.processGradientObject(),
    r += o.indexOf("t") > -1 ? "top:" + a + "px;": "bottom:" + a + "px;",
    r += o.indexOf("l") > -1 ? "left:" + a + "px;": "right:" + a + "px;",
    t = document.createElement("div"),
    t.style.cssText = "border-radius:5px;position:absolute;" + r + "font-family:Helvetica; width:256px;z-index:10000000000; background:rgba(255,255,255,1);padding:10px;border:1px solid black;margin:0;",
    t.innerHTML = "<h3 style='padding:0;margin:0;text-align:center;font-size:16px;'>" + n + "</h3>",
    s.style.cssText = "position:relative;font-size:12px;display:block;list-style:none;list-style-type:none;margin:0;height:15px;",
    i = document.createElement("div"),
    i.style.cssText = ["position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(", this.createGradientImage(), ");"].join(""),
    t.appendChild(s),
    t.appendChild(i),
    t.className = "l_m",
    this.set("element", t),
    this.set("labelsEl", s),
    this.update(1)
  },
  processGradientObject: function() {
    var e = this.config.gradient,
    t = [];
    for (var i in e) e.hasOwnProperty(i) && t.push({
      stop: i,
      value: e[i]
    });
    t.sort(function(e, t) {
      return e.stop - t.stop
    }),
    t.unshift({
      stop: 0,
      value: "rgba(0,0,0,0)"
    }),
    this.set("gradientArr", t)
  },
  createGradientImage: function() {
    var e, t = this.get("gradientArr"),
    i = t.length,
    n = document.createElement("canvas"),
    o = n.getContext("2d");
    n.width = "256",
    n.height = "15",
    e = o.createLinearGradient(0, 5, 256, 10);
    for (var a = 0; i > a; a++) e.addColorStop(1 / (i - 1) * a, t[a].value);
    o.fillStyle = e,
    o.fillRect(0, 5, 256, 10),
    o.strokeStyle = "black",
    o.beginPath();
    for (var a = 0; i > a; a++) o.moveTo((1 / (i - 1) * a * 256 >> 0) + .5, 0),
    o.lineTo((1 / (i - 1) * a * 256 >> 0) + .5, 0 == a ? 15 : 5);
    return o.moveTo(255.5, 0),
    o.lineTo(255.5, 15),
    o.moveTo(255.5, 4.5),
    o.lineTo(0, 4.5),
    o.stroke(),
    this.set("ctx", o),
    n.toDataURL()
  },
  getElement: function() {
    return this.get("element")
  },
  update: function(e) {
    for (var t, i, n = this.get("gradientArr"), o = this.get("ctx"), a = this.get("labelsEl"), s = "", r = this.get("decimal"), l = 0; l < n.length; l++) t = (e * n[l].stop).toFixed(r),
    i = o.measureText(t).width / 2 >> 0,
    0 == l && (i = 0),
    l == n.length - 1 && (i *= 2),
    s += '<li style="position:absolute;left:' + (((1 / (n.length - 1) * l * 256 || 0) >> 0) - i + .5) + 'px">' + t + "</li>";
    a.innerHTML = s
  }
}),
TemperatureBoard = function(e, t, i, n, o, a) {
  this.direction = i || "v",
  this.width = e,
  this.height = t,
  this.map = new TH3,
  this.map.setRadius(n || 25),
  this.map.setBounds(e, t),
  this.map.setGradient(o),
  this.map.setBlur(a || 15)
},
extend(TemperatureBoard, Object, {
  setDirection: function(e) {
    this.direction = e
  },
  setSize: function(e, t) {
    this.width = e,
    this.height = t,
    map.setBounds(e, t)
  },
  addPoint: function() {
    if (1 == arguments.length && "object" == typeof arguments[0]) this.map.addPoint(arguments[0]);
    else if (3 == arguments.length) {
      var e = new SampleData;
      e.x = arguments[0],
      e.y = arguments[1],
      e.value = arguments[2],
      this.map.addPoint(e)
    }
  },
  getImage: function() {
    return this.map.getImage()
  },
  getTemperatureBoard: function() {
    var e = new TGL.Plane(this.width, this.height);
    return e.setStyle("m.texture.repeat", new TGL.Vec2(1, 1)).setStyle("m.type", "basic").setStyle("m.texture.image", this.getImage()).setStyle("m.transparent", !0).setStyle("m.side", "both"),
    "h" == this.direction && e.setRotation(90 * Math.PI / 180, 0, 0),
    e
  },
  setGradient: function(e) {
    this.map.setGradient(e),
    this.map.updateAlpha()
  },
  setRadius: function(e) {
    this.map.setRadius(e),
    this.map.updateAlpha()
  },
  setBlur: function(e) {
    this.map.setBlur(e),
    this.map.updateAlpha()
  }
}),
LEDDisplay = function(e) {
  this._dom = document.createElement("canvas"),
  this._dom.setAttribute("width", 160),
  this._dom.setAttribute("height", 32);
  var t = new Image,
  i = this;
  t.onload = function() {
    i.repaint()
  },
  t.src = e,
  this.board = t
},
extend(LEDDisplay, Object, {
  repaint: function() {
    this.paint(this.cont)
  },
  getx: function(e) {
    return 0 / 0 === e ? 10 : e >= 0 && 9 >= e ? e: 10
  },
  getView: function() {
    return this._dom
  },
  display: function(e) {
    var t = e;
    e.length || (t += "");
    for (var i = t.length,
    n = [], o = 0; i > o; o++) n.push(t.substr(o, 1));
    this.paint(n)
  },
  paint: function(e) {
    this.cont = e;
    var t = this._dom,
    i = t.getContext("2d");
    i.clearRect(0, 0, t.width, t.height);
    for (var n = 0; n < e.length; n++) {
      var o = this.getx(Number(e[n]));
      i.drawImage(this.board, 32 * o, 0, 32, 32, 32 * n, 0, 32, 32)
    }
  }
}),
mono.Toolkits = {},
mono.Toolkits.loadGraph = function(e, t, i, n) {
  return modelManager.loadGraph(e, t, i, n)
},
mono.Toolkits.loadTemplateByName = function(e, t, i, n, o) {
  modelManager.loadTemplateFromCloud(e, t, i, o)
},
mono.Toolkits.loadTemplateById = function(e, t, i, n, o) {
  modelManager.loadCloudTemplateById(e, t, i, n, o)
},
mono.Toolkits.loadGraphUrl = function(e, t, i, n, o, a) {
  modelManager.loadGraphUrl(e, t, i, n, o, a)
},
mono.Toolkits.loadGraphDatas = function(e) {
  return modelManager.loadGraphDatas(e)
},
mono.Toolkits.exportGraph = function(e) {
  return modelManager.serializeGraphInfo(e, !0)
},
mono.Toolkits.loadTemplate = function(e, t, i) {
  return modelManager.loadComponentTemplateFromContents(e, t, i, !1)
},
mono.Toolkits.loadTemplateUrl = function(e, t, i, n, o) {
  modelManager.loadComponentTemplateFromURL(e, t, i, n, o)
},
mono.Toolkits.login = function(e, t, i, n) {
  Utils.login(e, t, i, n)
};
var modelManager, timerID, taskCount = 0,
showDim = !1,
showCoord = !1,
decimalNumber = 2,
refreshNetwork, loadmodels = function(e) {
  var t = document.createElement("script");
  t.setAttribute("type", "text/javascript"),
  t.setAttribute("src", Utils.RelativePath + "resources/" + e),
  document.getElementsByTagName("head")[0].appendChild(t)
},
initModelLib = function(e) {
  modelManager = new modellib.ModelManager,
  e && (loadmodels("RoomPrimitives.json"), loadmodels("RoomAssembles.json"))
},
parsePrimitives = function(e) {
  modelManager.parsePrimitives(e),
  modelManager.loadSharedPrimitive(),
  taskCount++
},
parseAssembles = function(e) {
  modelManager.parseAssembles(e),
  modelManager.loadSharedAssemble(),
  taskCount++
},
parseLib = function(e) {
  modelManager.parseLib(e),
  taskCount++
} +
function(e, t) {
  mono.LoadingManager = function(e, i, n) {
    var o = this,
    a = 0,
    s = 0;
    this.onLoad = e,
    this.onProgress = i,
    this.onError = n,
    this.itemStart = function() {
      s++
    },
    this.itemEnd = function(e) {
      a++,
      o.onProgress !== t && o.onProgress(e, a, s),
      a === s && o.onLoad !== t && o.onLoad()
    }
  },
  mono.DefaultLoadingManager = new mono.LoadingManager,
  mono.ImageLoader = function(e) {
    this.manager = e !== t ? e: mono.DefaultLoadingManager
  },
  mono.ImageLoader.prototype = {
    constructor: mono.ImageLoader,
    load: function(e, i, n, o) {
      var a = this,
      s = document.createElement("img");
      return i !== t && s.addEventListener("load",
      function() {
        a.manager.itemEnd(e),
        i(this)
      },
      !1),
      n !== t && s.addEventListener("progress",
      function(e) {
        n(e)
      },
      !1),
      o !== t && s.addEventListener("error",
      function(e) {
        o(e)
      },
      !1),
      this.crossOrigin !== t && (s.crossOrigin = this.crossOrigin),
      s.src = e,
      a.manager.itemStart(e),
      s
    },
    loadFile: function(e, i, n, o) {
      var a = this,
      s = new FileReader;
      i !== t && (s.onload = function() {
        i(s.result),
        a.manager.itemEnd(e.name)
      }),
      n !== t && s.addEventListener("progress",
      function(e) {
        n(e)
      },
      !1),
      o !== t && s.addEventListener("error",
      function(e) {
        o(e)
      },
      !1),
      s.readAsDataURL(e),
      a.manager.itemStart(e.name)
    },
    setCrossOrigin: function(e) {
      this.crossOrigin = e
    }
  },
  mono.XHRLoader = function(e) {
    this.manager = e !== t ? e: mono.DefaultLoadingManager
  },
  mono.XHRLoader.prototype = {
    constructor: mono.XHRLoader,
    load: function(e, i, n, o) {
      var a = this,
      s = new XMLHttpRequest;
      i !== t && s.addEventListener("load",
      function(t) {
        i(t.target.responseText),
        a.manager.itemEnd(e)
      },
      !1),
      n !== t && s.addEventListener("progress",
      function(e) {
        n(e)
      },
      !1),
      o !== t && s.addEventListener("error",
      function(e) {
        o(e)
      },
      !1),
      this.crossOrigin !== t && (s.crossOrigin = this.crossOrigin),
      s.open("GET", e, !0),
      s.send(null),
      a.manager.itemStart(e)
    },
    loadFile: function(e, i, n, o) {
      if (e) {
        var a = this,
        s = new FileReader;
        i !== t && (s.onload = function() {
          i(s.result),
          a.manager.itemEnd(e.name)
        }),
        n !== t && s.addEventListener("progress",
        function(e) {
          n(e)
        },
        !1),
        o !== t && s.addEventListener("error",
        function(e) {
          o(e)
        },
        !1),
        s.readAsText(e),
        a.manager.itemStart(e.name)
      }
    },
    setCrossOrigin: function(e) {
      this.crossOrigin = e
    }
  },
  mono.MTLLoader = function(e, t, i) {
    this.baseUrl = e,
    this.options = t,
    this.crossOrigin = i
  },
  mono.extend(mono.MTLLoader, null, {
    constructor: mono.MTLLoader,
    load: function(e, t) {
      var i = this,
      n = new mono.XHRLoader;
      n.setCrossOrigin(this.crossOrigin),
      n.load(e,
      function(e) {
        t(i.parse(e))
      })
    },
    loadFile: function(e, t) {
      var i = this,
      n = new mono.XHRLoader;
      n.loadFile(e,
      function(e) {
        t(i.parse(e))
      })
    },
    parse: function(e) {
      for (var t = e.split("\n"), i = {},
      n = /\s+/, o = {},
      a = 0; a < t.length; a++) {
        var s = t[a];
        if (s = s.trim(), 0 !== s.length && "#" !== s.charAt(0)) {
          var r = s.indexOf(" "),
          l = r >= 0 ? s.substring(0, r) : s;
          l = l.toLowerCase();
          var d = r >= 0 ? s.substring(r + 1) : "";
          if (d = d.trim(), "newmtl" === l) i = {
            name: d
          },
          o[d] = i;
          else if (i) if ("ka" === l || "kd" === l || "ks" === l) {
            var h = d.split(n, 3);
            i[l] = [parseFloat(h[0]), parseFloat(h[1]), parseFloat(h[2])]
          } else i[l] = d
        }
      }
      var c = new mono.MTLLoader.MaterialCreator(this.baseUrl, this.options);
      return c.setMaterials(o),
      c
    }
  }),
  mono.MTLLoader.MaterialCreator = function(e, t) {
    this.baseUrl = e,
    this.options = t,
    this.materialsInfo = {},
    this.materials = {},
    this.materialsArray = [],
    this.nameLookup = {},
    this.side = this.options && this.options.side ? this.options.side: mono.FrontSide,
    this.wrap = this.options && this.options.wrap ? this.options.wrap: mono.RepeatWrapping
  },
  mono.extend(mono.MTLLoader.MaterialCreator, mono.EventDispatcher, {
    constructor: mono.MTLLoader.MaterialCreator,
    setMaterials: function(e) {
      this.materialsInfo = this.convert(e),
      this.materials = {},
      this.materialsArray = [],
      this.nameLookup = {}
    },
    convert: function(e) {
      if (!this.options) return e;
      var t = {};
      for (var i in e) {
        var n = e[i],
        o = {};
        t[i] = o;
        for (var a in n) {
          var s = !0,
          r = n[a],
          l = a.toLowerCase();
          switch (l) {
          case "kd":
          case "ka":
          case "ks":
            this.options && this.options.normalizeRGB && (r = [r[0] / 255, r[1] / 255, r[2] / 255]),
            this.options && this.options.ignoreZeroRGBs && 0 === r[0] && 0 === r[1] && 0 === r[1] && (s = !1);
            break;
          case "d":
            this.options && this.options.invertTransparency && (r = 1 - r)
          }
          s && (o[l] = r)
        }
      }
      return t
    },
    preload: function() {
      for (var e in this.materialsInfo) this.create(e)
    },
    getIndex: function(e) {
      return this.nameLookup[e]
    },
    getAsArray: function() {
      var e = 0;
      for (var t in this.materialsInfo) this.materialsArray[e] = this.create(t),
      this.nameLookup[t] = e,
      e++;
      return this.materialsArray
    },
    create: function(e) {
      return this.materials[e] === t && this.createMaterial_(e),
      this.materials[e]
    },
    createMaterial_: function(e) {
      var t = this,
      i = this.materialsInfo[e],
      n = {
        name: e,
        side: this.side
      };
      for (var o in i) {
        var a = i[o];
        switch (o.toLowerCase()) {
        case "kd":
          n.diffuse = (new mono.Color).setRGB(a[0], a[1], a[2]);
          break;
        case "ka":
          n.ambient = (new mono.Color).setRGB(a[0], a[1], a[2]);
          break;
        case "ks":
          n.specular = (new mono.Color).setRGB(a[0], a[1], a[2]);
          break;
        case "map_kd":
          "string" == typeof this.baseUrl ? (n.map = this.baseUrl + a, n.map.wrapS = this.wrap, n.map.wrapT = this.wrap) : "object" == typeof this.baseUrl && (a.indexOf(".") > 0 && (a = a.substring(0, a.indexOf(".")).toLowerCase()), this.baseUrl[a] && (n.map = this.baseUrl[a], n.map.wrapS = t.wrap, n.map.wrapT = t.wrap));
          break;
        case "ns":
          n.shininess = a;
          break;
        case "d":
          1 > a && (n.transparent = !0, n.opacity = a)
        }
      }
      return n.diffuse && (n.ambient || (n.ambient = n.diffuse), n.color = n.diffuse),
      this.materials[e] = n,
      this.materials[e]
    },
    loadTexture: function(e, t, i, n) {
      var o = /\.dds$/i.test(e);
      if (o) var a = mono.ImageUtils.loadCompressedTexture(e, t, i, n);
      else {
        var s = new Image,
        a = new mono.Texture(s, t),
        r = new mono.ImageLoader;
        r.crossOrigin = this.crossOrigin,
        r.load(e,
        function(e) {
          a.image = mono.MTLLoader.ensurePowerOfTwo_(e),
          a.needsUpdate = !0,
          i && i(a)
        })
      }
      return a
    }
  }),
  mono.MTLLoader.ensurePowerOfTwo_ = function(e) {
    if (!mono.MTLLoader.isPowerOfTwo_(e.width) || !mono.MTLLoader.isPowerOfTwo_(e.height)) {
      var t = document.createElement("canvas");
      t.width = mono.MTLLoader.nextHighestPowerOfTwo_(e.width),
      t.height = mono.MTLLoader.nextHighestPowerOfTwo_(e.height);
      var i = t.getContext("2d");
      return i.drawImage(e, 0, 0, e.width, e.height, 0, 0, t.width, t.height),
      t
    }
    return e
  },
  mono.MTLLoader.isPowerOfTwo_ = function(e) {
    return 0 === (e & e - 1)
  },
  mono.MTLLoader.nextHighestPowerOfTwo_ = function(e) {--e;
    for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
    return e + 1
  },
  mono.OBJLoader = function(e) {
    this.manager = e !== t ? e: mono.DefaultLoadingManager
  },
  mono.extend(mono.OBJLoader, Object, {
    constructor: mono.ObJLoader,
    load: function(e, t) {
      var i = this,
      n = new mono.XHRLoader(i.manager);
      n.setCrossOrigin(this.crossOrigin),
      n.load(e,
      function(e) {
        t(i.parse(e))
      })
    },
    parse: function(e) {
      function i(e, t, i) {
        return new mono.Vec3(e, t, i)
      }
      function n(e, t) {
        return new mono.Vec2(e, t)
      }
      function o(e, t, i, n) {
        return new mono.Face3(e, t, i, n)
      }
      function a(e, i, n, a) {
        l.faces.push(a === t ? o(parseInt(e) - (c + 1), parseInt(i) - (c + 1), parseInt(n) - (c + 1)) : o(parseInt(e) - (c + 1), parseInt(i) - (c + 1), parseInt(n) - (c + 1), [m[parseInt(a[0]) - 1].clone(), m[parseInt(a[1]) - 1].clone(), m[parseInt(a[2]) - 1].clone()]))
      }
      function s(e, t, i) {
        l.uvs.push([u[parseInt(e) - 1].clone(), u[parseInt(t) - 1].clone(), u[parseInt(i) - 1].clone()])
      }
      function r(e, i, n) {
        e[3] === t ? (a(e[0], e[1], e[2], n), i !== t && i.length > 0 && s(i[0], i[1], i[2])) : (n !== t && n.length > 0 ? (a(e[0], e[1], e[3], [n[0], n[1], n[3]]), a(e[1], e[2], e[3], [n[1], n[2], n[3]])) : (a(e[0], e[1], e[3]), a(e[1], e[2], e[3])), i !== t && i.length > 0 && (s(i[0], i[1], i[3]), s(i[1], i[2], i[3])))
      }
      var l, d, h = new mono.Element,
      c = 0;
      /^o /gm.test(e) === !1 && (l = new mono.Entity, d = new mono.BasicMaterial, l.setStyle("m.type", "phong"), h.addChild(l));
      for (var g = 0,
      m = [], u = [], p = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, f = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, v = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, y = /f( +\d+)( +\d+)( +\d+)( +\d+)?/, C = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/, S = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/, I = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/, A = e.split("\n"), P = 0; P < A.length; P++) {
        var E = A[P];
        E = E.trim();
        var w;
        if (0 !== E.length && "#" !== E.charAt(0)) if (null !== (w = p.exec(E))) l.vertices.push(i(parseFloat(w[1]), parseFloat(w[2]), parseFloat(w[3])));
        else if (null !== (w = f.exec(E))) m.push(i(parseFloat(w[1]), parseFloat(w[2]), parseFloat(w[3])));
        else if (null !== (w = v.exec(E))) u.push(n(parseFloat(w[1]), parseFloat(w[2])));
        else if (null !== (w = y.exec(E))) r([w[1], w[2], w[3], w[4]]);
        else if (null !== (w = C.exec(E))) r([w[2], w[5], w[8], w[11]], [w[3], w[6], w[9], w[12]]);
        else if (null !== (w = S.exec(E))) r([w[2], w[6], w[10], w[14]], [w[3], w[7], w[11], w[15]], [w[4], w[8], w[12], w[16]]);
        else if (null !== (w = I.exec(E))) r([w[2], w[5], w[8], w[11]], [], [w[3], w[6], w[9], w[12]]);
        else if (/^o /.test(E)) l !== t && (c += l.vertices.length),
        l = new mono.Entity,
        d = new mono.BasicMaterial,
        l.setStyle("m.type", "phong"),
        l._name = E.substring(2).trim(),
        h.addChild(l),
        g = 0;
        else if (/^g /.test(E));
        else if (/^usemtl /.test(E)) {
          E.substring(7).trim()
        } else / ^mtllib / .test(E) || /^s /.test(E)
      }
      for (var P = 0,
      b = h._childList._as.length; b > P; P++) {
        var l = h._childList._as[P];
        l.computed = !1,
        l.computeNodeData(),
        l.computeCentroids(),
        l.computeFaceNormals(),
        l.computeBoundingSphere()
      }
      return h
    }
  }),
  mono.OBJMTLLoader = function() {},
  mono.extend(mono.OBJMTLLoader, mono.MTLLoader, {
    constructor: mono.OBJMTLLoader,
    load: function(e, t, i, n) {
      var o = this,
      a = new mono.MTLLoader(i);
      a.load(t,
      function(t) {
        var i = t;
        i.preload();
        var a = new mono.XHRLoader(o.manager);
        a.setCrossOrigin(this.crossOrigin),
        a.load(e,
        function(e) {
          for (var t = o.parse(e), a = 0; a < t._childList._as.length; a++) {
            var s = t._childList._as[a];
            if (s.mname) {
              var r = i.create(s.mname);
              s.setStyle("m.texture.image", r.map),
              s.setStyle("m.ambient", r.ambient),
              s.setStyle("m.diffuse", r.diffuse),
              s.setStyle("m.specular", r.specular),
              s.setStyle("m.color", r.color)
            }
            for (var l = 0; l < s._childList._as.length; l++) {
              var d = s._childList._as[l];
              if (d.mname) {
                var h = i.create(d.mname);
                d.setStyle("m.texture.image", h.map),
                d.setStyle("m.ambient", h.ambient),
                d.setStyle("m.diffuse", h.diffuse),
                d.setStyle("m.specular", h.specular),
                d.setStyle("m.color", h.color)
              }
            }
          }
          n(t)
        })
      })
    },
    loadFiles: function(e, t, i, n) {
      var o = this,
      a = new mono.MTLLoader(i);
      a.loadFile(t,
      function(t) {
        var i = t;
        i.preload();
        var a = new mono.XHRLoader(o.manager);
        a.loadFile(e,
        function(e) {
          for (var t = o.parse(e), a = 0; a < t._childList._as.length; a++) {
            var s = t._childList._as[a];
            if (s.mname) {
              var r = i.create(s.mname);
              o.loadTexture(s, r.map),
              s.setStyle("m.ambient", r.ambient),
              s.setStyle("m.diffuse", r.diffuse),
              s.setStyle("m.specular", r.specular),
              s.setStyle("m.color", r.color)
            }
            for (var l = 0; l < s._childList._as.length; l++) {
              var d = s._childList._as[l];
              if (d.mname) {
                var h = i.create(d.mname);
                o.loadTexture(d, h.map),
                d.setStyle("m.ambient", h.ambient),
                d.setStyle("m.diffuse", h.diffuse),
                d.setStyle("m.specular", h.specular),
                d.setStyle("m.color", h.color)
              }
            }
          }
          n(t)
        })
      })
    },
    loadTexture: function(e, t) {
      if (e && t) {
        var i = new mono.ImageLoader;
        i.loadFile(t,
        function(t) {
          e.setStyle("m.texture.image", t)
        })
      }
    },
    parse: function(e, i) {
      function n(e, t, i) {
        return new mono.Vec3(e, t, i)
      }
      function o(e, t) {
        return new mono.Vec2(e, t)
      }
      function a(e, t, i, n) {
        return new mono.Face3(e, t, i, n)
      }
      function s(e, i) {
        if (u.length > 0 && (m.vertices = u, m.computed = !1, m.computeCentroids(), m.computeFaceNormals(), m.computeBoundingSphere(), m.faces.length > 0)) {
          var n = m._name;
          g.addChild(m),
          m = new mono.Entity,
          m._name = n,
          m.setStyle("m.type", "phong"),
          p = 0
        }
        e !== t && (m._name = e),
        i !== t && (m.mname = i)
      }
      function r(e, i, n, o) {
        m.faces.push(o === t ? a(parseInt(e) - (h + 1), parseInt(i) - (h + 1), parseInt(n) - (h + 1)) : a(parseInt(e) - (h + 1), parseInt(i) - (h + 1), parseInt(n) - (h + 1), [f[parseInt(o[0]) - 1].clone(), f[parseInt(o[1]) - 1].clone(), f[parseInt(o[2]) - 1].clone()]))
      }
      function l(e, t, i) {
        m.uvs.push([v[parseInt(e) - 1].clone(), v[parseInt(t) - 1].clone(), v[parseInt(i) - 1].clone()])
      }
      function d(e, i, n) {
        e[3] === t ? (r(e[0], e[1], e[2], n), i !== t && i.length > 0 && l(i[0], i[1], i[2])) : (n !== t && n.length > 0 ? (r(e[0], e[1], e[3], [n[0], n[1], n[3]]), r(e[1], e[2], e[3], [n[1], n[2], n[3]])) : (r(e[0], e[1], e[3]), r(e[1], e[2], e[3])), i !== t && i.length > 0 && (l(i[0], i[1], i[3]), l(i[1], i[2], i[3])))
      }
      var h = 0,
      c = new mono.Entity,
      g = c,
      m = new mono.Entity;
      m.setStyle("m.type", "phong");
      for (var u = [], p = 0, f = [], v = [], y = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, C = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, S = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/, I = /f( +\d+)( +\d+)( +\d+)( +\d+)?/, A = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/, P = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/, E = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/, w = e.split("\n"), b = 0; b < w.length; b++) {
        var x = w[b];
        x = x.trim();
        var _;
        if (0 !== x.length && "#" !== x.charAt(0)) if (null !== (_ = y.exec(x))) u.push(n(parseFloat(_[1]), parseFloat(_[2]), parseFloat(_[3])));
        else if (null !== (_ = C.exec(x))) f.push(n(parseFloat(_[1]), parseFloat(_[2]), parseFloat(_[3])));
        else if (null !== (_ = S.exec(x))) v.push(o(parseFloat(_[1]), parseFloat(_[2])));
        else if (null !== (_ = I.exec(x))) d([_[1], _[2], _[3], _[4]]);
        else if (null !== (_ = A.exec(x))) d([_[2], _[5], _[8], _[11]], [_[3], _[6], _[9], _[12]]);
        else if (null !== (_ = P.exec(x))) d([_[2], _[6], _[10], _[14]], [_[3], _[7], _[11], _[15]], [_[4], _[8], _[12], _[16]]);
        else if (null !== (_ = E.exec(x))) d([_[2], _[5], _[8], _[11]], [], [_[3], _[6], _[9], _[12]]);
        else if (/^o /.test(x)) s(),
        h += u.length,
        u = [],
        g = new mono.Entity,
        g._name = x.substring(2).trim(),
        c.addChild(g);
        else if (/^g /.test(x)) s(x.substring(2).trim(), t);
        else if (/^usemtl /.test(x)) s(t, x.substring(7).trim());
        else if (/^mtllib /.test(x)) {
          if (i) {
            var O = x.substring(7);
            O = O.trim(),
            i(O)
          }
        } else / ^s / .test(x)
      }
      return s(t, t),
      c
    }
  })
} (window);