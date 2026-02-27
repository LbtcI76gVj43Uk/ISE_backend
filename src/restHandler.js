import express from 'express'
import { spawn } from 'child_process'
import { join } from 'path'
import { Sensor } from './db.js'
import { config } from './config.js'

const router = express.Router()

// REST paths
const navPath = `${config.rest.basePath}${config.rest.subpaths['navigation-session']}`
const dbPath = `${config.rest.basePath}${config.rest.subpaths['fetch_db']}`
const fetchConfigPath = `${config.rest.basePath}${config.rest.subpaths['fetch_config']}`
const fetchTimeTablePath = `${config.rest.basePath}${config.rest.subpaths['fech_time_table']}`

// hardcoded SQL mock data
const userTimeTable = [
    { day: "Tuesday", subject: "Advanced Topics in Algorithm", room: "LE-1.410", time: "15:45 - 17:20" },
    { day: "Wednesday", subject: "Management and Business Administration", room: "LE-1.375", time: "08:00 - 11:20" },
    { day: "Thursday", subject: "Scientific Methods and Writing", room: "LE-1.204", time: "15:45 - 17:20" },
    { day: "Friday", subject: "Industrial Software Engineering", room: "LE-1.149", time: "09:45 - 13:05" }
  ]

export default (aedes) => {

    // GET: Fetch all sensor states from MongoDB
  router.get(dbPath, async (req, res) => {
    try {
      const userId = req.body['user-id']
      const sessionId = req.body['session-id']

      const states = await Sensor.find()

      res.json({
        "session-id": sessionId,
        "timestamp": Date.now() / 1000,
        "status": states.length > 0 ? "success" : "not_found",
        "user-id": userId,
        "db": states
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // GET: Fetch current config json parameters
  router.get(fetchConfigPath, (req, res) => {
    try {
      const userId = req.body['user-id']
      const sessionId = req.body['session-id']

      res.json({
        "session-id": sessionId,
        "timestamp": Date.now() / 1000,
        "status": Object.keys(config).length > 0 ? "success" : "not_found",
        "user-id": userId,
        "config": config
      })
    } catch (err) {
      res.status(500).json({ error: "Could not retrieve config" })
    }
  })

  // GET: Fetch users time table
  router.get(fetchTimeTablePath, (req, res) => {
    try {
      const userId = req.body['user-id']
      const sessionId = req.body['session-id']

      console.log(`[SQL MOCK] Executing: SELECT * FROM time_tables WHERE user_id = '${userId}'`)

      // return result in json format
      res.json({
        "session-id": sessionId,
        "timestamp": Date.now() / 1000,
        "status": userTimeTable.length > 0 ? "success" : "not_found",
        "user-id": userId,
        "result": {
          "time_table": userTimeTable
        }
      })

    } catch (err) {
      console.error("[SQL MOCK ERROR]:", err)
      res.status(500).json({ 
        error: "Internal Server Error",
        message: "Failed to simulate SQL database query" 
      })
    }
  })

  // POST: Execute recommendation algorithm and send result
  router.post(navPath, (req, res) => {
    // read incoming body
    const inputData = JSON.stringify(req.body)
    
    // determine paths for venv and script
    const pythonExecutable = join(process.cwd(), 'venv', 'bin', 'python')
    const scriptPath = join(process.cwd(), 'src', 'algorithm.py')

    // algorithm with params from body
    const pythonProcess = spawn(pythonExecutable, [scriptPath, inputData], {
      env: { ...process.env }
    })

    let output = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[PYTHON ERROR]: ${errorOutput}`)
        return res.status(500).json({ error: 'Algorithm failed' })
      }

      try {
        // send result
        const result = JSON.parse(output)
        res.json(result)
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse algorithm response' })
      }
    })
  })

  return router
}
