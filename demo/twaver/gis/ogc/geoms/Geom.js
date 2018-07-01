twaver.gis.ogc.geoms.Geom = function(srs){
    this.isGeom = true;
    if(!srs){
        srs = twaver.gis.ogc.util.WFSUtils.DEFAULT_SRS;
    }
    
}
var OGCGEOM = twaver.gis.ogc.geoms.Geom;
OGCGEOM.GEOM_POINT = "Point";
OGCGEOM.GEOM_POINT = "Point";
OGCGEOM.GEOM_MULTIPOINT = "MultiPoint";
OGCGEOM.GEOM_LINE = "LineString";
OGCGEOM.GEOM_MULTILINE = "MultiLineString";
OGCGEOM.GEOM_LINERING = "LinearRing";
OGCGEOM.GEOM_POLYGON = "Polygon";
OGCGEOM.GEOM_MULTISURFACE = "MultiSurface";
OGCGEOM.GEOM_SUFACEMEMBER = "surfaceMember";
OGCGEOM.GEOM_MULTIPOLYGON = "MultiPolygon";
OGCGEOM.GEOM_POLYGON_OUTBORDER_110 = "exterior";
OGCGEOM.GEOM_POLYGON_OUTBORDER_100 = "outerBoundaryIs";
