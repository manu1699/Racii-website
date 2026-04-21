const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { JSONFilePreset } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = 3000;

const file = path.join(__dirname, 'db.json');

let db;

// ---------------- INIT DB ----------------
async function initDB() {
  db = await JSONFilePreset(file, {
    users: [],
    cooks: [],
    orders: []
  });
  console.log("✅ DB Ready");
}
initDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Wait for DB
app.use((req, res, next) => {
  if (!db) return res.status(503).json({ error: "DB not ready" });
  next();
});

// ---------------- HEALTH ----------------
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// ---------------- SIGNUP ----------------
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const exists = db.data.users.find(u => u.email === email);
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      type
    };

    db.data.users.push(user);
    await db.write();

    res.status(201).json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- LOGIN ----------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- COOKS ----------------
app.post('/api/cooks', async (req, res) => {
  try {
    const cook = {
      id: Date.now().toString(),
      ...req.body
    };

    db.data.cooks.push(cook);
    await db.write();

    res.status(201).json(cook);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cook creation failed" });
  }
});

app.get('/api/cooks', (req, res) => {
  res.json(db?.data?.cooks || []);
});


// ---------------- ORDERS ----------------
app.post('/api/orders', async (req, res) => {
  try {
    const order = {
      id: Date.now().toString(),
      ...req.body,
      status: "pending"
    };

    db.data.orders.push(order);
    await db.write();

    res.status(201).json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order failed" });
  }
});

// ---------------- STATIC FRONTEND ----------------
app.use(express.static(path.join(__dirname)));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: "API not found" });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});