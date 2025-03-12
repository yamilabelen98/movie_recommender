const genres = [
  { id: "all", name: "Todos los géneros" },
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  // { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  // { id: 14, name: "Fantasía" },
  // { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  // { id: 10402, name: "Música" },
  // { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia ficción" },
  // { id: 10770, name: "Película de TV" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Bélica" },
  // { id: 37, name: "Western" },
];
const sortOptions = [
  { value: "popularity.desc", label: "Más populares" },
  { value: "popularity.asc", label: "Menos populares" },
  { value: "vote_average.desc", label: "Mejor valoradas" },
  { value: "vote_average.asc", label: "Peor valoradas" },
  { value: "release_date.desc", label: "Más recientes" },
  { value: "release_date.asc", label: "Más antiguas" },
];

function App() {
  const [movies, setMovies] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const MOVIES_PER_PAGE = 8;
  const [selectedGenre, setSelectedGenre] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("popularity.desc");
  const [featuredMovies, setFeaturedMovies] = React.useState([]);

  React.useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/movies/popular");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMovies(data);
      setFeaturedMovies(data.slice(0, 4)); // ← 4 destacadas
      setIsSearchMode(false);
      setSearchQuery("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMovies(data);
        setIsSearchMode(true);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching movies:", error);
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
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data, "La data");
      setRecommendations(data);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setIsSearchMode(false);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setCurrentPage(1);
    setIsSearchMode(false);
  };
  const filteredAndSortedMovies = React.useMemo(() => {
    const filtered = movies.filter((movie) => {
      if (selectedGenre === "all") return true;
      return movie.genre_ids.some((id) => id === Number(selectedGenre));
    });

    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity.desc":
          return b.popularity - a.popularity;
        case "popularity.asc":
          return a.popularity - b.popularity;
        case "vote_average.desc":
          return b.vote_average - a.vote_average;
        case "vote_average.asc":
          return a.vote_average - b.vote_average;
        case "release_date.desc":
          return new Date(b.release_date) - new Date(a.release_date);
        case "release_date.asc":
          return new Date(a.release_date) - new Date(b.release_date);
        default:
          return 0;
      }
    });

    return sorted;
  }, [movies, selectedGenre, sortBy]);

  // Total de páginas = longitud del array filtrado/ordenado entre el número de items por página
  const totalPages = Math.ceil(
    filteredAndSortedMovies.length / MOVIES_PER_PAGE
  );

  // Saco las películas correspondientes a la página actual
  const currentPageMovies = React.useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    return filteredAndSortedMovies.slice(startIndex, endIndex);
  }, [filteredAndSortedMovies, currentPage]);

  // Manejador de cambio de página
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
              key={movie.tmdb_id}
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
