export class SaveLoad{
    main;
    canvas;
    constructor(main){
        this.main = main;
        this.canvas = main.canvas;
    }

    generateJSON(){
        let json = {nodesId: this.main.nodesId, pathsId: this.main.pathsId, nodes:[], paths:[]}
        for(let i = 0; i < this.main.nodesList.length; i++){
            json.nodes.push(this.main.nodesList[i].toJSON())
        }
        for(let i = 0; i < this.main.pathsList.length; i++){
            json.nodes.push(this.main.pathsList[i].toJSON())
        }

        console.log(json)
    }
}