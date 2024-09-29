import { Path } from "./Path.js"
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
            json.nodes.push(this.main.nodesList.get(i).toJSON())
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
            if(node.isEnd){nodeToPush.isEnd = true
                this.main.endNode = nodeToPush
            }
            this.main.nodesList.set(nodeToPush.id,nodeToPush)
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

    mapToCanvas(lon,lat, n,w,e,s){
        let y = (lat-parseFloat(n))/(parseFloat(n)-parseFloat(s))
        let x = (lon-parseFloat(w))/(parseFloat(w)-parseFloat(e))
        if((x/-1)*2000<=0){x=0}
        if((y/-1)*2000<=0){y=0}
        return [((x/-1)*2000),((y/-1)*2000)]
    }

    async loadOsm(n,w,e,s){
        let request = await fetch("https://overpass-api.de/api/interpreter", {
            method:"post",
            body: "data=" + encodeURIComponent(`
                [out:json];
                (
                way["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified|residential|service"](${s},${w},${n},${e});
                );
                (._;>;);
                out;
                `)
        })
        let result = await request.text()
        let json = JSON.parse(result)
        let nodes = []
        let ways = []
        for(let i = 0; i < json["elements"].length; i++){
            if(json["elements"][i]["type"] == "node"){
                nodes.push(json["elements"][i])
            } else if(json["elements"][i]["type"] == "way"){
                ways.push(json["elements"][i])
            }
        }
        for(let i = 0; i < nodes.length; i++){
            let coords = this.mapToCanvas(nodes[i].lon, nodes[i].lat, n,w,e,s)
            let nodeToPush = new Node(this.main, nodes[i].id, coords[0], coords[1])
            this.main.nodesList.set(nodeToPush.id,nodeToPush)            
        }
        for(let i = 0; i< ways.length; i++){
            for(let x = 0; x < ways[i].nodes.length-1; x++){
                let node1 = this.main.getNode(ways[i].nodes[x])
                let node2 = this.main.getNode(ways[i].nodes[x+1])
                let pathToPush = new Path(this.main, ways[i].id, node1, node2)
                node1.paths.push(pathToPush)
                node2.paths.push(pathToPush)
                this.main.pathsList.push(pathToPush)
            }
            
        }
        this.main.generateNodeList("nodeList")
        this.main.generatePathList("pathList")
        this.main.update()
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