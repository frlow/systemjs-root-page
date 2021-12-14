import {generateHtml} from './htmlGenerator'
import express from 'express'
import {exampleMeta} from "./meta";

const app = express()
const port = 3000
app.get("/meta", (req, res) => {
    res.send(JSON.stringify(exampleMeta))
})
app.use('/test', express.static('test'))
app.get('*', async (req, res) => {
    res.setHeader('content-type', 'text/html')
    res.send(await generateHtml())
})

console.log(`Running server on port: ${port}`)
app.listen(port)