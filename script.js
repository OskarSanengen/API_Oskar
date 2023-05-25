const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=8b0c06bb`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
  closeButton.addEventListener('click', () => {
    searchList.classList.add('hide-search-list');
  });
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add('search-list-item');
    if (movies[idx].Poster != "N/A")
      moviePoster = movies[idx].Poster;
    else
      moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
          <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
          <h3>${movies[idx].Title}</h3>
          <p>${movies[idx].Year}</p>
    
      </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = "";
      const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=8b0c06bb`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  // HTML-koden för att visa detaljerna när man öppnar en film och går in på den
    resultGrid.innerHTML = `
      <div class="movie-poster">
          <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
      </div>
      <div class="movie-info">
          <h3 class="movie-title">${details.Title}</h3>
          <ul class="movie-misc-info">
              <li class="year">Year: ${details.Year}</li>
              <li class="rated">Ratings: ${details.Rated}</li>
              <li class="released">Released: ${details.Released}</li>
          </ul>
          <p class="genre"><b>Genre:</b> ${details.Genre}</p>
          <p class="writer"><b>Writer:</b> ${details.Writer}</p>
          <p class="actors"><b>Actors: </b>${details.Actors}</p>
          <p class="rating"><b>Rating: <i class="Rating:"></i></b> 
          ${      details.imdbRating}</p>
          <p class="plot"><b>Plot:</b> ${details.Plot}</p>
          <p class="language"><b>Language:</b> ${details.Language}</p>
          <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    
          <div class="close-button">
              <button onclick="closeMovieDetails()">Close</button>
          </div>
      `;
    }

    function closeMovieDetails() {
    resultGrid.innerHTML = "";
    }


//Koden för att kunna sortera och filtrera sökresultaten
const sortMenu = document.createElement('div');
sortMenu.classList.add('sort-menu');

const sortLabel = document.createElement('label');
sortLabel.setAttribute('for', 'sort-select');
sortLabel.textContent = 'Sort by: ';

const sortSelect = document.createElement('select');
sortSelect.setAttribute('id', 'sort-select');

const options = [
  { value: 'title', text: 'Title' },
  { value: 'year', text: 'Year' },
];

options.forEach(option => {
  const sortOption = document.createElement('option');
  sortOption.setAttribute('value', option.value);
  sortOption.textContent = option.text;
  sortSelect.appendChild(sortOption);
});

sortMenu.appendChild(sortLabel);
sortMenu.appendChild(sortSelect);

// Append the sorting menu to the desired container element
const sortingContainer = document.getElementById('sorting-container');
sortingContainer.appendChild(sortMenu);

// Event listener for sorting menu change
sortSelect.addEventListener('change', () => {
  const selectedOption = sortSelect.value;
  // Call the appropriate sorting function based on the selected option
  switch (selectedOption) {
    case 'title':
      // kalla funktionen för att sortera filmer efter titel
      sortMoviesByTitle();
      break;
    case 'year':
      // kalla funktionen för att söka filmer efter år
      sortMoviesByYear();
      break;
    case 'title':
  }
});
    
    // Sortera efter titel
    function sortMoviesByTitle() {
    // Hämta filmerna
    const movieItems = Array.from(searchList.getElementsByClassName('search-list-item'));
    //Sortera baserat på titeln
    movieItems.sort((a, b) => {
    const titleA = a.querySelector('h3').textContent;
    const titleB = b.querySelector('h3').textContent;
    return titleA.localeCompare(titleB);
    });
    // Visa de sorterade sökresultaten i söklistan
    movieItems.forEach(item => searchList.appendChild(item));
    }
    
    // Sortera efter år
    function sortMoviesByYear() {
    // Hämta filmerna
    const movieItems = Array.from(searchList.getElementsByClassName('search-list-item'));
    // Sortera baserat på årtalet
    movieItems.sort((a, b) => {
    const yearA = a.querySelector('p').textContent;
    const yearB = b.querySelector('p').textContent;
    return yearA.localeCompare(yearB);
    });
    // Visa de sorterade sökresultaten i söklistan
    movieItems.forEach(item => searchList.appendChild(item));
    }
    

