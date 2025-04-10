from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_seller: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    seller_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price_at_time: float

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_amount: float
    status: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True

# Cart schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: Product

    class Config:
        from_attributes = True

class CartItemUpdate(BaseModel):
    quantity: int

# Token schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user_id: int
    user_email: str
    user_name: str
    is_active: bool
    is_seller: bool

class TokenData(BaseModel):
    email: str | None = None

class RefreshToken(BaseModel):
    refresh_token: str 