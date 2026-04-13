// =======================
// AUTH CORE
// =======================

// Save session
function loginUser(user) {
  localStorage.setItem("raciiUser", JSON.stringify(user));
}

// Get logged user
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("raciiUser"));
  } catch (err) {
    return null;
  }
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
    window.location.href = "/login.html";
  }
  return user;
}

// Require client role
function requireClient() {
  const user = getUser();
  if (!user || user.role !== "client") {
    alert("Client access only");
    window.location.href = "/index.html";
  }
  return user;
}

// Require cook role
function requireCook() {
  const user = getUser();
  if (!user || user.role !== "cook") {
    alert("Cook access only");
    window.location.href = "/index.html";
  }
  return user;
}

// Get API base URL
function getApiUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return window.location.origin;
}

