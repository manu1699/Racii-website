function bookCook(cookName) {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  
    bookings.push({
      type: "client",
      cookName: cookName,
      date: new Date().toDateString(),
      time: "7:00 PM"
    });
  
    localStorage.setItem("bookings", JSON.stringify(bookings));
  
    alert("Booking successful!");
    window.location.href = "my-bookings.html";
  }
  