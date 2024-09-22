import { Path } from "./path.js"
import { Node } from "./node.js"
import { SaveLoad } from "./SaveLoad.js";
export class Main{
    canvas;
    saveLoad;
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId).getContext("2d")
        this.saveLoad = new SaveLoad(this)
    }
    
    nodesList = []
    pathsList = []
    nodesId = 0;
    pathsId = 0;

    highlightedNode;
    highlightedPath;

    draggedNode = null;

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

    drawGrid(){
        for(let i = 0; i < 20; i++){
            if(i==10){
                continue
            }
            this.canvas.strokeStyle = "gray"
            this.canvas.lineWidth = 1

            this.canvas.beginPath()
            this.canvas.moveTo(i*100, 0)
            this.canvas.lineTo(i*100, 2000)
            this.canvas.stroke()
        }
        for(let i = 0; i < 20; i++){
            this.canvas.strokeStyle = "gray"
            if(i==10){
                continue
            }
            this.canvas.lineWidth = 1

            this.canvas.beginPath()
            this.canvas.moveTo(0, i*100)
            this.canvas.lineTo(2000, i*100)
            this.canvas.stroke()
        }
        this.canvas.lineWidth = 2

        this.canvas.strokeStyle = "lightgreen"
        this.canvas.beginPath()
        this.canvas.moveTo(1000, 0)
        this.canvas.lineTo(1000, 2000)
        this.canvas.stroke()
        
        this.canvas.strokeStyle = "lightcoral"
        this.canvas.beginPath()
        this.canvas.moveTo(0, 1000)
        this.canvas.lineTo(2000, 1000)
        this.canvas.stroke()

    }

    getDistanceFromNode(x,y,node){
        return Math.sqrt((Math.pow((x-node.x),2)+Math.pow((y-node.y),2)))
    }

    findClosestNode(x,y){
        let lowestDistanceNode = this.nodesList[0]
        let lowestDistance = null
        for(let i = 0; i < this.nodesList.length; i++){
            let currentNode = this.nodesList[i]
            let distance = this.getDistanceFromNode(x,y,this.nodesList[i])
            if(lowestDistance==null){
                lowestDistanceNode = this.nodesList[i]
                lowestDistance = distance
            } else if(lowestDistance>distance){
                lowestDistanceNode = this.nodesList[i]
                lowestDistance = distance
            }
        }
        return lowestDistanceNode
    }

    addNode(x,y){
        if(x=="") {x=0}
        if(y=="") {y=0}
        if(x!=undefined && y!=undefined){
            this.nodesList.push(new Node(this, this.nodesId, x,y))
        this.nodesId++;
        } else{
            throw TypeError("X and Y cannot be undefined")
        }
        this.generateNodeList("nodeList")
        this.update();        
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

    updateNode(id, x, y){
        try{
            for(let i = 0; i < this.nodesList.length; i++){
                if(this.nodesList[i].id == id){
                    this.nodesList[i].x = x;
                    this.nodesList[i].y = y;

                    break
                }
            }
            this.update()
        }
        catch(err){
            alert(err)
        }
    }

    deleteNode(id){
        try{
            for(let i = 0; i < this.nodesList.length; i++){
                if(this.nodesList[i].id == id){
                    this.nodesList.splice(i,1)
                    this.highlightedNode = null;
                    break
                }
            }
            if(this.nodesList.length==0){
                this.highlightedNode = null;
            }
            this.update()
        }
        catch(err){
            alert(err)
        }
    }



    addPath(node1Id, node2Id){
        try{
        let node1 = this.getNode(node1Id)
        let node2 = this.getNode(node2Id)
        if(node1==null || node2 == null){
            throw new ReferenceError("Node1 or Node2 does not exist")
        }
        else if(node1==node2){
            throw new TypeError("Node1 and Node2 can not be the same")
        }
        
        else{
            let pathToPush = new Path(this,this.pathsId,node1,node2)
            if(node1.isPathExist(pathToPush) || node2.isPathExist(pathToPush)){
                throw new ReferenceError("Path already exists")
            } 


            this.pathsList.push(pathToPush)
            this.pathsId++;
            node1.addPathToList(pathToPush)
            node2.addPathToList(pathToPush)
            this.update()
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

    updatePath(id, n1, n2){
        try{
            for(let i = 0; i < this.pathsList.length; i++){
                if(this.pathsList[i].id == id){
                    if(this.getNode(n1) == null || this.getNode(n2) == null){
                        
                        break
                    }
                    
                    let currentPath = this.pathsList[i]

                    currentPath.node1.deletePathFromList(currentPath)
                    currentPath.node2.deletePathFromList(currentPath)


                    let newNode1 = this.getNode(n1);
                    let newNode2 = this.getNode(n2);
                    newNode1.addPathToList(currentPath)
                    newNode2.addPathToList(currentPath)

                    this.pathsList[i].node1 = newNode1
                    this.pathsList[i].node2 = newNode2

                    break
                }
            }
            this.update()
        }
        catch(err){
            alert(err)
        }
    }

    deletePath(id){
        try{
            for(let i = 0; i < this.pathsList.length; i++){
                if(this.pathsList[i].id == id){
                    let currentPath = this.pathsList[i]

                    currentPath.node1.deletePathFromList(currentPath)
                    currentPath.node2.deletePathFromList(currentPath)


                    this.pathsList.splice(i,1)
                    this.highlightedPath = null;
                    break
                }
            }
            if(this.pathsList.length==0){
                this.highlightedPath = null;
            }
            this.update()
        }
        catch(err){
            alert(err)
        }
    }

    generateNodeList(elementId){
        let nodeListHtml = ""
        for(let i = 0; i<this.nodesList.length; i++){
            let node = this.nodesList[i]
            nodeListHtml+= `<p data-id="${node.id}" class="list-item node-list-item" onclick="this.focus()" tabindex="1">${node.id} (${node.x};${node.y}) - ${node.paths.length} deg</p>`
        }
        document.getElementById(elementId).innerHTML = nodeListHtml
    }

    generatePathList(elementId){
        let pathListHtml = ""
        for(let i = 0; i<this.pathsList.length; i++){
            let path = this.pathsList[i]
            pathListHtml+= `<p data-id="${path.id}" class="list-item path-list-item" onclick="this.focus()" tabindex="1">${path.id} (${path.node1.id}-${path.node2.id})</p>`
        }
        document.getElementById(elementId).innerHTML = pathListHtml
    }

    highlightNode(id){
        for(let i = 0; i < this.nodesList.length; i++){
            if(this.nodesList[i].id == id){
                this.nodesList[i].isHighlighted = true
                break
            }
        }
    }

    highlightPath(id){
        for(let i = 0; i < this.pathsList.length; i++){
            if(this.pathsList[i].id == id){
                this.pathsList[i].isHighlighted = true
                break
            }
        }
    }
    
} 





const main = new Main("canvas")


function UpdateEditNodeInputs(){
    if(main.highlightedNode == null){
        btnDeleteNode.disabled = true;
        inputNodeX2.disabled = true;
        inputNodeY2.disabled = true;
        labelEditNodeId.disabled = true;
        labelEditNodeId.value = "";
        inputNodeX2.value = "";
        inputNodeY2.value = "";
    } else{
        btnDeleteNode.disabled = false;
        inputNodeX2.disabled = false;
        inputNodeY2.disabled = false;
        labelEditNodeId.disabled = false;
        labelEditNodeId.value = main.highlightedNode.id;
        inputNodeX2.value = main.highlightedNode.x;
        inputNodeY2.value = main.highlightedNode.y;
    }
}

function UpdateEditPathInputs(){
    if(main.highlightedPath == null){
        btnDeletePath.disabled = true;
        inputPathNode12.disabled = true;
        inputPathNode22.disabled = true;
        labelEditPathId.disabled = true;
        labelEditPathId.value = "";
        inputPathNode12.value = "";
        inputPathNode22.value = "";
    } else{
        btnDeletePath.disabled = false;
        inputPathNode12.disabled = false;
        inputPathNode22.disabled = false;
        labelEditPathId.disabled = false;
        labelEditPathId.value = main.highlightedPath.id;
        inputPathNode12.value = main.highlightedPath.node1.id;
        inputPathNode22.value = main.highlightedPath.node2.id;
    }
}
//controls and event listeners to make the buttons do something

//highlighting and CRUD operations


//highlight nodes, and node list items
document.addEventListener("focusin", function(e){
    const target = e.target.closest(".node-list-item");
    if(target){
        main.highlightNode(target.dataset.id)
        main.update()

        main.highlightedNode = main.getNode(target.dataset.id)

        target.classList.add("focus")
        UpdateEditNodeInputs()
        

    }
    });
document.addEventListener("focusout", function(e){
    const target = e.target.closest(".node-list-item");
    if(target){
        main.update()
        target.classList.remove("focus")
    }
    });





//highlight paths, and path list items
document.addEventListener("focusin", function(e){
    const target = e.target.closest(".path-list-item");
    if(target){
        main.highlightPath(target.dataset.id)
        main.update()

        main.highlightedPath = main.getPath(target.dataset.id)
        
        target.classList.add("focus")
        UpdateEditPathInputs()
    }
    });

document.addEventListener("focusout", function(e){
    const target = e.target.closest(".path-list-item");
    if(target){
        main.update()
        target.classList.remove("focus")

    }
    });

//crud operations on paths and nodes

btnDeleteNode.onclick = (e)=>{
    main.deleteNode(main.highlightedNode.id)
    UpdateEditNodeInputs()
    main.generateNodeList("nodeList")
}

inputNodeX2.oninput = (e)=>{
    main.updateNode(main.highlightedNode.id, inputNodeX2.value, inputNodeY2.value)
    main.generateNodeList("nodeList")

}
inputNodeY2.oninput = (e)=>{
    main.updateNode(main.highlightedNode.id, inputNodeX2.value, inputNodeY2.value)
    main.generateNodeList("nodeList")

}

btnDeletePath.onclick = (e)=>{
    main.deletePath(main.highlightedPath.id)
    UpdateEditPathInputs()
    main.generatePathList("pathList")
    main.generateNodeList("nodeList")

}

inputPathNode12.oninput = (e)=>{
    main.updatePath(main.highlightedPath.id, inputPathNode12.value, inputPathNode22.value)
    main.generatePathList("pathList")
    main.generateNodeList("nodeList")


}
inputPathNode22.oninput = (e)=>{
    main.updatePath(main.highlightedPath.id, inputPathNode12.value, inputPathNode22.value)
    main.generatePathList("pathList")
    main.generateNodeList("nodeList")


}


btnAddNode.addEventListener('click', ()=>{
    main.addNode(inputNodeX.value, inputNodeY.value)
    main.generateNodeList("nodeList")

})
btnAddPath.addEventListener('click', ()=>{
    main.addPath(inputPathNode1.value, inputPathNode2.value)
    main.generatePathList("pathList")
    main.generateNodeList("nodeList")


})

//canvas drag/drop operations
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width 
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left)*scaleX;
    let y = (event.clientY - rect.top)*scaleY;
    return [Math.round(x), Math.round(y)]
}
var canvas = document.getElementById("canvas")

canvas.onmouseup = (e)=>{
    if(main.draggedNode != null){
        main.update()
        main.draggedNode = null
        main.highlightedNode = null
        UpdateEditNodeInputs()

        main.update()

    }

    




}

canvas.onmousedown = (e)=>{
    let mousecoords = getMousePosition(canvas,e)
    let closest = main.findClosestNode(mousecoords[0], mousecoords[1])
    if(main.getDistanceFromNode(mousecoords[0],mousecoords[1],closest) <= 50){
        main.draggedNode = closest
        main.highlightedNode = closest
        inputNodeX2.value = main.highlightedNode.x;
        inputNodeY2.value = main.highlightedNode.y;
        btnDeleteNode.disabled = false;
        inputNodeX2.disabled = false;
        inputNodeY2.disabled = false;
        labelEditNodeId.disabled = false;
        labelEditNodeId.value = main.highlightedNode.id;


        main.updateNode(main.draggedNode.id,mousecoords[0],mousecoords[1])
        main.generateNodeList("nodeList")
        main.highlightNode(main.draggedNode.id)
        main.update()
    }
        
    
    

    

}
canvas.onmousemove = (e)=>{
    let mousecoords = getMousePosition(canvas,e)
    if(e.buttons==1 && main.draggedNode!=null){
        if(e.shiftKey){
            main.updateNode(main.draggedNode.id,Math.round(mousecoords[0]/100)*100,Math.round(mousecoords[1]/100)*100)
            main.drawGrid()

        }   else{
            main.updateNode(main.draggedNode.id,mousecoords[0],mousecoords[1])
        }
        
        main.generateNodeList("nodeList")
        inputNodeX2.value = main.highlightedNode.x;
        inputNodeY2.value = main.highlightedNode.y;
        main.highlightNode(main.draggedNode.id)
    }
}

