import express from 'express'
import { spawn } from 'child_process'
import { join } from 'path'
import { Sensor } from './db.js'
import { config } from './config.js'

const router = express.Router()

const navPath = `${config.rest.basePath}${config.rest.subpaths['navigation-session']}`
const dbPath = `${config.rest.basePath}${config.rest.subpaths['db']}`

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
    // read incoming body
    const inputData = JSON.stringify(req.body)
    
    // determine paths for venv and script
    const pythonExecutable = join(process.cwd(), 'venv', 'bin', 'python')
    const scriptPath = join(process.cwd(), 'src', 'algorithm.py')

    // algorithm with params from body
    const pythonProcess = spawn(pythonExecutable, [scriptPath, inputData], {
      env: { ...process.env } // This spreads all current env vars into the child process
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
