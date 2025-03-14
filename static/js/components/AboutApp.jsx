const AboutApp = () => {
  return (
    <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-sm text-gray-700 dark:text-gray-200">
      <h2 className="text-xl font-bold mb-3">📘 Sobre esta aplicación</h2>
      <p className="mb-2">
        Esta app fue creada con el fin de mejorar mis habilidades como
        desarrolladora. Ofrece una experiencia completa para explorar películas
        y practicar habilidades de desarrollo web moderno.
      </p>

      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          🔍 Búsqueda de películas con filtros por género, orden y popularidad
          (los filtros funcionan entre sí).
        </li>
        <li>
          💡 Sistema de login y logout con validaciones visuales y mensajes
          claros.
        </li>
        <li>
          👁 Opción para mostrar/ocultar contraseña al registrarse o iniciar
          sesión.
        </li>
        <li>
          👤 Sección de perfil de usuario con cambio y eliminación de cuenta.
        </li>
        <li>🔐 Acceso restringido: no se puede navegar sin iniciar sesión.</li>
        <li>
          🎞 Al hacer clic en una película, se muestran detalles completos y
          recomendaciones similares.
        </li>
        <li>
          📄 Posibilidad de regresar fácilmente al listado completo de
          películas.
        </li>
        <li>📚 Sistema de paginación para una navegación ordenada.</li>
        <li>⭐ Películas destacadas con su resumen visible.</li>
        <li>📱 Diseño responsive adaptado a todos los dispositivos.</li>
      </ul>

      <p className="mb-2">Tecnologías utilizadas:</p>
      <div className="flex flex-wrap gap-3 mt-2">
        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
          ⚛ React
        </span>
        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
          🎨 Tailwind CSS
        </span>
        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
          🐍 Python
        </span>
        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
          🚀 Flask
        </span>
        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
          🗃 SQLite
        </span>
      </div>
    </div>
  );
};
