const express = require('express');
const { connectToMongoDB } = require('./server');
const { handleClientEvent } = require('./controller');
const app = express();
const port = process.env.PORT || 3000;

const WebSocket = require('ws');
async function startServer() {
  try {
    const db = await connectToMongoDB();
    console.log('Connected to MongoDB');

    const wss = new WebSocket.Server({ port: port });

    wss.on('connection', (socket) => {
      console.log(`New client connected: ${socket._socket.remoteAddress}`);

      socket.on('message', (data) => {
        const message = JSON.parse(data.toString());
        console.log('test:',message);
        handleClientEvent(message, socket, db);
      });
      socket.on('close', () => {
        console.log(`Client disconnected: ${socket._socket.remoteAddress}`);
      })
    });

    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}
startServer();
