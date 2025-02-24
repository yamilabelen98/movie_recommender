// function App() {
//   const [movies, setMovies] = React.useState([]);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [showRecommendations, setShowRecommendations] = React.useState(false);
//   const [recommendations, setRecommendations] = React.useState([]);
//   const [isSearchMode, setIsSearchMode] = React.useState(false);
//   // Nuevos estados para filtros y paginación
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [totalPages, setTotalPages] = React.useState(1);
//   const [selectedGenre, setSelectedGenre] = React.useState("");
//   const [sortBy, setSortBy] = React.useState("popularity.desc");

//   React.useEffect(() => {
//     if (!isSearchMode) {
//       loadFilteredMovies();
//     }
//   }, [currentPage, selectedGenre, sortBy, isSearchMode]);

//   const loadFilteredMovies = async () => {
//     try {
//       setIsLoading(true);
//       const params = new URLSearchParams({
//         page: currentPage,
//         sort_by: sortBy,
//       });

//       if (selectedGenre) {
//         params.append("genre", selectedGenre);
//       }

//       const response = await fetch(`/api/movies?${params}`);
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.json();
//       setMovies(data.results);
//       setTotalPages(data.total_pages);
//     } catch (error) {
//       console.error("Error loading filtered movies:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadPopularMovies = async () => {
//     setSelectedGenre(""); // Resetear filtros
//     setSortBy("popularity.desc");
//     setCurrentPage(1);
//     setIsSearchMode(false);
//     setSearchQuery("");
//     await loadFilteredMovies();
//   };

//   const handleSearch = async (query) => {
//     setSearchQuery(query);
//     if (query.length >= 3) {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `/api/movies/search?query=${encodeURIComponent(query)}`
//         );
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setMovies(data);
//         setIsSearchMode(true);
//       } catch (error) {
//         console.error("Error searching movies:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (query.length === 0) {
//       loadPopularMovies();
//     }
//   };

//   const handleMovieClick = async (movieId) => {
//     try {
//       const response = await fetch(`/api/movies/${movieId}/recommendations`);
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.json();
//       setRecommendations(data);
//       setShowRecommendations(true);
//     } catch (error) {
//       console.error("Error loading recommendations:", error);
//     }
//   };

//   const handleGenreChange = (genre) => {
//     setSelectedGenre(genre);
//     setCurrentPage(1);
//     setIsSearchMode(false);
//   };

//   const handleSortChange = (sortOption) => {
//     setSortBy(sortOption);
//     setCurrentPage(1);
//     setIsSearchMode(false);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo(0, 0);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
//         Recomendador de Películas
//       </h1>

//       <SearchBar
//         value={searchQuery}
//         onChange={handleSearch}
//         isLoading={isLoading}
//       />

//       {!isSearchMode && (
//         <FiltersBar
//           onFilterChange={handleGenreChange}
//           onSortChange={handleSortChange}
//           selectedGenre={selectedGenre}
//           selectedSort={sortBy}
//         />
//       )}

//       {isSearchMode && (
//         <div className="text-center mb-8">
//           <button
//             onClick={loadPopularMovies}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
//           >
//             Volver a Películas Populares
//           </button>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {movies.map((movie) => (
//             <MovieCard
//               key={movie.tmdb_id}
//               movie={movie}
//               onClick={() => handleMovieClick(movie.tmdb_id)}
//             />
//           ))}
//         </div>
//       )}

//       {!isSearchMode && movies.length > 0 && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       )}

//       <RecommendationsModal
//         show={showRecommendations}
//         recommendations={recommendations}
//         onClose={() => setShowRecommendations(false)}
//       />
//     </div>
//   );
// }

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);
function App() {
  const [movies, setMovies] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedGenre, setSelectedGenre] = React.useState("");
  const [sortBy, setSortBy] = React.useState("popularity.desc");
  console.log(movies, "las movies");
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
      setIsSearchMode(false);
      setSearchQuery("");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Recomendador de Películas
      </h1>

      <SearchBar
        value={searchQuery}
        onChange={handleSearch}
        isLoading={isLoading}
      />

      {isSearchMode && (
        <div className="text-center mb-8">
          <button
            onClick={loadPopularMovies}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Volver a Películas Populares
          </button>
        </div>
      )}
      {!isSearchMode && (
        <FiltersBar
          onFilterChange={handleGenreChange}
          onSortChange={handleSortChange}
          selectedGenre={selectedGenre}
          selectedSort={sortBy}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.filtermap((movie) => (
          <MovieCard
            key={movie.tmdb_id}
            movie={movie}
            onClick={() => handleMovieClick(movie.tmdb_id)}
          />
        ))}
      </div>

      <RecommendationsModal
        show={showRecommendations}
        recommendations={recommendations}
        onClose={() => setShowRecommendations(false)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
