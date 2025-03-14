# delete_users.py
from database.models import db, User
from app import app

with app.app_context():
    users = User.query.all()
    for user in users:
        db.session.delete(user)
    db.session.commit()
    print(f"✅ Se eliminaron {len(users)} usuarios de la base de datos.")
