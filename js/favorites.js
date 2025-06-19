window.addEventListener('DOMContentLoaded', displayFavorites);

let jsonData = []; // Store fetched JSON data

// Fetch and populate dropdown
async function fetchDataAndPopulateDropdown() {
  try {
    const response = await fetch('games.json'); 
    const data = await response.json(); 
    jsonData = data;

    const dropdown = document.getElementById('favoritesDropdown');
    dropdown.innerHTML = '<option value="">--Select--</option>';

    data.forEach((item) => {
      const option = document.createElement('option');
      option.title = item.title;
      option.link = item.link;
      option.image = item.image;
      option.textContent = item.title;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndPopulateDropdown();

// Handle confirm click
function saveFavorite() {
  const dropdown = document.getElementById('favoritesDropdown');
  const selectedIndex = dropdown.selectedIndex;
  document.getElementById('addfavorite').classList.remove("show");

  if (selectedIndex > 0) {
    const selectedOption = dropdown.options[selectedIndex];
    const favoriteItem = {
      title: selectedOption.title,
      link: selectedOption.link,
      image: selectedOption.image
    };
    let savedFavorites = JSON.parse(localStorage.getItem("selectedFavorites")) || [];
    savedFavorites.push(favoriteItem);
    localStorage.setItem("selectedFavorites", JSON.stringify(savedFavorites));
    console.log("Saved favorite:", favoriteItem);
  }
}

function addFavorite() {
  const addfavorite = document.getElementById("addfavorite");
  addfavorite.classList.toggle("show");
}

function toggleFavorite() {
  const favorite = document.getElementById("favorite");
  favorite.classList.toggle("show");
}

function displayFavorites() {
  const favoritesContainer = document.getElementById('favorites-container');

favoritesContainer.innerHTML = `
  <div id="closeFavoriteBtn" onclick="toggleFavorite()">
    <i class="fas fa-times close-icon"></i>  <!-- Font Awesome X icon -->
  </div>
  <div class="favorite-blockadd" onclick="addFavorite()">
    <p>Add a favorite</p>
  </div>
`;




  const savedFavorites = JSON.parse(localStorage.getItem('selectedFavorites')) || [];

  if (savedFavorites.length === 0) {
    document.getElementById('favp').style.display = 'block';
    return;
  }

  document.getElementById('favp').style.display = 'none';

  savedFavorites.forEach((favorite, index) => {
    const favDiv = document.createElement('div');
    favDiv.className = 'favorite-block';
    favDiv.innerHTML = `
      <a href="${favorite.link}">
        <img src="${favorite.image}"><p>${favorite.title}</p>
      </a>
      <button onclick="deleteFavorite(${index});">ⓧ</button>
    `;
    favoritesContainer.appendChild(favDiv);
  });
}

function deleteFavorite(index) {
  let savedFavorites = JSON.parse(localStorage.getItem('selectedFavorites')) || [];
  savedFavorites.splice(index, 1);
  localStorage.setItem('selectedFavorites', JSON.stringify(savedFavorites));
  displayFavorites();
}
