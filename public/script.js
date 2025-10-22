// ===== Theme Toggle =====
const toggleBtn = document.getElementById('theme-toggle');
if(toggleBtn){
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
}

// ===== Cook Register =====
const cookForm = document.getElementById('cook-register-form');
if(cookForm){
  cookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cook = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    let cooks = JSON.parse(localStorage.getItem('cooks')) || [];
    cooks.push(cook);
    localStorage.setItem('cooks', JSON.stringify(cooks));
    alert("Cook Registered Successfully!");
    cookForm.reset();
    window.location.href = "cook-login.html";
  });
}

// ===== Cook Login =====
const cookLoginForm = document.getElementById('cook-login-form');
if(cookLoginForm){
  cookLoginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const cooks = JSON.parse(localStorage.getItem('cooks')) || [];
    const cook = cooks.find(c => c.email === email && c.password === password);
    if(cook){
      alert(`Welcome, ${cook.name}!`);
      localStorage.setItem('loggedInCook', JSON.stringify(cook));
      window.location.href = "index.html";
    } else alert("Invalid email or password.");
  });
}

// ===== Client Register/Login (Same as Cook) =====
const clientForm = document.getElementById('client-register-form');
if(clientForm){
  clientForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const client = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
    alert("Client Registered Successfully!");
    clientForm.reset();
    window.location.href = "client-login.html";
  });
}

const clientLoginForm = document.getElementById('client-login-form');
if(clientLoginForm){
  clientLoginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(c => c.email === email && c.password === password);
    if(client){
      alert(`Welcome, ${client.name}!`);
      localStorage.setItem('loggedInClient', JSON.stringify(client));
      window.location.href = "index.html";
    } else alert("Invalid email or password.");
  });
}

// ===== Charts (Orders & Payments) =====
if(document.getElementById('ordersChart')){
  const ordersCtx = document.getElementById('ordersChart').getContext('2d');
  new Chart(ordersCtx, {
    type:'bar',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun'],
      datasets:[
        {label:'Completed Orders', data:[12,19,15,22,18,25], backgroundColor:'#f5e0d3', borderRadius:10},
        {label:'Pending Orders', data:[5,8,6,7,10,5], backgroundColor:'#fce8d5', borderRadius:10}
      ]
    },
    options:{responsive:true, plugins:{legend:{position:'top'}}, scales:{y:{beginAtZero:true}}}
  });
}

if(document.getElementById('paymentsChart')){
  const paymentsCtx = document.getElementById('paymentsChart').getContext('2d');
  new Chart(paymentsCtx, {
    type:'pie',
    data:{
      labels:['Paid','Pending'],
      datasets:[{data:[3800,450], backgroundColor:['#f5e0d3','#fce8d5'], borderColor:['#e6cbb7','#f5d7b0'], borderWidth:2}]
    },
    options:{responsive:true, plugins:{legend:{position:'bottom'}}}
  });
}


const myBookingsBtn = document.getElementById('my-bookings-btn');
const bookingsSection = document.getElementById('my-bookings-section');
const bookingsList = document.getElementById('bookings-list');

myBookingsBtn.addEventListener('click', () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  if(!loggedUser || loggedUser.role !== 'client'){
    alert('Please login as a client to see your bookings!');
    return;
  }

  const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const userBookings = allBookings; // If needed, filter by user, e.g., by username

  bookingsList.innerHTML = '';
  if(userBookings.length === 0){
    bookingsList.innerHTML = '<p>No bookings found.</p>';
  } else {
    userBookings.forEach((b,i) => {
      const div = document.createElement('div');
      div.style.background='rgba(255,255,255,0.9)';
      div.style.margin='8px 0';
      div.style.padding='12px';
      div.style.borderRadius='10px';
      div.innerHTML = `<strong>${b.cookName}</strong> — ${b.date} at ${b.time}, Guests: ${b.guests} <br> Requests: ${b.requests || '-'}`;
      bookingsList.appendChild(div);
    });
  }

  // Scroll to bookings section
  bookingsSection.style.display = 'block';
  bookingsSection.scrollIntoView({behavior:'smooth'});
});
// Redirect to my-bookings with user type
document.getElementById('signup-submit').addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const userType = prompt("Enter user type: 'client' or 'cook'"); 

  if(!name || !email || !password || !userType) {
      alert("Please fill all fields and enter valid user type");
      return;
  }

  try {
      const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, type: userType })
      });

      const data = await response.json();
      if(response.ok){
          alert("Signup successful! Welcome " + data.user.name);
          localStorage.setItem('userType', userType);
          localStorage.setItem('userName', data.user.name);
          closeAuthModal();
          window.location.href = "dashboard.html";
      } else {
          alert("Error: " + data.error);
      }
  } catch(err) {
      console.error(err);
      alert("Something went wrong. Try again later.");
  }
});
