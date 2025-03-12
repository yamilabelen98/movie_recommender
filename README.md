# 🎬 Recomendador de Películas - Full Stack App

Este proyecto fue desarrollado por **Yamila De Olivera** como parte de su portfolio profesional de desarrollo web Full Stack.  
Permite buscar películas, filtrarlas por género, ordenarlas por popularidad o puntuación, y obtener recomendaciones personalizadas.

---

## 📌 Características principales

✅ Buscador de películas  
✅ Filtro por género  
✅ Ordenamiento por popularidad, puntuación o fecha  
✅ Modal con detalle de cada película  
✅ Recomendaciones relacionadas  
✅ Modo claro / oscuro  
✅ Películas destacadas  
✅ Diseño responsive con estilo pastel moderno

---

## 👩‍💻 Tecnologías utilizadas

- ⚛ React  
- 🎨 TailwindCSS  
- 🐍 Python  
- 🚀 Flask / FastAPI  
- 🌐 HTML + Babel Standalone Runtime

---

## 🖼 Capturas del proyecto

| Vista Principal | Detalle de Película |
|-----------------|---------------------|
| ![Vista Principal](./screenshots/Recomendador%20de%20Peliculas.png) | ![Detalle](./screenshots/Detalle%20de%20la%20Card.png) |

| Filtros y Ordenamiento | Recomendaciones |
|------------------------|------------------|
| ![Filtros](./screenshots/Filtros.png) | ![Recomendaciones](./screenshots/Peliculas%20similares.png) |

| Buscador y Volver | Footer + Sobre la App |
|------------------|------------------------|
| ![Buscador](./screenshots/Buscador%20y%20boton%20de%20volver.png) | ![Sobre la App](./screenshots/Sobre%20la%20pagina%20y%20Footer.png) |

---

## 🚀 Cómo instalar y correr el proyecto localmente

### 1. Cloná el repositorio

```bash
git clone https://github.com/yamilabelen98/movie_recommender.git
cd movie_recommender
```
### 2. Activá un entorno virtual

```bash
python -m venv venv
# Activar entorno
# En Windows:
venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate
```
### 3. Instalá las dependencias

```bash
pip install -r requirements.txt
```
### 4. Configurá tu archivo .env

```bash
TMDB_API_KEY=tu_api_key_aqui
```
👉 Podés conseguir tu API gratuita desde: https://www.themoviedb.org/settings/api
```
### 5. Ejecutá el servidor Python

```bash
python app.py
```
### 6. Abrí el archivo index.html en tu navegador
```bash
Se encuentra en la raíz del proyecto.
No necesitás compilar nada, solo asegurate de que el backend esté corriendo.
```
📂 Estructura del proyecto

movie_recommender/
│
├── api/                  → Endpoints backend
├── static/
│   └── js/components/    → Componentes React (SearchBar, MovieCard, etc.)
├── templates/            → HTML base (si usás Jinja)
├── app.py                → Backend principal
├── requirements.txt      → Dependencias Python
├── index.html            → Página principal del frontend
└── .env                  → Configuración con API Key


📫 Contacto
💼 LinkedIn - Yamila De Olivera
🌐 Portafolio Personal
📧 Email: yami40521@gmail.com

⭐ ¿Te gustó este proyecto?
Si querés apoyar o dar visibilidad al trabajo:

⭐ Dale una estrella al repositorio
📤 Compartilo con otros desarrolladores
