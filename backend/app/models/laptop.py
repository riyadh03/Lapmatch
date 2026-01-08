from pydantic import BaseModel


class Laptop(BaseModel):
    id: str | None = None
    brand: str | None = None
    model: str | None = None
