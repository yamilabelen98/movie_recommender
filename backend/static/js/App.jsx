const genres = [
  { id: "all", name: "Todos los géneros" },
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia ficción" },
  { id: 10770, name: "Película de TV" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" },
];
const sortOptions = [
  { value: "vote_average.desc", label: "⭐ Más populares (más estrellas)" },
  { value: "vote_average.asc", label: "⭐ Menos populares (menos estrellas)" },
  { value: "release_date.desc", label: "🕓 Más recientes (más nuevas)" },
  { value: "release_date.asc", label: "🕓 Más antiguas" },
];

function App() {
  const [movies, setMovies] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const MOVIES_PER_PAGE = 12;
  const [selectedGenre, setSelectedGenre] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("popularity.desc");
  const [featuredMovies, setFeaturedMovies] = React.useState([]);

  // 👉 Al iniciar, que use sortBy y selectedGenre directamente
  React.useEffect(() => {
    fetchMoviesFromBackend(selectedGenre, sortBy);
  }, []);

  const loadPopularMovies = async () => {
    await fetchMoviesFromBackend(selectedGenre, sortBy);
    setIsSearchMode(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setMovies(data);
        console.log("🎥 Películas en estado:", data);
        setIsSearchMode(true);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error al buscar películas:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (query.length === 0) {
      loadPopularMovies();
    }
  };

  const handleMovieClick = async (movieId) => {
    try {
      const response = await fetch(`/api/movies/${movieId}/recommendations`);
      const data = await response.json();
      setRecommendations(data);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
    }
  };

  const handleGenreChange = async (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setIsSearchMode(false);
    await fetchMoviesFromBackend(genre, sortBy);
  };

  const handleSortChange = async (sortOption) => {
    setSortBy(sortOption);
    setCurrentPage(1);
    setIsSearchMode(false);
    await fetchMoviesFromBackend(selectedGenre, sortOption);
  };

  const fetchMoviesFromBackend = async (genre, sort) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (genre && genre !== "all") params.append("genre", genre);
      if (sort) params.append("sort_by", sort);

      const response = await fetch(`/api/movies?${params.toString()}`);
      const data = await response.json();
      console.log("🔍 Respuesta del backend:", data);

      setMovies(data);

      // ✔ Destacadas directamente desde data
      const sortedByStars = [...data].sort(
        (a, b) => b.vote_average - a.vote_average
      );
      setFeaturedMovies(sortedByStars.slice(0, 4));
    } catch (error) {
      console.error("Error al cargar las películas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPageMovies = React.useMemo(() => {
    console.log("Películas cargadas:", movies);

    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return movies.slice(start, start + MOVIES_PER_PAGE);
  }, [movies, currentPage]);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen w-full bg-pink-100 flex flex-col">
      <div className="flex-grow max-w-[1300px] mx-auto px-6 md:px-10 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-10 tracking-tight">
          🎬 Recomendador de Películas
        </h1>

        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          isLoading={isLoading}
        />

        {!isSearchMode && (
          <FeaturedMovies movies={featuredMovies} onClick={handleMovieClick} />
        )}

        {isSearchMode && (
          <div className="text-center mb-8">
            <button
              onClick={loadPopularMovies}
              className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            >
              🔄 Volver a Todas las Películas
            </button>
          </div>
        )}
        {!isSearchMode && (
          <FiltersBar
            onFilterChange={handleGenreChange}
            onSortChange={handleSortChange}
            selectedGenre={selectedGenre}
            selectedSort={sortBy}
            genres={genres}
            sortOptions={sortOptions}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* {movies
          .filter((el) =>
            el.genre_ids.some((genre) => genre == parseInt(selectedGenre))
          ) */}
          {currentPageMovies.map((movie) => (
            <MovieCard
              key={movie.tmdb_id || movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie.tmdb_id)}
            />
          ))}
        </div>

        {/* Componente de paginación */}
        {totalPages > 1 && (
          <div className="pt-12 pb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <RecommendationsModal
          show={showRecommendations}
          recommendations={recommendations}
          onClose={() => setShowRecommendations(false)}
        />
      </div>
      <AboutApp />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
