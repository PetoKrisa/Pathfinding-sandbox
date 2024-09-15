import { Path } from "./path.js"
import { Node } from "./node.js"
class Main{
    canvas;
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId).getContext("2d")
    }
    
    nodesList = []
    pathsList = []
    nodesId = 0;
    pathsId = 0;

    highlightedNode;
    highlightedPath;

    update(){
        for(let i = 0; i < this.pathsList.length; i++){
            this.pathsList[i].update()
        }
        for(let i = 0; i < this.nodesList.length; i++){
            this.nodesList[i].update()
        }
        this.draw()
    }

    draw(){
        this.canvas.clearRect(0,0,2000,2000)
        for(let i = 0; i < this.pathsList.length; i++){
            this.pathsList[i].draw()
        }
        for(let i = 0; i < this.nodesList.length; i++){
            this.nodesList[i].draw()
        }
        
    }

    addNode(x,y){
        if(x=="") {x=0}
        if(y=="") {y=0}
        if(x!=undefined && y!=undefined){
            this.nodesList.push(new Node(this, this.nodesId, x,y))
        this.nodesId++;
        this.update();
        } else{
            throw TypeError("X and Y cannot be undefined")
        }
        
    }

    getNode(id){
        try{
        let node
        for(let i = 0; i < this.nodesList.length; i++){
            if(this.nodesList[i].id == id){
                node = this.nodesList[i]
                return node;
            }
        }
        return null;
        }
        catch(err){
            alert(err)
        }
    }

    addPath(node1Id, node2Id){
        try{
        let node1 = this.getNode(node1Id)
        let node2 = this.getNode(node2Id)
        if(node1!=null && node2!=null){
            this.pathsList.push(new Path(this,this.pathsId,node1,node2))
            this.pathsId++;
            this.update()
        } else{
            throw new ReferenceError("Node1 or Node2 does not exist")
        }
        
        } catch(err){
            alert(err)
        }
    }

    getPath(id){
        try{
        let path
        for(let i = 0; i < this.pathsList.length; i++){
            if(this.pathsList[i].id == id){
                path = this.pathsList[i]
                return path;
            }
        }
        return null;
        }
        catch(err){
            alert(err)
        }
    }

    generateNodeList(){
        let nodeListHtml = ""
        for(let i = 0; i<this.nodesList.length; i++){
            let node = this.nodesList[i]
            nodeListHtml+= `<p data-id="${node.id}" class="list-item node-list-item" onclick="this.focus()" tabindex="1">${node.id} (${node.x};${node.y})</p>`
        }
        return nodeListHtml
    }

    generatePathList(){
        let pathListHtml = ""
        for(let i = 0; i<this.pathsList.length; i++){
            let path = this.pathsList[i]
            pathListHtml+= `<p data-id="${path.id}" class="list-item path-list-item" onclick="this.focus()" tabindex="1">${path.id} (${path.node1.id}-${path.node2.id})</p>`
        }
        return pathListHtml
    }

    highlightNode(id){
        for(let i = 0; i < this.nodesList.length; i++){
            if(this.nodesList[i].id == id){
                this.nodesList[i].isHighlighted = true
                this.update()
                break
            }
        }
    }

    highlightPath(id){
        for(let i = 0; i < this.pathsList.length; i++){
            if(this.pathsList[i].id == id){
                this.pathsList[i].isHighlighted = true
                this.update()
                break
            }
        }
    }
    
} 





const main = new Main("canvas")
//controls

document.addEventListener("focusin", function(e){
    const target = e.target.closest(".node-list-item");
    if(target){
        main.highlightNode(target.dataset.id)
        main.highlightedNode = main.getNode(target.dataset.id)

    }
  });
document.addEventListener("focusout", function(e){
    const target = e.target.closest(".node-list-item");
    if(target){
        main.update()
        main.highlightedNode = null;
    }
  });

  document.addEventListener("focusin", function(e){
    const target = e.target.closest(".path-list-item");
    if(target){
        main.highlightPath(target.dataset.id)
        main.highlightedPath = main.getPath(target.dataset.id)

    }
  });
document.addEventListener("focusout", function(e){
    const target = e.target.closest(".path-list-item");
    if(target){
        main.update()
        main.highlightedPath = null;
    }
  });


btnAddNode.addEventListener('click', ()=>{
    main.addNode(inputNodeX.value, inputNodeY.value)
    document.getElementById("nodeList").innerHTML = main.generateNodeList()

})
btnAddPath.addEventListener('click', ()=>{
    main.addPath(inputPathNode1.value, inputPathNode2.value)
    document.getElementById("pathList").innerHTML = main.generatePathList()

})