PSTNDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = new twaver.vector.Network(this.box);
};
twaver.Util.ext('PSTNDemo', Object, {
    init: function () {
        this.registImages();
        var main = document.getElementById('main');
        main.appendChild(this.network.getView());
        this.network.adjustBounds({ x: 0, y: 0, width: 500, height: 500 });

        this.initBox();
        
    },
    registImages: function () {
        this.registerImage("images/cloud.png", this.network);
    },
    initBox: function () {

        var cloudData = new twaver.Node({
            location: { x: 246, y: 145 },
            image: 'cloud',
            name: 'DATA',
            styles: { 'label.yoffset': -30, 'label.color': '#000000' }
        });
        this.box.add(cloudData);

    },


    registerImage: function (url, svg) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        var that = this;
        image.onload = function () {
            twaver.Util.registerImage(that.getImageName(url), image, image.width, image.height, svg);
            image.onload = null;
            for (var i = 1; i < views.length; i++) {
                var view = views[i];
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };
    },
    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
        
});