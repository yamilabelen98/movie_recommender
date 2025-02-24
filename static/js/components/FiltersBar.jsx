const FiltersBar = ({ onFilterChange, onSortChange }) => {
  const genres = [
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
    { value: "popularity.desc", label: "Más populares" },
    { value: "popularity.asc", label: "Menos populares" },
    { value: "vote_average.desc", label: "Mejor valoradas" },
    { value: "vote_average.asc", label: "Peor valoradas" },
    { value: "release_date.desc", label: "Más recientes" },
    { value: "release_date.asc", label: "Más antiguas" },
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por género */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género
          </label>
          <select
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
