from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.services.user_service import create_user, get_user_by_uid
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

    user_data = dict(user_node) if user_node else {}
    return ok(
        {
            "uid": current_user.get("uid"),
            "email": user_data.get("email") or current_user.get("email"),
            "is_admin": user_data.get("user_type") == "Admin",
        }
    )
