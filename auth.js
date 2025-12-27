// =======================
// AUTH CORE
// =======================

// Save session
function loginUser(user) {
  localStorage.setItem("raciiUser", JSON.stringify(user));
}

// Get logged user
function getUser() {
  return JSON.parse(localStorage.getItem("raciiUser"));
}

// Logout
function logout() {
  localStorage.removeItem("raciiUser");
  window.location.href = "/index.html";
}

// Require any login
function requireLogin() {
  const user = getUser();
  if (!user) {
    alert("Please login first");
    window.location.href = "/index.html";
  }
}

// Require client role
function requireClient() {
  const user = getUser();
  if (!user || user.role !== "client") {
    alert("Client access only");
    window.location.href = "/index.html";
  }
}

// Require cook role
function requireCook() {
  const user = getUser();
  if (!user || user.role !== "cook") {
    alert("Cook access only");
    window.location.href = "/index.html";
  }
}

// =======================
// LOGIN / SIGNUP
// =======================

// Signup
function signup(name, email, password, role) {
  const users = JSON.parse(localStorage.getItem("raciiUsers") || "[]");

  if (users.find(u => u.email === email)) {
    alert("User already exists");
    return;
  }

  const user = { name, email, password, role };
  users.push(user);
  localStorage.setItem("raciiUsers", JSON.stringify(users));

  loginUser(user);
  redirectAfterLogin(user);
}

// Login
function login(email, password) {
  const users = JSON.parse(localStorage.getItem("raciiUsers") || "[]");
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  loginUser(user);
  redirectAfterLogin(user);
}

// Redirect based on role
function redirectAfterLogin(user) {
  if (user.role === "cook") {
    window.location.href = "/cook/dashboard.html";
  } else {
    window.location.href = "/index.html";
  }
}
