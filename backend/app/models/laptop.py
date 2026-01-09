from pydantic import BaseModel
from typing import Optional


class Laptop(BaseModel):
    id: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
