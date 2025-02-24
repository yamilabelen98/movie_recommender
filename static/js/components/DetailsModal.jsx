const DetailsModal = ({ movie, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Detener la propagación de eventos al hacer clic en el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden max-w-3xl w-full"
        onClick={handleModalClick}
      >
        <div className="relative">
          {/* Header con botón de cierre */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="md:w-1/3 relative">
            <img
              src={`/api/proxy/image?path=${movie.poster_path}`}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/500x750?text=No+Image";
              }}
            />
          </div>

          {/* Contenido */}
          <div className="md:w-2/3 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {movie.title}
            </h2>

            <div className="flex items-center mb-6">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <span className="text-gray-700 text-xl ml-2">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="text-gray-500 ml-2">
                ({movie.vote_count?.toLocaleString()} votos)
              </span>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Sinopsis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {movie.overview || "Sin descripción disponible"}
              </p>
            </div>

            {/* Información adicional */}
            {movie.release_date && (
              <div className="mb-4">
                <span className="font-semibold text-gray-700">
                  Fecha de estreno:{" "}
                </span>
                <span className="text-gray-600">
                  {new Date(movie.release_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
