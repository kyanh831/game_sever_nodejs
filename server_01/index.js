const express = require('express');
const { connectToMongoDB } = require('./server');
const { handleClientEvent, handleGameEvent,handleGamePlayEvent } = require('./controller');
const app = express();
const port = process.env.PORT || 3000;
const clients = [];
const WebSocket = require('ws');
async function startServer() {
  try {
    const db = await connectToMongoDB();
    const wss = new WebSocket.Server({ port: port });

    wss.on('connection', (socket) => {
      console.log(`New client connected: ${socket._socket.remoteAddress}`);
      clients.push(socket);
      socket.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case 'game':
            handleGameEvent(message, socket, db, clients);
            break;
          case 'inGame':
            handleGamePlayEvent(message, socket, db, clients);
            break;
          default:
            handleClientEvent(message, socket, db);
            break;
        }
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
