const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { initializePool } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initializePool();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();