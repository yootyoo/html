$(function () {

    //指定make路径
    make.Default.path = '';

    make.Default.EXPORT_OBJECT_ID = false;

    //取得显示编辑器的容器jquery对象
    var parentView = $('.main');

    //实例化doodle.DeviceEditor对象
    var deviceEditor = window.deviceEditor = new doodle.DeviceEditor(parentView);
    deviceEditor.network2d.setPositionMagneticX(0.5);
    deviceEditor.network2d.setPositionMagneticY(0.5);
    deviceEditor.onDropHandler = function (e, data, box, network) {
        return
    }

    //对齐方式,调用align(type)方法，实现选中元素的对齐。type取值范围:up、down、left、right、center、middle
    $('.alignBox').on('click', 'span', function (e) {
        var type = $(this).data('type');
        deviceEditor.align(type);
    });

    //分布方式,调用flow(type, padding),实现选中元素的均匀分布. type取值范围:hor、ver
    $('#flowBox').on('click', 'span', function (e) {
        var type = $(this).data('type');
        var data = deviceEditor.getSelectedData();
        if (data.length == 1) {
            var count = prompt('请输入复制次数', 9);
            count = parseFloat(count);
            if (isNaN(count)) {
                return;
            }
            deviceEditor.flowAndCopy(type, count);
        } else if (data.length > 1) {
            var padding = prompt('请输入间距', 25);
            padding = parseFloat(padding);
            if (isNaN(padding)) {
                return;
            }
            deviceEditor.flow(type, padding);
        }
    });

    //全局视图
    $("#overview").click(function () {
        deviceEditor.zoomOverview();
    });

    //拖拽模式（默认）／框选模式  true-拖拽模式 false-框选模式
    $('#panModel').on('click', function () {
        $(this).toggleClass('panModel');
        if ($(this).hasClass('panModel')) {
            deviceEditor.setDragToPan(false);
            $(this).removeClass('mn-multi-select');
            $(this).addClass('mn-drag');
            $(this).attr('title', '拖拽模式');
        } else {
            deviceEditor.setDragToPan(true);
            $(this).removeClass('mn-drag');
            $(this).addClass('mn-multi-select');
            $(this).attr('title', '框选模式');
        }
    })

    //开启鼠标编辑（默认）／关闭鼠标编辑 true-开启鼠标编辑 false-关闭鼠标编辑
    $('#editable').on('click', function (e) {
        $(this).toggleClass('editable');
        if ($(this).hasClass('editable')) {
            deviceEditor.setMouseEditable(true)
            $(this).removeClass('mn-disable-edit');
            $(this).addClass('mn-edit');
            $(this).attr('title', '禁止鼠标编辑');
        } else {
            deviceEditor.setMouseEditable(false)
            $(this).removeClass('mn-edit');
            $(this).addClass('mn-disable-edit');
            $(this).attr('title', '开启鼠标编辑');
        }
    });

    //取得模型的面板名称
    var panelName = doodle.utils.getUrlParam('panelName');
    $('.exportImageDialog').find('.name').val(panelName)

    //调用 getData方法,取得编辑结果.
    $("#save").click(function () {

        //取得默认的面板名称
        var mess = 'twaver.idc.equipment.newPanel';
        if (panelName && panelName.length > 0 && panelName != 'undefined') {
            mess = panelName;
        }

        //弹框,输入面板名称
        var name = prompt('请输入面板名称', mess);
        if (name && name != 'undefined') {

            createNewPanel(name);
        }
    });

    //调用 clear方法,取得编辑结果.
    $("#clear").click(function () {


        if (confirm('确认清空')) {

            deviceEditor.clear();
        }
    });

    function createNewPanel(name, callback) {

        var data = deviceEditor.getData();

        if(proxy.isMemory){
            var icon = "ball-red";
            //如果是有背板,保存为面板图,否则保存为面板部件
            if (deviceEditor.parentNode) {

                tools.updateOrInsertModel('设备面板', name, data, icon, function () {

                    tools.registerPanel(name, data, icon);
                    deviceEditor.refreshAccordion();
                    callback && callback();
                })
            } else {
                name = name + doodle.consts.MODEL_SUFFIX_SEPARATOR + doodle.consts.DEVICE_MODEL_SUFFIX;
                tools.updateOrInsertModel('面板部件', name, data, icon, function () {

                    tools.registerPanelComp(name, data, icon);
                    deviceEditor.refreshAccordion();
                    callback && callback();
                })
            }
        }else{
            //上传icon图片
            var icon = name;
            tools.uploadImage(icon + '.png', 'icons', deviceEditor.getIcon(), function () {

                //如果是有背板,保存为面板图,否则保存为面板部件
                if (deviceEditor.parentNode) {

                    tools.updateOrInsertModel('设备面板', name, data, icon, function () {

                        tools.registerPanel(name, data);
                        deviceEditor.refreshAccordion();
                        callback && callback();
                    })
                } else {
                    name = name + doodle.consts.MODEL_SUFFIX_SEPARATOR + doodle.consts.DEVICE_MODEL_SUFFIX;
                    tools.updateOrInsertModel('面板部件', name, data, icon, function () {

                        tools.registerPanelComp(name, data);
                        deviceEditor.refreshAccordion();
                        callback && callback();
                    })
                }
            })
        }
    }


    //import json
    var importDialog = doodle.utils.createImportDialog('Import JSON', 'json', function (text) {
        var data = JSON.parse(text);
        deviceEditor.setData(data);
        setTimeout(function () {
            deviceEditor.zoomOverview();
        }, 100);
    });

    $("#import").click(function () {
        importDialog.show();
    });

    //export json
    $('#export').click(function () {
        var data = deviceEditor.getData();
        if (!data) {
            alert("没有数据");
            return;
        }
        var text = JSON.stringify(data);
        $('.exportJson').find('.content').val(text);
        $('.exportJson').dialog('open');

    });

    $('.exportJson').dialog({
        "title": "导出json",
        "width": 700,
        "height": 400,
        autoOpen: false,
        show: {
            effect: "fade",
        },
        hide: {
            effect: "fade",
        },
        modal: true,
        buttons: {
            OK: function (e) {

                $('.exportJson').dialog('close');
                var name = $('.exportJson').find('.name').val();

                //保存当前面板
                createNewPanel(name);

                //判断是否有背板
                if (deviceEditor.parentNode) {

                    //判断是否是标准U设备
                    var editable = deviceEditor.parentNode.getClient('editable')
                    if (!editable) {

                        //upload iamge
                        var imageName = name + '.png';
                        tools.uploadImage(imageName, 'images', deviceEditor.getImage());
                        var id = deviceEditor.parentNode.getClient('id');
                        var id3d = id.replace(doodle.consts.MODEL_SUFFIX_SEPARATOR + doodle.consts.DEVICE_MODEL_SUFFIX, '');

                        var icon = name;
                        //注册机柜编辑器中的2D模型
                        tools.updateOrInsertModel('设备2D', name + doodle.consts.MODEL_SUFFIX_SEPARATOR + doodle.consts.RACK_MODEL_SUFFIX, {
                            id: id3d + doodle.consts.MODEL_SUFFIX_SEPARATOR + doodle.consts.RACK_MODEL_SUFFIX,
                            image: imageName,
                            client: {
                                panel: name
                            }
                        }, icon)

                        //注册模型编辑器中的3D模型
                        tools.updateOrInsertModel('设备', name, {
                            id: id3d,
                            image: imageName,
                            client: {
                                panel: name
                            }
                        }, icon)
                    }

                }
                $('.exportJson').dialog('close');
            },
            Cancel: function (e) {
                $('.exportJson').dialog('close');
            }
        },
    });

    $('#exportImage').click(function () {

        var result = deviceEditor.getBounds();
        $('.exportImageDialog').find('.width').text(result.width);
        $('.exportImageDialog').find('.height').text(result.height);
        $('.exportImageDialog').dialog('open');
    });

    $('.exportImageDialog').dialog({
        title: 'export image',
        height: 250,
        width: 350,
        autoOpen: false,
        show: {
            effect: "fade",
        },
        hide: {
            effect: "fade",
        },
        modal: true,
        buttons: {
            OK: function (e) {
                $('.exportImageDialog').dialog('close');
                var scale = $('.exportImageDialog').find('.scale').val();
                var name = $('.exportImageDialog').find('.name').val();
                scale = parseInt(scale || 1) || 1;
                var data = deviceEditor.toCanvas({scale: scale});
                data.content.toBlob(function (blob) {
                    saveAs(blob, name);
                });
            },
            Cancel: function (e) {
                $('.exportImageDialog').dialog('close');
            }
        },
    });

    deviceEditor.setUndoManagerEnabled(true);
    $('#undo').click(function () {
        deviceEditor.undo();
    });

    $('#redo').click(function () {
        deviceEditor.redo();
    });


    //deviceEditor.setAccordionVisible(true)  //显示左侧工具栏
    //deviceEditor.setAccordionVisible(false) //隐藏左侧工具栏

    $(parentView).on('keyup', function (e) {
        //console.log(e, e.keyCode);
        if (e.keyCode == 46) {//delete node
            var data = deviceEditor.getSelectedData();
            deviceEditor.removeData(data)

        }
    });

    /**
     * 监听键盘粘帖复制事件
     */
    $(parentView).on('keydown', function (e) {
        if (doodle.utils.isCtrlDown(e)) {
            //ctrl+c
            if (e.keyCode === 67) {
                deviceEditor.copySelection();
            }
            //ctrl+v
            if (e.keyCode === 86) {
                deviceEditor.pasteSelection();
            }
        }
    });

    //刷新侧边栏
    deviceEditor.refreshAccordion();
})

