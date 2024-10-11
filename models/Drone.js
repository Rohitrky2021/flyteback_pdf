const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  drone_type: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Drone = mongoose.model('Drone', DroneSchema);
module.exports = Drone;
