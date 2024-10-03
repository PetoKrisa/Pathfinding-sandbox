import { Node } from "./Node.js"
import { SaveLoad } from "./SaveLoad.js";
import { Path } from "./Path.js";
export class Main{
    canvas;
    saveLoad;
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId).getContext("2d")
        this.saveLoad = new SaveLoad(this)
    }
    
    nodesList = new Map()
    pathsList = new Map()
    nodesId = 0;
    pathsId = 0;
    bgImageName;
    bgBlob;
    editMode = true
    endNode = null;
    startNode = null;
    scale = 1;

    ghostNode = null;
    addedPath = null;

    highlightedNode;
    highlightedPath;

    pan = [0,0]
    zoomLevel = 0;
    zoomScale(){if (this.zoomLevel>0){return (1+(this.zoomLevel*0.05))} else{return 1}}
    draggedNode = null;

    toggleEditMode(){
        this.editMode = !this.editMode
    }

    update(){ 
        this.draw()
    }

    draw(){
        this.canvas.clearRect(0,0,2000,2000)
        if(this.bgBlob != undefined && this.bgImageName != undefined) {
            this.canvas.globalAlpha = 0.45
            this.canvas.drawImage(this.bgBlob, (0+this.pan[0])*this.zoomScale(), (0+this.pan[1])*this.zoomScale(), 2000*this.zoomScale(), 2000*this.zoomScale());
            this.canvas.globalAlpha = 1
        }

        this.canvas.fillStyle = "white"
        this.canvas.beginPath()
        this.canvas.arc((1000+this.pan[0])*this.zoomScale(), (1000+this.pan[1])*this.zoomScale(), 4, 0, 2 * Math.PI)
        this.canvas.fill()

        for(let [k,v] of this.pathsList){
            v.draw()
        }
        
        for(let [k,v] of this.nodesList){
            v.draw()
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
        for(let i = 1; i < 21; i++){
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
        console.log(node.renderX()*this.zoomScale())
        let x2 = node.renderX()*this.zoomScale()
        let y2 = node.renderY()*this.zoomScale()
        return Math.sqrt((Math.pow((x-x2),2)+Math.pow((y-y2),2)))
    }

    findClosestNode(x,y){
        let lowestDistanceNode = this.nodesList.entries().next().value
        let lowestDistance = null
        for(let [k,v] of this.nodesList){
            let distance = this.getDistanceFromNode(x,y,v)
            if(lowestDistance==null || lowestDistance>distance){
                lowestDistanceNode = v
                lowestDistance = distance
            }
        }
        return lowestDistanceNode
    }

    addNode(x,y){
        if(x=="") {x=0}
        if(y=="") {y=0}
        if(x!=undefined && y!=undefined){
            this.nodesList.set(parseInt(this.nodesId),new Node(this, this.nodesId, x,y))
        this.nodesId++;
        } else{
            throw TypeError("X and Y cannot be undefined")
        }
        this.generateNodeList("nodeList")
        this.update();        
    }

    getNode(id){
        try{
        let node = null;
        node = this.nodesList.get(parseInt(id))
        return node;
        }
        catch(err){
            alert(err)
        }
    }

    updateNode(node, x, y){
        try{
            let nodeToUpdate = node
            nodeToUpdate.x = Math.round(x)
            nodeToUpdate.y = Math.round(y)
            this.update()
        }
        catch(err){
            alert(err)
        }
    }

    deleteNode(id){
        try{
            let nodeToDelete = this.nodesList.get(parseInt(id))
            for(let e of nodeToDelete.paths){
                this.deletePath(e.id)
            }
            this.nodesList.delete(parseInt(id))

            if(this.nodesList.size==0){
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
            this.pathsList.set(parseInt(pathToPush.id), pathToPush)
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
        let path = null
        path = this.pathsList.get(parseInt(id))
        return path;
        }
        catch(err){
            alert(err)
        }
    }

    updatePath(id, node1Id, node2Id){
        try{
            let node1 = this.getNode(node1Id)
            let node2 = this.getNode(node2Id)
            if(node1==null || node2 == null){
                throw new ReferenceError("Node1 or Node2 does not exist")
            }
            else if(node1==node2){
                this.deletePath(id)
                throw new TypeError("Node1 and Node2 can not be the same")
            }
            let pathToUpdate = this.pathsList.get(parseInt(id))
                    

            pathToUpdate.node1 = node1
            pathToUpdate.node2 = node2
            if(node1.isPathExist(pathToUpdate) || node2.isPathExist(pathToUpdate)){
                this.deletePath(pathToUpdate.id)
                throw new ReferenceError("Path aleready exists!")
            }

            pathToUpdate.node1.deletePathFromList(pathToUpdate)
            pathToUpdate.node2.deletePathFromList(pathToUpdate)

            let newNode1 = node1;
            let newNode2 = node2;
            newNode1.addPathToList(pathToUpdate)
            newNode2.addPathToList(pathToUpdate)

            pathToUpdate.node1 = newNode1
            pathToUpdate.node2 = newNode2
            
            this.update()
        }
        catch(err){
            alert(err)
        }
    }

    deletePath(id){
        try{
            let pathToDelete = this.pathsList.get(parseInt(id))

            pathToDelete.node1.deletePathFromList(pathToDelete)
            pathToDelete.node2.deletePathFromList(pathToDelete)

            this.pathsList.delete(id)
            this.highlightedPath = null;
                    
            if(this.pathsList.size==0){
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
        for(let [k,v] of this.nodesList){
            nodeListHtml+= `<p data-id="${v.id}" class="list-item node-list-item" onclick="this.focus()" tabindex="1">${v.id} (${v.x};${v.y}) - ${v.paths.length} deg</p>`
        }
        document.getElementById(elementId).innerHTML = nodeListHtml
    }

    generatePathList(elementId){
        let pathListHtml = ""
        for(let [k,v] of this.pathsList){
            let path = v
            pathListHtml+= `<p data-id="${path.id}" class="list-item path-list-item" onclick="this.focus()" tabindex="1">${path.id} (${path.node1.id}-${path.node2.id})</p>`
        }
        document.getElementById(elementId).innerHTML = pathListHtml
    }

    highlightNode(id){
        let nodeToHighlight = this.nodesList.get(parseInt(id))
        nodeToHighlight.isHighlighted = true
        nodeToHighlight.draw()
    }

    highlightPath(id){
        let path = this.pathsList.get(parseInt(id))
        path.isHighlighted = true
        
        path.draw()
        path.node1.isHighlighted = true
        path.node1.draw()
        path.node2.isHighlighted = true
        path.node2.draw()
    }

    unSetStartNodes(){
        if(this.startNode != null){
            this.startNode.isStart = false;
            this.startNode.draw()
            this.startNode = null
        }

    }

    setStartNodeToHighlight(){
        let node = this.highlightedNode
        this.unSetStartNodes()
        if(node.isEnd){
            node.unSetEnd()
        }
        this.startNode = node
        node.setStart()
        node.draw()
    }

    unSetEndNodes(){
        if(this.endNode != null){
            this.endNode.isEnd = false
            this.endNode.draw()
            this.endNode = null;
        }
        

    }
    setEndNodeToHighlighted(){
        let node = this.highlightedNode
        this.unSetEndNodes()
        if(node.isStart){
            node.unSetStart()
        }
        this.endNode = node;
        node.setEnd()
        node.draw()
    }

    unSetAllProgress(){
        for(let [k,v] of this.nodesList){
            v.unSetProgress()
        }
        for(let [k,v] of this.pathsList){
            v.unSetProgress()
        }
        this.update()

    }

    setNodeProgress(id){
        let node = this.getNode(id)
        node.setProgress()
        this.update()
    }
    setPathProgress(id){
        let path = this.getPath(id)
        path.setProgress()
        this.update()
    }
    
    isThereStartAndEnd(){
        let start = false
        let end = false
        if(this.startNode!=null){start=true}
        if(this.endNode!= null){end=true}
        if(start&&end){return true}
        else{return false}
    }

    reset(){
        this.nodesId = 0;
        this.pathsId = 0;
        this.nodesList = new Map();
        this.pathsList = new Map();
        this.bgBlob = null;
        this.bgImageName = null;
        this.ghostNode = null;
        this.addedPath = null;
        this.highlightedNode = null;
        this.highlightedPath =null;
        this.draggedNode = null;
        this.startNode = null;
        this.endNode = null;
        this.update()
    }
} 