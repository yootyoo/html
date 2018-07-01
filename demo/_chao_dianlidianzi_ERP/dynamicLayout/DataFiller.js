var DataFiller= {
  nodeMap: {},
  box:null,
  fillData:function(nodeObj, linkArr, box){
    this.box = box;
    this.createMap(nodeObj,0);
    this.calculateGroupSize(nodeObj);
    var sizeTree = this.nodeMap["DM0"].groupSize;
    this.setNode(nodeObj,sizeTree);
    var offsetList = this.calculateOffset(linkArr);
    this.setLink(linkArr, offsetList);
  },

  createMap: function(obj,level){
    if(!obj.id){
      obj.id = "DM0";
    }
    this.nodeMap[obj.id] = {};
    this.nodeMap[obj.id].level = level;
    var i;
    if(obj.groups){
      for(i=0;i<obj.groups.length;i++){
        this.createMap(obj.groups[i],level+1);
      }
    }
  },

  calculateGroupSize: function(obj){
    if(!obj.x) obj.x = 1;
    if(!obj.y) obj.y = 1;
    if(!obj.groups){
      var rObj = {
        children:[],
        size:{width:130, height: 28},
        groupColumnSizes: [],
        id:obj.id
      };
      this.nodeMap[obj.id].groupSize= rObj;
      return rObj;
    }else{
      var i,j;
      var children = [];
      var returnObj = {
        children: children  
      };
      var maxxRel = 0;
      var maxyRel = 0;
      for(i=0;i<obj.groups.length;i++){
        if(obj.groups[i].x -1 > maxxRel){
          maxxRel = obj.groups[i].x -1;
        }
      }
      for(i=0;i<maxxRel+1;i++){
        children.push([]);
      }
      for(i=0;i<obj.groups.length;i++){
        var returnChildObj = this.calculateGroupSize(obj.groups[i]);
        var columnIndex = obj.groups[i].x -1;
        var rowIndex = obj.groups[i].y -1;
        children[columnIndex][rowIndex] = returnChildObj;
      }
      var groupColumnSizes = [];
      var columnHeight = 0;
      var columnWidth = 0;
      for(i=0;i<children.length;i++){
        columnHeight = 0;
        columnWidth = 0;
        for(j=0;j<children[i].length;j++){
          if(children[i][j].size.width > columnWidth){
            columnWidth = children[i][j].size.width;
          }
          columnHeight = columnHeight + children[i][j].size.height;
          if(j !== children[i].length -1){
            columnHeight = columnHeight +22;
          }
        }

        groupColumnSizes.push({width:columnWidth, height:columnHeight});
      }
      var withoutPaddingTableHeight =0;
      var withoutPaddingTableWidth =0;
      for(i=0;i<groupColumnSizes.length;i++){
        if(groupColumnSizes[i].height > withoutPaddingTableHeight){
          withoutPaddingTableHeight = groupColumnSizes[i].height;
        }
        withoutPaddingTableWidth = withoutPaddingTableWidth + groupColumnSizes[i].width;
        if(i !== groupColumnSizes.length -1 ){
          withoutPaddingTableWidth = withoutPaddingTableWidth + 40;
        }
      }
      returnObj.size = {width:withoutPaddingTableWidth +25 ,height :withoutPaddingTableHeight+ 50};
      returnObj.groupColumnSizes = groupColumnSizes;

      if(!obj.id){
        obj.id = "DM0";
      }
      returnObj.id = obj.id;
      this.nodeMap[obj.id].groupSize= returnObj;
      return returnObj;
    }
  },

  setNode: function(obj,sizeTree){
    var i;
    for(i=0;i<obj.groups.length;i++){
      var childObj = obj.groups[i];
      var j;
      var x,y;
      if(childObj.parentId !== "DM0"){
        x = this.nodeMap[childObj.parentId].node.getClient('x') + 20;
        y = this.nodeMap[childObj.parentId].node.getClient('y') + 42;

      }else{
        x = xStart;
        y = yStart;
      }
      for(j=0;j<childObj.x-1;j++){
        x = x + sizeTree.groupColumnSizes[j].width +40;
      }
      for(j=0;j<childObj.y-1;j++){
        y = y + sizeTree.children[childObj.x-1][j].size.height +22;
      }
      var xOrigin = childObj.x - 1;
      var yOrigin = childObj.y - 1;
      var node = this.createNode(x, y, xOrigin, yOrigin ,childObj.name, 'icon_apple', childObj.parentId);

      this.nodeMap[childObj.id].node = node;

      if(childObj.groups){
        var childSizeTree = sizeTree.children[childObj.x-1][childObj.y-1];
        this.setNode(childObj,childSizeTree);
      }
    }
  },

  createNode: function(x, y, xOrigin, yOrigin, name, icon, parentId){
    var node = new MyGroup();     
    node.setClient('width', 130);
    node.setClient('x', x);
    node.setClient('y', y);
    node.setClient('xOrigin',xOrigin);
    node.setClient('yOrigin',yOrigin);
    this.box.add(node);    

    if(x && y){
      node.setLocation(x, y);
    }
    if(name){
      node.setName(name);
    }
    if(icon){
      node.setClient('icon', icon);
    }
    node.setClient("parentId",parentId);
    if(parentId !=="DM0"){
      var parent = this.nodeMap[parentId].node;
      node.setParent(parent);
      parent.setExpanded(true);
    }

    return node;
  },

  calculateOffset: function(links){
    var originOffsetList = [];
    var offsetList = [];
    var i;
    var j;
    var k;
    var adjacencyMatrixMap ={}; 
    for(i=0;i< links.length;i++){
      var brothers = this.findBrothersOfSameParent(links[i][0],links[i][1]);
      var fromXOrigin =  this.nodeMap[brothers[0]].node.getClient("xOrigin");
      var toXOrigin =  this.nodeMap[brothers[1]].node.getClient("xOrigin");
      // var xOriginKey = fromXOrigin + "-" +toXOrigin;
      var parentId = this.nodeMap[brothers[0]].node.getClient("parentId");
      var offset = -1;
      if(!adjacencyMatrixMap[parentId]){
        adjacencyMatrixMap[parentId] = [];
        var adjacencyMatrixLength = this.nodeMap[parentId].groupSize.groupColumnSizes.length;
        for(j=0;j<adjacencyMatrixLength;j++){
          var adjacencyMatrixRow = [];
          for(k=0;k<adjacencyMatrixLength;k++){
            adjacencyMatrixRow.push({linkIndexes:[], limitColumnOffset: -1});
          }
          adjacencyMatrixMap[parentId].push(adjacencyMatrixRow);
        }
      }
      // if(!adjacencyListMap[parentId][xOriginKey]){
      //   adjacencyListMap[parentId][xOriginKey] = [];
      // }
      if(toXOrigin - fromXOrigin > 1){
        var maxGroupColumnSize = -1;
        var maxSizeColumn = -1;
        for(j=fromXOrigin+1;j<toXOrigin;j++){
          var groupColumnSize = this.nodeMap[parentId].groupSize.groupColumnSizes[j].height;
          if(groupColumnSize > maxGroupColumnSize){
            maxGroupColumnSize = groupColumnSize;
            maxSizeColumn = j;
          }
        }
        var maxSizeColumnLength = this.nodeMap[parentId].groupSize.children[maxSizeColumn].length;
        var lastGroupHeight = this.nodeMap[parentId].groupSize.children[maxSizeColumn][maxSizeColumnLength-1].size.height;
        var lastGroupId = this.nodeMap[parentId].groupSize.children[maxSizeColumn][maxSizeColumnLength-1].id;
        offset = this.nodeMap[lastGroupId].node.getClient("y") + lastGroupHeight;
        adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].linkIndexes.push(i);
        adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].limitColumnOffset = offset;  
        // offset = offset + adjacencyListMap[parentId][xOriginKey]*10;
        // offsetList.push({offset:offset, pattern: null});
      }else if(toXOrigin - fromXOrigin === 1){
        if((brothers[0] === links[i][0] || this.isLastXOrigin(links[i][0], brothers[0])) && (brothers[1] === links[i][1] || this.isFirstXOrigin(links[i][1], brothers[1]))){
        }else{
          var fromOffset = this.nodeMap[brothers[0]].node.getClient("y") + this.nodeMap[brothers[0]].groupSize.size.height;
          var toOffset = this.nodeMap[brothers[1]].node.getClient("y") + this.nodeMap[brothers[1]].groupSize.size.height;
          var maxSizeColumn = -1;
          var fromColumnSize = this.nodeMap[parentId].groupSize.groupColumnSizes[fromXOrigin].height;
          var toColumnSize = this.nodeMap[parentId].groupSize.groupColumnSizes[toXOrigin].height;
          if(fromColumnSize > toColumnSize){
            maxSizeColumn = fromXOrigin;
          }else{
            maxSizeColumn = toXOrigin;
          }
          var maxSizeColumnLength = this.nodeMap[parentId].groupSize.children[maxSizeColumn].length;
          var lastGroupHeight = this.nodeMap[parentId].groupSize.children[maxSizeColumn][maxSizeColumnLength-1].size.height;
          var lastGroupId = this.nodeMap[parentId].groupSize.children[maxSizeColumn][maxSizeColumnLength-1].id;
          offset = this.nodeMap[lastGroupId].node.getClient("y") + lastGroupHeight;
          adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].linkIndexes.push(i);
          adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].limitColumnOffset = offset;
          // offset = offset + adjacencyListMap[parentId][xOriginKey]*10;
          // offsetList.push({offset:offset, pattern: null});
        }
      }else if(toXOrigin - fromXOrigin < 0){
        offset = 60;
        adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].linkIndexes.push(i);
        adjacencyMatrixMap[parentId][fromXOrigin][toXOrigin].limitColumnOffset = offset;
        // offset = offset - adjacencyListMap[parentId][xOriginKey]*10;
        // offsetList.push({offset:offset, pattern: [5,2]});
      }else{
        // offsetList.push({offset:offset, pattern: null});
      }
      originOffsetList.push({offset:offset, brothers:brothers});
      
    }
    return offsetList;
  },

  updateOffsetList:function(originOffsetList, links, adjacencyMatrixMap){
    var i;
    var k;
    var offsetList = [];
    for(var parentId in adjacencyMatrixMap){
      var adjacencyMatrix = adjacencyMatrixMap[parentId];
      for(i=0;i<adjacencyMatrix.length-1;i++){
        var linkIndexes = adjacencyMatrix[i][i+1].linkIndexes;
        for(k=0;k<linkIndexes.length;k++){
          var linkIndex =linkIndexes[k];
          // originOffsetList[linkIndex] = originOffsetList[linkIndex] + 10;
          // offsetList[linkIndex] = {offset:originOffsetList[linkIndex] + (k+1) * 10, pattern: null};
          // originOffsetList[linkIndex]
          // links[linkIndex]
        }
      }
    }
  },

  isFirstXOrigin: function(childId, grandParentId){
    var curId = childId;
    while(true){
      if(this.nodeMap[curId].node.getClient("xOrigin") !== 0){
        return false;
      }else{
        curId = this.nodeMap[curId].node.getClient("parentId");
        if(curId === grandParentId){
          return true;
        }
      }
    }
  },

  isLastXOrigin: function(childId, grandParentId){
    var curId = childId;
    while(true){
      var parentId = this.nodeMap[curId].node.getClient("parentId");
      if(this.nodeMap[curId].node.getClient("xOrigin") !== this.nodeMap[parentId].groupSize.groupColumnSizes.length -1){
        return false;
      }else{
        curId = this.nodeMap[curId].node.getClient("parentId");
        if(curId === grandParentId){
          return true;
        }
      }
    }
  },

  findBrothersOfSameParent: function(fromId,toId){
    var expectedId;
    var preId;
    var returnId;
    if(this.nodeMap[fromId].level > this.nodeMap[toId].level){
      preId = toId;
      expectedId = this.nodeMap[toId].node.getClient("parentId");
      while(true){
        returnId = this.isParent(fromId, expectedId);
        if(returnId){
          return [returnId, preId];
        }else{
          if(this.nodeMap[expectedId].node){
            preId = expectedId;
            expectedId = this.nodeMap[expectedId].node.getClient("parentId");
          }else{
            return null;
          }
        }
      }
    }else{
      preId = fromId;
      expectedId = this.nodeMap[fromId].node.getClient("parentId");
      while(true){
        returnId = this.isParent(toId, expectedId);
        if(returnId){
          return [preId, returnId];
        }else{
          if(this.nodeMap[expectedId].node){
            preId = expectedId;
            expectedId = this.nodeMap[expectedId].node.getClient("parentId");
          }else{
            return null;
          }
        }
      }
    }
  },

  isParent: function(childId, expectedId){
    var curId = childId;
    var preId;
    while(true){
      if(this.nodeMap[curId].node){
        preId = curId;
        curId = this.nodeMap[curId].node.getClient("parentId");
        if(curId === expectedId){
          return preId;
        }
      }else{
        return null;
      }
    }
  },

  highlightLink: function(link, highlighted){
    if(highlighted){
      link.setStyle('link.color', highlightedLinkColor);
      link.setStyle('link.width', 1);
      link.setStyle('arrow.to.color', highlightedLinkColor);
    }else{
      link.setStyle('link.color','#309FC9');
      link.setStyle('link.width', 0.5);
      link.setStyle('arrow.to.color', '#309FC9');
    }
  },

  setLink: function(arr, offsetList){
    var i;
    for(i=0;i<arr.length;i++){
      if(offsetList[i].offset !== -1){
        this.createLink(box, this.nodeMap[arr[i][0]].node, this.nodeMap[arr[i][1]].node, offsetList[i].offset, offsetList[i].pattern);
      }else{
        this.createLink(box, this.nodeMap[arr[i][0]].node, this.nodeMap[arr[i][1]].node, null, offsetList[i].pattern);
      }
      
    }
  },

  
  createLink: function(box, from, to, offset, pattern){
    var link = new twaver.Link(from, to); 
    if(offset){
      link.setClient('offset', offset);
    }
    link.setStyle('link.type', 'orthogonal.horizontal');
    link.setStyle('arrow.to', true);    
    link.setStyle('arrow.to.height', 6);
    link.setStyle('arrow.to.width', 8);
    link.setStyle('arrow.to.xoffset', -3);
    if(pattern){
      link.setStyle('link.pattern', pattern);
    }
    link.setLayerId('link');
    this.highlightLink(link, false);
    this.box.add(link);
  }

};