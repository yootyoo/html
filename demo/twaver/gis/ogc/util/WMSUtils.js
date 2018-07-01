/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
twaver.gis.ogc.util.WMSUtils = {
    GEOSERVER_WMS_ROOT_TAG : "WMT_MS_Capabilities",

    getURL:function(requestType,version,srs, bbox,layers,styles,format,width,height) {
        styles = !styles? null:styles;
        format = !format? "png":format;
        width = !width? 256:width;
        height = !height? 256:height;
        var result;
        result = (_$wmsu.getRequestTypeParameter(requestType));
        result += (_$wmsu.getVersionParameter(version));
        result += (_$wmsu.getFormatParameter(format));
        result += (_$wmsu.getLayersParameter(layers));
        if (styles)
            result += (_$wmsu.getStylesParameter(styles));
        else
            result += ("&styles=");
        result += (_$wmsu.getSrsParameter(srs));
        result += (_$wmsu.getBBoxParameter(bbox));
        result += (_$wmsu.getWidthParameter(width));
        result += (_$wmsu.getHeightParameter(height));
        result += (_$wmsu.getTransparentParameter(true));
        return result;
    },
    getBBoxParameter:function(bbox) {
        var result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_BBOX);
        if (bbox) {
            result += (bbox.minLng+","+bbox.minLat+",");
            result += (bbox.maxLng+","+bbox.maxLat);
        } else {
            result += (_$wmsp.GRID_BOUNDS_4326);
        }
        return result.toString();
    },
    getParameterLeftPart:function(parameterName) {
        var result = (_$wmsp.SEPERATOR) +(parameterName) +(_$wmsp.ASSIGNMENT);
        return result;
    },
    getRequestTypeParameter : function(requestType) {
        var  result = (_$wmsp.WMS_PARAMETER_REQUEST) + (_$wmsp.ASSIGNMENT) + (requestType);
        return result;
    },
    getVersionParameter : function(version) {
        var result = _$wmsu.getParameterLeftPart(_$wmsp.WMS_PARAMETER_VERSION) + (version);
        return result;
    },
    getLayersParameter : function(layers) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_LAYERS);
        if (layers != null) {
            var lastIndex = layers.length - 1;
            for (var i = 0; i < layers.length; i++) {
                result += (layers[i]);
                if (i < lastIndex) {
                    result += (",");
                }
            }
        }
        return result;
    },
    getStylesParameter:function(styles) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_STYLES);
        var lastIndex = styles.length - 1;
        for (var i = 0; i < styles.length; i++) {
            if (styles[i] != null) {
                result += (styles[i]);
                if (i < lastIndex) {
                    result += (";");
                }
            }
        }
        return result;
    },
    getFormatParameter:function(format) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_FORMAT);
        result += (_$wmsp.IMAGE_FORMAT);
        result += (format);
        return result;
    },
    getWidthParameter:function(width) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_TILE_WIDTH);
        result += ("" + width);
        return result;
    },
    getHeightParameter:function(height) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_TILE_HEIGHT);
        result += ("" + height);
        return result;
    },
    getSrsParameter:function(srs) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_SRS);
        if ((_$wmsp.SRS_4326!=(srs)) && (_$wmsp.SRS_900913!=(srs))
            && (_$wmsp.SRS_4230!=(srs))) {
            srs = _$wmsp.SRS_4326;
        }
        result += (srs);
        return result;
    },
    getTransparentParameter:function(transparent){
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_TRANSPARENT);
        if (transparent) {
            result += ("true");
        } else {
            result += ("false");
        }
        return result;
    },
    getBBoxParameterByGridBbox:function(bbox){
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_BBOX);
        if (bbox != null) {
            result += bbox.minLng + "," + bbox.minLat +","+ bbox.maxLng  +"," + bbox.maxLat;
        } else {
            result += (_$wmsp.GRID_BOUNDS_4326);
        }
        return result;
    },
    getBBoxParameterByBoundsArray:function(bbox) {
        var  result = _$wmsu.getParameterLeftPart(_$wmsp.GETMAP_PARAMETER_BBOX);
        if ((bbox != null) && (bbox.length == 4)) {
            for (var i = 0; i < 4; i++) {
                result += (bbox[i]);
                if (i < 3) {
                    result += (",");
                }
            }
        } else {
            result += (_$wmsp.GRID_BOUNDS_4326);
        }
        return result;
    }
//parseArcGisWMSCapabilities:function(response:XML){
//			var result = null;
//			if (response != null) {
//				var s = response.toXMLString();
//				var xsiIndex = s.indexOf(" xsi");
//				var lastIndex = s.indexOf(">");
//				var rw = s.substring(xsiIndex,lastIndex);
//				var sss = s.replace(rw,"");
//				var root:XML = new XML(sss);
//				var cs:XMLList = root.Capability;
//				var capabilities:XML = root.Capability[0];
//				var groups:XMLList = capabilities.Layer[0].Layer;
//				result = new Array();
//				{
//					for each(var layer:XML in groups){
//						var layerInfo:OGCLayerInfo = new OGCLayerInfo();
//						layerInfo.layerName = layer.Name;
//						layerInfo.title = layer.Title;
//						var bboxes:XMLList = layer.BoundingBox;
//						for each(var bbox:XML in bboxes){
//							if(bbox.attribute('CRS') == "EPSG:4326"){
//								var minx = bbox.attribute("minx");
//								var miny = bbox.attribute("miny");
//								var maxx = bbox.attribute("maxx");
//								var maxy = bbox.attribute("maxy");
//								var minLat:Number = Number(miny);
//								var minLng:Number = Number(minx);
//								var maxLat:Number = Number(maxy);
//								var maxLng:Number = Number(maxx);
//								layerInfo.latlonBox = new GridBbox(minLat,minLng,maxLat,maxLng);
//							}
//						}
//						result.push(layerInfo);
//					}
//				}
//			}
//			return result;
//		}
//parseMapXtreamWMSAbilities(response:XML)
//		{
//			var result = null;
//			if(response!){
//				var root:XML = response;
//				var capabilities:XML = root.Capability[0];
//				var topLayer:XML = capabilities.Layer[0];
//				var secondLayer:XML = topLayer.Layer[0];
//				var thirdLayer:XML = secondLayer.Layer[0];
//				var fouthLayers:XML = thirdLayer.Layer[0];
//				if (fouthLayers == null) {
//					return null;
//				}
//				result = new Array();
//				var forthLayers:XMLList = fouthLayers.Layer;
//				{
//					for each(var layer:XML in forthLayers){
//						var layerInfo:OGCLayerInfo = new OGCLayerInfo();
//						layerInfo.layerName = layer.Name;
//						layerInfo.title = layer.Title;
//						var minx = layer.LatLonBoundingBox.attribute("minx");
//						var miny = layer.LatLonBoundingBox.attribute("miny");
//						var maxx = layer.LatLonBoundingBox.attribute("maxx");
//						var maxy = layer.LatLonBoundingBox.attribute("maxy");
//						var minLat:Number = Number(miny);
//						var minLng:Number = Number(minx);
//						var maxLat:Number = Number(maxy);
//						var maxLng:Number = Number(maxx);
//						layerInfo.latlonBox = new GridBbox(minLat,minLng,maxLat,maxLng);
//						result.push(layerInfo);
//					}
//				}
//			}
//			return result;
//		}
//parseGeoWMSAbilities(response:XML)
//		{
//			var result = null;
//			if (response != null) 
//			{				
//					var root:XML = response;
//					var capabilities:XML = root.Capability[0];
//					var abstractLayer:XML = capabilities.Layer[0];
//					var layers:XMLList = abstractLayer.Layer;
//					if(layers!){
//						result = new Array;
//						var resultIndex = 0;
//						for each(var layer:XML in layers){
//							var layerInfo:OGCLayerInfo = new OGCLayerInfo();
//							layerInfo.layerName = layer.Name;
//							layerInfo.title = layer.Title;
//							var srses:XMLList = layer.SRS;
//							var srsArray = new Array();
//							var index = 0;
//							for each(var srs:XML in srses){
//								srsArray[index++] = srs.toString();
//							}
//							layerInfo.srsArray = srsArray;
//							layerInfo.srs = srsArray[0];
//							layerInfo.styleName = layer.Style.Name;
//							var minx = layer.LatLonBoundingBox.attribute("minx");
//							var miny = layer.LatLonBoundingBox.attribute("miny");
//							var maxx = layer.LatLonBoundingBox.attribute("maxx");
//							var maxy = layer.LatLonBoundingBox.attribute("maxy");
//							var minLat:Number = Number(miny);
//							var minLng:Number = Number(minx);
//							var maxLat:Number = Number(maxy);
//							var maxLng:Number = Number(maxx);
//							layerInfo.latlonBox = new GridBbox(minLat,minLng,maxLat,maxLng);
//							result[resultIndex++] = layerInfo;
//						}
//					}
//			}		
//			return result;
//		}
//
//		public function getWMSAbilities(type, server,callback:Function):void {
//			var url = server + "request=GetCapabilities";
//			handleWMSCapability = callback;
//			getCapabilityType = type;
//			GISUtils.requestHttp(url,parseWMSAbilities);
//		}
//		public function parseWMSAbilities(event:ResultEvent):void{
//			var layerInfoArray;
//			if (GISConsts.EXECUTOR_TYPE_WMS_ARCGIS_4326== getCapabilityType) {
//				layerInfoArray = parseArcGisWMSCapabilities(event.result as XML);
//			} else if ((GISConsts.EXECUTOR_TYPE_GEOSERVER_4326_CACHE == getCapabilityType)
//				|| (GISConsts.EXECUTOR_TYPE_GEOSERVER_WMS_4326 == getCapabilityType)) 
//			{
//				layerInfoArray = parseGeoWMSAbilities(event.result as XML);
//			} else if (GISConsts.EXECUTOR_TYPE_WMS_MAPXTREAM_4326 == getCapabilityType) {
//				layerInfoArray = parseMapXtreamWMSAbilities(event.result as XML);
//			}
//			if(handleWMSCapability!){
//				handleWMSCapability(layerInfoArray);
//				handleWMSCapability = null;
//			}
//		}
};
var _$wmsu = twaver.gis.ogc.util.WMSUtils;