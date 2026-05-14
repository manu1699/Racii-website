const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- IN-MEMORY DB (MVP SAFE) ---------------- */
const db = {
  users: [],
  cooks: [],
  orders: []
};

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "RACII running clean server" });
});

/* ---------------- SIGNUP ---------------- */
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = db.users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      type
    };

    db.users.push(user);

    res.status(201).json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      user: { id: user.id, name: user.name, type: user.type }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ---------------- COOKS ---------------- */
app.post("/api/cooks", (req, res) => {
  const cook = {
    id: Date.now().toString(),
    ...req.body
  };

  db.cooks.push(cook);
  res.status(201).json(cook);
});

app.get("/api/cooks", (req, res) => {
  res.json(db.cooks);
});

/* ---------------- ORDERS ---------------- */
app.post("/api/orders", (req, res) => {
  const order = {
    id: Date.now().toString(),
    ...req.body,
    status: "pending"
  };

  db.orders.push(order);
  res.status(201).json(order);
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 RACII clean server running on http://localhost:${PORT}`);
});