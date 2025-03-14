from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Movie(db.Model):
    __tablename__ = 'movies'
    
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    overview = db.Column(db.Text, nullable=True)
    poster_path = db.Column(db.String(200), nullable=True)
    vote_average = db.Column(db.Float, nullable=True, default=0)
    vote_count = db.Column(db.Integer, nullable=True, default=0)
    popularity = db.Column(db.Float, nullable=True, default=0)
    genre_ids = db.Column(db.String(100), nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        poster_path = self.poster_path
        if poster_path and not poster_path.startswith('/'):
            poster_path = f"{poster_path}"
            
        return {
            'id': self.id,
            'tmdb_id': self.tmdb_id,
            'title': self.title,
            'overview': self.overview or '',
            'poster_path': poster_path,
            'vote_average': float(self.vote_average) if self.vote_average is not None else 0,
            'vote_count': self.vote_count or 0,
            'popularity': float(self.popularity) if self.popularity is not None else 0,
            'genre_ids': [int(x) for x in self.genre_ids.split(',') if x] if self.genre_ids else [],
            'release_date': self.release_date.isoformat() if self.release_date else None
        }
