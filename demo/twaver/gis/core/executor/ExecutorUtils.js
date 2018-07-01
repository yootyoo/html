
    var getCoveredTilesBounds = function(anchorTile,anchorScreenPoint,viewrect,projectionType){
        switch(projectionType){
            case GISConsts.PROJECTION_MERCATOR:
                return getMercatorCoveredTilesBounds(anchorTile,anchorScreenPoint,viewrect);
            case GISConsts.PROJECTION_EDUSHI:
                return getFake3DMapCoveredTilesBounds(anchorTile,anchorScreenPoint,viewrect);
            default:
                return getWMS4326CoveredTilesBounds(anchorTile,anchorScreenPoint,viewrect);
        }
			
    };
    var getFake3DMapCoveredTilesBounds = function(anchorTile,anchorScreenPoint,viewrect){
        var anchorx = anchorScreenPoint.x - (anchorTile.upleft.x);
        var anchory = anchorScreenPoint.y - ( anchorTile.upleft.y);
        var hExtends = GISUtils.getNumberValue(GISSettings.CACHE_HORIZONTAL_EXTENDS);
        var vExtends = GISUtils.getNumberValue(GISSettings.CACHE_VERTICAL_EXTENDS);
        if(hExtends<0){
            hExtends = (viewrect.width / anchorTile.width);
        }
        if(vExtends<0){
            vExtends = (viewrect.height / anchorTile.height);
        }
        var minCol = anchorTile.colIndex - (Math.ceil(anchorx / anchorTile.width));
        var maxCol = anchorTile.colIndex + Math.ceil((viewrect.width - anchorTile.width - anchorx)/anchorTile.width);
        var minRow = anchorTile.rowIndex - Math.ceil(anchory /anchorTile.height);
        var maxRow = anchorTile.rowIndex + Math.ceil((viewrect.height - anchorTile.height - anchory)/anchorTile.height);
        return new twaver.gis.geometry.Bounds(minCol - hExtends,maxCol + hExtends,minRow - vExtends,maxRow + vExtends);
    };
    var getMercatorCoveredTilesBounds = function(anchorTile,anchorScreenPoint,viewrect){
        var anchorx = anchorScreenPoint.x - (anchorTile.upleft.x);
        var anchory = anchorScreenPoint.y - ( anchorTile.upleft.y);
        var hExtends = GISUtils.getNumberValue(GISSettings.CACHE_HORIZONTAL_EXTENDS);
        var vExtends = GISUtils.getNumberValue(GISSettings.CACHE_VERTICAL_EXTENDS);
        if(hExtends<0){
            hExtends = (viewrect.width / anchorTile.width);
        }
        if(vExtends<0){
            vExtends = (viewrect.height / anchorTile.height);
        }
        var minCol = anchorTile.colIndex - (Math.ceil(anchorx / anchorTile.width));
        var maxCol = anchorTile.colIndex + Math.ceil((viewrect.width - anchorTile.width - anchorx)/anchorTile.width);
        var minRow = anchorTile.rowIndex - Math.ceil(anchory /anchorTile.height);
        var maxRow = anchorTile.rowIndex + Math.ceil((viewrect.height - anchorTile.height - anchory)/anchorTile.height);
        return new twaver.gis.geometry.Bounds(minCol - hExtends,maxCol + hExtends,minRow - vExtends,maxRow + vExtends);
    };
    var getWMS4326CoveredTilesBounds = function(anchorTile,anchorScreenPoint,viewrect){
        var anchorx = anchorScreenPoint.x - (anchorTile.upleft.x);
        var anchory = anchorScreenPoint.y + ( anchorTile.upleft.y);
        var hExtends = GISUtils.getNumberValue(GISSettings.CACHE_HORIZONTAL_EXTENDS);
        var vExtends = GISUtils.getNumberValue(GISSettings.CACHE_VERTICAL_EXTENDS);
        if(hExtends==-1){
            hExtends = (viewrect.width / anchorTile.width);
        }
        if(vExtends == -1){
            vExtends = (viewrect.height / anchorTile.height);
        }
        var minCol = anchorTile.colIndex - (Math.ceil(anchorx / anchorTile.width) + hExtends);
        var maxCol = anchorTile.colIndex + Math.ceil((viewrect.width - anchorTile.width - anchorx)/anchorTile.width+hExtends);
        var minRow = anchorTile.rowIndex - Math.ceil((viewrect.height - anchorTile.height - anchory)/anchorTile.height+vExtends);
        var maxRow = anchorTile.rowIndex + Math.ceil(anchory /anchorTile.height)+vExtends;
        return new twaver.gis.geometry.Bounds(minCol,maxCol,minRow,maxRow);;
    };
    var locateAnchorTile = function(anchorGeo,zoomLevel,projectionType,tileWidth,tileHeight){	
        switch(projectionType){
            case GISConsts.PROJECTION_MERCATOR:
                return locateMercatoAnchorTile(anchorGeo,zoomLevel,tileWidth,tileHeight);
            case GISConsts.PROJECTION_EDUSHI:
                return locateFake3DMapAnchorTile(anchorGeo,zoomLevel,tileWidth,tileHeight);
            default:
                return locateWMS4326AnchorTile(anchorGeo,zoomLevel,tileWidth,tileHeight);
        }
    };
    var locateWMS4326AnchorTile = function(anchorGeo,zoomLevel,tileWidth,tileHeight){
        var anchorOnMap = getPixelXYFromGeoPoint(anchorGeo,zoomLevel,GISConsts.PROJECTION_4326,tileWidth,tileHeight);
        var anchorTile = getTileOfPixelXY(anchorOnMap.x,anchorOnMap.y,zoomLevel,GISConsts.PROJECTION_4326,tileWidth,tileHeight);
        anchorTile.pixelBounds = calculateTilePixelBounds(anchorTile,GISConsts.PROJECTION_4326);
        var x = anchorOnMap.x - anchorTile.pixelBounds.minx ;
        var y = anchorOnMap.y - anchorTile.pixelBounds.maxy ;
        anchorTile.upleft = {
            x:x,
            y:y
        };
        return anchorTile;			
    };
    var locateMercatoAnchorTile = function(anchorGeo,zoomLevel,tileWidth,tileHeight){
        var anchorOnMap = getPixelXYFromGeoPoint(anchorGeo,zoomLevel,GISConsts.PROJECTION_MERCATOR,tileWidth,tileHeight);
        var anchorTile = getTileOfPixelXY(anchorOnMap.x,anchorOnMap.y,zoomLevel,GISConsts.PROJECTION_MERCATOR,tileWidth,tileHeight);
        anchorTile.pixelBounds = calculateTilePixelBounds(anchorTile,GISConsts.PROJECTION_MERCATOR);
        var x = anchorOnMap.x - anchorTile.pixelBounds.minx ;
        var y = anchorOnMap.y - anchorTile.pixelBounds.miny ;
        anchorTile.upleft = {
            x:x,
            y:y
        };
        return anchorTile;
			
    };
    var locateFake3DMapAnchorTile = function(anchorGeo,zoomLevel,tileWidth,tileHeight){
        var pixels= getPixels(zoomLevel,GISConsts.PROJECTION_EDUSHI,tileWidth,tileHeight);
        var specifiedX = pixels.width * anchorGeo.longitude /100;
        var specifiedY = pixels.height * anchorGeo.latitude / 100;
        var area = getFakeMapArea();
        var col = Math.floor(Math.ceil(specifiedX) / tileWidth);
        var row = Math.floor(Math.ceil(specifiedY) / tileHeight) ;
        var anchorTile = new Tile(GISConsts.PROJECTION_EDUSHI,row+ area[zoomLevel][1],col+ area[zoomLevel][0],zoomLevel,tileWidth,tileHeight);
        anchorTile.upleft = {x:specifiedX%256,y:specifiedY%256};
        return anchorTile;
			
    };
    var calculateTilePixelBounds = function(tile,projectionType){
        var mapSize = getPixels(tile.zoomLevel,projectionType,tile.width,tile.height);
        var minx,maxx,miny,maxy;
        if(GISConsts.PROJECTION_4326 == projectionType){
            minx = tile.width * tile.colIndex;
            maxx = tile.width + minx;
            miny = tile.height * tile.rowIndex ;
            maxy = miny + tile.height;
            return new twaver.gis.geometry.Bounds(minx,maxx,miny,maxy);		
        }else{
            minx = tile.width * tile.colIndex;
            miny = tile.height * tile.rowIndex;
            maxx = tile.width + minx;
            maxy = tile.height + miny;
            return new twaver.gis.geometry.Bounds(minx,maxx,miny,maxy);
        }
				
    };
    var createExecutor=function(type){
        switch(type){
            case GISConsts.EXECUTOR_TYPE_GEOSERVER_WMS:
            case GISConsts.EXECUTOR_TYPE_GEOSERVER_WMS_CACHE :
            case GISConsts.EXECUTOR_TYPE_MAPINFO_WMS:
            case GISConsts.EXECUTOR_TYPE_ARCGIS_WMS:
                return new BaseExecutor();
            case GISConsts.EXECUTOR_TYPE_TIANDITU:
                return new TiandituExecutor();
            case GISConsts.EXECUTOR_TYPE_OSM:
                return new OSMExecutor();
            case GISConsts.EXECUTOR_TYPE_GOOGLELABEL:
                return new GoogleMapLabelExecutor();
            case GISConsts.EXECUTOR_TYPE_GOOGLEMAP:
                return new GoogleMapExecutor();
            case GISConsts.EXECUTOR_TYPE_GOOGLESTSTELLITE:
                return new GoogleStatelliteExecutor();
            case GISConsts.EXECUTOR_TYPE_GOOGLETERRAIN:
                return new GoogleTerrainExecutor();
            case GISConsts.EXECUTOR_TYPE_MAPABC:
                return new MapAbcExecutor();
            case GISConsts.EXECUTOR_TYPE_YAHOO:
                return new YahooMapExecutor();
            case GISConsts.EXECUTOR_TYPE_EDUSHI:
                return new EdushiExecutor();
            case GISConsts.EXECUTOR_TYPE_BINGMAP:
                return new BingMapExecutor();
            case GISConsts.EXECUTOR_TYPE_TIANDITUSATELLITE:
                return new TiandituSatelliteExecutor();
            case GISConsts.EXECUTOR_TYPE_BAIDUWEBMAP:
                return new BaiduWebMapExecutor();
            case GISConsts.EXECUTOR_TYPE_BAIDUSATELLITE:
                return new BaiduSatelliteMapExecutor();
            default:
                return new WMSNoTileExecutor();
        }
    };


	


