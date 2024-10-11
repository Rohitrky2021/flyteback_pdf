# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of your application code
COPY . .

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"] # or ["npm", "start"] if you have a start script defined in package.json
