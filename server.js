const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { JSONFilePreset } = require("lowdb/node");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- HEALTH CHECK ----------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RACII backend running locally"
  });
});

// ---------------- DB ----------------
const file = path.join(__dirname, "db.json");
let db;

// ---------------- INIT DB ----------------
async function initDB() {
  db = await JSONFilePreset(file, {
    users: [],
    cooks: [],
    orders: []
  });

  console.log("✅ DB Ready");

  startServer();
}

// ---------------- SIGNUP ----------------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = db.data.users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      type,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(user);
    await db.write();

    res.status(201).json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ---------------- LOGIN ----------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.data.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---------------- COOKS ----------------
app.post("/api/cooks", async (req, res) => {
  try {
    const cook = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    db.data.cooks.push(cook);
    await db.write();

    res.status(201).json(cook);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cook creation failed" });
  }
});

app.get("/api/cooks", (req, res) => {
  res.json(db.data.cooks);
});

// ---------------- ORDERS ----------------
app.post("/api/orders", async (req, res) => {
  try {
    const order = {
      id: Date.now().toString(),
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString()
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

// ---------------- FALLBACK ----------------
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API not found" });
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------- START SERVER ----------------
function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 RACII running locally on http://localhost:${PORT}`);
  });
}

// ---------------- BOOT ----------------
initDB();
// ---------------- BOOKINGS ----------------
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = {
      id: Date.now().toString(),
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    db.data.bookings.push(booking);
    await db.write();

    res.status(201).json(booking);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    res.json(db.data.bookings || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to load bookings" });
  }
});