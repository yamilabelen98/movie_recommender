const RecommendationsModal = ({ show, recommendations, onClose }) => {
  if (!show) return null;

  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 ${
          hasRecommendations ? "max-w-6xl" : "max-w-md"
        } w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Películas Similares
        </h2>

        {/* Contenido */}
        {hasRecommendations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map((movie) => (
              <MovieCard key={movie.tmdb_id} movie={movie} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-gray-600 text-lg">
            😕 No se encontraron películas...
          </div>
        )}
      </div>
    </div>
  );
};
