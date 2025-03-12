# test_api.py
import requests
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

def test_tmdb_connection():
    # Obtener API key del archivo .env
    api_key = os.getenv('TMDB_API_KEY')
    
    if not api_key:
        print("Error: No se encontró la API key en el archivo .env")
        return
    
    # URL de prueba para obtener películas populares
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=es-ES&page=1"
    
    try:
        # Realizar la petición
        response = requests.get(url)
        
        # Verificar si la petición fue exitosa
        if response.status_code == 200:
            data = response.json()
            print("\n¡Conexión exitosa! 🎉")
            print("\nPrimeras 3 películas populares:")
            for movie in data['results'][:3]:
                print(f"\nTítulo: {movie['title']}")
                print(f"Popularidad: {movie['popularity']}")
                print(f"Fecha de lanzamiento: {movie['release_date']}")
        else:
            print(f"\nError en la petición. Código de estado: {response.status_code}")
            print(f"Mensaje: {response.json().get('status_message', 'No message')}")
    
    except Exception as e:
        print(f"\nOcurrió un error: {str(e)}")

if __name__ == "__main__":
    print("\nProbando conexión con TMDB API...")
    test_tmdb_connection()