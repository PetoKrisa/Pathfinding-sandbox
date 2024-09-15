export class Path{
    main;
    id = 0;
    node1;
    node2;
    isHighlighted=false;
    constructor(main, id, node1, node2){
        this.main = main
        this.id = id
        this.node1 = node1
        this.node2 = node2
    }

    update(){

    }
    draw(){
        this.main.canvas.lineWidth = 30
        if(!this.isHighlighted){
            this.main.canvas.strokeStyle = "white"
        } else{
            this.main.canvas.strokeStyle = "yellow"
        }
        this.main.canvas.beginPath()
        this.main.canvas.moveTo(this.node1.x, this.node1.y)
        this.main.canvas.lineTo(this.node2.x, this.node2.y)
        this.main.canvas.stroke()
        this.isHighlighted=false
    }
}