# Flyteback PDF Project

## Overview

Flyteback is a drone mission management system that enables users to register, log in, manage drones, create missions, and simulate drone flights. The system also generates PDF flight logs for completed missions, allowing users to track and review flight data easily.

## Features

- **User Authentication:** Register and log in securely.
- **Drone Management:** Perform CRUD operations on drones.
- **Mission Management:** Create, read, update, and delete missions.
- **Mission Simulation:** Start and stop drone missions to simulate flights.
- **PDF Generation:** Generate and download PDF flight logs for completed missions.

## Prerequisites

To run this application, you'll need:

- **Node.js** (version 12 or higher)
- **MongoDB** (local or cloud instance)

## Setup

Follow these steps to set up the project locally:

1. **Clone the repository:**
```
   git clone https://github.com/Rohitrky2021/flyteback_pdf.git
   cd flyteback_pdf
 ```

# Install dependencies
npm install

# Create a .env file in the root directory and add the following environment variables
echo "MONGO_URI=your_mongodb_uri" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "PORT=your_preferred_port" >> .env

# Start the server
npm start
# The server will run on the specified port (default is 5000).


The project is organized as follows:

.
├── app.js                  # Main application setup
├── server.js               # Server initialization
├── routes
│   └── index.js            # API routes
├── controllers
│   ├── droneController.js   # Drone CRUD operations
│   ├── missionController.js  # Mission CRUD operations
│   ├── simulationController.js # Simulation and PDF generation
│   └── userController.js     # User registration and login
├── middlewares
│   └── auth.js              # Authentication middleware
├── models
│   ├── Drone.js             # Drone model
│   ├── FlightLog.js         # Flight log model
│   ├── Mission.js           # Mission model
│   └── User.js              # User model
└── pdfs                     # Directory for generated PDF files

# API Endpoints

## User
- **POST** /api/register      - Register a new user
- **POST** /api/login         - Login a user

## Drones
- **POST** /api/drones        - Create a new drone
- **GET** /api/drones         - Get all drones
- **PUT** /api/drones/:id     - Update a drone
- **DELETE** /api/drones/:id  - Delete a drone

## Missions
- **POST** /api/missions       - Create a new mission
- **GET** /api/missions        - Get all missions
- **PUT** /api/missions/:id    - Update a mission
- **DELETE** /api/missions/:id - Delete a mission

## Simulations
- **POST** /api/start-mission - Start a mission
- **POST** /api/stop          - Stop a mission
- **GET** /api/flight-log/:flight_id - Get flight log details
- **GET** /api/flight-log/:flight_id/pdf - Get flight log as PDF

# Usage
1. Register and log in to obtain an authentication token.
2. Use the token to authenticate requests for managing drones and missions.
3. Create and manage drones and missions using the provided endpoints.
4. Start and stop missions to simulate drone flights.
5. Retrieve flight logs and download them as PDFs.
