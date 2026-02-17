import mongoose from 'mongoose'

export async function connectToDatabase() {
  try {
    // Replace with your MongoDB URI (local or Atlas)
    const uri = 'mongodb://127.0.0.1:27017/ise_iot'
    await mongoose.connect(uri)
  } catch (err) {
    console.error('[DB] Connection error:', err)
    process.exit(1)
  }
}

// Define a Schema for your sensors
const sensorSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  data: mongoose.Schema.Types.Mixed,
  lastUpdated: { type: Date, default: Date.now }
})

export const Sensor = mongoose.model('Sensor', sensorSchema)