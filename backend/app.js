import express from "express"
const app = express()
import cors from "cors"
import aiRoute from "./routes/ai.route.js"

app.use(express.json());
app.use(cors())
const port = process.env.PORT

app.post('/analyze', aiRoute)

app.listen(port, (req, res)=>{
    console.log("Running Port on ", port)
})