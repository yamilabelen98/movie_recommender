from flask import Flask, render_template, session, jsonify, request, Response, redirect, url_for
from database.models import db, Movie, User
from datetime import datetime
import requests
from auth.routes import auth_bp
from utils.auth_guard import login_required
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.secret_key = os.getenv('SECRET_KEY', 'miclaveultrasecreta')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///movies.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp)

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        return None

@app.route('/')
@login_required
def home():
    return render_template('index.html')

@app.route('/api/proxy/image')
def proxy_image():
    image_path = request.args.get('path')
    if not image_path:
        return 'No image path provided', 400
    try:
        url = f'https://image.tmdb.org/t/p/w500/{image_path}'
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.content, mimetype=response.headers['Content-Type'])
        return 'Image not found', 404
    except Exception as e:
        return str(e), 500

@app.route('/api/movies/popular')
@login_required
def get_popular_movies():
    api_key = os.getenv('TMDB_API_KEY')
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=es-ES&page=1"
    try:
        response = requests.get(url)
        data = response.json()
        for movie_data in data.get('results', []):
            if not Movie.query.filter_by(tmdb_id=movie_data['id']).first():
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
        movies = Movie.query.order_by(Movie.vote_average.desc()).limit(200).all()
        return jsonify([m.to_dict() for m in movies])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/movies/search')
@login_required
def search_movies():
    query = request.args.get('query', '').lower()
    if not query or len(query) < 3:
        return jsonify({'error': 'Se requiere un término de búsqueda de al menos 3 caracteres'}), 400

    results = Movie.query.filter(Movie.title.ilike(f"%{query}%")).all()
    if results:
        return jsonify([m.to_dict() for m in results])

    # Si no encontró, buscar en TMDB y guardar
    api_key = os.getenv('TMDB_API_KEY')
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&language=es-ES&query={query}&page=1&include_adult=false"
    try:
        response = requests.get(url)
        data = response.json()
        for movie_data in data.get('results', []):
            if not Movie.query.filter_by(tmdb_id=movie_data['id']).first():
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
        return jsonify([m.to_dict() for m in Movie.query.filter(Movie.title.ilike(f"%{query}%")).all()])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/movies/<int:movie_id>/recommendations')
@login_required
def get_movie_recommendations(movie_id):
    try:
        movie = Movie.query.filter_by(tmdb_id=movie_id).first()
        if not movie or not movie.genre_ids:
            return jsonify([])

        target_genres = set(movie.genre_ids.split(','))
        all_movies = Movie.query.filter(Movie.tmdb_id != movie_id).all()

        recommendations = []
        for m in all_movies:
            if not m.genre_ids:
                continue
            movie_genres = set(m.genre_ids.split(','))
            matching_genres = target_genres.intersection(movie_genres)
            if matching_genres:
                recommendations.append({
                    'movie': m,
                    'match_score': len(matching_genres)
                })

        sorted_recommendations = sorted(
            recommendations,
            key=lambda x: (x['match_score'], x['movie'].vote_average, x['movie'].vote_count),
            reverse=True
        )

        top_movies = [rec['movie'].to_dict() for rec in sorted_recommendations[:6]]
        return jsonify(top_movies)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/movies')
@login_required
def get_movies():
    genre = request.args.get('genre')
    sort_by = request.args.get('sort_by', 'vote_average.desc')

    query = Movie.query

    # Filtro por género
    if genre and genre != "all":
        query = query.filter(Movie.genre_ids.like(f"%{genre}%"))

    # Ordenamiento (solo por estrellas o fecha de estreno)
    if sort_by == 'vote_average.desc':
        query = query.order_by(Movie.vote_average.desc())
    elif sort_by == 'vote_average.asc':
        query = query.order_by(Movie.vote_average.asc())
    elif sort_by == 'release_date.desc':
        query = query.order_by(Movie.release_date.desc())
    elif sort_by == 'release_date.asc':
        query = query.order_by(Movie.release_date.asc())
    else:
        query = query.order_by(Movie.vote_average.desc())  # Default por estrellas

    movies = query.all()
    return jsonify([m.to_dict() for m in movies])

if __name__ == '__main__':
    app.run(debug=True)