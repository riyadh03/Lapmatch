from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.user_service import create_user_node

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

class UserCreateRequest(BaseModel):
    uid: str
    email: str
    full_name: str = None

@router.post("/create")
def create_user(user: UserCreateRequest):
    try:
        node = create_user_node(user.uid, user.email, user.full_name)
        return {"message": "User created in Neo4j", "user": dict(node)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
