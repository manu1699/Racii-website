const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const { JSONFilePreset } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const file = path.join(__dirname, 'db.json');

let db;

// ---------- INIT DB SAFELY ----------
async function initDB() {
  db = await JSONFilePreset(file, { users: [] });
  console.log("DB initialized");
}
initDB();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Wait middleware (prevents crash if DB not ready)
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: "Database not ready yet" });
  }
  next();
});

// ---------- SIGNUP ----------
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = db.data.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

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

    res.status(201).json({
      user: {
        id: newUser.id,
        name,
        type
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- LOGIN ----------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.data.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcryptjs.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        type: user.type
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- HEALTH ----------
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// ---------- STATIC FRONTEND ----------
app.use(express.static(path.join(__dirname)));

// ---------- CATCH ALL ----------
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: "API not found" });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});