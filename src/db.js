import mongoose from 'mongoose'

export async function connectToDatabase() {
  try {
    const uri = 'mongodb://localhost:27017/ise_iot' //only locally served
    await mongoose.connect(uri)
  } catch (err) {
    console.error('[DB] Connection error:', err)
    process.exit(1)
  }
}

// sensor schema
const sensorSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  data: mongoose.Schema.Types.Mixed,
  lastUpdated: { type: Date, default: Date.now }
})

export const Sensor = mongoose.model('Sensor', sensorSchema)