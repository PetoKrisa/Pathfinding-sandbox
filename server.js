const express = require("express")
const app = express()
const PORT = 8080

app.use("/saves", express.static("./saves"))
app.use("/scripts", express.static("./scripts"))

app.get("/", (req,res)=>{
    res.sendFile(`${__dirname}/canvas.html`)
})
app.get("/style.css", (req,res)=>{
    res.sendFile(`${__dirname}/style.css`)
})

app.listen(PORT, ()=>{
    console.log(`Server Listening: 'http://localhost:${PORT}'`)
})
