var editor = window.editor = {};
editor.ui = {};

$(function() {
  $("#toolbar button").button();

  var accordionPane = new editor.ui.AccordionPane();
  var network = window.network = new editor.GridNetwork();
  var contentPane = document.createElement('div');
  contentPane.setAttribute('class', 'editor-container');
  contentPane.appendChild(network.getView());
  contentPane.appendChild(accordionPane.getView());

  function adjustBounds() {
    network.adjustBounds({
      x: 200,
      y: 0,
      width: contentPane.clientWidth - 200,
      height: contentPane.clientHeight
    });
  }

  $('.main').append($(contentPane));
  adjustBounds();
  accordionPane.initView();

  window.onresize = function(e) {
    adjustBounds();
    accordionPane.refresh();
  };
});