// CRITICAL: Load environment variables FIRST, before any other imports or code.
const dotenv = require('dotenv');
dotenv.config();

// Now, import other modules
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { checkWeatherAPIConnection } = require('./config/weather');

// Create the server from the Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Placeholder socket logic
io.on('connection', (socket) => {
  console.log('✅ User connected via Socket.io:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make socket.io instance available to other parts of the app (e.g., controllers)
app.set('socketio', io);

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  // Check the weather API connection after the server starts
  checkWeatherAPIConnection();
});