const apiKey = "b7734ea396cc9aefa70cfb82d9c0c01e"; // Replace with your TMDb API key
const apiBaseUrl = "https://api.themoviedb.org/3";

$(document).ready(function () {
	// show genres dropdown
	showGenres();

	// Load top movies by default
	showNowPlaying();

	// Event listeners
	$("#btnNowPlaying").on("click", showNowPlaying);
	$("#btnSearch").on("click", searchMovies);
	$("#genreSelect").change(showMoviesByGenre);
});

function showGenres() {
	const genreSelect = $("#genreSelect");
	axios
		.get(`${apiBaseUrl}/genre/movie/list?api_key=${apiKey}`)
		.then((response) => {
			const genres = response.data.genres;
			genres.forEach((genre) => {
				genreSelect.append(`<option value="${genre.id}">${genre.name}</option>`);
			});
		})
		.catch((error) => {
			console.error("Error fetching genres:", error);
		});
}

function showNowPlaying() {
	axios
		.get(`${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`)
		.then((response) => {
			$("#nowPlayiing").show();
			displayMovies(response.data.results);
		})
		.catch((error) => {
			console.error("Error fetching top movies:", error);
		});
}

function showMoviesByGenre() {
	const genreId = $("#genreSelect").val();
	axios
		.get(`${apiBaseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
		.then((response) => {
			$("#nowPlayiing").hide();
			displayMovies(response.data.results);
		})
		.catch((error) => {
			console.error("Error fetching movies by genre:", error);
		});
}

function searchMovies() {
	const searchTerm = $("#searchInput").val();
	axios
		.get(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${searchTerm}`)
		.then((response) => {
			$("#nowPlayiing").show();
			displayMovies(response.data.results);
		})
		.catch((error) => {
			console.error("Error searching movies:", error);
		});
}

function displayMovies(movies) {
	const movieList = $("#movieList");
	movieList.empty();

	movies.forEach((movie) => {
		const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
		const movieCard = `
            <div class="col-md-4 mb-4">
                <div class="card" data-toggle="modal" data-target="#movieModal${movie.id}">
                    <img src="${imageUrl}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">${movie.overview}</p>
                    </div>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="movieModal${movie.id}" role="dialog" aria-labelledby="movieModalLabel${movie.id}" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="movieModalLabel${movie.id}">${movie.title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                            <div class="modal-content-dynamic">
                                <img src="${imageUrl}"  class="img-fluid" alt="${movie.title}">
                            <div class="pl-4 pt-2">
                                <h4>${movie.title}</h4>
                                <p class="font-weight-bold">Release date : ${movie.release_date}</p>
                                <p>${movie.overview}</p>
                                <p class="font-weight-bold">Rating : ${movie?.vote_average}</p>
                            </div>   
                            </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
		movieList.append(movieCard);
	});
}
