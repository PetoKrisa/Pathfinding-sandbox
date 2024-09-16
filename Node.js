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
        console.log(this.main.canvas.fillStyle, " set color white")

        } else{
            this.main.canvas.fillStyle = "yellow"
        console.log(this.main.canvas.fillStyle, " set color yellow")

        }
        this.main.canvas.font = "50px Arial"
        this.main.canvas.beginPath()
        this.main.canvas.arc(this.x, this.y, 40, 0, 2 * Math.PI)
        this.main.canvas.fill()
        console.log(this.main.canvas.fillStyle, " Filled circle")

        try{
        this.main.canvas.fillStyle = "black"
        this.main.canvas.fillText(this.id, this.x-14, this.y+14)
        console.log(this.main.canvas.fillStyle, " Filled text")
        } catch (e) {alert(e)}
        this.isHighlighted = false
    }
}