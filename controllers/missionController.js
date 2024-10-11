const Mission = require('../models/Mission');

exports.createMission = async (req, res) => {
  const { name, alt, speed, waypoints } = req.body;

  try {
    const mission = new Mission({
      name,
      alt,
      speed,
      waypoints
    });
    await mission.save();
    res.status(201).json(mission);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find({});
    res.status(200).json(missions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    mission.name = req.body.name || mission.name;
    mission.alt = req.body.alt || mission.alt;
    mission.speed = req.body.speed || mission.speed;
    mission.waypoints = req.body.waypoints || mission.waypoints;
    mission.updated_at = Date.now();

    await mission.save();
    res.status(200).json(mission);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    await Mission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Mission removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
