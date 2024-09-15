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
        this.isHighlighted = false
    }
}