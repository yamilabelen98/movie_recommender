const RecommendationsModal = ({ show, recommendations, onClose }) => {
  if (!show) return null;

  // Bloquear el scroll del body cuando el modal está abierto
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
  }

  // Función para cerrar el modal y restaurar el scroll
  const handleClose = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
    }
    onClose();
  };

  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start md:items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto">
      <div
        className={`relative bg-white rounded-lg shadow-lg p-4 md:p-6 ${
          hasRecommendations ? "max-w-6xl" : "max-w-md"
        } w-full max-h-[85vh] overflow-y-auto mt-10 md:mt-0`}
      >
        {/* Botón de Cerrar - Posición fija en la parte superior para móviles */}
        <div className="sticky top-0 right-0 flex justify-end bg-white py-2 z-10">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 md:h-6 md:w-6"
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
        </div>

        {/* Título */}
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
          Películas Similares
        </h2>

        {/* Contenido */}
        {hasRecommendations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
