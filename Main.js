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
    bgImageName;
    bgBlob;

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
        if(this.bgBlob != undefined && this.bgImageName != undefined) {
            this.canvas.globalAlpha = 0.45
            this.canvas.drawImage(this.bgBlob, 0, 0, 2000, 2000);
            this.canvas.globalAlpha = 1

        }
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
                    let pathLength = this.nodesList[i].paths.length
                    let pathsListToDelete = [...this.nodesList[i].paths]
                    for(let x = 0; x<pathLength; x++){
                        this.deletePath(pathsListToDelete[x].id)
                    }
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

    unSetStartNodes(){
        for(let i = 0; i<this.nodesList.length;i++){
            this.nodesList[i].unSetStart()
        }
        this.update()

    }

    setStartNode(id){
        let node = this.getNode(id)
        this.unSetStartNodes()
        if(node.isEnd){
            node.unSetEnd()
        }
        node.setStart()
        this.update()
    }

    unSetEndNodes(){
        for(let i = 0; i<this.nodesList.length;i++){
            this.nodesList[i].unSetEnd()
        }
        this.update()

    }
    setEndNode(id){
        let node = this.getNode(id)
        this.unSetEndNodes()
        if(node.isStart){
            node.unSetStart()
        }
        node.setEnd()
        this.update()
    }

    unSetAllProgress(){
        for(let i = 0; i<this.nodesList.length;i++){
            this.nodesList[i].unSetProgress()
        }
        for(let i = 0; i<this.pathsList.length;i++){
            this.pathsList[i].unSetProgress()
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
    
} 