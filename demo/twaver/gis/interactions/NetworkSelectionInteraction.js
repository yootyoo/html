twaver.gis.interactions.NetworkSelectionInteraction = function(network){
    twaver.gis.interactions.NetworkSelectionInteraction.superClass.constructor.call(this,network);
}
twaver.Util.ext('twaver.gis.interactions.NetworkSelectionInteraction', twaver.network.interaction.SelectInteraction, {
    handle_mousemove: function (e) {
    }
});
