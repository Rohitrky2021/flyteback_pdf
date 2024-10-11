const mongoose = require('mongoose');

const FlightLogSchema = new mongoose.Schema({
  flight_id: { type: String, unique: true },
  drone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Drone', required: true },
  mission_name: { type: String, required: true },
  waypoints: [
    {
      time: { type: Number, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      alt: { type: Number, required: true }
    }
  ],
  speed: { type: Number, required: true },
  distance: { type: Number, required: true },
  execution_start: { type: Date, required: true },
  execution_end: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
    pdf_data: Buffer, // To store the binary PDF data

});

const FlightLog = mongoose.model('FlightLog', FlightLogSchema);
module.exports = FlightLog;
