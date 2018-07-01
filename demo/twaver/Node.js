var $Node = function(id) {
	this._location = {
		x : 0,
		y : 0
	};
	$Node.superClass.constructor.call(this, id);
};
twaver.Node = $Node;
$Node.IS_INTERESTED_NODE_PROPERTY = {
	'location' : 1,
	'width' : 1,
	'height' : 1,
	'expanded' : 1
};
_twaver.ext('twaver.Node', twaver.Element, {
	_icon : $Defaults.ICON_NODE,
	_image : $Defaults.IMAGE_NODE,
	_angle : 0,
	getLoopedLinks : function() {
		return this._loopedLinks;
	},
	getLinks : function() {
		return this._links;
	},
	getAgentLinks : function() {
		return this._agentLinks;
	},
	getFollowers : function() {
		return this._followers;
	},
	_addFollower : function(follower) {
		if (!this._followers) {
			this._followers = new $List();
		}
		this._followers.add(follower);
	},
	_removeFollower : function(follower) {
		this._followers.remove(follower);
		if (this._followers.isEmpty()) {
			delete this._followers;
		}
	},
	getFromLinks : function() {
		return this._fromLinks;
	},
	getToLinks : function() {
		return this._toLinks;
	},
	_addFromLink : function(link) {
		if (!this._links) {
			this._links = new $List(false);
		}
		if (!this._fromLinks) {
			this._fromLinks = new $List(false);
		}
		this._links.add(link);
		if (this._toLinks && this._toLinks.contains(link)) {
			if (!this._loopedLinks) {
				this._loopedLinks = new $List(false);
			}
			this._loopedLinks.add(link);
		}
		this._fromLinks.add(link);
	},
	_addToLink : function(link) {
		if (!this._links) {
			this._links = new $List(false);
		}
		if (!this._toLinks) {
			this._toLinks = new $List(false);
		}
		this._links.add(link);
		if (this._fromLinks && this._fromLinks.contains(link)) {
			if (!this._loopedLinks) {
				this._loopedLinks = new $List(false);
			}
			this._loopedLinks.add(link);
		}
		this._toLinks.add(link);
	},
	_removeFromLink : function(link) {
		this._links && this._links.remove(link);
		this._fromLinks && this._fromLinks.remove(link);
		this._loopedLinks && this._loopedLinks.remove(link);
	},
	_removeToLink : function(link) {
		this._links && this._links.remove(link);
		this._toLinks && this._toLinks.remove(link);
		this._loopedLinks && this._loopedLinks.remove(link);
	},
	hasAgentLinks : function() {
		return this._agentLinks != null && !this._agentLinks.isEmpty();
	},
	getFromAgentLinks : function() {
		return this._fromAgentLinks;
	},
	getToAgentLinks : function() {
		return this._toAgentLinks;
	},
	_addFromAgentLink : function(link) {
		if (!this._fromAgentLinks) {
			this._fromAgentLinks = new $List(false);
		}
		if (!this._agentLinks) {
			this._agentLinks = new $List(false);
		}
		this._fromAgentLinks.add(link);
		this._agentLinks.add(link);
	},
	_addToAgentLink : function(link) {
		if (!this._toAgentLinks) {
			this._toAgentLinks = new $List(false);
		}
		if (!this._agentLinks) {
			this._agentLinks = new $List(false);
		}
		this._toAgentLinks.add(link);
		this._agentLinks.add(link);
	},
	_removeFromAgentLink : function(link) {
		this._fromAgentLinks && this._fromAgentLinks.remove(link);
		this._agentLinks && this._agentLinks.remove(link);
	},
	_removeToAgentLink : function(link) {
		this._toAgentLinks && this._toAgentLinks.remove(link);
		this._agentLinks && this._agentLinks.remove(link);
	},
	getImage : function() {
		return this._image;
	},
	setImage : function(image) {
		var oldImage = this._image;
		var oldWidth = this.getWidth();
		var oldHeight = this.getHeight();
		this._image = image;
		this.firePropertyChange("image", oldImage, image);
		this.firePropertyChange("width", oldWidth, this.getWidth());
		this.firePropertyChange("height", oldHeight, this.getHeight());
	},
	getX : function() {
		return this._location.x;
	},
	getY : function() {
		return this._location.y;
	},
	setX : function(x) {
		this.setLocation(x, this._location.y);
	},
	setY : function(y) {
		this.setLocation(this._location.x, y);
	},
	getLocation : function() {
		return this._location;
	},
	setLocation : function(x, y) {
		var location;
		if (arguments.length === 2) {
			location = {
				x : arguments[0],
				y : arguments[1]
			};
		} else {
			location = arguments[0];
		}
		if (!_twaver.num(location.x) || !_twaver.num(location.y)) {
			return;
		}
		if (location.x === this._location.x && location.y === this._location.y) {
			return;
		}
		var oldValue = this._location;
		this._location = location;
		this.firePropertyChange('location', oldValue, location);
	},
	getCenterLocation : function() {
		if ($Defaults.CENTER_LOCATION) {
			return this._location;
		} else {
			return {
				x : (this.getX() + this.getWidth() / 2),
				y : (this.getY() + this.getHeight() / 2)
			};
		}
	},
	setCenterLocation : function(x, y) {
		var location;
		if (arguments.length === 2) {
			location = {
				x : arguments[0],
				y : arguments[1]
			};
		} else {
			location = _twaver.clone(arguments[0]);
		}
		if (!_twaver.num(location.x) || !_twaver.num(location.y)) {
			return;
		}
		if (!$Defaults.CENTER_LOCATION) {
			location.x -= this.getWidth() / 2;
			location.y -= this.getHeight() / 2;
		}
		this.setLocation(location);
	},
	translate : function(x, y) {
		this.setLocation(this.getX() + x, this.getY() + y);
	},
	getWidth : function() {
		if (_twaver.num(this._width) && this._width >= 0) {
			return this._width;
		}
		if (typeof this._image !== 'object') {
			var image = _twaver.getImageAsset(this._image);
			if (image) {
				var w = image.getWidth();
				if (_twaver.num(w) && w >= 0) {
					return w;
				}
				image = image._image;
				return getVectorValue(this, image, image, 'w');
			}
		} else if (this._image) {
			return this._image.w;
		}
		return $Defaults.NODE_WIDTH;
	},
	setWidth : function(width) {
		var oldValue = this._width;
		this._width = width;
		this.firePropertyChange("width", oldValue, width);
	},
	getHeight : function() {
		if (_twaver.num(this._height) && this._height >= 0) {
			return this._height;
		}
		if (typeof this._image !== 'object') {
			var image = _twaver.getImageAsset(this._image);
			if (image) {
				var h = image.getHeight();
				if (_twaver.num(h) && h >= 0) {
					return h;
				}
				image = image._image;
				return getVectorValue(this, image, image, 'h');
			}
		} else if (this._image) {
			return this._image.h;
		}
		return $Defaults.NODE_HEIGHT;
	},
	setHeight : function(height) {
		var oldValue = this._height;
		this._height = height;
		this.firePropertyChange("height", oldValue, height);
	},
	setSize : function() {
		if (arguments.length === 2) {
			this.setWidth(arguments[0]);
			this.setHeight(arguments[1]);
		} else {
			this.setWidth(arguments[0].width);
			this.setHeight(arguments[0].height);
		}
	},
	getSize : function() {
		return {
			width : this.getWidth(),
			height : this.getHeight()
		};
	},
	getRect : function() {
		var orgRect = this.getOriginalRect();
		if (this._angle === 0) {
			return orgRect;
		}
		var matrix = $math.createMatrix(this._angle * Math.PI / 180, orgRect.x + orgRect.width / 2, orgRect.y + orgRect.height / 2);
		var points = [{
			x : orgRect.x,
			y : orgRect.y
		}, {
			x : orgRect.x + orgRect.width,
			y : orgRect.y
		}, {
			x : orgRect.x + orgRect.width,
			y : orgRect.y + orgRect.height
		}, {
			x : orgRect.x,
			y : orgRect.y + orgRect.height
		}];
		for (var i = 0, n = points.length; i < n; i++) {
			points[i] = matrix.transform(points[i]);
		}
		var rect = $math.getRect(points);
		return rect;
	},
	getOriginalRect : function() {
		var self = this,
			width = self.getWidth(),
			height = self.getHeight();
		if ($Defaults.CENTER_LOCATION) {
			return { x: self._location.x - width / 2, y: self._location.y - height / 2, width: width, height: height };
		} else {
			return {
				x : self.getX(),
				y : self.getY(),
				width : width,
				height : height
			};
		}
	},
	getAngle : function() {
		return this._angle;
	},
	setAngle : function(angle) {
		var oldValue = this._angle;
		this._angle = angle % 360;
		this.firePropertyChange("angle", oldValue, this._angle);
	},
	onParentChanged : function(oldParent, parent) {
		$Node.superClass.onParentChanged.call(this, oldParent, parent);
		this._checkLinkAgent();
	},
	_checkLinkAgent : function() {
		if(twaver._isInitializing){
			if (this._links) {
				var n = this._links.size();
				for (var i = 0; i < n; i++) {
					this._links.get(i)._checkAgentNode();
				}
			}
		}else{
			twaver.ElementBox.prototype.startBatch(function() {
			if (this._links) {
				var n = this._links.size();
				for (var i = 0; i < n; i++) {
					this._links.get(i)._checkAgentNode();
				}
			}
		}, this);
		}
		

	},
	onPropertyChanged : function(e) {
		$Node.superClass.onPropertyChanged.call(this, e);
		if (this._followers) {
			var n = this._followers.size();
			for (var i = 0; i < n; i++) {
				this._followers.get(i).handleHostPropertyChange(e);
			}
		}
		if (this.getParent() instanceof $Group) {
			if ($Node.IS_INTERESTED_NODE_PROPERTY[e.property]) {
				this.getParent().updateLocationFromChildren();
			}
		}
	},
	getElementUIClass : function() {
		return twaver.network.NodeUI;
	},
	getCanvasUIClass : function() {
		return twaver.canvas.NodeUI;
	},
	getVectorUIClass : function() {
		return twaver.vector.NodeUI;
	},
});

