// =================================================================
// 1. IMPORTS & INITIALIZATION
// =================================================================

// Import the Express framework, the core of our backend
const express = require('express');

// Import dotenv to manage environment variables from a .env file
const dotenv = require('dotenv');

// Import CORS (Cross-Origin Resource Sharing) to allow our frontend to make requests to this backend
const cors = require('cors');

// Import our custom database connection function
const connectDB = require('./config/db');

// --- Initialization ---

// Load environment variables from the .env file into process.env
dotenv.config();

// Create an instance of the Express application
const app = express();


// =================================================================
// 2. DATABASE CONNECTION
// =================================================================

// Execute the function to connect to our MongoDB database
connectDB();


// =================================================================
// 3. MIDDLEWARE CONFIGURATION
// =================================================================

// Enable CORS for all routes, allowing our React app to access the API
app.use(cors());

// Configure Express to parse incoming JSON data from request bodies
// This is crucial for handling POST requests with JSON payloads
app.use(express.json());


// =================================================================
// 4. API ROUTE DEFINITIONS
// =================================================================

// --- Test Route ---
// A simple GET route to the root URL to confirm the API is up and running
app.get('/', (req, res) => {
    res.send('Agricultural Farm Management API is successfully running!');
});

// --- Application API Routes ---
// This is the core of our routing. It tells Express that any request
// that starts with the path '/api/users' should be passed to the router
// exported from the './routes/userRoutes' file.
app.use('/api/users', require('./routes/userRoutes'));

/*
 *  As you add more features, you will add their routes here.
 *  For example:
 *  app.use('/api/crops', require('./routes/cropRoutes'));
 *  app.use('/api/tasks', require('./routes/taskRoutes'));
 *  app.use('/api/inventory', require('./routes/inventoryRoutes'));
 */


// =================================================================
// 5. SERVER STARTUP
// =================================================================

// Define the port for the server. It will use the value from the .env file
// or default to 5001 if it's not defined.
const PORT = process.env.PORT || 5001;

// Start the Express server and have it listen on the defined PORT for incoming connections.
// The callback function logs a success message to the console once the server is ready.
app.listen(PORT, () => console.log(`Server successfully started and is listening on port ${PORT}`));