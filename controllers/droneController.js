const Drone = require('../models/Drone');

exports.createDrone = async (req, res) => {
  const { name, drone_type } = req.body;
  
  try {
    const drone = new Drone({
      name,
      drone_type,
      created_by: req.user.id
    });
    await drone.save();
    res.status(201).json(drone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDrones = async (req, res) => {
  try {
    const drones = await Drone.find({ created_by: req.user.id });
    res.status(200).json(drones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDrone = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone || drone.created_by.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    drone.name = req.body.name || drone.name;
    drone.drone_type = req.body.drone_type || drone.drone_type;
    drone.updated_at = Date.now();

    await drone.save();
    res.status(200).json(drone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteDrone = async (req, res) => {
    try {
      const drone = await Drone.findById(req.params.id); // Correctly find the drone by ID
      console.log(drone);
      console.log(req.params.id);
      
      // Check if drone exists and created_by is valid
      if (!drone || !drone.created_by || drone.created_by.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Drone not found or unauthorized' });
      }
  
      // Correct method to delete the drone
      await Drone.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Drone removed' });
      
    } catch (err) {
      console.error(err); // Log the error for better debugging
      res.status(500).json({ message: 'Server error' });
    }
  };
  
