import mongoose from 'mongoose'

export async function connectToDatabase() {
  try {
    const host = process.env.MONGO_HOST || 'db' 
    const port = process.env.MONGO_PORT || 27017 
    const uri = `mongodb://${host}:${port}/ise_iot`
    //const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ise_iot'
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