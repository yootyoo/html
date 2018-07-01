
CGroup = function(id){
    CGroup.superClass.constructor.apply(this,arguments);
    this._slope = 0;
    this._topPoint ={};
    this._leftPoint ={};
    this._bottomPoint={};
    this._rightPoint={};
}

twaver.Util.ext(CGroup, twaver.Group,{
   getElementUIClass:function(){
        return CGroupUI;
    },
    getSlope:function (){
        return this._slope;
    },
    setSlope:function(slope){
        this._slope = slope;
    },
    getTopPoint:function(){
        return this._topPoint;
    },
    setTopPoint:function(topPoint){
        this._topPoint = topPoint;
    },
    getLeftPoint:function(){
        return this._leftPoint;
    },
    setLeftPoint:function(leftPoint){
        this._leftPoint = leftPoint;
    },
    getBottomPoint:function(){
        return this._bottomPoint;
    },
    setBottomPoint:function(bottomPoint){
        this._bottomPoint = bottomPoint;
    },
    getRightPoint:function(){
        return this._rightPoint;
    },
    setRightPoint:function(rightPoint){
        this._rightPoint = rightPoint;
    }
});

CGroupUI = function(network, element) {
    CGroupUI.superClass.constructor.apply(this, arguments);
    this._nodeCanvas = twaver.Util.createCanvas();
}

twaver.Util.ext("CGroupUI", twaver.network.GroupUI, {
    drawBody: function () {
        var bodyRect = this.getBodyRect();
        if (this._shapeRect) {
            this.drawExpandedGroup();
        } else {
            twaver.network.GroupUI.superClass.drawBody.call(this);
        }
    },
    drawExpandedGroup: function () {
        var canvas = this._nodeCanvas;
        var x  = this._element.getX();
        var y = this._element.getY();
        var rect = this.getBodyRect();
        var bodyRect = this.getBodyRect();
        var bounds = _twaver.clone(bodyRect);
        var g = this.setShadow(this, canvas, bounds);

        var gradient  = g.createLinearGradient(x+200,y,x,y+200);
        gradient.addColorStop(0,'#A000fA');
        gradient.addColorStop(0.5,'#EfffEA');
        gradient.addColorStop(1,'#A2CD5A');

        var trunkGradient = g.createLinearGradient(x+200,y,x,y+200);
        trunkGradient.addColorStop(0, '#A000ff');
        trunkGradient.addColorStop(0.5, '#Efff00');
        trunkGradient.addColorStop(1, '#A2CDAA');

        var fillColor = this.getStyle('group.fill.color');

        g.lineJoin = 'round';
        g.lineWidth = 3;
        g.strokeStyle = "#FFAAFF";
        g.fillStyle = fillColor;

        var topPoint = {x:rect.x+rect.width/2,y:rect.y};
        var leftPoint = {x:rect.x,y:rect.y+rect.height/2};
        var bottomPoint = {x:rect.x+rect.width/2,y:rect.y+rect.height};
        var rightPoint = {x:rect.x+rect.width,y:rect.y+rect.height/2};
        var slope =  (topPoint.y-leftPoint.y)/(topPoint.x-leftPoint.x);
        this._element.setSlope(slope);

        this._element.setTopPoint(topPoint);
        this._element.setLeftPoint(leftPoint);
        this._element.setBottomPoint(bottomPoint);
        this._element.setRightPoint(rightPoint);

        rect = {x:rect.x+20,y:rect.y+20,width:rect.width-20,height:rect.height-20};
        this.roundDiamondPath2(g,rect,10);

        g.transform(1, 0,0, 1,0, -8);
        g.fillStyle = gradient;
        this.roundDiamondPath2(g,rect,10);

        g.rotate(Math.PI / 4);
        this.addBodyBounds(bounds);
        this.addComponent(canvas);
    },

    getChildrenRects: function () {
        return this._network.getGroupChildrenRects(this._element);
    },
    createBodyRect: function () {
        this._shapeRect = null;
        var group = this._element;
        var self = this;
        if (group.isExpanded()) {
            var rects = this.getChildrenRects();
            if (!rects.isEmpty()) {
                var rect = rects.get(0) ;

                rects.forEach(function (r) {
                    rect = self.unionRect(rect,r);
                });

                rect.x -= rect.width / 2;
                rect.width += rect.width;
                rect.y -= rect.height / 2;
                rect.height += rect.height;

                this._shapeRect = rect;
            }
        }
        if (this._shapeRect) {
            return this._shapeRect;
        } else {
            return twaver.network.GroupUI.superClass.createBodyRect.call(this);
        }
    },
    unionRect: function(rect1, rect2) {
        if (rect1 && rect2) {
            var rect = {};
            rect.x = Math.min(rect1.x, rect2.x);
            rect.y = Math.min(rect1.y, rect2.y);
            rect.width = Math.max(rect1.x + rect1.width, rect2.x + rect2.width) - rect.x;
            rect.height = Math.max(rect1.y + rect1.height, rect2.y + rect2.height) - rect.y;
            return rect;
        }
        return null;
    },
    roundDiamondPath2:function(context,rect,radius){
        context.save();
        context.beginPath();
        context.moveTo(rect.x+rect.width/2-radius, rect.y+radius);
        context.lineTo(rect.x+radius, rect.y+rect.height/2-radius);
        context.quadraticCurveTo(rect.x , rect.y+rect.height/2, rect.x + radius, rect.y + rect.height/2+radius);
        context.lineTo(rect.x + rect.width/2-radius, rect.y + rect.height-radius);
        context.quadraticCurveTo(rect.x + rect.width/2, rect.y + rect.height-5, rect.x + rect.width/2 + radius, rect.y + rect.height-radius);
        context.lineTo(rect.x + rect.width -radius, rect.y + rect.height/2 +radius);
        context.quadraticCurveTo(rect.x+rect.width, rect.y + rect.height/2, rect.x+rect.width-radius, rect.y + rect.height/2 - radius);
        context.lineTo(rect.x+rect.width/2+radius, rect.y+radius);
        context.quadraticCurveTo(rect.x+rect.width/2, rect.y+5, rect.x + rect.width/2-radius, rect.y+radius);
        context.lineTo(rect.x+rect.width/2-radius, rect.y+radius);
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    }

});

