import aedesFactory from 'aedes'
import { createServer } from 'net'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Sensor } from './db.js' // Import the model

const config = JSON.parse(readFileSync(join(process.cwd(), 'src', 'config.json'), 'utf8'))
const aedes = aedesFactory()
const server = createServer(aedes.handle)

export function initMQTT() {
  server.listen(config.mqtt.port, () => {
    console.log(`[MQTT] Broker active on port ${config.mqtt.port}`)
  })

  // Marked as async to allow 'await'
  aedes.on('publish', async (packet, client) => {
    if (client) {
      const topic = packet.topic
      
      // Check if it's a sensor topic
      if (topic.startsWith('sensors/')) {
        try {
          const payload = JSON.parse(packet.payload.toString())
          
          // UPSERT: Find by topic, update data/time, create if missing
          await Sensor.findOneAndUpdate(
            { topic: topic },
            { 
              data: payload, 
              lastUpdated: new Date() 
            },
            { upsert: true }
          )
          
          console.log(`[DB] Saved state for: ${topic}`)
        } catch (e) {
          console.log(`[ERROR] JSON/DB Error: ${e.message}`)
        }
      }
    }
  })

  return aedes
}