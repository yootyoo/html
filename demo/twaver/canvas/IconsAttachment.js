//need to test
twaver.canvas.IconsAttachment = function(elementUI, showInAttachmentDiv) {
    twaver.canvas.IconsAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
};
_twaver.ext('twaver.canvas.IconsAttachment', twaver.canvas.Attachment, {
    isShadowable : function() {
        return twaver.Defaults.ATTACHMENT_SHADOWABLE;
    },
    validate : function() {
        twaver.canvas.IconsAttachment.superClass.validate.call(this);
        this.iconsNames = this._network.getIconsNames(this._element);
        if (!this.iconsNames || this.iconsNames.length == 0) {
            return;
        }
        var iconsGroups = this._makeGroup(this.iconsNames);
        var colorGroups = this._makeGroup(this._network.getIconsColors(this._element));

        len = iconsGroups.length;
        this.iconsOrientation = this._makeArray(this._element.getStyle('icons.orientation'), len,'right');
        this.iconsPosition = this._makeArray(this._element.getStyle('icons.position'), len,'topleft.bottomright');
        this.iconsXoffset = this._makeArray(this._element.getStyle('icons.xoffset'), len,0);
        this.iconsYoffset = this._makeArray(this._element.getStyle('icons.yoffset'), len,0);
        this.iconsXgap = this._makeArray(this._element.getStyle('icons.xgap'), len,1);
        this.iconsYgap = this._makeArray(this._element.getStyle('icons.ygap'), len,1);

        this.locations = [], this.iconsSizes = [];
        var iconsSize, location;

        for ( i = 0; i < len; i++) {
            var iconsNames = iconsGroups[i];
            var iconsOrientation = this.iconsOrientation[i] || "right";
            var iconsPosition = this.iconsPosition[i] || 'topleft.bottomright';
            var iconsXgap = this.iconsXgap[i] || 1;
            var iconsYgap = this.iconsYgap[i] || 1;
            var iconsXoffset = this.iconsXoffset[i] || 0;
            var iconsYoffset = this.iconsYoffset[i] || 0;

             if(this._ui._element instanceof twaver.Link){
                var points = this._ui.getLinkPoints();
                var lineLength;
                if (this._ui.getLineLength) {
                    lineLength = this._ui.getLineLength();
                } else {
                    lineLength = this._ui._element.getLineLength();
                }
                
                if (Math.abs(iconsXoffset) > 0 && Math.abs(iconsXoffset) < 1) {
                    if(iconsPosition === 'from'){
                        iconsXoffset *= lineLength;
                    }else if(iconsPosition === 'to'){
                        iconsXoffset = lineLength * (1 - iconsXoffset);
                    }else{
                        iconsXoffset /= 2;
                        iconsXoffset += 0.5;
                        iconsXoffset *= lineLength;
                    }
                }else{
                    if(iconsPosition === 'from'){
                        iconsXoffset = iconsXoffset;
                    }else if(iconsPosition === 'to'){
                        iconsXoffset = lineLength - iconsXoffset;
                    }else{
                        iconsXoffset += lineLength/2;
                    }
                }

                var pointInfo = $math.calculatePointInfoAlongLine(points, true, iconsXoffset, iconsYoffset);
                var translatePoint = pointInfo.point;
                var rotateAngle = pointInfo.angle;

                var c;
                if(iconsPosition === 'from'){
                    c = this._ui.getFromPoint();
                }else if(iconsPosition === 'to'){
                    c = this._ui.getToPoint();
                }else{
                    c = this._ui._hotSpot;
                }

                iconsXoffset = translatePoint.x - c.x;
                iconsYoffset = translatePoint.y - c.y;
            }

            location = null;
            iconsSize = this._getIconsSize(iconsNames, iconsOrientation, iconsXgap, iconsYgap);
            if (iconsSize) {
                location = this._network.getPosition(iconsPosition, this._ui, iconsSize, iconsXoffset, iconsYoffset);

                if (iconsOrientation === 'top') {
                    location.y += iconsSize.height;
                } else if (iconsOrientation === 'left') {
                    location.x += iconsSize.width;
                }
            }

            this.locations.push(location);
            this.iconsSizes.push(iconsSize);

        }

        var unionRect = null;
        for ( i = 0; i < this.locations.length; i++) {
            location = this.locations[i];
            iconsSize = this.iconsSizes[i];
            if(location == null){
                continue;
            }
            if (unionRect == null) {
                unionRect = {
                    x : location.x,
                    y : location.y,
                    width : iconsSize.width,
                    height : iconsSize.height
                };
            } else {
                unionRect = $math.unionRect(unionRect, {
                    x : location.x,
                    y : location.y,
                    width : iconsSize.width,
                    height : iconsSize.height
                });
            }
        }
        this._viewRect = unionRect || { x : this._element.getLocation().x,y : this._element.getLocation().y,width : 0,height : 0};
        this.iconsGroups = iconsGroups;
        this.colorGroups = colorGroups;

        var rotatable = this._element instanceof twaver.Link && this._element.getStyle('link.icons.rotatable');
        for ( i = 0; i < len; i++) {
            if (rotatable instanceof Array && rotatable[i] && this._viewRect) {
                var cx = this._viewRect.x + this._viewRect.width / 2,
                cy = this._viewRect.y + this._viewRect.height / 2;
                var w = Math.sqrt(this._viewRect.height * this._viewRect.height + this._viewRect.width * this._viewRect.width);
                this._viewRect = {
                    x: cx - w/2,
                    y: cy - w/2,
                    width: w ,
                    height: w
                }
            }
        }
    },
    
    _makeGroup : function(originalArray){
        if(!Array.isArray(originalArray)){
            return [[originalArray]];
        }
        var groups = [], group = false, i, len = originalArray.length, item, temp;
        for ( i = 0; i < len; i++) {
            item = originalArray[i];
            if (!Array.isArray(item)) {
                temp = [item];
                groups.push(temp);
            } else {
                group = true;
                groups.push(item);
            }
        }
        if (!group) {
            groups.length = 0;
            groups.push(originalArray);
        }
        return groups;
    },

    _makeArray : function(value, len,defaultValue) {
        if (Array.isArray(value)) {
            return value;
        } else {
            var array = [];
            for (var i = 0; i < len; i++) {
                array.push(value || defaultValue);
            }
            return array;
        }
    },

    paint : function(ctx) {
        twaver.canvas.IconsAttachment.superClass.paint.apply(this, arguments);

        if (!this.iconsNames || this.iconsNames.length == 0 || !this.locations) {
            return;
        }
        var i,location,index,iconsNames,x,y,iconsColors,iconsOrientation,iconsXgap,iconsYgap;
        for (i = 0; i < this.iconsGroups.length; i++) {
            location = this.locations[i];
            if(!location){
                continue;
            }
            x = location.x;
            y = location.y;
            iconsNames = this.iconsGroups[i];
            iconsColors = this.colorGroups[i];
            iconsOrientation = this.iconsOrientation[i];
            iconsXgap = this.iconsXgap[i] || 1;
            iconsYgap = this.iconsYgap[i] || 1;
            index = 0;
            for (var name in iconsNames) {
                var rect = null;
                var color = null;
                if (iconsColors && iconsColors.length > index) {
                    color = iconsColors[index++];
                }
                var imageAsset = _twaver.getImageAsset(iconsNames[name]);
                if (imageAsset == null) {
                    continue;
                }
                if (iconsOrientation === 'right') {
                    rect = {
                        x : x,
                        y : y,
                        width : imageAsset.getWidth(),
                        height : imageAsset.getHeight()
                    };
                    x += rect.width + iconsXgap;
                } else if (iconsOrientation === 'left') {
                    rect = {
                        x : x - imageAsset.getWidth(),
                        y : y,
                        width : imageAsset.getWidth(),
                        height : imageAsset.getHeight()
                    };
                    x -= rect.width + iconsXgap;
                } else if (iconsOrientation === 'top') {
                    rect = {
                        x : x,
                        y : y - imageAsset.getHeight(),
                        width : imageAsset.getWidth(),
                        height : imageAsset.getHeight()
                    };
                    y -= rect.height + iconsYgap;
                } else if (iconsOrientation === 'bottom') {
                    rect = {
                        x : x,
                        y : y,
                        width : imageAsset.getWidth(),
                        height : imageAsset.getHeight()
                    };
                    y += rect.height + iconsYgap;
                } else {
                    throw "Can not resolve '" + iconsOrientation + "' orientation";
                }
                // drawImage(ctx, imageAsset.getImage(color, rect.width, rect.height), color, rect, this._element, this._network);
                var rotatable = this._element instanceof twaver.Link && this._element.getStyle('link.icons.rotatable');
                if(rotatable instanceof Array && rotatable[i]) {
                    ctx.save();
                // var _vewRect = this.getZoomViewRect();
                var _vewRect = rect;
                var x = _vewRect.x + _vewRect.width / 2,
                y = _vewRect.y + _vewRect.height / 2;
                ctx.translate(x, y);
                ctx.rotate(this._network.getElementUI(this._element).getAngle());
                ctx.translate(-x, -y);
                drawImage(ctx, imageAsset.getImage(color, rect.width, rect.height), color, rect, this._element, this._network);
                ctx.restore();
            }else{
                drawImage(ctx, imageAsset.getImage(color, rect.width, rect.height), color, rect, this._element, this._network);
            }
            if(this._network._debug) {
                var rect = this._viewRect;
                $g.strokeRect(ctx, rect, '#FCFC00',1);
                $g.strokeRect(ctx, rect, '#FCFC00',1);
            }
        }
    }
},

_getIconsSize : function(names, orientation, xgap, ygap) {
    var x = 0;
    var y = 0;
    var rect = null;
    var imageAsset = null;
    var unionRect = null;
    for (var name in names) {
        imageAsset = _twaver.getImageAsset(names[name]);
        if (!imageAsset) {
            continue;
        }
        if (orientation === 'right') {
            rect = {
                x : x,
                y : y,
                width : imageAsset.getWidth(),
                height : imageAsset.getHeight()
            };
            x += rect.width + xgap;
        } else if (orientation === 'left') {
            rect = {
                x : x - imageAsset.getWidth(),
                y : y,
                width : imageAsset.getWidth(),
                height : imageAsset.getHeight()
            };
            x -= rect.width + xgap;
        } else if (orientation === 'top') {
            rect = {
                x : x,
                y : y - imageAsset.getHeight(),
                width : imageAsset.getWidth(),
                height : imageAsset.getHeight()
            };
            y -= rect.height + ygap;
        } else if (orientation === 'bottom') {
            rect = {
                x : x,
                y : y,
                width : imageAsset.getWidth(),
                height : imageAsset.getHeight()
            };
            y += rect.height + ygap;
        } else {
            throw "Can not resolve '" + orientation + "' orientation";
        }
        if (unionRect == null) {
            unionRect = _twaver.clone(rect);
        } else {
            unionRect = $math.unionRect(unionRect, rect);
        }
    }
    if (unionRect) {
        return {
            width : Math.abs(unionRect.width),
            height : Math.abs(unionRect.height)
        };
    }
    return null;
}
});
