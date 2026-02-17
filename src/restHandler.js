import express from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'

const router = express.Router()
const config = JSON.parse(readFileSync(join(process.cwd(), 'src', 'config.json'), 'utf8'))
const path = config.rest.examplePath

// Simple memory store to hold data for the GET request
let latestData = []

export default (aedes) => {
  
  // Internal listener to fill the cache whenever sensors/# publishes
  aedes.on('publish', (packet, client) => {
    if (client && packet.topic.startsWith('sensors/')) {
      const entry = {
        topic: packet.topic,
        payload: packet.payload.toString(),
        timestamp: new Date().toISOString()
      }
      latestData.push(entry)
      if (latestData.length > 20) latestData.shift() // Keep only last 20
    }
  })

  // GET: Retrieve the stored sensor messages
  router.get(path, (req, res) => {
    res.json({
      path: path,
      data: latestData
    })
  })

  // POST: Send a message to a specific topic via the REST path
  router.post(path, (req, res) => {
    const { topic, message } = req.body
    
    const payload = typeof message === 'object' ? JSON.stringify(message) : message

    aedes.publish({ topic, payload }, (err) => {
      if (err) return res.status(500).json({ error: 'Publish failed' })
      res.json({ 
        success: true, 
        deliveredTo: topic,
        content: message 
      })
    })
  })

  return router
}