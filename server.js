const express = require('express');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Example API route (optional)
app.get('/api/status', (req, res) => {
  res.json({ msg: 'RACII server is running!' });
});

// Catch-all route: serve index.html for any undefined route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
