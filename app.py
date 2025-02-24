from flask import Flask, render_template, jsonify, request, Response
from database.models import db, Movie
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__, static_url_path='/static', static_folder='static')

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///movies.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
db.init_app(app)

# Crear las tablas
with app.app_context():
    db.create_all()

def parse_date(date_str):
    """Función auxiliar para parsear fechas de manera segura"""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/proxy/image')
def proxy_image():
    image_path = request.args.get('path')
    if not image_path:
        return 'No image path provided', 400
    print(image_path,"el image path")
    try:
        url = f'https://image.tmdb.org/t/p/w500/{image_path}'
        print(f"Fetching image from: {url}")
        
        response = requests.get(url)
        print(response.status_code,"Envio la imagen directamente")
        if response.status_code == 200:
            # Enviar la imagen directamente como bytes
            print("Envio la imagen directamente")
            return Response(
                response.content,
                mimetype=response.headers['Content-Type'],
                headers={
                    'Cache-Control': 'public, max-age=31536000',
                    'Content-Type': response.headers['Content-Type']
                }
            )
        
        
        print(f"Failed to fetch image. Status code: {response.status_code}")
        return 'Image not found', 404
        
    except Exception as e:
        print(f"Error proxying image: {e}")
        return str(e), 500

@app.route('/api/movies/popular')
def get_popular_movies():
    api_key = os.getenv('TMDB_API_KEY')
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=es-ES&page=1"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        # Debug: Imprimir la primera película
        if data['results']:
            first_movie = data['results'][0]
            print(f"Debug - Primera película:")
            print(f"Título: {first_movie['title']}")
            print(f"Poster path: {first_movie.get('poster_path')}")
        
        movies_list = []
        for movie_data in data['results']:
            existing_movie = Movie.query.filter_by(tmdb_id=movie_data['id']).first()
            
            if not existing_movie:
                movie = Movie(
                    tmdb_id=movie_data['id'],
                    title=movie_data['title'],
                    overview=movie_data['overview'],
                    poster_path=movie_data.get('poster_path'),
                    vote_average=movie_data['vote_average'],
                    vote_count=movie_data['vote_count'],
                    popularity=movie_data['popularity'],
                    genre_ids=','.join(map(str, movie_data['genre_ids'])),
                    release_date=parse_date(movie_data.get('release_date'))
                )
                db.session.add(movie)
                movies_list.append(movie.to_dict())
            else:
                movies_list.append(existing_movie.to_dict())
        
        db.session.commit()
        return jsonify(movies_list)
        
    except Exception as e:
        print(f"Error en get_popular_movies: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/movies/search')
def search_movies():
    query = request.args.get('query', '').lower()
    if not query or len(query) < 3:
        return jsonify({'error': 'Se requiere un término de búsqueda de al menos 3 caracteres'}), 400
    
    api_key = os.getenv('TMDB_API_KEY')
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&language=es-ES&query={query}&page=1&include_adult=false"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        movies_list = []
        for movie_data in data.get('results', []):
            if not movie_data.get('poster_path'):
                continue
                
            existing_movie = Movie.query.filter_by(tmdb_id=movie_data['id']).first()
            
            if existing_movie:
                movies_list.append(existing_movie.to_dict())
            else:
                movie = Movie(
                    tmdb_id=movie_data['id'],
                    title=movie_data['title'],
                    overview=movie_data.get('overview', ''),
                    poster_path=movie_data.get('poster_path'),
                    vote_average=movie_data.get('vote_average', 0),
                    vote_count=movie_data.get('vote_count', 0),
                    popularity=movie_data.get('popularity', 0),
                    genre_ids=','.join(map(str, movie_data.get('genre_ids', []))),
                    release_date=parse_date(movie_data.get('release_date'))
                )
                db.session.add(movie)
                movies_list.append(movie.to_dict())
        
        db.session.commit()
        return jsonify(movies_list)
    except Exception as e:
        print(f"Error en la búsqueda: {e}")
        return jsonify([])

@app.route('/api/movies/<int:movie_id>/recommendations')
def get_movie_recommendations(movie_id):
    try:
        movie = Movie.query.filter_by(tmdb_id=movie_id).first()
        if not movie:
            return jsonify([])
            
        similar_movies = Movie.query.filter(
            Movie.tmdb_id != movie_id,
            Movie.genre_ids.like(f"%{movie.genre_ids}%")
        ).order_by(
            Movie.vote_average.desc(),
            Movie.popularity.desc()
        ).limit(6).all()
        
        return jsonify([m.to_dict() for m in similar_movies])
    except Exception as e:
        print(f"Error en recomendaciones: {e}")
        return jsonify({'error': str(e)}), 500

def parse_date(date_str):
    """Función auxiliar para parsear fechas de manera segura"""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        return None

if __name__ == '__main__':
    app.run(debug=True)

# En app.py, agrega esta nueva ruta
@app.route('/api/movies')
def get_movies():
    page = request.args.get('page', 1, type=int)
    genre = request.args.get('genre')
    sort_by = request.args.get('sort_by', 'popularity.desc')
    
    api_key = os.getenv('TMDB_API_KEY')
    params = {
        'api_key': api_key,
        'language': 'es-ES',
        'page': page,
        'sort_by': sort_by
    }
    
    if genre:
        params['with_genres'] = genre
    
    url = f"https://api.themoviedb.org/3/discover/movie"
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        for movie_data in data.get('results', []):
            existing_movie = Movie.query.filter_by(tmdb_id=movie_data['id']).first()
            if not existing_movie:
                movie = Movie(
                    tmdb_id=movie_data['id'],
                    title=movie_data['title'],
                    overview=movie_data.get('overview', ''),
                    poster_path=movie_data.get('poster_path'),
                    vote_average=movie_data.get('vote_average', 0),
                    vote_count=movie_data.get('vote_count', 0),
                    popularity=movie_data.get('popularity', 0),
                    genre_ids=','.join(map(str, movie_data.get('genre_ids', []))),
                    release_date=parse_date(movie_data.get('release_date'))
                )
                db.session.add(movie)
        
        db.session.commit()
        
        return jsonify({
            'results': [movie.to_dict() for movie in Movie.query.all()],
            'page': data.get('page', 1),
            'total_pages': data.get('total_pages', 1),
            'total_results': data.get('total_results', 0)
        })
    
    except Exception as e:
        print(f"Error fetching movies: {e}")
        return jsonify({'error': str(e)}), 500
