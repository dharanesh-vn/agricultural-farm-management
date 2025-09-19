// Filename: server/server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// --- 1. MOCK DATABASE INITIALIZATION ---
// In a real application, your database connection logic would go here.
// For now, we'll just define our data.

let mockAuctions = [
  { id: 1, item: 'Organic Wheat (1 Ton)', currentBid: 300, bidder: 'FarmCo', timeLeft: '12h 30m' },
  { id: 2, item: 'Fresh Corn (500kg)', currentBid: 150, bidder: 'FreshFoods', timeLeft: '2d 4h' },
  { id: 3, item: 'Soybeans (2 Tons)', currentBid: 450, bidder: 'AgriCorp', timeLeft: '1d 8h' },
];

const mockWeather = {
  current: { temp: 28, condition: 'Sunny', humidity: '65%', wind: '10 km/h' },
  forecast: [
    { day: 'Tomorrow', temp: 26, condition: 'Light Rain' },
    { day: 'Friday', temp: 29, condition: 'Partly Cloudy' },
  ]
};

const mockInventory = [
  { id: 101, name: 'Fertilizer Type A', quantity: 50, unit: 'bags' },
  { id: 102, name: 'Pesticide X', quantity: 25, unit: 'liters' },
  { id: 103, name: 'Tractor Seeds', quantity: 120, unit: 'kg' },
  { id: 104, name: 'Tractor Fuel', quantity: 500, unit: 'liters' },
];

// Log that the "database" is ready
console.log('[INFO] Mock Database Initialized Successfully.');

// --- 2. MIDDLEWARE SETUP ---

// Standard middleware
app.use(cors());
app.use(express.json());

// Custom Logger Middleware: This will run for EVERY request and log it.
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next(); // This passes control to the next middleware or route handler
});

console.log('[INFO] Middleware configured.');

// --- 3. API ENDPOINTS ---

// Dashboard Data
app.get('/api/dashboard', (req, res) => {
  res.json({
    cropStatus: [
      { name: 'Wheat', status: 'Growing (75% maturity)' },
      { name: 'Corn', status: 'Harvesting Soon (Scheduled for next week)' },
      { name: 'Soybeans', status: 'Planting Phase' },
    ],
    alerts: [
      'Low moisture detected in Sector A.',
      'Tractor #3 maintenance is due.',
      'Pest activity reported near Sector C.',
    ],
  });
});

// Auctions Data
app.get('/api/auctions', (req, res) => {
  res.json(mockAuctions);
});

// Handle a new bid on an auction
app.post('/api/auctions/:id/bid', (req, res) => {
  const { id } = req.params;
  const { bidAmount, bidderName } = req.body;
  
  const auction = mockAuctions.find(a => a.id == id);
  
  if (auction && bidAmount > auction.currentBid) {
    auction.currentBid = bidAmount;
    auction.bidder = bidderName;
    console.log(`[SUCCESS] New bid of $${bidAmount} placed on auction #${id}`);
    res.json(auction);
  } else {
    console.log(`[ERROR] Failed bid on auction #${id}. Bid amount was too low.`);
    res.status(400).json({ message: 'Bid must be higher than the current bid.' });
  }
});

// Weather Data
app.get('/api/weather', (req, res) => {
  res.json(mockWeather);
});

// Inventory Data
app.get('/api/inventory', (req, res) => {
  res.json(mockInventory);
});

console.log('[INFO] API Endpoints defined.');

// --- 4. START THE SERVER ---

app.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`[SUCCESS] Server is running and listening on http://localhost:${PORT}`);
  console.log('API Endpoints are now available for the client.');
  console.log('-------------------------------------------');
});