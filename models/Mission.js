const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  alt: { type: Number, required: true },
  speed: { type: Number, required: true },
  waypoints: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      alt: { type: Number, required: true }
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Mission = mongoose.model('Mission', MissionSchema);
module.exports = Mission;
