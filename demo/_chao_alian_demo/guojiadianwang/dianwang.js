function createNode(box, name, img, x, y) {
    var node = new twaver.Node();
    node.setName(name);
    node.setImage(img);
    node.setLocation(x, y);
    box.add(node);
    return node;
}

function loadData(json) {
    json.features.forEach(function(feature) {
        var node = new twaver.ShapeSubNetwork(feature.id);

        node.setStyle('vector.fill', true)
            .setStyle('vector.fill.color', '#474753')
            .setStyle('vector.outline.color', '#9ab0e6')
            .setStyle('select.color', '#FFFFFF')
            .setStyle('vector.outline.width', 1);
        // s('vector.gradient','radial.southeast').
        // s('vector.gradient.color','#CF0000');
        node.setToolTip(feature.properties.name);
        var segments = new twaver.List();
        var points = new twaver.List();

        if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(function(polygon) {
                polygon.forEach(function(coordinate) {
                    segments.add('moveto');
                    coordinate.forEach(function(point, i) {
                        if (i !== 0) {
                            segments.add('lineto');
                        }
                        points.add(convertPoint(point));
                        // points.add(point);
                    });
                });
            });
        } else if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(function(coordinate) {
                segments.add('moveto');
                coordinate.forEach(function(point, i) {
                    if (i !== 0) {
                        segments.add('lineto');
                    }
                    points.add(convertPoint(point));
                    // points.add(point);
                });
            });
        } else {
            console.log(feature.geometry.type);
        }

        node.setSegments(segments);
        node.setPoints(points);
        // node.setName('广电总局');
        box.add(node);
    });
}

function convertPoint(point) {
    return { x: (point[0] - 117) * 100, y: (-point[1] + 31.7) * 100 };
    // return { x: (point[0] - 120.15) * 100, y: (-point[1] + 30.29) * 100 };
    // return { x: (point[0] - 103.82) * 100, y: (-point[1] + 36.06) * 100 };
    // return { x: (point[0]) * 100, y: (-point[1]) * 100 };
}
//解码
function decode(json) {
    if (!json.UTF8Encoding) {
        return json;
    }
    var features = json.features;
    var i, j, k, l;

    for (var f = 0; f < features.length; f++) {
        var feature = features[f];
        var geometry = feature.geometry;
        var coordinates = geometry.coordinates;
        var encodeOffsets = geometry.encodeOffsets;
        var properties1 = feature.properties;

        for (var c = 0; c < coordinates.length; c++) {
            var coordinate = coordinates[c];

            if (geometry.type === 'Polygon') {
                // console.log("_+_+_+_+_+_+"+ properties1.name);
                coordinates[c] = decodePolygon(
                    coordinate,
                    encodeOffsets[c]
                );
            } else if (geometry.type === 'MultiPolygon') {
                // console.log("()(()()()()()()()()()()("+properties1.name);
                for (var c2 = 0; c2 < coordinate.length; c2++) {
                    // if(properties1.name === "浙江"){
                    //     console.log("~~~~~~~~~~~");
                    // }
                    var polygon = coordinate[c2];
                    coordinate[c2] = decodePolygon(
                        polygon,
                        encodeOffsets[c][c2]
                    );
                }
            }
        }
    }
    // Has been decoded
    json.UTF8Encoding = false;

    for(i=0;i<json.features.length;i++){
        var properties = json.features[i].properties;
        if(properties.name==="福建"){
            for(j=0;j<json.features[i].geometry.coordinates.length;j++){
                for(k=0;k<json.features[i].geometry.coordinates[j].length;k++){
                    for(l=0;l<json.features[i].geometry.coordinates[j][k].length;l++){
                        console.log(json.features[i].geometry.coordinates[j][k][l][0]+"~~~~~~~~~~~~~"+json.features[i].geometry.coordinates[j][k][l][1]);
                    }
                }
            }
        }
    }
    return json;
}
//解码 多边形
function decodePolygon(coordinate, encodeOffsets) {
      var features = json.features;
    // var feature = features[f];
    // var geometry = feature.geometry;
    // var coordinates = geometry.coordinates;
    // var encodeOffsets = geometry.encodeOffsets;

    var result = [];
    var prevX = encodeOffsets[0];
    var prevY = encodeOffsets[1];

    for (var i = 0; i < coordinate.length; i += 2) {
        var x = coordinate.charCodeAt(i) - 64;
        var y = coordinate.charCodeAt(i + 1) - 64;
        // ZigZag decoding
        x = (x >> 1) ^ (-(x & 1));
        y = (y >> 1) ^ (-(y & 1));
        // Delta deocding
        x += prevX;
        y += prevY;

        prevX = x;
        prevY = y;
        // Dequantize
        result.push([x / 1024, y / 1024]);
    }

    return result;
}
