// Cook Application Form Submission
const cookForm = document.getElementById('cook-application');
if(cookForm){
  cookForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const cookName = document.getElementById('cook-name-input').value;
    const cookBio = document.getElementById('cook-bio-input').value;
    
    localStorage.setItem('cookName', cookName);
    localStorage.setItem('cookBio', cookBio);
    
    alert("✅ Your application has been sent for verification.");
    cookForm.reset();
  });
}

// Cook Profile Page Load
window.addEventListener('DOMContentLoaded', () => {
  const nameElem = document.getElementById('cook-name');
  const bioElem = document.getElementById('cook-bio');

  if(nameElem && bioElem){
    const cookName = localStorage.getItem('cookName') || "[Cook Name]";
    const cookBio = localStorage.getItem('cookBio') || "Meet your cook — passionate about sharing home flavors and stories from their kitchen.";

    nameElem.textContent = cookName;
    bioElem.textContent = cookBio;
  }

  // Booking Page Dynamic Price
  const experienceSelect = document.getElementById('experience-type');
  const priceSpan = document.getElementById('price');
  if(experienceSelect && priceSpan){
    experienceSelect.addEventListener('change', () => {
      let price = 0;
      switch(experienceSelect.value){
        case '🍽️ Eat Only': price = 20; break;
        case '🍷 Join While Cooking': price = 35; break;
        case '🎓 Learn to Cook': price = 50; break;
      }
      priceSpan.textContent = `€${price}`;
    });
    // trigger initial price
    experienceSelect.dispatchEvent(new Event('change'));
  }
});
