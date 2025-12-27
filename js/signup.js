function signup() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
  
    if (!email) {
      alert("Email required");
      return;
    }
  
    localStorage.setItem(
      "user",
      JSON.stringify({ email: email, role: role })
    );
  
    alert("Account created successfully!");
  
    if (role === "client") {
      window.location.href = "find-cook.html";
    } else {
      window.location.href = "cook/dashboard.html";
    }
  }
  