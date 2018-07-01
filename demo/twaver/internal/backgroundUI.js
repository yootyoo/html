var $backgroundUI = {
    draw: function(ctx, network) {
        var target = network.getCurrentSubNetwork() == null ? network.getElementBox() : network.getCurrentSubNetwork();
        var type = target.getStyle("background.type");
        if(type == "none") {
            //do nothing
        }
        if(type == "image") {
            this.drawImage(ctx, target,network);

        } else if(type == "vector") {
           this.drawVector(ctx, target);

        } else if(type == "image.vector") {
            this.drawImage(ctx, target,network);
            this.drawVector(ctx, target);

        } else if(type == "vector.image") {
            this.drawVector(ctx, target);
            this.drawImage(ctx, target,network);
        }
    },
    drawImage: function(ctx,target,network) {
        var image = target.getStyle("background.image");
        var imageAsset = _twaver.getImageAsset(image);
        if(imageAsset == null){
            return;
        }
        var rect = {x:0,y:0,width:ctx.canvas.width,height:ctx.canvas.height};
        if(target.getStyle("background.image.stretch") == "none") {
            rect.width = imageAsset.getWidth();
            rect.height = imageAsset.getHeight();
        }
        var padding = target.getStyle("background.image.padding");
        if(padding) {
            $math.grow(rect, padding, padding);
        }
        if(target.getStyle("background.image.stretch") == "tile") {
            if(isImage(imageAsset.getImage())) {
                for (var w = 0; w < rect.width; w += imageAsset.getWidth()) {
                    for (var h = 0; h < rect.height; h  += imageAsset.getHeight()) {
                        ctx.drawImage(imageAsset.getImage(), w, h);
                    }
                }
            }
        } else if(target.getStyle("background.image.stretch") == "fill" || target.getStyle("background.image.stretch") == "none") {
            drawImage(ctx,imageAsset.getImage(),null,rect,target,network);
        }

    },
    drawVector: function(ctx,target) {
        var rect = {x:0,y:0,width:ctx.canvas.width,height:ctx.canvas.height};
        var outlineWidth = target.getStyle("background.outline.width");
        var outlineColor = target.getStyle("background.outline.color");
        var fill = target.getStyle("background.vector.fill");
        var fillColor = target.getStyle('background.vector.fill.color');
        var padding = target.getStyle("background.vector.padding");
        var shape = target.getStyle("background.vector.shape");
        var pattern = target.getStyle("background.vector.pattern");
        if(padding) {
            $math.grow(rect, padding, padding);
        }
        var gradient = target.getStyle('background.vector.gradient');
        if (fill) {
            if (gradient) {
                $g.fill(ctx, fillColor, gradient, target.getStyle("background.vector.gradient.color"), rect);
            } else {
                ctx.fillStyle = fillColor;
            }
            $g.drawVector(ctx, shape, pattern, rect);
            ctx.fill();
        }
        if(outlineWidth > 0) {
            ctx.lineWidth = outlineWidth;
            ctx.strokeStyle = target.getStyle('background.outline.color');
            $g.drawVector(ctx, shape, pattern, rect);
            ctx.stroke();
        }
    }
};