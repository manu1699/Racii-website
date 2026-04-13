async function handleSignup(event) {
  event.preventDefault();
  
  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;
  
  // Clear previous messages
  document.getElementById("formError").style.display = "none";
  document.getElementById("formSuccess").style.display = "none";
  
  // Validation
  if (!name || !email || !password || !confirmPassword || !role) {
    showError("formError", "All fields are required");
    return;
  }
  
  if (password.length < 6) {
    showError("passwordError", "Password must be at least 6 characters");
    return;
  }
  
  if (password !== confirmPassword) {
    showError("confirmPasswordError", "Passwords do not match");
    return;
  }
  
  if (!email.includes("@")) {
    showError("emailError", "Invalid email format");
    return;
  }
  
  try {
    // Call backend API
    const response = await fetch("https://racii-website.up.railway.app/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        type: role
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showError("formError", data.error || "Signup failed");
      return;
    }
    
    // Save user to localStorage
    loginUser({ name: data.user.name, email: email, role: role, id: data.user.id });
    
    // Show success message
    document.getElementById("formSuccess").textContent = "✓ Account created successfully!";
    document.getElementById("formSuccess").style.display = "block";
    
    // Redirect after 1 second
    setTimeout(() => {
      if (role === "client") {
        window.location.href = "find-cook.html";
      } else {
        window.location.href = "cook/dashboard.html";
      }
    }, 1000);
    
  } catch (err) {
    console.error("Signup error:", err);
    showError("formError", "Network error. Please check your connection.");
  }
}

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = "✗ " + message;
  element.style.display = "block";
}

// Legacy signup function (kept for backwards compatibility)
function signup() {
  const form = document.getElementById("signupForm");
  if (form && form.reportValidity()) {
    handleSignup(new Event('submit'));
  }
}
  