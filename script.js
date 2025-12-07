/* ---------------- SIDEBAR TOGGLE ---------------- */
const sidebar = document.getElementById('sidebar');
document.querySelectorAll('.top-menu a, .sidebar button').forEach(el => {
  el.addEventListener('click', () => { sidebar.classList.remove('show'); });
});

/* ---------------- AUTH MODAL HANDLERS ---------------- */
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

/* ---------------- LOGIN ---------------- */
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

/* ---------------- SIGNUP ---------------- */
document.getElementById('signup-submit').addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const userType = document.getElementById('signup-type').value; // Dropdown added

  // Terms & Conditions checkbox
  const termsCheckbox = document.getElementById(userType === 'cook' ? 'cook-terms' : 'client-terms');
  if (!termsCheckbox || !termsCheckbox.checked) {
    alert('Please agree to the Terms & Conditions');
    return;
  }

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

/* ---------------- GOOGLE LOGIN/SIGNUP PLACEHOLDERS ---------------- */
document.getElementById('google-login').addEventListener('click', () => { alert('Google Login flow'); });
document.getElementById('google-signup').addEventListener('click', () => { alert('Google Signup flow'); });

/* ---------------- REGION/CITY SELECTION ---------------- */
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
// Sidebar toggle for mobile
document.querySelector("header").addEventListener("click", function(e) {
  if (e.target.tagName === "HEADER" || e.target === this) return;
});

document.querySelector("header").onclick = function(e) {
  if (e.target === this) return;
  if (e.target.textContent.includes("☰")) {
    document.getElementById("sidebar").classList.toggle("show");
  }
};
