const SearchBar = ({ value, onChange, isLoading }) => (
  <div className="max-w-2xl mx-auto mb-10">
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar películas..."
        className="w-full px-4 py-3 pr-12 rounded-xl border border-pink-300 bg-pink-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm transition duration-200 cursor-text"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <svg
            className="w-5 h-5 text-pink-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <SearchIcon />
        )}
      </div>
    </div>
  </div>
);
