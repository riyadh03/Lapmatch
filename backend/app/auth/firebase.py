from app.core.config import FIREBASE_CREDENTIALS_PATH

_app = None


def init_firebase():
    global _app
    if _app is not None:
        return _app

    if not FIREBASE_CREDENTIALS_PATH:
        return None

    import firebase_admin
    from firebase_admin import credentials

    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    _app = firebase_admin.initialize_app(cred)
    return _app
