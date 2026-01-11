from pydantic import BaseModel
from typing import Optional


class Laptop(BaseModel):
    id: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None


class LaptopAdmin(BaseModel):
    laptop_id: int
    name: str
    price: float
    ram_gb: int
    storage_gb: int
    cpu: str
    gpu: str
    screen_size: float
    weight: float
    rating: float
    external_link: str
    image_link: str
