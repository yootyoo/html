
var EARTH_RADIUS = 6378137 ;
var MERCATOR_MINLATITUDE = -85.05112878;
var MERCATOR_MAXLATITUDE = 85.05112878;
var P4326_MINLATITUDE = -90;
var P4326_MAXLATITUDE = 90;

var MINLONGITUDE = -180;
var MAXLONGITUDE = 180;
var imageFormat = "png";
/**
		 * Gets the distance on the ground that's represented by a single pixel int the map.
		 * or example, at a ground resolution of 10 meters/pixel, each pixel represents a 
		 * ground distance of 10 meters. The ground resolution varies depending on the level
		 *  of detail and the latitude at which it’s measured
		 **/
var getMercatorGroundResolution = function(zoomLevel,latitude){
    // cos(latitude * pi/180) * earth circumference / map width
    // unit is meters;
			
    return (Math.cos(latitude * Math.PI/180) * 2 * Math.PI * EARTH_RADIUS) / (256 * Math.pow(2,zoomLevel));
};
var getMapSize = function(zoom,tileSize)
{
    return  (tileSize << zoom);
};
var getMercatorPixels = function(zoomLevel,tileWidth,tileHeight){
    var width = tileWidth * Math.pow(2,zoomLevel);
    var height = tileHeight * Math.pow(2,zoomLevel);
    return new twaver.gis.geometry.Dimensize(width,height);
};
			
		
var getMercatorTileCol = function(longitude, zoomLevel,tileWidth){
    var pixelX  = lngToMercatorPixelX(longitude,zoomLevel,tileWidth);
    return Math.floor(pixelX/tileWidth);
};
var getMercatorTileRow = function(latitude,zoomLevel,tileHeight){
    var pixelY = latToMercatorPixelY(latitude,zoomLevel,tileHeight);
    return Math.floor(pixelY / tileHeight);
};
		
var getQuadkey = function(col,row,zoomLevel){
    var quadkey = "";
    for (var i = zoomLevel; i > 0; i--)
    {
        var digit = 0;
        var mask = 1 << (i - 1);
        if ((col & mask) != 0)
        {
            digit++;
        }
        if ((row & mask) != 0)
        {
            digit++;
            digit++;
        }
        quadkey += digit;
    }
			
    return quadkey;
}
var quadKeyToTileXY = function(quadKey)
{
    var col = 0;
    var row = 0;
    var zoomLevel = quadKey.length;
    for (var i = zoomLevel; i > 0; i--)
    {
        var mask  = 1 << (i - 1);
        switch (quadKey.charAt(zoomLevel - i))
        {
            case '0':
                break;
					
            case '1':
                col |= mask;
                break;
					
            case '2':
                row |= mask;
                break;
					
            case '3':
                col |= mask;
                row |= mask;
                break;
					
            default:
                break
        }
    }
    return {
        x:col,
        y:row
    };
}
		
/***********************************************************************************/
var getMatrixArea = function(zoomLevel,projectionType){
    switch(projectionType){
        case GISConsts.PROJECTION_MERCATOR:
            var ww = Math.pow(2,zoomLevel);
            return new twaver.gis.geometry.Dimensize(ww,ww);
        case GISConsts.PROJECTION_EDUSHI:
            var area = getFakeMapArea();
            //					var zoomUpLimit = area.length;
            if((zoomLevel===undefined)||(zoomLevel==null)){
            	return null;
            }
            return new twaver.gis.geometry.Dimensize(area[zoomLevel][2]+1,area[zoomLevel][3]+1);;
        default:
            var h = Math.pow(2,zoomLevel);
            var w = 2 * h;
            return new twaver.gis.geometry.Dimensize(w,h);
    }
}
var getPixels = function(zoomLevel,projectionType,tileWidth,tileHeight){
    tileWidth = tileWidth? tileWidth : 256;
    tileHeight = tileHeight? tileHeight:256;
    switch(projectionType){
        case GISConsts.PROJECTION_EDUSHI:
            return getFake3DMapPixels(zoomLevel,tileWidth,tileHeight);
        case GISConsts.PROJECTION_MERCATOR:
            return getMercatorPixels(zoomLevel,tileHeight,tileHeight);
        default:
            return  get4326Pixels(zoomLevel,tileWidth,tileHeight);
    }
}
var lngToMercatorPixelX = function(longitude,zoomLevel,tileWidth){
    longitude = clip(longitude, MINLONGITUDE, MAXLONGITUDE);
    var x = (longitude + 180) / 360; 
    var mapSize = getMapSize(zoomLevel,tileWidth);
    return Math.floor(clip(x * mapSize + 0.5, 0, mapSize - 1)) ;
}
var latToMercatorPixelY = function(latitude,zoomLevel,tileHeight){
    latitude = clip(latitude, 
        MERCATOR_MINLATITUDE, MERCATOR_MAXLATITUDE);
    var sinLatitude = Math.sin(latitude * Math.PI / 180);
    var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    var mapSize = getMapSize(zoomLevel,tileHeight);
    return Math.floor(clip(y * mapSize + 0.5, 0, mapSize - 1)) ;
}
var lngToMercatorCol = function(longitude,zoomLevel,tileWidth){
    return Math.floor(lngToMercatorPixelX(longitude,zoomLevel,tileWidth)/tileWidth);
}
var latToMercatorRow = function(latitude,zoomLevel,tileHeight){
    return Math.floor(latToMercatorPixelY(latitude,zoomLevel,tileHeight)/tileHeight);
}
var colToLngMercator = function(col,zoom) {
    return col / Math.pow(2.0, zoom) * 360.0 - 180;
}
var getMercatorTile = function(zoomLevel,coordinate,tileWidth,tileHeight) {
    var col = lngToMercatorCol(coordinate.longitude, zoomLevel);
    var row = latToMercatorRow(coordinate.latitude, zoomLevel);
    var tile = new Tile(GISConsts.PROJECTION_MERCATOR,row, col,zoomLevel,tileWidth,tileHeight);
    return tile;
}
var calculateMercatorTilePixelBounds = function(tile){			
    var minx = tile.width * (tile.colIndex -1);
    var miny = tile.height * (tile.rowIndex -1);
    var maxx = tile.width + minx;
    var maxy = tile.height + miny;
    tile.pixelBounds = new twaver.gis.geometry.Bounds(minx,maxx,miny,maxy);
			
}
		
var getFake3DMapPixelXYFromGeoPoint = function(latitude,longitude,
    zoomLevel, tileWidth,tileHeight) {
    var size = getFake3DMapPixels(zoomLevel,tileWidth,tileHeight);
    var x = size.width  * longitude/100;
    var y = size.height * latitude/100;			
    return {x:x,y:y};
}
var getMercatorPixelXYFromGeoPoint = function(latitude, longitude,
    zoomLevel, tileWidth,tileHeight) {
    var pixelx = lngToMercatorPixelX(longitude,zoomLevel,tileWidth);
    var pixely = latToMercatorPixelY(latitude,zoomLevel,tileHeight);
    return {x:pixelx,y:pixely};
}
var getMercatorGeoPointFromPixelXY = function(pixelX,pixelY,
    zoomLevel,tileWidth,tileHeight){
    var mapSize = getMapSize(zoomLevel,tileWidth);
    var x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    var y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);
    var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    var longitude = 360 * x;
    return new twaver.gis.geometry.GeoCoordinate(latitude,longitude);

}

var clip = function(n, minValue, maxValue) {
    return Math.min(Math.max(n, minValue), maxValue);
}
	
var geoCoordinateOfMercatorPixelXY = function(x, y,level) {
    var latitude = 0, longitude = 0;
    var mapSize = getMapSize(level,256);
    x = (clip(x, 0, mapSize - 1) / mapSize) - 0.5;
    y = 0.5 - (clip(y, 0, mapSize - 1) / mapSize);
    latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    longitude = 360 * x;
    return new twaver.gis.geometry.GeoCoordinate(latitude,longitude);
}

	
var getMercatorScreenPointFromGeoPoint = function(geoPoint,
    viewRect,zoomLevel,
    tileWidth,tileHeight){
    var pixelx = lngToMercatorPixelX(geoPoint.longitude,zoomLevel,tileWidth);
    var pixely = latToMercatorPixelY(geoPoint.latitude,zoomLevel,tileHeight);
    return {
        x:pixelx - viewRect.minx,
        y:pixely - viewRect.miny
    };
}
		
/****************************************************************************************/
		
var getTileBbox = function(projectionType, zoom, col, row) {
    var result = null;
    if (GISConsts.PROJECTION_MERCATOR == projectionType) {
    //				result = getMercatorTileBBox(zoom, col, row);
    } else if (GISConsts.PROJECTION_4326 == projectionType) {
        result = get4326TileBBox(zoom, col, row);
    }
    return result;
}
		
var calculateTilePixelBounds = function(tile,projectionType){
    if(tile != null){
        if(GISConsts.PROJECTION_4326 == projectionType){
            calculate4326TilePixelBounds(tile);
        }else{
            calculateMercatorTilePixelBounds(tile);
        }
    }
    return tile.pixelBounds;			
}
var getTileOfGeoPoint = function(geoPoint,zoomLevel,
    projectionType,tileWidth,tileHeight){
    if(GISConsts.PROJECTION_4326 == projectionType){
        return get4326Tile(zoomLevel,geoPoint,tileWidth,tileHeight);
    }else{
        return getMercatorTile(zoomLevel,geoPoint,tileWidth,tileHeight);
    }
			
}
var getTileOfPixelXY = function(pixelx,pixely,zoomLevel,
    projectionType,tileWidth,tileHeight){
        tileWidth = !tileWidth? 256:tileWidth;
        tileHeight = !tileHeight? 256:tileHeight;
        var row = pixelYToRow(pixely,projectionType,tileHeight);
        var col = pixelXToCol(pixelx,tileWidth);
    return new Tile(projectionType,row,col,zoomLevel,tileWidth,tileHeight);
			
}
		
var getScreenPointFromGeoPoint = function(geoPoint,
    viewRect,zoomLevel,
    projectionType,tileWidth,tileHeight){
        tileWidth = !tileWidth? 256:tileWidth;
        tileHeight = !tileHeight? 256:tileHeight;
    switch(projectionType){
        case GISConsts.PROJECTION_MERCATOR:
            return getMercatorScreenPointFromGeoPoint(geoPoint,viewRect,zoomLevel,tileWidth,tileHeight);
        case GISConsts.PROJECTION_EDUSHI:
            return getFakeMapScreenPointFromGeoPoint(geoPoint,viewRect,zoomLevel,tileWidth,tileHeight);
        default:
            return get4326ScreenPointFromGeoPoint(geoPoint,viewRect,zoomLevel,tileWidth,tileHeight);
    }
}
var getGeoPointFromPixelXY = function(pixelx,pixely,
    zoomLevel,projectionType,
    tileWidth,tileHeight){
    var diz = getPixels(zoomLevel,projectionType,tileWidth,tileHeight);
    if((pixelx<=0)||(pixelx>diz.width)||(pixely<0)||(pixely>diz.height)){
        return new twaver.gis.geometry.GeoCoordinate(-200,-200);
    }
    tileWidth = !tileWidth? 256:tileWidth;
    tileHeight = !tileHeight? 256:tileHeight;
    switch(projectionType){
        case GISConsts.PROJECTION_MERCATOR:
            return getMercatorGeoPointFromPixelXY(pixelx,pixely,zoomLevel,tileWidth,tileHeight);
        case GISConsts.PROJECTION_EDUSHI:
            return getFakeMapGeoFromPixel(pixelx,pixely,zoomLevel,tileWidth,tileHeight);
        default:
            return get4326GeoPointFromPixelXY(pixelx,pixely,zoomLevel,tileWidth,tileHeight);
    }
}
var getGeoPointFromScreenPoint = function(x,y,viewRect,
    											zoomLevel,projectionType,
   												tileWidth,tileHeight){
    var pixelx = x + viewRect.minx;
    var pixely = y + viewRect.miny;
    if(projectionType == GISConsts.PROJECTION_4326){
        pixely = viewRect.maxy - y;
    }			
    return getGeoPointFromPixelXY(pixelx,pixely,zoomLevel,projectionType,tileWidth,tileHeight);
}
var getPixelAreaFromBBox = function(bbox,viewRect,zoomLevel,projectionType,tileWidth,tileHeight){
	var minLat = getPixelXYFromGeoPoint(bbox.miny,viewRect,zoomLevel,projectionType,tileWidth,tileHeight);
	var maxLat = getPixelXYFromGeoPoint(bbox.maxy,vierRect,zoomLevel,projectionType,tileWidth,tileHeight);
	var minLng = getPixelXYFromGeoPoint(bbox.minx,viewRect,zoomLevel,projectionType,tileWidth,tileHeight);
	var maxLng = getPixelXYFromGeoPoint(bbox.maxx,viewRect,zoomLevel,projectionType,tileWidth,tileHeight);
	return new twaver.gis.geometry.Bounds(minLng,maxLng,minLat,maxLat);
}
var getPixelXYFromGeoPoint = function(geoPoint,
    zoomLevel,projectionType,
    tileWidth,tileHeight){
        tileWidth = tileWidth? tileWidth:256;
        tileHeight = tileHeight? tileHeight:256;
    switch(projectionType){
        case GISConsts.PROJECTION_EDUSHI:
            return getFake3DMapPixelXYFromGeoPoint(geoPoint.latitude,geoPoint.longitude,zoomLevel,tileWidth,tileHeight);
        case GISConsts.PROJECTION_MERCATOR:
            return getMercatorPixelXYFromGeoPoint(geoPoint.latitude,geoPoint.longitude,zoomLevel,tileWidth,tileHeight);
        default:
            return get4326PixelXYFromGeoPoint(geoPoint,zoomLevel,tileWidth,tileHeight);
    }
}
//*****************************************************************************************//
var getFake3DMapPixels = function(zoomLevel,tileWidth,tileHeight){
    var startLevel = GISUtils.getNumberValue(GISSettings.FAKE_3D_ZOOM_STARTLEVEL);
    // // var iniGrid = getFakeMapArea();
    // var r = Math.pow(2, startLevel+zoomLevel);
    // var width = r * tileWidth;
    // var height = r * tileHeight;
    var area = getFakeMapArea();
    var rs = (area[zoomLevel][2] - area[zoomLevel][0]);
    var cs = (area[zoomLevel][3] - area[zoomLevel][1]);
    return new twaver.gis.geometry.Dimensize(rs*tileWidth,cs*tileHeight);
}
var _fake3DMapArea = null;
var getFakeMapArea = function(){
    if(!_fake3DMapArea){
        var result = [];
        var area = GISUtils.getGlobalSetting(GISSettings.FAKE_3D_MAP_INITGRID);
        var urls = GISUtils.getGlobalSetting(GISSettings.FAKE_3D_MAP_URLS);
        var levels = urls.length;
        result[0] = area;
        for(var i=1;i<levels;i++){
            var factor = Math.pow(2,i);
            var ta = [factor*area[0],factor*area[1],factor*area[2],factor*area[3]];
            result[i] = ta;
        }
        _fake3DMapArea = result;
    }
			
    return _fake3DMapArea;
}
var getFakeMapScreenPointFromGeoPoint = function(geoPoint,
    viewRect,zoomLevel,
    tileWidth,tileHeight){
    var pixelSize = getFake3DMapPixels(zoomLevel,tileWidth,tileHeight);
    var pixelx = pixelSize.width * geoPoint.longitude /100;
    var pixely = pixelSize.height * geoPoint.latitude/100;
    var cy = (viewRect.maxy + viewRect.miny)/2;
    var yOff = pixely - cy;
    return {
        x:pixelx - viewRect.minx,
        y:viewRect.height/2 + yOff
        };
}
var getFakeMapGeoFromPixel = function(pixelX,pixelY,
    zoomLevel,tileWidth,tileHeight){
    var pixelSize = getFake3DMapPixels(zoomLevel,tileWidth,tileHeight);
    return new twaver.gis.geometry.GeoCoordinate(100 * pixelY/pixelSize.height,100 * pixelX/pixelSize.width);
}
// ****************************************************************************************//
var get4326TileBBox = function(zoom, col, row) {
    var resolution = get4326Resolution(zoom);
    var minLng = -180 + resolution * col;
    var minLat = -90 + resolution * row;
    var maxLng = minLng + resolution;
    var maxLat = minLat + resolution;
    var gb = new twaver.gis.geometry.GridBbox(minLat,minLng,maxLat,maxLng);
    return gb;
}
var get4326Resolution = function(zoom) {
    return 180 / Math.pow(2, zoom);
}
var get4326ScreenPointFromGeoPoint = function(geoPoint,
    viewRect,zoomLevel,
    tileWidth,tileHeight){
    var pixelx = lngTo4326PixelX(geoPoint.longitude,zoomLevel,tileWidth);
    var pixely = latTo4326PixelY(geoPoint.latitude,zoomLevel,tileHeight);
    var cy = (viewRect.maxy + viewRect.miny)/2;
    var yOff = pixely - cy;
    return {
        x:pixelx - viewRect.minx,
        y:viewRect.height/2 - yOff
        };
}
var calculate4326TilePixelBounds = function(tile){
    var minx = tile.width * (tile.colIndex - 1);
    var miny = tile.height * (tile.rowIndex + 1);
    var maxx = tile.width + minx;
    var maxy = tile.height + miny;
    tile.pixelBounds = new twaver.gis.geometry.Bounds(minx,maxx,miny,maxy);
}
var get4326Tile = function(zoomLevel,  coordinate,
    tileWidth,tileHeight) {
    var col = get4326Col(coordinate.longitude,zoomLevel,tileWidth);
    var row = get4326Row(coordinate.latitude,zoomLevel,tileHeight);
    return new Tile(GISConsts.PROJECTION_4326,row,col,zoomLevel,tileWidth,tileHeight);
}
		
		
var get4326PixelXYFromGeoPoint = function( geoPoint, zoomLevel,
    tileWidth,tileHeight) {
    var longRadio = (geoPoint.longitude + 180) / 360;
    var laRadio = (geoPoint.latitude + 90) / 180;
    var grids = Math.pow(2, zoomLevel);
    // x
    var x = grids * 2 * tileWidth * longRadio;
    // y
    var y = grids * tileHeight * (laRadio);
    return {
        x:x, 
        y:y
    };
}
		
		
var get4326Pixels = function(zoomLevel,tileWidth,tileHeight){
    var r = Math.pow(2, zoomLevel);
    var width = r * 2 * tileWidth;
    var height = r*tileHeight;
    return new twaver.gis.geometry.Dimensize(width,height);
}	
var lngTo4326PixelX = function(longitude,zoomLevel,tileWidth){
    return (longitude - MINLONGITUDE)* tileWidth / get4326Resolution(zoomLevel);
}
var get4326Col = function(longitude,zoomLevel,tileWidth){
    var pixelX = lngTo4326PixelX(longitude,zoomLevel,tileWidth);
    return pixelXToCol(pixelX,tileWidth);
}
var get4326Row = function(latitude,zoomLevel,tileHeight){
    var pixelY = latTo4326PixelY(latitude,zoomLevel,tileHeight);
    return pixelYToRow(pixelY,GISConsts.PROJECTION_4326,tileHeight);
}
var latTo4326PixelY = function(latitude,zoomLevel,tileHeight){
    var resolution = get4326Resolution(zoomLevel);
    var y = (tileHeight * (latitude - P4326_MINLATITUDE))/resolution;
    return y;
}
var pixelXToCol = function(pixelX,tileWidth){
    tileWidth = !tileWidth? 256:tileWidth;
    return Math.floor(pixelX/tileWidth);
}
var pixelYToRow = function(pixelY,projectionType,tileHeight){
    if(projectionType == GISConsts.PROJECTION_MERCATOR){
        return MapUtils.trancateInteger(pixelY/tileHeight);
    }
    return Math.floor(pixelY/tileHeight);
}
var get4326GeoPointFromPixelXY = function(pixelX,pixelY,
    zoomLevel,tileWidth,tileHeight){
    var x = MINLONGITUDE + pixelX * get4326Resolution(zoomLevel)/tileWidth;
    var y = pixelY * get4326Resolution(zoomLevel)/tileHeight - 90;
    return new twaver.gis.geometry.GeoCoordinate(y,x);
}
var get4326PixelXYFromGeopoint = function(longitude,latitude,zoomLevel,tileWidth,tileHeight){
    tileWidth = !tileWidth? 256:tileWidth;
    tileHeight = !tileHeight? 256:tileHeight;
    var x = lngTo4326PixelX(longitude,zoomLevel,tileWidth);
    var y = latTo4326PixelY(latitude,zoomLevel,tileHeight);
    return {
        x:x,
        y:y
    };
}
defaultValue = function(obj,value){
    obj = !obj? value:obj;
}
var getWMSNoTile = function(zoom){
    var tile = new Tile(GISConsts.PROJECTION_4326,zoom, 1, 1);	
    return tile;
}
var calculateWMSNoTileBBox = function(tile, viewport,center) {
    if(viewport == null){
        return;
    }
    var projectionType = GISConsts.PROJECTION_4326;
    var zoom = tile.zoom;
    var pixelxy = getPixelXYFromGeoPoint(center,zoom,projectionType);
    var x = pixelxy.x - viewport.width / 2;
    var y = pixelxy.y - viewport.height / 2;
    var viewportBounds = new twaver.gis.geometry.Bounds(x,x+viewport.width,y,y+viewport.height);
    var pixelsSize = getPixels(zoom,projectionType );
    var worldRect = new twaver.gis.geometry.Bounds(0,pixelsSize.width,0,pixelsSize.height);
    var intersected = viewportBounds.createIntersect(worldRect);
    if(intersected!=null){
        var minPixelX = intersected.minx;
        var minPixelY = intersected.miny;
        var maxPixelX = intersected.maxx;
        var maxPixelY = intersected.maxy;
        tile.width = ((maxPixelX - minPixelX));
        tile.height = ((maxPixelY - minPixelY));
        var upLeft = getGeoPointFromPixelXY(
            minPixelX, maxPixelY, zoom, projectionType);
        var bottomRight = getGeoPointFromPixelXY(
            maxPixelX, minPixelY, zoom, projectionType);
        tile.geoBounds = new twaver.gis.geometry.GridBbox(bottomRight.latitude,upLeft.longitude,upLeft.latitude,bottomRight.longitude);
        tile.x = viewport.width /2 - intersected.width/2;
        tile.y = viewport.height/2 - intersected.height/2;
        tile.setSize({width:tile.width,height:tile.height});
        tile.setLocation(tile.x,tile.y);
    }
}

var getWMSURL = function(service,tile, format){
	if(GISUtils.getGlobalSetting(GISSettings.COMMONSEQUENCE)){
		return service + "/" + tile.zoomLevel + "/" + tile.colIndex + "/"
            + tile.rowIndex + "." + format;
	}else
		return service + "/" + tile.zoomLevel + "/" + tile.rowIndex + "/"
            + tile.colIndex + "." + format;
	
}
var getBaiduSatelliteURL = function(service,tile){
	var url = service + "x=" + tile.colIndex
                + ";y=" + tile.rowIndex + ";z=" + tile.zoomLevel+";v=009;type=sate&fm=46";
    return url;
}
var getBingMapURL = function(service,tile){
	var quadkey = getQuadkey(tile.colIndex,tile.rowIndex,tile.zoomLevel)
        if(""==quadkey)
            quadkey = "0";
    return service + "/tiles/r"+quadkey+"."+imageFormat+"?g=0";
}
var getEdushiURL = function(service,tile){
	return service + (tile.colIndex)
            + "," + (tile.rowIndex) + '.png';
}
var getGoogleMapURL = function(service,tile){
	 return service + "&hl="
                + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
                + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
}
var getGoogleLabelURL = function(serivce,tile){
	return service + "&hl="
                + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
                + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
}
var getGoogleSatelliteURL = function(service,tile){
	 return service + "&hl="
        + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
        + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
}
var getGoogleTerrainURL = function(service,tile){
	return service + "&hl="
            + GISUtils.getGlobalSetting(GISSettings.GOOGLEMAP_LOCALE) + "&x=" + tile.colIndex
            + "&y=" + tile.rowIndex + "&z=" + tile.zoomLevel;
}
var getMapABCURL = function(service,tile){
	return service + "&x=" + tile.colIndex + "&y=" + tile.rowIndex + "&zoom="
                  + (17 - tile.zoomLevel);
}
var getTiandituURL = function(service,tile){
	var zoom = tile.zoomLevel
        var y = Math.pow(2, zoom);
        var t = null;
       
        // if(zoom<=9)
        //     t = "A0512_EMap";
        // else if((zoom>9)&&(zoom<12))
        //     t = "B0627_EMap1112";
        // else
        //     t ="siwei0608";

        // var service = "http://tile5"+".tianditu.com/DataServer?T="+t+"&X=";
        if(zoom==0)
            y = tile.rowIndex;
        else 
            y = y - tile.rowIndex -1;
        var url = service+ "&X=" + tile.colIndex+"&Y="+y+"&L="+(zoom+1);
        return url;
}
var getTiandituSatelliteURL = function(tile){
	 var zoom = tile.zoomLevel
        var y = Math.pow(2, zoom);
        var t = null;
        if(zoom<=10)
            t = "sbsm0210";
        else if((zoom>10)&&(zoom<12))
            t = "e12";
        else if(zoom == 12)
            t ="e13";
        else if((zoom>12) && (zoom<14))
            t = "eastdawnall";
        else if(zoom == 14)
            t = "AP0115_SWHK";
        else
            t = "sbsm1518"
        var service = "http://tile5"+".tianditu.com/DataServer?T="+t+"&X=";
        if(zoom==0)
            y = tile.rowIndex;
        else 
            y = y - tile.rowIndex -1;
        var url = service+tile.colIndex+"&Y="+y+"&L="+(zoom+1);
        return url;
}

