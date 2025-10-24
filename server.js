// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
const PORT = 3000;

// Setup JSON database
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize default data
async function initDB() {
  await db.read();
  db.data ||= { users: [] }; // default empty users array
  await db.write();
}
initDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// --------- API ROUTES --------- //

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password, type } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  await db.read();
  const userExists = db.data.users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { name, email, password, type };
  db.data.users.push(newUser);
  await db.write();

  res.json({ user: { name, type } });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  await db.read();
  const user = db.data.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ user: { name: user.name, type: user.type } });
});

// --------- SPA catch-all --------- //
// Serve index.html for any other route (after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
/* Sidebar toggle */
const sidebar = document.getElementById('sidebar');
document.querySelectorAll('.top-menu a, .sidebar button').forEach(el => {
  el.addEventListener('click', () => { sidebar.classList.remove('show'); });
});

/* Auth modal handlers */
const authModal = document.getElementById('auth-modal');
const openAuthBtns = document.querySelectorAll('#open-auth, .open-auth-sidebar');
const authClose = document.getElementById('auth-close');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const toSignup = document.getElementById('to-signup');
const toSignin = document.getElementById('to-signin');

function lockScroll() { document.body.style.overflow = 'hidden'; }
function unlockScroll() { document.body.style.overflow = ''; }

function openAuthModal() { 
  authModal.classList.add('show'); 
  authModal.setAttribute('aria-hidden', 'false'); 
  showSignIn(); 
  lockScroll(); 
}

function closeAuthModal() { 
  authModal.classList.remove('show'); 
  authModal.setAttribute('aria-hidden', 'true'); 
  unlockScroll(); 
}

function showSignUp() { 
  signinForm.style.display = 'none'; 
  signupForm.style.display = 'block'; 
  document.getElementById('auth-title').innerText = 'Create your RACII account'; 
}

function showSignIn() { 
  signupForm.style.display = 'none'; 
  signinForm.style.display = 'block'; 
  document.getElementById('auth-title').innerText = 'Login to RACII'; 
}

openAuthBtns.forEach(btn => btn.addEventListener('click', e => { 
  e.stopPropagation(); 
  openAuthModal(); 
}));

authClose.addEventListener('click', closeAuthModal);
toSignup.addEventListener('click', e => { e.preventDefault(); showSignUp(); });
toSignin.addEventListener('click', e => { e.preventDefault(); showSignIn(); });
authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });

/* Login integration */
document.getElementById('login-submit').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful! Welcome ' + data.user.name);
      localStorage.setItem('userType', data.user.type);
      localStorage.setItem('userName', data.user.name);
      closeAuthModal();
      window.location.href = 'dashboard.html';
    } else {
      alert('Error: ' + data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Try again later.');
  }
});

/* Signup integration */
document.getElementById('signup-submit').addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const userType = document.getElementById('signup-type').value; // dropdown for 'client' or 'cook'

  if (!name || !email || !password || !userType) {
    alert('Please fill all fields and select user type');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, type: userType })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Signup successful! Welcome ' + data.user.name);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', data.user.name);
      closeAuthModal();
      window.location.href = 'dashboard.html';
    } else {
      alert('Error: ' + data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Try again later.');
  }
});

/* Google login/signup placeholders */
document.getElementById('google-login').addEventListener('click', () => { alert('Google Login flow'); });
document.getElementById('google-signup').addEventListener('click', () => { alert('Google Signup flow'); });

/* Region/City selection */
const italyCities = {
  lombardy: ['Milan','Bergamo','Brescia','Monza','Como'],
  lazio: ['Rome','Frosinone','Viterbo','Latina','Rieti'],
  tuscany: ['Florence','Pisa','Siena','Lucca','Pistoia'],
  sicily: ['Palermo','Catania','Messina','Siracusa','Trapani'],
  veneto: ['Venice','Verona','Padua','Vicenza','Treviso'],
  piemonte: ['Turin','Novara','Alessandria','Asti','Cuneo'],
  campania: ['Naples','Salerno','Caserta','Avellino','Benevento'],
  'emilia-romagna': ['Bologna','Modena','Parma','Ravenna','Rimini']
};

function populateCities() {
  const region = document.getElementById('region').value;
  const citySelect = document.getElementById('city');
  citySelect.innerHTML = '<option value="">Select City</option>';
  if (region && italyCities[region]) {
    italyCities[region].forEach(city => {
      const opt = document.createElement('option');
      opt.value = city.toLowerCase();
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }
}

function searchCooks() {
  const city = document.getElementById('city').value;
  if (!city) { alert('Please select a city!'); return; }
  window.location.href = 'find-cook.html?city=' + encodeURIComponent(city);
}
