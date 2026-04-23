const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializePool } = require('./config/db');

const app = express();

// Middleware
app.use(cors());                        // allow React frontend to connect
app.use(express.json());                // parse incoming JSON requests

// Routes
app.use('/api/search', require('./routes/search'));

// Health check — visit localhost:5000/api/health to confirm server is running
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initializePool();         // connect to Oracle first
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();