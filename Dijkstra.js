import { Path } from "./path.js"
import { Node } from "./node.js"
import { Main } from "./main.js"

export class Dijkstra{
    main;
    unVisitedNodes = [];
    visitedNodes = [];
    constructor(main){
        this.main=main
    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    isVisited(nodeId){
        let node = this.visitedNodes.find((e)=>{
            if(e.node.id == nodeId){
                return e
            }
        }) 
        if (node == undefined){
            return false
        } else {
            return true
        }
    }

    getShrotestDistanceNode(){

        let shortestDistanceNode = this.unVisitedNodes[0]
        
        for(let i = 0; i<this.unVisitedNodes.length; i++){
            if(this.unVisitedNodes[i].shortestDistance <= shortestDistanceNode.shortestDistance){
                shortestDistanceNode = this.unVisitedNodes[i]
            }
        }

        return shortestDistanceNode
    }

    setToVisited(id){
        let nodeIndex;
        for(let i = 0; i < this.unVisitedNodes.length; i++){
            if(this.unVisitedNodes[i].node.id == id){
                nodeIndex = i
                break
            }
        }
        let temp = this.unVisitedNodes[nodeIndex]
        this.visitedNodes.push(temp)
        this.unVisitedNodes.splice(nodeIndex, 1)
        
    }

    async start(delay = 120){
        this.unVisitedNodes = []
        this.visitedNodes = []
        this.main.unSetAllProgress()
        if(!this.main.isThereStartAndEnd()){throw Error("No starting or ending node set!"); return;}

        for(let i = 0; i < this.main.nodesList.length; i++){
            let nodeToPush = {node: this.main.nodesList[i], shortestDistance: Infinity, prevId: null}
            if(nodeToPush.node.isStart){nodeToPush.shortestDistance = 0}
            this.unVisitedNodes.push(nodeToPush)
        }


        let visitedEnd = false
        while (!visitedEnd){
            let currentNode = this.getShrotestDistanceNode()
            this.setToVisited(currentNode.node.id)
            if(delay!=0){
                currentNode.node.setProgress()
                this.main.update()
            }
            
            await this.timeout(delay)


            for(let i = 0; i < currentNode.node.paths.length; i++){
                if(delay!=0){
                    currentNode.node.paths[i].setProgress()
                    this.main.update()
                }

                let curDistance = currentNode.shortestDistance + currentNode.node.paths[i].getLength()
                let nextNode = this.unVisitedNodes.find((e)=>{
                    if(e.node.id == currentNode.node.paths[i].getNextNode(currentNode.node).id){                        
                        return e
                    }
                })
                if(nextNode!=undefined){
                    if(curDistance<nextNode.shortestDistance){
                        nextNode.shortestDistance = curDistance
                        nextNode.prevId = currentNode.node.id
                    }
    
                    if(nextNode.node.isEnd){
                        visitedEnd = true
                        this.setToVisited(nextNode.node.id)
                        console.log("found end")
                    }
                    await this.timeout(delay)
                }

            }
            console.log(this.visitedNodes)
        }
        this.DrawBestPath()

    }

    DrawBestPath(){
        this.main.unSetAllProgress()
        let endNode = this.visitedNodes.find((e)=>e.node.isEnd===true)
        let currentNode = endNode;
        let returnedToStart = false
        while (!returnedToStart){
            currentNode.node.setProgress()
            let nextNode = this.visitedNodes.find((e)=>e.node.id===currentNode.prevId)
            
            if(currentNode.node.isStart){
                returnedToStart = true
            } else{
                for(let i = 0; i < currentNode.node.paths.length; i++){
                    if((currentNode.node.paths[i].node1.id == nextNode.node.id) || (currentNode.node.paths[i].node2.id == nextNode.node.id)){
                        currentNode.node.paths[i].setProgress()
                        break
                    }
                }
            }
            currentNode = nextNode
        }

        this.main.update()
    }
}