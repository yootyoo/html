twaver.vector.interaction.DefaultInteraction = function(network, lazyMode) {
	twaver.vector.interaction.DefaultInteraction.superClass.constructor.call(this, network);
	this.lazyMode = lazyMode;
};
_twaver.ext('twaver.vector.interaction.DefaultInteraction', twaver.vector.interaction.BaseInteraction, {
	setUp : function() {
		this.addListener('mousedown', 'mouseover', 'mouseout', 'keydown');
		if ($ua.isFirefox) {
			$html.addEventListener("DOMMouseScroll", "handleMouseWheel", this.network.getView(), this);
		} else {
			$html.addEventListener("mousewheel", "handleMouseWheel", this.network.getView(), this);
		}
		$html.addEventListener("mouseup", "handle_mouseup", window, this);
		$html.addEventListener("dblclick", "handleDoubleClicked", this.network.getView(), this);
		this._oldCursor = this.network.getView().style.cursor;
		this.network.addPropertyChangeListener(this.handleViewRectChange, this);
		this.validateScrollBar();
		this.network.addMarker(this);
		this.network.getView().oncontextmenu = function(e) {
			e.preventDefault();
		};
		this._createZoomDiv();
	},

	tearDown : function() {
		this.removeListener('mousedown', 'mouseover', 'mouseout', 'keydown');
		if ($ua.isFirefox) {
			$html.removeEventListener("DOMMouseScroll", this.network.getView(), this);
		} else {
			$html.removeEventListener("mousewheel", this.network.getView(), this);
		}
		$html.removeEventListener("mouseup", window, this);
		$html.removeEventListener("dblclick", this.network.getView(), this);
		this.network.removePropertyChangeListener(this.handleViewRectChange, this);
		this.end();
		this.network.removeMarker(this);
		this._zoomDiv = null;
	},

	_createZoomDiv : function() {
		if (this._zoomDiv == null) {
			this._zoomDiv = document.createElement('div');
			this._zoomLabel = document.createElement('span');
			this._zoomLabel.style.display = 'block';
			this._zoomLabel.style.textAlign = 'center';
			var button = document.createElement('button');
			button.innerHTML = 'Reset to default';
			this._zoomDiv.appendChild(this._zoomLabel);
			this._zoomDiv.appendChild(button);

			var D = $Defaults;
			var style = this._zoomDiv.style;
			style.position = 'absolute';
			style.color = D.TOOLTIP_COLOR;
			style.background = D.TOOLTIP_BACKGROUND;
			style.fontSize = D.TOOLTIP_FONT_SIZE;
			style.padding = D.TOOLTIP_PADDING;
			style.border = D.TOOLTIP_BORDER;
			style.borderRadius = D.TOOLTIP_BORDER_RADIUS;
			style.boxShadow = D.TOOLTIP_BOX_SHADOW;
			style.zIndex = D.TOOLTIP_ZINDEX;
			if (style.setProperty) {
				style.setProperty('-webkit-box-shadow', D.TOOLTIP_BOX_SHADOW, null);
			}
			var scope = this;
			button.onclick = function(e) {
				scope.network.setZoom(1);
				scope._setZoomDivVisible(false);
			};
			var div = this._zoomDiv;
			var clearFunc = function() {
				div.style.opacity = parseFloat(div.style.opacity)  - 0.05;
				if (parseFloat(div.style.opacity) <= 0.05) {
					scope._setZoomDivVisible(false);
					div._clearTimeout = null;
					return;
				}
				div._clearTimeout = setTimeout(div._clearFunc, 100);
			};
			div._clearFunc = clearFunc;
			div.onmouseover = function(e) {
				if (!e) e = window.event;
				var reltg = e.relatedTarget ? e.relatedTarget : e.fromElement;
				while (reltg && reltg != div)
				reltg = reltg.parentNode;
				if (reltg != div) {
					if (div._clearTimeout) {
						clearTimeout(div._clearTimeout);
						div._clearTimeout = null;
					}
					div.style.opacity = 1;
				}

			};
			div.onmouseout = function(e) {
				if (!e) e = window.event;
				var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;
				while (reltg && reltg != div)
				reltg = reltg.parentNode;
				if (reltg != div) {
					div._clearTimeout = setTimeout(div._clearFunc, 10);
				}
			};
		}
	},

	_isZoomDivVisible : function() {
		return this._zoomDiv != null && this._zoomDiv.parentNode != null;
	},

	_getZoomDiv : function(){
      if(!this._zoomDiv){
          this._createZoomDiv();
      }
      return this._zoomDiv;
  },
  
	_setZoomDivVisible : function(visible, e, innerHTML) {
		var div = this._getZoomDiv();
		if (visible) {
			this._zoomLabel.innerHTML = innerHTML;
			div.style.opacity = 1;
			if (!this._isZoomDivVisible()) {
				this.network.getView().appendChild(div);
			}
			div.style.left = $Defaults.TOOLTIP_XOFFSET + 'px';
			div.style.top = $Defaults.TOOLTIP_YOFFSET + 'px';
			var scope = this;
			if (div._clearTimeout) {
				clearTimeout(div._clearTimeout);
				div._clearTimeout = null;
			}
			div._clearTimeout = setTimeout(div._clearFunc, 250);
		} else {
			if (div.parentNode) {
				div.parentNode.removeChild(div);
			}
		}
	},

	handleViewRectChange : function(e) {
		if (e.property == "viewRect" || e.property == "canvasSizeChange") {
			this.validateScrollBar();
		}
	},

	getScrollBarWidth : function() {
		return this.network.getScrollBarWidth();
	},
	getScrollBarColor : function() {
		return '#cccccc';
	},
	validateScrollBar : function() {
		this.hThumbRect = null;
		this.vThumbRect = null;
		if (this.network.isScrollBarVisible() == false) {
			this.repaint();
			return;
		}

		var h = this.network.getViewRect().height;
		var w = this.network.getViewRect().width;
		var x = this.network.getViewRect().x;
		var y = this.network.getViewRect().y;
		var realSize = this.network.getCanvasSize();
		var unionBounds = this.network._unionBounds;
		var rx = unionBounds.x;
		var ry = unionBounds.y;
		var rw = unionBounds.width;
		var rh = unionBounds.height;
		var right = realSize.width;
		var bottom = realSize.height;

		var width = w;
		var height = h;

		var vScrollVisible = false;
		var hScrollVisible = false;

		if (x > rx || (w + x) < right) {
			hScrollVisible = true;
		}

		if (y > ry || (y + h) < bottom) {
			vScrollVisible = true;
		}

		var sx = 0, sy = 0, sw = 0, sh = 0, swidth = width, sheight = height, offset, offset1, offset2;
		// scroll rect
		var scroolBarSize = this.getScrollBarWidth();

		if (hScrollVisible) {
			if (vScrollVisible) {
				swidth -= scroolBarSize;
			}
			sh = scroolBarSize;
			sy = height - scroolBarSize;

			if (x > rx && (x + w) > right) {
				offset = x - rx;
				offset = offset * swidth / (offset + width);
				sx = offset;
				sw = swidth - offset;
			} else if (x < rx && (x + w) < right) {
				offset = right - (x + w);
				offset = swidth * offset / (offset + width);
				sx = 0;
				sw = swidth - offset;
			} else {
				offset1 = x - rx;
				offset2 = right - (x + w);
				offset1 = swidth * offset1 / rw;
				offset2 = swidth * offset2 / rw;
				sx = offset1;
				sw = width - offset1 - offset2;
			}
			this.hThumbRect = {
				x : sx,
				y : sy,
				width : sw,
				height : sh
			};
		}

		sx = 0, sy = 0, sw = 0, sh = 0, swidth = width, sheight = height;
		if (vScrollVisible) {
			if (hScrollVisible) {
				sheight -= scroolBarSize;
			}
			sw = scroolBarSize;
			sx = width - scroolBarSize;
			if (y > ry && (y + h) > bottom) {
				offset = y - ry;
				offset = sheight * offset / (offset + height);
				sy = offset;
				sh = sheight - offset;
			} else if (y < ry && (y + h) < bottom) {
				offset = bottom - (y + h);
				offset = sheight * offset / (offset + height);
				sy = 0;
				sh = sheight - offset;
			} else {
				offset1 = y - ry;
				offset2 = bottom - (y + h);
				offset1 = sheight * offset1 / rh;
				offset2 = sheight * offset2 / rh;
				sy = offset1;
				sh = sheight - offset1 - offset2;
			}

			this.vThumbRect = {
				x : sx,
				y : sy,
				width : sw,
				height : sh
			};
		}

		this.network.setHScrollBarVisible(this.hThumbRect != null);
		this.network.setVScrollBarVisible(this.vThumbRect != null);

		this.repaint();
	},

	scrollXOffset : function(left) {
		var h = this.network.getViewRect().height;
		var w = this.network.getViewRect().width;
		var x = this.network.getViewRect().x;
		var y = this.network.getViewRect().y;
		var xoffset = 30;
		if (left) {
			xoffset = -30;
		}
		this.network.setViewRect(x + xoffset, y, w, h);
	},
	scrollYOffset : function(up) {
		var h = this.network.getViewRect().height;
		var w = this.network.getViewRect().width;
		var x = this.network.getViewRect().x;
		var y = this.network.getViewRect().y;
		var yoffset = 30;
		if (up) {
			yoffset = -30;
		}
		this.network.setViewRect(x, y + yoffset, w, h);
	},

	handle_mouseover : function(e) {
		if (this.scrollBarVisible == true) {
			return;
		}
		this.scrollBarVisible = true;
		this.repaint();
	},
	handle_mouseout : function(e) {
		if (this.scrollBarVisible == false) {
			return;
		}
		this.scrollBarVisible = false;
		this.repaint();
        this.end(e);
	},

	handle_keydown : function(e) {
		this.currentKeyEvent = e;
		this.addListener('keyup');
		$network_interaction.handleKeyDown(this.network, e);
	},

	handle_keyup : function(e) {
		this.currentKeyEvent = null;
		this.removeListener('keyup');
	},

	start : function(e) {
		this.end(e, true);
		this.lastPoint = this.network.getLogicalPoint2(e);
		this.startPoint = this.network.getLogicalPoint2(e);
		this.lastPanPoint = this.getMarkerPoint(e);
		if (this.lazyMode) {
			this.pressPoint = this.lastPoint;
		}
		// this.addListener('mousemove');
		$html.addEventListener("mousemove", "handle_mousemove", window, this);
	},

	end : function(e, fromStart) {

		this.vBarDownPoint = null;
		this.hBarDownPoint = null;
		if (!fromStart) {
			this.network.getView().style.cursor = this._oldCursor;
		}

		if (this.isMoving) {
			if (this.lazyMode) {
				if (this.dragPoint != null && this.pressPoint != null) {
					var self = this;
					var f = function() {
						self.network.fireInteractionEvent({
							kind : 'lazyMoveEnd',
							event : e
						});
						self.network.setMovingElement(false);
					};
					// var xoff = this.dragPoint.x - this.pressPoint.x;
					// var yoff = this.dragPoint.y - this.pressPoint.y;
					var offset = this.getOffset(this.dragPoint, this.pressPoint);
					var xoff = offset.x;
					// this.dragPoint.x - this.pressPoint.x;
					var yoff = offset.y;
					//this.dragPoint.y - this.pressPoint.y;
					this.network.moveSelectedElements(xoff, yoff, this.network.isLazyMoveAnimate(), f);
				}
			} else {
				if (this.network.isMovingElement()) {
					this.network.setMovingElement(false);
					this.network.fireInteractionEvent({
						kind : 'liveMoveEnd',
						event : e
					});
				}
			}
			if (this.isParenting()) {
				if (this.parent == null) {
					this.parent = this.network.getCurrentSubNetwork();
				}
				var self = this;
				this.network.getMovableSelectedElements().forEach(function(element) {
					element.setParent(self.parent);
				}, this.network);
			}
			this.parentProcess(e, true);
			if (this.isParenting()) {
				this.repaint();
			}
			this.network.invalidateCanvasSize();
			// this.removeListener('mousemove');
			this.lastPoint = null;
			this.dragPoint = null;
			this.pressPoint = null;
			this.repaint();
		}

		if (this.isSelecting) {
			if (this.startPoint) {
				if (this.endPoint && this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
					var rect = $math.getRect([this.startPoint, this.endPoint]);
					var elements = this.network.getElementsAtRect(rect, this.getIntersectMode(), this.network.getRectSelectFilter());
					if (elements && elements.size() > 0) {
						var sm = this.network.getSelectionModel();
						var selections = sm.toSelection();
						elements.forEach(function(element) {
							if (sm.contains(element)) {
								selections.remove(element);
							} else {
								selections.add(element);
							}
						}, this);
						sm.setSelection(selections);
					}
					this.network.fireInteractionEvent({
						kind : 'selectEnd',
						event : e
					});
				}
				this.network.setSelectingElement(false);
				this.startPoint = null;
				this.endPoint = null;
				this.repaint();
			}
		}
		// this.lastPoint = null;
		// this.startPoint = null;
		// this.lastPanPoint = null;
		this.isMouseDown = false;
		$html.removeEventListener("mousemove", window, this);
	},
	
	_isDragToSelect : function(e){
	    return !this.network._dragToPan;
	},

	handle_mousedown : function(e) {
		var network = this.network;
		if(e.target != network.getView() && e.target != network._topCanvas && e.target != network._rootCanvas){
			return;
		}
		this.isMoving = false;
		this.isSelecting = false;
		this.hBarDownPoint = null;
		this.vBarDownPoint = null;
		this._setZoomDivVisible(false);
		if (!this.network.isValidEvent(e)) {
			var point = this.getMarkerPoint(e);
			this.start(e);
			if (this.vThumbRect != null) {
				if ($math.containsPoint(this.vThumbRect, point.x, point.y)) {
					this.vBarDownPoint = {
						x : e.screenX,
						y : e.screenY
					};
					this.vBarDownOffset = this.vBarDownPoint.y - this.vThumbRect.y;
				}
			}
			if (this.hThumbRect != null) {
				if ($math.containsPoint(this.hThumbRect, point.x, point.y)) {
					this.hBarDownPoint = {
						x : e.screenX,
						y : e.screenY
					};
					this.hBarDownOffset = this.hBarDownPoint.x - this.hThumbRect.x;
				}
			}
			return;
		}
		if (this.network.isFocusOnClick()) {
			twaver.Util.setFocus(this.network.getView());
		}
		var element = this.network.getElementAt(e);
		if (!this.network.isSelectingElement() && !this.network.isEditingElement() && element != null) {
			if (this.network.isMovable(element)) {
				this.isMoving = true;
			} else {
				this.network.getView().style.cursor = 'pointer';
			}
			this.start(e);
		}
		if (!this.network.isSelectingElement() && !this.network.isEditingElement()) {
			var sm = this.network.getSelectionModel();
			if (element == null) {
				if (_twaver.isCtrlDown(e)) {
					this.isSelecting = true;
				} else if(this._isDragToSelect(e)){
				    this.isSelecting = true;
				    sm.clearSelection();
				} else if (this.network.isRectSelectEnabled()) {
					sm.clearSelection();
					this.network.getView().style.cursor = 'pointer';
				}
				this.start(e);
			} else {
				if (_twaver.isCtrlDown(e)) {
					if (sm.contains(element)) {
						sm.removeSelection(element);
					} else {
						sm.appendSelection(element);
					}
				} else {
					if (!sm.contains(element)) {
						sm.setSelection(element);
					}
				}
			}
		}
		// default handle;
    this.handleClicked(e, element);
		this.isMouseDown = true;
	},

	handle_mousemove : function(e) {
    /*var element = this.network.getElementAt(e),
        preElement = this._preElement,
        preImage = _getElementImage(preElement),
        image = _getElementImage(element);
    if (preElement !== element) {
        if (preElement) {
            preImage && preImage.onMouseLeave && preImage.onMouseLeave(preElement, this.network);
            this.network.onMouseLeave(preElement, e);
        }
        if (element) {
            image && image.onMouseEnter && image.onMouseEnter(element, this.network);
            this.network.onMouseEnter(element, e);
        }
    }
    element && image && image.onMouseMove && image.onMouseMove(element, this.network);
    this.network.onMouseMove(element, e);
    this._preElement = element;
    if (!this.lastPoint) {
    	return;
    }*/
		this._setZoomDivVisible(false);
		var newPoint = this.network.getLogicalPoint2(e);
		if (!newPoint) {
			return;
		}
		var point = {
			x : e.screenX,
			y : e.screenY
		};
		var realSize = this.network.getCanvasSize();
		var h = this.network.getViewRect().height;
		var w = this.network.getViewRect().width;

		var scroolBarSize = this.getScrollBarWidth();

		if (this.hBarDownPoint != null) {
			var xoff = (point.x - this.hBarDownPoint.x);
			this.hBarDownPoint = point;
			this.network.setViewOffSet(xoff * realSize.width / (w - scroolBarSize), 0);
			return;
		}
		if (this.vBarDownPoint != null) {
			var yoff = (point.y - this.vBarDownPoint.y);
			this.vBarDownPoint = point;
			this.network.setViewOffSet(0, yoff * realSize.height / (h - scroolBarSize));
			return;
		}
		if (!this.network.isSelectingElement() && !this.network.isEditingElement() && this.isMoving && this.isMouseDown && !_twaver.isCtrlDown(e)) {

			var offset = this.getOffset(newPoint, this.lastPoint);
			this.xoffset = offset.x;
			this.yoffset = offset.y;
			if (Math.abs(this.xoffset) < 1 && Math.abs(this.yoffset) < 1) {
				return;
			}

			if (this.lazyMode) {
				if (this.dragPoint == null) {
					this.network.fireInteractionEvent({
						kind : 'lazyMoveStart',
						event : e
					});
					this.network.setMovingElement(true);
				} else {
					this.network.fireInteractionEvent({
						kind : 'lazyMoveBetween',
						event : e
					});
				}
			} else {
				this.lastPoint = newPoint;
				if (this.network.isMovingElement()) {
					this.network.fireInteractionEvent({
						kind : 'liveMoveBetween',
						event : e
					});
				} else {
					this.network.setMovingElement(true);
					this.network.fireInteractionEvent({
						kind : 'liveMoveStart',
						event : e
					});
				}
				this.network.moveSelectedElements(this.xoffset, this.yoffset);
			}
			this.parentProcess(e, false);
			if (this.lazyMode) {
				this.dragPoint = newPoint;
			}
			if (this.lazyMode || this.isParenting()) {
				this.repaint();
			}
		} else if (this.isSelecting && (_twaver.isCtrlDown(e) || this._isDragToSelect())) {
			this.network.setSelectingElement(true);
			if (this.endPoint == null) {
				this.network.fireInteractionEvent({
					kind : 'selectStart',
					event : e
				});
			} else {
				this.network.fireInteractionEvent({
					kind : 'selectBetween',
					event : e
				});
			}
			this.endPoint = newPoint;
			this.repaint();
		} else if (!this.isMoving && !this.isSelecting && this.isMouseDown) {
			if (!this.lastPanPoint || !this.network._dragToPan) {
				return;
			}
			var newPoint = this.getMarkerPoint(e);
			if (!newPoint) {
				return;
			}
			var xoffset = newPoint.x - this.lastPanPoint.x;
			var yoffset = newPoint.y - this.lastPanPoint.y;
			this.network.panByOffset(-xoffset, -yoffset);
			this.lastPanPoint = newPoint;
		} else {
			this.end(e);
		}
	},

	handleMouseWheel : function(e) {
		if (document.activeElement !== this.network.getView()) {
			return;
		}
	    if(!this.network._wheelToZoom){
	        this._handleMouseWheelScroll(e);
	        return;
	    }
	    $html.preventDefault(e);
		var point = {
			x : e.offsetX || e.layerX,
			y : e.offsetY || e.layerY,
		};
		var zoom = this.network.getZoom();
		if ((e.wheelDelta && e.wheelDelta > 0) || (e.detail && e.detail < 0)) {
			this.network.setZoom(zoom * 1.1, point);
		} else {
			this.network.setZoom(zoom / 1.1, point);
		}
		this._setZoomDivVisible(this.network.isZoomDivVisible(), e, "Zoom : " + (parseFloat(this.network.getZoom().toFixed(4))));
	},
	

    _handleMouseWheelScroll: function (e) {
        $html.preventDefault(e);
        var upOrLeft = false;
        var scrollDirection = this._getVisibleScrollBar();
        if (scrollDirection != null) {
            upOrLeft = e.wheelDelta ? e.wheelDelta > 0 : e.detail < 0;
            if (scrollDirection == 'v') {
                 this.scrollYOffset(upOrLeft);
            }else {
                 this.scrollXOffset(upOrLeft);
            }
        }

    },


	handle_mouseup : function(e) {
		this.end(e);
	},

	isParenting : function() {
		return this.pressPoint && this.currentKeyEvent != null && this.currentKeyEvent.keyCode === 80;
	},

	parentProcess : function(e, released) {
		var rect = null;
		this.parent = null;
		var self = this;
		if (!released && this.isParenting()) {
			var hitRect = {};
			var p = this.network.getLogicalPoint2(e);
			hitRect.x = p.x - 1;
			hitRect.y = p.y - 1;
			hitRect.width = 2;
			hitRect.height = 2;

			var elements = this.network.getElementsAtRect(hitRect, true);
			if (elements && elements.size() > 0) {
				var size = elements.size();
				for (var i = 0; i < size; i++) {
					var element = elements.get(i);
					if (!self.network.getElementBox().getSelectionModel().contains(element)) {
						self.parent = element;
						break;
					}
				}
			}

		} else {
			this.parent = null;
		}
		if (this.parent != null) {
			rect = this.network.getElementUI(this.parent).getViewRect();
		}
		if (rect != null && !released) {
			this.parentRect = rect;
		} else {
			this.parentRect = null;
		}
	},

	getIntersectMode : function() {
		if (this.network.getSelectMode() === 'intersect') {
			return true;
		}
		if (this.network.getSelectMode() === 'contain') {
			return false;
		}
		return this.startPoint.x > this.endPoint.x && this.startPoint.y > this.endPoint.y;
	},
	
	_getVisibleScrollBar : function(){
	    if (this.network.isScrollBarVisible() == false) {
            return null;
        }
        if(this.vThumbRect != null){
            return "v";
        }
        if(this.hThumbRect != null){
            return "h";
        }
        return null;
	},

	paintScroll : function(ctx) {
		if (this.network.isScrollBarVisible() == false) {
			return;
		}
		if (this.scrollBarVisible == false) {
			if (this.hBarDownPoint == null && this.vBarDownPoint == null) {
				return;
			}
		}
		var scroolBarSize = this.getScrollBarWidth();
		var h = this.network.getViewRect().height;
		var w = this.network.getViewRect().width;

		ctx.save();
		var lingrad;
		var color = this.getScrollBarColor();
		if (this.hThumbRect != null) {
			lingrad = ctx.createLinearGradient(this.hThumbRect.x, this.hThumbRect.y, this.hThumbRect.x, this.hThumbRect.y + this.hThumbRect.height);
			lingrad.addColorStop(0, color);
			lingrad.addColorStop(1, '#666666');
			this.paintRoundRect(ctx, this.getScrollBarColor(), 0.5, 0, h - scroolBarSize, w - scroolBarSize, scroolBarSize, scroolBarSize / 2);
			this.paintRoundRect(ctx, lingrad, 0.9, this.hThumbRect.x, this.hThumbRect.y + 1, this.hThumbRect.width, this.hThumbRect.height - 2, scroolBarSize / 2);
		}
		if (this.vThumbRect != null) {
			lingrad = ctx.createLinearGradient(this.vThumbRect.x, this.vThumbRect.y, this.vThumbRect.x + this.vThumbRect.width, this.vThumbRect.y);
			lingrad.addColorStop(0, color);
			lingrad.addColorStop(1, '#666666');
			this.paintRoundRect(ctx, this.getScrollBarColor(), 0.5, w - scroolBarSize, 0, scroolBarSize, h - scroolBarSize, scroolBarSize / 2);
			this.paintRoundRect(ctx, lingrad, 0.9, this.vThumbRect.x + 1, this.vThumbRect.y, this.vThumbRect.width - 2, this.vThumbRect.height, scroolBarSize / 2);
		}
		ctx.restore();
	},

	paintRoundRect : function(ctx, fillStyle, alpha, x, y, w, h, r) {
		ctx.beginPath();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = fillStyle;
		$g.drawRoundRect(ctx, x, y, w, h, r);
		ctx.fill();
	},

	paint : function(ctx) {
		this.paintScroll(ctx);
		if (this.network.isSelectingElement()) {
			if (this.startPoint == null || this.endPoint == null) {
				return;
			}
			var sp = this.convertPointFromView(this.startPoint);
			var ep = this.convertPointFromView(this.endPoint);
			var sx = sp.x;
			var sy = sp.y;
			var ex = ep.x;
			var ey = ep.y;
			var rect = $math.getRect([{
				x : sx,
				y : sy
			}, {
				x : ex,
				y : ey
			}]);
			if (rect != null) {
				ctx.beginPath();
				var lineWidth = this.network.getSelectOutlineWidth();
				var fillStyle = this.getIntersectMode() ? this.network.getSelectFillColor() : null;
				ctx.strokeStyle = this.network.getSelectOutlineColor();
				ctx.lineWidth = lineWidth;
				$CanvasUtil.rect(ctx, rect.x, rect.y, rect.width, rect.height, fillStyle, this.network.getSelectOutlineColor());
				ctx.closePath();
			}
		} else {
			if (this.lazyMode) {
				if (this.pressPoint == null || this.dragPoint == null) {
					return;
				}
				ctx.beginPath();
				var offset = this.getOffset(this.dragPoint, this.pressPoint);
				var xoff = offset.x;
				// this.dragPoint.x - this.pressPoint.x;
				var yoff = offset.y;
				//this.dragPoint.y - this.pressPoint.y;
				var list = this.network.getMovableSelectedElements();
				var size = list.size();

				var fillColor = this.network.isLazyMoveFill() ? this.network.getLazyMoveFillColor() : null;
				var lineWidth = this.network.getLazyMoveOutlineWidth();
				var strokeColor = this.network.getLazyMoveOutlineColor();
				ctx.strokeStyle = strokeColor;
				ctx.lineWidth = lineWidth;
				ctx.fillStyle = fillColor;
				for (var i = 0; i < size; i++) {
					var n = list.get(i);
					var ui = this.network.getElementUI(n);
					if (ui) {
						var vr = this.convertFromUIToMarkerRect(ui.getViewRect(), xoff, yoff);
						$CanvasUtil.rect(ctx, vr.x, vr.y, vr.width, vr.height);
					}
				}
				ctx.fill();
				ctx.stroke();
			}
			if (this.parentRect) {
				ctx.beginPath();
				var fillColor = this.network.isLazyMoveFill() ? this.network.getLazyMoveFillColor() : null;
				var lineWidth = this.network.getLazyMoveOutlineWidth();
				var strokeColor = this.network.getLazyMoveOutlineColor();
				ctx.strokeStyle = strokeColor;
				ctx.lineWidth = lineWidth;
				ctx.fillStyle = fillColor;
				var vr = this.parentRect;
				$CanvasUtil.rect(ctx, vr.x, vr.y, vr.width, vr.height);
				ctx.fill();
				ctx.stroke();
			}
		}

	},

	handleClicked : function(e, element) {
		$network_interaction.handleClicked(this.network, e, element);
	},
	handleDoubleClicked : function(e) {
		var element = this.network.getElementAt(e);
		$network_interaction.handleDoubleClicked(this.network, e, element);
	},
});
