import express from "express"

const app = express()

const port = process.env.PORT

app.listen(port, (req, res)=>{
    console.log("Running Port on ", port)
})