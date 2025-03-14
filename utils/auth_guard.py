from functools import wraps
from flask import redirect, url_for, session, flash

def login_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        if not session.get("user_id"):
            flash("Necesitás iniciar sesión para acceder a esta sección.", "warning")
            return redirect(url_for("auth.login"))
        return view_function(*args, **kwargs)
    return wrapped_view
