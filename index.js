import { Main } from "./main.js"

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

btnStart.oninput = (e)=>{
    if(btnStart.checked){
        main.setStartNode(main.highlightedNode.id)
    } else{
        main.unSetStartNodes()
    }
    UpdateEditNodeInputs()
}
btnEnd.oninput = (e)=>{
    if(btnEnd.checked){
        main.setEndNode(main.highlightedNode.id)
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
        UpdateEditNodeInputs()

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

btnSave.onclick = (e)=>{
    main.saveLoad.generateJSON()
}