twaver.gis.Default = {        
    ELEMENTUI_FUNCTION:function(network,element){
        if(element instanceof twaver.Link){
            return new twaver.network.SimpleLinkUI(network,element)
        }else if(element instanceof twaver.Node){
            return new twaver.network.BaseUI(network,element);
        }
        return null;
    }
};
