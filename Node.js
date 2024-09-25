export class Node{
    id = 0;
    x = 0;
    y = 0;
    paths = [];
    main;
    isHighlighted = false
    isStart = false
    isEnd = false
    isProgress = false


    constructor(main,id,x,y){
        this.main = main
        this.id = id
        this.x = x
        this.y = y
    }

    update(){
        
    }
    draw(){
        if(this.isHighlighted){
            this.main.canvas.fillStyle = "yellow"
        }
        else if (this.isProgress){
            this.main.canvas.fillStyle = "green"
        } 
        else if (this.isStart){
            this.main.canvas.fillStyle = "green"
        } 
        else if (this.isEnd){
            this.main.canvas.fillStyle = "red"
        } 
        
        else{
            this.main.canvas.fillStyle = "white"

        }
        this.main.canvas.beginPath()
        this.main.canvas.arc(this.x, this.y, 32, 0, 2 * Math.PI)
        this.main.canvas.fill()
        
        this.main.canvas.fillStyle = "black"
        if(this.isEnd || this.isStart){
            this.main.canvas.fillStyle = "white"
        }

        let fontSize = 45
        this.main.canvas.font = `${45}px monospace`
        let offset = fontSize/3.5
        let textx = this.x - (offset + (offset * (String(this.id).length-1)))
        let texty = this.y + (offset)
        this.main.canvas.fillText(this.id, textx, texty)
        
        this.isHighlighted = false
    }

    addPathToList(path){
        if(path == null){
            throw new ReferenceError("Path to push can not be null")
            return
        }  
        else {
            this.paths.push(path)
        }
        

    }

    deletePathFromList(path){
        if(path == null){
            throw new ReferenceError("Path to delete can not be null")
            return
        }  
        else {
            for(let i = 0; i < this.paths.length; i++){
                if(path.id == this.paths[i].id){
                    this.paths.splice(i,1)
                    break
                }
            }
        }
    }

    isPathExist(path){
        for(let i = 0; i < this.paths.length; i++){
            if((this.paths[i].node1 == path.node1 && this.paths[i].node2 == path.node2)
            || (this.paths[i].node2 == path.node1 && this.paths[i].node1 == path.node2)){
                return true
            }
        } 
        return false
    }

    setProgress(){
        this.isProgress=true;
    }
    unSetProgress(){
        this.isProgress=false
    }

    setStart(){
        this.isStart=true;
    }
    unSetStart(){
        this.isStart=false;
    }

    setEnd(){
        this.isEnd=true;
    }
    unSetEnd(){
        this.isEnd=false;
    }


    toJSON(){
        let pathsIdList = []
        for(let i = 0; i<this.paths.length;i++){
            pathsIdList.push(this.paths[i].id)
        }
        return {id: this.id, x: this.x, y:this.y,
            paths: pathsIdList, isStart: this.isStart, isEnd: this.isEnd
        }
    }
}