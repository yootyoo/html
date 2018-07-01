editor.ui.PropertySheetPane = function(){
	this.rightContent = $('<div class = "right-content"></div>');
	this.initRoadPane();
}

twaver.Util.ext(editor.ui.PropertySheetPane, Object, {
	element: null,
	appendContent: function(contentdiv){
		this.rightContent.append(contentdiv);
	},
	show: function(callback){
		this.rightContent.animate({
          'marginRight': 0
        }, 400, callback);
	},
	hide: function(){
		this.rightContent.animate({
          'marginRight': -300
        });
	},
	setElement: function(element){
		this.element = element;
		var roadWidth = $('#roadWidth');
		var roadPoints = $('#roadPoints');
		roadWidth.val(element.getClient('radius'));
		var pointsValue = [];
		var points = element.getPoints();
		var segments = element.getSegments();
		if(segments && segments.size()> 0){
			for(var i = 0, j = 0; i < segments.size(); i++,j++){
				var segment = segments.get(i);
				var point = points.get(j);
				if(segment == 'moveto' || segment == 'lineto'){
					pointsValue.push('['+[parseInt(point.x), parseInt(point.y)]+']');
				}else if(segment == 'quadto'){
					var point2 = points.get(++j);
					pointsValue.push('[c,'+[parseInt(point.x), parseInt(point.y), parseInt(point2.x), parseInt(point2.y)]+']');
				}
			}
		}else{
			for(var i = 0; i< points.size(); i++){
				var point = points.get(i);
				pointsValue.push('['+[parseInt(point.x), parseInt(point.y)]+']');
			}
		}
		roadPoints.val(pointsValue);

		// roadWidth.focus();
	},
	getView: function(){
		return this.rightContent[0];
	},
	initRoadPane: function(){
		var roadContent =  '<div id="roadProperty" class= "property-main">'+
								'<div class = "property-title">'+
									'<span title = "路面属性" class = "title-text">路面sss属性</span>'+
								'</div>'+
								'<div class = "property-conent">'+
									'<div class = "row clearfix">'+
										'<div class = "col-md-3 input-l">路  宽：</div>'+
										'<div class = "col-md-9 input-v">'+
											'<input id="roadWidth" type="text" value="6" class= "form-control input-sm">'+
										'</div>'+
								    '</div>'+
								    '<div class = "row clearfix">'+
										'<div class = "col-md-3 input-l">路 径：</div>'+
										'<div class = "col-md-9 input-v">'+
											'<textarea id="roadPoints" rows="5" value="6" class= "form-control">'+
										'</div>'+
								    '</div>'+
							   '</div>'+
						   '</div>';
		this.appendContent(roadContent);
	},
	bindData: function(){
		var self = this;
		var roadWidth = $('#roadWidth');
		var roadPoints = $('#roadPoints');
		var setWidthValue = function(){
			var element = self.element;
			var radius = parseFloat(roadWidth.val());
			if(radius && element){
				element.setClient('radius',radius);
				element.setStyle('vector.outline.width', radius);
			}
		}
		var setPointsValue = function(){
			var element = self.element;
			var pointsValue = roadPoints.val().replace(/\s/g,'').split('],[');
			var points = new twaver.List();
			var segments = new twaver.List();

			for (var j = 0; j < pointsValue.length; j++) {
			 	var point = pointsValue[j].replace('[','').replace(']','').split(',');
			 	if(j == 0){
			 		segments.add("moveto");
			 		if(point[0] === 'm' || point[0] === "'m'"){
			 			points.add({x:point[1], y: point[2]});
			 		}else{
			 			points.add({x:point[0], y: point[1]});
			 		}
			 	}else{
			 		if (point[0] === 'c' || point[0] === "'c'") {
	                    segments.add("quadto");
	                    points.add({x:point[1], y: point[2]});
	                    points.add({x:point[3], y: point[4]});
	                } else if(point[0] === 'l' || point[0] === "'l'") {
	                    segments.add("lineto");
	                    points.add({x:point[1], y: point[2]});
	                } else{
	                	segments.add("lineto");
	                    points.add({x:point[0], y: point[1]});
	                }
			 	}
			}
			element.setSegments(segments);
			element.setPoints(points);
		}
		roadWidth.focusout(function(){
			setWidthValue();
		}).keydown(function(){
			setWidthValue();
		});
		roadPoints.focusout(function(){
			setPointsValue();
		});

	},


});