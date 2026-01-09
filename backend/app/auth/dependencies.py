from fastapi import Depends, Header, HTTPException
from typing import Optional

from app.auth.firebase import init_firebase


def get_current_user(authorization: Optional[str] = Header(default=None)):
    init_firebase()

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    return {"uid": "TODO"}
