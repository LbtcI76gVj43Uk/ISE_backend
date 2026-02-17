import aedesFactory from 'aedes'
import { createServer } from 'net'
import { readFileSync } from 'fs'
import { join } from 'path'

const configPath = join(process.cwd(), 'src', 'config.json')
const config = JSON.parse(readFileSync(configPath, 'utf8'))

const aedes = aedesFactory()
const server = createServer(aedes.handle)
const { port } = config.mqtt

export function initMQTT() {
  server.listen(port, () => {
    console.log(`[MQTT] Broker active on port ${port}`)
  })

  aedes.on('publish', (packet, client) => {
    if (client) {
      const topic = packet.topic
      
      // Match the wildcard sensors/#
      if (topic.startsWith('sensors/')) {
        try {
          const message = JSON.parse(packet.payload.toString())
          console.log(`[SENSOR DATA] Received on ${topic}:`, message)
          
          // Echo specific parts of the JSON
          // If message is { "temp": 22 }, this echoes "22"
          console.log(`[ECHO] Value is: ${JSON.stringify(message)}`)
        } catch (e) {
          console.log(`[ERROR] Received non-JSON data on ${topic}`)
        }
      }
    }
  })

  return aedes
}