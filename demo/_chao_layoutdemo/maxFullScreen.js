function init() {

		box1 = new twaver.ElementBox();
	    network1 = new twaver.vector.Network(box1);
        autoLayouter1 = new twaver.layout.AutoLayouter(box1);

	 	box2 = new twaver.ElementBox();
	 	network2 = new twaver.vector.Network(box2);
	 	autoLayouter2 = new twaver.layout.AutoLayouter(box2);

	 	locations1 = {};
	 	locations2 = {};

	 	autoLayouter2.setAnimate(false);
	 	autoLayouter1.setAnimate(false);
	  createNetWork('topo-container',box1,network1,autoLayouter1,locations1);
	  setTimeout(function(){
	  	createNetWork('topo-container1',box2,network2,autoLayouter2,locations2);	
	  },1000);
		   
	}


	function  createLink (from, to) {
	    var link = new twaver.Link(from, to);
	    link.setStyle('link.color', '#153963');
	    link.setStyle('link.width', 3);

	    link.setStyle('link.corner', 'none');
	    link.setStyle('link.type',  "parallel");
	    link.setStyle('arrow.to',true);
		link.setStyle("arrow.to.color",'#153963');
		link.setStyle("outer.color",'#234c7f');
		link.setStyle("arrow.to.outline.width",'2');
		link.setStyle("arrow.to.outline.color",'#234c7f');
		
	    link.setStyle('arrow.to.shape','arrow.singleDirection');
	    return link;
	}
	
function createNetWork(id,box,network,autoLayouter,locations){
        /* var box = new twaver.ElementBox();
	 	var network = new twaver.vector.Network(box);*/
	  
	  	document.getElementById(id).appendChild(network.getView());
	  	network.adjustBounds({ x: 0, y: 0, width: 980, height: 700 });

	 	_twaver.arrow.register('arrow.singleDirection', function() {
		   	var pointArray = new twaver.List();
		    pointArray.add({ x: -9 / 12, y: -0.15});
		    pointArray.add({ x: -1.2,y: 7 / 9  });
		    pointArray.add({x:-0.9,y: 7 / 9});
		    pointArray.add({x: 0.5,y: -0.16});
		    return {points:pointArray};
		}());
		
		//registerNormalImage("host",'host.png');

		var node1 = new twaver.Node();
		node1.setName('node1');
		//node1.setImage("host");
		//node1.setLocation(100, 100);
		node1.setStyle("label.color",'#0389c5');
		box.add(node1);

		var node2 = new twaver.Node();
		node2.setName('node2');
		//node2.setImage("host");
		//node2.setLocation(300, 200);
		node2.setStyle("label.color",'#0389c5');
		box.add(node2);

		var node3 = new twaver.Node();
		node3.setName('node3');
		//node2.setImage("host");
		//node3.setLocation(300, 200);
		node3.setStyle("label.color",'#0389c5');
		box.add(node3);

		var node4 = new twaver.Node();
		node4.setName('node4');
		//node2.setImage("host");
		//node4.setLocation(300, 200);
		node4.setStyle("label.color",'#0389c5');
		box.add(node4);

		var node5 = new twaver.Node();
		node5.setName('node5');
		//node2.setImage("host");
		//node5.setLocation(300, 200);
		node5.setStyle("label.color",'#0389c5');
		box.add(node5);

		var link = createLink(node1,node2);
		link.setStyle('link.from.xoffset',25);
		link.setStyle('link.to.xoffset',-20);
	
		box.add(link);
		
		//var autoLayouter = new twaver.layout.AutoLayouter(box);

		autoLayouter.doLayout("round",function(){
				var elements = box.getDatas()._as;
				var i;
			 	for(i=0;i<elements.length;i++){
			 		var element = elements[i];
			 		if(element instanceof twaver.Node){
			 			var elementId = element.getId();
			 			var elementLoc = element.getLocation();
			 			locations[elementId] = {
			 				x:elementLoc.x,
			 				y:elementLoc.y
			 			}
			 		}
			 		
			 	}
			 	// return locations;
			});	
}

function registerNormalImage(name, url) {
		var image = new Image();
		image.src = url;
		image.onload = function() {
			twaver.Util.registerImage(name, image, image.width, image.height);
			image.onload = null;			
		};
	}