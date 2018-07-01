
    var WFS_GETFEATURE_HEAD = "<wfs:GetFeature service=\"WFS\" version=\"1.1.0\" "
    + "  xmlns:wfs=\"http://www.opengis.net/wfs\"" + "  xmlns:ogc=\"http://www.opengis.net/ogc\""
    + "  xmlns:gml=\"http://www.opengis.net/gml\""
    + "  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""
    + "  xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">\n";
    var WFS_TRANSACTION_INSERT_HEAD_F = "<wfs:Transaction service=\"WFS\" version=\"1.1.0\"" +
    "  xmlns:wfs=\"http://www.opengis.net/wfs\"" +
    "  xmlns:gml=\"http://www.opengis.net/gml\"" +
    "  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"";
    var WFS_TRANSACTION_SCHEMALLOCATION = "\nxsi:schemaLocation=\"http://www.opengis.net/wfs \n" +
    "http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd \n" +
    "http://www.openplans.org/topp ";
    //"http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads
    var WFS_TRANSACTION_INSERT_HEAD_E = "\">\n";
    var WFS_TRANSACTION_TAIL = "</wfs:Transaction>";		
    var WFS_ADD_HEAD = "<wfs:Insert>\n";
    var WFS_INSERT_TAIL = "</wfs:Insert>\n";
    var WFS_GETFEATURE_TAIL = "</wfs:GetFeature>";
    var WFS_QUERY_HEAD = "<wfs:Query>\n";
    // fill
    // layer
    // name
 var WFS_QUERY_TAIL = "</wfs:Query>\n",
    WFS_RESULTPROPERTY_HEAD = "<wfs:PropertyName>",
    WFS_RESULTPROPERTY_TAIL = "</wfs:PropertyName>\n",
    WFS_GETFEATURE_FILTER_HEAD = "<ogc:Filter>\n",
    WFS_GETFEATURE_FILTER_TAIL = "</ogc:Filter>\n",
    QUERYCONDITION_FID_HEAD = "<ogcId>\n",
    QUERYCONDITION_FID_TAIL = "</ogcId>\n",
    OGC_QUERY_FILTERPROPERTY_HEAD = "<ogc:PropertyName>\n",
    OGC_QUERY_FILTERPROPERTY_TAIL = "</ogc:PropertyName>\n",
    WFS_LOWERBOUNDARY_HEAD = "<ogc:LowerBoundary>\n",
    WFS_LOWERBOUNDARY_TAIL = "</ogc:LowerBoundary>\n",
    WFS_UPPERBOUNDARY_HEAD = "<ogc:UpperBoundary>\n",
    WFS_UPPERBOUNDARY_TAIL = "</ogc:UpperBoundary>\n",
    WFS_LITERAL_HEAD = "<ogc:Literal>\n",
    WFS_LITERAL_TAIL = "</ogc:Literal>\n",
    // spatial operator area
    WFS_GETFEATURE_QUERY_SPATIAL_RESULTPROPERTY_HEAD = "<PropertyName>\n",
    WFS_GETFEATURE_QUERY_SPATIAL_RESULTPROPERTY_TAIL = "</PropertyName>\n",
    WFS_GETFEATURE_SPATIAL_FILTER_HEAD = "<Filter>\n",
    WFS_GETFEATURE_SPATIAL_FILTER_TAIL = "</Filter>\n",
    WFS_SPATIAL_OPERATOR_DISJOINT_HEAD = "<Disjoint>\n",
    WFS_SPATIAL_OPERATOR_DISJOINT_TAIL = "</Disjoint>\n",
    WFS_SPATIAL_OPERATOR_EQUALS_HEAD = "<Equals>\n",
    WFS_SPATIAL_OPERATOR_EQUALS_TAIL = "</Equals>\n",
    WFS_SPATIAL_OPERATOR_DWITHIN_HEAD = "<DWithin>\n",
    WFS_SPATIAL_OPERATOR_DWITHIN_TAIL = "</DWithin>\n",
    WFS_SPATIAL_OPERATOR_INTERSECT_HEAD = "<Intersects>\n",
    WFS_SPATIAL_OPERATOR_INTERSECT_TAIL = "</Intersects>\n",
    WFS_SPATIAL_OPERATOR_TOCHES_HEAD = "<Touches>\n",
    WFS_SPATIAL_OPERATOR_TOCHES_TAIL = "</Touches>\n",
    WFS_SPATIAL_OPERATOR_CROSS_HEAD = "<Crosses>\n",
    WFS_SPATIAL_OPERATOR_CROSS_TAIL = "</Crosses>\n",
    WFS_SPATIAL_OPERATOR_WITHIN_HEAD = "<Within>\n",
    WFS_SPATIAL_OPERATOR_WITHIN_TAIL = "</Within>\n",
    WFS_SPATIAL_OPERATOR_CONTAIN_HEAD = "<Contains>\n",
    WFS_SPATIAL_OPERATOR_CONTAIN_TAIL = "</Contains>\n",
    WFS_SPATIAL_OPERATOR_OVERLAP_HEAD = "<Overlaps>\n",
    WFS_SPATIAL_OPERATOR_OVERLAP_TAIL = "</Overlaps>\n",
    WFS_SPATIAL_OPERATOR_BBOX_HEAD = "<BBOX>\n",
    WFS_SPATIAL_OPERATOR_BBOX_TAIL = "</BBOX>\n",
    WFS_SPATIAL_OPERATOR_DISTANCE_HEAD = "<Distance>\n",
    WFS_SPATIAL_OPERATOR_DISTANCE_TAIL = "</Distance>\n",
    WFS_SPATIAL_OPERATOR_UNITS_HEAD = "units=\"",		
    OGC_GETFEATURE_BBOX_HEAD = "<ogc:BBOX>\n",
    OGC_GETFEATURE_BBOX_TAIL = "</ogc:BBOX>\n",
    OGC_FILTERPROPERTY_HEAD = "<ogc:PropertyName>",
    OGC_FILTERPROPERTY_TAIL = "</ogc:PropertyName>\n",
    WFS_GETFEATURE_GMLENVELOPE_HEAD = "<gml:Envelope>\n",
    WFS_GETFEATURE_GMLENVELOPE_TAIL = "</gml:Envelope>\n",
    GMLLOWERCORNER_HEAD = "<gml:lowerCorner>",
    GMLLOWERCORNER_TAIL = "</gml:lowerCorner>\n",
    GMLUPPERCORNER_HEAD = "<gml:upperCorner>",
    GMLUPPERCORNER_TAIL = "</gml:upperCorner>\n",
    GMLBOX_HEAD = "<gml:Box>\n",// --should
    // //
    // srs
    GMLBOX_TAIL = "</gml:Box>\n",
    GMLOUTERBOUNDARY_HEAD = "<gml:outerBoundaryIs>\n",
    GMLOUTERBOUNDARY_TAIL = "</gml:outerBoundaryIs>\n",
		
    GMLINNERBOUNDARY_HEAD = "<gml:innerBoundaryIs>\n",
    GMLINNERBOUNDARY_TAIL = "</gml:innerBoundaryIs>\n",
		
    GMLLINESTRING_HEAD = "<gml:LineString>\n",
    //			+ "srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">",
    GMLLINESTRING_TAIL = "</gml:LineString>\n",
    /**
		 * <gml:LineString gml:id="p21" srsName="urn:ogc:def:crs:EPSG:6.6:4326"> <gml:coordinates>45.67, 88.56
		 * 55.56,89.44</gml:coordinates> </gml:LineString >
		 */
    GMLPOLYGON_HEAD = "<gml:Polygon>\n",
    GMLPOLYGON_TAIL = "</gml:Polygon>\n",
    GMLLINEARRING_HEAD = "<gml:LinearRing>\n",
    GMLLINEARRING_TAIL = "</gml:LinearRing>\n",
    /****************
		 * <---!<gml:Polygon srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">!----> <gml:Polygon>
		 * <gml:outerBoundaryIs> <gml:LinearRing> <gml:coordinates>x,y x1,y1 x2,y2 </gml:coordinates> </gml:LinearRing>
		 * </gml:outerBoundaryIs> </gml:Polygon>
		 */
    //		GMLPOINT_HEAD = "<gml:Point "
    //			+ "srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">",
    GMLPOINT_HEAD = "<gml:Point >\n",
    GMLPOINT_TAIL = "</gml:Point>\n",
    /**
		 * <gml:Point gml:id="p1" srsName="#srs36"> <gml:coordinates>100,200</gml:coordinates> </gml:Point>
		 */
    GMLCOORDINATES_HEAD = "<gml:coordinates>",
    GMLCOORDINATES_TAIL = "</gml:coordinates>",
    OGC_COMPARISON_EQUALTO_HEAD = "<ogc:PropertyIsEqualTo>\n",
    OGC_COMPARISON_EQUALTO_TAIL = "</ogc:PropertyIsEqualTo>\n",
    OGC_COMPARISON_NOTEQUALTO_HEAD = "<ogc:PropertyIsNotEqualTo>\n",
    OGC_COMPARISON_NOTEQUALTO_TAIL = "</ogc:PropertyIsNotEqualTo>\n",
    OGC_COMPARISON_LESSTHAN_HEAD = "<ogc:PropertyIsLessThan>\n",
    OGC_COMPARISON_LESSTHAN_TAIL = "</ogc:PropertyIsLessThan>\n",
    OGC_COMPARISON_GREATERTHAN_HEAD = "<ogc:PropertyIsGreaterThan>\n",
    OGC_COMPARISON_GREATERTHAN_TAIL = "</ogc:PropertyIsGreaterThan>\n",
    OGC_COMPARISON_LIKE_HEAD = "<ogc:PropertyIsLike wildCard=\"*\" singleChar=\"#\" escapeChar=\"!\">\n",
    OGC_COMPARISON_LIKE_TAIL = "</ogc:PropertyIsLike>\n",
    OGC_COMPARISON_BETWEEN_HEAD = "<ogc:PropertyIsBetween>\n",
    OGC_COMPARISON_BETWEEN_TAIL = "</ogc:PropertyIsBetween>\n",
    OGC_COMPARISON_LESSTHANOREQUATO_HEAD = "<ogc:PropertyIsLessThanOrEqualTo>\n",
    OGC_COMPARISON_LESSTHANOREQUATO_TAIL = "</ogc:PropertyIsLessThanOrEqualTo>\n",
    OGC_COMPARISON_GREATERTHANOREQUATO_HEAD = "<ogc:PropertyIsGreaterThanOrEqualTo>\n",
    OGC_COMPARISON_GREATERTHANOREQUATO_TAIL = "</ogc:PropertyIsGreaterThanOrEqualTo>\n",
    //		OGC_COMPARISON_BETWEEN_HEAD = "<ogc:PropertyIsBetween>\n",
    //		OGC_COMPARISON_BETWEEN_TAIL = "/<ogc:PropertyIsBetween>\n"
		
		
    //	OGC_COMPARISON_LIKE_HEAD = "<ogc:PropertyIsLikeType>",
    OGC_LITERAL_HEAD = "<ogc:Literal>",
    OGC_LITERAL_TAIL = "</ogc:Literal>\n",
    DEFAULT_PROPERTY_GEOM = "the_geom",
		
    GMLENVELOPE_HEAD = "<gml:Envelope>\n",		
    GMLENVELOPE_TAIL = "</gml:Envelope>\n",
		
    WFS_TRANSACTION_COMMON_HEAD = "<wfs:Transaction service=\"WFS\" version=\"1.1.0\"" +
    "  xmlns:ogc=\"http://www.opengis.net/ogc\"" +
    "  xmlns:gml=\"http://www.opengis.net/gml\"" +
    "  xmlns:wfs=\"http://www.opengis.net/wfs\">\n",
    WFS_UPDATE_HEAD = "<wfs:Update>\n",
    WFS_UPDATE_TAIL = "</wfs:Update>\n",
    WFS_DELETE_HEAD = "<wfs:Delete>\n",
    WFS_DELETE_TAIL = "</wfs:Delete>\n",
		
    WFS_LOGICTYPE_AND_HEAD = "<And>\n",
    WFS_LOGICTYPE_AND_TAIL = "</And>\n",
    WFS_LOGICTYPE_OR_HEAD = "<Or>\n",
    WFS_LOGICTYPE_OR_TAIL = "</Or>\n",
		
    WFS_LOGICTYPE_NOT_HEAD = "<Not>\n",
    WFS_LOGICTYPE_NOT_TAIL = "</Not>\n",
		
    DEFAULT_SRS = "srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\"";
                
    var buildNormalQuery = function(typeName,resultPropertyNames) {
        var sb = wrapQueryTail(wrapQuery("",typeName));
        sb = wrapGetFeature(sb);
        return sb;
    };
    /**
		 * resultPropertyNames -- string array
		 * */
    var buildComparisonOperation=function(typeName,resultPropertyNames,condition) {
        var sb = wrapLogicalCondition(condition);
        sb = wrapWithFilterTag(sb);
        wrapGetFeature(sb);
        return sb;
    };

    var createBetweenDescription = function(name,ref1,ref2){
        var sb = "";
        sb += (OGC_FILTERPROPERTY_HEAD);
        sb += (name);
        sb += (OGC_FILTERPROPERTY_TAIL);
        sb += WFS_LOWERBOUNDARY_HEAD;
        sb += (OGC_LITERAL_HEAD);
        sb += (ref1);
        sb += (OGC_LITERAL_TAIL);
        sb += WFS_LOWERBOUNDARY_TAIL;
        sb += WFS_UPPERBOUNDARY_HEAD;
        sb += OGC_LITERAL_HEAD;
        sb += ref2;
        sb += OGC_LITERAL_TAIL;
        sb += WFS_UPPERBOUNDARY_TAIL;
        return sb;
    };
    var createMultiLogicOperators = function(condition){
        var head = WFS_LOGICTYPE_AND_HEAD;
        var tail = WFS_LOGICTYPE_AND_TAIL;
        if(condition.type == GISConsts.COMPARISON_LOGIC_TYPE_MULTIOPERATORS_NOT){
            head += WFS_LOGICTYPE_NOT_HEAD;
            tail = insert(tail,0,WFS_LOGICTYPE_NOT_TAIL);
        }else if(GISConsts.COMPARISON_LOGIC_TYPE_MULTIOPERATORS_OR == condition.type){
            head = WFS_LOGICTYPE_OR_HEAD;
            tail = WFS_LOGICTYPE_OR_TAIL;
        }
        var result = head;
        var pNames = condition.getReferenceProperties();
        var values = condition.getReferenceValues();
        var operators = condition.getOperateOperators();
        var vIndex = 0;
        if((pNames!=null)&&(values!=null)&&(pNames.length == values.length)){
            for(var i=0;i<pNames.length;i++){
                var s = "";
                if(GISConsts.COMPARISON_OPERATOR_BETWEEN == operators[i]){
                    s = createBetweenDescription(pNames[i],values[vIndex],values[vIndex+1]);
                    vIndex += 2;
                }else{			
                    s = createPropertyDescription(pNames[i],values[vIndex]);
                    vIndex ++;
                }
                s = wrapNormalLogicalCondition(s,operators[i]);
                result += s;
            }
        }
        result += tail;
        return result;
    };
		
    var createSingleLogicalOperator = function(condition){
        var result = "";
        if(GISConsts.COMPARISON_OPERATOR_BETWEEN == condition.getOperateOperators()[0]){
            result = createBetweenDescription(condition.getReferenceProperties()[0],
                condition.getReferenceValues()[0],
                condition.getReferenceValues()[1]);
        }else{
            result = createPropertyDescription(condition.getReferenceProperties()[0],
                condition.getReferenceValues()[0]);
        }
        result = wrapNormalLogicalCondition(result,condition.getOperateOperators()[0]);
        return result;
    };
    var wrapLogicalCondition = function(condition){
        var sb = "";
        var type = condition.type;
        var referenceValues = condition.getReferenceValues();
        if (GISConsts.COMPARISON_QUERY_BY_FID == type) {
            sb = insert(sb,0, createFIDFilter(condition));
        } else if (GISConsts.COMPARISON_LOGIC_TYPE_SINGLEOPERATOR == type) {
            sb = createSingleLogicalOperator(condition);
        } else {
            sb = createMultiLogicOperators(condition);
        }
        sb = wrapWithFilterTag(sb);
        return sb;
    };
    var createPropertyDescription = function(referencePropertyName, value){
        var sb = "";
        sb += (OGC_FILTERPROPERTY_HEAD);
        sb += (referencePropertyName);
        sb += (OGC_FILTERPROPERTY_TAIL);
        sb += (OGC_LITERAL_HEAD);
        sb += (value);
        sb += (OGC_LITERAL_TAIL);
        return sb;
    };
    var wrapNormalLogicalCondition = function(propertyDescribe, operateType) {
			
        var head = "";
        var tail = "";
        switch(operateType){
            case GISConsts.COMPARISON_OPERATOR_EQUAL:
                head = OGC_COMPARISON_EQUALTO_HEAD;
                tail = OGC_COMPARISON_EQUALTO_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_GREATER:
                head = OGC_COMPARISON_GREATERTHAN_HEAD;
                tail = OGC_COMPARISON_GREATERTHAN_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_GREATEROREQUAL:
                head = OGC_COMPARISON_GREATERTHANOREQUATO_HEAD;
                tail = OGC_COMPARISON_GREATERTHANOREQUATO_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_LIKE:
                head = OGC_COMPARISON_LIKE_HEAD;
                tail = OGC_COMPARISON_LIKE_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_LESS:
                head = OGC_COMPARISON_LESSTHAN_HEAD;
                tail = OGC_COMPARISON_LESSTHAN_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_LESSOREQUAL:
                head = OGC_COMPARISON_LESSTHANOREQUATO_HEAD;
                tail = OGC_COMPARISON_LESSTHANOREQUATO_TAIL;
                break;
            case GISConsts.COMPARISON_OPERATOR_BETWEEN:
                head = OGC_COMPARISON_BETWEEN_HEAD;
                tail = OGC_COMPARISON_BETWEEN_TAIL;
                break;
            default:
                break;
        }
        var result = insert(propertyDescribe,0,head);
        result += tail;
        return result;
    };
    var createConditionScription = function(condition){
        return null;
    };
    var createFIDFilter = function(condition) {
        var values = condition.getReferenceValues();
        var result = "";
        for(var i = 0;i<values.length;i++){
            result += "<ogcId fid=\""+values[i]+"\"/>\n";
        }
        return result;
    };
    //resultPropertyName -- an array of String

    var buildSpatialOperation = function(conditionInfo){
        var sb = "";
        // wrap geom property
        sb += wrapWithFilterPropertyNameTag(conditionInfo.geomPropertyName,true);
        // wrap spatial condition
        sb += wrapSpatialCondition(conditionInfo);
        var operatorType = conditionInfo.getOperatorType();
        // wrap with operator tag
        sb = wrapSpatialOperator(operatorType, sb,conditionInfo.dwithinDistance);
        // wrap with filter tag
        sb = wrapWithFilterTag(sb);
        return sb;
    };
    //resultPropertyNames -- an array of String
    var buildBBoxOperation = function(typeName,resultPropertyNames,bbox) {
        var sb = "";
        wrapEnvelopeDescribe(sb, bbox);
        wrapBBoxOperator(sb);
        sb += wrapWithFilterTag(sb);
        // wrap with getFeature tag
        wrapGetFeature(sb);
        return sb;
    };
    //coordinates -- an array of coordinates
    var buildBoxGMLDescribe = function(coordinates,srs) {
        if(!srs)
            srs = DEFAULT_SRS;
        var sb = insert(GMLBOX_HEAD,GMLBOX_HEAD.length-2,srs);
        sb += (GMLCOORDINATES_HEAD);
        var t = coordinates.length - 1;
        for (var i = 0; i < coordinates.length; i++) {
            sb += (coordinates[i].getLongitude() + "," + coordinates[i].getLatitude());
            if (i < t) {
                sb += (" ");
            }
        }
        sb += (GMLCOORDINATES_TAIL);
        sb += (GMLBOX_TAIL);
        return sb;
    };
		
    var wrapBBoxOperator = function(sb) {
        sb = insert(sb,0,OGC_GETFEATURE_BBOX_HEAD);
        sb += OGC_GETFEATURE_BBOX_TAIL;
    };
    var insert = function(source,index,content){
        return source.substr(0,index)+content+source.substr(index,source.length);
    };
    var wrapEnvelopeDescribe = function(sb, bbox) {
        sb += (OGC_FILTERPROPERTY_HEAD);
        sb += (DEFAULT_PROPERTY_GEOM);
        sb += (OGC_FILTERPROPERTY_TAIL);
        sb += (WFS_GETFEATURE_GMLENVELOPE_HEAD);
        sb += (GMLLOWERCORNER_HEAD);
        sb += bbox.minLng + " " + bbox.minLat;
        sb += (GMLLOWERCORNER_TAIL);
        sb += (GMLUPPERCORNER_HEAD);
        sb += bbox.maxLng + " " +bbox.maxLat;
        sb += (GMLUPPERCORNER_TAIL);
        sb += (WFS_GETFEATURE_GMLENVELOPE_TAIL);
    };
    //coordinates --  an array of GeoCoordinates
    var buildPointGMLDescribe = function(coordinate,srs) {
        if(!srs){
            srs = twaver.gis.ogc.utils.WFSUtils.DEFAULT_SRS;
        }
        var sb = "";
        sb += insert(GMLPOINT_HEAD,GMLPOINT_HEAD.length-2,srs);
        sb += (GMLCOORDINATES_HEAD);
        sb += (coordinate.longitude + "," + coordinate.latitude)+ (" ");
        sb += (GMLCOORDINATES_TAIL);
        sb += (GMLPOINT_TAIL);
        return sb;
    };
    //coordinates -- an array of GeoCoordinates
    var buildPolygonGMLDescription = function(out,inner,srs){
        if(!srs){
            srs = twaver.gis.ogc.utils.WFSUtils.DEFAULT_SRS;
        }
        var sb = (GMLPOLYGON_HEAD);
        if(out){
            sb += (GMLOUTERBOUNDARY_HEAD);
            sb += buildLineGMLDescribe(out,srs);
            sb += (GMLOUTERBOUNDARY_TAIL);
        }
        if(inner){
            sb += GMLINNERBOUNDARY_HEAD;
            sb += buildLineGMLDescribe(inner,srs);
            sb += GMLINNERBOUNDARY_TAIL;
        }
			
        sb += (GMLPOLYGON_TAIL);
        return sb;
    };
    var buildPoLygonGMLDescribe = function(coordinates) {
        var sb = "";
        sb += (GMLPOLYGON_HEAD);
        sb += (GMLOUTERBOUNDARY_HEAD);
        sb += (GMLLINESTRING_HEAD);
        sb += (GMLCOORDINATES_HEAD);
        for (var i = 0; i < coordinates.length; i++) {
            var c = GeoCoordinate(coordinates[i]);
            sb += (c.longitude + "," + c.latitude) + (" ");
        }
        sb += (GMLCOORDINATES_TAIL);
        sb += (GMLLINESTRING_TAIL);
        sb += (GMLOUTERBOUNDARY_TAIL);
        sb += (GMLPOLYGON_TAIL);
        return sb;
    };
    //coordinates --  an array of GeoCoordinates
    var buildEnvelopeDescription = function(coordinates,srs){
        if(!srs)
            srs = DEFAULT_SRS;
        if(coordinates.length == 2){				
            var result = insert(GMLENVELOPE_HEAD,GMLENVELOPE_HEAD.length-2," "+srs);
            var c = GeoCoordinate(coordinates[0]);
            result += GMLLOWERCORNER_HEAD + c.longitude+" "+c.latitude+GMLLOWERCORNER_TAIL;
            c = GeoCoordinate(coordinates[1]);
            result += GMLUPPERCORNER_HEAD + c.longitude+" "+c.latitude+GMLUPPERCORNER_TAIL;
            result += GMLENVELOPE_TAIL;
            return result;
        }
        return "";
			
    };
    var buildLineGMLDescribe = function(coordinates,srs) {
        if(!srs){
            srs = DEFAULT_SRS;
        }
        var sb = "";
        sb += insert(GMLLINESTRING_HEAD,GMLLINESTRING_HEAD.length - 2," "+srs);
        sb += (GMLCOORDINATES_HEAD);
        for (var i = 0; i < coordinates.length; i++) {
            var c = GeoCoordinate(coordinates[i]);
            sb += (c.longitude + "," + c.latitude) + (" ");
            if(i==coordinates.length-1){
                sb = sb.substring(0,sb.length-2);
            }
        }
        sb += (GMLCOORDINATES_TAIL);
        sb += (GMLLINESTRING_TAIL);
        return sb;
    };
    var buildSurfaceGMLDescribe = function(coordinates,srs) {
        if(!srs){
            srs = DEFAULT_SRS;
        }
        var sb = "";
        sb += insert(GMLLINESTRING_HEAD,GMLLINESTRING_HEAD.length - 2," "+srs);
        sb += (GMLCOORDINATES_HEAD);
        for (var i = 0; i < coordinates.length; i++) {
            var c = GeoCoordinate(coordinates[i]);
            sb += (c.longitude + "," + c.latitude) + (" ");
            if(i==coordinates.length-1){
                sb = sb.substring(0,sb.length-2);
            }
        }
        sb += (GMLCOORDINATES_TAIL);
        sb += (GMLLINESTRING_TAIL);
        return sb;
    };
    var wrapSpatialCondition = function(conditionInfo) {
        var sb = "";
        if (conditionInfo != null) {
            var type = conditionInfo.getGMLType();
            sb += conditionInfo.geom.getGML();
        }
        return sb;
    };
    var getDWithinCondition = function(unit, distance) {
        var sb = insert(WFS_SPATIAL_OPERATOR_DISTANCE_HEAD,
            WFS_SPATIAL_OPERATOR_DISTANCE_HEAD.length -2,
            " "+WFS_SPATIAL_OPERATOR_UNITS_HEAD+unit+"\"");
        sb += (distance);
        sb += (WFS_SPATIAL_OPERATOR_DISTANCE_TAIL);
        return sb;
    };
    var wrapSpatialOperator = function(operatorType,sb,distance) {
        if(!distance)
            distance = 0;
        var result = "";
        if (isLegalSpatialOperator(operatorType)) {
            result = insert(sb,0,SPATIAL_OPERATOR_HEAD[operatorType]);				
            if (GISConsts.SPATIAL_OPERATOR_TYPE_DWITHIN == operatorType) {
                result += getDWithinCondition("cm",distance);
            }
            result += SPATIAL_OPERATOR_TAIL[operatorType];
        }
        return result;
    };
    var isLegalSpatialOperator = function(operatorType){
        return ((operatorType >= 0) && (operatorType <= GISConsts.SPATIAL_OPERATOR_TYPE_OVERLAP));
    };
    var wrapWithFilterTag = function(sb) {
        var result = insert(sb,0,WFS_GETFEATURE_FILTER_HEAD);
        result += WFS_GETFEATURE_FILTER_TAIL;
        return result;
    };
		
    var wrapWithRequirePropertyNameTag = function(propertyName) {
        var sb = WFS_RESULTPROPERTY_HEAD;
        sb += propertyName;
        sb += WFS_RESULTPROPERTY_TAIL;
        return sb;
    };
    var wrapWithFilterPropertyNameTag = function(propertyName,spatial) {
        var sb = "";
        if (spatial) {
            sb += (WFS_GETFEATURE_QUERY_SPATIAL_RESULTPROPERTY_HEAD);
            sb += (propertyName);
            sb += (WFS_GETFEATURE_QUERY_SPATIAL_RESULTPROPERTY_TAIL);
        } else {
            sb += (WFS_RESULTPROPERTY_HEAD);
            sb += (propertyName);
            sb += (WFS_RESULTPROPERTY_TAIL);
        }
        return sb;
    };
		
    var wrapGetFeature = function(sb) {
        var result = insert(sb,0,WFS_GETFEATURE_HEAD);
        result += WFS_GETFEATURE_TAIL;
        return result;
    };
    var wrapQuery = function(contents, layerName) {
        var sb = insert(WFS_QUERY_HEAD,WFS_QUERY_HEAD.length-2," typeName=\""+layerName+"\"");
        return sb;
    };
    var wrapQueryTail = function(contents) {
        return contents + (WFS_QUERY_TAIL);
			
    };
    var splitBlankTokenString = function(source) {
        var stTokenizer = new StringTokenizer(source, " ");
        var result = new Array();
        while(st.hasMoreTokens()){
            result.push(st.getToken());
        }
        return result;
    };
		
    var createTInsert = function(gmlType,geoms){
        var result = "";
        return result;
    };

    var wrapWFSTransactionInsert = function(sb,nameSpace,geoserver,layerName){
        var result = insert(sb,0,WFS_ADD_HEAD);
        result = insert(result,0,geoserver+"/DescribeFeatureType?typename="+layerName+WFS_TRANSACTION_INSERT_HEAD_E);
        result = insert(result,0,WFS_TRANSACTION_INSERT_HEAD_F+" xmlns:"+nameSpace+WFS_TRANSACTION_SCHEMALLOCATION+"\n");
        result += WFS_INSERT_TAIL;
        result += WFS_TRANSACTION_TAIL;
        return result;
    };
		
    var buildInsertAction = function(wfsServicePath,nameSpace,layerName,features){
        var result = createFeatures(layerName,features);
        result = wrapWFSTransactionInsert(result,nameSpace,wfsServicePath,layerName);
        return result;
    };
    var createFeatures = function(layerName,features){
        var result = "";
        if(features){
            for(var i=0;i<features.length;i++){
                result += createFeature(layerName,Feature(features[i]));
            }
        }		
        return result;
			
    };
    var createFeature = function (layerName,feature){
        var result = "<"+layerName+">\n<the_geom>\n";			
        result += feature.geom.getGML();	
        result += "</the_geom>\n";
        var names = feature.propertyNames;
        for (var name in names){
            result += "<"+name+">"+feature.getProperty(name)+"</"+name+">\n";
        }
        result += "</"+layerName+">\n";			
        return result;
    };
    var wrapWFSCommonEdit = function (action,nameSpace){
        var s = insert(WFS_TRANSACTION_COMMON_HEAD,WFS_TRANSACTION_COMMON_HEAD.length-2,"\n xmlns:"+nameSpace);
        var result = insert(action,0,s);
        result += WFS_TRANSACTION_TAIL;
        return result;
    };
    var wrapWFSQuery = function (action,nameSpace){
        var index = WFS_GETFEATURE_HEAD.indexOf("xsi:");
        var s = insert(WFS_GETFEATURE_HEAD,index," xmlns:"+nameSpace+"\n ");
        var result = insert(action,0,s);
        result += WFS_GETFEATURE_TAIL;
        return result;
    };
    var buildWFSOperator = function (nameSpace,actions){
        var result = "";
        for (var action in actions){
            result += action.getActionWFS();
        }
        result = wrapWFSCommonEdit(result,nameSpace);
        return result;
    };
    var buildQueryOperator = function(nameSpace,actions){
        var result = "";
        for (var action in actions){
            result += action.getActionWFS();
        }
        result = wrapWFSQuery(result,nameSpace);
        return result;
    };
    var handleQuery = function(e){
    //			var root = e.result as XML;
    //			return handleGMLResult(root);
    };
    var handleGMLResult = function(root){
    //			var gm = root.namespace("gml");
    //			var fm = root.gml::Members[0];
    //			var featuresList = fm.children();
    //			var result = new Array();
    //			for each(var feature in features){
    //				var f = Feature.createFeatureByXML(feature);	
    //				result.push(f);
    //			}
    //			return result;
    };
    var query = function(server,operation,resultHandler,faultHandle,resultFormat){
        resultFormat = "etx";
        var hooker = new Hooker();
        hooker.successHandler = resultHandler;
        GISUtils.httpPost(server,operation,hooker.handlerQueryResult,faultHandler,resultFormat);			
    };
    var insertFeatures = function(server,namespace,layerName,features,resultHandler,faultHandler,resultFormat){
        if(!resultFormat){
            resultFormat = "e4x";
        }
        var operation = WFSUtils.buildInsertAction(server,namespace,layerName,
            features);
        var hooker = new Hooker();
        hooker.successHandler = resultHandler;
        GISUtils.httpPost(server,operation,hooker.handlerCommonResult,faultHandler,resultFormat);
    };
    var updateFeatures = function(server,statements,successHandler,faultHandler,resultFormat){
        if(!resultFormat){
            resultFormate = "e4x";
        }
        var hooker = new Hooker();
        hooker.successHandler = successHandler;
        GISUtils.httpPost(server,statements,hooker.handlerCommonResult,faultHandler,resultFormat);
    };
    var deleteFeatures = function(server,statements,successHandler,faultHandler,resultFormat){
        if(!resultFormat){
            resultFormat = "e4x";
        }
        var hooker = new Hooker();
        hooker.successHandler = successHandler;
        GISUtils.httpPost(server,statements,hooker.handlerCommonResult,faultHandler,resultFormat);
    } ;          

var SPATIAL_OPERATOR_HEAD = [ WFS_SPATIAL_OPERATOR_DISJOINT_HEAD,
    WFS_SPATIAL_OPERATOR_EQUALS_HEAD, WFS_SPATIAL_OPERATOR_DWITHIN_HEAD, 
    WFS_SPATIAL_OPERATOR_INTERSECT_HEAD,WFS_SPATIAL_OPERATOR_TOCHES_HEAD, 
    WFS_SPATIAL_OPERATOR_CROSS_HEAD, WFS_SPATIAL_OPERATOR_WITHIN_HEAD,
    WFS_SPATIAL_OPERATOR_CONTAIN_HEAD, WFS_SPATIAL_OPERATOR_BBOX_HEAD,
    WFS_SPATIAL_OPERATOR_OVERLAP_HEAD ];
var SPATIAL_OPERATOR_TAIL = [WFS_SPATIAL_OPERATOR_DISJOINT_TAIL,
    WFS_SPATIAL_OPERATOR_EQUALS_TAIL, WFS_SPATIAL_OPERATOR_DWITHIN_TAIL, 
    WFS_SPATIAL_OPERATOR_INTERSECT_TAIL,WFS_SPATIAL_OPERATOR_TOCHES_TAIL, 
    WFS_SPATIAL_OPERATOR_CROSS_TAIL, WFS_SPATIAL_OPERATOR_WITHIN_TAIL,
    WFS_SPATIAL_OPERATOR_CONTAIN_TAIL,WFS_SPATIAL_OPERATOR_BBOX_TAIL,
    WFS_SPATIAL_OPERATOR_OVERLAP_TAIL ];
