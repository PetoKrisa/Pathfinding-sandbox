const express = require("express")
const app = express()
const PORT = 8080

app.use("/", express.static("./"))

app.get("/", (req,res)=>{
    res.sendFile(`${__dirname}/canvas.html`)
})
app.get("/style.css", (req,res)=>{
    res.sendFile(`${__dirname}/style.css`)
})

app.listen(PORT, ()=>{
    console.log(`Server Listening: 'http://localhost:${PORT}'`)
})
