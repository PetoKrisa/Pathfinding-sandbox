import { Dijkstra } from "./Dijkstra.js";
import { Main } from "./Main.js"
import { Astar } from "./Astar.js";
import { Node } from "./node.js";
import { Path } from "./Path.js";

const main = new Main("canvas")
const pathfindig = new Dijkstra(main)
const pathfindig2 = new Astar(main)
main.update()



function UpdateEditNodeInputs(){
    if(main.highlightedNode == null){
        btnDeleteNode.disabled = true;
        inputNodeX2.disabled = true;
        inputNodeY2.disabled = true;
        labelEditNodeId.disabled = true;
        labelEditNodeId.value = "";
        inputNodeX2.value = "";
        inputNodeY2.value = "";

        btnStart.disabled = true
        btnEnd.disabled = true
        btnStart.checked = false
        btnEnd.checked = false
    } else{
        btnDeleteNode.disabled = false;
        inputNodeX2.disabled = false;
        inputNodeY2.disabled = false;
        labelEditNodeId.disabled = false;
        labelEditNodeId.value = main.highlightedNode.id;
        inputNodeX2.value = main.highlightedNode.x;
        inputNodeY2.value = main.highlightedNode.y;

        btnStart.disabled = false
        btnEnd.disabled = false
        btnStart.checked = false
        btnEnd.checked = false
        if(main.highlightedNode.isStart){btnStart.checked = true}
        if(main.highlightedNode.isEnd){btnEnd.checked = true}
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
        console.log(main.highlightedPath)
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
    main.generatePathList("pathList")
}

inputNodeX2.oninput = (e)=>{
    main.updateNode(main.highlightedNode, parseInt(inputNodeX2.value), parseInt(inputNodeY2.value))
    main.generateNodeList("nodeList")
}
inputNodeY2.oninput = (e)=>{
    main.updateNode(main.highlightedNode, parseInt(inputNodeX2.value),parseInt(inputNodeY2.value))
    main.generateNodeList("nodeList")
}

btnStart.oninput = (e)=>{
    if(btnStart.checked){
        main.setStartNodeToHighlight()
    } else{
        main.unSetStartNodes()
    }
    UpdateEditNodeInputs()
}
btnEnd.oninput = (e)=>{
    if(btnEnd.checked){
        main.setEndNodeToHighlighted()
    } else{
        main.unSetEndNodes()
    }
    UpdateEditNodeInputs()
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


btnAddNode.addEventListener('click', (e)=>{
    let x;
    let y;
    
    if(inputNodeX.value == ""){
        x = 0;
    }
    if(inputNodeY.value == ""){
        y = 0;
    }
    if(inputNodeX.value != "" && inputNodeY.value != ""){
        x = parseInt(inputNodeY.value)
        y = parseInt(inputNodeY.value)
    }

    main.addNode(x, y)
    main.generateNodeList("nodeList")
})
btnAddPath.addEventListener('click', (e)=>{
    main.addPath(inputPathNode1.value, inputPathNode2.value)
    main.generatePathList("pathList")
    main.generateNodeList("nodeList")
})

//canvas drag/drop operations
function getMousePosition(canvas, event) {
    let rect = canvas.canvas.getBoundingClientRect();
    let scaleX = canvas.canvas.width / rect.width 
    let scaleY = canvas.canvas.height / rect.height;
    let x = (event.clientX - rect.left)*scaleX;
    let y = (event.clientY - rect.top)*scaleY;
    return [Math.round(parseFloat(x)), Math.round(parseFloat(y))]
}
var canvas = document.getElementById("canvas")
var lastMove = 0;
canvas.onmouseup = (e)=>{
    lastMove = 0
    let mousecoords = getMousePosition(main.canvas,e)
    let closest = main.findClosestNode(mousecoords[0], mousecoords[1])
    if(main.ghostNode != null && main.addedPath != null){
        if(main.getDistanceFromNode(mousecoords[0],mousecoords[1],closest) <= 42*main.scale){
            main.updatePath(main.addedPath.id, closest.id, main.highlightedNode.id)
            main.generatePathList("pathList")
            main.generateNodeList("nodeList")
            main.update()
            main.addedPath = null
            main.ghostNode = null
            main.draggedNode = null
            main.pathsId++
        } else{
            main.deletePath(main.addedPath.id)
            main.addedPath = null
            main.ghostNode = null
            main.draggedNode = null
            main.update()
        }
    }
    else if(main.draggedNode != null){
        main.update()
        main.draggedNode = null
        main.generateNodeList("nodeList")
        UpdateEditNodeInputs()
        main.update()

    }
}

var offsetCoords = [0,0]
canvas.onmousedown = (e)=>{
    let mousecoords = getMousePosition(main.canvas,e)
    let closest = main.findClosestNode(mousecoords[0], mousecoords[1])
    if(e.buttons==4){
        offsetCoords = getMousePosition(main.canvas,e)
    }
    else if(e.buttons==1&&e.ctrlKey&&main.getDistanceFromNode(mousecoords[0],mousecoords[1],closest) <= 42*main.scale){
        console.log("ctrl")
        main.highlightedNode = closest
        main.draggedNode = null
        main.ghostNode = new Node(main, -1, mousecoords[0]-main.pan[0], mousecoords[1]-main.pan[1])
        let pathToAdd = new Path(main, main.pathsId, main.highlightedNode, main.ghostNode)
        main.addedPath = pathToAdd
        main.pathsList.set(parseInt(pathToAdd.id), pathToAdd)
        //main.pathsId++
    } else if(e.altKey){
        main.addNode(mousecoords[0], mousecoords[1])
        main.update()
        main.generateNodeList("nodeList")
    }
    else if(main.getDistanceFromNode(mousecoords[0],mousecoords[1],closest) <= 42*main.scale){
        main.draggedNode = closest
        main.highlightedNode = closest
        
        UpdateEditNodeInputs()
        //main.updateNode(main.draggedNode,mousecoords[0],mousecoords[1])
        main.generateNodeList("nodeList")
        main.generatePathList("pathList")
        main.highlightNode(main.draggedNode.id)
        main.update()
    }
    
}


canvas.onmousemove = (e)=>{
    if(Date.now() - lastMove > 33) {
        lastMove = Date.now()
    } else{
        return
    }

    let mousecoords = getMousePosition(main.canvas,e)
    if(e.buttons == 4){
        console.log(main.pan[0]+(offsetCoords[0]-mousecoords[0]),main.pan[1]+(offsetCoords[1]-mousecoords[1]))
        main.pan[0] = main.pan[0]-(offsetCoords[0]-mousecoords[0])
        main.pan[1] = main.pan[1]-(offsetCoords[1]-mousecoords[1])
        offsetCoords = getMousePosition(main.canvas,e)
        main.update()
    }
    else if(e.buttons==1 && e.ctrlKey && main.ghostNode !=null && main.addedPath != null){
        main.ghostNode.x = mousecoords[0] - main.pan[0]
        main.ghostNode.y = mousecoords[1] - main.pan[1]
        main.update()
    }
    else if(e.buttons==1 && main.draggedNode!=null){
       
        if(e.shiftKey){
            main.updateNode(main.draggedNode,Math.round(mousecoords[0]/100)*100,Math.round(mousecoords[1]/100)*100)
            main.drawGrid()
        }   else{
            main.updateNode(main.draggedNode,mousecoords[0]-main.pan[0],mousecoords[1]-main.pan[1])
        }
        
        //main.generateNodeList("nodeList")
        //inputNodeX2.value = main.highlightedNode.x;
        //inputNodeY2.value = main.highlightedNode.y;
        main.highlightNode(main.draggedNode.id)
    }
}

canvas.addEventListener('wheel', (e)=>{
    if(e.deltaY<0 && main.zoomLevel<15){
        main.canvas.scale(1.05, 1.05)
        main.zoomLevel++
        main.update()
    } else if(e.deltaY>0 && main.zoomLevel>0){
        main.canvas.scale(0.95, 0.95)
        main.zoomLevel--
        main.update()
    }
})

btnSave.onclick = (e)=>{
    main.saveLoad.generateJSON(inputFileName.value)
}

btnLoad.onclick = (e)=>{
    main.saveLoad.load(inputFileName.value)
}

btnAddBg.onclick = (e)=>{
    main.saveLoad.addBackground(inputBgName.value)
}

btnDelBg.onclick = (e)=>{
    main.bgBlob = undefined;
    main.bgImageName = undefined;
    main.update()
}

btnStartPath.onclick = (e)=>{

    switch(selectAlg.value){
        case "dijkstra":
            if(inputDelay.value == ""){pathfindig.start()}
            else{pathfindig.start(inputDelay.value)}
            break;
        case "astar":
            if(inputDelay.value == ""){pathfindig2.start()}
            else{pathfindig2.start(inputDelay.value)}
            break;
    }
}

btnResetPath.onclick = (e)=>{
    main.unSetAllProgress()
}

window.addEventListener("keydown", (e)=>{

    if(e.key == "e" && e.ctrlKey){
        e.preventDefault()
        e.stopImmediatePropagation()
        main.toggleEditMode()
        main.update()
    }
})

rangeScale.oninput = (e)=>{
    main.scale = parseFloat(rangeScale.value)
    main.update()
}

//import osm map
OSMimport.onclick = (e)=>{
    main.saveLoad.loadOsm(OSMnorth.value, OSMwest.value, OSMeast.value, OSMsouth.value)
}

btnCenter.onclick = (e)=>{
    main.pan = [0,0]
    for(let i = 0; i < main.zoomLevel; i++){
        main.canvas.scale(0.95, 0.95)
    }
    main.zoomLevel = 0;
    main.update()
}