/* ---------------- SIDEBAR TOGGLE ---------------- */
const sidebar = document.getElementById('sidebar');
if (sidebar) {
  document.querySelectorAll('.top-menu a, .sidebar button').forEach(el => {
    el.addEventListener('click', () => { sidebar.classList.remove('show'); });
  });

  const header = document.querySelector("header");
  if (header) {
    header.addEventListener("click", function(e) {
      if (e.target.textContent.includes("☰")) {
        sidebar.classList.toggle("show");
      }
    });
  }
}

/* ---------------- AUTH MODAL HANDLERS ---------------- */
const authModal = document.getElementById('auth-modal');
if (authModal) {
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

  if (authClose) authClose.addEventListener('click', closeAuthModal);
  if (toSignup) toSignup.addEventListener('click', e => { e.preventDefault(); showSignUp(); });
  if (toSignin) toSignin.addEventListener('click', e => { e.preventDefault(); showSignIn(); });
  authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });
}

/* ---------------- LOGIN ---------------- */
const loginBtn = document.getElementById('login-submit');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {

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

        const user = {
          id: data.user.id,
          name: data.user.name,
          type: data.user.type
        };

        // ✅ FIXED STORAGE (important)
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userType', user.type);
        localStorage.setItem('userName', user.name);

        alert('Login successful! Welcome ' + user.name);

        if (authModal) authModal.classList.remove('show');

        // 🔥 FIXED REDIRECT LOGIC
        if (user.type === 'cook') {
          window.location.href = 'cook/dashboard.html';
        } else {
          window.location.href = 'index.html';
        }

      } else {
        alert('Error: ' + data.error);
      }

    } catch (err) {
      console.error(err);
      alert('Connection error. Backend not reachable.');
    }
  });
}

/* ---------------- SIGNUP ---------------- */
const signupBtn = document.getElementById('signup-submit');
if (signupBtn) {
  signupBtn.addEventListener('click', async () => {

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const userType = document.getElementById('signup-type')?.value;

    const termsCheckbox = document.getElementById(userType === 'cook' ? 'cook-terms' : 'client-terms');

    if (!name || !email || !password || !userType) {
      alert('Please fill all fields');
      return;
    }

    if (!termsCheckbox || !termsCheckbox.checked) {
      alert('Please agree to Terms & Conditions');
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

        const user = {
          id: data.user.id,
          name: data.user.name,
          type: userType
        };

        // ✅ FIXED STORAGE
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userType', userType);
        localStorage.setItem('userName', user.name);

        alert('Signup successful! Welcome ' + user.name);

        if (authModal) authModal.classList.remove('show');

        // 🔥 FIXED REDIRECT LOGIC
        if (userType === 'cook') {
          window.location.href = 'cook/dashboard.html';
        } else {
          window.location.href = 'index.html';
        }

      } else {
        alert('Error: ' + data.error);
      }

    } catch (err) {
      console.error(err);
      alert('Connection error. Backend not reachable.');
    }
  });
}

/* ---------------- GOOGLE LOGIN/SIGNUP ---------------- */
const googleLogin = document.getElementById('google-login');
if (googleLogin) googleLogin.addEventListener('click', () => alert('Google Login flow'));

const googleSignup = document.getElementById('google-signup');
if (googleSignup) googleSignup.addEventListener('click', () => alert('Google Signup flow'));

/* ---------------- REGION/CITY ---------------- */
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
  const region = document.getElementById('region')?.value;
  const citySelect = document.getElementById('city');
  if (!citySelect) return;

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
  const city = document.getElementById('city')?.value;
  if (!city) {
    alert('Please select a city!');
    return;
  }

  window.location.href = 'find-cook.html?city=' + encodeURIComponent(city);
}