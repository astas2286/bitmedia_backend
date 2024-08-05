const { Server } = require('socket.io');

let io;

function init(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

function broadcast(message) {
  if (io) {
    io.emit('message', message);
  }
}

module.exports = { init, broadcast };
