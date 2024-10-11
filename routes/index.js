const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const droneController = require('../controllers/droneController');
const missionController = require('../controllers/missionController');
const simulationController = require('../controllers/simulationController');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Drone routes
router.post('/drones', auth, droneController.createDrone);
router.get('/drones', auth, droneController.getDrones);
router.put('/drones/:id', auth, droneController.updateDrone);
router.delete('/drones/:id', auth, droneController.deleteDrone);

// Mission routes
router.post('/missions', auth, missionController.createMission);
router.get('/missions', auth, missionController.getMissions);
router.put('/missions/:id', auth, missionController.updateMission);
router.delete('/missions/:id', auth, missionController.deleteMission);

// Simulation routes
router.post('/start-mission', auth, simulationController.startMission);
router.post('/stop', simulationController.stopMission);

router.get('/flight-log/:flight_id', auth, simulationController.getFlightLog);
router.get('/flight-log/:flight_id/pdf', auth, simulationController.getFlightLogPDF);

module.exports = router;
