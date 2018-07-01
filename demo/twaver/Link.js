twaver.Link = function(id, fromNode, toNode) {
	twaver.Link.superClass.constructor.call(this, (( id instanceof $Node) ? null : id));
	if ( id instanceof $Node) {
		toNode = fromNode;
		fromNode = id;
	}
	fromNode && this.setFromNode(fromNode);
	toNode && this.setToNode(toNode);
};
twaver.Link.IS_INTERESTED_BUNDLE_STYLE = {
	'link.bundle.enable' : 1,
	'link.bundle.id' : 1,
	'link.bundle.independent' : 1
};
_twaver.ext('twaver.Link', twaver.Element, {
	_fromNode : null,
	_toNode : null,
	_fromAgent : null,
	_toAgent : null,
	_icon : $Defaults.ICON_LINK,
	getFromNode : function() {
		return this._fromNode;
	},
	getToNode : function() {
		return this._toNode;
	},
	getFromAgent : function() {
		return this._fromAgent;
	},
	getToAgent : function() {
		return this._toAgent;
	},
	setFromNode : function(fromNode) {
		if (this._fromNode === fromNode) {
			return;
		}
		var oldValue = this._fromNode;
		this._fromNode = fromNode;
		if (oldValue) {
			oldValue._removeFromLink(this);
		}
		if (this._fromNode) {
			this._fromNode._addFromLink(this);
		}
		this._checkAgentNode();
		this.firePropertyChange('fromNode', oldValue, fromNode);
	},
	setToNode : function(toNode) {
		if (this._toNode === toNode) {
			return;
		}
		var oldValue = this._toNode;
		this._toNode = toNode;
		if (oldValue) {
			oldValue._removeToLink(this);
		}
		if (this._toNode) {
			this._toNode._addToLink(this);
		}
		this._checkAgentNode();
		this.firePropertyChange('toNode', oldValue, toNode);
	},
	isLooped : function() {
		return this._fromNode === this._toNode && this._fromNode != null && this._toNode != null;
	},
	_checkAgentNode : function() {
		if (twaver._isInitializing) {
			if (!twaver._links[this._id]) {
				twaver._links[this._id] = this;
			}
		} else {
			this._checkAgentNodeImpl();
		}
	},
	_checkAgentNodeImpl : function() {
		var newFromAgent = $element.figureFromAgent(this);
		var oldValue, scope = this,id;
		if (this._fromAgent != newFromAgent) {
			oldValue = this._fromAgent;
			if (this._fromAgent) {
				this._fromAgent._removeFromAgentLink(this);
			}
			this._fromAgent = newFromAgent;
			if (this._fromAgent) {
				this._fromAgent._addFromAgentLink(this);
			}
			this.firePropertyChange("fromAgent", oldValue, this._fromAgent);

			if (twaver._isInitializing) {
				if (oldValue && this._toAgent) {
					id = oldValue._id + ':' + this._toAgent._id;
					if (!twaver._bundleLinks[id]) {
						twaver._bundleLinks[id] = [oldValue, this._toAgent];
					}
				}
				if (this._fromAgent && this._toAgent) {
					id = this._fromAgent._id + ':' + this._toAgent._id;
					if (!twaver._bundleLinks[id]) {
						twaver._bundleLinks[id] = [this._fromAgent, this._toAgent];
					}
				}
			} else {
				$element.resetBundleLinks(oldValue, scope._toAgent);
				$element.resetBundleLinks(scope._fromAgent, scope._toAgent);
			}

		}

		var newToAgent = $element.figureToAgent(this);
		if (this._toAgent != newToAgent) {
			oldValue = this._toAgent;
			if (this._toAgent) {
				this._toAgent._removeToAgentLink(this);
			}
			this._toAgent = newToAgent;
			if (this._toAgent) {
				this._toAgent._addToAgentLink(this);
			}
			this.firePropertyChange("toAgent", oldValue, this._toAgent);
			if (twaver._isInitializing) {
				if (oldValue && this._fromAgent) {
					id = oldValue._id + ':' + this._fromAgent._id;
					if (!twaver._bundleLinks[id]) {
						twaver._bundleLinks[id] = [oldValue, this._fromAgent];
					}
				}
				if (this._toAgent && this._fromAgent) {
					id = this._toAgent._id + ':' + this._fromAgent._id;
					if (!twaver._bundleLinks[id]) {
						twaver._bundleLinks[id] = [this._toAgent, this._fromAgent];
					}
				}
			} else {
				$element.resetBundleLinks(oldValue, scope._fromAgent);
				$element.resetBundleLinks(scope._toAgent, scope._fromAgent);
			}

		}

	},
	_setBundleLinks : function(bundleLinks) {
		this._bundleLinks = bundleLinks;
		this.firePropertyChange("bundleLinks", true, false);
	},
	getBundleLinks : function() {
		return this._bundleLinks;
	},
	getBundleCount : function() {
		if (this._bundleLinks) {
			return this._bundleLinks.getLinks().size();
		} else {
			return 1;
		}
	},
	getBundleIndex : function() {
		if (this._bundleLinks) {
			return this._bundleLinks.getLinks().indexOf(this);
		} else {
			return 0;
		}
	},
	reverseBundleExpanded : function() {
		if (this._bundleLinks && this._bundleLinks.getLinks().size() > 0) {
			var i;
			var link;
			var links = this._bundleLinks.getLinks();
			var expanded = !this.getStyle("link.bundle.expanded");
			for ( i = 0; i < links.size(); i++) {
				link = links.get(i);
				link.setStyle("link.bundle.expanded", expanded);
			}

			var siblings = this._bundleLinks.getSiblings();
			for ( i = 0; i < siblings.size(); i++) {
				var sibling = siblings.get(i);
				if (sibling != this._bundleLinks) {
					links = sibling.getLinks();
					for (var j = 0; j < links.size(); j++) {
						link = links.get(j);
						link.firePropertyChange("bundleLinks", null, sibling);
					}
				}
			}

			return true;
		}
		return false;
	},
	isBundleAgent : function() {
		return this._bundleLinks != null && this._bundleLinks.getLinks().size() > 1 && this === this._bundleLinks.getLinks().get(0) && !this.getStyle("link.bundle.expanded");
	},
	onStyleChanged : function(styleProp, oldValue, newValue) {
		twaver.Link.superClass.onStyleChanged.call(this, styleProp, oldValue, newValue);
		if (twaver.Link.IS_INTERESTED_BUNDLE_STYLE[styleProp]) {
			$element.resetBundleLinks(this._toAgent, this._fromAgent);
		}
	},
	getElementUIClass : function() {
		return twaver.network.LinkUI;
	},
	getCanvasUIClass : function() {
		return twaver.canvas.LinkUI;
	},
	getVectorUIClass : function() {
		return twaver.vector.LinkUI;
	},
	isAdjustedToBottom : function() {
		return $Defaults.IS_LINK_ADJUSTED_TO_BOTTOM;
	}
});
