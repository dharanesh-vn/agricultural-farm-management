// 1. Load Environment variables FIRST
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // app.js contains ALL express configuration
const connectDB = require('./config/db');
const { socketLogic } = require('./sockets/socketHandler');

// 2. Connect to Database
connectDB();

// 3. Create the server using the fully configured Express app
const server = http.createServer(app);

// 4. Configure and attach Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
socketLogic(io);

// We can attach `io` to the app instance if any controllers need it, though it's better to pass it directly.
// For now, this is a safe practice.
app.set('socketio', io);

// 5. Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));