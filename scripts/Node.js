export class Node{
    id = 0;
    x = 0;
    y = 0;
    
    paths = [];
    main;
    attribute = [""] //"higlighted", "progress", "start", "end",""
    //attribute priority is the same as the index in the array

    constructor(main,id,x,y){
        this.main = main
        this.id = id
        this.x = x
        this.y = y
    }

    renderX(){
        return this.x+this.main.pan[0]  
    }
    renderY(){
        return this.y+this.main.pan[1]
    }

    draw(){
        let emphasis = 1
        if(this.main.editMode){}
        else if(!this.main.editMode && (this.isEnd || this.isStart)){emphasis = 2}
        else {return}
        
        if(this.renderX()*this.main.zoomScale()<0 || this.renderX()*this.main.zoomScale()>2000 ||
        this.renderY()*this.main.zoomScale()<0 || this.renderY()*this.main.zoomScale()>2000){
            return
        }

        let textColor = "black" 
        switch (this.attribute[0]){
            case "progress":
                this.main.canvas.fillStyle = "red"
                break
            case "highlighted":
                this.main.canvas.fillStyle = "yellow"
                break
            case "start":
                this.main.canvas.fillStyle = "green"
                textColor = "white"
                break
            case "end":
                this.main.canvas.fillStyle = "red"
                textColor = "white"
                break
            default:
                this.main.canvas.fillStyle = "white"
                break
        }
        
        this.main.canvas.beginPath()
        this.main.canvas.arc(this.renderX()*this.main.zoomScale(), this.renderY()*this.main.zoomScale(), 32*this.main.scale*this.main.zoomScale()*emphasis, 0, 2 * Math.PI)
        this.main.canvas.fill()
        
        this.main.canvas.fillStyle = textColor

        let fontSize = 45*this.main.scale
        this.main.canvas.font = `${fontSize*this.main.zoomScale()}px monospace`
        let offset = (fontSize/(3.5/this.main.scale))/this.main.scale
        let textx = this.renderX() - (offset + (offset * (String(this.id).length-1)))
        let texty = this.renderY() + (offset)
        this.main.canvas.fillText(this.id, textx*this.main.zoomScale(), texty*this.main.zoomScale())
        
    }

    addAttribute(_attribute){
        if(!this.attribute.includes(_attribute)){
            this.attribute.splice(0,0,_attribute)
        }
    }

    delAttribute(_attribute){
        if(this.attribute.includes(_attribute)){
            this.attribute.splice(this.attribute.indexOf(_attribute),1)
        }
    }

    hasAttribute(_attribute){
        return this.attribute.includes(_attribute)
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
            if((this.paths[i].node1.id == path.node1.id && this.paths[i].node2.id == path.node2.id)
            || (this.paths[i].node2.id == path.node1.id && this.paths[i].node1.id == path.node2.id)){
                return true
            }
        } 
        return false
    }

    toJSON(){
        let pathsIdList = []
        for(let i = 0; i<this.paths.length;i++){
            pathsIdList.push(this.paths[i].id)
        }
        return {id: this.id, x: this.x, y:this.y,
            paths: pathsIdList, attribute: this.attribute
        }
    }
}