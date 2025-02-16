from typing import Optional
from datetime import datetime
from dataclasses import dataclass, asdict


@dataclass
class Product:
    brand: str
    productName: str
    productImgUrl: str
    productUrl: str
    currencyCode: str
    retailPrice: float
    salePrice: float
    isSale: bool
    korBrand: Optional[str] = None
    korProductName: Optional[str] = None
    productId: Optional[str] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    categorySpec: Optional[str] = None
    storeName: Optional[str] = None
    madeIn: Optional[str] = None

    def to_dict(self):
        return {k: v for k, v in asdict(self).items() if v is not None}


@dataclass
class Inference:
    productId: Optional[str] = None
    color: Optional[str] = None
