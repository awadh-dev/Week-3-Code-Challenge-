const BASE_URL = "http://localhost:3000/films";
const filmList = document.getElementById("films");
const titleElement = document.getElementById("movie-title");
const posterElement = document.getElementById("movie-poster");
const runtimeElement = document.getElementById("movie-runtime");
const showtimeElement = document.getElementById("movie-showtime");
const ticketsElement = document.getElementById("movie-tickets");
const buyButton = document.getElementById("buy-ticket");
const deleteButton = document.getElementById("delete-movie");

let currentMovie = null;

// 🚀 Load first movie on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});

// 🎬 Fetch all movies and populate the list
function fetchMovies() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            displayMovies(data);
            if (data.length > 0) {
                loadMovieDetails(data[0]);
            }
        });
}

// 📌 Display movies in the sidebar
function displayMovies(movies) {
    filmList.innerHTML = "";
    movies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.dataset.id = movie.id;
        li.addEventListener("click", () => loadMovieDetails(movie));
        filmList.appendChild(li);
    });
}

// 🎥 Load selected movie details
function loadMovieDetails(movie) {
    currentMovie = movie;
    titleElement.textContent = movie.title;
    posterElement.src = movie.poster;
    runtimeElement.textContent = movie.runtime;
    showtimeElement.textContent = movie.showtime;

    const availableTickets = movie.capacity - movie.tickets_sold;
    ticketsElement.textContent = availableTickets > 0 ? availableTickets : "Sold Out";

    buyButton.disabled = availableTickets <= 0;
    buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
}

// 🎟️ Buy Ticket
buyButton.addEventListener("click", () => {
    if (!currentMovie) return;

    let availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
    if (availableTickets > 0) {
        currentMovie.tickets_sold += 1;
        updateTicketsUI();

        // Update server
        fetch(`${BASE_URL}/${currentMovie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold })
        });
    }
});

// 🔄 Update Ticket UI
function updateTicketsUI() {
    let availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
    ticketsElement.textContent = availableTickets > 0 ? availableTickets : "Sold Out";
    buyButton.disabled = availableTickets <= 0;
    buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
}

// ❌ Delete Movie
deleteButton.addEventListener("click", () => {
    if (!currentMovie) return;

    fetch(`${BASE_URL}/${currentMovie.id}`, { method: "DELETE" })
        .then(() => {
            document.querySelector(`li[data-id="${currentMovie.id}"]`).remove();
            fetchMovies();
        });
});
