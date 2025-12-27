function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
  
    if (!email) {
      alert("Please enter email");
      return;
    }
  
    localStorage.setItem(
      "user",
      JSON.stringify({ email: email, role: role })
    );
  
    if (role === "client") {
      window.location.href = "find-cook.html";
    } else {
      window.location.href = "cook/dashboard.html";
    }
  }
  