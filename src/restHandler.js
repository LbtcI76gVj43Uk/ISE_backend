import express from 'express'
import { spawn } from 'child_process'
import { join } from 'path'
import { readFileSync } from 'fs'
import { Sensor } from './db.js'

const router = express.Router()
const config = JSON.parse(readFileSync(join(process.cwd(), 'src', 'config.json'), 'utf8'))

// Assuming mainPath is "/api" and we add the suffix
const navPath = '/university-parking-assistant/navigation-session'
const dbPath = '/university-parking-assistant/db'

export default (aedes) => {

    // GET: Fetch all sensor states from MongoDB
  router.get(dbPath, async (req, res) => {
    try {
      const states = await Sensor.find()
      res.json(states)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  router.post(navPath, (req, res) => {
    // 1. Read body from user
    const inputData = JSON.stringify(req.body)
    
    // 2. Determine paths for venv and script
    const pythonExecutable = join(process.cwd(), '.venv', 'Scripts', 'python.exe') // Adjust for Linux: 'venv/bin/python'
    const scriptPath = join(process.cwd(), 'src', 'algorithm.py')

    // 3. Start the algorithm with params from body
    const pythonProcess = spawn(pythonExecutable, [scriptPath, inputData])

    let output = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    // 4. Algorithm determines result and process closes
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[PYTHON ERROR]: ${errorOutput}`)
        return res.status(500).json({ error: 'Algorithm failed' })
      }

      try {
        // 5. Backend sends (posts) result back to the user
        const result = JSON.parse(output)
        res.json(result)
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse algorithm response' })
      }
    })
  })

  return router
}