function getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  
  function requireLogin() {
    if (!getUser()) {
      window.location.href = "login.html";
    }
  }
  
  function requireClient() {
    const user = getUser();
    if (!user || user.role !== "client") {
      window.location.href = "login.html";
    }
  }
  
  function requireCook() {
    const user = getUser();
    if (!user || user.role !== "cook") {
      window.location.href = "../login.html";
    }
  }
  
  function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
  