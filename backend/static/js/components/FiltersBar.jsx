const FiltersBar = ({ onFilterChange, onSortChange, genres, sortOptions }) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border border-pink-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtro por género */}
        <div className="flex-1">
          <label className="block text-m font-medium text-gray-700 mb-2">
            🎭 Filtrar por género
          </label>
          <select
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-gray-300 bg-pink-50 text-gray-700 text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200"
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="flex-1">
          <label className="block text-m font-medium text-gray-700 mb-2">
            🔽 Ordenar por
          </label>
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-gray-300 bg-pink-50 text-gray-700 text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200"
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
