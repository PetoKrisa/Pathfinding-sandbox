import { Path } from "./path.js"
import { Node } from "./node.js"
export class SaveLoad{
    main;
    canvas;
    constructor(main){
        this.main = main;
        this.canvas = main.canvas;
    }

    save(json, name) {
        var a = document.createElement("a");
        document.body.appendChild(a)
        var file = new Blob([json], {type: "json"});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click()
        document.body.removeChild(a)
      }

    generateJSON(fileName){
        let json = {bgImageName: this.main.bgImageName, nodesId: this.main.nodesId, pathsId: this.main.pathsId, nodes:[], paths:[]}
        for(let i = 0; i < this.main.nodesList.length; i++){
            json.nodes.push(this.main.nodesList[i].toJSON())
        }
        for(let i = 0; i < this.main.pathsList.length; i++){
            json.paths.push(this.main.pathsList[i].toJSON())
        }
        if(fileName == ""){
            fileName = "pathJSON"
        }
        this.save(JSON.stringify(json, null, "\t"),`${fileName}.json`)

    }

    async load(fileName){
        let results = await fetch(`/saves/${fileName}.json`)
        let text = await results.text()
        this.parseJSON(text)
    }

    parseJSON(_json){
        let json = JSON.parse(_json)
        this.main.nodesId = json.nodesId
        this.main.pathsId = json.pathsId
        if(json.bgImageName != undefined){this.addBackground(json.bgImageName)}

        for(let i = 0; i < json.nodes.length; i++){
            let node = json.nodes[i]
            let nodeToPush = new Node(this.main,node.id, node.x, node.y)
            if(node.isStart){nodeToPush.isStart = true}
            if(node.isEnd){nodeToPush.isEnd = true}
            this.main.nodesList.push(nodeToPush)
        }

        for(let i = 0; i < json.paths.length; i++){
            let path = json.paths[i]
            let node1 = this.main.getNode(path.node1)
            let node2 = this.main.getNode(path.node2)
            let pathToPush = new Path(this.main, path.id, node1, node2)
            this.main.pathsList.push(pathToPush)
            node1.addPathToList(this.main.getPath(path.id))
            node2.addPathToList(this.main.getPath(path.id))

        }

        this.main.update()
        this.main.generateNodeList("nodeList")
        this.main.generatePathList("pathList")
    }

    async addBackground(fileName){
        if(fileName == "" || fileName == undefined){return}
        try{
            let results = await fetch(`/saves/${fileName}`)
            let blob = await results.blob()
            if(results.status == 404){
                throw new Error("Image does not exist")
            } else{
                this.main.bgImageName = fileName;
                this.main.bgBlob = await createImageBitmap(blob);
                this.main.update()
            }
            
        } catch(e){
            alert(e)
        }
        
    }
}