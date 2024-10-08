# Pathfinding Sandbox Documentation
## 1. Summary
In this app you can add, and edit nodes *(verticies)* and paths *(edges)* of a weighted graph. The weights are the actual length of the paths in pixels. You can save and load graphs, add a starting *(fixed vertex)* and an ending point. With a specified starting and ending point you can start the [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) or the [A* algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) visualiser.
You can even import real world maps from [OpenStreetMap](https://www.openstreetmap.org)
I made it using only vanilla JS and HTML canvas.

## 2. How to run
Since this app uses js-modules, and fetch requests, you need a generic http or php server, which can host this directory. Note that this app will not work if you just open the html file.

#### 2.1. Live Server method (My method)

 - Download and install [Visual Studio Code](https://code.visualstudio.com/) 
 - Open the root folder of the app in vscode
 - Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension inside vscode (*You might need to restart vscode*)
 - open `canvas.html` in the editor
 - Click the **Go Live** button in the bottom-right corner of vscode, and it should automatically open the app in a new tab in your default browser
#### 2.2. XAMPP method (php)
- Download and install [XAMPP](https://www.apachefriends.org/)
- Open XAMPP and in the Apache row click on Config -> Apache (httpd.conf)
- In httpd.conf find `DocumentRoot "C:/xampp/htdocs"` and `<Directory "C:/xampp/htdocs">`
- Replace the path with the app path, and restart Apache if it is running
- Go to `http://localhost/canvas.html`

## 3. User Interface
### 3.1 Canvas
#### 3.1.1 Canvas controls
- a 2000px by 2000px html canvas
	- Coordinates start from the top left, not the middle
- Displays all the **nodes** and **paths**
- You select nodes by clicking on them
- Clicking and dragging will move the nodes with th cursor
- Holding `Shift` while dragging will draw a 20x20 grid and snap dragged nodes to it
- Pressing `Control+e` will toggle edit mode, which means that it will hide the nodes, so it is easier to see short paths
- Holding `Contol` while clicking and dragging a node will allow you to connect nodes together with you mouse
- Holding `Alt` while clicking on the canvas will place a node at your cursor
- Holding the `scrollwheel` and moving the mouse will pan the view
- scrolling will zoom in and out
- There is a range slider below the canvas, which sets the scale of nodes and paths, which allows you to see better
	- under the slider there is a reset pan button, which will undo panning and zooming, and recenter the view
- And finally there is a button labelled `Import OSM map` which opens an import dialoge
#### 3.1.2 How to import an OSM map
1. Click the `Import OSM map` button
2. Go to [OpenStreetMap](https://www.openstreetmap.org/export)
3. Press `Manually select a different area`
4. Using the bounding box on the screen select a square shaped area
	- **Keep it as square as possible**, because when mapping the coordinates to the canvas the app will stretch it to fit in a square, causing distorsions
5. Copy the coordinates from the top left of the screen from OpenStreetMap to the corresponging inputs in the Pathfinding Sandbox app
	- The **North**, **West**, **East**, **South** inputs are arranged the same way as in OpenStreetMap
	- The default values will load the city center of **Budapest**, which is a large area with many nodes, pull the scale slider to 0.2x and toggle `edit mode` with `ctrl+e` before loading, and keep in mind that it might take 10+ seconds depending on performance
6. Click Import
### 3.2 Nodes tab (1st tab)
#### 3.2.1 Controls
- You can `Add` a node with specified **x** and **y** coordinates
	- The default coordinates are (0;0)
- If you have selected a node *(from the list or by clicking on one on the canvas)* the editing controls become enabled
- It will display the selected nodes `id`, and the **x** and **y** coordinates. The coordinates are editable
- `Start` and `End` checkboxes will set the current node as start or end. It will also unset any other node
	- there can only be one start, and one end node, and a node cannot be start and end at the same time
- You can delete a node with the `Del` button
  - Deleteing a node will remove connected paths
#### 3.2.2 List
- All the nodes in the graph are displayed in this list
- Clicking an item will highlight the corresponging node, and select it
- this is the display model: `id(x,y) degree`
	- "`degree`" shows how many paths are connected to that node
### 3.3 Paths tab (2nd tab)
#### 3.3.1 Controls
- You can `Add` a path between `Node1` and `Node2`
	- Node1 and node2 are IDs, it is the id of the node you want to connect to
	- You can see the id in the node list and the canvas, written on top of the nodes
- Select paths from the paths list below the controls to edit them
	- selected paths are highlighted, and the path id is shown
	- with paths it is only possible to edit node1 and node2
	- You can delete a path with the `Del` button
#### 3.2.2 List
- if you click on a path in the list it becomes higlighted on the canvas, so you see what you are editing 
- in the list this is the display model of paths `id(node1.id, node2.id)`
### 3.4 File managment tab (3rd tab)
#### 3.4.1 Save file
- there is a save button, a file name input, and a load button
- You can saving a file will generate a json file, with the name you entered int the input (or a default value if left empty) 
- It is only possible to load from the `/saves/` directory in the project files, because I intended it to be a local app, might change this if I host this anywhere
- When loading enter the file name without the `.json` and press load

Save file model:
```json
"bgImageName": "image.png" or "",
"nodesId": 0,
"pathsId": 0,
"nodes": [ {"id": 0,"x": 0,"y": 0, "paths": [0, ...], "isStart": false, "isEnd": false}, ... ]
"paths": [ {"id": 0, "node1": 0, "node2": 1}, ... ]
```
- `nodesId` and `PathsId` are stored to the app knows what id to give the next added node and path
	- it is incremented every time
#### 3.4.2 Background image
- You can add an image from `/saves/` if you enter the name into the 2nd input
	- like this `/saves/<imageName>.<imageExtension>`
- The backgorund image is stored as a bitmap and drawn on the canvas
- The background image name is stored as a variable and saved into the save file
- if the `bgImageName` is not empty then it will load the everytime you load a save
- you can remove the background with the `Del Bg` button, you should save the .json file again to prevent the app from loading it again when loading the save
### 3.5 Pathfinding controls (4th tab)
- When you press `Start` and a starting and ending node is specified, the pathfinding algorithm starts (Dijkstra)
- The algorithm higghlights every patth and node it touches, and if it finds the end it only higlights the shortest path
- `Reset` button removes higlighting
- The `Delay (ms)` input sets the animation speed (the time it sleeps between iterations)
	- the default value is 120
	- if the value is 0 the algorithm is not animated, and only highlights the shortest path instantly
- With the select element you can change the algorithm to use
	- Options: Dijkstra, A*

## 4. External sources
All materials from OpenStreetMap belong to the [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

1. Canvas functions: [W3Schools canvas reference](https://www.w3schools.com/tags/ref_canvas.asp)
2. General javascript problems: [MDN Web Docs](https://developer.mozilla.org/en-US/)
3. Dijkstras Algorithm:
	- Youtube 1: [Dijkstras Shortest Path Algorithm Explained | With Example | Graph Theory](https://www.youtube.com/watch?v=bZkzH5x0SKU&t=197s)
	- Youtube 2: [How Dijkstra's Algorithm Works](https://www.youtube.com/watch?v=EFg3u_E6eHU)
	- Article: [Dijkstra's Algorithm – Explained with a Pseudocode Example](https://www.freecodecamp.org/news/dijkstras-algorithm-explained-with-a-pseudocode-example/)
4. A* Algorithm:
	- Youtube: [The hidden beauty of the A* algorithm](https://www.youtube.com/watch?v=A60q6dcoCjw)
5. Pictures included:
	- Budapest [OpenStreetMap](https://www.openstreetmap.org/#map=12/47.5242/19.0805)
	- Gta V [Map Genie](https://gta-5-map.com/)
6. Map import:
	- Map: [OpenStreetMap](https://www.openstreetmap.org/)
	- Api [Overpass Api](https://overpass-api.de/)
