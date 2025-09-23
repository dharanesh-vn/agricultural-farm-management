// This is the very first line of the application. It guarantees all .env variables are loaded.
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { socketLogic } = require('./sockets/socketHandler');

// Connect to Database (now guaranteed to have the MONGO_URI)
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});

// Attach Real-Time Logic
socketLogic(io);

app.set('socketio', io);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));