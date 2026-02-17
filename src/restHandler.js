import express from 'express'
import { Sensor } from './db.js'

const router = express.Router()

export default (aedes) => {
  // GET: Fetch all sensor states from MongoDB
  router.get('/sensor-data', async (req, res) => {
    try {
      const states = await Sensor.find()
      res.json(states)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  return router
}