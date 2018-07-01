(function () {
  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] || window[vp+'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
      || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() { callback(lastTime = nextTime); }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
}());

var Animate = twaver.Animate = function (animate) {
  var self = this;
  self.type = animate.type == null ? 'number' : animate.type;
  self.delay = animate.delay == null ? 0 : animate.delay;
  self.dur = animate.dur == null ? 1000 : animate.dur;
  self.interval = animate.interval == null ? 0 : animate.interval;
  self.finish = animate.finish == null ? self.delay + self.dur + self.interval : animate.finish;
  if (animate.finish == null) {
    self.finish = self.delay + self.dur + self.interval;
  } else {
    self.finish = animate.finish;
    self.interval = self.finish - self.delay - self.dur;
  }
  self.repeat = animate.repeat == null ? 1 : animate.repeat;
  self.reverse = animate.reverse == null ? true : animate.reverse;
  self.easing = animate.easing == null ? 'easeNone' : animate.easing;

  self.onUpdate = animate.onUpdate;
  self.onDone = animate.onDone;
  self.onStop = animate.onStop;
  self.onPlay = animate.onPlay;
  self.attr = animate.attr;
  self.source = animate.source;
  self.filter = animate.filter;
  self.from = animate.from;
  self.to = animate.to;

  self.start = null;
  self.time = 0;
  self.total = 0;
  self.count = 0;
  self.started = false;
  self.stopped = false;
  self.paused = false;
  self.pausedTime = null;
  self.pausedTotal = 0;
  self._speed = 1;
  self._oldSpeed = null;
  self._speedTotal = 0;
  self._speedTime = null;
  self._percent = 0;
  self._percentSet = null;
  self._percentDiff = 0;

  self.id = next_animate_id++;
};
_twaver.ext('twaver.Animate', Object, {
  play: function () {
    return playAnimate(this);
  },
  stop: function (end) {
    return stopAnimate(this, end);
  },
  pause: function () {
    if (!this.stopped) {
      this.paused = true;
    }
  },
  resume: function () {
    if (this.paused) {
      this.paused = false;
      need_animate = true;
    }
  },
  isPaused: function () {
    return this.paused;
  },
  percent: function (percent) {
    if (percent == null) {
      return this._percentSet || this._percent;
    }
    this._percentSet = percent < 0 ? 0 : (percent > 100 ? 100 : percent);
    if (this.paused) {
      need_animate = true;
    }
    if (!this.started) {
      this.play();
      this.pause();
    }
    return this;
  },
  speed: function (speed) {
    if (speed == null) {
      return this._speed;
    }
    speed = speed < 0 ? 1 : speed;
    if (speed !== this.speed) {
      if (!this.stopped) {
        this._oldSpeed = this._speed;
      }
      this._speed = speed;
    }
    return this;
  },
  clone: function () {
    return new Animate(this);
  },
  chain: function (animate) {
    var self = this,
      oldOnDone;
    self.next = animate;
    animate.pre = self;
    if (self.onDone) {
      oldOnDone = self.onDone;
      self.onDone = function () {
        oldOnDone.call(self);
        animate.play();
      };
    } else {
      self.onDone = function () {
        animate.play();
      };
    }
    return self;
  }
});

function playAnimate (animate) {
  if (!animates[animate.id]) {
    need_animate = true;
    animates[animate.id] = animate;

    if (animate.from == null && animate.attr && animate.source) {
      var match;
      if (match = animate.attr.match(/^S[:@](.*)/i)) {
        animate.from = animate.source.getStyle(match[1]);
      } else if (match = animate.attr.match(/^C[:@](.*)/i)) {
        animate.from = animate.source.getClient(match[1]);
      } else {
        animate.from = twaver.Util.getValue(animate.source, animate.attr);
      }
    }
    setDefaultValue(animate);
    refreshDelta(animate);
  }
  animate.resume();
  return animate;
}

function stopAnimate (animate, end) {
  if (animates[animate.id]) {
    (end == null) && (end = true);
    if (end) {
      updateAnimateValue(animate, animate.to);
    }
    if (animate.onStop) {
      animate.onStop();
    }
    animate.time = 0;
    animate.total = 0;
    animate.start = null;
    animate.count = 0;
    animate.started = false;
    animate.stopped = false;
    animate.paused = false;
    animate.pausedTime = null;
    animate.pausedTotal = 0;
    animate._oldSpeed = null;
    animate._speedTotal = 0;
    animate._speedTime = null;
    animate._percent = 0;
    animate._percentSet = null;
    animate._percentDiff = 0;
    delete animates[animate.id];
  }
  return animate;
}

function stopAllAnimates (end) {
  (end == null) && (end = true);
  Object.keys(animates).forEach(function (animateId) {
    var animate = animates[animateId];
    if (!animate) {
      return;
    }
    if (end) {
      updateAnimateValue(animate, animate.to);
    }
    if (animate.onStop) {
      animate.onStop();
    }
  });
  animates = {};
}

function pauseAllAnimates () {
  Object.keys(animates).forEach(function (animateId) {
    var animate = animates[animateId];
    if (!animate) {
      return;
    }
    animate.pause();
  });
}

function resumeAllAnimates () {
  Object.keys(animates).forEach(function (animateId) {
    var animate = animates[animateId];
    if (!animate) {
      return;
    }
    animate.resume();
  });
}

function doAnimate (time) {
  Object.keys(animates).forEach(function (animateId) {
    var animate = animates[animateId];
    if (!animate) {
      return;
    }
    (animate.start == null) && (animate._speedTime = animate.start = time);
    if (animate._percentSet != null) {
      animate._percentDiff += (animate._percentSet - animate._percent) * animate.finish;
    }
    if (animate.paused) {
      if (!animate.pausedTime) {
        animate.pausedTime = time;
      }
      if (animate._percentSet == null) {
        return;
      }
    }
    if (animate._percentSet == null && animate.pausedTime) {
      animate.pausedTotal += (time - animate.pausedTime) * (animate._oldSpeed || animate._speed);
      animate.pausedTime = null;
    }
    if (animate._oldSpeed && !animate.pausedTime) {
      animate._speedTotal = (time - animate._speedTime) * animate._oldSpeed - animate.pausedTotal + animate._percentDiff + animate._speedTotal;
      animate._percentDiff = 0;
      animate.pausedTotal = 0;
      animate._speedTime = time;
      animate._oldSpeed = null;
    }
    animate.total = (time - animate._speedTime) * animate._speed - animate.pausedTotal + animate._percentDiff + animate._speedTotal;
    if (animate._percentSet != null && animate.pausedTime) {
      animate.total -= (time - animate.pausedTime) * (animate._oldSpeed || animate._speed);
    }
    animate._percent = animate.total >= animate.finish ? 1 : animate.total / animate.finish;
    if (animate.total > animate.delay) {
      animate.time = animate.total - animate.delay;
      var stopped = false;
      if (animate.time >= animate.dur) {
        animate.time = animate.dur;
        stopped = true;
      }
      !animate.stopped && updateAnimateValue(animate, getAnimateValue(animate));
      animate.stopped = stopped;
      if (animate.total >= animate.finish) {
        animate.count++;
        if (animate.count >= animate.repeat) {
          stopAnimate(animate, false);
          animate.onDone && animate.onDone();
        } else {
          animate.time = 0;
          animate.total = 0;
          animate.start = null;
          animate.stopped = false;
          if (animate.reverse) {
            var from = animate.from;
            animate.from = animate.to;
            animate.to = from;
            refreshDelta(animate);
          }
        }
      }
    }
    if (!animate.paused) {
      !need_animate && (need_animate = true);
    }
    if (animate._percentSet != null) {
      animate._percentSet = null;
    }
  });
}

function updateAnimateValue (animate, value) {
  if (!animate.started) {
    animate.started = true;
    animate.onPlay && animate.onPlay();
  }
  animate.filter && (value = animate.filter(value));
  if (animate.attr && animate.source) {
    var match;
    if (match = animate.attr.match(/^S[:@](.*)/i)) {
      animate.source.setStyle(match[1], value);
    } else if (match = animate.attr.match(/^C[:@](.*)/i)) {
      animate.source.setClient(match[1], value);
    } else {
      twaver.Util.setValue(animate.source, animate.attr, value);
    }
  }
  if (animate.onUpdate) {
    animate.onUpdate(value);
  }
}

function setDefaultValue (animateItem) {
  var type = animateItem.type,
    from = animateItem.from,
    to = animateItem.to;
  if (type === 'number') {
    animateItem.from = from || 0;
    animateItem.to = to || 0;
  } else if (type === 'point') {
    if (from) {
      from.length && (animateItem.from = { x: from[0], y: from[1] });
    } else {
      animateItem.from = animateItem.attr === 'scale' ? { x: 1, y: 1 } : { x: 0, y: 0 };
    }
    if (to) {
      to.length && (animateItem.to = { x: to[0], y: to[1] });
    } else {
      animateItem.to = animateItem.attr === 'scale' ? { x: 1, y: 1 } : { x: 0, y: 0 };
    }
  } else if (type === 'rect') {
    if (from) {
      from.length && (animateItem.from = { x: from[0], y: from[1], w: from[2], h: from[3] });
    } else {
      animateItem.from = { x: 0, y: 0, w: 0, h: 0 };
    }
    if (to) {
      to.length && (animateItem.to = { x: to[0], y: to[1], w: to[2], h: to[3] });
    } else {
      animateItem.to = { x: 0, y: 0, w: 0, h: 0 };
    }
  } else if (type === 'color') {
    animateItem.from = getColorValue(from);
    animateItem.to = getColorValue(to);
  } else if (type === 'set') {
    // do nothing
  } else if (type === 'group_set') {
    // do nothing
  }
  animateItem.current = animateItem.from;
}

function refreshDelta (animateItem) {
  var type = animateItem.type,
    from = animateItem.from,
    to = animateItem.to;
  if (type === 'number') {
    animateItem.delta = to - from;
  } else if (type === 'point') {
    animateItem.delta = {
      x: to.x - from.x,
      y: to.y - from.y
    };
  } else if (type === 'rect') {
    animateItem.delta = {
      x: to.x - from.x,
      y: to.y - from.y,
      w: to.w - from.w,
      h: to.h - from.h
    };
  } else if (type === 'color') {
    animateItem.delta = { r: to.r - from.r, g: to.g - from.g, b: to.b - from.b, a: to.a - from.a };
  } else if (type === 'set') {
    // do nothing
  } else if (type === 'group_set') {
    // do nothing
  }
}

function getAnimateValue (animateItem, value) {
  var type = animateItem.type,
    delta = animateItem.delta,
    from = animateItem.from,
    time = animateItem.time,
    dur = animateItem.dur,
    easing = Easing[animateItem.easing || 'easeNone'];
  if (!easing) {
    easing = Easing.easeNone;
  }
  if (type === 'number') {
    value = easing(time, from, delta, dur);
  } else if (type === 'point') {
    value = {
      x: easing(time, from.x, delta.x, dur),
      y: easing(time, from.y, delta.y, dur)
    };
  } else if (type === 'rect') {
    value = {
      x: easing(time, from.x, delta.x, dur),
      y: easing(time, from.y, delta.y, dur),
      w: easing(time, from.w, delta.w, dur),
      h: easing(time, from.h, delta.h, dur)
    };
  } else if (type === 'color') {
    value = 'rgba(' +
      Math.floor(easing(time, from.r, delta.r, dur)) + ',' +
      Math.floor(easing(time, from.g, delta.g, dur)) + ',' +
      Math.floor(easing(time, from.b, delta.b, dur)) + ',' +
      Math.floor(easing(time, from.a, delta.a, dur)) + ')';
  } else if (type === 'set') {
    if (animateItem.time) {
      value = animateItem.to;
    }
  } else if (type === 'group_set') {
    value = animateItem.to[animateItem.groupIndex];
  }
  animateItem.current = value;
  return value;
}

var animates = {},
  next_animate_id = 1,
  need_animate = false;

(function animateLoop (time) {
  requestAnimationFrame(animateLoop);
  if (need_animate) {
    need_animate = false;
    doAnimate(time);
  }
})(0);
