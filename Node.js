export class Node{
    id = 0;
    x = 0;
    y = 0;
    paths = [];
    main;
    isHighlighted = false

    constructor(main,id,x,y){
        this.main = main
        this.id = id
        this.x = x
        this.y = y
    }

    update(){
        
    }
    draw(){
        if(!this.isHighlighted){
            this.main.canvas.fillStyle = "white"

        } else{
            this.main.canvas.fillStyle = "yellow"

        }
        this.main.canvas.beginPath()
        this.main.canvas.arc(this.x, this.y, 40, 0, 2 * Math.PI)
        this.main.canvas.fill()

        
        this.main.canvas.font = "50px Arial"
        this.main.canvas.fillStyle = "black"
        this.main.canvas.fillText(this.id, this.x-14, this.y+14)
        
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
}