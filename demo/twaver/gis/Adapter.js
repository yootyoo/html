twaver.gis.Adapter = function(){
    
};
twaver.Util.ext('twaver.gis.Adapter',Object,{
    bindNetworkAndMap:function(network,map){
        this.network = network;
        if(this.network){
            this.network.getView().style.overflow = 'hidden';
            if($ua.isTouchable){
                this.network.setTouchInteractions();
            }else{
                this.network.setDefaultInteractions();
            }
        }

        this.map = map;
        this.installListeners();
        if(this.map){
            this.map.setSynComponent(this.network);
        }
        if($ua.isTouchable){
            this.installTouchInteraction(this.network);
        }else{
            if(network instanceof twaver.network.Network){
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.network.interaction.MoveInteraction(this.network, false),
                new twaver.network.interaction.DefaultInteraction(this.network)
                ]);
            }else if(network instanceof twaver.canvas.Network){
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.canvas.interaction.MoveInteraction(this.network, false),
                new GisCanvasDefaultInteraction(this.network, this.map)
                ]);
            }else {
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.canvas.interaction.MoveInteraction(this.network, false),
                new GisVectorDefaultInteraction(this.network, this.map)
                ]);
            }
        }
    },
    unbindNetworkAndMap:function(){
        this.removeListeners();
        if(this.network){
            this.network.getView().style.overflow = 'auto';
            if($ua.isTouchable){
                this.installTouchInteraction(this.network);
            }else{
                this.network.setDefaultInteractions();
            }
        }
        if(this.map){
            this.map.setSynComponent(null);
        }
    },
    panFunction:function(){
        var v = (!this.hasSelectedElement());
        return v;
    },
    hasSelectedElement:function(){
        if(this.network.getElementBox().getSelectionModel().getLastData()){
            return true;
        }
        return false;
    },
    installListeners : function(){
        if(this.network){
            this.installNetworkListeners();
            var box = this.network.getElementBox();
            this.monitorNetworkBox(box);
        }
        if(this.map){
            this.installMapListeners();
            this.map.setPanFunction(this.panFunction,this);
        }
       
    },
    installMapListeners:function(){
        this.map.addMapEventListener(this.monitorMapChangedEvent,this);
    },
    removeMapListeners:function(){
        this.map.removeMapEventListener(this.monitorMapChangedEvent,this);
    },
    removeListeners : function(){
        if(this.network){            
            this.removeNetworkListeners();
            var box = this.network.getElementBox();
            this.clearNetworkBoxListeners(box);
        }
        if(this.map){
            this.removeMapListeners();
        }
    },
    installNetworkInteraction:function(){
        this.network.addInteractionListener(this.monitorMoveNode,this,true);
    },
    installNetworkListeners : function(){
        this.network.addPropertyChangeListener(this.dealwithDataboxChanged,this);
        this.installNetworkInteraction();
    },
    dealwithDataboxChanged:function(evt){
        if("elementBox" === evt.property){
            var oldBox = evt.oldValue;
            this.clearNetworkBoxListeners(oldBox);
            var box = evt.newValue;
            this.monitorMapChangedEvent(box);
            this.resetElements();
        }
    },
    removeNetworkListeners : function(){
        // this.network.removePorpertyChangeListener(this.handleDataBoxChanged,this);
        this.network.removePropertyChangeListener(this.dealwithDataboxChanged,this);
        this.removeNetworkInteraction();
    },
    removeNetworkInteraction:function(){
        this.network.removeInteractionListener(this.monitorMoveNode,this,true);
    },
    monitorMapChangedEvent:function(e){
        switch(e.type){
            case twaver.gis.event.MapEvent.CENTER_CHANGED:
            case twaver.gis.event.MapEvent.ZOOM_CHANGED:
            case twaver.gis.event.MapEvent.VIEWPORT_CHANGED:
                this.relocateElements();
                break;
            default:
                break;
        }
    },
    clearNetworkBoxListeners:function(box){
        box.removeDataBoxChangeListener(this.handleDataBoxEvent,this);
        box.removeDataPropertyChangeListener(this.handlePropertyChangedEvent,this);
    },
    
    dealwithDataboxEvent:function(evt){
        if('add' === evt.kind){
            var node = evt.data;
            if(node instanceof twaver.ShapeNode){
                this.resetShapeNode(node);
            }
            this.locateElement(node);
        }
    },
    resetShapeNode:function(node){
        var ps = node.getClient(GISSettings.SHAPE_POINTS);
        if(!ps){
            this.resetShapesByOriginalPoints(node);
        }
    },
    dealwithPropertyChangeEvent:function(evt){
        var name = evt.property;
        var index = name.indexOf(":");
        if(index>0){
            name = name.substring(index+1,name.length);
            switch(name){
                case GISSettings.GEOCOORDINATE:
                    this.locateElement(evt.source);
                    break;
                case GISSettings.SHAPE_POINTS:
                case GISSettings.SHAPENODE_GEOM_TYPE:
                    this.adjustShapeNode(evt.source);
                    break;

            }
        }
        
    },
    monitorNetworkBox:function(box){
        box.addDataBoxChangeListener(this.dealwithDataboxEvent,this);
        box.addDataPropertyChangeListener(this.dealwithPropertyChangeEvent,this);
    },
    resetElements:function(){
        if(this.network){
            var box = this.network.getElementBox();
            box.forEachByDepthFirst(this.resetElement,null,this);
        } 
    },
    resetElement:function(element){
        if(element instanceof twaver.ShapeNode){
            this.resetShapeNode(element);
        }
        this.locateElement(element);
    },
    relocateElements:function(){
        if(this.network){
            var box = this.network.getElementBox();
            box.forEachByDepthFirst(this.locateElement,null,this);
        }       
    },
    locateElement:function(element){
        if((element instanceof twaver.Link)||(element instanceof twaver.Group)){
            
        }else{
            if(this.permitLocating(element)){
                if(element instanceof twaver.ShapeNode){
                    this.adjustShapeNode(element);
                }else {
                    this.locateNormalNode(element);
                }                
            }
        }      
    },
    insertLinesIntoShapeNode:function(node,lines){
        for(var i=0;i<lines.length;i++){
            var line = lines[i];
            this.insertLineIntoShapeNode(node,line);
        }
    },
    adjustShapeNode:function(node){
        node.setSegments(new twaver.List());
        node.setPoints();
        var ps = node.getClient(GISSettings.SHAPE_POINTS);
        switch(node.getClient(GISSettings.SHAPENODE_GEOM_TYPE)){
            case twaver.gis.ogc.geoms.Geom.GEOM_LINE:
            case twaver.gis.ogc.geoms.Geom.GEOM_LINERING:
            
                this.insertLineIntoShapeNode(node,ps);
                break;
            case twaver.gis.ogc.geoms.Geom.GEOM_MULTILINE:
                this.insertLinesIntoShapeNode(node,ps);
                break;
            case twaver.gis.ogc.geoms.Geom.GEOM_MULTISURFACE:
                for (var surface in ps){
                    for (var polygon in surface){
                        for (var line in polygon){
                            this.insertLineIntoShapeNode(node,line[0]);
                        }
                    }
                }
                break;
            default:
                break;
        }
    },
    isMultiSurface:function(ps){
        if(ps){
            if(ps[0] instanceof Array){
                var surfaces = ps[0];
                if(surfaces[0] instanceof Array){
                    var polygon = surfaces[0];
                    if(polygon.length >= 1){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    permitLocating:function(element){
        if(GISUtils.getBoolean(GISSettings.ONLY_LOCATE_VISIBLE_ELEMENT)){
            return this.network.isVisible(element);
        }
        return true;
    },
    insertLineIntoShapeNode:function(node,ps){
        if(ps.length>0){
            var segments = new twaver.List();
            var points = new twaver.List();
            var lastPoint = {
                x:-10000000,
                y:-100000000
            };
            for (var i = 0;i<ps.length;i++){
                var position = this.getScreenPoint(ps[i]);
                if(GISUtils.isIllegal(lastPoint,position,GISUtils.getLegalDistanceToLeranceOfTileMap(this.map))){
                    if(i == 0){
                        segments.add("moveto");						
                    }else{
                        segments.add("lineto");
                    }	
                    points.add(position);
                    lastPoint = position;
                }
            }
            node.getSegments().addAll(segments);
            node.getPoints().addAll(points);
            node.firePointsChange();
        }
    },
    getScreenPoint:function(geo){
        if(this.map){
            return this.getScreenPointOnTWaverMap(geo);
        }
        return {
            x:0,
            y:0
        };
    },
    getScreenPointOnTWaverMap:function(geo){
        var position = getScreenPointFromGeoPoint(geo,
            this.map.getViewportBounds(),this.map.getZoomLevel(),
            this.map.getProjectionType());
        return position;
    },
		
    locateNormalNode:function(node){
        var result = node.getClient(GISSettings.GEOCOORDINATE);
        if(result instanceof twaver.gis.geometry.GeoCoordinate){
            var coordinate = result;
            var position = this.getScreenPoint(coordinate);
            node.setCenterLocation(position);				
        }
    },

    monitorMoveNode:function(evt){
        var kind = evt.kind;
        if(("lazeMoveStart" == kind)||("liveMoveStart" == kind)){
            this.startMoving();
        }else if(("lazyMoveEnd" == kind)||("liveMoveEnd" == kind)){
            this.endMoving();
        }
    },
    startMoving:function(){
        
    },
    endMoving:function(){
        // var o = this.network.getElementBox().getSelectionModel().getLastData();
        var os = this.network.getElementBox().getSelectionModel().getSelection();
        var self = this;
        os.forEach(function(o){
            if(o instanceof twaver.ShapeNode){
                self.resetShapesByOriginalPoints(o);
            }else if(o instanceof twaver.Node){
                self.resetGeoCoordinate(o);
            } 
        });

        // if(o instanceof twaver.ShapeNode){
        //     this.resetShapesByOriginalPoints(o);
        // }
        // else if(o instanceof twaver.Node){
        //     this.resetGeoCoordinate(o);
        // }
    },
    resetShapesByOriginalPoints:function(node){
        var type = node.getClient(GISSettings.SHAPENODE_GEOM_TYPE);
        switch(type){
            case twaver.gis.ogc.geoms.Geom.GEOM_MULTISURFACE:
            case twaver.gis.ogc.geoms.Geom.GEOM_MULTIPOLYGON:
                this.resetMultiSurfaceShapeNode(node);
                break;
            default:
                this.resetLineShapeNode(node);
                break;
        }
			
    },
    resetMultiSurfaceShapeNode:function(node){
        var points = node.getPoints();
        var segments = node.getSegments();
        var surfacesArray = node.getClient(GISSettings.SHAPE_POINTS);
        var surfaceNum = surfacesArray.length;
        var polygonNum = surfacesArray[0].length;
        var lineNum = surfacesArray[0][0].length;			
        var lineCounter = 0;
        var polygonCounter = 0;
        var surfaceCounter = 0;
        var length = points.length;
        var lineArray = null;
        for(var i=0;i<length;i++){
            switch(segments.getItemAt(i)){
                case "moveto":
                    if(lineArray){
                        surfacesArray[surfaceCounter%surfaceNum][polygonCounter%polygonNum][lineCounter%lineNum][0] = lineArray;
                        lineCounter++;
                        polygonCounter = lineCounter / lineNum;
                        surfaceCounter = polygonCounter / polygonNum;
                    }
                    lineArray = [];
                    break;
                default:
                    break;
            }
            var point = points.get(i);
            lineArray.push(this.map.getGeoPointFromPointOnMap(point.x,point.y));
        }
    },
    resetLineShapeNode:function(node){
        var ps = [];
        var points = node.getPoints();
        for(var i=0;i<points.length;i++){
            var point = points.get(i);
            ps.push(this.map.getGeoPointFromPointOnMap(point.x,point.y));
        }
        if(ps.length>0)
            node.setClient(GISSettings.SHAPE_POINTS,ps);
    },
    resetGeoCoordinate:function(node){
        if(node instanceof twaver.Group){
            var gc = node.getChildren();            
            var self = this;
            gc.forEach(function(o){
                if(o instanceof twaver.Node){
                    self.resetGeoCoordinate(o);
                }
            });
        }else{
            var coordinate = this.getGeoCoordinate(node.getCenterLocation());
            node.setClient(GISSettings.GEOCOORDINATE,coordinate);
        }
    },
    getGeoCoordinate:function(p){
        if(this.map){
            return this.getGeoCoordinateOnTWaverMap(p);
        }else {
				
        }
        return new twaver.gis.geometry.GeoCoordinate();
    },
    getGeoCoordinateOnTWaverMap:function(p){
        return getGeoPointFromScreenPoint(p.x,p.y,
            this.map.getViewportBounds(),this.map.getZoomLevel(),this.map.getProjectionType());
    },
    installTouchInteraction:function(network){
        network.setInteractions([
            new twaver.gis.interactions.NonBlockTouchInteraction(network)
            ]);
    },
    disableCombineInteraction:function(){
    	this.map.enableCombinationInteraction(false);
    	this.network.setDefaultInteractions();
    },
    enableCombineInteraction:function(){
    	this.map.enableCombinationInteraction(true);
    	 // this.network.setInteractions([
      //           new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
      //           new twaver.network.interaction.MoveInteraction(this.network, false),
      //           new twaver.network.interaction.DefaultInteraction(this.network)
      //           ]); 

          if(this.network instanceof twaver.network.Network){
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.network.interaction.MoveInteraction(this.network, false),
                new twaver.network.interaction.DefaultInteraction(this.network)
                ]);
            }else if(this.network instanceof twaver.canvas.Network){
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.canvas.interaction.MoveInteraction(this.network, false),
                new GisCanvasDefaultInteraction(this.network, this.map)
                ]);
            }else {
                this.network.setInteractions([
                new twaver.gis.interactions.NetworkSelectionInteraction(this.network),
                new twaver.canvas.interaction.MoveInteraction(this.network, false),
                new GisVectorDefaultInteraction(this.network, this.map)
                ]);
            }
    }
             
});

GisCanvasDefaultInteraction = function (network, map) {
    this.map = map;
    GisCanvasDefaultInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('GisCanvasDefaultInteraction', twaver.canvas.interaction.DefaultInteraction, {
    handleDoubleClicked: function (e, element) {
        if(this.map && !this.map.isEnableDoubleZoom()){
            $network_interaction.handleDoubleClicked(this.network, e, element);
        }
    },
});
GisVectorDefaultInteraction = function (network, map) {
    this.map = map;
    GisVectorDefaultInteraction.superClass.constructor.call(this, network);
};
_twaver.ext('GisVectorDefaultInteraction', twaver.vector.interaction.DefaultInteraction, {
    handleDoubleClicked: function (e, element) {
        if(this.map && !this.map.isEnableDoubleZoom()){
            $network_interaction.handleDoubleClicked(this.network, e, element);
        }
    },
});

