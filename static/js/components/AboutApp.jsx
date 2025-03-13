const AboutApp = () => {
  return (
    <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-sm text-gray-700 dark:text-gray-200">
      <h2 className="text-xl font-bold mb-3">📘 Sobre esta aplicación</h2>
      <p className="mb-2">
        Esta app fue desarrollada por <strong>Yamila De Olivera</strong> como
        proyecto Full Stack. Permite buscar películas, filtrar por género,
        ordenar por popularidad o puntuación, y ver recomendaciones
        personalizadas.
      </p>
      <p>
        Tecnologías utilizadas:
        <div className="flex gap-3 mt-4">
          <span className="bg-gray-100 text-gray-700  dark:text-white px-3 py-1 rounded-full text-xs font-medium">
            ⚛ React
          </span>
          <span className="bg-gray-100 text-gray-700  dark:text-white px-3 py-1 rounded-full text-xs font-medium">
            🎨 Tailwind
          </span>
          <span className="bg-gray-100 text-gray-700  dark:text-white px-3 py-1 rounded-full text-xs font-medium">
            🐍 Python
          </span>
          <span className="bg-gray-100 text-gray-700  dark:text-white px-3 py-1 rounded-full text-xs font-medium">
            🚀 Flask / FastAPI
          </span>
        </div>
      </p>
    </div>
  );
};
