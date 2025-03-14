from flask import Blueprint, request, redirect, url_for, render_template, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.models import db, User

auth_bp = Blueprint('auth', __name__)

# Verificar sesión
@auth_bp.route('/auth/session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    username = session.get('username')
    if user_id:
        return jsonify({'logged_in': True, 'username': username})
    return jsonify({'logged_in': False})

# Registro de usuario
@auth_bp.route('/auth/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not username or not email or not password or not confirm_password:
            flash('Todos los campos son obligatorios', 'warning')
            return redirect(url_for('auth.register'))

        if len(password) < 6 or password.isalpha() or password.isdigit():
            flash('La contraseña debe tener al menos 6 caracteres y combinar letras y números', 'warning')
            return redirect(url_for('auth.register'))

        if password != confirm_password:
            flash('Las contraseñas no coinciden', 'danger')
            return redirect(url_for('auth.register'))

        existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            if existing_user.email == email:
                flash('Este correo ya está registrado.', 'danger')
            elif existing_user.username == username:
                flash('Este nombre de usuario ya existe.', 'danger')
            return redirect(url_for('auth.register'))

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash('Registro exitoso. Ahora podés iniciar sesión.', 'success')
        return redirect(url_for('auth.login'))

    return render_template('register.html')

# Login
@auth_bp.route('/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print("📩 POST recibido en /auth/login")
        email = request.form.get('email')
        password = request.form.get('password')
 
        print(f"📥 Datos login: {email} | {password}")
        user = User.query.filter_by(email=email).first()

        user = User.query.filter_by(email=email).first()

        if user:
            print(f"👤 Usuario encontrado: {user.email}")
        else:
            print("❌ Usuario NO encontrado")

        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('home'))
        else:
            flash('Email o contraseña incorrectos', 'danger')
            return redirect(url_for('auth.login'))

    return render_template('login.html')

# Logout
@auth_bp.route('/auth/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente.', 'info')
    return redirect(url_for('home'))

@auth_bp.route('/auth/check-email', methods=['POST'])
def check_email():
    email = request.json.get('email')
    if not email:
        return jsonify({'exists': False})
    existing = User.query.filter_by(email=email).first()
    return jsonify({'exists': bool(existing)})

@auth_bp.route('/auth/check-username', methods=['POST'])
def check_username():
    username = request.json.get('username')
    if not username:
        return jsonify({'exists': False})
    existing = User.query.filter_by(username=username).first()
    return jsonify({'exists': bool(existing)})

@auth_bp.route('/perfil')
def perfil():
    user_id = session.get('user_id')
    if not user_id:
        flash("Tenés que iniciar sesión para ver tu perfil", "warning")
        return redirect(url_for('auth.login'))
    user = User.query.get(user_id)
    return render_template('perfil.html', user=user)

@auth_bp.route('/auth/change-password', methods=['POST'])
def change_password():
    if 'user_id' not in session:
        flash('No estás logueado.', 'danger')
        return redirect(url_for('auth.login'))

    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')

    user = User.query.get(session['user_id'])

    if not check_password_hash(user.password_hash, current_password):
        flash('La contraseña actual es incorrecta.', 'danger')
        return redirect(url_for('perfil'))

    if new_password != confirm_password:
        flash('Las nuevas contraseñas no coinciden.', 'warning')
        return redirect(url_for('perfil'))

    user.password_hash = generate_password_hash(new_password, method='pbkdf2:sha256')
    db.session.commit()
    flash('Contraseña actualizada correctamente.', 'success')
    return redirect(url_for('perfil'))

@auth_bp.route('/auth/delete-account', methods=['POST'])
def delete_account():
    if 'user_id' not in session:
        flash('No estás logueado.', 'danger')
        return redirect(url_for('auth.login'))

    user = User.query.get(session['user_id'])
    db.session.delete(user)
    db.session.commit()
    session.clear()
    flash('Tu cuenta fue eliminada exitosamente.', 'info')
    return redirect(url_for('home'))
