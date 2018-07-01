
var demo = {};

// �����Ԫ
var box = new twaver.ElementBox();

// ��������ק����
 function createDraggableNetwork(box) {
        var network = new twaver.canvas.Network(box); 

        network.getView().addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }, false);
        network.getView().addEventListener('drop', function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var text = e.dataTransfer.getData('Text');
            if (!text) {
                return false;
            }
            if (text && text.indexOf('className:') == 0) {
               _createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
            }
            if (text && text.indexOf('<twaver') == 0) {
                network.getElementBox().clear();
                new twaver.XmlSerializer(network.getElementBox()).deserialize(text);
            }
            return false;
        }, false);

        network.getView().setAttribute('draggable', 'true');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);
        
      network.getView().addEventListener("click", function(event){
        var hitUI  = network.hitTest(event);
        if(hitUI instanceof demo.ScaleLinkUI){
          var point;
          if (event.target) {
              point = network.getLogicalPoint(event);
          } else if(event.event) {
              point = network.getLogicalPoint(event.event);
          } else {
              point = event;
          }
          var position = hitUI.hitCanvasRectAtScaleLine(point.x, point.y);
          if(position === "from"){
          	hitUI._element.setClient("position","from");
          }else if(position === "to"){
          	hitUI._element.setClient("position","to");
          }else{
          	hitUI._element.setClient("position",null);
          }
        }
      });        
        return network;
    }  
    //��ק����Ԫ��
    function _createElement(network, className, centerLocation) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation(centerLocation);
        element.setParent(network.getCurrentSubNetwork());
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
    }
    //��ʼ������ק����
		var network = createDraggableNetwork(box);
		//�Զ�����       
		var autoLayouter = new twaver.layout.AutoLayouter(box);
		//���ɲ���
		var springLayouter = new twaver.layout.SpringLayouter(network);
		
		//��ʼ����ͼ���
		Table = twaver.controls.Table;//���
		TablePane = twaver.controls.TablePane;//������
		TreeTable = twaver.controls.TreeTable;//�����Tree��Table����
		SplitPane = twaver.controls.SplitPane;//�������
		TabPane = twaver.controls.TabPane;//ѡ����
		tabPane = new TabPane();
		
		//��ʼ������˵�    
		var popupMenu = new leftPopupMenu(network);
		  
		/*
		 *��ʼ��ҳ��
		 *
		*/
		function init() {
			// ����ѡ����ʽ
			twaver.Styles.setStyle('select.style', 'border');
			//����Group��ʽ			
			twaver.Styles.setStyle('group.expanded', true);
			twaver.Styles.setStyle('group.padding', 0);
			//����������
			var toolbar = createToolbar(network);

			//�����������
			treeTable = new demo.AutoPackTreeTable(box);
			
			var mainSplitPane = new SplitPane(network, tabPane,  'vertical', 0.88);
			var mainPane = new twaver.controls.BorderPane(mainSplitPane, toolbar);
			var main = document.getElementById('main');
			//������������Ϸ�����߶�Ϊ20
			mainPane.setTopHeight(25);			 
      window.onresize = function (e) {
          mainPane.invalidate();
      };           
           
      this.tabPane.setTabRadius(8);
      this.tabPane.setTabGap(5);
      this.tabPane.setSelectBackground('#8080FF');
      this.tabPane.setTabBackground('#C0C0C0');
           
	     //��ʼ��������		
	     initTreeTable();	
	     //ע��ͼƬ
			 registerImages();
			 
				var callback = function (e) {
				  if (e.kind === 'validateEnd') {
				    network.removeViewListener(callback);
				    network.zoomOverview();
				  }
				};
				
			 	network.addViewListener(callback);
			 	//TOPO��ʼ��
			  initDataBox();		
				network.setElementBox(box);	
				 
				// ���û�����ʽ     
				network.getView().style.backgroundColor = "#f3f3f3";
				network.getView().style.cursor = "hand";
				network.setToolTipEnabled(false);
			
				//����mousemove������ΪС��
				var oldCursor = network.getView().style.cursor;        
		    network.getView().addEventListener('mousemove',function(e){		
					var element = network.getElementAt(e);
					if(element) {
						network.getView().style.cursor = 'pointer';
					}else{
						network.getView().style.cursor = oldCursor;
					}
				})
      
      	//��ʼ������Ϊround
        this.autoLayouter.setAnimate(false);
        this.autoLayouter.doLayout('round');
        this.autoLayouter.setAnimate(true);       
			
				appendC(mainPane.getView(), main,0, 0, 0, 0);		
        mainPane.getView().style.overflow = "visible";
        mainPane.getView().style.width = "1500px";
        mainPane.getView().style.height = "900px";
			}

			function appendC(e, parent, top, right, bottom, left) {
        e.style.position = 'absolute';
        if (left != null) e.style.left = left + 'px';
        if (top != null) e.style.top = top + 'px';
        if (right != null) e.style.right = right + 'px';
        if (bottom != null) e.style.bottom = bottom + 'px';
        parent.appendChild(e);
    	}
    	
			// ע��ͼƬ					
			function registerImage(url, svg) {			
		      var image = new Image();      
		      image.src = url;
		      var views = arguments;
		      image.onload = function () {
		          twaver.Util.registerImage(getImageName(url), image, image.width, image.height, svg === true);
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
	  	}
    	//ͼ������
	    function getImageName(url) {
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
	    }			    			
			// ע��ͼƬ
			function registerImages() {								
			this.registerImage("images/element/routerImage.png");  
			this.registerImage("20151103110156.jpg","20151103110156");          
			}			
 			//����������
			function createToolbar (network) {
					var toolbar = document.createElement('div');					
					//Ĭ��
		      addButton(toolbar, 'Default', 'images/topo/toolbar/select.PNG', function () {	            
		            if (twaver.Util.isTouchable) {
		                network.setTouchInteractions();
		            } else {
		                network.setDefaultInteractions();
		            }		           
  
								window.location.reload();
		      });
		      //�Ŵ�
		      addButton(toolbar, 'Magnify', 'images/topo/toolbar/magnify.png', function () {
	            network.setMagnifyInteractions();
	        });        
	   			//�����Ԫ
					addDraggableButton(toolbar, 'Create Node', 'node_icon', 'twaver.Node');				
					//���link
	        addButton(toolbar, 'Create Link', 'images/link_icon.png', function () {  
        			popupMenu.isVisible = false;
        			twaver.Styles.setStyle('select.style', 'shadow');
	            network.setCreateLinkInteractions(twaver.Link); 
//	            popupMenu.isVisible = function (menuItem) {
//											return false;
//        			}         
        			popupMenu.isVisible = false;                  
	        });
	        //��ӱ���
	        addButton(toolbar, 'Change background', 'images/topo/toolbar/changebg.png', function () {
							box.setStyle('background.type', 'image');
							box.setStyle('background.image', '20151103110156');
	        });
	
					//�Ŵ�
					addButton(toolbar, 'Zoom In', 'images/topo/toolbar/zoomIn.png', function () {
						network.zoomIn();
					});
					//��С
					addButton(toolbar, 'Zoom Out', 'images/topo/toolbar/zoomOut.png', function () {
						network.zoomOut();
					});
					//���ŵ�ȫͼ
					addButton(toolbar, 'Overview', 'images/topo/toolbar/zoomOverview.png', function () {
						network.zoomOverview();
					});			
					//��λ
					addButton(toolbar, 'Reset', 'images/topo/toolbar/zoomReset.png', function () {
						network.zoomReset();
					});			
					//ȫ��
		      addButton(toolbar, 'Full screen', 'images/topo/toolbar/fullscreen.png', function () {
		          toggleFullscreen();
		      });          
		      //����ͼƬ
		      addButton(toolbar, 'Export Image', 'images/topo/toolbar/export.png', function () {
		          var canvas;
		          if (network.getCanvasSize) {
		              canvas = network.toCanvas(network.getCanvasSize().width, network.getCanvasSize().height);
		          } else {
		              canvas = network.toCanvas(network.getView().scrollWidth, network.getView().scrollHeight);
		          }
		          if (twaver.Util.isIE) {
		              var w = window.open();
		              w.document.open();
		              w.document.write("<img src='" + canvas.toDataURL() + "'/>");
		              w.document.close();
		          } else {
		              window.open(canvas.toDataURL(), 'network.png');
		              //alert(canvas.toDataURL().toString());//����������
		              //Canvas2Image.saveAsPNG(canvas);//����ͼƬ������
		          }
		      });	        	
		       //�Զ�����
					 var zoomToOverview = addCheckBox(toolbar, false, "Overview", function () {
		            doLayout(zoomToOverview.value,autoLayouterType.value);
		        });        
					 var autoLayouterType = document.createElement('select');
					 autoLayouterType.id = "����";
					 autoLayouterType.name = "����";
		        var items = ['round', 'symmetry', 'topbottom', 'bottomtop', 'leftright', 'rightleft', 'hierarchic'];
		        items.forEach(function (item) {
		            var option = document.createElement('option');
		            option.appendChild(document.createTextNode(item));
		            option.setAttribute('value', item);
		            autoLayouterType.appendChild(option);
		        });
		       autoLayouterType.addEventListener('change', function () { doLayout(zoomToOverview.value,autoLayouterType.value); }, false);
		       toolbar.appendChild(autoLayouterType);       
		        //���ɲ���
		        var start = addButton(toolbar, 'Start springLayouter', null, function () {
							var isRunning = springLayouter.isRunning();
							if (isRunning) {
							springLayouter.stop();
							start.value = 'Start springLayouter';
							} else {
							springLayouter.start();
							start.value = 'Stop';
							}
						});       
		        //�༭״̬�л�
		        addButton(toolbar, 'Edit State', 'images/icon-edit.png', function () {
		        	network.getView().addEventListener('mousemove',function(e){		
							var element = network.getElementAt(e);
							if(element) {
								network.getSelectionModel().setSelection(element);
							}else{
								network.getSelectionModel().clearSelection();
							}
						})				
							popupMenu = new leftMovePopupMenu(network);
							initMousemovePopupMenu();
		    		});        
		        //����group
					  addDraggableButton(toolbar, 'Create Group', 'group_icon', 'twaver.Group');
					   //reload
//			      addButton(toolbar, 'Reload', 'images/topo/toolbar/refresh.png', function () {
//		            window.location.reload();
//		        });      	
					return toolbar;
		}
		 		   
		function addDraggableButton(div, name, src, className) {
        var image = new Image();
        image.setAttribute('title', name);
        image.setAttribute('draggable', 'true');
        image.style.cursor = 'move';
        image.style.verticalAlign = 'top';
        image.style.padding = '4px 4px 4px 4px';
        if (src.indexOf('/') < 0) {
            src = 'images/topo/toolbar/' + src + '.png';
        }
        image.setAttribute('src', src);
        image.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', 'className:' + className);
        }, false);
        div.appendChild(image);
        return image;
    }         
       //����
     function doLayout (overview,type) {
	       if (overview){
		        autoLayouter.doLayout(type, function () {
		            network.zoomOverview(true);
		        });
				 }else{
				        autoLayouter.doLayout(type);
				 }
		 }           
		 //��Ӱ�ť
			function addButton (div, name, src, callback) {
			    var button = document.createElement('input');
			    button.setAttribute('type', src ? 'image' : 'button');
			    button.setAttribute('title', name);
			    button.style.verticalAlign = 'middle';
			    if (src) {
			        button.style.padding = '4px 4px 4px 4px';
			        button.setAttribute('src', src);
			    } else {
			        button.value = name;
			    }
			    button.onclick = callback;
			    div.appendChild(button);
			    return button;
			}
        
        function addCheckBox (div, checked, name, callback) {
			    var checkBox = document.createElement('input');
			   // checkBox.id = name;
//			    checkBox.type = 'checkbox';
			   checkBox.style.padding = '4px 4px 4px 4px';
//			    checkBox.checked = checked;
//			    if (callback) checkBox.addEventListener('click', callback, false);
//			    div.appendChild(checkBox);
//			    var label = document.createElement('label');
//			    label.htmlFor = name;
//			    label.innerHTML = name;
//			    div.appendChild(label);
			    return checkBox;
				}   
				
     function isFullScreenSupported () {
        var docElm = document.documentElement;
        return docElm.requestFullscreen || docElm.msRequestFullscreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen;
    }
    
     function toggleFullscreen () {
        if (this.isFullScreenSupported()) {
            var fullscreen = document.fullscreen || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen;
            if (!fullscreen) {
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.msRequestFullscreen){
                    docElm.msRequestFullscreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
    }

		//����Group,node,link
   function initDataBox() {  	
   			var group1 = new twaver.Group();
   			//group1.s('group.fill.color','#ef8200');//'#64cccc'
   			//group1.s('whole.alpha',0.5);
   			//group1.s('group.fill',false);
   			group1.setName('Group1')
        group1.setExpanded(true);
        group1.setClient('editable',false);
        group1.s('group.fill.color','#FFA000');
        this.box.add(group1);
        
        var group2 = new twaver.Group();
        group2.setName('Group2')
        //group2.setStyle('group.shape', 'circle');
        group2.setExpanded(true);
        this.box.add(group2);
				
	 			for (var k = 0; k < 2; k++) {
            var ip = "192.168." + k + ".";
            var count = 0;           
            var root = new twaver.Node();
            root.setName(ip + count++);
            root.setImage("routerImage");
            box.add(root);
            if(k == 0){
            	var root0 = root;
            	root0.setParent(group1);
            }else{
          		var root1 = root;
          		root1.setParent(group2);
          		 var link = new twaver.Link(root0, root1);
              link.setStyle('link.width', 2);
              link.setStyle('link.color', '#00FF00');
              link.setStyle('link.pattern', [10, 5])
              box.add(link);
            }

            for (var i = 0; i < 3; i++) {
                var iNode = new twaver.Node();
                iNode.setName(ip + count++);
                iNode.setImage("routerImage");
                box.add(iNode);
                if(k == 0 && i == 0){               	
              		iNode.setParent(group1);
              		
	              	var link = createLink(root, iNode, [1,1], ["#00ff00","#ffff00","#646464"]);              
									link.setClient('scaleNumbers', 2);
									link.setStyle('link.width', 3);
									box.add(link);
									               
              	}else if(k == 0 && i == 1){									
              		iNode.setParent(group1);
              	
		              var link = createLink(root, iNode, [1,1], ["#ff0000","#00ff00","#646464"]);
									link.setClient('scaleNumbers', 1);
									link.setStyle('link.width', 3);
									box.add(link);
              	}else if(k == 0 && i == 2){
									iNode.setParent(group1);
                	var link = new twaver.Link(root, iNode);
                	link.setStyle('link.width', 3);
               		link.setStyle('link.color', '#00FF00');
                	box.add(link);
              	}else{
	              	iNode.setParent(group2);
	                var link = new twaver.Link(root, iNode);
		              link.setStyle('link.width', 3);
		              link.setStyle('link.color', '#00FF00');
		              box.add(link);
              }
              
              for (var j = 0; j < 9; j++) {
                  var jNode = new twaver.Node();
                  jNode.setName(ip + count++);    
		             	if(k == 0){          	
		            			jNode.setParent(group1);
		            	}else{
		            			jNode.setParent(group2);
		            	}
         		
                  if(k== 0 && i == 1 && j == 4){
                 		jNode.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.MAJOR);   
                	}                           
                  
                 	if(k== 1 && i == 2){
                      var oldAlarmLabel = network.getAlarmLabel;					
											var newAlarmLabel = function(element){
													return null;
											}
											setInterval(function(){
												if(self.network.getAlarmLabel == oldAlarmLabel){
													self.network.getAlarmLabel = newAlarmLabel;
													 jNode.getAlarmState().increaseNewAlarm(twaver.AlarmSeverity.CRITICAL);
												}else if(self.network.getAlarmLabel === newAlarmLabel){
													self.network.getAlarmLabel = oldAlarmLabel;
											 		jNode.getAlarmState().clear();												 		
												}
												self.network.invalidateElementUIs();
											},1000);												
              		} 
              
                  box.add(jNode);
                  link = new twaver.Link(iNode, jNode);
                  link.setStyle('link.width', 3);
                  link.setStyle('link.color', '#00FF00');
                  box.add(link);
              }
            }
        }														
				//��ʼ������˵�
				initPopupMenu();
		}
		
		function createLink(from, to, percents ,colors){
			var link = new demo.ScaleLink(from, to);
			link.setClient('fromFillPercent', percents[0]);
			link.setClient('toFillPercent', percents[1]);
			link.setStyle('link.width', 3);
			link.setStyle('link.color', colors[2]);

			link.setClient('fromFillColor',colors[0]);
			link.setClient('toFillColor',colors[1]);
			
			return link;
		}
		
		 function randomInt(n) {
	      return Math.floor(Math.random() * n);
	   }
	  
	   function randomBoolean() {
	      return randomInt(2) != 0;
	   }
    
     function randomNonClearedSeverity() {
        while (true) {
            var severity = randomSeverity();
            if (!twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
                return severity;
            }
        }
        return null;
     }
    
     function randomSeverity() {
        var severities = twaver.AlarmSeverity.severities;
        return severities.get(randomInt(severities.size()));
     }
    
		//��Ӹ澯
		function addAlarm(alarmID, elementID, alarmSeverity, alarmBox) {
            var alarm = new twaver.Alarm(alarmID, elementID, alarmSeverity);
            alarmBox.add(alarm);
        }
      
     //��ʼ��mousemove�˵�
     function initMousemovePopupMenu() {
        var lastData;
        this.popupMenu.onMenuShowing = function (e) {
            lastData = self.network.getSelectionModel().getLastData();
						return true;
        };
        this.popupMenu.onAction = function (menuItem) {
            if (menuItem.label === 'Delete') {
                box.remove(lastData);
            }
        };
        this.popupMenu.isVisible = function (menuItem) {
						if (lastData) {
					      if (lastData instanceof twaver.Group){
                    return false;
                }
                if (lastData instanceof twaver.Link) {
                    return menuItem.group === 'Modify';
                }
                if (lastData instanceof twaver.Node) {
                    return true;
                }
            } 
          	return menuItem.group === 'Element';
        };
        this.popupMenu.isEnabled = function (menuItem) {
            return true;
        };
        this.popupMenu.setMenuItems([
            { label: 'Delete', group: 'Delete' },
            { separator: true, group: 'Element' },
            { label: 'Modify', group: 'Modify' }
        ]);
    }
    
     //��ʼ����������˵�  
     function initPopupMenu() {
        var lastData, lastPoint, magnifyInteraction;
        this.popupMenu.onMenuShowing = function (e) {
            lastData = self.network.getSelectionModel().getLastData();
            lastPoint = self.network.getLogicalPoint(e);
            return true;
        };
        var self = this;
        this.popupMenu.onAction = function (menuItem) {
            if (menuItem.label === 'Remove') {
                box.remove(lastData);
            }
            if (menuItem.label === 'Add Node') {
                var node = new twaver.Node();
                node.setParent(self.network.getCurrentSubNetwork());
                node.setCenterLocation(lastPoint);
                self.box.add(node);
            }
            if (menuItem.label === 'Add Dotted Link') {
                var link = new twaver.Link();
                link.setStyle('link.pattern',[10,5]);//Link����
                self.box.add(link);
            }
             if (menuItem.label === 'Drill Down') {
            window.open("drilldown.html","","resizable=true,top=120,left=200,width=1300,height=620,scrollbars=yes");
          }
        };
        this.popupMenu.isVisible = function (menuItem) {
            if (magnifyInteraction) {
                return menuItem.group === 'Magnify';
            } else {
                if (lastData) {
                    if (lastData instanceof twaver.SubNetwork && menuItem.group === 'SubNetwork') {
                        return true;
                    }
                  	if (lastData instanceof twaver.Group){
                        return false;
                    }
                    if (lastData instanceof twaver.Link) {
                        return true;
                    }
                    if (lastData instanceof twaver.Node) {
                        return  menuItem.group === 'Idicator';
                    }
                    if (lastData instanceof twaver.Network){
                        return false;
                    }
                    return menuItem.group === 'Element';
                } 
            }
        };
        this.popupMenu.isEnabled = function (menuItem) {
            if (lastData) {
                if (lastData instanceof twaver.SubNetwork) {
                    return true;
                }
                if (lastData instanceof twaver.Group && menuItem.group === 'Group') {
                    var expanded = lastData.isExpanded();
                    return menuItem.expand ? !expanded : expanded;
                }
                if (lastData instanceof twaver.Link && menuItem.group === 'Link') {
                    var expanded = lastData.getStyle("link.bundle.expanded");
                    return menuItem.expand ? !expanded : expanded;
                }
                if (menuItem.label === 'Clear Alarm') {
                    return !lastData.getAlarmState().isEmpty();
                }
            } else {
                if (menuItem.label === 'Up SubNetwork') {
                    return self.network.getCurrentSubNetwork() != null;
                }
            }
            return true;
        };
        this.popupMenu.setMenuItems([
		        {label : "Drill Down", group: 'Element'}, // ����
		         { separator: true, group: 'Element' },
		        {label : "Idicator Info", group: 'Idicator'},// ָ����Ϣ	
           
            { separator: true, group: 'Link' },
        ]);
    }  
    //��ʼ��������
    function initTreeTable() {
        this.treeTable.setEditable(true);
        this.treeTable.getTreeColumn().setClient('pack', true);
        var headerPool = new twaver.Pool('spane');
        this.treeTable.addPool(headerPool);
        this.treeTable.getTreeColumn().renderHeader = function (div) {
            var span = headerPool.get();
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = 'Tree';
            span.setAttribute('title', span.innerHTML);
            span.style.font = 'bold 12px Helvetica';
            div.style.textAlign = 'center';
            div.appendChild(span);
        };
       createColumn(this.treeTable, 'Location', 'location', 'accessor', 'string', false).getValue = function (data) {
            if (data.getLocation) {
                var location = data.getLocation();
                return 'X:' + Math.round(location.x) + ', Y:' + Math.round(location.y);
            }
            return '';
        };
        var column = createColumn(this.treeTable, 'Width', 'width', 'accessor', 'number', true);
        column.getValue = function (data) {
            if (data.getWidth) {
                return Math.round(data.getWidth());
            }
            return '';
        };
        column.setWidth(50);
        column = createColumn(this.treeTable, 'Height', 'height', 'accessor', 'number', true);
        column.getValue = function (data) {
            if (data.getHeight) {
                return Math.round(data.getHeight());
            }
            return '';
        };
        column.setWidth(50);
        column = createColumn(this.treeTable, 'From', 'from', 'accessor', 'string', false);
        column.getValue = function (data) {
            if (data.getFromNode) {
                return data.getFromNode().getName();
            }
            return '';
        };
        column = createColumn(this.treeTable, 'To', 'to', 'accessor', 'string', false);
        column.getValue = function (data) {
            if (data.getToNode) {
                return data.getToNode().getName();
            }
            return '';
        };
        createColumn(this.treeTable, 'Parent', 'parent', 'accessor', 'string', false).setWidth(80);
        createColumn(this.treeTable, 'Alpha', 'whole.alpha', 'style', 'number', true).setWidth(50);
        createColumn(this.treeTable, 'Layer Id', 'layerId', 'accessor', 'string', false).setWidth(50);
        createColumn(this.treeTable, 'ToolTip', 'toolTip', 'accessor', 'string', true);

        this.addTab('Tree Table', new TablePane(this.treeTable), true);
    }
    
	   function addTab(name, view, selected) {
	      var tab = new twaver.Tab(name);
	      tab.setName(name);
	      tab.setView(view)
	      this.tabPane.getTabBox().add(tab);
	      if (selected) {
	          this.tabPane.getTabBox().getSelectionModel().setSelection(tab);
	      }
	   }
     //���ɱ����
     function createColumn(table, name, propertyName, propertyType, valueType, editable) {
        var column = new twaver.Column(name);
        column.setName(name);
        column.setPropertyName(propertyName);
        column.setPropertyType(propertyType);
        if (valueType) column.setValueType(valueType);
        column.setEditable(editable);
        column.renderHeader = function (div) {
            var span = document.createElement('span');
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.padding = '1px 2px 1px 2px';
            span.innerHTML = column.getName() ? column.getName() : column.getPropertyName();
            span.setAttribute('title', span.innerHTML);
            span.style.font = 'bold 12px Helvetica';
            div.style.textAlign = 'center';
            div.appendChild(span);
        };
        table.getColumnBox().add(column);
        return column;
    }
    
    function getAngle (p1, p2) {
			if (p1.x === p2.x) {
				if (p2.y === p1.y) {
					return 0;
				} else if (p2.y > p1.y) {
					return Math.PI/2;
				} else {
					return -Math.PI/2;
				}
			}
			return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
		}
 

// �Զ���Link���캯��
demo.ScaleLink = function(id, from, to) {
    // ���û��๹�캯��
    demo.ScaleLink.superClass.constructor.call(this, id, from, to);
    // ������·���Ϊ3������
    this.setStyle('link.width', 3);
    //this.setStyle('link.color', 'rgba(0, 0, 0, 0)');
    // ����Link����Ϊƽ��
    this.setStyle('link.type', 'parallel');
    // ������·����ļ��Ϊ40
    this.setStyle('link.bundle.offset', 10);
    // ���ÿ̶���ɫ
    this.setClient('scaleColor', 'black');
    // ���ÿ̶ȿ��
    this.setClient('scaleWidth', 1);
    // ���ÿ̶ȸ���
    this.setClient('scaleNumbers', 4);
    // �����Ƿ���
    this.setClient('shortened', false);
    // ���ñ�̺�ĳ���
    this.setClient('shortenLength', 100);
    // ���÷ָ�����ɫ
    this.setClient('splitterColor', 'black');
    // ������ʼ���ٷֱ�
    this.setClient('fromFillPercent', 0);
    // ���ý������ٷֱ�
    this.setClient('toFillPercent', 0);
};
// �����Զ���Link�̳�twaver.Link
twaver.Util.ext('demo.ScaleLink', twaver.Link, {
    // ���ػ�ȡUI�෽���������Զ���UI��
  getCanvasUIClass : function () {
    return demo.ScaleLinkUI;
  },
  // ��ȡ��ʼ�����ɫ
  getFromFillColor: function () {
    return this.getClient("fromFillColor");
  },
  // ��ȡ���������ɫ
  getToFillColor: function () {
    return this.getClient("toFillColor");
  },
  // ��ȡ��ʼ�ٷֱ�
  getFromFillPercent: function () {
      // �������·���������������������·�����ٷֱ�����ֵ
    if (this.isBundleAgent()) {
      var fromAgent = this.getFromAgent(),
        percentKey, maxPercent = 0, percent;
      this.getBundleLinks().forEachSiblingLink(function (link) {
        percentKey = fromAgent === link.getFromAgent() ? 'fromFillPercent' : 'toFillPercent';
        percent = link.getClient(percentKey);
        maxPercent = percent > maxPercent ? percent : maxPercent;
      });
      return maxPercent;
    } else {
      return this.getClient('fromFillPercent');
    }
  },
  // ��ȡ�����ٷֱ�
  getToFillPercent: function () {
      // �������·���������������������·�����ٷֱ�����ֵ
    if (this.isBundleAgent()) {
      var toAgent = this.getToAgent(),
        percentKey, maxPercent = 0, percent;
      this.getBundleLinks().forEachSiblingLink(function (link) {
        percentKey = toAgent === link.getToAgent() ? 'toFillPercent' : 'fromFillPercent';
        percent = link.getClient(percentKey);
        maxPercent = percent > maxPercent ? percent : maxPercent;
      });
      return maxPercent;
    } else {
      return this.getClient('toFillPercent');
    }
  },
  // ���ػ�ȡ��Ԫ���Ʒ������ж��������·��������ͷ�����ʼ�ͽ�������ڵ������
  getName: function () {
      if (this.getClient('shortened')) {
          return null;
      } else if (this.isBundleAgent()) {
      return this.getFromAgent().getName() + '-' + this.getToAgent().getName();
    } else {
      return demo.ScaleLink.superClass.getName.call(this);
    }
  }
});

// �Զ���LinkUI���캯��
demo.ScaleLinkUI = function(network, element){
    // ���û��๹�캯��
    demo.ScaleLinkUI.superClass.constructor.call(this, network, element);
};
// �����Զ���Link�̳�twaver.canvas.LinkUI
twaver.Util.ext('demo.ScaleLinkUI', twaver.canvas.LinkUI, {
  // ��ȡLink�Ƕ�
  getAngle: function () {
    return getAngle(this.getFromPoint(), this.getToPoint());
  },
  // ��ȡLink�м��
  getMiddlePoint: function (from, to, percent) {
    return {
        x: from.x + (to.x - from.x) * percent,
        y: from.y + (to.y - from.y) * percent
      };
  },
  // ���̶���
  drawScaleLine: function (from, to, angle, length, ctx, percent, lineWidth, lineColor) {
      var point = this.getMiddlePoint(from, to, percent);
      var y = length/2 * Math.sin(angle),
        x = length/2 * Math.cos(angle);
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(point.x + x, point.y + y);
      ctx.lineTo(point.x - x, point.y -y);
      ctx.stroke();
  },
  // ���ػ���·���������Զ����߼�����·
  paintBody: function (ctx) {
        var points = this.getLinkPoints(),
        link = this.getElement();
        if (!points || points.size() < 2) {
            return;
        }        
        var lineLength = this.getLineLength(),
        from = points.get(0),
        to = points.get(1),
        angle = this.getAngle() + Math.PI/2;

        this._paintBody(ctx, points, angle);
      
    		// ����ʼ��ͷ
    		if (link.getClient('arrow.from')) {
        		twaver.Util.drawArrow(ctx, 12, 9, points, true, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
        }
      	// ��������ͷ
        if (link.getClient('arrow.to')) {
        		twaver.Util.drawArrow(ctx, 12, 9, points, false, 'arrow.standard', true, 'gray', 0, 0, 1, 'black');
        }
  },
  _paintBody: function (ctx, points, angle) {
        var link = this.getElement(),
        width = link.getStyle('link.width'),
        grow = width,
        outerColor = this.getOuterColor();
        if (outerColor) {
            var outerWidth = link.getStyle('outer.width');
            grow += outerWidth * 2;
        }
        var selectBorder = !this.getEditAttachment() && this.getNetwork().isSelected(link);
        if (selectBorder) {
            var selectWidth = link.getStyle('select.width');
            grow += selectWidth * 2;
        }
        ctx.lineCap = link.getStyle('link.cap');
        ctx.lineJoin = link.getStyle('link.join');

        var fromFillPercent = link.getFromFillPercent();
        var toFillPercent = link.getToFillPercent();
        var fromFillColor = link.getFromFillColor();
        var toFillColor = link.getToFillColor();
        var from = points.get(0);
        var to = points.get(1);
        var fromEnd = {
          x: from.x + (to.x - from.x) / 2 * fromFillPercent, 
          y: from.y + (to.y - from.y) / 2 * fromFillPercent
        };
        var fromPoints = new twaver.List([from, fromEnd]);
        var toEnd = {
          x: to.x + (from.x - to.x) / 2 * toFillPercent,
          y: to.y + (from.y - to.y) / 2 * toFillPercent
        }
        var toPoints = new twaver.List([to, toEnd]);
        var middlePoints = new twaver.List([fromEnd, toEnd]);

        // ��ѡ�б߿�
        if (selectBorder) {
            var position = this._element.getClient("position");
            if(position){
              if(position === "from"){
                this.drawLinePoints(ctx, fromPoints, grow, link.getStyle('select.color'));
              }else if(position === "to"){
                this.drawLinePoints(ctx, toPoints, grow, link.getStyle('select.color'));
              }else{
                this.drawLinePoints(ctx, middlePoints, grow, link.getStyle('select.color'));
              }
            }
        }
        // ���߿�
        if (outerColor) {
            this.drawLinePoints(ctx, points, width + outerWidth * 2, outerColor);
        }

        // ����ʼ���ɫ
        this.drawLinePoints(ctx, fromPoints, width, fromFillColor);
        // ���������ɫ
        this.drawLinePoints(ctx, toPoints, width, toFillColor);
        // ���м����ɫ
        this.drawLinePoints(ctx, middlePoints, width, this.getInnerColor() || link.getStyle('link.color'));
      
	      from = points.get(0);
	      to = points.get(1);
	      var scaleWidth = link.getClient('scaleWidth'),
	      scaleColor = link.getClient('scaleColor');
	      // ���̶�
	      for (var i = 1, n = link.getClient('scaleNumbers') * 2; i < n; i++) {
	        this.drawScaleLine(from, to, angle, width/2, ctx, i/n, scaleWidth, scaleColor);
	      }
	      // ���ָ���
	      this.drawScaleLine(from, to, angle, width, ctx, 0.5, 3, link.getClient('splitterColor'));
  },
  hitCanvasRectAtScaleLine: function(x, y){      
        var points = this.getLinkPoints();
        if (!points || points.size() < 2){
            return;
        }
        var from = points.get(0);
        var to = points.get(1);
        var fromEnd = {
          x: from.x + (to.x - from.x) / 2 , 
          y: from.y + (to.y - from.y) / 2 
        };
     		var fromMin = Math.min.apply(null, [from.x,fromEnd.x]);
     		var fromMax = Math.max.apply(null, [from.x,fromEnd.x]);
     		
        var toEnd = {
          x: to.x + (from.x - to.x) / 2 ,
          y: to.y + (from.y - to.y) / 2
        }       
        var toMin = Math.min.apply(null, [to.x,toEnd.x]);
     		var toMax = Math.max.apply(null, [to.x,toEnd.x]);

        if(x <= fromMax && x >= fromMin){
          return "from";       
        }else if(x <= toMax && x >= toMin){
          return "to";
        }else{
          return null;
        }                  	 
  }
});
			
//�Զ���TreeTable				
demo.AutoPackTreeTable = function (dataBox) {
    demo.AutoPackTreeTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('demo.AutoPackTreeTable', twaver.controls.TreeTable, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        demo.AutoPackTreeTable.superClass.adjustBounds.call(this, rect);
        this.packColumns(rect.width);
    },
    packColumns: function (width) {
        var packCoumns = new twaver.List(),
				packWidth;
        this.getColumnBox().getRoots().forEach(function (column) {
            if (column.getClient('pack')) {
                packCoumns.add(column);
            } else {
                width -= column.getWidth();
            }
        });
        if (packCoumns.size() === 0) {
            return;
        }
        packWidth = width / packCoumns.size();
        if (packWidth < this._minPackWidth) {
            packWidth = this._minPackWidth;
        }
        packCoumns.forEach(function (column) {
            column.setWidth(packWidth);
        });
    }
});

