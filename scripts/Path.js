export class Path{
    main;
    id = 0;
    node1;
    node2;
    isHighlighted=false;
    isProgress=false;
    constructor(main, id, node1, node2){
        this.main = main
        this.id = id
        this.node1 = node1
        this.node2 = node2
    }


    draw(){
        this.main.canvas.lineCap = "round";

        this.main.canvas.lineWidth = 20*this.main.scale

        if (this.isProgress){
            this.main.canvas.strokeStyle = "red"
        } 
        else if(this.isHighlighted){
            this.main.canvas.strokeStyle = "yellow"
        }
        else{
            this.main.canvas.strokeStyle = "white"
        }

        
        this.main.canvas.beginPath()
        this.main.canvas.moveTo(this.node1.x, this.node1.y)
        this.main.canvas.lineTo(this.node2.x, this.node2.y)
        this.main.canvas.stroke()
        this.isHighlighted=false

    }

    getNextNode(currentNode){
        if(currentNode == this.node1){
            return this.node2
        } else if(currentNode == this.node2){
            return this.node1
        } else{
            throw new ReferenceError("Couldn't get next node, since the currend node doesn't exist")
        }
    }

    setProgress(){
        this.isProgress=true;
    }
    unSetProgress(){
        this.isProgress=false
    }

    getLength(){
        return Math.sqrt((Math.pow((this.node1.x-this.node2.x),2)+Math.pow((this.node1.y-this.node2.y),2)))
    }

    toJSON(){
        return{
            id: this.id, node1: this.node1.id, node2: this.node2.id,
        }
    }

}