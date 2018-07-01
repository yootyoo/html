function refreshAnimate (shapeData, vector, data, view) {
  var animate = shapeData.animate,
    now = view._now,
    shapeDataIndex = view._shapeDataIndex,
    index;
  var animates = data._animates;
  if (!animates) {
    animates = data._animates = {};
  }
  if (shapeDataIndex.length) {
    for (var i=0; i<shapeDataIndex.length; i++) {
      index = shapeDataIndex[i];
      var baseAnimates = animates[index];
      if (!baseAnimates) {
        baseAnimates = animates[index] = {};
      }
      animates = baseAnimates;
    }
  } else {
    index = shapeDataIndex;
  }
  var newAnimate = animates[index];
  if (!newAnimate) {
    newAnimate = animates[index] = {};
    animate.forEach(function (animateItem) {
      var prop = animateItem.attr,
        oldItem = newAnimate[prop],
        from;
      animateItem = {
        attr: prop,
        to: animateItem.to,
        type: animateItem.type || 'number',
        delay: animateItem.delay || 0,
        dur: animateItem.dur || 1000,
        interval: animateItem.interval || 0,
        finish: animateItem.finish,
        repeat: animateItem.repeat || 1,
        reverse: animateItem.reverse == null ? true : animateItem.reverse,
        onDone: animateItem.onDone,
        easing: animateItem.easing,
        trigger: animateItem.to == null,
        
        start: now,
        time: 0,
        total: 0,
        count: 0,
        started: false,
        stopped: false,
        current: null
      };
      if (Array.isArray(animateItem.dur)) {
        animateItem.groupDur = animateItem.dur.slice(0, animateItem.dur.length - 1);
        animateItem.dur = animateItem.dur[animateItem.dur.length - 1];
        animateItem.groupDurTotal = animateItem.groupDur.reduce(function (pre, item, index) {
          return animateItem.groupDur[index] = pre + item;
        }, 0);
        animateItem.groupIndex = 0;
        animateItem.groupTime = 0;
        animateItem.groupStart = now;
      }
      (animateItem.finish == null) && (animateItem.finish = animateItem.delay + animateItem.dur + animateItem.interval);
      if (!oldItem) {
        from = getVectorValue(data, vector, shapeData, prop, view);
        newAnimate[prop] = animateItem;
      } else if (Array.isArray(oldItem)) {
        oldItem.push(animateItem);
        oldItem = oldItem[oldItem.length - 2];
      } else {
        newAnimate[prop] = [ oldItem, animateItem ];
      }
      if (oldItem) {
        from = oldItem.to;
        if (oldItem.type === 'group_set') {
          from = from[from.length - 1];
        }
      }
      animateItem.from = from;
      if (!animateItem.trigger) {
        animateItem.started = true;
        setDefaultValue(animateItem);
        refreshDelta(animateItem);
      }
    });
  }

  animate = newAnimate;
  Object.keys(animate).forEach(function (attr) {
    var animateItem = animate[attr];
    if (Array.isArray(animateItem)) {
      var lastAnimateItem = animateItem[animateItem.length - 1];
      if (lastAnimateItem.count + 1 === lastAnimateItem.repeat) {
        animateItem.forEach(function (animateItem) {
          refreshAnimateItem(animateItem, shapeData, vector, data, view, true);
        });
      } else if (lastAnimateItem.count + 1 < lastAnimateItem.repeat) {
        if (lastAnimateItem.total >= lastAnimateItem.finish) {
          animateItem.forEach(function (animateItem) {
            if (!animateItem.trigger) {
              animateItem.started = true;
            }
            animateItem.stopped = false;
            animateItem.time = 0;
            animateItem.start = now;
            animateItem.total = 0;
            if (animateItem.type === 'group_set') {
              animateItem.groupIndex = 0;
              animateItem.groupTime = 0;
              animateItem.groupStart = now;
            }
          });
        }
        animateItem.forEach(function (animateItem) {
          refreshAnimateItem(animateItem, shapeData, vector, data, view, false);
        });
      }
    } else {
      refreshAnimateItem(animateItem, shapeData, vector, data, view, true);
    }
  });
}

function refreshAnimateItem (animateItem, shapeData, vector, data, view, end) {
  if (animateItem.trigger) {
    var to = getVectorValue(data, vector, shapeData, animateItem.attr, view, null, false);
    if (!animateItem.started) {
      if (to === animateItem.from) {
        return;
      } else {
        animateItem.started = true;
        animateItem.start = view._now;
        animateItem.to = to;
        setDefaultValue(animateItem);
        refreshDelta(animateItem);
      }
    }
    if (animateItem.started && to !== animateItem.to) {
        animateItem.start = view._now;
        animateItem.from = animateItem.current;
        animateItem.to = to;
        animateItem.time = 0;
        animateItem.total = 0;
        animateItem.count = 0;
        setDefaultValue(animateItem);
        refreshDelta(animateItem);
    }
  }
  if (animateItem.started && !animateItem.stopped) {
    var now = view._now;
    var time = now - animateItem.start;
    if (time >= animateItem.delay) {
      animateItem.total = time;
      time = time - animateItem.delay;
      animateItem.time = time > animateItem.dur ? animateItem.dur : time;
      if (animateItem.type === 'group_set') {
        animateItem.groupTime = now - animateItem.groupStart;
        if (animateItem.groupStart === animateItem.start) {
          animateItem.groupTime -= animateItem.delay;
        }
        if (animateItem.groupTime >= animateItem.groupDur[animateItem.groupIndex]) {
          animateItem.groupIndex++;
          //console.log(time, animateItem.groupTime, animateItem.groupIndex);
        }
        if (animateItem.groupTime >= animateItem.groupDurTotal) {
          animateItem.groupIndex = 0;
          animateItem.groupTime = animateItem.groupTime - animateItem.groupDurTotal;
          animateItem.groupStart = now;
        }
        //console.log(time, animateItem.groupTime, animateItem.groupStart, animateItem.start, animateItem.groupIndex);
      }
      if (animateItem.total >= animateItem.finish) {
        animateItem.count++;
        if (animateItem.type === 'group_set') {
          /*animateItem.groupIndex = 0;
          animateItem.groupTime = 0;
          animateItem.groupStart = now;*/
        }
        if (animateItem.count >= animateItem.repeat) {
          animateItem.time = animateItem.dur;
          animateItem.stopped = true;
          if (animateItem.trigger) {
            animateItem.from = animateItem.to;
            animateItem.to = null;
            animateItem.start = null;
            animateItem.time = 0;
            animateItem.total = 0;
            animateItem.count = 0;
            animateItem.started = false;
            animateItem.stopped = false;
          }
          animateItem.onDone && animateItem.onDone.call(vector, data, view);
        } else if (end) {
          animateItem.time = 0;
          animateItem.start = now;
          animateItem.total = 0;
          if (animateItem.reverse) {
            var from = animateItem.from;
            animateItem.from = animateItem.to;
            animateItem.to = from;
            refreshDelta(animateItem);
          }
        }
      }
    }
    view && !view._invalidate && (view._invalidate = true);
  }
}
