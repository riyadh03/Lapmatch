from fastapi import APIRouter, Depends
import os

from app.auth.dependencies import get_current_user
from app.services.user_service import create_user, get_user_by_uid, update_user_by_uid
from app.utils.helpers import ok

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/verify")
def verify():
    return ok({"verified": False})


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    user_node = get_user_by_uid(current_user["uid"])

    if not user_node:
        user_node = create_user(
            current_user["uid"],
            current_user.get("email") or "",
            user_type="User",
        )

    bootstrap_emails_raw = os.getenv("BOOTSTRAP_ADMIN_EMAILS")
    if bootstrap_emails_raw:
        bootstrap_emails = {
            e.strip().lower() for e in bootstrap_emails_raw.split(",") if e.strip()
        }
        current_email = (current_user.get("email") or "").strip().lower()
        if current_email and current_email in bootstrap_emails:
            user_node = update_user_by_uid(current_user["uid"], user_type="Admin") or user_node

    user_data = dict(user_node) if user_node else {}
    return ok(
        {
            "uid": current_user.get("uid"),
            "email": user_data.get("email") or current_user.get("email"),
            "is_admin": user_data.get("user_type") == "Admin",
        }
    )
