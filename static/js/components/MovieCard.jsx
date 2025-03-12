const MovieCard = ({ movie, onClick }) => {
  const [imageError, setImageError] = React.useState(false);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false); // Nuevo estado

  const handleShowDetails = (event) => {
    event.stopPropagation();
    setShowDetailsModal(true); // Abrimos el modal
  };
  const handleImageError = () => {
    console.log("Error cargando imagen:", movie.title);
    setImageError(true);
  };

  const imageUrl = React.useMemo(() => {
    if (!movie.poster_path) return null;
    return `/api/proxy/image?path=${movie.poster_path}`;
  }, [movie.poster_path]);

  return (
    <div
      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer flex"
      onClick={onClick}
    >
      {/* Imagen */}
      <div className="relative w-40 h-full bg-gray-100 flex-shrink-0">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className="absolute inset-0 object-cover w-full h-full"
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">No hay imagen</div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h2
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="text-xl font-semibold mb-2 text-gray-800 h-14"
          >
            {movie.title}
          </h2>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="flex items-center mb-2"
          >
            <span className="text-yellow-500">⭐</span>
            <span className="text-gray-600 ml-1">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              ({movie.vote_count} votos)
            </span>
          </div>
          <div className="text-gray-600 text-sm">
            <p
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.5em",
                maxHeight: "7.5em",
              }}
            >
              {movie.overview || "Sin descripción disponible"}
            </p>
            {movie.overview && movie.overview.length > 100 && (
              <button
                onClick={handleShowDetails}
                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-200 self-start"
              >
                Ver más detalles
              </button>
            )}
          </div>
        </div>
      </div>
      <DetailsModal
        movie={movie}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};
