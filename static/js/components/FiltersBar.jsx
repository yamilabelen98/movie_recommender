const FiltersBar = ({ onFilterChange, onSortChange, genres, sortOptions }) => {
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
            <option value={genres.map((el) => el.id)}>Todos los géneros</option>
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
