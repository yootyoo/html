twaver.gis.util.MapFactory = {};
twaver.gis.util.MapFactory.createMap = function(parent,type,id){
    var result = null;
    switch(type){
        case GISConsts.MAPTYPE_EMBEDED:
            break;
        default:
            result = new OriginalMap(parent,id);
            break;
    }
    return result;
};
