import express from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import { initMQTT } from './mqttHandler.js'
import restHandler from './restHandler.js'
import { connectToDatabase } from './db.js'

const config = JSON.parse(readFileSync(join(process.cwd(), 'src', 'config.json'), 'utf8'))

const app = express()
app.use(express.json())

const broker = initMQTT()

app.use('/api', restHandler(broker))

const HTTP_PORT = config.rest.port || 3000
app.listen(HTTP_PORT, () => {
  console.log(`[REST] API available at http://localhost:${HTTP_PORT}/api`)
})

await connectToDatabase() 
console.log("Database connected, starting server...")
