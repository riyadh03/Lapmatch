from pydantic import BaseModel


class User(BaseModel):
    uid: str | None = None
    email: str | None = None
