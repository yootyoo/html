twaver.Styles = {
    _m: {},
    setStyle: function (styleProp, newValue) {
        if (newValue == null) {
            delete twaver.Styles._m[styleProp];
        } else {
            twaver.Styles._m[styleProp] = newValue;
        }
    },
    getStyle: function (styleProp) {
        return twaver.Styles._m[styleProp];
    },
    getStyleProperties: function () {
        return _twaver.keys(twaver.Styles._m);
    }
};

(function () {
    var r = function (name, type) {
        twaver.SerializationSettings.setPropertyType(name, type);
    };

    //r('id', 'string');
    r('name', 'cdata');
    r('name2', 'cdata');
    r('icon', 'string');
    r('toolTip', 'cdata');
    r('parent', 'data');
    r('layerId', 'string');
    r('alarmState', 'alarmstate');
    r('image', 'string');
    r('location', 'point');
    r('width', 'number');
    r('height', 'number');
    r('expanded', 'boolean');
    r('host', 'data');
    r('fromNode', 'data');
    r('toNode', 'data');
    r('points', 'list.point');
    r('segments', 'list.string');
    r('angle', 'number');
    r('visible', 'boolean');

    r = function (name, value, type) {
        if (type == null) {
            if (value != null) {
                type = typeof value;
            } else {
                type = 'string';
            }
        }
        twaver.Styles.setStyle(name, value);
        twaver.SerializationSettings.setStyleType(name, type);
    };

    // for chart style
    r('chart.color', null);
    r('chart.value', 0);
    r('chart.values', null, 'list.number');
    r('chart.value.color', '#000000');
    r('chart.value.font', null);
    r('chart.line.width', 2);
    r('chart.marker.size', 6);
    r('chart.marker.shape', 'circle'); // 'rectangle', 'oval', 'roundrect', 'star', 'triangle', 'circle', 'hexagon', 'pentagon', 'diamond'

    r('chart.bubble.shape', 'circle');
    r('chart.names', null, 'list.string');
    r('chart.xaxis.values', null, 'list.number');
    r('chart.yaxis.values', null, 'list.number');

    r('dialchart.rear.extension', 0);
    r('dialchart.base.width', 5);
    r('dialchart.top.width', 0);
    r('dialchart.radius', 0.8);

    // for network style
    r('inner.color', null);

    r('outer.shape', 'rectangle');
    r('outer.color', null);
    r('outer.width', 2);
    r('outer.padding', 1);
    r('outer.padding.left', 0);
    r('outer.padding.right', 0);
    r('outer.padding.top', 0);
    r('outer.padding.bottom', 0);
    r('outer.cap', 'butt');
    r('outer.join', 'miter');
    r('outer.style', 'null');//null, border, glow

    r('shadow.color', null);
    r('shadow.xoffset', 3);
    r('shadow.yoffset', 3);
    r('shadow.blur', 6);

    r('select.style', 'shadow');  // null,shadow,border
    r('select.color', 'rgba(0, 0, 0, 0.7)');
    r('select.shape', 'rectangle');
    r('select.width', 2);
    r('select.padding', 2);
    r('select.padding.left', 0);
    r('select.padding.right', 0);
    r('select.padding.top', 0);
    r('select.padding.bottom', 0);
    r('select.cap', 'butt');
    r('select.join', 'miter');

    r('whole.alpha', 1);
    r('body.type', 'default'); // 'none', 'default', 'vector', 'default.vector', 'vector.default'
    r('network.label', null, 'cdata');

    r('image.padding', 0);
    r('image.padding.left', 0);
    r('image.padding.right', 0);
    r('image.padding.top', 0);
    r('image.padding.bottom', 0);
    r('image.state', null);

    r('vector.shape', 'rectangle');
    r('vector.fill', true);
    r('vector.fill.color', '#CCCCFF');
    r('vector.outline.width', -1);
    r('vector.outline.pattern', null, 'array.number');
    r('vector.outline.color', '#5B5B5B');
    r('vector.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('vector.gradient.color', '#FFFFFF');
    r('vector.padding', 0);
    r('vector.padding.left', 0);
    r('vector.padding.right', 0);
    r('vector.padding.top', 0);
    r('vector.padding.bottom', 0);
    r('vector.cap', 'butt');
    r('vector.join', 'miter');
    r('vector.deep', 0);

    r('group.shape', 'rectangle');
    r('group.fill', true);
    r('group.fill.color', '#CCCCFF');
    r('group.outline.width', -1);
    r('group.outline.color', '#5B5B5B');
    r('group.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('group.gradient.color', '#FFFFFF');
    r('group.padding', 5);
    r('group.padding.left', 0);
    r('group.padding.right', 0);
    r('group.padding.top', 0);
    r('group.padding.bottom', 0);
    r('group.cap', 'butt');
    r('group.join', 'miter');
    r('group.deep', 1);
    r('group.shape.roundrect.radius', -1);

    r('label.alpha', 1);
    r('label.color', '#000000');
    r('label.font', null);
    r('label.position', 'bottom.bottom'); // 'topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'
    r('label.direction', 'below');
    r('label.corner.radius', 0);
    r('label.pointer.length', 0);
    r('label.pointer.width', 8);
    r('label.xoffset', 0);
    r('label.yoffset', 2);
    r('label.padding', 0);
    r('label.padding.left', 0);
    r('label.padding.right', 0);
    r('label.padding.top', 0);
    r('label.padding.bottom', 0);
    r('label.fill', false);
    r('label.fill.color', '#C0C0C0');
    r('label.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('label.gradient.color', '#FFFFFF');
    r('label.outline.width', -1);
    r('label.outline.color', '#000000');
    r('label.cap', 'butt');
    r('label.join', 'miter');
    r('label.shadowable', true);
    r('label.align', 'center');//'left','right','center'
    r('link.label.rotatable', false);

    r('label2.alpha', 1);
    r('label2.color', '#000000');
    r('label2.font', null);
    r('label2.position', 'top.top'); // 'topleft.topleft', 'top.top', 'topright.topright', 'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft', 'bottomright.bottomright'
    r('label2.direction', 'below');
    r('label2.corner.radius', 0);
    r('label2.pointer.length', 0);
    r('label2.pointer.width', 8);
    r('label2.xoffset', 0);
    r('label2.yoffset', -2);
    r('label2.padding', 0);
    r('label2.padding.left', 0);
    r('label2.padding.right', 0);
    r('label2.padding.top', 0);
    r('label2.padding.bottom', 0);
    r('label2.fill', false);
    r('label2.fill.color', '#C0C0C0');
    r('label2.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('label2.gradient.color', '#FFFFFF');
    r('label2.outline.width', -1);
    r('label2.outline.color', '#000000');
    r('label2.cap', 'butt');
    r('label2.join', 'miter');
    r('label2.shadowable', true);
    r('link.label2.rotatable', false);

    r('icons.names', null, 'array.string');
    r('icons.colors', null, 'array.string');
    r('icons.position', null,'array.string');
    r('icons.orientation',null, 'array.string');
    r('icons.xoffset', [0],'array.number');
    r('icons.yoffset', [0],'array.number');
    r('icons.xgap', [1],'array.number');
    r('icons.ygap', [1],'array.number');

    r('alarm.alpha', 1);
    r('alarm.color', '#000000');
    r('alarm.font', null);
    r('alarm.position', 'hotspot');
    r('alarm.direction', 'aboveright');
    r('alarm.corner.radius', 5);
    r('alarm.pointer.length', 10);
    r('alarm.pointer.width', 8);
    r('alarm.xoffset', 0);
    r('alarm.yoffset', 0);
    r('alarm.padding', 0);
    r('alarm.padding.left', 0);
    r('alarm.padding.right', 0);
    r('alarm.padding.top', 0);
    r('alarm.padding.bottom', 0);
    r('alarm.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('alarm.gradient.color', '#FFFFFF');
    r('alarm.outline.width', -1);
    r('alarm.outline.color', '#000000');
    r('alarm.cap', 'butt');
    r('alarm.join', 'miter');
    r('alarm.shadowable', true);

    r('link.color', '#658DC1');
    r('link.width', 3);
    r('link.cap', 'butt');
    r('link.join', 'miter');
    r('link.type', 'arc'); // 'arc', 'triangle', 'parallel', 'flexional', 'flexional.horizontal', 'flexional.vertical',
    // 'orthogonal', 'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V', 'orthogonal.V.H'
    // 'extend.top', 'extend.left', 'extend.bottom', 'extend.right'
    r('link.pattern', null, 'array.number');
    r('link.extend', 20);
    r('link.control.point', null, 'point');
    r('link.bundle.id', 0);
    r('link.bundle.enable', true);
    r('link.bundle.expanded', true);
    r('link.bundle.independent', false);
    r('link.bundle.offset', 20);
    r('link.bundle.gap', 12);
    r('link.bundle.group.gap', 0);

    r('link.looped.gap', 6);
    r('link.looped.direction', 'northwest'); // 'northwest', 'north', 'northeast', 'east', 'west', 'south', 'southwest', 'southeast'
    r('link.looped.type', 'arc'); // 'arc', 'rectangle'
    r('link.from.position', 'center');
    r('link.from.xoffset', 0);
    r('link.from.yoffset', 0);
    r('link.from.at.edge', true);
    r('link.to.position', 'center');
    r('link.to.xoffset', 0);
    r('link.to.yoffset', 0);
    r('link.to.at.edge', true);
    r('link.split.by.percent', true);
    r('link.split.percent', 0.5);
    r('link.split.value', 20);
    r('link.corner', 'round'); // 'none', 'round', 'bevel'
    r('link.xradius', 8);
    r('link.yradius', 8);
    r('link.flow', false);
    r('link.flow.converse', false);
    

    r('link.handler.alpha', 1);
    r('link.handler.color', '#000000');
    r('link.handler.font', null);
    r('link.handler.position', 'topleft.topleft');
    r('link.handler.direction', 'below');
    r('link.handler.corner.radius', 0);
    r('link.handler.pointer.length', 0);
    r('link.handler.pointer.width', 8);
    r('link.handler.xoffset', 0);
    r('link.handler.yoffset', 0);
    r('link.handler.padding', 0);
    r('link.handler.padding.left', 0);
    r('link.handler.padding.right', 0);
    r('link.handler.padding.top', 0);
    r('link.handler.padding.bottom', 0);
    r('link.handler.fill', false);
    r('link.handler.fill.color', '#C0C0C0');
    r('link.handler.gradient', 'none'); // 'linear.east', 'linear.north', 'linear.northeast', 'linear.northwest', 'linear.south', 'linear.southeast', 'linear.southwest', 'linear.west', 'none', 'radial.center', 'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest', 'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west', 'spread.antidiagonal', 'spread.diagonal', 'spread.east', 'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical', 'spread.west'
    r('link.handler.gradient.color', '#FFFFFF');
    r('link.handler.outline.width', -1);
    r('link.handler.outline.color', '#000000');
    r('link.handler.cap', 'butt'); // 'butt', 'round', 'square'
    r('link.handler.join', 'miter'); // 'miter', 'round', 'bevel'
    r('link.handler.shadowable', true);

    r('follower.row.index', 0);
    r('follower.column.index', 0);
    r('follower.row.span', 1);
    r('follower.column.span', 1);
    r('follower.padding', 0);
    r('follower.padding.left', 0);
    r('follower.padding.right', 0);
    r('follower.padding.top', 0);
    r('follower.padding.bottom', 0);
    r('follower.fill.cell', true);
    r('follower.cell.position', 'center');

    r('grid.row.count', 1);
    r('grid.column.count', 1);
    r('grid.row.percents', null, 'array.number');
    r('grid.column.percents', null, 'array.number');
    r('grid.border', 1);
    r('grid.border.left', 0);
    r('grid.border.right', 0);
    r('grid.border.top', 0);
    r('grid.border.bottom', 0);
    r('grid.padding', 1);
    r('grid.padding.left', 0);
    r('grid.padding.right', 0);
    r('grid.padding.top', 0);
    r('grid.padding.bottom', 0);
    r('grid.fill', true);
    r('grid.fill.color', '#C0C0C0');
    r('grid.deep', 1);
    r('grid.cell.deep', -1);

    r('shapelink.type', 'lineto'); // 'lineto', 'quadto', 'cubicto'

    r('shapenode.closed', false);
    r('shapenode.pattern', null, 'array.number');

    r('bus.style', 'nearby'); // 'nearby', 'north', 'south', 'west', 'east'

    // Arrow
    r('arrow.from', false);
    r('arrow.from.fill', true);
    r('arrow.from.shape', 'arrow.standard'); // 'arrow.standard', 'arrow.delta', 'arrow.diamond', 'arrow.short', 'arrow.slant'
    r('arrow.from.color', '#000000');
    r('arrow.from.xoffset', 0);
    r('arrow.from.yoffset', 0);
    r('arrow.from.width', 12);
    r('arrow.from.height', 9);
    r('arrow.from.outline.color', '#000000');
    r('arrow.from.outline.width', -1);
    r('arrow.from.at.edge', true);
    r('arrow.from.shadow', false);
    r('arrow.from.shadow.color', '#000000');
    r('arrow.from.shadow.xoffset', 0);
    r('arrow.from.shadow.yoffset', 0);
    r('arrow.from.shadow.blur', 16);

    r('arrow.to', false);
    r('arrow.to.fill', true);
    r('arrow.to.shape', 'arrow.standard'); // 'arrow.standard', 'arrow.delta', 'arrow.diamond', 'arrow.short', 'arrow.slant'
    r('arrow.to.color', '#000000');
    r('arrow.to.xoffset', 0);
    r('arrow.to.yoffset', 0);
    r('arrow.to.width', 12);
    r('arrow.to.height', 9);
    r('arrow.to.outline.color', '#000000');
    r('arrow.to.outline.width', -1);
    r('arrow.to.at.edge', true);

    r("background.image",null);
    r("background.type","none"); //'none','image','vector','image.vector','vector.image'
    r("background.outline.width",-1);
    r("background.outline.color",null);
    r("background.vector.padding",0);
    r("background.image.padding",0);
    r("background.image.stretch","fill");//"fill","tile","none"
    r("background.vector.fill",null);
    r("background.vector.fill.color",null);
    r("background.vector.gradient",false);
    r("background.vector.gradient.color",null);
    r("background.vector.shape","rectangle");
    r('background.outline.pattern', null, 'array.number');

    r('attachment.label.style','html');//'none', 'html'
    r('attachment.alarm.style','html');
})();
_twaver.ext('twaver.Styles', Object, {});
