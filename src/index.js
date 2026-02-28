import express from 'express'
import cors from 'cors'
import { initMQTT } from './mqttHandler.js'
import restHandler from './restHandler.js'
import { connectToDatabase } from './db.js'
import 'dotenv/config'

const app = express()
app.use(cors()) // allow any origin
app.use(express.json())

const broker = initMQTT()

app.use('/api', restHandler(broker))

const HTTP_PORT = process.env.REST_PORT || 3000
app.listen(HTTP_PORT, () => {
  console.log(`[REST] API available at http://localhost:${HTTP_PORT}/api`)
})

await connectToDatabase() 
console.log("Database connected, starting server...")
