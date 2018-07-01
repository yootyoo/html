twaver.vector.BaseZoomManager = function(network) {
	this.network = network;
	this.visibilityThresholds = network.visibilityThresholds;
};

_twaver.ext('twaver.vector.BaseZoomManager', Object, {

	getZoom : function() {
		return this.network.getZoom();
	},

	getGraphicsZoom : function() {
		return 1;
	},

	getSizeZoom : function(ui) {
		return 1;
	},

	getAttachmentSizeZoom : function(attachment) {
		var ui = attachment.getElementUI();
		return this.getSizeZoom(ui);
	},

	getLocationZoom : function() {
		return 1;
	},

	_getZoomVisibilityThresholds : function() {
		return this.network.getZoomVisibilityThresholds();
	},

	_convertPointFromView : function(p) {
		var x = p.x * this.getGraphicsZoom() - this.network.getViewRect().x;
		var y = p.y * this.getGraphicsZoom() - this.network.getViewRect().y;
		return {
			x : x,
			y : y
		};
	},

	_getElementViewRect : function(ui, viewRect) {
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getSizeZoom(ui);

		if (locationZoom == 1 && sizeZoom == 1) {
			return viewRect;
		}

		var center = this._getZoomPoint(ui);
		var cx = center.x;
		var cy = center.y;
		if (viewRect == null) {
			console.log('View rect is null');
		}
		return {
			x : cx * locationZoom + (viewRect.x - cx) * sizeZoom,
			y : cy * locationZoom + (viewRect.y - cy) * sizeZoom,
			width : viewRect.width * sizeZoom,
			height : viewRect.height * sizeZoom
		};
	},

	_invalidateZoom : function() {
		this.network.invalidateElementUIs();
	},

	_getGroupChildrenRects : function(group) {
		var list = new $List();
		group.getChildren().forEach(function(child) {
			if ( child instanceof $Node) {
				var ui = this.network.getElementUI(child);
				if (ui) {
					var rect = ui.getZoomViewRect(this);
					if (rect) {
						list.add(rect);
					}
				}
			}
		}, this);
		return list;
	},

	_zoomGraphicsBegin : function(g) {
		var network = this.network;
		var gzoom = this.getGraphicsZoom();
		g.scale(gzoom, gzoom);
		g.translate(Math.floor(-network.viewRect.x / gzoom), Math.floor(-network.viewRect.y / gzoom));
	},

	_getEditZoomPoints : function(ui, points) {
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getSizeZoom(ui);
		if ((locationZoom == 1 && sizeZoom == 1) || ( ui instanceof twaver.vector.LinkUI && !(ui instanceof twaver.vector.ShapeLinkUI))) {
			return points;
		}
		var center;
		if ( ui instanceof twaver.vector.ShapeLinkUI) {
			center = $math.getCenterPoint($math.getRect(points));
		} else {
			center = this._getZoomPoint(ui);
		}
		var cx = center.x;
		var cy = center.y;
		if (points.forEach) {
			var zoomPoints = new $List(), subList;
			points.forEach(function(point) {
				if ( point instanceof $List) {
					subList = new $List();
					point.forEach(function(p) {
						subList.add({
							x : cx * locationZoom + (p.x - cx) * sizeZoom,
							y : cy * locationZoom + (p.y - cy) * sizeZoom,
						});
					});
					zoomPoints.add(subList);
				} else {
					zoomPoints.add({
						x : cx * locationZoom + (point.x - cx) * sizeZoom,
						y : cy * locationZoom + (point.y - cy) * sizeZoom,
					});
				}

			});
			return zoomPoints;
		}else if(points.x){
			return {
				x : cx * locationZoom + (points.x - cx) * sizeZoom,
			    y : cy * locationZoom + (points.y - cy) * sizeZoom,
			};
		}

	},

	_getShapeNodeZoomPoints : function(ui, points, reverseZoom) {
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getSizeZoom(ui);
		if (locationZoom == 1 && sizeZoom == 1) {
			return points;
		}
		if (reverseZoom) {
			locationZoom = 1 / locationZoom;
			sizeZoom = 1 / sizeZoom;
		}
		var rect = $math.getRect(points);
		var cx = rect.x + rect.width / 2;
		var cy = rect.y + rect.height / 2;

		var zoomPoints = new $List(), subList;
		points.forEach(function(point) {
			if ( point instanceof $List) {
				subList = new $List();
				point.forEach(function(p) {
					subList.add({
						x : cx * locationZoom + (p.x - cx) * sizeZoom,
						y : cy * locationZoom + (p.y - cy) * sizeZoom,
					});
				});
				zoomPoints.add(subList);
			} else {
				zoomPoints.add({
					x : cx * locationZoom + (point.x - cx) * sizeZoom,
					y : cy * locationZoom + (point.y - cy) * sizeZoom,
				});
			}

		});
		return zoomPoints;
	},

	_getShapeLinkZoomPoints : function(points, reverseZoom) {
		var locationZoom = this.getLocationZoom();
		var sizeZoom = locationZoom;

		if (locationZoom == 1 && sizeZoom == 1) {
			return points;
		}
		if (reverseZoom) {
			locationZoom = 1 / locationZoom;
			sizeZoom = 1 / sizeZoom;
		}

		var rect = $math.getRect(points);
		var cx = rect.x + rect.width / 2;
		var cy = rect.y + rect.height / 2;

		var zoomPoints = new $List(), subList;
		points.forEach(function(point) {
			if ( point instanceof $List) {
				subList = new $List();
				point.forEach(function(p) {
					subList.add({
						x : cx * locationZoom + (p.x - cx) * sizeZoom,
						y : cy * locationZoom + (p.y - cy) * sizeZoom,
					});
				});
				zoomPoints.add(subList);
			} else {
				zoomPoints.add({
					x : cx * locationZoom + (point.x - cx) * sizeZoom,
					y : cy * locationZoom + (point.y - cy) * sizeZoom,
				});
			}

		});
		return zoomPoints;
	},

	_getLogicalPoint : function(e,useZoom) {
	    var zoom = useZoom ? this.getZoom() : this.getGraphicsZoom();
		var point, network = this.network;
		if ($ua.isTouchable && e.changedTouches && e.changedTouches.length > 0) {
			var bound = network._view.getBoundingClientRect();
			var touch = e.changedTouches[0];
			var scrollLeft = $ua.isAndroid ? 0 : $touch.scrollLeft();
			var scrollTop = $ua.isAndroid ? 0 : $touch.scrollTop();
			point = {
				x : (touch.clientX + network.viewRect.x - bound.left - scrollLeft) / zoom,
				y : (touch.clientY + network.viewRect.y - bound.top - scrollTop) / zoom
			};
			return point;
		}

		if ($ua.isFirefox) {
			point = {
				x : (e.layerX + network.viewRect.x) / zoom,
				y : (e.layerY + network.viewRect.y) / zoom
			};
		} else {
			point = {
				x : (e.offsetX + network.viewRect.x) /zoom,
				y : (e.offsetY + network.viewRect.y) /zoom
			};
		}
		return point;
	},

	_getVisibleRect : function(viewRect) {
		return viewRect;
	},

	_getElementZoomRect : function(ui, rect) {
		// return rect;
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getSizeZoom(ui);
		if (locationZoom == 1 && sizeZoom == 1) {
			return _twaver.cloneRect(rect);
		}
		var center = ui != null ? this._getZoomPoint(ui) : {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2
		};
		var cx = center.x;
		var cy = center.y;
		return {
			x : cx * locationZoom + (rect.x - cx) * sizeZoom,
			y : cy * locationZoom + (rect.y - cy) * sizeZoom,
			width : rect.width * sizeZoom,
			height : rect.height * sizeZoom
		};
	},
	_reverseElementZoomRect : function(ui, rect) {
		// return rect;
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getSizeZoom(ui);
		if (locationZoom == 1 && sizeZoom == 1) {
			return _twaver.cloneRect(rect);
		}
		var center = ui != null ? this._getZoomPoint(ui) : {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2
		};
		var cx = center.x;
		var cy = center.y;
		return {
			x : cx + (rect.x - cx * locationZoom) / sizeZoom,
			y : cy + (rect.y - cy * locationZoom) / sizeZoom,
			width : rect.width / sizeZoom,
			height : rect.height / sizeZoom
		};
	},

	_getZoomContentRect : function(attachment, point, contentRect, center, locationZoom, index) {
		var sizeZoom = this.getSizeZoom(attachment.getElementUI());
		var attachmentSizeZoom = this.getAttachmentSizeZoom(attachment);
		var ui = attachment.getElementUI();
		if (index == undefined) {
			if(ui instanceof twaver.vector.GroupUI && ui._shapeRect){
				return {
				x : center.x * locationZoom + (point.x - center.x) * 1 + (contentRect.x - point.x) * attachmentSizeZoom,
				y : center.y * locationZoom + (point.y - center.y) * 1 + (contentRect.y - point.y) * attachmentSizeZoom,
				width : contentRect.width ,
				height : contentRect.height
			};
			}
			return {
				x : center.x * locationZoom + (point.x - center.x) * sizeZoom + (contentRect.x - point.x) * attachmentSizeZoom,
				y : center.y * locationZoom + (point.y - center.y) * sizeZoom + (contentRect.y - point.y) * attachmentSizeZoom,
				width : contentRect.width ,
				height : contentRect.height
			};
		} else {
			return {
				x : center.x * locationZoom + (point.x - center.x) * sizeZoom + (contentRect.x - point.x) * attachmentSizeZoom,
				y : center.y * locationZoom + (point.y - center.y) * sizeZoom + (contentRect.y - point.y) * attachmentSizeZoom + index * (attachment.textHeight - 4) * (attachmentSizeZoom),
				width : contentRect.width,
				height : attachment.textHeight
			};
		}
	},

	_getAttachmentZoomRect : function(attachment, _contentRect, index) {
		//return _contentRect
		var locationZoom = this.getLocationZoom();
		var ui = attachment.getElementUI();
		var sizeZoom = this.getSizeZoom(attachment.getElementUI());
		var attachmentSizeZoom = this.getAttachmentSizeZoom(attachment);
		var pointers = attachment._pointers;

		if (locationZoom == 1 && attachmentSizeZoom == 1 && sizeZoom == 1) {
			if (index == undefined) {
				return _contentRect;
			} else {
				return {
					x : _contentRect.x,
					y : _contentRect.y + index * (attachment.textHeight - 4),
					width : _contentRect.width,
					height : attachment.textHeight
				};
			}
		}

		var ui = attachment.getElementUI();
		var center = this._getZoomPoint(ui, attachment);
		var cx = center.x;
		var cy = center.y;
		var position = attachment.getPosition ? attachment.getPosition() : 'center';
		var fx = 0, fy = 0;
		var point = pointers ? pointers[0] : $position_zoom.get(position, _contentRect);
		if (index == undefined) {
			if ( ui instanceof twaver.vector.LinkUI || (ui instanceof twaver.vector.GroupUI && ui._shapeRect)) {
				return this._getZoomContentRect(attachment, point, _contentRect, center, 1);
			} else {
				return this._getZoomContentRect(attachment, point, _contentRect, center, locationZoom);
			}
			return {
				x : fx,
				y : fy,
				width : _contentRect.width,
				height : _contentRect.height
			};
		} else {
			return this._getZoomContentRect(attachment, point, _contentRect, center, locationZoom, index);
		}
	},

	_getZoomPoint : function(ui, attachment) {
		var element = ui._element, r = 0, c = 0, grid, rect;
		if ( element instanceof twaver.Follower && element.getHost() && element.getHost() instanceof twaver.Grid) {
			grid = element.getHost();
			rect = grid.getRect();
			return {
				x : rect.x + rect.width / 2,
				y : rect.y + rect.height / 2
			};
		} else {
			rect = ui.getBodyRect();
		}
		if(ui instanceof twaver.vector.LinkUI && attachment && attachment.getPosition ){
			var xOffset = attachment.getXOffset();
			var yOffset = attachment.getYOffset();
			if(attachment.getPosition() === 'from'){
				return ui._fromPoint;
			}else if(attachment.getPosition() === 'to'){
				return ui._toPoint;
			}
		}
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2
		};
	},

	_getZoomPointers : function(attachment, ui, pointers) {
		if (pointers) {
			var point = this._getZoomPoint(ui);
			var locationZoom = this.getLocationZoom();
			var sizeZoom = this.getSizeZoom(ui);
			var attachmentSizeZoom = this.getAttachmentSizeZoom(attachment);

			var stander = pointers[0];
			if(ui instanceof twaver.vector.LinkUI){
				return [{
					x : point.x  + (stander.x - point.x) * sizeZoom,
					y : point.y  + (stander.y - point.y) * sizeZoom
				}, {
					x : point.x  + (stander.x - point.x) * sizeZoom + (pointers[1].x - stander.x) * attachmentSizeZoom,
					y : point.y  + (stander.y - point.y) * sizeZoom + (pointers[1].y - stander.y) * attachmentSizeZoom,
				}, {
					x : point.x  + (stander.x - point.x) * sizeZoom + (pointers[2].x - stander.x) * attachmentSizeZoom,
					y : point.y  + (stander.y - point.y) * sizeZoom + (pointers[2].y - stander.y) * attachmentSizeZoom,
				}];
			}else if(ui instanceof twaver.vector.GroupUI && ui._shapeRect){
				return [{
					x : point.x  + (stander.x - point.x) * 1,
					y : point.y  + (stander.y - point.y) * 1
				}, {
					x : point.x  + (stander.x - point.x) * 1 + (pointers[1].x - stander.x) * attachmentSizeZoom,
					y : point.y  + (stander.y - point.y) * 1 + (pointers[1].y - stander.y) * attachmentSizeZoom,
				}, {
					x : point.x  + (stander.x - point.x) * 1 + (pointers[2].x - stander.x) * attachmentSizeZoom,
					y : point.y  + (stander.y - point.y) * 1 + (pointers[2].y - stander.y) * attachmentSizeZoom,
				}];
			}
			return [{
				x : point.x * locationZoom + (stander.x - point.x) * sizeZoom,
				y : point.y * locationZoom + (stander.y - point.y) * sizeZoom
			}, {
				x : point.x * locationZoom + (stander.x - point.x) * sizeZoom + (pointers[1].x - stander.x) * attachmentSizeZoom,
				y : point.y * locationZoom + (stander.y - point.y) * sizeZoom + (pointers[1].y - stander.y) * attachmentSizeZoom,
			}, {
				x : point.x * locationZoom + (stander.x - point.x) * sizeZoom + (pointers[2].x - stander.x) * attachmentSizeZoom,
				y : point.y * locationZoom + (stander.y - point.y) * sizeZoom + (pointers[2].y - stander.y) * attachmentSizeZoom,
			}];
		}
	},

	_getZoomHotSpot : function(ui, hotSpot) {
		if (hotSpot) {
			var point = this._getZoomPoint(ui);
			var locationZoom = this.getLocationZoom();
			var sizeZoom = this.getSizeZoom(ui);
			return {
				x : point.x * locationZoom + (hotSpot.x - point.x) * sizeZoom,
				y : point.y * locationZoom + (hotSpot.y - point.y) * sizeZoom
			};
		}
		return null;
	},

	limitZoom : function(zoom) {
		return zoom;
	},

	_isVisible : function(name) {
		var thresholds = this._getZoomVisibilityThresholds();
		var threshold = thresholds[name];
		var zoom;
		if (threshold != null) {
			var zoomName = thresholds.zoomName;
			if (zoomName == 'sizeZoom') {
				zoom = this.getSizeZoom();
			} else if (zoomName == 'locationZoom') {
				zoom = this.getLocationZoom();
			} else if (zoomName == 'graphicsZoom') {
				zoom = this.getGraphicsZoom();
			} else {
				zoom = this.getZoom();
			}
			if (zoom < threshold) {
				return false;
			}
		}
		return true;
	},

	isElementVisible : function(element) {
		var zoom = this.getZoom();
		var visible = this._isVisible('element', zoom);
		if (visible && element instanceof twaver.Link) {
			return this.isLinkVisible(element);
		}
		return visible;
	},

	isLinkVisible : function(link) {
		var zoom = this.getZoom();
		return this._isVisible('link', zoom);
	},

	isLabelVisible : function(element) {
		var zoom = this.getZoom();
		return this._isVisible('label', zoom);
	},

	isAttachmentVisible : function(element) {
		var zoom = this.getZoom();
		return this._isVisible('attachment', zoom);
	},

	isAlarmBalloonVisible : function(element) {
		var zoom = this.getZoom();
		return this._isVisible('alarmBallon', zoom);
	},

	_getAttachmentOutLineWidth : function(attachment) {
		return attachment.getOutlineWidth();
	},

	_getAttachmentZoomOutLineRect : function(attachment, _contentRect) {
		var locationZoom = this.getLocationZoom();
		var attachmentSizeZoom = this.getAttachmentSizeZoom(attachment);

		if (locationZoom == 1 && attachmentSizeZoom == 1) {
			return _contentRect;
		}

		var rect = this._getAttachmentZoomRect(attachment, _contentRect, null);

        var element = attachment.getElement();

        if (!this.isAttachmentVisible(element)) {
            return {
                x : rect.x,
                y : rect.x,
                width : 0,
                height : 0
            };
        }
        if ((attachment instanceof twaver.vector.LabelAttachment || attachment instanceof twaver.vector.Label2Attachment) && !this.isLabelVisible(element)) {
            return {
                x : rect.x,
                y : rect.x,
                width : 0,
                height : 0
            };
        } else if ((attachment instanceof twaver.vector.AlarmAttachment) && !this.isAlarmBalloonVisible(element)) {
            return {
                x : rect.x,
                y : rect.x,
                width : 0,
                height : 0
            };
        }

		return {
			x : rect.x,
			y : rect.y,
			width : rect.width * attachmentSizeZoom,
			height : rect.height * attachmentSizeZoom
		};
	},

	_drawText : function(attachment, ctx, text, rect, font, color, align) {
		var locationZoom = this.getLocationZoom();
		var sizeZoom = this.getAttachmentSizeZoom(attachment);
		if (locationZoom != 1 && sizeZoom != 1) {
			ctx.translate(rect.x, rect.y);
			ctx.scale(sizeZoom, sizeZoom);
			$g.drawText(ctx, text, {
				x : 0,
				y : 0,
				width : rect.width,
				height : rect.height
			}, font, color, align);
			ctx.scale(1 / sizeZoom, 1 / sizeZoom);
			ctx.translate(-rect.x, -rect.y);
		} else {
			$g.drawText(ctx, text, rect, font, color,align);
		}
	},

	_getOffset : function(newPoint, lastPoint) {
		var locationZoom = this.getLocationZoom();
		return {
			x : (newPoint.x - lastPoint.x) / locationZoom,
			y : (newPoint.y - lastPoint.y) / locationZoom
		};
	},
});

var $position_zoom = {

	'topleft.topleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height,
		};
	},
	'topleft.topright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height,
		};
	},
	'top.top' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height,
		};
	},
	'topright.topleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height,
		};
	},
	'topright.topright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height,
		};
	},
	'topleft' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2
		};
	},
	'top' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'topright' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'topleft.bottomleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y,
		};
	},
	'topleft.bottomright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y,
		};
	},
	'top.bottom' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y,
		};
	},
	'topright.bottomleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y,
		};
	},
	'topright.bottomright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y,
		};
	},
	'left.left' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height / 2,
		};
	},
	'left' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'left.right' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height / 2,
		};
	},
	'center' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'right.left' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height / 2,
		};
	},
	'right' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'right.right' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height / 2,
		};
	},
	'bottomleft.topleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height,
		};
	},
	'bottomleft.topright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height,
		};
	},
	'bottom.top' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height,
		};
	},
	'bottomright.topleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y + rect.height,
		};
	},
	'bottomright.topright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y + rect.height,
		};
	},
	'bottomleft' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'bottom' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'bottomright' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		};
	},
	'bottomleft.bottomleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y,
		};
	},
	'bottomleft.bottomright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y,
		};
	},
	'bottom.bottom' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y,
		};
	},
	'bottomright.bottomleft' : function(rect) {
		return {
			x : rect.x + rect.width,
			y : rect.y,
		};
	},
	'bottomright.bottomright' : function(rect) {
		return {
			x : rect.x,
			y : rect.y,
		};
	},
	'from' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		}
	},
	'to' : function(rect) {
		return {
			x : rect.x + rect.width / 2,
			y : rect.y + rect.height / 2,
		}
	},
	get : function(position, rect) {
		if (!rect) {
			throw "rect can not be null";
		}
		var func = $position_zoom[position];
		if (func) {
			return func(rect);
		}
		throw "Can not resolve '" + position + "' position";
	}
};
