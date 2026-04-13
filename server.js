// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const { JSONFilePreset } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup JSON database
const file = path.join(__dirname, 'db.json');
let db;

// Initialize default data
async function initDB() {
  db = await JSONFilePreset(file, { users: [] });
}
initDB();

// Middleware - CORS
const corsOptions = {
  origin: '*',  // Allow all origins for now (we'll restrict later)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend files from root directory
app.use(express.static(path.join(__dirname)));

// --------- API ROUTES --------- //

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Validate input
    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const userExists = db.data.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const newUser = { 
      id: Date.now(),
      name, 
      email, 
      password: hashedPassword,
      type,
      createdAt: new Date().toISOString()
    };
    
    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({ user: { name, type, id: newUser.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.data.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare hashed password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ user: { name: user.name, type: user.type, id: user.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// --------- SPA catch-all --------- //
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`RACII Server running on http://localhost:${PORT}`);
});
