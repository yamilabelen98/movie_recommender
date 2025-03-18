const FeaturedMovies = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowDetailsModal(true);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        🌟 Películas destacadas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.tmdb_id}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleMovieClick(movie)}
          >
            <h3 className="font-semibold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {movie.overview || "Sin descripción"}
            </p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <DetailsModal
          movie={selectedMovie}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};
