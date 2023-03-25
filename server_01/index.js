const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { connectToMongoDB } = require('./server');
const { handleClientEvent } = require('./controller');
const { emit } = require('process');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    const db = await connectToMongoDB();
    console.log('Connected to MongoDB');

    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);

      socket.on('clientEvent', (data) => {
        handleClientEvent(data, socket, db);
      });
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket}`);
      })
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
