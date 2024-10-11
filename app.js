require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');  // Make sure this is here

const app = express();
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
 
// Serve the 'pdfs' directory as static files
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// Use the routes from the 'routes' module
app.use('/api', routes);


module.exports = app;
