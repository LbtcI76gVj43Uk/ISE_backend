import aedesFactory from 'aedes'
import { createServer } from 'net'
import { Sensor } from './db.js'
import { config } from './config.js'

const aedes = aedesFactory()
const server = createServer(aedes.handle)

const sensorTopic = config.mqtt.sensorTopic

export function initMQTT() {
  const MQTT_PORT = process.env.MQTT_PORT || 1883
  server.listen(MQTT_PORT, () => {
    console.log(`[MQTT] Broker active on port ${MQTT_PORT}`)
  })

  // async to allow await
  aedes.on('publish', async (packet, client) => {
    if (client) {
      const topic = packet.topic
      
      // check for correct sub topic
      if (topic.startsWith(sensorTopic)) {
        try {
          const payload = JSON.parse(packet.payload.toString())
          
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
