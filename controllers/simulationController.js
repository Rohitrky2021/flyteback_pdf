const FlightLog = require('../models/FlightLog');
const Mission = require('../models/Mission');
const Drone = require('../models/Drone');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path'); // To handle file paths


// Simple Haversine Formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

exports.startMission = async (req, res) => {
  const { drone_id, mission_id } = req.body;

  try {
    const mission = await Mission.findById(mission_id);
    const drone = await Drone.findById(drone_id);

    if (!mission || !drone) {
      return res.status(404).json({ message: 'Drone or Mission not found' });
    }

    const flight_id = uuidv4();
    const waypoints = mission.waypoints;
    const speed = mission.speed; // meters per second

    let distance = 0;
    let timeElapsed = 0;

    const logEntries = waypoints.map((point, index) => {
      const prevPoint = waypoints[index - 1];
      if (prevPoint) {
        const distBetweenPoints = calculateDistance(prevPoint.lat, prevPoint.lng, point.lat, point.lng);
        distance += distBetweenPoints;
        timeElapsed += distBetweenPoints / speed;
      }

      return {
        time: timeElapsed,
        alt: point.alt,
        lat: point.lat,
        lng: point.lng
      };
    });

    const flightLog = new FlightLog({
      flight_id,
      drone_id: drone._id,
      mission_name: mission.name,
      waypoints: logEntries,
      speed,
      distance,
      execution_start: new Date(),
      execution_end: new Date(new Date().getTime() + timeElapsed * 1000)
    });

    await flightLog.save();
    res.status(200).json({ message: 'Mission started', flight_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stopMission = async (req, res) => {
    const { flight_id } = req.body;
  
    try {
      // Find the flight log by flight_id
      const flightLog = await FlightLog.findOne({ flight_id });
  
      if (!flightLog) {
        return res.status(404).json({ message: 'Flight log not found' });
      }
  
      // Check if the mission has already ended
      if (flightLog.execution_end && new Date(flightLog.execution_end) < new Date()) {
        return res.status(400).json({ message: 'Mission already stopped' });
      }
  
      // Update the flight log with the new end time
      flightLog.execution_end = new Date();
      await flightLog.save();
  
      res.status(200).json({
        message: 'Mission stopped',
        flight_id: flightLog.flight_id,
        execution_end: flightLog.execution_end
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

exports.getFlightLog = async (req, res) => {
  try {
    const flightLog = await FlightLog.findOne({ flight_id: req.params.flight_id });
    if (!flightLog) {
      return res.status(404).json({ message: 'Flight log not found' });
    }

    res.status(200).json(flightLog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getFlightLogPDF = async (req, res) => {
  try {
    const flightLog = await FlightLog.findOne({ flight_id: req.params.flight_id });
    if (!flightLog) {
      return res.status(404).json({ message: 'Flight log not found' });
    }

    const doc = new PDFDocument();
    const filename = `FlightLog-${flightLog.flight_id}.pdf`;
    const filePath = path.join(__dirname, '../pdfs/', filename); // Save PDF in a local folder named 'pdfs'

    // Create folder if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../pdfs/'))) {
      fs.mkdirSync(path.join(__dirname, '../pdfs/'));
    }

    // Write the PDF to the local file system
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(20).text(`Flight Log for Flight ID: ${flightLog.flight_id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Drone ID: ${flightLog.drone_id}`);
    doc.text(`Mission Name: ${flightLog.mission_name}`);
    doc.text(`Execution Start: ${flightLog.execution_start}`);
    doc.text(`Execution End: ${flightLog.execution_end}`);
    doc.text(`Total Distance: ${flightLog.distance} meters`);
    doc.moveDown();

    // List waypoints
    doc.fontSize(14).text('Waypoints:', { underline: true });
    flightLog.waypoints.forEach((waypoint, index) => {
      doc.text(
        `Waypoint ${index + 1} - Time: ${waypoint.time}s, Lat: ${waypoint.lat}, Lng: ${waypoint.lng}, Alt: ${waypoint.alt}m`
      );
    });

    // Finalize the PDF file
    doc.end();

    // Wait for the PDF to be saved to the file system
    writeStream.on('finish', async () => {
      // Optionally store the PDF as binary data in MongoDB
      // You could save it to a separate collection or in the flight log document
      const pdfData = fs.readFileSync(filePath);
      flightLog.pdf_data = pdfData; // Assuming you add a 'pdf_data' field to your FlightLog schema
      await flightLog.save();

      // Respond with the path or URL to the PDF
      const pdfUrl = `${req.protocol}://${req.get('host')}/pdfs/${filename}`;
      res.status(200).json({ message: 'Flight log PDF generated', pdfUrl });
    });

    writeStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ message: 'Error generating PDF' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
