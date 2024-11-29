const apiBase = "https://openapi.programming-hero.com/api/peddy";

// Scroll to Adopt Section
function scrollToAdoptSection() {
  document.getElementById("adopt-section").scrollIntoView({ behavior: "smooth" });
}

// Fetch categories and pets on load
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchAllPets();
});

// Fetch categories
function fetchCategories() {
  fetch(`${apiBase}/categories`)
    .then((response) => response.json())
    .then((data) => {
      const categories = data.categories;
      const categoriesDiv = document.getElementById("categories");

      categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className = "btn btn-outline btn-primary";
        button.onclick = () => fetchPetsByCategory(category);
        categoriesDiv.appendChild(button);
      });
    });
}

// Fetch all pets
function fetchAllPets() {
  fetch(`${apiBase}/pets`)
    .then((response) => response.json())
    .then((data) => displayPets(data.pets));
}

// Display pets
function displayPets(pets) {
  const petsGrid = document.getElementById("pets-grid");
  petsGrid.innerHTML = "";

  pets.forEach((pet) => {
    const petCard = document.createElement("div");
    petCard.className = "card bg-base-100 shadow-xl";
    petCard.innerHTML = `
      <figure><img src="${pet.image || 'placeholder.jpg'}" alt="${pet.name}" class="w-full h-48 object-cover"></figure>
      <div class="card-body">
        <h2 class="card-title">${pet.name}</h2>
        <p>${pet.breed || "Unknown Breed"}</p>
        <p>Price: $${pet.price || "0"}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-secondary" onclick="likePet('${pet.image}')">Like</button>
          <button class="btn btn-primary" onclick="adoptPet(this)">Adopt</button>
        </div>
      </div>
    `;
    petsGrid.appendChild(petCard);
  });
}

// Fetch pets by category
function fetchPetsByCategory(category) {
  fetch(`${apiBase}/category/${category}`)
    .then((response) => response.json())
    .then((data) => displayPets(data.pets));
}

// Sort pets by price
document.getElementById("sort-price-btn").addEventListener("click", () => {
  const petsGrid = document.getElementById("pets-grid");
  const pets = Array.from(petsGrid.children);
  pets.sort((a, b) => {
    const priceA = parseFloat(a.querySelector(".card-body p:nth-child(3)").innerText.split("$")[1]);
    const priceB = parseFloat(b.querySelector(".card-body p:nth-child(3)").innerText.split("$")[1]);
    return priceB - priceA;
  });
  pets.forEach((pet) => petsGrid.appendChild(pet));
});

// Like a pet
function likePet(image) {
  const likedGrid = document.querySelector(".liked-grid");
  const img = document.createElement("img");
  img.src = image || "placeholder.jpg";
  img.className = "w-full h-40 object-cover rounded-lg";
  likedGrid.appendChild(img);
}

// Adopt a pet
function adoptPet(button) {
  button.disabled = true;
  button.innerText = "Adopting...";
  setTimeout(() => {
    button.innerText = "Adopted";
  }, 2000);
}
