BusLayoutDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = new twaver.canvas.Network();
    this.bus1 = new twaver.Bus();
    this.bus2 = new twaver.Bus();
    this.bus3 = new twaver.Bus();
    this.bus4 = new twaver.Bus();
    this.bus5 = new twaver.Bus();
    this.bus6 = new twaver.Bus();
};
twaver.Util.ext('BusLayoutDemo', Object, {
    init: function () {
        var self = this;
        this.registImages();
        var main = document.getElementById('main');
        var borderBane = new twaver.controls.BorderPane(this.network);
        this.network.setElementBox(this.box);
        this.appendChild(borderBane.getView(), main, 25, 0, 0, 0);

        this.initBox();
    },
    registImages: function () {
        this.registerImage("images/net/disk.png");
        this.registerImage("images/net/server_green.png");
        this.registerImage("images/net/server_green_his.png");
        this.registerImage("images/net/server_red.png");
        this.registerImage("images/net/server_forward.png");
        this.registerImage("images/net/subnet.png");
        this.registerImage("images/net/switchboard.png");
        this.registerImage("images/net/switchboard_big.png");
        this.registerImage("images/net/validate.png");
        this.registerImage("images/net/terminal.png");
        this.registerImage("images/net/ellipse_1.png");
        this.registerImage("images/net/ellipse_2.png");
        this.registerImage("images/net/ellipse_3.png");
        this.registerImage("images/net/linux.png");
    },
    registerImage: function (url) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        var that = this;
        image.onload = function () {
            twaver.Util.registerImage(that.getImageName(url), image, image.width, image.height, that.network);
            image.onload = null;
            if (that.network.invalidateElementUIs) {
                that.network.invalidateElementUIs();
            }
            if (that.network.invalidateDisplay) {
                that.network.invalidateDisplay();
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
    appendChild: function (e, parent, top, right, bottom, left) {
        e.style.position = 'absolute';
        if (left != null) e.style.left = left + 'px';
        if (top != null) e.style.top = top + 'px';
        if (right != null) e.style.right = right + 'px';
        if (bottom != null) e.style.bottom = bottom + 'px';
        parent.appendChild(e);
    },
    initBox: function () {
        this.bus1.setStyle('vector.outline.width', 4);
        this.bus1.setStyle('vector.outline.color', '#AFAF00');
        this.bus1.setStyle('bus.style', 'south');
        this.box.add(this.bus1);

        this.bus2.setStyle('vector.outline.width', 4);
        this.bus2.setStyle('vector.outline.color', '#AFAF00');
        this.bus2.setStyle('bus.style', 'south');
        this.box.add(this.bus2);

        this.bus3.setStyle('vector.outline.width', 4);
        this.bus3.setStyle('vector.outline.color', '#AFAF00');
        this.bus3.setStyle('bus.style', 'south');
        this.box.add(this.bus3);

        this.bus4.setStyle('vector.outline.width', 4);
        this.bus4.setStyle('vector.outline.color', '#AFAF00');
        this.bus4.setStyle('bus.style', 'south');
        this.box.add(this.bus4);

        this.bus5.setStyle('vector.outline.width', 4);
        this.bus5.setStyle('vector.outline.color', '#AFAF00');
        this.bus5.setStyle('bus.style', 'south');
        this.box.add(this.bus5);

        this.bus6.setStyle('vector.outline.width', 4);
        this.bus6.setStyle('vector.outline.color', '#AFAF00');
        this.bus6.setStyle('bus.style', 'south');
        this.box.add(this.bus6);

        this.bus1.getPoints().add({ x: 70, y: 140 });
        this.bus1.getPoints().add({ x: 1450, y: 140 });

        this.bus2.getPoints().add({ x: 70, y: 200 });
        this.bus2.getPoints().add({ x: 1450, y: 200 });

        this.bus3.getPoints().add({ x: 90, y: 400 });
        this.bus3.getPoints().add({ x: 650, y: 400 });

        this.bus4.getPoints().add({ x: 90, y: 460 });
        this.bus4.getPoints().add({ x: 650, y: 460 });

        this.bus5.getPoints().add({ x: 1000, y: 400 });
        this.bus5.getPoints().add({ x: 1450, y: 400 });

        this.bus6.getPoints().add({ x: 1000, y: 460 });
        this.bus6.getPoints().add({ x: 1450, y: 460 });


        var node1 = new twaver.Node();
        node1.setName("HIS服务器1");
        node1.setImage("server_green_his");
        node1.setCenterLocation(100, 60);
        this.box.add(node1);

        var link1_1 = new twaver.Link(node1, this.bus1);
        link1_1.setStyle('link.width', 2);
        link1_1.setStyle('link.color', '#00FF00');
        link1_1.setStyle('link.from.xoffset', 10);
        this.box.add(link1_1);

        var link1_2 = new twaver.Link(node1, this.bus2);
        link1_2.setStyle('link.width', 2);
        link1_2.setStyle('link.color', '#AFAF00');
        link1_2.setStyle('link.from.xoffset', -10);
        this.box.add(link1_2);

        var node2 = new twaver.Node();
        node2.setName("HIS服务器2");
        node2.setImage("server_green_his");
        node2.setCenterLocation(400, 60);
        this.box.add(node2);

        var link2_1 = new twaver.Link(node2, this.bus1);
        link2_1.setStyle('link.width', 2);
        link2_1.setStyle('link.color', '#00FF00');
        link2_1.setStyle('link.from.xoffset', -10);
        this.box.add(link2_1);

        var link2_2 = new twaver.Link(node2, this.bus2);
        link2_2.setStyle('link.width', 2);
        link2_2.setStyle('link.color', '#AFAF00');
        link2_2.setStyle('link.from.xoffset', 10);
        this.box.add(link2_2);

        var node3 = new twaver.Node();
        node3.setName("SCADA服务器1");
        node3.setImage("server_green");
        node3.setCenterLocation(550, 60);
        this.box.add(node3);

        var link3_1 = new twaver.Link(node3, this.bus1);
        link3_1.setStyle('link.width', 2);
        link3_1.setStyle('link.color', '#AFAF00');
        link3_1.setStyle('link.from.xoffset', -10);
        this.box.add(link3_1);

        var link3_2 = new twaver.Link(node3, this.bus2);
        link3_2.setStyle('link.width', 2);
        link3_2.setStyle('link.color', '#00FF00');
        link3_2.setStyle('link.from.xoffset',10);
        this.box.add(link3_2);

        var node4 = new twaver.Node();
        node4.setName("SCADA服务器2");
        node4.setImage("server_green");
        node4.setCenterLocation(700, 60);
        this.box.add(node4);

        var link4_1 = new twaver.Link(node4, this.bus1);
        link4_1.setStyle('link.width', 2);
        link4_1.setStyle('link.color', '#AFAF00');
        link4_1.setStyle('link.from.xoffset', -10);
        this.box.add(link4_1);

        var link4_2 = new twaver.Link(node4, this.bus2);
        link4_2.setStyle('link.width', 2);
        link4_2.setStyle('link.color', '#00FF00');
        link4_2.setStyle('link.from.xoffset',10);
        this.box.add(link4_2);

        var node5 = new twaver.Node();
        node5.setName("PAS服务器1");
        node5.setImage("server_green");
        node5.setCenterLocation(850, 60);
        this.box.add(node5);

        var link5_1 = new twaver.Link(node5, this.bus1);
        link5_1.setStyle('link.width', 2);
        link5_1.setStyle('link.color', '#AFAF00');
        link5_1.setStyle('link.from.xoffset', -10);
        this.box.add(link5_1);

        var link5_2 = new twaver.Link(node5, this.bus2);
        link5_2.setStyle('link.width', 2);
        link5_2.setStyle('link.color', '#00FF00');
        link5_2.setStyle('link.from.xoffset',10);
        this.box.add(link5_2);

        var node6 = new twaver.Node();
        node6.setName("AYC服务器1");
        node6.setImage("server_green");
        node6.setCenterLocation(1000, 60);
        this.box.add(node6);

        var link6_1 = new twaver.Link(node6, this.bus1);
        link6_1.setStyle('link.width', 2);
        link6_1.setStyle('link.color', '#00FF00');
        link6_1.setStyle('link.from.xoffset', -10);
        this.box.add(link6_1);

        var link6_2 = new twaver.Link(node6, this.bus2);
        link6_2.setStyle('link.width', 2);
        link6_2.setStyle('link.color', '#00FF00');
        link6_2.setStyle('link.from.xoffset',10);
        this.box.add(link6_2);

        var node7 = new twaver.Node();
        node7.setName("DJS服务器1");
        node7.setImage("server_red");
        node7.setCenterLocation(1150, 60);
        this.box.add(node7);

        var link7_1 = new twaver.Link(node7, this.bus1);
        link7_1.setStyle('link.width', 2);
        link7_1.setStyle('link.color', '#FF0000');
        link7_1.setStyle('link.from.xoffset', -10);
        this.box.add(link7_1);

        var link7_2 = new twaver.Link(node7, this.bus2);
        link7_2.setStyle('link.width', 2);
        link7_2.setStyle('link.color', '#00FF00');
        link7_2.setStyle('link.from.xoffset',10);
        this.box.add(link7_2);

        var node8 = new twaver.Node();
        node8.setName("采集服务器1");
        node8.setImage("server_green");
        node8.setCenterLocation(120, 300);
        this.box.add(node8);

        var link8_1 = new twaver.Link(node8, this.bus1);
        link8_1.setStyle('link.width', 2);
        link8_1.setStyle('link.color', '#AFAF00');
        link8_1.setStyle('link.from.xoffset', 10);
        this.box.add(link8_1);

        var link8_2 = new twaver.Link(node8, this.bus2);
        link8_2.setStyle('link.width', 2);
        link8_2.setStyle('link.color', '#00FF00');
        link8_2.setStyle('link.from.xoffset', -10);
        this.box.add(link8_2);

        var link8_3 = new twaver.Link(node8, this.bus3);
        link8_3.setStyle('link.width', 2);
        link8_3.setStyle('link.color', '#00FF00');
        link8_3.setStyle('link.from.position', 'left');
        this.box.add(link8_3);

        var link8_4 = new twaver.Link(node8, this.bus4);
        link8_4.setStyle('link.width', 2);
        link8_4.setStyle('link.color', '#00FF00');
        link8_4.setStyle('link.from.position', 'right');
        this.box.add(link8_4);

        var node9 = new twaver.Node();
        node9.setName("采集服务器2");
        node9.setImage("server_green");
        node9.setCenterLocation(270, 300);
        this.box.add(node9);

        var link9_1 = new twaver.Link(node9, this.bus1);
        link9_1.setStyle('link.width', 2);
        link9_1.setStyle('link.color', '#AFAF00');
        link9_1.setStyle('link.from.xoffset', 10);
        this.box.add(link9_1);

        var link9_2 = new twaver.Link(node9, this.bus2);
        link9_2.setStyle('link.width', 2);
        link9_2.setStyle('link.color', '#00FF00');
        link9_2.setStyle('link.from.xoffset', -10);
        this.box.add(link9_2);

        var link9_3 = new twaver.Link(node9, this.bus3);
        link9_3.setStyle('link.width', 2);
        link9_3.setStyle('link.color', '#00FF00');
        link9_3.setStyle('link.from.position', 'left');
        this.box.add(link9_3);

        var link9_4 = new twaver.Link(node9, this.bus4);
        link9_4.setStyle('link.width', 2);
        link9_4.setStyle('link.color', '#00FF00');
        link9_4.setStyle('link.from.position', 'right');
        this.box.add(link9_4);

        var node10 = new twaver.Node();
        node10.setName("采集服务器3");
        node10.setImage("server_green");
        node10.setCenterLocation(420, 300);
        this.box.add(node10);

        var link10_1 = new twaver.Link(node10, this.bus1);
        link10_1.setStyle('link.width', 2);
        link10_1.setStyle('link.color', '#00FF00');
        link10_1.setStyle('link.from.xoffset', 10);
        this.box.add(link10_1);

        var link10_2 = new twaver.Link(node10, this.bus2);
        link10_2.setStyle('link.width', 2);
        link10_2.setStyle('link.color', '#AFAF00');
        link10_2.setStyle('link.from.xoffset', -10);
        this.box.add(link10_2);

        var link10_3 = new twaver.Link(node10, this.bus3);
        link10_3.setStyle('link.width', 2);
        link10_3.setStyle('link.color', '#00FF00');
        link10_3.setStyle('link.from.position', 'left');
        this.box.add(link10_3);

        var link10_4 = new twaver.Link(node10, this.bus4);
        link10_4.setStyle('link.width', 2);
        link10_4.setStyle('link.color', '#00FF00');
        link10_4.setStyle('link.from.position', 'right');
        this.box.add(link10_4);

        var node11 = new twaver.Node();
        node11.setName("纵向认证加密装置");
        node11.setImage("validate");
        node11.setCenterLocation(120, 560);
        this.box.add(node11);

        var link11_3 = new twaver.Link(node11, this.bus3);
        link11_3.setStyle('link.width', 2);
        link11_3.setStyle('link.color', '#FF0000');
        link11_3.setStyle('link.from.xoffset', 10);
        this.box.add(link11_3);

        var link11_4 = new twaver.Link(node11, this.bus4);
        link11_4.setStyle('link.width', 2);
        link11_4.setStyle('link.color', '#FF0000');
        link11_4.setStyle('link.from.xoffset', -10);
        this.box.add(link11_4);

        var node13 = new twaver.Node();
        node13.setName("两区两市转发路由器");
        node13.setImage("server_forward");
        node13.setCenterLocation(270, 560);
        this.box.add(node13);

        var link13_3 = new twaver.Link(node13, this.bus3);
        link13_3.setStyle('link.width', 2);
        link13_3.setStyle('link.color', '#FF0000');
        link13_3.setStyle('link.from.xoffset', 10);
        this.box.add(link13_3);

        var link13_4 = new twaver.Link(node13, this.bus4);
        link13_4.setStyle('link.width', 2);
        link13_4.setStyle('link.color', '#FF0000');
        link13_4.setStyle('link.from.xoffset', -10);
        this.box.add(link13_4);

        var node14 = new twaver.Node();
        node14.setName("终端服务器1...终端服务器12");
        node14.setImage("terminal");
        node14.setCenterLocation(420, 560);
        this.box.add(node14);

        var link14_3 = new twaver.Link(node14, this.bus3);
        link14_3.setStyle('link.width', 2);
        link14_3.setStyle('link.color', '#FF0000');
        link14_3.setStyle('link.from.xoffset', 10);
        this.box.add(link14_3);

        var link14_4 = new twaver.Link(node14, this.bus4);
        link14_4.setStyle('link.width', 2);
        link14_4.setStyle('link.color', '#FF0000');
        link14_4.setStyle('link.from.xoffset', -10);
        this.box.add(link14_4);

        var node15 = new twaver.Node();
        node15.setImage("server_forward");
        node15.setCenterLocation(770, 300);
        this.box.add(node15);

        var link15_1 = new twaver.Link(node15, this.bus1);
        link15_1.setStyle('link.width', 2);
        link15_1.setStyle('link.color', '#FF0000');
        link15_1.setStyle('link.from.xoffset', 10);
        this.box.add(link15_1);

        var link15_2 = new twaver.Link(node15, this.bus2);
        link15_2.setStyle('link.width', 2);
        link15_2.setStyle('link.color', '#FF0000');
        link15_2.setStyle('link.from.xoffset', -10);
        this.box.add(link15_2);

        var node18 = new twaver.Node();
        node18.setName("集控远程实时延伸网交换机1");
        node18.setImage("switchboard");
        node18.setCenterLocation(945, 420);
        this.box.add(node18);

        var link18_5 = new twaver.Link(node18, this.bus5);
        link18_5.setStyle('link.width', 2);
        link18_5.setStyle('link.color', '#AFAF00');
        this.box.add(link18_5);

        var node19 = new twaver.Node();
        node19.setName("集控远程实时延伸网交换机2");
        node19.setImage("switchboard");
        node19.setCenterLocation(945, 480);
        this.box.add(node19);

        var link19_6 = new twaver.Link(node19, this.bus6);
        link19_6.setStyle('link.width', 2);
        link19_6.setStyle('link.color', '#AFAF00');
        this.box.add(link19_6);

        var node24 = new twaver.Node();
        node24.setName2("交换机1");
        node24.setImage("switchboard_big");
        node24.setCenterLocation(50, 140);
        this.box.add(node24);

        var link24_1 = new twaver.Link(node24, this.bus1);
        link24_1.setStyle('link.width', 2);
        link24_1.setStyle('link.color', '#AFAF00');
        this.box.add(link24_1);

        var node25 = new twaver.Node();
        node25.setName("交换机2");
        node25.setImage("switchboard_big");
        node25.setCenterLocation(50, 200);
        this.box.add(node25);

        var link25_2 = new twaver.Link(node25, this.bus2);
        link25_2.setStyle('link.width', 2);
        link25_2.setStyle('link.color', '#AFAF00');
        this.box.add(link25_2);

        var node26 = new twaver.Node();
        node26.setName("WEB服务器1");
        node26.setImage("server_red");
        node26.setCenterLocation(762, 400);
        this.box.add(node26);

        var link26_left_node15 = new twaver.Link(node26, node15);
        link26_left_node15.setStyle('link.width', 2);
        link26_left_node15.setStyle('link.color', '#00FF00');
        link26_left_node15.setStyle('link.from.xoffset', -5);
        link26_left_node15.setStyle('link.to.xoffset', -5);
        this.box.add(link26_left_node15);

        var link26_right_node15 = new twaver.Link(node15, node26);
        link26_right_node15.setStyle('link.width', 2);
        link26_right_node15.setStyle('link.color', '#00FF00');
        link26_right_node15.setStyle('link.from.xoffset', 5);
        link26_right_node15.setStyle('link.to.xoffset', 5);
        this.box.add(link26_right_node15);

        var node27 = new twaver.Node();
        node27.setName("his18003容量");
        node27.setName2("his28003容量");
        node27.setImage("disk");
        node27.setCenterLocation(250, 50);
        this.box.add(node27);

        var link27_top_node1 = new twaver.Link(node1, node27);
        link27_top_node1.setStyle('link.width', 2);
        link27_top_node1.setStyle('link.color', '#CCCCCC');        
        link27_top_node1.setStyle('link.to.yoffset', -5);
        link27_top_node1.setStyle('link.from.yoffset', -5);
        this.box.add(link27_top_node1);

        var link27_bottom_node1 = new twaver.Link(node27, node1);
        link27_bottom_node1.setStyle('link.width', 2);
        link27_bottom_node1.setStyle('link.color', '#CCCCCC');        
        link27_bottom_node1.setStyle('link.to.yoffset', 5);
        link27_bottom_node1.setStyle('link.from.yoffset', 5);
        this.box.add(link27_bottom_node1);

        var link27_top_node2 = new twaver.Link(node27, node2);
        link27_top_node2.setStyle('link.width', 2);
        link27_top_node2.setStyle('link.color', '#CCCCCC');
        link27_top_node2.setStyle('link.from.yoffset', -5);
        link27_top_node2.setStyle('link.to.yoffset', -5);
        this.box.add(link27_top_node2);

        var link27_bottom_node2 = new twaver.Link(node2, node27);
        link27_bottom_node2.setStyle('link.width', 2);
        link27_bottom_node2.setStyle('link.color', '#CCCCCC');
        link27_bottom_node2.setStyle('link.from.yoffset', 5);
        link27_bottom_node2.setStyle('link.to.yoffset', 5);
        this.box.add(link27_bottom_node2);

        var node28 = new twaver.Node();
        node28.setImage("switchboard");
        node28.setCenterLocation(35, 420);
        this.box.add(node28);

        var link28_3 = new twaver.Link(node28, this.bus3);
        link28_3.setStyle('link.width', 2);
        link28_3.setStyle('link.color', '#AFAF00');
        this.box.add(link28_3);

        var node29 = new twaver.Node();
        node29.setImage("switchboard");
        node29.setCenterLocation(35, 480);
        this.box.add(node29);

        var link29_4 = new twaver.Link(node29, this.bus4);
        link29_4.setStyle('link.width', 2);
        link29_4.setStyle('link.color', '#AFAF00');
        this.box.add(link29_4);

        var node30 = new twaver.Node();
        node30.setImage("ellipse_1");
        node30.setCenterLocation(105, 610);
        this.box.add(node30);

        var link30_node11 = new twaver.Link(node30, node11);
        link30_node11.setStyle('link.width', 2);
        link30_node11.setStyle('link.color', '#0000FF');
        this.box.add(link30_node11);

        var node31 = new twaver.Node();
        node31.setImage("ellipse_2");
        node31.setCenterLocation(405, 610);
        this.box.add(node31);

        var link31_node14 = new twaver.Link(node31, node14);
        link31_node14.setStyle('link.width', 2);
        link31_node14.setStyle('link.color', '#0000FF');
        this.box.add(link31_node14);

        var node12 = new twaver.Node();
        node12.setName("纵向认证加密装置");
        node12.setImage("validate");
        node12.setCenterLocation(120, 710);
        this.box.add(node12);

        var link12_node30 = new twaver.Link(node12, node30);
        link12_node30.setStyle('link.width', 2);
        link12_node30.setStyle('link.color', '#0000FF');
        this.box.add(link12_node30);

        var node20 = new twaver.Node();
        node20.setName("保护子站");
        node20.setImage("subnet");
        node20.setCenterLocation(120, 760);
        this.box.add(node20);

        var link20_node12 = new twaver.Link(node20, node12);
        link20_node12.setStyle('link.width', 2);
        link20_node12.setStyle('link.color', '#0000FF');
        link20_node12.setStyle('link.to.xoffset', -10);
        this.box.add(link20_node12);

        var node21 = new twaver.Node();
        node21.setName("保护子站");
        node21.setImage("subnet");
        node21.setCenterLocation(220, 760);
        this.box.add(node21);

        var link21_node12 = new twaver.Link(node21, node12);
        link21_node12.setStyle('link.width', 2);
        link21_node12.setStyle('link.color', '#0000FF');
        this.box.add(link21_node12);

        var node22 = new twaver.Node();
        node22.setName("远动子站");
        node22.setImage("subnet");
        node22.setCenterLocation(370, 760);
        this.box.add(node22);

        var link22_node31 = new twaver.Link(node22, node31);
        link22_node31.setStyle('link.width', 2);
        link22_node31.setStyle('link.color', '#0000FF');
        this.box.add(link22_node31);

        var node23 = new twaver.Node();
        node23.setName("远动子站");
        node23.setImage("subnet");
        node23.setCenterLocation(470, 760);
        this.box.add(node23);

        var link23_node12 = new twaver.Link(node23, node12);
        link23_node12.setStyle('link.width', 2);
        link23_node12.setStyle('link.color', '#0000FF');
        link23_node12.setStyle('link.to.xoffset', 10);
        this.box.add(link23_node12);

        var link23_node31 = new twaver.Link(node23, node31);
        link23_node31.setStyle('link.width', 2);
        link23_node31.setStyle('link.color', '#0000FF');
        link23_node31.setStyle('link.to.xoffset', 10);
        this.box.add(link23_node31);

        var node32 = new twaver.Node();
        node32.setImage("switchboard");
        node32.setCenterLocation(1050, 560);
        this.box.add(node32);

        var link32_5 = new twaver.Link(node32, this.bus5);
        link32_5.setStyle('link.width', 2);
        link32_5.setStyle('link.color', '#FF0000');
        this.box.add(link32_5);

        var node33 = new twaver.Node();
        node33.setImage("switchboard");
        node33.setCenterLocation(1350, 560);
        this.box.add(node33);

        var link33_6 = new twaver.Link(node33, this.bus6);
        link33_6.setStyle('link.width', 2);
        link33_6.setStyle('link.color', '#FF0000');
        this.box.add(link33_6);

        var node34 = new twaver.Node();
        node34.setImage("ellipse_3");
        node34.setCenterLocation(1200, 610);
        this.box.add(node34);

        var link34_node32 = new twaver.Link(node34, node32);
        link34_node32.setStyle('link.width', 2);
        link34_node32.setStyle('link.color', '#0000FF');
        this.box.add(link34_node32);

        var link34_node33 = new twaver.Link(node34, node33);
        link34_node33.setStyle('link.width', 2);
        link34_node33.setStyle('link.color', '#0000FF');
        this.box.add(link34_node33);

        var node35 = new twaver.Node();
        node35.setImage("switchboard");
        node35.setCenterLocation(1220, 710);
        this.box.add(node35);

        var link35_node34 = new twaver.Link(node35, node34);
        link35_node34.setStyle('link.width', 2);
        link35_node34.setStyle('link.color', '#0000FF');
        this.box.add(link35_node34);

        var node36 = new twaver.Node();
        node36.setImage("linux");
        node36.setCenterLocation(1235, 810);
        this.box.add(node36);

        var link36_node35 = new twaver.Link(node36, node35);
        link36_node35.setStyle('link.width', 2);
        link36_node35.setStyle('link.color', '#0000FF');
        this.box.add(link36_node35);

        var linkbus1_5 = new twaver.Link(this.bus1, this.bus5);
        linkbus1_5.setStyle('link.width', 2);
        linkbus1_5.setStyle('link.color', '#FF0000');
        linkbus1_5.setStyle('link.from.xoffset', -100);
        linkbus1_5.setStyle('link.to.xoffset', 350);
        this.box.add(linkbus1_5);

        var linkbus2_6 = new twaver.Link(this.bus2, this.bus6);
        linkbus2_6.setStyle('link.width', 2);
        linkbus2_6.setStyle('link.color', '#FF0000');
        linkbus2_6.setStyle('link.from.xoffset', -150);
        linkbus2_6.setStyle('link.to.xoffset', 300);
        this.box.add(linkbus2_6);

        this.bus1.firePointsChange();
        this.bus2.firePointsChange();
        this.bus3.firePointsChange();
        this.bus4.firePointsChange();
        this.bus5.firePointsChange();
        this.bus6.firePointsChange();
    },
});