
// API Settings
///////////////////
const mainUrl = "http://127.0.0.1:8000/api/v1/titles/";


///////////////////
// Modal Box
///////////////////
function createModal(movieId) {
    fetch(`${mainUrl}${movieId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("movie-info").innerHTML = `
            <h2 style="text-align: center">${data.title}</h2>
            <p style="text-align: center"><img src="${data.image_url}"></p>
            <p><strong>Genre:</strong> ${data.genres}</p>
            <p><strong>Date de sortie:</strong> ${data.date_published}</p>
            <p><strong>Score:</strong> ${data.avg_vote}</p>
            <p><strong>Score IMDb:</strong> ${data.imdb_score}</p>
            <p><strong>Réalisateur(s):</strong> ${data.directors}</p>
            <p><strong>Acteurs:</strong> ${data.actors}</p>
            <p><strong>Durée:</strong> ${data.duration} minutes</p>
            <p><strong>Pays:</strong> ${data.countries}</p>
            <p><strong>Box office:</strong> ${data.worldwide_gross_income}</p>
            <p><strong>Synopsis:</strong> ${data.long_description}</p>
        `;
        const btnClose = document.getElementById("btn-close");
        const modalBox = document.getElementById("modal-box");
        modalBox.style.display = "block";
        showBlur(true);
        btnClose.onclick = () => {
            modalBox.style.display = "none";
            showBlur(false);
        };
        window.onclick = event => {
            if (event.target == modalBox) {
                modalBox.style.display = "none";
                showBlur(false);
            }
        }
    })
    .catch(error => console.log(error))
};

function showBlur(value) {
    let blur;
    value ? blur = "blur(4px)" : blur = "none"
    document.querySelector('main').style.filter = blur;
    document.querySelector('header').style.filter = blur;
};



///////////////////
// Best Movie
///////////////////
function showPreviewBestMovie(movieId) {
    fetch(`${mainUrl}${movieId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("best-movie").innerHTML = `
            <p style="text-align: center"><img src="${data.image_url}"></p>
            <p style="text-align: center"><strong>${data.title}</strong></p>
            <p>${data.description}</p>
        `;
    })
    .catch(error => console.log(error))
};

function getBestMovie() {
    fetch(`${mainUrl}?sort_by=-imdb_score`)
    .then(response => response.json())
    .then(data => {
        const btnMoreInfo = document.getElementById("btn-more-info");
        let movieId = data.results[0].id;
        showPreviewBestMovie(movieId);
        btnMoreInfo.onclick = () => createModal(movieId);
    })
    .catch(error => console.log(error))
};


///////////////////
// Carousel
///////////////////
function addItemToCarousel(movieData) {
    let carousel = movieData.carousel_element;
    let content = carousel.querySelector('.carousel-content')
    let movie = document.createElement("img");
    movie.src = `${movieData.image_url}`;
    movie.alt = `${movieData.title}`
    content.appendChild(movie);
    movie.onclick = () => createModal(movieData.id);
};

function showSlide(carouselElement) {
    let content = carouselElement.querySelector('.carousel-content');
    let values = [[0,-75,25],[-75,0,-25]];
    let buttonArrow = carouselElement.querySelectorAll(".btn-arrow");
    for (let i = 0; i <=1; i++) {
        buttonArrow[i].onclick = () => {
            let newPosition;
            let currentPosition = parseInt(content.getAttribute('data-pos'))
            if (currentPosition == values[i][0]) {
                newPosition = values[i][1]
            } else {
                newPosition = currentPosition + values[i][2]
            }
            content.setAttribute('data-pos', newPosition);
            content.style.left = `${newPosition}%`;
        }
    }
}

async function createCarousel(category, elementId) {
    let carousel = document.getElementById(`${elementId}`);
    let page = 1;
    let currentItem = 1;
    while (currentItem <= 7) {
        await fetch(`
            ${mainUrl}?genre_contains=${category}
            &sort_by=-imdb_score&page=${page}
            `)
        .then(response => response.json())
        .then(data => {
            for (let movie of data.results) {
                if (currentItem <= 7) {
                    movie.carousel_element = carousel;
                    addItemToCarousel(movie);
                    currentItem++;
                } else break;
            }
        })
        .catch(error => console.log(error));
        page++;
    };
    showSlide(carousel);
};


///////////////////
// Run
///////////////////
function main() {
    getBestMovie()
    createCarousel("", "best-movies")
    createCarousel("sci-fi", "sci-fi")
    createCarousel("animation", "animation")
    createCarousel("fantasy", "fantasy")
};

main();
