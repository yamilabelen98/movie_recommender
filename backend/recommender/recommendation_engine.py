from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict

class MovieRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='spanish',
            ngram_range=(1, 2)
        )
        self.movie_vectors = None
        self.movies = None

    def _prepare_movie_features(self, movie: Dict) -> str:
        """Prepara las características de la película para el análisis"""
        features = [
            movie['title'],
            movie['overview'],
            ' '.join(map(str, movie['genre_ids'])) if movie.get('genre_ids') else ''
        ]
        return ' '.join(filter(None, features))

    def fit(self, movies: List[Dict]):
        """Entrena el recomendador con un conjunto de películas"""
        self.movies = movies
        # Preparar los datos para el análisis
        movie_features = [self._prepare_movie_features(movie) for movie in movies]
        # Crear la matriz TF-IDF
        self.movie_vectors = self.vectorizer.fit_transform(movie_features)

    def get_recommendations(self, movie_id: int, n_recommendations: int = 6) -> List[Dict]:
        """Obtiene recomendaciones basadas en una película"""
        if not self.movie_vectors or not self.movies:
            raise ValueError("El recomendador no ha sido entrenado")

        # Encontrar el índice de la película en nuestra lista
        movie_idx = next((idx for idx, movie in enumerate(self.movies) 
                         if movie['tmdb_id'] == movie_id), None)
        
        if movie_idx is None:
            raise ValueError(f"Película con ID {movie_id} no encontrada")

        # Calcular similitudes
        movie_vector = self.movie_vectors[movie_idx]
        similarities = cosine_similarity(movie_vector, self.movie_vectors).flatten()

        # Obtener índices de las películas más similares
        similar_indices = similarities.argsort()[::-1][1:n_recommendations+1]

        # Retornar las películas recomendadas
        recommendations = [self.movies[idx] for idx in similar_indices]
        
        # Agregar el score de similitud a cada recomendación
        for idx, rec in enumerate(recommendations):
            rec['similarity_score'] = float(similarities[similar_indices[idx]])

        return recommendations